'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import MainLayout from "@/components/MainLayout";
import { AddShoppingCartOutlined, Apps, ChevronRight, Close, FavoriteBorderOutlined, HomeOutlined, House, Search, ShoppingBagOutlined, Star, X } from "@mui/icons-material";
import { Avatar, Rating } from "@mui/material";
import Image from "next/image";
import { use, useState } from "react";

export default function ProdukDetailPage({ params }) {

    const use_params = use(params)
    const [listData, setListData] = useState({
        products: {
            status: '',
            data: {}
        }
    })

    const [tabReview, setTabRevivew] = useState({
        open: false
    })


    const aksi = {
        products: {
            get_all: async () => {
                try {
                
                } catch (error) {
                
                }
            }
        }
    }

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
                            label: `Coca Cola ${use_params.id}`
                        }
                    ]}
                />
                
                {/* Best Seller */}
                <hr className="my-5 opacity-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">

                    <div className="space-y-5 border border-zinc-300 ease-out duration-100 shadow-lg rounded-xl p-5 h-fit sm:sticky top-10">
                        <img src={`https://assets.klikindomaret.com/products/20065778/20065778_3.webp`} className="w-full aspect-square rounded-xl object-cover object-center" alt="Foto Produk" />
                    </div>
                    <div className="min-h-full flex flex-col justify-between">
                        <div className="">
                            <div className="flex items-center justify-between">
                                <p className="opacity-50">
                                    # 1
                                </p>
                                <p className="opacity-50">
                                    Segar, Sehat, Bergizi
                                </p>
                            </div>
                            <h1 className="text-6xl font-medium">
                                Coca Cola
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
                                        Rp 10.000
                                    </p>
                                    <p className="opacity-50">
                                        Harga per Botol  
                                    </p>
                                </div>
                                <div className="">
                                    <p className="text-3xl">
                                        59
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
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem numquam sunt quos architecto porro eligendi molestiae laudantium voluptatum commodi, doloremque dolore assumenda dicta voluptatem, alias libero unde nulla repudiandae quis?
                            </p>
                            <hr className="my-5 opacity-0" />
                        </div>
                        <div className="">
                            <div className="border rounded-xl">
                                <div className="p-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <button type="button" className="w-full col-span-2 bg-zinc-700 flex items-center justify-center py-2 rounded-md text-white gap-2 hover:bg-zinc-800 active:bg-zinc-950 active:scale-95 ease-out duration-200">
                                            <ShoppingBagOutlined fontSize="small" />
                                            Beli Sekarang!
                                        </button>
                                        <button type="button" className="w-full bg-red-700 flex items-center justify-center py-2 rounded-md text-white gap-2 hover:bg-red-800 active:bg-red-950 active:scale-95 ease-out duration-200">
                                            <FavoriteBorderOutlined fontSize="small" />
                                            Favorit!
                                        </button>
                                        <button type="button" className="w-full border-2 text-zinc-700 flex items-center justify-center py-2 rounded-md gap-2 hover:bg-zinc-100 active:bg-zinc-200 active:scale-95 ease-out duration-200">
                                            <AddShoppingCartOutlined fontSize="small" />
                                            Keranjang
                                        </button>
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

                

            </div>
        </MainLayout>
    );
}
