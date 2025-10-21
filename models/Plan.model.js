const { Schema, model } = require("mongoose");

const PlanSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  totalIngredients: [String],
});

const PlanModel = model("shoppinglist", PlanSchema);
module.exports = PlanModel;
