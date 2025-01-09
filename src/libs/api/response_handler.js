import { NextResponse } from "next/server";

export const response_handler = (
    body = {
        message: 'API is Connected'
    },
    status = 200
) => {
    return NextResponse.json(body, {
        status
    })
}