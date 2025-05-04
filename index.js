const express = require('express');

const morgan = require('morgan');

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

const app = express();
const port = 9999;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => { 
    return res.status(200).json({ 
        ip: req.ip,
        method: req.method,
        message: 'Hello World!' 
    })
})

app.listen(port, () => { 
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Press Ctrl+C to stop the server`);
});