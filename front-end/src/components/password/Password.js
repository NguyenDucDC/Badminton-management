import React, { useState, useContext, useEffect } from 'react'
import { Button, Modal, Form, Input, Select, notification, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { changePassword } from 'src/services/auth'
import { getToken } from 'src/services/auth'

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
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(false)
  const validateConfirmPassword = (_, value) => {
    if (value && value !== form.getFieldValue('newPassword')) {
      setPasswordMatch(false)
      return Promise.reject(new Error(t('The two passwords that you entered do not match!')))
    }
    setPasswordMatch(true)
    return Promise.resolve()
  }

  const onFinish = async (values) => {
    const inputs = values
    const updatePass = async () => {
      try {
        const res = await changePassword(inputs)

        setVisible(false)
        notification.success({
          message: `Notification`,
          description: `${res.message}`,
          placement: `bottomRight`,
          duration: 1.5,
        })
      } catch (err) {
        if (err.status === 401) {
          getToken(updatePass)
        } else {
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
    }
    updatePass()
  }
  return (
    <>
      <Modal
        style={{ marginTop: ' 100px ' }}
        centered={true}
        open={visible}
        title="Đổi mật khẩu"
        footer={null}
        onCancel={() => setVisible(false)}
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
            <Input.Password placeholder={'Vui lòng nhập mật khẩu!'} />
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
            <Input.Password placeholder={'Vui lòng nhập mật khẩu mới!'} />
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
            <Input.Password placeholder={'Vui lòng nhập lại mật khẩu mới!'} />
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
            <Button htmlType="button" onClick={() => setVisible(false)}>
              Huỷ
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => setVisible(true)}>
        {t('Change password')}
      </Button>
    </>
  )
}

export default Password
