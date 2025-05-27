import TaskManager from './classes/TaskManager.js';
import User from './classes/User.js';

class App {
    constructor() {
        this.users = [];
        this.taskManager = new TaskManager();
    }

    addUser(name) {
        const user = new User(name);
        this.users.push(user);
        return user;
    }

    getUserByName(name) {
        return this.users.find(u => u.name === name) || null;
    }

    saveToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(this.users.map(u => u.toJSON())));
        localStorage.setItem('tasks', JSON.stringify(this.taskManager.toJSON()));
    }

    loadFromLocalStorage() {
        const usersData = JSON.parse(localStorage.getItem('users')) || [];
        this.users = usersData.map(data => User.fromJSON(data));

        const tasksData = JSON.parse(localStorage.getItem('tasks'));
        if (tasksData) {
            this.taskManager.fromJSON(tasksData);
        }
    }
}

export default App;
