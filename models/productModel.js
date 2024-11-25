var mongoose = require("mongoose");
var schema = mongoose.Schema;
var objectID = schema.ObjectId;
var product = new schema({
    id: {type:String},
    masp: {type:String},
    tensp : {type:String},
    gia: {type:Number},
    soluong: {type:Number},
    user: {type: objectID, ref:"user"} 
});
module.exports = mongoose.models.product || mongoose.model("product", product);