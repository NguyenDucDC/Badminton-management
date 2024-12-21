import { AxiosConfig } from '../config/AxiosConfig'

// list customer
export const getAllCustomer = async (pagination) => {
    const axios = AxiosConfig()
    const { current, pageSize } = pagination;
    let api = `/customer/get-all-customer?page=${current}&pageSize=${pageSize}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get customer by id
export const getCustomer = async (id) => {
    const axios = AxiosConfig()
    let api = `/customer/get-customer/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// list customer
export const findCustomer = async (phone) => {
    const axios = AxiosConfig()
    let api = `/customer/find-customer`
    try {
        const res = await axios.post(api, { phone })
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// get filter customer with pagination
export const getFilterCustomer = async (pagination, data) => {
    const axios = AxiosConfig();
    const { current, pageSize } = pagination;
    let api = `/customer/get-filter-customer?page=${current}&pageSize=${pageSize}`;
    try {
        const res = await axios.post(api, data);
        return res.data;
    } catch (e) {
        return e.response.data;
    }
}

// list customer
export const searchCustomer = async (pagination, phone) => {
    const axios = AxiosConfig()
    const { current, pageSize } = pagination;
    let api = `/customer/get-customer-by-phone?page=${current}&pageSize=${pageSize}`
    try {
        const res = await axios.post(api, phone)
        return res.data
    } catch (e) {
        return e.response.data
    }
}

// list customer of manager
export const getCustomerOfManager = async (pagination) => {
    const axios = AxiosConfig()
    const { current, pageSize } = pagination;
    let api = `/customer/get-list-customer-manager?page=${current}&pageSize=${pageSize}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (e) {
        return e.response.data
    }
}


// delete customer
export const deleteCustomer = async (id) => {
    const axios = AxiosConfig();
    console.log(id)
    let api = `/customer/delete-customer/${id}`;
    try {
        const res = await axios.put(api);
        return res.data;
    } catch (e) {
        return e.response.data;
    }
}
