'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import MainLayout from "@/components/MainLayout";
import { Apps, ChevronRight, HomeOutlined, House } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const router = useRouter()

  const [listData, setListData] = useState({
    products: {
      status: '',
      data: []
    },
    best_seller: {
      status: '',
      data: []
    },
    new_products: {
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
            }
          ]}
        />
        
        {/* Best Seller */}
        <hr className="my-5 opacity-0" />
        <h1 className="text-6xl">
          Penjualan Terbaik
        </h1>
        <hr className="my-3 opacity-0" />
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

        {/* Produk Terbaru */}
        <hr className="my-5 opacity-0" />
        <h1 className="text-6xl">
          Produk Terbaru
        </h1>
        <hr className="my-3 opacity-0" />
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

        <hr className="my-3 opacity-0" />

        <div className="flex justify-center items-center">
          <button onClick={() => router.push('/search')} type="button" className="border-2 border-zinc-700 w-fit px-5 py-2 rounded-full hover:bg-zinc-700 hover:text-white ease-out duration-100 active:bg-zinc-950 active:scale-95">
            Cari Lebih Banyak
          </button>
        </div>

      </div>
    </MainLayout>
  );
}
