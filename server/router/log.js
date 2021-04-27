const Router = require('@koa/router');
const fs = require('fs');
const { resolve } = require('path');
const router = new Router();
const createConn = require('../util/mysql.js')

const indexHtml = fs.readFileSync('./dist/index.html', 'utf-8');

router.get('/', (ctx) => {
  ctx.body = indexHtml;
})

router.post('/log', (ctx) => {
  ctx.body = indexHtml;
})

router.post('/sign', async (ctx) => {
  let body = ctx.request.body;
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    //查找该学号是否被注册
    conn.query('select student,status from userinfo where student=?', body.studycode, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  }).then((result) => {
    return new Promise((resolve, reject) => {
      if (result.length === 0) { //用户没有注册
        let concatMethod = /^\d{12}$/g.test(body.mcode) ? 'phone' : 'email';
        conn.query(
          `insert into userinfo (student,pass,${concatMethod},status) values (?,?,?,?)`,
          [body.studycode, body.pass, body.mcode, '0'],
          (error) => {
            conn.end();
            if (error) {
              reject(error);
            } else {
              resolve('sign');
            }
          }
        )
      } else {//用户已经注册，检查注册状态: 0代表未填写基本信息,1代表注册完全
        if (result[0].status === '0') {
          resolve('half');
        } else {
          resolve('complete')
        }
      }
    })
  }).then((res) => {
    return res;
  }).catch((e) => {
    conn.end();
    return e;
  })
})

module.exports = router;