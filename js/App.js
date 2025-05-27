class App {
    constructor() {
        this.users = [];
        this.taskManager = new TaskManager();
        this.currentUser = null;
    }

    addUser(name) {
        if (!name || name.trim() === '') {
            return null;
        }

        name = name.trim();

        if (this.getUserByName(name)) {
            return null; // User already exists
        }

        const user = new User(name);
        this.users.push(user);
        return user;
    }

    removeUser(name) {
        const userIndex = this.users.findIndex(u => u.name === name);
        if (userIndex !== -1) {
            // Remove user's tasks
            this.taskManager.tasks = this.taskManager.tasks.filter(task => task.user !== name);
            // Remove user
            this.users.splice(userIndex, 1);
            return true;
        }
        return false;
    }

    getUserByName(name) {
        return this.users.find(u => u.name === name) || null;
    }

    setCurrentUser(name) {
        this.currentUser = this.getUserByName(name);
    }

    saveToLocalStorage() {
        try {
            const usersData = JSON.stringify(this.users.map(u => u.toJSON()));
            const tasksData = JSON.stringify(this.taskManager.toJSON());

            localStorage.setItem('taskmaster_users', usersData);
            localStorage.setItem('taskmaster_tasks', tasksData);

            if (this.currentUser) {
                localStorage.setItem('taskmaster_current_user', this.currentUser.name);
            }
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    loadFromLocalStorage() {
        try {
            const usersData = localStorage.getItem('taskmaster_users');
            const tasksData = localStorage.getItem('taskmaster_tasks');
            const currentUserName = localStorage.getItem('taskmaster_current_user');

            if (usersData) {
                const parsedUsers = JSON.parse(usersData);
                this.users = parsedUsers.map(data => User.fromJSON(data));
            }

            if (tasksData) {
                const parsedTasks = JSON.parse(tasksData);
                this.taskManager.fromJSON(parsedTasks);
            }

            if (currentUserName) {
                this.setCurrentUser(currentUserName);
            }

            // Update user task counts
            this.updateUserStats();
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
    }

    updateUserStats() {
        // Reset all user stats first
        this.users.forEach(user => {
            user.taskCount = 0;
            user.completedTaskCount = 0;
        });

        // Count tasks for each user
        this.taskManager.tasks.forEach(task => {
            const user = this.getUserByName(task.user);
            if (user) {
                user.taskCount++;
                if (task.status === 'done') {
                    user.completedTaskCount++;
                }
            }
        });
    }
}

// Global app instance
let app = new App();

// Utility functions
function showMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="${type === 'success' ? 'success-message' : 'error-message'}">${message}</div>`;
        setTimeout(() => {
            element.innerHTML = '';
        }, 3000);
    }
}

function updateUserSelect() {
    const select = document.getElementById('currentUserSelect');
    if (select) {
        select.innerHTML = '<option value="">Wybierz użytkownika</option>';
        app.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.name;
            option.textContent = user.name;
            if (app.currentUser && app.currentUser.name === user.name) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }
}

function updateStats() {
    const container = document.getElementById('statsContainer');
    if (!container) return;

    if (app.currentUser) {
        const userTasks = app.taskManager.getUserTasks(app.currentUser.name);
        const stats = {
            total: Statistics.total(userTasks),
            completed: Statistics.completed(userTasks),
            active: Statistics.active(userTasks),
            completionRate: Statistics.completionRate(userTasks)
        };

        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Wszystkie zadania</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.active}</div>
                <div class="stat-label">Aktywne</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.completed}</div>
                <div class="stat-label">Ukończone</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.completionRate}%</div>
                <div class="stat-label">Postęp</div>
            </div>
        `;
    } else {
        container.innerHTML = '<div class="no-tasks"><h3>Wybierz użytkownika, aby zobaczyć statystyki</h3></div>';
    }
}

function renderTasks() {
    const container = document.getElementById('taskList');
    if (!container) return;

    if (!app.currentUser) {
        container.innerHTML = '<div class="no-tasks"><h3>Wybierz użytkownika, aby zobaczyć zadania</h3></div>';
        return;
    }

    let tasks = app.taskManager.getUserTasks(app.currentUser.name);

    // Apply filters
    tasks = applyFiltersToTasks(tasks);

    if (tasks.length === 0) {
        container.innerHTML = '<div class="no-tasks"><h3>Brak zadań</h3><p>Dodaj swoje pierwsze zadanie!</p></div>';
        return;
    }

    const tasksHtml = tasks.map(task => `
        <div class="task-card ${task.status} fade-in">
            <div class="task-header">
                <div class="task-meta">
                    <span class="priority-badge priority-${task.priority}">${getPriorityText(task.priority)}</span>
                    <span class="category-badge">${getCategoryText(task.category)}</span>
                    <span class="status-badge ${task.status}">${task.status === 'done' ? 'Ukończone' : 'Oczekujące'}</span>
                </div>
            </div>
            <div class="task-content">
                <h3>${task.content}</h3>
            </div>
            <div class="task-date">
                Utworzone: ${task.createdAt.toLocaleDateString('pl-PL')} ${task.createdAt.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}
            </div>
            <div class="task-actions">
                <button class="btn btn-small" onclick="toggleTaskStatus('${task.id}')">
                    ${task.status === 'done' ? '↩️ Cofnij' : '✅ Ukończ'}
                </button>
                <button class="btn btn-small" onclick="editTask('${task.id}')">✏️ Edytuj</button>
                <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">🗑️ Usuń</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = tasksHtml;
}

function applyFiltersToTasks(tasks) {
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const priorityFilter = document.getElementById('priorityFilter')?.value || 'all';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const sortBy = document.getElementById('sortBy')?.value || 'date';
    const searchInput = document.getElementById('searchInput')?.value?.toLowerCase() || '';

    // Apply filters
    let filteredTasks = tasks.filter(task => {
        const statusMatch = statusFilter === 'all' || task.status === statusFilter;
        const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
        const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;
        const searchMatch = searchInput === '' || task.content.toLowerCase().includes(searchInput);

        return statusMatch && priorityMatch && categoryMatch && searchMatch;
    });

    // Apply sorting
    filteredTasks.sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'category':
                return a.category.localeCompare(b.category);
            case 'date':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    return filteredTasks;
}

function getPriorityText(priority) {
    const priorityMap = {
        'low': '🔵 Niski',
        'medium': '🟡 Średni',
        'high': '🔴 Wysoki'
    };
    return priorityMap[priority] || priority;
}

function getCategoryText(category) {
    const categoryMap = {
        'praca': '💼 Praca',
        'nauka': '📚 Nauka',
        'hobby': '🎨 Hobby',
        'dom': '🏠 Dom',
        'inne': '📋 Inne'
    };
    return categoryMap[category] || category;
}

// Event handlers
function addUser() {
    const input = document.getElementById('userNameInput');
    const name = input?.value?.trim();
}