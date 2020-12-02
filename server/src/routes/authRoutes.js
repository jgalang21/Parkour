/**
 * Extracted the routes related to authentication from the user router
 */
const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

//Create and register a new user
router.post("/register", async (req, res) => {
  await authController.register(req, res);
});

//Assign the given user a sessionId to signify they are signed in
router.post("/login", async (req, res) => {
  await authController.login(req, res);
});

//Remove the given users sessionId to signify they are signed out
router.post("/logout", async (req, res) => {
  await authController.logout(req, res);
});

module.exports = router;
