const Router = require('@koa/router');
const { createConn, creatPoolConn } = require('../util/mysql.js');
const router = new Router();
const pools = creatPoolConn();

//通过连接池加快查找速度
const getFloor = async (i) => {
  return await new Promise((resolve, reject) => {
    pools.getConnection((error, connection) => {
      if (error) reject(-1);
      connection.query('select * from floor' + i, (error, result) => {
        connection.release();
        if (error) {
          reject(-1);
        }
        resolve(result);
      })
    })
  })
}

router.get('/seatinfo', async (ctx) => {
  const floors = await Promise.all([getFloor(1), getFloor(2), getFloor(3), getFloor(4), getFloor(5)]).then(
    res => res.flat()
  ).catch(
    e => e
  );
  if (floors !== -1) {
    ctx.body = floors;
  } else {
    ctx.body = -1;
  }
})

router.get('/book', async (ctx) => {
  const conn = createConn();
  ctx.body = await new Promise((resolve, reject) => {
    conn.query('select * from record', (error, result) => {
      if (error) {
        reject(-1);
      }
      conn.end();
      resolve(result);
    })
  })
})

module.exports = router;