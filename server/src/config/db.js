const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Drop stale emailId index if it exists
    const usersCollection = conn.connection.collection("users");
    const indexes = await usersCollection.indexes();
    if (indexes.some((idx) => idx.key?.emailId !== undefined)) {
      await usersCollection.dropIndex("emailId_1");
      console.log("Dropped stale emailId_1 index from users collection");
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
