const colorHolidayError = 'rgba(255, 119, 119, 1)';
const colorClashErroMinor = 'rgba(255, 250, 157, 1)';
const colorClashErroMajor = 'rgba(255, 168, 69, 1)';
const colorNotCoveredError = 'rgba(200, 255, 141, 1)';

export const addHolidayError = (shiftID) => {
    const shiftElement = getShiftElement(shiftID);
    shiftElement.style.backgroundColor = colorHolidayError;
}

export const addClashMinorError = (shiftID) => {
    console.log(shiftID);
    const shiftElement = getShiftElement(shiftID);
    shiftElement.style.backgroundColor = colorClashErroMinor;
}

export const addClashMajorError = (shift1ID, shift2ID) => {
    const shiftOneElement = getShiftElement(shift1ID);
    const shiftTwoElement = getShiftElement(shift2ID);
    shiftOneElement.style.backgroundColor = colorClashErroMajor;
    shiftTwoElement.style.backgroundColor = colorClashErroMajor;
}

export const addNoCoverError = (shiftID) => {
    const shiftElement = getShiftElement(shiftID);
    shiftElement.style.backgroundColor = colorNotCoveredError;
}

const getShiftElement = (shiftID) => {
    return document.getElementById(shiftID);
}