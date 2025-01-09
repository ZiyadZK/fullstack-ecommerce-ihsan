import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const body_timestamps = (payload, isUpdate = false) => {
    if(Array.isArray(payload)) {
        return payload.map(v => {
            const data = {
                ...v
            }

            if(isUpdate) {
                data.updated_at = `${dayjs().tz('Asia/Jakarta').toISOString()}`
            }else{
                data.created_at = `${dayjs().tz('Asia/Jakarta').toISOString()}`
                data.updated_at = `${dayjs().tz('Asia/Jakarta').toISOString()}`
            }

            return data
        })
    }else{

        if(isUpdate) {
            payload.updated_at = `${dayjs().tz('Asia/Jakarta').toISOString()}`
        }else{
            payload.created_at = `${dayjs().tz('Asia/Jakarta').toISOString()}`
            payload.updated_at = `${dayjs().tz('Asia/Jakarta').toISOString()}`
        }

        return payload
    }
}

export const delete_timestamps = () => {
    return dayjs().tz('Asia/Jakarta').toISOString()
}