import { AxiosConfig } from '../config/AxiosConfig'

// list customer
export const findCustomer = async (phone) => {
    const axios = AxiosConfig()
    let api = `/customer/find-customer`
    try {
        const res = await axios.post(api, { phone })
        return res.data
    } catch (e) {
        return e.response.data
    }
}