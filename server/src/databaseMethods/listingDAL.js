const Listing = require('../models/listingModel');


const addListing = async function(data) {
    let listing = new Listing(data);
    await listing.save(listing);   
    return listing;
}


const getListingById = async function(id) {
    const listing = await Listing.findOne({_id: id});
    return listing;
}

const getListingByHostId = async function(id) {
    const listing = await Listing.findOne({hostId: id});
    return listing;
}

const updateListing = async function(listing) {
    await listing.save(listing);
    return listing;
}

const getAllListings = async function() {
    const listings = Listing.find({}); 
    return listings;
}

const getListingsNearCoordinates = async function(longitude, latitude, maxDist) {
    
    const listings = Listing.find(
        {
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude]},
                    $minDistance: 0,
                    $maxDistance: maxDist
                }
            }
        }
    )
    return listings;
}

module.exports = {
    addListing,
    getListingById,
    getListingByHostId,
    updateListing,
    getAllListings,
    getListingsNearCoordinates
}