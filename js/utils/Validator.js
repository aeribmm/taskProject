/**
 * Klasa Validator - walidacja danych wejściowych
 */
export default class Validator {
    /**
     * Sprawdza czy wartość nie jest pusta
     * @param {any} value - Wartość do sprawdzenia
     * @returns {boolean} True jeśli wartość nie jest pusta
     */
    static isNotEmpty(value) {
        return value !== null &&
            value !== undefined &&
            typeof value === 'string' &&
            value.trim().length > 0;
    }

    /**
     * Sprawdza minimalną długość tekstu
     * @param {string} value - Tekst do sprawdzenia
     * @param {number} minLength - Minimalna długość
     * @returns {boolean} True jeśli tekst ma odpowiednią długość
     */
    static hasMinLength(value, minLength) {
        return this.isNotEmpty(value) && value.trim().length >= minLength;
    }

    /**
     * Sprawdza maksymalną długość tekstu
     * @param {string} value - Tekst do sprawdzenia
     * @param {number} maxLength - Maksymalna długość
     * @returns {boolean} True jeśli tekst nie przekracza długości
     */
    static hasMaxLength(value, maxLength) {
        if (!value) return true;
        return value.trim().length <= maxLength;
    }

    /**
     * Sprawdza czy status jest prawidłowy
     * @param {string} status - Status do sprawdzenia
     * @returns {boolean} True jeśli status jest prawidłowy
     */
    static isValidStatus(status) {
        return ['pending', 'done'].includes(status);
    }

    /**
     * Sprawdza czy priorytet jest prawidłowy
     * @param {string} priority - Priorytet do sprawdzenia
     * @returns {boolean} True jeśli priorytet jest prawidłowy
     */
    static isValidPriority(priority) {
        return ['low', 'medium', 'high'].includes(priority);
    }

    /**
     * Sprawdza czy kategoria jest prawidłowa
     * @param {string} category - Kategoria do sprawdzenia
     * @returns {boolean} True jeśli kategoria jest prawidłowa
     */
    static isValidCategory(category) {
        return ['praca', 'nauka', 'hobby', 'dom', 'inne'].includes(category);
    }

    /**
     * Sprawdza czy nazwa użytkownika jest prawidłowa
     * @param {string} name - Nazwa użytkownika
     * @returns {boolean} True jeśli nazwa jest prawidłowa
     */
    static isValidUserName(name) {
        if (!this.isNotEmpty(name)) {
            return false;
        }

        const trimmedName = name.trim();

        // Sprawdza długość (2-50 znaków)
        if (!this.hasMinLength(trimmedName, 2) || !this.hasMaxLength(trimmedName, 50)) {
            return false;
        }

        // Sprawdza dozwolone znaki
        const validPattern = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/;
        return validPattern.test(trimmedName);
    }

    /**
     * Sprawdza czy treść zadania jest prawidłowa
     * @param {string} content - Treść zadania
     * @returns {boolean} True jeśli treść jest prawidłowa
     */
    static isValidTaskContent(content) {
        return this.isNotEmpty(content) &&
            this.hasMinLength(content, 3) &&
            this.hasMaxLength(content, 500);
    }

