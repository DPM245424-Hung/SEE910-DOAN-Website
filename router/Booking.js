var express = require('express');
var router = express.Router();
var ticket = require('../model/ticket');
var flight = require('../model/flights');
var account = require('../model/account');

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

router.post('/DatVe', async function(req, res, next) {
    try {
        const { Hoten, price, description, datebooking, seatsplaced, taikhoan, chuyenbay } = req.body;
        
        if (!Hoten || !seatsplaced || !chuyenbay) {
            return res.status(400).send('Missing required info');
        }
        
        const fltData = await flight.findById(chuyenbay);
        if (!fltData) {
            return res.status(404).send('Flight not found');
        }
        
        const seatCount = seatsplaced.split(',').filter(s => s.trim()).length;
        if (seatCount === 0) {
            return res.status(400).send('Select at least one seat');
        }
        
        const seatsLeft = fltData.numberseats - fltData.numberseats_pick;
        if (seatCount > seatsLeft) {
            return res.status(400).send('Not enough seats. Only ' + seatsLeft + ' available');
        }
        
        const newTkt = new ticket({
            Hoten,
            price: price || fltData.price,
            description,
            datebooking: datebooking || new Date(),
            seatsplaced,
            taikhoan,
            chuyenbay
        });
        await newTkt.save();
        
        await flight.findByIdAndUpdate(chuyenbay, {
            numberseats_pick: fltData.numberseats_pick + seatCount
        });
        
        res.redirect('/booking/DanhSachDatVe');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
});

router.get('/HuyVe/:id', async function(req, res, next) {
    try {
        const tktData = await ticket.findById(req.params.id);
        if (!tktData) {
            return res.status(404).send('Ticket not found');
        }
        
        const seatCount = tktData.seatsplaced.split(',').filter(s => s.trim()).length;
        
        const fltData = await flight.findById(tktData.chuyenbay);
        if (fltData) {
            await flight.findByIdAndUpdate(tktData.chuyenbay, {
                numberseats_pick: Math.max(0, fltData.numberseats_pick - seatCount)
            });
        }
        
        await ticket.findByIdAndDelete(req.params.id);
        res.redirect('/booking/DanhSachDatVe');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.get('/DanhSachDatVe', async function(req, res, next) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).send('Login required'); 
        }
        const userId = req.session.user._id;
        const query = { taikhoan: userId }; 
        const tickets = await ticket.find(query).populate('taikhoan').populate('chuyenbay');
        
        res.render('booked_user', { title: 'Danh sách đặt vé', tickets: tickets });
    }
    catch (error) {
        console.error("Error at /DanhSachDatVe: ", error); 
        res.status(500).send('Server error');
    }
});

router.get('/detail_ticket/:id', async function(req, res, next) {
    try {
        const tktData = await ticket.findById(req.params.id).populate('taikhoan').populate('chuyenbay');
        if (!tktData) {
            return res.status(404).send('Ticket not found');
        }
        if (req.session.user && (req.session.user._id == tktData.taikhoan._id || req.session.user.quyenhan === 'admin')) {
            res.render('booked_detail', { title: 'Chi tiết vé', ticket: tktData });
        } else {
            return res.status(403).send('Access denied');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;