import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Arreglo } from "../arreglo";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { getTipo, TIPO_DATO } from "../tipo";

export class AccesoArregloSimple extends Instruccion {

  id: string;
  lista_accesos: Array<Instruccion>;

  constructor(linea: string, id: string, lista_accesos: Array<Instruccion>) {
    super(linea);
    Object.assign(this, { id, lista_accesos });
  }

  ejecutar(e: Entorno) {
    //Busqueda de variable en la tabla de simbolos
    const variable = e.getVariable(this.id);

    let res = variable.getValor();


    for (let i = 0; i < this.lista_accesos.length; i++) {
      const index = this.lista_accesos[i].ejecutar(e);
      //Si ya es el ultimo acceso
      if (i == this.lista_accesos.length - 1) {
        if (res instanceof Arreglo) {
          return res.getValue(index);
        }
        //TODO: el else creo que es error
      }
      //Si aun no es el ultimo acceso
      else {
        if (res instanceof Arreglo) {
          res = res.getValue(index);
        }
        //TODO: el else creo que es error
      }
    }
  }

}
