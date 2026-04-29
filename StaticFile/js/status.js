var flightdata = require('./setting_flight.js');

function getFlightStatus(flyDate) {
    const now = new Date();
    const flightTime = new Date(flyDate);
    const diff = flightTime - now;
    const day = 24 * 60 * 60 * 1000;
    
    if (diff <= -day * 6) {
        delete flightdata.seats;
        return { 
            status: 'Đã Hủy', 
            class: 'bg-secondary', 
            isAvailable: false 
        };
    } 
    else if (diff <= -day) {
        return { 
            status: 'Đã Hạ Cánh', 
            class: 'bg-danger', 
            isAvailable: false 
        };
    } 
    else if (diff <= 0) {
        return { 
            status: 'Đang Bay', 
            class: 'bg-warning', 
            isAvailable: false 
        };
    } 
    // Chưa bay (chuyến bay trong tương lai)
    else {
        return { 
            status: 'Sẽ Bay', 
            class: 'bg-success', 
            isAvailable: true 
        };
    }
}


function updateBookingFlightStatuses() {
    document.querySelectorAll('.flight-item').forEach(item => {
        const flyDate = item.getAttribute('data-flydate');
        const badge = item.querySelector('.flight-status-badge-booking');
        const info = getFlightStatus(flyDate);
        
        if (badge) {
            badge.textContent = info.status;
            badge.className = `flight-status-badge-booking badge ${info.class}`;
        }
        
        if (!info.isAvailable) {
            item.style.opacity = '0.6';
            item.style.pointerEvents = 'none';
            item.style.cursor = 'not-allowed';
        } else {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            item.style.cursor = 'pointer';
        }
    });
}


function updateTicketStatuses() {
    document.querySelectorAll('.flight-status').forEach(badge => {
        const flyDate = badge.getAttribute('data-flydate');
        const info = getFlightStatus(flyDate);
        badge.textContent = info.status;
        badge.className = `flight-status badge ${info.class}`;
        
        const row = badge.closest('tr');
        if (row) {
            const btns = row.querySelectorAll('.flight-actions a, .flight-actions .btn-cancel-ticket');
            btns.forEach(btn => {
                btn.disabled = !info.isAvailable;
                btn.style.opacity = info.isAvailable ? '1' : '0.5';
                btn.style.pointerEvents = info.isAvailable ? 'auto' : 'none';
            });
        }
    });

    document.querySelectorAll('.flight-status-mobile').forEach(badge => {
        const flyDate = badge.getAttribute('data-flydate');
        const info = getFlightStatus(flyDate);
        badge.textContent = info.status;
        badge.className = `flight-status-mobile badge ${info.class}`;
        
        const card = badge.closest('.ticket-card');
        if (card) {
            const btns = card.querySelectorAll('a, .btn-cancel-ticket-mobile');
            btns.forEach(btn => {
                btn.disabled = !info.isAvailable;
                btn.style.opacity = info.isAvailable ? '1' : '0.5';
                btn.style.pointerEvents = info.isAvailable ? 'auto' : 'none';
            });
        }
    });
}


function updateDetailFlightStatus() {
    document.querySelectorAll('.flight-status-detail').forEach(badge => {
        const flyDate = badge.getAttribute('data-flydate');
        const info = getFlightStatus(flyDate);
        badge.textContent = info.status;
        badge.className = `flight-status-detail badge ${info.class}`;
    });

    document.querySelectorAll('.flight-status-summary').forEach(badge => {
        const flyDate = badge.getAttribute('data-flydate');
        const info = getFlightStatus(flyDate);
        badge.textContent = info.status;
        badge.className = `flight-status-summary badge ${info.class}`;
    });

    const cancelBtn = document.querySelector('.ticket-cancel-btn');
    if (cancelBtn) {
        const flyDate = cancelBtn.getAttribute('data-flydate');
        const info = getFlightStatus(flyDate);
        
        if (!info.isAvailable) {
            cancelBtn.disabled = true;
            cancelBtn.textContent = '❌ Không thể hủy (Chuyến bay không khả dụng)';
            cancelBtn.style.cursor = 'not-allowed';
            cancelBtn.className = 'btn btn-secondary ticket-cancel-btn';
        } else {
            cancelBtn.disabled = false;
            cancelBtn.textContent = '<i class="bi bi-trash me-1"></i> Hủy Vé';
            cancelBtn.style.cursor = 'pointer';
            cancelBtn.className = 'btn btn-danger ticket-cancel-btn';
        }
    }
}

function updateFlightStatuses() {
    document.querySelectorAll('.flight-row').forEach(row => {
        const flyDate = row.getAttribute('data-flydate');
        const badge = row.querySelector('.flight-status-badge');
        const btn = row.querySelector('.flight-action-btn');
        const info = getFlightStatus(flyDate);
        
        if (badge) {
            badge.textContent = info.status;
            badge.className = `flight-status-badge badge ${info.class}`;
        }
        
        if (btn) {
            if (!info.isAvailable) {
                if (btn.tagName === 'A') {
                    const newBtn = document.createElement('button');
                    newBtn.className = 'btn btn-sm btn-secondary flight-action-btn';
                    newBtn.disabled = true;
                    newBtn.textContent = 'Không có sẵn';
                    btn.parentNode.replaceChild(newBtn, btn);
                } else {
                    btn.disabled = true;
                    btn.textContent = 'Không có sẵn';
                    btn.className = 'btn btn-sm btn-secondary flight-action-btn';
                }
            }
        }
    });
}

function initFlightStatusUpdater(updateFunction) {
    if (updateFunction && typeof updateFunction === 'function') {
        updateFunction();
        setInterval(updateFunction, 10000);
    }
}
