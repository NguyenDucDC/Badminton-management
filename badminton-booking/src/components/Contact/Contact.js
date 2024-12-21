import React, { useEffect, useState } from 'react';
import { Modal } from 'antd'
import { useParams, useNavigate } from 'react-router-dom';
import styles from "./Contact.module.scss";
import classNames from "classnames/bind";
import { getSalesFacility } from '../../services/sales';

const cx = classNames.bind(styles);

function Contact({ data }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
    const [listSales, setListSales] = useState([])

    const handleGetSalesFacility = async () => {
        try {
            const res = await getSalesFacility(id)
            if (res.status === 1) {
                console.log(res.sales)
                setListSales(res.sales)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleVisibleModal = () => {
        handleGetSalesFacility()
        setVisibleDeleteModal(true)
    }

    return (
        <>
            <Modal
                open={visibleDeleteModal}
                onCancel={() => setVisibleDeleteModal(false)}
                onOk={() => setVisibleDeleteModal(false)}
                title="Danh sách sales"
                style={{ paddingTop: '50px' }}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <div className={cx('sales-list')}>
                    {listSales && listSales.length > 0 ? (
                        <ul>
                            {listSales.map((sale, index) => (
                                <li key={index} className={cx('sales-item')}>
                                    <strong>{sale.username}</strong>: {sale.phone}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có sales nào.</p>
                    )}
                </div>
            </Modal>


            <div className={cx('contact')}>
                <p>{data.name}</p>
                <p>Địa chỉ: {data.address}</p>
                <div className={cx('button')}>
                    <button
                        className={cx('btn-contact')}
                        onClick={handleVisibleModal}
                    >
                        Liên hệ
                    </button>
                    <button
                        className={cx('btn-book')}
                        onClick={() => navigate('/booking')}
                    >
                        Đặt sân
                    </button>
                </div>
            </div>
        </>

    );
}

export default Contact;
