import { currentGroup} from "./main.js";
import { unassignedValue } from "./constants.js";
import { timeToHours } from "./utils.js";

export const shiftLength = (shift) => {
    return (timeToHours(shift.end) - timeToHours(shift.start));     //converts shift end and shift start to numbers and finds difference to get shift length
}

export const overlappingShifts = (person, newShift, week) => {    //returns true if person is already working on day of newShift
    return structuredClone(person.assignedShifts[week]).some(s => s.day === newShift.day);
}

export const isOnHoliday = (person, shift) => {
    const shiftDate = new Date(shift.date);
    return person.holidays.some(h => {
        const start = new Date(h.start);
        const end = new Date(h.end);
        return shiftDate >= start && shiftDate <= end;
    });
}

export const generateShifts = (startDate, week) => {
    const shifts = [];
    const start = new Date(startDate);    //rota starts from start date
    for (let i = 0; i < 7; i++){
        const dateObj = new Date(start);    //rota starts from start date
        dateObj.setDate(start.getDate() + i);     //gets date i days from start date
        const dayName = dateObj.toLocaleDateString('en-GB', {weekday: "long"});
        if(!currentGroup.shifts[week]){return shifts;}
        const dayPattern = currentGroup.shifts[week][dayName];      //gets the shift patterns for that day

        dayPattern.forEach((shift, index) => {
            shifts.push({
                id: generateShiftID(dateObj, index),
                date: dateObj.toISOString().slice(0, 10),
                day: dayName,
                start: shift.start,
                end: shift.end,
                assignedTo: unassignedValue,
                patternId: shift.id,
                shiftType: shift.shiftType
            });
        });
    }
    return shifts;
}

const generateShiftID = (date, index) => {
    return `${date.toISOString().slice(0, 10)}-${index}`;
}

export const getDaysUnavailable = (person, startDate) => {
    const weekStart = new Date(startDate);
    let daysUnavialable = 0;
    
    person.holidays.forEach(h => {
        for (let day = 0; day < 7; day++){
            let weekDay = new Date(weekStart);
            weekDay.setDate(weekDay.getDate() + day);

            const holidayStart = new Date(h.start);
            const holidayEnd = new Date(h.end);

            if (weekDay >= holidayStart && weekDay <= holidayEnd){
                daysUnavialable++;
            }
        }
    });
    return daysUnavialable;
}

export const setStaffPriority = (startDate, week) => {
    currentGroup.staff.forEach(person => {
        const daysUnavialable = getDaysUnavailable(person, startDate);
        const unvailableBonus = daysUnavialable * 10;

        if (person.contractedHours > 0 && person.assignedHours[week] < person.contractedHours){     //contracted people who have not reached their hours take priority (via large priority value)
            newPriority(person, 1000 + unvailableBonus, week);
        }
        else if (person.contractedHours > 0 && person.assignedHours[week] >= person.contractedHours){
            let priority = 100 - person.assignedHours[week];        //once contracted employee reaches their hours the shifts are divided between everyone equally, including their current shifts
            newPriority(person, priority, week);
        }
        else {
            let priority = 100 - person.assignedHours[week];    //non-contracted people get lowest priority 
            newPriority(person, priority, week);
        }
    });
}

const newPriority = (person, priorityAmount, week) => {
    if(person.priority[week] !== undefined){
        person.priority[week] = priorityAmount;
    }
    else{
        person.priority.push(priorityAmount);
    }
}

export const orderStaffByPriority = (startDate, week) => {
    setStaffPriority(startDate, week);
    let orderedStaff = structuredClone(currentGroup.staff);
    let n = orderedStaff.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (orderedStaff[i].priority[week] < orderedStaff[i + 1].priority[week] || (orderedStaff[i].priority[week] === orderedStaff[i + 1].priority[week] && Math.random() < 0.5)) {
                //swap positions
                [orderedStaff[i], orderedStaff[i + 1]] = [orderedStaff[i + 1], orderedStaff[i]];
                swapped = true;
            }
        }
        n--;
    } while (swapped);
    return orderedStaff;
}

export const orderStaffByName = (staff) => {
    return [...staff].sort((a, b) => a.name.localeCompare(b.name));
}

export const randomiseShifts = (randomshifts) => {
    for (let i = randomshifts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [randomshifts[i], randomshifts[j]] = [randomshifts[j], randomshifts[i]];  // swap elements
    }
    return sortRandomShiftsByLength(randomshifts);    //ensures random shifts are still ordered by size, so smallest shifts distributed first
}

export const reorganiseShifts = (shifts) => {
    return [...shifts].sort((a, b) => a.id.localeCompare(b.id));
}

export const sortRandomShiftsByLength = (randomshifts) => {
    let n = randomshifts.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (shiftLength(randomshifts[i]) < shiftLength(randomshifts[i + 1])){       
                //swap positions
                [randomshifts[i], randomshifts[i + 1]] = [randomshifts[i + 1], randomshifts[i]];
                swapped = true;
            }
        }
    } while (swapped);
    return randomshifts;
}

export const clearStaffShifts = (week) => {
    currentGroup.staff.forEach(person => {
        if(person.assignedHours[week] !== undefined){
            person.totalHours -= person.assignedHours[week];
            person.assignedHours[week] = 0;

            person.assignedShifts[week] = [];
        }
        else{
            person.assignedHours.push(0);
            person.assignedShifts.push([]);
        }
    });
}

export const clearRotas = () => {
    currentGroup.rotas = [];
}

export const orderHolidays = (holidays) => {
    return [...holidays].sort((a, b) => a.start.localeCompare(b.start));
}