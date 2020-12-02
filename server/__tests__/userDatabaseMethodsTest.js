const mongoose = require('mongoose');
const userModel = require('../src/models/userModel');
const {getUserByUUID,getUserByEmail,updateUserUUID,getAllUsers,createUser} = require('../src/databaseMethods/userDAL');
const dotenv = require('dotenv');
const userDAL = require('../src/databaseMethods/userDAL');
dotenv.config();

describe('User Database Method Test', () => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb://${process.env.DB_IP}/testing_userDAL`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    async function removeAllCollections () {
        const collections = Object.keys(mongoose.connection.collections)
        for (const collectionName of collections) {
          const collection = mongoose.connection.collections[collectionName];
          await collection.deleteMany();
        }
    }
      
    afterEach(async () => {
        await removeAllCollections();
    });

    async function dropAllCollections() {
        const collections = Object.keys(mongoose.connection.collections);
        for (const collectionName of collections) {
          const collection = mongoose.connection.collections[collectionName];
          try {
            await collection.drop();
          } catch (error) {
            // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
            // Safe to ignore.
            if (error.message === "ns not found") return;
      
            // This error happens when you use it.todo.
            // Safe to ignore.
            if (error.message.includes("a background operation is currently running"))
              return;
      
            console.log(error.message);
          }
        }
      }

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    });

    test('Should save a new user to the database', async done => {
        const newUser = await createUser({
            email: 'email@test.com',
            password: 'testpassword',
            host: false,
            firstName: 'test',
            lastName: 'testerson',
            phoneNumber: '555-555-5555'
        });

        const getUser = await userModel.findOne({email:'email@test.com'});

        expect(getUser.email).toBeTruthy();
        expect(getUser.password).toBeTruthy();

        done();
    });

    test('Should get a user from the database by uuid', async done => {
     const newUser = new userModel({
        email: 'email@test.com',
        password: 'testpassword',
        host: false,
        firstName: 'test',
        lastName: 'testerson',
        phoneNumber: '555-555-5555',
        sessionId: '123456789'
      });

      await newUser.save();

      const getUser = await userDAL.getUserByUUID('123456789');

      expect(getUser.sessionId).toBe('123456789');

      done();
    });

    test('Should get a user from the database by their email', async done => {

      const newUser = await createUser({
        email: 'email@test.com',
        password: 'testpassword',
        host: false,
        firstName: 'test',
        lastName: 'testerson',
        phoneNumber: '555-555-5555'
      });

      await newUser.save();

      const user = await userDAL.getUserByEmail('email@test.com');

      expect(user).toBeDefined();

      done();
    });

    test('Should update the users sessionid in the database', async done => {

      const newUser = new userModel({
        email: 'email@test.com',
        password: 'testpassword',
        host: false,
        firstName: 'test',
        lastName: 'testerson',
        phoneNumber: '555-555-5555',
        sessionId: '123456789'
      });

      await newUser.save();

      const user = await userDAL.getUserByEmail('email@test.com');

      await userDAL.updateUserUUID(user, 'updated123');

      const updated = await userDAL.getUserByEmail('email@test.com');
      expect(updated.sessionId).toBe('updated123');

      done();
    });

    test('Should get all of the user in the database', async done => {
      const newUser1 = new userModel({
        email: 'email@test.com',
        password: 'testpassword',
        host: false,
        firstName: 'test',
        lastName: 'testerson',
        phoneNumber: '555-555-5555'
      });

      const newUser2 = new userModel({
        email: 'email2@test.com',
        password: 'test2password',
        host: false,
        firstName: 'test2',
        lastName: 'testerson2',
        phoneNumber: '111-111-1111'
      });

      await newUser1.save();

      await newUser2.save();

      const allUser = await userDAL.getAllUsers();

      expect(allUser.length).toBe(2);
      
      done();
    });

    test('User should be updated in the database', async done => {
      const newUser1 = new userModel({
        email: 'email@test.com',
        password: 'testpassword',
        host: false,
        firstName: 'test',
        lastName: 'testerson',
        phoneNumber: '555-555-5555'
      });

      await newUser1.save();

      const update = new userModel({
        email: 'updated@test.com',
        password: 'testpassword',
        host: false,
        firstName: 'test',
        lastName: 'testerson',
        phoneNumber: '555-555-5555',

      });

      const updatedUser = await userDAL.updateUser(update);

      expect(updatedUser.email).toBe('updated@test.com');

      done();
    });

});
