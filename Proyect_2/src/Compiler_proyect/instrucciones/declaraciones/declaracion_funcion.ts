import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Funcion } from "../../funcion";
import { Instruccion } from "../../instruccion";
import { TIPO_DATO } from "../../tipo";
import { Variable } from "../../variable";

export class DeclaracionFuncion extends Instruccion{

  linea: string;
  id: string;
  instrucciones: Array<Instruccion>;
  tipo_return: TIPO_DATO;
  lista_parametros: Array<Variable>;

  constructor(linea: string, id: string, instrucciones: Array<Instruccion>, tipo_return: TIPO_DATO = TIPO_DATO.VOID, lista_parametros: Array<Variable> = null){
    super(linea);
    Object.assign(this, {id, instrucciones, tipo_return, lista_parametros});
  }

  ejecutar(e: Entorno) {
    const funcion = e.getFuncion(this.id);
    if(this.lista_parametros){
      const items = [];
      for(let variable of this.lista_parametros){
        items.push(variable.id);
      }
    }

    e.setFuncion(new Funcion(this.id, this.instrucciones, this.tipo_return, this.lista_parametros));
  }

}
