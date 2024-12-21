import { AxiosConfig } from '../config/AxiosConfig'

// get all facility
export const getAllFacility = async () => {
    const axios = AxiosConfig()
    let api = `/facility/get-all-facility`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// get all facility
export const getDetailFacility = async (id) => {
    const axios = AxiosConfig()
    let api = `/facility/get-detail-facility/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// get all facility
export const getPriceFacility = async (id) => {
    const axios = AxiosConfig()
    let api = `/facility/get-price-facility/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// get image facility
export const getImageFacility = async (id) => {
    const axios = AxiosConfig()
    let api = `/facility/get-images-facility/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}