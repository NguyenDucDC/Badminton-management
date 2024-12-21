import React, { useEffect, useState } from 'react';
import classNames from "classnames/bind";
import styles from "./Help.module.scss";

const cx = classNames.bind(styles)

function Help() {


    return (
        <div className={cx('help')}>
            <h4>Cách Đặt Lịch Sân Cầu Lông</h4>
            <p>- <strong>Số điện thoại khách hàng:</strong> Nhập số điện thoại của bạn.</p>
            <p>- <strong>Tên khách hàng:</strong> Nhập tên đầy đủ của bạn.</p>
            <p>- <strong>Cơ sở:</strong> Chọn cơ sở mà bạn muốn đặt sân.</p>
            <p>- <strong>Vị trí sân:</strong> Chọn vị trí sân muốn đặt. Các sân sẽ hiển thị theo danh sách có sẵn.</p>
            <p>- <strong>Cố định tháng:</strong> Tùy chọn này cho phép bạn đặt lịch theo tháng cố định.</p>
            <p>- <strong>Tháng:</strong> Chọn tháng mà bạn muốn đặt lịch cố định.</p>
            <p>- <strong>Thứ:</strong> Chọn những ngày trong tuần mà bạn muốn đặt lịch cố định.</p>
            <p>- <strong>Thời gian bắt đầu & kết thúc:</strong> Chọn thời gian chính xác cho lịch đặt sân của bạn.</p>
            <p>- <strong>Ghi chú:</strong> Thêm các ghi chú bổ sung nếu cần.</p>
            <p>- Cuối cùng, nhấn "Tạo đơn hàng" để hoàn tất việc đặt lịch.</p>
            <div className={cx('note')}>
                <h5>*Chú ý:</h5>
                <div className={cx('note-content')}>
                    <p>- Sau khi thanh toán, bạn không thể huỷ đơn hàng. Nếu muốn huỷ đơn hàng, vui lòng liên hệ nhân viên kinh doanh của cơ sở.</p>
                    <p>- Nếu bạn gặp khó khăn trong quá trình đặt sân, vui lòng liên hệ nhân viên kinh doanh của cơ sở ở trang chi tiết cơ sở.</p>
                </div>
            </div>
        </div>
    )
}

export default Help;
