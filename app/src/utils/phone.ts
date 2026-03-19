export const formatPhone = (val: string) => {
    // Remove all non-digits
    let digits = val.replace(/\D/g, '');
    
    // If it starts with 7 or 8 (standard for KZ/RU), remove it from the start for formatting
    if (digits.startsWith('7') || digits.startsWith('8')) {
        if (val.startsWith('+7') || digits.length > 1) {
             digits = digits.slice(1);
        }
    }

    // Limit to 10 digits
    digits = digits.slice(0, 10);
    
    if (digits.length === 0) return '';
    
    let res = '+7';
    if (digits.length > 0) {
        res += ` (${digits.slice(0,3)}`;
    }
    if (digits.length >= 4) {
        res += `) ${digits.slice(3,6)}`;
    }
    if (digits.length >= 7) {
        res += ` ${digits.slice(6,8)}`;
    }
    if (digits.length >= 9) {
        res += ` ${digits.slice(8,10)}`;
    }
    return res;
};
