var express = require('express');
var router = express.Router();
var ticket = require('../model/ticket');
var flight = require('../model/flights');
var account = require('../model/account');
// get: trang đặt vé
router.get('/', async function(req, res, next) {
    try {
        const flights = await flight.find();
        res.render('booking', { title: 'Đặt vé máy bay', flights: flights });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// post: đặt vé
router.post('/DatVe', async function(req, res, next) {
    try {
        const { Hoten, price, description, datebooking, seatsplaced, taikhoan, chuyenbay } = req.body;
        
        // Kiểm tra các trường bắt buộc
        if (!Hoten || !seatsplaced || !chuyenbay) {
            return res.status(400).send('Thiếu thông tin bắt buộc');
        }
        
        // Kiểm tra chuyến bay tồn tại
        const flightData = await flight.findById(chuyenbay);
        if (!flightData) {
            return res.status(404).send('Chuyến bay không tồn tại');
        }
        
        // Đếm số ghế được đặt
        const seatCount = seatsplaced.split(',').filter(s => s.trim()).length;
        if (seatCount === 0) {
            return res.status(400).send('Vui lòng chọn ít nhất một ghế');
        }
        
        // Kiểm tra số ghế còn lại
        const seatsRemaining = flightData.numberseats - flightData.numberseats_pick;
        if (seatCount > seatsRemaining) {
            return res.status(400).send('Số ghế yêu cầu vượt quá số ghế còn lại. Chỉ còn ' + seatsRemaining + ' ghế');
        }
        
        // Tạo vé mới
        const newTicket = new ticket({
            Hoten,
            price: price || flightData.price,
            description,
            datebooking: datebooking || new Date(),
            seatsplaced,
            taikhoan,
            chuyenbay
        });
        await newTicket.save();
        
        // Cập nhật số ghế đã đặt của chuyến bay
        await flight.findByIdAndUpdate(chuyenbay, {
            numberseats_pick: flightData.numberseats_pick + seatCount
        });
        
        res.redirect('/booking/DanhSachDatVe');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Lỗi: ' + error.message);
    }
});

// get: hủy vé
router.get('/HuyVe/:id', async function(req, res, next) {
    try {
        // Lấy thông tin vé trước khi xoá
        const ticketData = await ticket.findById(req.params.id);
        if (!ticketData) {
            return res.status(404).send('Vé không tồn tại');
        }
        
        // Đếm số ghế đã xoá
        const seatCount = ticketData.seatsplaced.split(',').filter(s => s.trim()).length;
        
        // Cập nhật số ghế đã đặt của chuyến bay (giảm)
        const flightData = await flight.findById(ticketData.chuyenbay);
        if (flightData) {
            await flight.findByIdAndUpdate(ticketData.chuyenbay, {
                numberseats_pick: Math.max(0, flightData.numberseats_pick - seatCount)
            });
        }
        
        // Xoá vé
        await ticket.findByIdAndDelete(req.params.id);
        res.redirect('/booking/DanhSachDatVe');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// get: danh sách đặt vé
router.get('/DanhSachDatVe', async function(req, res, next) {
    try {
        try {
        if (!req.session || !req.session.user) {
            return res.status(401).send('Bạn cần đăng nhập để xem danh sách vé'); 
        }
        const userId = req.session.user._id;
        const query = { taikhoan: userId }; 
        const tickets = await ticket.find(query).populate('taikhoan').populate('chuyenbay');
        
        res.render('booked_user', { title: 'Danh sách đặt vé', tickets: tickets });
    }
    catch (error) {
        // In ra lỗi cụ thể trong console để dễ debug hơn
        console.error("Lỗi ở /DanhSachDatVe: ", error); 
        res.status(500).send('Lỗi server rồi');
    }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server rồi');
    }
});
// get: chi tiết vé
router.get('/detail_ticket/:id', async function(req, res, next) {
    try {
        const ticketData = await ticket.findById(req.params.id).populate('taikhoan').populate('chuyenbay');
        if (!ticketData) {
            return res.status(404).send('Vé không tồn tại');
        }
        
        // Kiểm tra quyền: chỉ chủ sở hữu hoặc admin mới được xem
        if (req.session.user && (req.session.user._id == ticketData.taikhoan._id || req.session.user.quyenhan === 'admin')) {
            res.render('booked_user', { title: 'Chi tiết vé', tickets: ticketData });
        } else {
            return res.status(403).send('Bạn không có quyền xem vé này');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server rồi');
    }
});
module.exports = router;