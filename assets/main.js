let storedTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
let storedCompletedTasks = localStorage.getItem('completedTasks') ? JSON.parse(localStorage.getItem('completedTasks')) : [];
let storedUncompletedTasks = localStorage.getItem('uncompletedTasks') ? JSON.parse(localStorage.getItem('uncompletedTasks')) : [];

class Task {
    constructor(id, title, description, deadline, completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.completed = completed;
    }

    setId() {
        let id = 0;
        if (storedTasks.length > 0) {
            id = storedTasks[storedTasks.length - 1].id + 1;
        }
        return id;
    }

    deadlineDuration() {
        let deadline = new Date(this.deadline);
        let today = new Date();
        let difference = deadline - today;
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        return days;
    }

    completedEarlier() {
        let deadline = new Date(this.deadline);
        let today = new Date();
        let difference = deadline - today;
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        return days;
    }

    pastDeadline() {
        let deadline = new Date(this.deadline);
        let today = new Date();
        let difference = today - deadline;
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        return days;
    }        

    
    submitTask() {
        let title = document.querySelector('#title').value;
        let description = document.querySelector('#description').value;
        let deadline = document.querySelector('#deadline').value;
        let completed = false;

        let task = new Task(this.setId(), title, description, deadline, completed);
        storedTasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    deleteTask() {
        let task = document.querySelector(`#task-${this.id}`);
        task.remove();
        storedTasks.splice(storedTasks.indexOf(this), 1);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    markCompleted() {
        let task = document.querySelector(`#task-${this.id}`);
        task.classList.add('completed');
        this.completed = true;
        storedTasks.splice(storedTasks.indexOf(this), 1);
        storedCompletedTasks.push(this);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
        localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));
        task.remove();
    }
}



class CompletedTasks extends Task {
    constructor(id, title, description, deadline, completed) {
        super(id, title, description, deadline, completed);
    }

    deleteTask() {
        let task = document.querySelector(`#task-${this.id}`);
        task.remove();
        storedCompletedTasks.splice(storedCompletedTasks.indexOf(this), 1);
        localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));
    }

    markUncompleted() {
        let task = document.querySelector(`#task-${this.id}`);
        task.classList.remove('completed');
        this.completed = false;
        storedCompletedTasks.splice(storedCompletedTasks.indexOf(this), 1);
        storedUncompletedTasks.push(this);
        localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));
        localStorage.setItem('uncompletedTasks', JSON.stringify(storedUncompletedTasks));
        task.remove();
    }
}

class UncompletedTasks extends Task {
    constructor(id, title, description, deadline, completed) {
        super(id, title, description, deadline, completed);
    }

    deleteTask() {
        let task = document.querySelector(`#task-${this.id}`);
        task.remove();
        storedUncompletedTasks.splice(storedUncompletedTasks.indexOf(this), 1);
        localStorage.setItem('uncompletedTasks', JSON.stringify(storedUncompletedTasks));
    }

    markCompleted() {
        let task = document.querySelector(`#task-${this.id}`);
        task.classList.add('completed');
        this.completed = true;
        storedUncompletedTasks.splice(storedUncompletedTasks.indexOf(this), 1);
        storedCompletedTasks.push(this);
        localStorage.setItem('uncompletedTasks', JSON.stringify(storedUncompletedTasks));
        localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));
        task.remove();
    }
}


let addTaskForm = document.querySelector('#new-task-form');
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let task = new Task();
    task.submitTask();
    addTaskForm.reset();
    location.reload();
}
);

let taskList = document.querySelector('.tasks');

function displayTasks() {
    storedTasks.forEach(task => {
        let taskItem = document.createElement('div');
        taskItem.classList.add('single-task-card');
        taskItem.id = `task-${task.id}`;
        taskItem.innerHTML = `
        <div class="task-head">
            <div class="name">
                <h3>${task.title}</h3>
            </div>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
        <div class="description">
            <p>${task.description}</p>
        </div>
        <div class="more-details">
            <div class="deadline">
                <p>Deadline: ${task.deadline}</p>
            </div>
            <div class="complete-details">
                <p id="earlier">Completed Earlier by: 2 days</p>
                <p id="past-deadline">Past Deadline by: 2 days</p>
            </div>
        </div>
        `;
        taskList.appendChild(taskItem);
    });
}

displayTasks();

