"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecIdTipoExp = void 0;
const instruccion_1 = require("../../instruccion");
const variable_1 = require("../../variable");
class DecIdTipoExp extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id, tipo, exp, type_generador) {
        super(linea);
        Object.assign(this, { reasignable, id, tipo, exp, type_generador });
    }
    ejecutar(e) {
        //Validacion de variable existente
        let variable = e.getVariable(this.id);
        //Si es un type busco el type para comprobar que exista
        if (this.tipo == 3 /* TYPE */ && this.type_generador != null) {
            const type = e.getType(this.type_generador);
        }
        const valor = this.exp.ejecutar(e);
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id, tipo_asignado: this.tipo, type_generador: this.type_generador, valor });
        e.setVariable(variable);
    }
}
exports.DecIdTipoExp = DecIdTipoExp;
