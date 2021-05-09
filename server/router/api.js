const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createConn } = require('../util/mysql.js');
const router = new Router();

let secret = fs.readFileSync('../public/san_domain_com.key', 'utf-8');

router.use(async (ctx, next) => {
  let { authorization, refreshtoken } = ctx.request.headers;
  if (authorization !== undefined && refreshtoken !== undefined) {
    let refToken;
    try {
      refToken = jwt.verify(refreshtoken, secret, { algorithm: 'HS256' });//验证refreshToken
    } catch (error) {
      if (error.message === 'jwt expired') { //refreshToken过期,跳转登录页
        ctx.body = '';
        ctx.set('Location', 'https://10.136.21.90:8080/');
      };
      return;
    }
    let now = Math.floor(Date.now() / 1000); //秒数
    //如果refreshToken快要过期,刷新refreshToken
    if (refToken.exp - now <= 86400 * 4) {
      let payload = {
        user: jwt.decode(refreshtoken, { complete: true }).user,
        exp: now + 86400 * 10
      }
      let newRefToken = jwt.sign(payload, secret, { algorithm: 'HS256' });
      ctx.body = {
        refreshToken: newRefToken
      }
    }
    //检验accessToken是否过期
    let acToken = authorization.slice(7);
    try {
      jwt.verify(acToken, secret, { algorithm: 'HS256' });//验证accessToken是否过期
    } catch (error) {
      if (error.message === 'jwt expired') {
        let payload = {
          user: jwt.decode(acToken, { complete: true }).user,
          exp: now + 86400 * 3
        }
        let newAcToken = jwt.sign(payload, secret, { algorithm: 'HS256' });
        if (ctx.body !== undefined) {
          ctx.body.accessToken = newAcToken;
        } else {
          ctx.body = {
            accessToken: newAcToken
          }
        }
      }
      return;
    }
    await next();
  } else {
    ctx.status = 401;
  }
});

router.use(async (ctx, next) => {
  ctx.jwt = jwt.verify(ctx.request.headers.authorization.slice(7), secret, { algorithm: 'HS256' });
  await next();
})

//获取用户基本信息
router.get('/user', async (ctx) => {
  let studycode = ctx.jwt.user;
  let sql = 'select student,phone,email,nickname,gender,age,github,star,faculty,avatar from userinfo where student=?';
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query(sql, studycode, (error, result) => {
      if (error) { //发生错误会终止连接
        reject(-1);
      }
      resolve(result[0])
    })
  })
})
//更新头像
router.post('/avatar', async (ctx) => {
  const avatar = ctx.request.files.avatar;
  const studycode = ctx.jwt.user;
  const ext = avatar.type.split('/')[1];
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query('select avatar from userinfo where student=?', studycode, (error, result) => {
      if (error) {
        reject(-1);
      }
      if (result.length > 0) {
        const url = result[0].avatar
        if (url) {//http://tserch.xyz/avatar/dddd.png
          let name = url.slice(url.lastIndexOf('/'));
          resolve(name); //更新头像,需要先删除之前的头像
        }
        resolve(0); //插入新头像
      } else {//不存在用户
        reject(-1);
      }
    })
  }).then(r => {
    return new Promise((resolve, reject) => {
      if (r != 0) { //更新
        try {
          fs.rmSync(path.resolve('./img' + r)); //删除之前存在的图片
        } catch (e) {
          reject(-1);
        }
      }
      let hash = crypto.createHash('md5');
      hash.update(avatar.name);//根据图片名称生成哈希
      let dig = hash.digest('hex'); //只计算一次
      //写入新图片数据
      fs.writeFileSync('./img/' + dig + '.' + ext, fs.readFileSync(avatar.path));
      fs.rmSync(avatar.path);//删除临时路径的图片
      let newurl = 'https://10.136.21.90:5000/avatar/' + dig + '.' + ext;
      conn.query('update userinfo set avatar=? where student=?', [newurl, studycode], (error, result) => {
        if (error) {
          reject(-1);
        }
        conn.end();
        if (result.affectedRows > 0) {
          resolve(newurl)
        } else {
          reject(-1)
        }
      })
    })
  }).catch(e => {
    return e;
  })
})

//更新用户信息
router.post('/user', async (ctx) => {
  let student = ctx.jwt.user;
  const body = ctx.request.body;
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    let sql = 'update userinfo set student=?,nickname=?,gender=?,age=?,faculty=?,phone=?,email=? where student=?';
    let value = [student, body.nickname, body.gender, body.age, body.faculty, body.phone, body.email, student];
    conn.query(sql, value, (error, result) => {
      if (error) {
        reject(-1);
      }
      if (result.affectedRows > 0) {
        resolve(1);
      } else {
        reject(-1);
      }
    })
  })
})

