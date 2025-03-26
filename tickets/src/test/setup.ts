import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Mongoose } from "mongoose";
import jwt from "jsonwebtoken";
let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongouri = mongo.getUri();

  await mongoose.connect(mongouri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

interface Payload {
  id: string;
  email: string;
}
interface Session {
  jwt: string;
}

// global.signin = () => {
//   //build a JWT payload. {id,email}

//   const payload:Payload = {
//     id: "2323kjfg4",
//     email: "test@test.com",
//   };

//   // Crete the JWT!

//   const token = jwt.sign(payload, process.env.JWT_KEY!);
//   // build session Object

//   const session:Session = { jwt: token };

//   // Turn that session in JSON

//   const sessionJSON = JSON.stringify(session);

//   //return a string thats the cookie with encoded data

//   const base64 = Buffer.from(sessionJSON).toString("base64");

//   //return a string that the cookie with the encoded data

//   return [`session=${base64}`];
// };
