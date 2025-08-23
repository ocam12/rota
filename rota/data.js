import { assignStaff } from "./assignment.js";
import { currentGroup } from "./main.js";
import { performErrorChecks } from "./rotaChecker.js";
import { render } from "./rotaHandler.js";
import { orderStaffByName, shiftLength } from "./utils.js";

export const staff = [
    { id: 1, name: 'Alex K', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 2, name: 'Alex VC', contractedHours: 15, assignedHours: [], totalHours: 0, holidays: [{id: 'test2', start: "2025-05-19", end: "2025-06-06"}], assignedShifts: [], priority: []},
    { id: 3, name: 'Archie', contractedHours: 15, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 4, name: 'Ben', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 5, name: 'Beth', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 6, name: 'Carol', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 7, name: 'Dylan', contractedHours: 15, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 8, name: 'Eleni', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 9, name: 'Grace', contractedHours: 15, assignedHours: [], totalHours: 0, holidays: [{id: 'test3', start: "2025-06-04", end: "2025-06-09"}], assignedShifts: [], priority: []},
    { id: 10, name: 'Izzy', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 11, name: 'Josh', contractedHours: 15, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 12, name: 'Keira', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 13, name: 'Lauren', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 14, name: 'Nick', contractedHours: 15, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 15, name: 'Richard', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 16, name: 'Sean', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 17, name: 'Thea', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [{id: 'test1', start: "2025-05-19", end: "2025-05-19"}], assignedShifts: [], priority: []},
    { id: 18, name: 'Tilly', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [], assignedShifts: [], priority: []},
    { id: 19, name: 'Will', contractedHours: 0, assignedHours: [], totalHours: 0, holidays: [], assignedShifts: [], priority: []}
];

export const shiftPatterns = {
    Monday: [
        {id: 'mon1', start: '06:30', end: '13:00'},
        {id: 'mon2', start: '09:00', end: '12:30'},
        {id: 'mon3', start: '10:30', end: '17:00'},
        {id: 'mon4', start: '13:30', end: '19:45'},
    ],
    Tuesday: [
        {id: 'tue1', start: '06:30', end: '13:00'},
        {id: 'tue2', start: '09:00', end: '17:00'},
        {id: 'tue3', start: '13:30', end: '19:45'},
    ],
    Wednesday: [
        {id: 'wed1', start: '06:30', end: '13:00'},
        {id: 'wed2', start: '09:00', end: '12:30'},
        {id: 'wed3', start: '10:30', end: '17:00'},
        {id: 'wed4', start: '13:30', end: '22:00'},
        {id: 'wed5', start: '19:00', end: '22:00'},
    ],
    Thursday: [
        {id: 'thur1', start: '06:30', end: '13:00'},
        {id: 'thur2', start: '09:00', end: '12:30'},
        {id: 'thur3', start: '10:30', end: '17:00'},
        {id: 'thur4', start: '13:30', end: '19:45'},
    ],
    Friday: [
        {id: 'fri1', start: '06:30', end: '13:00'},
        {id: 'fri2', start: '09:00', end: '12:30'},
        {id: 'fri3', start: '10:30', end: '17:00'},
        {id: 'fri4', start: '13:30', end: '21:15'},
        {id: 'fri5', start: '19:00', end: '21:15'},
        {id: 'fri6', start: '19:00', end: '21:15'},
    ],
    Saturday: [
        {id: 'sat1', start: '07:30', end: '13:00'},
        {id: 'sat2', start: '09:00', end: '12:30'},
        {id: 'sat3', start: '10:30', end: '17:00'},
        {id: 'sat4', start: '13:30', end: '21:00'},
        {id: 'sat5', start: '18:00', end: '21:00'},
    ],
    Sunday: [
        {id: 'sun1', start: '08:15', end: '13:00'},
        {id: 'sun2', start: '08:45', end: '17:00'},
        {id: 'sun3', start: '13:30', end: '18:45'},
    ]
};

