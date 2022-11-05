
import { Salida } from '../arbol/salida';
import { Id } from './expresiones/id';
import { Nativo } from './expresiones/nativo';
import { Instruccion } from './instruccion';
import { Log } from './instrucciones/log';
import { Suma } from './expresiones/aritmeticas/suma';
import { Asignacion } from './instrucciones/asignaciones/asignacion';
import { Arreglo } from './expresiones/arreglo';
import { DeclaracionFuncion } from './instrucciones/declaraciones/declaracion_funcion';
import { LlamadaFuncion } from './expresiones/llamada_funcion';
import { Return } from './expresiones/flujo/return';
import { Resta } from './expresiones/aritmeticas/resta';
import { Multiplicacion } from './expresiones/aritmeticas/multiplicacion';
import { Division } from './expresiones/aritmeticas/division';
import { Modular } from './expresiones/aritmeticas/modular';
import { Potencia } from './expresiones/aritmeticas/potencia';
import { Mayor } from './expresiones/relacionales/mayor';
import { Menor } from './expresiones/relacionales/menor';
import { MayorIgual } from './expresiones/relacionales/mayor_igual';
import { MenorIgual } from './expresiones/relacionales/menor_igual';
import { Igual } from './expresiones/relacionales/igual';
import { Diferente } from './expresiones/relacionales/diferente';
import { And } from './expresiones/logicas/And';
import { Or } from './expresiones/logicas/Or';
import { Not } from './expresiones/logicas/Not';
import * as _ from 'lodash';
import { PushArreglo } from './instrucciones/push/push_arreglo';
import { Break } from './expresiones/flujo/break';
import { Continue } from './expresiones/flujo/continue';
import { If } from './if';
import { InstruccionIf } from './expresiones/condicionales/instruccion_if';
import { While } from './instrucciones/ciclos/while';
import { DoWhile } from './instrucciones/ciclos/do_while';
import { For } from './instrucciones/ciclos/for';
import { MasMas } from './expresiones/aritmeticas/mas_mas';
import { MenosMenos } from './expresiones/aritmeticas/menos_menos';
import { Variable } from './variable';
import { Ternario } from './expresiones/condicionales/ternario';
import { Case } from './case';
import { Switch } from './expresiones/condicionales/switch';
import { IncrementoDecremento } from './instrucciones/incremento_decremento';

export class Ejecucion {
  cima: Object;
  is_count: number;
  graficando: string;
  constructor(cima: Object) {
    Object.assign(this, { cima, is_count: 0, graficando: '' });
  }

  Graficar_AST(): string {
    this.is_count = 0;
    this.graficando = "digraph G {\n";
    this.graficando +=  `overlap=false  label="by Kemel Ruano" fontsize=75;`;
    if (this.cima != null) {this.Crear_NODO(this.cima);}
    this.graficando += "\n}";
    return this.graficando;
  }

  Crear_NODO(nodo: any): void {
    if (nodo instanceof Object) {
      let count_dad = this.is_count;
      this.graficando += `node${count_dad}[label="${this.Validar_string(nodo.label)}" shape = "box"];\n`;
      if (nodo.hasOwnProperty("hijos")) {
        nodo.hijos.forEach((NH: any) => {
          let idHijo = ++this.is_count;
          this.graficando += `node${count_dad} -> node${idHijo};\n`;
          if (NH instanceof Object) {
            this.Crear_NODO(NH);
          } else {
            this.graficando += `node${idHijo}[label="${this.Validar_string(NH)}" shape = "doublecircle"];`;
          }
        });
      }
    }
  }

  Validar_string(label: string): string {
    if (label.startsWith("\"") || label.startsWith("'") || label.startsWith("`")) {
      return label.substr(1, label.length - 2);
    }
    return label;
  }

  ejecutar(): void {
    const instrucciones = this.recorrer(this.cima);
    if (instrucciones instanceof Array) {
      Salida.getInstance().clear();}
  }

  getSalida(): String[] {
    return Salida.getInstance().lista;
  }


