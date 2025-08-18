import { addHideOnClickOutside, hideOnClickOutside, toggle } from "./clickOutside.js";
import { groups, staff, shiftPatterns, createGroup } from "./data.js";
import { loadGroup } from "./main.js";
import { addEvent, clearContainer, createNewElement } from "./options.js";

const displayGroupList = () => {
    const loadGroupList = getLoadMenu();
    clearContainer(loadGroupList);
    loadGroupList.appendChild(createNewElement('h3', {classes: [], text: `Load Group`}, []));
    groups.forEach(group => {
        const groupElement = createNewElement('p', {classes: [], text: `${group.name}`}, []);
        addEvent(groupElement, 'click', loadGroup, [group.id]); 
        addEvent(groupElement, 'click', closeLoadMenu, []); 
        loadGroupList.appendChild(groupElement);
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
    const createButton = newGroup.getElementsByTagName('button')[0];
    addEvent(createButton, 'click', createGroup, [groupName, groupDate, groupDuration]);
    addEvent(createButton, 'click', closeNewMenu, []);
}

export const showElement = (element) => {
    toggle(element);
}