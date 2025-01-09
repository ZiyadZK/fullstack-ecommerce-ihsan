'use client'

export const cookie_server_get = (key) => {
    const data = localStorage.getItem(key)
    return data
}

export const cookie_server_delete = (key) => {
    
    localStorage.removeItem(key)
    return
}

export const cookie_server_set = (key, value) => {
    
    localStorage.setItem(key, value)
    return
}

export const cookie_server_has = (key) => {
    
    return localStorage.getItem(key) ? true : false
}