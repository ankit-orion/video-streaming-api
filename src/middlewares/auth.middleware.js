import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
            // now we have to take access of token we can do it through cookies
            // if there is no access to cookie then we can access it from custom header passed by user
            // usually the header is in the form of key (Authorization : Bearer <token>)
            // and we are replacing "bearer " with empty sring
            // now we have access to token whether from cookies or header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // if token is not found we can throw an error
            if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
            // now we have so many information in our token so we have to decode
            // we have a jwt.verify method and we also need to pass the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})