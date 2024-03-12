// Import the Mongoose library, which allows interaction with MongoDB.
import mongoose from "mongoose";

// Import the constant DB_NAME from the constants.js file.
// This constant likely represents the name of the MongoDB database.
import { DB_NAME } from "../constants.js";

// Define a function named connectDB responsible for connecting to the MongoDB database.
// This function is asynchronous to allow for the use of async/await syntax.
const connectDB = async () => {
    try {
        // Attempt to establish a connection to the MongoDB database.
        // The connection URI is constructed using the MONGODB_URI environment variable and the database name.
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        // Upon successful connection, log a confirmation message indicating the host of the connected database.
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        // If an error occurs during the connection attempt, log an error message and exit the process with code 1.
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

// Export the connectDB function to make it available for use in other modules.
export default connectDB;
