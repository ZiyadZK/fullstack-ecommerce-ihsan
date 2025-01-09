'use client'

import AdminMainLayout from "@/components/AdminMainLayout"
import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import { Category, CategoryOutlined, Home, HomeOutlined, InventoryOutlined, LocalBarOutlined, ReceiptLongOutlined } from "@mui/icons-material"

export default function DashboardPage() {
    return (
        <AdminMainLayout>
            <CustomBreadcrumb 
                items={[
                    {
                        label: 'Dashboard',
                        icon: HomeOutlined
                    }
                ]}
            />
            <hr className="my-2 opacity-0" />
            <h1 className="text-4xl">
                Dashboard
            </h1>
            <p className="opacity-70">
                Rekapan semua data yang ada di aplikasi
            </p>
            <hr className="my-5 opacity-0" />
            <div className="grid grid-cols-4 gap-5">
                <div className="p-5 border shadow-md rounded-xl border-zinc-300 flex items-center gap-3">
                    <div className="w-16 h-16 border rounded-lg flex items-center justify-center border-zinc-300">
                        <CategoryOutlined fontSize="large" />
                    </div>
                    <div className="">
                        <p className="opacity-50">
                            Kategori
                        </p>
                        <p className="text-xl font-medium">
                            1220
                        </p>
                    </div>
                </div>
                <div className="p-5 border shadow-md rounded-xl border-zinc-300 flex items-center gap-3">
                    <div className="w-16 h-16 border rounded-lg flex items-center justify-center border-zinc-300">
                        <LocalBarOutlined fontSize="large" />
                    </div>
                    <div className="">
                        <p className="opacity-50">
                            Produk
                        </p>
                        <p className="text-xl font-medium">
                            1220
                        </p>
                    </div>
                </div>
                <div className="p-5 border shadow-md rounded-xl border-zinc-300 flex items-center gap-3">
                    <div className="w-16 h-16 border rounded-lg flex items-center justify-center border-zinc-300">
                        <ReceiptLongOutlined fontSize="large" />
                    </div>
                    <div className="">
                        <p className="opacity-50">
                            Transaksi
                        </p>
                        <p className="text-xl font-medium">
                            1220
                        </p>
                    </div>
                </div>
                <div className="p-5 border shadow-md rounded-xl border-zinc-300 flex items-center gap-3">
                    <div className="w-16 h-16 border rounded-lg flex items-center justify-center border-zinc-300">
                        <InventoryOutlined fontSize="large" />
                    </div>
                    <div className="">
                        <p className="opacity-50">
                            Supplier
                        </p>
                        <p className="text-xl font-medium">
                            1220
                        </p>
                    </div>
                </div>
            </div>
        </AdminMainLayout>
    )
}