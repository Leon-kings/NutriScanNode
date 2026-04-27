const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const upload = require("../middleware/upload");

// CREATE
router.post("/", upload.single("image"), foodController.createFood);

// READ
router.get("/", foodController.getFoods);
router.get("/:id", foodController.getFood);

// UPDATE
router.put("/:id", upload.single("image"), foodController.updateFood);

// DELETE
router.delete("/:id", foodController.deleteFood);

module.exports = router;