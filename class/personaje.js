"use strict";
class Personaje {
    /**
     * @description Crea un personaje con los parámetros dados
     * @param {String} nombre String con el nombre del personaje
     * @param {String} tipo Tipo de  barco
     * @param {Function} funcionIA Función con la IA del personake
     * @returns {Object} Objeto con los parámetros del personaje.
     */
    constructor(nombre, tipo) {
        //disparo curvo y disparo tenso
        this.nombre = nombre;
        this.orientacion = this.OrientacionAleatoria();
        this._espera = 0;
        this._espera_disparo = 0;
        this._anteriores = [];
        this.x = 0;
        this.y = 0;
        this.next = {};
        switch (tipo) {
            case "barco1":
                this.velocidad = 10;
                this.vida = 50;
                this.vision = 5;
                this.disparo = "tenso";
                this.rango = 4;
                this.pupa = 100;
                this.velocidad_disparo = 2;
                this.cadencia = 5;
                break;
            case "barco2":
                this.velocidad = 30;
                this.vida = 100;
                this.vision = 6;
                this.disparo = "curvo";
                this.rango = 6;
                this.pupa = 200;
                this.velocidad_disparo = 5;
                this.cadencia = 20;
                break;
            case "diego":
                this.velocidad = 100;
                this.vida = 10;
                this.vision = 10;
                this.disparo = "curvo";
                this.rango = 1;
                this.pupa = 1;
                this.velocidad_disparo = 50;
                this.cadencia = 100;
                break;
            default:
                this.velocidad = 20;
                this.vida = 100;
                this.vision = 5;
                this.disparo = "curvo";
                this.rango = 5;
                this.pupa = 200;
                this.velocidad_disparo = 3;
                this.cadencia = 10;
                break;
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
    update(map) {
        this._map = map;
    }
    get map() {
        return this._map;
    }
    set espera(n) {
        this._espera = n;
    }
    get espera() {
        if (this._espera > 0) {
            this._espera--;
        }
        return this._espera;
    }
    get espera_disparo() {
        if (this._espera_disparo > 0) {
            this._espera_disparo--;
        }
        return this._espera_disparo;
    }

    get anteriores() {
        return this._anteriores;
    }

    Disparo() {
        this._espera_disparo = this.cadencia;
    }

    actualizarAccion(accion) {
        this.next = accion;
    }
}

module.exports = {
    Personaje: Personaje
};