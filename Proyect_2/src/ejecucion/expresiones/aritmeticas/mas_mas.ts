import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class MasMas extends Instruccion{

  id: string;

  constructor(linea: string, id: string){
    super(linea);
    Object.assign(this, {id});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable
    const variable = e.getVariable(this.id);


    const valor = variable.getValor();
    //Si no es un numero es error
   
    
    variable.valor = valor + 1;
    return valor;
  }

}
