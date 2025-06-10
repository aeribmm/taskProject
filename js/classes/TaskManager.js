import Task from './Task.js';

/**
 * Klasa TaskManager - zarządza kolekcją zadań
 */
export default class TaskManager {
    constructor() {
        this.tasks = [];
    }

    /**
     * Dodaje nowe zadanie
     * @param {string} content - Treść zadania
     * @param {string} user - Nazwa użytkownika
     * @param {string} priority - Priorytet zadania
     * @param {string} category - Kategoria zadania
     * @returns {Task} Utworzone zadanie
     * @throws {Error} Jeśli dane są nieprawidłowe
     */
    addTask(content, user, priority = 'medium', category = 'inne') {
        if (!content || !content.trim()) {
            throw new Error('Treść zadania nie może być pusta');
        }

        if (!user || !user.trim()) {
            throw new Error('Użytkownik jest wymagany');
        }

        const task = new Task(content.trim(), user.trim());
        task.setPriority(priority);
        task.setCategory(category);
        this.tasks.push(task);
        return task;
    }

    /**
     * Usuwa zadanie po ID
     * @param {string} id - ID zadania do usunięcia
     * @returns {boolean} True jeśli zadanie zostało usunięte
     */
    removeTask(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks.length < initialLength;
    }

    /**
     * Znajduje zadanie po ID
     * @param {string} id - ID zadania
     * @returns {Task|null} Znalezione zadanie lub null
     */
    getTaskById(id) {
        return this.tasks.find(task => task.id === id) || null;
    }

    /**
     * Edytuje zadanie
     * @param {string} id - ID zadania
     * @param {Object} updates - Aktualizacje do zastosowania
     * @returns {boolean} True jeśli zadanie zostało zaktualizowane
     */
    editTask(id, updates) {
        const task = this.getTaskById(id);
        if (!task) {
            return false;
        }

        if (updates.content !== undefined) {
            task.updateContent(updates.content);
        }
        if (updates.priority !== undefined) {
            task.setPriority(updates.priority);
        }
        if (updates.category !== undefined) {
            task.setCategory(updates.category);
        }
        if (updates.status !== undefined) {
            task.status = updates.status;
        }

        return true;
    }

