//import { staff } from "./data.js";
//import { shiftPatterns } from "./data.js";
import { currentGroup, currentStaff, updateCurrentStaff } from "./main.js";
import { addHoliday, addShift, addStaff, deleteHoliday, deleteShift, deleteStaff } from "./data.js";
import { showElement } from "./groupHandler.js";
import { convertHolidayText, orderHolidays } from "./utils.js";

//---Staff Options---
export const fillStaffSelect = () => {
    const staffSelect = document.getElementById('staffSelect');
    clearContainer(staffSelect);
    staffSelect.innerHTML = '<option value = "">Select Employee</option>';
    const options = currentStaff.map(s => s.name);
    options.forEach(option => {
        const optionElem = createNewElement('option', {}, []);
        optionElem.value = option;
        optionElem.textContent = option;
        staffSelect.appendChild(optionElem);
    });
    staffSelect.value = '';
    initialiseDropDowns(staffSelect, staffSelected);
}

const initialiseDropDowns = (selectElement, functionCall) => {
    selectElement.addEventListener('change', () => {
        functionCall(selectElement.value)
    });
}

const staffSelected = (staffName) => {
    const staffOptions = document.getElementById('staffOptions');
    const holidayList = document.getElementById('holidayList');
    clearContainer(holidayList);
    if (staffName){
        const selectedPerson = currentStaff.find(s => s.name === staffName);
        orderHolidays(selectedPerson.holidays).forEach(h => {
            const holidayText = createNewElement('p', {classes: [], text: `${convertHolidayText(h.start)} - ${convertHolidayText(h.end)}`}, []);
            const holidayButton = createNewElement('button', {classes: ['delete-holiday-button'], text: 'Delete'}, []);
            addEvent(holidayButton, 'click', deleteHoliday, [currentGroup, selectedPerson, h.id]);
            addEvent(holidayButton, 'click', staffSelected, [selectedPerson.name]);
            const holidayContainer = createNewElement('div', {classes: ['holiday-container'], text: ''}, [holidayText, holidayButton]);
            holidayList.appendChild(holidayContainer);
        });

        const addHolidayButtonTemp = document.querySelector('.add-holiday-button');
        const addHolidayButton = addHolidayButtonTemp.cloneNode(true);
        addHolidayButtonTemp.parentNode.replaceChild(addHolidayButton, addHolidayButtonTemp);
        addEvent(addHolidayButton, 'click', addNewHoliday, [selectedPerson]);
        showCalendar();

        const deleteBtn = document.querySelector('.delete-employee-button');
        if (deleteBtn) {
            deleteBtn.remove();
        }
        const deleteStaffButton = createNewElement('button', {classes: ['delete-employee-button'], text: 'Delete Employee'}, []);
        addEvent(deleteStaffButton, 'click', deleteOldStaff, [selectedPerson, deleteStaffButton]);
        staffOptions.appendChild(deleteStaffButton);
    }
    else{
        removeCalendar();
    }
}

const addNewHoliday = (selectedPerson) => {
    const start = document.getElementById('startDate');
    const end = document.getElementById('endDate');

    if (start.value && end.value && new Date(start.value) <= new Date(end.value)){
        addHoliday(currentGroup, selectedPerson, start.value, end.value);
        staffSelected(selectedPerson.name);
    }
}

const removeCalendar = () => {
    const calendar = document.querySelector('.calendar-container');
    if (calendar !== null){
        calendar.classList.add('hidden');
    }
}

const showCalendar = () => {
    const calendar = document.querySelector('.calendar-container');
    if (calendar !== null){
        calendar.classList.remove('hidden');
        calendar.childNodes.forEach(child => child.value = new Date());     //resets dates back to today's date
    }
}

//---Shift Options---
export const fillShiftSelect = () => {
    const shiftSelect = document.getElementById('shiftSelect');
    initialiseDropDowns(shiftSelect, shiftSelected);
    shiftSelected(shiftSelect.value);
}

