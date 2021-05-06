require('./util/socket.js');
const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');

const log = require('./router/log.js');
const pageroute = require('./router/pageroute.js');
const verify = require('./router/verify.js');
const api = require('./router/api.js');
const seat = require('./router/seat.js');

let options = {
  key: fs.readFileSync('../public/san_domain_com.key'),
  cert: fs.readFileSync('../public/san_domain_com.crt'),
}
let app = new Koa();
app.use(logger());
app.use(koaBody({ multipart: true }));
app.use(async (ctx, next) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': 'https://10.136.21.90:8080',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Expose-Headers': 'Location',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS,DELETE,PATCH,TRANCE,HEAD,CONNECT',
    "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,RefreshToken,X-Requested-With"
  })
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
  } else {
    await next();
  }
});
app.use(pageroute.routes()).use(log.routes()).use(verify.routes()).use(api.routes());
app.use(seat.routes());

https.createServer(options, app.callback()).listen(5000, '10.136.21.90', () => {
  console.log('socket listening.....');
});
