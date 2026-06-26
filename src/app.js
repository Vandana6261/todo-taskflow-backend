import cors from "cors";
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import todoRoutes from './routes/todoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { varifyToken } from "./middleware/authMiddleware.js";

const app = express();
const allowOrigin = [
    "http://localhost:5173"
];

// origin: process.env.FRONTEND_URLS||"http://localhost:5173",
if (process.env.FRONTEND_URL) {
    const formattedUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
    if (!allowOrigin.includes(formattedUrl)) {
        allowOrigin.push(formattedUrl);
        allowOrigin.push(formattedUrl + "/");
    }
}

if (process.env.FRONTEND_CLOUDFLARE_URL) {
    const formattedUrl = process.env.FRONTEND_CLOUDFLARE_URL.replace(/\/$/, "");
    if (!allowOrigin.includes(formattedUrl)) {
        allowOrigin.push(formattedUrl);
        allowOrigin.push(formattedUrl + "/");
    }
}

app.use(helmet());
app.use(
    cors({
        origin: allowOrigin,
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
)
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, "req method");
    console.log(req.url, "req url");
    next();
})


app.use('/api/todo', todoRoutes);
app.use('/api/user', userRoutes);

export default app;