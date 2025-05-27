class Task {
    constructor(content, user) {
        this.id = this.generateId();
        this.content = content;
        this.user = typeof user === 'string' ? user : user.name;
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

    toggleStatus() {
        this.status = this.status === 'done' ? 'pending' : 'done';
    }

    setPriority(priority) {
        if (['low', 'medium', 'high'].includes(priority)) {
            this.priority = priority;
        }
    }

    setCategory(category) {
        if (['praca', 'nauka', 'hobby', 'dom', 'inne'].includes(category)) {
            this.category = category;
        }
    }

    updateContent(content) {
        if (content && content.trim()) {
            this.content = content.trim();
        }
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
        const task = new Task(data.content, data.user);
        task.id = data.id;
        task.status = data.status;
        task.priority = data.priority;
        task.category = data.category;
        task.createdAt = new Date(data.createdAt);
        return task;
    }
}