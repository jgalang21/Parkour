const mongoose = require('mongoose');
const { register, login, logout } = require('../src/controllers/authController');
const dotenv = require('dotenv');
dotenv.config();

const mockRequest = (headers, sessionData, body) => ({
  headers: headers,
  session: { data: sessionData },
  body,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller Test', () => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb://${process.env.DB_IP}/testing_authController`, {
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

  describe('New user tests', () => {

    test('if email is missing res 400 error', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          //email: 'test@test.com',
          password: 'password',
          phoneNumber: '555-555-5555',
          firstName: 'first',
          lastName: 'last',
          host: false
        }
      );

      const res = mockResponse();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Not all keys supplied in request body. Must contain email, phoneNumber, password, firstName, lastName, and host"}
      );
      done();
    });

    test('if password is missing res 400 error', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          email: 'test@test.com',
          //password: 'password',
          phoneNumber: '555-555-5555',
          firstName: 'first',
          lastName: 'last',
          host: false
        }
      );

      const res = mockResponse();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Not all keys supplied in request body. Must contain email, phoneNumber, password, firstName, lastName, and host"}
      );
      done();
    });

    test('if phoneNumber is missing res 400 error', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          email: 'test@test.com',
          password: 'password',
          //phoneNumber: '555-555-5555',
          firstName: 'first',
          lastName: 'last',
          host: false
        }
      );

      const res = mockResponse();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Not all keys supplied in request body. Must contain email, phoneNumber, password, firstName, lastName, and host"}
      );
      done();
    });

    test('if lastName is missing res 400 error', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          email: 'test@test.com',
          password: 'password',
          phoneNumber: '555-555-5555',
          firstName: 'first',
          //lastName: 'last',
          host: false
        }
      );

      const res = mockResponse();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Not all keys supplied in request body. Must contain email, phoneNumber, password, firstName, lastName, and host"}
      );
      done();
    });

    test('if host is missing res 400 error', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          email: 'test@test.com',
          password: 'password',
          phoneNumber: '555-555-5555',
          firstName: 'first',
          lastName: 'last',
          //host: false
        }
      );

      const res = mockResponse();

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Not all keys supplied in request body. Must contain email, phoneNumber, password, firstName, lastName, and host"}
      );
      done();
    });

    test('if all keys are present res 200 status', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          email: 'test@test.com',
          password: 'password',
          phoneNumber: '555-555-5555',
          firstName: 'first',
          lastName: 'last',
          host: false
        }
      );

      const res = mockResponse();

      await register(req, res);
      
      //We can only test the response status with our current architecture
      expect(res.status).toHaveBeenCalledWith(200);

      done();
    });
  });

  describe('Login in a user tests', () => {

    test('if password does not exist should return 400', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          email: 'test@test.com',
          //password: 'password',
        }
      );

      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Not all keys supplied in request body. Must contain email, password"}
      );
      done();
    });

    test('if email does not exist should return 400', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          //email: 'test@test.com',
          password: 'password',
        }
      );

      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Not all keys supplied in request body. Must contain email, password"}
      );
      done();
    });

    test('if user is not valid return 400', async (done) => {
      const req = mockRequest(
        {},
        {},
        {
          email: 'test@test.com',
          password: 'password',
        }
      );

      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        {message: "Username or password is incorrect"}
      );
      done();
    });
  });

  describe('Logout a user tests', () => {
    test('if headers is missing sessionid it should return 400', async (done) => {
      const req = mockRequest(
        {sessionid: ''},
        {},
        {}
      );

      const res = mockResponse();

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      done();
    });

    test('if sessionid does not match a user should return 400', async (done) => {
      const req = mockRequest(
        {sessionid: '54321658'},
        {},
        {}
      );

      const res = mockResponse();

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      done();
    });
  });

});