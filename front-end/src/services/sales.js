
import { AxiosConfig } from '../config/AxiosConfig'

// create sale
export const createSales = async (data) => {
    const axios = AxiosConfig()
    let api = `/sales/create-sales`

    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get all sale
export const getAllSales = async () => {
    const axios = AxiosConfig()
    let api = `/sales/get-all-sales`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get sales of facility
export const getSalesOfFacility = async (id) => {
    const axios = AxiosConfig()
    let api = `/sales/get-sales-facility/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get detail sale
export const getDetailSales = async (id) => {
    const axios = AxiosConfig()
    let api = `/sales/get-detail-sales/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// update sale from manager and admin
export const updateSales_ManagerAndAdmin = async (id, data) => {
    const axios = AxiosConfig()
    let api = `/sales/update-sales_manager-admin/${id}`
    try {
        const res = await axios.put(api, data)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// reset password
export const resetPasswordSales = async (id, data) => {
    const axios = AxiosConfig()
    let api = `/sales/reset-password-sales/${id}`
    try {
        const res = await axios.put(api, data)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// update avatar - admin or manager
export const updateAvatarSales = async (id, data) => {
    const axios = AxiosConfig()
    let api = `/sales/update-avatar-sales/${id}`
    try {
        const res = await axios.put(api, data)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}