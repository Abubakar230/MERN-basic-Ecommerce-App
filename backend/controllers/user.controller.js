import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import {User} from '../models/user.model.js'
import { sendToken } from '../utils/jwtToken.js'
import {v2 as cloudinary} from 'cloudinary';
// import {sendEmail} from '../utils/sendEmail.js'// Method is used in forget password



// Register User
const registerUser = asyncHandler( async (req,res)=>{
   
    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

    const {name,email,password} = req.body         // enter details by user
    const user = await User.create({               // Create user in mongodb
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    })

    // const token = user.getJWTToken()         // convert it into (jwt)=>header,payload...
    // return res.status(201).json(
    //     new ApiResponse(200, {user,token}, "User registered successfully")
    // )
    sendToken(user, 201, res);

    // From utils jwt ===>// Create Token and saving in cookie
    // sendToken(user, 201, res)
})

// Login User
const loginUser = asyncHandler( async (req,res)=>{
    // req body => data
    // email, password check
    // find the user
    // password check

    const {email,password} = req.body

    if (!(email || password )) {                                  // email, password check
        throw new ApiError(404,"username and email is required")      
    }

    const user = await User.findOne({email}).select("+password")     // find the user
    if (!user) {
        throw new ApiError(404,"this user does not exist")
    }


    const isPasswordMatched = await user.comparePassword(password)   // password check
    if (!isPasswordMatched) {
        throw new ApiError(401,"this password is not valid")
    }

    // From utils jwt ===>// Create Token and saving in cookie
    // sendToken(user, 200, res)


    sendToken(user, 200, res);
    // const token = user.getJWTToken()         // convert it into (jwt)=>header,payload...
    // return res.status(201).json(
    //     new ApiResponse(200, {user,token}, "User registered successfully")
    // )


})

// Logout User
const logoutUser = asyncHandler( async (req,res)=>{
    
    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly : true,
    })

    return res
    .status(200)
    .json(new ApiResponse(200, "User logged Out"))
})

// // Forget Password
// const ForgetPassword = asyncHandler( async (req,res)=>{

//     // Enter email by user
//     const user = await User.findOne({email : req.body.email})

//     // If email does not match
//     if (!user) {
//         throw new ApiError(404, "User not found")
//     }

//   // Get ResetPassword Token
//   const resetToken = user.getResetPasswordToken();

// // saving in db
//   await user.save({ validateBeforeSave: false });

//   //Running in this URL
//  //                         https          ://locolhost      
//   const resetPasswordUrl =`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

//   // When user forget the password then this message show
//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

//   try {
//     await sendEmail({
//         email: user.email,          // Email send to the user ( whose email )
//         subject: `Ecommerce Password Recovery`,
//         message,
//       });

//     res.status(201).json(
//         new ApiResponse(200, `Email sent to ${user.email} successfully`)
//     )

    
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
// // saving in db
//     await user.save({ validateBeforeSave: false });

//     throw new ApiError(500, error.message)
//   }

// })

const getUserDetail = asyncHandler( async(req,res)=>{


    const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user
//   });

    // const user = await User.findById(req.user.id);
    return res
    .status(200)
    .json( new ApiResponse(200, user , "Current user fetched successfully"))

})

// cahnge password 
const updatePassword = asyncHandler( async(req,res)=>{

    // const { oldPassword,newPassword } = req.body

    const user = await User.findById(req.user?._id).select("+password")
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        throw new ApiError(400, "Invalid old password")
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        throw new ApiError(400, "Password does not match")
    }

    user.password = req.body.newPassword
    await user.save({validateBeforeSave : false})

    sendToken(user, 200, res)
})

// update User Profile
const updateProfile = asyncHandler(async (req, res) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
  
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json(new ApiResponse(200))
});

// Get User (admin)=>(How many user register the account)
const getAllUsers = asyncHandler(async (req, res) => {
      
    const users = await User.find()
  
    res
    .status(200)
    .json(new ApiResponse(200, users))
});

// Get Single User (admin)=>(Access User Details)
const getSingleUser = asyncHandler(async (req, res) => {
      
    const user = await User.findById(req.params.id)

    if (!user) {
        throw new ApiError(`User does not exist with id : ${req.params.id}`)
    }
  
    res
    .status(200)
    .json(new ApiResponse(200, user))
});

// update User Role (Same as update user) only add (role)
const updateUserRole = asyncHandler(async (req, res) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };
  
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json(new ApiResponse(200))
});

// Delete User ==>(admin)
const deleteUser = asyncHandler(async (req, res) => {
    
    
    const user = await User.findById(req.params.id)
    if (!user) {
        throw new ApiError(`User does not exist with id : ${req.params.id}`)
    }

    // await user.remove()         // Delete the user
    await User.deleteOne({ _id: user._id });
  
    res.status(200).json(new ApiResponse(200, "User deleted Successfully"))
});



export {
    registerUser,
    loginUser,
    logoutUser,
    getUserDetail,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser
}