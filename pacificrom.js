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

partida.tablero;