import { changeShifts, currentGroup, currentStaff, unassignedValue } from "./main.js"
import { addEvent } from "./options.js";
import { createNewElement } from "./options.js";
import { render } from "./rotaHandler.js";

export const initialiseSelects = () => {
    //const person = currentStaff.filter(s => s.id === staffID)[0];
    //console.log(person.name);
    addClickEvent();
}

const addClickEvent = () => {
    const allNames = document.querySelectorAll('.selectable');
    allNames.forEach(n => n.addEventListener('mouseup', () => turnToSelect(n, n.innerText)));
}

const turnToSelect = (element, name) => {
    const selectElem = createNewElement('select', {classes: ['new-staff-select'], text: ''}, []);
    fillSelectWithStaff(selectElem, name);
    element.replaceWith(selectElem);
    selectElem.focus();

    const shiftID = selectElem.parentElement.parentElement.id;
    selectElem.id = shiftID;

    addChangeEvent(selectElem, shiftID, name);
    changeOnClick(selectElem, name);
}

const fillSelectWithStaff = (selectElem) => {
    selectElem.innerHTML = `<option value = "">Select Staff</option>`;
    const options = currentStaff.map(s => s.name);
    options.forEach(option => {
        const optionElem = createNewElement('option', {}, []);
        optionElem.value = option;
        optionElem.textContent = option;
        selectElem.appendChild(optionElem);
    });
    createUnassignedOption(selectElem);
    selectElem.value = ``;
}

const createUnassignedOption = (selectElem) => {
    const unassignedElem = createNewElement('option', {}, []);
    unassignedElem.value = unassignedValue;
    unassignedElem.textContent = unassignedValue;
    selectElem.appendChild(unassignedElem);
}

const addChangeEvent = (selectElem, shiftID, oldStaff) => {
    selectElem.addEventListener('input', () => {
        changeName(selectElem, selectElem.value, shiftID, oldStaff)
    });
}

const changeName = (selectElem, newStaff, shiftID, oldStaff) => {
    if(newStaff === unassignedValue){
        const pReplacement = createNewElement('p', {classes: ['selectable'], text: `${unassignedValue}`}, []);
        selectElem.replaceWith(pReplacement);
        changeShifts(shiftID, oldStaff, unassignedValue);
        return;
    }
    const person = currentStaff.filter(s => s.name === newStaff)[0];
    const pReplacement = createNewElement('p', {classes: ['draggable', 'selectable'], text: `${person.name}`}, []);
    selectElem.replaceWith(pReplacement);
    changeShifts(shiftID, oldStaff, newStaff);
}

const changeOnClick = (select, staffName) => {
    setTimeout(() => {
        const outsideClickListener = (event) => {
            if(!select.contains(event.target)){
                render(currentGroup.currentRota);       //resets rota
                removeClickListener();
            }
        }

        const removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener);
        }

        document.addEventListener('click', outsideClickListener);
    }, 0);
}