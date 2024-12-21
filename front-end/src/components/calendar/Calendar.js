import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Form, DatePicker, Tooltip } from 'antd'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { getCalendarByDate, getLockByDate } from 'src/services/facility'

import styles from "./Calendar.module.scss"
import classNames from "classnames/bind"

const moment = require('moment-timezone');

const cx = classNames.bind(styles)

function Calendar({ data }) {
    const [formCalendar] = Form.useForm()
    const navigate = useNavigate();
    const { id } = useParams()
    const user = useSelector(state => state.user.data)
    const [calendarData, setCalendarData] = useState([])
    const [lockData, setLockData] = useState([])

    const handleGetCalendar = async () => {
        const date = formCalendar.getFieldsValue('date')

        try {
            const res = await getCalendarByDate(id, date)
            if (res.status === 1) {
                setCalendarData(res.calendar)
            }
        } catch (err) {
            console.log("err: ", err)
        }

        try {
            const res = await getLockByDate(id, date)
            if (res.status === 1) {
                setLockData(res.lock)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const getHourIndex = time => moment(time).hours();

    return (
        <CRow>
            <CCol xs="12" md="12" className="mb-4">
                <CCard>
                    <CCardHeader
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                        }}
                    >
                        Lịch đặt sân
                    </CCardHeader>
                    <CCardBody>
                        <Form form={formCalendar}>
                            <Form.Item
                                name="date"
                                label="Chọn ngày"
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày"
                                    onChange={handleGetCalendar}
                                />
                            </Form.Item>
                        </Form>

                        <div className={cx('table-container')}>
                            <table className={cx('table-calendar')}>
                                <thead>
                                    <tr>
                                        <th>Sân</th>
                                        {Array.from({ length: 24 }, (_, index) => (
                                            <th key={index}>{index.toString().padStart(2, '0')}</th>
                                        ))}
                                    </tr>

                                </thead>
                                <tbody>
                                    {Array.from({ length: data?.number }, (_, courtIndex) => {
                                        const ordersForCourt = calendarData.filter(order => order.court_id === courtIndex + 1);

                                        return (
                                            <tr key={courtIndex}>
                                                <td>{courtIndex + 1}</td>

                                                {Array.from({ length: 24 }, (_, hourIndex) => {
                                                    // Kiểm tra xem có đơn hàng nào ở sân này, trong giờ này không
                                                    const date = moment(formCalendar.getFieldValue('date'));
                                                    const orderInThisHour = ordersForCourt.find(order => {
                                                        const checkIn = moment(order.checkIn);
                                                        const isCheckInToday = checkIn.isSame(date, 'day');
                                                        const checkInHour = getHourIndex(order.checkIn);
                                                        const checkOutHour = getHourIndex(order.checkOut);
                                                        if (checkInHour < checkOutHour) {
                                                            return hourIndex >= checkInHour && hourIndex < checkOutHour;
                                                        } else if (isCheckInToday) {
                                                            return hourIndex >= checkInHour
                                                        } else if (!isCheckInToday) {
                                                            return hourIndex < checkOutHour
                                                        }
                                                    });

                                                    const lockInThisHour = lockData.find(lock => {
                                                        const timeStart = moment(lock.time_start);
                                                        const timeEnd = moment(lock.time_end);

                                                        return date.isBetween(timeStart, timeEnd, 'hour', '[)');
                                                    });

                                                    return (
                                                        <td
                                                            key={hourIndex}
                                                            className={cx(orderInThisHour || lockInThisHour ? 'cell-booked' : 'cell-available')}
                                                            onClick={() => {
                                                                if (user.role !== "sale" && orderInThisHour) {
                                                                    navigate(`/detail-order/${orderInThisHour.id}`)
                                                                }
                                                            }
                                                            }
                                                        >
                                                            {orderInThisHour ? (
                                                                <>
                                                                    <div className={cx('tooltip')}>
                                                                        <p>Tên: {orderInThisHour.cus_name}</p>
                                                                        <p>Số điện thoại: {orderInThisHour.cus_phone}</p>
                                                                        {orderInThisHour.note && (
                                                                            <pre style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>Ghi chú: {orderInThisHour.note}</pre>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            ) : null}

                                                            {lockInThisHour ? (
                                                                <>
                                                                    <div className={cx('tooltip')}>
                                                                        {lockInThisHour.note && (
                                                                            <pre style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
                                                                                <Tooltip title={lockInThisHour.note}>
                                                                                    <div>
                                                                                        {lockInThisHour.note && lockInThisHour.note.length > 30 ? `${lockInThisHour.note.substring(0, 30)}...` : lockInThisHour.note}
                                                                                    </div>
                                                                                </Tooltip>
                                                                            </pre>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol >
        </CRow >
    );

}
export default Calendar
