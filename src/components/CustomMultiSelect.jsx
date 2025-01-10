'use client'

import { Autocomplete, Popper, TextField } from "@mui/material"
import { styled } from "@mui/system";

export default function CustomMultiSelect({
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
            multiple
            fullWidth
            
            id="tags-standard"
            options={options}
            getOptionLabel={(option) => optionLabel !== ''
                ? option[optionLabel]
                : Object.keys(options)[0]
            }
            defaultValue={defaultValue}
            value={value || [value]}
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