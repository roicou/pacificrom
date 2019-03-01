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
     * "remolino". <br/> Hay un 95% de probabilidades de que salga "agua" y un 5% para los 
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
                    tipo = "remolino";
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
        self._balas = [];
        //console.log(self.tablero);
        for (let y = 0; y < self.tablero.length; y++) {
            for (let x = 0; x < self.tablero[y].length; x++) {
                //compruebo que sea distinto de null y no sea el kraken
                if (self.tablero[y][x].in[0] != null) {
                    if (self.tablero[y][x].in[0].nombre == "Kraken") {
                        self.tablero[y][x].in[0] = null;
                    } else {
                        self.tablero[y][x].in[0].update(self.VisionPersonaje(x, y));
                        let objetivo_y = y;
                        let objetivo_x = x;
                        switch (self.tablero[y][x].in[0].orientacion) {
                            case "N":
                                objetivo_y = Math.floor(Math.random() * (y - 0) + 0);
                                break;
                            case "S":
                                objetivo_y = Math.floor(Math.random() * (self.tablero[y].length - y) + y);
                                break;
                            case "E":
                                objetivo_x = Math.floor(Math.random() * (self.tablero[y][x].length - x) + x);
                                break;
                            case "W":
                                objetivo_x = Math.floor(Math.random(0) * (x - 0) + 0);
                                break;
                        }

                        self._acciones.push({
                            "x": x,
                            "y": y,
                            "objetivo_x": objetivo_x,
                            "objetivo_y": objetivo_y,
                            "espera": self.tablero[y][x].in[0].espera,
                            "espera_disparo": self.tablero[y][x].in[0].espera_disparo,
                            "next": self.tablero[y][x].in[0].next

                        });
                    }
                }
                if (self.tablero[y][x].in.length > 1) {
                    for (let i = 1; i < self.tablero[y][x].in.length; i++) {
                        self.tablero[y][x].in[i].espera--;
                        self._balas.push(self.tablero[y][x].in[i]);
                    }
                }
            }
        }
        self._acciones.sort((a, b) => { return b.espera - a.espera });
        self._balas.sort((a, b) => { return b.espera - a.espera });

        //console.log(self._balas);

        for (let i = self._balas.length - 1; i >= 0; i--) {
            if (self._balas[i].espera == 0) {
                self.MoverBala(self._balas[i]);
            } else {
                break;
            }
        }

        //console.log(self._acciones);

        for (let i = self._acciones.length - 1; i >= 0; i--) {
            self.EjecutaAccion(self._acciones[i]);
        }
        self.Kraken();
        self.imprime;
    }

    /**
     * Mueve la bala y, en caso de que toque, catapum chin pum
     * @param {Object} bala 
     */
    MoverBala(bala) {
        let temp = this.tablero[bala.y][bala.x].in;
        let aux = this.tablero;
        this.tablero[bala.y][bala.x].in.splice([temp.indexOf(bala)], 1);
        switch (bala.orientacion) {
            case 'N':
                bala.y--;
                break;
            case 'S':
                bala.y++;
                break;
            case 'E':
                bala.x++;
                break;
            case 'W':
                bala.x--;
                break;
        }
        /*
        if:
            -(curvo & llega al objetivo & hay algo) | tenso & hay algo
                pupa
            -(curvo & llega al objetivo & no hay nada) | (tenso & (hay tierra | llega al objetivo))
                return
            --else
                sigue nadando
            
        */
        //solucion temporal a balas llendose del mapa
        if (aux[bala.y] == undefined || aux[bala.y][bala.x] == undefined) {
            return;
        } else {
            if (
                (bala.tipo == "curvo" && bala.x == bala.objetivo_x && bala.y == bala.objetivo_y && aux[bala.y][bala.x].in[0] != null) ||
                (bala.tipo == "tenso" && aux[bala.y][bala.x].in[0] != null)
            ) {
                aux[bala.y][bala.x].in[0].vida -= bala.pupa;
                if (aux[bala.y][bala.x].in[0].vida <= 0) {
                    aux[bala.y][bala.x].in[0] = null;
                }
                console.log("PUPAAAAAAAAAAAAAAAAAAAAA");
            } else if (
                (bala.tipo == "curvo" && bala.x == bala.objetivo_x && bala.y == bala.objetivo_y && aux[bala.y][bala.x].in[0] == null) ||
                ((bala.tipo == "tenso" && (aux[bala.y][bala.x].tipo == "tierra" || (bala.x == bala.objetivo_x && bala.y == bala.objetivo_y))))
            ) {
                console.log("RETUUUUUUUUUUUUUUUUUUUURN");
                return;
            } else {
                console.log("SIGUE NADANDO!!!!!!");
                aux[bala.y][bala.x].in.push(bala);
                aux[bala.y][bala.x].in[aux[bala.y][bala.x].in.indexOf(bala)].espera = aux[bala.y][bala.x].in[aux[bala.y][bala.x].in.indexOf(bala)].velocidad_disparo;
            }
        }
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
            if (accion.espera == 0) {
                this.tablero[accion.y][accion.x].in[0]._espera = this.tablero[accion.y][accion.x].in[0].velocidad;
                this.MoverPersonaje(accion.x, accion.y, accion.next.direccion);
            }
            //console.log('eeeeeeee');
        } else if (accion.next.accion = "disparar") {
            console.log(">>>>>>>>>>>>>>", accion);
            if (accion.espera_disparo == 0) {
                if (this.Disparar(accion.x, accion.y, accion.objetivo_x, accion.objetivo_y)) {
                    this.tablero[accion.y][accion.x].in[0].Disparo();
                }
            }
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
                this.tablero[posy][posx].in[0].orientacion = "N"
                this.MoviendoPersonaje(posx, posx, posy, (posy - 1));
                break;
            case 'E':
                this.tablero[posy][posx].in[0].orientacion = "E"
                this.MoviendoPersonaje(posx, (posx + 1), posy, posy);
                break;
            case 'S':
                this.tablero[posy][posx].in[0].orientacion = "S"
                this.MoviendoPersonaje(posx, posx, posy, (posy + 1));
                break;
            case 'W':
            case 'O':
                this.tablero[posy][posx].in[0].orientacion = "W"
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
        //let contador = 0;
        //let contador2 = 0;
        //let contador3 = 0;
        for (let y of this.tablero) {
            //let imprime = contador + " |";
            let imprime = "|";
            //contador++;
            for (let x of y) {
                //if (contador3 == 0) {
                //imprime += contador2; contador2++;
                //}
                if (x != null) {
                    switch (x.tipo) {
                        case "tierra":
                            imprime += "######";
                            break;
                        case "remolino":
                            imprime += "@@@@@@";
                            break;
                    }
                    if (x.in[0] != null) {
                        imprime += "[" + x.in[0].nombre + "]";
                    }
                    if (x.in.length > 1) {
                        for (let i = 1; i < x.in.length; i++) {
                            if (x.in[i].tipo == "curvo") {
                                imprime += "^^^";
                            } else {
                                imprime += "---";
                            }
                        }
                    }

                    imprime += "\t|"
                } else {
                    imprime += "null\t|";
                }
            }
            //contador3++;
            console.log(imprime);
        }
        console.log("----------------------------------------");
    }


    /**
     * Método que introduce una bala en el tablero comprobando que el objetivo es viable.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} objetivo_x 
     * @param {Number} objetivo_y 
     * @param {String} tipo Tipo de disparo
     * @param {Number} velocidad_disparo
     * @param {Number} pupa
     */
    Disparar(x, y, objetivo_x, objetivo_y) {
        //falla disparo tenso
        let aux_x = x;
        let aux_y = y;
        let orientacion = this.tablero[y][x].in[0].orientacion;
        switch (this.tablero[y][x].in[0].orientacion) {
            case "N":
                if (y > 0) {
                    if (this.tablero[y][x].in[0].rango < (y - objetivo_y)) {
                        objetivo_y = y - this.tablero[y][x].in[0].rango;
                        if (objetivo_y < 0) {
                            objetivo_y = 0;
                        }
                    }
                    y--;
                } else {
                    return false;
                }
                break;
            case "S":
                if (y < this.tablero.length - 1) {
                    if (this.tablero[y][x].in[0].rango < (objetivo_y - y)) {
                        objetivo_y = y + this.tablero[y][x].in[0].rango;
                        if (objetivo_y >= this.tablero.length) {
                            objetivo_y = this.tablero.length - 1;
                        }
                    }
                    y++;
                } else {
                    return false;
                }
                break;
            case "E":
                if (x < this.tablero[y].length - 1) {
                    if (this.tablero[y][x].in[0].rango < (objetivo_x - x)) {
                        objetivo_x = x + this.tablero[y][x].in[0].rango;
                        if (objetivo_x >= this.tablero[y].length) {
                            objetivo_x = this.tablero[y].length - 1;
                        }
                    }
                    x++;
                } else {
                    return false;
                }
                break;
            case "W":
                if (x > 0) {
                    if (this.tablero[y][x].in[0].rango < (x - objetivo_x)) {
                        objetivo_x = x - this.tablero[y][x].in[0].rango;
                        if (objetivo_x < 0) {
                            objetivox = 0;
                        }
                    }
                    x--;
                } else {
                    return false;
                }
                break;
        }
        this.tablero[y][x].in.push({
            "tipo": this.tablero[aux_y][aux_x].in[0].disparo,
            "velocidad_disparo": this.tablero[aux_y][aux_x].in[0].velocidad_disparo,
            "x": x,
            "y": y,
            "orientacion": this.tablero[aux_y][aux_x].in[0].orientacion,
            "objetivo_x": objetivo_x,
            "objetivo_y": objetivo_y,
            "espera": this.tablero[aux_y][aux_x].in[0].velocidad_disparo,
            "pupa": this.tablero[aux_y][aux_x].in[0].pupa
        });
        return true;
    }

    Kraken() {
        let random = Math.random();
        let y = Math.floor(Math.random() * (this.tablero.length - 1));
        let x = Math.floor(Math.random() * (this.tablero[0].length - 1));

        if (random < 0.05) {
            this.tablero[y][x].in[0] = { "nombre": "Kraken" };
        }
    }
}

module.exports = {
    Tablero: Tablero
};