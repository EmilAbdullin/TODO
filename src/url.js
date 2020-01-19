import {getTasksFromLocalStorage} from './task'

export class _URL {
    static getParamVal(parametrName){
        let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parametrName) result = decodeURIComponent(tmp[1]);
        });
    return result;
    }


    static checkURLForTaskPage(){
        let currentPage = _URL.getParamVal('page');
        const taskPerPage = 10;
        const tasks = getTasksFromLocalStorage();
        const countPaginationButtons = Math.ceil(tasks.length / taskPerPage);
        if(+currentPage > countPaginationButtons){
            if(countPaginationButtons === 1){
                window.location = '/'
            }else{
                window.location = '/tasks?page=1'
            }
        }
    }
}