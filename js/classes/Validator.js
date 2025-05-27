class Validator {
    static isNotEmpty(value) {
        return value && typeof value === 'string' && value.trim().length > 0;
    }

    static hasMinLength(value, minLength) {
        return this.isNotEmpty(value) && value.trim().length >= minLength;
    }

    static hasMaxLength(value, maxLength) {
        return !value || value.trim().length <= maxLength;
    }

    static isValidStatus(status) {
        return ['pending', 'done'].includes(status);
    }

    static isValidPriority(priority) {
        return ['low', 'medium', 'high'].includes(priority);
    }

    static isValidCategory(category) {
        return ['praca', 'nauka', 'hobby', 'dom', 'inne'].includes(category);
    }

    static isValidUserName(name) {
        return this.isNotEmpty(name) &&
            this.hasMinLength(name, 2) &&
            this.hasMaxLength(name, 50) &&
            /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s-_]+$/.test(name.trim());
    }

    static isValidTaskContent(content) {
        return this.isNotEmpty(content) &&
            this.hasMinLength(content, 3) &&
            this.hasMaxLength(content, 500);
    }

    static validateTask(taskData) {
        const errors = [];

        if (!this.isValidTaskContent(taskData.content)) {
            errors.push('Treść zadania musi mieć od 3 do 500 znaków');
        }

        if (!this.isValidUserName(taskData.user)) {
            errors.push('Nieprawidłowa nazwa użytkownika');
        }

        if (taskData.priority && !this.isValidPriority(taskData.priority)) {
            errors.push('Nieprawidłowy priorytet');
        }

        if (taskData.category && !this.isValidCategory(taskData.category)) {
            errors.push('Nieprawidłowa kategoria');
        }

        if (taskData.status && !this.isValidStatus(taskData.status)) {
            errors.push('Nieprawidłowy status');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    static validateUser(userData) {
        const errors = [];

        if (!this.isValidUserName(userData.name)) {
            errors.push('Nazwa użytkownika musi mieć od 2 do 50 znaków i zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/[<>]/g, '');
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }

    static isPositiveNumber(value) {
        return typeof value === 'number' && value > 0 && isFinite(value);
    }

    static isNonNegativeNumber(value) {
        return typeof value === 'number' && value >= 0 && isFinite(value);
    }
}