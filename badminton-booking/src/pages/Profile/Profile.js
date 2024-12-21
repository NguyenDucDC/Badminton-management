import React, { useEffect, useState } from 'react'
import { Button, Descriptions, notification, Form, Modal, Input } from 'antd'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { getUser, updateProfile, updateAvt } from '../../services/user'
import { CameraOutlined } from '@ant-design/icons';
import Password from '../../components/Password/Password';
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";

const cx = classNames.bind(styles)

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
}
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
}

function Profile() {
    const [data, setData] = useState({})
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [visibleChangeAvt, setVisibleChangeAvt] = useState(false);
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        handlegGetProfile()
    }, [])

    const handlegGetProfile = async () => {
        try {
            const res = await getUser(userId)
            if (res.status === 1) {
                setData(res.user)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleClick = () => {
        setVisible(true)
        form.resetFields()
        form.setFieldsValue({
            username: data.username,
            phone: data.phone,
        })
    }

    const handleUpdateAvt = () => {
        const updateAvatar = async () => {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await updateAvt(formData, userId)
                if (res) {
                    handlegGetProfile()
                    setVisibleChangeAvt(false)
                    notification.success({
                        message: `Notification`,
                        description: `${res.message}`,
                        placement: `bottomRight`,
                        duration: 1.5,
                    })
                }
            } catch (err) {
                console.log(err)
                notification.error({
                    message: `Error`,
                    description: `${err.message}`,
                    placement: `bottomRight`,
                    duration: 1.5,
                })
            }
        }
        updateAvatar();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    // update profile
    const onUpdate = async () => {
        const values = await form.validateFields()
        const updateProf = async () => {
            try {
                const res = await updateProfile(values)
                if (res.status === 1) {
                    handlegGetProfile()
                    setVisible(false)
                    notification.success({
                        message: `Notification`,
                        description: `${res.message}`,
                        placement: `bottomRight`,
                        duration: 1.5,
                    })
                }
            } catch (err) {
                console.log(err)
                notification.error({
                    message: `Error`,
                    description: `${err.message}`,
                    placement: `bottomRight`,
                    duration: 1.5,
                })
            }
        }
        updateProf()
    }

    return (
        <div className={cx('profile')}>
            <CRow className="justify-content-center">
                <Modal
                    style={{ marginTop: ' 100px ' }}
                    centered={true}
                    open={visibleChangeAvt}
                    title='Cập nhật ảnh đại diện'
                    footer={null}
                    onCancel={() => {
                        setVisibleChangeAvt(false)
                        setImagePreview(data.avatarURL)
                        form.resetFields();
                    }}
                >
                    <Form form={form}>
                        <div style={{
                            margin: '30px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <div
                                style={{
                                    position: 'relative',
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                }}>
                                <img
                                    src={imagePreview || data.avatarURL}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                    }}
                                />
                            </div>
                        </div>
                        <Form.Item
                            label="Avatar"
                            labelAlign="left"
                            name="avatar"
                            value={file}
                            onChange={(e) => {
                                const file = e.target.files[0]
                                setFile(file)
                            }}
                            rules={[
                                {
                                    message: "Vui lòng chọn ảnh đại diện!",
                                },
                            ]}

                        >
                            <Input type="file" onChange={handleFileChange} />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button
                                type="primary"
                                htmlType="button"
                                style={{ marginRight: '8px', marginTop: '15px' }}
                                onClick={handleUpdateAvt}
                            >
                                Cập nhật
                            </Button>
                            <Button htmlType="button" onClick={() => {
                                setVisibleChangeAvt(false)
                                setImagePreview(data.avatarURL)
                                form.resetFields();
                            }}>
                                Huỷ
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    centered={true}
                    open={visible}
                    title='Cập nhật thông tin tài khoản'
                    footer={null}
                    onCancel={() => setVisible(false)}
                >
                    <Form form={form} {...formItemLayout} name="form_in_modal">
                        <Form.Item
                            name="username"
                            label="Họ và tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên!',
                                },
                            ]}
                            style={{ marginTop: '30px' }}
                        >
                            <Input placeholder='Vui lòng nhập họ tên!' />
                        </Form.Item>
                        
                        <Form.Item {...tailLayout}>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => onUpdate()}
                                style={{ marginRight: '8px' }}
                            >
                                Cập nhật
                            </Button>
                            <Button htmlType="button" onClick={() => setVisible(false)}>
                                Huỷ
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <CCol xs="12" sm="12">
                    <CCard>
                        <CCardBody>
                            {data && (
                                <div>
                                    <h3>Thông tin tài khoản</h3>
                                    <div style={{
                                        margin: '30px',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <div
                                            style={{
                                                position: 'relative',
                                                width: '200px',
                                                height: '200px',
                                                borderRadius: '50%',
                                            }}>
                                            <img
                                                src={data.avatarURL}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#ccc',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    top: '150px',
                                                    left: '150px',
                                                }}
                                                onClick={() => setVisibleChangeAvt(true)}
                                            >
                                                <CameraOutlined />
                                            </div>
                                        </div>

                                    </div>

                                    <Descriptions bordered>
                                        <Descriptions.Item label='Họ và tên' span={3}>
                                            {data.username}
                                        </Descriptions.Item>
                                        <Descriptions.Item label='Số điện thoại' span={3}>
                                            {data.phone}
                                        </Descriptions.Item>
                                        <Descriptions.Item label='Role' span={3}>
                                            {data.role}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </div>

                            )}
                            <Password />
                            <Button
                                type="primary"
                                htmlType="button"
                                style={{ marginRight: '8px', marginTop: '15px' }}
                                onClick={handleClick}
                            >
                                Cập nhật
                            </Button>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export default Profile
