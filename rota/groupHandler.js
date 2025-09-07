import { addHideOnClickOutside, hideOnClickOutside, toggle } from "./clickOutside.js";
import { groups, staff, shiftPatterns, createGroup, deleteGroup, generateID } from "./data.js";
import { loadGroup } from "./main.js";
import { addEvent, clearContainer, createNewElement } from "./options.js";

let shiftTypesArray = [];

const displayGroupList = () => {
    const loadGroupList = getLoadMenu();
    clearContainer(loadGroupList);
    loadGroupList.appendChild(createNewElement('h3', {classes: [], text: `Load Group`}, []));
    groups.forEach(group => {
        const groupElement = createNewElement('p', {classes: [], text: `${group.name}`}, []);
        const deleteGroupButton = createNewElement('button', {classes: ['delete-group-button'], text: 'Delete'}, []);
        const groupContainer = createNewElement('div', {classes: ['group-container'], text: ''}, [groupElement, deleteGroupButton]);
        addEvent(groupElement, 'click', loadGroup, [group.id]); 
        addEvent(groupElement, 'click', closeLoadMenu, []); 
        addEvent(deleteGroupButton, 'click', deleteGroup, [group.id]);
        addEvent(deleteGroupButton, 'click', displayGroupList, []);
        loadGroupList.appendChild(groupContainer);
    });
}

export const openLoadMenu = (button) => {
    const loadGroupList = getLoadMenu();
    showElement(loadGroupList);
    displayGroupList();
}

const closeLoadMenu = () => {
    const loadGroupList = getLoadMenu();
    loadGroupList.classList.add('hidden');
}

const getLoadMenu = () => {
    return document.querySelector('.load-group');
}

export const openNewMenu = (button) => {
    const newGroup = getNewMenu();
    showElement(newGroup);
}

const closeNewMenu = () => {
    const newGroup = getNewMenu();
    newGroup.classList.add('hidden');
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

export const showElement = (element) => {
    toggle(element);
}

export const createNewGroup = (groupName, groupDate, groupDuration) => {
    if (groupName.value && groupDate.value && groupDuration.value && shiftTypesArray.length > 0){
        const groupID = generateID(groupName.value);
        createGroup(groupID, groupName.value, groupDate.value, groupDuration.value, shiftTypesArray);
        resetNewGroup();
        closeNewMenu();
        loadGroup(groupID);
    }
}

const resetNewGroup = () => {
    shiftTypesArray = [];

    const groupName = document.getElementById('newGroupName');
    const groupDate = document.getElementById('newGroupDate');
    const groupDuration = document.getElementById('newGroupDuration');
    groupName.value = '';
    groupDate.value = '';
    groupDuration.value = '';

    const exampleTable = document.getElementById('exampleTable');
    exampleTable.innerHTML = '<thead><tr id = "exampleHeaderRow"><th>Day</th></tr></thead><tbody><tr><td>Mon</td></tr><tr><td>Tue</td></tr><tr><td>...</td></tr></tbody>';
}