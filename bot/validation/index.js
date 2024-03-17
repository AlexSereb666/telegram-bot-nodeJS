function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[0-9]{1,3}?[-. ]?\(?[0-9]{3}\)?[-. ]?[0-9]{3,4}[-. ]?[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
}

const parseDate = (date) => {
    const originalDate = new Date(date);
    const formattedDate = `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1)
        .toString().padStart(2, '0')}-${originalDate.getDate().toString().padStart(2, '0')} ${originalDate.getHours()
            .toString().padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}`;
    
    return formattedDate;
}

module.exports = {
    validatePhoneNumber,
    parseDate,
};
