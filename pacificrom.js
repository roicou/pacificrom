"use strict";
/**
 * @file
 * @description 
 * <h3>Pacific ROM</h3>
 * 19/11/2018<br/><br/>
 * 
 * Vamos a crear un juego y todo lo demás se irá viendo sobre la marcha.
*/

//1º Creamos el tablero
let tablero = CrearTablero(20, 20);

//2º Colocamos personajes en el tablero
ColocarPjAleatorio(tablero, CrearPersonaje("Emi", "barco1", RandomAction));
ColocarPjAleatorio(tablero, CrearPersonaje("Roi", "barco1", RandomAction));
ColocarPjAleatorio(tablero, CrearPersonaje("Juan", "barco1", RandomAction));
//3º Imprimimos el tablero
ImprimirTablero(tablero);

//4º Ejecutamos el Tick (esto mostrará otro tablero)
setInterval(Tick, 2000, tablero);
//Tick(tablero);

console.log("Otro hola mundo");

//**********************************************************************************************************
//                               EMPIEZA EL CÓDIGO
//**********************************************************************************************************
/**
 * @description Función que crea un tablero indicándole el número de filas y columnas (X, Y). El tablero 
 * viene en forma de array de ararys. El primer nivel es para la fila y cada casilla de columna irá en el 
 * segundo array.
 * @param {number} filas Número de filas del tablero (X)
 * @param {number} columnas Número de columnas del tablero (Y)
 * @returns {Array}    
 */
function CrearTablero(filas, columnas) {
    let tablero = [];
    for (let y = 0; y < filas; y++) {
        tablero.push([]);
        for (let x = 0; x < columnas; x++) {
            let tierra = 0;
            if (y > 0 && x > 0) {
                if (tablero[y - 1][x].tipo == "tierra" && tablero[y][x - 1].tipo == "tierra") {
                    tierra = 2;
                } else if (tablero[y - 1][x].tipo == "tierra" || tablero[y][x - 1].tipo == "tierra") {
                    tierra = 1;
                }
            }
            tablero[y].push(CrearTerreno(SeleccionarTipo(tierra)));
        }
    }
    return tablero;
}

/**
 * @description Coloca un personaje en unas coordenadas aleatorias.
 * @param {Array} tablero Tablero del juego 
 * @param {Object} personaje Personaje a añadir
 */
function ColocarPjAleatorio(tablero, personaje) {
    let posx = CoordenadasAleatorias(tablero[0].length);
    let posy = CoordenadasAleatorias(tablero.length);
    if (tablero[posy][posx].tipo == "agua" && tablero[posy][posx].in[0] == null) {
        tablero[posy][posx].in[0] = personaje;
    } else {
        ColocarPjAleatorio(tablero, personaje);
    }
}


/**
 * @description Da un número entero entre 0 y la coordenada máxima que tengamos (X o Y)
 * @param {number} maximo Coordenada máxima 
 * @returns Número
 */
