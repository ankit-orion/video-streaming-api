import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// const registerUserdummy = asyncHandler(async(req, res)=>{
//     // ^ Steps to do :- 
//     // steps to register 
//     // get user details from frontend - can be done through postman
//     // validation required : check if all the fields ar coorect
//     // validation is done in frontend but we do it on backend as well
//     // check if already exists :- can be done if email or username already exits can be done with both
//     // check for images
//     // check for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in db 
//     // remove password and refresh token field from response
//     // check for user creation 
//     // return response

//     // extracting requests using body
//     // requst has all the fields which are defeind in the model
//     // we will send the request in body
    
//     const {fullName, email, username, password } = req.body

//     // console.log("emai:", email);
//     // we can write if condition for all the fields but it's quite lengthy so
//     // we will assign all the fields in an array and we will use some method to check
//     // for the validation

//     // if(fullName === ""){
//     //     throw new ApiError(400, "full name is required")
//     // }
//     if (
//         [fullName, email, username, password].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }
    
//     // Check if a user with the provided email or username already exists
//     const existedUser = await User.findOne({
//         $or: [{ username }, { email }]
//     })        
//     // The $or operator performs a logical OR operation on an array of two or more expressions 
//         // and selects the documents that satisfy at least one of the expressions.
//         // In this case, it is used to find a user document where either the username or the email matches 
//         // the provided values. This allows searching for an existing user based on either username or email.

//         if (existedUser) {
//             throw new ApiError(409, "User with email or username already exists")
//         }

//     //^ Handling files
//     // here we are accessing files
//     // console.log(req.files)
//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     // const coverImageLocalPath = req.files?.coverImage[0]?.path;

//     let coverImageLocalPath;
//     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
//         coverImageLocalPath = req.files.coverImage[0].path
//     }

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar file is required")
//     }
//     // ^ uploading the image on cloudinary

//     // upload on cloudinary return a reponse having all the details about the image
//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//     if (!avatar) {
//         throw new ApiError(400, "Avatar file is required")
//     }
//     // this print statement will print the same data as in multer.middleware.js
//     // there also we are printing response
//     // else{
//     //     console.log(avatar);
//     // }
//     // console.log(coverImage)
//     // ^ here we are making an entry in the database
//     const user = await User.create({
//         fullName,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         email, 
//         password,
//         username: username.toLowerCase()
//     })
//     // console.log(newUser)
//     // Here we are removing sensitive fields from the database
//     // syntax is very simple we jsut have to write negative sign before the fieled which we want to remove
//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )
//     // other way of removing sensitive fields from the created user object;-
//     // const createdUser = newUser.toObject();
//     // delete createdUser.password;
//     // delete createdUser.refreshToken;

//     // if we are not able to register the data int o the database we can return the error
//     // as we have already created a error utlitly we can pass the fields to print the error
//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user")
//     }else{
//         console.log(createdUser)
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser, "User registered Successfully")
//     )
// })


const generateAccessAndRefreshTokens = async(userId) => {
    
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // here we are adding refresh token in the database
        user.refreshToken = refreshToken
        // here we are saving our database with the updated field
        // since validation or password field will kick in
        // so for that reason we are write validateBeforeSave: false
        await user.save({validateBeforeSave: false})

        return {
            accessToken,
            refreshToken,
        }

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar && req.files.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    // here we are removing password and refreshToken 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // extract body from req data
    // check for email or username fields
    // find the user in database
    // password check
    // if password correct - generate access and refresh token
    // send cookies - secure cookies 
    // send a response that logged in successfully

    // here we are extracting the values from the req body

    const {email, username, password} = req.body
    // console.log(email);

    // check if all the fields are give or not

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(user);
    if (!user) {
        throw new ApiError(404, "User doesn't exist")
    }
    // now we have to check for the password so for that reason
    // we have already created an method in which we have to pass the user password
    // this method is created in the user model
    console.log(password);
    console.log(user);
    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log(isPasswordValid);
    if (!isPasswordValid) {
     throw new ApiError(401, "Invalid user credentials")
     }
    // If user and password is correct we have to create access and refresh tokens
    // since we have created a method for this we just need to pass
    // the user id and we will get access and refresh token in response
   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    // now we to send these details to the user but we cannot send all the fields 
    // that is password so we have to update
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // send cookies
    // here we have to desing options
    // cookies can be modified generally so to avoid that 
    // we have enabls httpOnly and secure
    // now we can only modify our cookies through server
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            // this is the data field
            // why are we sending to the fronted
            // because there might be a case where fronted enginner wants to scrape
            // some data from the accessToken
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})


const logoutUser = asyncHandler(async(req, res)=>{
    // in case of logout we have to remove cookies
    // and reset access and refresh token
    // we can access cookie in req and res
    await User.findByIdAndUpdate(
        // find the user
        req.user._id,
        {
            // mongo db operator
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

export {
    registerUser,
    loginUser,
    logoutUser,
}