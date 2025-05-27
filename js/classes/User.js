class User {
    constructor(name) {
        this.name = name;
        this.createdAt = new Date();
        this.taskCount = 0;
        this.completedTaskCount = 0;
        this.lastActivity = new Date();
    }

    incrementTaskCount() {
        this.taskCount++;
        this.updateLastActivity();
        return this.taskCount;
    }

    decrementTaskCount() {
        this.taskCount = Math.max(0, this.taskCount - 1);
        this.updateLastActivity();
        return this.taskCount;
    }

    incrementCompletedTaskCount() {
        this.completedTaskCount++;
        this.updateLastActivity();
        return this.completedTaskCount;
    }

    decrementCompletedTaskCount() {
        this.completedTaskCount = Math.max(0, this.completedTaskCount - 1);
        this.updateLastActivity();
        return this.completedTaskCount;
    }

    updateLastActivity() {
        this.lastActivity = new Date();
    }

    getCompletionRate() {
        if (this.taskCount === 0) return 0;
        return Math.round((this.completedTaskCount / this.taskCount) * 100);
    }

    getActiveTaskCount() {
        return this.taskCount - this.completedTaskCount;
    }

    toJSON() {
        return {
            name: this.name,
            createdAt: this.createdAt.toISOString(),
            taskCount: this.taskCount,
            completedTaskCount: this.completedTaskCount,
            lastActivity: this.lastActivity.toISOString()
        };
    }

    static fromJSON(data) {
        const user = new User(data.name);
        user.createdAt = new Date(data.createdAt);
        user.taskCount = data.taskCount || 0;
        user.completedTaskCount = data.completedTaskCount || 0;
        user.lastActivity = new Date(data.lastActivity || data.createdAt);
        return user;
    }
}