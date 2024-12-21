import { AxiosConfig } from '../config/AxiosConfig'

// get all facility
export const getUser = async (id) => {
    const axios = AxiosConfig()
    let api = `/user/get-user/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// update user info
export const updateProfile = async (data) => {
    const axios = AxiosConfig()
    let api = `/user/update-info`
    try {
        const res = await axios.put(api, data)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// change password
export const changePassword = async (data) => {
    const axios = AxiosConfig()
    let api = `/user/change-password`
    try {
        const res = await axios.put(api, data)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// update avatar
export const updateAvt = async (data) => {
    const axios = AxiosConfig()
    let api = `/user/update-avt`
    try {
        const res = await axios.put(api, data, {
            headers: {
                'Content-Type': `multipart/form-data;`,
            },
        })
        return res.data
    } catch (err) {
        throw err.response.data
    }
}