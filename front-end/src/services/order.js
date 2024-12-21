import { AxiosConfig } from '../config/AxiosConfig'

// create order
export const createOrder = async (data) => {
    const axios = AxiosConfig()
    let api = `/order/create-order`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}


// price calculation
export const priceCalculation = async (data) => {
    const axios = AxiosConfig()
    let api = `/order/price-calculation`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get list order of facilites that sales work 
export const getListOrderSales = async (id, pagination) => {
    const axios = AxiosConfig()
    const { current, pageSize } = pagination;
    let api = `/order/get-list-order-sales/${id}?page=${current}&pageSize=${pageSize}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get list order of facilites that sales work 
export const getListOrderManager = async (id, pagination) => {
    const axios = AxiosConfig()
    const { current, pageSize } = pagination;
    let api = `/order/get-list-order-manager/${id}?page=${current}&pageSize=${pageSize}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get all order with pagination
export const getAllOrder = async (pagination) => {
    const axios = AxiosConfig();
    const { current, pageSize } = pagination;
    let api = `/order/get-all-order?page=${current}&pageSize=${pageSize}`;

    try {
        const res = await axios.get(api);
        return res.data;
    } catch (e) {
        return e.response.data;
    }
}

// get filter order with pagination
export const getFilterOrder = async (pagination, data) => {
    const axios = AxiosConfig();
    const { current, pageSize } = pagination;
    let api = `/order/get-filter-order?page=${current}&pageSize=${pageSize}`;
    try {
        const res = await axios.post(api, data);
        return res.data;
    } catch (e) {
        return e.response.data;
    }
}


// get list order of facilites that sales work 
export const getDetailOrder = async (id) => {
    const axios = AxiosConfig()
    let api = `/order/get-detail-order/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// check calendar
export const checkCalendar = async (data) => {
    const axios = AxiosConfig()
    let api = `/calendar/check-calendar`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// check calendar default month
export const checkCalendarDefaultMonth = async (data) => {
    const axios = AxiosConfig()
    let api = `/calendar/check-calendar-default-month`
    try {
        const res = await axios.post(api, data)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// cancel
export const cancelOrder = async (id) => {
    const axios = AxiosConfig()
    let api = `/order/cancel-order/${id}`
    try {
        const res = await axios.delete(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}





















// list order
export const listOrder = async (id, day, month, year, status, page, areaId) => {
    const axios = AxiosConfig()
    const api = `/booking/list-by-sale/${id}`
    const data = {
        year: year,
        month: month,
        day: day,
        status: status,
        Page: page.current,
        Limit: page.pageSize,
        areaId: areaId
    };

    // console.log("check data: ", data)

    try {
        const res = await axios.post(api, data);
        // console.log("check res: ", res.data)
        return res.data;
    } catch (e) {
        return e.response.data;
    }
}
// Add feedback
export const addFeedback = async (data, id) => {
    const axios = AxiosConfig()
    let api = `/customer-booking/customer-review-sale/${id}`
    try {
        const res = await axios.post(api, {
            reviewDesc: data
        })
        // console.log("check res: ", res)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get feedback
export const getFeedback = async (id) => {
    const axios = AxiosConfig()
    let api = `/customer-booking/get-customer-review-sale/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// update feedback
export const updateFeedback = async (data, id) => {
    const axios = AxiosConfig()
    let api = `/customer-booking/customer-review-update-sale/${id}`

    try {
        const res = await axios.put(api, {
            reviewDesc: data
        })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// Delete feedback
export const deleteFeedback = async (id) => {
    const axios = AxiosConfig()
    let api = `/customer-booking/customer-review-delete-sale/${id}`
    try {
        const res = await axios.delete(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// detail order Sale
export const detailOrderSale = async (id) => {
    const axios = AxiosConfig()
    let api = `/booking/get-detail/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// detail order admin
export const detailOrderAdmin = async (id) => {
    const axios = AxiosConfig()
    let api = `/booking/get-detail-admin/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// update sale villa
export const updateOrder = async (id, data) => {
    const axios = AxiosConfig()
    let api = `/booking/update-contract/${id}`
    try {
        const res = await axios.put(api, data)
        // console.log("check res update: ", res)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

export const getListArea = async (id) => {
    const axios = AxiosConfig()
    let api = `/area-sale/list-area/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

export const getListHouse = async (id) => {
    const axios = AxiosConfig()
    let api = `/area-sale/list-house/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}


