import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Input, Select, notification, Checkbox } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';
import { getFacility } from '../../services/facility'
import { createSales } from '../../services/sales'

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


function AddSale() {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [listFalicity, setListFalicity] = useState([]);

    useEffect(() => {
        getListFacility();
    }, []);

    const getListFacility = async () => {
        try {
            const res = await getFacility();
            if (res.status === 1) {
                let facilityArray = []
                res.facility.map(facility => {
                    if (facility.status === 1) {
                        facilityArray.push(facility)
                    }
                })
                setListFalicity(facilityArray);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const onFinish = async (values) => {

        var submitData = {
            name: values.name,
            phone: values.phone,
            facilities: values.facility,
            password: values.password,
            confirmPassword: values.confirmPassword
        }

        Modal.confirm({
            title: 'Xác nhận thêm sales',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn thêm sales này?',
            onOk: async () => {
                const res = await createSales(submitData)
                if (res.status === 1) {
                    notification.success({
                        message: 'Thêm sales thành công',
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-sales');
                } else {
                    notification.error({
                        message: 'Thêm sales thất bại',
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }

            },
            onCancel() {
                notification.info({
                    message: 'Hủy',
                    placement: 'bottomRight',
                    duration: 2,
                });
            },
            centered: true,
        });
    };

    return (
        <CRow>
            <CCol xs="12" md="9" className="mb-4">
                <CCard>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        Thêm Sale
                    </CCardHeader>
                    <CCardBody>
                        <Form form={form} {...formItemLayout} onFinish={onFinish}>
                            <Form.Item
                                label="Họ và tên"
                                labelAlign="left"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập họ và tên!",
                                    },
                                ]}
                            >
                                <Input placeholder="Vui lòng nhập họ và tên!" />
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại"
                                labelAlign="left"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại!",
                                    },
                                ]}
                            >
                                <Input placeholder="Vui lòng nhập số điện thoại!" />
                            </Form.Item>

                            <Form.Item
                                label="Cơ sở"
                                labelAlign="left"
                                name="facility"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn cơ sở!",
                                    },
                                ]}
                                className="checkbox-group-row"
                                {...formItemLayoutWithOutLabel}
                            >
                                <Checkbox.Group style={{ width: '100%' }}>
                                    {listFalicity && listFalicity.map(facility => (
                                        <div key={facility.id}>
                                            <Checkbox
                                                value={facility.id}
                                                style={{ margin: 0 }}
                                            >
                                                {facility.name}
                                            </Checkbox>
                                        </div>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                labelAlign="left"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu!",
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Vui lòng nhập mật khẩu!" />
                            </Form.Item>
                            <Form.Item
                                label="Xác nhận mật khẩu"
                                labelAlign="left"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập lại mật khẩu!",
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Vui lòng nhập lại mật khẩu!" />
                            </Form.Item>

                            <Button type="primary" block htmlType="submit">
                                Thêm
                            </Button>
                        </Form>
                    </CCardBody>
                </CCard>
            </CCol >
        </CRow >


    );

}
export default AddSale
