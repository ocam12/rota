import { currentGroup } from "./main.js";
import { addEvent } from "./options.js";
import { renderRota } from "./visualGenerator.js";

export const displayFirstRota = () => {
    if (currentGroup.rotas.length > 0){
        currentGroup.currentRota = 0;
        render(currentGroup.currentRota);
    }
}

export const nextRota = () => {
    console.log(currentGroup.rotas.length);
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

const render = (index) => {
    renderRota(currentGroup.rotas[index], index);
}

const nextRotaButton = document.getElementById('nextRota');
addEvent(nextRotaButton, 'click', nextRota, []);
const prevRotaButton = document.getElementById('prevRota');
addEvent(prevRotaButton, 'click', prevRota, []);