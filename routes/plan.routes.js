const router = require("express").Router();
const PlanModel = require("../models/Plan.model");
const ShoppingListModel = require("../models/ShoppingList.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const userPlans = await PlanModel.find({
      userId: req.params.userId,
    }).select("name recipes");
    const userPlansFormated = userPlans.map((onePlan) => {
      return {
        _id: onePlan._id,
        name: onePlan.name,
        recipesNumber: onePlan.recipes.length,
      };
    });

    res.status(200).json(userPlansFormated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Failed to find user's meal plans." });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const thePlan = await PlanModel.findById(req.params.id).populate("recipes");
    res.status(200).json(thePlan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Failed to find a meal plan." });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userNewPlan = await PlanModel.create(req.body);
    //when a Plan created, a new Shopping List (isTotal = false) automaticaly created too and connectes to the Plan
    const newShoppingList = await ShoppingListModel.create({
      userId: userNewPlan.userId,
      items: [],
      planId: userNewPlan._id,
    });
    res.status(201).json({
      name: userNewPlan.name,
      userId: userNewPlan.userId,
      recipes: [],
      totalIngredients: [],
      shoppingListId: newShoppingList._id,
    });

    //res.status(201).json(userNewPlan);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Failed to create a new user's meal plan." });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedPlan = await PlanModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Failed to update the user's meal plan." });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedUserPlan = await PlanModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedUserPlan);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Failed to delete a user's meal plan." });
  }
});

module.exports = router;
