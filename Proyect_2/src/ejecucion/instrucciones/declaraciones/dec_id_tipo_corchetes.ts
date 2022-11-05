import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { EntornoAux } from "../../entorno_aux";
import { Instruccion } from "../../instruccion";
import { TIPO_DATO } from '../../tipo';
import { Variable } from "../../variable";

export class DecIdTipoCorchetes extends Instruccion{
  reasignable: boolean;
  id: string;
  tipo: TIPO_DATO;
  dimensiones: number;
  type_generador: string;


  constructor(linea: string, reasignable: boolean, id: string, tipo: TIPO_DATO, dimensiones: number, type_generador: string){
    super(linea);
    Object.assign(this, {reasignable, id, tipo, dimensiones, type_generador});
  }

  ejecutar(e: Entorno) {
    //Validacion de variabl existente
    let variable = e.getVariable(this.id);
    //Si es un type busco el type para comprobar que exista
    if(this.tipo == TIPO_DATO.TYPE && this.type_generador != null){
      const type = e.getType(this.type_generador);
    }

    variable = new Variable({reasignable: this.reasignable, id: this.id, tipo_asignado: TIPO_DATO.ARRAY, dimensiones: this.dimensiones, type_generador: this.type_generador});
    e.setVariable(variable);
  }
}
