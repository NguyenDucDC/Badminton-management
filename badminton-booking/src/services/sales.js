import { AxiosConfig } from '../config/AxiosConfig'

// get all facility
export const getSalesFacility = async (id) => {
    const axios = AxiosConfig()
    let api = `/sales/get-sales-facility/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}
