import mongoose from "mongoose";

/**
 * @description Establishes a connection to a MongoDB database using the Mongoose
 * library. It takes the URI from an environment variable, sets some options, and
 * logs a success message if successful or an error message if not. If an error occurs,
 * it exits the process.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error Found: ${error.message}`);
    process.exit();
  }
};
module.exports = connectDB;
