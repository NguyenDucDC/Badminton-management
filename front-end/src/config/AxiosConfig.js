import axios from 'axios'

export const AxiosConfig = () => {
  const token = localStorage.getItem(`token`)
  const instance = axios.create({
    baseURL: `http://localhost:3001/api`,

    headers: {
      authorization: `Bearer ${token}`,
      //'Content-Type': 'application/json',
    },
  })

  return instance
}
