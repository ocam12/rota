import { authState } from "./firebaseAuth.js";
import { auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

export async function signup(email, password) {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);       //creates account
    } catch (err) {
        console.log(err);
    }
}

export async function login(email, password) {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);       //gets account with those user details
        authState.currentUser = userCred.user;      //sets user to this newly logged in one
        window.location.href = '../index.html';     //opens up maiun page
    } catch (err) {

    }
}