import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Input, Select, notification, Checkbox, DatePicker } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { updatePrice, getPriceFacility } from 'src/services/facility'

import styles from "./Price.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

function Price() {
    const navigate = useNavigate();
    const { id } = useParams()
    const user = useSelector(state => state.user.data)
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

    const handleUpdatePrice = async () => {
        Modal.confirm({
            title: 'Xác nhận cập nhật',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn cập nhật thông tin này?',
            onOk: async () => {
                const res = await updatePrice(id, price)
                if (res.status === 1) {
                    getPrice()
                    navigate('/list-facility');
                } else {
                    console.log(res)
                }
            },
            onCancel() {
                notification.info({
                    message: 'Hủy cập nhật',
                    placement: 'bottomRight',
                    duration: 2,
                });
            },
            centered: true,
        });
    }

    return (
        <CRow>
            <CCol xs="12" md="12" className="mb-4">
                <CCard>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        Bảng giá
                    </CCardHeader>
                    <CCardBody>
                        <div className={cx('table-container')}>
                            <table className={cx('table-price')}>
                                <thead>
                                    <tr className={cx('row_price')}>
                                        <th rowSpan="2">Giờ</th>
                                        <th colSpan="2">Thứ 2 - Thứ 6</th>
                                        <th colSpan="2">Thứ 7 - CN</th>
                                    </tr>
                                    <tr className={cx('row_price')}>
                                        <th>Tháng</th>
                                        <th>Vãng Lai</th>
                                        <th>Tháng</th>
                                        <th>Vãng Lai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={cx('row_price')}>
                                        <td>0h - 17h</td>
                                        <td >
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p1)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p1: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p2)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p2: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p3)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p3: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                        <td >
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p4)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p4: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={cx('row_price')}>
                                        <td>17h - 24h</td>
                                        <td>
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p5)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p5: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p6)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p6: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p7)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p7: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={cx('input_price')}
                                                type="text"
                                                readOnly={user.role === 'sale' || user.role === 'admin'}
                                                value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price.p8)}
                                                onChange={(e) => setPrice((prevPrice) => ({
                                                    ...prevPrice,
                                                    p8: parseInt(e.target.value.replace(/\D/g, ''), 10) || 0
                                                }))}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {user.role === "manager" && (
                            <Button type="primary" block="submit" onClick={handleUpdatePrice}>
                                Cập nhật
                            </Button>
                        )}
                    </CCardBody>
                </CCard>
            </CCol >
        </CRow >
    );

}
export default Price
