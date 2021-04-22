const Router = require('@koa/router');
const fs = require('fs');
const { readFile } = fs.promises;
const router = new Router();

const redirectHtml = fs.readFileSync('./dist/redirect.html', 'utf-8');
const typeMap = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
}

router.get('/css/:cssfile', async (ctx) => {
  let path = ctx.request.path;
  let doc = await readFile('./dist' + path, 'utf-8').then(r => r).catch(e => e)
  ctx.response.type = 'text/css';
  ctx.body = doc;
})

router.get('/js/:jsfile', async (ctx) => {
  let path = ctx.request.path;
  let doc = await readFile('./dist' + path, 'utf-8').then(r => r).catch(e => e);
  ctx.response.type = 'application/javascript';
  ctx.body = doc;
})

router.get('/img/:picture', async (ctx) => {
  let path = ctx.request.path;
  let ext = ctx.request.params.picture.split('.')[1];
  let doc = await readFile('./dist' + path).then(r => r).catch(e => e);
  if (typeMap[ext] !== undefined) {
    ctx.response.type = typeMap[ext];
  }
  ctx.body = doc;
})

router.get('/library.ico', async (ctx) => {
  let doc = await readFile('./dist/library.ico').then(r => r).catch(e => e);
  ctx.response.type = 'image/x-icon';
  ctx.body = doc;
})

router.use(
  ['/appoint', '/message', '/profile', '/seat'],
  (ctx, next) => {
    /**
     * 在此验证用户信息(要求只能通过登录页面跳转而不是在浏览器输入url访问)
     */
    next()
  }
)

router.get('/seat', (ctx) => {
  ctx.body = redirectHtml;
})

router.get('/appoint', (ctx) => {
  ctx.body = redirectHtml;
})

router.get('/profile', (ctx) => {
  ctx.body = redirectHtml;
})

router.get('/message', (ctx) => {
  ctx.body = redirectHtml;
})

module.exports = router;