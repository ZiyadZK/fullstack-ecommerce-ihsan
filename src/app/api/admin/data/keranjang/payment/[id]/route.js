import { Alamat_Penerima, Checkout, Foto_Payment, Foto_Produk, Keranjang, Kupon, Payment, Produk } from "@/database/tables";
import { error_handler } from "@/libs/api/error_handler";
import { response_handler } from "@/libs/api/response_handler";
import { Op } from "sequelize";

export async function GET(req, { params }) {
    try {
        const { id: fk_user } = await params

        const data = await Payment.findAll({
            include: [
                {
                    model: Checkout,
                    include: [
                        {
                            model: Keranjang,
                            required: true,
                            include: [
                                {
                                    model: Produk,
                                    include: [
                                        {
                                            model: Foto_Produk
                                        }
                                    ]
                                },
                                
                            ],
                            where: {
                                fk_user
                            }
                        },
                        {
                            model: Kupon
                        }
                    ]
                },
                {
                    model: Alamat_Penerima
                },
                {
                    model: Foto_Payment
                }
            ]
        })

        // Filter out Payments where Checkouts have no Keranjangs
        const filteredData = data.filter(payment => 
            payment.Checkout && payment.Checkout.Keranjangs && payment.Checkout.Keranjangs.length > 0
        );

        return response_handler({ 
            data: filteredData
        });
    } catch (error) {
        return error_handler(error)
    }
}

export async function POST(req, { params }) {
    try {
        const { id } = await params
        const { id_checkout, fk_alamat_penerima } = await req.json()

        const data_payment = await Payment.create({
            fk_alamat_penerima
        })

        await Checkout.update({
            fk_payment: data_payment.id
        }, {
            where: {
                id: id_checkout
            }
        })

        return response_handler({
            message: 'Berhasil melakukan checkout, silahkan lakukan pembayaran terlebih dahulu'
        })
    } catch (error) {
        return error_handler(error)
    }
}