%lex

%options case-insensitive

%%

\s+											                
"//".*										              
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			

//Retornan expresiones regulares
'string_regex' return 'string_regex';
'numero_regex' return 'numero_regex';
'char_regex' return 'char_regex';
//Varibales reservadas
'int' return 'int';
'double'  return 'double';
'char'  return  'char';
'boolean' return  'boolean';
'string'  return 'string';
//Variales boleanas y Casteos 
'true' return 'true';
'false' return 'false';
//setencias 
'if' return 'if';
'else' return 'else';
'elif' return 'elif';
'switch' return 'switch';
'case' return 'case';
'break' return 'break';
'default' return 'default';
'continue' return 'continue';
'return' return 'return';
// ciclos 
'for' return 'for';
'while' return 'while';
'do' return 'do';
'until' return 'until';

// funciones
'print' return 'print';
'println' return 'println';
'tolower' return 'tolower';
'toupper' return 'toupper';
'round' return 'round';

// NATIVAS
'typeof'  return 'typeof';
'length' return 'length';
'tostring' return 'tostring';
'tochararray' return 'tochararray';
'push' return 'push';
'pop' return 'pop';
//arreglos 
'new' return 'new';
// tipos
'void' return 'void';
'run' return   'run';
//Signos
';' return 'punto_coma';
',' return 'coma';
':' return 'dos_puntos';
'{' return 'llave_izq';
'}' return 'llave_der';
'(' return 'par_izq';
')' return 'par_der';
'[' return 'cor_izq';
']' return 'cor_der';
'.' return 'punto';
'++' return 'mas_mas'
'+' return 'mas';
'--' return 'menos_menos'
'-' return 'menos';
'^' return 'potencia';
'*' return 'por';
'/' return 'div';
'%' return 'mod';
'<=' return 'menor_igual';
'>=' return 'mayor_igual';
'>' return 'mayor';
'<' return 'menor';
'==' return 'igual_que';
'=' return 'igual';
'!=' return 'dif_que';
'&&' return 'and';
'||' return 'or';
'!' return 'not';
'?' return 'interrogacion';
//Patrones (Expresiones regulares)
\"[^\"]*\"			{ yytext = yytext.substr(0,yyleng-0); return 'string_regex'; }
\'[^\']*\'			{ yytext = yytext.substr(0,yyleng-0); return 'char_regex'; }
[0-9]+("."[0-9]+)?\b  	return 'numero_regex';
([a-zA-Z])[a-zA-Z0-9_]* return 'id';
//Fin del archivo
<<EOF>>				return 'EOF';
//Errores lexicos
.					{
  const er = new error_1.Error({ tipo: 'ERROR LEXICO', linea: `${yylineno + 1}`, columna: `${yylloc.first_column + 1}` ,descripcion: `EL TOKEN "${yytext}"ES INCORRECTO` });
  errores_1.Errores.getInstance().push(er);
  }
/lex

//Imports
%{
  const { NodoAST } = require('../arbol/nodoAST');
  const error_1 = require("../arbol/error");
  const errores_1 = require("../arbol/errores");
%}

/* Asociación de operadores y precedencia */
%left 'interrogacion'
%left 'or'
%left 'and'
%left 'not'
%left 'igual_que' 'dif_que'
%left 'mayor' 'menor' 'mayor_igual' 'menor_igual'
%left 'mas' 'menos'
%left 'por' 'div' 'mod'
%left 'umenos'
%right 'potencia'
%left 'mas_mas' 'menos_menos'

%start INICIO

%%
//Definición de la Grámatica
INICIO
  : INSTRUCCIONES EOF { return new NodoAST({label: 'INICIO', hijos: [$1], linea: yylineno}); }
;

INSTRUCCIONES
  : INSTRUCCIONES INSTRUCCION  { $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [...$1.hijos, ...$2.hijos], linea: yylineno}); }
  | INSTRUCCION                { $$ = new NodoAST({label: 'INSTRUCCIONES', hijos: [...$1.hijos], linea: yylineno}); }
