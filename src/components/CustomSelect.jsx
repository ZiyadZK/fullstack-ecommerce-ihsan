'use client'

import { Autocomplete, TextField } from "@mui/material"

export default function CustomSelect({
    options = [],
    optionLabel = '',
    defaultValue,
    value,
    onChange = (event, newValue) => {},
    variant = "standard",
    label = "Cari dan Pilih",
    placeholder = "",
    onModal = ""
}) {
    return (
        <Autocomplete
            fullWidth
            id="tags-standard"
            options={options}
            getOptionLabel={(option) => optionLabel !== ''
                ? option[optionLabel]
                : Object.keys(option[0])[0]
            }
            defaultValue={defaultValue}
            value={value}
            filterSelectedOptions
            onChange={onChange}
            slotProps={{
                popper: {
                    container: document.getElementById(onModal) || document.body
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant={variant || 'standard'}
                    label={label || 'Cari dan Pilih data'}
                    placeholder={placeholder}
                />
            )}
            
        />
    )
}