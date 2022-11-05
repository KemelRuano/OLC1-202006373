import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { EntornoAux } from "../../entorno_aux";
import { Instruccion } from "../../instruccion";
import { Variable } from "../../variable";

export class DecId extends Instruccion{
  id: string;
  reasignable: boolean;

  constructor(linea: string, reasignable: boolean, id: string){
    super(linea);
    Object.assign(this, {id, reasignable});
  }

  ejecutar(e: Entorno) {
    //Validacion de variabl existente
    let variable = e.getVariable(this.id);
    variable = new Variable({reasignable: this.reasignable, id: this.id});
    e.setVariable(variable);
  }
}
