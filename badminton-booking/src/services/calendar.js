import { AxiosConfig } from '../config/AxiosConfig'

// get calendar by date
export const getCalendarByDate = async (id, date) => {
    const axios = AxiosConfig()
    let api = `/calendar/get-calendar-by-date/${id}`
    try {
        const res = await axios.post(api, date)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// check calendar
export const checkCalendar = async (data) => {
    const axios = AxiosConfig()
    let api = `/calendar/check-calendar`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// check calendar default month
export const checkCalendarDefaultMonth = async (data) => {
    const axios = AxiosConfig()
    let api = `/calendar/check-calendar-default-month`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}
