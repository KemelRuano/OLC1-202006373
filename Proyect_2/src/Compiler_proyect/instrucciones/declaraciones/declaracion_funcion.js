"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionFuncion = void 0;
const funcion_1 = require("../../funcion");
const instruccion_1 = require("../../instruccion");
class DeclaracionFuncion extends instruccion_1.Instruccion {
    constructor(linea, id, instrucciones, tipo_return = 5 /* VOID */, lista_parametros = null) {
        super(linea);
        Object.assign(this, { id, instrucciones, tipo_return, lista_parametros });
    }
    ejecutar(e) {
        const funcion = e.getFuncion(this.id);
        if (this.lista_parametros) {
            const items = [];
            for (let variable of this.lista_parametros) {
                items.push(variable.id);
            }
        }
        e.setFuncion(new funcion_1.Funcion(this.id, this.instrucciones, this.tipo_return, this.lista_parametros));
    }
}
exports.DeclaracionFuncion = DeclaracionFuncion;
