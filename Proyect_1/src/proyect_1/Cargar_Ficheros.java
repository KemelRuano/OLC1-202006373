

package proyect_1;
import java.io.*;
import javax.swing.JOptionPane;


public class Cargar_Ficheros {
    
    public static String linea = "";
    public static void LeerOCL1(String ruta){
        File archivo = null;
        FileReader fr = null;
        BufferedReader br = null;
        try {
        
                archivo = new File (ruta);
                fr = new FileReader (archivo);
                br = new BufferedReader(fr);
                while((linea=br.readLine())!=null){
                    Main_window.area1.append(linea);
                }
             
        }catch(Exception e){
           e.printStackTrace();
        }finally{try{if(null != fr){fr.close();}}catch(Exception e2){e2.printStackTrace();}}  
    }
    
    
    public static void GuardarOLC1(String cadena, File ruta){
                FileWriter escribir;
                try {

                    escribir = new FileWriter(ruta, true);
                    escribir.write(cadena);
                    escribir.close();

                } catch (FileNotFoundException ex) {
                    JOptionPane.showMessageDialog(null, "Error al guardar, ponga nombre al archivo");
                } catch (IOException ex) {
                    JOptionPane.showMessageDialog(null, "Error al guardar, en la salida");
                }
}

    
        
        
        
    }
        
    
    
  
    
    
    
    
    
    
    
    
    





