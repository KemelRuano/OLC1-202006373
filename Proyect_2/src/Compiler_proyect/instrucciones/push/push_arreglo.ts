import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class PushArreglo extends Instruccion{
  id: string;
  exp: Instruccion;

  constructor(linea: string, id: string, exp: Instruccion){
    super(linea);
    Object.assign(this, {id, exp});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable existente
    const variable = e.getVariable(this.id);
    const arreglo = variable.getValor();
    const valor = this.exp.ejecutar(e);

    //Realizo el push en el arreglo
    if(arreglo instanceof Arreglo){
      arreglo.push(valor);
    }
  }

}
