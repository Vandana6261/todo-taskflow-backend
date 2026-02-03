const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/todo', require('./routes/todo.routes'));

module.exports = app;