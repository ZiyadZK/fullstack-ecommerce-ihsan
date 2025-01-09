'use client'

import { toast } from "sonner"

export const customToast = {
    success: ({
        message = 'Berhasil memproses data',
        title = 'Sukses!'
    }) => {
        toast.success(title, {
            description: message
        })
    },
    failed: ({
        message = 'Gagal untuk memproses data',
        title = 'Oops!'
    }) => {
        toast.error(title, {
            description: message
        })
    },
    error: ({
        message = 'Terdapat Error di Server, silahkan hubungi Administrator!',
        title = 'Error!'
    }) => {
        toast.error(title, {
            description: message
        })
    }
}