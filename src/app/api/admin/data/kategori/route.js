import { Kategori, Kategori_Produk, Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const data = await Kategori.findAll({
            raw: false,
            include: [
                {
                    model: Kategori_Produk
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

        const data = await Kategori.bulkCreate(
            Array.isArray(payload)
                ? payload
                : [payload]
        )

        return response_handler({
            message: 'Berhasil membuat kategori baru',
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function PUT(req) {
    try {
        const { id, payload } = await req.json()

        const data = await Kategori.update(payload, {
            where: {
                id: Array.isArray(id)
                    ? {
                        [Op.in]: id
                    }
                    : id
            }
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json()

        const data = await Kategori.destroy({
            where: {
                id: Array.isArray(id)
                    ? {
                        [Op.in]: id
                    }
                    : id
            }
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}