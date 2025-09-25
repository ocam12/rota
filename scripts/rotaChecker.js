import { currentGroup } from "./main.js"
import { unassignedValue } from "./constants.js";
import { addClashMajorError, addClashMinorError, addHolidayError, addNoCoverError } from "./rotaErrorDisplay.js";

export const runErrorChecks = () => {
    checkClash();
    checkShiftsCovered();
    checkHolidays();
}

const checkHolidays = () => {
    const shifts = currentGroup.rotas[currentGroup.currentRota];
    shifts.forEach(shift => {
        if (shift.assignedTo === unassignedValue){return;}
        const person = currentGroup.staff.find(s => s.name === shift.assignedTo);
        if (!person){return;}
        const shiftDate = new Date(shift.date);
        if (person.holidays.some(h => shiftDate <= new Date(h.end) && shiftDate >= new Date(h.start))){     //found overlap with holiday
            addError('holiday', shift.id);
        }
    });
}

const checkClash = () => {
    const shifts = currentGroup.rotas[currentGroup.currentRota];
    const majorClashes = [shifts.length];     //tracks if major clash already occured as that takes priority
    for(let i = 0; i < shifts.length; i++){
        for(let j = i + 1; j < shifts.length; j++){
            if(shifts[i].assignedTo === unassignedValue || shifts[j].assignedTo === unassignedValue){continue;}
            if(shifts[i].id === shifts[j].id || shifts[i].day !== shifts[j].day){continue;}
            if(shifts[i].assignedTo !== shifts[j].assignedTo){continue;}    //if passes here then there is a clash
            if((shifts[i].start < shifts[j].end) && (shifts[i].end > shifts[j].start)){
                addError('clashMajor', shifts[i].id, shifts[j].id);
                majorClashes[i] = true;
                majorClashes[j] = true;
            }
            if(majorClashes[i] && !majorClashes[j]){addError('clashMinor', shifts[j].id);}
            else if(!majorClashes[i] && majorClashes[j]){addError('clashMinor', shifts[i].id);}
            else if(!majorClashes[i] && !majorClashes[j]){
                addError('clashMinor', shifts[i].id);
                addError('clashMinor', shifts[j].id);
            }

        }
    }
}

const checkShiftsCovered = () => {
    const shifts = currentGroup.rotas[currentGroup.currentRota];
    shifts.filter(shift => shift.assignedTo === unassignedValue).forEach(s => addError('noCover', s.id));
}

const addError = (type, ...params) => {
    switch (type) {
        case 'holiday': return addHolidayError(...params);
        case 'clashMinor': return addClashMinorError(...params);
        case 'clashMajor': return addClashMajorError(...params);
        case 'noCover': return addNoCoverError(...params);
    }
}