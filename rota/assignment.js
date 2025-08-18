//import { staff } from "./data.js"
import { currentStaff } from "./main.js";
import { overlappingShifts, shiftLength } from "./utils.js";
import { isOnHoliday } from "./utils.js";
import { orderStaffByPriority } from "./utils.js";
import { randomiseShifts } from "./utils.js";
import { reorganiseShifts } from "./utils.js";

export const assign = (person, shift) => {
    shift.assignedTo = person.name;
    person.assignedShifts.push(shift.day);
    person.assignedHours += shiftLength(shift);
}

export const assignStaff = (shifts, startDate) => {
    let orderedStaff = orderStaffByPriority(startDate);
    let randomShifts = [...shifts];
    randomShifts = randomiseShifts(shifts);
    
    randomShifts.forEach(shift => {
        for (let person of orderedStaff){
            if (!overlappingShifts(person, shift) && !isOnHoliday(person, shift)){
                assign(person, shift);
                orderedStaff = orderStaffByPriority(startDate);
                break;
            }
        }
    });
    shifts = [...reorganiseShifts(randomShifts)];
    return shifts;
}