const { createConnection } = require('mysql');

const createConn = () => {
  let connection = createConnection({
    host: 'rm-2zeim991vtb92p54wao.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'tgy',
    password: 'tgy12345',
    database: 'library',
    multipleStatements: true
  })
  connection.connect(function (err) {
    if (err) {
      throw err;
    }
  })
  return connection;
}

module.exports = createConn;