'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import MainLayout from "@/components/MainLayout";
import { api_get } from "@/libs/api_handler";
import { customToast } from "@/libs/customToast";
import { Apps, ChevronRight, HomeOutlined, House, Search } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, use, useEffect, useState } from "react";

export default function SearchPage({ params }) {
    const router = useRouter()
    const use_params = use(params)

    const search = use_params.search


    const [listData, setListData] = useState({
        products: {
            status: '',
            data: []
        }
    })

    const aksi = {
        products: {
            get_all: async (searchValue) => {
                try {
                    aksi.products.set('status', 'loading')

                    const response = await api_get({
                        url: `/api/admin/data/produk-search?search=${searchValue || ''}`
                    })

                    aksi.products.set('status', 'fetched')
                    
                    if(!response.success) {
                        customToast.error({
                            message: response?.message
                        })
                    }else{
                        aksi.products.set('data', response?.data)
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
            }
        }
    }

    useEffect(() => {
        aksi.products.get_all(
            search
        )
    }, [])

    return (
        <MainLayout>
            <div className="p-5">
                <Suspense fallback={<CircularProgress size={20} />}>
                    <CustomBreadcrumb 
                        items={
                            search
                                ? [
                                    {
                                        label: 'Home',
                                        icon: HomeOutlined,
                                        href: '/'
                                    },
                                    {
                                        label: 'Cari Produk',
                                        icon: Search
                                    },
                                    {
                                        label: `"${decodeURIComponent(search)}"`
                                    }
                                ]
                                : [
                                    {
                                        label: 'Home',
                                        icon: HomeOutlined
                                    },
                                    {
                                        label: 'Cari Produk',
                                        icon: Search
                                    }
                                ]
                        }
                    />
                </Suspense>
                
                {/* Best Seller */}
                <hr className="my-5 opacity-0" />
                {listData.products.status === 'loading'
                    ? (
                        <div className="flex items-center justify-center my-48">
                            <CircularProgress color="primary" size={50} />
                        </div>
                    )
                    : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            {listData.products.data.map(produk => (
                                <button type="button" key={produk['id']} onClick={() => router.push(`/produk/${produk['id']}`)} className="space-y-5 border border-zinc-300/0 hover:border-zinc-300 ease-out duration-100 hover:shadow-lg rounded-xl p-5 cursor-pointer">
                                    {produk['Foto_Produk']
                                        ? (
                                            <img src={produk['Foto_Produk']['url']} className="w-full aspect-square rounded-xl object-cover object-center" alt="Foto Produk" />
                                        )
                                        : (
                                            <div className="w-full aspect-square rounded-xl bg-zinc-200 flex items-center justify-center">
                                                No Photo
                                            </div>
                                        )
                                    }
                                    <div className="flex items-center justify-between">
                                    <div className="font-medium text-2xl">
                                        {produk['nama']}
                                    </div>
                                    <div className="font-medium">
                                        Rp {produk['harga_per_satuan']} <span className="opacity-70">/ {produk['satuan']}</span>
                                    </div>
                                    </div>
                                </button>
                            ))}

                        </div>
                    )
                }

                

            </div>
        </MainLayout>
    );
}
