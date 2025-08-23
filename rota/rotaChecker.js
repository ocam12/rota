import { assign } from "./assignment.js";
import { currentGroup, currentStaff, unassignedValue } from "./main.js"
import { addClashMajorError, addClashMinorError, addHolidayError, addNoCoverError } from "./rotaErrorDisplay.js";
import { shiftLength } from "./utils.js";

export const performErrorChecks = () => {
    checkHolidays();
    checkClash();
    checkShiftsCovered();
}

const checkHolidays = () => {
    const shifts = currentGroup.rotas[currentGroup.currentRota];
    shifts.forEach(shift => {
        if (shift.assignedTo !== unassignedValue){
            const person = currentStaff.find(s => s.name === shift.assignedTo);
            const shiftDate = shift.date;

            person.holidays.forEach(h => {
                if(new Date(shiftDate) <= new Date(h.end) && new Date(shiftDate) >= new Date(h.start)){     //found overlap with holiday
                    addHolidayError(shift.id);
                }
            });
        }
    });
}

const checkClash = () => {
    const shifts = currentGroup.rotas[currentGroup.currentRota];
    const majorClash = [shifts.length];     //tracks if major clash already occured as that takes priority
    for(let i = 0; i < shifts.length; i++){
        for(let j = i + 1; j < shifts.length; j++){
            if(shifts[i].assignedTo === unassignedValue || shifts[j].assignedTo === unassignedValue){continue;}
            if(shifts[i].id === shifts[j].id || shifts[i].day !== shifts[j].day){continue;}
            if(shifts[i].assignedTo !== shifts[j].assignedTo){continue;}    //if passes here then there is a clash
            if((shifts[i].start < shifts[j].end) && (shifts[i].end > shifts[j].start)){
                addClashMajorError(shifts[i].id, shifts[j].id);
                majorClash[i] = true;
                majorClash[j] = true;
            }
            if(majorClash[i] && !majorClash[j]){addClashMinorError(shifts[j].id)}
            else if(!majorClash[i] && majorClash[j]){addClashMinorError(shifts[i].id)}
            else if(!majorClash[i] && !majorClash[j]){
                addClashMinorError(shifts[i].id);
                addClashMinorError(shifts[j].id);
            }

        }
    }
}

const checkShiftsCovered = () => {
    const shifts = currentGroup.rotas[currentGroup.currentRota];
    shifts.forEach(shift => {
        if(shift.assignedTo === unassignedValue){addNoCoverError(shift.id);}
    });
}