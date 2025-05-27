class Statistics {
    static total(tasks) {
        return tasks.length;
    }

    static completed(tasks) {
        return tasks.filter(task => task.status === 'done').length;
    }

    static active(tasks) {
        return tasks.filter(task => task.status === 'pending').length;
    }

    static completionRate(tasks) {
        const total = this.total(tasks);
        if (total === 0) return 0;
        return Math.round((this.completed(tasks) / total) * 100);
    }
}