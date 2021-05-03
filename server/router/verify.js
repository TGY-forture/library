const sendSms = require('../util/sms.js');
const sendEmail = require('../util/email.js');
const createConn = require('../util/mysql.js')
const Router = require('@koa/router');

const codeMap = new Map(); //存储验证码
clear();

const router = new Router();
//获取验证码功能
router.get('/verify', async (ctx) => {
  const scode = ctx.cookies.get('studycode');
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
      ctx.cookies.set('studycode', ctx.query.id, {
        maxAge: 30000,
        httpOnly: true,
        sameSite: true,
        secure: true
      });
      ctx.cookies.set('cert', 'true', {
        maxAge: 30000,
        httpOnly: false,
        sameSite: true,
        secure: true
      })
    }
    ctx.body = res;
  }
  console.log(codeMap);
});
//检验验证码是否正确
router.post('/check', async (ctx) => {
  let scode = ctx.cookies.get('studycode'); //获取cookie --- 验证码存在标志
  if (scode == undefined) { //如果验证码不存在或过期,验证失败
    ctx.body = -1;
    return;
  }
  let verifyCode = codeMap.get(scode)[0];
  let body = ctx.request.body;
  if (body.code === verifyCode) {
    let conn = createConn();
    ctx.body = await new Promise((resolve, reject) => {
      let cm = body.type === 'message' ? 'phone' : 'email';
      conn.query(
        `insert into userinfo (student,pass,${cm},status,github) values (?,?,?,?,?)`,
        [body.studycode, body.pass, body.mcode, '0', '0'],
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
//更新密码时检验验证码
router.post('/cert', async (ctx) => {
  const scode = ctx.cookies.get('studycode');
  const cert = codeMap.get(scode)[0];
  const { studycode, email, newpass, certcode } = ctx.request.body;
  if (cert === certcode) { //验证成功
    let conn = createConn();
    ctx.body = await new Promise((resolve, reject) => {
      conn.query(`select email from userinfo where student=?`, studycode, (error, result) => {
        if (error) {
          reject(-1);
        }
        if (result.length > 0) {
          if (result[0].email === email) {
            resolve()
          } else {
            reject(-1)
          }
        } else {
          reject(-1)
        }
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        conn.query(`update userinfo set pass=? where student=?`, [newpass, studycode],
          (error) => {
            conn.end();
            if (error) {
              reject(-1);
            } else {
              resolve(1);
            }
          })
      })
    }).catch(e => {
      conn.end();
      return e;
    });
  } else {
    ctx.body = -1;
  }
})

/**
 * @description: 生成验证码
 */
const genCode = () => {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += ('' + Math.random())[4];
  }
  return code
}

/**
 * @description: 定时清除过期的验证码
 */
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