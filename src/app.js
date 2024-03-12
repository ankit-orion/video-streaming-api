// Import the required modules: Express, CORS, and cookie-parser.
import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

// Create an instance of the Express application.
const app = express();

// Use middleware to enable Cross-Origin Resource Sharing (CORS).
// By default, allows requests from the origin specified in the CORS_ORIGIN environment variable.
// Also allows credentials to be sent with cross-origin requests.
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from specified origin
    credentials: true // Allow credentials (e.g., cookies, authorization headers) to be sent with requests
}));

// Use middleware to parse JSON bodies.
// Sets a limit on the size of the JSON payload to prevent denial of service attacks.
app.use(express.json({ limit: "16kb" }));

// Use middleware to parse URL-encoded bodies.
// Sets a limit on the size of the URL-encoded payload to prevent denial of service attacks.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the "public" directory.
// Commonly used for serving static assets such as images, CSS, and client-side JavaScript files.
app.use(express.static("public"));

// Use middleware to parse cookies from incoming requests.
app.use(cookieparser());

//Routes
import userRouter from "./routes/user.routes.js";
// routes declaration 
// here we are using a middleware 
// when a user is on /user route is will redirect to userRouter which
// is declared in routes file
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

// Export the Express application instance to make it available for use in other modules.
export { app };
