import { v4 as uuidv4 } from 'uuid';

class Task {
    constructor(content, user) {
        this.id = uuidv4();
        this.content = content;
        this.user = user.name;
        this.status = 'pending';
        this.priority = 'medium';
        this.category = 'general';
        this.createdAt = new Date();
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

export default Task;
