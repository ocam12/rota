//import { shiftPatterns } from "./data.js";
//import { staff } from "./data.js";
import { currentStaff, currentShiftPatterns, currentGroup } from "./main.js";

export const timeToHours = (t) => {
    const [h, m] = t.split(':').map(Number);    //takes the hour and minutes of time, puts each into array and converts both to a Number
    return h + (m / 60);
}

export const shiftLength = (shift) => {
    return (timeToHours(shift.end) - timeToHours(shift.start));     //converts shift end and shift start to numbers and finds difference to get shift length
}

export const overlappingShifts = (person, newShift) => {    //returns true if person is already working on day of newShift
    let overlap = false;
    person.assignedShifts.forEach(s => {
        if (s === newShift.day){
            overlap = true;
        }
    });
    return overlap;
}

export const isOnHoliday = (person, shift) => {
    const shiftDate = new Date(shift.date);
    return person.holidays.some(h => {
        const start = new Date(h.start);
        const end = new Date(h.end);
        return shiftDate >= start && shiftDate <= end;
    });
}

export const generateShifts = (startDate) => {
    const shifts = [];
    for (let i = 0; i < 7; i++){
        const dateObj = new Date(startDate);    //rota starts from start date
        dateObj.setDate(dateObj.getDate() + i);     //gets date i days from start date
        const dayName = dateObj.toLocaleDateString('en-GB', {weekday: "long"});
        const dayPattern = currentShiftPatterns[dayName];      //gets the shift patterns for that day

        dayPattern.forEach((shift, index) => {
            shifts.push({
                id: `${dateObj.toISOString().slice(0, 10)}-${index}`,
                date: dateObj.toISOString().slice(0, 10),
                day: dayName,
                start: shift.start,
                end: shift.end,
                assignedTo: null
            });
        });
    }
    console.log(shifts);
    return shifts;
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

export const setStaffPriority = (startDate) => {
    currentStaff.forEach(person => {
        const daysUnavialable = getDaysUnavailable(person, startDate);
        const unvailableBonus = daysUnavialable * 10;

        if (person.contractedHours > 0 && person.assignedHours < person.contractedHours){
            person.priority = 1000 + unvailableBonus;
        }
        else if (person.contractedHours > 0 && person.assignedHours >= person.contractedHours){
            person.priority = 0;
        }
        else {
            let priority = 100 - person.assignedHours;
            let randomBonus = Math.floor(Math.random() * 11);
            person.priority = priority + randomBonus;
        }
    });
}

export const orderStaffByPriority = (startDate) => {
    setStaffPriority(startDate);
    let orderedStaff = currentStaff;
    let n = orderedStaff.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (orderedStaff[i].priority < orderedStaff[i + 1].priority || (orderedStaff[i].priority === orderedStaff[i + 1].priority && Math.random() < 0.5)) {
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
    let orderedStaff = staff;
    let n = orderedStaff.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (orderedStaff[i].name > orderedStaff[i + 1].name || (orderedStaff[i].name === orderedStaff[i + 1].name)) {
                //swap positions
                [orderedStaff[i], orderedStaff[i + 1]] = [orderedStaff[i + 1], orderedStaff[i]];
                swapped = true;
            }
        }
        n--;
    } while (swapped);
    return orderedStaff;
}

export const randomiseShifts = (randomshifts) => {
    for (let i = randomshifts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [randomshifts[i], randomshifts[j]] = [randomshifts[j], randomshifts[i]];  // swap elements
    }
    return sortRandomShiftsByLength(randomshifts);    //ensures random shifts are still ordered by size, so smallest shifts distributed first
}

export const reorganiseShifts = (shifts) => {
    let n = shifts.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            if (shifts[i].id > shifts[i + 1].id){
                //swap positions
                [shifts[i], shifts[i + 1]] = [shifts[i + 1], shifts[i]];
                swapped = true;
            }
        }
    } while (swapped);
    return shifts;
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

export const clearStaffShifts = () => {
    currentStaff.forEach(person => {
        person.assignedShifts = [];
        person.assignedHours = 0;
    });
}

export const clearRotas = () => {
    currentGroup.rotas.length = 0;
}

export const addNumberOfWeeks = (date, weeks) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (7 * weeks));
    return newDate.toISOString().slice(0, 10);
}

export const addNumberOfDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (days));
    return newDate.toISOString().slice(0, 10);
}