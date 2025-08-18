import { addNumberOfWeeks, clearRotas, generateShifts, orderStaffByName } from "./utils.js";
import { groups } from "./data.js";
import { assignStaff } from "./assignment.js";
import { orderStaffByPriority } from "./utils.js";
import { renderRota } from "./visualGenerator.js";
import { addNewStaff, fillStaffSelect, initialiseAddStaff, resetPage } from "./options.js";
import { fillShiftSelect } from "./options.js";
import { clearStaffShifts } from "./utils.js";
import { addEvent } from "./options.js";
import { addEventToCreateButton, openLoadMenu, openNewMenu } from "./groupHandler.js";
import { displayFirstRota } from "./rotaHandler.js";

export let currentGroup;
export let currentStaff;
export let currentShiftPatterns;

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
    clearStaffShifts();
    const currentWeek = addNumberOfWeeks(currentGroup.startDate, currentGroup.currentRota);
    myShifts = generateShifts(currentWeek);
    const assignment = assignStaff(myShifts, currentWeek);
    currentGroup.rotas[currentGroup.currentRota] = assignment;

    console.log(currentStaff);
    renderRota(assignment, currentGroup.currentRota);
}

const generateRotaForAllWeeks = () => {
    clearRotas();
    for (let i = 0; i < currentGroup.duration; i++){
        clearStaffShifts();
        const week = addNumberOfWeeks(currentGroup.startDate, i);
        myShifts = generateShifts(week);
        const assignment = assignStaff(myShifts, week);

        currentGroup.rotas.push(assignment);
    }

    console.log(currentStaff);
    console.log(currentGroup.rotas)
    displayFirstRota();
}

document.getElementById('generateButton').addEventListener('click', () => {
    generateRota();
});
document.getElementById('generateAllButton').addEventListener('click', () => {
    generateRotaForAllWeeks();
});

addEventToCreateButton();

export const updateShifts = (newShift, newStaff, oldShift, oldStaff) => {
    const newShiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === newShift);
    newShiftObject.assignedTo = newStaff;
    const oldShiftObject = currentGroup.rotas[currentGroup.currentRota].find(s => s.id === oldShift);
    oldShiftObject.assignedTo = oldStaff;
}