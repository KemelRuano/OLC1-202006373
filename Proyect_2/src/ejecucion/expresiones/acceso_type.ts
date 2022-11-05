import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Arreglo } from "../arreglo";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { Type } from "../type";
import { Variable } from "../variable";

export class AccesoType extends Instruccion{
  id: string;
  lista_accesos: Array<any>;

  constructor(linea: string, id: string, lista_accesos: Array<string|Instruccion>){
    super(linea);
    Object.assign(this, {id, lista_accesos});
  }

  ejecutar(e: Entorno) {
    //Busqueda de variable en el entorno
    const variable = e.getVariable(this.id);

    let res = variable.getValor();

   

    for(let i = 0; i < this.lista_accesos.length; i++){
      const exp = this.lista_accesos[i];
      //Si el valor actual es un type
      if(res instanceof Type){
        res = res as Type;
        //Si la exp un string es acceso a una propiedad
        if(typeof exp == 'string'){
          
          //Si existe el type capturlo la variable que retorna y actualizo el valor
          const variable : Variable = res.getAtributo(exp);
          res = variable.getValor();
        }
       
      }
      //Si el valor actual es un Arreglo
      else if(res instanceof Arreglo){
        res = res as Arreglo;
      
        //Si es una lista de exp realizo los accesos
        for(let j = 0; j < exp.length; j++){
          const index = exp[j].ejecutar(e);

          if(res instanceof Arreglo){
            res = res.getValue(index);
          }
          //TODO el else creo que es error
        }



      }
      //TODO: creo que el else es error
    }

    //Si todo salio bien
    return res;
  }

}
