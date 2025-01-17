import { Alamat_Penerima, Checkout, Foto_Payment, Keranjang, Payment, User } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const data = await Payment.findAll({
            include: [
                {
                    model: Alamat_Penerima
                },
                {
                    model: Foto_Payment
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

export async function PUT(req) {
    try {
        const { id, payload } = await req.json()

        const data = await Payment.update(payload, {
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

        const data = await Payment.destroy({
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
        return error_handler(err)
    }
}