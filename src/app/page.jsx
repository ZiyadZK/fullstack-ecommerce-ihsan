'use client'

import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import MainLayout from "@/components/MainLayout";
import { api_get } from "@/libs/api_handler";
import { customToast } from "@/libs/customToast";
import { Apps, ChevronRight, HomeOutlined, House } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    },
    new_products: {
      set: (col, val) => {
        setListData(state => ({
          ...state,
          new_products: {
            ...state.new_products,
            [col]: val
          }
        }))
      },
      get: async () => {
        try {
          aksi.new_products.set('status', 'loading')

          const response = await api_get({
            url: "/api/admin/data/produk-latest"
          })

          aksi.new_products.set('status', 'fetched')

          if(response.success) {
            aksi.new_products.set('data', response.data)
          }else{
            customToast.error({
              message: response?.message
            })
          }
        } catch (error) {
          aksi.new_products.set('status', 'fetched')
          customToast.error({
            message: error?.message
          })
        }
      }
    }
  }

  useEffect(() => {
    aksi.new_products.get()
  }, [])

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
        {listData.new_products.status === 'loading'
          ? (
              <div className="flex items-center justify-center my-48">
                  <CircularProgress color="primary" size={50} />
              </div>
          )
          : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                  {listData.new_products.data.map(produk => (
                      <button type="button" key={produk['id']} className="space-y-5 border border-zinc-300/0 hover:border-zinc-300 ease-out duration-100 hover:shadow-lg rounded-xl p-5 cursor-pointer">
                          {produk['Foto_Produk']
                              ? (
                                  <img src={produk['Foto_Produk']['url']} className="w-full aspect-square rounded-xl object-cover object-center" alt="Foto Produk" />
                              )
                              : (
                                  <div className="w-full aspect-square rounded-xl bg-zinc-200 flex items-center justify-center">
                                      No Photo
                                  </div>
                              )
                          }
                          <div className="flex items-center justify-between">
                          <div className="font-medium text-2xl">
                              {produk['nama']}
                          </div>
                          <div className="font-medium">
                              Rp {produk['harga_per_satuan']} <span className="opacity-70">/ {produk['satuan']}</span>
                          </div>
                          </div>
                      </button>
                  ))}

              </div>
          )
      }

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
