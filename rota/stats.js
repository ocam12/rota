import { currentGroup, currentStaff } from "./main.js";
import { orderStaffByName } from "./utils.js";

export const displayCurrentStats = () => {
    const orderedStaff = orderStaffByName(currentStaff);
    const statsBody = getStatsTable();

    orderedStaff.forEach(person => {
        statsBody.innerHTML += `<td id="${person.id}-statsName">${person.name}</td>
                                <td id="${person.id}-statsContract">${person.contractedHours}</td>
                                <td id="${person.id}-statsAssigned">${person.assignedHours[currentGroup.currentRota]}</td>
                                <td id="${person.id}-statsTotal">${person.totalHours}</td>`;
        if(person.assignedHours[currentGroup.currentRota] < person.contractedHours){
            const assigned = document.getElementById(`${person.id}-statsAssigned`);
            assigned.style.backgroundColor = '#ff8f8fff';
        }
    });
}

const getStatsTable = () => {
    const statsBody = document.getElementById('statsBody');
    statsBody.innerHTML = '';
    return statsBody;
}