/**
 * Klasa Task - reprezentuje pojedyncze zadanie
 */
export default class Task {
    constructor(content, user) {
        this.id = this.generateId();
        this.content = content;
        this.user = user;
        this.status = 'pending'; // pending | done
        this.priority = 'medium'; // low | medium | high
        this.category = 'inne'; // praca | nauka | hobby | dom | inne
        this.createdAt = new Date();
    }

    /**
     * Generuje unikalny identyfikator zadania
     * @returns {string} Unikalny ID
     */
    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Oznacza zadanie jako ukończone
     */
    markAsDone() {
        this.status = 'done';
    }

    /**
     * Oznacza zadanie jako oczekujące
     */
    markAsPending() {
        this.status = 'pending';
    }

    /**
     * Przełącza status zadania
     */
    toggleStatus() {
        this.status = this.status === 'done' ? 'pending' : 'done';
    }

    /**
     * Ustawia priorytet zadania
     * @param {string} priority - Priorytet (low, medium, high)
     */
    setPriority(priority) {
        if (['low', 'medium', 'high'].includes(priority)) {
            this.priority = priority;
        }
    }

    /**
     * Ustawia kategorię zadania
     * @param {string} category - Kategoria zadania
     */
    setCategory(category) {
        if (['praca', 'nauka', 'hobby', 'dom', 'inne'].includes(category)) {
            this.category = category;
        }
    }

    /**
     * Aktualizuje treść zadania
     * @param {string} content - Nowa treść zadania
     */
    updateContent(content) {
        if (content && content.trim()) {
            this.content = content.trim();
        }
    }

    /**
     * Konwertuje zadanie do formatu JSON
     * @returns {Object} Obiekt JSON reprezentujący zadanie
     */
    toJSON() {
        return {
            id: this.id,
            content: this.content,
            user: this.user,
            status: this.status,
            priority: this.priority,
            category: this.category,
            createdAt: this.createdAt.toISOString()
        };
    }

    /**
     * Tworzy instancję Task z obiektu JSON
     * @param {Object} data - Dane zadania
     * @returns {Task} Nowa instancja Task
     */
    static fromJSON(data) {
        const task = new Task(data.content, data.user);
        task.id = data.id;
        task.status = data.status;
        task.priority = data.priority;
        task.category = data.category;
        task.createdAt = new Date(data.createdAt);
        return task;
    }

    /**
     * Sprawdza czy zadanie należy do określonego użytkownika
     * @param {string} userName - Nazwa użytkownika
     * @returns {boolean} True jeśli zadanie należy do użytkownika
     */
    belongsToUser(userName) {
        return this.user === userName;
    }

    /**
     * Sprawdza czy zadanie jest ukończone
     * @returns {boolean} True jeśli zadanie jest ukończone
     */
    isDone() {
        return this.status === 'done';
    }

    /**
     * Sprawdza czy zadanie jest oczekujące
     * @returns {boolean} True jeśli zadanie jest oczekujące
     */
    isPending() {
        return this.status === 'pending';
    }

    /**
     * Zwraca wiek zadania w dniach
     * @returns {number} Liczba dni od utworzenia zadania
     */
    getAgeInDays() {
        const now = new Date();
        const diffTime = Math.abs(now - this.createdAt);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Zwraca sformatowaną datę utworzenia
     * @returns {string} Sformatowana data
     */
    getFormattedDate() {
        return this.createdAt.toLocaleString('pl-PL');
    }
}