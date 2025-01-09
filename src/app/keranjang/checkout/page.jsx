'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import MainLayout from "@/components/MainLayout"
import { poppins } from "@/libs/fonts"
import { Add, Check, Close, HomeOutlined, Payment, ShoppingCartCheckoutOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { Button, Radio, TextField } from "@mui/material"
import { useState } from "react"

export default function KeranjangCheckoutPage() {

    const [tab, setTab] = useState({
        pengiriman_baru: false
    })

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
                        },
                        {
                            label: 'Checkout',
                            icon: ShoppingCartCheckoutOutlined
                        }
                    ]}
                />
                <hr className="my-5 opacity-0" />
                <div className="grid grid-cols-6 gap-5">
                    <div className="col-span-4 space-y-5">
                        <div className="p-5 rounded-xl border text-sm font-medium">
                            <p>
                                Alamat Pengiriman
                            </p>
                            <hr className="my-2" />
                            <div className="divide-y *:py-2">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0">
                                        <Radio size="small" name="alamat_pengiriman" id="alamat_pengiriman" />
                                    </div>
                                    <div className="py-2">
                                        <div className="flex items-center gap-5">
                                            <p>
                                                Ziyad Jahizh Kartiwa
                                            </p>
                                            <p>
                                                083112725191
                                            </p>
                                        </div>
                                        <p className="text-sm opacity-50 font-normal">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis explicabo repudiandae deleniti nisi earum sint accusantium tempore eos quos aut dolorum inventore, aliquid illo voluptas nihil tempora nam numquam rerum!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    {!tab.pengiriman_baru
                                        ? <button type="button" onClick={() => setTab(state => ({...state, pengiriman_baru: !state.pengiriman_baru}))} className="px-4 py-2 rounded-full border flex items-center justify-center gap-3 font-normal text-blue-500 hover:bg-blue-100 hover:border-blue-500 text-xs">
                                            <Add fontSize="small" />
                                            Alamat Pengiriman Baru
                                        </button>
                                        : (
                                            <form className="rounded-xl border w-full relative overflow-hidden">
                                                <div className="bg-zinc-100 p-3">
                                                    <div className="flex items-center justify-between">
                                                        <h1>
                                                            Tambah Alamat Pengiriman Baru
                                                        </h1>
                                                        <button onClick={() => setTab(state => ({...state, pengiriman_baru: !state.pengiriman_baru}))} type="button" className=" flex items-center justify-center rounded-lg opacity-80 hover:opacity-100">
                                                            <Close fontSize="small" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="p-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <TextField 
                                                            fullWidth
                                                            required
                                                            size="small"
                                                            label="Nama Penerima"
                                                            slotProps={{
                                                                inputLabel: {
                                                                    style: {
                                                                        fontWeight: '900',
                                                                        fontSize: 'small'
                                                                    }
                                                                },
                                                                input: {
                                                                    style: {
                                                                        fontWeight: 'bolder',
                                                                        fontSize: 'small'
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <TextField 
                                                            fullWidth
                                                            size="small"
                                                            label="No Handphone Penerima"
                                                            required
                                                            slotProps={{
                                                                inputLabel: {
                                                                    style: {
                                                                        fontWeight: '900',
                                                                        fontSize: 'small'
                                                                    }
                                                                },
                                                                input: {
                                                                    style: {
                                                                        fontWeight: 'bolder',
                                                                        fontSize: 'small'
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <TextField 
                                                            fullWidth
                                                            required
                                                            size="small"
                                                            label="Alamat"
                                                            className="col-span-2"
                                                            slotProps={{
                                                                inputLabel: {
                                                                    style: {
                                                                        fontWeight: '900',
                                                                        fontSize: 'small'
                                                                    }
                                                                },
                                                                input: {
                                                                    style: {
                                                                        fontWeight: 'bolder',
                                                                        fontSize: 'small'
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="p-3 flex justify-end">
                                                    <Button type="submit" variant="contained" size="small">
                                                        <p className={`${poppins.className} text-xs`}>
                                                            Simpan
                                                        </p>
                                                    </Button>
                                                </div>
                                            </form>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-xl border text-sm font-medium">
                            <p>
                                Metode Pengiriman
                            </p>
                            <hr className="my-2" />
                            <div className="divide-y *:py-2">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0">
                                        <Radio size="small" name="alamat_pengiriman" id="alamat_pengiriman" />
                                    </div>
                                    <div className="py-2 w-full">
                                        <div className="flex items-center justify-between gap-5">
                                            <p>
                                                Gratis
                                            </p>
                                            <p>
                                                Rp 0
                                            </p>
                                        </div>
                                        <p className="text-sm opacity-50 font-normal">
                                            3 - 4 Jam
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 border rounded-xl p-5 h-fit sticky top-6">
                        <h1 className="text-lg font-medium tracking-tighter">
                            Pesanan Anda
                        </h1>
                        <hr className="my-2 opacity-0" />
                        <div className="space-y-2">
                            <div className="flex justify-between gap-5">
                                <div className="flex gap-2">
                                    <img className="w-12 rounded-lg object-cover object-center aspect-square flex-shrink-0" src="https://avatars.githubusercontent.com/u/83384818" alt="Foto Pesanan" />
                                    <div className="">
                                        <p className="truncate font-medium text-sm">
                                            Coca Cola
                                        </p>
                                        <p className="text-xs opacity-50">
                                            x1
                                        </p>
                                    </div>
                                </div>
                                <p className="flex-shrink-0">
                                    Rp 200.000
                                </p>
                            </div>
                            <div className="mt-2">
                                <p className="text-xs opacity-50 italic text-end">
                                    + 20 Pesanan lainnya
                                </p>
                            </div>
                            <div className="flex items-center">
                                <hr className="w-full" />
                                <button type="button" className="text-xs px-2 py-1 border rounded-full bg-white text-blue-500 hover:bg-zinc-100 w-full">
                                    Lihat lebih banyak
                                </button>
                                <hr className="w-full" />
                            </div>
                        </div>
                                    
                        <hr className="my-5 border-dashed" />

                        <h1 className="text-lg font-medium tracking-tighter">
                            Diskon
                        </h1>
                        <hr className="my-1 opacity-0" />
                        <form className="grid grid-cols-12 gap-5">
                            <div className="col-span-10">
                                <TextField 
                                    fullWidth
                                    size="small"
                                    label="Kode Kupon"
                                    slotProps={{
                                        inputLabel: {
                                            style: {
                                                fontWeight: '900',
                                                fontSize: 'small'
                                            }
                                        },
                                        input: {
                                            style: {
                                                fontWeight: 'bolder',
                                                fontSize: 'small'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-span-2">
                                <button type="button" className="rounded-md bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-950 text-white flex items-center justify-center w-full h-full">
                                    <Check fontSize="small" />
                                </button>
                            </div>
                        </form>
                        
                        <hr className="my-5 border-dashed" />

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-sm opacity-50">
                                    Subtotal
                                </p>
                                <p className="font-medium">
                                    Rp 200.000
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-sm opacity-50">
                                    Diskon
                                </p>
                                <p className="text-sm font-medium opacity-50">
                                    - Rp 200.000
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-sm opacity-50">
                                    Ongkos Kirim
                                </p>
                                <p className="text-sm font-medium opacity-50">
                                    Rp 200.000
                                </p>
                            </div>
                        </div>

                        <hr className="my-5 border-dashed" />

                        <div className="flex items-center justify-between">
                            <p className="font-medium">
                                Total
                            </p>
                            <p className="font-medium">
                                Rp 200.000
                            </p>
                        </div>

                        <hr className="my-5 border-dashed" />
                        
                        <div className="space-y-1">
                            <button type="button" className="w-full rounded-lg bg-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-950 ease-out duration-150 text-sm py-2 flex items-center justify-center gap-3">
                                <Payment fontSize="small" />
                                Bayar Sekarang
                            </button>
                            <button type="button" className="w-full rounded-lg bg-red-700 text-white hover:bg-red-800 active:bg-red-950 ease-out duration-150 text-sm py-2 flex items-center justify-center gap-3">
                                <Close fontSize="small" />
                                Batalkan
                            </button>
                        </div>

                        <hr className="my-1 opacity-0" />
                        <p className="opacity-50 text-xs italic">
                            * Mohon Pastikan kembali sebelum anda yakin untuk membayar produk yang sudah anda pesan
                        </p>

                    </div>
                </div>
            </div>
        </MainLayout>
    )
}