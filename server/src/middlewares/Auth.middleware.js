import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async(req, res, next) =>{
    try{
        // FIX: Replaced "Bearer" with "Bearer " (with a space) and added .trim()
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim()
        
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // ... rest of the code
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    }catch(error){
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

export {verifyJWT}