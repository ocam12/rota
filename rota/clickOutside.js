export const hideOnClickOutside = (element) => {
    const outsideClickListener = (event) => {
        if(!element.contains(event.target)){
            element.classList.add('hidden');
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
        element.classList.remove('hidden');
        addHideOnClickOutside(element);
    } else {
        element.classList.add('hidden');
    }
}