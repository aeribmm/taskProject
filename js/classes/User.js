// User.js - Класс для представления пользователя

export default class User {
    /**
     * Конструктор для создания нового пользователя
     * @param {string} name - Имя пользователя
     */
    constructor(name) {
        this.name = name;
        this.createdAt = new Date();
        this.taskCount = 0;
        this.completedTaskCount = 0;
        this.lastActivity = new Date();
    }

    /**
     * Увеличение счетчика задач
     * @returns {number} Новое количество задач
     */
    incrementTaskCount() {
        this.taskCount++;
        this.updateLastActivity();
        return this.taskCount;
    }

    /**
     * Уменьшение счетчика задач
     * @returns {number} Новое количество задач
     */
    decrementTaskCount() {
        this.taskCount = Math.max(0, this.taskCount - 1);
        this.updateLastActivity();
        return this.taskCount;
    }

    /**
     * Увеличение счетчика выполненных задач
     * @returns {number} Новое количество выполненных задач
     */
    incrementCompletedTaskCount() {
        this.completedTaskCount++;
        this.updateLastActivity();
        return this.completedTaskCount;
    }

    /**
     * Уменьшение счетчика выполненных задач
     * @returns {number} Новое количество выполненных задач
     */
    decrementCompletedTaskCount() {
        this.completedTaskCount = Math.max(0, this.completedTaskCount - 1);
        this.updateLastActivity();
        return this.completedTaskCount;
    }

    /**
     * Обновление времени последней активности
     */
    updateLastActivity() {
        this.lastActivity = new Date();
    }

    /**
     * Получение процента выполненных задач
     * @returns {number} Процент выполнения (0-100)
     */
    getCompletionRate() {
        if (this.taskCount === 0) return 0;
        return Math.round((this.completedTaskCount / this.taskCount) * 100);
    }

    /**
     * Получение количества активных задач
     * @returns {number} Количество активных задач
     */
    getActiveTaskCount() {
        return this.taskCount - this.completedTaskCount;
    }

    /**
     * Проверка, активен ли пользователь (имеет задачи)
     * @returns {boolean} true если у пользователя есть задачи
     */
    isActive() {
        return this.taskCount > 0;
    }

    /**
     * Получение возраста аккаунта в днях
     * @returns {number} Количество дней с момента создания
     */
    getAccountAgeInDays() {
        const now = new Date();
        const diffTime = Math.abs(now - this.createdAt);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Получение времени с последней активности в часах
     * @returns {number} Количество часов с последней активности
     */
    getHoursSinceLastActivity() {
        const now = new Date();
        const diffTime = Math.abs(now - this.lastActivity);
        return Math.ceil(diffTime / (1000 * 60 * 60));
    }

    /**
     * Проверка, был ли пользователь активен недавно (в течение 24 часов)
     * @returns {boolean} true если был активен в течение 24 часов
     */
    wasRecentlyActive() {
        return this.getHoursSinceLastActivity() <= 24;
    }

    /**
     * Получение отформатированной даты создания аккаунта
     * @returns {string} Отформатированная дата
     */
    getFormattedCreatedDate() {
        return this.createdAt.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Получение отформатированной даты последней активности
     * @returns {string} Отформатированная дата и время
     */
    getFormattedLastActivity() {
        return this.lastActivity.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Получение подробной информации о пользователе
     * @returns {Object} Объект с информацией о пользователе
     */
    getInfo() {
        return {
            name: this.name,
            createdAt: this.createdAt,
            taskCount: this.taskCount,
            completedTaskCount: this.completedTaskCount,
            activeTaskCount: this.getActiveTaskCount(),
            completionRate: this.getCompletionRate(),
            accountAge: this.getAccountAgeInDays(),
            lastActivity: this.lastActivity,
            isActive: this.isActive(),
            wasRecentlyActive: this.wasRecentlyActive()
        };
    }

    /**
     * Получение краткой статистики пользователя
     * @returns {Object} Краткая статистика
     */
    getShortStats() {
        return {
            total: this.taskCount,
            completed: this.completedTaskCount,
            active: this.getActiveTaskCount(),
            completionRate: this.getCompletionRate()
        };
    }

    /**
     * Сброс статистики пользователя
     */
    resetStats() {
        this.taskCount = 0;
        this.completedTaskCount = 0;
        this.updateLastActivity();
    }

    /**
     * Конвертация в JSON для сохранения
     * @returns {Object} Объект для JSON сериализации
     */
    toJSON() {
        return {
            name: this.name,
            createdAt: this.createdAt.toISOString(),
            taskCount: this.taskCount,
            completedTaskCount: this.completedTaskCount,
            lastActivity: this.lastActivity.toISOString()
        };
    }

    /**
     * Создание объекта User из JSON данных
     * @param {Object} data - JSON данные
     * @returns {User} Новый объект User
     */
    static fromJSON(data) {
        if (!data || typeof data !== 'object' || !data.name) {
            throw new Error('Некорректные данные для создания User');
        }

        const user = new User(data.name);
        user.createdAt = new Date(data.createdAt);
        user.taskCount = data.taskCount || 0;
        user.completedTaskCount = data.completedTaskCount || 0;
        user.lastActivity = new Date(data.lastActivity || data.createdAt);

        return user;
    }

}