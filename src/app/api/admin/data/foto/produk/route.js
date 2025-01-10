import { supabase } from "@/database/config";
import { Foto_Produk, Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { faker } from "@faker-js/faker";

export async function POST(req) {
    try {
        const formData = await req.formData()
        const id_produk = formData.get('id_produk')
        const file = formData.get('foto')

        if(!file) {
            return response_handler({
                message: 'No file uploaded!'
            }, 400)
        }

        if(!id_produk) {
            return response_handler({
                message: 'ID Produk is empty'
            }, 400)
        }

        const fileType = file.type.split('/')[0]

        if(fileType !== 'image') {
            return response_handler({
                message: 'Hanya gambar yang bisa di unggah!'
            }, 400)
        }

        const folder_path = 'images/produk'
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
        
        const foto_produk_data = await Foto_Produk.create({
            url: public_url.data.publicUrl
        })

        const produk = await Produk.update({
            fk_foto_produk: foto_produk_data.id
        }, {
            where: {
                id: id_produk
            }
        })

        return response_handler({
            message: 'Berhasil mengunggah foto produk',
            data: {
                url: public_url,
                id_produk
            }
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json()

        const data = await Foto_Produk.destroy({
            where: {
                id
            }
        })

        return response_handler({ data })
    } catch (error) {
        return error_handler(error)
    }
}