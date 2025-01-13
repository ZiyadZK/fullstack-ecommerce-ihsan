import { Alamat_Penerima, Checkout, Foto_Produk, Keranjang, Kupon, Payment, Produk } from "@/database/tables";
import { body_timestamps } from "@/libs/api/body_timestamps";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function GET(req, { params }) {
    try {
        const { id: fk_user } = await params

        const data = await Checkout.findOne({
            where: {
                fk_payment: null
            },
            include: [
                {
                    model: Alamat_Penerima
                },
                {
                    model: Payment
                },
                {
                    model: Kupon
                },
                {
                    model: Keranjang,
                    where: {
                        fk_user
                    },
                    include: [
                        {
                            model: Produk,
                            include: [
                                {
                                    model: Foto_Produk
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
} 

export async function POST(req, { params }) {
    try {
        const { id: fk_user } = await params

        const { keranjang, checkout } = await req.json()

        const data_checkout = await Checkout.create(body_timestamps(checkout))

        const data_keranjang = await Promise.all(
            Array.isArray(keranjang)
                ? keranjang.map(async (v) => 
                    await Keranjang.update({
                        jumlah: v['jumlah'],
                        fk_checkout: data_checkout.id
                    }, {
                        where: {
                            id: v['id']
                        }
                    })
                )
                : Keranjang.update({
                    jumlah: keranjang.jumlah,
                    fk_checkout: data_checkout.id
                }, {
                    where: {
                        id: keranjang.id
                    }
                })
        )

        return response_handler({
            message: 'Berhasil melakukan checkout di keranjang tersebut',
            data: data_keranjang
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function PUT(req, { params }) {
    try {
        
    } catch (error) {
        return error_handler(error)
    }
}

export async function DELETE(req, { params }) {
    try {
        
        const { id } = await params

        const data = await Checkout.destroy({
            where: {
                id
            }
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}