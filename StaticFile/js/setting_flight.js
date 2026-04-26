/**
 * Hàm tính toán vị trí ngồi 
 * @param {number} totalSeats - Tổng số ghế trên máy bay
 * @param {array} bookedSeats - Danh sách ghế đã đặt
 * @returns {object} - Chứa available và booked seats */
function generateSeatMap(totalSeats, bookedSeatsString = '') {
    const bookedArray = bookedSeatsString 
        ? bookedSeatsString.split(',').map(s => s.trim().toUpperCase()) 
        : [];
    
    const rows = Math.ceil(totalSeats / 6); // 6 ghế mỗi hàng (A-F)
    const seats = [];
    const availableSeats = [];
    const bookedSeats = [];
    
    for (let i = 0; i < totalSeats; i++) {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const seatCode = String.fromCharCode(65 + col) + (row + 1); // A1, B1, C1...
        
        if (bookedArray.includes(seatCode)) {
            bookedSeats.push(seatCode);
        } else {
            availableSeats.push(seatCode);
        }
        
        seats.push({
            code: seatCode,
            row: row + 1,
            column: col,
            isBooked: bookedArray.includes(seatCode)
        });
    }
    
    return {
        seats: seats,
        availableSeats: availableSeats,
        bookedSeats: bookedSeats,
        totalSeats: totalSeats,
        availableCount: availableSeats.length,
        bookedCount: bookedSeats.length,
        rows: rows
    };
}

/**
 * hiển thị bản đồ ghế
 * @param {number} totalSeats - Tổng số ghế
 * @param {string} bookedSeatsString - Chuỗi ghế đã đặt
 * @returns {string} - HTML của bản đồ ghế
 */
function renderSeatMap(totalSeats, bookedSeatsString = '') {
    const map = generateSeatMap(totalSeats, bookedSeatsString);
    let html = '<div class="seat-map">';
    
    // Render theo hàng
    let currentRow = 0;
    let rowHtml = '<div class="seat-row">';
    
    for (let i = 0; i < map.seats.length; i++) {
        const seat = map.seats[i];
        // Nếu đổi hàng, đóng hàng cũ và mở hàng mới
        if (seat.row !== currentRow) {
            if (currentRow > 0) {
                rowHtml += '</div>';
                html += rowHtml;
            }
            currentRow = seat.row;
            rowHtml = `<div class="seat-row"><span class="row-label">Hàng ${currentRow}</span>`;
        }
        
        // Render ghế
        const seatClass = seat.isBooked ? 'seat booked' : 'seat available';
        const seatHtml = `<button type="button" class="${seatClass}" data-seat="${seat.code}" 
                            ${seat.isBooked ? 'disabled' : 'onclick="toggleSeat(this)"'}
                            title="${seat.code}">
                            ${seat.code}
                          </button>`;
        rowHtml += seatHtml;
    }
    
    // Đóng hàng cuối cùng
    if (currentRow > 0) {
        rowHtml += '</div>';
        html += rowHtml;
    }
    
    html += '</div>';
    
    // Thêm chú thích
    html += `<div class="seat-legend">
                <div class="legend-item">
                    <span class="seat available"></span> Ghế Trống
                </div>
                <div class="legend-item">
                    <span class="seat booked"></span> Ghế Đã Đặt
                </div>
                <div class="legend-item">
                    <span class="seat selected"></span> Ghế Được Chọn
                </div>
            </div>
            <div class="seat-info">
                <p>Ghế còn lại: <strong>${map.availableCount}</strong> / <strong>${map.totalSeats}</strong></p>
            </div>`;
    
    return html;
}

/**
 * Hàm chọn/bỏ chọn ghế
 * @param {element} element - Nút ghế được click
 */
function toggleSeat(element) {
    element.classList.toggle('selected');
    updateSelectedSeats();
}

/**
 * Hàm cập nhật danh sách ghế được chọn
 */
function updateSelectedSeats() {
    const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'))
        .map(seat => seat.getAttribute('data-seat'));
    
    const seatSelectInput = document.getElementById('seatSelect');
    if (seatSelectInput) {
        seatSelectInput.value = selectedSeats.join(', ');
        
        // Trigger change event để cập nhật giá
        const event = new Event('change', { bubbles: true });
        seatSelectInput.dispatchEvent(event);
    }
}

/**
 * Hàm khởi tạo bản đồ ghế khi trang tải
 * @param {number} totalSeats - Tổng số ghế
 * @param {string} containerId - ID của phần tử chứa bản đồ ghế
 * @param {string} bookedSeatsString - Ghế đã đặt
 */
function initSeatMap(totalSeats, containerId, bookedSeatsString = '') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = renderSeatMap(totalSeats, bookedSeatsString);
    }
}

/**
 * Hàm xoá chọn tất cả ghế
 */
function clearAllSeats() {
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    updateSelectedSeats();
}

/**
 * Hàm chọn ghế được đề xuất (tự động chọn ghế trống đầu tiên)
 * @param {number} count - Số ghế cần chọn
 */
function autoSelectSeats(count) {
    clearAllSeats();
    const availableSeats = Array.from(document.querySelectorAll('.seat.available'));
    
    for (let i = 0; i < count && i < availableSeats.length; i++) {
        availableSeats[i].classList.add('selected');
    }
    
    updateSelectedSeats();
}
