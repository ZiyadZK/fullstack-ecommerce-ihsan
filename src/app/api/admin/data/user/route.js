import { Foto_Profil, User } from "@/database/tables";
import { body_timestamps, delete_timestamps } from "@/libs/api/body_timestamps";
import { response_handler } from "@/libs/api/response_handler";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { Op, Error as SequelizeError } from "sequelize";

export async function GET(request) {
    try {

        const searchParams = request.nextUrl.searchParams

        const options = {
            raw: true,
            include: [
                {
                    model: Foto_Profil
                }
            ]
        }

        if(searchParams.get('role')) {
            options.where = {
                role: searchParams.get('role')
            }
        }

        const data = await User.findAll(options)


        return response_handler({ 
            data: data.map(v => ({
                id: v['id'],
                nama: v['nama'],
                username: v['username'],
                password: v['password'],
                role: v['role'],
                created_at: v['created_at'],
                updated_at: v['updated_at'],
                deleted_at: v['deleted_at'],
                foto_profil: v['Foto_Profil.url'],
            }))
        })
    } catch (error) {
        return response_handler({
            message: error?.message,
            debug: error?.stack
        })
    }
}

export async function POST(request) {
    try {
        const payload = await request.json()
        
        let data = null
        if(Array.isArray(payload)) {
            data = await User.bulkCreate(body_timestamps(payload))
        }else{
            data = await User.create(body_timestamps(payload))
        }

        return response_handler({ 
            message: 'Berhasil membuat user baru',
            data    
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

export async function PUT(request) {
    try {
        const { id, payload } = await request.json()

        const data = await User.update(body_timestamps(payload, true), {
            where: Array.isArray(id)
                ? {
                    id: {
                        [Op.in]: id
                    }
                }
                : {
                    id
                }
        })

        return response_handler({
            msesage: 'Berhasil mengubah data user',
            id,
            payload,
            data
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

export async function DELETE(request) {
    try {

        const searchParams = request.nextUrl.searchParams

        const { id } = await request.json()
        

        const data = searchParams.get('isForever')
            ? await User.destroy({
                where: Array.isArray(id)
                    ? {
                        id: {
                            [Op.in]: id
                        }
                    }
                    : { id }
            })
            : await User.update({
                deleted_at: delete_timestamps()
            }, {
                where: Array.isArray(id)
                    ? {
                        id: {
                            [Op.in]: id
                        }
                    }
                    : { id }
            })

        return response_handler({
            message: 'Berhasil menghapus user',
            id,
            data,
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