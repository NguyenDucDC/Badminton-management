import { AxiosConfig } from '../config/AxiosConfig'

// create order
export const createPaymentUrl = async (data) => {
    const axios = AxiosConfig()
    let api = `/payment/create_payment_url`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

export const vnpay_ipn = async (query) => {
    const axios = AxiosConfig()
    let api = `/payment/vnpay_ipn?${query}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

export const vnpay_refund = async (data) => {
    const axios = AxiosConfig()
    let api = `/payment/refund`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}
