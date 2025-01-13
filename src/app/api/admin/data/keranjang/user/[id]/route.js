import { Foto_Produk, Kategori, Kategori_Produk, Keranjang, Produk } from "@/database/tables"
import { error_handler } from "@/libs/api/error_handler"
import { response_handler } from "@/libs/api/response_handler"
import { Op } from "sequelize"

export async function GET(req, { params }) {
    try {
        const { id } = await params

        const data = await Keranjang.findAll({
            where: {
                fk_user: id,
                fk_checkout: null
            },
            include: [
                {
                    model: Produk,
                    include: [
                        {
                            model: Foto_Produk
                        },
                        {
                            model: Kategori_Produk,
                            include: [
                                {
                                    model: Kategori
                                }
                            ]
                        }
                    ],
                },
                
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
        const { fk_produk }  = await req.json()

        let [data, data_created] = await Keranjang.findOrCreate({
            where: {
                fk_produk,
                fk_user,
                fk_checkout: null
            }
        })

        if(!data_created) {
            data = await Keranjang.increment({
                jumlah: 1
            }, {
                where: {
                    fk_produk,
                    fk_user
                }
            })
        }

        return response_handler({
            data,
            data_created
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id: fk_user } = await params
        const { fk_produk } = await req.json()

        const data = await Keranjang.destroy({
            where: {
                fk_user,
                fk_produk: Array.isArray(fk_produk)
                    ? {
                        [Op.in]: fk_produk
                    }
                    : fk_produk
            }
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}
