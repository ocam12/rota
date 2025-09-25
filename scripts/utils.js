export const timeToHours = (t) => {
    const [h, m] = t.split(':').map(Number);    //takes the hour and minutes of time, puts each into array and converts both to a Number
    return h + (m / 60);
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

export const convertHolidayText = (holidayText) => {
    const year = holidayText.slice(0, 4);
    const month = holidayText.slice(5, 7);
    const day = holidayText.slice(8, 10);
    const dayName = new Date(holidayText).toLocaleDateString('en-GB', { weekday: 'short'});

    return `${dayName} ${day} / ${month} / ${year}`;
}

export const hideElement = (element) => {
    element.classList.add('hidden');
    element.setAttribute('aria-hidden', 'true');
}

export const showElement = (element) => {
    element.classList.remove('hidden');
    element.setAttribute('aria-hidden', 'false');
}