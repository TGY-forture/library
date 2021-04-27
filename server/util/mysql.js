const { createConnection } = require('mysql');

const createConn = () => {

  connection.connect(function (err) {
    if (err) {
      throw err;
    }
  })
  return connection;
}

module.exports = createConn;