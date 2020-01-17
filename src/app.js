import {Task} from './task'
import {Firebase} from './firebase'
import {Pagination} from './pagination'
import './styles/styles.css'
 
window.addEventListener('beforeunload',Firebase.initFirebaseApp());
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
buttonSort.addEventListener('click',Task.sortList);

function submitFormHandler (event) {
    event.preventDefault();
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


// const task = {
//     title:'Первая задача',
//     dateCreate:'16.01.2020',
//     time:'14:35',
//     status:'notCompleted'
// }
// db.collection('tasks').add(task)
 

// document.getElementById('add-task').addEventListener('click',function(e){
//     e.preventDefault();
//     history.pushState('any','Page 2','/pages/2');
// })