import asyncHandler from "../utils/asyncHandlers.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
    //  res.status(200).json({
    //     message: "Hogya bhai"
    // })

const {fullName, email, username, password } = req.body 
console.log("email", email);



if([fullName, email, username, password].some((field) => field?.trim() === "")) {   // it will return true if the field is empty or null
    throw new ApiError("All fields are required", 400);
}
const existingUser =await User.findOne({ $or: [{username},{email}]

})

if (existingUser) {
    throw new ApiError("User already exists", 409);
}
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath) {
    throw new ApiError("Avatar and Cover Image are required", 400);
}

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new ApiError("Avatar upload failed", 400);
}

const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage ? coverImage.url :"",
    email,
    password,
    username: username.toLowerCase(),
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -watchHistory"
)
if(!createdUser) {
    throw new ApiError("User creation failed", 500);
}

return res.status(201).json(
    new ApiResponse(200, "User registered successfully", createdUser)
)

})
export { registerUser, }
