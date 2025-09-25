import { selectedButtonColour, selectedButtonTextColour, unselectedButtonColour, unselectedButtonTextColour } from "./constants.js";
import { printToPDF } from "./main.js";
import { addEvent } from "./options.js";
import { hideElement, showElement } from "./utils.js";

const hideAllMenus = () => {
    hideElement(getStaffOptions());
    hideElement(getShiftOptions());
    deselectButton(getStaffOptionsButton());
    deselectButton(getShiftOptionsButton());
}

const openMenu = (getFunction, button) => {
    if (menuIsHidden(getFunction())){
        hideAllMenus();
        showElement(getFunction());
        selectButton(button);
    }
    else {    
        hideAllMenus();
    }
}

const getStaffOptions = () => {
    return document.getElementById('staffOptions');
}

const getStaffOptionsButton = () => {
    return document.getElementById('staffOptionsButton');
}

const getShiftOptions = () => {
    return document.getElementById('shiftOptions');
}

const getShiftOptionsButton = () => {
    return document.getElementById('shiftOptionsButton');
}

const getSwitchTableViewButton = () => {
    return document.getElementById('switchTableViewButton');
}

export const menuIsHidden = (menu) => {
    return menu.classList.contains('hidden');
}

const selectButton = (button) => {
    button.style.backgroundColor = selectedButtonColour;
    button.style.color = selectedButtonTextColour;
}

const deselectButton = (button) => {
    button.style.backgroundColor = unselectedButtonColour;
    button.style.color = unselectedButtonTextColour;
}

const switchTableView = (button) => {
    const rotaTable = document.querySelector('.table-container');
    const statsTable = document.getElementById('currentStats');

    if (statsTable.classList.contains('hidden')){
        button.innerText = '📊 Hide Employee Stats';
        selectButton(button);

        showElement(statsTable);
        hideElement(rotaTable);
    }
    else{
        button.innerText = '📊 Show Employee Stats';
        deselectButton(button);

        showElement(rotaTable);
        hideElement(statsTable);
    }
}

export const initialiseGroupOptionButtons = () => {
    hideAllMenus();

    //staff options button
    const staffOptionsButton = getStaffOptionsButton();
    addEvent(staffOptionsButton, 'click', openMenu, [getStaffOptions, staffOptionsButton]);

    //shift options button
    const shiftOptionsButton = getShiftOptionsButton();
    addEvent(shiftOptionsButton, 'click', openMenu, [getShiftOptions, shiftOptionsButton]);

    const switchTableViewButton = getSwitchTableViewButton();
    addEvent(switchTableViewButton, 'click', switchTableView, [switchTableViewButton]);

    //print to PDF button
    document.getElementById('printToPDF').addEventListener('click', () => {
        printToPDF();
    });
}