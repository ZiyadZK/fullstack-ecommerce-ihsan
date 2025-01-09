'use client'

import Image from "next/image"
import Link from "next/link"

export const Logo = ({
    width = 200,
    height = 200,
    className = 'w-20 h-20',
    alt = 'Logo Web',
    href = ''
}) => {
    return (
        href !== ''
            ? (
                <Link href={href}>
                    <Image 
                        src={'/logo.png'}
                        width={width}
                        height={height}
                        className={className}
                        alt={alt}
                    />
                </Link>
            )
            : (
                <Image 
                    src={'/logo.png'}
                    width={width}
                    height={height}
                    className={className}
                    alt={alt}
                />
            )
        
    )
}

// export default function Logo({
//     width = 200,
//     height = 200,
//     className = 'w-20 h-20',
//     alt = 'Logo Web'
// }) {
//     return ()
// }