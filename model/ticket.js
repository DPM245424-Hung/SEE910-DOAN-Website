var moongo = require('mongoose');
var ticketSchema = new moongo.Schema({
    Hoten: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    datebooking: { type: Date, required: true },
    seatsplaced: { type: String, required: true },
    taikhoan: { type: moongo.Schema.Types.ObjectId, ref: 'Account' },
    chuyenbay: { type: moongo.Schema.Types.ObjectId, ref: 'Flight' },
});
var ticketModel = moongo.model('Ticket', ticketSchema);
module.exports = ticketModel;