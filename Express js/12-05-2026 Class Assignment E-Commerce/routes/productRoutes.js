const express = require("express")
const Product = require("../models/product")
const router = express.Router()
const { protect, authorize } = require("../middleware/authMiddleware");

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

// router.post("/", protect, authorize("admin"), async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     if(!req.body.id){
//         db.find
//     }
//     res.status(201).json({ message: "Created", product });
//   } catch (error) {
//     res.status(400).json({ message: "Product not Created" });
//   }
// });

router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const product = await Product.create({
      ...req.body,
      id: newId
    });
    res.status(201).json({
      message: "Product Created",
      product
    });
  } catch (error) {
    res.status(400).json({
      message: "Product not Created"
    });
  }
});


router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Updated", product });
  } catch (error) {
    res.status(400).json({ message: "Error" });
  }
});

router.patch("/:id", protect, authorize("admin"), async (req, res) => {
  try {

    const result = await Product.findOneAndReplace(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.status(200).json({
      message: "Replaced",
      product: result
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;