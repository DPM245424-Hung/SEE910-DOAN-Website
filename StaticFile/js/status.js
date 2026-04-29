/**
 * Hàm kiểm tra trạng thái chuyến bay dựa trên thời gian
 * @param {string|Date} flyDate - Ngày giờ cất cánh của chuyến bay
 * @returns {object} - Object chứa { status, class, isAvailable }
 * 
 * Trạng thái:
 * - "Sẽ Bay" (bg-success): Chuyến bay chưa cất cánh (> 1 ngày)
 * - "Đang Bay" (bg-warning): Chuyến bay bằng hoặc vượt nhưng < 1 ngày
 * - "Đã Hạ Cánh" (bg-danger): Chuyến bay đã bay quá 1 ngày
 */
function getFlightStatus(flyDate) {
    const now = new Date();
    const flightTime = new Date(flyDate);
    const timeDiff = flightTime - now;
    const oneDayMs = 24 * 60 * 60 * 1000; // Một ngày tính bằng milli giây
    
    if (timeDiff <= 0 && timeDiff > -oneDayMs) {
        // Bằng hoặc vượt quá dưới 1 ngày (âm nhưng không quá 1 ngày)
        return { 
            status: 'Đang Bay', 
            class: 'bg-warning', 
            isAvailable: false 
        };
    } else if (timeDiff <= -oneDayMs) {
        // Vượt quá 1 ngày
        return { 
            status: 'Đã Hạ Cánh', 
            class: 'bg-danger', 
            isAvailable: false 
        };
    } else {
        // Chưa bay
        return { 
            status: 'Sẽ Bay', 
            class: 'bg-success', 
            isAvailable: true 
        };
    }
}

/**
 * Cập nhật trạng thái chuyến bay cho page booking.ejs
 */
function updateBookingFlightStatuses() {
    document.querySelectorAll('.flight-item').forEach(item => {
        const flyDate = item.getAttribute('data-flydate');
        const statusBadge = item.querySelector('.flight-status-badge-booking');
        const statusInfo = getFlightStatus(flyDate);
        
        if (statusBadge) {
            statusBadge.textContent = statusInfo.status;
            statusBadge.className = `flight-status-badge-booking badge ${statusInfo.class}`;
        }
        
        // Disable/Enable item dựa trên trạng thái
        if (!statusInfo.isAvailable) {
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

/**
 * Cập nhật trạng thái vé cho page booked_user.ejs
 */
function updateTicketStatuses() {
    // Cập nhật cho bảng desktop
    document.querySelectorAll('.flight-status').forEach(statusBadge => {
        const flyDate = statusBadge.getAttribute('data-flydate');
        const statusInfo = getFlightStatus(flyDate);
        statusBadge.textContent = statusInfo.status;
        statusBadge.className = `flight-status badge ${statusInfo.class}`;
        
        // Disable/Enable nút hành động dựa trên trạng thái
        const row = statusBadge.closest('tr');
        if (row) {
            const actionBtns = row.querySelectorAll('.flight-actions a, .flight-actions .btn-cancel-ticket');
            actionBtns.forEach(btn => {
                btn.disabled = !statusInfo.isAvailable;
                btn.style.opacity = statusInfo.isAvailable ? '1' : '0.5';
                btn.style.pointerEvents = statusInfo.isAvailable ? 'auto' : 'none';
            });
        }
    });

    // Cập nhật cho mobile cards
    document.querySelectorAll('.flight-status-mobile').forEach(statusBadge => {
        const flyDate = statusBadge.getAttribute('data-flydate');
        const statusInfo = getFlightStatus(flyDate);
        statusBadge.textContent = statusInfo.status;
        statusBadge.className = `flight-status-mobile badge ${statusInfo.class}`;
        
        // Disable/Enable nút hành động
        const card = statusBadge.closest('.ticket-card');
        if (card) {
            const actionBtns = card.querySelectorAll('a, .btn-cancel-ticket-mobile');
            actionBtns.forEach(btn => {
                btn.disabled = !statusInfo.isAvailable;
                btn.style.opacity = statusInfo.isAvailable ? '1' : '0.5';
                btn.style.pointerEvents = statusInfo.isAvailable ? 'auto' : 'none';
            });
        }
    });
}

/**
 * Cập nhật trạng thái chuyến bay cho page booked_detail.ejs
 */
function updateDetailFlightStatus() {
    // Cập nhật trong chi tiết chuyến bay
    document.querySelectorAll('.flight-status-detail').forEach(badge => {
        const flyDate = badge.getAttribute('data-flydate');
        const statusInfo = getFlightStatus(flyDate);
        badge.textContent = statusInfo.status;
        badge.className = `flight-status-detail badge ${statusInfo.class}`;
    });

    // Cập nhật trong tóm tắt vé bên phải
    document.querySelectorAll('.flight-status-summary').forEach(badge => {
        const flyDate = badge.getAttribute('data-flydate');
        const statusInfo = getFlightStatus(flyDate);
        badge.textContent = statusInfo.status;
        badge.className = `flight-status-summary badge ${statusInfo.class}`;
    });

    // Cập nhật nút hủy vé
    const cancelBtn = document.querySelector('.ticket-cancel-btn');
    if (cancelBtn) {
        const flyDate = cancelBtn.getAttribute('data-flydate');
        const statusInfo = getFlightStatus(flyDate);
        
        if (!statusInfo.isAvailable) {
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

/**
 page flights_schedule
 */
function updateFlightStatuses() {
    document.querySelectorAll('.flight-row').forEach(row => {
        const flyDate = row.getAttribute('data-flydate');
        const statusBadge = row.querySelector('.flight-status-badge');
        const actionBtn = row.querySelector('.flight-action-btn');
        const statusInfo = getFlightStatus(flyDate);
        
        if (statusBadge) {
            statusBadge.textContent = statusInfo.status;
            statusBadge.className = `flight-status-badge badge ${statusInfo.class}`;
        }
        
        // Disable/Enable nút hành động dựa trên trạng thái
        if (actionBtn) {
            if (!statusInfo.isAvailable) {
                if (actionBtn.tagName === 'A') {
                    // Chuyển link thành button disabled
                    const btn = document.createElement('button');
                    btn.className = 'btn btn-sm btn-secondary flight-action-btn';
                    btn.disabled = true;
                    btn.textContent = 'Không có sẵn';
                    actionBtn.parentNode.replaceChild(btn, actionBtn);
                } else {
                    actionBtn.disabled = true;
                    actionBtn.textContent = 'Không có sẵn';
                    actionBtn.className = 'btn btn-sm btn-secondary flight-action-btn';
                }
            }
        }
    });
}

/**
 * Khởi tạo cập nhật trạng thái chuyến bay (tự động cập nhật mỗi phút)
 * @param {function} updateFunction - Hàm cập nhật trạng thái tương ứng
 */
function initFlightStatusUpdater(updateFunction) {
    // Cập nhật lần đầu khi trang tải
    if (updateFunction && typeof updateFunction === 'function') {
        updateFunction();
        
        // Cập nhật mỗi phút
        setInterval(updateFunction, 60000);
    }
}
