const knex = require('knex');

const dbEngine = process.env.ENVIRONMENT || 'development';

const knexConfig = require('../knexfile');

module.exports = knex(knexConfig[dbEngine]);