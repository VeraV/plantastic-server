const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");
const ShoppingListModel = require("../models/ShoppingList.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  /********** validations ********/

  if (email === "" || password === "" || name === "") {
    res.status(400).json({ errorMessage: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ errorMessage: "Provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      errorMessage:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const foundUser = await UserModel.findOne({ email });
    if (foundUser) {
      res.status(400).json({
        errorMessage: "User already exists.",
      });
      return;
    }
    /********** validations end ********/

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    //when the User created a new Shopping List (isTotal = true) automaticaly created too
    const newShoppingList = await ShoppingListModel.create({
      userId: newUser._id,
      items: [],
      isTotal: true,
    });
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      _id: newUser._id,
      totalShoppingListId: newShoppingList._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ errorMessage: "Provide email and password." });
    return;
  }

  try {
    const foundUser = await UserModel.findOne({ email });Re

    if (!foundUser) {
      res
        .status(401)
        .json({ errorMessage: "Unable to authenticate the user." });
      return;
    }

    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordCorrect) {
      res
        .status(401)
        .json({ errorMessage: "Unable to authenticate the user." });
      return;
    }

    // Create an object that will be set as the token payload
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
    };

    // Create and sign the token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    // Send the token as the response
    res.status(200).json({ authToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

router.get("/verify", isAuthenticated, async (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
