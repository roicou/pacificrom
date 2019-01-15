"use strict";
class Tablero {
    /**
     * Función que crea un tablero indicándole el número de filas y columnas (X, Y). El tablero 
     * viene en forma de array de ararys. El primer nivel es para la fila y cada casilla de columna irá en el 
     * segundo array.
     * @param {number} filas Número de filas del tablero (X)
     * @param {number} columnas Número de columnas del tablero (Y)
     * @returns {Array}    
     */
    constructor(filas, columnas) {
        this.tablero = [];
        for (let y = 0; y < filas; y++) {
            this.tablero.push([]);
            for (let x = 0; x < columnas; x++) {
                let tierra = 0;
                if (y > 0 && x > 0) {
                    if (this.tablero[y - 1][x].tipo == "tierra" && this.tablero[y][x - 1].tipo == "tierra") {
                        tierra = 2;
                    } else if (this.tablero[y - 1][x].tipo == "tierra" || this.tablero[y][x - 1].tipo == "tierra") {
                        tierra = 1;
                    }
                }
                this.tablero[y].push(this.CrearTerreno(this.SeleccionarTipo(tierra)));
            }
        }
    }
    /**
     * Genera un objeto con el atributo "tipo" que le digamos.
     * @param {string} tipo Tipo de terreno
     * @returns {Object}    
     */
    CrearTerreno(tipo) {
        return {
            "tipo": tipo,
            "prop": [],
            "in": [null]
        };
    }
    /**
     * Genera de forma aleatoria un tipo de terreno a escoger entre "agua", "tierra" o 
     * "iceberg". <br/> Hay un 95% de probabilidades de que salga "agua" y un 5% para los 
     * otros elementos.
     * @param {Number} tierra 0 = No hay agua. 1 = Hay agua arriba o izquierda. 2 = Hay agua arriba y izquierda
     * @returns {string}    
     */
    SeleccionarTipo(tierra) {
        let n = Math.random(); //n tiene un valor entre 0 y 1 (con muchos decimales).
        let tipo = "";
        switch (tierra) {
            case 1:
                if (n <= 0.3) {
                    tipo = "tierra";
                } else {
                    tipo = "agua";
                }
                break;
            case 2:
                if (n <= 0.7) {
                    tipo = "tierra";
                } else {
                    tipo = "agua";
                }
                break;

            default:
                if (n <= 0.95) {
                    tipo = "agua";
                } else if (n <= 0.985) {
                    tipo = "tierra";
                } else {
                    tipo = "iceberg";
                }
                break;
        }
        return tipo;
    }

    /**
     * Coloca un personaje en unas coordenadas aleatorias.
     * @param {Array} tablero Tablero del juego 
     * @param {Object} personaje Personaje a añadir
     */
    ColocarPjAleatorio(personaje) {
        let posx = this.CoordenadasAleatorias(this.tablero[0].length);
        let posy = this.CoordenadasAleatorias(this.tablero.length);
        if (this.tablero[posy][posx].tipo == "agua" && this.tablero[posy][posx].in[0] == null) {
            this.tablero[posy][posx].in[0] = personaje;
        } else {
            ColocarPjAleatorio(personaje);
        }
    }

    /**
     * Da un número entero entre 0 y la coordenada máxima que tengamos (X o Y)
     * @param {number} maximo Coordenada máxima 
     * @returns Número
     */
    CoordenadasAleatorias(maximo) {
        return Math.floor(Math.random() * maximo);
    }

    /**
     * @description Recorre todas las casillas del tablero buscando un personaje. Hace que ese personaje 
     * se mueva aleatoriamente mediante la función {@link MoverPersonaje}.
     * @param {Array} tablero Recibe el tablero de juego
     */
    Tick() {
        this._acciones = [];
        for (let y = 0; y < this.tablero.length; y++) {
            for (let x = 0; x < this.tablero[y].length; x++) {
                if (this.tablero[y][x].in[0] != null) {
                    this._acciones.push({
                        "x": x,
                        "y": y,
                        "next": this.tablero[y][x].in[0].next()
                    });
                }
            }
        }
        for (let accion of this._acciones) {
            partida.EjecutaAccion(accion);
        }
        partida.tablero;
    }

    /**
     * @description Ejecuta la acción de un personaje
     * @param {Object} accion El objeto con la acción del personaje
     */
    EjecutaAccion(accion) {
        if (accion.next.accion == "moverse") {
            MoverPersonaje(accion.x, accion.y, accion.next.direccion);
        }
    }

    /**
     * Getting que imprime de forma "bonita" el tablero para que sea visible. Puede ser el
     * tablero entero o el que puede ver un personaje.
     * @param {Array} tablero Tablero que queremos imprimir.
     */
    get imprime() {
        for (let y of this.tablero) {
            let imprime = "|";
            for (let x of y) {
                if (x != null) {
                    switch (x.tipo) {
                        case "tierra":
                            imprime += "@@@@@@";
                            break;
                        case "iceberg":
                            imprime += "######";
                            break;
                    }
                    if (x.in[0] != null) {
                        imprime += "[" + x.in[0].nombre + "]";
                    }
    
                    imprime += "\t|"
                } else {
                    imprime += "null\t|";
                }
            }
            console.log(imprime);
        }
        console.log("----------------------------------------");
    }
}

module.exports = {
    Tablero: Tablero
};