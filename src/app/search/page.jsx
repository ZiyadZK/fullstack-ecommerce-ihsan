    'use client'

    import CustomBreadcrumb from "@/components/CustomBreadcrumb";
    import MainLayout from "@/components/MainLayout";
    import { Apps, ChevronRight, HomeOutlined, House, Search } from "@mui/icons-material";
    import Image from "next/image";
    import { useState } from "react";

    export default function SearchPage() {

    const [listData, setListData] = useState({
        products: {
        status: '',
        data: []
        }
    })

    const aksi = {
        products: {
        get_all: async () => {
            try {
            
            } catch (error) {
            
            }
        }
        }
    }

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
                        label: 'Cari Produk',
                        icon: Search
                    },
                    {
                        label: '"Coca Cola"'
                    }
                ]}
                />
                
                {/* Best Seller */}
                <hr className="my-5 opacity-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    <div className="space-y-5 border border-zinc-300/0 hover:border-zinc-300 ease-out duration-100 hover:shadow-lg rounded-xl p-5 cursor-pointer">
                        <img src={`https://assets.klikindomaret.com/products/20065778/20065778_3.webp`} className="w-full aspect-square rounded-xl object-cover object-center" alt="Foto Produk" />
                        <div className="flex items-center justify-between">
                        <div className="font-medium text-2xl">
                            Coca Cola
                        </div>
                        <div className="font-medium">
                            Rp 10.000 <span className="opacity-70">/ botol</span>
                        </div>
                        </div>
                    </div>

                </div>

                

            </div>
        </MainLayout>
    );
}