/**
 * 预定座位系列请求接口
 */

//获取所有座位的预约时间
router.get('/time', async (ctx) => {
  let conn = createConn();
  let ret = await new Promise((resolve, reject) => {
    conn.query("select * from record where status='0' or status='1' or status='2'", (error, result) => {
      if (error) {
        reject([])
      }
      resolve(result);
    })
  });
  let res = new Array(4000).fill(null);//一共3988个座位,申请4000长度的数组
  ret.forEach(({ id, start, end, date, status }) => {
    if (!res[id]) {
      res[id] = {};
    }
    if (!res[id][date]) {
      res[id][date] = [[start, end, status]];
    } else {
      res[id][date].push([start, end, status]);
    }
  });
  ctx.body = res;
})

//获取某个用户的预约记录
router.get('/userseat', async (ctx) => {
  let user = ctx.jwt.user;
  let conn = createConn();
  let orders = await new Promise((resolve, reject) => {
    conn.query('select * from record where user=?', user, (error, result) => {
      if (error) {
        reject([]);
      }
      resolve(result);
    })
  });
  if (orders.length === 0) {
    ctx.body = { pendingorder: [], completeorder: [] };
  } else {
    ctx.body = {
      pendingorder: orders.filter((item) => item.status === '1' || item.status === '2'),
      completeorder: orders.filter((item) => item.status !== '1' && item.status !== '2')
    }
  }
})

//获得指定座位已经被预约的时间
router.post('/bookseat', async (ctx, next) => {
  let { id, startTime, endTime, date } = ctx.request.body;
  let conn = createConn();
  let res = await new Promise((resolve, reject) => {
    conn.query("select start,end,date from record where id=? and (status='1' or status='2')",
      id,
      (error, result) => {
        if (error) {
          reject(-1)
        }
        resolve(result);
      }
    )
  });
  if (res === -1) {
    ctx.body = -1; //内部错误
    return;
  }
  if (res.length === 0) {//不存在预约记录,前往预约
    await next();
  } else { //存在预约记录,检查是否交叉
    let response = {};
    for (let r of res) { //按日期对时间分类
      if (response[r.date]) {
        response[r.date].push([r.start, r.end]);
      } else {
        response[r.date] = [[r.start, r.end]]
      }
    }
    if (!response[date]) { //如果这个日期不存在预约,则进行下一步
      await next();
    } else {
      const parse = (ms) => {
        let t = new Date(+ms);
        return t.getHours() * 60 + t.getMinutes();
      }
      //time元素是字符串
      let isvalid = response[date].every((time) => {//判断区间合法性
        if (parse(endTime) <= parse(time[0]) || parse(time[1]) <= parse(startTime)) {
          return true;
        } else {
          return false;
        }
      })
      if (isvalid) {
        await next();
      } else {
        ctx.body = 0; //时间区段交叉
      }
    }
  }
})
//新增预约记录
router.post('/bookseat', async (ctx) => {
  let user = ctx.jwt.user;
  let body = ctx.request.body;
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query('insert into record (user,floor,id,seq,date,area,start,end,status) values (?,?,?,?,?,?,?,?,?)',
      [user, body.floor, body.id, body.seq, body.date, body.area, body.startTime, body.endTime, '1'],
      (error) => {
        if (error) {
          reject(-1);
        }
        resolve();
      }
    )
  }).then(() => {
    return new Promise((resolve, reject) => {
      //变更座位状态
      conn.query(`update ${'floor' + body.floor} set status=? where id=?`,
        ['1', body.id],
        (error, result) => {
          conn.end();
          if (error) {
            reject(-1);
          }
          if (result.affectedRows > 0) {
            //预约成功,通知更新
            resolve(1);
          } else {
            reject(-1);
          }
        })
    })
  }).catch(e => e)
})

/**
 * 查找record表中id为seatid的座位的预约信息
 * @param {*} seatid 
 * @returns -1:查找出错 0:空闲 1:有预约 2:有人正在使用
 */
