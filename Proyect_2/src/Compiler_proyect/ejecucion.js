"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ejecucion = void 0;
const salida_1 = require("../arbol/salida");
const id_1 = require("./expresiones/id");
const nativo_1 = require("./expresiones/nativo");
const log_1 = require("./instrucciones/log");
const suma_1 = require("./expresiones/aritmeticas/suma");
const asignacion_1 = require("./instrucciones/asignaciones/asignacion");
const arreglo_1 = require("./expresiones/arreglo");
const declaracion_funcion_1 = require("./instrucciones/declaraciones/declaracion_funcion");
const llamada_funcion_1 = require("./expresiones/llamada_funcion");
const return_1 = require("./expresiones/flujo/return");
const resta_1 = require("./expresiones/aritmeticas/resta");
const multiplicacion_1 = require("./expresiones/aritmeticas/multiplicacion");
const division_1 = require("./expresiones/aritmeticas/division");
const modular_1 = require("./expresiones/aritmeticas/modular");
const potencia_1 = require("./expresiones/aritmeticas/potencia");
const mayor_1 = require("./expresiones/relacionales/mayor");
const menor_1 = require("./expresiones/relacionales/menor");
const mayor_igual_1 = require("./expresiones/relacionales/mayor_igual");
const menor_igual_1 = require("./expresiones/relacionales/menor_igual");
const igual_1 = require("./expresiones/relacionales/igual");
const diferente_1 = require("./expresiones/relacionales/diferente");
const And_1 = require("./expresiones/logicas/And");
const Or_1 = require("./expresiones/logicas/Or");
const Not_1 = require("./expresiones/logicas/Not");
const push_arreglo_1 = require("./instrucciones/push/push_arreglo");
const break_1 = require("./expresiones/flujo/break");
const continue_1 = require("./expresiones/flujo/continue");
const if_1 = require("./if");
const instruccion_if_1 = require("./expresiones/condicionales/instruccion_if");
const while_1 = require("./instrucciones/ciclos/while");
const do_while_1 = require("./instrucciones/ciclos/do_while");
const for_1 = require("./instrucciones/ciclos/for");
const mas_mas_1 = require("./expresiones/aritmeticas/mas_mas");
const menos_menos_1 = require("./expresiones/aritmeticas/menos_menos");
const variable_1 = require("./variable");
const ternario_1 = require("./expresiones/condicionales/ternario");
const case_1 = require("./case");
const switch_1 = require("./expresiones/condicionales/switch");
const incremento_decremento_1 = require("./instrucciones/incremento_decremento");
class Ejecucion {
    constructor(cima) {
        Object.assign(this, { cima, is_count: 0, graficando: '' });
    }
    Graficar_AST() {
        this.is_count = 0;
        this.graficando = "digraph G {\n";
        this.graficando += `overlap=false  label="by Kemel Ruano" fontsize=75;`;
        if (this.cima != null) {
            this.Crear_NODO(this.cima);
        }
        this.graficando += "\n}";
        return this.graficando;
    }
    Crear_NODO(nodo) {
        if (nodo instanceof Object) {
            let count_dad = this.is_count;
            this.graficando += `node${count_dad}[label="${this.Validar_string(nodo.label)}" shape = "box"];\n`;
            if (nodo.hasOwnProperty("hijos")) {
                nodo.hijos.forEach((NH) => {
                    let idHijo = ++this.is_count;
                    this.graficando += `node${count_dad} -> node${idHijo};\n`;
                    if (NH instanceof Object) {
                        this.Crear_NODO(NH);
                    }
                    else {
                        this.graficando += `node${idHijo}[label="${this.Validar_string(NH)}" shape = "doublecircle"];`;
                    }
                });
            }
        }
    }
    Validar_string(label) {
        if (label.startsWith("\"") || label.startsWith("'") || label.startsWith("`")) {
            return label.substr(1, label.length - 2);
        }
        return label;
    }
    ejecutar() {
        const instrucciones = this.recorrer(this.cima);
        if (instrucciones instanceof Array) {
            salida_1.Salida.getInstance().clear();
        }
    }
    getSalida() {
        return salida_1.Salida.getInstance().lista;
    }
    recorrer(nodo) {
        if (this.Create_Nodo('INICIO', nodo)) {
            return this.recorrer(nodo.hijos[0]);
        }
        if (this.Create_Nodo('INSTRUCCIONES', nodo)) {
            let instrucciones = [];
            nodo.hijos.forEach((NH) => {
                if (this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', NH) || this.Create_Nodo('DECLARACION_METODO', NH)) {
                    const inst = this.recorrer(NH);
                    if (inst instanceof Array) {
                        instrucciones = instrucciones.concat(inst);
                    }
                    else {
                        instrucciones.push(inst);
                    }
                }
            });
            nodo.hijos.forEach((NH) => {
                if (!this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', NH) && !this.Create_Nodo('DECLARACION_METODO', NH)) {
                    const inst = this.recorrer(NH);
                    if (inst instanceof Array) {
                        instrucciones = instrucciones.concat(inst);
                    }
                    else {
                        instrucciones.push(inst);
                    }
                }
            });
            return instrucciones;
        }
        if (this.Create_Nodo('DECLARACION_VARIABLE', nodo)) {
            const reasignable = this.recorrer(nodo.hijos[0]);
            const lista_declaraciones = this.recorrer(nodo.hijos[1]);
            return { reasignable, lista_declaraciones };
        }
        if (this.Create_Nodo('LISTA_DECLARACIONES', nodo)) {
            const lista_declaraciones = [];
            nodo.hijos.forEach((NH) => {
                lista_declaraciones.push(this.recorrer(NH));
            });
            return lista_declaraciones;
        }
        if (this.Create_Nodo('LISTA_EXPRESIONES', nodo)) {
            const lista = [];
            nodo.hijos.forEach((NH) => {
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
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[2]);
            return { id, exp };
        }
        if (this.Create_Nodo('CASTEO', nodo)) {
            const id = nodo.hijos[0];
            const tip = this.recorrer(nodo.hijos[3]);
            const exp = this.recorrer(nodo.hijos[5]);
            return { id, tip, exp };
        }
        if (this.Create_Nodo('TOLOWER_OR_TOUPPER_OR_ROUND', nodo)) {
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[5]);
            return { id, exp };
        }
        if (this.Create_Nodo('NATIVAS', nodo)) {
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[5]);
            return { id, exp };
        }
        if (this.Create_Nodo('ASIGNACION_ARREGLOS', nodo)) {
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[3]);
            return { id, exp };
        }
        if (this.Create_Nodo('ARREGLO_TIPO', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                case 5: {
                    const id2 = nodo.hijos[3];
                    const exp = this.recorrer(nodo.hijos[4]);
                    return { id, id2, exp };
                }
                case 4: {
                    const lista = this.recorrer(nodo.hijos[3]);
                    return { id, lista };
                }
                case 3: {
                    const id2 = nodo.hijos[5];
                    const exp = this.recorrer(nodo.hijos[6]);
                    const exp2 = this.recorrer(nodo.hijos[7]);
                    return { id2, exp, exp2 };
                }
                case 2: {
                    const lista = this.recorrer(nodo.hijos[5]);
                    return { id, lista };
                }
            }
        }
        if (this.Create_Nodo('NEW_ARREGLO', nodo)) {
            const exp = this.recorrer(nodo.hijos[1]);
            return { exp };
        }
        if (this.Create_Nodo('PRIMERO_ARRAY', nodo)) {
            switch (nodo.hijos.length) {
                case 5: {
                    const id2 = nodo.hijos[2];
                    const exp = this.recorrer(nodo.hijos[3]);
                    return { id2, exp };
                }
                case 6: {
                    const exp = this.recorrer(nodo.hijos[0]);
                    return { exp };
                }
            }
        }
        // acesso vector
        if (this.Create_Nodo('ACCESSO_VECTOR', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                case 5: {
                    const exp = this.recorrer(nodo.hijos[4]);
                    return { id, exp };
                }
                case 4: {
                    const exp2 = this.recorrer(nodo.hijos[4]);
                    const exp3 = this.recorrer(nodo.hijos[5]);
                    return { id, exp2, exp3 };
                }
            }
        }
        // Pre-modificacion
        if (this.Create_Nodo('ASG_VECTOR', nodo)) {
            switch (nodo.hijos.length) {
                case 5: {
                    const exp = this.recorrer(nodo.hijos[1]);
                    return { exp };
                }
                case 4: {
                    const exp2 = this.recorrer(nodo.hijos[1]);
                    const exp3 = this.recorrer(nodo.hijos[2]);
                    return { exp2, exp3 };
                }
            }
        }
        // MODICIAR VECTOR
        if (this.Create_Nodo('MODIFICAR_VECTOR', nodo)) {
            const exp = this.recorrer(nodo.hijos[0]);
            const exp2 = this.recorrer(nodo.hijos[2]);
            return { exp, exp2 };
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
                        const exp = this.recorrer(nodo.hijos[0]);
                        ;
                        if (typeof exp == 'string')
                            return new id_1.Id(nodo.linea, exp.toString());
                        if (exp instanceof Object)
                            return exp;
                    }
                case 2:
                    if (nodo.hijos[0] == '-' && this.Create_Nodo('EXP', nodo.hijos[1])) {
                        const expIzq = new nativo_1.Nativo(nodo.linea, -1);
                        const expDer = this.recorrer(nodo.hijos[1]);
                        return new multiplicacion_1.Multiplicacion(nodo.linea, expIzq, expDer);
                    }
                    if (nodo.hijos[0] == '[' && nodo.hijos[1] == ']') {
                        return new arreglo_1.Arreglo(nodo.linea);
                    }
                    if (nodo.hijos[1] == '++') {
                        const id = nodo.hijos[0];
                        return new mas_mas_1.MasMas(nodo.linea, id);
                    }
                    if (nodo.hijos[1] == '--') {
                        const id = nodo.hijos[0];
                        return new menos_menos_1.MenosMenos(nodo.linea, id);
                    }
                    if (nodo.hijos[0] == '!' && this.Create_Nodo('EXP', nodo.hijos[1])) {
                        const exp = this.recorrer(nodo.hijos[1]);
                        return new Not_1.Not(nodo.linea, exp);
                    }
                case 3:
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new suma_1.Suma(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '-' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new resta_1.Resta(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '*' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new multiplicacion_1.Multiplicacion(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '/' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new division_1.Division(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '%' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new modular_1.Modular(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '**' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new potencia_1.Potencia(linea, expIzq, expDer);
                    }
                    if (nodo.hijos[0] == '(' && this.Create_Nodo('EXP', nodo.hijos[1]) && nodo.hijos[2] == ')') {
                        return this.recorrer(nodo.hijos[1]);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new mayor_1.Mayor(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new menor_1.Menor(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>=' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new mayor_igual_1.MayorIgual(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<=' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new menor_igual_1.MenorIgual(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '==' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new igual_1.Igual(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '!=' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new diferente_1.Diferente(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '&&' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new And_1.And(linea, expIzq, expDer);
                    }
                    if (this.Create_Nodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '||' && this.Create_Nodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new Or_1.Or(linea, expIzq, expDer);
                    }
                    if (nodo.hijos[0] == '[' && this.Create_Nodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == ']') {
                        const lista_expresiones = this.recorrer(nodo.hijos[1]);
                        return new arreglo_1.Arreglo(nodo.linea, lista_expresiones);
                    }
                    if (nodo.hijos[0] == '{' && this.Create_Nodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == '}') {
                        const lista_expresiones = this.recorrer(nodo.hijos[1]);
                        return new arreglo_1.Arreglo(nodo.linea, lista_expresiones);
                    }
            }
        }
        if (this.Create_Nodo('NUMBER', nodo)) {
            const str_num = nodo.hijos[0];
            return new nativo_1.Nativo(nodo.linea, Number(str_num));
        }
        if (this.Create_Nodo('STRING', nodo)) {
            const str = nodo.hijos[0];
            const str2 = str.substr(1, str.length - 2);
            return new nativo_1.Nativo(nodo.linea, str2);
        }
        if (this.Create_Nodo('BOOLEAN', nodo)) {
            if (nodo.hijos[0] == 'true') {
                return new nativo_1.Nativo(nodo.linea, true);
            }
            return new nativo_1.Nativo(nodo.linea, false);
        }
        if (this.Create_Nodo('ID', nodo)) {
            return nodo.hijos[0];
        }
        if (this.Create_Nodo('PRINT', nodo)) {
            const lista = this.recorrer(nodo.hijos[2]);
            return new log_1.Log(nodo.linea, lista);
        }
        if (this.Create_Nodo('PRINTLN', nodo)) {
            const lista = this.recorrer(nodo.hijos[2]);
            return new log_1.Log(nodo.linea, lista);
        }
        if (this.Create_Nodo('TIPO_IGUAL', nodo)) {
            switch (nodo.hijos.length) {
                case 1:
                    return '=';
                case 2:
                    if (nodo.hijos[0] == '+')
                        return '+=';
                    if (nodo.hijos[0] == '-')
                        return '-=';
            }
        }
        if (this.Create_Nodo('ASIGNACION', nodo)) {
            switch (nodo.hijos.length) {
                case 4: {
                    if (typeof nodo.hijos[0] == 'string') {
                        const id = nodo.hijos[0];
                        const tipo_igual = this.recorrer(nodo.hijos[1]);
                        const exp = this.recorrer(nodo.hijos[2]);
                        return new asignacion_1.Asignacion(nodo.linea, id, tipo_igual, exp);
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
                    return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return);
                }
                case 10: {
                    if (this.Create_Nodo('LISTA_PARAMETROS', nodo.hijos[2])) {
                        const id = nodo.hijos[0];
                        const lista_parametros = this.recorrer(nodo.hijos[2]);
                        const tipo_variable_nativa = this.recorrer(nodo.hijos[5]);
                        const tipo_return = tipo_variable_nativa.tipo;
                        const instrucciones = this.recorrer(nodo.hijos[7]);
                        return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return, lista_parametros);
                    }
                }
            }
        }
        if (this.Create_Nodo('LLAMADA_FUNCION', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                case 4:
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id);
                case 5:
                    const lista_expresiones = this.recorrer(nodo.hijos[2]);
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id, lista_expresiones);
            }
        }
        if (this.Create_Nodo('RUN', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                case 3:
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id);
                case 4:
                    const lista_expresiones = this.recorrer(nodo.hijos[3]);
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id, lista_expresiones);
            }
        }
        if (this.Create_Nodo('LLAMADA_FUNCION_EXP', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                case 3:
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id);
                case 4:
                    const lista_expresiones = this.recorrer(nodo.hijos[2]);
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id, lista_expresiones);
            }
        }
        if (this.Create_Nodo('RETURN', nodo)) {
            switch (nodo.hijos.length) {
                case 3:
                    const exp = this.recorrer(nodo.hijos[1]);
                    return new return_1.Return(nodo.linea, true, exp);
                case 2:
                    return new return_1.Return(nodo.linea, false);
            }
        }
        if (this.Create_Nodo('PUSH_OR_POP_ARREGLO ', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                case 7: {
                    const exp = this.recorrer(nodo.hijos[4]);
                    return new push_arreglo_1.PushArreglo(nodo.linea, id, exp);
                }
            }
        }
        if (this.Create_Nodo('BREAK', nodo)) {
            return new break_1.Break(nodo.linea);
        }
        if (this.Create_Nodo('CONTINUE', nodo)) {
            return new continue_1.Continue(nodo.linea);
        }
        if (this.Create_Nodo('INSTRUCCION_IF', nodo)) {
            switch (nodo.hijos.length) {
                case 1:
                    const inst = this.recorrer(nodo.hijos[0]);
                    return new instruccion_if_1.InstruccionIf(nodo.linea, [inst]);
                case 2:
                    if (this.Create_Nodo('IF', nodo.hijos[0]) && this.Create_Nodo('ELSE', nodo.hijos[1])) {
                        const inst_if = this.recorrer(nodo.hijos[0]);
                        const inst_else = this.recorrer(nodo.hijos[1]);
                        return new instruccion_if_1.InstruccionIf(nodo.linea, [inst_if, inst_else]);
                    }
                    if (this.Create_Nodo('IF', nodo.hijos[0]) && this.Create_Nodo('LISTA_ELSE_IF', nodo.hijos[1])) {
                        const inst_if = this.recorrer(nodo.hijos[0]);
                        const lista_ifs = this.recorrer(nodo.hijos[1]);
                        return new instruccion_if_1.InstruccionIf(nodo.linea, [inst_if, ...lista_ifs]);
                    }
                case 3:
                    const inst_if = this.recorrer(nodo.hijos[0]);
                    const lista_ifs = this.recorrer(nodo.hijos[1]);
                    const inst_else = this.recorrer(nodo.hijos[2]);
                    return new instruccion_if_1.InstruccionIf(nodo.linea, [inst_if, ...lista_ifs, inst_else]);
            }
        }
        if (this.Create_Nodo('IF', nodo)) {
            const condicion = this.recorrer(nodo.hijos[2]);
            const instrucciones = this.recorrer(nodo.hijos[5]);
            return new if_1.If(condicion, instrucciones);
        }
        if (this.Create_Nodo('ELSE', nodo)) {
            const condicion = new nativo_1.Nativo(nodo.linea, true);
            const instrucciones = this.recorrer(nodo.hijos[2]);
            return new if_1.If(condicion, instrucciones);
        }
        if (this.Create_Nodo('ELIF', nodo)) {
            const condicion = this.recorrer(nodo.hijos[2]);
            const instrucciones = this.recorrer(nodo.hijos[5]);
            return new if_1.If(condicion, instrucciones);
        }
        if (this.Create_Nodo('LISTA_ELSE_IF', nodo)) {
            const lista = [];
            nodo.hijos.forEach((NH) => {
                const resp = this.recorrer(NH);
                if (resp instanceof if_1.If) {
                    lista.push(resp);
                }
            });
            return lista;
        }
        if (this.Create_Nodo('WHILE', nodo)) {
            const condicion = this.recorrer(nodo.hijos[2]);
            const instrucciones = this.recorrer(nodo.hijos[5]);
            return new while_1.While(nodo.linea, condicion, instrucciones);
        }
        if (this.Create_Nodo('DO_WHILE', nodo)) {
            const instrucciones = this.recorrer(nodo.hijos[2]);
            const condicion = this.recorrer(nodo.hijos[6]);
            return new do_while_1.DoWhile(nodo.linea, instrucciones, condicion);
        }
        if (this.Create_Nodo('DO_UNTIL', nodo)) {
            const instrucciones = this.recorrer(nodo.hijos[2]);
            const condicion = this.recorrer(nodo.hijos[6]);
            return new do_while_1.DoWhile(nodo.linea, instrucciones, condicion);
        }
        if (this.Create_Nodo('ASIGNACION_FOR', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                case 3:
                    const tipo_igual = this.recorrer(nodo.hijos[1]);
                    const exp = this.recorrer(nodo.hijos[2]);
                    return new asignacion_1.Asignacion(nodo.linea, id, tipo_igual, exp);
                case 2:
                    if (nodo.hijos[1] == '++')
                        return new mas_mas_1.MasMas(nodo.linea, id);
                    if (nodo.hijos[1] == '--')
                        return new menos_menos_1.MenosMenos(nodo.linea, id);
            }
        }
        if (this.Create_Nodo('FOR', nodo)) {
            const condicion = this.recorrer(nodo.hijos[3]);
            const asignacion_for = this.recorrer(nodo.hijos[5]);
            const instrucciones = this.recorrer(nodo.hijos[8]);
            if (this.Create_Nodo('DECLARACION_VARIABLE', nodo.hijos[2])) {
                const lista_instrucciones = this.recorrer(nodo.hijos[2]);
                const declaracion = lista_instrucciones[0];
                return new for_1.For(nodo.linea, declaracion, null, condicion, asignacion_for, instrucciones);
            }
            if (this.Create_Nodo('ASIGNACION', nodo.hijos[2])) {
                const asignacion = this.recorrer(nodo.hijos[2]);
                return new for_1.For(nodo.linea, null, asignacion, condicion, asignacion_for, instrucciones);
            }
        }
        if (this.Create_Nodo('PARAMETRO', nodo)) {
            const id = nodo.hijos[0];
            return new variable_1.Variable({ reasignable: true, id });
        }
        if (this.Create_Nodo('LISTA_PARAMETROS', nodo)) {
            const variables = [];
            nodo.hijos.forEach((NH) => {
                if (NH instanceof Object) {
                    const resp = this.recorrer(NH);
                    if (resp instanceof variable_1.Variable) {
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
            return new ternario_1.Ternario(nodo.linea, condicion, exp_true, exp_false);
        }
        if (this.Create_Nodo('SWITCH', nodo)) {
            const exp = this.recorrer(nodo.hijos[2]);
            const lista_case = this.recorrer(nodo.hijos[5]);
            return new switch_1.Switch(nodo.linea, exp, lista_case);
        }
        if (this.Create_Nodo('CASE', nodo)) {
            const exp = this.recorrer(nodo.hijos[1]);
            const instrucciones = this.recorrer(nodo.hijos[3]);
            return new case_1.Case(exp, instrucciones);
        }
        if (this.Create_Nodo('DEFAULT', nodo)) {
            const instrucciones = this.recorrer(nodo.hijos[2]);
            return new case_1.Case(null, instrucciones, true);
        }
        if (this.Create_Nodo('LISTA_CASE', nodo)) {
            const lista = [];
            nodo.hijos.forEach((NH) => {
                if (NH instanceof Object) {
                    const resp = this.recorrer(NH);
                    if (resp instanceof case_1.Case) {
                        lista.push(resp);
                    }
                }
            });
            return lista;
        }
        if (this.Create_Nodo('INCREMENTO_DECREMENTO', nodo)) {
            const id = nodo.hijos[0];
            const incremento = nodo.hijos[1] == '++';
            return new incremento_decremento_1.IncrementoDecremento(nodo.linea, id, incremento);
        }
    }
    puedoEjecutar(nodo) {
        if (this.Create_Nodo('INICIO', nodo)) {
            for (let NH of nodo.hijos) {
                const resp = this.puedoEjecutar(NH);
                if (!resp)
                    return false;
            }
        }
        if (this.Create_Nodo('INSTRUCCIONES', nodo)) {
            for (let NH of nodo.hijos) {
                if (this.Create_Nodo('DECLARACION_FUNCION_OR_METODO', NH)) {
                    const res = this.puedoEjecutar(NH);
                    if (!res)
                        return false;
                }
                if (this.Create_Nodo('DECLARACION_METODO', NH)) {
                    const res = this.puedoEjecutar(NH);
                    if (!res)
                        return false;
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
    Create_Nodo(label, nodo) {
        if (nodo == null || !(nodo instanceof Object)) {
            return false;
        }
        if (nodo.hasOwnProperty('label') && nodo.label != null) {
            return nodo.label === label;
        }
        return false;
    }
}
exports.Ejecucion = Ejecucion;
