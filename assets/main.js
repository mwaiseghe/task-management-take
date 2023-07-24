let storedTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
let storedCompletedTasks = localStorage.getItem('completedTasks') ? JSON.parse(localStorage.getItem('completedTasks')) : [];
let storedUncompletedTasks = localStorage.getItem('uncompletedTasks') ? JSON.parse(localStorage.getItem('uncompletedTasks')) : [];
let TaskItems = []
let CompletedTaskItems = []
let UncompletedTaskItems = []

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

    ifCompletedEarlier() {
        let if_completed_earlier = boolean;
        if (this.completedEarlier() < 0) {
            if_completed_earlier = true;
        } else {
            if_completed_earlier = false;
        }
        return if_completed_earlier;
    }

    pastDeadline() {
        let deadline = new Date(this.deadline);
        let today = new Date();
        let difference = today - deadline;
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        return days;
    }     
    
    updateTaskObject(id) {
        let item = TaskItems.find(task => task.id === id);
        item.title = this.title;
        item.description = this.description;
        item.deadline = this.deadline;
        item.completed = this.completed;

        storedTasks.splice(storedTasks.indexOf(item), 1, item); // update item in storedTasks
        localStorage.setItem('tasks', JSON.stringify(storedTasks)); // update storedTasks in local storage
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

    deleteTask(id) {
        let task = document.querySelector(`#task-${id}`);
        task.remove();
        storedTasks.splice(storedTasks.indexOf(this), 1);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    editTask(id) {
        let task = document.querySelector(`#task-${id}`);
        let title = task.querySelector('.name h3').textContent;
        let description = task.querySelector('.description p').textContent;
        let deadline = task.querySelector('.deadline p').textContent;
        let completed = task.classList.contains('completed');

        let formParent = document.querySelector('.to-do-form');
        formParent.innerHTML = `
                    <form action="" method="post" id="edit-task-form">
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" name="title" id="title" placeholder="Enter Title">
                        </div>
    
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea name="description" id="description" cols="30" rows="10" placeholder="Enter Description"></textarea>
                        </div>
    
                        <div class="form-group">
                            <label for="deadline">Deadline</label>
                            <input type="date" name="deadline" id="deadline">
                        </div>

                        <div class="submit-button">
                            <button id="submit-btn" type="submit">Edit Task</button>
                        </div>
                    </form>
        `;
        let editTaskForm = document.querySelector('#edit-task-form');
        editTaskForm.title.value = title;
        editTaskForm.description.value = description;
        editTaskForm.deadline.value = deadline.split(' ')[1];

        editTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let task = new Task(id, editTaskForm.title.value, editTaskForm.description.value, editTaskForm.deadline.value, completed);
            console.log(task);
            task.updateTaskObject(id);
            editTaskForm.reset();
            location.reload();
        }
        );

    }

    markCompleted() {
        let task = document.querySelector(`#task-${this.id}`);
        task.classList.add('completed');
        this.completed = true;

        this.updateTaskObject(this.id);
        
        storedCompletedTasks.push(this);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
        localStorage.setItem('completedTasks', JSON.stringify(storedCompletedTasks));
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

let taskList = document.querySelector('.tasks');

class App {

    convertJsonToTask() {
        let stored_tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskObjects = stored_tasks.map(task => new Task(
            task.id, task.title, task.description, task.deadline, task.completed
            ));
        TaskItems = taskObjects;
    }

    convertJsonToCompletedTask() {
        let stored_completed_tasks = JSON.parse(localStorage.getItem('completedTasks'));
        const completedTaskObjects = stored_completed_tasks.map(task => new CompletedTasks(
            task.id, task.title, task.description, task.deadline, task.completed
            ));
        CompletedTaskItems = completedTaskObjects;
    }


    convertJsonToUncompletedTask() {
        let uncompleted_items = TaskItems.filter(task => task.completed === false);
        const uncompletedTaskObjects = uncompleted_items.map(task => new UncompletedTasks(
            task.id, task.title, task.description, task.deadline, task.completed
            ));
        UncompletedTaskItems = uncompletedTaskObjects;
    }
    

    displayTasks(taskItems) {
        taskList.innerHTML = '';
        taskItems.forEach(task => {
            
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
                    <button class="mark-complete-btn">Mark Complete</button>
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
                    <p id="earlier">Completed Earlier by: ${task.deadlineDuration()} days</p>
                    <p id="past-deadline">Past Deadline by: ${task.pastDeadline()} days</p>
                </div>
            </div>
            `;
            taskList.appendChild(taskItem);

            let editBtn = taskItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                task.editTask(task.id);
            });

            let deleteBtn = taskItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                task.deleteTask(task.id);
            });

            let markCompleteBtn = taskItem.querySelector('.mark-complete-btn');
            if (task.completed) {
                markCompleteBtn.innerHTML = 'Mark Uncompleted';
            }

            markCompleteBtn.addEventListener('click', () => {
                task.markCompleted();
                markCompleteBtn.innerHTML = 'Mark Uncompleted';
            });
        });
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




let app = new App();
app.convertJsonToTask();
app.displayTasks(TaskItems);

let tasksToView = document.querySelector('#tasks-to-view');
tasksToView.addEventListener('change', () => {
    if (tasksToView.value === 'completed') {
        let completedTasks = new App();
        let completedTasksToView = completedTasks.convertJsonToCompletedTask();
        completedTasks.displayTasks(CompletedTaskItems);
        console.log('completed tasks');
    }
    if (tasksToView.value === 'incomplete') {
        let uncompletedTasks = new App();
        let uncompletedTasksToView = uncompletedTasks.convertJsonToUncompletedTask();
        uncompletedTasks.displayTasks(UncompletedTaskItems);
        console.log('uncompleted tasks');
    }
    if (tasksToView.value === 'all') {
        let allTasks = new App();
        let allTasksToView = allTasks.convertJsonToTask();
        allTasks.displayTasks(TaskItems);
        console.log('all tasks');
    }
});

