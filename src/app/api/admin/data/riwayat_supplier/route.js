import { Produk, Riwayat_Supplier, Supplier } from "@/database/tables";
import { body_timestamps } from "@/libs/api/body_timestamps";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const data = await Riwayat_Supplier.findAll({
            include: [
                {
                    model: Produk
                },
                {
                    model: Supplier
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

export async function POST(req) {
    try {
        const payload = await req.json()

        const data = await Riwayat_Supplier.create(payload)

        const produk = await Produk.increment({
            stok: payload.jumlah
        }, {
            where: {
                id: payload.fk_produk
            }
        })

        return response_handler({
            data,
            produk
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json()

        const data = Array.isArray(id)
            ? await Riwayat_Supplier.destroy({
                where: {
                    id: {
                        [Op.in]: id
                    }
                }
            })
            : await Riwayat_Supplier.destroy({
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