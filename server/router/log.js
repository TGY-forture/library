const Router = require('@koa/router');
const fs = require('fs')
const router = new Router();

const indexHtml = fs.readFileSync('./dist/index.html', 'utf-8');

router.get('/', (ctx) => {
  ctx.body = indexHtml;
})

router.post('/log', (ctx) => {
  ctx.body = indexHtml;
})

module.exports = router;