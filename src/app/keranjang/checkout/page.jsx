'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import MainLayout from "@/components/MainLayout"
import { api_delete, api_get, api_post, api_put } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { UserContext, UserProvider } from "@/provider/userProvider"
import { Add, Check, Close, Delete, HomeOutlined, Payment, ShoppingCartCheckoutOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { Button, CircularProgress, IconButton, LinearProgress, Radio, TextField } from "@mui/material"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"

export default function KeranjangCheckputPage() {

    return (
        <UserProvider>
            <Page />
        </UserProvider>
    )
}

function Page() {

    const { user, user_dispatch } = useContext(UserContext)
    const router = useRouter()

    const [tab, setTab] = useState({
        pengiriman_baru: false,
        lebih_banyak: false
    })

    const [listData, setListData] = useState({
        checkout: {
            data: null,
            status: '',
            loading: {
                bayar: false,
                batalkan: false,
                diskon: false
            }
        },
        alamat: {
            data: [],
            status: '',
            loading: {
                tambah: false,
                hapus: false
            }
        }
    })

    const [formData, setFormData] = useState({
        tambah_alamat: {
            nama: '',
            no_hp: '',
            alamat: ''
        },
        kode: ''
    })

    const aksi = {
        checkout: {
            get: async () => {
                try {
                    aksi.checkout.set('status', 'loading')

                    const response = await api_get({
                        url: `/api/admin/data/keranjang/checkout/${user.data.id}`
                    })

                    aksi.checkout.set('status', 'fetched')
                    if(response.success) {
                        aksi.checkout.set('data', response?.data)
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.checkout.set('status', 'fetched')
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            set: (col, val) => {
                setListData(state => ({
                    ...state,
                    checkout: {
                        ...state.checkout,
                        [col]: val
                    }
                }))
            },
            loading: (col) => {
                setListData(state => ({
                    ...state,
                    checkout: {
                        ...state.checkout,
                        loading: {
                            ...state.checkout.loading,
                            [col]: !state.checkout.loading[col]
                        }
                    }
                }))
            },
            alamat: {
                set: (fk_alamat_penerima) => {
                    setListData(state => ({
                        ...state,
                        checkout: {
                            ...state.checkout,
                            data: {
                                ...state.checkout.data,
                                fk_alamat_penerima
                            }
                        }
                    }))
                }
            },
            diskon: {
                apply: async (kode) => {
                    try {

                        if(kode === '') {
                            return
                        }

                        aksi.checkout.loading('diskon')

                        const response = await api_put({
                            url: `/api/admin/data/claim-kupon/${kode}`,
                            payload: {
                                id: listData.checkout.data.id,
                                payload: {
                                    fk_kupon: kode
                                }
                            }
                        })

                        aksi.checkout.loading('diskon')

                        if(response.success) {
                            customToast.success({
                                message: 'Berhasil menggunakan kupon'
                            })
                            await aksi.checkout.get()
                        }else{
                            customToast.error({
                                message: response?.message
                            })
                        }
                    } catch (error) {
                        aksi.checkout.loading('diskon')
                    }
                },
                delete: async () => {
                    try {

                        aksi.checkout.loading('diskon')

                        const response = await api_delete({
                            url: `/api/admin/data/claim-kupon/1`,
                            payload: {
                                id: listData.checkout.data.id
                            }
                        })

                        aksi.checkout.loading('diskon')

                        if(response.success) {
                            customToast.success({
                                message: 'Berhasil menghapus kupon'
                            })
                            await aksi.checkout.get()
                        }else{
                            customToast.error({
                                message: response?.message
                            })
                        }
                    } catch (error) {
                        aksi.checkout.loading('diskon')
                    }
                }
            },
            total: {
                subtotal: () => {
                    let total = 0

                    listData.checkout.data.Keranjangs.map(v => {
                        total += parseFloat(parseFloat(v['Produk']['harga_per_satuan']) * parseInt(v['jumlah']))
                    })

                    return total
                },
                diskon: () => {
                    let total = aksi.checkout.total.subtotal()

                    return parseFloat(parseFloat(listData.checkout.data['Kupon']['diskon']/100) * total)
                },
                harga: () => {

                    
                    return listData.checkout.data['Kupon'] 
                        ? parseFloat(parseFloat(aksi.checkout.total.subtotal()) - parseFloat(aksi.checkout.total.diskon()))
                        : parseFloat(aksi.checkout.total.subtotal())
                }
            },
            bayar: async () => {
                try {
                    aksi.checkout.loading('bayar')
                    
                    const response = await api_post({
                        url: `/api/admin/data/keranjang/payment/${listData.checkout.data.id}`,
                        payload: {
                            id_checkout: listData.checkout.data.id,
                            fk_alamat_penerima: listData.checkout.data.fk_alamat_penerima,
                        }
                    })
                    
                    if(response.success) {
                        router.push('/pesanan')
                        customToast.success({
                            message: 'Berhasil melakukan chechkout, silahkan konfirmasi pembayaran anda!'
                        })
                    }else{
                        aksi.checkout.loading('bayar')
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.checkout.loading('bayar')
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            batal: async () => {
                try {
                    aksi.checkout.loading('batalkan')
                    
                    const response = await api_delete({
                        url: `/api/admin/data/keranjang/checkout/${listData.checkout.data.id}`
                    })

                    
                    if(response.success) {
                        router.push('/keranjang')
                        customToast.success({
                            message: 'Berhasil membatalkan checkout'
                        })
                    }else{
                        aksi.checkout.loading('batalkan')
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.checkout.loading('batalkan')
                    customToast.error({
                        message: error?.message
                    })
                }
            }
            
        },
        alamat: {
            get: async () => {
                try {
                    aksi.alamat.set('status', 'loading')
                    
                    const response = await api_get({
                        url: `/api/admin/data/alamat/user/${user.data.id}`
                    })

                    aksi.alamat.set('status', 'fetched')
                    if(response.success) {
                        aksi.alamat.set('data', response?.data)
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.alamat.set('status', 'fetched')
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            set: (col, val) => {
                setListData(state => ({
                    ...state,
                    alamat: {
                        ...state.alamat,
                        [col]: val
                    }
                }))
            },
            loading: (col) => {
                setListData(state => ({
                    ...state,
                    alamat: {
                        ...state.alamat,
                        loading: {
                            ...state.alamat.loading,
                            [col]: !state.alamat.loading[col]
                        }
                    }
                }))
            },
            tambah: {
                toggle: () => {
                    aksi.form.tambah_alamat.clear()
                    setTab(state => ({
                        ...state,
                        pengiriman_baru: !state.pengiriman_baru
                    }))
                }
            },
            delete: async (id) => {
                try {
                    aksi.alamat.loading('hapus')

                    const payload = {
                        id
                    }

                    const response = await api_delete({
                        url: `/api/admin/data/alamat/user/${user.data.id}`,
                        payload
                    })

                    aksi.alamat.loading('hapus')
                    if(response.success) {
                        customToast.success({
                            message: 'Berhasil menghapus alamat tersebut'
                        })
                        aksi.alamat.get()
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    aksi.alamat.loading('hapus')
                    customToast.error({
                        message: error?.message
                    })
                }
            }
        },
        form: {
            tambah_alamat: {
                set: (col, val) => {
                    setFormData(state => ({
                        ...state,
                        tambah_alamat: {
                            ...state.tambah_alamat,
                            [col]: val
                        }
                    }))
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()
                        aksi.alamat.loading('tambah')

                        const payload = {
                            ...formData.tambah_alamat
                        }

                        const response = await api_post({
                            url: `/api/admin/data/alamat/user/${user.data.id}`,
                            payload
                        })
    
                        aksi.alamat.loading('tambah')
                        if(response.success) {
                            customToast.success({
                                message: 'Berhasil menambahkan alamat baru'
                            })
                            aksi.alamat.tambah.toggle()
                            aksi.alamat.get()
                        }else{
                            customToast.error({
                                message: response?.message
                            })
                        }
                    } catch (error) {
                        aksi.alamat.loading('tambah')
                        customToast.error({
                            message: error?.message
                        })
                    }
                },
                clear: () => {
                    aksi.form.tambah_alamat.set('nama', '')
                    aksi.form.tambah_alamat.set('no_hp', '')
                    aksi.form.tambah_alamat.set('alamat', '')
                },
                close: () => {
                    aksi.form.tambah_alamat.clear()
                    setTab(state => ({
                        ...state,
                        pengiriman_baru: !state.pengiriman_baru
                    }))
                }
            }
        }
    }

    useEffect(() => {
        if(user.status === 'fetched') {
            if(user.data !== null) {
                aksi.checkout.get()
                aksi.alamat.get()
            }
        }
    }, [user])

    return (
        <MainLayout>
            {listData.checkout.status !== 'fetched' 
                ? <div className="flex items-center justify-center">
                    <LinearProgress className="w-full" />
                </div>
                : listData.checkout.data
                    ? <div className="p-5">
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
                                <hr className="mt-2" />
                                {listData.alamat.status !== 'fetched'
                                    ? <LinearProgress className="w-full" />
                                    : <div className="divide-y *:py-2">
                                        {listData.alamat.data.map(alamat => (
                                            <div key={alamat['id']} className="flex gap-5 justify-between">
                                                <div className="flex gap-5">
                                                    <div className="flex-shrink-0 flex-col">
                                                        <Radio checked={listData.checkout.data.fk_alamat_penerima === alamat['id']} onChange={e => aksi.checkout.alamat.set(alamat['id'])} size="small" name="alamat_pengiriman" id="alamat_pengiriman" />
                                                        
                                                    </div>
                                                    <div className="py-2">
                                                        <div className="flex items-center gap-5">
                                                            <p>
                                                                {alamat['nama']}
                                                            </p>
                                                            <p>
                                                                {alamat['no_hp']}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm opacity-50 font-normal">
                                                            {alamat['alamat']}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    {listData.alamat.loading.hapus
                                                        ? <CircularProgress className="grayscale translate-y-2" size={20} />
                                                        : <IconButton color="error" onClick={() => aksi.alamat.delete(alamat['id'])}>
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    }
                                                </div>
                                                
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-center">
                                            {!tab.pengiriman_baru
                                                ? <button type="button" onClick={() => aksi.alamat.tambah.toggle()} className="px-4 py-2 rounded-full border flex items-center justify-center gap-3 font-normal text-blue-500 hover:bg-blue-100 hover:border-blue-500 text-xs">
                                                    <Add fontSize="small" />
                                                    Alamat Pengiriman Baru
                                                </button>
                                                : (
                                                    <form onSubmit={e => aksi.form.tambah_alamat.submit(e)} className="rounded-xl border w-full relative overflow-hidden">
                                                        <div className="bg-zinc-100 p-3">
                                                            <div className="flex items-center justify-between">
                                                                <h1>
                                                                    Tambah Alamat Pengiriman Baru
                                                                </h1>
                                                                <button onClick={() => aksi.alamat.tambah.toggle()} type="button" className=" flex items-center justify-center rounded-lg opacity-80 hover:opacity-100">
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
                                                                    disabled={listData.alamat.loading.tambah}
                                                                    label="Nama Penerima"
                                                                    value={formData.tambah_alamat.nama}
                                                                    onChange={e => aksi.form.tambah_alamat.set('nama', e.target.value)}
                                                                    
                                                                />
                                                                <TextField 
                                                                    fullWidth
                                                                    size="small"
                                                                    disabled={listData.alamat.loading.tambah}
                                                                    label="No Handphone Penerima"
                                                                    required
                                                                    value={formData.tambah_alamat.no_hp}
                                                                    onChange={e => aksi.form.tambah_alamat.set('no_hp', e.target.value)}
                                                                />
                                                                <TextField 
                                                                    fullWidth
                                                                    required
                                                                    disabled={listData.alamat.loading.tambah}
                                                                    size="small"
                                                                    label="Alamat"
                                                                    className="col-span-2"
                                                                    value={formData.tambah_alamat.alamat}
                                                                    onChange={e => aksi.form.tambah_alamat.set('alamat', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="p-3 flex justify-end">
                                                            <Button type="submit" disabled={listData.alamat.loading.tambah} variant="contained" size="small" startIcon={listData.alamat.loading.tambah ? <CircularProgress size={10} /> : <Check />}>
                                                                <p className={`${poppins.className} text-xs`}>
                                                                    {listData.alamat.loading.tambah ? 'Loading' : 'Simpan'}
                                                                </p>
                                                            </Button>
                                                        </div>
                                                    </form>
                                                )
                                            }
                                        </div>
                                    </div>
                                }
                                
                            </div>
                        </div>
                        <div className="col-span-2 border rounded-xl p-5 h-fit sticky top-6">
                            <h1 className="text-lg font-medium tracking-tighter">
                                Pesanan Anda
                            </h1>
                            <hr className="my-2 opacity-0" />
                            <div className="space-y-2">
                                {listData.checkout.status === 'fetched'
                                    && (
                                        <>
                                            {!tab.lebih_banyak
                                                ? <div className="flex justify-between gap-5">
                                                    <div className="flex gap-2">
                                                        {listData.checkout.data.Keranjangs[0]['Produk']['Foto_Produk']
                                                            ? <img className="w-12 rounded-lg object-cover object-center aspect-square flex-shrink-0" src={listData.checkout.data.Keranjangs[0]['Produk']['Foto_Produk']['url']} alt="Foto Pesanan" />
                                                            : <div className="w-12 rounded-lg aspect-square flex-shrink-0 bg-zinc-200"></div>
                                                        }
                                                        <div className="">
                                                            <p className="truncate font-medium text-sm">
                                                                {listData.checkout.data.Keranjangs[0]['Produk']['nama'] || 'Loading'}
                                                            </p>
                                                            <p className="text-xs opacity-50">
                                                                x{listData.checkout.data.Keranjangs[0]['jumlah'] || 'Loading'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="flex-shrink-0">
                                                        Rp {(parseFloat(parseInt(listData.checkout.data.Keranjangs[0]['jumlah']) * parseFloat(listData.checkout.data.Keranjangs[0]['Produk']['harga_per_satuan']))) || 'Loading'}
                                                    </p>
                                                </div>
                                                : listData.checkout.data.Keranjangs.map(keranjang => (
                                                    <div key={keranjang['id']} className="flex justify-between gap-5">
                                                        <div className="flex gap-2">
                                                            {keranjang['Produk']['Foto_Produk']
                                                                ? <img className="w-12 rounded-lg object-cover object-center aspect-square flex-shrink-0" src={keranjang['Produk']['Foto_Produk']['url']} alt="Foto Pesanan" />
                                                                : <div className="w-12 rounded-lg aspect-square flex-shrink-0 bg-zinc-200"></div>
                                                            }
                                                            
                                                            <div className="">
                                                                <p className="truncate font-medium text-sm">
                                                                    {keranjang['Produk']['nama'] || 'Loading'}
                                                                </p>
                                                                <p className="text-xs opacity-50">
                                                                    x{keranjang['jumlah'] || 'Loading'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="flex-shrink-0">
                                                            Rp {(parseFloat(parseInt(keranjang['jumlah']) * parseFloat(keranjang['Produk']['harga_per_satuan']))) || 'Loading'}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                            {(listData.checkout.data.Keranjangs.length - 1) > 0 && (
                                                <>
                                                    {!tab.lebih_banyak
                                                        && <div className="mt-2">
                                                            <p className="text-xs opacity-50 italic text-end">
                                                                + {listData.checkout.data.Keranjangs.length - 1} Pesanan lainnya
                                                            </p>
                                                        </div>
                                                    }
                                                    <div className="flex items-center">
                                                        <hr className="w-full" />
                                                        <button type="button" onClick={() => setTab(state => ({...state, lebih_banyak: !state.lebih_banyak}))} className="text-xs px-2 py-1 border rounded-full bg-white text-blue-500 hover:bg-zinc-100 w-full">
                                                            {tab.lebih_banyak
                                                                ? 'Lihat lebih sedikit'
                                                                : 'Lihat lebih banyak'
                                                            }
                                                        </button>
                                                        <hr className="w-full" />
                                                    </div>
                                                </>
                                            )}
                                            
                                        </>
                                    )
                                }
                                
                            </div>
                                        
                            <hr className="my-5 border-dashed" />

                            <h1 className="text-lg font-medium tracking-tighter">
                                Diskon
                            </h1>
                            <hr className="my-1 opacity-0" />
                            {listData.checkout.status !== 'fetched' 
                                ? <LinearProgress className="w-full" />
                                : listData.checkout.data['Kupon']
                                    ? <div className="py-1 px-3 rounded-lg border-2 border-green-700 bg-green-50 text-green-500 flex items-center justify-between">
                                        <h1 className="font-medium text-green-700">
                                            {listData.checkout.data['Kupon']['nama']}
                                        </h1>
                                        {listData.checkout.loading.diskon
                                            ? <CircularProgress size={15} color="success" />
                                            : <IconButton color="success" size="small" onClick={() => aksi.checkout.diskon.delete()}>
                                                <Close fontSize="small" />
                                            </IconButton>
                                        }
                                    </div>
                                    : <form className="grid grid-cols-12 gap-5">
                                        <div className="col-span-10">
                                            <TextField 
                                                fullWidth
                                                size="small"
                                                label="Kode Kupon"
                                                value={formData.kode}
                                                disabled={listData.checkout.loading.diskon}
                                                onChange={e => setFormData(state => ({...state, kode: e.target.value}))}
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center justify-center">
                                            {listData.checkout.loading.diskon
                                                ? <CircularProgress size={15} className="grayscale" />
                                                : <button type="button" onClick={() => aksi.checkout.diskon.apply(formData.kode)} className="rounded-md bg-zinc-700 hover:bg-zinc-800 active:bg-zinc-950 text-white flex items-center justify-center w-full h-full">
                                                    <Check fontSize="small" />
                                                </button>
                                            }
                                        </div>
                                    </form>
                                
                            }
                            
                            <hr className="my-5 border-dashed" />

                            {listData.checkout.status !== 'fetched' 
                                ? <div className="flex items-center justify-center">
                                    <CircularProgress size={40} />
                                </div>
                                : (
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-sm opacity-50">
                                                    Subtotal
                                                </p>
                                                <p className="font-medium">
                                                    Rp {aksi.checkout.total.subtotal()}
                                                </p>
                                            </div>
                                            {listData.checkout.data['Kupon'] && (
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-sm opacity-50">
                                                        Diskon ({listData.checkout.data['Kupon']['diskon']}%)
                                                    </p>
                                                    <p className="text-sm font-medium opacity-50">
                                                        - Rp {aksi.checkout.total.diskon()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <hr className="my-5 border-dashed" />

                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">
                                                Total
                                            </p>
                                            <p className="font-medium">
                                                Rp {aksi.checkout.total.harga()}
                                            </p>
                                        </div>

                                        <hr className="my-5 border-dashed" />
                                        
                                        <div className="space-y-1">
                                            
                                            {listData.checkout.loading.bayar
                                                ? <div className="flex items-center justify-center">
                                                    <CircularProgress size={20} />
                                                </div>
                                                : <button onClick={() => aksi.checkout.bayar()} type="button" className="w-full rounded-lg bg-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-950 ease-out duration-150 text-sm py-2 flex items-center justify-center gap-3">
                                                    <Payment fontSize="small" />
                                                    Bayar Sekarang
                                                </button>
                                            }
                                            {listData.checkout.loading.batalkan
                                                ? <div className="flex items-center justify-center">
                                                    <CircularProgress size={20} />
                                                </div>
                                                : <button type="button" onClick={() => aksi.checkout.batal()} className="w-full rounded-lg bg-red-700 text-white hover:bg-red-800 active:bg-red-950 ease-out duration-150 text-sm py-2 flex items-center justify-center gap-3">
                                                    <Close fontSize="small" />
                                                    Batalkan
                                                </button>
                                            }
                                        </div>

                                        <hr className="my-1 opacity-0" />
                                        <p className="opacity-50 text-xs italic">
                                            * Mohon Pastikan kembali sebelum anda yakin untuk membayar produk yang sudah anda pesan
                                        </p>
                                    </>
                                )
                            }

                        </div>
                    </div>
                </div>
                : <div className="flex items-center justify-center h-80">
                    <div className="space-y-2">
                        <h1 className="text-6xl">
                            Anda tidak memiliki Checkout
                        </h1>
                    </div>
                </div>
            }
        </MainLayout>
    )
}