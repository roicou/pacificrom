"use strict";
/**
 * @file
 * @description 
 * <h3>Pacific ROM</h3>
 * 19/11/2018<br/><br/>
 * 
 * Vamos a crear un juego y todo lo demás se irá viendo sobre la marcha.
*/

let tablero = CrearTablero(20, 20);
ImprimirTablero(tablero);

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
    console.log(posx);
    console.log(posy);
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
    //console.log(posx_original, posx_final, posy_original, posy_final);
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
        //console.log();
        console.log(imprime);
    }
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
function VisionPersonaje(tablero, posx, posy, rango){
    let tableropersonal = [];
    for(let y = 0; y < tablero.length; y++){
        tableropersonal.push([])
       for(let x = 0; x < tablero[y].length; x++){
           if(RadioAccion(y, x, posx, posy, rango)){
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
function RadioAccion(tablerox, tableroy, posx, posy, rango){
    //if((tablerox >= posx - rango && tablerox <= posx + rango) && (tableroy >= posy - rango && tableroy <= posy + rango)){
    if(Math.pow(posx - tablerox, 2) + Math.pow(posy - tableroy,2) <= Math.pow(rango, 2)){
        return true;
    } else {
        return false;
    }
}

/**
 * @description Crea un personaje con los parámetros dados
 * @param {Number} vida Vida del personaje
 * @param {Number} vision Distancia de visión del personaje
 * @param {String} nombre String con el nombre del personaje
 * @param {Function} funcionIA Función con la IA del personake
 * @returns {Object} Objeto con los parámetros del personaje.
 */
function CrearPersonaje(vida, vision, nombre, funcionIA) {
    return {
        "tipo": "personaje",
        "vida": vida,
        "vision": vision,
        "nombre": nombre,
        "next": funcionIA
    };
}

/**
 * @description Ejecuta la acción de un personaje
 * @param {Object} accion El objeto con la acción del personaje
 */
function EjecutaAccion(accion, tablero) {
    if(accion.next.accion == "moverse"){
        MoverPersonaje(tablero, accion.x, accion.y, accion.direccion);
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
                //console.log(tablero[y][x].in[0].next);
                acciones.push({
                    "x": x,
                    "y": y,
                    "next": tablero[y][x].in[0].next()
                });
            }
        }
    }
    for(let accion of acciones) {
        //EjecutaAccion(accion, tablero);
    }
    ImprimirTablero(tablero);
    console.log("----------------------------------------");
}

function RandomAction() {
    let random = Math.random();
    let accion = "moverse";
    let direccion = "";
    if(random < 0.25){
        direccion = "N";
    } else if(random < 0.5){
        direccion = "S";
    } else if(random < 0.75){
        direccion = "E";
    } else {
        direccion = "W";
    }
    return {
        "accion": accion,
        "direccion": direccion
    };
}
ColocarPjAleatorio(tablero, CrearPersonaje(50,5,"Emilio", RandomAction));
Tick(tablero);
