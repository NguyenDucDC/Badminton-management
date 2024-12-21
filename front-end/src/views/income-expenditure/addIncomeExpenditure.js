import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Button, Modal, Form, Input, Radio, notification, DatePicker, Checkbox, InputNumber } from 'antd'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getFacility } from 'src/services/facility';
import { createIncomeExpenditure } from '../../services/incomeExpenditure'

import styles from "./addIncomeExpenditure.module.scss"
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

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 0 },
    },
};

function AddIncomeExpenditure() {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [listFacility, setListFacility] = useState([])
    const user = useSelector(state => state.user.data)
    const [file, setFile] = useState(null)
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        handleGetListFacility();
    }, []);

    const handleGetListFacility = async () => {
        try {
            const res = await getFacility(user.id)
            if (res.status === 1) {
                setListFacility(res.facility)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const onFinish = async (values) => {
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append('images', image);
        });

        formData.append('title', values.title);
        formData.append('type', values.type);
        formData.append('facility_id', values.facility);
        formData.append('time', values.time);
        formData.append('value', values.value);
        formData.append('detail', values.detail);

        try {
            const res = await createIncomeExpenditure(formData)
            if (res.status === 1) {
                notification.success({
                    message: "Thêm khoản thu/chi thành công!",
                    placement: 'bottomRight',
                    duration: 2,
                });
                navigate('/list-income-expenditure');
            }
        } catch (err) {
            console.log("err: ", err)
            notification.error({
                message: "Thêm khoản thu/chi thất bại!",
                placement: 'bottomRight',
                duration: 2,
            });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prevImages => [...prevImages, ...files]);
    };

    const removeImage = (indexToRemove) => {
        setSelectedImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
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
                        Thêm khoản thu/chi
                    </CCardHeader>
                    <CCardBody style={{ padding: "40px" }}>
                        <Form form={form} {...formItemLayout} onFinish={onFinish}>
                            <Form.Item
                                label="Tên khoản thu/chi"
                                labelAlign="left"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên khoản thu/chi!",
                                    },
                                ]}
                            >
                                <Input placeholder="Vui lòng nhập tên khoản thu/chi!" />
                            </Form.Item>

                            <Form.Item
                                label="Loại khoản"
                                labelAlign="left"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn loại khoản!",
                                    },
                                ]}
                                className="checkbox-group-row"
                                {...formItemLayoutWithOutLabel}
                            >
                                <Radio.Group >
                                    <Radio
                                        key='income'
                                        value='income'
                                        style={{ display: 'block', margin: 0 }}
                                    >
                                        Khoản thu
                                    </Radio>
                                    <Radio
                                        key='expenditure'
                                        value='expenditure'
                                        style={{ display: 'block', margin: 0 }}
                                    >
                                        Khoản chi
                                    </Radio>
                                </Radio.Group >
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
                                <Radio.Group >
                                    {listFacility && listFacility.map(facility => (
                                        <Radio
                                            key={facility.id}
                                            value={facility.id}
                                            style={{ display: 'block', margin: 0 }}
                                        >
                                            {facility.name}
                                        </Radio>
                                    ))}
                                </Radio.Group >
                            </Form.Item>

                            <Form.Item
                                label="Ngày thu/chi"
                                labelAlign="left"
                                name="time"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập thời gian thu/chi!",
                                    },
                                ]}
                            >
                                <DatePicker
                                    showTime={{
                                        defaultValue: moment('00:00:00', 'hh:mm:ss'),
                                    }}
                                    format="DD-MM-YYYY"
                                    placeholder="Thời gian thu/chi!"
                                    style={{ largeText: '26px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số tiền"
                                labelAlign="left"
                                name="value"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số tiền",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Vui lòng nhập số tiền"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Chi tiết"
                                labelAlign="left"
                                name="detail"
                            >

                                <Input.TextArea
                                    placeholder="Vui lòng nhập chi tiết khoản thu!"
                                    autoSize={{ minRows: 3 }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Báo cáo/ hợp đồng/ hoá đơn"
                                labelAlign="left"
                                name="avatar"
                                value={file}
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    setFile(file)
                                }}
                            >
                                <Input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />

                                {selectedImages.length > 0 && (
                                    <div className={cx('image-preview')}>
                                        {selectedImages.map((image, index) => (
                                            <div key={index} className={cx('image-container')}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`preview-${index}`}
                                                    className={cx('preview-image')}
                                                />
                                                <button
                                                    className={cx('remove-button')}
                                                    onClick={() => removeImage(index)}
                                                    type="button"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Form.Item>

                            <Button type="primary" block htmlType="submit">
                                Thêm
                            </Button>
                        </Form>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}
export default AddIncomeExpenditure
