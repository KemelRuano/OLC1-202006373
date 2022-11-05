import { Errores } from "../../arbol/errores";
import { Error } from "../../arbol/error";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";

export class IncrementoDecremento extends Instruccion{
  id: string;
  incremento: boolean;

  constructor(linea: string, id: string, incremento: boolean){
    super(linea);
    Object.assign(this, {id, incremento});
  }

  ejecutar(e: Entorno) {
    //Comprobacion de variable existente
    const variable = e.getVariable(this.id);
    //Si es un incremento
    if(this.incremento){
      variable.valor++;
    }
    //Si es un decremento
    else{
      variable.valor--;
    }
  }
}
