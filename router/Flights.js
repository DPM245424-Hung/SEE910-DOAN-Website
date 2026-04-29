var express = require('express');
var router = express.Router();
var flight = require('../model/flights');

async function delOldFlights() {
    try {
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        const result = await flight.deleteMany({ flydate: { $lt: sixDaysAgo } });
        console.log(`Deleted ${result.deletedCount} old flights`);
        return result.deletedCount;
    } catch (error) {
        console.error('Error deleting old flights:', error);
        return 0;
    }
}

router.get('/', async function(req, res, next) {
    try {
        await delOldFlights();
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
        await delOldFlights();
        const flights = await flight.find();
        res.render('flights_list', { title: 'Danh sách chuyến bay', flights: flights });
    }
    catch (error){
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.get('/Them', function(req, res, next) {
    res.render('fights_add', { title: 'Thêm chuyến bay' });
});

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

router.get('/Sua/:id', async function(req, res, next) {
    try {
        const flt = await flight.findById(req.params.id);
        res.render('flights_change', { title: 'Sửa chuyến bay', flight: flt });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

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

router.get('/ChiTiet/:id', async function(req, res, next) {
    try {
        const fltDetail = await flight.findById(req.params.id);
        res.render('flights_detail', { title: 'Chi tiết chuyến bay', flight: fltDetail });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('lỗi server');
    }
});

router.post('/cleanup-old-flights', async function(req, res, next) {
    try {
        const delCount = await delOldFlights();
        res.json({ 
            success: true, 
            message: `Deleted ${delCount} old flights`,
            deletedCount: delCount
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;