const express = require('express')

const morgan = require('morgan')
const db = require('./db/db.js')

// test connection
const dbContext = db
  .connect()
  .then(() => {
    console.log('[INFO] Connected to the database')
  })
  .catch(err => {
    console.error('[ERROR] Database connection error:', err)
  })

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms'
  ].join(' ')
})

const app = express()
const port = 9999

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log('Middleware 1')
  next()
})

app.get('/', (req, res) => {
  return res.status(200).json({
    ip: req.ip,
    method: req.method,
    message: 'Hello World!'
  })
})

async function countUsers () {
  try {
    const result = await db.query('SELECT COUNT(*) FROM users')
    return parseInt(result.rows[0].count)
  } catch (error) {
    console.error(error)
    throw error
  }
}

app.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit
  const search = req.query.search || ''

  try {
    // Query to get the total number of users
    const result = await db.query(
      `SELECT * FROM users WHERE LOWER(users.name) 
       LIKE LOWER($1) ORDER BY id LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    )

    // Query to get the total number of users
    const totalUsers = await countUsers()

    return res.status(200).json({
      page,
      limit,
      total: totalUsers,
      totalPage: Math.ceil(totalUsers / limit),
      prevPage: page > 1 ? page - 1 : null,
      data: result.rows
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  } finally {
  }
})

app.post('/users', async (req, res) => {
  try {
 
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        "sucsess": false,
        "message": "Fail to add user name or email required!"
      })
    }

    // find existing email

    const existingEmail = await db.query(
      `SELECT users.id FROM users WHERE users.email = $1;`,
      [email]
    )

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        "success": false,
        "message": "This email already has been used!"
      })
    }

    // insert to db

    const newUser = await db.query(
      `INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4);`,
      [name, email, "hassed_password", new Date()]
    )

    if(newUser.rows){
      return res.status(201).json({
        "success": true,
        "message": "Insert new user successsfully!"
      })
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})
app.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const search = req.query.search || ''

    const result = await db.query(
      `SELECT posts.id, posts.title,
      posts.published, users.id, users.name as author
      FROM posts
      LEFT JOIN users ON users.id = posts.user_id
      WHERE posts.published = true
      AND posts.title LIKE LOWER($1)
      ORDER BY posts.id
      LIMIT $2 OFFSET $3;
      `,
      [`%${search}%`, limit, offset]
    )

    return res.status(200).json({
      sucess: true,
      message: 'Get posts successfully',
      data: result.rows
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  } finally {
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
  console.log(`Press Ctrl+C to stop the server`)
})
