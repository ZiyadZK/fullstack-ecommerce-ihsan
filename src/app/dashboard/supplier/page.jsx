'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DataTable from "@/components/CustomDataTable"
import Modal, { modal } from "@/components/Modal"
import { api_delete, api_get, api_post, api_put } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { Add, BookmarkOutlined, Category, CategoryOutlined, Delete, Edit, HomeOutlined, Save } from "@mui/icons-material"
import { Button, CircularProgress, IconButton, TextField } from "@mui/material"
import { useEffect, useState } from "react"

const initialState = {
    form: {
        tambah: {
            nama: '',
            alamat: '',
            loading: false,
            error: null
        },
        edit: {
            id: '',
            nama: '',
            alamat: '',
            loading: false,
            error: null
        }
    }
}

export default function DashboardSupplierPage() {

    const [listData, setListData] = useState({
        supplier: {
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
            nama: '',
            alamat: '',
            loading: false,
            error: null
        },
        edit: {
            id: '',
            nama: '',
            alamat: '',
            loading: false,
            error: null
        }
    })

    const aksi = {
        supplier: {
            get: async () => {
                try {
                    setListData(state => ({
                        ...state,
                        supplier: {
                            ...state.supplier,
                            status: 'loading'
                        }
                    }))

                    const response = await api_get({
                        url: '/api/admin/data/supplier'
                    })

                    setListData(state => ({
                        ...state,
                        supplier: {
                            ...state.supplier,
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
                            supplier: {
                                ...state.supplier,
                                data: response?.data
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        supplier: {
                            ...state.supplier,
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
                    supplier: {
                        ...state.supplier,
                        select: value
                    }
                }))
            },
            delete: async (id) => {
                try {
                    aksi.supplier.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/supplier`,
                        payload: {
                            id: id ? id : listData.supplier.select
                        }
                    })

                    aksi.supplier.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus supplier tersebut`
                        })
                        await aksi.supplier.get()
                    }
                } catch (error) {
                    aksi.supplier.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            toggleLoading: {
                delete: () => {
                    setListData(state => ({
                        ...state,
                        supplier: {
                            ...state.supplier,
                            loading: {
                                delete: !state.supplier.loading.delete
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
                            url: `/api/admin/data/supplier`,
                            payload
                        })

                        if(!response.success) {
                            aksi.form.tambah.error(response.message)
                            aksi.form.tambah.toggleLoading()
                        }else{
                            aksi.form.tambah.error(null)
                            modal.close('tambah')
                            customToast.success({
                                message: `Berhasil menambahkan supplier baru`
                            })
                            await aksi.supplier.get()
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
                            url: `/api/admin/data/supplier`,
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
                                message: `Berhasil mengubah supplier`
                            })
                            await aksi.supplier.get()
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
        aksi.supplier.get()
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
                        label: 'Supplier',
                        icon: BookmarkOutlined
                    }
                ]}
            />
            <hr className="my-2 opacity-0" />
            <h1 className="text-4xl">
                Supplier
            </h1>
            <p className="opacity-70">
                Masterisasi Supplier yang ada di aplikasi ini
            </p>
            <hr className="my-3 opacity-0" />

            <Modal modalId="tambah" title="Tambah Supplier">
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
                        label="Nama Supplier"
                        size="small"
                        onChange={e => aksi.form.tambah.set('nama', e.target.value)}
                        value={formData.tambah.nama}
                    />
                    <TextField 
                        fullWidth
                        required
                        disabled={formData.tambah.loading}
                        label="Alamat Supplier"
                        size="small"
                        onChange={e => aksi.form.tambah.set('alamat', e.target.value)}
                        value={formData.tambah.alamat}
                    />
                    
                    <Button type="submit" disabled={formData.tambah.loading} variant="contained" fullWidth startIcon={formData.tambah.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.tambah.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <Modal modalId="edit" title="Edit Supplier">
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
                        label="Nama Supplier"
                        size="small"
                        onChange={e => aksi.form.edit.set('nama', e.target.value)}
                        value={formData.edit.nama}
                    />
                    <TextField 
                        fullWidth
                        required
                        disabled={formData.edit.loading}
                        label="Alamat Supplier"
                        size="small"
                        onChange={e => aksi.form.edit.set('alamat', e.target.value)}
                        value={formData.edit.alamat}
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
                
                {listData.supplier.select.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => aksi.supplier.delete()} variant="text" startIcon={<Delete />}>
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
                    value: listData.supplier.select,
                    onChange: (newRowSelectionModel) => aksi.supplier.select(newRowSelectionModel)
                }}
                loading={listData.supplier.status === 'loading' ||  listData.supplier.loading.delete}
                isRowSelectable={(params) => true}
                rows={listData?.supplier?.data}
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
                        field: 'alamat',
                        headerName: 'Alamat'
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
                                                nama: row.nama,
                                                alamat: row.alamat,
                                            }
                                        )} 
                                        size="small" color="primary">
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => aksi.supplier.delete(row.id)} size="small" color="primary">
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