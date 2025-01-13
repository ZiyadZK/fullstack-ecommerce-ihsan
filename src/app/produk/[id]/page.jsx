'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import MainLayout from "@/components/MainLayout";
import { api_get, api_post } from "@/libs/api_handler";
import { customToast } from "@/libs/customToast";
import { UserContext, UserProvider } from "@/provider/userProvider";
import { AddShoppingCartOutlined, Apps, ChevronRight, Close, FavoriteBorderOutlined, HomeOutlined, House, Search, ShoppingBagOutlined, Star, X } from "@mui/icons-material";
import { Avatar, CircularProgress, Rating } from "@mui/material";
import Image from "next/image";
import { use, useContext, useEffect, useState } from "react";



export default function ProdukDetailPage({ params }) {

    return (
        <UserProvider>
            <Page params={params} />
        </UserProvider>
    )
}

function Page({ params }) {

    const use_params = use(params)

    const { user, user_dispatch } = useContext(UserContext)

    const [listData, setListData] = useState({
        products: {
            status: '',
            data: null,
            loading: {
                keranjang: false,
                favorit: false
            }
        }
    })

    const [tabReview, setTabRevivew] = useState({
        open: false
    })


    const aksi = {
        products: {
            get: async (id) => {
                try {
                    aksi.products.set('status', 'loading')

                    const response = await api_get({
                        url: `/api/admin/data/produk/${id}`
                    })

                    aksi.products.set('status', 'fetched')

                    if(response.success) {
                        aksi.products.set('data', response?.data)
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.products.set('status', 'fetched')
                    customToast.error({
                        message: error?.message
                    })   
                }
            },
            set: (col, val) => {
                setListData(state => ({
                    ...state,
                    products: {
                        ...state.products,
                        [col]: val
                    }
                }))
            },
            add: {
                keranjang: async () => {
                    try {
                        aksi.products.toggleLoading('keranjang')

                        const response = await api_post({
                            url: `/api/admin/data/keranjang/user/${user.data.id}`,
                            payload: {
                                fk_produk: use_params.id
                            }
                        })
                        
                        aksi.products.toggleLoading('keranjang')

                        if(response.success) {
                            customToast.success({
                                message: 'Berhasil menambahkan produk ini ke keranjang'
                            })
                        }else{
                            customToast.error({
                                message: response?.message
                            })
                        }
                    } catch (error) {
                        aksi.products.toggleLoading('keranjang')
                        customToast.error({
                            message: error?.message
                        })
                    }
                },
                favorit: async () => {}
            },
            toggleLoading: (col) => {
                setListData(state => ({
                    ...state,
                    products: {
                        ...state.products,
                        loading: {
                            ...state.products.loading,
                            [col]: !state.products.loading[col]
                        }
                    }
                }))
            }
        }
    }

    useEffect(() => {
        aksi.products.get(use_params.id)
    }, [])

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
                            label: 'Cari Produk',
                            icon: Search
                        },
                        {
                            label: listData.products.status !== 'fetched' ? 'Loading...' : listData.products.data.nama
                        }
                    ]}
                />
                
                {/* Best Seller */}
                <hr className="my-5 opacity-0" />
                {listData.products.status !== 'fetched'
                    ? <div className="flex items-center justify-center my-60">
                        <CircularProgress size={30} />
                    </div>
                    : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">

                            <div className="space-y-5 border border-zinc-300 ease-out duration-100 shadow-lg rounded-xl p-5 h-fit sm:sticky top-10">
                                {listData.products.data['Foto_Produk']
                                    ? <img src={listData.products.data['Foto_Produk']['url']} className="w-full aspect-square rounded-xl object-cover object-center" alt="Foto Produk" />
                                    : <div className="w-full aspect-square rounded-xl bg-zinc-100"></div>
                                }
                            </div>
                            <div className="min-h-full flex flex-col justify-between">
                                <div className="">
                                    <div className="flex items-center justify-between">
                                        <p className="opacity-50">
                                            # {listData.products.data.id}
                                        </p>
                                        <p className="opacity-50">
                                            {listData.products.data.Kategori_Produks.length > 0
                                                ? listData.products.data.Kategori_Produks.map(v => v['Kategori']['nama']).join(', ')
                                                : 'Tidak ada Kategori'
                                            }
                                        </p>
                                    </div>
                                    <h1 className="text-6xl font-medium">
                                        {listData.products.data.nama}
                                    </h1>
                                    <hr className="my-2 opacity-0" />
                                    <div className="flex items-center gap-5">
                                        <Rating defaultValue={2.5} precision={0.5} readOnly />
                                        <p className="opacity-50">
                                            20 Ulasan
                                        </p>
                                    </div>
                                    <hr className="my-5 opacity-0" />
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="">
                                            <p className="text-3xl">
                                                Rp {listData.products.data.harga_per_satuan}
                                            </p>
                                            <p className="opacity-50">
                                                Harga per {listData.products.data.satuan}
                                            </p>
                                        </div>
                                        <div className="">
                                            <p className="text-3xl">
                                                {listData.products.data.stok}
                                            </p>
                                            <p className="opacity-50">
                                                Stok tersedia  
                                            </p>
                                        </div>
                                    </div>
                                    <hr className="my-5 opacity-0" />
                                    <p className="opacity-50">
                                        Deskripsi Produk
                                    </p>
                                    <p className="text-justify">
                                    {listData.products.data.deskripsi}
                                    </p>
                                    <hr className="my-5 opacity-0" />
                                </div>
                                <div className="">
                                    <div className="border rounded-xl">
                                        <div className="p-5">
                                            <div className="grid grid-cols-2 gap-5">
                                                
                                                <button type="button" className="w-full bg-red-700 flex items-center justify-center py-2 rounded-md text-white gap-2 hover:bg-red-800 active:bg-red-950 active:scale-95 ease-out duration-200">
                                                    <FavoriteBorderOutlined fontSize="small" />
                                                    Favorit!
                                                </button>
                                                {listData.products.data.stok > 0
                                                    ? listData.products.loading.keranjang
                                                        ? <div className="flex items-center justify-center py-2.5">
                                                            <CircularProgress size={25} color="primary" />
                                                        </div>
                                                        : <button type="button" onClick={() => aksi.products.add.keranjang()} className="w-full border-2 text-zinc-700 flex items-center justify-center py-2 rounded-md gap-2 hover:bg-zinc-100 active:bg-zinc-200 active:scale-95 ease-out duration-200">
                                                            <AddShoppingCartOutlined fontSize="small" />
                                                            Keranjang
                                                        </button>
                                                    : <div className="flex justify-center items-center text-red-500">
                                                        Stok sudah Habis!
                                                    </div>
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-5 opacity-0" />
                                    {!tabReview.open 
                                        ? <button type="button" onClick={() => setTabRevivew(state => ({...state, open: !state.open}))} className="w-full rounded-full border-2 flex items-center justify-center border-zinc-700 px-2 py-2 gap-2 hover:bg-zinc-700 hover:text-white ease-out duration-100">
                                            <Star fontSize="small" className="text-amber-500" />
                                            Lihat Ulasan
                                        </button>
                                        : (
                                            <div className="border-2 p-5 rounded-2xl border-zinc-700">
                                                <button type="button" onClick={() => setTabRevivew(state => ({...state, open: !state.open}))}>
                                                    <Close fontSize="small" />
                                                </button>
                                                <hr className="my-2 opacity-0" />
                                                <div className="divide-y *:py-3">
                                                    <div className="flex items-center justify-between gap-10">
                                                        <div className="flex gap-3">
                                                            <Avatar className="flex-shrink-0" />
                                                            <div className="">
                                                                <p className="text-sm">
                                                                    Ziyad Jahizh Kartiwa
                                                                </p>
                                                                <p className="text-sm opacity-80">
                                                                    Top Markotop sih ini
                                                                </p>
                                                                <hr className="my-2 opacity-0" />
                                                                <div className="flex items-center gap-5 text-xs opacity-50">
                                                                    <p>
                                                                        20 November 2023, 17:77
                                                                    </p>
                                                                    <p>
                                                                        2 Botol
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                                            <Star fontSize="small" className="text-amber-500" />
                                                            4.5
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }

                

            </div>
        </MainLayout>
    );
}
