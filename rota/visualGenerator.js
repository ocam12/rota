import { currentGroup, currentStaff, updateShifts } from "./main.js";
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
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td><strong>${shift.day + ' ' + shift.date.slice(8, 10) + '/' + shift.date.slice(5, 7)}</strong></td>
        <td>${shift.daysShifts.filter(s => s.start <= '09:00').map(s => '<div id = "' + s.id + '">' + s.start + ' - ' + s.end + ': <span class = "sortable-container"><p class = "draggable">' + s.assignedTo + '</p></span></div>').join('<br>')}</td>
        <td>${shift.daysShifts.filter(s => s.start > '09:00' && s.start < '13:00').map(s => '<div id = "' + s.id + '">' + s.start + ' - ' + s.end + ': <span class = "sortable-container"><p class = "draggable">' + s.assignedTo + '</p></span>').join('<br>')}</td>
        <td>${shift.daysShifts.filter(s => s.start >= '13:00').map(s => '<div id = "' + s.id + '">' + s.start + ' - ' + s.end + ': <span class = "sortable-container"><p class = "draggable">' + s.assignedTo + '</p></span>').join('<br>')}</td>
        `;
        tbody.appendChild(tr);
    });

    setTitle();

    const container = document.querySelectorAll("td span.sortable-container");

    container.forEach((td) => {
        Sortable.create(td, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            group: 'shifts',
            filter: 'br',
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
                    updateShifts(toContainer.parentElement.id, movedEl.innerText, fromContainer.parentElement.id, oldEl.innerText);
                }
            }
        });
    });
}

const setTitle = (week) => {
    const currentWeek = document.getElementById('currentWeek');
    currentWeek.innerText = `Week ${currentGroup.currentRota + 1}`;
}