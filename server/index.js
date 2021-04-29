const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');

const log = require('./router/log.js');
const pageroute = require('./router/pageroute.js');
const verify = require('./router/verify.js');

let options = {
  key: fs.readFileSync('../public/san_domain_com.key'),
  cert: fs.readFileSync('../public/san_domain_com.crt'),
}
let app = new Koa();
app.use(logger());
app.use(koaBody());
app.use(async (ctx, next) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': 'https://10.136.21.90:8080',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS,DELETE,PATCH,TRANCE,HEAD,CONNECT',
    "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  })
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
  } else {
    await next();
  }
});
app.use(pageroute.routes()).use(log.routes()).use(verify.routes());

https.createServer(options, app.callback()).listen(5000, '10.136.21.90')