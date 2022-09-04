



package proyect_1;

import Analizador.Analizador_Lexico;
import Analizador.Analizador_sintactico;
import java.io.BufferedReader;
import java.io.FileReader;



public class Proyect_1 {

    public static void main(String[] args) {
        
        Main_window ventana = new Main_window();
        
        try{
            Analizador_Lexico  lexico = new Analizador_Lexico(new BufferedReader(new FileReader("./entrada.txt")));
            Analizador_sintactico sintactico = new Analizador_sintactico(lexico);
            sintactico.parse();
            
  
            
            
           
        }catch(Exception e){
            
        }


    }
    
}