const shiftSelected = (selectedDay) => {
    const shiftsList = document.getElementById('shiftsList');
    clearContainer(shiftsList);
    if (selectedDay) {
        if(currentGroup.shifts[currentGroup.currentRota]){
            const day = currentGroup.shifts[currentGroup.currentRota][selectedDay];
            if (day.length > 0){
                day.forEach(d => {
                    const shiftText = createNewElement('p', {classes: [], text: `${d.start} - ${d.end}`}, []);
                    const shiftButton = createNewElement('button', {classes: ['delete-shift-button'], text: 'Delete'}, []);
                    addEvent(shiftButton, 'click', deleteShift, [currentGroup, selectedDay, d.id]);
                    addEvent(shiftButton, 'click', shiftSelected, [selectedDay]);
                    const shiftContainer = createNewElement('div', {classes: ['shift-container'], text: ''}, [shiftText, shiftButton]);
                    shiftsList.appendChild(shiftContainer);
                });
            }
        }

        const addShiftButtonTemp = document.querySelector('.add-shift-button');
        const addShiftButton = addShiftButtonTemp.cloneNode(true);
        addShiftButtonTemp.parentNode.replaceChild(addShiftButton, addShiftButtonTemp);
        addEvent(addShiftButton, 'click', addNewShift, [selectedDay]);
        showTime();
    }
    else{
        removeTime();
    }
    
}

const removeTime = () => {
    const timeContainer = document.querySelector('.time-container');
    if (timeContainer !== null){
        timeContainer.classList.add('hidden');
    }
}

const showTime = () => {
    const timeContainer = document.querySelector('.time-container');
    if (timeContainer !== null){
        timeContainer.classList.remove('hidden');
        timeContainer.childNodes.forEach(child => child.value = child.defaultValue);     //resets times back to default values
    }
}

const addNewShift = (selectedDay) => {
    const start = document.getElementById('startTime');
    const end = document.getElementById('endTime');

    if (start.value && end.value && start.value < end.value){
        addShift(currentGroup, selectedDay, start.value, end.value);
        shiftSelected(selectedDay);
    }
}

export const createNewElement = (tag, options = {}, children = []) => {     //shortcut for creating new elements
    const element = document.createElement(tag);

    if (options.classes) {      //adds classes
        options.classes.forEach(c => {
            element.classList.add(c);
        });
    }

    if (options.text) {     //sets text of element
        element.innerText = options.text;
    }

    children.forEach(child => {     //add all children of element
        element.appendChild(child);
    });
    
    return element;
}

export const addEvent = (item, action, func, params = []) => {      //shortcut for adding events to elements
    item.addEventListener(action, () => {
        func(...params);
    });
}

export const clearContainer = (container) => {      //shortcut for clearing inner html of elements
    container.innerHTML = '';
}

export const resetPage = () => {        //resets all options back to original when rotas selected
    fillStaffSelect();
    fillShiftSelect();
    
    const holidayList = document.getElementById('holidayList');
    clearContainer(holidayList);
    const shiftsList = document.getElementById('shiftsList');
    clearContainer(shiftsList);

    removeCalendar();
    removeTime();
}

export const initialiseAddStaff = () => {
    const newStaffContainer = document.querySelector('.new-staff');
    const openNewStaffButton = document.getElementById('openStaffButton');
    const cloneOfNewButton = openNewStaffButton.cloneNode(true);
    openNewStaffButton.replaceWith(cloneOfNewButton);
    addEvent(cloneOfNewButton, 'click', () => { showElement(newStaffContainer); });

    const nameInput = newStaffContainer.querySelector('.name-input');
    const hoursInput = newStaffContainer.querySelector('.hours-input');
    const addEmployeeButton  = newStaffContainer.getElementsByTagName('button')[0];
    const cloneOfAddButton = openNewStaffButton.cloneNode(true);
    addEmployeeButton.replaceWith(cloneOfAddButton);
    addEvent(cloneOfAddButton, 'click', addNewStaff, [nameInput, hoursInput, newStaffContainer]);
}

export const addNewStaff = (nameInput, hoursInput, container) => {
    if (nameInput.value && hoursInput.value){
        addStaff(currentGroup, nameInput.value, hoursInput.value);
        resetPage();
        container.classList.add('hidden');
    }
}

export const deleteOldStaff = (person, button) => {
    button.remove();
    deleteStaff(currentGroup, person.id);
    updateCurrentStaff(currentGroup.staff);
    resetPage();
}