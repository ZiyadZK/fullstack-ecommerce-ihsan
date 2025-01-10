import { Foto_Produk, Kategori, Kategori_Produk, Produk } from "@/database/tables";
import { body_timestamps, delete_timestamps } from "@/libs/api/body_timestamps";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const data = await Produk.findAll({
            raw: false,
            include: [
                {
                    model: Kategori_Produk,
                    include: [
                        {
                            model: Kategori
                        }
                    ]
                },
                {
                    model: Foto_Produk
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
        const { payload, kategori } = await req.json()

        const data = Array.isArray(payload)
            ? await Produk.bulkCreate(body_timestamps(payload))
            : await Produk.create(body_timestamps(payload))
        
        await Kategori_Produk.bulkCreate(kategori.map(id => ({
            fk_produk: data.dataValues.id,
            fk_kategori: id
        })))
        
        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function PUT(req) {
    try {
        const { id, payload } = await req.json()

        const data = await Produk.update(body_timestamps(payload, true), {
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
        const searchParams = req.nextUrl.searchParams

        const { id } = await req.json()

        const data = searchParams.get('isForever')
            ? await Produk.destroy({
                where: {
                    id: Array.isArray(id)
                        ? {
                            [Op.in]: id
                        }
                        : id
                }
            })
            : await Produk.update({
                deleted_at: delete_timestamps()
            }, {
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