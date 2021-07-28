$(function () {
    PrepareLocalStorage();

    let tasks = GetLocalStorage();
    //Set task count
    SetTaskCount(`Current Tasks (${tasks.length})`);

    //This is my first change where I am trying to pass the entire array into ListTasks...
    //Not even sure if it works yet...However if it does I am in business!
    ListTasks(tasks);

    //Trigger tooltips on hover
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    })

    $("#btnSearch").on("click", function () {
        let searchString = $("#txtSearch").val();
        SearchTasks(searchString);
    })
});

function PrepareLocalStorage() {
    if (GetLocalStorage() == null)
        SetLocalStorage(new Array());

    // document.querySelectorAll('[data-toggle="tooltip"]').tooltip({
    //     trigger: 'hover'
    // })
}

function CreateTask(formData) {
    let dueDate = formData[2].value == "" ?
        new Date() :
        new Date(`${formData[2].value} 00:00`);

    let task = {
        id: GenerateId(),
        created: new Date(),
        completed: false,
        title: formData[1].value,
        dueDate: dueDate
    }

    let tasks = GetLocalStorage();
    tasks.push(task);

    SetLocalStorage(tasks);
    ListTasks(tasks);
}

function EditTask(formData) {
    let taskId = formData[1].value;

    let tasks = GetLocalStorage();
    let task = tasks.find(t => t.id == taskId);
    task.title = formData[2].value;
    task.dueDate = new Date(`${formData[3].value} 00:00`);

    SetLocalStorage(tasks);

    ListTasks();
}

function PopEditModal(element) {
    ClearToolTip();

    let tasks = GetLocalStorage();
    let taskId = GetTaskId(element);
    let task = tasks.find(t => t.id == taskId);

    $("#TaskId").val(task.id);
    //document.getElementById("TaskId").value = task.id

    $("#editTitle").val(task.title);

    //Sweet works!
    let modalDueDate = BuildModalDueDate(task.dueDate);
    $("#editDueDate").val(modalDueDate);
    $("#editTaskItem").modal("show");

    alert("Let's see");
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
        //taskRow.getElementById("tdCrud").setAttribute("data-id", tasks[row].id);

        taskBody.appendChild(taskRow);
    }
    SetTaskCount(`Current Tasks (${tasks.length})`);
}

function DeleteTask(element) {
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

function GetTaskId(element) {
    let col = element.parentNode;
    let row = col.parentNode;
    let rowId = row.children[0].innerHTML;
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
    PrepareLocalStorage();
}

function GenerateId() {
    return 'xxxxxxxxx-xxxx-4xxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function SetTaskCount(count) {
    $("#curTasks-Title").text(count);
}

function BuildModalDueDate(dueDate) {
    let shortDate = dueDate.split("T")[0];
    return shortDate;
}