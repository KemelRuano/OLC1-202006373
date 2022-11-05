"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasMas = void 0;
const instruccion_1 = require("../../instruccion");
class MasMas extends instruccion_1.Instruccion {
    constructor(linea, id) {
        super(linea);
        Object.assign(this, { id });
    }
    ejecutar(e) {
        //Validacion de variable
        const variable = e.getVariable(this.id);
        const valor = variable.getValor();
        //Si no es un numero es error
        variable.valor = valor + 1;
        return valor;
    }
}
exports.MasMas = MasMas;
