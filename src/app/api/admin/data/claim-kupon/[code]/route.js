import { Checkout, Kupon } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function GET(req, { params }) {
    try {
        const { code } = await params

        const data_kupon = await Kupon.findOne({
            where: {
                code
            }
        })

        return response_handler({
            data: data_kupon
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function PUT(req, { params }) {
    try {
        const { code } = await params
        const { id, payload } = await req.json()

        const data_kupon = await Kupon.findOne({
            where: {
                code
            }
        })

        if(!data_kupon) {
            return response_handler({
                message: 'Kupon tidak ditemukan!'
            }, 404)
        }

        const data = await Checkout.update({
            fk_kupon: data_kupon.id
        }, {
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

export async function DELETE(req, { params }) {
    try {
        const { code } = await params
        const { id } = await req.json()

        const data = await Checkout.update({
            fk_kupon: null
        }, {
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