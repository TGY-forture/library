const io = require("socket.io");
const https = require('https');
const fs = require('fs');

const httpsServer = https.createServer({
  key: fs.readFileSync('../public/san_domain_com.key'),
  cert: fs.readFileSync('../public/san_domain_com.crt'),
});
const socket = io(httpsServer, {
  cors: {
    origin: ["https://10.136.21.90:8080"],
    allowedHeaders: ["Authorization", "RefreshToken"],
    credentials: true
  }
});
socket.on("connection", (socket) => {
  console.log('success');
});

httpsServer.listen(3000, '10.136.21.90', () => {
  console.log('socket listening.....');
})