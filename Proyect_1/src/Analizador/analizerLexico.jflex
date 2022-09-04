package Analizador;
import java_cup.runtime.*;
%%
%public
%class Analizador_Lexico
%cupsym Simbolos
%cup
%char
%column
%full
%ignorecase
%line
%unicode


letra = [a-zA-z]
Digito = [0-9]
bool = [Verdadero]
id = {letra}+
numero = {Digito}+|{Digito}+"."{Digito}+
caracter = "'"({letra}+|"$""{"{Digito}+"}")"'" 
cadena = (\"[^\"]*\")|(\"[^\"]*\"(\"[^\"]*\")*)
boolean = 






%%

<YYINITIAL>","   {
                    //codigo en java
                    System.out.println(" token:<coma> lexema:"+yytext());
                    return new Symbol(Simbolos.coma, yycolumn, yyline, yytext());
                  }

<YYINITIAL>"inicio"   {
                    //codigo en java
                    System.out.println("Reconocio palabra_reservada, lexema:"+yytext());
                    return new Symbol(Simbolos.prInicio, yycolumn, yyline, yytext());
                  }

<YYINITIAL>"fin"   {
                    //codigo en java
                    System.out.println(" palabra_reservada, lexema:"+yytext());
                    return new Symbol(Simbolos.prFin, yycolumn, yyline, yytext());
                  }

<YYINITIAL>{id}  {
                    System.out.println(" token:<id> lexema:"+yytext());
                    return new Symbol(Simbolos.id, yycolumn, yyline, yytext()); 
                    }


<YYINITIAL>{numero}  {
                    System.out.println("Reservado_token:<numero> lexema:"+yytext());
                    return new Symbol(Simbolos.numero, yycolumn, yyline, yytext()); 
                    }

<YYINITIAL>{caracter}  {
                    System.out.println(" token:<caracter> lexema:"+yytext());
                    return new Symbol(Simbolos.caracter, yycolumn, yyline, yytext()); 
                    }

<YYINITIAL>{cadena}  {
                    System.out.println(" token:<cadena> lexema:"+yytext());
                    return new Symbol(Simbolos.cadena, yycolumn, yyline, yytext()); 
                    }




[ \t\r\n\f]         {  /*este es un comentario en java, omitirlos*/ }


.                   {
                        System.out.println("Error Lexico : "+yytext()+
"Linea"+yyline+" Columna "+yycolumn);    

}

