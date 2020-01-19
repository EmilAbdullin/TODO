import {Firebase} from './firebase'
import {Pagination} from './pagination'
import {_URL} from './url'
import {Loader} from './loader'
import {editViewTask} from './editTaskView'

export class Task {

    static createTask(task){
        const db = Firebase.initDataBase();
        db.collection('tasks').doc(`"${task.id}"`).set(task)
        .then(function() {
            addTaskToLocalStorage(task)
            history.pushState(null,"Page 1","/tasks?page=1");
            Pagination.renderPagination();
            Pagination.initActivePagaination();
            Task.renderTaskList();
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        
    }

    static deleteTask(){
        let taskActionId = this.parentElement.getAttribute('data-action-task-id');
        let length = document.getElementById("task-list").childNodes.length - 1;
        const db = Firebase.initDataBase();
        db.collection('tasks').doc(`"${taskActionId}"`).delete()
        .then(()=>{
            console.log('deleted');
           deleteTaskFromLocalStorage(taskActionId); 
           Pagination.renderPagination();
           Pagination.initActivePagaination();
           if(length === 0){
                let deletedPageNum = _URL.getParamVal('page');
                if(+deletedPageNum > 1 ){
                    history.pushState(null,`Page ${deletedPageNum-1}`,`/tasks?page=${deletedPageNum-1}`);
                    Pagination.renderPagination();
                    Pagination.initActivePagaination();
                    Task.renderTaskList();
                }
            }
        })
        .catch((e) => {
            console.error('Some error',e);
        })
    }

    static editTask(){
        const taskActionId = this.parentElement.getAttribute('data-action-task-id');
        let taskTitle;
        getTasksFromLocalStorage().filter((item) => {
                if (item.id === +taskActionId){
                    taskTitle = item.title;
                }
            }
        )
        const db = Firebase.initDataBase();
        editViewTask.renderViewTask(taskActionId,taskTitle);
        const formEdit = document.getElementById('edit-form');
        const inputEdit = formEdit.querySelector('#input-task-edit');
        formEdit.addEventListener('submit',submitTaskEditFormHandler);

        function submitTaskEditFormHandler(e){
            e.preventDefault();
            if(inputEdit.value !== ''){
                const newTaskTitle = inputEdit.value;
                inputEdit.value = '';

                db.collection('tasks').doc(`"${taskActionId}"`).update({
                    title:newTaskTitle
                }).then(()=>{
                    updateEditedTaskInLocalStorage(taskActionId,newTaskTitle);
                    window.location = '/'
                }).catch(error =>{
                    console.error('Something wrong for edit',error);
                })
            }
        }

        inputEdit.addEventListener('keydown',(e)=>{
            if(e.key === 'Enter'){
                submitTaskEditFormHandler(e);
            }else{
                return false;
            }
        })
    }

    static completeTask(){
        let taskActionId = this.parentElement.getAttribute('data-action-task-id');
        const db = Firebase.initDataBase();
        const taskItem = document.querySelector(`[data-task-id="${taskActionId}"]`).querySelector('.task-item-text');
        if(!taskItem.classList.contains('completed')){
            db.collection('tasks').doc(`"${taskActionId}"`).update({
                status:'completed'
            }).then(()=>{
                taskItem.classList.add('completed');
                updateDeletedTaskInLocalStorage(taskActionId,'completed');
            }).catch(error =>{
                console.log('Something wrong',error);
            })
        }else{
            db.collection('tasks').doc(`"${taskActionId}"`).update({
                status:'notCompleted'
            }).then(()=>{
                taskItem.classList.remove('completed');
                updateDeletedTaskInLocalStorage(taskActionId,'notCompleted');
            }).catch(error => {
                console.log('Something wrong',error);
            })
        }
        
        
    }

    static renderTaskList(haveLoader = false){
        let taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        const tasks = getTasksFromLocalStorage();
        const taskPerPage = 10;
        let page = _URL.getParamVal('page');
        if(page === null){
            page = 1
        }else{
            page = page
        }
        page--;
        let start = taskPerPage * page
        let end = start + taskPerPage;
        let paginatedTasks = tasks.slice(start,end);
        if(tasks.length){
            if(haveLoader){
                taskList.innerHTML = Loader.startLoader();
                setTimeout(function(){
                    for(let i = 0;i < paginatedTasks.length; i++){
                        let task = paginatedTasks[i];
                        let task_element = document.createElement('li');
                        let task_text_element = document.createElement('span');
                        let task_actions_element = document.createElement('div');
                        task_actions_element.classList.add('task-actions');
                        task_actions_element.setAttribute('data-action-task-id',task.id);
                        if(task.status !== "notCompleted"){
                            task_actions_element.innerHTML = `<i class="fa fa-check complete-task"></i><i class="fa fa-trash delete-task"></<i>`;
                            task_actions_element.style.justifyContent = 'space-around'
                            task_text_element.classList.add("completed");
                        }else{
                            task_actions_element.innerHTML = `<i class="fa fa-check complete-task"></i><i class="fa fa-pencil edit-task"></i><i class="fa fa-trash delete-task"></i>`;
                        }
                        task_element.classList.add("task-item","shadow");
                        task_text_element.classList.add('task-item-text')
                        task_text_element.innerText = i+1+')'+task.title;
                        task_element.addEventListener('click',activateTask);
                        task_element.setAttribute('data-task-id',task.id);
                        task_element.appendChild(task_text_element);
                        task_element.appendChild(task_actions_element);
                        taskList.appendChild(task_element);
                    }
                    handlerTaskActions();
                    Loader.removeLoader();
                },1000)
            }else{
                for(let i = 0;i < paginatedTasks.length; i++){
                    let task = paginatedTasks[i];
                    let task_element = document.createElement('li');
                    let task_text_element = document.createElement('span');
                    let task_actions_element = document.createElement('div');
                    task_actions_element.classList.add('task-actions');
                    task_actions_element.setAttribute('data-action-task-id',task.id);
                    task_actions_element.innerHTML = `<i class="fa fa-check complete-task"></i><i class="fa fa-pencil edit-task"></i><i class="fa fa-trash delete-task"></i>`;
                    if(task.status !== "notCompleted"){
                        task_text_element.classList.add("completed");
                    }
                    task_element.classList.add("task-item","shadow");
                    task_text_element.classList.add('task-item-text')
                    task_text_element.innerText = i+1+')'+task.title;
                    task_element.addEventListener('click',activateTask);
                    task_element.setAttribute('data-task-id',task.id);
                    task_element.appendChild(task_text_element);
                    task_element.appendChild(task_actions_element);
                    taskList.appendChild(task_element);
                }
                handlerTaskActions();
            }
        }else{
            let noTaskElem = document.createElement('p');
            noTaskElem.classList.add('no-tasks');
            noTaskElem.innerText = 'У вас пока нет задач';
            taskList.appendChild(noTaskElem);
        }
     }

     static sortList(){
        let tasks = document.getElementById("task-list");
        let i = tasks.childNodes.length;
        while (i--)
        {
            tasks.appendChild(tasks.childNodes[i]);
        }
     }

}

function handlerTaskActions(){
    const completeTaskBtns = document.querySelectorAll('.complete-task');
    const editTaskBtns = document.querySelectorAll('.edit-task');
    const deleteTaskBtns = document.querySelectorAll('.delete-task');
    
    deleteTaskBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener('click',Task.deleteTask);
    })

