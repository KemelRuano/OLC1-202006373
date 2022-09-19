
package proyect_1;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import javax.swing.JOptionPane;
import Analizador.Analizador_Lexico;
import java.io.PrintWriter;
public class Metodos {

     
     
     public static String Validados(String Tipo,String valor,int CountValor){
        String SalidaGolang = "";
        boolean numero = (valor.matches("[0-9]+"));
        boolean decimal = (valor.matches("[0-9]+[.][0-9]+"));
        String T_po = Tipo.toLowerCase(); 
        String T_po2 = valor.toLowerCase();
        boolean is_NAL = (valor.matches(".*[${}].*"));
        boolean is_NAL2 = (valor.matches("['][\\w]+[']"));
        if(numero == true){
                SalidaGolang += " "+"int"+" "+"="+" ";
                for(int j = 1; j <= CountValor; ++j) {
                    SalidaGolang += " "+valor;
                    if(j != CountValor){
                        SalidaGolang += ",";
                    }
                 }  
                SalidaGolang += "\n"; 
        }else if(decimal == true){
            
                SalidaGolang += " "+"float64"+" "+"="+" ";
                for(int j = 1; j <= CountValor; ++j) {
                    SalidaGolang += " "+valor;
                    if(j != CountValor){
                        SalidaGolang += ",";
                    }
                }  SalidaGolang += "\n"; 
                
        }else if("cadena".equals(T_po)){
             SalidaGolang += " "+"string"+" "+"="+" ";
            for(int j = 1; j <= CountValor; ++j) {
                SalidaGolang += " "+valor;
                if(j != CountValor){
                    SalidaGolang += ",";
                }}  SalidaGolang += "\n"; 
            
        }else if("falso".equals(T_po2)){
            
                SalidaGolang += " "+"bool"+" "+"="+" ";
                for(int j = 1; j <= CountValor; ++j) {
                    SalidaGolang += " "+"false";
                    if(j != CountValor){
                        SalidaGolang += ",";
                    }}  SalidaGolang += "\n";   
        
        }else if("verdadero".equals(T_po2)){
            
                 SalidaGolang += " "+"bool"+" "+"="+" ";
                for(int j = 1; j <= CountValor; ++j) {
                    SalidaGolang += " "+"true";
                    if(j != CountValor){
                        SalidaGolang += ",";
                    }}  SalidaGolang += "\n";
            
        }else if(is_NAL == true){
                SalidaGolang += " "+"string"+" "+"="+" ";
                String nuevo2 = valor.replace("'${", "").replace("}'","");
            
                for(int j = 1; j <= CountValor; ++j) {
                SalidaGolang += " "+"string("+nuevo2+")";
                if(j != CountValor){
                    SalidaGolang += ",";
                }
               }  SalidaGolang += "\n";
            
                
          }else if(is_NAL2 == true){
                SalidaGolang += " "+"byte"+" "+"="+" ";
                for(int j = 1; j <= CountValor; ++j) {
                    SalidaGolang += " "+valor;
                    if(j != CountValor){
                        SalidaGolang += ",";
                    }}  SalidaGolang += "\n";
          
          }else{
              
                SalidaGolang += " "+"float64"+" "+"="+" ";
                for(int j = 1; j <= CountValor; ++j) {
                    SalidaGolang += " "+valor;
                    if(j != CountValor){
                        SalidaGolang += ",";
                    }
                }  SalidaGolang += "\n";
              
          
          }
        
        
       
       return SalidaGolang;
     }
     
     
     
     
     
     
     
     public static String asignacion(String nuevo,int CountValor){
       
         String SalidaGolang = "";
         SalidaGolang += " "+":=";
         boolean is_NAL = (nuevo.matches(".*['${}].*"));
         if(is_NAL == true){
            String nuevo2 = nuevo.replace("'${", "").replace("}'","");
            
                for(int j = 1; j <= CountValor; ++j) {
                SalidaGolang += " "+"string("+nuevo2+")";
                if(j != CountValor){
                    SalidaGolang += ",";
                }
               }  SalidaGolang += "\n";
            
                
          }else{
                for(int j = 1; j <= CountValor; ++j) {
                SalidaGolang += " "+nuevo;
                if(j != CountValor){
                    SalidaGolang += ",";
                }
               }  SalidaGolang += "\n";
         }
          
        
         return SalidaGolang;
     }
     
    
     
     
       public static void GenerarHTML(){
                
                String cabeza = "<!DOCTYPE html>\n" +
"<html lang=\"es\">\n" +
"  <head>\n" +
"    <meta charset=\"UTF-8\" />\n" +
"    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n" +
"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n" +
"    <title>Reporte</title>\n" +
"    <link\n" +
"      href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css\"\n" +
"      rel=\"stylesheet\"\n" +
"      integrity=\"sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU\"\n" +
"      crossorigin=\"anonymous\"\n" +
"    />\n" +
"  </head>\n" +
"  <body style=\"background-image: url(src/fondo1.jpg); color: rgb(0, 0, 0); font-family: arial;\">\n" +
"    <h1 class=\"text-center\">Reporte</h1>\n" +
"    <h2 class=\"text-center\">Tabla de Errores</h2>\n" +
"    <hr />\n" +
"    <div class=\"m-2 p-2\" style=\"background: rgb(185, 226, 197); padding: 10px; color: rgb(0, 0, 0); font-family: arial;\">\n" +
"      <table class=\"table table-success table-striped\" style=\"HEIGHT: 100%;WIDTH:50%;\" border=5 align=\"center\">\n" +
"        <thead>\n" +
"          <tr class=\"table-dark\">\n" +
"            <th scope=\"col\">Token</th>\n" +
"            <th scope=\"col\">caracter</th>\n" +
"            <th scope=\"col\">Fila</th>\n" +
"            <th scope=\"col\">Columna</th>\n" +
"          </tr>\n" +
"        </thead>\n" +
"        <tbody>";
                String datos = Analizador_Lexico.concatenado;
                String cola = "</tbody>\n" +
"      </table>\n" +
"    </div>\n" +
"    <hr />\n" +
"    <script\n" +
"      src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js\"\n" +
"      integrity=\"sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ\"\n" +
"      crossorigin=\"anonymous\"\n" +
"    ></script>\n" +
"  </body>\n" +
"</html>";
                FileWriter escribir;
                try {
                    PrintWriter pw = new PrintWriter("src/Documentacion/Errores.html");
                    pw.close();

                    escribir = new FileWriter("src/Documentacion/Errores.html", true);
                    escribir.write("");
                    escribir.write(cabeza);
                    escribir.write(datos);
                    escribir.write(cola);
                    escribir.close();

                } catch (FileNotFoundException ex) {
                    JOptionPane.showMessageDialog(null, "Error al guardar, ponga nombre al archivo");
                } catch (IOException ex) {
                    JOptionPane.showMessageDialog(null, "Error al guardar, en la salida");
                }
}
     
     
     
     
   
     
     
     
    
}
