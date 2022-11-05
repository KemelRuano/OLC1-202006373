"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoType = void 0;
const arreglo_1 = require("../arreglo");
const instruccion_1 = require("../instruccion");
const type_1 = require("../type");
class AccesoType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        //Busqueda de variable en el entorno
        const variable = e.getVariable(this.id);
        let res = variable.getValor();
        for (let i = 0; i < this.lista_accesos.length; i++) {
            const exp = this.lista_accesos[i];
            //Si el valor actual es un type
            if (res instanceof type_1.Type) {
                res = res;
                //Si la exp un string es acceso a una propiedad
                if (typeof exp == 'string') {
                    //Si existe el type capturlo la variable que retorna y actualizo el valor
                    const variable = res.getAtributo(exp);
                    res = variable.getValor();
                }
            }
            //Si el valor actual es un Arreglo
            else if (res instanceof arreglo_1.Arreglo) {
                res = res;
                //Si es una lista de exp realizo los accesos
                for (let j = 0; j < exp.length; j++) {
                    const index = exp[j].ejecutar(e);
                    if (res instanceof arreglo_1.Arreglo) {
                        res = res.getValue(index);
                    }
                    //TODO el else creo que es error
                }
            }
            //TODO: creo que el else es error
        }
        //Si todo salio bien
        return res;
    }
}
exports.AccesoType = AccesoType;
