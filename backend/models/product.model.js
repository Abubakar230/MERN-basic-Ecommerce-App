import mongoose,{Schema} from "mongoose";
const productSchema = new Schema(
    {
        name : {
            type : String,
            required : [true, "Please enter Product name"],
            trim : true
        },
        description : {
            type : String,
            required : [true, "Please enter Product description"]
        },
        price : {
            type : Number,
            required : [true, "Please enter Product price"],
            maxLength : [8, "Price can not exceeds 8 character"]
        },
        ratings : {
            type : Number,
            default : 0
        },
        images : [
            {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            },
        }
        ],
        category : {
            type : String,
            required : [true, "Please enter Product category"]
        },
        stock : {
            type : Number,
            required : [true, "Please enter Product stock"],
            maxLength : [4, "Stock can not exceed 4 characters"],
            default : 1
        },
        numOfReviews : {
            type : Number,
            default : 0
        },
        reviews : [                    // use in product controllers 
            {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
                required : true
            },
            name : {
                type : String,
                required : true
            },
            rating : {            
                type : String,
                required : true
            },
            comment : {
                type : String,
                required : true
            },
        }
        ],
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        createdAt : {
            type : Date,
            default : Date.now
        }

        
    },
    // {
    //     timestamps : true
    // }
    )



export const Product = mongoose.model("Product",productSchema)