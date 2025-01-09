'use client'

import { Skeleton } from "@mui/material"

export default function CustomLoading ({
    loading = false,
    children,
    width = '100%',
    variant = 'rounded',
    renderCondition = true
}) {
    return loading ? (
        <>
            {renderCondition && (
                <>
                    {children}
                </>
            )}
        </>
    ) : (
        <Skeleton variant={variant} width={width}>
            {children}
        </Skeleton>
    )
}