const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    ingredients: [String],
    description: String,
    prepTime: Number,
    category: String,

    image: String, // Cloudinary URL

    nutritionalInfo: Object,

    purineLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "low",
    },

    containsGluten: Boolean,
    containsPeanuts: Boolean,
    containsShellfish: Boolean,
    containsDairy: Boolean,

    refluxTriggers: [String],
    migraineTriggers: [String],

    highSalt: Boolean,
    sodiumMg: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);