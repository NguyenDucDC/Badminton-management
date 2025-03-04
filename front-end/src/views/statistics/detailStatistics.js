import React, { useState, useEffect } from 'react';
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { Table, DatePicker, Select, Form, notification } from 'antd';
import { getDetailFacilitiesStatistics, getDetailIncomeStatistics, getDetailSalesStatistics } from '../../services/statistics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, LineChart, Line } from 'recharts';
import { getFacility } from 'src/services/facility';
import { getAllSales } from 'src/services/sales';

const moment = require('moment-timezone');

function DetailStatistics() {
    const [form] = Form.useForm();
    const [formFacility] = Form.useForm();
    const [formSales] = Form.useForm();
    const [dataTypeOfOrder, setDataTypeOfOrder] = useState([]);
    const [dataMethodOrder, setDataMethodOrder] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [dataIncomeExpenditure, setDataIncomeExpenditure] = useState([]);
    const [dataAllSales, setDataAllSales] = useState([]);
    const [sales, setSales] = useState([]);

    const currentYear = new Date().getFullYear();
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    useEffect(() => {
        handleGetFacility()
        handleGetAllSales()
        handleGetDetailFacilityStatistics()
        handleGetDetailIncomeStatistics()
        handleGetDetailSalesStatistics()
    }, [])

    const handleGetFacility = async () => {
        try {
            const res = await getFacility()
            if (res.status === 1) {
                setFacilities(res.facility.filter(facility => facility.status === 1));
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const handleGetAllSales = async () => {
        try {
            const res = await getAllSales()
            if (res.status === 1) {
                setSales(res.sales.filter(sale => sale.status === 1));
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const handleGetDetailFacilityStatistics = async () => {
        const facility = formFacility.getFieldValue('facility');
        const year = formFacility.getFieldValue('year');

        try {
            const res = await getDetailFacilitiesStatistics(facility, year);
            if (res.status === 1) {
                setDataTypeOfOrder(res.statistics.resultsTypeOfOrder)
                setDataMethodOrder(res.statistics.resultsMethodOrder)
            } else {
                notification.error({
                    message: 'Không thể lấy dữ liệu thống kê',
                    placement: `bottomRight`,
                    duration: 3,
                });

            }
        } catch (err) {
            console.log("err: ", err);
        }
    };

    const handleGetDetailIncomeStatistics = async () => {
        const facility = form.getFieldValue('facility');
        const year = form.getFieldValue('year');

        try {
            const res = await getDetailIncomeStatistics(facility, year);
            if (res.status === 1) {
                setDataIncomeExpenditure(res.statistics)
            } else {
                notification.error({
                    message: 'Không thể lấy dữ liệu thống kê',
                    placement: `bottomRight`,
                    duration: 3,
                });

            }
        } catch (err) {
            console.log("err: ", err);
        }
    };

    const handleGetDetailSalesStatistics = async () => {
        const sales = formSales.getFieldValue('sales');
        const year = formSales.getFieldValue('year');

        try {
            const res = await getDetailSalesStatistics(sales, year);
            if (res.status === 1) {
                setDataAllSales(res.statistics.results)
                console.log("res.statistics.results: ", res.statistics.results)
                formSales.setFieldsValue({
                    sales: res.statistics.sale_id
                })
            } else {
                notification.error({
                    message: 'Không thể lấy dữ liệu thống kê',
                    placement: `bottomRight`,
                    duration: 3,
                });

            }
        } catch (err) {
            console.log("err: ", err);
        }
    };

    return (
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Thống kê chi tiết cơ sở
                    </CCardHeader>
                    <CCardBody>
                        <Form
                            form={formFacility}
                            style={{ display: 'flex', gap: '10px', height: '40px' }}
                            onValuesChange={handleGetDetailFacilityStatistics}
                            initialValues={{
                                facility: '',
                                year: currentYear
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

                            <Form.Item
                                name="year"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn năm!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Năm"
                                    style={{ width: 120, zIndex: '1' }}
                                    getPopupContainer={trigger => trigger.parentElement}
                                >
                                    {Array.from(new Array(6), (_, index) => (
                                        <Option key={index + 2020} value={index + 2020}>
                                            {index + 2020}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>

                        <LineChart
                            width={1050}
                            height={300}
                            data={dataTypeOfOrder}
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(month) => monthNames[month - 1]}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Legend />

                            <Line type="monotone" dataKey="total_default" stroke="#8884d8" name="Đơn hàng cố định" />
                            <Line type="monotone" dataKey="total_non_default" stroke="#82ca9d" name="Đơn hàng thường" />
                            <Line type="monotone" dataKey="total" stroke="red" name="Tất cả đơn hàng" />
                        </LineChart>


                        <LineChart
                            width={1050}
                            height={300}
                            data={dataMethodOrder}
                            margin={{ top: 50, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(month) => monthNames[month - 1]}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Legend />

                            <Line type="monotone" dataKey="total_sales" stroke="#8884d8" name="Đơn hàng sales" />
                            <Line type="monotone" dataKey="total_online" stroke="#82ca9d" name="Đơn hàng online" />
                            <Line type="monotone" dataKey="total" stroke="red" name="Tất cả đơn hàng" />
                        </LineChart>

                    </CCardBody>
                </CCard>

                <CCard style={{ marginTop: '20px' }}>
                    <CCardHeader>
                        Thống kê doanh thu - chi phí
                    </CCardHeader>
                    <CCardBody>
                        <Form
                            form={form}
                            style={{ display: 'flex', gap: '10px', height: '40px' }}
                            onValuesChange={handleGetDetailIncomeStatistics}
                            initialValues={{
                                facility: '',
                                year: currentYear
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

                            <Form.Item
                                name="year"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn năm!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Năm"
                                    style={{ width: 120, zIndex: '1' }}
                                    getPopupContainer={trigger => trigger.parentElement}
                                >
                                    {Array.from(new Array(6), (_, index) => (
                                        <Option key={index + 2020} value={index + 2020}>
                                            {index + 2020}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>

                        <LineChart
                            width={1050}
                            height={300}
                            data={dataIncomeExpenditure}
                            margin={{ top: 50, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(month) => monthNames[month - 1]}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Legend />

                            <Line type="monotone" dataKey="total_income" stroke="#8884d8" name="Tổng doanh thu" />
                            <Line type="monotone" dataKey="total_expenditure" stroke="#82ca9d" name="Chi phí" />
                        </LineChart>

                    </CCardBody>
                </CCard>

                <CCard style={{ marginTop: '20px' }}>
                    <CCardHeader>
                        Thống kê sales
                    </CCardHeader>
                    <CCardBody>
                        <Form
                            form={formSales}
                            style={{ display: 'flex', gap: '10px', height: '40px' }}
                            onValuesChange={handleGetDetailSalesStatistics}
                            initialValues={{
                                sales: '',
                                year: currentYear
                            }}
                        >
                            <Form.Item
                                name="sales"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn sales!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: '250px', zIndex: '1' }}
                                    placeholder='Lọc theo cơ sở'
                                    getPopupContainer={trigger => trigger.parentElement}
                                >
                                    {sales.map((sale) => (
                                        <Select.Option key={sale.id} value={sale.id} style={{ margin: 0 }}>
                                            {sale.username}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="year"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn năm!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Năm"
                                    style={{ width: 120, zIndex: '1' }}
                                    getPopupContainer={trigger => trigger.parentElement}
                                >
                                    {Array.from(new Array(6), (_, index) => (
                                        <Option key={index + 2020} value={index + 2020}>
                                            {index + 2020}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>

                        <LineChart
                            width={1050}
                            height={300}
                            data={dataAllSales}
                            margin={{ top: 50, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(month) => monthNames[month - 1]}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                                }
                            />
                            <Legend />

                            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Tổng doanh thu" />
                        </LineChart>

                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default DetailStatistics;
