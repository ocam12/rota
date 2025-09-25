import { currentGroup, initMainPage, unloadGroup } from "./main.js";
import { render } from "./rotaHandler.js";
import { orderStaffByName, shiftLength } from "./rotaUtils.js";
import { unassignedValue, groupSaveKey } from "./constants.js";
import { loadUser, saveUser } from "./account-files/groups.js";

const createStaff = (id, name, contractedHours = 0, holidays = [], assignedHours = [], totalHours = 0, assignedShifts = [], priority = []) => ({
    id,
    name,
    contractedHours,
    assignedHours: [],
    totalHours: 0,
    holidays,
    assignedShifts: [],
    priority: []
});

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

export const dmStaff = [
    createStaff(1, 'Anya', 15, [], Array.from({ length: 1 }, () => 0), 0, Array.from({ length: 1 }, () => []), Array.from({ length: 1 }, () => 0)),
    createStaff(2, 'Olly', 15, [], Array.from({ length: 1 }, () => 0), 0, Array.from({ length: 1 }, () => []), Array.from({ length: 1 }, () => 0)),
    createStaff(3, 'Ruby', 15, [], Array.from({ length: 1 }, () => 0), 0, Array.from({ length: 1 }, () => []), Array.from({ length: 1 }, () => 0)),
    createStaff(4, 'Tam', 15, [], Array.from({ length: 1 }, () => 0), 0, Array.from({ length: 1 }, () => []), Array.from({ length: 1 }, () => 0))
];

export const shiftPatterns = {
    Monday: [
        {id: 'mon1', start: '06:30', end: '13:00', shiftType: 'Early'},
        {id: 'mon2', start: '09:00', end: '12:30', shiftType: 'Early'},
        {id: 'mon3', start: '10:30', end: '17:00', shiftType: 'Mid'},
        {id: 'mon4', start: '13:30', end: '19:45', shiftType: 'Late'},
    ],
    Tuesday: [
        {id: 'tue1', start: '06:30', end: '13:00', shiftType: 'Early'},
        {id: 'tue2', start: '09:00', end: '17:00', shiftType: 'Mid'},
        {id: 'tue3', start: '13:30', end: '19:45', shiftType: 'Late'},
    ],
    Wednesday: [
        {id: 'wed1', start: '06:30', end: '13:00', shiftType: 'Early'},
        {id: 'wed2', start: '09:00', end: '12:30', shiftType: 'Early'},
        {id: 'wed3', start: '10:30', end: '17:00', shiftType: 'Mid'},
        {id: 'wed4', start: '13:30', end: '22:00', shiftType: 'Late'},
        {id: 'wed5', start: '19:00', end: '22:00', shiftType: 'Late'},
        {id: 'wed6', start: '06:30', end: '13:00', shiftType: 'Early'},
        {id: 'wed7', start: '09:00', end: '12:30', shiftType: 'Early'},
        {id: 'wed8', start: '10:30', end: '17:00', shiftType: 'Early'},
        {id: 'wed9', start: '13:30', end: '22:00', shiftType: 'Early'},
        {id: 'wed10', start: '19:00', end: '22:00', shiftType: 'Early'},
    ],
    Thursday: [
        {id: 'thur1', start: '06:30', end: '13:00', shiftType: 'Early'},
        {id: 'thur2', start: '09:00', end: '12:30', shiftType: 'Early'},
        {id: 'thur3', start: '10:30', end: '17:00', shiftType: 'Mid'},
        {id: 'thur4', start: '13:30', end: '19:45', shiftType: 'Late'},
    ],
    Friday: [
        {id: 'fri1', start: '06:30', end: '13:00', shiftType: 'Early'},
        {id: 'fri2', start: '09:00', end: '12:30', shiftType: 'Early'},
        {id: 'fri3', start: '10:30', end: '17:00', shiftType: 'Mid'},
        {id: 'fri4', start: '13:30', end: '21:15', shiftType: 'Late'},
        {id: 'fri5', start: '19:00', end: '21:15', shiftType: 'Late'},
        {id: 'fri6', start: '19:00', end: '21:15', shiftType: 'Late'},
    ],
    Saturday: [
        {id: 'sat1', start: '07:30', end: '13:00', shiftType: 'Early'},
        {id: 'sat2', start: '09:00', end: '12:30', shiftType: 'Early'},
        {id: 'sat3', start: '10:30', end: '17:00', shiftType: 'Mid'},
        {id: 'sat4', start: '13:30', end: '21:00', shiftType: 'Late'},
        {id: 'sat5', start: '18:00', end: '21:00', shiftType: 'Late'},
    ],
    Sunday: [
        {id: 'sun1', start: '08:15', end: '13:00', shiftType: 'Early'},
        {id: 'sun2', start: '08:45', end: '17:00', shiftType: 'Mid'},
        {id: 'sun3', start: '13:30', end: '18:45', shiftType: 'Late'},
    ]
};

