import {Firebase} from './firebase'
import {Pagination} from './pagination'
import {_URL} from './url'
export class Task {

    static createTask(task){
        const db = Firebase.initDataBase();
        db.collection('tasks').add(task);
        addTaskToLocalStorage(task);
        Pagination.renderPagination();
        Pagination.initActivePagaination();
        if(_URL.getParamVal('page')!== '1'){
            window.location = '/?page=1'
        }
    }

    static deleteTask(){
        let taskId = this.parentElement.getAttribute('data-action-task-id');
        let length = document.getElementById("task-list").childNodes.length - 1;
        deleteTaskFromLocalStorage(taskId);
        Pagination.renderPagination();
        Pagination.initActivePagaination();
        if(length === 0){
            let deletedPageNum = _URL.getParamVal('page');
            if(+deletedPageNum !== 1){
                window.location = `/?page=${deletedPageNum-1}`
                Pagination.renderPagination();
            }
        }
        
    }

    static editTask(){
        console.log('Edited');
    }

    static renderTaskList(){
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
        let taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        if(tasks.length){
            for(let i = 0;i < paginatedTasks.length; i++){
                let task = paginatedTasks[i];
                let task_element = document.createElement('li');
                let task_text_element = document.createElement('span');
                let task_actions_element = document.createElement('div');
                task_actions_element.classList.add('task-actions');
                task_actions_element.setAttribute('data-action-task-id',task.id);
                task_actions_element.innerHTML = `<i class="fa fa-check complete-task"></i><i class="fa fa-pencil edit-task"></i><i class="fa fa-trash delete-task"></i>`;
                task_element.classList.add("task-item","shadow");
                task_text_element.innerText = i+1+')'+task.title;
                task_element.addEventListener('click',activateTask);
                task_element.setAttribute('data-task-id',task.id);
                task_element.appendChild(task_text_element);
                task_element.appendChild(task_actions_element);
                taskList.appendChild(task_element);
            }
            handlerTaskActions();
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

}

function activateTask(){
    this.classList.toggle('active-task-item')
    this.querySelector('.task-actions').classList.toggle('show-task-actions');
}

function addTaskToLocalStorage(task){
    const allTasks = getTasksFromLocalStorage();
    allTasks.unshift(task);
    localStorage.setItem('tasks',JSON.stringify(allTasks));
    Task.renderTaskList();
}


export function getTasksFromLocalStorage(){
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function deleteTaskFromLocalStorage(id){
    let allTasks = getTasksFromLocalStorage();
    allTasks = allTasks.filter(item => id != item.id);
    localStorage.setItem('tasks',JSON.stringify(allTasks));
    Task.renderTaskList()
}







