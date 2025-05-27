export default class App {
    constructor() {
        this.users = [];
        this.tasks = {};  // задачи для каждого пользователя, например: { userName: [task1, task2] }
        this.currentUser = null;

        // Элементы управления
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

        this.init();
    }

    init() {
        this.renderUserOptions();

        // Добавление задачи по форме
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Применение фильтров
        [this.statusFilter, this.priorityFilter, this.categoryFilter, this.sortBy, this.searchInput].forEach(el => {
            el.addEventListener('change', () => this.renderTasks());
            el.addEventListener('input', () => this.renderTasks());
        });

        // Выбор пользователя — обновляем список задач
        this.currentUserSelect.onchange = () => {
            this.currentUser = this.currentUserSelect.value || null;
            this.renderTasks();
        }
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
        this.tasks[userName] = [];  // инициализируем пустой массив задач
        this.currentUser = userName;
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
            status: 'pending',  // статус по умолчанию — ожидает
            createdAt: new Date()
        };

        this.tasks[this.currentUser].push(newTask);
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

        // Фильтры
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

        // Сортировка
        if (sortBy === 'date') {
            tasks.sort((a, b) => b.createdAt - a.createdAt);
        } else if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        } else if (sortBy === 'category') {
            tasks.sort((a, b) => a.category.localeCompare(b.category));
        }

        // Отображение
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

            // Кнопка удалить задачу
            card.querySelector('.btn-danger').onclick = () => {
                this.tasks[this.currentUser] = this.tasks[this.currentUser].filter(t => t.id !== task.id);
                this.renderTasks();
            };

            // Кнопка изменить статус
            card.querySelector('.task-actions button').onclick = () => {
                task.status = task.status === 'done' ? 'pending' : 'done';
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
