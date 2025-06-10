/**
 * Klasa LocalStorageManager - zarządza zapisem i odczytem danych z localStorage
 */
export default class LocalStorageManager {
    static STORAGE_KEYS = {
        USERS: 'taskmaster_users',
        TASKS: 'taskmaster_tasks',
        CURRENT_USER: 'taskmaster_currentUser',
        SETTINGS: 'taskmaster_settings'
    };

    /**
     * Zapisuje dane do localStorage
     * @param {string} key - Klucz
     * @param {any} data - Dane do zapisania
     * @returns {boolean} True jeśli zapis się powiódł
     */
    static save(key, data) {
        try {
            const jsonString = JSON.stringify(data);
            localStorage.setItem(key, jsonString);
            return true;
        } catch (error) {
            console.error('Błąd podczas zapisywania do localStorage:', error);
            return false;
        }
    }

    /**
     * Odczytuje dane z localStorage
     * @param {string} key - Klucz
     * @param {any} defaultValue - Wartość domyślna
     * @returns {any} Odczytane dane lub wartość domyślna
     */
    static load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error('Błąd podczas odczytywania z localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Usuwa dane z localStorage
     * @param {string} key - Klucz
     * @returns {boolean} True jeśli usunięcie się powiodło
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Błąd podczas usuwania z localStorage:', error);
            return false;
        }
    }

    /**
     * Sprawdza czy klucz istnieje w localStorage
     * @param {string} key - Klucz
     * @returns {boolean} True jeśli klucz istnieje
     */
    static exists(key) {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Zapisuje listę użytkowników
     * @param {string[]} users - Lista użytkowników
     * @returns {boolean} True jeśli zapis się powiódł
     */
    static saveUsers(users) {
        return this.save(this.STORAGE_KEYS.USERS, users);
    }

    /**
     * Odczytuje listę użytkowników
     * @returns {string[]} Lista użytkowników
     */
    static loadUsers() {
        return this.load(this.STORAGE_KEYS.USERS, []);
    }

    /**
     * Zapisuje zadania
     * @param {Task[]} tasks - Lista zadań
     * @returns {boolean} True jeśli zapis się powiódł
     */
    static saveTasks(tasks) {
        const tasksData = tasks.map(task => task.toJSON ? task.toJSON() : task);
        return this.save(this.STORAGE_KEYS.TASKS, tasksData);
    }

    /**
     * Odczytuje zadania
     * @returns {Object[]} Lista zadań w formacie JSON
     */
    static loadTasks() {
        return this.load(this.STORAGE_KEYS.TASKS, []);
    }

    /**
     * Zapisuje aktualnego użytkownika
     * @param {string} userName - Nazwa użytkownika
     * @returns {boolean} True jeśli zapis się powiódł
     */
    static saveCurrentUser(userName) {
        return this.save(this.STORAGE_KEYS.CURRENT_USER, userName);
    }

    /**
     * Odczytuje aktualnego użytkownika
     * @returns {string|null} Nazwa aktualnego użytkownika
     */
    static loadCurrentUser() {
        return this.load(this.STORAGE_KEYS.CURRENT_USER, null);
    }

    /**
     * Zapisuje ustawienia aplikacji
     * @param {Object} settings - Ustawienia
     * @returns {boolean} True jeśli zapis się powiódł
     */
    static saveSettings(settings) {
        return this.save(this.STORAGE_KEYS.SETTINGS, settings);
    }

    /**
     * Odczytuje ustawienia aplikacji
     * @returns {Object} Ustawienia aplikacji
     */
    static loadSettings() {
        return this.load(this.STORAGE_KEYS.SETTINGS, {
            theme: 'light',
            language: 'pl',
            autoSave: true,
            notifications: true
        });
    }

    /**
     * Czyści wszystkie dane aplikacji
     * @returns {boolean} True jeśli czyszczenie się powiodło
     */
    static clearAll() {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Błąd podczas czyszczenia localStorage:', error);
            return false;
        }
    }

    /**
     * Eksportuje wszystkie dane do obiektu
     * @returns {Object} Wszystkie dane aplikacji
     */
    static exportAll() {
        const data = {};
        Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
            data[name.toLowerCase()] = this.load(key);
        });
        return data;
    }

    /**
     * Importuje dane z obiektu
     * @param {Object} data - Dane do importu
     * @returns {boolean} True jeśli import się powiódł
     */
    static importAll(data) {
        try {
            if (data.users) {
                this.saveUsers(data.users);
            }
            if (data.tasks) {
                this.save(this.STORAGE_KEYS.TASKS, data.tasks);
            }
            if (data.current_user) {
                this.saveCurrentUser(data.current_user);
            }
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            return true;
        } catch (error) {
            console.error('Błąd podczas importu danych:', error);
            return false;
        }
    }

    /**
     * Sprawdza dostępność localStorage
     * @returns {boolean} True jeśli localStorage jest dostępne
     */
    static isAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Zwraca rozmiar zajętej przestrzeni w localStorage
     * @returns {number} Rozmiar w bajtach
     */
    static getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    /**
     * Zwraca rozmiar zajętej przestrzeni przez aplikację
     * @returns {number} Rozmiar w bajtach
     */
    static getAppStorageSize() {
        let total = 0;
        Object.values(this.STORAGE_KEYS).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                total += item.length + key.length;
            }
        });
        return total;
    }

    /**
     * Formatuje rozmiar w ludzko-czytelnej formie
     * @param {number} bytes - Rozmiar w bajtach
     * @returns {string} Sformatowany rozmiar
     */
    static formatSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}