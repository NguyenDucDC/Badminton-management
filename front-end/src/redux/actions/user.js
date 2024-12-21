import { Actions } from '../../config/Actions'
import { AxiosConfig } from '../../config/AxiosConfig'
import { notification } from 'antd'
import axios from 'axios'
import { getToken } from 'src/services/auth'

export function login(data) {
  return async function loginThunk(dispatch, getState) {
    await axios
      .post(`http://localhost:3001/api/auth/login`, data)
      .then((res) => {
        if (res.data.status === 1) {
          localStorage.setItem(
            `token`,
            res.data.token,
          )
          notification.success({
            message: `Notification`,
            description: `Đăng nhập thành công!`,
            placement: 'bottomRight',
            duration: 2,
          })
          dispatch({
            type: Actions.LOGIN_SUCCESS,
            payload: {
              user: res.data.data.user,
              message: '',
            },
          })
        } else {
          console.log("check err: ", res)
          notification.error({
            message: `Notification`,
            description: `${res.data.message}`,
            placement: 'bottomRight',
            duration: 2,
          })
        }

      })
      .catch((err) => {
        if (err.response) {
          notification.error({
            message: `Notification`,
            description: `${err.response.data.message}`,
            placement: 'bottomRight',
            duration: 2,
          })
          dispatch({
            type: Actions.LOGIN_FAIL,
            payload: {
              message: err.response.data.message,
            },
          })
        }
      })
  }
}

export function changeLanguage(language, callback) {
  return async function languageThunk(dispatch, getState) {
    const axiosConfig = AxiosConfig()

    await axiosConfig
      .get(`${process.env.REACT_APP_API}/api/language?lang=${language}`)
      .then((res) => {
        dispatch({
          type: Actions.CHANGE_LANGUAGE_SUCCESS,
          payload: {
            language: res.data.language,
            message: '',
          },
        })
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            getToken(changeLanguage(language, callback))
          } else {
            dispatch({
              type: Actions.CHANGE_LANGUAGE_FAIL,
              payload: {
                message: err.response.data.message,
              },
            })
          }
        }
      })
  }
}

export function logout(data) {
  return async function logoutThunk(dispatch, getState) {
    const axiosConfig = AxiosConfig()

    await axiosConfig
      .post(`/auth-partner/logout`)
      .then((res) => {
        localStorage.removeItem(`user`)
        localStorage.removeItem(`token`)
        dispatch({
          type: Actions.LOGOUT_SUCCESS,
        })
      })
      .catch((err) => {
        if (err.response) {
          dispatch({
            type: Actions.LOGOUT_FAIL,
          })
        }
      })
  }
}
