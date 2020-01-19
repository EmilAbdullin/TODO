import {getTasksFromLocalStorage} from './task'
import {Task} from './task'
import { _URL } from './url';
import {Loader} from './loader'


export class Pagination {
    static renderPagination () {
        const paginationElement = document.getElementById('pagination');
        paginationElement.innerHTML = '';
        const taskPerPage = 10;
        const tasks = getTasksFromLocalStorage();
        const countPaginationButtons = Math.ceil(tasks.length / taskPerPage);
        if (countPaginationButtons > 1){
            for(let i = 0; i < countPaginationButtons; i++){
                let paginationBtn = document.createElement('span');
                paginationBtn.setAttribute('data-page-id',i + 1);
                paginationBtn.classList.add('pagination-item');
                paginationBtn.innerText = i + 1;
                paginationBtn.addEventListener('click',activatePage);
                paginationElement.appendChild(paginationBtn);
            }
        }else{
            paginationElement.innerHTML = '';
        }
    }

    static initActivePagaination(){
        let curPage = _URL.getParamVal('page');
        if(curPage === null){
            curPage = 1
            if(document.querySelector(`[data-page-id="1"]`) !== null){
                document.querySelector(`[data-page-id="1"]`).classList.add('active-page');
            }
        }else{
            curPage = curPage;
            if(document.querySelector(`[data-page-id="${curPage}"]`) !== null){
                document.querySelector(`[data-page-id="${curPage}"]`).classList.add('active-page');
            }
        }
    }
}

function activatePage(){  
        let currentPage = this.getAttribute('data-page-id');
        history.pushState(currentPage,`Page ${currentPage}`,`/tasks?page=${currentPage}`);
        localStorage.setItem('currentPage',currentPage);
        document.querySelector(`.active-page`).classList.remove('active-page')
        document.querySelector(`[data-page-id="${currentPage}"]`).classList.add('active-page')
        let haveLoader = true;
        Task.renderTaskList(haveLoader);
}

export function changePage(curPage){
    localStorage.setItem('currentPage',curPage);
    document.querySelector('.active-page').classList.remove('active-page');
    document.querySelector(`[data-page-id="${curPage}"]`).classList.add('active-page');
}