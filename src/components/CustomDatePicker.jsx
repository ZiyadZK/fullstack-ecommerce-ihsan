'use client'

import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"

export default function CustomDatePicker({
    label = "Pilih Tanggal",
    format = "DD / MM / YYYY",
    onModal = "",
    value,
    onChange = (newValue) => {}
}) {
    return (
        <DatePicker 
            label={label}
            format={format}
            slotProps={{
                popper: {
                    container: onModal ? document.getElementById(onModal) : document.body
                }
            }}
            value={dayjs(value)}
            onChange={onChange}
        />
    )
}