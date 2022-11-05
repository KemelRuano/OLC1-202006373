"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor({ tipo, linea, columna, descripcion }) {
        const valor = linea;
        const valor2 = columna;
        Object.assign(this, { tipo, linea: valor.toString(), columna: valor2.toString(), descripcion });
    }
}
exports.Error = Error;
