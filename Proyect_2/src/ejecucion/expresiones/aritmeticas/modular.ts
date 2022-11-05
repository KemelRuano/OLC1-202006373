import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class Modular extends Instruccion{
  expIzq: Instruccion;
  expDer: Instruccion;

  constructor(linea: string, expIzq: Instruccion, expDer: Instruccion){
    super(linea);
    Object.assign(this, {expIzq, expDer});
  }

  ejecutar(e: Entorno) {
    const exp1 = this.expIzq.ejecutar(e);
    const exp2 = this.expDer.ejecutar(e);

    //Solo se pueden calcular modular con numbers
    if(typeof exp1 == 'number' && typeof exp2 == 'number'){
      //No se puede dividir entre 0
     
      return exp1 % exp2;
    }

    //Si no es error
  
  }
}
