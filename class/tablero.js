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
            this.ColocarPjAleatorio(personaje);
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
     * @param {Object} self Recibe el tablero de juego, porque al usar el setInterval se pierde.
     */
    Tick(self) {
        self._acciones = [];
        //console.log(self.tablero);
        for (let y = 0; y < self.tablero.length; y++) {
            for (let x = 0; x < self.tablero[y].length; x++) {
                if (self.tablero[y][x].in[0] != null) {
                    self.tablero[y][x].in[0].update(self.VisionPersonaje(x, y));
                    self._acciones.push({
                        "x": x,
                        "y": y,
                        "next": self.tablero[y][x].in[0].next
                    });
                }
            }
        }
        for (let accion of self._acciones) {
            self.EjecutaAccion(accion);
            //console.log(accion);
        }
        self.imprime;
    }

    /**
     * @description Genera un tablero para un personaje concreto
     * @param {number} posx Coordenada "x" del personaje
     * @param {number} posy Coordenada "y" del personaje
     * @returns {Array} Nuevo tablero donde todo lo que no puede ver el personaje es null
     */
    VisionPersonaje(posx, posy) {
        let tableropersonal = [];
        for (let y = 0; y < this.tablero.length; y++) {
            tableropersonal.push([])
            for (let x = 0; x < this.tablero[y].length; x++) {
                if (this.RadioAccion(y, x, posx, posy, this.tablero[posy][posx].in[0].rango)) {
                    tableropersonal[y].push(this.tablero[y][x]);
                } else {
                    tableropersonal[y].push(null);
                }
            }
        }
        return tableropersonal;
    }

    /**
     * @description Indica si una casilla está dentro de un rango de acción
     * @param {Number} tablerox Posición X a comprobar
     * @param {Number} tableroy Posición Y a comprobar
     * @param {Number} posx Posición X del personaje
     * @param {Number} posy Posición Y del personaje
     * @param {Number} rango Radio de acción del personaje
     * @returns {Boolean} True si la casilla está en rango, False si no.
     */
    RadioAccion(tablerox, tableroy, posx, posy, rango) {
        //if((tablerox >= posx - rango && tablerox <= posx + rango) && (tableroy >= posy - rango && tableroy <= posy + rango)){
        if (Math.pow(posx - tablerox, 2) + Math.pow(posy - tableroy, 2) <= Math.pow(rango, 2)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description Ejecuta la acción de un personaje
     * @param {Object} accion El objeto con la acción del personaje
     */
    EjecutaAccion(accion) {
        if (accion.next.accion == "moverse") {
            this.MoverPersonaje(accion.x, accion.y, accion.next.direccion);
            //console.log('eeeeeeee');
        }
    }

    /**
     * @description Mueve un personaje sobre el tablero. El movimiento lo realiza {@link moviendo_personaje}
     * @param {Number} posx Número de fila del tablero donde está el personaje (X)
     * @param {Number} posy Número de columna del tablero donde está el personaje (Y)
     * @param {String} direccion Dirección a la que queremos mover el personaje: <br/><ul>
     * <li>N -> Norte</li>
     * <li>E -> Este</li>
     * <li>S -> Sur</li>
     * <li>W -> Oeste</li>
     */
    MoverPersonaje(posx, posy, direccion) {
        switch (direccion) {
            case 'N':
                this.MoviendoPersonaje(posx, posx, posy, (posy - 1));
                break;
            case 'E':
                this.MoviendoPersonaje(posx, (posx + 1), posy, posy);
                break;
            case 'S':
                this.MoviendoPersonaje(posx, posx, posy, (posy + 1));
                break;
            case 'W':
            case 'O':
                this.MoviendoPersonaje(posx, (posx - 1), posy, posy);
                break;
        }
    }

    /**
     * @description Realiza el movimiento de {@link mover_personaje} hacienndo las comprobaciones pertinentes. <br/><br/>
     * Se comprueba si existe la posición a la que nos queremos mover y si está vacía.
     * @param {Number} posx_original Número de fila del tablero donde está el personaje (X)
     * @param {Number} posx_final Número de fila del tablero a donde vamos a mover el personaje (X)
     * @param {Number} posy_original Número de columna del tablero donde está el personaje (Y)
     * @param {Number} posy_final Número de columna del tablero a donde vamos a mover el personaje (Y)
     */
    MoviendoPersonaje(posx_original, posx_final, posy_original, posy_final) {
        if (posx_final >= 0 && posy_final >= 0 && posx_final < this.tablero[0].length && posy_final < this.tablero.length) {
            if (this.tablero[posy_final][posx_final].in[0] == null && this.tablero[posy_final][posx_final].tipo == "agua") {
                this.tablero[posy_final][posx_final].in[0] = this.tablero[posy_original][posx_original].in[0];
                this.tablero[posy_original][posx_original].in[0] = null;
            }
        }
    }

    /**
     * Getting que imprime de forma "bonita" el tablero para que sea visible. Puede ser el
     * tablero entero o el que puede ver un personaje.
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