import { unassignedValue } from "./constants.js";
import { overlappingShifts, shiftLength, isOnHoliday, orderStaffByPriority, randomiseShifts, reorganiseShifts } from "./rotaUtils.js";

export const assignShifToPerson = (person, shift, week) => {
    shift.assignedTo = person.name;
    person.assignedShifts[week].push(shift);
    person.assignedHours[week] = person.assignedHours[week] + shiftLength(shift);
    person.totalHours = person.totalHours + shiftLength(shift);
}

export const assignShifts = (shifts, startDate, week) => {
    if (!shifts.length) return [];      //if no shifts then no need to run assignment
    let orderedStaff = orderStaffByPriority(startDate, week);
    let randomShifts = randomiseShifts(shifts);
    
    randomShifts.forEach(shift => {
        for (let person of orderedStaff){
            shift.assignedTo = unassignedValue;
            if (!overlappingShifts(person, shift, week) && !isOnHoliday(person, shift)){
                assignShifToPerson(person, shift, week);
                orderedStaff = orderStaffByPriority(startDate, week);
                break;
            }
        }
    });
    return reorganiseShifts(randomShifts);
}