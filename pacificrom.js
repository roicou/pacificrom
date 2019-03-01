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


let partida = new Tablero.Tablero(8, 6);
partida.ColocarPjAleatorio(new Personaje.Personaje('Roi', 'barco1', RandomAction));
partida.ColocarPjAleatorio(new Personaje.Personaje('Emi', 'barco1', RandomAction));
partida.ColocarPjAleatorio(new Personaje.Personaje('Gabi', "barco1", RandomAction));
partida.ColocarPjAleatorio(new Personaje.Personaje('Dieg', "diego", RandomAction));

//let pj = new Personaje.Personaje('Roi', 'barco1', RandomAction);

partida.imprime;

/**
 * @description Mueve un pj de forma aleatoria
 * @returns {Object} 
 */
function RandomAction() {
    let random = Math.random();
    let accion = {};
    if (random < 0.05) {
        accion = {
            accion: "disparar",
        };
    } else {
        accion = {
            accion: "moverse",
            direccion: OrientacionAleatoria()
        }
    }
    return accion;
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


/*
setInterval pierde la referencia al objeto. Solo llama a la función, dejando a un lado el objeto en el que 
estaba la función
*/
setInterval(partida.Tick, 500, partida);