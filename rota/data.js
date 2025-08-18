import { assignStaff } from "./assignment.js";
import { orderStaffByName } from "./utils.js";

export const staff = [
    { id: 1, name: 'Alex K', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [{id: 'test1', start: "2025-08-10", end: "2025-08-24"}], assignedShifts: [], priority: 0},
    { id: 2, name: 'Alex VC', contractedHours: 15, assignedHours: 0, totalHours: 0, holidays: [{id: 'test2', start: "2025-06-02", end: "2025-06-06"}], assignedShifts: [], priority: 0},
    { id: 3, name: 'Archie', contractedHours: 15, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 4, name: 'Ben', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 5, name: 'Beth', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 6, name: 'Carol', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 7, name: 'Dylan', contractedHours: 15, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 8, name: 'Eleni', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 9, name: 'Grace', contractedHours: 15, assignedHours: 0, totalHours: 0, holidays: [{id: 'test3', start: "2025-06-04", end: "2025-06-09"}], assignedShifts: [], priority: 0},
    { id: 10, name: 'Izzy', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 11, name: 'Josh', contractedHours: 15, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 12, name: 'Keira', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 13, name: 'Lauren', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 14, name: 'Nick', contractedHours: 15, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 15, name: 'Richard', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 16, name: 'Sean', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 17, name: 'Thea', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 18, name: 'Tilly', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0},
    { id: 19, name: 'Will', contractedHours: 0, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0}
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
        {id: 'sun2', start: '8:45', end: '17:00'},
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
    {id: 1, name: 'COASP', staff: staff, rotas: [], shifts: shiftPatterns, startDate: "2025-05-19", duration: 18, currentRota: 0},
    {id: 2, name: 'Freedom', staff: [], rotas: [], shifts: shiftTemplate, startDate: "2025-05-19", duration: 1, currentRota: 0}
];

export const addHoliday = (group, person, start, end) => {
    group.staff.find(p => p.name === person.name).holidays.push({id: `${person.name}-${Math.random().toString(36).substring(2, 9)}`, start: start, end: end})  //gives holiday unique, random id to be able to grab it later
}

export const deleteHoliday = (group, person, id) => {
    group.staff.find(p => p.name === person.name).holidays = person.holidays.filter(h => h.id !== id);
}

export const addShift = (group, day, start, end) => {
    group.shifts[day].push({id: `${day}-${Math.random().toString(36).substring(2, 9)}`, start: start, end: end});  //gives shift unique, random id to be able to grab it later
}

export const deleteShift = (group, day, id) => {
    group.shifts[day] = group.shifts[day].filter(s => s.id !== id);
}

export const addStaff = (group, pName, pHours) => {
    const newEmployee = {id: `${Math.random().toString(36).substring(2, 9)}`, name: pName, contractedHours: pHours, assignedHours: 0, totalHours: 0, holidays: [], assignedShifts: [], priority: 0};
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