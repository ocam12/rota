import { currentGroup, swapShifts } from "./main.js";
import { unassignedValue } from "./constants.js";
import { initialiseSelects } from "./rotaEditing.js";
import { addNumberOfDays, addNumberOfWeeks, hideElement, showElement } from "./utils.js";

const tableSection = document.querySelector('.table-section');

export const rotaIsHidden = () => {
    return tableSection.classList.contains('hidden');
}

export const hideRota = () => {
    hideElement(tableSection);        //hide tables
}

export const renderRota = (shifts, currentRota) => {
    showElement(tableSection);        //show tables
    const firstDate = addNumberOfWeeks(currentGroup.startDate, currentRota);
    const firstDay = getDay(firstDate);
    const shiftsByDay = [
        {day: firstDay, date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 0), daysShifts: shifts.filter(s => s.day === firstDay)},
        {day: addDayToFirst(firstDate, 1), date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 1), daysShifts: shifts.filter(s => s.day === addDayToFirst(firstDate, 1))},
        {day: addDayToFirst(firstDate, 2), date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 2), daysShifts: shifts.filter(s => s.day === addDayToFirst(firstDate, 2))},
        {day: addDayToFirst(firstDate, 3), date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 3), daysShifts: shifts.filter(s => s.day === addDayToFirst(firstDate, 3))},
        {day: addDayToFirst(firstDate, 4), date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 4), daysShifts: shifts.filter(s => s.day === addDayToFirst(firstDate, 4))},
        {day: addDayToFirst(firstDate, 5), date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 5), daysShifts: shifts.filter(s => s.day === addDayToFirst(firstDate, 5))},
        {day: addDayToFirst(firstDate, 6), date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 6), daysShifts: shifts.filter(s => s.day === addDayToFirst(firstDate, 6))}
    ];

    const thead = document.getElementById("rota-header");
    thead.innerHTML = '';
    const tbody = document.getElementById("rota-body");
    tbody.innerHTML = '';

    const shiftTypes = currentGroup.shiftTypes;
    let headerHTML = '<th scope="col">Day</th>';
    shiftTypes.forEach(st => {
        headerHTML = headerHTML + `<th scope="col">${st}</th>`;
    });
    thead.innerHTML = headerHTML;
    shiftsByDay.forEach(shift => {
        let rowHTML = `<th scope="row"><strong>${shift.day + ' ' + shift.date.slice(8, 10) + '/' + shift.date.slice(5, 7)}</strong></th>`;

        for(let i = 0; i < shiftTypes.length; i++){
            let newColumnHTML = `<td>`;
            shift.daysShifts.forEach(s => {
                if (s.shiftType === shiftTypes[i]){
                    newColumnHTML = newColumnHTML + `${'<div id = "' + s.id + '">&nbsp;' + s.start + ' - ' + s.end + `: <span class = "sortable-container"><p class = "${s.assignedTo === 'unassigned' ? 'unassigned' : ''} draggable selectable rota-name"  tabindex = "0" role = "button" aria-label = "shift assigned to ${s.assignedTo}">&nbsp;` + s.assignedTo + '</p></span></div><br>'}`;
                }
            });
            rowHTML = rowHTML + newColumnHTML + '</td>';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = rowHTML;
        tbody.appendChild(tr);
    });
    
    initialiseSelects();
    setTitle();

    const container = document.querySelectorAll("td span.sortable-container");

    container.forEach((td) => {
        Sortable.create(td, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            group: 'shifts',
            filter: '.unassigned, br',
            onMove: (evt) => {      //cannot move names into shift is shift is unassigned
                const targetContainer = evt.to;
                const hasUnassigned = Array.from(targetContainer.children).some(c =>
                    c.classList?.contains(unassignedValue)
                );

                if (hasUnassigned) return false;
            },
            onEnd: (evt) => {
                const movedEl = evt.item;
                const toContainer = evt.to;
                const fromContainer = evt.from;

                //swap elements
                const existing = Array.from(toContainer.children).filter(c => c !== movedEl);
                if (existing.length > 0) {
                    const oldEl = existing[0];
                    toContainer.replaceChild(movedEl, oldEl);
                    fromContainer.appendChild(oldEl);
                    swapShifts(toContainer.parentElement.id, movedEl.innerText.trim(), fromContainer.parentElement.id, oldEl.innerText.trim());
                }
            }
        });
    });
}

const setTitle = () => {
    const currentWeek = document.getElementById('currentWeek');
    currentWeek.innerText = `Week ${currentGroup.currentRota + 1}`;
}

const getDay = (date) => {
    return (new Date(date)).toLocaleDateString('en-GB', {weekday: 'long'});
}

const addDayToFirst = (date, days) => {
    return getDay(addNumberOfDays(date, days));
}