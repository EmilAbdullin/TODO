import {Task} from './task'
import {getAllTasksFromFirebase} from './task'
import {Firebase} from './firebase'
import {Pagination} from './pagination'
import './styles/styles.css'
import { _URL } from './url'
 
window.addEventListener('beforeunload',Firebase.initFirebaseApp());
if(localStorage.getItem('tasks') === null){
    getAllTasksFromFirebase();
}
_URL.checkURLForTaskPage();
Pagination.renderPagination();
Pagination.initActivePagaination();
Task.renderTaskList();

const taskForm = document.getElementById('task-form');
const inputForm = taskForm.querySelector('#input-task');
const buttonSort = document.getElementById('sort-list');

taskForm.addEventListener('submit',submitFormHandler)
inputForm.addEventListener('input',function(){
    taskForm.querySelector('#delete-task-input-val').style.opacity = '1';
    taskForm.querySelector('#delete-task-input-val').style.zIndex = '0';
    if(inputForm.value === ''){
        taskForm.querySelector('#delete-task-input-val').style.opacity = '0';
    }
})
taskForm.querySelector('#delete-task-input-val').addEventListener('click',function(){
    inputForm.value = '';
    taskForm.querySelector('#delete-task-input-val').style.opacity = '0';
    taskForm.querySelector('#delete-task-input-val').style.zIndex = '-2';
})
inputForm.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter'){
        submitFormHandler(event);
    }else{
        return false;
    }
})
buttonSort.addEventListener('click',Task.sortList);
function submitFormHandler (event) {
    event.preventDefault();
    taskForm.querySelector('#delete-task-input-val').style.opacity = '0';
    taskForm.querySelector('#delete-task-input-val').style.zIndex = '-2';
    if(inputForm.value != ''){
        const task = {
            title:inputForm.value.trim(),
            dateCreate: new Date().toJSON(),
            id:Date.now(),
            status:'notCompleted'
        }
        Task.createTask(task);
        inputForm.value = '';
        Pagination.renderPagination();
    }else{
        alert('Вы ничего не ввели');
    }
}
