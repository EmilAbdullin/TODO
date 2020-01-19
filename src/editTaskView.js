import {_URL} from './url'

export class editViewTask{
    static renderViewTask(taskId,taskTitle){
        history.pushState(null,taskTitle,`/edit?taskId=${taskId}`)
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        appContainer.innerHTML = 
        `<div id="edit-container">
            <article>
                <h3 class="edit-task-heading">${taskTitle}</h3>
                <form id="edit-form">
                    <textarea class="shadow" placeholder="Edit a title for this card..." name="input-task-edit" id="input-task-edit"></textarea>
                    <button type="submit" class="shadow" id="submit-edit-task">Save card</button>
                </form>
            </article>
        </div>`
    }
}