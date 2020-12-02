const bcrypt = require("bcrypt");
const saltRounds = 10;
const userDAL = require("../databaseMethods/userDAL");
const UtilMethods = require("../util/UtilMethods");


/**
 *
 * @param {*} pass
 * The plain text password
 * @param {*} hash
 * The hashed password
 *
 * Return whether the given pass word matches with the password
 * stored in the database
 */
const comparePass = async (pass, hash) => {
  let status;
  await new Promise((resolve, reject) => {
    bcrypt.compare(pass, hash, (err, result) => {
      resolve(result);
    });
  }).then((v) => {
    status = v;
  });

  return status;
};

/**
 * Used to hold the request body keys for the authController
 * register function
 */
module.exports.REG_KEYLIST = [
  "email",
  "phoneNumber",
  "password",
  "firstName",
  "lastName",
  "host",
];

/**
 * Used to hold the request body keys for the authController
 * login function
 */
module.exports.LOGIN_KEYLIST = ["email", "password"];

/**
 *
 * @param {*} data
 * data is the user object from the authController request
 *
 * Hashes the users password, and converts the email to lowercase
 * Returns a user object that is ready to store in the database
 */
module.exports.constructUser = async (data) => {
  let password = data.password;
  let lowerEmail = data.email.toLowerCase();
  let hashedPass;
  await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, result) => {
      resolve(result);
    });
  }).then((pass) => {
    hashedPass = pass;
  });

  return {
    email: lowerEmail,
    password: hashedPass,
    phoneNumber: data.phoneNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    host: data.host,
  };
};

/**
 *
 * @param {*} data
 * The users email and password
 *
 * Checks if the user with the given email exits
 * Compares the password provided by the client to the hashed password
 * in the database
 * Returns whether the user was verified to login
 */
module.exports.authLogin = async (data) => {
  let user = await userDAL.getUserByEmail(data.email.toLowerCase());
  if (!user) {
    return { valid: false, user: null };
  } else {
    const validPass = await comparePass(data.password, user.password);
    let obj = { valid: validPass, user: user };
    return obj;
  }
};

/**
 * returns a new sessionId
 */
module.exports.genSessId = async () => {
  return await UtilMethods.createUUID();
};

module.exports.checkSessionId = async(req) => {

  const headers = req.headers;
		if (!("sessionid") in headers) {
			return false;
    }
    
    return true;
};