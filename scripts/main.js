import { addNumberOfWeeks } from "./utils.js";
import { clearRotas, generateShifts, orderStaffByName, shiftLength, orderStaffByPriority, clearStaffShifts } from "./rotaUtils.js";
import { groups, loadGroups } from "./data.js";
import { assignShifts } from "./assignment.js";
import { hideRota, renderRota } from "./visualGenerator.js";
import { render, displayFirstRota } from "./rotaHandler.js";
import { addNewStaff, addEvent, initialiseAddStaff, resetPage } from "./options.js";
import { addEventToCreateButton, openLoadMenu, openNewMenu } from "./groupHandler.js";
import { showElement } from "./utils.js";
import { unassignedValue } from "./constants.js";
import { initialiseGroupOptionButtons } from "./groupOptions.js";

export let currentGroup;

export const loadGroup = (id) => {
    currentGroup = groups.find(r => r.id === id);
    hideRota();
    resetPage();
    initialiseAddStaff();
    setTitle();

    if(currentGroup.rotas.length <= 0){
        generateRota();   
    }
    render(currentGroup.currentRota);
}

export const unloadGroup = () => {
    currentGroup = null;
    hideRota();
    resetPage();
}

export const setTitle = () => {
    getTitleObject().innerText = currentGroup.name;
}

const getTitleObject = () => {
    return document.getElementById('group-title');
}


export const initMainPage = () => {
    if (!window.location.pathname.endsWith("index.html")) {
        return;
    }
    
    const accountButton = document.getElementById('accountButton');
    if (accountButton){
        accountButton.innerText = 'Account';
    }
    
    const loadButton = document.getElementById('load');
    if (loadButton) {
        addEvent(loadButton, 'click', openLoadMenu, [loadButton]);
        showElement(loadButton);
    }

    const newButtons = document.querySelectorAll('.new');
    newButtons.forEach(nb => {
        if (nb) {
            addEvent(nb, 'click', openNewMenu, [nb]);
            showElement(nb);
        }
    });

    const remakeBtn = document.getElementById('remake');
    if (remakeBtn) remakeBtn.addEventListener('click', generateRota);

    const autofillBtn = document.getElementById('autofill');
    if (autofillBtn) autofillBtn.addEventListener('click', fillRemainingShifts);

    addEventToCreateButton();
    initialiseGroupOptionButtons();
    openLoadMenu();
}

export let myShifts;

export const generateRota = () => {
    clearStaffShifts(currentGroup.currentRota);
    const currentWeek = addNumberOfWeeks(currentGroup.startDate, currentGroup.currentRota);
    myShifts = generateShifts(currentWeek, currentGroup.currentRota);
    const assignment = assignShifts(myShifts, currentWeek, currentGroup.currentRota);
    currentGroup.rotas[currentGroup.currentRota] = assignment;

    render(currentGroup.currentRota);
}

const generateRotaForAllWeeks = () => {
    clearRotas();
    for (let i = 0; i < currentGroup.duration; i++){
        clearStaffShifts(i);
        const startDate = addNumberOfWeeks(currentGroup.startDate, i);
        myShifts = generateShifts(startDate, i);
        const assignment = assignShifts(myShifts, startDate, i);

        currentGroup.rotas.push(assignment);
    }

    displayFirstRota();
}

export const fillRemainingShifts = () => {
    for (let i = 0; i < currentGroup.duration; i++){
        const assignedShifts = currentGroup.rotas[i];       //grab all shifts that have been assigned already

        if(!assignedShifts){continue;}      //if week has no shifts, then don't bother checking for unassigned ones and continue to next week
        const currentWeek = addNumberOfWeeks(currentGroup.startDate, i);
        const unassignedShifts = generateShifts(currentWeek, i);       //generate all shifts again so we can compare which ones are assigned
        
        const assignedShiftIDs = new Set(assignedShifts.filter(s => s.assignedTo !== unassignedValue).map(s => s.patternId));     //create set of all shift IDs where the shift is assigned
        const newShifts = unassignedShifts.filter(s => !assignedShiftIDs.has(s.patternId));     //get all shifts that are unassigned by comparing IDs to assigned shifts
        
        const newAssignment = assignShifts(newShifts, currentWeek, i);      //assign each new shift same as always
        for (let i = newAssignment.length - 1; i >= 0; i--){
            const s = newAssignment[i];
            const match = assignedShifts.find(a => a.patternId === s.patternId);
            if (match){
                match.assignedTo = s.assignedTo;
                newAssignment.splice(i, 1);     //remove from new assignments as have now been assigned
            }
        }
        
        newAssignment.forEach(a => currentGroup.rotas[i].push(a));   //push each new assignment that is not assigned to final rota
    }
    render(currentGroup.currentRota); //re-render rota with new shift
}

