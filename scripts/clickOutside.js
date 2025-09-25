import { hideElement, showElement } from "./utils.js";

export const hideOnClickOutside = (element) => {
    const outsideClickListener = (event) => {
        if(!element.contains(event.target)){
            hideElement(element);
            removeClickListener();
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    }

    document.addEventListener('click', outsideClickListener);
    return removeClickListener;
}

export const addHideOnClickOutside = (element) => {
    setTimeout(() => {
        hideOnClickOutside(element);
    }, 0);
}

export const toggle = (element) => {
    if (element.classList.contains('hidden')) {
        showElement(element);
        addHideOnClickOutside(element);
    } else {
        hideElement(element);
    }
}