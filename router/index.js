var express = require('express');
var router = express.Router();
var flight = require('../model/flights')
var account = require('../model/account')
// GET: Trang chủ
router.get('/', async (req, res) => {
	const flights = await flight.find();
	res.render('index', {
		title: 'Trang chủ', flights: flights
	});
});

module.exports = router;