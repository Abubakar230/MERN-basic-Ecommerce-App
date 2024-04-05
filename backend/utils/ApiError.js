class ApiError extends Error {
    constructor(
        statuscode ,
        message = "Something went wrong",           // this is parameters
        errors = [],
        stack = ""
    ){
        super(message)      // message over write
        this.message = message
        this.data = null
        this.statuscode = statuscode                // this is body
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}