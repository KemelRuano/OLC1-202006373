import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Type } from "../../type";

export class ArrayLengthAccesosType extends Instruccion {
  id: string;
  lista_accesos: Array<String | Array<Instruccion>>;

  constructor(linea: string, id: string, lista_accesos: Array<String | Array<Instruccion>>) {
    super(linea);
    Object.assign(this, { id, lista_accesos });
  }

  ejecutar(e: Entorno) {
    //Busqueda y validaciones de variable
    const variable = e.getVariable(this.id);
    let actual = variable.getValor();
    //Realizo los accesos al type
    for (let acceso of this.lista_accesos) {
      //Si es un acceso a un atributo
      if (typeof acceso == 'string') {
        
        const variable = actual.getAtributo(acceso);
        actual = variable.getValor();
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
    return actual.getSize();
  }

}
