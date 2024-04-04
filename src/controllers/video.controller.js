import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.service.js";
import { Video } from "../models/video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query
});

const publishAVideo = asyncHandler(async(req, res)=>{
    const{title, description} = req.body;
    if(!title && !description ) 
    {
        return next(new ApiError(400, "Title and description are required"));
    }

    // upload video on cloduinary
    const videoLocalPath = req.files?.videoFile[0]?.path;

    if(!videoLocalPath){
        throw new ApiError(400, "Video file is required");
    }
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    
    console.log(videoFile);

    // upload thumbnail on cloudinary
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user._id,
    });
    const publishedVideo = await Video.findById(video._id).populate(
        "owner",
        "username"
    );
    return res.status(201)
    .json(new ApiResponse(201, publishedVideo, "video created successfully"));

})
export {
    publishAVideo
}