    completeTaskBtns.forEach(completeBtn => {
        completeBtn.addEventListener('click',Task.completeTask);
    })

    editTaskBtns.forEach(editBtn => {
        editBtn.addEventListener('click',Task.editTask);
    })

}

function activateTask(){
    this.classList.toggle('active-task-item')
    this.querySelector('.task-actions').classList.toggle('show-task-actions');
}

function addTaskToLocalStorage(task){
    let allTasks = getTasksFromLocalStorage();
    allTasks.unshift(task);
    localStorage.setItem('tasks',JSON.stringify(allTasks));
}


export function getTasksFromLocalStorage(){
    return JSON.parse(localStorage.getItem('tasks') || '[]'); 
}

function deleteTaskFromLocalStorage(id){
    let allTasks = getTasksFromLocalStorage();
    allTasks = allTasks.filter(item => id != item.id);
    localStorage.setItem('tasks',JSON.stringify(allTasks));
    Task.renderTaskList();
}

function updateDeletedTaskInLocalStorage(id,status){
    let allTasks = getTasksFromLocalStorage();
    let newArr  = allTasks.filter((item) =>{
        if(item.id === +id){
            item.status = status;
            return item;
        }else{
            return item;
        }
    })    
    localStorage.setItem('tasks',JSON.stringify(newArr));
}

function updateEditedTaskInLocalStorage(id,title){
    let allTasks = getTasksFromLocalStorage();
    let newArr  = allTasks.filter((item) =>{
        if(item.id === +id){
            item.title = title;
            return item;
        }else{
            return item;
        }
    })    
    localStorage.setItem('tasks',JSON.stringify(newArr));
}

export function getAllTasksFromFirebase(){
    const db = Firebase.initDataBase();
    db.collection("tasks").get()
    .then(function(querySnapshot) {
        localStorage.removeItem('tasks');
        querySnapshot.forEach((obj)=>{
            addTaskToLocalStorage(obj.data());
        });
    }).then(()=>{
        Pagination.renderPagination();
        Pagination.initActivePagaination();
        Task.renderTaskList();
    }).catch((error) =>{
        console.log(error);
    })

}







