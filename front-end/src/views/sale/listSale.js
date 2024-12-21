import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Tag, Input, Select, notification } from 'antd'
import { Roles } from '../../config/Roles'
import { getToken } from 'src/services/auth'
import { Link } from "react-router-dom";
import { getAllSales } from 'src/services/sales'

function ListSale() {
    const [data, setData] = useState([])

    useEffect(() => {
        const getList = async () => {
            try {
                const res = await getAllSales()
                if (res.status === 1) {
                    const dataWithKey = res.sales.map(sales => ({
                        ...sales,
                        key: sales.id
                    }));
                    setData(dataWithKey)
                } else {
                    console.log('res', res);
                    notification.error({
                        message: `Notification`,
                        description: `${res.message + " " + res.expiredAt}`,
                        placement: `bottomRight`,
                        duration: 10,
                    });
                }
            } catch (err) {
                console.log('err', err);
                if (err.status === 401) {
                    getToken(getList)
                } else
                    notification.error({
                        message: `Error`,
                        description: `${Object.values(err.validationErrors)[0]}`,
                        placement: `bottomRight`,
                        duration: 1.5,
                    })
            }
        }
        getList()
    }, []);

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (text, record, index) => <a>{index + 1}</a>,
        },
        {
            title: "Họ và tên",
            dataIndex: "username",
            key: 'username',
            render: (name) => <>{name}</>,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: 'phone',
            render: (phone) => <>{phone}</>,
        },
        {
            title: "Cơ sở",
            dataIndex: "facilities",
            render: (facilities) => (
                <>
                    {facilities.map((facility, index) => (
                        <div key={index}>{facility}</div>
                    ))}
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span style={{ color: status === 1 ? 'green' : 'red' }}>
                    {status === 1 ? 'Đang hoạt động' : 'Dừng hoạt động'}
                </span>
            ),
        },
        {
            title: "Hành động",
            dataIndex: "id",
            key: 'id',
            render: (id) => {
                return (
                    <>
                        <Space size="middle">
                            <Link to={`/detail-sales/${id}`}>Chi tiết</Link>
                        </Space>
                    </>
                );
            },
            permission: [Roles.ADMIN],
        },
    ];

    return (
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Danh sách sales
                    </CCardHeader>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={true}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
export default ListSale