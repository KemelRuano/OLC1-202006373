"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecIdTipo = void 0;
const instruccion_1 = require("../../instruccion");
const variable_1 = require("../../variable");
class DecIdTipo extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id, tipo, type_generador) {
        super(linea);
        Object.assign(this, { reasignable, id, tipo, type_generador });
    }
    ejecutar(e) {
        //Validacion de variable existente
        let variable = e.getVariable(this.id);
        if (this.tipo == 3 /* TYPE */ && this.type_generador != null) {
            const type = e.getType(this.type_generador);
        }
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id, tipo_asignado: this.tipo, type_generador: this.type_generador });
        e.setVariable(variable);
    }
}
exports.DecIdTipo = DecIdTipo;
