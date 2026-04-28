var mongoose = require('mongoose');
var ticketSchema = new mongoose.Schema({
    Hoten: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    datebooking: { type: Date, required: true },
    seatsplaced: { type: String, required: true },
    taikhoan: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    chuyenbay: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
});
var ticketModel = mongoose.model('Ticket', ticketSchema);
module.exports = ticketModel;