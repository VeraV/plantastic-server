const { default: mongoose } = require("mongoose");

const { Schema, model } = mongoose;

const RecipeSchema = new Schema({
  name: { type: String, unique: true, trim: true },
  image: String,
  duration: { type: Number, min: 0 },
  ingredients: [String],
  instructions: String,
});

const RecipeModel = model("Recipe", RecipeSchema);

module.exports = RecipeModel;
