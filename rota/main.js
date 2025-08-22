import { addNumberOfWeeks, clearRotas, generateShifts, orderStaffByName, shiftLength } from "./utils.js";
import { groups } from "./data.js";
import { assignStaff } from "./assignment.js";
import { orderStaffByPriority } from "./utils.js";
import { renderRota } from "./visualGenerator.js";
import { render } from "./rotaHandler.js";
import { addNewStaff, fillStaffSelect, initialiseAddStaff, resetPage } from "./options.js";
import { fillShiftSelect } from "./options.js";
import { clearStaffShifts } from "./utils.js";
import { addEvent } from "./options.js";
import { addEventToCreateButton, openLoadMenu, openNewMenu } from "./groupHandler.js";
import { displayFirstRota } from "./rotaHandler.js";
import { displayCurrentStats } from "./stats.js";

export let currentGroup;
export let currentStaff;
export let currentShiftPatterns;
export const unassignedValue = 'unassigned';

export const updateCurrentStaff = (newCurrentStaff) => {
    currentStaff = newCurrentStaff;
    currentStaff = orderStaffByName(currentStaff);
}

export const updateCurrentShifts = (newCurrentShifts) => {
    currentShiftPatterns = newCurrentShifts;
}

export const loadGroup = (id) => {
    currentGroup = groups.find(r => r.id === id);
    currentStaff = currentGroup.staff;
    currentShiftPatterns = currentGroup.shifts;
    resetPage();
    fillStaffSelect();
    fillShiftSelect();
    initialiseAddStaff();
}

const loadButton = document.getElementById('load');
addEvent(loadButton, 'click', openLoadMenu, [loadButton])

const newButton = document.getElementById('new');
addEvent(newButton, 'click', openNewMenu, [newButton])

export let myShifts;

const generateRota = () => {
    clearStaffShifts(currentGroup.currentRota);
    const currentWeek = addNumberOfWeeks(currentGroup.startDate, currentGroup.currentRota);
    myShifts = generateShifts(currentWeek);
    const assignment = assignStaff(myShifts, currentWeek, currentGroup.currentRota);
    currentGroup.rotas[currentGroup.currentRota] = assignment;

    render(currentGroup.currentRota);
}

const generateRotaForAllWeeks = () => {
    clearRotas();
    for (let i = 0; i < currentGroup.duration; i++){
        clearStaffShifts(i);
        const startDate = addNumberOfWeeks(currentGroup.startDate, i);
        myShifts = generateShifts(startDate);
        const assignment = assignStaff(myShifts, startDate, i);

        currentGroup.rotas.push(assignment);
    }

    displayFirstRota();
}

const fillRemainingShifts = () => {
    const assignedShifts = currentGroup.rotas[currentGroup.currentRota];
    const currentWeek = addNumberOfWeeks(currentGroup.startDate, currentGroup.currentRota);
    const unassignedShifts = generateShifts(currentWeek);       //generate all shifts again so we can compare which ones are assigned
    
    const assigneShiftIDs = new Set(assignedShifts.map(s => s.id));     //create set of all shift IDs where the shift is assigned
    const newShifts = unassignedShifts.filter(s => !assigneShiftIDs.has(s.id));     //get all shifts that are unassigned by comparing IDs to assigned shifts
    const newAssignment = assignStaff(newShifts, currentWeek, currentGroup.currentRota);      //assign each new shift same as always
    
    newAssignment.forEach(a => currentGroup.rotas[currentGroup.currentRota].push(a));   //push each new assignment to final rota

    render(currentGroup.currentRota); //re-render rota with new shift
}

document.getElementById('generateButton').addEventListener('click', () => {
    generateRota();
});
document.getElementById('generateAllButton').addEventListener('click', () => {
    generateRotaForAllWeeks();
});
document.getElementById('fillShifts').addEventListener('click', () => {
    fillRemainingShifts();
});

addEventToCreateButton();

export const swapShifts = (newShift, newStaffName, oldShift, oldStaffName) => {
    const newShiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === newShift);
    newShiftObject.assignedTo = newStaffName;
    const oldShiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === oldShift);
    oldShiftObject.assignedTo = oldStaffName;

    //update staff values
    const newStaff = currentStaff.find(s => s.name === newStaffName);
    newStaff.assignedHours[currentGroup.currentRota] = (newStaff.assignedHours[currentGroup.currentRota] - shiftLength(oldShiftObject) + shiftLength(newShiftObject));
    newStaff.totalHours = (newStaff.totalHours - shiftLength(oldShiftObject) + shiftLength(newShiftObject));
    const oldStaff = currentStaff.find(s => s.name === oldStaffName);
    oldStaff.assignedHours[currentGroup.currentRota] = (oldStaff.assignedHours[currentGroup.currentRota] - shiftLength(newShiftObject) + shiftLength(oldShiftObject));
    oldStaff.totalHours = (oldStaff.totalHours - shiftLength(newShiftObject) + shiftLength(oldShiftObject));

    displayCurrentStats();
    render(currentGroup.currentRota);
}

export const changeShifts = (shift, oldStaffName, newStaffName) => {
    const shiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === shift);

    if(newStaffName === unassignedValue){
        shiftObject.assignedTo = unassignedValue;
        return;
    }
    if(oldStaffName !== unassignedValue){
        const oldStaff = currentStaff.find(s => s.name === oldStaffName);
        oldStaff.assignedHours[currentGroup.currentRota] = (oldStaff.assignedHours[currentGroup.currentRota] - shiftLength(shiftObject));
        oldStaff.totalHours = (oldStaff.totalHours - shiftLength(shiftObject));
    }
    shiftObject.assignedTo = newStaffName;
    const newStaff = currentStaff.find(s => s.name === newStaffName);
    newStaff.assignedHours[currentGroup.currentRota] = (newStaff.assignedHours[currentGroup.currentRota] + shiftLength(shiftObject));
    newStaff.totalHours = (newStaff.totalHours + shiftLength(shiftObject));

    displayCurrentStats();
    render(currentGroup.currentRota);
}