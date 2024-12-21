import React, { useEffect, useState } from 'react';
import classNames from "classnames/bind";
import styles from "./Facility.module.scss";
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles)

function Facility({ data, index }) {
    const navigation = useNavigate();

    const handleDetailFacility = async () => {
        navigation(`detail-facility/${data.id}`)
    }

    return (
        <div className={cx('facility-container')} onClick={handleDetailFacility}>
            {index % 2 === 0 && (
                <div className={cx('facility-1')}>
                    <div className={cx('facility-image')}>
                        <img src={data.avatarURL} />
                    </div>
                    <div className={cx('infor')}>
                        <p>{data.name}</p>
                        <p>{data.address}</p>
                        <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.min_price)} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.max_price)}</p>
                    </div>
                </div>
            )}

            {index % 2 === 1 && (
                <div className={cx('facility-2')}>
                    <div className={cx('infor')}>
                        <p>{data.name}</p>
                        <p>{data.address}</p>
                        <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.min_price)} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.max_price)}</p>
                    </div>
                    <div className={cx('facility-image')}>
                        <img src={data.avatarURL} />
                    </div>
                </div>
            )}
        </div>
    )

}

export default Facility;
