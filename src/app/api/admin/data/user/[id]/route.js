import { User } from "@/database/tables"
import { response_handler } from "@/libs/api/response_handler"
import { Error as SequelizeError } from "sequelize"

export async function GET(req, { params }) {
    try {
        const parameters = await params

        if(parameters.id) {
            const data = await User.findOne({
                where: {
                    id: parameters.id
                }
            })

            return response_handler({
                data
            })
        }

        return response_handler({
            message: 'You need to specify ID'
        })
    } catch (error) {
        if(error instanceof Error) {
            return response_handler({
                message: error?.message,
                debug: error?.stack
            }, 500)
        }else if(error instanceof SequelizeError) {
            return response_handler({
                message: error.message,
                debug: error?.stack
            }, 500)
        }
    }
}