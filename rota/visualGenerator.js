import { currentGroup, currentStaff, swapShifts } from "./main.js";
import { initialiseSelects } from "./rotaEditing.js";
import { addNumberOfDays, addNumberOfWeeks } from "./utils.js";

export const renderRota = (shifts, currentRota) => {
    const shiftsByDay = [
        {day: 'Monday', date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 0), daysShifts: shifts.filter(s => s.day === 'Monday')},
        {day: 'Tuesday', date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 1), daysShifts: shifts.filter(s => s.day === 'Tuesday')},
        {day: 'Wednesday', date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 2), daysShifts: shifts.filter(s => s.day === 'Wednesday')},
        {day: 'Thursday', date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 3), daysShifts: shifts.filter(s => s.day === 'Thursday')},
        {day: 'Friday', date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 4), daysShifts: shifts.filter(s => s.day === 'Friday')},
        {day: 'Saturday', date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 5), daysShifts: shifts.filter(s => s.day === 'Saturday')},
        {day: 'Sunday', date: addNumberOfDays(addNumberOfWeeks(currentGroup.startDate, currentRota), 6), daysShifts: shifts.filter(s => s.day === 'Sunday')}
    ];
    const tbody = document.getElementById("rota-body");
    tbody.innerHTML = "";

    shiftsByDay.forEach(shift => {
        const early = [];
        const mid = [];
        const late = [];
        shift.daysShifts.forEach(s => {
            if (s.end <= '13:00'){
                early.push(s);
            }else if (s.start >= '13:30' && s.end > '18:00'){
                late.push(s);
            }
            else{
                mid.push(s);
            }
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td><strong>${shift.day + ' ' + shift.date.slice(8, 10) + '/' + shift.date.slice(5, 7)}</strong></td>
        <td>${early.map(s => '<div id = "' + s.id + '">' + s.start + ' - ' + s.end + `: <span class = "sortable-container"><p class = "${s.assignedTo === 'unassigned' ? 'unassigned' : ''} draggable selectable">` + s.assignedTo + '</p></span></div>').join('<br>')}</td>
        <td>${mid.map(s => '<div id = "' + s.id + '">' + s.start + ' - ' + s.end + `: <span class = "sortable-container"><p class = "${s.assignedTo === 'unassigned' ? 'unassigned' : ''} draggable selectable">` + s.assignedTo + '</p></span></div>').join('<br>')}</td>
        <td>${late.map(s => '<div id = "' + s.id + '">' + s.start + ' - ' + s.end + `: <span class = "sortable-container"><p class = "${s.assignedTo === 'unassigned' ? 'unassigned' : ''} draggable selectable">` + s.assignedTo + '</p></span></div>').join('<br>')}</td>
        `;
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
                    c.classList?.contains("unassigned")
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
                    swapShifts(toContainer.parentElement.id, movedEl.innerText, fromContainer.parentElement.id, oldEl.innerText);
                }
            }
        });
    });
}

const setTitle = (week) => {
    const currentWeek = document.getElementById('currentWeek');
    currentWeek.innerText = `Week ${currentGroup.currentRota + 1}`;
}