    /**
     * Waliduje dane zadania
     * @param {Object} taskData - Dane zadania
     * @returns {Object} Obiekt z wynikiem walidacji
     */
    static validateTask(taskData) {
        const errors = [];

        if (!this.isValidTaskContent(taskData.content)) {
            errors.push('Treść zadania musi mieć od 3 do 500 znaków');
        }

        if (!this.isValidUserName(taskData.user)) {
            errors.push('Nieprawidłowa nazwa użytkownika');
        }

        if (taskData.priority && !this.isValidPriority(taskData.priority)) {
            errors.push('Nieprawidłowy priorytet (dozwolone: low, medium, high)');
        }

        if (taskData.category && !this.isValidCategory(taskData.category)) {
            errors.push('Nieprawidłowa kategoria (dozwolone: praca, nauka, hobby, dom, inne)');
        }

        if (taskData.status && !this.isValidStatus(taskData.status)) {
            errors.push('Nieprawidłowy status (dozwolone: pending, done)');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Waliduje dane użytkownika
     * @param {Object} userData - Dane użytkownika
     * @returns {Object} Obiekt z wynikiem walidacji
     */
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

    /**
     * Oczyszcza tekst wejściowy z potencjalnie niebezpiecznych znaków
     * @param {string} input - Tekst do oczyszczenia
     * @returns {string} Oczyszczony tekst
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim()
            .replace(/[<>]/g, '') // Usuwa podstawowe znaki HTML
            .replace(/javascript:/gi, '') // Usuwa javascript: URLs
            .replace(/on\w+=/gi, ''); // Usuwa event handlery
    }

    /**
     * Sprawdza czy email jest prawidłowy
     * @param {string} email - Adres email
     * @returns {boolean} True jeśli email jest prawidłowy
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Sprawdza czy data jest prawidłowa
     * @param {Date} date - Data do sprawdzenia
     * @returns {boolean} True jeśli data jest prawidłowa
     */
    static isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }

    /**
     * Sprawdza czy liczba jest dodatnia
     * @param {number} value - Wartość do sprawdzenia
     * @returns {boolean} True jeśli liczba jest dodatnia
     */
    static isPositiveNumber(value) {
        return typeof value === 'number' && value > 0 && isFinite(value);
    }

    /**
     * Sprawdza czy liczba jest nieujemna
     * @param {number} value - Wartość do sprawdzenia
     * @returns {boolean} True jeśli liczba jest nieujemna
     */
    static isNonNegativeNumber(value) {
        return typeof value === 'number' && value >= 0 && isFinite(value);
    }

    /**
     * Sprawdza czy wartość jest w określonym zakresie
     * @param {number} value - Wartość do sprawdzenia
     * @param {number} min - Wartość minimalna
     * @param {number} max - Wartość maksymalna
     * @returns {boolean} True jeśli wartość jest w zakresie
     */
    static isInRange(value, min, max) {
        return typeof value === 'number' &&
            value >= min &&
            value <= max &&
            isFinite(value);
    }

    /**
     * Sprawdza czy string zawiera tylko cyfry
     * @param {string} value - Wartość do sprawdzenia
     * @returns {boolean} True jeśli zawiera tylko cyfry
     */
    static isNumeric(value) {
        return /^\d+$/.test(value);
    }

    /**
     * Sprawdza czy string zawiera tylko litery
     * @param {string} value - Wartość do sprawdzenia
     * @returns {boolean} True jeśli zawiera tylko litery
     */
    static isAlphabetic(value) {
        return /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(value);
    }

    /**
     * Sprawdza czy string zawiera tylko litery i cyfry
     * @param {string} value - Wartość do sprawdzenia
     * @returns {boolean} True jeśli zawiera tylko litery i cyfry
     */
    static isAlphanumeric(value) {
        return /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9]+$/.test(value);
    }

    /**
     * Sprawdza czy URL jest prawidłowy
     * @param {string} url - URL do sprawdzenia
     * @returns {boolean} True jeśli URL jest prawidłowy
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Sprawdza siłę hasła
     * @param {string} password - Hasło do sprawdzenia
     * @returns {Object} Obiekt z oceną siły hasła
     */
    static checkPasswordStrength(password) {
        const result = {
            score: 0,
            feedback: [],
            isStrong: false
        };

        if (!password) {
            result.feedback.push('Hasło jest wymagane');
            return result;
        }

        if (password.length >= 8) {
            result.score += 1;
        } else {
            result.feedback.push('Hasło powinno mieć co najmniej 8 znaków');
        }

        if (/[a-z]/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Hasło powinno zawierać małe litery');
        }

        if (/[A-Z]/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Hasło powinno zawierać wielkie litery');
        }

        if (/\d/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Hasło powinno zawierać cyfry');
        }

        if (/[^a-zA-Z0-9]/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Hasło powinno zawierać znaki specjalne');
        }

        result.isStrong = result.score >= 4;

        if (result.isStrong) {
            result.feedback = ['Hasło jest silne'];
        }

        return result;
    }

    /**
     * Waliduje wszystkie dane formularza zadania
     * @param {Object} formData - Dane z formularza
     * @returns {Object} Wynik walidacji
     */
    static validateTaskForm(formData) {
        const errors = [];
        const warnings = [];

        // Walidacja treści
        if (!this.isValidTaskContent(formData.content)) {
            errors.push('Treść zadania musi mieć od 3 do 500 znaków');
        }

        // Walidacja użytkownika
        if (!formData.user) {
            errors.push('Wybierz użytkownika');
        }

        // Walidacja priorytetu
        if (!this.isValidPriority(formData.priority)) {
            errors.push('Wybierz prawidłowy priorytet');
        }

        // Walidacja kategorii
        if (!this.isValidCategory(formData.category)) {
            errors.push('Wybierz prawidłową kategorię');
        }

        // Ostrzeżenia
        if (formData.content && formData.content.length > 200) {
            warnings.push('Długi opis zadania może być trudny do przeczytania');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            hasWarnings: warnings.length > 0
        };
    }
}