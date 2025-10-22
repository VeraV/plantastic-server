const router = require("express").Router();
const ShoppingListModel = require("../models/ShoppingList.model");

//total shopping list for the user dashboard (req.query.istotal = true)
router.get("/:userId", async (req, res) => {
  try {
    const shoppingList = await PlanModel.find({
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

//shopping list for particular user's meal plan
router.get("/:id", async (req, res) => {
  try {
    const thePlan = await PlanModel.findById(req.params.id).populate("recipes");
    res.status(200).json(thePlan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Failed to find a meal plan." });
  }
});

router.post("/", async (req, res) => {
  try {
    const userNewPlan = await PlanModel.create(req.body);
    res.status(201).json(userNewPlan);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Failed to create a new user's meal plan." });
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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
