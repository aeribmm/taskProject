import App from './App.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.loadFromLocalStorage();

    console.log('App loaded with users:', app.users);
    console.log('Current tasks:', app.taskManager.tasks);

    const form = document.getElementById('addTaskForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const content = document.getElementById('taskContent').value;
            const userName = document.getElementById('userName').value;

            const user = app.getUserByName(userName);
            if (user) {
                app.taskManager.addTask(content, user);
                app.saveToLocalStorage();
                alert('Задача добавлена!');
                form.reset();
            } else {
                alert('Пользователь не найден!');
            }
        });
    }

    // Можно подключить другие кнопки, фильтры и т.д.
});
