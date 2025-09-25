import { authState } from "./firebaseAuth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { auth, db } from "./firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


export async function saveUser(groupObject) {       //saves all the groups of loggedi in user
    if (!authState.currentUser){
        return;
    }
    await setDoc(doc(db, "groups", authState.currentUser.uid), { data: JSON.stringify(cleanObject(groupObject)) });     //sets 'groups' object to JSON string file of groups object
}

export async function loadUser() {
    if (!authState.currentUser) {   //if not logged in won't load
        return;
    }
    const docSnap = await getDoc(doc(db, "groups", authState.currentUser.uid));

    if (!docSnap.exists()) {
        console.log("No saved group found for this user.");
        return null;
    }

    const firestoreData = docSnap.data();

    if (!firestoreData || !firestoreData.data) {
        console.log("Document has no 'data' field.");
        return null;
    }

    if (docSnap){
        const rawData = firestoreData.data; // this is the JSON string you saved
        try {
            let parsed = JSON.parse(rawData);       //parses saved JSON string
            return parsed;
        } catch (err) {
            return null;
        }
    }
}

function cleanObject(obj) {
    return JSON.parse(JSON.stringify(obj));     //removes undefined and functions
}

export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.reload();
    } catch (err) {
    }
}