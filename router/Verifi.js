var express = require('express');
var router = express.Router();
var account = require('../model/account');
var bcrypt = require('bcryptjs'); 
// get đăng nhập
router.get('/dangnhap', (req, res) => {
    res.render('Login', {title: 'Đăng nhập'});
});
// post đăng nhập
router.post('/dangnhap', async (req, res) => {
    try {
        const { Email, MatKhau } = req.body;
        const user = await account.findOne({ Email });
        if (user) {
            const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
            if (isMatch) {
                req.session.user = user;
                req.session.quyenhan = user.quyenhan;
                req.session.success = 'Đăng nhập thành công';
                res.redirect('/');
            } else {
                req.session.error = 'Mật khẩu không đúng';
                res.redirect('/dangnhap');
            }
        } else {
            req.session.error = 'Email không tồn tại';
            res.redirect('/dangnhap');
        }
    } catch (error) {
        console.error(error);
        req.session.error = 'Lỗi server';
    }
});
// get đăng ký
router.get('/dangky', async (req, res) => {
    res.render('Join', {title: 'Đăng ký'});
});
// post đăng ký
router.post('/dangky', async (req, res) => {
    try {
        const { Tentaikhoan, Email, MatKhau } = req.body;
        const Pass = await bcrypt.hash(MatKhau, 10);
        const newAccount = new account({
            Tentaikhoan: Tentaikhoan,
            Email: Email,
            MatKhau: Pass
        });
        await newAccount.save();
        req.session.success = 'Đăng ký thành công';
        res.redirect('/dangnhap');
    } catch (error) {
        console.error(error);
        req.session.error = 'Đăng ký thất bại';
        res.redirect('/fail');
    }
});
// get đăng xuất
router.get('/dangxuat', (req, res) => {
    if(req.session.user) {
        delete req.session.user;
        delete req.session.quyenhan;
        req.session.success = 'Đăng xuất thành công';
        res.redirect('/');
    }
});

module.exports = router;