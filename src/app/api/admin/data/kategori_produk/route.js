import { Kategori_Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function POST(req) {
    try {
        const payload = await req.json()

        const data = await Kategori_Produk.bulkCreate(
            Array.isArray(payload)
                ? payload
                : [payload]
        )

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

        const data = await Kategori_Produk.destroy({
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