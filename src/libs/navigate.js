'use client'

import { useRouter } from "next/navigation"

export const navigate = (href = '/') => {
    return useRouter().push(href)
}