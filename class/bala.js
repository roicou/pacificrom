"use strict";
class Bala {
    constructor(tipo, velocidad_disparo, x, y, orientacion, objetivo_x, objetivo_y, pupa) {
        this.tipo= tipo,
        this.velocidad_disparo= velocidad_disparo,
        this.x= x,
        this.y= y,
        this.orientacion= orientacion,
        this.objetivo_x= objetivo_x,
        this.objetivo_y= objetivo_y,
        this.espera= velocidad_disparo,
        this.pupa= pupa
    }
}
module.exports = {
    Bala: Bala
};