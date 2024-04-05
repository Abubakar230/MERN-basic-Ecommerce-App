import mongoose,{Schema} from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'     //hash the password (change)=> encripted/decripted
import jwt from "jsonwebtoken";   
// import crypto from "crypto";


const userSchema = new Schema({
    name : {
        type : String,
        required : [true, "Please Enter your Name"],
        maxLength : [30, "Name can not exceed 30 characters"],
        minLength : [4, "Name should have 4 characters"],
        // lowercase : true,
        // unique : true,
        // trim : true,
        // index : true
    },
    email : {
        type : String,
        required : [true, "Please Enter your Email"],
        unique : true,
        validate : [validator.isEmail, "Please Enter a Valid Email"],
        // lowercase : true,
        // trim : true,
    },
    password : {
        type : String,
        required : [true, 'Please Enter Your Password'],
        minLength : [8, "Password should be greater than 8 characters"],
        select : false
    },
    avatar : {
        public_id : {
            type : String,     //cloudinary service
            required : true
        },
        url : {
            type : String,     //cloudinary service
            required : true,
        }
    },
    role : {
        type : String,           // default user otherwise admin
        default : "user"
    },
    // createdAt : {
    //     type : Date,
    //     default : Date.now,
    // },
    resetPasswordToken : String,
    resetPasswordExpire : Date,


},
{timestamps : true}
)


userSchema.pre("save",async function(next){                // data send/covert in encrypted from  
    if(!this.isModified('password')) return next();        // if password not change then the bcrypt same value and if the password change then the b crypt add new value
                                                              
    this.password = await bcrypt.hash(this.password, 10)    //(modified/change)=>bcrypt.hash
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword){    // access/get which the password is encripted before
   return await bcrypt.compare(enteredPassword, this.password)          // compare the password before the encription
}

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id : this._id},                           
    process.env.JWT_SECRET,                           //    jwt.sign({
    {                                                 //      data: 'foobar'
        expiresIn : process.env.JWT_EXPIRY            //    }, 'secret', { expiresIn: '1h' });
    })
}




export const User = mongoose.model('User',userSchema)