    /**
     * Przełącza status zadania
     * @param {string} id - ID zadania
     * @returns {Task|null} Zaktualizowane zadanie lub null
     */
    toggleTaskStatus(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.toggleStatus();
            return task;
        }
        return null;
    }

    /**
     * Zwraca zadania określonego użytkownika
     * @param {string} userName - Nazwa użytkownika
     * @returns {Task[]} Tablica zadań użytkownika
     */
    getUserTasks(userName) {
        return this.tasks.filter(task => task.belongsToUser(userName));
    }

    /**
     * Zwraca zadania o określonym statusie
     * @param {string} status - Status zadań (pending/done)
     * @returns {Task[]} Tablica zadań o danym statusie
     */
    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }

    /**
     * Zwraca zadania o określonym priorytecie
     * @param {string} priority - Priorytet zadań
     * @returns {Task[]} Tablica zadań o danym priorytecie
     */
    getTasksByPriority(priority) {
        return this.tasks.filter(task => task.priority === priority);
    }

    /**
     * Zwraca zadania o określonej kategorii
     * @param {string} category - Kategoria zadań
     * @returns {Task[]} Tablica zadań o danej kategorii
     */
    getTasksByCategory(category) {
        return this.tasks.filter(task => task.category === category);
    }

    /**
     * Zwraca wszystkie zadania
     * @returns {Task[]} Kopia tablicy wszystkich zadań
     */
    getAllTasks() {
        return [...this.tasks];
    }

    /**
     * Zwraca liczbę wszystkich zadań
     * @returns {number} Liczba zadań
     */
    getTasksCount() {
        return this.tasks.length;
    }

    /**
     * Zwraca liczbę zadań użytkownika
     * @param {string} userName - Nazwa użytkownika
     * @returns {number} Liczba zadań użytkownika
     */
    getUserTasksCount(userName) {
        return this.getUserTasks(userName).length;
    }

    /**
     * Zwraca liczbę ukończonych zadań użytkownika
     * @param {string} userName - Nazwa użytkownika
     * @returns {number} Liczba ukończonych zadań
     */
    getUserCompletedTasksCount(userName) {
        return this.getUserTasks(userName).filter(task => task.isDone()).length;
    }

    /**
     * Zwraca liczbę oczekujących zadań użytkownika
     * @param {string} userName - Nazwa użytkownika
     * @returns {number} Liczba oczekujących zadań
     */
    getUserPendingTasksCount(userName) {
        return this.getUserTasks(userName).filter(task => task.isPending()).length;
    }

    /**
     * Usuwa wszystkie zadania użytkownika
     * @param {string} userName - Nazwa użytkownika
     */
    clearUserTasks(userName) {
        this.tasks = this.tasks.filter(task => !task.belongsToUser(userName));
    }

    /**
     * Usuwa wszystkie zadania
     */
    clearAllTasks() {
        this.tasks = [];
    }

    /**
     * Wyszukuje zadania po treści
     * @param {string} searchTerm - Szukany tekst
     * @returns {Task[]} Tablica znalezionych zadań
     */
    searchTasks(searchTerm) {
        if (!searchTerm || !searchTerm.trim()) {
            return this.getAllTasks();
        }

        const term = searchTerm.toLowerCase().trim();
        return this.tasks.filter(task =>
            task.content.toLowerCase().includes(term)
        );
    }

    /**
     * Sortuje zadania według określonego kryterium
     * @param {Task[]} tasks - Tablica zadań do posortowania
     * @param {string} sortBy - Kryterium sortowania (date, priority, category)
     * @returns {Task[]} Posortowana tablica zadań
     */
    sortTasks(tasks, sortBy) {
        const tasksCopy = [...tasks];

        switch (sortBy) {
            case 'date':
                return tasksCopy.sort((a, b) => b.createdAt - a.createdAt);

            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return tasksCopy.sort((a, b) =>
                    priorityOrder[b.priority] - priorityOrder[a.priority]
                );

            case 'category':
                return tasksCopy.sort((a, b) =>
                    a.category.localeCompare(b.category)
                );

            default:
                return tasksCopy;
        }
    }

    /**
     * Eksportuje zadania do formatu JSON
     * @returns {string} JSON string z zadaniami
     */
    exportToJSON() {
        return JSON.stringify(this.tasks.map(task => task.toJSON()), null, 2);
    }

    /**
     * Importuje zadania z formatu JSON
     * @param {string} jsonString - JSON string z zadaniami
     */
    importFromJSON(jsonString) {
        try {
            const tasksData = JSON.parse(jsonString);
            this.tasks = tasksData.map(taskData => Task.fromJSON(taskData));
        } catch (error) {
            throw new Error('Nieprawidłowy format danych JSON');
        }
    }

    /**
     * Zwraca statystyki zadań
     * @param {string} userName - Nazwa użytkownika (opcjonalne)
     * @returns {Object} Obiekt ze statystykami
     */
    getStatistics(userName = null) {
        const tasks = userName ? this.getUserTasks(userName) : this.getAllTasks();

        const total = tasks.length;
        const completed = tasks.filter(task => task.isDone()).length;
        const pending = tasks.filter(task => task.isPending()).length;

        const byPriority = {
            high: tasks.filter(task => task.priority === 'high').length,
            medium: tasks.filter(task => task.priority === 'medium').length,
            low: tasks.filter(task => task.priority === 'low').length
        };

        const byCategory = {};
        ['praca', 'nauka', 'hobby', 'dom', 'inne'].forEach(category => {
            byCategory[category] = tasks.filter(task => task.category === category).length;
        });

        return {
            total,
            completed,
            pending,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            byPriority,
            byCategory
        };
    }
}