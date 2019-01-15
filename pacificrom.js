"use strict";
/**
 * @file
 * @description 
 * <h3>Pacific ROM</h3>
 * 19/11/2018<br/><br/>
 * 
 * Vamos a crear un juego y todo lo demás se irá viendo sobre la marcha.
*/

//Importamos clases.
let Tablero = require('./class/tablero.js');
let Personaje = require('./class/personaje.js');

let partida = new Tablero.Tablero(20, 20);
partida.ColocarPjAleatorio(new Personaje.Personaje('Roi', 'barco1', RandomAction));

//let pj = new Personaje.Personaje('Roi', 'barco1', RandomAction);
//console.log(pj);

partida.imprime;

/**
 * @description Mueve un pj de forma aleatoria
 * @returns {Object} 
 */
function RandomAction() {
    let accion = "moverse";
    return {
        "accion": accion,
        "direccion": OrientacionAleatoria()
    };
}

/**
 * @description Devuelve una orientación aleatoria: N, S, E, W
 * @returns {string} N, S, E, W
 */
function OrientacionAleatoria() {
    let random = Math.random();
    if (random < 0.25) {
        return "N";
    } else if (random < 0.5) {
        return "S";
    } else if (random < 0.75) {
        return "E";
    } else {
        return "W";
    }
}


