'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import MainLayout from "@/components/MainLayout"
import { api_delete, api_get, api_post } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { UserContext, UserProvider } from "@/provider/userProvider"
import { Add, DeleteOutline, HomeOutlined, Remove, ShoppingCart, ShoppingCartCheckout, ShoppingCartOutlined } from "@mui/icons-material"
import { Checkbox, CircularProgress, LinearProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

export default function KeranjangPage() {
    return (
        <UserProvider>
            <Page />
        </UserProvider>
    )
}

function Page() {

    const router = useRouter()
    const { user, user_dispatch } = useContext(UserContext)

    const [listData, setListData] = useState({
        keranjang: {
            data: [],
            status: '',
            loading: {
                checkout: false
            }
        }
    })

    const aksi = {
        keranjang: {
            get: async (fk_user) => {
                try {
                    aksi.keranjang.set('status', 'loading')

                    const response = await api_get({
                        url: `/api/admin/data/keranjang/user/${fk_user}`
                    })

                    aksi.keranjang.set('status', 'fetched')

                    if(response.success) {
                        aksi.keranjang.set('data', response?.data)
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.keranjang.set('status', 'fetched')
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            delete: {
                produk: async (id) => {
                    try {
                        aksi.keranjang.set('status', 'loading')

                        const response = await api_delete({
                            url: `/api/admin/data/keranjang/user/${user.data.id}`,
                            payload: {
                                fk_produk: id
                            }
                        })

                        
                        if(response.success) {
                            customToast.success({
                                message: 'Berhasil menghapus produk dari keranjang'
                            })
                            await aksi.keranjang.get(user.data.id)
                        }else{
                            aksi.keranjang.set('status', 'fetched')
                            customToast.error({
                                message: response.message
                            })
                        }

                        
                    } catch (error) {
                        aksi.keranjang.set('status', 'fetched')
                        customToast.error({
                            message: error?.message
                        })
                    }
                },
                all: async () => {
                    try {
                        aksi.keranjang.set('status', 'loading')

                        const response = await api_delete({
                            url: `/api/admin/data/keranjang/user/${user.data.id}`,
                            payload: {
                                fk_produk: listData.keranjang.data.map(v => v['fk_produk'])
                            }
                        })

                        if(response.success) {
                            customToast.success({
                                message: 'Berhasil menghapus produk dari keranjang'
                            })
                            await aksi.keranjang.get(user.data.id)
                        }else{
                            aksi.keranjang.set('status', 'fetched')
                            customToast.error({
                                message: response.message
                            })
                        }
                    } catch (error) {
                        aksi.keranjang.set('status', 'fetched')
                        customToast.error({
                            message: error?.message
                        })
                    }
                }
            },
            set: (col, val) => {
                setListData(state => ({
                    ...state,
                    keranjang: {
                        ...state.keranjang,
                        [col]: val
                    }
                }))
            },
            produk: {
                harga: {
                    total: (id) => {
                        const produk = listData.keranjang.data.find(v => v['id'] === id)

                        if(!produk) {
                            return 0
                        }

                        return parseFloat(
                            parseInt(produk?.jumlah) * parseFloat(produk['Produk']?.harga_per_satuan)
                        )
                    }
                },
                jumlah: (id, {
                    add = 0,
                    remove = 0
                }) => {
                    const data = listData.keranjang.data.map(v => {
                        if(v['id'] === id) {
                            if(add > 0) {
                                return {
                                    ...v,
                                    jumlah: parseInt(parseInt(v['jumlah']) + parseInt(add))
                                }
                            }else if(remove > 0) {
                                if(v['jumlah'] < 2) {
                                    return v
                                }

                                return {
                                    ...v,
                                    jumlah: parseInt(parseInt(v['jumlah']) - parseInt(remove))
                                }
                            }
                        }

                        return v
                    })

                    aksi.keranjang.set('data', data)
                }
            },
            total: {
                produk: () => {
                    let jumlah = 0

                    listData.keranjang.data.map(v => parseInt(jumlah += v['jumlah']))

                    return jumlah
                },
                harga: () => {
                    let harga = 0

                    listData.keranjang.data.map(v => {
                        harga += parseFloat(v['jumlah'] * v['Produk']['harga_per_satuan'])
                    })

                    return harga
                }
            },
            checkout: {
                isNotReady: () => {
                    if(listData.keranjang.status !== 'fetched') {
                        return true
                    }

                    if(listData.keranjang.data.length < 1) {
                        return true
                    }
                },
                submit: async () => {
                    try {
                        aksi.keranjang.checkout.loading()

                        const payload = {
                            keranjang: listData.keranjang.data,
                            checkout: {}
                        }

                        const response = await api_post({
                            url: `/api/admin/data/keranjang/checkout/${user.data.id}`,
                            payload
                        })

                        if(response.success) {
                            router.push('/keranjang/checkout')
                        }else{
                            aksi.keranjang.checkout.loading()
                            customToast.error({
                                message: response?.message
                            })
                        }
                    } catch (error) {
                        aksi.keranjang.checkout.loading()
                    }
                },
                loading: () => {
                    setListData(state => ({
                        ...state,
                        keranjang: {
                            ...state.keranjang,
                            loading: {
                                ...state.keranjang.loading,
                                checkout: !state.keranjang.loading.checkout
                            }
                        }
                    }))
                }
            }
        }
    }

    useEffect(() => {
        if(user.status === 'fetched') {
            if(user.data !== null) {
                aksi.keranjang.get(user.data.id)
            }
        }
    }, [user])

    return (
        <MainLayout>
            <div className="p-5">
                <CustomBreadcrumb 
                    items={[
                        {
                            label: 'Home',
                            icon: HomeOutlined
                        },
                        {
                            label: 'Keranjang',
                            icon: ShoppingCartOutlined
                        }
                    ]}
                />
                <hr className="my-5 opacity-0" />
                <div className="grid grid-cols-6 gap-5">
                    <div className="col-span-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-5xl">
                                Keranjang Anda
                            </h1>
                            {listData.keranjang.status === 'fetched'
                                ? listData.keranjang.data.length > 0 
                                    ? <button type="button" onClick={() => aksi.keranjang.delete.all()} className="flex items-center gap-2 opacity-70 hover:opacity-100 ease-out duration-100 text-sm tracking-tighter">
                                        <DeleteOutline fontSize="small" />
                                        Hapus Keranjang
                                    </button>
                                    : <div className=""></div>
                                : <CircularProgress size={15} className="grayscale" />
                            }
                        </div>
                        <hr className="my-5 opacity-0" />
                        <div className="grid grid-cols-12">
                            <div className="col-span-6 p-2 flex items-center gap-3">
                                <p className="font-medium opacity-50">
                                    PRODUK
                                </p>
                            </div>
                            <div className="col-span-3 p-2 flex items-center justify-center gap-3">
                                <p className="font-medium opacity-50 text-center">
                                    JUMLAH
                                </p>
                            </div>
                            <div className="col-span-3 p-2 flex items-center justify-end gap-3">
                                <p className="font-medium opacity-50 text-end">
                                    TOTAL HARGA
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="divide-y">
                            {listData.keranjang.status === 'fetched'
                                ? listData.keranjang.data.map(item => (
                                    <div key={item['id']} className="grid grid-cols-12">
                                        <div className="col-span-6 p-2 flex items-center gap-3">
                                            <div className="flex items-center gap-3">
                                                {item['Produk']['Foto_Produk']
                                                    ? <img src={item['Produk']['Foto_Produk']['url']} className="aspect-square w-16 object-cover object-center rounded-xl" alt="logo produk" />
                                                    : <div className="aspect-square w-16 object-cover object-center rounded-xl bg-zinc-200"></div>
                                                }
                                                <div className="">
                                                    <p className="font-medium">
                                                        {item['Produk']['nama']}
                                                    </p>
                                                    <p className="text-xs opacity-50">
                                                        {item['Produk']['Kategori_Produks'].map(v => v['Kategori']['nama']).join(', ') || 'Tidak ada Kategori'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 p-2 flex items-center justify-center gap-3">
                                            <div className="">
                                                <div className="border p-1 rounded-md flex items-center justify-center gap-3">
                                                    <button type="button" onClick={() => aksi.keranjang.produk.jumlah(item['id'], { remove: 1 })} className="opacity-50 hover:opacity-100">
                                                        <Remove fontSize="small" />
                                                    </button>
                                                    <p className="font-semibold">
                                                        {item['jumlah']}
                                                    </p>
                                                    <button type="button" onClick={() => aksi.keranjang.produk.jumlah(item['id'], { add: 1 })} className="opacity-50 hover:opacity-100">
                                                        <Add fontSize="small" />
                                                    </button>
                                                </div>
                                                <hr className="my-1 opacity-0" />
                                                <button type="button" onClick={() => aksi.keranjang.delete.produk(item['fk_produk'])} className="flex items-center gap-2 opacity-70 hover:opacity-100 ease-out duration-100 text-sm tracking-tighter">
                                                    <DeleteOutline fontSize="small" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-3 p-2 flex items-center justify-end gap-3">
                                            <p className="font-medium text-end">
                                                Rp {aksi.keranjang.produk.harga.total(item['id'])}
                                            </p>
                                        </div>
                                    </div>
                                ))
                                : <div className="flex justify-center items-center w-full">
                                    <LinearProgress className="w-full" />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-span-2 border p-5 rounded-xl sm:sticky top-6 h-fit">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm opacity-60">
                                    Jumlah
                                </p>
                                <p className="font-medium">
                                    {aksi.keranjang.total.produk()}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm opacity-60">
                                    Total
                                </p>
                                <p className="font-medium">
                                    Rp {aksi.keranjang.total.harga()}
                                </p>
                            </div>
                        </div>
                        <hr className="my-2" />
                        <div className="flex items-center justify-between">
                            <p className="text-sm opacity-60">
                                Total Keseluruhan
                            </p>
                            <p className="font-medium text-lg">
                                Rp {aksi.keranjang.total.harga()}
                            </p>
                        </div>
                        <hr className="my-2 opacity-0" />
                        <div className="flex items-center justify-center">
                            {listData.keranjang.loading.checkout
                                ? <CircularProgress size={20} />
                                : <button type="button" onClick={() => aksi.keranjang.checkout.submit()} disabled={aksi.keranjang.checkout.isNotReady()} className="w-full rounded-lg py-2 flex items-center justify-center gap-3 bg-zinc-700 disabled:bg-zinc-700/40 text-white text-sm hover:bg-zinc-800 active:bg-zinc-950 ease-out duration-200">
                                    <ShoppingCartCheckout fontSize="small" />
                                    Checkout Sekarang
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}