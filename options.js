import { currentGroup, fillRemainingShifts } from "./main.js";
import { addHoliday, addShift, addStaff, changeContract, changeShiftType, deleteHoliday, deleteShift, deleteStaff } from "./data.js";
import { showElement } from "./groupHandler.js";
import { convertHolidayText } from "./utils.js";
import { orderHolidays } from "./rotaUtils.js";

//---Staff Options---
export const fillStaffSelect = () => {
    const staffSelect = document.getElementById('staffSelect');
    clearContainer(staffSelect);
    staffSelect.innerHTML = '<option value = "">Select Employee</option>';
    const options = currentGroup.staff.map(s => s.name);
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
    const deleteBtn = document.querySelector('.delete-employee-button');
    if (deleteBtn) {
        deleteBtn.remove();
    }

    const staffOptions = document.getElementById('staffOptions');
    const holidayList = document.getElementById('holidayList');
    clearContainer(holidayList);
    if (staffName){
        const selectedPerson = currentGroup.staff.find(s => s.name === staffName);
        orderHolidays(selectedPerson.holidays).forEach(h => {
            let holidayText = `${convertHolidayText(h.start)} - ${convertHolidayText(h.end)}`;
            if (convertHolidayText(h.start) === convertHolidayText(h.end)){
                holidayText = `${convertHolidayText(h.start)}`;
            }
            const holidayTextObject = createNewElement('p', {classes: [], text: holidayText}, []);
            const holidayButton = createNewElement('button', {classes: ['delete-holiday-button'], text: 'Delete'}, []);
            addEvent(holidayButton, 'click', deleteHoliday, [currentGroup, selectedPerson, h.id]);
            holidayButton.setAttribute("tabindex", "0");        //make it able to tab into button
            addEvent(holidayButton, 'click', staffSelected, [selectedPerson.name]);
            const holidayContainer = createNewElement('div', {classes: ['holiday-container'], text: ''}, [holidayTextObject, holidayButton]);
            holidayList.appendChild(holidayContainer);
        });

        const addHolidayButtonTemp = document.querySelector('.add-holiday-button');
        const addHolidayButton = addHolidayButtonTemp.cloneNode(true);
        addHolidayButtonTemp.parentNode.replaceChild(addHolidayButton, addHolidayButtonTemp);
        addEvent(addHolidayButton, 'click', addNewHoliday, [selectedPerson]);
        showCalendar();
        showStaffInfo();
        const deleteStaffButton = createNewElement('button', {classes: ['delete-employee-button'], text: 'Delete Employee'}, []);
        addEvent(deleteStaffButton, 'click', deleteOldStaff, [selectedPerson, deleteStaffButton]);
        deleteStaffButton.setAttribute("tabindex", "0");        //make it able to tab into button
        staffOptions.appendChild(deleteStaffButton);

        initialiseContractOptions(selectedPerson);
    }
    else{
        removeCalendar();
        hideStaffInfo();
    }
}

const initialiseContractOptions = (person) => {
    const contractText = document.getElementById('staffContract');
    contractText.innerText = person.contractedHours;

    const changeInput = document.querySelector('.change-contract-input');
    const newChangeInput = createNewElement('input', {classes: ['change-contract-input'], text: ''}, [])
    changeInput.replaceWith(newChangeInput);

    const changeButton = document.querySelector('.change-contract-button');
    const newChangeButton = createNewElement('button', {classes: ['change-contract-button'], text: 'Change'}, [])
    newChangeButton.setAttribute("tabindex", "0");        //make it able to tab into button
    addEvent(newChangeButton, 'click', changeStaffContract, [person, newChangeInput]);
    changeButton.replaceWith(newChangeButton)
}

