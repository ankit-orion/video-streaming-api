import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"

// ^ bcrypt is used to hash the password which is in string format

import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            // index is used for searching field in the database it justs optimises 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

// ^ Middleware before saving the user details into the database
// Define a pre-save middleware to hash the password before saving the user document.
// This middleware is executed before saving a new user document or updating an existing one.
// It hashes the password field using bcrypt if it has been modified (new password or password change).
// This ensures that passwords are securely hashed before being stored in the database.
// The hash function is asynchronous to prevent blocking the event loop during password hashing.


userSchema.pre("save", async function (next) {
    // Check if the password field has been modified.
    // If not modified, skip password hashing and proceed to the next middleware.
    
    //the conditional check over the password field is added
    // to optimize the performance of the pre-save middleware
    // and avoid innecessary password hasing operations

    // Hashing passwords using bcrypt can be computationally intensive, 
    // especially for large datasets. By checking if the password 
    // has been modified, we can avoid unnecessary hashing operations 
    // when updating documents that don't involve password changes. 
    // This optimization helps improve the overall performance of the application.

    if(!this.isModified("password")) return next();
    // Hash the password field using bcrypt with a salt round of 10.
    // The higher the salt round, the more secure but slower the hashing process.
    
    this.password = await bcrypt.hash(this.password, 10)
    console.log(this.password);
    next()
})

// bool value will be returned
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    // Generate a JWT token with the specified payload containing user data.
    // The payload includes the user's unique identifier (_id), email, username, and full name.
    // This information will be encoded into the token.
    // The secret key used for signing the token is retrieved from the environment variable ACCESS_TOKEN_SECRET.
    // Storing the secret key in an environment variable enhances security by keeping it separate from the codebase.
    // The token will be signed using the secret key to ensure its integrity and authenticity.

    // The expiresIn option specifies the expiration time for the token.
    // It is retrieved from the environment variable ACCESS_TOKEN_EXPIRY, which represents the duration for which the token is valid.
    // Setting an expiration time enhances security by limiting the lifespan of the token.

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)