;

INSTRUCCION
  : DECLARACION_VARIABLE          { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | ASIGNACION                    { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | INCREMENTO_DECREMENTO         { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | FOR                           { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | INSTRUCCION_IF                { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | SWITCH                        { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | BREAK                         { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | WHILE                         { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | DO_WHILE                      { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | DO_UNTIL                      { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | CONTINUE                      { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | RETURN                        { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | PRINT                         { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | TOLOWER_OR_TOUPPER_OR_ROUND   { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | NATIVAS                       { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | PUSH_OR_POP_ARREGLO           { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | ASIGNACION_ARREGLOS           { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | ACCESSO_VECTOR                { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | MODIFICAR_VECTOR              { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | DECLARACION_FUNCION_OR_METODO { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | LLAMADA_FUNCION               { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
  | RUN                           { $$ = new NodoAST({label: 'INSTRUCCION', hijos: [$1], linea: yylineno}); }
;

// ------------------------------------------------------ DECLARACION DE VARIABLES -------------------------------------
DECLARACION_VARIABLE 
  : TIPO_DEC_VARIABLE LISTA_DECLARACIONES punto_coma { $$ = new NodoAST({label: 'DECLARACION_VARIABLE', hijos: [$1,$2,$3], linea: yylineno});  }
;
// ------------------------------------------------------ ASIGNACION DE VARIABLES -------------------------------------
ASIGNACION 
      : id TIPO_IGUAL EXP punto_coma { $$ = new NodoAST({label: 'ASIGNACION', hijos: [$1,$2,$3,$4], linea: yylineno}); }
;

TIPO_DEC_VARIABLE
  : int           { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
  | double        { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
  | char          { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
  | boolean       { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
  | string        { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
  | void          { $$ = new NodoAST({label: 'TIPO_DEC_VARIABLE', hijos: [$1], linea: yylineno}); }
;
 
LISTA_DECLARACIONES 
  : LISTA_DECLARACIONES coma DEC_ID_EXP               { $$ = new NodoAST({label: 'LISTA_DECLARACIONES', hijos: [...$1.hijos,$3], linea: yylineno}); }
  | LISTA_DECLARACIONES coma DEC_ID                   { $$ = new NodoAST({label: 'LISTA_DECLARACIONES', hijos: [...$1.hijos,$3], linea: yylineno}); } //No utilice las comas
  | DEC_ID_EXP                                        { $$ = new NodoAST({label: 'LISTA_DECLARACIONES', hijos: [$1], linea: yylineno}); }
  | DEC_ID                                            { $$ = new NodoAST({label: 'LISTA_DECLARACIONES', hijos: [$1], linea: yylineno}); }
  | CASTEO                                            { $$ = new NodoAST({label: 'LISTA_DECLARACIONES', hijos: [$1], linea: yylineno}); }
;


DEC_ID_EXP 
  : id igual EXP { $$ = new NodoAST({label: 'DEC_ID_EXP', hijos: [$1,$2,$3], linea: yylineno}); }
;

DEC_ID  
  : id  { $$ = new NodoAST({label: 'DEC_ID', hijos: [$1], linea: yylineno}); }
;
// ---------------------------------------------------------------- CASTEO DE DATOS ---------------------------------------------
CASTEO
    : id igual par_izq TIPO_DEC_VARIABLE par_der EXP { $$ = new NodoAST({label: 'CASTEO', hijos: [$1,$2,$3,$4,$5,$6], linea: yylineno}); }
;

EXP
  : menos EXP %prec umenos                  { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  | EXP mas EXP                             { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP menos EXP                           { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP por EXP                             { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP div EXP                             { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP mod EXP                             { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP potencia EXP                        { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | id mas_mas                              { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  | id menos_menos                          { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  | par_izq EXP par_der                     { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  //Operaciones de Comparacion
  | EXP mayor EXP                           { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP menor EXP                           { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP mayor_igual EXP                     { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP menor_igual EXP                     { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP igual_que EXP                       { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP dif_que EXP                         { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  //Operaciones Lógicas
  | EXP and EXP                             { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | EXP or EXP                              { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | not EXP                                 { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2], linea: yylineno}); }
  | numero_regex                            { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'NUMBER', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | string_regex                            { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'STRING', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | char_regex                              { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'STRING', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | id                                      { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'ID', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | true                                    { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'BOOLEAN', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | false                                   { $$ = new NodoAST({label: 'EXP', hijos: [new NodoAST({label: 'BOOLEAN', hijos: [$1], linea: yylineno})], linea: yylineno}); }
  | cor_izq LISTA_EXPRESIONES cor_der       { $$ = new NodoAST({label: 'EXP', hijos: [$1,$2,$3], linea: yylineno}); }
  | cor_izq cor_der                         { $$ = new NodoAST({label: 'EXP', hijos: [$1,$2], linea: yylineno}); }
  | llave_izq LISTA_EXPRESIONES llave_der   { $$ = new NodoAST({label: 'EXP', hijos: [$1, $2, $3], linea: yylineno}); }
  | TERNARIO                                { $$ = new NodoAST({label: 'EXP', hijos: [$1], linea: yylineno}); }
  | LLAMADA_FUNCION_EXP                     { $$ = new NodoAST({label: 'EXP', hijos: [$1], linea: yylineno}); }
;
//---------------------------------------------------------- Contador ++; o --;---------------------------------------
INCREMENTO_DECREMENTO
  : id mas_mas punto_coma     { $$ = new NodoAST({label: 'INCREMENTO_DECREMENTO', hijos: [$1,$2,$3], linea: yylineno}); }
  | id menos_menos punto_coma { $$ = new NodoAST({label: 'INCREMENTO_DECREMENTO', hijos: [$1,$2,$3], linea: yylineno}); }
  | mas_mas id  punto_coma    { $$ = new NodoAST({label: 'INCREMENTO_DECREMENTO', hijos: [$1,$2,$3], linea: yylineno}); }
  | menos_menos id punto_coma { $$ = new NodoAST({label: 'INCREMENTO_DECREMENTO', hijos: [$1,$2,$3], linea: yylineno}); }
;
// -------------------------------------------------- SETENCIA IF -------------------------------------------------
INSTRUCCION_IF 
  : IF                       { $$ = new NodoAST({label: 'INSTRUCCION_IF', hijos: [$1], linea: yylineno}); }
  | IF ELSE                  { $$ = new NodoAST({label: 'INSTRUCCION_IF', hijos: [$1,$2], linea: yylineno}); }
  | IF LISTA_ELSE_IF         { $$ = new NodoAST({label: 'INSTRUCCION_IF', hijos: [$1,$2], linea: yylineno}); }
  | IF LISTA_ELSE_IF ELSE    { $$ = new NodoAST({label: 'INSTRUCCION_IF', hijos: [$1,$2,$3], linea: yylineno}); }
;

IF 
  : if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'IF', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno}); }
;

ELSE 
  : else llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'ELSE', hijos: [$1,$2,$3,$4], linea: yylineno}); }
;

ELIF 
  : elif par_izq EXP par_der llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'ELIF', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno}); }
;

LISTA_ELSE_IF
  : LISTA_ELSE_IF ELIF    { $$ = new NodoAST({label: 'LISTA_ELSE_IF', hijos: [...$1.hijos, $2], linea: yylineno}); }
  | ELIF                  { $$ = new NodoAST({label: 'LISTA_ELSE_IF', hijos: [$1], linea: yylineno}); }
;
//-------------------------------------------------- Setencia for -----------------------------------------------------------------
FOR
  : for par_izq DECLARACION_VARIABLE EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'FOR', hijos: [$1,$2,$3,$4,$5,$6,$7,$8,$9,$10], linea: yylineno}); }
  | for par_izq ASIGNACION EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'FOR', hijos: [$1,$2,$3,$4,$5,$6,$7,$8,$9,$10], linea: yylineno}); }
;

TIPO_IGUAL 
  : igual       { $$ = new NodoAST({label: 'TIPO_IGUAL', hijos: [$1], linea: yylineno}); }
  | mas igual   { $$ = new NodoAST({label: 'TIPO_IGUAL', hijos: [$1,$2], linea: yylineno}); }
  | menos igual { $$ = new NodoAST({label: 'TIPO_IGUAL', hijos: [$1,$2], linea: yylineno}); }
;

ASIGNACION_FOR 
  : id TIPO_IGUAL EXP   { $$ = new NodoAST({label: 'ASIGNACION_FOR', hijos: [$1,$2,$3], linea: yylineno}); }
  | id mas_mas          { $$ = new NodoAST({label: 'ASIGNACION_FOR', hijos: [$1,$2], linea: yylineno}); }
  | id menos_menos      { $$ = new NodoAST({label: 'ASIGNACION_FOR', hijos: [$1,$2], linea: yylineno}); }
  | id menos EXP        { $$ = new NodoAST({label: 'ASIGNACION_FOR', hijos: [$1,$2,$3], linea: yylineno}); }
  | id mas EXP          { $$ = new NodoAST({label: 'ASIGNACION_FOR', hijos: [$1,$2,$3], linea: yylineno}); }
;

// ------------------------------------------------- Setencias de transferencias    -------------------------------------------
BREAK 
  : break punto_coma { $$ = new NodoAST({label: 'BREAK', hijos: [$1,$2], linea: yylineno}); }
;
CONTINUE 
  : continue punto_coma { $$ = new NodoAST({label: 'CONTINUE', hijos: [$1, $2], linea: yylineno}); }
;
RETURN 
  : return EXP punto_coma { $$ = new NodoAST({label: 'RETURN', hijos: [$1,$2,$3], linea: yylineno}); }
  | return punto_coma { $$ = new NodoAST({label: 'RETURN', hijos: [$1,$2], linea: yylineno}); }
;

// ------------------------------------------------- Setencias Switch case -------------------------------------------
SWITCH 
  : switch par_izq EXP par_der llave_izq LISTA_CASE llave_der   { $$ = new NodoAST({label: 'SWITCH', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno}); }
;
LISTA_CASE 
  : LISTA_CASE CASE     { $$ = new NodoAST({label: 'LISTA_CASE', hijos: [...$1.hijos,$2], linea: yylineno}); }
  | CASE                { $$ = new NodoAST({label: 'LISTA_CASE', hijos: [$1], linea: yylineno}); }
  | DEFAULT             { $$ = new NodoAST({label: 'LISTA_CASE', hijos: [$1], linea: yylineno}); }
  | LISTA_CASE DEFAULT  { $$ = new NodoAST({label: 'LISTA_CASE', hijos: [...$1.hijos,$2], linea: yylineno}); }
;
CASE
  : case EXP dos_puntos INSTRUCCIONES   { $$ = new NodoAST({label: 'CASE', hijos: [$1,$2,$3,$4], linea: yylineno}); }
;
DEFAULT
  : default dos_puntos INSTRUCCIONES    { $$ = new NodoAST({label: 'DEFAULT', hijos: [$1,$2,$3], linea: yylineno}); }
;

// ------------------------------------------------- Ciclo while  -------------------------------------------
WHILE 
  : while par_izq EXP par_der llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'WHILE', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno}); }
;
//---------------------------------------------------- ciclo do-while-------------------------------------------
DO_WHILE 
  : do llave_izq INSTRUCCIONES llave_der while par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'DO_WHILE', hijos: [$1,$2,$3,$4,$5,$6,$7,$8,$9], linea: yylineno}); }
;

DO_UNTIL 
  : do llave_izq INSTRUCCIONES llave_der until par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'DO_UNTIL', hijos: [$1,$2,$3,$4,$5,$6,$7,$8,$9], linea: yylineno}); }
;

//------------------------------------ funciones --------------------------------------------

PRINT /*-->TR - EJ<--*/
  : print par_izq LISTA_EXPRESIONES par_der punto_coma    { $$ = new NodoAST({label: 'PRINT', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
  | println par_izq LISTA_EXPRESIONES par_der punto_coma  { $$ = new NodoAST({label: 'PRINTLN', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
;

LISTA_EXPRESIONES 
  : LISTA_EXPRESIONES coma EXP            { $$ = new NodoAST({label: 'LISTA_EXPRESIONES', hijos: [...$1.hijos,$2,$3], linea: yylineno}); }
  | EXP                                   { $$ = new NodoAST({label: 'LISTA_EXPRESIONES', hijos: [$1], linea: yylineno}); }
;

TOLOWER_OR_TOUPPER_OR_ROUND
  :  TIPO_DEC_VARIABLE id igual tolower par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'TOLOWER_OR_TOUPPER_OR_ROUND', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
  |  TIPO_DEC_VARIABLE id igual toupper par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'TOLOWER_OR_TOUPPER_OR_ROUND', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
  |  TIPO_DEC_VARIABLE id igual round par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'TOLOWER_OR_TOUPPER_OR_ROUND', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
;

//------------------------------------------- TypeOF------------------------------------------

NATIVAS
 :  TIPO_DEC_VARIABLE id igual typeof par_izq EXP par_der punto_coma      { $$ = new NodoAST({label: 'NATIVAS', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
 |  TIPO_DEC_VARIABLE id igual tochararray par_izq EXP par_der punto_coma { $$ = new NodoAST({label: 'NATIVAS', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
 |  TIPO_DEC_VARIABLE id igual tostring par_izq EXP par_der punto_coma    { $$ = new NodoAST({label: 'NATIVAS', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
 |  TIPO_DEC_VARIABLE id igual length par_izq EXP par_der punto_coma      { $$ = new NodoAST({label: 'NATIVAS', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }

;


PUSH_OR_POP_ARREGLO
  : id punto push par_izq EXP par_der punto_coma   { $$ = new NodoAST({label: 'PUSH_OR_POP_ARREGLO', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno}); }
  | id punto  pop par_izq par_der punto_coma       { $$ = new NodoAST({label: 'PUSH_OR_POP_ARREGLO', hijos: [$1,$2,$3,$4,$5,$6], linea: yylineno}); }
;


ASIGNACION_ARREGLOS 
  : TIPO_DEC_VARIABLE  cor_izq cor_der ARREGLO_TIPO punto_coma    { $$ = new NodoAST({label: 'ASIGNACION_ARREGLOS', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
;
ARREGLO_TIPO
  : id igual new TIPO_DEC_VARIABLE  NEW_ARREGLO                     { $$ = new NodoAST({label: 'ARREGLO_TIPO', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
  | id igual llave_izq  LISTA_EXPRESIONES llave_der                 { $$ = new NodoAST({label: 'ARREGLO_TIPO', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
  | cor_izq cor_der id igual new TIPO_DEC_VARIABLE  NEW_ARREGLO  NEW_ARREGLO        { $$ = new NodoAST({label: 'ARREGLO_TIPO', hijos: [$1,$2,$3,$4,$5,$6,$7,$8], linea: yylineno}); }
  | cor_izq cor_der id igual llave_izq  LISTA_EXPRESIONES llave_der                 { $$ = new NodoAST({label: 'ARREGLO_TIPO', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno}); }
;
NEW_ARREGLO 
  : cor_izq PRIMERO_ARRAY cor_der                   { $$ = new NodoAST({label: 'NEW_ARREGLO', hijos: [$1,$2,$3], linea: yylineno}); }
;

PRIMERO_ARRAY
    : par_izq TIPO_DEC_VARIABLE par_der EXP        { $$ = new NodoAST({label: 'PRIMERO_ARRAY', hijos: [$1,$2,$3,$4], linea: yylineno}); }
    | EXP                                          { $$ = new NodoAST({label: 'PRIMERO_ARRAY', hijos: [$1], linea: yylineno}); }
;

ACCESSO_VECTOR
    : TIPO_DEC_VARIABLE id igual  id  NEW_ARREGLO punto_coma              { $$ = new NodoAST({label: 'ACCESSO_VECTOR', hijos: [$1,$2,$3,$4,$5,$6], linea: yylineno}); }
    | TIPO_DEC_VARIABLE id igual  id  NEW_ARREGLO NEW_ARREGLO punto_coma  { $$ = new NodoAST({label: 'ACCESSO_VECTOR', hijos: [$1,$2,$3,$4,$5,$6,$7], linea: yylineno}); }
;


MODIFICAR_VECTOR
    :ASG_VECTOR igual EXP punto_coma   { $$ = new NodoAST({label: 'MODIFICAR_VECTOR', hijos: [$1,$2,$3,$4], linea: yylineno}); }
;     


ASG_VECTOR
  : id NEW_ARREGLO                { $$ = new NodoAST({label: 'ASG_VECTOR', hijos: [$1,$2], linea: yylineno}); }
  | id NEW_ARREGLO NEW_ARREGLO    { $$ = new NodoAST({label: 'ASG_VECTOR', hijos: [$1,$2,$3], linea: yylineno}); }
;


TERNARIO 
  : EXP interrogacion EXP dos_puntos EXP { $$ = new NodoAST({label: 'TERNARIO', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
;


DECLARACION_FUNCION_OR_METODO 
  :  id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_DEC_VARIABLE llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'DECLARACION_FUNCION_OR_METODO', hijos: [$1, $2, $3, $4, $5, $6, $7, $8, $9], linea: yylineno}); }
  |  id par_izq par_der dos_puntos TIPO_DEC_VARIABLE llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'DECLARACION_FUNCION_OR_METODO', hijos: [$1, $2, $3, $4, $5, $6, $7, $8], linea: yylineno}); }
  |  id par_izq par_der llave_izq INSTRUCCIONES llave_der { $$ = new NodoAST({label: 'DECLARACION_FUNCION_OR_METODO', hijos: [$1, $2, $3, $4, $5, $6], linea: yylineno}); }
;

LISTA_PARAMETROS 
  : LISTA_PARAMETROS coma PARAMETRO     { $$ = new NodoAST({label: 'LISTA_PARAMETROS', hijos: [...$1.hijos,$2,$3], linea: yylineno}); } //Revisar si agrego o no coma
  | PARAMETRO                           { $$ = new NodoAST({label: 'LISTA_PARAMETROS', hijos: [$1], linea: yylineno}); }
;

PARAMETRO 
  : TIPO_DEC_VARIABLE  id { $$ = new NodoAST({label: 'PARAMETRO', hijos: [$1, $2], linea: yylineno}); }
;


LLAMADA_FUNCION 
  : id par_izq par_der punto_coma                   { $$ = new NodoAST({label: 'LLAMADA_FUNCION', hijos: [$1,$2,$3,$4], linea: yylineno}); }
  | id par_izq LISTA_EXPRESIONES par_der punto_coma { $$ = new NodoAST({label: 'LLAMADA_FUNCION', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
;

LLAMADA_FUNCION_EXP 
  : id par_izq par_der                      { $$ = new NodoAST({label: 'LLAMADA_FUNCION_EXP', hijos: [$1,$2,$3], linea: yylineno}); }
  | id par_izq LISTA_EXPRESIONES par_der    { $$ = new NodoAST({label: 'LLAMADA_FUNCION_EXP', hijos: [$1,$2,$3,$4], linea: yylineno}); }
;



RUN  
  : run id par_izq par_der punto_coma                   { $$ = new NodoAST({label: 'LLAMADA_FUNCION', hijos: [$1,$2,$3,$4,$5], linea: yylineno}); }
  | run id par_izq LISTA_EXPRESIONES par_der punto_coma { $$ = new NodoAST({label: 'LLAMADA_FUNCION', hijos: [$1,$2,$3,$4,$5,$6], linea: yylineno}); }
;