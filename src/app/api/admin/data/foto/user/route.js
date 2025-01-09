import { supabase } from "@/database/config";
import { Foto_Profil, User } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData()
        const id_user = formData.get('id_user')
        const file = formData.get('foto')

        if(!file) {
            return response_handler({
                message: 'No file uploaded!'
            }, 400)
        }


        if(!id_user) {
            return response_handler({
                message: 'ID User is empty'
            }, 400)
        }

        const fileType = file.type.split('/')[0]

        if(fileType !== 'image') {
            return response_handler({
                message: 'Hanya gambar yang bisa di unggah!'
            })
        }

        const folder_path = 'images/user'
        const file_name = `${faker.string.uuid()}`
        const file_path = `${folder_path}/${file_name}`

        const arrayBuffer = await file.arrayBuffer()
        const file_buffer = Buffer.from(arrayBuffer)

        const { data, error } = await supabase.storage
            .from('ecommerce_ihsan_buckets')
            .upload(file_path, file_buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: true,
            })

        if(error) {
            return response_handler({
                message: error?.message,
                debug: error?.stack
            }, 500)
        }

        const public_url = supabase.storage
            .from('ecommerce_ihsan_buckets')
            .getPublicUrl(file_path)

        const foto_profil_data = await Foto_Profil.create({
            url: public_url.data.publicUrl
        })

        const user_data = await User.update({
            fk_foto_profil: foto_profil_data.id
        }, {
            where: {
                id: id_user
            }
        })

        return response_handler({
            message: 'Berhasil mengunggah foto profil',
            data: {
                url: public_url,
                id_user
            }
        })
    } catch (error) {
        error_handler(error)
    }
}