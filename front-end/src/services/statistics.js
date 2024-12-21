import { AxiosConfig } from '../config/AxiosConfig'

// get all facilities statistics
export const getAllFacilitiesStatistics = async (month, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-all-facilities-statistics`
    try {
        const res = await axios.post(api, {
            month,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get income and expenditure statistics
export const getIncomeStatistics = async (month, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-income-statistics`
    try {
        const res = await axios.post(api, {
            month,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get all sales statistics
export const getAllSalesStatistics = async (month, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-all-sales-statistics`
    try {
        const res = await axios.post(api, {
            month,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get detail facilities statistics
export const getDetailFacilitiesStatistics = async (facility, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-detail-facilities-statistics`
    try {
        const res = await axios.post(api, {
            facility,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get detail income and expenditure statistics
export const getDetailIncomeStatistics = async (facility, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-detail-income-statistics`
    try {
        const res = await axios.post(api, {
            facility,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get detail sales statistics
export const getDetailSalesStatistics = async (sales, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-detail-sales-statistics`
    try {
        const res = await axios.post(api, {
            sales,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get detail customer statistics
export const getDetailCustomerStatistics = async (id, facility_id, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-detail-customer-statistics/${id}`
    try {
        const res = await axios.post(api, {
            facility_id,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get income and expenditure statistics
export const getCustomerStatistics = async (id, month, year) => {
    const axios = AxiosConfig()
    let api = `/statistics/get-customer-statistics/${id}`
    try {
        const res = await axios.post(api, {
            month,
            year
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}