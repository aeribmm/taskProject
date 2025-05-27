import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(content, user) {
        const task = new Task(content, user);
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

    toJSON() {
        return this.tasks.map(task => task.toJSON());
    }

    fromJSON(data) {
        this.tasks = data.map(item => Task.fromJSON(item));
    }
}

export default TaskManager;
