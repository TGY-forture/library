const io = require("socket.io");
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { createConn } = require('./mysql.js');

const httpsServer = https.createServer({
  key: fs.readFileSync('../public/san_domain_com.key'),
  cert: fs.readFileSync('../public/san_domain_com.crt'),
});
const wsServer = io(httpsServer, {
  transports: ["websocket"]
});
const student = new Map();//存储已经建立的连接
wsServer.use(async (socket, next) => {
  let { accessToken } = socket.handshake.auth;
  let { user } = jwt.verify(accessToken, fs.readFileSync('../public/san_domain_com.key'), { algorithm: 'HS256' });
  if (student.has(user)) { //如果同一浏览器开多个相同页面将不允许再次建立新的连接
    let prev = student.get(user);
    if (prev.connected) {
      prev.disconnect();//关闭之前同一用户的连接
    }
  }
  student.set(user, socket);
  next();
});

wsServer.on("connection", async (socket) => {
  console.log(socket.rooms);
  socket.on('sendmessage', (touser, mess) => {
    console.log('收到了一个消息,发送给', touser);
    let to = student.get(touser);
    if (!to || !to.connected) {
      console.log('对方并不在线');
      return;
    }
    //往数据库插入数据后发送事件到客户端
    insertMess(mess).then(() => {
      to.emit('recvmessage', mess)
    })
  });
  //某个客户端进行了座位相关的操作,通知所有其他客户端也更新座位
  socket.on('requestupdate', () => {
    wsServer.emit('update');
  });
  //连接断开事件
  socket.on('disconnect', () => {
    console.log('This scoket has been closed.')
  })
});

function insertMess(message) {
  let conn = createConn();
  return new Promise((resolve) => {
    conn.query('insert into message (send,recv,time,dis,mess) values (?,?,?,?,?)',
      [message.send, message.recv, message.time, message.dis, message.mess],
      (error) => {
        if (error) {
          resolve(-1);
          return;
        }
        conn.end();
        resolve(1);
      })
  })
}

setInterval(() => {
  wsServer.fetchSockets().then((sockets) => {
    let res = [];
    for (let socket of sockets) {
      res.push(socket.id);
    }
    if (res.length) {
      console.log(...res);
    }
  })
}, 5000);

httpsServer.listen(3000, '10.136.21.90');

module.exports = { wsServer }