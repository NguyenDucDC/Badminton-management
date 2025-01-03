import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, notification, DatePicker, Checkbox, TimePicker } from 'antd'
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getAllFacility, getDetailFacility } from 'src/services/facility'
import { checkCalendar, checkCalendarDefaultMonth } from '../../services/calendar'
import { priceCalculation } from '../../services/order'
import { createPaymentUrl } from '../../services/payment';
import { findCustomer } from '../../services/customer';
import { getUser } from '../../services/user';
import classNames from "classnames/bind";
import styles from "./Booking.module.scss";
import { useAuth } from '../../context/AuthContext';


const cx = classNames.bind(styles)

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
}

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 0 },
    },
};

function Booking() {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [listFacility, setListFacility] = useState([])
    const [number, setNumber] = useState(0)
    const [defaultMonth, setDefaultMonth] = useState(false)
    const { isAuthenticated } = useAuth();
    const userId = localStorage.getItem('userId')
    const [customerExists, setCustomerExists] = useState(false)

    useEffect(() => {
        getListFacility();
        if (isAuthenticated) {
            handleGetUser()
        }
    }, []);

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
        return phoneRegex.test(phone);
    }

    const handleGetUser = async () => {
        try {
            const res = await getUser(userId)
            if (res.status === 1) {
                form.setFieldsValue({
                    phone: res.user.phone
                })
                handleFindCustomer(res.user.phone)
            }
        } catch (err) {
            console.log(err)
        }
    }

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

    const handleGetDetailFacility = async (id) => {
        try {
            const res = await getDetailFacility(id)
            if (res.status === 1) {
                setNumber(res.facility.number)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const formatAmount = (amount) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const onFinish = async (values) => {

        if (!validatePhoneNumber(values.phone)) {
            notification.error({
                message: 'Lỗi',
                description: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng!',
                placement: 'bottomRight',
                duration: 2,
            });
            return;
        }

        // Tính số giờ chênh lệch giữa checkin và checkout
        const durationInHours = values.checkout.diff(values.checkin, 'hours');
        if (durationInHours > 10) {
            notification.error({
                message: 'Lỗi',
                description: 'Đơn hàng không thể kéo dài quá 10 tiếng. Vui lòng nhập lại!',
                placement: 'bottomRight',
                duration: 2,
            });
            return;
        }

        // kiểm tra checkout sau checkin
        if (values.checkin.isAfter(values.checkout)) {
            notification.error({
                message: 'Lỗi',
                description: 'Thời gian kết thúc phải sau thời gian bắt đầu. Vui lòng nhập lại!',
                placement: 'bottomRight',
                duration: 2,
            });
            return;
        }

        var submitData = {
            cus_name: values.username,
            cus_phone: values.phone,
            facility: values.facility,
            court: values.court,
            defaultMonth: values.defaultMonth,
            month: values.month,
            day: values.day,
            checkIn: values.checkin,
            checkOut: values.checkout,
            day: values.day,
            note: values.note
        }

        try {
            let res = {}
            if (submitData.defaultMonth) {
                res = await checkCalendarDefaultMonth(submitData)
            } else {
                res = await checkCalendar(submitData)
            }

            if (res.status === 1) {
                if (!res.court.length) {
                    const price = await priceCalculation(submitData) // tinh gia
                    if (price.status === 1) {
                        submitData.amount = price.cost;
                        submitData.price = price.cost;
                    }

                    Modal.confirm({
                        title: 'Xác nhận tạo đơn hàng!',
                        icon: <ExclamationCircleOutlined />,
                        content: (
                            <>
                                Tổng thanh toán: <span style={{ color: 'green', fontWeight: 'bold' }}>{formatAmount(submitData.amount)}</span> <br />
                                <strong style={{ color: 'red' }}>*Chú ý:</strong> sau khi đặt hàng, bạn không thể huỷ đơn hàng. Click vào "thanh toán" để đặt hàng
                            </>
                        ),
                        okText: 'Thanh toán',
                        onOk: async () => {
                            const paymentUrl = await createPaymentUrl(submitData)

                            localStorage.setItem('orderData', JSON.stringify(submitData)); // lưu đơn hàng vào storage

                            window.open(paymentUrl.vnpUrl, '_blank');
                        },
                        centered: true,
                    });

                } else {
                    const uniqueInvalidCourts = [...new Set(res.court)];
                    notification.error({
                        message: 'Lỗi',
                        description: `Sân ${uniqueInvalidCourts.join(", ")} đã có lịch đặt!`,
                        placement: 'bottomRight',
                        duration: 3,
                    });
                }

            }
        } catch (err) {
            console.log("err: ", err)
        }
    };

    const handleFindCustomer = async (phone) => {
        setCustomerExists(false)
        form.setFieldsValue({
            username: ''
        })
        try {
            const res = await findCustomer(phone)
            if (res.status === 1 && res.customer) {
                form.setFieldsValue({
                    username: res.customer.username
                })
                setCustomerExists(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={cx('booking')}>
            <div className={cx('booking-item')}>
                <Form form={form} {...formItemLayout}>
                    <Form.Item
                        label="Số điện thoại khách hàng"
                        labelAlign="left"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại khách hàng!",
                            },
                        ]}
                        onChange={(e) => handleFindCustomer(e.target.value)}
                    >
                        <Input
                            placeholder="Vui lòng nhập số điện thoại khách hàng!"
                            readOnly={isAuthenticated}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tên khách hàng"
                        labelAlign="left"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên khách hàng!",
                            },
                        ]}
                    >
                        <Input
                            readOnly={customerExists}
                            placeholder="Vui lòng nhập tên khách hàng!"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Cơ sở"
                        labelAlign="left"
                        name="facility"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn cơ sở!",
                            },
                        ]}
                        className="checkbox-group-row"
                        {...formItemLayoutWithOutLabel}
                    >
                        <Radio.Group onChange={(e) => handleGetDetailFacility(e.target.value)} >
                            {listFacility && listFacility.map(facility => (
                                <Radio
                                    key={facility.id}
                                    value={facility.id}
                                    style={{ display: 'block', margin: 0 }}
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
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn sân!",
                            },
                        ]}
                    >
                        <Checkbox.Group style={{ width: '100%' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {Array.from({ length: number }, (_, index) => (
                                    <div key={index}>
                                        <Checkbox
                                            value={index + 1}
                                            style={{ margin: 0 }}
                                        >
                                            Sân {index + 1}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </div>

            <div className={cx('booking-item')}>
                <Form form={form} {...formItemLayout} onFinish={onFinish}>
                    <Form.Item
                        label="Cố định tháng"
                        labelAlign="left"
                        name="defaultMonth"
                        valuePropName="checked"
                    >
                        <Checkbox
                            checked={defaultMonth}
                            onChange={() => {
                                setDefaultMonth(!defaultMonth)
                            }}
                        >
                            Cố định tháng
                        </Checkbox>
                    </Form.Item>

                    {defaultMonth && (
                        <Form.Item
                            label="Tháng"
                            labelAlign="left"
                            name="month"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn tháng!",
                                },
                            ]}
                        >
                            <DatePicker
                                picker="month"
                                placeholder="Chọn tháng"
                                format="MM-YYYY"
                            />
                        </Form.Item>

                    )}

                    {defaultMonth && (

                        <Form.Item
                            label="Thứ"
                            labelAlign="left"
                            name="day"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn sân!",
                                },
                            ]}
                        >
                            <Checkbox.Group style={{ width: '100%' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {Array.from({ length: 7 }, (_, index) => (
                                        <div key={index}>
                                            <Checkbox
                                                value={index}
                                                style={{ margin: 0 }}
                                            >
                                                {index === 0 ? 'Chủ nhật' : `Thứ ${index + 1}`}
                                            </Checkbox>
                                        </div>
                                    ))}
                                </div>
                            </Checkbox.Group>
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Thời gian bắt đầu"
                        labelAlign="left"
                        name="checkin"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập thời gian checkin!",
                            },
                        ]}
                    >
                        {defaultMonth ? (
                            <TimePicker
                                format="HH[h]"
                                placeholder="Chọn giờ"
                            />
                        ) : (
                            <DatePicker
                                showTime={{
                                    format: 'HH',
                                    defaultValue: moment('00:00', 'mm:ss'),
                                }}
                                format="HH[h] : DD-MM-YYYY"
                                placeholder="Thời gian checkin!"
                                style={{ largeText: '26px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Thời gian kết thúc"
                        labelAlign="left"
                        name="checkout"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập thời gian checkout!",
                            },

                        ]}
                    >
                        {defaultMonth ? (
                            <TimePicker
                                format="HH[h]"
                                placeholder="Chọn giờ"
                            />
                        ) : (
                            <DatePicker
                                showTime={{
                                    format: 'HH',
                                    defaultValue: moment('00:00', 'mm:ss'),
                                }}
                                format="HH[h] : DD-MM-YYYY"
                                placeholder="Thời gian checkout!"
                                style={{ largeText: '26px' }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        labelAlign="left"
                        name="note"
                    >
                        <Input.TextArea
                            placeholder="Vui lòng nhập ghi chú!"
                            autoSize={{ minRows: 3 }}
                        />
                    </Form.Item>

                    <Button type="primary" block htmlType="submit">
                        Tạo đơn hàng
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Booking;
