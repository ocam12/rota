import { addEvent } from "../options.js";
import { login, signup } from "./auth.js";
import { authState } from "./firebaseAuth.js";
import { logoutUser } from "./groups.js";

const signupPressed = () => {       //signup button pressed
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (!checkEmail(email)){
        displayMessage('Please enter a valid email', 'error')
    }

    const passwordResult = checkPassword(password);
    if(!passwordResult.valid){
        displayMessage(passwordResult.message, 'error')
    }

    console.log(email + ' ' + password);
    signup(email, password)
}

const loginPressed = async () => {       //login button pressed
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if(!await login(email, password)){
        displayMessage('Either your email or password is incorrect', 'error');
    }
}

const emailErrors = (emailInput) => {
    if (!checkEmail(emailInput.value) && emailInput.value !== ''){
        emailInput.className = 'error';
        displayMessage('Please enter a valid email', 'error')
        return;
    }
    emailInput.className = '';
    displayMessage('', 'error')
}

const checkEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const passwordErrors = (passwordInput) => {
    const passwordResult = checkPassword(passwordInput.value);
    if (!passwordResult.valid && passwordInput.value !== ''){
        passwordInput.className = 'error';
        displayMessage(passwordResult.message, 'error')
        return;
    }
    passwordInput.className = '';
    displayMessage('', 'error')
}

const checkPassword = (password) => {
    if (password.length < 8){
        return { valid: false, message: 'Please ensure password is at least 8 characters long'}
    }
    return {valid: true}
}

const displayMessage = (message, type) => {
    const messageP = document.getElementById('messageP');
    messageP.innerText = message;
    messageP.className = type;
}

export const initialiseSignInPage = async () => {
    //intialises signup and login buttons
    const signupEmail = document.getElementById('signupEmail');
    if (signupEmail){addEvent(signupEmail, 'input', emailErrors, [signupEmail]);}

    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword){addEvent(signupPassword, 'input', passwordErrors, [signupPassword]);}

    const signUpMenu = getSignUpMenu();
    if (signUpMenu){
        signUpMenu.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('create');
            signupPressed();
        });
    }

    const logInMenu = getLogInMenu();
    if (logInMenu){
        logInMenu.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('login');
            loginPressed();
        });
    }

    const createAccountButton = document.getElementById('createAccountButton');
    if (createAccountButton){addEvent(createAccountButton, 'click', switchToSignUp, []);}

    const gotAccountButton = document.getElementById('gotAccountButton');
    if (gotAccountButton){addEvent(gotAccountButton, 'click', switchToLogIn, []);}
    
    const loggedInMenu = getLoggedInMenu();
    if (loggedInMenu){
        loggedInMenu.addEventListener('submit', (e) => {
            e.preventDefault();
            logoutUser();
        });
        if (authState.currentUser){
            switchToLoggedIn();
        }
        else{
            switchToLogIn();
        }
    }
}

const switchToSignUp = () => {
    getSignUpMenu().classList.remove('hidden');
    getLogInMenu().classList.add('hidden');
}

const switchToLogIn = () => {
    getSignUpMenu().classList.add('hidden');
    getLogInMenu().classList.remove('hidden');
}

const switchToLoggedIn = () => {
    getSignUpMenu().classList.add('hidden');
    getLogInMenu().classList.add('hidden');
    getLoggedInMenu().classList.remove('hidden');
}

const getSignUpMenu = () => {
    return document.getElementById('signUpMenu');
}

const getLogInMenu = () => {
    return document.getElementById('logInMenu');
}

const getLoggedInMenu = () => {
    return document.getElementById('loggedInMenu');
}