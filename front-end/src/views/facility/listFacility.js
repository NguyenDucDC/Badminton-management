import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Tag, Input, Select, notification } from 'antd'
import { getFacility } from 'src/services/facility'
import { Link } from "react-router-dom";

function ListSaleVilla() {
    const [data, setData] = useState([])

    useEffect(() => {
        const getListFacility = async () => {
            try {
                const res = await getFacility()
                if (res.status === 1) {
                    const dataWithKey = res.facility.map(facility => ({
                        ...facility,
                        key: facility.id
                    }));
                    setData(dataWithKey)
                }
            } catch (e) {
                console.log('error: ', e);
            }
        }
        getListFacility()
    }, []);

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (text, record, index) => <a>{index + 1}</a>,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
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
            title: 'Hành động',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return (
                    <>
                        <Space size="middle">
                            <Link to={`/detail-facility/${id}`}>Chi tiết</Link>
                        </Space>
                    </>
                );
            },
        }
    ];

    return (
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Danh sách cơ sở
                    </CCardHeader>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={false}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )



}
export default ListSaleVilla