'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DataTable from "@/components/CustomDataTable"
import CustomDatePicker from "@/components/CustomDatePicker"
import Modal, { modal } from "@/components/Modal"
import { api_delete, api_get, api_post, api_put } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { input_handler } from "@/libs/input_handler"
import { Add, Category, CategoryOutlined, Delete, Edit, HomeOutlined, Save, WorkspacePremiumOutlined } from "@mui/icons-material"
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import 'dayjs/locale/id'
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"

const initialState = {
    form: {
        tambah: {
            nama: '',
            code: '',
            deskripsi: '',
            diskon: 1,
            mulai: '',
            selesai: '',
            loading: false,
            error: null
        },
        edit: {
            id: '',
            nama: '',
            code: '',
            deskripsi: '',
            diskon: 1,
            mulai: '',
            selesai: '',
            loading: false,
            error: null
        }
    }
}

export default function DashboardKuponPage() {

    const [listData, setListData] = useState({
        kupon: {
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
            code: '',
            deskripsi: '',
            diskon: 1,
            mulai: '',
            selesai: '',
        },
        edit: {
            id: '',
            nama: '',
            code: '',
            deskripsi: '',
            diskon: 1,
            mulai: '',
            selesai: '',
        }
    })

    const aksi = {
        kupon: {
            get: async () => {
                try {
                    setListData(state => ({
                        ...state,
                        kupon: {
                            ...state.kupon,
                            status: 'loading'
                        }
                    }))

                    const response = await api_get({
                        url: '/api/admin/data/kupon'
                    })

                    setListData(state => ({
                        ...state,
                        kupon: {
                            ...state.kupon,
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
                            kupon: {
                                ...state.kupon,
                                data: response?.data
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        kupon: {
                            ...state.kupon,
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
                    kupon: {
                        ...state.kupon,
                        select: value
                    }
                }))
            },
            delete: async (id) => {
                try {
                    aksi.kupon.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/kupon`,
                        payload: {
                            id: id ? id : listData.kupon.select
                        }
                    })

                    aksi.kupon.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus kupon tersebut`
                        })
                        await aksi.kupon.get()
                    }
                } catch (error) {
                    aksi.kupon.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            toggleLoading: {
                delete: () => {
                    setListData(state => ({
                        ...state,
                        kupon: {
                            ...state.kupon,
                            loading: {
                                delete: !state.kupon.loading.delete
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

                        if(payload['mulai'] === '' || payload['selesai'] === '') {
                            aksi.form.tambah.toggleLoading()
                            return aksi.form.tambah.error('Anda harus memilih tanggal terlebih dahulu')
                        }

                        const response = await api_post({
                            url: `/api/admin/data/kupon`,
                            payload: {
                                ...payload,
                                mulai: dayjs(payload['mulai']).toISOString(),
                                selesai: dayjs(payload['selesai']).toISOString(),
                                code: payload['code'] !== '' ? payload['code'] : nanoid(8)
                            }
                        })

                        if(!response.success) {
                            aksi.form.tambah.error(response.message)
                            aksi.form.tambah.toggleLoading()
                        }else{
                            aksi.form.tambah.error(null)
                            modal.close('tambah')
                            customToast.success({
                                message: `Berhasil menambahkan kupon baru`
                            })
                            await aksi.kupon.get()
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
                            url: `/api/admin/data/kupon`,
                            payload: {
                                id,
                                payload: {
                                    ...payload,
                                    mulai: dayjs(payload['mulai']).toISOString(),
                                    selesai: dayjs(payload['selesai']).toISOString(),
                                    code: payload['code'] !== '' ? payload['code'] : nanoid(8)
                                }
                            }
                        })

                        if(!response.success) {
                            aksi.form.edit.error(response.message)
                            aksi.form.edit.toggleLoading()
                        }else{
                            aksi.form.edit.error(null)
                            modal.close('edit')
                            customToast.success({
                                message: `Berhasil mengubah kupon`
                            })
                            await aksi.kupon.get()
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
        aksi.kupon.get()
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
                        label: 'Kupon',
                        icon: WorkspacePremiumOutlined
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

            <Modal modalId="tambah" title="Tambah Kupon">
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
                        label="Nama Diskon"
                        size="small"
                        onChange={e => aksi.form.tambah.set('nama', e.target.value)}
                        value={formData.tambah.nama}
                    />
                    <TextField 
                        fullWidth
                        disabled={formData.tambah.loading}
                        label="Deskripsi"
                        size="small"
                        onChange={e => aksi.form.tambah.set('deskripsi', e.target.value)}
                        value={formData.tambah.deskripsi}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <TextField 
                            fullWidth
                            required
                            disabled={formData.tambah.loading}
                            label="Diskon"
                            size="small"
                            onChange={e => aksi.form.tambah.set('diskon', input_handler.float_only(e.target.value, { min: 0, max: 100 }))}
                            value={formData.tambah.diskon}
                            type="number"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            %
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                        <TextField 
                            fullWidth
                            disabled={formData.tambah.loading}
                            label="Kode Kupon"
                            size="small"
                            onChange={e => aksi.form.tambah.set('code', e.target.value)}
                            value={formData.tambah.code}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <CustomDatePicker 
                            label="Periode Awal"
                            format="DD / MM / YYYY"
                            onModal="tambah"
                            onChange={newValue => aksi.form.tambah.set('mulai', newValue)}
                            value={formData.tambah.mulai}
                        />
                        <CustomDatePicker 
                            label="Periode Akhir"
                            format="DD / MM / YYYY"
                            onModal="tambah"
                            onChange={newValue => aksi.form.tambah.set('selesai', newValue)}
                            value={formData.tambah.selesai}
                        />
                    </div>
                    
                    <Button type="submit" disabled={formData.tambah.loading} variant="contained" fullWidth startIcon={formData.tambah.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.tambah.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <Modal modalId="edit" title="Edit Kupon">
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
                        label="Nama Diskon"
                        size="small"
                        onChange={e => aksi.form.edit.set('nama', e.target.value)}
                        value={formData.edit.nama}
                    />
                    <TextField 
                        fullWidth
                        disabled={formData.edit.loading}
                        label="Deskripsi"
                        size="small"
                        onChange={e => aksi.form.edit.set('deskripsi', e.target.value)}
                        value={formData.edit.deskripsi}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <TextField 
                            fullWidth
                            required
                            disabled={formData.edit.loading}
                            label="Diskon"
                            size="small"
                            onChange={e => aksi.form.edit.set('diskon', input_handler.float_only(e.target.value, { min: 0, max: 100 }))}
                            value={formData.edit.diskon}
                            type="number"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            %
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                        <TextField 
                            fullWidth
                            disabled={formData.edit.loading}
                            label="Kode Kupon"
                            size="small"
                            onChange={e => aksi.form.edit.set('code', e.target.value)}
                            value={formData.edit.code}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <CustomDatePicker 
                            label="Periode Awal"
                            format="DD / MM / YYYY"
                            onModal="edit"
                            onChange={newValue => aksi.form.edit.set('mulai', newValue)}
                            value={formData.edit.mulai}
                        />
                        <CustomDatePicker 
                            label="Periode Akhir"
                            format="DD / MM / YYYY"
                            onModal="edit"
                            onChange={newValue => aksi.form.edit.set('selesai', newValue)}
                            value={formData.edit.selesai}
                        />
                    </div>
                    
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
                
                {listData.kupon.select.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => aksi.kupon.delete()} variant="text" startIcon={<Delete />}>
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
                    value: listData.kupon.select,
                    onChange: (newRowSelectionModel) => aksi.kupon.select(newRowSelectionModel)
                }}
                loading={listData.kupon.status === 'loading' ||  listData.kupon.loading.delete}
                isRowSelectable={(params) => true}
                rows={listData?.kupon?.data}
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
                        field: 'code',
                        headerName: 'Kode'
                    },
                    {
                        field: 'diskon',
                        headerName: 'Diskon',
                        valueGetter: (value, row) => `${row.diskon}%`
                    },
                    {
                        field: 'mulai',
                        headerName: 'Mulai',
                        valueGetter: (value, row) => dayjs(row.mulai).locale('id').format('dddd, DD MMMM YYYY')
                    },
                    {
                        field: 'selesai',
                        headerName: 'Selesai',
                        valueGetter: (value, row) => dayjs(row.selesai).locale('id').format('dddd, DD MMMM YYYY')
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
                                                deskripsi: row.deskripsi,
                                                code: row.code,
                                                diskon: row.diskon,
                                                mulai: row.mulai,
                                                selesai: row.selesai,
                                            }
                                        )} 
                                        size="small" color="primary">
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => aksi.kupon.delete(row.id)} size="small" color="primary">
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