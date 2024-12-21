import React, { useState, useEffect } from 'react';
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { Table, DatePicker, Select, Form, notification } from 'antd';
import { getAllFacilitiesStatistics, getIncomeStatistics, getAllSalesStatistics } from '../../services/statistics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const moment = require('moment-timezone');

function Generaltatistics() {
    const [form] = Form.useForm();
    const [formFacility] = Form.useForm();
    const [formSales] = Form.useForm();
    const [dataTypeOfOrder, setDataTypeOfOrder] = useState([]);
    const [dataMethodOrder, setDataMethodOrder] = useState([]);
    const [dataIncomeExpenditure, setDataIncomeExpenditure] = useState([]);
    const [dataAllSales, setDataAllSales] = useState([]);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        handleGetAllFacilitiesStatistics()
        handleGetIncomeStatistics()
        handleGetAllSalesStatistics()
    }, [])

    const handleGetAllFacilitiesStatistics = async () => {
        const month = formFacility.getFieldValue('month');
        const year = formFacility.getFieldValue('year');

        try {
            const res = await getAllFacilitiesStatistics(month, year);
            if (res.status === 1) {
                setDataTypeOfOrder(res.statistics.statisticsTypeOfOrder)
                setDataMethodOrder(res.statistics.statisticsMethodOrder)
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

    const handleGetIncomeStatistics = async () => {
        const month = form.getFieldValue('month');
        const year = form.getFieldValue('year');

        try {
            const res = await getIncomeStatistics(month, year);
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

    const handleGetAllSalesStatistics = async () => {
        const month = formSales.getFieldValue('month');
        const year = formSales.getFieldValue('year');

        try {
            const res = await getAllSalesStatistics(month, year);
            if (res.status === 1) {
                setDataAllSales(res.statistics)
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
                        Thống kê cơ sở
                    </CCardHeader>
                    <CCardBody>
                        <Form
                            form={formFacility}
                            style={{ display: 'flex', gap: '10px', height: '40px' }}
                            onValuesChange={handleGetAllFacilitiesStatistics}
                            initialValues={{
                                year: currentYear,
                                month: currentMonth,
                            }}
                        >
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
                        </Form>

                        <div style={{ display: 'flex' }}>
                            <BarChart
                                width={550}
                                height={300}
                                data={dataTypeOfOrder}
                                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="facility_name" />
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

                                <Bar dataKey="total_default" fill="#8884d8" name="Đơn hàng cố định" stackId="a" barSize={50} />
                                <Bar dataKey="total_non_default" fill="#82ca9d" name="Đơn hàng Thường" stackId="a" barSize={50} />
                            </BarChart>

                            <BarChart
                                width={550}
                                height={300}
                                data={dataMethodOrder}
                                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="facility_name" />
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

                                <Bar dataKey="total_sales" fill="#8884d8" name="Đơn hàng sales" stackId="a" barSize={50} />
                                <Bar dataKey="total_online" fill="#82ca9d" name="Đơn hàng online" stackId="a" barSize={50} />
                            </BarChart>
                        </div>

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
                            onValuesChange={handleGetIncomeStatistics}
                            initialValues={{
                                year: currentYear,
                                month: currentMonth,
                            }}
                        >
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
                        </Form>

                        <div style={{ display: 'flex' }}>
                            <BarChart
                                width={800}
                                height={400}
                                data={dataIncomeExpenditure}
                                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="facility_name" />
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
                                <Bar dataKey="total_income" fill="#8884d8" name="Doanh thu" barSize={50} />
                                <Bar dataKey="total_expenditure" fill="#82ca9d" name="Chi phí" barSize={50} />
                            </BarChart>

                        </div>

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
                            onValuesChange={handleGetAllSalesStatistics}
                            initialValues={{
                                year: currentYear,
                                month: currentMonth,
                            }}
                        >
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
                        </Form>

                        <div style={{ display: 'flex' }}>
                            <BarChart
                                width={800}
                                height={400}
                                data={dataAllSales}
                                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="sales_name" />
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
                                <Bar dataKey="total_default" fill="#8884d8" name="Đơn hàng cố định" stackId="a" barSize={50} />
                                <Bar dataKey="total_non_default" fill="#82ca9d" name="Đơn hàng thường" stackId="a" barSize={50} />
                            </BarChart>

                        </div>

                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default Generaltatistics;
