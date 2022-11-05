"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushArregloAccesoType = void 0;
const instruccion_1 = require("../../instruccion");
class PushArregloAccesoType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos, exp) {
        super(linea);
        Object.assign(this, { id, lista_accesos, exp });
    }
    ejecutar(e) {
        //Validacion de variable existente
        const variable = e.getVariable(this.id);
        let actual = variable.getValor();
        for (let acceso of this.lista_accesos) {
            if (typeof acceso == 'string') {
                const aux_variable = actual.getAtributo(acceso);
                actual = aux_variable.getValor();
            }
            else if (acceso instanceof Array) {
                for (let exp of acceso) {
                    const index = exp.ejecutar(e);
                    actual = actual.getValue(index);
                }
            }
        }
        //Insertamos el dato
        const valor = this.exp.ejecutar(e);
        actual.push(valor);
    }
}
exports.PushArregloAccesoType = PushArregloAccesoType;
