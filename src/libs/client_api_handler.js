'use client'

import axios, { AxiosError, isAxiosError } from "axios"
import { api_url } from "./api_handler"

export const client_api_get = async ({
    url = '/',
    headers
}) => {
    try {
        const base_url = await api_url()
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

export const client_api_post = async ({
    payload,
    url = '/',
    headers = {
        'Authorization': 'Bearer '
    }
}) => {
    try {
        const base_url = await api_url()
        const response = await axios.post(`${base_url}${url}`, payload, {
            headers: {
                ...headers
            }
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            ...error.response.data
        }
    }
}

export const client_api_put = async ({
    payload,
    url = '/',
    headers
}) => {
    try {
        const base_url = await api_url()
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

export const client_api_delete = async ({
    payload,
    url = '/',
    headers
}) => {
    try {
        const base_url = await api_url()
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

export const client_api_post_form = async ({
    payload,
    url = '/',
    headers = {}
}) => {
    try {
        const base_url = await api_url()
        // Make sure headers are properly set for the form data (no need to manually set Content-Type)
        const response = await axios.postForm(`${base_url}${url}`, payload, {
            headers: {
                ...headers
            }
        });

        return {
            success: true,
            ...response.data
        };
    } catch (error) {
        return {
            success: false,
            ...error.response.data
        }
    }
};

export const client_api_put_form = async ({
    payload,
    url = '/',
    headers
}) => {
    try {
        const base_url = await api_url()
        const response = await axios.putForm(`${base_url}${url}`, payload, {
            headers
        })

        return {
            success: true,
            ...response.data   
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            ...error.response.data
        }
    }
}