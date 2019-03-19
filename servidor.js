"use strict";
/**
 * @file
 * @description Servidor para Pacific ROM
 * <p>
 * Necesarios:
 * <p>
 * npm install express
 * npm install body-parser
 * npm install request
 * npm install jsonwebtoken
 */


let Tablero = require('./class/tablero.js');
let Personaje = require('./class/personaje.js');
let tablero = new Tablero.Tablero(20, 20);
tablero.ColocarPjAleatorio(new Personaje.Personaje("Roi", "barco1"));

tablero.ColocarPjAleatorio(new Personaje.Personaje("Roi", "barco1"));

tablero.ColocarPjAleatorio(new Personaje.Personaje("Roi", "barco1"));

var jwt = require('jsonwebtoken');


var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/crear_personaje", (req, res) => {
    console.log("Recibida orden", req.body);
    let id_personaje = jwt.sign('clave para pacific rom', 'esto es secreto');
    let barco = new Personaje.Personaje(req.body.nombre, req.body.barco);
    tablero.ColocarPjAleatorio(barco);
    tablero.personajes[id_personaje] = barco;
    res.json({ id: id_personaje });
    tablero.imprime;
});

app.post("/ejecutar_accion", (req, res) => {
    let id = req.body.id;
    let accion = req.body.accion;
    if (tablero.personajes[id]) {
        tablero.personajes[id].actualizarAccion(accion);
    }
});

app.post("/dame_personaje", (req, res) => {
    let id = req.body.id;
    if (tablero.personajes[id]) {
        res.json(tablero.personajes[id]);
    }
})

app.get('/partida', (req, res) => {
    res.json(tablero.tablero);
});

app.get('/empezar_partida', (req, res) => {
    setInterval(tablero.Tick, 500, tablero);
});

app.get('/1.0/get/req', (req, res) => {
    console.log("Recibida request", req.query);
    res.json({ status: "Ok" });
});

app.listen(3000, () => {
    console.log('Pacific ROM funcionando en el puerto 3000');
});
