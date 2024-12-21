import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Input, Select, notification, Checkbox, DatePicker } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom';
import { updatePersonnelFacility, getDetailFacility } from 'src/services/facility'
import { getManager } from 'src/services/manager'
import { useSelector } from 'react-redux'
import { getAllSales, getSalesOfFacility } from 'src/services/sales'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
}

const formItemLayoutWithOutLabel = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 0 },
    },
};

function ListPersonnal() {
    const [formUpdatePersonnel] = Form.useForm()
    const navigate = useNavigate();
    const { id } = useParams()
    const user = useSelector(state => state.user.data)
    const [listManager, setListManager] = useState([])
    const { Option } = Select;
    const [allSales, setAllSales] = useState([])

    useEffect(() => {
        if (user.role === 'admin') {
            getAllManager()
        }
        if (user.role === 'admin' || user.role === 'manager') {
            getSales()
        }
        getSalesFacility()
        getFacility()
    }, [])

    const getFacility = async () => {
        try {
            const res = await getDetailFacility(id)
            if (res.status === 1) {
                formUpdatePersonnel.setFieldsValue({
                    manager: res.facility.manager_id
                })
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const getAllManager = async () => {
        try {
            const res = await getManager()
            if (res.status === 1) {
                setListManager(res.manager)
            } else {
                console.log("err: ", res)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const getSales = async () => {
        try {
            const res = await getAllSales()
            if (res.status === 1) {
                setAllSales(res.sales)
            } else {
                console.log("err: ", res)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const getSalesFacility = async () => {
        try {
            const res = await getSalesOfFacility(id)
            if (res.status === 1) {
                formUpdatePersonnel.setFieldsValue({
                    sales: res.sales.map(sale => sale.sale_id)
                });
            } else {
                console.log("err: ", res)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const handleUpdate = async (values) => {
        var submitData = {
            managerId: values.manager,
            salesId: values.sales
        }

        Modal.confirm({
            title: 'Xác nhận cập nhật',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn cập nhật thông tin này?',
            onOk: async () => {
                const res = await updatePersonnelFacility(id, submitData)
                if (res.status === 1) {
                    notification.success({
                        message: "Cập nhật thông tin thành công!",
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-facility');
                } else {
                    notification.error({
                        message: "Cập nhật thông tin thất bại!",
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }

            },
            onCancel() {
                notification.info({
                    message: 'Hủy cập nhật',
                    placement: 'bottomRight',
                    duration: 2,
                });
            },
            centered: true,
        });
    }


    return (
        <CRow>
            <CCol xs="12" md="9" className="mb-4">
                {user.role !== "sale" && (
                    <CCard>
                        <CCardHeader
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                            }}
                        >
                            Danh sách nhân sự
                        </CCardHeader>
                        <CCardBody>
                            <Form form={formUpdatePersonnel} {...formItemLayout} onFinish={handleUpdate}>

                                {user.role === "admin" && (
                                    <Form.Item
                                        name="manager"
                                        label="Manager"
                                        labelAlign="left"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn manager!',
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Chưa có manager!">
                                            {listManager.map((manager) => (
                                                <Option key={manager.id} value={manager.id} >
                                                    {manager.username}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                )}

                                <Form.Item
                                    label="Sales"
                                    labelAlign="left"
                                    name="sales"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn sales!",
                                        },
                                    ]}
                                    className="checkbox-group-row"
                                    {...formItemLayoutWithOutLabel}
                                >
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        {allSales && allSales.map(sales => (
                                            <div key={sales.id}>
                                                <Checkbox
                                                    value={sales.id}
                                                    style={{ margin: 0 }}
                                                >
                                                    {sales.username}
                                                </Checkbox>
                                            </div>
                                        ))}
                                    </Checkbox.Group>
                                </Form.Item>

                                <Button type="primary" block htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form>
                        </CCardBody>
                    </CCard>
                )}
            </CCol >
        </CRow >
    );

}
export default ListPersonnal