export const shiftTemplate = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};

export const groups = [
    {id: 1, name: 'COASP', staff: staff, rotas: [], shifts: [structuredClone(shiftPatterns)], startDate: "2025-05-19", duration: 2, currentRota: 0},
    {id: 2, name: 'Freedom', staff: [], rotas: [], shifts: shiftTemplate, startDate: "2025-05-19", duration: 1, currentRota: 0}
];

export const addHoliday = (group, person, start, end) => {      //adds new holiday to chosen person of chosen group via start and end dates
    const holidays = group.staff.find(p => p.name === person.name).holidays;
    if(checkHolidayInBetween(holidays, start, end)){return;}        //checks if new holiday between or before/after
    if(checkHolidayBeforeAfter(holidays, start, end)){return;}
    holidays.push({id: `${person.name}-${Math.random().toString(36).substring(2, 9)}`, start: start, end: end})  //gives holiday unique, random id to be able to grab it later
    performErrorChecks();       //re-performs error checks
}

const checkHolidayInBetween = (holidays, start, end) => {        //prevents adding holiday if already coverd on both ends
    let inBetween = false;
    holidays.forEach(h => {
        if (start >= h.start && end <= h.end){inBetween = true;}
    });
    return inBetween;
}

const checkHolidayBeforeAfter = (holidays, start, end) => {      //edits holidays if new holiday contains part or all of old holiday
    let eitherEnd = false;
    holidays.forEach(h => {
        if(start <= h.start && end >= h.start ){
            h.start = start;
            eitherEnd = true;
        }
        if(end >= h.end && start <= h.end){
            h.end = end;
            eitherEnd = true;
        }
    });
    return eitherEnd;
}

export const deleteHoliday = (group, person, id) => {
    group.staff.find(p => p.name === person.name).holidays = person.holidays.filter(h => h.id !== id);
    performErrorChecks();
}

export const addShift = (group, day, start, end) => {
    if(!group.shifts[group.currentRota]){group.shifts.push(shiftTemplate);}
    group.shifts[group.currentRota][day].push({id: `${day}-${Math.random().toString(36).substring(2, 9)}`, start: start, end: end});  //gives shift unique, random id to be able to grab it later
    console.log(group.shifts);
}

export const deleteShift = (group, day, id) => {
    group.shifts[group.currentRota][day] = group.shifts[group.currentRota][day].filter(s => s.id !== id);
    const personName = group.rotas[group.currentRota].filter(s => s.patternId === id)[0].assignedTo;

    removeShiftFromStaff(group, personName, group.rotas[group.currentRota].filter(s => s.patternId === id)[0]);
    group.rotas[group.currentRota] = group.rotas[group.currentRota].filter(s => s.patternId !== id);
    render(group.currentRota);
}

export const addStaff = (group, pName, pHours) => {
    const newEmployee = {id: `${Math.random().toString(36).substring(2, 9)}`, name: pName, contractedHours: pHours, assignedHours: [], totalHours: 0, holidays: [], assignedShifts: [], priority: []};
    group.staff.push(newEmployee);
    group.staff = orderStaffByName(group.staff);
}

export const deleteStaff = (group, pID) => {
    group.staff = group.staff.filter(s => s.id !== pID);
    group.staff = orderStaffByName(group.staff);
}

export const createGroup = (groupName, groupDate, groupDuration) => {
    groups.push({id: `${Math.random().toString(36).substring(2, 9)}`, name: groupName.value, staff: [], rotas: [], shifts: shiftTemplate, startDate: groupDate.value, duration: groupDuration.value, currentRota: 0});
}

const removeShiftFromStaff = (group, personName, shift) => {
    const person = group.staff.find(s => s.name === personName);
    person.assignedHours[group.currentRota] -= shiftLength(shift);
    person.totalHours -= shiftLength(shift);
    person.assignedShifts[group.currentRota] = person.assignedShifts[group.currentRota].filter(s => s.patternId !== shift.patternId);
}