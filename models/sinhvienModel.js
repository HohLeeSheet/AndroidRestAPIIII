var mongoose = require("mongoose");
var schema = mongoose.Schema;
var objectID = schema.ObjectId;
var sinhvien = new schema({
    id: {type:objectID},
    mssv: {type:String},
    hoten : {type:String},
    diemtb: {type:Number},
    bomon: {type:String},
    tuoi: {type: Number} 
});
module.exports = mongoose.models.sinhvien || mongoose.model("sinhvien", sinhvien);