import { colorHolidayError, colorClashErroMinor, colorClashErrorMajor, colorNotCoveredError } from "./constants.js";

export const addHolidayError = (shiftID) => {
    const shiftElement = getShiftElement(shiftID);
    shiftElement.style.backgroundColor = colorHolidayError;
}

export const addClashMinorError = (shiftID) => {
    const shiftElement = getShiftElement(shiftID);
    shiftElement.style.backgroundColor = colorClashErroMinor;
}

export const addClashMajorError = (shift1ID, shift2ID) => {
    const shiftOneElement = getShiftElement(shift1ID);
    const shiftTwoElement = getShiftElement(shift2ID);
    shiftOneElement.style.backgroundColor = colorClashErrorMajor;
    shiftTwoElement.style.backgroundColor = colorClashErrorMajor;
}

export const addNoCoverError = (shiftID) => {
    const shiftElement = getShiftElement(shiftID);
    if(shiftElement){shiftElement.style.backgroundColor = colorNotCoveredError;}
}

const getShiftElement = (shiftID) => {
    return document.getElementById(shiftID);
}