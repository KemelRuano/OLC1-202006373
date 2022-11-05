"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncrementoDecremento = void 0;
const instruccion_1 = require("../instruccion");
class IncrementoDecremento extends instruccion_1.Instruccion {
    constructor(linea, id, incremento) {
        super(linea);
        Object.assign(this, { id, incremento });
    }
    ejecutar(e) {
        //Comprobacion de variable existente
        const variable = e.getVariable(this.id);
        //Si es un incremento
        if (this.incremento) {
            variable.valor++;
        }
        //Si es un decremento
        else {
            variable.valor--;
        }
    }
}
exports.IncrementoDecremento = IncrementoDecremento;
