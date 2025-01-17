import { Foto_Produk, Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams

        const options = {
            where: {
                
            }
        }

        if(searchParams.get('search')) {
            options.where = {
                nama: {
                    [Op.substring]: searchParams.get('search')
                }
            }
        }

        const data = await Produk.findAll({
            ...options,
            include: [
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