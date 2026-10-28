import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export async function startTestDB() {
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: "eventos-test" });
  return mongo;
}

export async function stopTestDB(mongo) {
  await mongoose.disconnect();
  await mongo.stop();
}

export async function clearDatabase() {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}
