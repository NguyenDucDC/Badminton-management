import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, Modal, Form, Input, Radio, notification, DatePicker, Checkbox, TimePicker } from 'antd'
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getFacility, getDetailFacility } from 'src/services/facility'
import { findCustomer } from 'src/services/customer'
import { createOrder, priceCalculation, checkCalendar, checkCalendarDefaultMonth } from '../../services/order'

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

function AddOrder() {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [listFacility, setListFacility] = useState([])
    const [number, setNumber] = useState(0)
    const [defaultMonth, setDefaultMonth] = useState(false)
    const [customerExists, setCustomerExists] = useState(false)

    useEffect(() => {
        getListFacility();
    }, []);

    const getListFacility = async () => {
        try {
            const res = await getFacility();
            if (res.status === 1) {
                setListFacility(res.facility);
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

    const validateCustomerName = (name) => {
        // Kiểm tra nếu tên bị trống
        if (!name.trim()) {
            return "Tên không được để trống.";
        }

        // Kiểm tra ký tự không hợp lệ
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u; // Hỗ trợ cả tiếng Việt và dấu
        if (!nameRegex.test(name)) {
            return "Tên chỉ được chứa chữ cái và khoảng trắng.";
        }

        // Kiểm tra độ dài
        if (name.length < 10 || name.length > 50) {
            return "Tên phải từ 10 đến 50 ký tự.";
        }

        // Nếu hợp lệ
        return null;
    }

    const handleCheckOrder = (order) => {
        const currentTime = new Date()
        const checkInTime = new Date(order.checkin)

        if(validateCustomerName(order.username)){
            notification.error({
                message: 'Lỗi',
                description: `${validateCustomerName(order.username)}`,
                placement: 'bottomRight',
                duration: 3,
            });
            return false;
        }

        // Tính số giờ chênh lệch giữa checkin và checkout
        const durationInHours = order.checkout.diff(order.checkin, 'hours');
        if (durationInHours > 10) {
            notification.error({
                message: 'Lỗi',
                description: 'Đơn hàng không thể kéo dài quá 10 tiếng. Vui lòng nhập lại!',
                placement: 'bottomRight',
                duration: 3,
            });
            return false;
        }

        // kiểm tra checkin, checkout
        if (order.checkin.isAfter(order.checkout)) {
            notification.error({
                message: 'Lỗi',
                description: 'Thời gian kết thúc phải sau thời gian bắt đầu. Vui lòng nhập lại!',
                placement: 'bottomRight',
                duration: 3,
            });
            return false;
        }

        // kiểm tra checkin đơn tháng
        if(order.defaultMonth){
            console.log('co dinh')
            const currentMonth = currentTime.getMonth()
            const currentYear = currentTime.getFullYear()
            const month = new Date(order.month).getMonth()
            const year = new Date(order.month).getFullYear()

            if(currentYear > year || (currentYear === year && currentMonth >= month)){
                notification.error({
                    message: 'Lỗi',
                    description: `Bạn không thể đặt lịch cố định trước tháng ${currentMonth + 2}/${currentYear}. Vui lòng nhập lại!`,
                    placement: 'bottomRight',
                    duration: 3,
                });
                return false;
            }
        } else if (checkInTime < currentTime) {  // kiểm tra checkin đơn lẻ
            console.log("le")
            notification.error({
                message: 'Lỗi',
                description: 'Thời gian bắt đầu phải sau thời gian hiện tại. Vui lòng nhập lại!',
                placement: 'bottomRight',
                duration: 3,
            });
            return false;
        }
        
        return true;
    }

    const handleCreateOrder = async (submitData) => {
        Modal.confirm({
            title: 'Xác nhận tạo đơn hàng!',
            icon: <ExclamationCircleOutlined />,
            content: `Tổng thanh toán: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(submitData.price)}`,
            onOk: async () => {
                const res = await createOrder(submitData)
                if (res.status === 1) {
                    notification.success({
                        message: 'Tạo đơn hàng thành công',
                        placement: 'bottomRight',
                        duration: 2,
                    });
                    navigate('/list-order');
                } else {
                    const uniqueInvalidCourts = [...new Set(res.invalidCourt)];
                    notification.error({
                        message: 'Lỗi',
                        description: `Sân ${uniqueInvalidCourts.join(", ")} mới có lịch đặt!`,
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }
            },
            centered: true,
        });
    }

    const onFinish = async (values) => { // kiểm tra đơn hàng

        if (!handleCheckOrder(values)) {
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

            if (res.status === 1) {  // check thanh cong
                if (!res.court.length) { // khong co san nao trung lich
                    const price = await priceCalculation(submitData) // tinh gia
                    if (price.status === 1) {
                        submitData.price = price.cost;
                    }
                    handleCreateOrder(submitData); // tao don hang
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

    return (
        <CRow>
            <CCol xs="12" md="9" className="mb-4">
                <CCard>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        Thêm đơn hàng
                    </CCardHeader>
                    <CCardBody style={{ padding: "40px" }}>
                        <Form form={form} {...formItemLayout} onFinish={onFinish}>
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
                                <Input placeholder="Vui lòng nhập số điện thoại khách hàng!" />
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
                                    placeholder="Vui lòng nhập tên khách hàng!"
                                    readOnly={customerExists}
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
                                        format="MM-YYYY" // Định dạng chỉ hiển thị tháng và năm
                                    />
                                </Form.Item>

                            )}

                            {defaultMonth && (

                                <Form.Item
                                    label="Ngày"
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
                                        showTime={{
                                            format: 'HH',
                                            defaultValue: moment('00:00', 'mm:ss'),
                                        }}
                                        placeholder="Chọn giờ"
                                    />
                                ) : (
                                    <DatePicker
                                        showTime={{
                                            format: 'HH',
                                            defaultValue: moment('00:00', 'mm:ss'),
                                        }}
                                        format={defaultMonth ? "HH[giờ]" : "HH[h] : DD-MM-YYYY"}
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
                                        showTime={{
                                            format: 'HH',
                                            defaultValue: moment('00:00', 'mm:ss'),
                                        }}
                                        placeholder="Chọn giờ"
                                    />
                                ) : (
                                    <DatePicker
                                        showTime={{
                                            format: 'HH',
                                            defaultValue: moment('00:00', 'mm:ss'),
                                        }}
                                        format={defaultMonth ? "HH[giờ]" : "HH[h] : DD-MM-YYYY"}
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
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}
export default AddOrder
