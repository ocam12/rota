import { authState } from "./account-files/firebaseAuth.js";
import { addHideOnClickOutside, hideOnClickOutside, toggle } from "./clickOutside.js";
import { groups, staff, shiftPatterns, createGroup, deleteGroup, generateID } from "./data.js";
import { menuIsHidden } from "./groupOptions.js";
import { currentGroup, loadGroup } from "./main.js";
import { addEvent, clearContainer, createNewElement } from "./options.js";
import { hideElement, showElement } from "./utils.js";
import { rotaIsHidden } from "./visualGenerator.js";

let shiftTypesArray = [];

const displayGroupList = () => {
    if (!authState.currentUser){userNotLoggedIn(); return;}
    closeNotLoggedInMenu();
    if (groups.length === 0){displayAddFirstGroup(); return;}

    groupExistsOpen();
    const loadGroupList = getGroupList();
    clearContainer(loadGroupList);
    groups.forEach(group => {
        const groupElement = createNewElement('p', {classes: [], text: `${group.name}`}, []);
        const loadGroupButton = createNewElement('button', {classes: ['load-group-button'], text: 'Load'}, []);
        const deleteGroupButton = createNewElement('button', {classes: ['delete-group-button'], text: 'Delete'}, []);
        loadGroupButton.setAttribute("tabindex", "0");        //make it able to tab into button
        deleteGroupButton.setAttribute("tabindex", "0");        //make it able to tab into button
        const buttonContainer = createNewElement('div', {classes: ['group-button-container'], text: ''}, [loadGroupButton, deleteGroupButton]);
        const groupContainer = createNewElement('div', {classes: ['group-container'], text: ''}, [groupElement, buttonContainer]);
        addEvent(loadGroupButton, 'click', loadGroup, [group.id]); 
        addEvent(loadGroupButton, 'click', closeLoadMenu, []); 
        addEvent(deleteGroupButton, 'click', deleteGroup, [group.id]);
        addEvent(deleteGroupButton, 'click', openLoadMenu, []);
        loadGroupList.appendChild(groupContainer);
    });
}

const displayAddFirstGroup = () => {
    groupNotExistsOpen();
}

const groupExistsOpen = () => {
    const groupExists = document.querySelector('.group-exists');
    const groupNotExists = document.querySelector('.group-not-exists');

    showElement(groupExists);
    hideElement(groupNotExists);
}

const groupNotExistsOpen = () => {
    const groupExists = document.querySelector('.group-exists');
    const groupNotExists = document.querySelector('.group-not-exists');

    showElement(groupNotExists);
    hideElement(groupExists);
}

export const openLoadMenu = () => {
    const loadGroupMenu = getLoadMenu();
    if (!menuIsHidden(loadGroupMenu) && currentGroup){
        console.log('hide');
        hideElement(loadGroupMenu); 
        return;
    }
    showElement(loadGroupMenu);
    displayGroupList();
    closeNewMenu();
}

const closeLoadMenu = () => {
    const loadGroupList = getLoadMenu();
    hideElement(loadGroupList);
}

const getLoadMenu = () => {
    return document.querySelector('.load-group');
}

const getGroupList = () => {
    return document.querySelector('.group-list');
}

export const openNewMenu = () => {
    const newGroupMenu = getNewMenu();
    const loadGroupMenu = getLoadMenu();
    if (!menuIsHidden(newGroupMenu) ){
        hideElement(newGroupMenu); 
        return;
    }
    showElement(newGroupMenu);
    if (!rotaIsHidden())hideElement(loadGroupMenu); 
}

const closeNewMenu = () => {
    const newGroup = getNewMenu();
    hideElement(newGroup);
}

const getNewMenu = () => {
    return document.querySelector('.new-group');
}

export const addEventToCreateButton = () => {
    const newGroup = getNewMenu();
    const groupName = document.getElementById('newGroupName');
    const groupDate = document.getElementById('newGroupDate');
    const groupDuration = document.getElementById('newGroupDuration');
    const createButton = document.getElementById('createGroupButton');

    resetNewGroup();
    addEvent(createButton, 'click', createNewGroup, [groupName, groupDate, groupDuration]);
    addEventToAddShiftTypeButton();
}

export const addEventToAddShiftTypeButton = () => {
    const shiftTypeInput = document.getElementById('shiftTypeInput');
    const shiftTypeButton = document.getElementById('shiftTypeButton');
    const shiftTypeClone = shiftTypeButton.cloneNode(true);
    shiftTypeButton.parentNode.replaceChild(shiftTypeClone, shiftTypeButton);

    addEvent(shiftTypeClone, 'click', addNewShiftType, [shiftTypeInput , exampleTable]);
}

const addNewShiftType = (input, table) => {
    if (input.value){
        shiftTypesArray.push(input.value);
        updateExampleTable(input.value, table);
        input.value = '';
    }
}

const updateExampleTable = (type, table) => {
    const headerRow = document.getElementById('exampleHeaderRow');

    const newTh = document.createElement('th');
    newTh.innerText = type;
    headerRow.appendChild(newTh);

    for (let i = 1; i < table.rows.length; i++) {       //add blank space to each column below header
        const td = document.createElement("td");
        td.textContent = "";
        table.rows[i].appendChild(td);
    }
}

export const createNewGroup = (groupName, groupDate, groupDuration) => {
    if (groupName.value && groupDate.value && groupDuration.value && shiftTypesArray.length > 0){
        const groupID = generateID(groupName.value);
        createGroup(groupID, groupName.value, groupDate.value, groupDuration.value, shiftTypesArray);
        console.log(groupDate);
        resetNewGroup();
        closeNewMenu();
        closeLoadMenu();
        loadGroup(groupID);
    }
}

const resetNewGroup = () => {
    shiftTypesArray = [];

    const groupName = document.getElementById('newGroupName');
    const groupDate = document.getElementById('newGroupDate');
    const groupDuration = document.getElementById('newGroupDuration');
    groupName.value = '';
    groupDate.value = '2025-09-25';
    groupDuration.value = '';

    const exampleTable = document.getElementById('exampleTable');
    exampleTable.innerHTML = '<thead><tr id = "exampleHeaderRow"><th>Day</th></tr></thead><tbody><tr><td>Mon</td></tr><tr><td>Tue</td></tr><tr><td>...</td></tr></tbody>';
}

const openNotLoggedInMenu = () => {
    const notLoggedInMenu = document.getElementById('notLoggedInMenu');
    showElement(notLoggedInMenu);
    closeLoadMenu();
    closeNewMenu();
}

const closeNotLoggedInMenu = () => {
    const notLoggedInMenu = document.getElementById('notLoggedInMenu');
    hideElement(notLoggedInMenu);
}