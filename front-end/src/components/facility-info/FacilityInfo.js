import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Table, Space, Button, Modal, Form, Input, Select, notification, Checkbox, DatePicker } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom';
import { updateFacility, getDetailFacility } from 'src/services/facility'
import { useSelector } from 'react-redux'

import styles from "./FacilityInfo.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

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

function FacilityInfo() {
    const [form] = Form.useForm()
    const [formUpdatePersonnel] = Form.useForm()
    const navigate = useNavigate();
    const { id } = useParams()
    const [status, setStatus] = useState(1);
    const user = useSelector(state => state.user.data)
    const { Option } = Select;
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        getFacility()
    }, [])

    const getFacility = async () => {
        try {
            const res = await getDetailFacility(id)
            if (res.status === 1) {
                setStatus(res.facility.status)
                setImagePreview(res.facility.avatarURL)

                form.setFieldsValue({
                    facility_name: res.facility.name,
                    address: res.facility.address,
                    number: res.facility.number,
                    status: res.facility.status,
                    note: res.facility.note
                });

                formUpdatePersonnel.setFieldsValue({
                    manager: res.facility.manager_id,
                })
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const onFinish = async (values) => {

        let submitData = new FormData();

        submitData.append('name', values.facility_name);
        submitData.append('address', values.address);
        submitData.append('number', values.number);
        submitData.append('status', values.status);
        submitData.append('note', values.note);

        if (file) {
            submitData.append('image', file);
        }

        Modal.confirm({
            title: 'Xác nhận cập nhật',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn cập nhật cơ sở này?',
            onOk: async () => {
                const res = await updateFacility(id, submitData)
                if (res.status === 1) {
                    notification.success({
                        message: "Cập nhật cơ sở thành công!",
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-facility');
                } else {
                    notification.error({
                        message: "Cập nhật cơ sở thất bại!",
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }

            },
            onCancel() {
                notification.info({
                    message: 'Hủy tạo cập nhật',
                    placement: 'bottomRight',
                    duration: 2,
                });
            },
            centered: true,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    return (
        <CRow>
            <CCol xs="12" md="9" className="mb-2">
                <CCard className='mb-4'>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        Chi tiết cơ sở
                    </CCardHeader>
                    <CCardBody>
                        <Form form={form} {...formItemLayout} onFinish={onFinish}>
                            <Form.Item
                                label="Tên cơ sở"
                                labelAlign="left"
                                name="facility_name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên cơ sở!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Vui lòng nhập tên cơ sở!"
                                    readOnly={user.role === "manager" || user.role === "sale"}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                labelAlign="left"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập địa chỉ!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Vui lòng nhập địa chỉ!"
                                    readOnly={user.role === "manager" || user.role === "sale"}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Số lượng sân"
                                labelAlign="left"
                                name="number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số lượng sân!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Vui lòng nhập số lượng sân!"
                                    readOnly={user.role === "manager" || user.role === "sale"}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ảnh đại diện"
                                labelAlign="left"
                                name="avatar"
                                value={file}
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    setFile(file)
                                }}
                            >
                                {user.role === 'admin' && (
                                    <Input style={{ marginBottom: '20px' }} type="file" onChange={handleFileChange} />
                                )}
                                <div className={cx('preview-avatar')}>
                                    <img src={imagePreview} />
                                </div>
                            </Form.Item>



                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn trạng thái!',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={(value) => setStatus(value)}
                                    value={status}
                                    style={{ color: status === 1 ? 'green' : 'red' }}
                                    disabled={user.role === "manager" || user.role === "sale"}
                                >
                                    <Option value={1} style={{ color: 'green' }}>Đang hoạt động</Option>
                                    <Option value={0} style={{ color: 'red' }}>Dừng hoạt động</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú"
                                labelAlign="left"
                                name="note"
                                rules={[
                                    {
                                        required: false,
                                        message: "Vui lòng nhập số lượng sân!",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Vui lòng nhập ghi chú!"
                                    rows={4}
                                    readOnly={user.role === "manager" || user.role === "sale"}
                                />
                            </Form.Item>

                            {user.role === "admin" && (
                                <Button type="primary" block htmlType="submit">
                                    Cập nhật
                                </Button>
                            )}

                        </Form>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    );

}
export default FacilityInfo
