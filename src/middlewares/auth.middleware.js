export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError("unauthorised request", 401);
        }

        const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await user.findById(decodedToken?._id).
            select("-password -refreshToken -watchHistory")

        if (!user) {
            throw new ApiError("Invalid Access Token", 401);
        }

        res.user = user;
        next();
    } catch (error) {
        return next(new ApiError("unauthorised request", 401));

    }
})