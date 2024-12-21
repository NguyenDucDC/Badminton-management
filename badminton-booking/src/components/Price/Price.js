import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getPriceFacility } from 'src/services/facility'

import styles from "./Price.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

function Price() {
    const { id } = useParams()
    const [price, setPrice] = useState({ p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0, p8: 0 });

    useEffect(() => {
        getPrice()
    }, [])

    const getPrice = async () => {
        try {
            const res = await getPriceFacility(id)
            if (res.status === 1 && res.price) {
                setPrice(() => ({
                    p1: res.price.p1,
                    p2: res.price.p2,
                    p3: res.price.p3,
                    p4: res.price.p4,
                    p5: res.price.p5,
                    p6: res.price.p6,
                    p7: res.price.p7,
                    p8: res.price.p8,
                }))
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    return (
        <div className={cx('table-container')}>
            <div className={cx('title')}>Bảng giá</div>
            <table className={cx('table-price')}>
                <thead>
                    <tr className={cx('row_price')}>
                        <th rowSpan="2">Giờ</th>
                        <th colSpan="2">Thứ 2 - Thứ 6</th>
                        <th colSpan="2">Thứ 7 - CN</th>
                    </tr>
                    <tr className={cx('row_price')}>
                        <th>Tháng (/h/sân)</th>
                        <th>Vãng Lai (/h/sân)</th>
                        <th>Tháng (/h/sân)</th>
                        <th>Vãng Lai (/h/sân)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={cx('row_price')}>
                        <td>0h - 17h</td>
                        <td >
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p1)}
                            />
                        </td>
                        <td>
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p2)}
                            />
                        </td>
                        <td>
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p3)}
                            />
                        </td>
                        <td >
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p4)}
                            />
                        </td>
                    </tr>
                    <tr className={cx('row_price')}>
                        <td>17h - 24h</td>
                        <td>
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p5)}
                            />
                        </td>
                        <td>
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p6)}
                            />
                        </td>
                        <td>
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p7)}
                            />
                        </td>
                        <td>
                            <input
                                className={cx('input_price')}
                                type="text"
                                readOnly
                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p8)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
export default Price
