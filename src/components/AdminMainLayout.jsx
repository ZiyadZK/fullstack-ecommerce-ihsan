'use client'

import { poppins } from "@/libs/fonts"
import { UserContext, UserProvider } from "@/provider/userProvider"
import { useContext, useEffect } from "react"
import { Logo } from "./Logo"
import { Avatar, CircularProgress } from "@mui/material"
import { ArrowBackIos, ArrowLeft, Close, Logout } from "@mui/icons-material"
import { usePathname, useRouter } from "next/navigation"
import DropdownMenu from "./DropdownMenu"
import { cookie_server_delete } from "@/libs/cookie_server"
import { customToast } from "@/libs/customToast"
import MainLayout from "./MainLayout"

export default function AdminMainLayout({ children }) {
    
    return (
        <UserProvider>
            <MainPage>
                {children}
            </MainPage>
        </UserProvider>
    )
}

function MainPage({ children }) {

    const router = useRouter()

    const pathname = usePathname()

    const { user, user_dispatch } = useContext(UserContext)
    
    const aksi = {
        logout: async () => {
            try {
                cookie_server_delete('api_token')
                user_dispatch({ type: 'NO_API_TOKEN' })  
            } catch (error) {
                customToast.error({
                    message: error?.message
                })
            }
        }
    }

    useEffect(() => {
        if(user.status === 'no_token') {
            router.push('/')
        }
    }, [user])

    return user.status === 'fetched' 
    ? user.data.role === 'admin' 
        ? (
            <div className={`w-full flex flex-col items-center justify-between min-h-screen bg-white text-zinc-700 ${poppins.className}`}>
                <div className="max-w-screen-xl w-full">

                    {/* Navbar */}
                    <nav className="p-5 flex justify-between items-center">
                        <Logo className="w-16 h-16" href="/" />
                        
                        <div className="flex flex-row-reverse items-center gap-5">
                            {user.status !== 'fetched' && (
                                <CircularProgress size={20} />
                            )}
                            {user.status === 'fetched' && (
                                <>
                                    <DropdownMenu
                                        className="flex-shrink-0"
                                        buttonComponent={(
                                            <Avatar src={user.data.foto_profil} className="cursor-pointer hover:border-blue-500 border-2" />
                                        )}
                                        menuItems={[
                                            {
                                                label: 'Profil',
                                            },
                                            {
                                                label: 'Keluar',
                                                icon: <Logout color="error" />,
                                                onClick: () => aksi.logout()
                                            }
                                        ]}
                                    >
                                    </DropdownMenu>
                                </>
                            )}
                        </div>
                    </nav>

                    <div className="">
                        <div className="grid grid-cols-12 gap-10">
                            <div className="col-span-3 sticky top-6 h-fit">
                                <button type="button" onClick={() => router.push('/dashboard')} className={`pl-5 block border-l-2 ${pathname === '/dashboard' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Dashboard
                                    </div>
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/akun')} className={`pl-5 block border-l-2 ${pathname === '/dashboard/akun' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard/akun' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Akun
                                    </div>
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/kategori')} className={`pl-5 block border-l-2 ${pathname === '/dashboard/kategori' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard/kategori' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Kategori Produk
                                    </div>
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/produk')} className={`pl-5 block border-l-2 ${pathname === '/dashboard/produk' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard/produk' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Daftar Produk
                                    </div>
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/kupon')} className={`pl-5 block border-l-2 ${pathname === '/dashboard/kupon' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard/kupon' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Kupon
                                    </div>
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/transaksi')} className={`pl-5 block border-l-2 ${pathname === '/dashboard/transaksi' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard/transaksi' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Transaksi
                                    </div>
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/supplier')} className={`pl-5 block border-l-2 ${pathname === '/dashboard/supplier' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard/supplier' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Supplier
                                    </div>
                                </button>
                                <button type="button" onClick={() => router.push('/dashboard/restock')} className={`pl-5 block border-l-2 ${pathname === '/dashboard/restock' ? 'border-blue-500' : 'hover:border-zinc-700'} py-1 text-sm group  ease-out duration-100`}>
                                    <div className={`${pathname === '/dashboard/restock' ? 'text-blue-500' : 'group-hover:opacity-100 opacity-50'} ease-out duration-100`}>
                                        Restock
                                    </div>
                                </button>
                                
                            </div>
                            <div className="col-span-9">
                                {children}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="">
                    
                </div>
            </div>
        ) 
        : (
            <MainLayout>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <hr className="my-20 opacity-0" />
                        <Close style={{ width: 100, height: 100}} color="error" />
                        <hr className="my-2 opacity-0" />
                        <h1 className="text-red-500 text-5xl">
                            Oops!
                        </h1>
                        <hr className="my-6 opacity-0" />
                        <p className="text-center">
                            Anda tidak memiliki izin untuk mengakses halaman ini!
                        </p>
                        <hr className="my-2 opacity-0" />
                        <button type="button" onClick={() => router.back()} className="flex items-center justify-center gap-2 text-blue-500 group ease-out duration-200">
                            <ArrowBackIos fontSize="small" className="translate-x-0 group-hover:-translate-x-1 transition-all duration-200" />
                            Kembali
                        </button>
                    </div>
                </div>
            </MainLayout>
        )
    : (
        <div className="flex items-center justify-center w-full min-h-screen bg-white">
            <CircularProgress size={60} />
        </div>
    )
}