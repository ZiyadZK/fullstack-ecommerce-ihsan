import { Alamat_Penerima, Checkout, Foto_Payment, Keranjang, Payment, Produk, User } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req) {
    try {

        const searchParams = req.nextUrl.searchParams

        const options = {
            where: {
                
            }
        }


        const data = searchParams.get('id')
            ? await Payment.findOne({
                where: {
                    id: searchParams.get('id')
                },
                include: [
                    {
                        model: Alamat_Penerima
                    },
                    {
                        model: Foto_Payment
                    }
                ]
            })
            : await Payment.findAll({
                include: [
                    {
                        model: Alamat_Penerima
                    },
                    {
                        model: Foto_Payment
                    }
                ]
            })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function PUT(req) {
    try {
        const { id, payload } = await req.json()

        const data = await Payment.update(payload, {
            where: {
                id
            }
        })


        if(payload['is_confirmed']) {
            let data_keranjang = await Keranjang.findAll({
                include: [
                    {
                        model: Checkout,
                        where: {
                            fk_payment: id
                        }
                    },
                    {
                        model: Produk
                    }
                ]
            })

            
            data_keranjang = data_keranjang.map(v => v.dataValues)
            

            const data_produk = await Produk.findAll()

            const response = []

            await Promise.all(
                data_produk.map(v => v.dataValues).map(async v => {
                    const selected_produk = data_keranjang.find(item => item['Produk']['dataValues']['id'] === v['id'])

                    if(!selected_produk) {
                        response.push('failed')
                        return v
                    }

                    console.log(v.stok > selected_produk.jumlah)

                    if(v.stok > selected_produk.jumlah) {
                        await Produk.increment({
                            stok: -selected_produk.jumlah
                        }, {
                            where: {
                                id: selected_produk['Produk']['dataValues']['id']
                            }
                        })
                        response.push('success')
                    }else{
                        response.push('failed')
                    }
                    
                })
            )

            if(response.includes('failed')) {
                return response_handler({
                    message: 'Berhasil, namun terdapat stok produk yang sudah habis'
                })
            }else{
                return response_handler({
                    message: 'Berhasil'
                })
            }

        }

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(error)
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json()

        const data = await Payment.destroy({
            where: {
                id: Array.isArray(id)
                    ? {
                        [Op.in]: id
                    }
                    : id
            }
        })

        return response_handler({
            data
        })
    } catch (error) {
        return error_handler(err)
    }
}