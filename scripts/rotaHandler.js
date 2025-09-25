import { currentGroup, generateRota} from "./main.js";
import { addEvent, fillShiftSelect } from "./options.js";
import { renderRota } from "./visualGenerator.js";
import { displayCurrentStats } from "./stats.js";
import { runErrorChecks } from "./rotaChecker.js";
import { saveGroups } from "./data.js";

export const displayFirstRota = () => {
    if (currentGroup.rotas.length <= 0){return;}
    currentGroup.currentRota = 0;
    render(currentGroup.currentRota);
}

export const nextRota = () => {
    if (currentGroup.currentRota >= currentGroup.duration - 1){return;}
    currentGroup.currentRota++;
    generateRota();
    render(currentGroup.currentRota);
}

export const prevRota = () => {
    if (currentGroup.currentRota <= 0){return;}
    currentGroup.currentRota--;
    render(currentGroup.currentRota);
}

export const render = (index) => {
    renderRota(currentGroup.rotas[index], index);
    displayCurrentStats();
    runErrorChecks();
    fillShiftSelect();
    saveGroups();
}

const bindButton = (id, handler) => {
    const button = document.getElementById(id);
    if (button) {addEvent(button, 'click', handler);}
};

bindButton('nextRota', nextRota);
bindButton('prevRota', prevRota);
