const Food = require("../models/Food");
const cloudinary = require("../cloudiary/cloudinary");
/**
 * CREATE FOOD (with image upload)
 */
exports.createFood = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "foods" },
        async (error, result) => {
          if (error) throw error;

          imageUrl = result.secure_url;

          const food = await Food.create({
            ...req.body,
            image: imageUrl,
            ingredients: JSON.parse(req.body.ingredients || "[]"),
            refluxTriggers: JSON.parse(req.body.refluxTriggers || "[]"),
            migraineTriggers: JSON.parse(req.body.migraineTriggers || "[]"),
          });

          return res.status(201).json({
            success: true,
            food,
          });
        }
      );

      result.end(req.file.buffer);
    } else {
      const food = await Food.create(req.body);

      res.status(201).json({
        success: true,
        food,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL FOODS
 */
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET SINGLE FOOD
 */
exports.getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      food,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE FOOD
 */
exports.updateFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Update image if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload_stream(
        { folder: "foods" },
        async (error, result) => {
          if (error) throw error;

          req.body.image = result.secure_url;

          food = await Food.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
          });

          return res.json({
            success: true,
            food,
          });
        }
      );

      upload.end(req.file.buffer);
    } else {
      food = await Food.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      res.json({
        success: true,
        food,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE FOOD
 */
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    await food.deleteOne();

    res.json({
      success: true,
      message: "Food deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};