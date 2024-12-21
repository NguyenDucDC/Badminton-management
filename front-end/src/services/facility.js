import axios from 'axios'
import { AxiosConfig } from '../config/AxiosConfig'

// create facility
export const createFacility = async (data) => {
  const axios = AxiosConfig()
  let api = `/facility/create-facility`
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

// get all facility
export const getFacility = async () => {
  const axios = AxiosConfig()
  let api = `/facility/get-facility`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get detail facility
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

// get facility empty
export const getFacilityEmpty = async () => {
  const axios = AxiosConfig()
  let api = `/facility/get-facility-empty`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get facility available to add manager
export const getFacilityAvailable = async (id) => {
  const axios = AxiosConfig()
  let api = `/facility/get-facility-available/${id}`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update facility
export const updateFacility = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/facility/update-facility/${id}`
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

// update personnel facility
export const updatePersonnelFacility = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/facility/update-personnel-facility/${id}`
  try {
    const res = await axios.put(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update statue facility
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

// update price facility
export const updatePrice = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/facility/update-price-facility/${id}`
  try {
    const res = await axios.put(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get list price of facility
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

// get calendar by date
export const getCalendarByDate = async (id, date) => {
  const axios = AxiosConfig()
  let api = `/calendar/get-calendar-by-date/${id}`
  try {
    const res = await axios.post(api, date)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get lock by date
export const getLockByDate = async (id, date) => {
  const axios = AxiosConfig()
  let api = `/calendar/get-lock-by-date/${id}`
  try {
    const res = await axios.post(api, date)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// upload images facility
export const uploadImageFacility = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/facility/upload-images-facility/${id}`
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


// get images facility
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

// get images facility
export const deleteImageFacility = async (data) => {
  const axios = AxiosConfig()
  let api = `/facility/delete-image-facility`
  try {
    const res = await axios.put(api, {
      imageUrl: data
    })
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// lock facility
export const lockFacility = async (data) => {
  const axios = AxiosConfig()
  let api = `/facility/add-lock-facility`
  try {
    const res = await axios.post(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// update lock facility
export const updateLockFacility = async (id, data) => {
  const axios = AxiosConfig()
  let api = `/facility/update-lock-facility/${id}`
  try {
    const res = await axios.put(api, data)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}

// get list lock facility
export const getListLockFacility = async (pagination) => {
  const axios = AxiosConfig()
  const { current, pageSize } = pagination;
  let api = `/facility/get-list-lock-facility?page=${current}&pageSize=${pageSize}`
  console.log("check api: ", api)
  try {
      const res = await axios.get(api)
      return res.data
  } catch (e) {
      return e.response.data
  }
}

// get detail lock facility
export const getDetailLockFacility = async (id) => {
  const axios = AxiosConfig()
  let api = `/facility/get-detail-lock-facility/${id}`
  try {
    const res = await axios.get(api)
    return res.data
  } catch (err) {
    throw err.response.data
  }
}