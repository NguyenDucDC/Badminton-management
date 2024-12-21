import React, { useState, useEffect, useMemo } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space } from 'antd'
import { Roles } from '../../config/Roles'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import { Button, Modal, Form, Input, Select, notification, DatePicker, Checkbox, Radio, TimePicker } from 'antd'
import { getFacility } from 'src/services/facility';
import { getAllSales } from 'src/services/sales';
import { getListOrderSales, getListOrderManager, getAllOrder, getFilterOrder } from '../../services/order'
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Ho_Chi_Minh');

const { Option } = Select

function ListOrder() {
    const [formFilter] = Form.useForm()
    const [formFilterPhone] = Form.useForm()
    const user = useSelector((state) => state.user.data);
    const [orders, setOrders] = useState([])
    const [facilities, setFacilities] = useState([])
    const [sales, setSales] = useState([])
    const [daysOptions, setDaysOptions] = useState()

    const defaultPagination = {
        current: 1,
        pageSize: 10,
        total: 0,
    }

    const [pagination, setPagination] = useState(defaultPagination);


    const columns = [
        {
            title: 'ID',
            dataIndex: "id",
            key: 'id',
            render: (text, record, index) => <a>{index + 1}</a>,
        },
        {
            title: "Tên khách hàng",
            dataIndex: "cus_name",
            key: 'cus_name',
            render: (cus_name) => <>{cus_name}</>,
        },
        {
            title: "Số điện thoại",
            dataIndex: "cus_phone",
            key: 'cus_phone',
            render: (cus_phone) => <>{cus_phone}</>,
        },
        {
            title: "Cơ sở",
            dataIndex: "facility_name",
            key: 'facility_name',
            render: (facility_name) => <>{facility_name}</>,
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
        },
        {
            title: "Hành động",
            dataIndex: "id",
            key: 'id',
            render: (id) => {
                return (
                    <>
                        <Space size="middle">
                            <Link to={`/detail-order/${id}`}>Chi tiết</Link>
                        </Space>
                    </>
                );
            },
            permission: [Roles.SALE],
        },
    ];

    useEffect(() => {
        hanlleGetListOrder(pagination);
        handleGetFacility()
        if (user.role === 'admin' || user.role === 'manager') {
            handleGetSales()
        }
    }, []);


    const handleGetFacility = async () => {
        try {
            const res = await getFacility()
            if (res.status === 1) {
                setFacilities(res.facility)
            }
        } catch (err) {
            console.log('err: ', err)
        }
    }

    const handleGetSales = async () => {
        try {
            const res = await getAllSales()
            if (res.status === 1) {
                setSales(res.sales)
            }
        } catch (err) {
            console.log('err: ', err)
        }
    }

    const hanlleGetListOrder = async (pagination) => {
        try {
            let res = {}
            if (user.role === 'sale') {
                res = await getListOrderSales(user.id, pagination);
            } else if (user.role === 'manager') {
                res = await getListOrderManager(user.id, pagination);
            } else if (user.role === 'admin') {
                res = await getAllOrder(pagination)
            }
            if (res.status === 1) {
                const ordersWithKey = res.order.results.map(order => ({
                    ...order,
                    key: order.id
                }));
                setOrders(ordersWithKey);
                setPagination((prev) => {
                    return {
                        ...prev,
                        total: res.order.pagination.total,
                        current: res.order.pagination.current,
                    };
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const renderDaysOptions = () => {
        const month = formFilter.getFieldValue('month')
        const year = formFilter.getFieldValue('year')

        if (!month || !year) {
            setDaysOptions()
            return
        }

        const getDaysInMonth = (month, year) => {
            return new Date(year, month, 0).getDate();
        };

        const numberOfDays = getDaysInMonth(month, year);
        const daysOptions = [];

        for (let i = 1; i <= numberOfDays; i++) {
            const dayString = i.toString().padStart(2, '0');
            daysOptions.push(<Option key={dayString} value={dayString}>{dayString}</Option>);
        }

        setDaysOptions(daysOptions)

        return daysOptions;
    };

    const handleFilterOrder = async (pagination) => {
        var submitData = {
            facility_id: formFilter.getFieldValue('facility'),
            sales_id: formFilter.getFieldValue('sale'),
            year: formFilter.getFieldValue('year'),
            month: formFilter.getFieldValue('month'),
            day: formFilter.getFieldValue('day'),
            phone: formFilterPhone.getFieldValue('phone')
        }

        try {
            const res = await getFilterOrder(pagination, submitData)

            if (res.status === 1) {
                const ordersWithKey = res.order.results.map(order => ({
                    ...order,
                    key: order.id
                }));
                setOrders(ordersWithKey);
                setPagination((prev) => {
                    return {
                        ...prev,
                        total: res.order.pagination.total,
                        current: res.order.pagination.current,
                    };
                });
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    return (
        <CRow>
            <CCol>
                <Form
                    form={formFilter}
                    style={{ display: 'flex', gap: '10px', height: '40px' }}
                    onValuesChange={() => {
                        handleFilterOrder(defaultPagination)
                        renderDaysOptions()
                    }}
                >
                    <Form.Item
                        name="facility"
                    >
                        <Select
                            style={{ width: '250px', zIndex: '1' }}
                            placeholder='Lọc theo cơ sở'
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option key="none" value={''}>Tất cả cơ sở</Option>
                            {facilities.map((facility) => (
                                <Select.Option key={facility.id} value={facility.id} style={{ margin: 0 }}>
                                    {facility.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {user.role !== "sale" && (
                        <Form.Item
                            name="sale"
                        >
                            <Select
                                style={{ width: '250px', zIndex: '1' }}
                                placeholder='Lọc theo sales'
                                getPopupContainer={trigger => trigger.parentElement}
                            >
                                <Option key="none" value={''}>Tất cả Sales</Option>
                                {sales.map((sale) => (
                                    <Select.Option key={sale.id} value={sale.id} style={{ margin: 0 }}>
                                        {sale.username}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item
                        name="year"
                    >
                        <Select
                            placeholder="Năm"
                            style={{ width: 120, zIndex: '1' }}
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option key="none" value={''}>None</Option>
                            {Array.from(new Array(5), (_, index) => (
                                <Option key={index + 2020} value={index + 2020}>
                                    {index + 2020}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="month"
                    >
                        <Select
                            placeholder="Tháng"
                            style={{ width: 120, zIndex: '1' }}
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option key="none" value={''}>None</Option>
                            {[...Array(12).keys()].map(i => (
                                <Option key={i + 1} value={i + 1}>
                                    Tháng {i + 1}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="day"
                    >
                        <Select
                            placeholder="Ngày"
                            style={{ width: 120, zIndex: '1' }}
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option key="none" value="">None</Option>
                            {daysOptions}
                        </Select>
                    </Form.Item>

                </Form>

                <Form
                    form={formFilterPhone}
                    style={{ display: 'flex', gap: '10px', height: '40px' }}
                    onFinish={() => handleFilterOrder(defaultPagination)}
                >
                    <Button type="primary" htmlType="submit">
                        Tìm kiếm
                    </Button>

                    <Form.Item
                        name="phone"
                    >
                        <Input
                            placeholder='Số điện thoại'
                            style={{ width: '200px' }}
                        />
                    </Form.Item>
                </Form>

                <CCard>
                    <CCardHeader>
                        Danh sách đơn hàng
                    </CCardHeader>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={orders}
                            pagination={pagination}
                            onChange={handleFilterOrder}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    )
}
export default ListOrder