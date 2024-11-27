var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

var productModel = require("../models/productModel");
var upload = require("../utill/uploadConfig");
var JWT = require("jsonwebtoken");
var config = require("../utill/tokenConfig");


router.get("/all", async function (req, res) {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
        JWT.verify(token, config.SECRETKEY, async function (err, id) {
            if (err) {
                res.status(403).json({ "status": 403, "err": err });
            } else {
                var list = await productModel.find().populate("user");
                res.status(200).json({status: true, message:"thanh cong", data:list});
            }
        });
    } else {
        res.status(401).json({ "status": 401 });
    }

});


router.get("/get-ds-so-luong-lon-hon-20", async function (req, res) {
    try {
        const { count } = req.query;
        var detail = await productModel.find({ soluong: { $gt: count } });
        res.status(200).json(detail);
    } catch (error) {
        res.status(400).json({ status: false, message: "ko tim dc" });
    }
});

// thêm (post)
router.post("/add", async function (req, res) {
    try {
        const { masp, tensp, gia, soluong } = req.body;
        const newItem = { masp, tensp, gia, soluong }; // có thể bắt validate bằng if else 
        await productModel.create(newItem);
        res.status(200).json({ status: true, message: "Successfully added" });
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});


// sửa (put)
router.put("/edit", async function (req, res) {
    try {
        const { id, masp, tensp, gia, soluong } = req.body;
        var itemUpdate = await productModel.findById(id);
        if (itemUpdate) {
            itemUpdate.masp = masp ? masp : itemUpdate.masp;
            itemUpdate.tensp = tensp ? tensp : itemUpdate.tensp;
            itemUpdate.gia = gia ? gia : itemUpdate.gia;
            itemUpdate.soluong = soluong ? soluong : itemUpdate.soluong;
            await itemUpdate.save();
            res.status(200).json({ status: true, message: "Successfully edit" });
        } else {
            res.status(404).json({ status: false, message: "Sản phẩm không tìm thấy" });
        }

    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// xóa (delete)
router.delete("/delete/:id", async function (req, res) {
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        res.status(200).json({ status: true, message: "Successfully delete" });
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});


router.post('/upload', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                return res.json({ status: 0, link: "" });
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: "" });
        }
    });



router.post('/uploads', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
                return res.json({ status: 0, link: [] });
            } else {
                const url = [];
                for (const singleFile of files) {
                    url.push(`http://localhost:3000/images/${singleFile.filename}`);
                }
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: [] });
        }
    });

module.exports = router;