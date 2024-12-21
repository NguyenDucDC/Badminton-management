import React, { useEffect, useState } from 'react'
import { Button, Descriptions, notification, Form, Modal, Input } from 'antd'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { getProfile, updateProfile, updateAvt } from 'src/services/user'
import { getToken } from 'src/services/auth'
import { useTranslation } from 'react-i18next'
import Password from 'src/components/password/Password'
import { CameraOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'

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

function Profile() {
  const { t } = useTranslation()
  const [data, setData] = useState({})
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [visibleChangeAvt, setVisibleChangeAvt] = useState(false);
  const [file, setFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const UserId = useSelector((state) => state.user.data.userId);

  useEffect(() => {
    const getProf = async () => {
      try {
        const res = await getProfile()
        if (res.status === 1) {
          setData(res.user)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getProf()
  }, [])

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
        const res = await updateAvt(formData)
        if (res) {
          const data = await getProfile()
          if (data) {
            setData(data.user)
          }
          setVisibleChangeAvt(false)
          notification.success({
            message: `Notification`,
            description: `${res.message}`,
            placement: `bottomRight`,
            duration: 1.5,
          })
        }
      } catch (err) {
        if (err.status === 401) {
          getToken(updateAvt)
        } else
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

  const onUpdate = async () => {
    const values = await form.validateFields()
    const updateProf = async () => {
      try {
        const res = await updateProfile(values)
        if (res.status === 1) {
          const data = await getProfile()
          if (data.status === 1) {
            setData(data.user)
          }
          setVisible(false)
          notification.success({
            message: `Notification`,
            description: `${res.message}`,
            placement: `bottomRight`,
            duration: 1.5,
          })
        }
      } catch (err) {
        if (err.status === 401) {
          getToken(updateProf)
        } else
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
    <>
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
              label={t("Avatar")}
              labelAlign="left"
              name="avatar"
              value={file}
              onChange={(e) => {
                const file = e.target.files[0]
                setFile(file)
              }}
              rules={[
                {
                  message: t("Vui lòng chọn ảnh đại diện!"),
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
          style={{ marginTop: ' 100px ' }}
          centered={true}
          open={visible}
          title={t('Update profile')}
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
            >
              <Input placeholder={'Vui lòng nhập họ tên!'} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
              ]}
            >
              <Input placeholder={'Vui lòng nhập số điện thoại!'} />
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
                    <Descriptions.Item label={t('Họ và tên')} span={3}>
                      {data.username}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Số điện thoại')} span={3}>
                      {data.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Role')} span={3}>
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
    </>
  )
}

export default Profile
