class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(content, user, priority = 'medium', category = 'inne') {
        if (!content || !content.trim()) {
            throw new Error('Task content cannot be empty');
        }

        if (!user) {
            throw new Error('User is required');
        }

        const task = new Task(content, user);
        task.setPriority(priority);
        task.setCategory(category);
        this.tasks.push(task);
        return task;
    }

    removeTask(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks.length < initialLength;
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id) || null;
    }

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

    toggleTaskStatus(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.toggleStatus();
            return task;
        }
        return null;
    }

    getUserTasks(userName) {
        return this.tasks.filter(task => task.user === userName);
    }

    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }

    getTasksByPriority(priority) {
        return this.tasks.filter(task => task.priority === priority);
    }

    getTasksByCategory(category) {
        return this.tasks.filter(task => task.category === category);
    }

    getAllTasks() {
        return [...this.tasks];
    }

    getTasksCount() {
        return this.tasks.length;
    }

    getUserTasksCount(userName) {
        return this.getUserTasks(userName).length;
    }

    toJSON() {
        return this.tasks.map(task => task.toJSON());
    }

    fromJSON(data) {
        if (Array.isArray(data)) {
            this.tasks = data.map(item => Task.fromJSON(item));
        } else {
            this.tasks = [];
        }
    }

    clearAllTasks() {
        this.tasks = [];
    }

    clearUserTasks(userName) {
        this.tasks = this.tasks.filter(task => task.user !== userName);
    }
}