const router = require("express").Router();
const ShoppingListModel = require("../models/ShoppingList.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//total shopping list for the user dashboard (req.query.istotal = true)
router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const shoppingList = await ShoppingListModel.findOne({
      userId: req.params.userId,
      isTotal: true,
    }).select("items");
    res.status(200).json(shoppingList);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Failed to find user's Total Shopping List." });
  }
});

//shopping list for particular user's meal plan
router.get("/plan/:planId", isAuthenticated, async (req, res) => {
  try {
    const shoppingList = await ShoppingListModel.findOne({
      planId: req.params.planId,
      isTotal: false,
    }).select("items");
    res.status(200).json(shoppingList);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Failed to find a meal plan's shopping list." });
  }
});

//update only items
router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedShoppingList = await ShoppingListModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedShoppingList);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Failed to update the shopping list." });
  }
});

module.exports = router;
