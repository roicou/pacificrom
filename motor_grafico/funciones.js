function CrearTabla(tablero) {
    console.log(tablero);
    var tabla = document.getElementById('tablero');
    tabla.innerHTML = "";
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for (let y of tablero) {
        var tr = document.createElement('tr');
        for (let x of y) {
            var td = document.createElement('td');
            td.className = x.tipo;
            if (x.in[0]) {
                if (x.in[0].tipo == "kraken") {
                    td.innerHTML = "<img src=\"images/kraken.png\" alt=\"barco\" />";
                } else {
                    td.innerHTML = "<img src=\"images/barco.png\" alt=\"barco\" />";
                }
            }
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);

    }
    tbl.appendChild(tbdy);
    tabla.appendChild(tbl);
}

function LeerMapa() {
    var xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            CrearTabla(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("GET", "http://localhost:3000/partida", true);
    xhttp.send();
}

setInterval(LeerMapa, 500);