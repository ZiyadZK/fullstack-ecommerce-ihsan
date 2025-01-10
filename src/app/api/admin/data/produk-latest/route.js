import { Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import dayjs from "dayjs";
import { Op } from "sequelize";

export async function GET(req) {
    try {

        const start_of_week = dayjs().startOf("week").toDate()
        const end_of_week = dayjs().endOf("week").toDate()
        const data = await Produk.findAll({
            where: {
                created_at: {
                    [Op.between]: [
                        start_of_week,
                        end_of_week
                    ]
                }
            }
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}