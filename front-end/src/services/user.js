import axios from 'axios'
import { AxiosConfig } from '../config/AxiosConfig'
import { getToken } from './auth'

export function register(data, callback) {
  axios
    .post(`${process.env.REACT_APP_API}/api/users/register`, data)
    .then((res) => {
      callback(res.data)
    })
    .catch((err) => {
      if (err.response) {
        callback(err.response.data)
      }
    })
}


// get user
export const getProfile = async () => {
  const axios = AxiosConfig()
  let api = `/profile/get-profile`
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
  let api = `/profile/update-info`
  try {
    const res = await axios.post(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update avatar
export const updateAvt = async (data) => {
  const axios = AxiosConfig()
  let api = `/profile/update-avt`
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
