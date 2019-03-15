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
let partida = new Tablero.Tablero(8, 6);

var jwt = require('jsonwebtoken');
let barcos = {};


var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post("/post/nuevopj", (req, res) => {
    console.log("Recibida orden", req.body);
    let id_personaje = jwt.sign('clave para pacific rom', 'esto es secreto');
    barcos[id_personaje] = new Personaje.Personaje(req.body.nombre, req.body.barco, id_personaje);
    partida.ColocarPjAleatorio(barcos[id_personaje]);
    res.json({id: id_personaje});
    partida.imprime;
});

app.get('/partida', (req, res) => {
    res.send(partida);
});

app.get('/empezar_partida', (req, res) => {
    setInterval(partida.Tick, 500, partida);
});

app.get('/1.0/get/req', (req, res) => {
    console.log("Recibida request", req.query);
    res.json({status: "Ok"});
});

app.listen(3000, () => {
    console.log('Pacific ROM funcionando en el puerto 3000');
});
