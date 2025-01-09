'use client'

export const localStorage_handler = {
    get: (key) => {
        return localStorage.getItem(key)
    },
    set: (key, value) => {
        localStorage.setItem(key, value)
        return
    },
    delete: (key) => {
        localStorage.removeItem(key, value)
        return
    },
    has: (key) => {
        return localStorage.getItem(key) ? true : false
    }
}