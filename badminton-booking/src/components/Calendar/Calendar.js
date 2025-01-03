import React, { useState, useEffect } from 'react'
import { Form, DatePicker } from 'antd'
import { useParams } from 'react-router-dom';
import { getCalendarByDate } from 'src/services/calendar'

import styles from "./Calendar.module.scss"
import classNames from "classnames/bind"

const moment = require('moment-timezone');

const cx = classNames.bind(styles)

function Calendar({ data }) {
    const [formCalendar] = Form.useForm()
    const { id } = useParams()
    const [calendarData, setCalendarData] = useState([])

    const haldleGetCalendar = async () => {
        try {
            const date = formCalendar.getFieldsValue('date')
            const res = await getCalendarByDate(id, date)
            if (res.status === 1) {
                setCalendarData(res.calendar)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    const getHourIndex = time => moment(time).hours();

    return (
        <div className={cx('calendar')}>
            <div className={cx('title')}>Lịch đặt sân</div>
            <Form form={formCalendar}>
                <Form.Item
                    name="date"
                    label="Chọn ngày"
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                        onChange={haldleGetCalendar}
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

                                        return (
                                            <td
                                                key={hourIndex}
                                                className={cx(orderInThisHour ? 'cell-booked' : 'cell-available')}
                                            >
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Calendar
