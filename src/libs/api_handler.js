'use server'

import axios, { AxiosError } from "axios"

export const api_get = async ({
    base_url = `${process.env.API_URL}`,
    url = '/',
    headers
}) => {
    try {
        const response = await axios.get(`${base_url}${url}`, {
            headers
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        return {
            success: false,
            ...error.response.data
        }
    }
}

export const api_post = async ({
    base_url = `${process.env.API_URL}`,
    payload,
    url = '/',
    headers = {
        'Authorization': 'Bearer '
    }
}) => {
    try {
        const response = await axios.post(`${base_url}${url}`, payload, {
            headers
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        return {
            success: false,
            ...error.response.data
        }
    }
}

export const api_put = async ({
    base_url = `${process.env.API_URL}`,
    payload,
    url = '/',
    headers
}) => {
    try {
        const response = await axios.put(`${base_url}${url}`, payload, {
            headers
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        return {
            success: false,
            ...error.response.data
        }
    }
}

export const api_delete = async ({
    base_url = `${process.env.API_URL}`,
    payload,
    url = '/',
    headers
}) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: base_url + url,
            headers,
            data: payload
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        return {
            success: false,
            ...error.response.data
        }
    }
}

export const api_post_form = async ({
    base_url = `${process.env.API_URL}`,
    payload,
    url = '/',
    headers
}) => {
    try {
        const response = await axios.postForm(`${base_url}${url}`, payload, {
            headers
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        return {
            success: false,
            ...error.response.data
        }
    }
}

export const api_put_form = async ({
    base_url = `${process.env.API_URL}`,
    payload,
    url = '/',
    headers
}) => {
    try {
        const response = await axios.putForm(`${base_url}${url}`, payload, {
            headers
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        return {
            success: false,
            ...error.response.data
        }
    }
}