import TaskFilter from "./classes/TaskFilter.js";

export default class App {

    constructor() {
        this.users = [];
        this.tasks = {};
        this.currentUser = null;

        this.userNameInput = document.getElementById('userNameInput');
        this.currentUserSelect = document.getElementById('currentUserSelect');
        this.userMessage = document.getElementById('userMessage');

        this.taskForm = document.getElementById('taskForm');
        this.taskContent = document.getElementById('taskContent');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskCategory = document.getElementById('taskCategory');
        this.taskMessage = document.getElementById('taskMessage');
        this.taskList = document.getElementById('taskList');

        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortBy = document.getElementById('sortBy');
        this.searchInput = document.getElementById('searchInput');
        this.loadData();
        this.init();
        this.initFilters();
    }
    initFilters() {
        this.statusFilter?.addEventListener('change', () => {
            const status = this.statusFilter.value;
            const filteredTasks = TaskFilter.filterByStatus(Object.values(this.tasks), status);
            this.renderTasks(filteredTasks);
        });

        this.priorityFilter?.addEventListener('change', () => {
            const priority = this.priorityFilter.value;
            const filteredTasks = TaskFilter.filterByPriority(Object.values(this.tasks), priority);
            this.renderTasks(filteredTasks);
        });

        this.categoryFilter?.addEventListener('change', () => {
            const category = this.categoryFilter.value;
            const filteredTasks = TaskFilter.filterByCategory(Object.values(this.tasks), category);
            this.renderTasks(filteredTasks);
        });
    }
    loadData() {
        // Загружаем из localStorage
        const usersData = localStorage.getItem('users');
        const tasksData = localStorage.getItem('tasks');
        const currentUser = localStorage.getItem('currentUser');

        this.users = usersData ? JSON.parse(usersData) : [];
        this.tasks = tasksData ? JSON.parse(tasksData) : {};

        // Восстановим даты из строк в объекты Date
        for (const user in this.tasks) {
            this.tasks[user].forEach(task => {
                task.createdAt = new Date(task.createdAt);
            });
        }

        this.currentUser = currentUser && this.users.includes(currentUser) ? currentUser : null;
    }

    saveData() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('currentUser', this.currentUser);
    }

    init() {
        this.renderUserOptions();

        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        [this.statusFilter, this.priorityFilter, this.categoryFilter, this.sortBy, this.searchInput].forEach(el => {
            el.addEventListener('change', () => this.renderTasks());
            el.addEventListener('input', () => this.renderTasks());
        });

        this.currentUserSelect.onchange = () => {
            this.currentUser = this.currentUserSelect.value || null;
            this.saveData();
            this.renderTasks();
        }

        this.renderTasks();
    }

    addUser(name) {
        const userName = this.userNameInput.value.trim();
        if (!userName) {
            this.showMessage(this.userMessage, 'Podaj nazwę użytkownika.', 'error');
            return;
        }

        if (this.users.includes(userName)) {
            this.showMessage(this.userMessage, 'Użytkownik już istnieje.', 'error');
            return;
        }

        this.users.push(userName);
        this.tasks[userName] = [];
        this.currentUser = userName;
        this.saveData();
        this.renderUserOptions();
        this.userNameInput.value = '';
        this.showMessage(this.userMessage, `Dodano użytkownika: ${userName}`, 'success');
        this.renderTasks();
    }

    removeUser() {
        if (!this.currentUser) {
            this.showMessage(this.userMessage, 'Wybierz użytkownika do usunięcia.', 'error');
            return;
        }

        this.users = this.users.filter(user => user !== this.currentUser);
        delete this.tasks[this.currentUser];
        this.currentUser = null;
        this.saveData();
        this.renderUserOptions();
        this.showMessage(this.userMessage, 'Użytkownik został usunięty.', 'success');
        this.renderTasks();
    }

    addTask() {
        if (!this.currentUser) {
            this.showMessage(this.taskMessage, 'Wybierz użytkownika przed dodaniem zadania.', 'error');
            return;
        }

        const content = this.taskContent.value.trim();
        if (!content) {
            this.showMessage(this.taskMessage, 'Treść zadania nie może być pusta.', 'error');
            return;
        }

        const priority = this.taskPriority.value;
        const category = this.taskCategory.value;

        const newTask = {
            id: Date.now(),
            content,
            priority,
            category,
            status: 'pending',
            createdAt: new Date()
        };

        this.tasks[this.currentUser].push(newTask);
        this.saveData();
        this.taskForm.reset();
        this.showMessage(this.taskMessage, 'Zadanie zostało dodane.', 'success');
        this.renderTasks();
    }

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

    renderTasks() {
        if (!this.currentUser) {
            this.taskList.innerHTML = '<p class="no-tasks">Wybierz użytkownika, aby zobaczyć jego zadania.</p>';
            return;
        }

        let tasks = this.tasks[this.currentUser] || [];

        const statusFilter = this.statusFilter.value;
        const priorityFilter = this.priorityFilter.value;
        const categoryFilter = this.categoryFilter.value;
        const sortBy = this.sortBy.value;
        const search = this.searchInput.value.toLowerCase();

        if (statusFilter !== 'all') {
            tasks = tasks.filter(task => task.status === statusFilter);
        }

        if (priorityFilter !== 'all') {
            tasks = tasks.filter(task => task.priority === priorityFilter);
        }

        if (categoryFilter !== 'all') {
            tasks = tasks.filter(task => task.category === categoryFilter);
        }

        if (search) {
            tasks = tasks.filter(task => task.content.toLowerCase().includes(search));
        }

        if (sortBy === 'date') {
            tasks.sort((a, b) => b.createdAt - a.createdAt);
        } else if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        } else if (sortBy === 'category') {
            tasks.sort((a, b) => a.category.localeCompare(b.category));
        }

        if (tasks.length === 0) {
            this.taskList.innerHTML = '<p class="no-tasks">Brak zadań do wyświetlenia.</p>';
            return;
        }

        this.taskList.innerHTML = '';
        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'task-card' + (task.status === 'done' ? ' done' : '');

            card.innerHTML = `
                <div class="task-header">
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
                        <span class="category-badge">${task.category}</span>
                        <span class="status-badge ${task.status}">${task.status === 'done' ? 'Ukończone' : 'Oczekujące'}</span>
                    </div>
                    <button class="btn btn-small btn-danger" title="Usuń zadanie">🗑️</button>
                </div>
                <div class="task-content">
                    <h3>${task.content}</h3>
                </div>
                <div class="task-date">${task.createdAt.toLocaleString()}</div>
                <div class="task-actions">
                    <button class="btn btn-small btn${task.status === 'done' ? '' : ' btn-success'}">
                        ${task.status === 'done' ? 'Oznacz jako oczekujące' : 'Oznacz jako ukończone'}
                    </button>
                </div>
            `;

            card.querySelector('.btn-danger').onclick = () => {
                this.tasks[this.currentUser] = this.tasks[this.currentUser].filter(t => t.id !== task.id);
                this.saveData();
                this.renderTasks();
            };

            card.querySelector('.task-actions button').onclick = () => {
                task.status = task.status === 'done' ? 'pending' : 'done';
                this.saveData();
                this.renderTasks();
            };

            this.taskList.appendChild(card);
        });
    }

    showMessage(container, message, type = 'info') {
        container.innerHTML = `
            <div class="${type === 'error' ? 'error-message' : 'success-message'}">
                ${message}
            </div>
        `;
        setTimeout(() => (container.innerHTML = ''), 3000);
    }
}
