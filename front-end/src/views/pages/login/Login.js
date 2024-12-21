import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import { storeUserData } from 'src/services/auth'
import { useDispatch, useSelector } from 'react-redux'
import { login } from 'src/redux/actions/user'
import { Form, Input, Button } from 'antd'
import { PhoneOutlined, LockOutlined } from '@ant-design/icons'
import logo from 'src/assets/logo.webp'
import './_login.scss'

var _ = require('lodash')

const Login = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const onFinish = (values) => {
    const data = {}
    data.phone = values.phone
    data.password = values.password
    const loginThunk = login(data)
    dispatch(loginThunk)
  }

  useEffect(() => {
    if (!_.isEmpty(user.data)) {
      storeUserData(user.data)
      navigate('/')
    }
  }, [user])

  return (
    <>
      <div className="min-vh-100 login-container">
        <div className="logo">
          <img src={logo} className="brand-image rounded-circle" alt="badminton" />
          <h1 className="logo-brand">Badminton</h1>
        </div>
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={5}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <h2 className="login-title">Đăng Nhập</h2>
                    <Form name="normal_login" className="login-form" onFinish={onFinish}>
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                          },
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined className="site-form-item-icon" />}
                          placeholder={'Số điện thoại'}
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
                          },
                        ]}
                      >
                        <Input
                          prefix={<LockOutlined className="site-form-item-icon" />}
                          type="password"
                          placeholder={'Mật khẩu'}
                        />
                      </Form.Item>
                      
                      {/* <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                          {'Bạn chưa có tài khoản? '}
                        </Form.Item>

                        <Link className="login-form-forgot float-right" to="/register">
                          {'Đăng ký'}
                        </Link>
                      </Form.Item> */}

                      <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                          {'Đăng Nhập'}
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

export default Login
