package Analizador;
import java_cup.runtime.*;
import proyect_1.Metodos;



%%
%public
%class Analizador_Lexico
%cupsym Tokens
%cup
%char
%column
%full
%ignorecase
%line
%unicode
%{
   public static boolean is_date = true;
   public static String concatenado = "";
   public static int Count_Lexico = 0;
%}

S = [+/*<>=!-]
letra = [a-zA-z]
Digito = [0-9]
variable = "_"({letra}|{Digito})+"_"
Entero = {Digito}+
Decimal = {Digito}+"."{Digito}+
car_LaN = "'"{letra}+"'" 
car_NaL = "'"("$""{"{Digito}+"}")"'"
boolV = "Verdadero" 
boolF = "Falso"
cadena = (\"[^\"]*\")|(\"[^\"]*\"(\"[^\"]*\")*)
comm =   "//"[^\n]* 
comm2 =  "/*"[^]*"*/"


Valida_CC = ("(")({Entero}|{Decimal}|{S})+(")")
Valida_SC = ({Entero}|{Decimal}|{S})+
Valida_Pot = "["({Entero}|{Decimal}|{S})+"]"
Todo_Valores = ({Valida_SC}|{Valida_CC})+

Interrogacion = ["?""¿"]

Tinteg = {Interrogacion}+

%%


<YYINITIAL>","   { System.out.println(" token:<coma> lexema:"+yytext());
                   return new Symbol(Tokens.coma, yycolumn, yyline, yytext());}

// Tipos de datos operativos


<YYINITIAL>{cadena}     {return new Symbol(Tokens.cadena, yycolumn, yyline, yytext());}
<YYINITIAL>{car_LaN}    {return new Symbol(Tokens.car_LaN, yycolumn, yyline, yytext());}
<YYINITIAL>{car_NaL}    {return new Symbol(Tokens.car_NaL, yycolumn, yyline, yytext());}
<YYINITIAL>{boolV}      {return new Symbol(Tokens.boolV, yycolumn, yyline, yytext());}
<YYINITIAL>{boolF}      {return new Symbol(Tokens.boolF, yycolumn, yyline, yytext());}
<YYINITIAL>{Entero}      {return new Symbol(Tokens.Entero, yycolumn, yyline, yytext());}
<YYINITIAL>{Decimal}      {return new Symbol(Tokens.Decimal, yycolumn, yyline, yytext());}






<YYINITIAL>{comm}      {
                    System.out.println(" token:<comentario> lexema:"+yytext());
                    return new Symbol(Tokens.comentario, yycolumn, yyline, yytext());   }

<YYINITIAL>{comm2}      {
                    System.out.println(" token:<comentario> lexema:"+yytext());
                    return new Symbol(Tokens.comentario, yycolumn, yyline, yytext());   }




// ------------------------------   Operaciones basicas -------------------------------------------
<YYINITIAL>{

    "-"           { return new Symbol(Tokens.trest, yycolumn, yyline, yytext());    }
    "+"           { return new Symbol(Tokens.tsum, yycolumn, yyline, yytext());     }
    "/"           { return new Symbol(Tokens.tdiv, yycolumn, yyline, yytext());     }
    "*"           { return new Symbol(Tokens.tmul, yycolumn, yyline, yytext());     }
    "potencia"    { return new Symbol(Tokens.tpot, yycolumn, yyline, yytext());     }
    "mod"         { return new Symbol(Tokens.tmod, yycolumn, yyline, yytext());     }
    "("           { return new Symbol(Tokens.pareini, yycolumn, yyline, yytext());    }
    ")"           { return new Symbol(Tokens.parefin, yycolumn, yyline, yytext());    }
}

//------------------------------     Operadores Relacionales    ---------------------------------- 

<YYINITIAL>{
    "mayor"             { return new Symbol(Tokens.tmayor,yycolumn,yyline,yytext()); }
    "menor"             { return new Symbol(Tokens.tmenor,yycolumn,yyline,yytext()); }
    "mayor_o_igual"     { return new Symbol(Tokens.tMayigual,yycolumn,yyline,yytext()); } 
    "menor_o_igual"     { return new Symbol(Tokens.tmenigual,yycolumn,yyline,yytext()); }
    "es_igual"          { return new Symbol(Tokens.tigual,yycolumn,yyline,yytext()); }
    "es_difente"        { return new Symbol(Tokens.tdistinto,yycolumn,yyline,yytext()); }
}

//-----------------------------     Operadores Logicos --------------------------------------
<YYINITIAL>{
    "or"        { return new Symbol(Tokens.tor,yycolumn,yyline,yytext());     }  
    "and"       { return new Symbol(Tokens.tand,yycolumn,yyline,yytext());    }
    "not"       { return new Symbol(Tokens.tnot,yycolumn,yyline,yytext());    }
}

//----------------------------------- Sintaxis de Pseudocodigo -----------------------------------------
<YYINITIAL>{
    "inicio"    { return new Symbol(Tokens.tinicio,yycolumn,yyline,yytext()); }
    "fin"       { return new Symbol(Tokens.tfin,yycolumn,yyline,yytext());    }
}

// ---------------------------------------------  Declaracion -----------------------------------------

<YYINITIAL>{
    "ingresar" { System.out.println(" token:<ingreso> lexema:"+yytext());
                 return new Symbol(Tokens.tingreso,yycolumn,yyline,yytext()); }
    "como"     { return new Symbol(Tokens.tcomo,yycolumn,yyline,yytext()); }
    "con_valor" { return new Symbol(Tokens.tconValor,yycolumn,yyline,yytext()); }
    "numero" | "cadena" | "boolean" | "caracter"  { return new Symbol(Tokens.tTipoDato,yycolumn,yyline,yytext()); }
    ";"         { return new Symbol(Tokens.tpuntoComa,yycolumn,yyline,yytext()); }
    "->"        { return new Symbol(Tokens.tasignacion,yycolumn,yyline,yytext()); } 

}

// ------------------------------------- Condicionales ----------------------------------------
<YYINITIAL>{

// condicional Si

    "si"    { return new Symbol(Tokens.tSi,yycolumn,yyline,yytext()); }
    "fin_si" { return new Symbol(Tokens.tfinsi,yycolumn,yyline,yytext()); }
    "entonces" { return new Symbol(Tokens.tentonces,yycolumn,yyline,yytext()); }
    "de_lo_contrario"   { return new Symbol(Tokens.tDLcontrario,yycolumn,yyline,yytext()); }
    "o_si"      { return new Symbol(Tokens.tosi,yycolumn,yyline,yytext()); }


// seleccion Multiple

    "segun"     { return new Symbol(Tokens.tsegun,yycolumn,yyline,yytext()); }
    "hacer"     { return new Symbol(Tokens.thacer,yycolumn,yyline,yytext()); }
    "fin_segun"      { return new Symbol(Tokens.tfinsegun,yycolumn,yyline,yytext()); }

// Ciclo para
    "para"          { return new Symbol(Tokens.tpara,yycolumn,yyline,yytext()); }
    "hasta"         { return new Symbol(Tokens.thasta,yycolumn,yyline,yytext()); }
    "fin_para"      { return new Symbol(Tokens.tFinpara,yycolumn,yyline,yytext()); }
    "incrementar"  { return new Symbol(Tokens.tmasmas,yycolumn,yyline,yytext()); }   
    "con"  { return new Symbol(Tokens.tcon,yycolumn,yyline,yytext()); }    

// Ciclo Mientras

    "mientras"    { return new Symbol(Tokens.tmientras,yycolumn,yyline,yytext()); }
    "fin_mientras"  { return new Symbol(Tokens.tFinMi,yycolumn,yyline,yytext()); }
    "repetir"       { return new Symbol(Tokens.trepit,yycolumn,yyline,yytext()); }
    "hasta_que"     { return new Symbol(Tokens.thastaque,yycolumn,yyline,yytext()); }
    "retornar"      { return new Symbol(Tokens.treturn,yycolumn,yyline,yytext()); }
   
// METODO

    "metodo"    { return new Symbol(Tokens.tmetodo,yycolumn,yyline,yytext()); }
    "fin_metodo"    { return new Symbol(Tokens.tFINMetodo,yycolumn,yyline,yytext()); }
    "con_parametros"    { return new Symbol(Tokens.tconparametros,yycolumn,yyline,yytext()); }
// Funciones

    "funcion"   { return new Symbol(Tokens.tfuncion,yycolumn,yyline,yytext()); }
    "fin_funcion"   { return new Symbol(Tokens.tFinFuncion,yycolumn,yyline,yytext()); }

// llamada de funciones y metodos

    "ejecutar"  { return new Symbol(Tokens.tejecutar,yycolumn,yyline,yytext()); }

// Impresion

    "imprimir"  { return new Symbol(Tokens.timprimir,yycolumn,yyline,yytext()); }
    "imprimir_nl"   { return new Symbol(Tokens.timprimirNL,yycolumn,yyline,yytext()); }

}





<YYINITIAL>{variable}  {
                    System.out.println(" token:<variable> lexema:"+yytext());
                    return new Symbol(Tokens.variable, yycolumn, yyline, yytext()); 
                    }

<YYINITIAL>{Tinteg} {
       return new Symbol(Tokens.Tinteg,yycolumn,yyline,yytext()); 
}


<YYINITIAL>{Valida_Pot}  { return new Symbol(Tokens.Valida_Pot, yycolumn, yyline, yytext()); }
<YYINITIAL>{Valida_SC}  { return new Symbol(Tokens.Valida_SC, yycolumn, yyline, yytext()); }
<YYINITIAL>{Valida_CC}  { return new Symbol(Tokens.Valida_CC, yycolumn, yyline, yytext()); }
<YYINITIAL>{Todo_Valores}  { return new Symbol(Tokens.Todo_Valores, yycolumn, yyline, yytext()); }


[ \t\r\n\f]         {}

.      {
         Count_Lexico += 1;
         String cadena = "<tr>"+"\n"+"<td>"+"Error_Lexico"+"</td>"+"<td>"+yytext()+"</td>"+"<td>"+(yyline + 1)+"</td>"+"<td>"+(yycolumn + 1)+"</td>"+"\n"+"</tr>"+"\n";
         concatenado += cadena;
}



