require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/config/db.js");
const authRoutes = require("./src/routes/authRoutes.js");
const eventRoutes = require("./src/routes/eventRoutes.js");
const { notFound, errorHandler } = require("./src/middlewares/errorMiddleware.js"); 

const app = express();

// Security & utils
app.use(helmet());
app.use(morgan("dev"));


const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5000";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static serve uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) =>
  res.json({ status: "OK", message: "Event Management API" })
);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });
