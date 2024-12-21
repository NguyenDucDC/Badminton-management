import React, { useEffect, useState } from 'react';
import { notification } from 'antd'
import { vnpay_ipn, vnpay_refund } from '../../services/payment';
import { createOrder } from '../../services/order';
import classNames from "classnames/bind";
import styles from "./PaymentReturn.module.scss";

const cx = classNames.bind(styles)

const PaymentReturn = () => {
    const query = new URLSearchParams(window.location.search);
    const paymentData = {
        orderId: query.get('vnp_TxnRef'),
        transDate: query.get('vnp_PayDate'),
        amount: query.get('vnp_Amount'),
        bankCode: query.get('vnp_BankCode'),
        transactionNo: query.get('vnp_TransactionNo'),
        responseCode: query.get('vnp_ResponseCode')
    };

    const handleCreateOrder = async (data) => {
        try {
            const res = await createOrder(data)
            if (res.status === 1) {
                notification.success({
                    message: 'Thông báo',
                    description: `Thêm đơn hàng thành công`,
                    placement: 'bottomRight',
                    duration: 3,
                });
            } else {
                const refund = await vnpay_refund(paymentData)
                if (refund.status === 1) {
                    const uniqueInvalidCourts = [...new Set(res.invalidCourt)];
                    notification.error({
                        message: 'Lỗi',
                        description: (
                            <div>
                                Sân {uniqueInvalidCourts.join(", ")} mới có lịch đặt!<br />
                                Hệ thống đã yêu cầu hoàn tiền, vui lòng đợi giao dịch hoàn tiền.<br />
                                Liên hệ 0333960103 để được hỗ trợ.
                            </div>
                        ),
                        placement: 'bottomRight',
                        duration: 0,
                    });
                } else {
                    console.log(refund)
                }
            }
        } catch (err) {
            console.log(err)
            notification.error({
                message: 'Thông báo',
                description: `Thêm đơn hàng không thành công`,
                placement: 'bottomRight',
                duration: 3,
            });
        }
    }

    useEffect(() => {
        const orderData = JSON.parse(localStorage.getItem('orderData'));

        if (paymentData.responseCode === '00' && orderData) {
            localStorage.removeItem('orderData'); // xoá đơn hàng khỏi local storage
            handleCreateOrder(orderData)
        }

        // handleGetVnpayIPN(query)
    }, [query]);

    const handleGetVnpayIPN = async (query) => {
        try {
            const res = await vnpay_ipn(query)
            if (res.status === 1) {
                console.log("thanh cong")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const formatAmount = (amount) => {
        return (amount / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const isSuccess = paymentData.responseCode === '00';

    return (
        <div className={cx('paymentReturn')}>
            <h1>Payment Result</h1>
            <ul>
                <li>
                    <strong>Số tiền:</strong> {paymentData.amount ? formatAmount(paymentData.amount) : 'N/A'}
                </li>
                <li>
                    <strong>Ngân hàng:</strong> {paymentData.bankCode || 'N/A'}
                </li>
                <li>
                    <strong>Mã giao dịch:</strong> {paymentData.transactionNo || 'N/A'}
                </li>
                <li>
                    <strong>Trạng thái đơn hàng:</strong> {isSuccess ? <span className={cx('success')}>Thành công</span> : <span className={cx('failure')}>Thất bại</span>}
                </li>
            </ul>
        </div>
    );
};

export default PaymentReturn;
