import { Supplier } from "@/database/tables";
import { body_timestamps } from "@/libs/api/body_timestamps";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const data = await Supplier.findAll({
            raw: true
        })

        return response_handler({ data })
    } catch (error) {
        return error_handler(error)
    }
}

export async function POST(req) {
    try {
        const payload = await req.json()

        const data = Array.isArray(payload)
            ? await Supplier.bulkCreate(body_timestamps(payload))
            : await Supplier.create(body_timestamps(payload))

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

        const data = Array.isArray(id)
            ? await Supplier.update(payload, {
                where: {
                    id: {
                        [Op.in]: id
                    }
                }
            })
            : await Supplier.update(payload, {
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

export async function DELETE(req) {
    try {
        const { id } = await req.json()

        const data = Array.isArray(id)
            ? await Supplier.destroy({
                where: {
                    id: {
                        [Op.in]: id
                    }
                }
            })
            : await Supplier.destroy({
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