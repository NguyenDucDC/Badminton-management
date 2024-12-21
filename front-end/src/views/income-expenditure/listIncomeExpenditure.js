import React, { useState, useEffect, useMemo } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space } from 'antd'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import { Form, Select} from 'antd'
import { getFacility } from 'src/services/facility';
import moment from 'moment-timezone';
import { getListIncomeExpenditure, filterIncomeExpenditure } from '../../services/incomeExpenditure'

moment.tz.setDefault('Asia/Ho_Chi_Minh');

const { Option } = Select

function ListIncomeExpenditure() {

    const [formFilter] = Form.useForm()
    const user = useSelector((state) => state.user.data);
    const [incomeExpenditure, setIncomeExpenditure] = useState([])
    const [facilities, setFacilities] = useState([])
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
            title: "Tên khoản thu/chi",
            dataIndex: "title",
            key: 'title',
            render: (title) => <>{title}</>,
        },
        {
            title: "Loại khoản",
            dataIndex: "type",
            key: 'type',
            render: (type) => <>{type === 'expenditure' ? 'Khoản chi' : 'Khoản thu'}</>,
        },
        {
            title: "Cơ sở",
            dataIndex: "facility_name",
            key: 'facility_name',
            render: (facility_name) => <>{facility_name}</>,
        },
        {
            title: "Số tiền",
            dataIndex: "value",
            key: 'value',
            render: (value) => <>{parseFloat(value).toLocaleString('vi-VN')} VND</>,
        },
        {
            title: "Thời gian",
            dataIndex: "time",
            key: 'time',
            render: (time) => <>{moment(time).format('DD/MM/YYYY')}</>,
        },

        {
            title: "Hành động",
            dataIndex: "id",
            key: 'id',
            render: (id) => {
                return (
                    <>
                        <Space size="middle">
                            <Link to={`/detail-income-expenditure/${id}`}>Chi tiết</Link>
                        </Space>
                    </>
                );
            },
            // permission: [Roles.SALE],
        },
    ];

    useEffect(() => {
        hanlleGetListIncomeExpenditure(pagination);
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

    const hanlleGetListIncomeExpenditure = async (pagination) => {
        try {
            const res = await getListIncomeExpenditure(user.id, pagination);
            if (res.status === 1) {
                const incomeExpendituresWithKey = res.IncomeExpenditure.results.map(IncomeExpenditure => ({
                    ...IncomeExpenditure,
                    key: IncomeExpenditure.id
                }));
                setIncomeExpenditure(incomeExpendituresWithKey);
                setPagination((prev) => {
                    return {
                        ...prev,
                        total: res.IncomeExpenditure.pagination.total,
                        current: res.IncomeExpenditure.pagination.current,
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

    const handleFilterIncomeExpenditure = async (pagination) => {
        var submitData = {
            facility_id: formFilter.getFieldValue('facility'),
            type: formFilter.getFieldValue('type'),
            year: formFilter.getFieldValue('year'),
            month: formFilter.getFieldValue('month'),
            day: formFilter.getFieldValue('day'),
        }

        try {
            const res = await filterIncomeExpenditure(pagination, submitData)
            if (res.status === 1) {
                console.log(res)
                const incomeExpenditureWithKey = res.IncomeExpenditure.results.map(IncomeExpenditure => ({
                    ...IncomeExpenditure,
                    key: IncomeExpenditure.id
                }));
                setIncomeExpenditure(incomeExpenditureWithKey);
                setPagination((prev) => {
                    return {
                        ...prev,
                        total: res.IncomeExpenditure.pagination.total,
                        current: res.IncomeExpenditure.pagination.current,
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
                        handleFilterIncomeExpenditure(defaultPagination)
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
                        name="type"
                    >
                        <Select
                            style={{ width: '250px', zIndex: '1' }}
                            placeholder='Lọc theo loại khoản'
                            getPopupContainer={trigger => trigger.parentElement}
                        >
                            <Option key="none" value={''}>Tất cả</Option>
                            <Option key='1' value='income' style={{ margin: 0 }}>
                                Khoản thu
                            </Option>
                            <Option key='2' value='expenditure' style={{ margin: 0 }}>
                                Khoản chi
                            </Option>
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

                <CCard>
                    <CCardHeader>
                        Danh sách khoản thu/chi
                    </CCardHeader>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={incomeExpenditure}
                            pagination={pagination}
                            onChange={handleFilterIncomeExpenditure}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    )
}
export default ListIncomeExpenditure