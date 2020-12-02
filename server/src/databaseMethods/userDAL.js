const User = require('../models/userModel');

const getUserByUUID = async function (uuid) {
  const user = await User.findOne({ sessionId: uuid });
  return user;
};

const createUser = async function (data) {
  user = new User(data);
  await user.save();
  return user;
};

const getUserById = async function (data) {
  const resp = await User.findOne({ _id: data });
  return resp;
};

const getUserByEmail = async function (emailAddress) {
  const resp = await User.findOne({ email: emailAddress });
  return resp;
};

const updateUser = async function (user) {
  await user.save();
  return user;
};

const getAllUsers = async function () {
  const allUsers = await User.find({});
  return allUsers;
};



module.exports = {
  getUserByUUID,
  getUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  getUserById
};
