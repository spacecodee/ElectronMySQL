const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "scodee",
  password: "spacecodee",
  database: "dbproduct",
  charset: "utf8",
  port: 3306,
  timezone: "utc",
  ssl: false,
});

function getConnection() {
  return connection;
}

module.exports = { getConnection };
