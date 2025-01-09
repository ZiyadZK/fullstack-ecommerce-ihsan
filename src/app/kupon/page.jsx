'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb"
import MainLayout from "@/components/MainLayout"
import { HomeOutlined, WorkspacePremiumOutlined } from "@mui/icons-material"

export default function KuponPage() {
    return (
        <MainLayout>
            <div className="p-5">
                <CustomBreadcrumb 
                    items={[
                        {
                            label: 'Home',
                            icon: HomeOutlined
                        },
                        {
                            label: 'Kupon',
                            icon: WorkspacePremiumOutlined
                        }
                    ]}
                />
                <hr className="my-5 opacity-0" />
                <div className="flex justify-center">
                    <div className="w-5/6 grid grid-cols-2 gap-5">
                        <div className="border p-5 rounded-lg shadow space-y-5">
                            <div className="p-2 border rounded-md">
                                <p className="text-6xl text-center text-blue-500 tracking-tighter">
                                    ABC123ASDC
                                </p>
                            </div>
                            <h1 className="text-lg tracking-tighter font-medium">
                                Kupon Tahun Baru
                            </h1>
                            <p className="text-sm tracking-tighter">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus quibusdam corporis perferendis nesciunt, laudantium tenetur quisquam natus cum ipsam ab quidem accusamus commodi, quasi ad corrupti ratione cupiditate quod repellendus.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm opacity-50 font-normal">
                                        Periode
                                    </p>
                                    <p className="text-sm">
                                        50 Januari 2024 - 1 Januari 2025
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm opacity-50 font-normal">
                                        Diskon
                                    </p>
                                    <p className="text-sm">
                                        50%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}