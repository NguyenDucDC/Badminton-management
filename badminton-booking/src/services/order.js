import { AxiosConfig } from '../config/AxiosConfig'

// create order
export const createOrder = async (data) => {
    const axios = AxiosConfig()
    let api = `/order/create-order`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// price calculation
export const priceCalculation = async (data) => {
    const axios = AxiosConfig()
    let api = `/order/price-calculation`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get list order 
export const getListOrder = async (id) => {
    const axios = AxiosConfig()
    let api = `/order/get-list-order/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}
