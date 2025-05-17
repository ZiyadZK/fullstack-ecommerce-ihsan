'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DataTable from "@/components/CustomDataTable"
import Modal, { modal } from "@/components/Modal"
import { api_delete, api_get, api_post, api_put } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { Add, Category, CategoryOutlined, Check, Close, Delete, Edit, HomeOutlined, Payment, Save, Send, Visibility } from "@mui/icons-material"
import { Button, CircularProgress, IconButton, TextField } from "@mui/material"
import { useEffect, useState } from "react"

const initialState = {
    form: {
        tambah: {
            nama: '',
            loading: false,
            error: null
        },
        edit: {
            id: '',
            nama: '',
            loading: false,
            error: null
        }
    }
}

export default function DashboardTransaksiPage() {

    const [listData, setListData] = useState({
        payment: {
            status: '',
            data: [],
            select: [],
            loading: {
                delete: false,
                update: false
            }
        }
    })

    const [formData, setFormData] = useState({
        tambah: {
            nama: ''
        },
        edit: {
            id: '',
            nama: ''
        }
    })

    const aksi = {
        payment: {
            get: async () => {
                try {
                    setListData(state => ({
                        ...state,
                        payment: {
                            ...state.payment,
                            status: 'loading'
                        }
                    }))

                    const response = await api_get({
                        url: '/api/admin/data/payment'
                    })

                    setListData(state => ({
                        ...state,
                        payment: {
                            ...state.payment,
                            status: 'fetched'
                        }
                    }))
                    if(!response.success) {
                        customToast.error({
                            message: response?.message
                        })
                    }else{
                        setListData(state => ({
                            ...state,
                            payment: {
                                ...state.payment,
                                data: response?.data
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        payment: {
                            ...state.payment,
                            status: 'fetched'
                        }
                    }))
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            select: (value) => {
                setListData(state => ({
                    ...state,
                    payment: {
                        ...state.payment,
                        select: value
                    }
                }))
            },
            delete: async (id) => {
                try {
                    aksi.payment.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/payment`,
                        payload: {
                            id: id ? id : listData.payment.select
                        }
                    })

                    aksi.payment.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus payment tersebut`
                        })
                        await aksi.payment.get()
                    }
                } catch (error) {
                    aksi.payment.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            toggleLoading: {
                delete: () => {
                    setListData(state => ({
                        ...state,
                        payment: {
                            ...state.payment,
                            loading: {
                                delete: !state.payment.loading.delete
                            }
                        }
                    }))
                },
                update: () => {
                    setListData(state => ({
                        ...state,
                        payment: {
                            ...state.payment,
                            loading: {
                                update: !state.payment.loading.update
                            }
                        }
                    }))
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
            is_confirmed: async (id, is_confirmed = true) => {
                try {
                    aksi.payment.toggleLoading.update()

                    const response = await api_put({
                        url: `/api/admin/data/payment`,
                        payload: {
                            id: id ? id : listData.payment.select,
                            payload: {
                                is_confirmed
                            }
                        }
                    })

                    aksi.payment.toggleLoading.update()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil mengubah status payment tersebut`
                        })
                        await aksi.payment.get()
                    }
                } catch (error) {
                    aksi.payment.toggleLoading.update()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            is_sampai: async (id, is_sampai = true) => {
                try {
                    aksi.payment.toggleLoading.update()

                    const response = await api_put({
                        url: `/api/admin/data/payment`,
                        payload: {
                            id: id ? id : listData.payment.select,
                            payload: {
                                is_sampai
                            }
                        }
                    })

                    aksi.payment.toggleLoading.update()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil mengubah status payment tersebut`
                        })
                        await aksi.payment.get()
                    }
                } catch (error) {
                    aksi.payment.toggleLoading.update()
                    customToast.error({
                        message: error?.message
                    })
                }
            }
        },
        form: {
            edit: {
                init: (payload) => {
                    Object.keys(payload).map(column => {
                        aksi.form.edit.set(column, payload[column] || '')
                    })

                    modal.show('edit')
                },
                set: (col, val) => {
                    setFormData(state => ({
                        ...state,
                        edit: {
                            ...state.edit,
                            [col]: val
                        }
                    }))
                },
                error: (message) => {
                    setFormData(state => ({
                        ...state,
                        edit: {
                            ...state.edit,
                            error: message
                        }
                    }))
                },
                toggleLoading: () => {
                    setFormData(state => ({
                        ...state,
                        edit: {
                            ...state.edit,
                            loading: !state.edit.loading
                        }
                    }))
                },
                clear: () => {
                    setFormData(state => ({
                        ...state,
                        edit: initialState.form.edit
                    }))
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.form.edit.error(null)
                        aksi.form.edit.toggleLoading()

                        const { error, loading, id, ...payload } = formData.edit

                        const response = await api_put({
                            url: `/api/admin/data/payment`,
                            payload: {
                                id,
                                payload
                            }
                        })

                        if(!response.success) {
                            aksi.form.edit.error(response.message)
                            aksi.form.edit.toggleLoading()
                        }else{
                            aksi.form.edit.error(null)
                            modal.close('edit')
                            customToast.success({
                                message: `Berhasil mengubah payment`
                            })
                            await aksi.payment.get()
                            aksi.form.edit.toggleLoading()
                            aksi.form.edit.clear()
                        }

                    } catch (error) {
                        aksi.form.edit.error(error.message)
                        aksi.form.edit.toggleLoading()
                    }
                }
            }
        }
    }

    useEffect(() => {
        aksi.payment.get()
    }, [])

    return (
        <AdminMainLayout>
            <CustomBreadcrumb
                items={[
                    {
                        label: 'Dashboard',
                        icon: HomeOutlined,
                        href: '/'
                    },
                    {
                        label: 'Transaksi',
                        icon: Payment
                    }
                ]}
            />
            <hr className="my-2 opacity-0" />
            <h1 className="text-4xl">
                Transaksi
            </h1>
            <p className="opacity-70">
                Halaman untuk konfirmasi dan validasi terkait transaksi
            </p>
            <hr className="my-3 opacity-0" />

            <div className="flex justify-between items-center">
                
                {listData.payment.select.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => aksi.payment.delete()} variant="text" startIcon={<Delete />}>
                            <p className={`text-sm font-medium ${poppins.className}`}>
                                Hapus
                            </p>
                        </Button>
                    </div>
                )}
            </div>
            <hr className="my-2 opacity-0" />
            
            <DataTable
                toolbar
                checkbox
                rowSelect={{
                    value: listData.payment.select,
                    onChange: (newRowSelectionModel) => aksi.payment.select(newRowSelectionModel)
                }}
                loading={listData.payment.status === 'loading' ||  listData.payment.loading.delete}
                isRowSelectable={(params) => true}
                rows={listData?.payment?.data}
                columns={[
                    {
                        field: 'id',
                        headerName: 'ID'
                    },
                    {
                        field: 'nama',
                        headerName: 'Penerima',
                        valueGetter: (value, row) => `${row['Alamat_Penerima']?.nama}`
                    },
                    {
                        field: 'nama3',
                        headerName: 'Bukti Pembayaran',
                        renderCell: ({ row }) => {
                            return (
                                <div className="flex items-center h-full">
                                    {aksi.payment.status(row, 'string') !== 'Menunggu Pembayaran' && (
                                        <>
                                            <Modal modalId={`foto_payment_${row['id']}`} title="Bukti Pembayaran">
                                                <img src={`${row['Foto_Payment']['url']}`} alt="Foto Bukti Pembayaran" />
                                            </Modal>
                                            <IconButton onClick={() => modal.show(`foto_payment_${row['id']}`)} size="small" color="primary">
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </>
                                    )}
                                </div>
                            )
                        }
                    },
                    {
                        field: 'nama2',
                        headerName: 'Status',
                        renderCell: ({ row }) => {
                            return (
                                <div className="flex items-center h-full">
                                    {aksi.payment.status(row)}
                                </div>
                            )
                        }
                    },
                    {
                        field: 'name1',
                        headerName: '',
                        sortable: false,
                        renderCell: ({ row }) => {
                            return (
                                <div className="flex items-center justify-center h-full">
                                    {listData.payment.loading.update
                                        ? <CircularProgress size={20} />
                                        : <>
                                            {aksi.payment.status(row, 'string') === 'Menunggu Konfirmasi' && (
                                                <>
                                                    <IconButton onClick={() => aksi.payment.is_confirmed(row['id'])} size="small" color="primary">
                                                        <Check fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => aksi.payment.is_confirmed(row['id'], false)} size="small" color="primary">
                                                        <Close fontSize="small" />
                                                    </IconButton>
                                                </>
                                            )}
                                            {aksi.payment.status(row, 'string') === 'Sedang Dikirim' && (
                                                <>
                                                    <IconButton onClick={() => aksi.payment.is_sampai(row['id'])} size="small" color="primary">
                                                        <Check fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => aksi.payment.is_sampai(row['id'], false)} size="small" color="primary">
                                                        <Close fontSize="small" />
                                                    </IconButton>
                                                </>
                                            )}
                                            {aksi.payment.status(row, 'string') === 'Pesanan Tidak Diterima' && (
                                                <>
                                                    <IconButton onClick={() => aksi.payment.is_sampai(row['id'], null)} size="small" color="primary">
                                                        <Send fontSize="small" />
                                                    </IconButton>
                                                </>
                                            )}
                                            <IconButton onClick={() => aksi.payment.delete(row.id)} size="small" color="primary">
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </>
                                    }
                                </div>
                            )
                        }
                    }
                ]}
            />
        </AdminMainLayout>
    )
}