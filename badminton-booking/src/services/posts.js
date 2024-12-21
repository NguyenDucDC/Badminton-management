import { AxiosConfig } from '../config/AxiosConfig'

// create posts
export const createPosts = async (data) => {
    const axios = AxiosConfig()
    let api = `/posts/create-posts`
    try {
        const res = await axios.post(api, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

//get posts by id
export const getPostsById = async (id) => {
    const axios = AxiosConfig()
    let api = `/posts/get-posts/${id}`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

//get posts by id
export const getAllPosts = async () => {
    const axios = AxiosConfig()
    let api = `/posts/get-all-posts`
    try {
        const res = await axios.get(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

//get posts by id
export const deletePosts = async (id) => {
    const axios = AxiosConfig()
    let api = `/posts/delete-posts/${id}`
    try {
        const res = await axios.delete(api)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

// update posts
export const updatePosts = async (id, data) => {
    const axios = AxiosConfig()
    let api = `/posts/update-posts/${id}`
    try {
        const res = await axios.patch(api, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

