import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './database/database.js';
import { errorMiddleware } from './middlewares/errorMiddlewares.js';
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import expressFileupload from "express-fileupload";
import { notifyUsers } from './services/notifyUsers.js';
import { removeUnverifiedAccounts } from './services/removeUnverifiedAccounts.js';

// Initialize app
export const app = express();

// Configurations
config({ path: "config/config.env" });




// =====================
// Security Middlewares
// =====================
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true
}));
app.use(cookieParser());

// Enhanced CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://booknest1.onrender.com'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// =====================
// Body Parsers
// =====================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// File Uploads
app.use(expressFileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}));

// =====================
// Routes
// =====================
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// =====================
// Initialize Services
// =====================
connectDB();
removeUnverifiedAccounts();
notifyUsers();

// Error Handling
app.use(errorMiddleware);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});