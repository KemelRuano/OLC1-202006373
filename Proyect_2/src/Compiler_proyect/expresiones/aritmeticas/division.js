"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const instruccion_1 = require("../../instruccion");
class Division extends instruccion_1.Instruccion {
    constructor(linea, expIzq, expDer) {
        super(linea);
        Object.assign(this, { expIzq, expDer });
    }
    ejecutar(e) {
        const exp1 = this.expIzq.ejecutar(e);
        const exp2 = this.expDer.ejecutar(e);
        //Solo se pueden dividr numbers
        if (typeof exp1 == 'number' && typeof exp2 == 'number') {
            //No se puede dividir entre 0
            return exp1 / exp2;
        }
    }
}
exports.Division = Division;
