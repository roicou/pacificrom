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

tablero[y][x].in[0].Mover(tablero, nuevox, nuevoy)
