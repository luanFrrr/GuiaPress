const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define("users", {
  // Correção aqui
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
