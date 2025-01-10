import { Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import dayjs from "dayjs";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const data = await Produk.findAll({
            
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}