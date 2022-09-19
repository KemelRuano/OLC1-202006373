
package proyect_1;


import java.io.IOException;



public class EjecutarBin {
    
        public static void ejecutar(String comando){
                try{
                        Process proceso = Runtime.getRuntime().exec(comando);
                      
                        System.out.println("exito al ejecutar binarios");
                }catch(IOException err){
                        System.out.println("Ocurrio un error");
                        System.out.println(err);}
                }
       
    
    
    
    
}
