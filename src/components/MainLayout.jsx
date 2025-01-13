'use client'

import { lexend, poppins } from "@/libs/fonts"
import { Logo } from "./Logo"
import DropdownMenu from "./DropdownMenu"
import { use, useContext, useEffect, useState } from "react";
import { Avatar, Badge, Button, Checkbox, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { Close, FavoriteBorderOutlined, Key, Label, Lock, Logout, People, Person, Search, ShoppingCartOutlined, Visibility, VisibilityOff, WorkspacePremiumOutlined } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import Modal, { modal } from "./Modal";
import { UserContext, UserProvider } from "@/provider/userProvider";
import { customToast } from "@/libs/customToast";
import { cookie_server_delete, cookie_server_set } from "@/libs/cookie_server";
import { api_post } from "@/libs/api_handler";


export default function MainLayout({ children, search_field = true, user_utilities = true }) {


    return (
        <UserProvider>
            <MainPage>
                <UserProvider>
                    {children}
                </UserProvider>
            </MainPage>
        </UserProvider>
    )
    
}

function MainPage({ children }) {

    const router = useRouter()
    const searchParams = use(useSearchParams())

    const { user, user_dispatch } = useContext(UserContext)

    const [form, setForm] = useState({
        login: {
            isAdmin: false,
            username: '',
            password: '',
            showPassword: false,
            loading: false,
            error: ''
        },
        register: {
            nama: '',
            username: '',
            password: '',
            loading: false,
            error: '',
            success: false
        },
        search: ''
    })

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
        },
        login: async () =>  {
            try {
                
            } catch (error) {
                
            }
        },
        form: {
            login: {
                clear: () => {
                    setForm(state => ({
                        ...state,
                        login: {
                            isAdmin: false,
                            username: '',
                            password: '',
                            showPassword: false,
                            loading: false,
                            error: ''
                        }
                    }))
                },
                error: (value) => {
                    setForm(state => ({
                        ...state,
                        login: {
                            ...state.login,
                            error: value
                        }
                    }))
                },
                set: (col, val) => {
                    aksi.form.login.error('')
                    aksi.form.register.set('success', false)
                    setForm(state => ({
                        ...state,
                        login: {
                            ...state.login,
                            [col]: val
                        }
                    }))
                },
                isAdmin: () => {
                    setForm(state => ({
                        ...state,
                        login: {
                            ...state.login,
                            isAdmin: !state.login.isAdmin
                        }
                    }))
                },
                showPassword: () => {
                    setForm(state => ({
                        ...state,
                        login: {
                            ...state.login,
                            showPassword: !state.login.showPassword
                        }
                    }))
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.form.login.error('')
                        aksi.form.login.toggleLoading()

                        const payload = {
                            username: form.login.username,
                            password: form.login.password,
                        }

                        const response = await api_post({
                            url: form.login.isAdmin
                                ? '/api/auth/login/admin'
                                : '/api/auth/login/user',
                            payload
                        })

                        aksi.form.login.toggleLoading()

                        if(!response.success) {
                            console.log(response)
                            aksi.form.login.error(response.message)
                        }else{
                            modal.close('masuk')
                            cookie_server_set('api_token', response?.data?.token)
                            user_dispatch({ type: 'FETCH_SUCCESS', payload: response?.data?.userdata })
                            aksi.form.login.clear()
                            customToast.success({
                                message: 'Berhasil masuk!'
                            })
                        }

                    } catch (error) {
                        customToast.error({
                            message: error?.message
                        })
                    }
                },
                toggleLoading: () => {
                    setForm(state => ({
                        ...state,
                        login: {
                            ...state.login,
                            loading: !state.login.loading
                        }
                    }))
                }
            },
            register: {
                clear: () => {
                    setForm(state => ({
                        ...state,
                        register: {
                            nama: '',
                            username: '',
                            password: '',
                            loading: false,
                            error: '',
                            success: false
                        }
                    }))
                },
                error: (value) => {
                    setForm(state => ({
                        ...state,
                        register: {
                            ...state.register,
                            error: value
                        }
                    }))
                },
                set: (col, val) => {
                    aksi.form.register.error('')
                    setForm(state => ({
                        ...state,
                        register: {
                            ...state.register,
                            [col]: val
                        }
                    }))
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.form.register.error('')
                        aksi.form.register.toggleLoading()

                        const payload = {
                            nama: form.register.nama,
                            username: form.register.username,
                            password: form.register.password
                        }

                        const response = await api_post({
                            url: '/api/auth/register/user',
                            payload
                        })

                        aksi.form.register.toggleLoading()

                        if(!response.success) {
                            aksi.form.register.error(response.message)
                        }else{
                            modal.close('daftar')
                            aksi.form.register.clear()
                            aksi.form.register.set('success', true)
                            modal.show('masuk')
                            cookie_server_set('api_token', response?.data?.token)
                            user_dispatch({ type: 'FETCH_SUCCESS', payload: response?.data?.userdata })
                            customToast.success({
                                message: 'Berhasil masuk!'
                            })
                        }

                    } catch (error) {
                        customToast.error({
                            message: error?.message
                        })
                    }
                },
                toggleLoading: () => {
                    setForm(state => ({
                        ...state,
                        register: {
                            ...state.register,
                            loading: !state.register.loading
                        }
                    }))
                }
            },
            set: (col, val) => {
                setForm(state => ({
                    ...state,
                    [col]: val
                }))
            }
        },
        produk: {
            search: (e) => {
                e.preventDefault()

                if(form.search !== ''){
                    window.location.href = `/search?search=${form.search}`
                }else{
                    window.location.href = '/search'
                }
            }
        }
    }

    useEffect(() => {
        if(searchParams.get('search')) {
            aksi.form.set('search', searchParams.get('search'))
        }
    }, [])

    return (
        <div className={`w-full flex flex-col items-center justify-between min-h-screen bg-white text-zinc-700 ${poppins.className}`}>
            <div className="max-w-screen-xl w-full">

                {/* Navbar */}
                <nav className="p-5 flex justify-between items-center">
                    <Logo className="w-16 h-16" href="/" />
                    <form onSubmit={e => aksi.produk.search(e)} className="w-1/3">
                        <TextField
                            fullWidth 
                            size="small"
                            value={form.search}
                            onChange={e => aksi.form.set('search', e.target.value)}
                            placeholder="Cari produk anda disini"
                            className="placeholder:font-bold bg-zinc-100"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => window.location.href=`/search`}>
                                                <Close />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                    
                                }
                            }}
                        />
                    </form>
                    <div className="flex flex-row-reverse items-center gap-5">
                        {user.status === 'loading' && (
                            <CircularProgress size={20} />
                        )}
                        {(user.status === 'fetched' || user.status === 'no_token') && (
                            <>
                                {user.data ? (
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
                                                    label: 'Pesanan Anda',
                                                    onClick: () => router.push('/pesanan')
                                                },
                                                user.data.role === 'admin' && {
                                                    label: 'Dashboard',
                                                    onClick: () => router.push('/dashboard')
                                                },
                                                {
                                                    label: 'Keluar',
                                                    icon: <Logout color="error" />,
                                                    onClick: () => aksi.logout()
                                                }
                                            ]}
                                        >
                                        </DropdownMenu>
                                        <button type="button" onClick={() => router.push('/keranjang')}>
                                            <ShoppingCartOutlined className="opacity-80 hover:scale-110 ease-out duration-100 hover:opacity-100 active:scale-95" />
                                        </button>
                                        <button type="button" onClick={() => router.push('/favorit')}>
                                            <FavoriteBorderOutlined className="opacity-80 hover:scale-110 ease-out duration-100 hover:opacity-100 active:scale-95" />   
                                        </button>
                                        <button type="button" onClick={() => router.push('/kupon')}>
                                            <WorkspacePremiumOutlined className="opacity-80 hover:scale-110 ease-out duration-100 hover:opacity-100 active:scale-95" />
                                        </button>
                                    </>
                                ):(
                                    <div className="flex flex-row-reverse items-center gap-3">
                                        <Modal modalId="daftar" showTitle={false} title="Buat Akun">
                                            <div className="flex justify-center">
                                                <Logo />
                                            </div>
                                            <hr className="my-3 opacity-0" />
                                            <div className="flex flex-col items-center">
                                                <h1 className="text-xl font-medium">
                                                    Selamat Datang
                                                </h1>
                                                <p className="text-sm opacity-50">
                                                    Silahkan Daftar terlebih dahulu
                                                </p>
                                            </div>
                                            <hr className="my-3 opacity-0" />
                                            <div className="flex justify-center">
                                                <form onSubmit={aksi.form.register.submit} className="max-w-[75%] w-full space-y-4">
                                                    {form.register.error !== '' && (
                                                        <div className="bg-red-500 shadow-lg p-5 rounded-md text-white">
                                                            <h1 className="font-semibold text-sm">
                                                                Daftar Gagal!
                                                            </h1>
                                                            <hr className="my-2 opacity-0" />
                                                            <p className="font-medium text-xs tracking-tighter">
                                                                {form.register.error}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <TextField 
                                                        fullWidth
                                                        disabled={form.register.loading}
                                                        value={form.register.nama}
                                                        onChange={e => aksi.form.register.set('nama', e.target.value)}
                                                        required
                                                        size="small"
                                                        label="Nama Lengkap"
                                                        placeholder="John Doe"
                                                        slotProps={{
                                                            inputLabel: {
                                                                style: {
                                                                    fontWeight: '900'
                                                                },
                                                                shrink: true
                                                            },
                                                            input: {
                                                                style: {
                                                                    fontWeight: 'bolder'
                                                                },
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Label fontSize="small" className="text-blue-500" />
                                                                    </InputAdornment>
                                                                )
                                                            },
                                                            
                                                        }}
                                                    />
                                                    <TextField 
                                                        fullWidth
                                                        required
                                                        size="small"
                                                        label="Username"
                                                        placeholder="john_doe"
                                                        disabled={form.register.loading}
                                                        value={form.register.username}
                                                        onChange={e => aksi.form.register.set('username', e.target.value)}
                                                        slotProps={{
                                                            inputLabel: {
                                                                style: {
                                                                    fontWeight: '900'
                                                                },
                                                                shrink: true
                                                            },
                                                            input: {
                                                                style: {
                                                                    fontWeight: 'bolder'
                                                                },
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Person fontSize="small" className="text-blue-500" />
                                                                    </InputAdornment>
                                                                )
                                                            },
                                                            
                                                        }}
                                                    />
                                                    <TextField 
                                                        fullWidth
                                                        required
                                                        disabled={form.register.loading}
                                                        value={form.register.password}
                                                        onChange={e => aksi.form.register.set('password', e.target.value)}
                                                        size="small"
                                                        label="Password"
                                                        type="text"
                                                        placeholder="password_di_sini"
                                                        slotProps={{
                                                            inputLabel: {
                                                                style: {
                                                                    fontWeight: '900'
                                                                },
                                                                shrink: true
                                                            },
                                                            input: {
                                                                style: {
                                                                    fontWeight: 'bolder'
                                                                },
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Lock fontSize="small" className="text-blue-500" />
                                                                    </InputAdornment>
                                                                )
                                                            },
                                                            
                                                        }}
                                                    />
                                                    <Button type="submit" disabled={form.register.loading} fullWidth variant="contained">
                                                        <p className={`${poppins.className} text-sm`}>
                                                            {form.register.loading ? 'Loading..' : 'Daftar'}
                                                        </p>
                                                    </Button>
                                                </form>
                                            </div>
                                        </Modal>
                                        <button type="button" onClick={() => modal.show('daftar')} className="px-3 py-2 rounded-md border-2 border-zinc-700 hover:bg-zinc-700 hover:text-white tracking-tighter text-sm font-medium ease-out duration-100 active:bg-zinc-950">
                                            Buat Akun
                                        </button>
                                        <Modal modalId="masuk" showTitle={false} closeButton={true} title="Masuk">
                                            <div className="flex justify-center">
                                                <Logo />
                                            </div>
                                            <hr className="my-3 opacity-0" />
                                            <div className="flex flex-col items-center">
                                                <h1 className="text-xl font-medium">
                                                    Selamat Datang
                                                </h1>
                                                <p className="text-sm opacity-50">
                                                    Silahkan Gunakan Akun anda
                                                </p>
                                            </div>
                                            <hr className="my-3 opacity-0" />
                                            
                                            <hr className="my-3 opacity-0" />
                                            <div className="flex justify-center">
                                                <form onSubmit={aksi.form.login.submit} className="max-w-[75%] w-full space-y-4">
                                                    {form.login.error !== '' && (
                                                        <>
                                                            <div className="bg-red-500 shadow-lg p-5 rounded-md text-white">
                                                                <h1 className="font-semibold text-sm">
                                                                    Login Gagal!
                                                                </h1>
                                                                <hr className="my-2 opacity-0" />
                                                                <p className="font-medium text-xs tracking-tighter">
                                                                    {form.login.error}
                                                                </p>
                                                            </div>
                                                            <hr className="my-3 opacity-0" />
                                                        </>
                                                    )}
                                                    {form.register.success && (
                                                        <>
                                                            <div className="bg-green-500 shadow-lg p-5 rounded-md text-white">
                                                                <h1 className="font-semibold text-sm">
                                                                    Daftar Berhasil!
                                                                </h1>
                                                                <hr className="my-2 opacity-0" />
                                                                <p className="font-medium text-xs tracking-tighter">
                                                                    Anda berhasil mendaftarkan akun anda, silahkan masuk terlebih dahulu
                                                                </p>
                                                            </div>
                                                            <hr className="my-3 opacity-0" />
                                                        </>
                                                    )}
                                                    <TextField 
                                                        fullWidth
                                                        required
                                                        disabled={form.login.loading}
                                                        value={form.login.username}
                                                        onChange={e => aksi.form.login.set('username', e.target.value)}
                                                        size="small"
                                                        label="Username"
                                                        placeholder="john_doe"
                                                        slotProps={{
                                                            inputLabel: {
                                                                shrink: true
                                                            },
                                                            input: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Person fontSize="small" className="text-blue-500" />
                                                                    </InputAdornment>
                                                                )
                                                            },
                                                            
                                                        }}
                                                    />
                                                    <TextField 
                                                        fullWidth
                                                        required
                                                        size="small"
                                                        label="Password"
                                                        disabled={form.login.loading}
                                                        value={form.login.password}
                                                        onChange={e => aksi.form.login.set('password', e.target.value)}
                                                        type={form.login.showPassword ? 'text' : 'password'}
                                                        placeholder={form.login.showPassword ? 'password_di_sini' : '***'}
                                                        slotProps={{
                                                            inputLabel: {
                                                                shrink: true
                                                            },
                                                            input: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Lock fontSize="small" className="text-blue-500" />
                                                                    </InputAdornment>
                                                                ),
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton onClick={() => aksi.form.login.showPassword()} color="primary">
                                                                            {form.login.showPassword
                                                                                ? <Visibility fontSize="small" />
                                                                                : <VisibilityOff fontSize="small" />
                                                                            }
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                )
                                                            },
                                                            
                                                        }}
                                                    />
                                                    <div className="flex items-center -translate-x-3">
                                                        <Checkbox disabled={form.login.loading} checked={form.login.isAdmin} onChange={(e) => aksi.form.login.isAdmin()} size="small" />
                                                        <p className="text-xs tracking-tighter">
                                                            Masuk sebagai Admin
                                                        </p>
                                                    </div>
                                                    <Button disabled={form.login.loading} type="submit" fullWidth variant="contained">
                                                        <p className={`${poppins.className} text-sm`}>
                                                            {form.login.loading
                                                                ? 'Loading...'
                                                                : 'Masuk'
                                                            }
                                                        </p>
                                                    </Button>
                                                </form>
                                            </div>
                                        </Modal>
                                        <button type="button" onClick={() => modal.show('masuk')} className="px-3 py-2 rounded-md hover:bg-zinc-100 text-sm tracking-tighter font-medium active:bg-zinc-500 ease-out duration-100">
                                            Masuk
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </nav>

                <div className="">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-zinc-200 w-full">
                Ini Adalah Footer
            </div>
        </div>
    )
}