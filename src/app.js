const express = require("express");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("./configs/swagger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const auctioneerLotsRoutes = require("./routes/auctioneerLotsRoutes");
const walletRoutes = require("./routes/walletRoutes");
const bidRoutes = require("./routes/bidRoutes");

const publicCollectionRoutes = require("./routes/publicCollectionRoutes");
const publicLotsRoutes = require("./routes/publicLotsRoutes");

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
app.use("/wallet", walletRoutes);
app.use("/auctioneer", auctioneerLotsRoutes);
app.use("/bids", bidRoutes);
app.use("/public", publicCollectionRoutes);

app.use("/public-lots", publicLotsRoutes );

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(handleError);

module.exports = app;