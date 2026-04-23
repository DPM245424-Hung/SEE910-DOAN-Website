var moongo = require('mongoose');
const { setMaxListeners } = require('./account');
var flightSchema = new moongo.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    numberseats: { type: Number, required: true },
    numberseats_pick: { type: Number, default: 0},
    airline: { type: String, required: true },
    from_airport: { type: String, required: true },
    flydate: { type: Date, required: true },
    to_airport: { type: String, required: true },
    airplane: { type: String, required: true },
    status: { type: String},
});
var flightModel = moongo.model('Flight', flightSchema);
module.exports = flightModel;