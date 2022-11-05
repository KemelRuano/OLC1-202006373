"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const instruccion_1 = require("../../instruccion");
const tipo_1 = require("../../tipo");
const _ = require("lodash");
class Asignacion extends instruccion_1.Instruccion {
    constructor(linea, id, tipo_igual, exp) {
        super(linea);
        Object.assign(this, { id, tipo_igual, exp });
    }
    ejecutar(e) {
        //Busqueda de id
        const variable = e.getVariable(this.id);
        let valor = this.exp.ejecutar(e);
        valor = _.cloneDeep(valor);
        //Si no tiene tipo asignado le asigno lo que venga
        if (!variable.hasTipoAsignado()) {
            if (valor != null) {
                variable.tipo_asignado = tipo_1.getTipo(valor);
            }
        }
        if (this.tipo_igual == '=') {
            variable.valor = valor;
        }
        else {
            const res = this.tipo_igual == '+=' ? variable.getValor() + valor : variable.getValor() - valor;
            variable.valor = res;
        }
    }
}
exports.Asignacion = Asignacion;
