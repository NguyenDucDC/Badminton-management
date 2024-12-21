import React, { useState, useEffect } from 'react';
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { Table, DatePicker, Select, Form, notification } from 'antd';
import { getDetailCustomerStatistics, getCustomerStatistics } from '../../services/statistics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, LineChart, Line } from 'recharts';
import { getFacility } from 'src/services/facility';
import { getCustomer } from 'src/services/customer';
import { useParams } from 'react-router-dom';

const moment = require('moment-timezone');

function DetailStatistics() {
    const { id } = useParams()
    const [form] = Form.useForm();
    const [formDetail] = Form.useForm();
    const [facilities, setFacilities] = useState([]);
    const [dataGeneral, setDataGeneral] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
    const [data, setData] = useState({})

    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        handleGetFacility()
        handleGetDetailStatisticsCustomer()
        handleGetCustomerStatistics()
        handleGetCustomer()
    }, [])

    const handleGetCustomer = async () => {
        try {
            const res = await getCustomer(id)
            if (res.status === 1) {
                setData(res.customer)
            }
        } catch (err) {
            console.log(err)
        }
    }

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

    const handleGetDetailStatisticsCustomer = async () => {
        const facility = formDetail.getFieldValue('facility');
        const year = formDetail.getFieldValue('year');

        try {
            const res = await getDetailCustomerStatistics(id, facility, year);
            if (res.status === 1) {
                setDataDetail(res.statistics)
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

    const handleGetCustomerStatistics = async () => {
        const month = form.getFieldValue('month');
        const year = form.getFieldValue('year');

        try {
            const res = await getCustomerStatistics(id, month, year);
            if (res.status === 1) {
                setDataGeneral(res.statistics)
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
                <CCard >
                    <CCardHeader>
                        <div>
                            <h5>Thống kê khách hàng</h5>
                            {data && (
                                <p>
                                    Tên khách hàng: <strong>{data.username}</strong><br />
                                    Số điện thoại: <strong>{data.phone}</strong>
                                </p>
                            )}
                        </div>
                    </CCardHeader>

                    <CCardBody>
                        <Form
                            form={formDetail}
                            style={{ display: 'flex', gap: '10px', height: '40px' }}
                            onValuesChange={handleGetDetailStatisticsCustomer}
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
                                    {Array.from(new Array(5), (_, index) => (
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
                            data={dataDetail}
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

                            <Line type="monotone" dataKey="expenditure" stroke="#8884d8" name="Tổng chi tiêu" />
                        </LineChart>

                    </CCardBody>
                </CCard>

                <CCard style={{ marginTop: '20px' }}>
                    <CCardHeader>
                        Thống kê chung
                    </CCardHeader>
                    <CCardBody>
                        <Form
                            form={form}
                            style={{ display: 'flex', gap: '10px', height: '40px' }}
                            onValuesChange={handleGetCustomerStatistics}
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
                                data={dataGeneral}
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
                                <Bar dataKey="expenditure" fill="#82ca9d" name="Chi tiêu" barSize={50} />
                            </BarChart>

                        </div>

                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default DetailStatistics;
