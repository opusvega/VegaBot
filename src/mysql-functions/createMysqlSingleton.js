let mysql = require('mysql2/promise');
let config = require("../config.js");

let pool;
module.exports = {
    getPool: function () {
      if (pool) return pool;
      pool = mysql.createPool({

        connectionLimit: 20,
        host: config.mysqlUrl,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database : config.mysqldb

      });
      return pool;
    }
};