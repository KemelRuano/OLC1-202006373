"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecIdTipoCorchetesExp = void 0;
const instruccion_1 = require("../../instruccion");
const variable_1 = require("../../variable");
class DecIdTipoCorchetesExp extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id, tipo, dimensiones, exp, type_generador) {
        super(linea);
        Object.assign(this, { reasignable, id, tipo, dimensiones, exp, type_generador });
    }
    ejecutar(e) {
        //Validacion de variable existente
        let variable = e.getVariable(this.id);
        if (this.tipo == 3 /* TYPE */ && this.type_generador != null) {
            const type = e.getType(this.type_generador);
        }
        const valor = this.exp.ejecutar(e);
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id, tipo_asignado: 4 /* ARRAY */, dimensiones: this.dimensiones, type_generador: this.type_generador, valor });
        e.setVariable(variable);
    }
}
exports.DecIdTipoCorchetesExp = DecIdTipoCorchetesExp;