  recorrer(nodo: any): any {
    if (this.Create_Nodo('INICIO', nodo)) {
      return this.recorrer(nodo.hijos[0]);
    }

   
    if (this.Create_Nodo('INSTRUCCIONES', nodo)) {
      let instrucciones = [];
      nodo.hijos.forEach((NH: any) => {
        if (this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', NH) || this.Create_Nodo('DECLARACION_METODO', NH)) {
          const inst = this.recorrer(NH);
          if (inst instanceof Array) {
            instrucciones = instrucciones.concat(inst);}
          else {instrucciones.push(inst);}}});

      nodo.hijos.forEach((NH: any) => {
        if (!this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', NH) && !this.Create_Nodo('DECLARACION_METODO', NH)) {
          const inst = this.recorrer(NH);
          if (inst instanceof Array) {
            instrucciones = instrucciones.concat(inst);}
          else {instrucciones.push(inst);}}});
      return instrucciones;
    }

    if (this.Create_Nodo('DECLARACION_VARIABLE', nodo)) {
      const reasignable = this.recorrer(nodo.hijos[0]) as boolean;
      const lista_declaraciones = this.recorrer(nodo.hijos[1]) as Array<Object>;
      return {reasignable,lista_declaraciones };
    }
   
    if (this.Create_Nodo('LISTA_DECLARACIONES', nodo)) {
      const lista_declaraciones = [];
      nodo.hijos.forEach((NH: any) => {
        lista_declaraciones.push(this.recorrer(NH));
      });
      return lista_declaraciones;
    }

  
    if (this.Create_Nodo('LISTA_EXPRESIONES', nodo)) {
      const lista = [];
      nodo.hijos.forEach((NH: any) => {
        if (NH instanceof Object) {
          const exp = this.recorrer(NH);
          lista.push(exp);
        }
      });
      return lista;
    }
    if (this.Create_Nodo('DEC_ID', nodo)) {
      return { id: nodo.hijos[0] };
    }
    if (this.Create_Nodo('DEC_ID_EXP', nodo)) {
      const id = nodo.hijos[0] as string;
      const exp = this.recorrer(nodo.hijos[2]) as Object;
      return { id, exp };
    }
    if (this.Create_Nodo('CASTEO', nodo)) {
      const id = nodo.hijos[0] as string;
      const tip = this.recorrer(nodo.hijos[3]) as Object;
      const exp = this.recorrer(nodo.hijos[5]) as Object;
      return { id,tip,exp };
    }

      if (this.Create_Nodo('TOLOWER_OR_TOUPPER_OR_ROUND', nodo)) {
        const id = nodo.hijos[0] as string;
        const exp = this.recorrer(nodo.hijos[5]) as Object;
        return {id,exp};
      }
      if (this.Create_Nodo('NATIVAS', nodo)) {
        const id = nodo.hijos[0] as string;
        const exp = this.recorrer(nodo.hijos[5]) as Object;
        return {id,exp};
      }

      if (this.Create_Nodo('ASIGNACION_ARREGLOS', nodo)) {
        const id = nodo.hijos[0] as string;
        const exp = this.recorrer(nodo.hijos[3]) as Object;
        return {id,exp};
      }

      if (this.Create_Nodo('ARREGLO_TIPO', nodo)) {
        const id = nodo.hijos[0] as string;
        switch (nodo.hijos.length) {
          case 5:{
            const id2 = nodo.hijos[3] as string;
            const exp = this.recorrer(nodo.hijos[4]) as Object;
            return {id,id2,exp};
          }  
          case 4:{
            const lista = this.recorrer(nodo.hijos[3]) as Array<Instruccion>;
            return {id,lista};
          }
          case 3:{
            const id2 = nodo.hijos[5] as string;
            const exp = this.recorrer(nodo.hijos[6]) as Object;
            const exp2 = this.recorrer(nodo.hijos[7]) as Object;
            return {id2,exp,exp2};
          }
          case 2:{
            const lista = this.recorrer(nodo.hijos[5]) as Array<Instruccion>;
            return {id,lista};
          }
        }
       
      }

      if (this.Create_Nodo('NEW_ARREGLO', nodo)) {
        const exp = this.recorrer(nodo.hijos[1]) as Object;
        return {exp};
      }
      if (this.Create_Nodo('PRIMERO_ARRAY', nodo)) {
        switch (nodo.hijos.length) {
          case 5:{
            const id2 = nodo.hijos[2] as string;
            const exp = this.recorrer(nodo.hijos[3]) as Object;
            return {id2,exp};

          }
          case 6:{
            const exp = this.recorrer(nodo.hijos[0]) as Object;
            return {exp};
          }
        }
        
      }
      
    // acesso vector
    if (this.Create_Nodo('ACCESSO_VECTOR', nodo)) {
      const id = nodo.hijos[0] as string;
      switch (nodo.hijos.length) {
        case 5:{
          const exp = this.recorrer(nodo.hijos[4]) as Object;
          return {id,exp};
        }  
        case 4:{
          const exp2 = this.recorrer(nodo.hijos[4]) as Object;
          const exp3 = this.recorrer(nodo.hijos[5]) as Object;
          return {id,exp2,exp3};
        }
      }
    }
    
    // Pre-modificacion
    if (this.Create_Nodo('ASG_VECTOR', nodo)) {
      switch (nodo.hijos.length) {
        case 5:{
          const exp = this.recorrer(nodo.hijos[1]) as Object;
          return {exp};
        }  
        case 4:{
          const exp2 = this.recorrer(nodo.hijos[1]) as Object;
          const exp3 = this.recorrer(nodo.hijos[2]) as Object;
          return {exp2,exp3};
        }
      }
    }
    // MODICIAR VECTOR
    if (this.Create_Nodo('MODIFICAR_VECTOR', nodo)) {
          const exp = this.recorrer(nodo.hijos[0]) as Object;
          const exp2 = this.recorrer(nodo.hijos[2]) as Object;
          return {exp,exp2};      
    }

    //TIPO_DEC_VARIABLE
    if (this.Create_Nodo('TIPO_DEC_VARIABLE', nodo)) {
      //let || const
      return nodo.hijos[0] == 'let';
    }

    if (this.Create_Nodo('EXP', nodo)) {
      switch (nodo.hijos.length) {
        case 1:
          {
            const exp = this.recorrer(nodo.hijos[0]);;
            if (typeof exp == 'string') return new Id(nodo.linea, exp.toString());
            if (exp instanceof Object) return exp;
          }
        case 2:
          if (nodo.hijos[0] == '-' && this.Create_Nodo('EXP', nodo.hijos[1])) {
            const expIzq = new Nativo(nodo.linea, -1);
            const expDer = this.recorrer(nodo.hijos[1]);
            return new Multiplicacion(nodo.linea, expIzq, expDer);
          }
          if (nodo.hijos[0] == '[' && nodo.hijos[1] == ']') {
            return new Arreglo(nodo.linea);
          }
          if (nodo.hijos[1] == '++') {
            const id = nodo.hijos[0];
            return new MasMas(nodo.linea, id);
          }
          if (nodo.hijos[1] == '--') {
            const id = nodo.hijos[0];
            return new MenosMenos(nodo.linea, id);
          }
          if (nodo.hijos[0] == '!' && this.Create_Nodo('EXP', nodo.hijos[1])) {
            const exp = this.recorrer(nodo.hijos[1]);
            return new Not(nodo.linea, exp);
          }
        case 3:
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Suma(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '-' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Resta(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '*' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Multiplicacion(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '/' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Division(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '%' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Modular(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '**' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Potencia(linea, expIzq, expDer);
          }
          if (nodo.hijos[0] == '(' && this.Create_Nodo('EXP', nodo.hijos[1]) && nodo.hijos[2] == ')') {
            return this.recorrer(nodo.hijos[1]);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Mayor(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Menor(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>=' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new MayorIgual(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<=' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new MenorIgual(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '==' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Igual(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '!=' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Diferente(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '&&' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new And(linea, expIzq, expDer);
          }
          if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '||' && this.Create_Nodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Or(linea, expIzq, expDer);
          }
          if (nodo.hijos[0] == '[' && this.Create_Nodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == ']') {
            const lista_expresiones = this.recorrer(nodo.hijos[1]);
            return new Arreglo(nodo.linea, lista_expresiones);
          }
          if (nodo.hijos[0] == '{' && this.Create_Nodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == '}') {
            const lista_expresiones = this.recorrer(nodo.hijos[1]);
            return new Arreglo(nodo.linea, lista_expresiones);
          }
      }
    }

    if (this.Create_Nodo('NUMBER', nodo)) {
      const str_num = nodo.hijos[0];
      return new Nativo(nodo.linea, Number(str_num));
    }

    if (this.Create_Nodo('STRING', nodo)) {
      const str = nodo.hijos[0] as string;
      const str2 = str.substr(1, str.length - 2);
      return new Nativo(nodo.linea, str2);
    }

    if (this.Create_Nodo('BOOLEAN', nodo)) {
      if (nodo.hijos[0] == 'true') {
        return new Nativo(nodo.linea, true);
      }
      return new Nativo(nodo.linea, false);
    }
    if (this.Create_Nodo('ID', nodo)) {
      return nodo.hijos[0];
    }
    if (this.Create_Nodo('PRINT', nodo)) {
    
      const lista = this.recorrer(nodo.hijos[2]) as Array<Instruccion>;
      return new Log(nodo.linea, lista);
    }
    if (this.Create_Nodo('PRINTLN', nodo)) {
     
      const lista = this.recorrer(nodo.hijos[2]) as Array<Instruccion>;
      return new Log(nodo.linea, lista);
    }

    if (this.Create_Nodo('TIPO_IGUAL', nodo)) {
      switch (nodo.hijos.length) {
        case 1:
          return '=';
        case 2:
          if (nodo.hijos[0] == '+') return '+=';
          if (nodo.hijos[0] == '-') return '-=';
      }
    }

    if (this.Create_Nodo('ASIGNACION', nodo)) {

      switch (nodo.hijos.length) {
        case 4: {
          if (typeof nodo.hijos[0] == 'string') {
            const id = nodo.hijos[0];
            const tipo_igual = this.recorrer(nodo.hijos[1]);
            const exp = this.recorrer(nodo.hijos[2]);
            return new Asignacion(nodo.linea, id, tipo_igual, exp);
          }
        }
      }
    }
    if (this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', nodo)) {
      switch (nodo.hijos.length) {
        case 9: {
          const id = nodo.hijos[0];
          const tipo_variable_nativa = this.recorrer(nodo.hijos[4]);
          const tipo_return = tipo_variable_nativa.tipo;
          const instrucciones = this.recorrer(nodo.hijos[6]);
          return new DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return);
        }
        case 10: {
           if(this.Create_Nodo('LISTA_PARAMETROS', nodo.hijos[2])){
            const id = nodo.hijos[0];
            const lista_parametros = this.recorrer(nodo.hijos[2]);
            const tipo_variable_nativa = this.recorrer(nodo.hijos[5]);
            const tipo_return = tipo_variable_nativa.tipo;
            const instrucciones = this.recorrer(nodo.hijos[7]);
            return new DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return, lista_parametros);
          }
        }
      }
    }

    if (this.Create_Nodo('LLAMADA_FUNCION', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        case 4:
          return new LlamadaFuncion(nodo.linea, id);
        case 5:
          const lista_expresiones = this.recorrer(nodo.hijos[2]);
          return new LlamadaFuncion(nodo.linea, id, lista_expresiones);
      }
    }

    if (this.Create_Nodo('RUN', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        case 3:
          return new LlamadaFuncion(nodo.linea, id);
        case 4:
          const lista_expresiones = this.recorrer(nodo.hijos[3]);
          return new LlamadaFuncion(nodo.linea, id, lista_expresiones);
      }
    }

    if (this.Create_Nodo('LLAMADA_FUNCION_EXP', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        case 3:
          return new LlamadaFuncion(nodo.linea, id);
        case 4:
          const lista_expresiones = this.recorrer(nodo.hijos[2]);
          return new LlamadaFuncion(nodo.linea, id, lista_expresiones);
      }
    }

    if (this.Create_Nodo('RETURN', nodo)) {
      switch (nodo.hijos.length) {
        case 3:
          const exp = this.recorrer(nodo.hijos[1]);
          return new Return(nodo.linea, true, exp);
        case 2:
          return new Return(nodo.linea, false);
      }
    }

    if (this.Create_Nodo('PUSH_OR_POP_ARREGLO ', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        case 7: {
          const exp = this.recorrer(nodo.hijos[4]);
          return new PushArreglo(nodo.linea, id, exp);
        }
      }
    }

    if (this.Create_Nodo('BREAK', nodo)) {
      return new Break(nodo.linea);
    }

    if (this.Create_Nodo('CONTINUE', nodo)) {
      return new Continue(nodo.linea);
    }

    if (this.Create_Nodo('INSTRUCCION_IF', nodo)) {
      switch (nodo.hijos.length) {
        case 1:
          const inst = this.recorrer(nodo.hijos[0]);
          return new InstruccionIf(nodo.linea, [inst]);
        case 2:
          if (this.Create_Nodo('IF', nodo.hijos[0]) && this.Create_Nodo('ELSE', nodo.hijos[1])) {
            const inst_if = this.recorrer(nodo.hijos[0]);
            const inst_else = this.recorrer(nodo.hijos[1]);
            return new InstruccionIf(nodo.linea, [inst_if, inst_else]);
          }
          if (this.Create_Nodo('IF', nodo.hijos[0]) && this.Create_Nodo('LISTA_ELSE_IF', nodo.hijos[1])) {
            const inst_if = this.recorrer(nodo.hijos[0]);
            const lista_ifs = this.recorrer(nodo.hijos[1]);
            return new InstruccionIf(nodo.linea, [inst_if, ...lista_ifs]);
          }
        case 3:
          const inst_if = this.recorrer(nodo.hijos[0]);
          const lista_ifs = this.recorrer(nodo.hijos[1]);
          const inst_else = this.recorrer(nodo.hijos[2]);
          return new InstruccionIf(nodo.linea, [inst_if, ...lista_ifs, inst_else]);
      }
    }


    if (this.Create_Nodo('IF', nodo)) {
      const condicion = this.recorrer(nodo.hijos[2]);
      const instrucciones = this.recorrer(nodo.hijos[5]);
      return new If(condicion, instrucciones);
    }

    if (this.Create_Nodo('ELSE', nodo)) {
      const condicion = new Nativo(nodo.linea, true);
      const instrucciones = this.recorrer(nodo.hijos[2]);
      return new If(condicion, instrucciones);
    }

    if (this.Create_Nodo('ELIF', nodo)) { 
      const condicion = this.recorrer(nodo.hijos[2]);
      const instrucciones = this.recorrer(nodo.hijos[5]);
      return new If(condicion, instrucciones);
    }

    if (this.Create_Nodo('LISTA_ELSE_IF', nodo)) {
      const lista = [];
      nodo.hijos.forEach((NH: any) => {
        const resp = this.recorrer(NH);
        if (resp instanceof If) {
          lista.push(resp);
        }
      });
      return lista;
    }

    if (this.Create_Nodo('WHILE', nodo)) {
      const condicion = this.recorrer(nodo.hijos[2]);
      const instrucciones = this.recorrer(nodo.hijos[5]);
      return new While(nodo.linea, condicion, instrucciones);
    }

  
    if (this.Create_Nodo('DO_WHILE', nodo)) {
      const instrucciones = this.recorrer(nodo.hijos[2]);
      const condicion = this.recorrer(nodo.hijos[6]);
      return new DoWhile(nodo.linea, instrucciones, condicion);
    }
  
    if (this.Create_Nodo('DO_UNTIL', nodo)) {
     
      const instrucciones = this.recorrer(nodo.hijos[2]);
      const condicion = this.recorrer(nodo.hijos[6]);
      return new DoWhile(nodo.linea, instrucciones, condicion);
    }

   
    if (this.Create_Nodo('ASIGNACION_FOR', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        case 3:
          const tipo_igual = this.recorrer(nodo.hijos[1]);
          const exp = this.recorrer(nodo.hijos[2]);
          return new Asignacion(nodo.linea, id, tipo_igual, exp);
        case 2:
          if (nodo.hijos[1] == '++')
            return new MasMas(nodo.linea, id);
          if (nodo.hijos[1] == '--')
            return new MenosMenos(nodo.linea, id);
      }
    }


    if (this.Create_Nodo('FOR', nodo)) {
      const condicion = this.recorrer(nodo.hijos[3]);
      const asignacion_for = this.recorrer(nodo.hijos[5]);
      const instrucciones = this.recorrer(nodo.hijos[8]);
   
      if (this.Create_Nodo('DECLARACION_VARIABLE', nodo.hijos[2])) {
        const lista_instrucciones = this.recorrer(nodo.hijos[2]);
        const declaracion = lista_instrucciones[0];
        return new For(nodo.linea, declaracion, null, condicion, asignacion_for, instrucciones);
      }

      if (this.Create_Nodo('ASIGNACION', nodo.hijos[2])) {
        const asignacion = this.recorrer(nodo.hijos[2]);
        return new For(nodo.linea, null, asignacion, condicion, asignacion_for, instrucciones);
      }
    }

    if (this.Create_Nodo('PARAMETRO', nodo)) {
      const id = nodo.hijos[0] as string;
      return new Variable({ reasignable: true, id});   
      }
  
    if (this.Create_Nodo('LISTA_PARAMETROS', nodo)) {
      const variables = [];
      nodo.hijos.forEach((NH: any) => {
        if (NH instanceof Object) {
          const resp = this.recorrer(NH);
          if (resp instanceof Variable) {
            variables.push(resp);
          }
        }
      });
      return variables;
    }

    if (this.Create_Nodo('TERNARIO', nodo)) {
      const condicion = this.recorrer(nodo.hijos[0]);
      const exp_true = this.recorrer(nodo.hijos[2]);
      const exp_false = this.recorrer(nodo.hijos[4]);
      return new Ternario(nodo.linea, condicion, exp_true, exp_false);
    }

    if (this.Create_Nodo('SWITCH', nodo)) {
      const exp = this.recorrer(nodo.hijos[2]);
      const lista_case = this.recorrer(nodo.hijos[5]);
      return new Switch(nodo.linea, exp, lista_case);
    }

    if (this.Create_Nodo('CASE', nodo)) {
      const exp = this.recorrer(nodo.hijos[1]);
      const instrucciones = this.recorrer(nodo.hijos[3]);
      return new Case(exp, instrucciones);
    }

    if (this.Create_Nodo('DEFAULT', nodo)) {
      const instrucciones = this.recorrer(nodo.hijos[2]);
      return new Case(null, instrucciones, true);
    }
    if (this.Create_Nodo('LISTA_CASE', nodo)) {
      const lista = [];
      nodo.hijos.forEach((NH: any) => {
        if (NH instanceof Object) {
          const resp = this.recorrer(NH);
          if (resp instanceof Case) {
            lista.push(resp);
          }
        }
      });
      return lista;
    }

    if (this.Create_Nodo('INCREMENTO_DECREMENTO', nodo)) {
      const id = nodo.hijos[0];
      const incremento = nodo.hijos[1] == '++';
      return new IncrementoDecremento(nodo.linea, id, incremento);
    }
  }

  puedoEjecutar(nodo: any): boolean {

    if (this.Create_Nodo('INICIO', nodo)) {
      for (let NH of nodo.hijos) {
        const resp = this.puedoEjecutar(NH);
        if (!resp) return false;
      }
    }

    if (this.Create_Nodo('INSTRUCCIONES', nodo)) {
      for (let NH of nodo.hijos) {
        if (this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', NH)) {
          const res = this.puedoEjecutar(NH);
          if (!res) return false;
        }
        if (this.Create_Nodo('DECLARACION_METODO', NH)) {
          const res = this.puedoEjecutar(NH);
          if (!res) return false;
        }
      }
    }

    if (this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', nodo)) {
      for (let NH of nodo.hijos) {
        if (this.Create_Nodo('INSTRUCCIONES', NH)) {
          for (let nodoInst of NH.hijos) {
            if (this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', nodoInst)) {
              return false;
            }
          }
        }
        
      }
    }

    return true;
  }
  Create_Nodo(label: string, nodo: any): boolean {
    if (nodo == null || !(nodo instanceof Object)) {
      return false;
    }
    if (nodo.hasOwnProperty('label') && nodo.label != null) {
      return nodo.label === label;
    }
    return false;
  }
}
