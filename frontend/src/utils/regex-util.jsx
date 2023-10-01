/* util file to help determine regex of email and phone numbers and manipulate strings */

/* Regex util object */
const RegexUtil = {
    /**
     * REGEX for a valid email address.
     */
    VALID_EMAIL_REGEX: /.+@.+\.[A-Za-z]+$/,

    /**
     * Regex for a valid phone number.
     */
    VALID_PHONE_REGEX: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, // Francis Gagnon: from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number

    /**
     * The minimum password length for a user.
     */
    MIN_PASSWORD_LENGTH: 5,

    /**
     * The minimum username length for a user.
     */
    MIN_USERNAME_LENGTH: 1,

    /**
     *  Returns whether email address is in a valid format 
     */
    isValidEmailFormat(input) {
        return this.VALID_EMAIL_REGEX.test(input);
    },

    /**
     * Returns whether input is a valid phone number format
     */
    isValidPhoneFormat(input) {
        return this.VALID_PHONE_REGEX.test(input);
    },

    /**
     *  Returns whether password is valid.
     */
    isValidPasswordFormat(password) {
        return password.length >= this.MIN_PASSWORD_LENGTH;
    },

    /**
     *  Returns whether username is valid --> length >= 5 and no spaces
     */
    isValidUsernameFormat(username) {
        return (username.length >= this.MIN_USERNAME_LENGTH && !username.includes(" "));
    },

    /**
     * Strips a phone number string of the non digit characters.
     */
    stripNonDigits(phoneNumber) {
        return phoneNumber.replace(/\D/g, '');
    },

    /**
     * Strips a phone number string of the non digit characters.
     */
    isValidErrorMessage(errorMessage) {
        return errorMessage.length > 0;
    }
}

export default RegexUtil;