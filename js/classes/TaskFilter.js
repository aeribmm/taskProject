class TaskFilter {
    static filterByStatus(tasks, status) {
        return tasks.filter(task => task.status === status);
    }

    static filterByPriority(tasks, priority) {
        return tasks.filter(task => task.priority === priority);
    }

    static filterByCategory(tasks, category) {
        return tasks.filter(task => task.category === category);
    }
}

export default TaskFilter;
