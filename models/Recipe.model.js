const { default: mongoose } = require("mongoose");

const { Schema, model } = mongoose;

const RecipeSchema = new Schema({
  name: { type: String, unique: true, trim: true },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dojvyjghs/image/upload/v1761742983/tpuinv87s0iy9oa9vtbn.png",
  },
  duration: { type: Number, min: 0 },
  ingredients: [String],
  instructions: String,
});

const RecipeModel = model("Recipe", RecipeSchema);

module.exports = RecipeModel;
