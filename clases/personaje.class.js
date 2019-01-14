"use strict";

class Personaje {
    /**
     * @description Crea un personaje con los parámetros dados
     * @param {String} nombre String con el nombre del personaje
     * @param {String} tipo Tipo de  barco
     * @param {Function} funcionIA Función con la IA del personake
     * @returns {Object} Objeto con los parámetros del personaje.
     */
    constructor(nombre, tipo, funcionIA) {
        //disparo curvo y disparo tenso
        switch (tipo) {
            case "barco1":
            default:
                return {
                    "nombre": nombre,
                    "velocidad": 10,
                    "vida": 100,
                    "vision": 5,
                    "disparo": "curvo",
                    "rango": 3,
                    "pupa": 50,
                    "orientacion": this.OrientacionAleatoria(),
                    "next": funcionIA
                }
        }
    }
    /**
     * @description Devuelve una orientación aleatoria: N, S, E, W
     * @returns {string} N, S, E, W
     */
    OrientacionAleatoria() {
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

    /**
     * @description Mueve un personaje sobre el tablero. El movimiento lo realiza {@link moviendo_personaje}
     * @param {Array} tablero Tablero sobre el que vamos a moveor el personaje
     * @param {Number} posx Número de fila del tablero donde está el personaje (X)
     * @param {Number} posy Número de columna del tablero donde está el personaje (Y)
     * @param {String} direccion Dirección a la que queremos mover el personaje: <br/><ul>
     * <li>N -> Norte</li>
     * <li>E -> Este</li>
     * <li>S -> Sur</li>
     * <li>W -> Oeste</li>
     */
    Mover(tablero, posx, posy, direccion) {
        switch (direccion) {
            case 'N':
                this.MoviendoPersonaje(tablero, posx, posx, posy, (posy - 1));
                break;
            case 'E':
                this.MoviendoPersonaje(tablero, posx, (posx + 1), posy, posy);
                break;
            case 'S':
                this.MoviendoPersonaje(tablero, posx, posx, posy, (posy + 1));
                break;
            case 'W':
            case 'O':
                this.MoviendoPersonaje(tablero, posx, (posx - 1), posy, posy);
                break;
        }
    }
    /**
     * @description Realiza el movimiento de {@link mover_personaje} hacienndo las comprobaciones pertinentes. <br/><br/>
     * Se comprueba si existe la posición a la que nos queremos mover y si está vacía.
     * @param {Array} tablero Tablero sobre el que vamos a moveor el personaje
     * @param {Number} posx_original Número de fila del tablero donde está el personaje (X)
     * @param {Number} posx_final Número de fila del tablero a donde vamos a mover el personaje (X)
     * @param {Number} posy_original Número de columna del tablero donde está el personaje (Y)
     * @param {Number} posy_final Número de columna del tablero a donde vamos a mover el personaje (Y)
     */
    MoviendoPersonaje(tablero, posx_original, posx_final, posy_original, posy_final) {
        if (posx_final >= 0 && posy_final >= 0 && posx_final < tablero[0].length && posy_final < tablero.length) {
            if (tablero[posy_final][posx_final].in[0] == null && tablero[posy_final][posx_final].tipo == "agua") {
                tablero[posy_final][posx_final].in[0] = tablero[posy_original][posx_original].in[0];
                tablero[posy_original][posx_original].in[0] = null;
            }
        }
    }
}