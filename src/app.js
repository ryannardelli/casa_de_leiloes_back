const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");

const publicCollectionRoutes = require("./routes/publicCollectionRoutes");

const app = express();
const handleError = require("./middlewares/handleError");

app.use(cors({
  origin: [
    "http://localhost:5173",
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/profile", profileRoutes);

app.use("/public", publicCollectionRoutes);

// Swagger
const { swaggerUi, swaggerSpec } = require("./configs/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware
app.use(handleError);

module.exports = app;