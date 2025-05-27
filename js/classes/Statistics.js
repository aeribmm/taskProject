class Statistics {
    static total(tasks) {
        return Array.isArray(tasks) ? tasks.length : 0;
    }

    static completed(tasks) {
        if (!Array.isArray(tasks)) return 0;
        return tasks.filter(task => task.status === 'done').length;
    }

    static active(tasks) {
        if (!Array.isArray(tasks)) return 0;
        return tasks.filter(task => task.status === 'pending').length;
    }

    static completionRate(tasks) {
        const total = this.total(tasks);
        if (total === 0) return 0;
        return Math.round((this.completed(tasks) / total) * 100);
    }

    static getByPriority(tasks) {
        if (!Array.isArray(tasks)) return { high: 0, medium: 0, low: 0 };

        return {
            high: tasks.filter(task => task.priority === 'high').length,
            medium: tasks.filter(task => task.priority === 'medium').length,
            low: tasks.filter(task => task.priority === 'low').length
        };
    }

    static getByCategory(tasks) {
        if (!Array.isArray(tasks)) return {};

        const categories = {};
        tasks.forEach(task => {
            categories[task.category] = (categories[task.category] || 0) + 1;
        });

        return categories;
    }

    static getTasksCreatedToday(tasks) {
        if (!Array.isArray(tasks)) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        }).length;
    }

    static getTasksCreatedThisWeek(tasks) {
        if (!Array.isArray(tasks)) return 0;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate >= weekAgo;
        }).length;
    }

    static getAverageTasksPerDay(tasks, days = 7) {
        if (!Array.isArray(tasks) || tasks.length === 0) return 0;

        const tasksInPeriod = this.getTasksCreatedThisWeek(tasks);
        return Math.round((tasksInPeriod / days) * 10) / 10;
    }

    static getMostProductiveDay(tasks) {
        if (!Array.isArray(tasks) || tasks.length === 0) return null;

        const dayCount = {};
        const dayNames = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

        tasks.forEach(task => {
            const day = new Date(task.createdAt).getDay();
            dayCount[day] = (dayCount[day] || 0) + 1;
        });

        let maxCount = 0;
        let mostProductiveDay = 0;

        for (const [day, count] of Object.entries(dayCount)) {
            if (count > maxCount) {
                maxCount = count;
                mostProductiveDay = parseInt(day);
            }
        }

        return {
            day: dayNames[mostProductiveDay],
            count: maxCount
        };
    }

    static getDetailedStats(tasks) {
        return {
            total: this.total(tasks),
            completed: this.completed(tasks),
            active: this.active(tasks),
            completionRate: this.completionRate(tasks),
            byPriority: this.getByPriority(tasks),
            byCategory: this.getByCategory(tasks),
            createdToday: this.getTasksCreatedToday(tasks),
            createdThisWeek: this.getTasksCreatedThisWeek(tasks),
            averagePerDay: this.getAverageTasksPerDay(tasks),
            mostProductiveDay: this.getMostProductiveDay(tasks)
        };
    }
}