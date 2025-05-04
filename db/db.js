const { Pool } = require('pg')


const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 3432 
})

module.exports = pool
