/**
 * Klasa TaskFilter - zawiera metody do filtrowania zadań
 */
export default class TaskFilter {
    /**
     * Filtruje zadania po statusie
     * @param {Task[]} tasks - Tablica zadań
     * @param {string} status - Status do filtrowania
     * @returns {Task[]} Przefiltrowane zadania
     */
    static filterByStatus(tasks, status) {
        if (status === 'all') {
            return tasks;
        }
        return tasks.filter(task => task.status === status);
    }

    /**
     * Filtruje zadania po priorytecie
     * @param {Task[]} tasks - Tablica zadań
     * @param {string} priority - Priorytet do filtrowania
     * @returns {Task[]} Przefiltrowane zadania
     */
    static filterByPriority(tasks, priority) {
        if (priority === 'all') {
            return tasks;
        }
        return tasks.filter(task => task.priority === priority);
    }

    /**
     * Filtruje zadania po kategorii
     * @param {Task[]} tasks - Tablica zadań
     * @param {string} category - Kategoria do filtrowania
     * @returns {Task[]} Przefiltrowane zadania
     */
    static filterByCategory(tasks, category) {
        if (category === 'all') {
            return tasks;
        }
        return tasks.filter(task => task.category === category);
    }

    /**
     * Filtruje zadania po użytkowniku
     * @param {Task[]} tasks - Tablica zadań
     * @param {string} userName - Nazwa użytkownika
     * @returns {Task[]} Przefiltrowane zadania
     */
    static filterByUser(tasks, userName) {
        if (!userName) {
            return tasks;
        }
        return tasks.filter(task => task.user === userName);
    }

    /**
     * Filtruje zadania po tekście wyszukiwania
     * @param {Task[]} tasks - Tablica zadań
     * @param {string} searchTerm - Tekst do wyszukania
     * @returns {Task[]} Przefiltrowane zadania
     */
    static filterBySearchTerm(tasks, searchTerm) {
        if (!searchTerm || !searchTerm.trim()) {
            return tasks;
        }

        const term = searchTerm.toLowerCase().trim();
        return tasks.filter(task =>
            task.content.toLowerCase().includes(term)
        );
    }

    /**
     * Filtruje zadania po dacie utworzenia
     * @param {Task[]} tasks - Tablica zadań
     * @param {Date} fromDate - Data od
     * @param {Date} toDate - Data do
     * @returns {Task[]} Przefiltrowane zadania
     */
    static filterByDateRange(tasks, fromDate, toDate) {
        return tasks.filter(task => {
            const taskDate = task.createdAt;

            if (fromDate && taskDate < fromDate) {
                return false;
            }

            if (toDate && taskDate > toDate) {
                return false;
            }

            return true;
        });
    }

    /**
     * Filtruje zadania utworzone dzisiaj
     * @param {Task[]} tasks - Tablica zadań
     * @returns {Task[]} Zadania z dzisiaj
     */
    static filterByToday(tasks) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.filterByDateRange(tasks, today, tomorrow);
    }

    /**
     * Filtruje zadania utworzone w tym tygodniu
     * @param {Task[]} tasks - Tablica zadań
     * @returns {Task[]} Zadania z tego tygodnia
     */
    static filterByThisWeek(tasks) {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        return tasks.filter(task => task.createdAt >= weekStart);
    }

    /**
     * Zastosowuje wszystkie filtry jednocześnie
     * @param {Task[]} tasks - Tablica zadań
     * @param {Object} filters - Obiekt z filtrami
     * @returns {Task[]} Przefiltrowane zadania
     */
    static applyAllFilters(tasks, filters) {
        let filteredTasks = tasks;

        if (filters.status) {
            filteredTasks = this.filterByStatus(filteredTasks, filters.status);
        }

        if (filters.priority) {
            filteredTasks = this.filterByPriority(filteredTasks, filters.priority);
        }

        if (filters.category) {
            filteredTasks = this.filterByCategory(filteredTasks, filters.category);
        }

        if (filters.user) {
            filteredTasks = this.filterByUser(filteredTasks, filters.user);
        }

        if (filters.searchTerm) {
            filteredTasks = this.filterBySearchTerm(filteredTasks, filters.searchTerm);
        }

        if (filters.fromDate || filters.toDate) {
            filteredTasks = this.filterByDateRange(
                filteredTasks,
                filters.fromDate,
                filters.toDate
            );
        }

        return filteredTasks;
    }

    /**
     * Sortuje zadania według określonego kryterium
     * @param {Task[]} tasks - Tablica zadań
     * @param {string} sortBy - Kryterium sortowania
     * @param {string} order - Kierunek sortowania (asc/desc)
     * @returns {Task[]} Posortowane zadania
     */
    static sortTasks(tasks, sortBy, order = 'desc') {
        const tasksCopy = [...tasks];
        const direction = order === 'asc' ? 1 : -1;

        switch (sortBy) {
            case 'date':
                return tasksCopy.sort((a, b) =>
                    direction * (b.createdAt - a.createdAt)
                );

            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return tasksCopy.sort((a, b) =>
                    direction * (priorityOrder[b.priority] - priorityOrder[a.priority])
                );

            case 'category':
                return tasksCopy.sort((a, b) =>
                    direction * a.category.localeCompare(b.category)
                );

            case 'content':
                return tasksCopy.sort((a, b) =>
                    direction * a.content.localeCompare(b.content)
                );

            case 'status':
                return tasksCopy.sort((a, b) =>
                    direction * a.status.localeCompare(b.status)
                );

            default:
                return tasksCopy;
        }
    }

    /**
     * Grupuje zadania według określonego kryterium
     * @param {Task[]} tasks - Tablica zadań
     * @param {string} groupBy - Kryterium grupowania
     * @returns {Object} Obiekt z pogrupowanymi zadaniami
     */
    static groupTasks(tasks, groupBy) {
        const groups = {};

        tasks.forEach(task => {
            let key;

            switch (groupBy) {
                case 'status':
                    key = task.status;
                    break;
                case 'priority':
                    key = task.priority;
                    break;
                case 'category':
                    key = task.category;
                    break;
                case 'user':
                    key = task.user;
                    break;
                case 'date':
                    key = task.createdAt.toDateString();
                    break;
                default:
                    key = 'all';
            }

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(task);
        });

        return groups;
    }

    /**
     * Zwraca zadania o wysokim priorytecie
     * @param {Task[]} tasks - Tablica zadań
     * @returns {Task[]} Zadania o wysokim priorytecie
     */
    static getHighPriorityTasks(tasks) {
        return this.filterByPriority(tasks, 'high');
    }

    /**
     * Zwraca ukończone zadania
     * @param {Task[]} tasks - Tablica zadań
     * @returns {Task[]} Ukończone zadania
     */
    static getCompletedTasks(tasks) {
        return this.filterByStatus(tasks, 'done');
    }

    /**
     * Zwraca oczekujące zadania
     * @param {Task[]} tasks - Tablica zadań
     * @returns {Task[]} Oczekujące zadania
     */
    static getPendingTasks(tasks) {
        return this.filterByStatus(tasks, 'pending');
    }
}