const changeStaffContract = (person, changeStaffContractInput) => {
    if (changeStaffContractInput.value){
        changeContract(currentGroup, person.id, changeStaffContractInput);
        staffSelected(person.name)
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

const showStaffInfo = () => {
    const staffInfo = document.getElementById('staffOptionsOtherInfo');
    if (staffInfo !== null){
        staffInfo.classList.remove('hidden');
    }
}

const hideStaffInfo = () => {
    const staffInfo = document.getElementById('staffOptionsOtherInfo');
    if (staffInfo !== null){
        staffInfo.classList.add('hidden');
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
    if(!currentGroup){return; }
    const shiftsList = document.getElementById('shiftsList');
    clearContainer(shiftsList);
    if (selectedDay) {
        if (currentGroup.shifts[currentGroup.currentRota]){
            const day = currentGroup.shifts[currentGroup.currentRota][selectedDay];
            if (day.length > 0){
                day.forEach(d => {
                    const shiftText = createNewElement('p', {classes: [], text: `${d.start} - ${d.end}`}, []);

                    const shiftTypeSelect = createNewElement('select', {classes: ['shift-type-select'], text: ''}, []);
                    currentGroup.shiftTypes.forEach(st => {
                        const optionElem = createNewElement('option', {}, []);
                        optionElem.value = st;
                        optionElem.textContent = st;
                        shiftTypeSelect.appendChild(optionElem);
                        if (d.shiftType === st){shiftTypeSelect.value = st;}
                    });
                    addEvent(shiftTypeSelect, 'change', changeShiftTypeEvent, [selectedDay, d.id, shiftTypeSelect]);

                    const shiftButton = createNewElement('button', {classes: ['delete-shift-button'], text: 'Delete'}, []);
                    addEvent(shiftButton, 'click', deleteShift, [currentGroup, selectedDay, d.id]);
                    shiftButton.setAttribute("tabindex", "0");        //make it able to tab into button
                    addEvent(shiftButton, 'click', shiftSelected, [selectedDay]);
                    const shiftContainer = createNewElement('div', {classes: ['shift-container'], text: ''}, [shiftText, shiftTypeSelect, shiftButton]);
                    shiftsList.appendChild(shiftContainer);
                });
            }
        }
        showShiftInfo();

        //add shift button
        const addShiftButtonTemp = document.querySelector('.add-shift-button');
        const addShiftButton = addShiftButtonTemp.cloneNode(true);
        addShiftButtonTemp.parentNode.replaceChild(addShiftButton, addShiftButtonTemp);
        addEvent(addShiftButton, 'click', addNewShift, [selectedDay]);

        //add shift all weeks button
        const addShiftAllButtonTemp = document.querySelector('.add-shift-all-button');
        const addShiftAllButton = addShiftAllButtonTemp.cloneNode(true);
        addShiftAllButtonTemp.parentNode.replaceChild(addShiftAllButton, addShiftAllButtonTemp);
        addEvent(addShiftAllButton, 'click', addNewShiftToAllWeeks, [selectedDay]);
        showTime();
    }
    else{
        removeTime();
        hideShiftInfo();
    }
    
}

const showShiftInfo = () => {
    const shiftInfo = document.getElementById('shiftOptionsOtherInfo');
    if (shiftInfo !== null){
        shiftInfo.classList.remove('hidden');
    }
}

const hideShiftInfo = () => {
    const shiftInfo = document.getElementById('shiftOptionsOtherInfo');
    if (shiftInfo !== null){
        shiftInfo.classList.add('hidden');
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

    const shiftTypeSelect = document.getElementById('shiftTypeSelect');
    shiftTypeSelect.innerHTML = '';
    const options = currentGroup.shiftTypes;
    options.forEach(option => {
        const optionElem = createNewElement('option', {}, []);
        optionElem.value = option;
        optionElem.textContent = option;
        shiftTypeSelect.appendChild(optionElem);
    });
}

const addNewShift = (selectedDay) => {
    const start = document.getElementById('startTime');
    const end = document.getElementById('endTime');
    const shiftTypeSelect = document.getElementById('shiftTypeSelect');

    if (start.value && end.value && start.value < end.value && shiftTypeSelect){
        addShift(currentGroup, currentGroup.currentRota, selectedDay, start.value, end.value, shiftTypeSelect.value);
        shiftSelected(selectedDay);
        fillRemainingShifts();
    }
}

const addNewShiftToAllWeeks = (selectedDay) => {
    const start = document.getElementById('startTime');
    const end = document.getElementById('endTime');
    const shiftTypeSelect = document.getElementById('shiftTypeSelect');

    if (start.value && end.value && start.value < end.value && shiftTypeSelect){
        for (let i = 0; i < currentGroup.duration; i++){
            addShift(currentGroup, i, selectedDay, start.value, end.value, shiftTypeSelect.value);
        }
        shiftSelected(selectedDay);
        fillRemainingShifts();
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
    if (!currentGroup){return;}
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
    addEvent(cloneOfNewButton, 'click', () => { showElement(newStaffContainer.parentElement); });

    const nameInput = newStaffContainer.querySelector('.name-input');
    const hoursInput = newStaffContainer.querySelector('.hours-input');
    const addEmployeeButton  = newStaffContainer.getElementsByTagName('button')[0];
    const cloneOfAddButton = addEmployeeButton.cloneNode(true);
    addEmployeeButton.replaceWith(cloneOfAddButton);
    addEvent(cloneOfAddButton, 'click', addNewStaff, [nameInput, hoursInput, newStaffContainer.parentElement]);
}

export const addNewStaff = (nameInput, hoursInput, container) => {
    if (nameInput.value && hoursInput.value){
        console.log(nameInput.value);
        if(currentGroup.staff.some(s => (s.name).toUpperCase() === (nameInput.value).toUpperCase())){return;}
        addStaff(currentGroup, nameInput.value, hoursInput.value);
        resetPage();
        nameInput.value = '';
        hoursInput.value = '';
        container.classList.add('hidden');
    }
}

export const deleteOldStaff = (person, button) => {
    button.remove();
    hideStaffInfo();
    deleteStaff(currentGroup, person.id);
    resetPage();
}

const changeShiftTypeEvent = (day, shiftID, shiftTypeInput) => {
    changeShiftType(currentGroup, day, shiftID, shiftTypeInput.value);
}