const io = require("socket.io");
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');

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
  if (student.has(user)) { //如果同意浏览器开多个相同页面将不允许再次建立新的连接
    socket.disconnect(); //关闭重复的连接
  } else {
    student.set(user, socket.id);
    next();
  }
});

wsServer.on("connection", async (socket) => {
  //预定座位事件
  socket.on('book', () => {

  });
  //签到事件
  socket.on('signin', () => {

  })
  //签退事件
  socket.on('signout', () => {

  })
  //取消事件
  socket.on('cancel', () => {

  })
  //违约事件
  socket.on('violation', () => {

  })
});

httpsServer.listen(3000, '10.136.21.90')