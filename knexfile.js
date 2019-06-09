require("dotenv").config();
const pg = require("pg");
pg.defaults.ssl = true;


const dbSettings = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: "./migrations",
    tableName: "dbmigrations"
  },
  seeds: {
    directory: "./seeds"
  }
};

module.exports = {
  production: dbSettings,
  testing: {
    client: "sqlite3",
    connection: {
      filename: "./database/test.db3"
    },
    useNullAsDefault: true,

    migrations: {
      directory: "./migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};
