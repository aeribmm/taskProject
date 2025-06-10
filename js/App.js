import Task from './classes/Task.js';
import TaskManager from './classes/TaskManager.js';
import User from './classes/User.js';
import TaskFilter from './classes/TaskFilter.js';
import LocalStorageManager from './utils/LocalStorageManager.js';
import Validator from './utils/Validator.js';

/**
 * Główna klasa aplikacji
 */
export default class App {
    constructor() {
        this.users = [];
        this.taskManager = new TaskManager();
        this.currentUser = null;
        this.settings = {};

        this.initElements();
        this.loadData();
        this.init();
    }

    /**
     * Inicjalizuje elementy DOM
     */
    initElements() {
        // Elementy użytkowników
        this.userNameInput = document.getElementById('userNameInput');
        this.currentUserSelect = document.getElementById('currentUserSelect');
        this.userMessage = document.getElementById('userMessage');
        this.addUserBtn = document.getElementById('addUserBtn');
        this.removeUserBtn = document.getElementById('removeUserBtn');

        // Elementy zadań
        this.taskForm = document.getElementById('taskForm');
        this.taskContent = document.getElementById('taskContent');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskCategory = document.getElementById('taskCategory');
        this.taskMessage = document.getElementById('taskMessage');
        this.taskList = document.getElementById('taskList');

        // Elementy filtrów
        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortBy = document.getElementById('sortBy');
        this.searchInput = document.getElementById('searchInput');
    }

    /**
     * Ładuje dane z localStorage
     */
    loadData() {
        try {
            // Ładowanie użytkowników
            this.users = LocalStorageManager.loadUsers();

            // Ładowanie zadań
            const tasksData = LocalStorageManager.loadTasks();
            tasksData.forEach(taskData => {
                const task = Task.fromJSON(taskData);
                this.taskManager.tasks.push(task);
            });

            // Ładowanie aktualnego użytkownika
            const currentUser = LocalStorageManager.loadCurrentUser();
            this.currentUser = currentUser && this.users.includes(currentUser) ? currentUser : null;

            // Ładowanie ustawień
            this.settings = LocalStorageManager.loadSettings();

        } catch (error) {
            console.error('Błąd podczas ładowania danych:', error);
            this.showMessage(this.userMessage, 'Błąd podczas ładowania danych', 'error');
        }
    }

    /**
     * Zapisuje dane do localStorage
     */
    saveData() {
        try {
            LocalStorageManager.saveUsers(this.users);
            LocalStorageManager.saveTasks(this.taskManager.tasks);
            LocalStorageManager.saveCurrentUser(this.currentUser);
            LocalStorageManager.saveSettings(this.settings);
        } catch (error) {
            console.error('Błąd podczas zapisywania danych:', error);
            this.showMessage(this.userMessage, 'Błąd podczas zapisywania danych', 'error');
        }
    }

    /**
     * Inicjalizuje aplikację
     */
    init() {
        this.renderUserOptions();
        this.setupEventListeners();
        this.renderTasks();

        // Sprawdź dostępność localStorage
        if (!LocalStorageManager.isAvailable()) {
            this.showMessage(this.userMessage,
                'LocalStorage nie jest dostępne. Dane nie będą zapisywane.', 'error');
        }
    }

