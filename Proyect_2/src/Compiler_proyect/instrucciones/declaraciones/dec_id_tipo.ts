import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { EntornoAux } from "../../entorno_aux";
import { Instruccion } from "../../instruccion";
import { TIPO_DATO } from '../../tipo';
import { Variable } from "../../variable";

export class DecIdTipo extends Instruccion{
  reasignable: boolean;
  id: string;
  tipo: TIPO_DATO;
  type_generador: string;

  constructor(linea: string, reasignable: boolean, id: string, tipo: TIPO_DATO, type_generador: String){
    super(linea);
    Object.assign(this, {reasignable, id, tipo, type_generador});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable existente
    let variable = e.getVariable(this.id);
    if(this.tipo == TIPO_DATO.TYPE && this.type_generador != null){
      const type = e.getType(this.type_generador);
    }

    variable = new Variable({reasignable: this.reasignable, id: this.id, tipo_asignado: this.tipo, type_generador: this.type_generador});
    e.setVariable(variable);
  }

}
