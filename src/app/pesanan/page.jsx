'use client'

import CustomAccordion from "@/components/CustomAccordion"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DropdownMenu from "@/components/DropdownMenu"
import MainLayout from "@/components/MainLayout"
import Modal, { modal } from "@/components/Modal"
import { CheckOutlined, HomeOutlined, MoreHoriz, Payment, PaymentOutlined, ShoppingBagOutlined, Upload } from "@mui/icons-material"
import Link from "next/link"

export default function PembayaranPage() {
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
                            label: 'Pesanan Saya',
                            icon: ShoppingBagOutlined
                        }
                    ]}
                />
                <hr className="my-5 opacity-0" />
                <CustomAccordion title={(
                    <div className="flex items-center justify-between gap-5 w-full">
                        <div className="flex items-center gap-3 w-1/2">
                            <p className="px-2 py-1 rounded-md shadow text-xs bg-zinc-200">
                                #ABC123
                            </p>
                            <p className="text-sm truncate">
                                Ziyad Jahizh Kartiwa 
                            </p>
                        </div>
                        <div className="flex items-center gap-5">
                            <p className="text-sm opacity-50">
                                26 November 2023, 12:14
                            </p>
                            <p className="px-2 py-1 rounded-md shadow bg-amber-500 text-white text-xs">
                                Menunggu Pembayaran
                            </p>
                        </div>
                    </div>
                )}>
                    <div className="grid grid-cols-12 gap-5 py-2 border-b">
                        <div className="col-span-6 flex items-center gap-3">
                            <p className="font-medium text-sm opacity-50">
                                PRODUK
                            </p>
                        </div>
                        <div className="col-span-3 flex items-center gap-3">
                            <p className="font-medium text-sm opacity-50">
                                JUMLAH
                            </p>
                        </div>
                        <div className="col-span-3 flex items-center gap-3 justify-end">
                            <p className="font-medium text-sm opacity-50">
                                HARGA
                            </p>
                        </div>
                    </div>
                    <div className="divide-y *:py-2">

                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-6 flex items-center gap-3">
                                <img className="w-10 object-cover object-center rounded-xl aspect-square" src={"https://assets.klikindomaret.com/products/20065778/20065778_3.webp"} alt="Logo produk" />    
                                <Link href={'/produk/1'} className="text-sm font-medium tracking-tighter underline hover:text-blue-500 hover:decoration-blue-500">
                                    Coca Cola
                                </Link>
                            </div>    
                            <div className="col-span-3 flex items-center gap-3">
                                <p className=" opacity-50 text-sm">
                                    1 Botol
                                </p>
                            </div>    
                            <div className="col-span-3 flex items-center justify-end gap-3">
                                <p className=" font-medium tracking-tighter text-sm">
                                    Rp 200.000
                                </p>
                            </div>  
                            
                        </div>       

                        <div className="flex justify-between">
                            <div className="w-1/2 space-y-3 text-sm p-2 border rounded-lg shadow">
                                <h1 className="text-sm">
                                    Informasi Penerima
                                </h1>
                                <div className="opacity-50">
                                    Ziyad Jahizh Kartiwa (083112725191)
                                </div>
                                <div className="opacity-50 text-justify">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, odit autem expedita quod temporibus a magnam, nisi labore ab fugit facilis aliquid aliquam. Voluptate, voluptates nisi. Magnam ipsa accusamus officiis?
                                </div>
                            </div>
                            <div className="w-1/5 space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm opacity-50">
                                        Subtotal
                                    </p>
                                    <p className="font-medium tracking-tighter text-sm">
                                       Rp 500.000
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm opacity-50">
                                        Diskon
                                    </p>
                                    <p className="font-medium tracking-tighter text-sm">
                                       - Rp 500.000
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm ">
                                        Total
                                    </p>
                                    <p className="font-medium tracking-tighter">
                                        Rp 500.000
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Modal modalId={`bayar`} title="Pembayaran">
                                        <p className="text-sm opacity-50 italic">
                                            Silahkan unggah bukti pembayaran anda *
                                        </p>
                                        <form className="space-y-2">
                                            <input type="file" name="" id="" required />
                                            <button type="submit" className="w-full py-2 rounded-md bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-950 flex items-center justify-center text-white gap-3">
                                                <Upload fontSize="small" />
                                                Unggah
                                            </button>
                                        </form>
                                    </Modal>
                                    <button type="button" onClick={() => modal.show(`bayar`)} className="w-full py-2 rounded-md text-white bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-950 flex items-center justify-center gap-3 text-sm">
                                        <Payment fontSize="small" />
                                        Lakukan Pembayaran
                                    </button>  
                                    <DropdownMenu 
                                        buttonComponent={(
                                            <button type="button" className="w-full py-2 rounded-md text-zinc-700 hover:bg-zinc-100 border flex items-center justify-center gap-3 text-sm">
                                                <MoreHoriz fontSize="small" />
                                                Lainnya
                                            </button>
                                        )}
                                        menuItems={[
                                            {
                                                label: 'Batalkan Pesanan ini'
                                            }
                                        ]}
                                    />  
                                </div>  
                            </div>
                        </div>                
                    </div>
                </CustomAccordion>
            </div>
        </MainLayout>
    )
}