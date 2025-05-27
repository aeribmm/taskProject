class Task {
    constructor(content, user) {
        this.id = this.generateId();
        this.content = content;
        this.user = user.name;
        this.status = 'pending';
        this.priority = 'medium';
        this.category = 'inne';
        this.createdAt = new Date();
    }

    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    markAsDone() {
        this.status = 'done';
    }

    markAsPending() {
        this.status = 'pending';
    }

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

    static fromJSON(data) {
        const task = new Task(data.content, { name: data.user });
        task.id = data.id;
        task.status = data.status;
        task.priority = data.priority;
        task.category = data.category;
        task.createdAt = new Date(data.createdAt);
        return task;
    }
}

// TaskManager Class
class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(content, user, priority = 'medium', category = 'inne') {
        const task = new Task(content, user);
        task.priority = priority;
        task.category = category;
        this.tasks.push(task);
        return task;
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id) || null;
    }

    editTask(id, updates) {
        const task = this.getTaskById(id);
        if (task) {
            Object.assign(task, updates);
        }
    }

    getUserTasks(userName) {
        return this.tasks.filter(task => task.user === userName);
    }

    toJSON() {
        return this.tasks.map(task => task.toJSON());
    }

    fromJSON(data) {
        this.tasks = data.map(item => Task.fromJSON(item));
    }
}