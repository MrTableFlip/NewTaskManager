function PrepareLocaleStorage() {
    if (GetLocalStorage() == null)
        SetLocalStorage(new Array());

    // document.querySelectorAll('[data-toggle="tooltip"]').tooltip({
    //     trigger: 'hover'
    // })

    document.getElementById("curTasks-Title").textContent = "Current Tasks (" + `${GetTaskCount()}` + ")";
}

function CreateTask(formData) {
    let tasks = GetLocalStorage();

    let task = {
        id: GenerateId(),
        created: new Date(),
        completed: false,
        title: formData[1].value,
        dueDate: new Date(`${formData[2].value} 00:00`)
    };
    tasks.push(task);
    SetLocalStorage(tasks);
    ListTasks();
}

function EditTask(element) {
    let tasks = GetLocalStorage();

    let task = {
        id: GenerateId(),
        created: new Date(),
        completed: false,
        title: formData[1].value,
        dueDate: new Date(`${formData[2].value} 00:00`),
        tdCrud: "x",
    }
    tasks.push(task);
    SetLocalStorage(tasks);
    ListTasks();
}

function PopEditModal(element) {
    ClearToolTip();

    let tasks = GetLocalStorage();
    let taskId = GetTaskId(element);
    let task = GetIndex(taskId);

    let dateString = new Date(tasks[task].dueDate);

    document.getElementById("editTitle").value = tasks[task].title;
    document.getElementById("editDueDate").value = FormatDate(dateString);
    $("#editTaskModal").modal();

    tasks.splice(taskId, 1);
    SetLocalStorage(tasks);
}

function SaveTask(task) {
    let tasks = GetLocalStorage();
}

function ListTasks() {
    const template = document.getElementById("taskItem-template");
    const taskBody = document.getElementById("taskBody");

    let tasks = GetLocalStorage();
    taskBody.innerHTML = "";
    for (let row = 0; row < tasks.length; row++) {
        const taskRow = document.importNode(template.content, true);

        if (tasks[row].completed)
            taskRow.getElementById("TaskRow").setAttribute("class", "complete");

        taskRow.getElementById("id").textContent = tasks[row].id;
        taskRow.getElementById("title").textContent = tasks[row].title;
        taskRow.getElementById("created").textContent = RenderDate(tasks[row].created);
        taskRow.getElementById("dueDate").textContent = RenderDate(tasks[row].dueDate);
        taskRow.getElementById("tdCrud").setAttribute("data-id", tasks[row].id);

        taskBody.appendChild(taskRow);
    }
    GetTaskCount();
}

function DeleteTasks(element) {
    ClearToolTip();

    let index = GetIndex(element);
    let tasks = GetLocalStorage();
    tasks.splice(index, 1);
    SetLocalStorage(tasks);
    ListTasks();
}

function CompleteTask(element) {
    ClearToolTip();

    let tasks = GetLocalStorage();
    let taskId = GetTaskId(element);
    let task = GetIndex(taskId);
    // task.find(t => t.id == taskId);
    tasks[task].completed = !tasks[task].completed;
    SetLocalStorage(tasks);
    ListTasks();
}

function RenderDate(taskDate) {
    let date = new Date(taskDate);
    return date.toLocaleString('en-US');
}

function GetIndex(element) {
    let tasks = GetLocalStorage();
    const template = document.getElementById("taskItem-template");
    let index = 0;

    for (let row = 0; row < tasks.length; row++) {
        const taskRow = document.importNode(template.content, true);
        if (taskRow.getElementById("id").textContent == element) {
            index = row;
        }
    }
    return index;
}

function GetTaskCount() {
    let tasks = GetLocalStorage();
    return tasks.length;
}

function GetTaskId(element) {
    let col = element.parentNode;
    let row = col.parentNode;
    let rowId = row.children[0];
    return rowId;
}

function GetLocalStorage() {
    return JSON.parse(localStorage.getItem("TaskData"));
}

function SetLocalStorage(data) {
    localStorage.setItem("TaskData", JSON.stringify(data));
}

function ClearToolTip() {

}

function ClearTasks() {
    localStorage.clear();
    PrepareLocaleStorage();
}

function GenerateId() {
    return 'xxxxxxxxx-xxxx-4xxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}