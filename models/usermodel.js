var mongoose = require("mongoose");
//schema = collection
var schema = mongoose.Schema;
var objectID = schema.ObjectId;
var user = new schema({
    id: {type:objectID},
    username: {type:String},
    password:  {
        type:String
        // require: true, //bat buoc
        // unique: true, //duy nhat
        // trim: true,
        // default: "No user"
    },
    fullname: {type:String},
    age: {type:Number}
});


module.exports = mongoose.models.user || mongoose.model("user",user);