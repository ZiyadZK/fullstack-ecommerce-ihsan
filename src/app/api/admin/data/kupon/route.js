import { Kupon } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const data = await Kupon.findAll({
            
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

        const data = await Kupon.create(payload)

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

        const data = await Kupon.update(payload, {
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

        const data = await Kupon.destroy({
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