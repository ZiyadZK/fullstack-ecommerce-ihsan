'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DataTable from "@/components/CustomDataTable"
import CustomLoading from "@/components/CustomLoading"
import CustomMultiSelect from "@/components/CustomMultiSelect"
import FileUploadComponent from "@/components/FileUpload"
import Modal, { modal } from "@/components/Modal"
import { api_delete, api_get, api_post, api_post_form, api_put, api_url } from "@/libs/api_handler"
import { client_api_post, client_api_post_form } from "@/libs/client_api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { input_handler } from "@/libs/input_handler"
import { Add, Category, CategoryOutlined, Close, Delete, DeleteForever, Edit, HomeOutlined, LocalDrink, LocalDrinkOutlined, Save } from "@mui/icons-material"
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

const initialState = {
    form: {
        tambah: {
            nama: '',
            deskripsi: '',
            stok: 0,
            satuan: '',
            harga_per_satuan: 0,
            loading: false,
            error: null,
            kategori: []
        },
        edit: {
            id: '',
            nama: '',
            deskripsi: '',
            satuan: '',
            harga_per_satuan: 0,
            loading: false,
            error: null
        }
    }
}

export default function DashboardProdukPage() {
    
    const [listData, setListData] = useState({
        produk: {
            status: '',
            data: [],
            select: [],
            loading: {
                delete: false,
                upload: false
            }
        },
        kategori: {
            status: '',
            data: []
        }
    })

    const [formData, setFormData] = useState({
        tambah: {
            nama: '',
            deskripsi: '',
            stok: 0,
            satuan: '',
            harga_per_satuan: 0,
            loading: false,
            error: null,
            kategori: []
        },
        edit: {
            id: '',
            nama: '',
            deskripsi: '',
            satuan: '',
            harga_per_satuan: 0,
            loading: false,
            error: null,
            kategori: []
        },
        foto: {
            id: '',
            id_foto: '',
            url: '',
            loading: false,
            error: null
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
                    if(response.success) {
                        setListData(state => ({
                            ...state,
                            kategori: {
                                ...state.kategori,
                                data: response?.data
                            }
                        }))
                    }else{
                        customToast.error({
                            message: response?.message
                        })
                        setListData(state => ({
                            ...state,
                            kategori: {
                                ...state.kategori,
                                data: []
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        kategori: {
                            ...state.kategori,
                            status: 'fetched',
                            data: []
                        }
                    }))
                    customToast.error({
                        message: error?.message
                    })
                }
            }
        },
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
            },
            select: (value) => {
                setListData(state => ({
                    ...state,
                    produk: {
                        ...state.produk,
                        select: value
                    }
                }))
            },
            delete: async (id) => {
                try {
                    aksi.produk.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/produk`,
                        payload: {
                            id: id ? id : listData.produk.select
                        }
                    })

                    aksi.produk.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus produk tersebut`
                        })
                        aksi.produk.select([])
                        await aksi.produk.get()
                    }
                } catch (error) {
                    aksi.produk.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            toggleLoading: {
                delete: () => {
                    setListData(state => ({
                        ...state,
                        produk: {
                            ...state.produk,
                            loading: {
                                delete: !state.produk.loading.delete
                            }
                        }
                    }))
                },
                upload: () => {
                    setListData(state => ({
                        ...state,
                        produk: {
                            ...state.produk,
                            loading: {
                                upload: !state.produk.loading.upload
                            }
                        }
                    }))
                }
            },
            deleteForever: async (id) => {
                try {
                    aksi.produk.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/produk?isForever=true`,
                        payload: {
                            id: id ? id : listData.produk.select
                        }
                    })

                    aksi.produk.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus produk tersebut`
                        })
                        await aksi.produk.get()
                    }
                } catch (error) {
                    aksi.produk.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            foto: {
                upload: async (e, id) => {
                    try {
                        const file = e.target.files[0]
                        if(!file) {
                            e.target.value = ''
                            return
                        }
                        e.target.value = ''

                        aksi.produk.toggleLoading.upload()

                        const payload = {
                            foto: file,
                            id_produk: id
                        }

                        const response = await client_api_post_form({
                            url: '/api/admin/data/foto/produk',
                            payload
                        })

                        console.log(response)

                        aksi.produk.toggleLoading.upload()

                        if(response.success) {
                            customToast.success({
                                message: "Berhasil mengunggah foto produk tersebut"
                            })
                            await aksi.produk.get()
                        }else{
                            customToast.error({
                                message: response?.message
                            })
                        }
                    } catch (error) {
                        aksi.produk.toggleLoading.upload()
                        customToast.error({
                            message: error?.message
                        })
                    }
                },
                delete: async ( modalId) => {
                    try {
                        aksi.form.foto.error(null)
                        aksi.produk.toggleLoading.upload()
                        
                        const response = await api_delete({
                            url: '/api/admin/data/foto/produk',
                            payload: {
                                id: formData.foto.id_foto
                            }
                        })

                        aksi.produk.toggleLoading.upload()

                        if(response.success) {
                            if(modalId) {
                                modal.close(modalId)
                            }

                            customToast.success({
                                message: 'Berhasil menghapus foto produk tersebut'
                            })

                            await aksi.produk.get()
                        }else{
                            aksi.form.foto.error(response.message)
                        }
                        
                    } catch (error) {
                        aksi.produk.toggleLoading.upload()
                        aksi.form.foto.error(error.message)
                    }
                },
                change: async (e, modalId) => {
                    try {
                        
                        const file = e.target.files[0]
                        if(!file) {
                            e.target.value = ''
                            return
                        }
                        e.target.value = ''

                        aksi.produk.toggleLoading.upload()

                        const payload = {
                            foto: file,
                            id_produk: id
                        }

                        aksi.form.foto.error(null)

                        const response = await client_api_post_form({
                            url: '/api/admin/data/foto/produk',
                            payload
                        })

                        aksi.produk.toggleLoading.upload()

                        if(response.success) {
                            if(modalId) {
                                modal.close(modalId)
                            }
                            customToast.success({
                                message: "Berhasil mengunggah foto produk tersebut"
                            })
                            await aksi.produk.get()
                        }else{
                            aksi.form.foto.error(response.message)
                        }
                    } catch (error) {
                        aksi.produk.toggleLoading.upload()
                        aksi.form.foto.error(error.message)
                    }
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
                            url: `/api/admin/data/produk`,
                            payload: {
                                payload,
                                kategori: payload.kategori.map(v => v['id'])
                            }
                        })

                        if(!response.success) {
                            aksi.form.tambah.error(response.message)
                            aksi.form.tambah.toggleLoading()
                        }else{
                            aksi.form.tambah.error(null)
                            modal.close('tambah')
                            customToast.success({
                                message: `Berhasil menambahkan produk baru`
                            })
                            await aksi.produk.get()
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
                            url: `/api/admin/data/produk`,
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
                                message: `Berhasil mengubah produk`
                            })
                            await aksi.produk.get()
                            aksi.form.edit.toggleLoading()
                        }

                    } catch (error) {
                        aksi.form.edit.error(error.message)
                        aksi.form.edit.toggleLoading()
                    }
                }
            },
            foto: {
                init: (payload) => {
                    Object.keys(payload).map(column => {
                        aksi.form.foto.set(column, payload[column] || '')
                    })

                    modal.show('preview')
                },
                set: (col, val) => {
                    setFormData(state => ({
                        ...state,
                        foto: {
                            ...state.foto,
                            [col]: val
                        }
                    }))
                },
                error: (message) => {
                    setFormData(state => ({
                        ...state,
                        foto: {
                            ...state.foto,
                            error: message
                        }
                    }))
                }
            }
        },
        
    }

    useEffect(() => {
        aksi.produk.get()
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
                        label: 'Produk',
                        icon: LocalDrinkOutlined
                    }
                ]}
            />
            <hr className="my-2 opacity-0" />
            <h1 className="text-4xl">
                Produk
            </h1>
            <p className="opacity-70">
                Masterisasi data produk yang ada di aplikasi ini
            </p>
            <hr className="my-3 opacity-0" />

            <Modal modalId="tambah" title="Tambah Produk">
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
                        label="Nama Produk"
                        size="small"
                        onChange={e => aksi.form.tambah.set('nama', e.target.value)}
                        value={formData.tambah.nama}
                    />
                    <TextField 
                        fullWidth
                        disabled={formData.tambah.loading}
                        label="Deskripsi Produk"
                        size="small"
                        onChange={e => aksi.form.tambah.set('deskripsi', e.target.value)}
                        value={formData.tambah.deskripsi}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <TextField 
                            fullWidth
                            disabled={formData.tambah.loading}
                            label="Satuan Produk"
                            required
                            size="small"
                            type="text"
                            onChange={e => aksi.form.tambah.set('satuan', e.target.value)}
                            value={formData.tambah.satuan}
                        />
                        <TextField 
                            fullWidth
                            disabled={formData.tambah.loading}
                            label="Harga Produk per Satuan"
                            required
                            size="small"
                            type="number"
                            onChange={e => aksi.form.tambah.set('harga_per_satuan', input_handler.float_only(e.target.value, { min: 0, max: 99999999 }))}
                            value={formData.tambah.harga_per_satuan}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            Rp
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        <div className="col-span-2">
                            <CustomLoading loading={listData.kategori.status === 'fetched'}>
                                <CustomMultiSelect 
                                    options={listData.kategori.data}
                                    onModal="tambah"
                                    label="Cari dan Pilih Kategori Produk"
                                    optionLabel="nama"
                                    value={formData.tambah.kategori}
                                    onChange={(e, value) => aksi.form.tambah.set('kategori', value)}
                                />
                            </CustomLoading>
                        </div>

                    </div>
                    <Button type="submit" disabled={formData.tambah.loading} variant="contained" fullWidth startIcon={formData.tambah.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.tambah.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <Modal modalId="edit" title="Edit Produk">
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
                        label="Nama Produk"
                        size="small"
                        onChange={e => aksi.form.edit.set('nama', e.target.value)}
                        value={formData.edit.nama}
                    />

                    <TextField 
                        fullWidth
                        disabled={formData.edit.loading}
                        label="Deskripsi Produk"
                        size="small"
                        onChange={e => aksi.form.edit.set('deskripsi', e.target.value)}
                        value={formData.edit.deskripsi}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <TextField 
                            fullWidth
                            disabled={formData.edit.loading}
                            label="Satuan Produk"
                            required
                            size="small"
                            type="text"
                            onChange={e => aksi.form.edit.set('satuan', e.target.value)}
                            value={formData.edit.satuan}
                        />
                        <TextField 
                            fullWidth
                            disabled={formData.edit.loading}
                            label="Harga Produk per Satuan"
                            required
                            size="small"
                            type="number"
                            onChange={e => aksi.form.edit.set('harga_per_satuan', input_handler.float_only(e.target.value, { min: 0, max: 99999999 }))}
                            value={formData.edit.harga_per_satuan}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            Rp
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                    </div>
                    
                    <Button type="submit" disabled={formData.edit.loading} variant="contained" fullWidth startIcon={formData.edit.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.edit.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <Modal modalId="preview" title="Foto Produk" modalBoxClassname="">
                <div className="">
                    {formData.foto.url && (
                        <img src={formData.foto.url} alt="Foto Produk" className="aspect-square object-cover object-center w-full" />
                    )}
                </div>
                <div className="col-span-4 flex flex-col justify-center items-center gap-2">
                    <FileUploadComponent loading={listData.produk.loading.upload} onChange={(e) => aksi.produk.foto.change(e, 'preview')} variant="contained" fullWidth text="Ganti Foto" />
                    <Button fullWidth disabled={listData.produk.loading.upload} onClick={() => aksi.produk.foto.delete('preview')} color="error">
                        {formData.foto.loading ? 'Loading' : 'Hapus Foto'}
                    </Button>
                </div>
            </Modal>

            <div className="flex justify-between items-center">
                <Button onClick={() => aksi.form.tambah.init()} variant="contained" startIcon={<Add />}>
                    <p className={`text-sm font-medium ${poppins.className}`}>
                        Tambah
                    </p>
                </Button>
                
                {listData.produk.select.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => aksi.produk.delete()} variant="text" startIcon={<Delete />}>
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
                    value: listData.produk.select,
                    onChange: (newRowSelectionModel) => aksi.produk.select(newRowSelectionModel)
                }}
                loading={listData.produk.status === 'loading' ||  listData.produk.loading.delete}
                isRowSelectable={(params) => params.row.deleted_at === null}
                rows={listData?.produk?.data}
                columns={[
                    {
                        field: 'id',
                        headerName: 'ID'
                    },
                    {
                        field: 'Foto_Produk',
                        headerName: 'Foto Produk',
                        sortable: false,
                        renderCell: ({ row }) => (
                            <div className="flex items-center justify-center h-full">
                                {row.Foto_Produk
                                    ? <button type="button" onClick={() => aksi.form.foto.init({ id_foto: row.fk_foto_produk, id: row.id, url: row.Foto_Produk.url })}>
                                        <img src={`${row.Foto_Produk.url}`} alt="Foto Produk" />
                                    </button>
                                    : <FileUploadComponent text="" loading={listData.produk.loading.upload} onChange={(e) => aksi.produk.foto.upload(e, row.id)} />
                                }
                            </div>
                        )
                    },
                    {
                        field: 'nama',
                        headerName: 'Nama'
                    },
                    {
                        field: 'deskripsi',
                        headerName: 'Deskripsi'
                    },
                    {
                        field: 'stok',
                        headerName: 'Stok'
                    },
                    {
                        field: 'deleted_at',
                        headerName: 'Tanggal dihapus'
                    },
                    {
                        field: 'harga',
                        headerName: 'Harga / Satuan',
                        valueGetter: (value, row) => `Rp ${row.harga_per_satuan} / ${row.satuan}`
                    },
                    { 
                        field: 'harga1',
                        headerName: 'Kategori',
                        valueGetter: (value, row) => Array.isArray(row['Kategori_Produks']) && row['Kategori_Produks'].map(v => v['Kategori']['nama']).join(', ')
                    },
                    {
                        field: 'name1',
                        headerName: '',
                        sortable: false,
                        renderCell: ({ row }) => {
                            return (
                                <div className="flex items-center justify-center h-full">
                                    {row.deleted_at 
                                        ? (
                                            <IconButton onClick={() => aksi.produk.deleteForever(row.id)} size="small" color="primary">
                                                <DeleteForever fontSize="small" />
                                            </IconButton>
                                        )
                                        : (
                                            <>
                                                <IconButton 
                                                    onClick={() => aksi.form.edit.init( 
                                                        {
                                                            id: row.id,
                                                            nama: row.nama,
                                                            deskripsi: row.deskripsi,
                                                            satuan: row.satuan,
                                                            harga_per_satuan: row.harga_per_satuan
                                                        }
                                                    )} 
                                                    size="small" color="primary">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => aksi.produk.delete(row.id)} size="small" color="primary">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </>
                                        )
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