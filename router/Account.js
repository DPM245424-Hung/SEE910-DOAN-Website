var express = require('express');
var router = express.Router();
var account = require('../model/account');

router.get('/DanhSach', async function(req, res, next) {
  try {
    const accs = await account.find();
    res.render('account_list', { title: 'Danh sách tài khoản', accounts: accs });
  }
  catch (error) {
    console.error(error);
    res.status(500).send('lỗi server');
  }
});

router.get('/Them', function(req, res, next) {
    res.render('account_add', { title: 'Thêm tài khoản' });
});

router.post('/Them', async function(req, res, next) {
    try {        
        const { Tentaikhoan, Email, MatKhau } = req.body;
        const newAcc = new account({
            Tentaikhoan, 
            Email, 
            MatKhau
        });
        await newAcc.save();
        res.redirect('/account/DanhSach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

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

router.get('/Sua/:id', async function(req, res, next) {
    try {
        const acc = await account.findById(req.params.id);
        res.render('account_change', { title: 'Sửa tài khoản', account: acc });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.post('/Sua/:id', async function(req, res, next) {
    try {
        const { Tentaikhoan, Email ,MatKhau, quyenhan } = req.body;
        const upd = {
            Tentaikhoan,
            Email,
        };
        if (MatKhau && MatKhau.trim() !== '') {
            upd.MatKhau = MatKhau;
        }
        if (quyenhan) {
            upd.quyenhan = quyenhan;
        }
        await account.findByIdAndUpdate(req.params.id, upd);
        res.redirect('/account/DanhSach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.get('/ThongTin_admin/:id', async function(req, res, next) {
    try {
        const acc = await account.findById(req.params.id);
        res.render('account_user_admin', { title: 'Thông tin tài khoản', account: acc });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.get('/ThongTin/:id', async function(req, res, next) {
    try {
        const acc = await account.findById(req.params.id);
        res.render('account_user', { title: 'Thông tin tài khoản', account: acc });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.get('/Sua_user/:id', async function(req, res, next) {
    try {
        const acc = await account.findById(req.params.id);
        res.render('account_change_user', { title: 'Sửa tài khoản', account: acc });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.post('/Sua_user/:id', async function(req, res, next) {
    try {
        const { Tentaikhoan, Email, SoDienThoai, MatKhau } = req.body;
        const upd = {
            Tentaikhoan,
            Email,
        };
        if (SoDienThoai && SoDienThoai.trim() !== '') {
            upd.SoDienThoai = SoDienThoai;
        }
        if (MatKhau && MatKhau.trim() !== '') {
            upd.MatKhau = MatKhau;
        }
        await account.findByIdAndUpdate(req.params.id, upd);
        res.redirect('/account/ThongTin/' + req.params.id);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

module.exports = router;