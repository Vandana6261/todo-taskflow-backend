const cors = require("cors")
const express = require('express');
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173"
    })
)
app.use(express.json());

app.use('/api/todo', require('./routes/todo.routes'));

module.exports = app;