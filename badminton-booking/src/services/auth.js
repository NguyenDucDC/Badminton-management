import { AxiosConfig } from '../config/AxiosConfig'

export const login = async (phone, password) => {
    const axios = AxiosConfig()
    let api = `/auth/login`
    try {
        const res = await axios.post(api, {
            phone: phone,
            password: password
        })
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

export const register = async (phone, username, password) => {
    const axios = AxiosConfig()
    let api = `/auth/register`
    try {
        const res = await axios.post(api, {
            phone: phone,
            username: username,
            password: password
        })
        return res.data
    } catch (err) {
        console.log(err)
        throw err.response.data
    }
}

export const checkAccount = async (phone) => {
    const axios = AxiosConfig()
    let api = `/auth/check-account`
    try {
        const res = await axios.post(api, {
            phone: phone
        })
        return res.data
    } catch (err) {
        console.log(err)
        throw err.response.data
    }
}

export const changePassword = async (phone, password) => {
    const axios = AxiosConfig()
    let api = `/auth/change-password`
    try {
        const res = await axios.post(api, {
            phone: phone,
            password: password
        })
        return res.data
    } catch (err) {
        console.log(err)
        throw err.response.data
    }
}