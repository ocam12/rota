import { colorHolidayError } from "./constants.js";
import { currentGroup } from "./main.js";
import { orderStaffByName } from "./rotaUtils.js";

export const displayCurrentStats = () => {
    const orderedStaff = orderStaffByName(currentGroup.staff);
    const statsBody = getStatsTable();
    let statsInnerHTML = ``;

    orderedStaff.forEach(person => {
        const highlight = person.assignedHours[currentGroup.currentRota] < person.contractedHours ? 'background-color: rgba(255, 119, 119, 1);' : '';
        statsInnerHTML += `<tr><td id="${person.id}-statsName">${person.name}</td>
                            <td id="${person.id}-statsContract">${person.contractedHours}</td>
                            <td id="${person.id}-statsAssigned" style="${highlight}">${person.assignedHours[currentGroup.currentRota]}</td>
                            <td id="${person.id}-statsTotal">${person.totalHours}</td></tr>`;
    });
    statsBody.innerHTML = statsInnerHTML;
}

const getStatsTable = () => {
    const statsBody = document.getElementById('statsBody');
    statsBody.innerHTML = '';
    return statsBody;
}