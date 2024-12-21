import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, Modal, Form, Input, notification, Checkbox, DatePicker } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getFacility, lockFacility } from 'src/services/facility'

import moment from 'moment';

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

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 0 },
    },
};

function LockFacility() {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [listFacility, setListFacility] = useState([])


    useEffect(() => {
        getListFacility();
    }, []);

    const getListFacility = async () => {
        try {
            const res = await getFacility();
            if (res.status === 1) {
                setListFacility(res.facility);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const onFinish = async (values) => {

        var submitData = {
            facilitiesId: values.facility,
            time_start: values.time_start,
            time_end: values.time_end,
            note: values.note
        }

        Modal.confirm({
            title: 'Xác nhận khoá cơ sở',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn khoá cơ sở này?',
            onOk: async () => {
                const res = await lockFacility(submitData)
                if (res.status === 1) {
                    notification.success({
                        message: "Khoá cơ sở thành công!",
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    navigate('/list-lock-facility');
                } else {
                    notification.error({
                        message: "Khoá cơ sở thất bại!",
                        placement: 'bottomRight',
                        duration: 2,
                    });
                }

            },
            centered: true,
        });
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
                        Khoá cơ sở
                    </CCardHeader>
                    <CCardBody>
                        <Form form={form} {...formItemLayout} onFinish={onFinish}>
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
                                    {listFacility && listFacility.map(facility => (
                                        <div key={facility.id}>
                                            <Checkbox
                                                value={facility.id}
                                                style={{ margin: 0 }}
                                            >
                                                {facility.name}
                                            </Checkbox>
                                        </div>
                                    ))}
                                </Checkbox.Group >
                            </Form.Item>

                            <Form.Item
                                label="Thời gian bắt đầu"
                                labelAlign="left"
                                name="time_start"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập thời gian bắt đầu!",
                                    },
                                ]}
                            >
                                <DatePicker
                                    showTime={{
                                        format: 'HH',
                                        defaultValue: moment('00:00', 'mm:ss'),
                                    }}
                                    format="HH[h] : DD-MM-YYYY"
                                    placeholder="Thời gian bắt đầu!"
                                    style={{ largeText: '26px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Thời gian kết thúc"
                                labelAlign="left"
                                name="time_end"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập thời gian kết thúc!",
                                    },

                                ]}
                            >
                                <DatePicker
                                    showTime={{
                                        format: 'HH',
                                        defaultValue: moment('00:00', 'mm:ss'),
                                    }}
                                    format="HH[h] : DD-MM-YYYY"
                                    placeholder="Thời gian kết thúc!"
                                    style={{ largeText: '26px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú"
                                labelAlign="left"
                                name="note"
                            >
                                <Input.TextArea
                                    placeholder="Vui lòng nhập ghi chú!"
                                    autoSize={{ minRows: 3 }}
                                />
                            </Form.Item>

                            <Button type="primary" block htmlType="submit">
                                Khoá
                            </Button>
                        </Form>
                    </CCardBody>
                </CCard>
            </CCol >
        </CRow >
    );
}

export default LockFacility
