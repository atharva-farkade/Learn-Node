import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandlers.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Received token:", token ,typeof token);

        if (!token) {
            throw new ApiError("unauthorised request", 401);
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("Decoded token:", decodedToken);


        const user = await User.findById(decodedToken?._id).
            select("-password -refreshToken -watchHistory")
        // console.log("User found:", user);


        if (!user) {
            throw new ApiError("Invalid Access Token", 401);
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ApiError("unauthorised request", 401));

    }
})