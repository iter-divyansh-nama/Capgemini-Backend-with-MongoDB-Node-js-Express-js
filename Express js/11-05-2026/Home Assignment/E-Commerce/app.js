const express = require("express");
const cors = require("cors");

const app = express();
const router = require("./routes/authRoutes")
const productRouter = require("./routes/productRoutes")

app.use(cors());
app.use(express.json());
app.use("/api/auth", router)
app.use("/api/product", productRouter)
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message
    });
});
module.exports = app;