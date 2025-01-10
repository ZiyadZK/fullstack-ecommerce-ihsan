'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DataTable from "@/components/CustomDataTable"
import CustomLoading from "@/components/CustomLoading"
import CustomSelect from "@/components/CustomSelect"
import Modal, { modal } from "@/components/Modal"
import { api_delete, api_get, api_post, api_put } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { input_handler } from "@/libs/input_handler"
import { Add, BookmarkAddOutlined, BookmarkOutlined, Category, CategoryOutlined, ChevronRight, Delete, Edit, HomeOutlined, Save } from "@mui/icons-material"
import { Button, CircularProgress, IconButton, TextField } from "@mui/material"
import { useEffect, useState } from "react"

const initialState = {
    form: {
        tambah: {
            fk_supplier: null,
            fk_produk: null,
            jumlah: 0,
            loading: false,
            error: null
        }
    }
}

export default function DashboardRestockPage() {

    const [listData, setListData] = useState({
        supplier: {
            status: '',
            data: [],
            select: [],
            loading: {
                delete: false
            }
        },
        produk: {
            status: '',
            data: []
        },
        riwayat_supplier: {
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
            fk_supplier: null,
            fk_produk: null,
            jumlah: 0,
            loading: false,
            error: null
        }
    })

    const aksi = {
        produk: {
            get: async () => {
                try {
                    setListData(state => ({
                        ...state,
                        produk: {
                            ...state.produk,
                            status: 'loading'
                        }
                    }))

                    const response = await api_get({
                        url: '/api/admin/data/produk'
                    })

                    setListData(state => ({
                        ...state,
                        produk: {
                            ...state.produk,
                            status: 'fetched'
                        }
                    }))

                    console.log(response)

                    if(!response.success) {
                        customToast.error({
                            message: response?.message
                        })
                    }else{
                        setListData(state => ({
                            ...state,
                            produk: {
                                ...state.produk,
                                data: response?.data
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        produk: {
                            ...state.produk,
                            status: 'fetched'
                        }
                    }))
                    customToast.error({
                        message: error?.message
                    })
                }
            } 
        },
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

                    console.log(response)

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
                            url: `/api/admin/data/riwayat_supplier`,
                            payload: {
                                ...payload,
                                fk_produk: payload['fk_produk']['id'],
                                fk_supplier: payload['fk_supplier']['id'],
                            }
                        })

                        if(!response.success) {
                            aksi.form.tambah.error(response.message)
                            aksi.form.tambah.toggleLoading()
                        }else{
                            aksi.form.tambah.error(null)
                            modal.close('tambah')
                            customToast.success({
                                message: `Berhasil restock produk`
                            })
                            await aksi.riwayat_supplier.get()
                            await aksi.produk.get()
                            aksi.form.tambah.toggleLoading()
                            aksi.form.tambah.clear()
                        }

                    } catch (error) {
                        aksi.form.tambah.error(error.message)
                        aksi.form.tambah.toggleLoading()
                    }
                }
            }
        },
        riwayat_supplier: {
            get: async () => {
                try {
                    setListData(state => ({
                        ...state,
                        riwayat_supplier: {
                            ...state.riwayat_supplier,
                            status: 'loading'
                        }
                    }))

                    const response = await api_get({
                        url: '/api/admin/data/riwayat_supplier'
                    })

                    setListData(state => ({
                        ...state,
                        riwayat_supplier: {
                            ...state.riwayat_supplier,
                            status: 'fetched'
                        }
                    }))

                    console.log(response)

                    if(!response.success) {
                        customToast.error({
                            message: response?.message
                        })
                    }else{
                        setListData(state => ({
                            ...state,
                            riwayat_supplier: {
                                ...state.riwayat_supplier,
                                data: response?.data
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        riwayat_supplier: {
                            ...state.riwayat_supplier,
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
                    riwayat_supplier: {
                        ...state.riwayat_supplier,
                        select: value
                    }
                }))
            },
            delete: async (id) => {
                try {
                    aksi.riwayat_supplier.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/riwayat_supplier`,
                        payload: {
                            id: id ? id : listData.riwayat_supplier.select
                        }
                    })

                    aksi.riwayat_supplier.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus riwayat supplier tersebut`
                        })
                        await aksi.riwayat_supplier.get()
                    }
                } catch (error) {
                    aksi.riwayat_supplier.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            toggleLoading: {
                delete: () => {
                    setListData(state => ({
                        ...state,
                        riwayat_supplier: {
                            ...state.riwayat_supplier,
                            loading: {
                                delete: !state.riwayat_supplier.loading.delete
                            }
                        }
                    }))
                }
            } 
        }
    }

    useEffect(() => {
        aksi.riwayat_supplier.get()
        aksi.supplier.get()
        aksi.produk.get()
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
                        label: 'Restock Produk',
                        icon: BookmarkAddOutlined
                    }
                ]}
            />
            <hr className="my-2 opacity-0" />
            <h1 className="text-4xl">
                Restock 
            </h1>
            <p className="opacity-70">
                Halaman untuk Restock Produk dari Supplier
            </p>
            <hr className="my-3 opacity-0" />

            <Modal modalId="tambah" title="Restock Produk">
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
                    <CustomLoading loading={listData.supplier.status === 'fetched'}>
                        <CustomSelect 
                            variant="outlined"
                            options={listData.supplier.data}
                            optionLabel="nama"
                            label="Pilih Supplier"
                            onModal="tambah"
                            value={formData.tambah.fk_supplier}
                            onChange={(e, newValue) => aksi.form.tambah.set('fk_supplier', newValue)}
                        />
                    </CustomLoading>
                    <CustomLoading loading={listData.produk.status === 'fetched'}>
                        <CustomSelect 
                            variant="outlined"
                            options={listData.produk.data}
                            optionLabel="nama"
                            label="Pilih Produk"
                            onModal="tambah"
                            
                            value={formData.tambah.fk_produk}
                            onChange={(e, newValue) => aksi.form.tambah.set('fk_produk', newValue)}
                        />
                    </CustomLoading>

                    <div className="grid grid-cols-2 gap-3">
                        <CustomLoading loading={listData.produk.status === 'fetched' && listData.supplier.status === 'fetched'}>
                            <TextField 
                                label="Jumlah"
                                fullWidth
                                type="number"
                                disabled={!formData.tambah.fk_produk}
                                value={formData.tambah.jumlah}
                                onChange={(e) => aksi.form.tambah.set('jumlah', input_handler.float_only(e.target.value, { min: 0, max: 200 }))}
                            />
                        </CustomLoading>
                        <div className="flex flex-col justify-center">
                            {formData.tambah.fk_produk && (
                                <>
                                    <p className="text-sm opacity-50">
                                        Stok Produk saat ini
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <p>
                                            {listData.produk.data.find(v => v['id'] === formData.tambah.fk_produk.id)['stok']}
                                        </p>
                                        {formData.tambah.jumlah !== 0 && (
                                            <>
                                                <ChevronRight fontSize="small" color="success" />
                                                <p className="text-green-500">
                                                {(parseInt(listData.produk.data.find(v => v['id'] === formData.tambah.fk_produk.id)['stok']) + parseInt(formData.tambah.jumlah))}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <Button type="submit" disabled={formData.tambah.loading} variant="contained" fullWidth startIcon={formData.tambah.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.tambah.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <div className="flex justify-between items-center">
                <Button onClick={() => aksi.form.tambah.init()} variant="contained" startIcon={<Add />}>
                    <p className={`text-sm font-medium ${poppins.className}`}>
                        Restock Produk
                    </p>
                </Button>
                
                {listData.riwayat_supplier.select.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => aksi.riwayat_supplier.delete()} variant="text" startIcon={<Delete />}>
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
                    value: listData.riwayat_supplier.select,
                    onChange: (newRowSelectionModel) => aksi.riwayat_supplier.select(newRowSelectionModel)
                }}
                loading={listData.riwayat_supplier.status === 'loading' ||  listData.riwayat_supplier.loading.delete}
                isRowSelectable={(params) => true}
                rows={listData?.riwayat_supplier?.data}
                columns={[
                    {
                        field: 'id',
                        headerName: 'ID'
                    },
                    
                    {
                        field: 'nama',
                        headerName: 'Supplier',
                        valueGetter: (value, row) => `${row['Supplier']['nama']}`
                    },
                    {
                        field: 'nama1',
                        headerName: 'Produk',
                        valueGetter: (value, row) => `${row['Produk']['nama']}`
                    },
                    {
                        field: 'jumlah',
                        headerName: 'Jumlah'
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
                                    <IconButton onClick={() => aksi.riwayat_supplier.delete(row.id)} size="small" color="primary">
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