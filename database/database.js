const Sequelize = require("sequelize");

const connection = new Sequelize("guiapress", "root", "cocoverde", {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
  timezone: "-03:00",
});

module.exports = connection;
