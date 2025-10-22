// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

require("./db");
const express = require("express");
const app = express();
const { isAuthenticated } = require("./middleware/jwt.middleware");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const recipeRoutes = require("./routes/recipe.routes");
app.use("/api/recipes", recipeRoutes);

const planRoutes = require("./routes/plan.routes");
app.use("/api/plans", planRoutes);

const shoppingListRoutes = require("./routes/shoppinglist.routes");
app.use("/api/shoppingList", shoppingListRoutes);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
