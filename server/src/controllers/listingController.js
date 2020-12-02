const UtilMethods = require('../util/UtilMethods');
const authUtils = require('../util/authUtils');
const listingDAL = require('../databaseMethods/listingDAL');
const userDAL = require('../databaseMethods/userDAL');

module.exports.getAllListings = async function (req, res) {
  try {
    const listings = await listingDAL.getAllListings();
    res.status(200).json({
      message: 'Listings fetched successfully',
      data: listings
    });
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.addUserToListing = async function (req, res) {
  try {
    if (!req.headers.sessionid) {
      res.status(400).json({
        message: 'No sessionId given'
      });
      return;
    }
    if (!req.body.listingId) {
      res.status(400).json({
        message: 'No listing ID given'
      });
      return;
    }
    const user = await userDAL.getUserByUUID(req.headers.sessionid);
    if (!user) {
      res.status(400).json({
        message: 'Could not find user with session id: ' + req.headers.sessionid
      });
      return;
    }
    let listing = await listingDAL.getListingById(req.body.listingId);
    if (!listing) {
      res.status(400).json({
        message: 'Could not find listing with id: ' + req.body.listingId
      });
      return;
    }
    if (listing.numSpots < 1) {
      res.status(400).json({
        message: 'No spots available'
      });
      return;
    }
    if (listing.hostId === user._id) {
      res.status(400).json({
        message: 'Host cannot add themself to renters'
      });
      return;
    }

    if (listing.renters.includes(user._id)) {
      res.status(400).json({
        message: 'User already in renters array'
      });
      return;
    }

    listing.renters.push(user._id);
    listing.numSpots -= 1;

    await listingDAL.updateListing(listing);

    res.status(200).json({
      message: 'User added to listing',
      data: listing
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
    return;
  }
};

module.exports.newListing = async function (req, res) {
  try {
    listingKeys = [
      'address',
      'numSpots',
      'price',
      'startDate',
      'endDate',
      'longitude',
      'latitude'
    ];
    if (!listingKeys.every((item) => req.body.hasOwnProperty(item))) {
      res.status(400).json({
        message:
          "Not all keys supplied in request body. Must contain 'address', 'numSpots', 'price', 'startDate', 'endDate', 'longitude, and 'latitude'"
      });
    }
    addressKeys = ['street', 'city', 'state', 'zipCode'];
    if (!addressKeys.every((item) => req.body.address.hasOwnProperty(item))) {
      res.status(400).json({
        message:
          "Not all keys supplied in address request body. Must contain 'street', 'city', 'state', 'zipCode'"
      });
    } else {
      let data = req.body;
      if (!req.headers.sessionid) {
        console.log('no session id');
        res.status(400).json({
          message: 'No sessionId supplied'
        });
        return;
      }

      const user = await userDAL.getUserByUUID(req.headers.sessionid);

      if (!user) {
        console.log('no session id');
        res.status(400).json({
          message:
            'Could not find user with session id: ' + req.headers.sessionid
        });
        return;
      }

      data.hostId = user._id;

      let loc = { type: 'Point', coordinates: [data.longitude, data.latitude] };

      data.location = loc;
      delete data.longitude;
      delete data.latidude;

      const listing = await listingDAL.addListing(data);

      if (listing) {
        res.status(200).json({
          message: 'Listing created successfully',
          data: listing
        });
        return;
      } else {
        res.status(500).json({
          message: 'Error creating listing'
        });
        return;
      }
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.getListingById = async function (req, res) {
  try {
    const id = req.params.id;
    const listing = await listingDAL.getListingById(id);

    if (!listing) {
      res.status(400).json({
        message: 'Listing not found'
      });
    } else {
      res.status(200).json({
        message: 'Found listing',
        data: listing
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.editSpots = async function (req, res) {
  const addSpot = req.body.addSpots;
  const amount = req.body.amount;
  const user = await userDAL.getUserByUUID(req.headers.sessionid);

  let listing = await listingDAL.getListingByHostId(user._id);

  if (addSpot) {
    listing.numSpots += amount;
    const newListing = await listingDAL.updateListing(listing);
    res.status(200).json({
      message: 'Spots updated',
      data: newListing
    });
  } else {
    listing.numSpots -= amount;
    const newListing = await listingDAL.updateListing(listing);
    res.status(200).json({
      message: 'Spots updated',
      data: newListing
    });
  }
};

module.exports.getListingsByLocation = async function (req, res) {
  try {
    if (!authUtils.checkSessionId(req)) {
      res.status(400).json({
        message: 'No sessionId sent in request headers'
      });
      return;
    }
    let user = await userDAL.getUserByUUID(req.headers.sessionid);
    if (!user) {
      res.status(400).json({
        message: 'No user matching supplied sessionId'
      });
      return;
    }

    if (!req.query.lat || !req.query.long || !req.query.maxMiles) {
      res.status(400).json({
        message: 'Not all url params given'
      });
      return;
    }

    const lat = parseFloat(req.query.lat);
    const long = parseFloat(req.query.long);
    const maxMeters = parseFloat(req.query.maxMiles) * 1609.34;
    const listings = await listingDAL.getListingsNearCoordinates(
      long,
      lat,
      maxMeters
    );

    res.status(200).json({
      message: 'listings fetched successfully',
      data: listings
    });
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.getListingByHost = async function (req, res) {
  try {
    const id = req.params.id;
    const listing = await listingDAL.getListingByHostId(id);

    if (!listing) {
      res.status(400).json({
        message: 'Listing not found'
      });
    } else {
      res.status(200).json({
        message: 'Found listing',
        data: listing
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};
