import { Error as SequelizeError } from "sequelize"
import { response_handler } from "./response_handler"
import { JsonWebTokenError } from "jsonwebtoken"

export const error_handler = (error) => {
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
    }else if(error instanceof JsonWebTokenError) {
        return response_handler({
            message: error?.message,
            debug: error?.stack
        })
    }
}