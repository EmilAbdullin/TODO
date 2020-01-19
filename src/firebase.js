import * as firebase from 'firebase/app'
import 'firebase/firestore'

export class Firebase{
    static initFirebaseApp(){
        firebase.initializeApp({
            apiKey: "AIzaSyDgVpXT1Hn5doEMLnk4AXv9PnHR-Nb-e4U",
            authDomain: "todo-app-e76eb.firebaseapp.com",
            projectId: "todo-app-e76eb"
        });
    }

    static initDataBase(){
        return firebase.firestore();
    }
}

