import express from 'express';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {connectDB} from './database/database.js';   
import { errorMiddleware } from './middlewares/errorMiddlewares.js';
import authRouter from "./routes/authRouter.js"
import bookRouter from "./routes/bookRouter.js"
import borrowRouter from "./routes/borrowRouter.js"
import userRouter from "./routes/userRouter.js"
import expressFileupload from "express-fileupload"

export const app = express();

config({path: "config/config.env"});

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(expressFileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",

}))

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);
connectDB();

app.use(errorMiddleware);

