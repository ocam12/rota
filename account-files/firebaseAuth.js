import { loadGroups } from "../data.js";
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { initialiseSignInPage } from "./signIn.js";

//export the current user as an object so it can be imported safely
export const authState = {
    currentUser: null
};

//track the currently logged-in user across pages
onAuthStateChanged(auth, (user) => {        //changes current user when logs in
    if (user) {
        authState.currentUser = user;
        console.log("User is signed in:", authState.currentUser.email);
        loadGroups();
    } else {
        authState.currentUser = null;
        console.log("No user signed in");
    }
    initialiseSignInPage();
});