export const dmShiftPatterns = {
    Monday: [
        {id: 'mon1', start: '06:30', end: '13:15', shiftType: 'Early'},
        {id: 'mon2', start: '13:00', end: '19:45', shiftType: 'Late'}
    ],
    Tuesday: [
        {id: 'tue1', start: '06:30', end: '13:15', shiftType: 'Early'},
        {id: 'tue2', start: '13:00', end: '19:45', shiftType: 'Late'}
    ],
    Wednesday: [
        {id: 'wed1', start: '06:30', end: '14:00', shiftType: 'Early'},
        {id: 'wed2', start: '13:45', end: '22:00', shiftType: 'Late'}
    ],
    Thursday: [
        {id: 'thur1', start: '06:30', end: '13:15', shiftType: 'Early'},
        {id: 'thur2', start: '13:00', end: '19:45', shiftType: 'Late'}
    ],
    Friday: [
        {id: 'fri1', start: '06:30', end: '14:00', shiftType: 'Early'},
        {id: 'fri2', start: '13:45', end: '21:15', shiftType: 'Late'}
    ],
    Saturday: [
        {id: 'sat1', start: '07:30', end: '14:00', shiftType: 'Early'},
        {id: 'sat2', start: '13:45', end: '21:15', shiftType: 'Late'}
    ],
    Sunday: [
        {id: 'sun1', start: '08:15', end: '13:15', shiftType: 'Early'},
        {id: 'sun2', start: '13:00', end: '18:45', shiftType: 'Late'}
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

export let groups = [
    {id: 'test_1', name: 'COASP', staff: staff, rotas: [], shifts: [structuredClone(shiftPatterns)], startDate: "2025-09-15", duration: 3, currentRota: 0, shiftTypes: ['Early', 'Mid', 'Late']},
    {id: 'test_2', name: 'COASP - DMs', staff: dmStaff, rotas: [], shifts: [structuredClone(dmShiftPatterns)], startDate: "2025-09-15", duration: 1, currentRota: 0, shiftTypes: ['Early', 'Late']},
];

export const addHoliday = (group, person, start, end) => {      //adds new holiday to chosen person of chosen group via start and end dates
    const holidays = group.staff.find(p => p.name === person.name).holidays;
    if(checkHolidayInBetween(holidays, start, end) || checkHolidayBeforeAfter(holidays, start, end)){render(group.currentRota); return;}        //checks if new holiday between or before/after
    holidays.push({id: generateID(person.name), start: start, end: end})  //gives holiday unique, random id to be able to grab it later
    render(group.currentRota);  //re-performs error checks
}

const checkHolidayInBetween = (holidays, start, end) => {        //prevents adding holiday if already coverd on both ends
    return holidays.some(h => start >= h.start && end <= h.end);
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

export const deleteHoliday = (group, person, holidayID) => {
    group.staff.find(p => p.name === person.name).holidays = person.holidays.filter(h => h.id !== holidayID);
    render(group.currentRota);
}

export const addShift = (group, week, day, start, end, type) => {
    if(!group.shifts[week]){group.shifts.push(structuredClone(shiftTemplate));}
    group.shifts[week][day].push({id: generateID(day), start: start, end: end, shiftType: type});  //gives shift unique, random id to be able to grab it later
}

export const deleteShift = (group, day, patternID) => {
    group.shifts[group.currentRota][day] = group.shifts[group.currentRota][day].filter(s => s.id !== patternID);
    const personName = group.rotas[group.currentRota].filter(s => s.patternId === patternID)[0].assignedTo;

    if(personName !== unassignedValue){removeShiftFromStaff(group, personName, group.rotas[group.currentRota].filter(s => s.patternId === patternID)[0]);}
    group.rotas[group.currentRota] = group.rotas[group.currentRota].filter(s => s.patternId !== patternID);
    render(group.currentRota);
}

export const changeShiftType = (group, day, shiftID, newType) => {
    console.log(shiftID);
    console.log(group.rotas[group.currentRota]);
    group.shifts[group.currentRota][day].find(s => s.id === shiftID).shiftType = newType;
    group.rotas[group.currentRota].find(s => s.patternId === shiftID).shiftType = newType;
    render(group.currentRota);
}

export const addStaff = (group, personName, pHours) => {
    const newStaff = createStaff(generateID(personName), personName, pHours, [], Array.from({ length: group.duration }, () => 0), 0, Array.from({ length: group.duration }, () => []), Array.from({ length: group.duration }, () => 0));
    group.staff.push(newStaff);
    group.staff = orderStaffByName(group.staff);
}

export const deleteStaff = (group, personID) => {
    const personName = group.staff.find(s => s.id === personID)?.name;
    group.staff = group.staff.filter(s => s.id !== personID);
    group.staff = orderStaffByName(group.staff);
    group.rotas.forEach(r => {
        r.forEach(shift => {
            if(shift.assignedTo === personName){
                shift.assignedTo = unassignedValue;
            }
        });
    });
    render(group.currentRota);
}

export const changeContract = (group, personID, newHoursInput) => {
    const person = group.staff.find(s => s.id === personID);
    person.contractedHours = newHoursInput.value;
}

export const createGroup = (groupID, groupName, groupDate, groupDuration, shiftTypes) => {
    groups.push({id: groupID, name: groupName, staff: [], rotas: [], shifts: Array.from({ length: groupDuration }, () => structuredClone(shiftTemplate)), startDate: groupDate, duration: groupDuration, currentRota: 0, shiftTypes: shiftTypes});
    console.log(groups);
    saveGroups();
}

export const deleteGroup = (groupID) => {
    groups = groups.filter(g => g.id !== groupID);
    if(currentGroup && groupID === currentGroup.id){unloadGroup();}
    saveGroups();
}

const removeShiftFromStaff = (group, personName, shift) => {
    const person = group.staff.find(s => s.name === personName);
    person.assignedHours[group.currentRota] -= shiftLength(shift);
    person.totalHours -= shiftLength(shift);
    person.assignedShifts[group.currentRota] = person.assignedShifts[group.currentRota].filter(s => s.patternId !== shift.patternId);
}

export const saveGroups = () => {
    saveUser(groups);
}

export const loadGroups = async () => {
    const loadedGroups = await loadUser(); // wait for it
    if (loadedGroups) {
        groups = loadedGroups;      //sets groups to loaded group object
    }
    else{
        groups = [];
    }
    initMainPage();
}

export const generateID = (prefix) => {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}