export const swapShifts = (newShift, newStaffName, oldShift, oldStaffName) => {
    const newShiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === newShift);
    newShiftObject.assignedTo = newStaffName.trim();
    const oldShiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === oldShift);
    oldShiftObject.assignedTo = oldStaffName.trim();

    //update staff values
    const newStaff = currentGroup.staff.find(s => s.name === newStaffName.trim());
    newStaff.assignedShifts[currentGroup.currentRota].push(newShiftObject);
    newStaff.assignedShifts[currentGroup.currentRota] = newStaff.assignedShifts[currentGroup.currentRota].filter(s => s.patternId !== oldShiftObject.patternId);
    newStaff.assignedHours[currentGroup.currentRota] = (newStaff.assignedHours[currentGroup.currentRota] - shiftLength(oldShiftObject) + shiftLength(newShiftObject));
    newStaff.totalHours = (newStaff.totalHours - shiftLength(oldShiftObject) + shiftLength(newShiftObject));

    if(oldStaffName !== unassignedValue){
        const oldStaff = currentGroup.staff.find(s => s.name === oldStaffName.trim());
        oldStaff.assignedHours[currentGroup.currentRota] = (oldStaff.assignedHours[currentGroup.currentRota] - shiftLength(newShiftObject) + shiftLength(oldShiftObject));
        oldStaff.assignedShifts[currentGroup.currentRota].push(oldShiftObject);
        oldStaff.assignedShifts[currentGroup.currentRota] = oldStaff.assignedShifts[currentGroup.currentRota].filter(s => s.patternId !== newShiftObject.patternId);
        oldStaff.totalHours = (oldStaff.totalHours - shiftLength(newShiftObject) + shiftLength(oldShiftObject));
    }

    render(currentGroup.currentRota);
}

export const changeShifts = (shift, oldStaffName, newStaffName) => {
    const shiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === shift);
    const oldStaff = currentGroup.staff.find(s => s.name === oldStaffName);

    if(newStaffName === unassignedValue){
        shiftObject.assignedTo = unassignedValue;
        oldStaff.assignedShifts[currentGroup.currentRota] = oldStaff.assignedShifts[currentGroup.currentRota].filter(s => s.patternId !== shiftObject.patternId);
        oldStaff.assignedHours[currentGroup.currentRota] = (oldStaff.assignedHours[currentGroup.currentRota] - shiftLength(shiftObject));
        oldStaff.totalHours = (oldStaff.totalHours - shiftLength(shiftObject));
        render(currentGroup.currentRota);
        return;
    }
    if(oldStaffName !== unassignedValue){
        oldStaff.assignedShifts[currentGroup.currentRota] = oldStaff.assignedShifts[currentGroup.currentRota].filter(s => s.patternId !== shiftObject.patternId);
        oldStaff.assignedHours[currentGroup.currentRota] = (oldStaff.assignedHours[currentGroup.currentRota] - shiftLength(shiftObject));
        oldStaff.totalHours = (oldStaff.totalHours - shiftLength(shiftObject));
    }
    shiftObject.assignedTo = newStaffName;
    const newStaff = currentGroup.staff.find(s => s.name === newStaffName);
    newStaff.assignedShifts[currentGroup.currentRota].push(shiftObject);
    newStaff.assignedHours[currentGroup.currentRota] = (newStaff.assignedHours[currentGroup.currentRota] + shiftLength(shiftObject));
    newStaff.totalHours = (newStaff.totalHours + shiftLength(shiftObject));

    render(currentGroup.currentRota);
}

export const printToPDF = () => {
    const tableElement = document.getElementById('rotaTable');
    const newWindow = window.open('', '', `width=${tableElement.style.width}, height=${tableElement.style.height}`);
    newWindow.document.writeln('<html><head><title>Print</title><link rel="stylesheet" href="styles.css"></head><body>');
    newWindow.document.writeln(tableElement.outerHTML);
    newWindow.document.writeln("</body></html>");
    newWindow.print(); // user can then "Save as PDF"
    newWindow.document.close();
}