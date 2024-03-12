// ^Use :

// This code defines a custom error class named ApiError
// in JavaScript. This class is particularly useful in 
// scenarios where you want to handle errors in an 
// API or web service context. 
// Define a custom error class named ApiError which extends the built-in Error class in JavaScript.


class ApiError extends Error {
    // Define the constructor method for the ApiError class.
    constructor(
        statusCode, // The HTTP status code associated with the error.
        message = "Something went wrong", // A message describing the error, defaults to "Something went wrong".
        errors = [], // An array to hold additional error information, defaults to an empty array.
        stack = "" // A string representing the stack trace of the error, defaults to an empty string.
    ) {
        // Call the constructor of the Error class with the provided message.
        super(message);

        // Assign the provided statusCode to the 'statusCode' property of the ApiError instance.
        this.statusCode = statusCode;

        // Initialize the 'data' property of the ApiError instance to null.
        this.data = null;

        // Assign the provided message to the 'message' property of the ApiError instance.
        this.message = message;

        // Initialize the 'success' property of the ApiError instance to false.
        this.success = false;

        // Assign the provided errors array to the 'errors' property of the ApiError instance.
        this.errors = errors;

        // Check if a stack trace is provided.
        if (stack) {
            // If provided, assign the provided stack trace to the 'stack' property of the ApiError instance.
            this.stack = stack;
        } else {
            // If not provided, generate a stack trace for the ApiError instance using Error.captureStackTrace().
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the ApiError class to make it available for use in other modules.
export { ApiError };
