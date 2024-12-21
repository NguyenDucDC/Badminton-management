import React, { useEffect, useState } from 'react';
import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { useAuth } from '../../context/AuthContext';
import { getListOrder } from '../../services/order'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, Modal, Form, Input, Table, notification, DatePicker, Checkbox, Radio, TimePicker } from 'antd'
import { getAllFacility } from '../../services/facility';
import moment from 'moment';
import { Card, Row, Col } from 'antd';

const cx = classNames.bind(styles)

const formItemLayoutLeft = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
}

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
    },
};

function Cart() {
    const [form] = Form.useForm()

    const { isAuthenticated } = useAuth();
    const id = localStorage.getItem('userId')
    const [data, setData] = useState([])
    const [defaultMonth, setDefaultMonth] = useState(false)
    const [listFacility, setListFacility] = useState([])
    const [number, setNumber] = useState(0)
    const [order, setOrder] = useState({})
    const [selectedRowKey, setSelectedRowKey] = useState(null);

    const defaultPagination = {
        current: 1,
        pageSize: 10,
        total: 0,
    }

    const [pagination, setPagination] = useState(defaultPagination);

    useEffect(() => {
        hanldeGetListOrder()
        getListFacility()
    }, [])

    const getListFacility = async () => {
        try {
            const res = await getAllFacility();
            if (res.status === 1) {
                setListFacility(res.facilities);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const handleSetDetailOrder = (order) => {
        setNumber(order.number)
        setDefaultMonth(order.default)
        setSelectedRowKey(order.key);
        setOrder(order)
        setTimeout(() => {
            form.setFieldsValue({
                name: order.cus_name,
                phone: order.cus_phone,
                note: order.note,
                facility: order.facility_id,
                court: order.courts.map(court => court),
                checkin: moment(order.checkIn),
                checkout: moment(order.checkOut),
                defaultMonth: order.default,
                day: order.days.map(day => day),
                month: moment(order.checkOut).startOf('month')
            });
        }, 0);
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: "id",
            key: 'id',
            render: (text, record, index) => <>{index + 1}</>,
        },
        {
            title: "Cơ sở",
            dataIndex: "name",
            key: 'facility_name',
            render: (name) => <>{name}</>,
        },
        {
            title: "Sân",
            dataIndex: "courts",
            key: 'courts',
            render: (courts) => courts.join(", "),
        },
        {
            title: "Sales",
            dataIndex: "sales_name",
            key: 'sales_name',
            render: (sales_name) => <>{sales_name || 'Online'}</>,
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: 'price',
            render: (price) => <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</>,
        },
        {
            title: "Cố định tháng",
            dataIndex: "default",
            key: 'default',
            render: (month) => <>{month ? 'Cố định' : 'Đơn lẻ'}</>,
        }
    ];

    const hanldeGetListOrder = async () => {
        try {
            const res = await getListOrder(id)
            if (res.status === 1) {
                console.log(res)
                setData(res.orders)
                handleSetDetailOrder(res.orders[0])
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (!isAuthenticated) {
        return <div className={cx('noti')}>Vui lòng đăng nhập để xem giỏ hàng</div>
    }

    return (
        <div className={cx('cart-container')}>
            <div className={cx('list-order')}>
                <CCard>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={pagination}
                            // onChange={handleFilterOrder}
                            rowClassName={(record) =>
                                record.key === selectedRowKey ? 'selected-row' : ''
                            }
                            onRow={(record) => ({
                                onClick: () => handleSetDetailOrder(record),
                            })}
                        />
                    </CCardBody>
                </CCard>
            </div>
            <div className={cx('detail-order')}>
                <Card title="Chi tiết đơn hàng" >
                    <CCardBody>
                        <Form
                            form={form}
                            {...formItemLayoutLeft}
                        >
                            <CCol xs="12" md="12" className="mb-4">
                                <Form.Item
                                    label="Cơ sở"
                                    labelAlign="left"
                                    name="facility"
                                    className="checkbox-group-row"
                                    {...formItemLayoutWithOutLabel}
                                >
                                    <Radio.Group >
                                        {listFacility && listFacility.map(facility => (
                                            <Radio
                                                key={facility.id}
                                                value={facility.id}
                                                style={{ display: 'block', margin: 0 }}
                                                disabled
                                            >
                                                {facility.name}
                                            </Radio>
                                        ))}
                                    </Radio.Group >
                                </Form.Item>

                                <Form.Item
                                    label="Vị trí sân"
                                    labelAlign="left"
                                    name="court"
                                >
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            {Array.from({ length: number }, (_, index) => (
                                                <div key={index}>
                                                    <Checkbox
                                                        value={index + 1}
                                                        style={{ margin: 0 }}
                                                        disabled
                                                    >
                                                        Sân {index + 1}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    </Checkbox.Group>
                                </Form.Item>

                                {defaultMonth == true && (
                                    <>
                                        <Form.Item
                                            label="Cố định tháng"
                                            labelAlign="left"
                                            name="defaultMonth"
                                            valuePropName="checked"
                                        >
                                            <Checkbox
                                                checked={defaultMonth}
                                                disabled
                                            >
                                                Cố định tháng
                                            </Checkbox>
                                        </Form.Item>

                                        <Form.Item
                                            label="Tháng"
                                            labelAlign="left"
                                            name="month"
                                        >
                                            <DatePicker
                                                picker="month"
                                                placeholder="Chọn tháng"
                                                format="MM-YYYY"
                                                disabled
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Ngày"
                                            labelAlign="left"
                                            name="day"
                                        >
                                            <Checkbox.Group style={{ width: '100%' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    {Array.from({ length: 7 }, (_, index) => (
                                                        <div key={index}>
                                                            <Checkbox
                                                                value={index}
                                                                style={{ margin: 0 }}
                                                                disabled
                                                            >
                                                                {index === 0 ? 'Chủ nhật' : `Thứ ${index + 1}`}
                                                            </Checkbox>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Checkbox.Group>
                                        </Form.Item>
                                    </>
                                )}

                                <Form.Item
                                    label="Thời gian bắt đầu"
                                    labelAlign="left"
                                    name="checkin"
                                >
                                    {defaultMonth ? (
                                        <TimePicker
                                            showTime={{
                                                format: 'HH',
                                                defaultValue: moment('00:00', 'mm:ss'),
                                            }}
                                            disabled
                                        />
                                    ) : (
                                        <DatePicker
                                            showTime={{
                                                format: 'HH',
                                                defaultValue: moment('00:00', 'mm:ss'),
                                            }}
                                            format="HH[h] : DD-MM-YYYY"
                                            style={{ largeText: '26px' }}
                                            disabled
                                        />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    label="Thời gian kết thúc"
                                    labelAlign="left"
                                    name="checkout"
                                >
                                    {defaultMonth ? (
                                        <TimePicker
                                            showTime={{
                                                format: 'HH',
                                                defaultValue: moment('00:00', 'mm:ss'),
                                            }}
                                            disabled
                                        />
                                    ) : (
                                        <DatePicker
                                            showTime={{
                                                format: 'HH',
                                                defaultValue: moment('00:00', 'mm:ss'),
                                            }}
                                            format="HH[h] : DD-MM-YYYY"
                                            style={{ largeText: '26px' }}
                                            disabled
                                        />
                                    )}
                                </Form.Item>

                                <Form.Item
                                    label="Ghi chú"
                                    labelAlign="left"
                                    name="note"
                                >
                                    <Input.TextArea
                                        readOnly
                                        placeholder="Vui lòng nhập ghi chú!"
                                        autoSize={{ minRows: 3 }}
                                    />
                                </Form.Item>

                            </CCol>

                        </Form>
                    </CCardBody>
                </Card>
            </div>
        </div>
    )

}

export default Cart;
