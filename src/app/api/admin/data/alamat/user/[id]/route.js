import { Alamat_Penerima } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function GET(req, { params }) {
    try {
        const { id: fk_user } = await params

        const data = await Alamat_Penerima.findAll({
            where: {
                fk_user
            }
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function POST(req, { params }) {
    try {
        const { id: fk_user } = await params
        const payload = await req.json()

        const data = await Alamat_Penerima.create({
            ...payload,
            fk_user
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
        const { id: fk_user } = await params
        const { id } = await req.json()

        const data = await Alamat_Penerima.destroy({
            where: {
                id,
                fk_user
            }
        })
        
        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}