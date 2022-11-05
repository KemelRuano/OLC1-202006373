"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArregloSimple = void 0;
const arreglo_1 = require("../arreglo");
const instruccion_1 = require("../instruccion");
class AccesoArregloSimple extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        //Busqueda de variable en la tabla de simbolos
        const variable = e.getVariable(this.id);
        let res = variable.getValor();
        for (let i = 0; i < this.lista_accesos.length; i++) {
            const index = this.lista_accesos[i].ejecutar(e);
            //Si ya es el ultimo acceso
            if (i == this.lista_accesos.length - 1) {
                if (res instanceof arreglo_1.Arreglo) {
                    return res.getValue(index);
                }
                //TODO: el else creo que es error
            }
            //Si aun no es el ultimo acceso
            else {
                if (res instanceof arreglo_1.Arreglo) {
                    res = res.getValue(index);
                }
                //TODO: el else creo que es error
            }
        }
    }
}
exports.AccesoArregloSimple = AccesoArregloSimple;
