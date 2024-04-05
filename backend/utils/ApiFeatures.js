class ApiFeatures {                     // To find the specific thing(product...)
    constructor(query,queryStr){
        this.query = query;                // query is used to find
        this.queryStr = queryStr        // queryStr is used to search keyword(Laptop...)
    }

    // perform regular expression searches on string fields

    search(){
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword ,
                $options : "i"                      //case-insensitive match.
            }
        } : {};

        this.query = this.query.find({...keyword})    // find all keyword you search
        return this;
    }

    filter(){
        const querycopy = {...this.queryStr}
        // Removing some fields for cateory

        const removeFields = ["keyword","page","limit"]
        removeFields.forEach((key)=>delete querycopy[key])

        // Filter for Price and Rating
        let queryStr = JSON.stringify(querycopy)    // convert in string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=> `$${key}`)   // attach $

        // Product.find
        // this.query = this.query.find(querycopy)
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    // how many product show in one page

    pagination(resultPerPage){

        const currentPage = Number(this.queryStr.page) || 1;   // 50-10
        const skip = resultPerPage * (currentPage - 1)        // 10*1-1

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }

}

export {ApiFeatures}