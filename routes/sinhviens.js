var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

var sinhVienModel = require("../models/sinhvienModel");
const sendMail = require("../utill/mailConfig");




// 1. Lấy toàn bộ danh sách sinh viên
// localhost:3000/sinhviens/all
router.get("/all", async function (req, res) {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
        JWT.verify(token, config.SECRETKEY, async function (err, id) {
            if (err) {
                res.status(403).json({ "status": 403, "err": err });
            } else {
                var list = await sinhVienModel.find();
                res.status(200).json({status: true, message:"thanh cong", data:list});
            }
        });
    } else {
        res.status(401).json({ "status": 401 });
    }
    // try {
    //     var list = await sinhVienModel.find();
    //     res.status(200).json({ status: true, message: "Thành công", data: list });
    // } catch (error) {
    //     res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    // }

});


// 2. Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
// localhost:3000/sinhviens/get-sinhviens-by-cntt?boMon=CNTT
router.get("/get-sinhviens-by-cntt", async function (req, res) {
    try {
        const {boMon} = req.query;
        const sinhVien = await sinhVienModel.find({bomon: boMon});
        res.status(200).json(sinhVien);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});


// 3. Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
// localhost:3000/sinhviens/get-sinhviens-by-diemtb?min=6.5&max=8.5
router.get("/get-sinhviens-by-diemTB", async function (req, res) {
    try {
        const { min, max } = req.query;
        const sinhVien = await sinhVienModel.find({ diemtb: { $gte: min, $lte: max } });
        res.status(200).json(sinhVien);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }

})

// 4. Tìm kiếm thông tin của sinh viên theo MSSV
// localhost:3000/sinhviens/get-sinhvien-by-mssv?MSSV=
router.get("/get-sinhvien-by-mssv", async function (req, res) {
    try {
        const { MSSV } = req.query;
        const sinhVien = await sinhVienModel.findOne({ mssv: MSSV });
        if (!sinhVien) {
            return res.status(404).json({ status: false, message: "Không tìm thấy sinh viên" });
        }
        res.status(200).json(sinhVien);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});


// 5. Thêm mới một sinh viên mới
// localhost:3000/sinhviens/add-sinhvien
router.post("/add-sinhvien", async function (req, res) {
    try {
        const sinhVien = new sinhVienModel(req.body);
        await sinhVien.save();
        res.status(201).json({ status: true, message: "Thêm sinh viên thành công", sinhVien });
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra", error: e.message });
    }
});


// 6. Thay đổi thông tin sinh viên theo MSSV
// localhost:3000/sinhviens/update-sinhvien-by-mssv?mssv=
router.put("/update-sinhvien-by-mssv", async function (req, res) {
    try {
        const { mssv } = req.query;
        const sinhVien = await sinhVienModel.findOneAndUpdate({ mssv: mssv }, req.body, { new: true });
        if (!sinhVien) {
            return res.status(404).json({ status: false, message: "Không tìm thấy sinh viên" });
        }
        res.status(200).json({ status: true, message: "Cập nhật sinh viên thành công", sinhVien });
    } catch (e) {
res.status(400).json({ status: false, message: "Có lỗi xảy ra", error: e.message });
    }
});

// 7. Xóa một sinh viên ra khỏi danh sách
// localhost:3000/sinhviens/delete-sinhvien-by-mssv?mssv=
router.delete("/delete-sinhvien-by-mssv", async function (req, res) {
    try {
        const { mssv } = req.query;
        const sinhVien = await sinhVienModel.findOneAndDelete({ mssv: mssv });
        if (!sinhVien) {
            return res.status(404).json({ status: false, message: "Không tìm thấy sinh viên" });
        }
        res.status(200).json({ status: true, message: "Xóa sinh viên thành công", sinhVien });
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra", error: e.message });
    }
});

// 8. Lấy danh sách các sinh viên thuộc bộ môn CNTT và có điểm trung bình từ 9.0
// localhost:3000/sinhviens/get-sinhviens-cntt-tb?boMon=CNTT&diemTB=
router.get("/get-sinhviens-cntt-tb", async function (req, res) {
    try {
        const {boMon, diemTB} = req.query;
        const list = await sinhVienModel.find({ bomon: boMon, diemtb: { $gte: diemTB } });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// 9. Lấy danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
// localhost:3000/sinhviens/get-sinhviens-tuoi-dtb
// localhost:3000/sinhviens/get-sinhviens-tuoi-dtb?boMon=CNTT&tuoi1=18&tuoi2=20&diemTB=6.5
router.get("/get-sinhviens-tuoi-dtb", async function (req, res) {
    try {
        const { boMon, tuoi1, tuoi2, diemTB } = req.query;
        const list = await sinhVienModel.find({
            bomon: boMon,
            tuoi: { $gte: tuoi1, $lte: tuoi2 },
            diemtb: { $gte: diemTB }
        });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// 10. Sắp xếp danh sách sinh viên tăng dần theo điểm trung bình
// localhost:3000/sinhviens/get-sinhviens-sorted-by-diemTB
router.get("/get-sinhviens-sorted-by-diemTB", async function (req, res) {
    try {
        const list = await sinhVienModel.find().sort({ diemtb: 1 });
        res.status(200).json(list);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

// 11. Tìm sinh viên có điểm trung bình cao nhất thuộc bộ môn CNTT
// localhost:3000/sinhviens/get-top-sinhvien-cntt
router.get("/get-top-sinhvien-cntt", async function (req, res) {
    try {
        const {boMon} = req.query;
        const sinhVien = await sinhVienModel.findOne({ bomon: boMon }).sort({ diemtb: -1 });
        if (!sinhVien) {
            return res.status(404).json({ status: false, message: "Không tìm thấy sinh viên" });
        }
        res.status(200).json(sinhVien);
    } catch (e) {
        res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
    }
});

//localhost:3000/sinhviens/max-student
router.get("/max-student", async (req, res, next) => {
    try {
        const {boMon} = req.query;
        const maxStudentScore = await sinhVienModel.findOne({ bomon: boMon }).sort({diemtb: -1});
        const listMaxStudentScore = await sinhVienModel.find({diemtb: maxStudentScore.diemtb});
        res.status(200).json({status: true, message: "Successfully", data: listMaxStudentScore});

    } catch (e) {
        res.status(400).json({status: false, message: "Error: " + e });
    }
});

// Import module File System đùng để đọc, thêm xóa sửa
const fs = require("fs");
// Import module để xử lý đường dẫn file, đảm bảo đúng cú pháp
const path = require("path");

router.post("/send-mail", async function (req, res, next) {
  try {
    const { to, subject, htmlFilePath } = req.body;

    // Đọc nội dung file HTML
    const filePath = path.join(__dirname, "..", "html","email.html"); // Đường dẫn file HTML
    const htmlContent = fs.readFileSync(filePath, "utf8");

    const mailOptions = {
      from: "Nguyen Tien si <tiiensibo2706@gmail.com>",
      to: to,
      subject: subject,
      html: htmlContent,
    };

    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công" });
  } catch (err) {
    console.error(err);
    res.json({ status: 0, message: "Gửi mail thất bại" });
  }
});
module.exports = router;