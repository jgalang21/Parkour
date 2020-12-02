const listingController = require('../controllers/listingController');
const express = require('express');
const router = express.Router();


router.get('/getListingsByLocation', async (req, res) => {
    await listingController.getListingsByLocation(req, res);
})

router.post('/addListing', async (req, res) =>{
    await listingController.newListing(req, res);
});

router.post('/addUserToListing', async (req, res) => {
    await listingController.addUserToListing(req,res);
})

router.get('/getListing/:id', async (req, res) =>{
    await listingController.getListingById(req, res);
});

router.get('/getListingByHost/:id', async (req, res) =>{
    await listingController.getListingByHost(req, res);
});

router.get('/', async (req, res) => {
    await listingController.getAllListings(req, res);
})
router.put('/editSpots', async (req, res) => {
    await listingController.editSpots(req, res);
});

module.exports = router;