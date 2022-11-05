"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayPopAccesosType = void 0;
const instruccion_1 = require("../../instruccion");
class ArrayPopAccesosType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        //Busqueda y validaciones de variable
        const variable = e.getVariable(this.id);
        let actual = variable.getValor();
        //Realizo los accesos al type
        for (let acceso of this.lista_accesos) {
            //Si es un acceso a un atributo
            if (typeof acceso == 'string') {
                const aux_variable = actual.getAtributo(acceso);
                actual = aux_variable.getValor();
            }
            //Si es un acceso de un arreglo
            else if (acceso instanceof Array) {
                //Realizo el acceso
                for (let exp of acceso) {
                    const index = exp.ejecutar(e);
                    actual = actual.getValue(index);
                }
            }
        }
        return actual.pop();
    }
}
exports.ArrayPopAccesosType = ArrayPopAccesosType;
