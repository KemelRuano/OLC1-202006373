import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { getTipo } from "../../tipo";
import { Variable } from "../../variable";
import * as _ from 'lodash';
import { EntornoAux } from "../../entorno_aux";

export class DecIdExp extends Instruccion{
  reasignable: boolean;
  id: string;
  exp: Instruccion;

  constructor(linea: string, reasignable: boolean, id: string, exp: Instruccion){
    super(linea);
    Object.assign(this, {reasignable, id, exp});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable existente
    let variable = e.getVariable(this.id);
    //Creacion de variable en el entorno
    let valor = this.exp.ejecutar(e);
    valor = _.cloneDeep(valor);

    const tipo_asignado = getTipo(valor);
    variable = new Variable({reasignable: this.reasignable, id: this.id, tipo_asignado, valor});
    e.setVariable(variable);
  }

}
