//import { staff } from "./data.js"
import { currentGroup, currentStaff, unassignedValue } from "./main.js";
import { overlappingShifts, shiftLength } from "./utils.js";
import { isOnHoliday } from "./utils.js";
import { orderStaffByPriority } from "./utils.js";
import { randomiseShifts } from "./utils.js";
import { reorganiseShifts } from "./utils.js";

export const assign = (person, shift, week) => {
    shift.assignedTo = person.name;
    person.assignedShifts[week].push(shift);
    person.assignedHours[week] = person.assignedHours[week] + shiftLength(shift);
    person.totalHours = person.totalHours + shiftLength(shift);
}

export const assignStaff = (shifts, startDate, week) => {
    let orderedStaff = orderStaffByPriority(startDate, week);
    let randomShifts = [...shifts];
    randomShifts = randomiseShifts(shifts);
    
    randomShifts.forEach(shift => {
        for (let person of orderedStaff){
            shift.assignedTo = unassignedValue;
            if (!overlappingShifts(person, shift, week) && !isOnHoliday(person, shift)){
                assign(person, shift, week);
                orderedStaff = orderStaffByPriority(startDate, week);
                break;
            }
        }
    });
    shifts = [...reorganiseShifts(randomShifts)];
    return shifts;
}