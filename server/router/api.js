const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const fs = require('fs');
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
    if (refToken.exp - now <= 10 * 4) {
      let payload = {
        user: jwt.decode(refreshtoken, { complete: true }).user,
        exp: now + 10 * 10
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
          exp: now + 10 * 3
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

router.get('/test', (ctx) => {
  ctx.body = 'nihao'
})

module.exports = router;