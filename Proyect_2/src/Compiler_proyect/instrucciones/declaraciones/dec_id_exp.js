"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecIdExp = void 0;
const instruccion_1 = require("../../instruccion");
const tipo_1 = require("../../tipo");
const variable_1 = require("../../variable");
const _ = require("lodash");
class DecIdExp extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id, exp) {
        super(linea);
        Object.assign(this, { reasignable, id, exp });
    }
    ejecutar(e) {
        //Validacion de variable existente
        let variable = e.getVariable(this.id);
        //Creacion de variable en el entorno
        let valor = this.exp.ejecutar(e);
        valor = _.cloneDeep(valor);
        const tipo_asignado = tipo_1.getTipo(valor);
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id, tipo_asignado, valor });
        e.setVariable(variable);
    }
}
exports.DecIdExp = DecIdExp;
