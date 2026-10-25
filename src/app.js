const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const lotRoutes = require("./routes/lotRoutes");
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

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/profile", profileRoutes);

app.use("/", lotRoutes);
app.use("/public", publicCollectionRoutes);

const { swaggerUi, swaggerSpec } = require("./configs/swagger");

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(handleError);

module.exports = app;