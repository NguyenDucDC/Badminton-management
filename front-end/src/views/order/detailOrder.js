import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, Modal, Form, Input, Select, notification, DatePicker, Checkbox, Radio, TimePicker } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { getDetailOrder, cancelOrder } from '../../services/order'
import { getFacility, getDetailFacility } from 'src/services/facility'
import { getDetailSales } from 'src/services/sales'
import { useSelector } from 'react-redux'

const formItemLayoutRight = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
}

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

const { Option } = Select
const tailLayout = {
    wrapperCol: { offset: 10, span: 16 },
}

function DetailOrder() {
    const [form] = Form.useForm()
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.data);

    const [listFacility, setListFacility] = useState([])
    const [number, setNumber] = useState(0)
    const [defaultMonth, setDefaultMonth] = useState(false)
    const [salesStatus, setSalesStatus] = useState(1)
    const [isOnlineOrder, setIsOnlineOrder] = useState(true)
    const [isCancelOrder, setIsCanCelOrder] = useState(false)

    useEffect(() => {
        getListFacility();
        handleGetDetailOrder()
    }, [id]);

    const handleCancelOrder = (order) => {
        const currentTime = new Date();
        const checkIn = new Date(order.checkIn)

        if (order.default) {
            const month = checkIn.getMonth()
            const year = checkIn.getFullYear()

            if (currentTime.getFullYear() < year || (currentTime.getFullYear() === year && currentTime.getMonth() < month) ) {
                setIsCanCelOrder(true)
            }
        } else {
            setIsCanCelOrder(checkIn > currentTime)
        }
    }

    const handleGetDetailOrder = async () => {
        try {
            const res = await getDetailOrder(id)
            if (res.status === 1) {
                handleCancelOrder(res.order)
                handleGetDetailFacility(res.order.facility_id)
                form.setFieldsValue({
                    name: res.order.cus_name,
                    phone: res.order.cus_phone,
                    note: res.order.note,
                    facility: res.order.facility_id,
                    court: res.order.courts.map(court => court),
                    checkin: moment(res.order.checkIn),
                    checkout: moment(res.order.checkOut),
                    defaultMonth: res.order.default,
                    day: res.order.days.map(day => day),
                    month: moment(res.order.checkOut).startOf('month')
                })

                setDefaultMonth(res.order.default)
                handleGetDetailSales(res.order.sale_id)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const handleGetDetailSales = async (id) => {
        try {
            const res = await getDetailSales(id)
            if (res.status === 1) {
                form.setFieldsValue({
                    sales_name: res.sales.username,
                    sales_phone: res.sales.phone,
                    sales_status: res.sales.status === 1 ? "Đang hoạt động" : "Dừng hoạt động"
                })

                if (res.sales.id === null) {
                    setIsOnlineOrder(true)
                } else {
                    setIsOnlineOrder(false)
                    setSalesStatus(res.sales.status)
                }

            } else {
                console.log(res)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

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

    const onFinish = async (values) => {

        Modal.confirm({
            title: 'Xác nhận huỷ đơn hàng',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
            onOk: async () => {
                const res = await cancelOrder(id)
                if (res.status === 1) {
                    notification.success({
                        message: 'Huỷ đơn hàng thành công',
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-order');
                } else {
                    notification.error({
                        message: 'Huỷ đơn hàng thất bại',
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }
            },
            // onCancel: () => {
            //     notification.info({
            //         message: 'Hủy cập nhật thông tin',
            //         placement: 'bottomRight',
            //         duration: 2,
            //     });
            // },
            centered: true,
        });
    };

    return (
        <CRow>
            <CCol xs="12" md="7" className="mb-4">
                <CCard>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}>
                        Chi tiết đơn hàng
                    </CCardHeader>
                    <CCardBody style={{ padding: "40px" }}>
                        <Form
                            form={form}
                            {...formItemLayoutLeft}
                            onFinish={onFinish}
                        >
                            <CCol xs="12" md="12" className="mb-4">
                                <Form.Item
                                    name="name"
                                    label="Tên khách hàng"
                                    labelAlign="left"
                                >
                                    <Input readOnly />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    labelAlign="left"
                                >
                                    <Input readOnly />
                                </Form.Item>

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
                                {user.role === 'sale' && isCancelOrder && (
                                    <Form.Item {...tailLayout}>
                                        <Button type="primary" danger htmlType="submit">
                                            Huỷ đơn hàng
                                        </Button>
                                    </Form.Item>
                                )}
                            </CCol>

                        </Form>
                    </CCardBody>
                </CCard>
            </CCol>

            {!isOnlineOrder && (
                <CCol xs="12" md="5" className="mb-4">
                    <CCard>
                        <CCardHeader
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                            }}
                        >
                            Sales
                        </CCardHeader>
                        <CCardBody>
                            <Form
                                form={form} {...formItemLayoutRight} onFinish={onFinish}
                            >
                                <>
                                    <Form.Item
                                        name="sales_name"
                                        label="Họ và tên"
                                        labelAlign="left"
                                    >
                                        <Input readOnly />
                                    </Form.Item>

                                    <Form.Item
                                        name="sales_phone"
                                        label="Số điện thoại"
                                        labelAlign="left"
                                    >
                                        <Input readOnly />
                                    </Form.Item>

                                    <Form.Item
                                        name="sales_status"
                                        label="Trạng thái"
                                        labelAlign="left"
                                    >
                                        <Input
                                            readOnly
                                            style={{ color: salesStatus === 1 ? 'green' : 'red' }}
                                        />
                                    </Form.Item>
                                </>
                            </Form>
                        </CCardBody>
                    </CCard>
                </CCol>
            )}
        </CRow>
    )
}
export default DetailOrder