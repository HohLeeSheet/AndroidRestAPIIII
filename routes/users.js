var express = require('express');
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


var userModel = require("../models/usermodel");
var sendMail = require("../utill/mailConfig");
var JWT = require("jsonwebtoken");
var config = require("../utill/tokenConfig");

//localhost:3000/users/all
//lay danh sach user
router.get("/all", async function(req, res){
  var list = await userModel.find(); //"noi dung ma minh muon lay"
  res.json(list);
});

// lay thong tin chi tiet cua user

//cach 1: query
// localhost:3000/users/detail?id=xxx&value2=xxx
// router.get("/detail",async function (req,res) {

//cach 2 params
// localhost:3000/users/detail/xxx
router.get("/detail/:id",async function (req,res) {
  try {
    // var {id} = req.query;
    var {id} = req.params;
    var detail = await userModel.findById();
    if(detail){
      res.status(200).json(detail);
    }else{
      res.status(400).json({status: true, message:"loi kia haahahhaahhaa"});
    }
  } catch (error) {
    res.status(400).json({status: false, message:"co loi roi hehehehe"});
  }
});

// lay danh sach co tuoi lon hon x
//localhost:3000/users/get-ds?tuoi=x
router.get("/get-ds", async function (req, res) {
  try {
    const {tuoi} = req.query;
    var list = await userModel.find({age:{$gt:tuoi}});
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({status: false, message:"co loi roi hahahaa"});
  }
  
});


// lay danh sach trong khoang min - max
// localhost:3000/users/get-ds-trong-khoang?min=x&max=x
router.get("/get-ds-trong-khoang", async function (req, res) {
  try {
    const {min,max} = req.query;
    var list = await userModel.find({age: {$gte:min , $lte:max}});
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({status: false, message:"co loi roi hahahaa"});
  }
  
});


router.post("/send-mail", async function(req, res, next){
  try{
    const {to, subject, content} = req.body;

    const mailOptions = {
      from: "si dep trai vl <bacthayscam@hehehe.com>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công"});
  }catch(err){
    res.json({ status: 0, message: "Gửi mail thất bại"});
  }
});


router.post("/login", async function (req,res) {
  try {
    const {username, password} = req.body;
    const checkUser = await userModel.findOne({username: username, password: password});
    if(checkUser == null){
      res.status(400).json({status: false, message:"username hoac mat khau ko dung"});
    }else{
      var token =  JWT.sign({username: username},config.SECRETKEY,{expiresIn: '30m'});
      var refreshToken = JWT.sign({username: username},config.SECRETKEY,{expiresIn: '1h'});
      res.status(200).json({status: true, message:"dang nhap thanh cong", token: token});
    }
  } catch (error) {
    res.status(400).json({status: false, message:"loi roi hehehe" + error});
  }
  
})
module.exports = router;
