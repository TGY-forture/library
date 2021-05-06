const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createConn } = require('../util/mysql.js');
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
    if (refToken.exp - now <= 86400 * 4) {
      let payload = {
        user: jwt.decode(refreshtoken, { complete: true }).user,
        exp: now + 86400 * 10
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
          exp: now + 86400 * 3
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

router.use(async (ctx, next) => {
  ctx.jwt = jwt.verify(ctx.request.headers.authorization.slice(7), secret, { algorithm: 'HS256' });
  await next();
})
//获取用户基本信息
router.get('/user', async (ctx) => {
  let studycode = ctx.jwt.user;
  let sql = 'select student,phone,email,nickname,gender,age,github,star,faculty,avatar from userinfo where student=?';
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query(sql, studycode, (error, result) => {
      if (error) {
        reject(-1);
      }
      resolve(result[0])
    })
  })
})
//更新头像
router.post('/avatar', async (ctx) => {
  const avatar = ctx.request.files.avatar;
  const studycode = ctx.jwt.user;
  const ext = avatar.type.split('/')[1];
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query('select avatar from userinfo where student=?', studycode, (error, result) => {
      if (error) {
        reject(-1);
      }
      if (result.length > 0) {
        const url = result[0].avatar
        if (url) {//http://tserch.xyz/avatar/dddd.png
          let name = url.slice(url.lastIndexOf('/'));
          resolve(name); //更新头像,需要先删除之前的头像
        }
        resolve(0); //插入新头像
      } else {//不存在用户
        reject(-1);
      }
    })
  }).then(r => {
    return new Promise((resolve, reject) => {
      if (r != 0) { //更新
        try {
          fs.rmSync(path.resolve('./img' + r)); //删除之前存在的图片
        } catch (e) {
          reject(-1);
        }
      }
      let hash = crypto.createHash('md5');
      hash.update(avatar.name);//根据图片名称生成哈希
      let dig = hash.digest('hex'); //只计算一次
      //写入新图片数据
      fs.writeFileSync('./img/' + dig + '.' + ext, fs.readFileSync(avatar.path));
      fs.rmSync(avatar.path);//删除临时路径的图片
      let newurl = 'https://10.136.21.90:5000/avatar/' + dig + '.' + ext;
      conn.query('update userinfo set avatar=? where student=?', [newurl, studycode], (error, result) => {
        if (error) {
          reject(-1);
        }
        conn.end();
        if (result.affectedRows > 0) {
          resolve(newurl)
        } else {
          reject(-1)
        }
      })
    })
  }).catch(e => {
    return e;
  })
})

//更新用户信息
router.post('/user', async (ctx) => {
  let student = ctx.jwt.user;
  const body = ctx.request.body;
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    let sql = 'update userinfo set student=?,nickname=?,gender=?,age=?,faculty=?,phone=?,email=? where student=?';
    let value = [student, body.nickname, body.gender, body.age, body.faculty, body.phone, body.email, student];
    conn.query(sql, value, (error, result) => {
      if (error) {
        reject(-1);
      }
      if (result.affectedRows > 0) {
        resolve(1);
      } else {
        reject(-1);
      }
    })
  })
})

/**
 * 预定座位系列请求接口
 */
router.post('/bookseat', async (ctx) => {
  let user = ctx.jwt.user;
  ctx.body = ctx.request.body;
})

module.exports = router;