"use strict";

class CrearPersonaje {
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
}