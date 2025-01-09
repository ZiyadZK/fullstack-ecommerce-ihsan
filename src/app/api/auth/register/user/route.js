import { User } from "@/database/tables";
import { body_timestamps } from "@/libs/api/body_timestamps";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";

export async function POST(req) {
    try {
        const payload = await req.json()

        const data = await User.create(body_timestamps({
            ...payload,
            role: 'user'
        }))

        return response_handler({
            message: 'Berhasil membuat akun baru',
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}