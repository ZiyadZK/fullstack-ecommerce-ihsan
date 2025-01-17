import { Foto_Profil, User } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { jwt_handler } from "@/libs/api/jwt_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function GET(req) {
    try {
        const token = req.headers.get('authorization') && req.headers.get('authorization').split(' ')[1]

        if(!token) {
            return response_handler({
                message: 'Authorization Bearer Token is required, you need to login first'
            }, 403)
        }

        let response_jwt = jwt_handler.verify(token)

        if(!response_jwt.success) {
            if(response_jwt.message === 'jwt malformed') {
                return response_handler({
                    message: 'Token is invalid, you need to relogin'
                }, 403)
            }
            return response_handler({
                message: response_jwt.message
            }, 403)
        }

        const data = await User.findOne({
            raw: true,
            where: {
                id: response_jwt.data.id,
                username: response_jwt.data.username,
                password: response_jwt.data.password,
                role: response_jwt.data.role,
            },
            include: [
                {
                    model: Foto_Profil
                }
            ]
        })

        if(!data) {
            return response_handler({
                message: 'Your userdata has been changed, you need to relogin'
            }, 403)
        }

        const payload = {
            ...data,
            foto_profil: data['Foto_Profil.id'] ? data['Foto_Profil.url'] : ''
        }

        response_jwt = jwt_handler.generate(payload)

        if(!response_jwt.success) {
            return response_handler({
                message: response_jwt.message
            }, 403)
        }

        return response_handler({
            data: {
                userdata: payload,
                new_token: response_jwt.data
            }
        })
    } catch (error) {
        return error_handler(error)
    }
}