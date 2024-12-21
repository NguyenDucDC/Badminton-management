import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space } from 'antd'
import { Roles } from '../../config/Roles'
import { useTranslation } from 'react-i18next'
import { Link } from "react-router-dom";
import { getManager } from 'src/services/manager'

function ListSaleVilla() {
    const [data, setData] = useState([])

    useEffect(() => {
        const getList = async () => {
            try {
                const res = await getManager()
                if (res.status === 1) {
                    const dataWithKey = res.manager.map(manager => ({
                        ...manager,
                        key: manager.id
                    }));
                    setData(dataWithKey)
                }
            } catch (err) {
                console.log('err', err);
            }
        }
        getList()
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => <>{index + 1}</>,
        },
        {
            title: "Họ và tên",
            dataIndex: "username",
            key: "username",
            render: (name) => <>{name}</>,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
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
            key: "id",
            render: (id) => {
                return (
                    <>
                        <Space size="middle">
                            <Link to={`/detail-manager/${id}`}>Chi tiết</Link>
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
                        Danh sách manager
                    </CCardHeader>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={data}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
export default ListSaleVilla