import React, { useState } from 'react'
import { Button, Modal, Form, Input, notification } from 'antd'
import { changePassword } from '../../services/user'

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

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
}

function Password() {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [passwordMatch, setPasswordMatch] = useState(false)
    const validateConfirmPassword = (_, value) => {
        if (value && value !== form.getFieldValue('newPassword')) {
            setPasswordMatch(false)
            return Promise.reject(new Error('Mật khẩu không khớp!'))
        }
        setPasswordMatch(true)
        return Promise.resolve()
    }

    const onFinish = async (values) => {
        const inputs = values
        const updatePass = async () => {
            try {
                const res = await changePassword(inputs)
                if (res.status === 1) {
                    handleCancel()
                    notification.success({
                        message: `Notification`,
                        description: `${res.message}`,
                        placement: `bottomRight`,
                        duration: 1.5,
                    })
                }
            } catch (err) {
                if (err.validationErrors) {
                    const error = []
                    for (const [key, value] of Object.entries(err.validationErrors)) {
                        error.push({ name: key, errors: [`${value}`] })
                    }
                    form.setFields(error)
                }
                notification.error({
                    message: `Error`,
                    description: err.message,
                    placement: `bottomRight`,
                    duration: 1.5,
                })

            }
        }
        updatePass()
    }

    const handleCancel = () => {
        setVisible(false)
        form.resetFields()
    }

    return (
        <>
            <Modal
                centered={true}
                open={visible}
                title="Đổi mật khẩu"
                footer={null}
                onCancel={handleCancel}
            >
                <Form form={form} {...formItemLayout} name="form_in_modal" onFinish={onFinish}>
                    <Form.Item
                        name="password"
                        label="Mật khẩu cũ"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='Vui lòng nhập mật khẩu!' />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu mới!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='Vui lòng nhập mật khẩu mới!' />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Nhập lại mật khẩu"
                        dependencies={['newPassword']}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lại mật khẩu mới!',
                            },
                            {
                                validator: validateConfirmPassword,
                            },
                        ]}
                    >
                        <Input.Password placeholder='Vui lòng nhập lại mật khẩu mới!' />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 8 }}
                            disabled={!passwordMatch}
                        >
                            Cập nhật
                        </Button>
                        <Button htmlType="button" onClick={handleCancel}>
                            Huỷ
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => setVisible(true)}>
                Đổi mật khẩu
            </Button>
        </>
    )
}

export default Password