    /**
     * Ustawia event listenery
     */
    setupEventListeners() {
        // Użytkownicy
        this.addUserBtn.addEventListener('click', () => this.addUser());
        this.removeUserBtn.addEventListener('click', () => this.removeUser());

        // Zadania
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filtry i sortowanie
        [this.statusFilter, this.priorityFilter, this.categoryFilter, this.sortBy, this.searchInput]
            .forEach(el => {
                el.addEventListener('change', () => this.renderTasks());
                el.addEventListener('input', () => this.renderTasks());
            });

        // Zmiana użytkownika
        this.currentUserSelect.addEventListener('change', () => {
            this.currentUser = this.currentUserSelect.value || null;
            this.saveData();
            this.renderTasks();
        });

        // Obsługa Enter w polu nazwa użytkownika
        this.userNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addUser();
            }
        });

        // Auto-zapisywanie podczas pisania
        let saveTimeout;
        [this.taskContent, this.taskPriority, this.taskCategory].forEach(el => {
            el.addEventListener('input', () => {
                if (this.settings.autoSave) {
                    clearTimeout(saveTimeout);
                    saveTimeout = setTimeout(() => this.saveData(), 1000);
                }
            });
        });
    }

    /**
     * Dodaje nowego użytkownika
     */
    addUser() {
        const userName = this.userNameInput.value.trim();

        // Walidacja
        const validation = Validator.validateUser({ name: userName });
        if (!validation.isValid) {
            this.showMessage(this.userMessage, validation.errors.join(', '), 'error');
            return;
        }

        if (this.users.includes(userName)) {
            this.showMessage(this.userMessage, 'Użytkownik już istnieje.', 'error');
            return;
        }

        // Dodanie użytkownika
        this.users.push(userName);
        this.currentUser = userName;
        this.saveData();
        this.renderUserOptions();
        this.userNameInput.value = '';
        this.showMessage(this.userMessage, `Dodano użytkownika: ${userName}`, 'success');
        this.renderTasks();
    }

    /**
     * Usuwa aktualnego użytkownika
     */
    removeUser() {
        if (!this.currentUser) {
            this.showMessage(this.userMessage, 'Wybierz użytkownika do usunięcia.', 'error');
            return;
        }

        if (!confirm(`Czy na pewno chcesz usunąć użytkownika "${this.currentUser}" i wszystkie jego zadania?`)) {
            return;
        }

        // Usunięcie użytkownika i jego zadań
        this.users = this.users.filter(user => user !== this.currentUser);
        this.taskManager.clearUserTasks(this.currentUser);
        this.currentUser = null;
        this.saveData();
        this.renderUserOptions();
        this.showMessage(this.userMessage, 'Użytkownik został usunięty.', 'success');
        this.renderTasks();
    }

    /**
     * Dodaje nowe zadanie
     */
    addTask() {
        if (!this.currentUser) {
            this.showMessage(this.taskMessage, 'Wybierz użytkownika przed dodaniem zadania.', 'error');
            return;
        }

        const formData = {
            content: this.taskContent.value.trim(),
            user: this.currentUser,
            priority: this.taskPriority.value,
            category: this.taskCategory.value
        };

        // Walidacja
        const validation = Validator.validateTaskForm(formData);
        if (!validation.isValid) {
            this.showMessage(this.taskMessage, validation.errors.join(', '), 'error');
            return;
        }

        // Pokazanie ostrzeżeń jeśli są
        if (validation.hasWarnings) {
            validation.warnings.forEach(warning => {
                console.warn('Ostrzeżenie:', warning);
            });
        }

        try {
            // Dodanie zadania
            this.taskManager.addTask(
                formData.content,
                formData.user,
                formData.priority,
                formData.category
            );

            this.saveData();
            this.taskForm.reset();
            this.taskPriority.value = 'medium'; // Reset do wartości domyślnej
            this.showMessage(this.taskMessage, 'Zadanie zostało dodane.', 'success');
            this.renderTasks();
        } catch (error) {
            this.showMessage(this.taskMessage, error.message, 'error');
        }
    }

    /**
     * Renderuje opcje użytkowników
     */
    renderUserOptions() {
        this.currentUserSelect.innerHTML = '<option value="">Wybierz użytkownika</option>';

        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            if (user === this.currentUser) {
                option.selected = true;
            }
            this.currentUserSelect.appendChild(option);
        });
    }

    /**
     * Renderuje listę zadań
     */
    renderTasks() {
        if (!this.currentUser) {
            this.taskList.innerHTML = this.createNoTasksHTML('Wybierz użytkownika',
                'Aby zobaczyć zadania, wybierz użytkownika z listy.');
            return;
        }

        let tasks = this.taskManager.getUserTasks(this.currentUser);

        // Aplikowanie filtrów
        const filters = {
            status: this.statusFilter.value,
            priority: this.priorityFilter.value,
            category: this.categoryFilter.value,
            searchTerm: this.searchInput.value
        };

        tasks = TaskFilter.applyAllFilters(tasks, filters);

        // Sortowanie
        const sortBy = this.sortBy.value;
        tasks = TaskFilter.sortTasks(tasks, sortBy);

        if (tasks.length === 0) {
            this.taskList.innerHTML = this.createNoTasksHTML('Brak zadań',
                'Nie znaleziono zadań spełniających kryteria.');
            return;
        }

        // Renderowanie zadań
        this.taskList.innerHTML = '';
        tasks.forEach(task => {
            const card = this.createTaskCard(task);
            this.taskList.appendChild(card);
        });
    }

    /**
     * Tworzy HTML dla braku zadań
     */
    createNoTasksHTML(title, message) {
        return `
            <div class="no-tasks">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Tworzy kartę zadania
     */
    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card fade-in' + (task.status === 'done' ? ' done' : '');

        card.innerHTML = `
            <div class="task-header">
                <div class="task-meta">
                    <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
                    <span class="category-badge">${task.category}</span>
                    <span class="status-badge ${task.status}">
                        ${task.status === 'done' ? 'Ukończone' : 'Oczekujące'}
                    </span>
                </div>
                <button class="btn btn-small btn-danger delete-btn" title="Usuń zadanie">🗑️</button>
            </div>
            <div class="task-content">
                <h3>${this.escapeHtml(task.content)}</h3>
            </div>
            <div class="task-date">${task.getFormattedDate()}</div>
            <div class="task-actions">
                <button class="btn btn-small toggle-btn ${task.status === 'done' ? '' : 'btn-success'}">
                    ${task.status === 'done' ? '↩️ Oznacz jako oczekujące' : '✅ Oznacz jako ukończone'}
                </button>
                <button class="btn btn-small edit-btn">✏️ Edytuj</button>
            </div>
        `;

        this.setupTaskCardEvents(card, task);
        return card;
    }

    /**
     * Ustawia event listenery dla karty zadania
     */
    setupTaskCardEvents(card, task) {
        // Usuwanie zadania
        card.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
                this.taskManager.removeTask(task.id);
                this.saveData();
                this.renderTasks();
            }
        });

        // Przełączanie statusu
        card.querySelector('.toggle-btn').addEventListener('click', () => {
            this.taskManager.toggleTaskStatus(task.id);
            this.saveData();
            this.renderTasks();
        });

        // Edycja zadania
        card.querySelector('.edit-btn').addEventListener('click', () => {
            this.editTask(task);
        });
    }

    /**
     * Edytuje zadanie
     */
    editTask(task) {
        const newContent = prompt('Edytuj treść zadania:', task.content);
        if (newContent === null) return; // Anulowano

        const validation = Validator.validateTaskContent(newContent);
        if (!validation) {
            alert('Treść zadania musi mieć od 3 do 500 znaków');
            return;
        }

        const newPriority = prompt('Priorytet (low/medium/high):', task.priority);
        if (newPriority && !Validator.isValidPriority(newPriority)) {
            alert('Nieprawidłowy priorytet. Dozwolone: low, medium, high');
            return;
        }

        const newCategory = prompt('Kategoria (praca/nauka/hobby/dom/inne):', task.category);
        if (newCategory && !Validator.isValidCategory(newCategory)) {
            alert('Nieprawidłowa kategoria. Dozwolone: praca, nauka, hobby, dom, inne');
            return;
        }

        // Aktualizacja zadania
        this.taskManager.editTask(task.id, {
            content: newContent.trim(),
            priority: newPriority || task.priority,
            category: newCategory || task.category
        });

        this.saveData();
        this.renderTasks();
    }

    /**
     * Escapuje HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Pokazuje wiadomość użytkownikowi
     */
    showMessage(container, message, type = 'info') {
        container.innerHTML = `
            <div class="message ${type === 'error' ? 'error' : 'success'}">
                ${message}
            </div>
        `;

        // Auto-ukrywanie wiadomości po 3 sekundach
        setTimeout(() => {
            if (container.innerHTML.includes(message)) {
                container.innerHTML = '';
            }
        }, 3000);
    }

    /**
     * Eksportuje dane do pliku JSON
     */
    exportData() {
        try {
            const data = LocalStorageManager.exportAll();
            const jsonString = JSON.stringify(data, null, 2);

            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `taskmaster_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);

            this.showMessage(this.userMessage, 'Dane zostały wyeksportowane', 'success');
        } catch (error) {
            console.error('Błąd eksportu:', error);
            this.showMessage(this.userMessage, 'Błąd podczas eksportu danych', 'error');
        }
    }

    /**
     * Importuje dane z pliku JSON
     */
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const success = LocalStorageManager.importAll(data);

                if (success) {
                    location.reload(); // Przeładuj stronę aby załadować nowe dane
                } else {
                    this.showMessage(this.userMessage, 'Błąd podczas importu danych', 'error');
                }
            } catch (error) {
                console.error('Błąd importu:', error);
                this.showMessage(this.userMessage, 'Nieprawidłowy format pliku', 'error');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Czyści wszystkie dane
     */
    clearAllData() {
        if (!confirm('Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.')) {
            return;
        }

        LocalStorageManager.clearAll();
        location.reload();
    }

    /**
     * Zwraca statystyki aplikacji
     */
    getStatistics() {
        const stats = {
            totalUsers: this.users.length,
            totalTasks: this.taskManager.getTasksCount(),
            storageSize: LocalStorageManager.formatSize(LocalStorageManager.getAppStorageSize())
        };

        if (this.currentUser) {
            stats.currentUserStats = this.taskManager.getStatistics(this.currentUser);
        }

        return stats;
    }
}