function CoordenadasAleatorias(maximo) {
    return Math.floor(Math.random() * maximo);
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
function MoverPersonaje(tablero, posx, posy, direccion) {
    switch (direccion) {
        case 'N':
            MoviendoPersonaje(tablero, posx, posx, posy, (posy - 1));
            break;
        case 'E':
            MoviendoPersonaje(tablero, posx, (posx + 1), posy, posy);
            break;
        case 'S':
            MoviendoPersonaje(tablero, posx, posx, posy, (posy + 1));
            break;
        case 'W':
        case 'O':
            MoviendoPersonaje(tablero, posx, (posx - 1), posy, posy);
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
function MoviendoPersonaje(tablero, posx_original, posx_final, posy_original, posy_final) {
    if (posx_final >= 0 && posy_final >= 0 && posx_final < tablero[0].length && posy_final < tablero.length) {
        if (tablero[posy_final][posx_final].in[0] == null && tablero[posy_final][posx_final].tipo == "agua") {
            tablero[posy_final][posx_final].in[0] = tablero[posy_original][posx_original].in[0];
            tablero[posy_original][posx_original].in[0] = null;
        }
    }
}

/**
 * @description Función que imprime de forma "bonita" el tablero para que sea visible. Puede ser el
 * tablero entero o el que puede ver un personaje.
 * @param {Array} tablero Tablero que queremos imprimir.
 */
function ImprimirTablero(tablero) {
    for (let y of tablero) {
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


/**
 * @description Genera un objeto con el atributo "tipo" que le digamos.
 * @param {string} tipo Tipo de terreno
 * @returns {Object}    
 */
function CrearTerreno(tipo) {
    return {
        "tipo": tipo,
        "prop": [],
        "in": [null]
    };
}
/**
 * @description Genera de forma aleatoria un tipo de terreno a escoger entre "agua", "tierra" o 
 * "iceberg". <br/> Hay un 95% de probabilidades de que salga "agua" y un 5% para los 
 * otros elementos.
 * @param {Number} tierra 0 = No hay agua. 1 = Hay agua arriba o izquierda. 2 = Hay agua arriba y izquierda
 * @returns {string}    
 */
function SeleccionarTipo(tierra) {
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
 * @description Genera un tablero para un personaje concreto
 * @param {Array} tablero Tablero completo del juego
 * @param {number} posx Coordenada "x" del personaje
 * @param {number} posy Coordenada "y" del personaje
 * @param {number} rango Rango de visión del personaje
 * @returns {Array} Nuevo tablero donde todo lo que no puede ver el personaje es null
 */
function VisionPersonaje(tablero, posx, posy, rango) {
    let tableropersonal = [];
    for (let y = 0; y < tablero.length; y++) {
        tableropersonal.push([])
        for (let x = 0; x < tablero[y].length; x++) {
            if (RadioAccion(y, x, posx, posy, rango)) {
                tableropersonal[y].push(tablero[y][x]);
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
function RadioAccion(tablerox, tableroy, posx, posy, rango) {
    //if((tablerox >= posx - rango && tablerox <= posx + rango) && (tableroy >= posy - rango && tableroy <= posy + rango)){
    if (Math.pow(posx - tablerox, 2) + Math.pow(posy - tableroy, 2) <= Math.pow(rango, 2)) {
        return true;
    } else {
        return false;
    }
}

/**
 * @description Crea un personaje con los parámetros dados
 * @param {String} nombre String con el nombre del personaje
 * @param {String} tipo Tipo de  barco
 * @param {Function} funcionIA Función con la IA del personake
 * @returns {Object} Objeto con los parámetros del personaje.
 */
function CrearPersonaje(nombre, tipo, funcionIA) {
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
                "orientacion": OrientacionAleatoria(),
                "next": funcionIA
            }
    }
}

/**
 * 
 * TAREA PENDIENTE!!!!!!! ************************************************************************************************************************************
 * 
 * HAY QUE COMPROBAR EN EL SWITCH DONDE VEMOS SI SE VA DE RANGO QUE NO SE VAYA DEL TABLERO!!!!!!!!
 * 
 * 
 * 
 * 
 * @param {Array} tablero 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} objetivo_x 
 * @param {Number} objetivo_y 
 */
function Disparar(tablero, x, y, objetivo_x, objetivo_y) {
    switch (tablero[y][x].in[0].orientacion) {
        case "N":
            if (tablero[y][x].in[0].rango < (y - objetivo_y)) {
                objetivo_y = y - tablero[y][x].in[0].rango;
            }
            break;
        case "S":
            if (tablero[y][x].in[0].rango < (objetivo_y - y)) {
                objetivo_y = y + tablero[y][x].in[0].rango;
            }
            break;
        case "E":
            if (tablero[y][x].in[0].rango < (objetivo_x - x)) {
                objetivo_x = x + tablero[y][x].in[0].rango;
            }
            break;
        case "W":
            if (tablero[y][x].in[0].rango < (x - objetivo_x)) {
                objetivo_x = x - tablero[y][x].in[0].rango;
            }
            break;
    }
    switch (tablero[y][x].in[0].disparo) {
        case "curvo":
            if (tablero[objetivo_y][objetivo_x].in[0] != null) {
                tablero[objetivo_y][objetivo_x].in[0].vida -= tablero[y][x].in[0].pupa;
            }
            break;
        case "tenso":
            switch (tablero[y][x].in[0].orientacion) {
                case "N":
                    for (let misil = y + 1; misil <= objetivo_y; misil++) {
                        if (misil > 0 && misil < tablero.length) {
                            if (tablero[misil][x].in[0] != null) {
                                tablero[misil][x].in[0].vida <= tablero[y][x].in[0].pupa;
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    break;
                case "S":
                    for (let misil = y - 1; misil >= objetivo_y; misil--) {
                        if (tablero[misil][x].in[0] != null) {
                            tablero[misil][x].in[0].vida <= tablero[y][x].in[0].pupa;
                            break;
                        }
                    }
                    break;
            }
    }
}




/**
 * @description Ejecuta la acción de un personaje
 * @param {Object} accion El objeto con la acción del personaje
 */
function EjecutaAccion(accion, tablero) {
    if (accion.next.accion == "moverse") {
        MoverPersonaje(tablero, accion.x, accion.y, accion.next.direccion);
    }
}

/**
 * @description Recorre todas las casillas del tablero buscando un personaje. Hace que ese personaje 
 * se mueva aleatoriamente mediante la función {@link MoverPersonaje}.
 * @param {Array} tablero Recibe el tablero de juego
 */
function Tick(tablero) {
    let acciones = [];
    for (let y = 0; y < tablero.length; y++) {
        for (let x = 0; x < tablero[y].length; x++) {
            if (tablero[y][x].in[0] != null) {
                acciones.push({
                    "x": x,
                    "y": y,
                    "next": tablero[y][x].in[0].next()
                });
            }
        }
    }
    for (let accion of acciones) {
        EjecutaAccion(accion, tablero);
    }
    ImprimirTablero(tablero);
}

/**
 * @description Mueve un pj de forma aleatoria
 * @returns {Object} 
 */
function RandomAction() {
    let accion = "moverse";
    return {
        "accion": accion,
        "direccion": OrientacionAleatoria()
    };
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

function GirarPersonaje(tablero, x, y, giro) {
    if (tablero[y][x].in[0] != null) {
        switch (tablero[y][x].in[0].orientacion) {
            case "N":
                if (giro == "L") {
                    tablero[y][x].in[0].orientacion = "W";
                } else {
                    tablero[y][x].in[0].orientacion = "E";
                }
                break;
            case "E":
                if (giro == "L") {
                    tablero[y][x].in[0].orientacion = "N";
                } else {
                    tablero[y][x].in[0].orientacion = "S";
                }
                break;
            case "S":
                if (giro == "L") {
                    tablero[y][x].in[0].orientacion = "E";
                } else {
                    tablero[y][x].in[0].orientacion = "W";
                }
                break;
            case "W":
            case "O":
                if (giro == "L") {
                    tablero[y][x].in[0].orientacion = "S";
                } else {
                    tablero[y][x].in[0].orientacion = "N";
                }
                break;
        }
    }
}