import React from 'react'
import { AxiosConfig } from '../config/AxiosConfig'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { notification, Modal } from 'antd'
export function isLoggedIn() {
  return !!localStorage.getItem(`user`)
}

export function getAllowedRoute(routes, role) {
  var allowedData = []
  routes.forEach((route) => {
    if (route.permission) {
      if (route.permission.includes(role)) {
        allowedData.push(route)
      }
    } else {
      allowedData.push(route)
    }
  })
  return allowedData
}

export function getAllowedNav(navigation, role) {
  var allowedData = []
  navigation.forEach((nav) => {
    if (nav.permission) {
      if (nav.permission.includes(role)) {
        if (nav.items) {
          nav.items.forEach((child, index) => {
            if (child.permission && !child.permission.includes(role)) {
              nav.items.splice(index, 1)
            }
          })
        }

        allowedData.push(nav)
      }
    } else {
      if (nav.items) {
        nav.items.forEach((child, index) => {
          if (child.permission && !child.permission.includes(role)) {
            nav.items.splice(index, 1)
          }
        })
      }

      allowedData.push(nav)
    }
  })
  return allowedData
}

// TODO : cap nhat khi chuc nang hoan chinh
export function storeUserData(data) {
  // console.log("check user auth: ", data)
  const user = {
    role: data.role,
    avatar: data.avatarURL,
    id: data.id,
    username: data.username
  }

  localStorage.setItem(`user`, JSON.stringify(user))
}

export async function getToken(callback) {
  // console.log('getToken', callback)
  const axios = AxiosConfig()
  try {
    const res = await axios.post(`${process.env.REACT_APP_API}/api/auth-partner/refresh-token`, {
      refreshToken: localStorage.getItem(`${process.env.REACT_APP_PREFIX_LOCAL}_refresh_token`),
    })

    localStorage.setItem(`${process.env.REACT_APP_PREFIX_LOCAL}_access_token`, res.data.accessToken)
    callback()
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401 || err.response.status === 403) {
        Modal.warn({
          title: `Token expired`,
          icon: <ExclamationCircleOutlined />,
          content: `Please logged in again !`,
          centered: true,
          afterClose: logOut,
        })
      }
    }
  }
}

export function logOut() {
  localStorage.removeItem(`user`)
  localStorage.removeItem(`token`)
  console.log("check remove 1")
  localStorage.removeItem(`persist:root`)
  console.log("check remove 2")
  window.location.href = '/login'
}

export const changePassword = async (data) => {
  const axios = AxiosConfig()
  let api = `/profile/update-password`

  try {
    const res = await axios.post(api, data)
    console.log(res)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

export const forgotPassword = async (data) => {
  const axios = AxiosConfig()
  let api = `/auth/forgot-password`

  try {
    const res = await axios.post(api, data)
    console.log(res)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}
