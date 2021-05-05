const { createConnection, createPool } = require('mysql');
const { mysqlConfig, mysqlPoolConfig } = require('../util/variable.js')

const createConn = () => {
  let connection = createConnection(mysqlConfig);
  connection.connect(function (err) {
    if (err) {
      throw err;
    }
  })
  return connection;
}

const creatPoolConn = () => {
  return createPool(mysqlPoolConfig);

}

module.exports = { createConn, creatPoolConn };