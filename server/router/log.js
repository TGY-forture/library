const Router = require('@koa/router');
const fs = require('fs');
const qs = require('querystring');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = new Router();
const createConn = require('../util/mysql.js');

const indexHtml = fs.readFileSync('./dist/index.html', 'utf-8');
let secret = fs.readFileSync('../public/san_domain_com.key', 'utf-8');

router.get('/', (ctx) => {
  ctx.body = indexHtml;
})

router.get('/avatar/:pic', (ctx) => {
  let avatar;
  let ext = ctx.params.pic.split('.')[1]
  try {
    avatar = fs.readFileSync('./img/' + ctx.params.pic);
  } catch {
    ctx.body = 404;
    return;
  }
  ctx.type = '.' + ext;
  ctx.body = avatar;
})

router.post('/log', async (ctx) => { //同一设备登录,暂不支持单点登录
  let body = ctx.request.body;
  let { authorization } = ctx.headers;
  const log = async () => {
    let conn = createConn();
    ctx.body = await new Promise((resolve, reject) => {
      conn.query('select pass,status from userinfo where student=?', body.user,
        (error, result) => {
          if (error) {
            reject(-1);
          } else {
            if (result.length > 0) { //用户已注册
              let res = result[0];
              if (res.status === '0') {
                resolve(0)
              } else if (res.status === '1' && body.pass === res.pass) {
                resolve(1) //登录成功
              } else {
                resolve(2)//用户名或密码错误
              }
            } else { //用户未注册
              resolve(0)
            }
          }
        })
    });
  }
  if (authorization) {
    try {
      jwt.verify(authorization.slice(7), secret, { algorithm: 'HS256' })
    } catch (error) { //过期或被篡改重新登录
      await log()
      return;
    }
    ctx.body = 3;//token未过期
  } else {
    await log();
  }
})

router.post('/token', (ctx) => { //登录获取 token
  let user = ctx.request.body.user;
  let accessToken = genToken(user, 3);
  let refreshToken = genToken(user, 10)
  ctx.body = {
    accessToken,
    refreshToken
  };
  function genToken(user, exp) {
    let token = jwt.sign({
      user,
      exp: Math.floor(Date.now() / 1000) + 86400 * exp
    }, secret, { algorithm: 'HS256' });
    return token
  }
})
//用户提交账号密码进行注册
router.post('/sign', async (ctx) => {
  let body = ctx.request.body;
  let conn = createConn();
  //0:刚注册  1:完全注册
  ctx.body = await new Promise((resolve, reject) => {
    //查找该学号是否被注册
    conn.query('select student,status,github from userinfo where student=?', body.studycode, (error, result) => {
      conn.end();
      if (error) {
        reject(-1);
      } else {
        resolve(result); //得到结果
      }
    });
  }).then((result) => {
    return new Promise((resolve, reject) => {
      if (result.length === 0) { //用户没有注册
        resolve(0)
      } else {//用户已经注册，检查注册状态status: 0代表未填写基本信息,1代表注册完全
        if (result[0].status === '0') {
          resolve(1);
        } else {
          result[0].github === '0' ? resolve(2) : resolve(3)
        }
      }
    })
  }).then((res) => {
    return res;
  }).catch((e) => {
    return e;
  })
})
//保存用户基本信息
router.put('/sign', async (ctx) => {
  let profile = ctx.request.body;
  let conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query('select student from userinfo where student=?', profile.studycode, (error, result) => {
      if (error) {
        reject(-1);
      }
      if (result.length > 0) {//找到了相同学号的用户
        if (profile.github === 1) {//通过github认证时发现存在学号相同的用户
          reject(-1); //github注册失败
        } else {
          resolve(1); //存在通过正常注册的用户,前往更新信息
        }
      } else {//没有该学号的学生
        if (profile.github === 1) {//通过github认证时不存在用户
          resolve(0); //更新之前注册的github用户信息
        } else {
          reject(-1);//不存在通过正常注册的用户
        }
      }
    })
  }).then((r) => {
    return new Promise((resolve, reject) => {
      let sql = 'update userinfo set nickname=?,gender=?,age=?,faculty=?,phone=?,student=?,email=?,status=? where ' + (r === 1 ? 'student=?' : 'email=?');
      let value = r === 1 ? profile.studycode : profile.email;
      conn.query(sql, [profile.nickname, profile.gender, profile.age, profile.faculty, profile.phone, profile.studycode, profile.email, '1', value],
        (error, result) => {
          conn.end();
          if (error || result.affectedRows === 0) {
            reject(-1);
          } else {
            resolve(1);
          }
        }
      )
    })
  }).catch(e => {
    // conn.end()
    return e
  })
})
//github认证回调地址
router.get('/github', async (ctx) => {
  const { code, error } = ctx.query;
  if (error) {
    ctx.status = 302;
    ctx.set('Location', 'https://10.136.21.90:5000');
    return;
  }
  if (code) { //github同意授权
    let data = {
      client_id: '8844a87df44b4fd63eb6',
      client_secret: 'xxxx',
      code
    };
    //请求token
    let ret = await axios.post('https://github.com/login/oauth/access_token', data).then(res => {
      const { access_token: accessToken } = qs.decode(res.data);
      return accessToken
    }).then((token) => {
      axios.defaults.headers.common['Authorization'] = 'token ' + token;
      axios.defaults.headers.common['User-Agent'] = 'library';
      return axios.get('https://api.github.com/user?access_token=' + token)
    }).then(async ({ data }) => {
      let { avatar_url, login, email } = data;
      let conn = createConn();
      return await new Promise((resolve, reject) => {
        conn.query(`select github,nickname,status from userinfo where nickname=?`, login, (error, result) => {
          if (error) {
            console.log('select err');
            reject(-1);
          }
          if (result.length > 0) {
            for (let res of result) {
              if (res.github === '1') resolve(res);//存在相同github昵称,即已注册
            }
            resolve(0);//没有相同github昵称
          } else {
            resolve(0);
          }
        })
      }).then((r) => {
        return new Promise((resolve, reject) => {
          if (r === 0) {
            conn.query(`insert into userinfo (nickname,email,avatar,status,github) values (?,?,?,?,?)`,
              [login, email, avatar_url, '1', '1'],
              (error) => {
                conn.end();
                if (error) {
                  console.log('insert err');
                  reject(-1);
                }
                resolve(0);
              }
            )
          } else {
            if (r.status === '0') {
              resolve(0);//只填写了基本信息
            } else {
              resolve(1);//完全注册了
            }
          }
        })
      }).catch(() => -1)
    }).catch(() => {//遇到错误,github可能出现网络超时
      console.log('timeout err');
      return -1;
    });
    ctx.status = 302;
    ctx.set('Location', `https://10.136.21.90:8080/?status=${ret}`);
  } else {
    ctx.body = 404;
  }
})

module.exports = router;
