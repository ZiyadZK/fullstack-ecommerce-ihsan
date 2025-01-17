import { supabase } from "@/database/config";
import { Foto_Payment, Payment } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { faker } from "@faker-js/faker";

export async function POST(req) {
    try {
        const formData = await req.formData()

        const id = formData.get('id')
        const foto = formData.get('foto')

        if(!foto) {
            return response_handler({
                message: 'Foto tidak ditemukan'
            }, 404)
        }

        if(!id) {
            return response_handler({
                message: 'ID Payment is empty'
            }, 400)
        }

        const fileType = foto.type.split('/')[0]

        if(fileType !== 'image') {
            return response_handler({
                message: 'Hanya gambar yang bisa di unggah!'
            }, 400)
        }

        const folder_path = 'images/transaction'
        const file_name = `${faker.string.uuid()}`
        const file_path = `${folder_path}/${file_name}`

        const arrayBuffer = await foto.arrayBuffer()
        const file_buffer = Buffer.from(arrayBuffer)

        const { data, error } = await supabase.storage
            .from('ecommerce_ihsan_buckets')
            .upload(file_path, file_buffer, {
                contentType: foto.type,
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

        const foto_payment = await Foto_Payment.create({
            url: public_url.data.publicUrl
        })

        const payment_data = await Payment.update({
            fk_foto_payment: foto_payment.id,
            is_confirmed: null
        }, {
            where: {
                id
            }
        })

        return response_handler({
            message: 'Berhasil mengunggah foto bukti pembayaran',
            data: {
                url: public_url,
                id
            }
        })
    } catch (error) {
        return error_handler(error)
    }
}