const mongoose = require('mongoose');
const { getUser, getAllUsers, getMe } = require('../src/controllers/userController');
const dotenv = require('dotenv');
dotenv.config();

const mockRequest = (params, headers, sessionData, body) => ({
  params: params,
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
        await mongoose.connect(`mongodb://${process.env.DB_IP}/testing_userController`, {
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

    describe('Get user tests', () => {
        test('if param is missing should return 400', async (done) => {
            const req = mockRequest(
                {email: ''},
                {},
                {},
                {}
            );
            const res = mockResponse();

            const user = await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            done();
        });
    });

    describe('Get all user test', () => {
        test('should always return 200 unless something goes wrong on the server', async (done) => {
            const req = mockRequest(
                {},
                {},
                {},
                {}
            );
            const res = mockResponse();

            const user = await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            done();
        });
    });

    describe('Get me test', () => {
        test('should return 400 if the sessionid is not included in the headers', async (done) => {
            const req = mockRequest(
                {},
                {sessionid: ''},
                {},
                {}
            );
            const res = mockResponse();

            const user = await getMe(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            done();
        });

        test('should return 400 if the sessionid does not match a user', async (done) => {
            const req = mockRequest(
                {},
                {sessionid: '54316851389351'},
                {},
                {}
            );
            const res = mockResponse();

            const user = await getMe(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            done();
        });
    });
});