async function isHavaAppoint(seatid) {
  let conn = createConn();
  return await new Promise((resolve, reject) => {//检查状态时与用户无关,只与座位id有关
    conn.query("select status from record where (status='1' or status='2') and id=?", seatid, (error, result) => {
      if (error) {
        console.log('first error');
        reject(-1);
        return;
      }
      conn.end();
      if (result.length > 0) {//状态变更后仍存在预约
        console.log('有人');
        for (let it of result) {
          if (it.status === '2') {
            console.log('有000人');
            resolve(2);
            return;
          }
        }
        console.log('有,,,,,人');
        resolve(1);
      } else {//状态变更后不存在预约
        console.log('有zzzzz人');
        resolve(0);
      }
    })
  })
}

//用户进行扫码签到,签退
router.post('/signin', async (ctx) => {
  let user = ctx.jwt.user;
  let info = ctx.request.body;
  let status = info.isin ? '2' : '3';//2代表签到，3代表签退 只能由状态1变更而来
  let prestatus = info.isin ? '1' : '2';
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    //签到和签退都应改变预约历史记录的状态
    conn.query('update record set status=? where id=? and user=? and date=? and start=? and status=?',
      [status, info.id, user, info.date, info.start, prestatus],
      (error, result) => {
        if (error) {
          console.log('inse');
          reject(-1);
          return;
        }
        if (result.affectedRows === 1) {
          resolve(); //更新成功
        } else {
          console.log(result);
          console.log('update fail');
          reject(-1);
        }
      }
    )
  }).then(() => {
    return new Promise((resolve, reject) => {
      if (info.isin) {//如果是签到,则直接更新楼层座位的当前状态
        conn.query("update floor? set status='2',user=? where id=?", [info.floor, info.user, info.id],
          (error, result) => {
            if (error) {
              console.log('e1', error);
              reject(-1);
              return;
            }
            if (result.affectedRows === 1) {
              resolve(-2);//这里的-1不代表失败,代表是签到成功不需要去检查预约记录
            } else {
              console.log('e2', 'no el');
              reject(-1);
            }
          })
      } else {//否则是签退,需要检查预约记录座位状态,从而更新楼层座位状态
        console.log('--------------签退时查找-----------------');
        resolve(isHavaAppoint(info.id));
      }
    })
  }).then((r) => {
    console.log('----------查找结束--------------', r);
    return new Promise((resolve, reject) => {
      if (r === -2) {//签到成功
        resolve(1);
        conn.end();
        return;
      }
      if (r === -1) { reject(-1); console.log('e3', 'select err'); return; }//查询失败
      /**
       * 如果是签退的话，说明当前用户正在使用,在前一步状态更新中状态已经变成3了,
       * 所以这里不会出现状态码为2的情况,可以直接判断0与1两种情况
       */
      let nsta = r === 0 ? '0' : '1';//根据是否存在预约设置座位状态
      conn.query("update floor? set status=?,user=? where id=?", [info.floor, nsta, null, info.id],
        (error, result) => {
          if (error) {
            console.log('e4', error);
            reject(-1);
            return;
          }
          conn.end();
          if (result.affectedRows === 1) {
            console.log('+++++++++++++++++++++++++++++++');
            resolve(1); //更新楼层座位状态成功
          } else { //失败
            console.log('e5', 'fail');
            reject(-1);
          }
        })
    })
  }).catch((e) => {
    return e;
  })
})

//用户取消预约
router.post('/cancel', async (ctx) => {
  let user = ctx.jwt.user;
  let info = ctx.request.body;
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query("update record set status='4' where user=? and id=? and date=? and start=? and status='1'",
      [user, info.id, info.date, info.start],
      (error, result) => {
        if (error) {
          reject(-1);
          return;
        }
        if (result.affectedRows === 1) {
          resolve();
        } else {
          reject(-1);
        }
      })
  }).then(() => {
    return isHavaAppoint(info.id);
  }).then(r => {
    if (r === -1) {
      conn.end();
      return -1;
    }
    /**
     * 用户取消预约时由步骤决定了用户处于未签到的状态,此时的座位状态必然为 0 或 1 或 2
     * 根据上一个promise的个返回值决定更新座位状态
     */
    let newstatus = r === 0 ? '0' : (r === 1 ? '1' : '2');//根据是否存在预约设置座位状态
    return new Promise((resolve, reject) => {
      conn.query("update floor? set status=? where id=?", [info.floor, newstatus, info.id], (error, result) => {
        if (error) {
          reject(-1);
          return;
        }
        conn.end();
        if (result.affectedRows === 1) {
          resolve(1);
        } else {
          reject(-1);
        }
      })
    })
  }).catch(e => e)
})

module.exports = router;