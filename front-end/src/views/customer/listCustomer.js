import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Tag, Input, Select, notification, Checkbox } from 'antd'
import { ExclamationCircleOutlined, CameraOutlined } from '@ant-design/icons'
import { getFacility } from 'src/services/facility';
import { deleteCustomer, getFilterCustomer } from 'src/services/customer'
import { Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const formItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 4, offset: 0 },
    },
}

function ListCustomer() {
    const user = useSelector(state => state.user.data)
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formFilter] = Form.useForm()
    const [data, setData] = useState([])
    const [facilities, setFacilities] = useState([])
    const [daysOptions, setDaysOptions] = useState()

    const defaultPagination = {
        current: 1,
        pageSize: 10,
        total: 0,
    }

    const [pagination, setPagination] = useState(defaultPagination);

    useEffect(() => {
        handleFilterCustomer(pagination)
        handleGetFacility()
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => <a>{index + 1}</a>,
        },
        {
            title: "Họ và tên",
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: "Số điện thoại",
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: "Tổng chi tiêu",
            dataIndex: 'total_price',
            key: 'total_price',
            render: (price) => <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</>,
        },
        {
            title: "Hành động",
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    {user.role === 'manager' && (
                        <Space size="middle">
                            <Button type="danger" onClick={() => handleDelete(id)}>Xoá</Button>
                        </Space>
                    )}
                    <Space size="middle">
                        <Button type="primary">
                            <Link to={`/customer-statistics/${id}`} style={{ textDecoration: 'none' }}>Chi tiết</Link>
                        </Button>
                    </Space>
                </div>

            ),
        },
    ];

    const handleDelete = async (id) => {

        Modal.confirm({
            title: 'Xác nhận xoá khách hàng',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xoá khách hàng này?',
            onOk: async () => {
                const res = await deleteCustomer(id)
                if (res.status === 1) {
                    notification.success({
                        message: 'Xoá khách hàng thành công',
                        placement: 'bottomRight',
                        duration: 3,
                    });
                    handleFilterCustomer(pagination)
                } else {
                    notification.error({
                        message: 'Xoá khách hàng thất bại',
                        placement: 'bottomRight',
                        duration: 3,
                    });
                }
            },
            centered: true,
        });
    };

    const handleTableChange = (pagination) => {
        handleFilterCustomer(pagination)
    };

    const handleFilterCustomer = async (pagination) => {
        var submitData = {
            facility_id: formFilter.getFieldValue('facility'),
            year: formFilter.getFieldValue('year'),
            month: formFilter.getFieldValue('month'),
            day: formFilter.getFieldValue('day'),
            phone: form.getFieldValue('phone')
        }

        try {
            const res = await getFilterCustomer(pagination, submitData)
            if (res.status === 1) {
                const customersWithKey = res.customers.results.map(customer => ({
                    ...customer,
                    key: customer.id
                }));
                setData(customersWithKey);
                setPagination((prev) => {
                    return {
                        ...prev,
                        total: res.customers.pagination.total,
                        current: res.customers.pagination.current,
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
                        handleFilterCustomer(defaultPagination)
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

                    <Form.Item
                        name="year"
                    >
                        <Select
                            placeholder="Năm"
                            style={{ width: 120, zIndex: '1' }}
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option key="none" value={''}>None</Option>
                            {Array.from(new Array(6), (_, index) => (
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
                    form={form}
                    {...formItemLayout}
                    onFinish={() => handleFilterCustomer(pagination)}
                    style={{ display: 'flex', gap: '10px', height: '40px' }}
                >
                    <Button type="primary" htmlType="submit">
                        Tìm kiếm
                    </Button>
                    <Form.Item
                        name="phone"
                    >
                        <Input placeholder='Số điện thoại' style={{ width: '200px' }} />
                    </Form.Item>
                </Form>
                <CCard>
                    <CCardHeader>
                        Danh sách khách hàng
                    </CCardHeader>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={pagination}
                            onChange={handleTableChange}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )

}
export default ListCustomer