'use client'

import CustomAccordion from "@/components/CustomAccordion"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DropdownMenu from "@/components/DropdownMenu"
import FileUploadComponent from "@/components/FileUpload"
import MainLayout from "@/components/MainLayout"
import Modal, { modal } from "@/components/Modal"
import { api_get, api_post, api_post_form, api_put } from "@/libs/api_handler"
import { client_api_post_form } from "@/libs/client_api_handler"
import { customToast } from "@/libs/customToast"
import { UserContext, UserProvider } from "@/provider/userProvider"
import { Check, CheckOutlined, Close, HomeOutlined, MoreHoriz, Payment, PaymentOutlined, ShoppingBagOutlined, Upload, Visibility } from "@mui/icons-material"
import { Button, LinearProgress } from "@mui/material"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

export default function PesananPage() {
    return (
        <UserProvider>
            <Page />
        </UserProvider>
    )
}

function Page() {

    const { user, user_dispatch } = useContext(UserContext)

    const [listData, setListData] = useState({
        payment: {
            data: [],
            status: '',
            loading: {
                upload: false,
                cancel: false,
                pesanan_sampai: false,
                update: false
            }
        }
    })

    const aksi = {
        payment: {
            get: async () => {
                try {
                    aksi.payment.set('status', 'loading')

                    const response = await api_get({
                        url: `/api/admin/data/keranjang/payment/${user.data.id}`
                    })

                    console.log(response)
                    
                    aksi.payment.set('status', 'fetched')
                    
                    if(response.success) {
                        aksi.payment.set('data', response?.data)
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.payment.set('status', 'fetched')
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            set: (col, val) => {
                setListData(state => ({
                    ...state,
                    payment: {
                        ...state.payment,
                        [col]: val
                    }
                }))
            },
            loading: (col) => {
                setListData(state => ({
                    ...state,
                    payment: {
                        ...state.payment,
                        loading: {
                            ...state.payment.loading,
                            [col]: !state.payment.loading[col]
                        }
                    }
                }))
            },
            upload: async (e, id) => {
                try {
                    aksi.payment.loading('upload')

                    const file = e.target.files[0]

                    e.target.value = ""

                    if(!file) {
                        return
                    }

                    const payload = {
                        id,
                        foto: file
                    }

                    const response = await client_api_post_form({
                        url: '/api/admin/data/payment/foto',
                        payload
                    })

                    aksi.payment.loading('upload')
                    
                    if(response.success) {
                        customToast.success({
                            message: 'Berhasil mengunggah bukti pembayaran'
                        })
                        await aksi.payment.get()
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.payment.loading('upload')
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            cancel: async () => {
                try {
                    aksi.payment.set('status', 'loading')

                    const response = await api_get({
                        url: `/api/admin/data/keranjang/payment/${user.data.id}`
                    })

                    console.log(response)
                    
                    aksi.payment.set('status', 'fetched')
                    
                    if(response.success) {
                        aksi.payment.set('data', response?.data)
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.payment.set('status', 'fetched')
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            total: {
                produk: {
                    harga: (jumlah, harga) => {
                        return jumlah * harga
                    }
                },
                subtotal: (keranjangs = []) => {
                    let total = 0

                    keranjangs.map(v => {
                        total += aksi.payment.total.produk.harga(v['jumlah'], v['Produk']['harga_per_satuan'])
                    })

                    return total
                },
                diskon: (checkout, keranjangs) => {
                    return ((checkout['Kupon']['diskon']/100) * aksi.payment.total.subtotal(keranjangs))

                },
                harga: (checkout, keranjangs = []) => {


                    return checkout['Kupon']
                        ? aksi.payment.total.subtotal(keranjangs) - aksi.payment.total.diskon(checkout, keranjangs)
                        : aksi.payment.total.subtotal(keranjangs)

                }
            },
            status: (payment, as = 'component') => {
                if(!payment['Foto_Payment']) {
                    return as === 'component'
                        ? <p className="px-2 py-1 rounded-md shadow bg-amber-500 text-white text-xs">
                            Menunggu Pembayaran
                        </p>
                        : 'Menunggu Pembayaran'
                }else{
                    if(payment['is_confirmed'] === null) {
                        return as === 'component'
                        ? <p className="px-2 py-1 rounded-md shadow bg-blue-500 text-white text-xs">
                            Menunggu Konfirmasi
                        </p>
                        : 'Menunggu Konfirmasi'
                    }else if(payment['is_confirmed'] === false) {
                        return as === 'component'
                            ? <p className="px-2 py-1 rounded-md shadow bg-red-500 text-white text-xs">
                                Pembayaran Gagal
                            </p>
                            : 'Pembayaran Gagal'
                    }else{
                        if(payment['is_sampai'] === null) {
                            return as === 'component'
                                ? <p className="px-2 py-1 rounded-md shadow bg-violet-500 text-white text-xs">
                                    Sedang Dikirim
                                </p>
                                : 'Sedang Dikirim'
                        }else if(payment['is_sampai'] === false) {
                            return as === 'component'
                                ? <p className="px-2 py-1 rounded-md shadow bg-red-500 text-white text-xs">
                                    Pesanan Tidak Diterima
                                </p>
                                : 'Pesanan Tidak Diterima'
                        }else{
                            return as === 'component'
                                ? <p className="px-2 py-1 rounded-md shadow bg-green-500 text-white text-xs">
                                    Pesanan Diterima
                                </p>
                                : 'Pesanan Diterima'
                        }
                    }
                }

                
            },
            is_sampai: async (id, is_sampai = true) => {
                try {
                    aksi.payment.loading('update')

                    const response = await api_put({
                        url: `/api/admin/data/payment`,
                        payload: {
                            id: id ? id : listData.payment.select,
                            payload: {
                                is_sampai
                            }
                        }
                    })

                    aksi.payment.loading('update')

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil mengubah status pembayaran tersebut`
                        })
                        await aksi.payment.get()
                    }
                } catch (error) {
                    aksi.payment.loading('update')
                    customToast.error({
                        message: error?.message
                    })
                }
            }
        }
    }

    useEffect(() => {
        if(user.status === 'fetched') {
            if(user.data !== null) {
                aksi.payment.get()
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
                            icon: HomeOutlined,
                            href: '/'
                        },
                        {
                            label: 'Pesanan Saya',
                            icon: ShoppingBagOutlined
                        }
                    ]}
                />
                <hr className="my-5 opacity-0" />
                {listData.payment.status !== 'fetched' 
                    ? <LinearProgress />
                    : listData.payment.data.map(payment => (
                        <CustomAccordion key={payment['id']} title={(
                            <div className="flex items-center justify-between gap-5 w-full">
                                <div className="flex items-center gap-3 w-1/2">
                                    <p className="px-2 py-1 rounded-md shadow text-xs bg-zinc-200">
                                        #{payment['id']}
                                    </p>
                                    <p className="text-sm truncate">
                                        {payment['Alamat_Penerima']['nama']}
                                    </p>
                                </div>
                                <div className="flex items-center gap-5">
                                   {aksi.payment.status(payment)}
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

                                {payment['Checkout']['Keranjangs'].map(keranjang => (
                                    <div key={keranjang['id']} className="grid grid-cols-12 gap-5">
                                        <div className="col-span-6 flex items-center gap-3">
                                            {keranjang['Produk']['Foto_Produk']
                                                ?   <img className="w-10 object-cover object-center rounded-xl aspect-square" src={keranjang['Produk']['Foto_Produk']['url']} alt="Logo produk" />    
                                                : <div className="w-10 rounded-xl aspect-square bg-zinc-200"></div>
                                            }
                                            
                                            <Link href={`/produk/${keranjang['fk_produk']}`} className="text-sm font-medium tracking-tighter underline hover:text-blue-500 hover:decoration-blue-500">
                                                {keranjang['Produk']['nama']}
                                            </Link>
                                        </div>    
                                        <div className="col-span-3 flex items-center gap-3">
                                            <p className=" opacity-50 text-sm">
                                                {keranjang['jumlah']} {keranjang['Produk']['satuan']}
                                            </p>
                                        </div>    
                                        <div className="col-span-3 flex items-center justify-end gap-3">
                                            <p className=" font-medium tracking-tighter text-sm">
                                                Rp {aksi.payment.total.produk.harga(keranjang['jumlah'], keranjang['Produk']['harga_per_satuan'])}
                                            </p>
                                        </div>  
                                        
                                    </div>
                                ))}           

                                <div className="flex justify-between">
                                    <div className="w-1/2 space-y-3 text-sm p-2 border rounded-lg shadow">
                                        <h1 className="text-sm">
                                            Informasi Penerima
                                        </h1>
                                        <div className="opacity-50">
                                            {payment['Alamat_Penerima']['nama']} ({payment['Alamat_Penerima']['no_hp']})
                                        </div>
                                        <div className="opacity-50 text-justify">
                                        {payment['Alamat_Penerima']['alamat']}
                                        </div>
                                    </div>
                                    <div className="w-1/5 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm opacity-50">
                                                Subtotal
                                            </p>
                                            <p className="font-medium tracking-tighter text-sm">
                                            Rp {aksi.payment.total.subtotal(payment['Checkout']['Keranjangs'])}
                                            </p>
                                        </div>
                                        {payment['Checkout']['Kupon'] && (
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm opacity-50">
                                                    Diskon
                                                </p>
                                                <p className="font-medium tracking-tighter text-sm">
                                                - Rp {aksi.payment.total.diskon(payment['Checkout'], payment['Checkout']['Keranjangs'])}
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm ">
                                                Total
                                            </p>
                                            <p className="font-medium tracking-tighter">
                                                Rp {aksi.payment.total.harga(payment['Checkout'], payment['Checkout']['Keranjangs'])}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            {aksi.payment.status(payment, 'string') === 'Menunggu Pembayaran' && (
                                                <FileUploadComponent 
                                                    variant="contained"
                                                    fullWidth
                                                    text="Bukti pembayaran"
                                                    onChange={(e) => aksi.payment.upload(e, payment['id'])}
                                                    loading={listData.payment.loading.upload}
                                                />
                                            )}  
                                            {aksi.payment.status(payment, 'string') === 'Pembayaran Gagal' && (
                                                <FileUploadComponent 
                                                    variant="contained"
                                                    fullWidth
                                                    text="Bukti pembayaran"
                                                    onChange={(e) => aksi.payment.upload(e, payment['id'])}
                                                    loading={listData.payment.loading.upload}
                                                />
                                            )}  
                                            {aksi.payment.status(payment, 'string') === 'Menunggu Konfirmasi' && (
                                                <>
                                                    <Modal modalId={`bukti_${payment['id']}`} title="Bukti Pembayaran Anda">
                                                        <img src={`${payment['Foto_Payment']['url']}`} alt="Foto Bukti Pembayaran" />
                                                    </Modal>
                                                    <Button fullWidth onClick={() => modal.show(`bukti_${payment['id']}`)} variant="contained" startIcon={<Visibility />}>
                                                        Lihat Bukti
                                                    </Button>
                                                </>
                                            )}  
                                            {aksi.payment.status(payment, 'string') === 'Sedang Dikirim' && (
                                                <>
                                                    <Button disabled={listData.payment.loading.update} fullWidth onClick={() => aksi.payment.is_sampai(payment['id'], true)} variant="contained" startIcon={<Check />}>
                                                        Pesanan Diterima
                                                    </Button>
                                                    <Button disabled={listData.payment.loading.update} fullWidth color="error" onClick={() => aksi.payment.is_sampai(payment['id'], false)} variant="text" startIcon={<Close />}>
                                                        Pesanan Tidak Diterima
                                                    </Button>
                                                </>
                                            )}  
                                            {['Menunggu Pembayaran', 'Menunggu Konfirmasi'].includes(aksi.payment.status(payment, 'string')) && (
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
                                            )}  
                                        </div>  
                                    </div>
                                </div>                
                            </div>
                        </CustomAccordion>
                    ))
                }
            </div>
        </MainLayout>
    )
}