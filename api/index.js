import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "../api/routes/auth.route.js";
import departmentRoutes from "../api/routes/department.route.js";
import path from "path";
import patientRoutes from "./routes/patients.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import videoRoutes from "./routes/video.route.js";
import paymentRouter from "./routes/payment.route.js";
import prescriptionRouter from "./routes/prescription.route.js";
import notificationRouter from "./routes/notification.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is connected!");
  })
  .catch((e) => {
    console.log(e);
  });

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Middleware to serve static files
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "/client/dist")));

// Routes
app.use("/mediclinic/auth", authRoutes);
app.use("/mediclinic/department", departmentRoutes);
app.use("/mediclinic/patient", patientRoutes);
app.use("/mediclinic/doctor", doctorRoutes);
app.use("/mediclinic/appointment", appointmentRoutes);
app.use("/mediclinic/video", videoRoutes);
app.use("/mediclinic/payment", paymentRouter);
app.use("/mediclinic/prescription", prescriptionRouter);
app.use("/mediclinic/notification", notificationRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middleware
app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  response.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
