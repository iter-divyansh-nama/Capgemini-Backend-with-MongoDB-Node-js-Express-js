const express = require("express");
const Product = require("../models/product");

const router = express.Router();


const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
};

// Get all products
router.get("/",
    asyncHandler(async (req, res) => {
        const products = await Product.find();
        res.status(200).json(products);

    })
);

// Get product by id
router.get("/:id",
    asyncHandler(async (req, res) => {
        const id = req.params.id;
        const product = await Product.findOne({ id: id });
        res.status(200).json(product);

    })
);

module.exports = router;