/**
 * 处理超时违约以及超时自动签退问题
 */

const { wsServer } = require('../util/socket.js');
const { createConn } = require('./mysql.js');
const { isHavaAppoint } = require('../router/api.js');

async function fetch() {
  let conn = createConn();
  let date = new Date().toISOString().slice(0, 10);
  let pending = await new Promise((resolve) => {
    conn.query("select floor,id,start,end,date,user,status from record where (status='1' or status='2') and date=?",
      date,
      (error, result) => {
        if (error) {
          resolve(-1);
          return;
        }
        conn.end();
        resolve(result);
      })
  });
  if (pending === -1) return;
  let list = process(pending);
  query(list);
}

function process(lists) {
  let now = Number((Date.now() + '').slice(-1, -9));
  let needUpdate = [];
  for (let item of lists) {
    if (item.status === '1') {//如果是预约的记录
      if (Number(item.start.slice(-1, -9)) + 300000 < now) {
        needUpdate.push({ isbook: true, info: [item.floor, item.id, item.start, item.user] })
      }
    } else {//否则是签到的记录
      if (Number(item.end.slice(-1, -9)) < now) {
        needUpdate.push({ isbook: false, info: [item.floor, item.id, item.start, item.user] })
      }
    }
  }
  return needUpdate;
}

async function query(needUpdate) {
  let conn = createConn();
  let run = false;
  for (let item of needUpdate) {
    run = true;
    let setsta = item.isbook ? '5' : '3'; //5代表违约,3代表超时系统自动签退(用户也可手动签退)
    let r = await new Promise((resolve, reject) => {
      conn.query("update record set status=? where floor=? and id=? and start=? and user=?", [setsta, ...item.info], (error) => {
        if (error) {
          reject(-1);
          return;
        }
        resolve();//查询时可能会出现不匹配记录,但不影响,说明该记录已经被用户手动改变了
      })
    }).then(() => {
      return isHavaAppoint(item.info.id);//查找剩余记录确定该将座位重置为什么状态
    }).then(ret => {
      if (ret === -1) { //查询失败
        return -1;
      }
      let status;
      if (ret === 0) {
        status = '0';
      } else if (ret === 1) {
        status = '1';
      } else {//按逻辑不会出现ret=2的情况,不过写一个逻辑没啥影响,代表成功
        return 1;
      }
      return new Promise((resolve, reject) => {//更新楼层的座位状态
        conn.query("update floor? set status=?,user=? where id=?", [item.info.floor, status, null, item.info.id], (error) => {
          if (error) {
            reject(-1);
            return;
          }
          resolve(1);//也会出现和 55 行的情况
        })
      })
    }).catch(e => e);
    if (r === -1) { //如果任意一个操作失败了就停止循环的执行
      return;
    }
  }
  conn.end();//关闭mysql连接
  if (run) {//如果存在超时任务才广播
    wsServer.emit('update');//socket广播所有客户端重新获取数据进行展示
  }
}

const loop = () => {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    fetch();
    loop();
  }, 10000);
}

loop();