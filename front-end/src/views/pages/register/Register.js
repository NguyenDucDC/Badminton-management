import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import './_register.scss'
import logo from 'src/assets/logo.webp'
import { Button, Form, Input, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons'

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


const Register = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate();


  // const onFinish = async (values) => {
  //   var submitData = {
  //     username: values.username,
  //     phone: values.phone,
  //     password: values.password,
  //     confirmPassword: values.confirmPassword
  //   }

  //   const res = await createVillaManager(submitData)
  //   // console.log('res.status', res.status);
  //   if (res.status === 1) {
  //     notification.success({
  //       message: t('Tạo tài khoản thành công'),
  //       placement: 'bottomRight',
  //       duration: 2,
  //     });
  //     navigate('/login');
  //   } else {
  //     notification.error({
  //       message: t('Tạo tài khoản thất bại'),
  //       placement: 'bottomRight',
  //       duration: 2,
  //     });
  //   }
  // };



  return (
    <>
      <div className="min-vh-100 login-container">
        <div className="logo">
          <img src={logo} className="brand-image rounded-circle" alt="pipgo" />
          <h1 className="logo-brand">Badminton</h1>
        </div>
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={5}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <h2 className="login-title">Đăng Ký</h2>
                    <Form name="normal_login" className="login-form" onFinish={onFinish}>
                      <Form.Item
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập họ và tên!',
                          },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="site-form-item-icon" />}
                          placeholder={'Họ và tên'}
                        />
                      </Form.Item>
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
                          prefix={<MailOutlined className="site-form-item-icon" />}
                          placeholder={'Số điện thoại'}
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                          },
                        ]}
                      >
                        <Input
                          prefix={<LockOutlined className="site-form-item-icon" />}
                          type="password"
                          placeholder={'Mẩu khẩu'}
                        />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu!!',
                          },
                        ]}
                      >
                        <Input
                          prefix={<LockOutlined className="site-form-item-icon" />}
                          type="password"
                          placeholder={'Xác nhận mật khẩu'}
                        />
                      </Form.Item>


                      <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                          {'Đăng ký'}
                        </Button>
                      </Form.Item>

                      <Form.Item>

                        <Link className="login-form-forgot float-right" to="/login">
                          {'Quay lại trang đăng nhập'}
                        </Link>
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

export default Register
