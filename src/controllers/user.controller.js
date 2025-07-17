import asyncHandler from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;       
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError("Token generation failed", 500);
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //  res.status(200).json({
    //     message: "Hogya bhai"
    // })

    const { fullName, email, username, password } = req.body
    console.log("email", email);



    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {   // it will return true if the field is empty or null
        throw new ApiError("All fields are required", 400);
    }
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]

    })

    if (existingUser) {
        throw new ApiError("User already exists", 409);
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError("Avatar and Cover Image are required", 400);
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError("Avatar upload failed", 400);
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : "",
        email,
        password,
        username: username.toLowerCase(),
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -watchHistory"
    )
    if (!createdUser) {
        throw new ApiError("User creation failed", 500);
    }

    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", createdUser)
    )

})

const loginUser = asyncHandler(async (req, res) => {

    //req body -> Data
    //username email
    //find the user
    //password match
    //access adn refresh token
    //send cookie
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError("Email or Username is required", 400);
    }
    //now have to check if the user exists
    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    // const user = await User.findOne({ $or: [{ email }, { username }] }).select('+password'); 
    // if select field in usermodel is false


    if (!user) {
        throw new ApiError("User does not exist", 404);
    }
if (!password) {
  throw new ApiError("Password is required", 400);
}
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError("Invalid password", 401);
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -watchHistory");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken

                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id, {
        $set: { refreshToken: undefined }
    },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
    }
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, "User logged out successfully"))

})
export { registerUser, loginUser, logoutUser }
