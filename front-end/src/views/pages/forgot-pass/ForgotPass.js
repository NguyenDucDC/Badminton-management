import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CRow } from '@coreui/react'

import { forgotPassword } from 'src/services/auth'
import { getToken } from 'src/services/auth'
import { Form, Input, Button, Checkbox, message, Radio, notification } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { Roles } from '../../../config/Roles'
import logo from 'src/assets/logo.webp'
import './_forgot_pass.scss'

var _ = require('lodash')
const ForgotPass = () => {
  const [form] = Form.useForm()
  const onFinish = (values) => {
    const getNewPass = async () => {
      try {
        const res = await forgotPassword(values)

        notification.success({
          message: `Notification`,
          description: `${res.message}`,
          placement: `bottomRight`,
          duration: 1.5,
        })
      } catch (err) {
        if (err.status === 401) {
          getToken(getNewPass)
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

    getNewPass()
  }

  return (
    <>
      <div className="min-vh-100 forgot-pass-container">
        <div className="logo">
          <img src={logo} className="brand-image" alt="pipgo" />
          <h1 className="logo-brand">Pipgo</h1>
        </div>
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={5}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <h2 className="forgot-pass-title">Forgot your password</h2>
                    <Form
                      form={form}
                      name="normal_forgot-pass"
                      className="forgot-pass-form"
                      onFinish={onFinish}
                    >
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your email!',
                          },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="site-form-item-icon" />}
                          placeholder={'Email'}
                        />
                      </Form.Item>

                      <Form.Item
                        name="role"
                        rules={[
                          {
                            required: true,
                            message: 'Please select role',
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Radio value={Roles.ADMIN}>{'Admin'}</Radio>
                          <Radio value={Roles.SALE}>{'Sale'}</Radio>
                          <Radio value={Roles.EDITOR}>{'Editor'}</Radio>
                          <Radio value={Roles.ADS_MANAGER}>{'Ads'}</Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item>
                        <Button htmlType="submit" className="forgot-pass-form-button">
                          {'Send email'}
                        </Button>
                      </Form.Item>
                    </Form>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default ForgotPass
