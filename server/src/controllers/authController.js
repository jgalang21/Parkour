const {
  REG_KEYLIST,
  LOGIN_KEYLIST,
  constructUser,
  authLogin,
  genSessId
} = require('../util/authUtils');
const userDAL = require('../databaseMethods/userDAL');

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * req should contain the users: email, password, phoneNumber, firstName, lastName, and host
 * res will send a status and json depend on the outcome of the function
 * creates a new user in the database, and responds with that user given all the information
 * in the request is valid
 * returns user: {id: {userId}, email: {userEmail}, firstName: {userFirstName}}, message: User created successfully
 * if all you included all of the neccessary information
 */
module.exports.register = async function (req, res) {
  try {
    if (!REG_KEYLIST.every((item) => req.body.hasOwnProperty(item))) {
      res.status(400).json({
        message:
          'Not all keys supplied in request body. Must contain email, phoneNumber, password, firstName, lastName, and host'
      });
    } else {
      let data = req.body;

      const user = await constructUser(data);

      const saved = await userDAL.createUser(user);

      res.status(200).json({
        user: {
          id: saved._id,
          email: saved.email,
          firstName: saved.firstName
        },
        message: 'User created successfully'
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
 *
 * req should contain the users: email and password
 * res will send a status and json depend on the outcome of the function
 * sets the given users sessionId and returns the users sessionId if the
 * creditials that were given match with creditials stored in the database
 * returns message: User logged in successfully, user: { sessionId:{userSessionId}, id:{userId}}
 * if the username and password matched with a user in the database
 */
module.exports.login = async function (req, res) {
  try {
    if (!LOGIN_KEYLIST.every((item) => req.body.hasOwnProperty(item))) {
      res.status(400).json({
        message:
          'Not all keys supplied in request body. Must contain email, password'
      });
    } else {
      let validUser = await authLogin(req.body);
      if (!validUser.valid) {
        res.status(400).json({ message: 'Username or password is incorrect' });
      } else {
        const uuid = await genSessId();
        validUser.user.sessionId = uuid;
        const user = await userDAL.updateUser(validUser.user);
        const obj = { sessionId: uuid, id: user._id };
        res.status(200).json({
          message: 'User logged in successfully',
          data: obj
        });
      }
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
 * req needs to contain a header with the sessionId
 * res will send a status and json depend on the outcome of the function
 * sets the users sessionId to null given the provided sessionId matches with a user
 * in the database
 * returns message: User logged out successfully
 * if the sessionId in the header matched with a user stored in the database
 */
module.exports.logout = async function (req, res) {
  try {
    const headers = req.headers;
    if (!('sessionid' in headers)) {
      res.status(400).json({
        message: 'No sessionId sent in request headers'
      });
    } else {
      let user = await userDAL.getUserByUUID(headers.sessionid);
      if (!user) {
        res.status(400).json({
          message: 'No user matching supplied sessionId'
        });
      } else {
        await userDAL.updateUserUUID(user, null);
        res.status(200).json({
          message: 'User logged out successfully'
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      message: 'Error occurred while trying to logout'
    });
  }
};
