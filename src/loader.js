export class Loader{
     static startLoader(){
         return `<div class="lds-default" id="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
     }

     static removeLoader(){
         document.getElementById('loader').remove();
     }
}