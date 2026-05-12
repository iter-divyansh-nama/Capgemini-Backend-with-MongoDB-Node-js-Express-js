const express = require("express")
const Product = require("../models/product")
const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findOne({id:id});

        res.status(200).json(product);
    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;