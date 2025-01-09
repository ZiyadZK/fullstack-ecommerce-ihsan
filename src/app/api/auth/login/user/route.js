import { Foto_Profil, User } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { jwt_handler } from "@/libs/api/jwt_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function POST(req) {
    try {
        const { username, password } = await req.json()

        const data = await User.findOne({
            raw: true,
            where: {
                username,
                password,
                role: 'user'
            },
            include: [
                {
                    model: Foto_Profil
                }
            ]
        })

        if(!data) {
            return response_handler({
                message: 'Akun dengan Username atau Password tersebut tidak ditemukan'
            }, 404)
        }

        const payload = {
            ...data,
            foto_profil: data['Foto_Profil.id'] ? data['Foto_Profil.url'] : ''
        }

        const response_jwt = jwt_handler.generate(payload)

        if(!response_jwt.success) {
            return response_handler({
                message: response_jwt.message
            }, 500)
        }

        return response_handler({
            message: 'Berhasil login',
            data: {
                userdata: payload,
                token: response_jwt.data
            }
        })

    } catch (error) {
        return error_handler(error)
    }
}