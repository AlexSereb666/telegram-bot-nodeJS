function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[0-9]{1,3}?[-. ]?\(?[0-9]{3}\)?[-. ]?[0-9]{3,4}[-. ]?[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
}

module.exports = {
    validatePhoneNumber,
};
