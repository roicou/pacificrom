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
        this._funcionIA = funcionIA;
        this.nombre = nombre;
        this.orientacion = this.OrientacionAleatoria();
        switch (tipo) {
            case "barco1":
            default:
                this.velocidad = 10;
                this.vida = 100;
                this.vision = 5;
                this.disparo = "curvo";
                this.rango = 3;
                this.pupa = 50;
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
    update(map){
        this._map = map;
    }
    /**
     * No sé muy bien cómo va esto XD
     * @param {Function} funcionIA
     */
    get next() {
        return this._funcionIA(this._map);
    }
}

module.exports = {
    Personaje: Personaje
};