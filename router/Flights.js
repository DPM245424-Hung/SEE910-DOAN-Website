var express = require('express');
var router = express.Router();
var flight = require('../model/flights');
// GET: danh sách chuyến bay
router.get('/', async function(req, res, next) {
    try {
        const flights = await flight.find();
        res.render('flights_schedule', { title: 'Danh sách chuyến bay', flights: flights });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});
router.get('/danhsach', async function(req, res, next) {
    try{
        const flights = await flight.find();
        res.render('flights_list', { title: 'Danh sách chuyến bay', flights: flights });
    }
    catch (error){
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// get: thêm chuyến bay
router.get('/Them', function(req, res, next) {
    res.render('fights_add', { title: 'Thêm chuyến bay' });
});

// post: thêm chuyến bay
router.post('/Them', async function(req, res, next) {
    try {
        const { name, numberseats, airline, airplane, from_airport, to_airport, flydate, price, status } = req.body;
        const newFlight = new flight({
            name,
            numberseats,
            airline,
            airplane,
            from_airport,
            to_airport,
            flydate,
            price,
            status: status || 'active',
            numberseats_pick: 0
        });
        await newFlight.save();
        res.redirect('/flight/danhsach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// get: sửa chuyến bay
router.get('/Sua/:id', async function(req, res, next) {
    try {
        const chuyenbay = await flight.findById(req.params.id);
        res.render('flights_change', { title: 'Sửa chuyến bay', flight: chuyenbay });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// post: sửa chuyến bay
router.post('/Sua/:id', async function(req, res, next) {
    try {
        const { name, numberseats, airline, airplane, from_airport, to_airport, flydate, price, status } = req.body;
        await flight.findByIdAndUpdate(req.params.id, {
            name,
            numberseats,
            airline,
            airplane,
            from_airport,
            to_airport,
            flydate,
            price,
            status
        });
        res.redirect('/flight/danhsach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// get: xoá chuyến bay
router.get('/Xoa/:id', async function(req, res, next) {
    try {
        await flight.findByIdAndDelete(req.params.id);
        res.redirect('/flight/danhsach');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

// get: chi tiết chuyến bay
router.get('/ChiTiet/:id', async function(req, res, next) {
    try {
        const flightDetail = await flight.findById(req.params.id);
        res.render('flights_detail', { title: 'Chi tiết chuyến bay', flight: flightDetail });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

module.exports = router;