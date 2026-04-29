function genSeatMap(total, bookedStr = '') {
    const booked = bookedStr ? bookedStr.split(',').map(s => s.trim().toUpperCase()) : [];
    const rows = Math.ceil(total / 6);
    const seats = [];
    const avail = [];
    const bookedSeats = [];
    
    for (let i = 0; i < total; i++) {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const code = String.fromCharCode(65 + col) + (row + 1);
        
        if (booked.includes(code)) {
            bookedSeats.push(code);
        } else {
            avail.push(code);
        }
        
        seats.push({
            code: code,
            row: row + 1,
            column: col,
            isBooked: booked.includes(code)
        });
    }
    
    return {
        seats: seats,
        availableSeats: avail,
        bookedSeats: bookedSeats,
        totalSeats: total,
        availableCount: avail.length,
        bookedCount: bookedSeats.length,
        rows: rows
    };
}


function renderSeatMap(total, bookedStr = '') {
    const map = genSeatMap(total, bookedStr);
    let html = '<div class="seat-map">';
    
    let curRow = 0;
    let rowHtml = '<div class="seat-row">';
    
    for (let i = 0; i < map.seats.length; i++) {
        const seat = map.seats[i];
        if (seat.row !== curRow) {
            if (curRow > 0) {
                rowHtml += '</div>';
                html += rowHtml;
            }
            curRow = seat.row;
            rowHtml = `<div class="seat-row"><span class="row-label">Hàng ${curRow}</span>`;
        }
        
        const cls = seat.isBooked ? 'seat booked' : 'seat available';
        const seatHtml = `<button type="button" class="${cls}" data-seat="${seat.code}" 
                            ${seat.isBooked ? 'disabled' : 'onclick="toggleSeat(this)"'}
                            title="${seat.code}">
                            ${seat.code}
                          </button>`;
        rowHtml += seatHtml;
    }
    
    if (curRow > 0) {
        rowHtml += '</div>';
        html += rowHtml;
    }
    
    html += '</div>';
    
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


function toggleSeat(el) {
    el.classList.toggle('selected');
    updateSelectedSeats();
}

function updateSelectedSeats() {
    const selected = Array.from(document.querySelectorAll('.seat.selected'))
        .map(seat => seat.getAttribute('data-seat'));
    
    const inp = document.getElementById('seatSelect');
    if (inp) {
        inp.value = selected.join(', ');
        const evt = new Event('change', { bubbles: true });
        inp.dispatchEvent(evt);
    }
}

function initSeatMap(total, id, bookedStr = '') {
    const con = document.getElementById(id);
    if (con) {
        con.innerHTML = renderSeatMap(total, bookedStr);
    }
}

function clearSeats() {
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    updateSelectedSeats();
}

function autoSelectSeats(count) {
    clearSeats();
    const avail = Array.from(document.querySelectorAll('.seat.available'));
    
    for (let i = 0; i < count && i < avail.length; i++) {
        avail[i].classList.add('selected');
    }
    
    updateSelectedSeats();
}
