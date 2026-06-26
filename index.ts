import express from 'express';
import cors from "cors"
import routes  from "./router/index.route"
import { connectDB } from './config/database.config';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';

const app = express();
const port = 4000;
// Load biến môi trường 
dotenv.config();

// Cấu hình CORS
app.use(cors({
  origin: "http://localhost:3000", // Có thể điền 1 tên miền cụ thể
  methods: ["GET", "POST", "PATCH", "DELETE"], // Các phương thức được phép
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Cho phép gửi cookie
}));
// Cho phép gửi lên dạng JSON
app.use(express.json())
// Connect database
connectDB();

// Cho phép gửi cookie
app.use(cookieParser())

app.use('/', routes);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});