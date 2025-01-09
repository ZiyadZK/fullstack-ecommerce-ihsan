'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import DataTable from "@/components/CustomDataTable"
import { CustomTabItem, CustomTabs } from "@/components/CustomTabs"
import DropdownMenu from "@/components/DropdownMenu"
import Modal, { modal } from "@/components/Modal"
import { api_delete, api_get, api_post, api_put } from "@/libs/api_handler"
import { customToast } from "@/libs/customToast"
import { poppins } from "@/libs/fonts"
import { UserContext } from "@/provider/userProvider"
import { Add, Delete, DeleteForever, Edit, HomeOutlined, Info, Key, MoreHoriz, Person, Save } from "@mui/icons-material"
import { Avatar, Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material"
import { useContext, useEffect, useState } from "react"

export default function DashboardAkunPage() {

    const [listData, setListData] = useState({
        user: {
            status: '',
            data: [],
            select: [],
            loading: {
                delete: false
            }
        }
    })

    const [modalList, showModalList] = useState({
        info: {

        },
        edit: {

        }
    })

    const [formData, setFormData] = useState({
        tambah: {
            nama: '',
            username: '',
            password: '',
            loading: false,
            error: null,
            role: ''
        },
        edit: {
            id: '',
            nama: '',
            role: '',
            username: '',
            password: '',
            loading: false,
            error: null
        }
    })

    const aksi = {
        user: {
            get: async () => {
                try {
                    setListData(state => ({
                        ...state,
                        user: {
                            ...state.user,
                            status: 'loading'
                        }
                    }))

                    const response = await api_get({
                        url: '/api/admin/data/user'
                    })

                    console.log(response)

                    setListData(state => ({
                        ...state,
                        user: {
                            ...state.user,
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
                            user: {
                                ...state.user,
                                data: response?.data
                            }
                        }))
                    }
                } catch (error) {
                    setListData(state => ({
                        ...state,
                        user: {
                            ...state.user,
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
                    user: {
                        ...state.user,
                        select: value
                    }
                }))
            },
            delete: async (id, role) => {
                try {
                    aksi.user.toggleLoading.delete()

                    const selected_id = listData.user.select.map(v => v['id'])

                    const response = await api_delete({
                        url: `/api/admin/data/user`,
                        payload: {
                            id: id ? id : selected_id
                        }
                    })

                    aksi.user.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus akun tersebut`
                        })
                        await aksi.user.get()
                    }
                } catch (error) {
                    aksi.user.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            toggleLoading: {
                delete: () => {
                    setListData(state => ({
                        ...state,
                        user: {
                            ...state.user,
                            loading: {
                                delete: !state.user.loading.delete
                            }
                        }
                    }))
                }
            },
            deleteForever: async (id) => {
                try {
                    aksi.user.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/user?isForever=true`,
                        payload: {
                            id
                        }
                    })

                    aksi.user.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus akun tersebut secara permanen`
                        })
                        await aksi.user.get()
                    }
                } catch (error) {
                    aksi.user.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            },
            deleteAll: async () => {
                try {
                    aksi.user.toggleLoading.delete()

                    const response = await api_delete({
                        url: `/api/admin/data/user`,
                        payload: {
                            id: listData.user.select
                        }
                    })

                    aksi.user.toggleLoading.delete()

                    if(!response.success) {
                        customToast.error({
                            message: response.message
                        })
                    }else{
                        customToast.success({
                            message: `Berhasil menghapus akun akun tersebut`
                        })
                        aksi.user.select([])
                        await aksi.user.get()
                    }
                } catch (error) {
                    aksi.user.toggleLoading.delete()
                    customToast.error({
                        message: error?.message
                    })
                }
            }
        },
        form: {
            tambah: {
                init: (role) => {
                    aksi.form.tambah.set('role', role)

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
                        tambah: {
                            nama: '',
                            username: '',
                            password: '',
                            loading: false,
                            role: ''
                        }
                    }))
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.form.tambah.error(null)
                        aksi.form.tambah.toggleLoading()

                        const { error, loading, ...payload } = formData.tambah

                        const response = await api_post({
                            url: `/api/admin/data/user`,
                            payload
                        })

                        if(!response.success) {
                            aksi.form.tambah.error(response.message)
                            aksi.form.tambah.toggleLoading()
                        }else{
                            aksi.form.tambah.error(null)
                            modal.close('tambah')
                            customToast.success({
                                message: `Berhasil menambahkan akun baru`
                            })
                            await aksi.user.get()
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
                init: (role, payload) => {
                    Object.keys(payload).map(column => {
                        aksi.form.edit.set(column, payload[column] || '')
                    })
                    aksi.form.edit.set('role', role)

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
                        edit: {
                            id: '',
                            nama: '',
                            role: '',
                            username: '',
                            password: '',
                            loading: false,
                            error: null
                        }
                    }))
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.form.edit.error(null)
                        aksi.form.edit.toggleLoading()

                        const { error, loading, id, ...payload } = formData.edit

                        const response = await api_put({
                            url: `/api/admin/data/user`,
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
                                message: `Berhasil mengubah akun`
                            })
                            await aksi.user.get()
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
        aksi.user.get()
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
                        label: 'Akun',
                        icon: Person
                    }
                ]}
            />
            <hr className="my-2 opacity-0" />
            <h1 className="text-4xl">
                Akun
            </h1>
            <p className="opacity-70">
                Masterisasi data akun yang ada di aplikasi ini
            </p>
            <hr className="my-3 opacity-0" />

            <Modal modalId="tambah" title="Tambah Akun">
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
                        disabled={formData.tambah.loading}
                        label="Nama Lengkap"
                        size="small"
                        helperText="* Anda bisa mengosongkan kolom ini"
                        onChange={e => aksi.form.tambah.set('nama', e.target.value)}
                        value={formData.tambah.nama}
                    />
                    <TextField 
                        fullWidth
                        disabled={formData.tambah.loading}
                        label="Username"
                        size="small"
                        required
                        onChange={e => aksi.form.tambah.set('username', e.target.value)}
                        value={formData.tambah.username}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person fontSize="small" color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    <TextField 
                        fullWidth
                        disabled={formData.tambah.loading }
                        label="Password"
                        size="small"
                        required
                        onChange={e => aksi.form.tambah.set('password', e.target.value)}
                        value={formData.tambah.password}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Key fontSize="small" color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    <Button type="submit" disabled={formData.tambah.loading} variant="contained" fullWidth startIcon={formData.tambah.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.tambah.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <Modal modalId="edit" title="Edit Akun">
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
                        disabled={formData.edit.loading}
                        label="Nama Lengkap"
                        size="small"
                        helperText="* Anda bisa mengosongkan kolom ini"
                        onChange={e => aksi.form.edit.set('nama', e.target.value)}
                        value={formData.edit.nama}
                    />
                    <TextField 
                        fullWidth
                        disabled={formData.edit.loading}
                        label="Username"
                        size="small"
                        required
                        onChange={e => aksi.form.edit.set('username', e.target.value)}
                        value={formData.edit.username}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person fontSize="small" color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    <TextField 
                        fullWidth
                        disabled={formData.edit.loading}
                        label="Password"
                        size="small"
                        required
                        onChange={e => aksi.form.edit.set('password', e.target.value)}
                        value={formData.edit.password}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Key fontSize="small" color="primary" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    <Button type="submit" disabled={formData.edit.loading} variant="contained" fullWidth startIcon={formData.edit.loading ? <CircularProgress size={20} className="grayscale" /> : <Save />}>
                        <p className={`text-sm font-medium ${poppins.className}`}>
                            {formData.edit.loading ? 'Loading': 'Simpan'}
                        </p>
                    </Button>
                </form>

            </Modal>

            <CustomTabs>
                <CustomTabItem label={(
                    <div className={`${poppins.className} flex items-center justify-center gap-2`}>
                        <p className="font-normal">
                            User
                        </p>
                        {listData.user.status === 'loading'
                            ? <CircularProgress size={15} />
                            : <p className="text-xs font-normal">
                                {listData.user.data.filter(v => v['role'] === 'user').length}
                            </p>
                        }
                    </div>
                )}>
                    <hr className="my-2 opacity-0" />
                    <div className="flex justify-between items-center">
                        <Button onClick={() => aksi.form.tambah.init('user')} variant="contained" startIcon={<Add />}>
                            <p className={`text-sm font-medium ${poppins.className}`}>
                                Tambah
                            </p>
                        </Button>
                        
                        {listData.user.select.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Button onClick={() => aksi.user.deleteAll()} variant="text" startIcon={<Delete />}>
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
                            value: listData.user.select,
                            onChange: (newRowSelectionModel) => aksi.user.select(newRowSelectionModel)
                        }}
                        loading={listData.user.status === 'loading' ||  listData.user.loading.delete}
                        isRowSelectable={(params) => params.row.deleted_at === null}
                        rows={listData?.user?.data?.filter(v => v['role'] === 'user')}
                        columns={[
                            {
                                field: 'id',
                                headerName: 'ID'
                            },
                            {
                                field: 'foto_profil',
                                headerName: 'Foto Profil',
                                sortable: false,
                                renderCell: ({ row: { foto_profil } }) => (
                                    <div className="flex items-center justify-center h-full">
                                        <Avatar src={foto_profil} />
                                    </div>
                                )                                
                            },
                            {
                                field: 'nama',
                                headerName: 'Nama'
                            },
                            {
                                field: 'username',
                                headerName: 'Username'
                            },
                            {
                                field: 'password',
                                headerName: 'Password'
                            },
                            {
                                field: 'deleted_at',
                                headerName: 'Tanggal dihapus'
                            },
                            {
                                field: 'name1',
                                headerName: '',
                                sortable: false,
                                renderCell: ({ row }) => {
                                    return (
                                        <div className="flex items-center justify-center h-full">
                                            {row.deleted_at === null ? (
                                                <>
                                                    <IconButton 
                                                        onClick={() => aksi.form.edit.init('user', 
                                                            {
                                                                id: row.id,
                                                                nama: row.nama,
                                                                username: row.username,
                                                                password: row.password
                                                            }
                                                        )} 
                                                        size="small" color="primary">
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => aksi.user.delete(row.id, 'user')} size="small" color="primary">
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </>
                                            ): (
                                                <IconButton onClick={() => aksi.user.deleteForever(row.id)} size="small" color="primary">
                                                    <DeleteForever fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>
                                    )
                                }
                            }
                        ]}
                    />
                </CustomTabItem>
                <CustomTabItem label={(
                    <div className={`${poppins.className} flex items-center justify-center gap-2`}>
                        <p className="font-normal">
                            Admin
                        </p>
                        {listData.user.status === 'loading'
                            ? <CircularProgress size={15} />
                            : <p className="text-xs font-normal">
                                {listData.user.data.filter(v => v['role'] === 'admin').length}
                            </p>
                        }
                    </div>
                )}>
                    <hr className="my-2 opacity-0" />
                    <div className="flex justify-between items-center">
                        <Button onClick={() => aksi.form.tambah.init('admin')} variant="contained" startIcon={<Add />}>
                            <p className={`text-sm font-medium ${poppins.className}`}>
                                Tambah
                            </p>
                        </Button>
                        
                        {listData.user.select.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Button onClick={() => aksi.user.deleteAll()} variant="text" startIcon={<Delete />}>
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
                            value: listData.user.select,
                            onChange: (newRowSelectionModel) => aksi.user.select(newRowSelectionModel)
                        }}
                        loading={listData.user.status === 'loading' ||  listData.user.loading.delete}
                        isRowSelectable={(params) => params.row.deleted_at === null}
                        rows={listData?.user?.data?.filter(v => v['role'] === 'admin')}
                        columns={[
                            {
                                field: 'id',
                                headerName: 'ID'
                            },
                            {
                                field: 'foto_profil',
                                headerName: 'Foto Profil',
                                sortable: false,
                                renderCell: ({ row: { foto_profil } }) => (
                                    <div className="flex items-center justify-center h-full">
                                        <Avatar src={foto_profil} />
                                    </div>
                                )                                
                            },
                            {
                                field: 'nama',
                                headerName: 'Nama'
                            },
                            {
                                field: 'username',
                                headerName: 'Username'
                            },
                            {
                                field: 'password',
                                headerName: 'Password'
                            },
                            {
                                field: 'deleted_at',
                                headerName: 'Tanggal dihapus'
                            },
                            {
                                field: 'name1',
                                headerName: '',
                                sortable: false,
                                renderCell: ({ row }) => {
                                    return (
                                        <div className="flex items-center justify-center h-full">
                                            {row.deleted_at === null ? (
                                                <>
                                                    <IconButton 
                                                        onClick={() => aksi.form.edit.init('admin', 
                                                            {
                                                                id: row.id,
                                                                nama: row.nama,
                                                                username: row.username,
                                                                password: row.password
                                                            }
                                                        )} 
                                                        size="small" color="primary">
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => aksi.user.delete(row.id, 'admin')} size="small" color="primary">
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </>
                                            ): (
                                                <IconButton onClick={() => aksi.user.deleteForever(row.id)} size="small" color="primary">
                                                    <DeleteForever fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>
                                    )
                                }
                            }
                        ]}
                    />
                </CustomTabItem>
            </CustomTabs>
        </AdminMainLayout>
    )
}