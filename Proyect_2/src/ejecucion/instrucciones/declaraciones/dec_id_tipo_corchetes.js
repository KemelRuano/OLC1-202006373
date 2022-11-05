"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecIdTipoCorchetes = void 0;
const instruccion_1 = require("../../instruccion");
const variable_1 = require("../../variable");
class DecIdTipoCorchetes extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id, tipo, dimensiones, type_generador) {
        super(linea);
        Object.assign(this, { reasignable, id, tipo, dimensiones, type_generador });
    }
    ejecutar(e) {
        //Validacion de variabl existente
        let variable = e.getVariable(this.id);
        //Si es un type busco el type para comprobar que exista
        if (this.tipo == 3 /* TYPE */ && this.type_generador != null) {
            const type = e.getType(this.type_generador);
        }
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id, tipo_asignado: 4 /* ARRAY */, dimensiones: this.dimensiones, type_generador: this.type_generador });
        e.setVariable(variable);
    }
}
exports.DecIdTipoCorchetes = DecIdTipoCorchetes;
