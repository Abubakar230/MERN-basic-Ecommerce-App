import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'                      // if user is login then user access data/see products



export const isAuthenticatedUser = asyncHandler( async(req,res,next)=>{ 

    const {token} = req.cookies;    
    // console.log(token);          

    if (!token) {
        return next( new ApiError(401,"Unauthorized request") )
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id)      // Get this id in user Model JWT(Access)


    // console.log(req.user);
    next()
    
});






// export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             throw new ApiError(401, "Unauthorized request: Missing token");
//         }

//         const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decodedData.id);

//         if (!user) {
//             throw new ApiError(401, "Unauthorized request: User not found");
//         }

//         // Attach the user to the request object for further processing
//         req.user = user;
        
//         next();
//     } catch (error) {
//         next(error); // Pass error to the error handling middleware
//     }
// });




export const authorizeRoles = (...roles)=>{         // check user is admin

    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {      // if user is not admin
            throw new ApiError(403, `Role : ${req.user.role} is not allowed to access this resource `)
        }

    next();      // if user is admin then user update the product also
    };
};