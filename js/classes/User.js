/**
 * Klasa User - reprezentuje użytkownika systemu
 */
export default class User {
    constructor(name) {
        this.name = name;
        this.createdAt = new Date();
        this.lastActivity = new Date();
    }

    /**
     * Sprawdza czy nazwa użytkownika jest prawidłowa
     * @param {string} name - Nazwa użytkownika
     * @returns {boolean} True jeśli nazwa jest prawidłowa
     */
    static isValidName(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }

        const trimmedName = name.trim();

        // Sprawdza długość (2-50 znaków)
        if (trimmedName.length < 2 || trimmedName.length > 50) {
            return false;
        }

        // Sprawdza czy zawiera tylko dozwolone znaki
        const validPattern = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/;
        return validPattern.test(trimmedName);
    }

    /**
     * Aktualizuje ostatnią aktywność użytkownika
     */
    updateLastActivity() {
        this.lastActivity = new Date();
    }

    /**
     * Zwraca sformatowaną datę utworzenia konta
     * @returns {string} Sformatowana data
     */
    getFormattedCreationDate() {
        return this.createdAt.toLocaleString('pl-PL');
    }

    /**
     * Zwraca sformatowaną datę ostatniej aktywności
     * @returns {string} Sformatowana data
     */
    getFormattedLastActivity() {
        return this.lastActivity.toLocaleString('pl-PL');
    }

    /**
     * Zwraca liczbę dni od utworzenia konta
     * @returns {number} Liczba dni
     */
    getAccountAgeInDays() {
        const now = new Date();
        const diffTime = Math.abs(now - this.createdAt);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Konwertuje użytkownika do formatu JSON
     * @returns {Object} Obiekt JSON reprezentujący użytkownika
     */
    toJSON() {
        return {
            name: this.name,
            createdAt: this.createdAt.toISOString(),
            lastActivity: this.lastActivity.toISOString()
        };
    }

    /**
     * Tworzy instancję User z obiektu JSON
     * @param {Object} data - Dane użytkownika
     * @returns {User} Nowa instancja User
     */
    static fromJSON(data) {
        const user = new User(data.name);
        user.createdAt = new Date(data.createdAt);
        user.lastActivity = new Date(data.lastActivity || data.createdAt);
        return user;
    }

    /**
     * Sprawdza czy użytkownik jest równy innemu użytkownikowi
     * @param {User} otherUser - Inny użytkownik
     * @returns {boolean} True jeśli użytkownicy są równi
     */
    equals(otherUser) {
        return otherUser instanceof User && this.name === otherUser.name;
    }

    /**
     * Zwraca string reprezentujący użytkownika
     * @returns {string} Nazwa użytkownika
     */
    toString() {
        return this.name;
    }
}