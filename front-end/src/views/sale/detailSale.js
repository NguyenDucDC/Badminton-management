import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, Modal, Form, Input, notification, Checkbox, Select } from 'antd'
import { ExclamationCircleOutlined, CameraOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom';
import { getDetailSales, updateSales_ManagerAndAdmin, resetPasswordSales, updateAvatarSales } from 'src/services/sales'
import { getFacility } from '../../services/facility'
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

function DetailSale() {
    const [form] = Form.useForm()
    const user = useSelector((state) => state.user.data);
    const [fomrPassword] = Form.useForm()
    const [formModal] = Form.useForm()
    const { t } = useTranslation()
    const { id } = useParams();
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const [visibleChangeAvt, setVisibleChangeAvt] = useState(false);
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);
    const [status, setStatus] = useState(1);
    const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
    const [listFalicity, setListFalicity] = useState([]);

    useEffect(() => {
        getListFacility();
        getDetail();

    }, []);

    const getListFacility = async () => {
        try {
            const res = await getFacility();
            if (res.status === 1) {
                let facilityArray = []
                res.facility.map(facility => {
                    if (facility.status === 1) {
                        facilityArray.push(facility)
                    }
                })
                setListFalicity(facilityArray);
            }
        } catch (error) {
            console.error('Error fetching area villa list:', error);
        }
    };

    const getDetail = async () => {
        const res = await getDetailSales(id);
        if (res.status === 1) {
            setData(res.sales)
            setStatus(res.sales.status)

            form.setFieldsValue({
                name: res.sales.username,
                phone: res.sales.phone,
                status: res.sales.status,
                facility: res.sales.facilities && res.sales.facilities.map(facility => {
                    return facility.facility_id
                })
            });
        }
    };

    const onFinish = async (values) => {

        var submitData = {
            name: values.name,
            phone: values.phone,
            facilities: values.facility,
            status: values.status
        }

        Modal.confirm({
            title: 'Xác nhận cập nhật thông tin',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn cập nhật thông tin này?',
            onOk: async () => {
                const res = await updateSales_ManagerAndAdmin(id, submitData)
                if (res.status === 1) {
                    notification.success({
                        message: 'Cập nhật thông tin thành công',
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-sales');

                } else {
                    notification.error({
                        message: 'Cập nhật thông tin thất bại',
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }
            },
            onCancel: () => {
                notification.info({
                    message: 'Hủy cập nhật tài khoản',
                    placement: 'bottomRight',
                    duration: 2,
                });
            },
            centered: true,
        });
    };

    const handleUpdateAvt = async () => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await updateAvatarSales(id, formData)
            if (res.status === 1) {
                getDetail()
                setVisibleChangeAvt(false)
                notification.success({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 1.5,
                })
            }
        } catch (err) {
            console.log("err: ", err)
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    const showResetPasswordModal = () => {
        setResetPasswordVisible(true);
    };

    const handleResetPasswordOk = async (values) => {
        const data = {
            password: fomrPassword.getFieldValue("password")
        }

        try {
            const res = await resetPasswordSales(id, data);
            if (res.status === 1) {
                fomrPassword.resetFields();
                notification.success({
                    message: "Cập nhật mật khẩu thành công",
                    placement: 'bottomRight',
                    duration: 2,
                });
                setResetPasswordVisible(false);
            } else {
                notification.error({
                    message: "Cập nhật mật khẩu thất bại",
                    description: res.message,
                    placement: 'bottomRight',
                    duration: 2,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            notification.error({
                message: "Cập nhật mật khẩu thất bại",
                placement: 'bottomRight',
                duration: 2,
            });
        }
    };

    return (
        <CRow>
            <Modal
                title="Đổi mật khẩu"
                visible={resetPasswordVisible}
                onOk={handleResetPasswordOk}
                onCancel={() => {
                    fomrPassword.resetFields();
                    setResetPasswordVisible(false)
                }}
                style={{
                    marginTop: '30px'
                }}
            >
                <Form
                    form={fomrPassword}
                    {...formItemLayout}
                >
                    <Form.Item
                        name="password"
                        label="Mật khẩu mới"
                        labelAlign="left"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu mới!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        labelAlign="left"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng xác nhận mật khẩu!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                style={{ marginTop: ' 100px ' }}
                centered={true}
                open={visibleChangeAvt}
                title="Cập nhật ảnh đại diện"
                footer={null}
                onCancel={() => {
                    setVisibleChangeAvt(false)
                    setImagePreview(data.avatarURL)
                    formModal.resetFields();
                }}
            >
                <Form form={formModal}>
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
                            formModal.resetFields();
                        }}>
                            {t('Cancel')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <CCol xs="12" md="9" className="mb-4">
                <CCard>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}>
                        Chi tiết Sales
                    </CCardHeader>
                    <CCardBody>
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
                            </div>
                        </div>

                        <Form
                            form={form}
                            {...formItemLayout}
                            onFinish={onFinish}

                        >
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập họ và tên!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Cơ sở"
                                labelAlign="left"
                                name="facility"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn cơ sở!",
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
                                >
                                    <Option value={1} style={{ color: 'green' }}>Đang hoạt động</Option>
                                    <Option value={0} style={{ color: 'red' }}>Dừng hoạt động</Option>
                                </Select>
                            </Form.Item>

                            {user.role === 'manager' && (
                                <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                                        Cập nhật
                                    </Button>
                                    <Button type="primary" onClick={showResetPasswordModal}>
                                        Đổi mật khẩu
                                    </Button>
                                </Form.Item>
                            )}

                        </Form>

                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
export default DetailSale