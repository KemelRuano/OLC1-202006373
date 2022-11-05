"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecId = void 0;
const instruccion_1 = require("../../instruccion");
const variable_1 = require("../../variable");
class DecId extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id) {
        super(linea);
        Object.assign(this, { id, reasignable });
    }
    ejecutar(e) {
        //Validacion de variabl existente
        let variable = e.getVariable(this.id);
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id });
        e.setVariable(variable);
    }
}
exports.DecId = DecId;
