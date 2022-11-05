
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { Return } from "../return";
import * as _ from 'lodash';
import { EntornoAux } from "../entorno_aux";


export class LlamadaFuncion extends Instruccion {
  id: string;
  lista_parametros: Array<Instruccion>;

  constructor(linea: string, id: string, lista_parametros: Array<Instruccion> = null) {
    super(linea);
    Object.assign(this, { id, lista_parametros });
  }

  ejecutar(e: Entorno) {
    const entorno_aux = new Entorno();
    const entorno_local = new Entorno(e);

    const funcion = _.cloneDeep(e.getFuncion(this.id));

   

    //Si la llamada  de la funcion trae parametros
    if (this.lista_parametros) {
      for (let i = 0; i < this.lista_parametros.length; i++) {
        const exp = this.lista_parametros[i];
        const variable = funcion.lista_parametros[i];

        const valor = exp.ejecutar(entorno_local);


        variable.valor = valor;
        entorno_aux.setVariable(variable);
      }
    }
    

    entorno_local.variables = entorno_aux.variables;
    //Si es una funcion anidada que estoy ejecutando y estoy dentro de una funcion
    if(EntornoAux.getInstance().estoyEjecutandoFuncion() && this.id.endsWith('_')){
      //No debo cambiar el entorno padre, lo dejo aqui por si acaso :D
    }
    else{
      entorno_local.padre = e.getEntornoGlobal();
    }

    EntornoAux.getInstance().inicioEjecucionFuncion();

    //Ejecuto las instrucciones
    for (let instruccion of funcion.instrucciones) {
      const resp = instruccion.ejecutar(entorno_local);

      //Validacion Return
      if (resp instanceof Return) {
        //Validacion de retorno en funcion
        if (funcion.hasReturn() && resp.hasValue()) {
          //Valido el tipo del retorno
          let val = resp.getValue();
     
          EntornoAux.getInstance().finEjecucionFuncion();
          return val;
        }
        //Si la funcion tiene return pero el return no trae valor
       
        //Si solo es un return
        EntornoAux.getInstance().finEjecucionFuncion();
        return;
      }
 
    }

    EntornoAux.getInstance().finEjecucionFuncion();
  }

}
