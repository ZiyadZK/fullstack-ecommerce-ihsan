import { Foto_Produk, Kategori, Kategori_Produk, Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function GET(req, { params }) {
    try {

        const { id } = await params

        const data = await Produk.findOne({
            where: {
                id
            },
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
            ]
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}