var express = require('express');
var router = express.Router();
var account = require('../model/account');

// GET: Danh sách tài khoản
router.get('/DanhSach', async function(req, res, next) {
  try {
    const accounts = await account.find();
    res.render('account_list', { title: 'Danh sách tài khoản', accounts: accounts });
  }
  catch (error) {
    console.error(error);
    res.status(500).send('lỗi server');
  }
});
// get: thêm tài khoản
router.get('/Them', function(req, res, next) {
    res.render('account_add', { title: 'Thêm tài khoản' });
});

// post: thêm tài khoản
router.post('/Them', async function(req, res, next) {
    try {        
        const { Tentaikhoan, Email, MatKhau } = req.body;
        const newAccount = new account({
            Tentaikhoan, 
            Email, 
            MatKhau
        });
        await newAccount.save();
        res.redirect('/account/DanhSach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }

});

// get: xoá tài khoản
router.get('/Xoa/:id', async function(req, res, next) {
    try {
        await account.findByIdAndDelete(req.params.id);
        res.redirect('/account/DanhSach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// get: sửa tài khoản
router.get('/Sua/:id', async function(req, res, next) {
    try {
        const taikhoan = await account.findById(req.params.id);
        res.render('account_change', { title: 'Sửa tài khoản', account: taikhoan });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// post: sửa tài khoản
router.post('/Sua/:id', async function(req, res, next) {
    try {
        const { Tentaikhoan, Email ,MatKhau, quyenhan } = req.body;
        const updateData = {
            Tentaikhoan,
            Email,
        };
        if (MatKhau && MatKhau.trim() !== '') {
            updateData.MatKhau = MatKhau;
        }
        if (quyenhan) {
            updateData.quyenhan = quyenhan;
        }
        await account.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/account/DanhSach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// thông tin tài khoản cá nhân của người dùng
router.get('/ThongTin_admin/:id', async function(req, res, next) {
    try {
        const taikhoan = await account.findById(req.params.id);
        res.render('account_user_admin', { title: 'Thông tin tài khoản', account: taikhoan });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});
router.get('/ThongTin/:id', async function(req, res, next) {
    try {
        const taikhoan = await account.findById(req.params.id);
        res.render('account_user', { title: 'Thông tin tài khoản', account: taikhoan });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});
// get: sửa tài khoản cas nhan
router.get('/Sua_user/:id', async function(req, res, next) {
    try {
        const taikhoan = await account.findById(req.params.id);
        res.render('account_change_user', { title: 'Sửa tài khoản', account: taikhoan });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});
// sửa thông tin tài khoản cá nhân của người dùng
router.post('/Sua_user/:id', async function(req, res, next) {
    try {
        const { Tentaikhoan, Email, SoDienThoai, MatKhau } = req.body;
        const updateData = {
            Tentaikhoan,
            Email,
        };
        if (SoDienThoai && SoDienThoai.trim() !== '') {
            updateData.SoDienThoai = SoDienThoai;
        }
        if (MatKhau && MatKhau.trim() !== '') {
            updateData.MatKhau = MatKhau;
        }
        await account.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/account/ThongTin/' + req.params.id);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});
module.exports = router;