const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {constructUser,authLogin, genSessId } = require('../src/util/authUtils');
const {createUser,getUserByEmail} = require('../src/databaseMethods/userDAL');
dotenv.config();

describe('Testing the authUtilities functions', () => {

    beforeAll(async () => {
        await mongoose.connect(`mongodb://${process.env.DB_IP}/testing_authUtils`, {
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

    describe('testing the constructUser function', () => {
        test('the users email should be in lowercase', async (done) =>{
            const user = {
                email: 'TEST@test.com',
                password: 'password',
                phoneNumber: '555-555-5555',
                firstName: 'first',
                lastName: 'last',
                host: false
            }

            const constructed = await constructUser(user);
            const email = constructed.email;

            expect(email).not.toMatch(new RegExp('[A-Z]'));

            done();
        });

        test('the users password should be hashed', async (done) =>{
            const user = {
                email: 'TEST@test.com',
                password: 'password',
                phoneNumber: '555-555-5555',
                firstName: 'first',
                lastName: 'last',
                host: false
            }

            const constructed = await constructUser(user);
            const password = constructed.password;

            expect(user.password).not.toBe(password);

            done();
        });

        test('the constructed user should have an email, password, phoneNumber, firstName, lastName, and host field', async (done) => {
            const user = {
                email: 'TEST@test.com',
                password: 'password',
                phoneNumber: '555-555-5555',
                firstName: 'first',
                lastName: 'last',
                host: false
            }

            const constructed = await constructUser(user);

            expect(constructed).toHaveProperty('email', 'test@test.com');
            expect(constructed).toHaveProperty('password');
            expect(constructed).toHaveProperty('phoneNumber', user.phoneNumber);
            expect(constructed).toHaveProperty('firstName', user.firstName);
            expect(constructed).toHaveProperty('lastName', user.lastName);
            expect(constructed).toHaveProperty('host', user.host);
            done();
        });
    });

    describe('authLogin function tests', () => {

        test('if email is invalid return {valid false, user:null}', async (done) => {
            const user = {
                email: 'bob@test.com',
                password: 'password',
                phoneNumber: '555-555-5555',
                firstName: 'first',
                lastName: 'last',
                host: false
            }

            const constructed = await constructUser(user);

            await createUser(constructed);
            const auth = await authLogin(user);

            expect.objectContaining({valid: false, user:null});
            done();
        });

        test('if password is invalid return {valid false, user:user}', async (done) => {
            const user = {
                email: 'test@test.com',
                password: 'pass',
                phoneNumber: '555-555-5555',
                firstName: 'first',
                lastName: 'last',
                host: false
            }

            const constructed = await constructUser(user);

            await createUser(constructed);
            const auth = await authLogin(user);

            expect.objectContaining({valid: false, user:constructed});
            done();
        });

        test('if email and password are valid should return {valid: true, user: user}', async (done) => {
            const user = {
                email: 'test@test.com',
                password: 'password',
                phoneNumber: '555-555-5555',
                firstName: 'first',
                lastName: 'last',
                host: false
            }

            const constructed = await constructUser(user);

            await createUser(constructed);
            const auth = await authLogin(user);

            expect.objectContaining({valid: true, user:constructed});
            done();
        });
    });

    describe('genSessId function test', () => {
        test('when called it should generate and return a sessionId', async (done) => {
            const id = await genSessId();

            expect(id).toBeDefined();

            done();
        })
    })
});