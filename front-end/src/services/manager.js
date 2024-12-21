import axios from 'axios'
import { AxiosConfig } from '../config/AxiosConfig'

// create manager
export const createManager = async (data) => {
  const axios = AxiosConfig()
  let api = `/manager/create-manager`
  try {
    const res = await axios.post(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get manager
export const getManager = async () => {
  const axios = AxiosConfig()
  let api = `/manager/get-manager`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get detail manager
export const getDetailManager = async (id) => {
  const axios = AxiosConfig()
  let api = `/manager/get-detail-manager/${id}`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update manager
export const updateManager = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/manager/update-manager/${id}`
  try {
    const res = await axios.put(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update statue manager
export const updateStatusFacility = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/facility/update-status-facility/${id}`
  try {
    const res = await axios.put(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// reset password
export const resetPasswordManager = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/manager/reset-password-manager/${id}`
  try {
    const res = await axios.put(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update avatar - admin or manager
export const updateAvatarManager = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/manager/update-avatar-manager/${id}`
  try {
      const res = await axios.put(api, data)
      return res.data
  } catch (err) {
      throw err.response.data
  }
}
