import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, Modal, Form, Input, notification } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import { createFacility } from 'src/services/facility'
import styles from "../../components/facility-info/FacilityInfo.module.scss"
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

function AddFacility() {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);

    const onFinish = async (values) => {

        let submitData = new FormData();

        submitData.append('name', values.facility_name);
        submitData.append('address', values.address);
        submitData.append('number', values.number);
        submitData.append('note', values.note);
        submitData.append('image', file);


        Modal.confirm({
            title: 'Xác nhận thêm cơ sở',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn thêm cơ sở này?',
            onOk: async () => {
                const res = await createFacility(submitData)
                if (res.status === 1) {
                    notification.success({
                        message: "Thêm cơ sở thành công!",
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-facility');
                } else {
                    notification.error({
                        message: "Thêm cơ sở thất bại!",
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }

            },
            onCancel() {
                // notification.info({
                //     message: t('Hủy tạo tài khoản'),
                //     placement: 'bottomRight',
                //     duration: 2,
                // });
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
            <CCol xs="12" md="9" className="mb-4">
                <CCard>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        Thêm Cơ Sở
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
                                <Input placeholder="Vui lòng nhập tên cơ sở!" />
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
                                <Input placeholder="Vui lòng nhập địa chỉ!" />
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
                                <Input placeholder="Vui lòng nhập số lượng sân!" />
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
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng tải lên ảnh đại diện cơ sở!",
                                    },
                                ]}
                            >
                                <Input type="file" onChange={handleFileChange} />
                            </Form.Item>

                            <div className={cx('preview-avatar')}>
                                <img src={imagePreview} />
                            </div>

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
                                />
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
export default AddFacility
