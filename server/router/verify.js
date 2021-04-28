const sendSms = require('../util/sms.js');
const sendEmail = require('../util/email.js');
const createConn = require('../util/mysql.js')
const Router = require('@koa/router');

const codeMap = new Map(); //存储验证码
clear();

const router = new Router();

router.get('/verify', async (ctx) => {
  const scode = ctx.cookies.get('studyCode');
  if (!!scode) { //如果cookie中存在student字段，则验证码未过期
    ctx.body = 0;  //0代表已经申请过验证码
  } else {//否则申请验证码
    let type = ctx.query.type;
    let code = genCode();
    let res;
    if (type === 'email') {//邮箱方式
      // res = await sendEmail(ctx.query.user, code);
      res = 1;
    } else if (type === 'message') {//电话方式
      // res = await sendSms(ctx.query.user, code);
      res = 1;
    } else {
      ctx.status = 404;
      return;
    }
    if (res === 1) { //验证码发送成功
      codeMap.set(ctx.query.id, [code, Date.now()]);
      ctx.cookies.set('studyCode', ctx.query.id, {
        maxAge: 30000,
        httpOnly: true,
        sameSite: true,
        secure: true
      })
    }
    ctx.body = res;
  }
  console.log(codeMap);
});

router.post('/check', async (ctx) => {
  let scode = ctx.cookies.get('studyCode'); //获取cookie
  let verifyCode = codeMap.get(scode)[0];
  let body = ctx.request.body;
  if (body.code === verifyCode) {
    let conn = createConn();
    ctx.body = await new Promise((resolve, reject) => {
      let cm = body.type === 'message' ? 'phone' : 'email';
      conn.query(
        `insert into userinfo (student,pass,${cm},status) values (?,?,?,?)`,
        [body.studycode, body.pass, body.mcode, '0'],
        (error) => {
          conn.end();
          if (error) {
            reject(-1);
          } else {
            resolve(1)
          }
        }
      );
    }).then(r => r).catch(() => -1)
  } else {
    ctx.body = -1;
  }
})

const genCode = () => {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += ('' + Math.random())[4];
  }
  return code
}

function clear() { //每隔五分钟检查验证码，清除无用的验证码信息
  let timer = setTimeout(() => {
    clearTimeout(timer);
    let now = Date.now();
    codeMap.forEach((val, key) => {
      if (now - val[1] >= 30000) {
        codeMap.delete(key);
      }
    });
    clear();
  }, 30000);
}

module.exports = router;