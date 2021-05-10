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
  socket.on('disconnect', () => {
    console.log('This scoket has been closed.')
  })
});

setInterval(() => {
  wsServer.fetchSockets().then((sockets) => {
    let res = [];
    for (let socket of sockets) {
      res.push(socket.id);
    }
    console.log(...res);

  })
}, 5000);

httpsServer.listen(3000, '10.136.21.90');