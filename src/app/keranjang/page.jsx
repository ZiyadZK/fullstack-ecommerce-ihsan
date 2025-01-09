'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import MainLayout from "@/components/MainLayout"
import { navigate } from "@/libs/navigate"
import { Add, DeleteOutline, HomeOutlined, Remove, ShoppingCart, ShoppingCartCheckout, ShoppingCartOutlined } from "@mui/icons-material"
import { Checkbox } from "@mui/material"
import { useRouter } from "next/navigation"

export default function KeranjangPage() {

    const router = useRouter()
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
                            <button type="button" className="flex items-center gap-2 opacity-70 hover:opacity-100 ease-out duration-100 text-sm tracking-tighter">
                                <DeleteOutline fontSize="small" />
                                Hapus Keranjang
                            </button>
                        </div>
                        <hr className="my-5 opacity-0" />
                        <div className="grid grid-cols-12">
                            <div className="col-span-6 p-2 flex items-center gap-3">
                                <Checkbox size="small" />
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
                            <div className="grid grid-cols-12">
                                <div className="col-span-6 p-2 flex items-center gap-3">
                                    <Checkbox size="small" />
                                    <div className="flex items-center gap-3">
                                        <img src="https://avatars.githubusercontent.com/u/83384818" className="aspect-square w-16 object-cover object-center rounded-xl" alt="logo produk" />
                                        <div className="">
                                            <p className="font-medium">
                                                Coca Cola
                                            </p>
                                            <p className="text-xs opacity-50">
                                                Segar, Sehat, Bermutu
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 p-2 flex items-center justify-center gap-3">
                                    <div className="">
                                        <div className="border p-1 rounded-md flex items-center justify-center gap-3">
                                            <button type="button" className="opacity-50 hover:opacity-100">
                                                <Remove fontSize="small" />
                                            </button>
                                            <p className="font-semibold">
                                                1
                                            </p>
                                            <button type="button" className="opacity-50 hover:opacity-100">
                                                <Add fontSize="small" />
                                            </button>
                                        </div>
                                        <hr className="my-1 opacity-0" />
                                        <button type="button" className="flex items-center gap-2 opacity-70 hover:opacity-100 ease-out duration-100 text-sm tracking-tighter">
                                            <DeleteOutline fontSize="small" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-3 p-2 flex items-center justify-end gap-3">
                                    <p className="font-medium text-end">
                                        Rp 221.000
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 border p-5 rounded-xl sm:sticky top-6 h-fit">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm opacity-60">
                                    Jumlah
                                </p>
                                <p className="font-medium">
                                    10
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm opacity-60">
                                    Total
                                </p>
                                <p className="font-medium">
                                    Rp 20.000
                                </p>
                            </div>
                        </div>
                        <hr className="my-2" />
                        <div className="flex items-center justify-between">
                            <p className="text-sm opacity-60">
                                Total Keseluruhan
                            </p>
                            <p className="font-medium text-lg">
                                Rp 20.000
                            </p>
                        </div>
                        <hr className="my-2 opacity-0" />
                        <button type="button" onClick={() => router.push('/keranjang/checkout')} disabled={false} className="w-full rounded-lg py-2 flex items-center justify-center gap-3 bg-zinc-700 disabled:bg-zinc-700/40 text-white text-sm hover:bg-zinc-800 active:bg-zinc-950 ease-out duration-200">
                            <ShoppingCartCheckout fontSize="small" />
                            Checkout Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}