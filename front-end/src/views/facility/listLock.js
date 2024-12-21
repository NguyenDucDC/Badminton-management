import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Tooltip, Modal, Form, Tag, Input, Select, notification } from 'antd'
import { getListLockFacility } from 'src/services/facility'
import { Link } from "react-router-dom";
import moment from 'moment-timezone';

function ListSaleVilla() {

    const defaultPagination = {
        current: 1,
        pageSize: 10,
        total: 0,
    }

    const [pagination, setPagination] = useState(defaultPagination);
    const [data, setData] = useState([])

    useEffect(() => {
        handleGetListLockFacility(pagination)
    }, []);

    const handleGetListLockFacility = async (pagination) => {
        try {
            const res = await getListLockFacility(pagination)
            if (res.status === 1) {
                const dataWithKey = res.listLock.results.map(lock => ({
                    ...lock,
                    key: lock.id
                }));
                setData(dataWithKey)
                setPagination((prev) => {
                    return {
                        ...prev,
                        total: res.listLock.pagination.total,
                        current: res.listLock.pagination.current,
                    };
                });
            }
        } catch (e) {
            console.log('error: ', e);
        }
    }

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (text, record, index) => <a>{index + 1}</a>,
        },
        {
            title: 'Cơ sở',
            dataIndex: 'facilities_name',
            key: 'facilities_name',
            render: (facilities_name) => {
                return (
                    <div>
                        {facilities_name && Array.isArray(facilities_name) ? (
                            facilities_name.map((name, index) => (
                                <div key={index}>{name}</div>
                            ))
                        ) : (
                            <div>{facilities_name}</div>
                        )}
                    </div>
                )
            },
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'time_start',
            key: 'time_start',
            render: (time) => moment(time).format('HH[h] DD/MM/YYYY'),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'time_end',
            key: 'time_end',
            render: (time) => moment(time).format('HH[h] DD/MM/YYYY'),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (note) => (
                <Tooltip title={note}>
                    <div>
                        {note && note.length > 30 ? `${note.substring(0, 30)}...` : note}
                    </div>
                </Tooltip>
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
                            <Link to={`/detail-lock-facility/${id}`}>Chi tiết</Link>
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
                        Danh sách khoá
                    </CCardHeader>
                    <CCardBody>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={false}
                            pagination={pagination}
                            onChange={handleGetListLockFacility}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )



}
export default ListSaleVilla