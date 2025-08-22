import { currentGroup } from "./main.js";
import { addEvent } from "./options.js";
import { renderRota } from "./visualGenerator.js";
import { displayCurrentStats } from "./stats.js";
import { performErrorChecks } from "./rotaChecker.js";

export const displayFirstRota = () => {
    if (currentGroup.rotas.length > 0){
        currentGroup.currentRota = 0;
        render(currentGroup.currentRota);
    }
}

export const nextRota = () => {
    if (currentGroup.currentRota < currentGroup.rotas.length - 1){
        currentGroup.currentRota++;
        render(currentGroup.currentRota);
    }
}

export const prevRota = () => {
    if (currentGroup.currentRota > 0){
        currentGroup.currentRota--
        render(currentGroup.currentRota);
    }
}

export const render = (index) => {
    renderRota(currentGroup.rotas[index], index);
    displayCurrentStats();
    performErrorChecks();
}

const nextRotaButton = document.getElementById('nextRota');
addEvent(nextRotaButton, 'click', nextRota, []);
const prevRotaButton = document.getElementById('prevRota');
addEvent(prevRotaButton, 'click', prevRota, []);