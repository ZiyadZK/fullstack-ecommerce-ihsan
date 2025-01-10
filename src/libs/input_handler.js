export const input_handler = {
    float_only: (value, { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY }) => {
        // Remove any non-digit or non-decimal characters

        if (value === '') {
            value = "0";
        }

        // Remove leading zeros (except for "0" or values like "0.x")
        if (value !== "0" && value.startsWith("0") && !value.startsWith("0.")) {
            value = value.replace(/^0+/, '');
        }

        const isValidNumber = /^[0-9]{1,9}(\.[0-9]{0,3})?$/.test(value);

        return isValidNumber && value
    },
    number_only: (value, { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY }) => {

        if (value === '') {
            value = "0";
        }

        // Remove leading zeros (except for "0" or values like "0.x")
        if (value !== "0" && value.startsWith("0") && !value.startsWith("0.")) {
            value = value.replace(/^0+/, '');
        }

        // Remove any non-digit characters
        let sanitizedValue = value.replace(/[^0-9]/g, '');

        // Remove leading zeros
        sanitizedValue = sanitizedValue.replace(/^0+(?=\d)/, '');

        // Convert to a number and ensure it's within the range
        const numberValue = parseInt(sanitizedValue, 10) || 0;

        // Clamp the value within the specified range
        return Math.min(Math.max(numberValue, min), max)
    }
}