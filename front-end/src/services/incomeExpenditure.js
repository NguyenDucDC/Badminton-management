import { AxiosConfig } from '../config/AxiosConfig'

// create Income Expenditure
export const createIncomeExpenditure = async (data) => {
  const axios = AxiosConfig()
  let api = `/income-expenditure/create-income-expenditure`
  try {
    const res = await axios.post(api, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update Income Expenditure
export const updateIncomeExpenditure = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/income-expenditure/update-income-expenditure/${id}`
  try {
    const res = await axios.post(api, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get list income and expenditure
export const getListIncomeExpenditure = async (data) => {
  const axios = AxiosConfig()
  let api = `/income-expenditure/get-list-income-expenditure`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get detail income and expenditure
export const getDetailIncomeExpenditure = async (id) => {
  const axios = AxiosConfig()
  let api = `/income-expenditure/get-detail-income-expenditure/${id}`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// filter income and expenditure
export const filterIncomeExpenditure = async (pagination, data) => {
  const axios = AxiosConfig()
  const { current, pageSize } = pagination;
  let api = `/income-expenditure/filter-income-expenditure?page=${current}&pageSize=${pageSize}`
  try {
    const res = await axios.post(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get images contract
export const deleteImageContract = async (data) => {
  const axios = AxiosConfig()
  let api = `/income-expenditure/delete-image-contract`
  try {
    const res = await axios.put(api, {
      imageUrl: data
    })
    return res.data
  } catch (err) {
    throw err.response.data
  }
}
