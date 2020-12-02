const userDAL = require('../databaseMethods/userDAL');
const authUtils = require('../util/authUtils');
const stripeUtils = require('../util/stripeUtils');
/**
 *
 * @param {*} req
 * @param {*} res
 * req needs a header with the sessionId of the current user that is logged in
 * res will send a status and json depend on the outcome of the function
 * returns the message: User stripeId found and stripeId: {stripeId} given
 * the user sessionId you provided is stored in the database
 */
module.exports.getStripeBySess = async function (req, res) {
  try {
    if (!('sessionid' in req.headers)) {
      res.status(400).json({
        message: 'No sessionId sent in request headers'
      });
      return;
    }
    let user = await userDAL.getUserByUUID(req.headers.sessionid);
    if (!user) {
      res.status(400).json({
        message: 'User cannot be found with sessionid: ' + req.headers.sessionid
      });
    } else {
      res.status(200).json({
        message: 'User stripeId found',
        stripeId: user.stripeId
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * req header must contain the sessionId of the user that is currently logged in
 * must also include the value of the stripeId that you would like to add to the user
 * res will send a status and json depend on the outcome of the function
 * returns message: Stripe Id registered to user stripeId: {stripeId} if
 * the sessionId matches to a users stored in the database
 */
module.exports.addStripeId = async function (req, res) {
  try {
    if (!req.body.hasOwnProperty('stripeId')) {
      res.status(400).json({
        message: 'You must supply a stripeId to append to the user'
      });
      return;
    }
    if (!('sessionid' in req.headers)) {
      res.status(400).json({
        message: 'No sessionId sent in request headers'
      });
      return;
    }

    let user = await userDAL.getUserByUUID(req.headers.sessionid);
    if (!user) {
      res.status(400).json({
        message: 'User cannot be found with sessionid: ' + req.headers.sessionid
      });
      return;
    }
    user.stripeId = req.body.stripeId;

    const savedUser = await userDAL.updateUser(user);
    if (savedUser) {
      res.status(200).json({
        message: 'Stripe Id registered to user',
        user: { id: savedUser._id }
      });
      return;
    } else {
      res.status(400).json({
        message: 'Could not register stripe id'
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * req header should contain the sessionId from the current user that is logged in
 * req body should contain the value that you would like to update the stripeId to
 * res will send a status and json depend on the outcome of the function
 * returns message: Stripe Id updated successfully! id: {userId}, stripeId: {stripeId}
 */
module.exports.updateStripeId = async function (req, res) {
  try {
    if (!req.body.stripeId) {
      res.status(400).json({
        message: 'No id sent to update'
      });
    }
    if (!('sessionid' in req.headers)) {
      res.status(400).json({
        message: 'No sessionId sent in request headers'
      });
      return;
    }
    let user = await userDAL.getUserByUUID(req.headers.sessionid);
    if (!user) {
      res.status(400).json({
        message: 'User cannot be found with sessionid: ' + req.headers.sessionid
      });
      return;
    }
    const id = req.body.stripeId;
    user.stripeId = id;

    const savedUser = await userDAL.updateUser(user);

    res.status(200).json({
      message: 'Stripe Id updated successfully!',
      user: { id: savedUser._id, stripeId: savedUser.stripeId }
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * req header should contain the sessionId from the current user that is logged in
 * res will send a status and json depend on the outcome of the function
 * returns message: Users stripId has been removed if the sessionId matches with
 * a user that is stored in the database
 */
module.exports.removeStripeId = async (req, res) => {
  try {
    if (!('sessionid' in req.headers)) {
      res.status(400).json({
        message: 'No sessionId sent in request headers'
      });
    } else {
      let user = await userDAL.getUserByUUID(req.headers.sessionid);
      if (!user) {
        res.status(400).json({
          message:
            'User cannot be found with sessionid: ' + req.headers.sessionid
        });
      } else {
        user.stripeId = null;
        await userDAL.updateUser(user);
        res.status(200).json({ message: 'Users stripId has been removed' });
      }
    }
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.addStripeCard = async (req, res) => {
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
    const card = await stripeUtils.createCard(user.stripeId, req.body.source);

    res.status(200).json({
      message: 'Card added successfully',
      data: card
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.addCustomer = async (req, res) => {
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

    const customer = await stripeUtils.createCustomer();

    res.status(200).json({
      message: 'Customer added successfully',
      data: customer
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.updateDefaultCard = async (req, res) => {
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

    console.log(user.stripeId + ' ' + req.body.cardId);
    await stripeUtils.updateDefaultCard(user.stripeId, req.body.cardId);

    res.status(200).json({
      message: 'Card updated successfully'
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.removeCard = async (req, res) => {
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

    const deletedCard = await stripeUtils.deleteCard(
      user.stripeId,
      req.params.cid
    );

    res.status(200).json({
      message: 'Card deleted successfully',
      data: deletedCard
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.getCustomer = async (req, res) => {
  try {
    console.log('get customer here');
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
    const customer = await stripeUtils.getCustomer(user.stripeId);

    res.status(200).json({
      message: 'Customer received successfully',
      data: customer
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

module.exports.getCards = async (req, res) => {
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
    console.log(user.stripeId);
    const cards = await stripeUtils.getCards(user.stripeId);

    res.status(200).json({
      message: 'Cards gotten successfully',
      data: cards
    });
    return;
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: e.message
    });
  }
};
