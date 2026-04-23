var mongoose = require('mongoose')
var taiKhoanSchema = new mongoose.Schema({
    Tentaikhoan: { type: String, required: true },
    MatKhau: { type: String, required: true },
    Email: { type: String, required: true },
    SoDienThoai: { type: String, default: 'N/A' },
    quyenhan: { type: String, default: 'user' },
});


var taiKhoanModel = mongoose.model('Account', taiKhoanSchema);
module.exports = taiKhoanModel;



