import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Input, Select, notification, Checkbox } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';
import { getFacilityEmpty } from 'src/services/facility'
import { createManager } from 'src/services/manager'


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


function AddSaleVilla() {
    const [form] = Form.useForm()
    const { t } = useTranslation()
    const navigate = useNavigate();
    const [listFalicity, setListFalicity] = useState([]);

    useEffect(() => {
        const getListFacility = async () => {
            try {
                const res = await getFacilityEmpty();
                if (res.status === 1) {
                    setListFalicity(res.facility);
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        };

        getListFacility();
    }, []);

    const onFinish = async (values) => {

        var submitData = {
            name: values.username,
            phone: values.phone,
            facilities: values.facility,
            password: values.password,
            confirmPassword: values.confirmPassword
        }

        Modal.confirm({
            title: 'Xác nhận tạo tài khoản',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn thêm manager này?',
            onOk: async () => {
                const res = await createManager(submitData)
                if (res.status === 1) {
                    notification.success({
                        message: 'Thêm manager thành công!',
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-manager');
                } else {
                    notification.error({
                        message: 'Tạo tài khoản thất bại!',
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }

            },
            onCancel() {
                notification.info({
                    message: 'Hủy tạo tài khoản',
                    placement: 'bottomRight',
                    duration: 2,
                });
            },
            centered: true,
        });
    };

    if(listFalicity.length === 0){
        return (
            <div>Tất cả các cơ sở đã có Manager</div>
        )
    }

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
                        Thêm manager
                    </CCardHeader>
                    <CCardBody>
                        <Form form={form} {...formItemLayout} onFinish={onFinish}>
                            <Form.Item
                                label="Họ và tên"
                                labelAlign="left"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập họ và tên!",
                                    },
                                ]}
                            >
                                <Input placeholder="Vui lòng nhập họ và tên!"/>
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
                                        message: t("Vui lòng chọn cơ sở!"),
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
export default AddSaleVilla
