const { Schema, model } = require("mongoose");

const ShoppingListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [String], default: [] },
  isTotal: { type: Boolean, default: false },
  planId: { type: Schema.Types.ObjectId, ref: "Plan" },
});

const ShoppingListModel = model("shoppinglist", ShoppingListSchema);
module.exports = ShoppingListModel;
