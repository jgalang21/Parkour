/**
 * Extracted the stripe related routes from the user routes
 */
const stripeController = require('../controllers/stripeController');
const express = require('express');

const router = express.Router();

//Get the stripeId from the current user
router.get('/', async (req, res) => {
  await stripeController.getStripeBySess(req, res);
});

router.get('/getCards', async (req, res) => {
  await stripeController.getCards(req, res);
});

//Add a stripeId to the user that is currently logged in
router.post('/addId', async (req, res) => {
  await stripeController.addStripeId(req, res);
});

router.post('/addCard', async (req, res) => {
  await stripeController.addStripeCard(req, res);
});

router.post('/createCustomer', async (req, res) => {
  await stripeController.addCustomer(req, res);
});

router.put('/updateCard', async (req, res) => {
  await stripeController.updateDefaultCard(req, res);
});

router.delete('/removeCard/:cid', async (req, res) => {
  await stripeController.removeCard(req, res);
});

router.get('/getCustomer', async (req, res) => {
  await stripeController.getCustomer(req, res);
});

//Update the stripeId of the user that is currently logged in
router.put('/update', async (req, res) => {
  await stripeController.updateStripeId(req, res);
});

//Delete the stripeId of the user that is currently logged in
router.delete('/remove', async (req, res) => {
  await stripeController.removeStripeId(req, res);
});

module.exports = router;
