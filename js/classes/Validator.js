class Validator {
    static isNotEmpty(value) {
        return value.trim().length > 0;
    }

    static hasMinLength(value, minLength) {
        return value.trim().length >= minLength;
    }

    static isValidStatus(status) {
        return ['pending', 'done'].includes(status);
    }

    static isValidPriority(priority) {
        return ['low', 'medium', 'high'].includes(priority);
    }
}

export default Validator;
