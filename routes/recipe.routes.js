const router = require("express").Router();
const RecipeModel = require("../models/Recipe.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const uploader = require("../middleware/cloudinary.config");

router.get("/", async (req, res) => {
  try {
    const recipes = await RecipeModel.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Failed to find recipes." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const theRecipe = await RecipeModel.findById(req.params.id);
    res.status(200).json(theRecipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Failed to find a recipe." });
  }
});

router.post(
  "/",
  [isAuthenticated, uploader.single("imageUrl")],
  async (req, res) => {
    try {
      const newRecipe = await RecipeModel.create({
        ...req.body,
        image: req.file?.path,
      });
      res.status(201).json(newRecipe);
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: "Failed to create a new recipe." });
    }
  }
);

router.put(
  "/:id",
  [isAuthenticated, uploader.single("imageUrl")],
  async (req, res) => {
    try {
      const updatedRecipe = await RecipeModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body, image: req.file?.path },
        { new: true }
      );
      res.status(200).json(updatedRecipe);
    } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: "Failed to update the recipe." });
    }
  }
);

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedRecipe = await RecipeModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedRecipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Failed to remove the recipe." });
  }
});

module.exports = router;
