var express = require('express');
var router = express.Router();
var account = require('../model/account');
var bcrypt = require('bcryptjs'); 

router.get('/dangnhap', (req, res) => {
    res.render('Login', {title: 'Đăng nhập'});
});

router.post('/dangnhap', async (req, res) => {
    try {
        const { Email, MatKhau } = req.body;
        const user = await account.findOne({ Email });
        if (user) {
            const isOk = await bcrypt.compare(MatKhau, user.MatKhau);
            if (isOk) {
                req.session.user = user;
                req.session.quyenhan = user.quyenhan;
                req.session.success = 'Login success';
                res.redirect('/');
            } else {
                req.session.error = 'Wrong password';
                res.redirect('/dangnhap');
            }
        } else {
            req.session.error = 'Email not found';
            res.redirect('/dangnhap');
        }
    } catch (error) {
        console.error(error);
        req.session.error = 'Server error';
    }
});

router.get('/dangky', async (req, res) => {
    res.render('Join', {title: 'Đăng ký'});
});

router.post('/dangky', async (req, res) => {
    try {
        const { Tentaikhoan, Email, MatKhau } = req.body;
        const pwd = await bcrypt.hash(MatKhau, 10);
        const newAcc = new account({
            Tentaikhoan: Tentaikhoan,
            Email: Email,
            MatKhau: pwd
        });
        await newAcc.save();
        req.session.success = 'Signup success';
        res.redirect('/dangnhap');
    } catch (error) {
        console.error(error);
        req.session.error = 'Signup failed';
        res.redirect('/fail');
    }
});

router.get('/dangxuat', (req, res) => {
    if(req.session.user) {
        delete req.session.user;
        delete req.session.quyenhan;
        req.session.success = 'Logout success';
        res.redirect('/');
    }
});

module.exports = router;