import { Keranjang, Produk, Ulasan, User } from "@/database/tables";
import { body_timestamps } from "@/libs/api/body_timestamps";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function GET(req) {
    try {
        const data = await Ulasan.findAll({
            include: [
                {
                    model: Keranjang,
                    include: [
                        {
                            model: User
                        },
                        {
                            model: Produk
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

export async function POST(req) {
    try {
        const { id_keranjang, payload } = await req.json()

        const data_ulasan = await Ulasan.create(body_timestamps(payload))

        const data_keranjang = await Keranjang.update({
            fk_ulasan: data_ulasan.id
        }, {
            where: {
                id: id_keranjang
            }
        })

        return response_handler({
            data: {
                ...data_keranjang,
                ...data_ulasan
            }
        })
    } catch (error) {
        return error_handler(error)
    }
}