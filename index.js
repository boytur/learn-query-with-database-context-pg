const express = require('express');

const app = express();
const port = 9999;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));








app.listen(port, () => { 
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Press Ctrl+C to stop the server`);
});