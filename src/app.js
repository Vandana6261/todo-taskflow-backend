const cors = require("cors")
const express = require('express');
const app = express();
const {varifyToken} = require("./middleware/authMiddleware")

const allowOrigin = [
    "http://localhost:5173",
    "https://todo-taskflow-psi.vercel.app/"
]

app.use(
    cors({
        origin: allowOrigin,
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)
app.use(express.json());
app.use((req, res, next) => {
    // console.log(req, "req");
    console.log(req.method, "req method");
    console.log(req.url, "req url");
    next();
})

app.use('/api/todo', require('./routes/todoRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

module.exports = app;