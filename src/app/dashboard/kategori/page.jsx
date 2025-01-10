'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DataTable from "@/components/CustomDataTable"
import Modal, { modal } from "@/components/Modal"
import { api_delete, api_get, api_post, api_put } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { Add, Category, CategoryOutlined, Delete, Edit, HomeOutlined, Save } from "@mui/icons-material"
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

export default function DashboardKategoriPage() {

    const [listData, setListData] = useState({
        kategori: {
            status: '',
            data: [],
            select: [],
            loading: {
                delete: false
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
        kategori: {
            get: async () => {
                try {
                    setListData(state => ({
                        ...state,
                        kategori: {
                            ...state.kategori,
                            status: 'loading'
                        }
                    }))

                    const response = await api_get({
                        url: '/api/admin/data/kategori'
                    })

                    setListData(state => ({
                        ...state,
                        kategori: {
                            ...state.kategori,
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
                            kategori: {
                                ...state.kategori,
                                data: response?.data
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        kategori: {
                            ...state.kategori,
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
                    kategori: {
                        ...state.kategori,
                        select: value
                    }
                }))
            },
            delete: async (id) => {
                try {
                    aksi.kategori.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/kategori`,
                        payload: {
                            id: id ? id : listData.kategori.select
                        }
                    })

                    aksi.kategori.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus kategori tersebut`
                        })
                        await aksi.kategori.get()
                    }
                } catch (error) {
                    aksi.kategori.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            toggleLoading: {
                delete: () => {
                    setListData(state => ({
                        ...state,
                        kategori: {
                            ...state.kategori,
                            loading: {
                                delete: !state.kategori.loading.delete
                            }
                        }
                    }))
                }
            }
        },
        form: {
            tambah: {
                init: () => {
                    modal.show('tambah')
                },
                set: (col, val) => {
                    setFormData(state => ({
                        ...state,
                        tambah: {
                            ...state.tambah,
                            [col]: val
                        }
                    }))
                },
                error: (message) => {
                    setFormData(state => ({
                        ...state,
                        tambah: {
                            ...state.tambah,
                            error: message
                        }
                    }))
                },
                toggleLoading: () => {
                    setFormData(state => ({
                        ...state,
                        tambah: {
                            ...state.tambah,
                            loading: !state.tambah.loading
                        }
                    }))
                },
                clear: () => {
                    setFormData(state => ({
                        ...state,
                        tambah: initialState.form.tambah
                    }))
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.form.tambah.error(null)
                        aksi.form.tambah.toggleLoading()

                        const { error, loading, ...payload } = formData.tambah

                        const response = await api_post({
                            url: `/api/admin/data/kategori`,
                            payload
                        })

                        if(!response.success) {
                            aksi.form.tambah.error(response.message)
                            aksi.form.tambah.toggleLoading()
                        }else{
                            aksi.form.tambah.error(null)
                            modal.close('tambah')
                            customToast.success({
                                message: `Berhasil menambahkan kategori baru`
                            })
                            await aksi.kategori.get()
                            aksi.form.tambah.toggleLoading()
                            aksi.form.tambah.clear()
                        }

                    } catch (error) {
                        aksi.form.tambah.error(error.message)
                        aksi.form.tambah.toggleLoading()
                    }
                }
            },
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
                            url: `/api/admin/data/kategori`,
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
                                message: `Berhasil mengubah kategori`
                            })
                            await aksi.kategori.get()
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
        aksi.kategori.get()
    }, [])

    return (
        <AdminMainLayout>
            <CustomBreadcrumb
                items={[
                    {
                        label: 'Dashboard',
                        icon: HomeOutlined
                    },
                    {
                        label: 'Kategori Produk',
                        icon: CategoryOutlined
                    }
                ]}
            />
            <hr className="my-2 opacity-0" />
            <h1 className="text-4xl">
                Kategori Produk
            </h1>
            <p className="opacity-70">
                Masterisasi kategori produk yang ada di aplikasi ini
            </p>
            <hr className="my-3 opacity-0" />

            <Modal modalId="tambah" title="Tambah Kategori">
                {formData.tambah.error && (
                    <>
                        <div className="p-3 bg-red-500 text-white rounded-lg shadow-md">
                            <h1 className="font-medium text-sm">
                                Gagal menyimpan data!
                            </h1>
                            <hr className="my-2 opacity-0" />
                            <p className="text-sm">
                                {formData.tambah.error}
                            </p>
                        </div>
                        <hr className="my-2 opacity-0" />
                    </>
                )}
                <form onSubmit={(e) => aksi.form.tambah.submit(e)} className="space-y-3">
                    <TextField 
                        fullWidth
                        required
                        disabled={formData.tambah.loading}
                        label="Nama Lengkap"
                        size="small"
                        helperText="* Anda bisa mengosongkan kolom ini"
                        onChange={e => aksi.form.tambah.set('nama', e.target.value)}
                        value={formData.tambah.nama}
                    />
                    
                    <Button type="submit" disabled={formData.tambah.loading} variant="contained" fullWidth startIcon={formData.tambah.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.tambah.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <Modal modalId="edit" title="Edit Kategori">
                {formData.edit.error && (
                    <>
                        <div className="p-3 bg-red-500 text-white rounded-lg shadow-md">
                            <h1 className="font-medium text-sm">
                                Gagal menyimpan data!
                            </h1>
                            <hr className="my-2 opacity-0" />
                            <p className="text-sm">
                                {formData.edit.error}
                            </p>
                        </div>
                        <hr className="my-2 opacity-0" />
                    </>
                )}
                <form onSubmit={(e) => aksi.form.edit.submit(e)} className="space-y-3">
                    <TextField 
                        fullWidth
                        required
                        disabled={formData.edit.loading}
                        label="Nama Lengkap"
                        size="small"
                        helperText="* Anda bisa mengosongkan kolom ini"
                        onChange={e => aksi.form.edit.set('nama', e.target.value)}
                        value={formData.edit.nama}
                    />
                    
                    <Button type="submit" disabled={formData.edit.loading} variant="contained" fullWidth startIcon={formData.edit.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.edit.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <div className="flex justify-between items-center">
                <Button onClick={() => aksi.form.tambah.init()} variant="contained" startIcon={<Add />}>
                    <p className={`text-sm font-medium ${poppins.className}`}>
                        Tambah
                    </p>
                </Button>
                
                {listData.kategori.select.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => aksi.kategori.delete()} variant="text" startIcon={<Delete />}>
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
                    value: listData.kategori.select,
                    onChange: (newRowSelectionModel) => aksi.kategori.select(newRowSelectionModel)
                }}
                loading={listData.kategori.status === 'loading' ||  listData.kategori.loading.delete}
                isRowSelectable={(params) => true}
                rows={listData?.kategori?.data}
                columns={[
                    {
                        field: 'id',
                        headerName: 'ID'
                    },
                    
                    {
                        field: 'nama',
                        headerName: 'Nama'
                    },
                    {
                        field: 'Kategori_Produks',
                        headerName: 'Jumlah Produk',
                        renderCell: ({ row }) => {
                            return (
                                <div className="flex items-center h-full">
                                    {row['Kategori_Produks'].length}
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
                                    <IconButton 
                                        onClick={() => aksi.form.edit.init( 
                                            {
                                                id: row.id,
                                                nama: row.nama
                                            }
                                        )} 
                                        size="small" color="primary">
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => aksi.kategori.delete(row.id)} size="small" color="primary">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </div>
                            )
                        }
                    }
                ]}
            />
        </AdminMainLayout>
    )
}