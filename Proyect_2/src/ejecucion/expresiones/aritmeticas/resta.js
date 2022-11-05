"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resta = void 0;
const instruccion_1 = require("../../instruccion");
class Resta extends instruccion_1.Instruccion {
    constructor(linea, expIzq, expDer) {
        super(linea);
        Object.assign(this, { expIzq, expDer });
    }
    ejecutar(e) {
        const exp1 = this.expIzq.ejecutar(e);
        const exp2 = this.expDer.ejecutar(e);
    }
}
exports.Resta = Resta;
