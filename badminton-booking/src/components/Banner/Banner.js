import React, { useEffect, useState } from 'react';
import classNames from "classnames/bind";
import styles from "./Banner.module.scss";
import banner from '../../assets/banner1.png'

const cx = classNames.bind(styles)

function Banner() {

    return (
        <>
            <div className={cx('banner')}>
                <div className={cx('banner-img')}>
                    <img src={banner} />
                </div>
                <div className={cx('slogan')}>
                    <div className={cx('item')}>
                        <h3>Tận tâm</h3>
                        <p>Luôn sẵn sàng hỗ trợ khách hàng một cách nhanh chóng và chu đáo.</p>
                    </div>
                    <div className={cx('item')}>
                        <h3>Chất lượng</h3>
                        <p>Cung cấp các sân chơi đạt tiêu chuẩn và dịch vụ tốt nhất cho người chơi.</p>
                    </div>
                    <div className={cx('item')}>
                        <h3>Thuận tiện</h3>
                        <p>Đặt lịch dễ dàng, nhanh chóng mọi lúc mọi nơi.</p>
                    </div>
                    <div className={cx('item')}>
                        <h3>Kết nối</h3>
                        <p>Tạo ra không gian để người chơi cùng giao lưu, học hỏi và phát triển kỹ năng.</p>
                    </div>
                    <div className={cx('item')}>
                        <h3>Đổi mới</h3>
                        <p>Liên tục cải tiến và nâng cao trải nghiệm người dùng thông qua công nghệ tiên tiến.</p>
                    </div>
                </div>
            </div>
        </>

    )

}

export default Banner;
