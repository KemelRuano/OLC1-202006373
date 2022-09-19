package proyect_1;
import java.awt.Desktop;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.*;
import java.awt.event.*;
import java.io.File;
import java.io.IOException;
import javax.swing.filechooser.FileNameExtensionFilter;
import Analizador.Analizador_Lexico;
import Analizador.Analizador_sintactico;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.StringReader;
import java_cup.runtime.Symbol;

/**
 *
 * @author LENOVO
 */
public class Main_window  extends JFrame implements ActionListener {
        public static JButton boton1,boton2,clean,run;
        JPanel panel1;
        public static JLabel titulo ,Errores;
        public static  JTextArea area1;
        JScrollPane scrool;
        JMenu menu1;
        public static JComboBox box1,box2,box3;
        public static JFrame frame;
        public static String[] Lista1 = {"Archivo","Abrir_Archivo","Guardar Como"};
        public static String[] Lista2 = {"ver","Manual_Tecnico","Manual_Usuario"};
        public static String[] Lista3 = {"Reporte","Flowchart","Lista_Errores"};
        
       
        
    
    
        public Main_window() {      
         
        panel1 = new JPanel();
        
        titulo = new JLabel("OLC1_2S_2022     202006373");
        titulo.setBounds(530,5,250,50);
        titulo.setVisible(true);
        panel1.add(titulo);
        
        
        Errores = new JLabel("0 Errores");
        Errores.setBounds(50,400,250,50);
        Errores.setVisible(true);
        panel1.add(Errores);
     
   
        
        
        clean  = new JButton("Clean"); 
        clean.setBounds(590,50,70,25);
        clean.setVisible(true);
        clean.addActionListener(this);
        panel1.add(clean);
        
        run  = new JButton("Run"); 
        run.setBounds(680,50,60,25);
        run.setVisible(true);
        run.addActionListener(this);
        panel1.add(run);

        boton1  = new JButton("ver codigo GOLANG"); 
        boton1.setBounds(420,420,150,25);
        boton1.setVisible(true);
        panel1.add(boton1);
        
        boton2  = new JButton("ver codigo PYTHON"); 
        boton2.setBounds(600,420,150,25);
        boton2.setVisible(true);
        panel1.add(boton2);
        
        area1 = new JTextArea();
        scrool = new JScrollPane(area1);
        scrool.setBounds(50,100,690,300);
        scrool.setVisible(true);
        panel1.add(scrool);
               
        box1 = new JComboBox(Lista1);
        box1.setBounds(50,10, 100, 20);
        box1.setVisible(true);
        box1.addActionListener(this);
        panel1.add(box1);
 
        box2 = new JComboBox(Lista3);
        box2.setBounds(150,10, 100, 20);
        box2.setVisible(true);
        box2.addActionListener(this);
        panel1.add(box2);
        
        box3 = new JComboBox(Lista2);
        box3.setBounds(250,10, 150, 20);
        box3.setVisible(true);
        box3.addActionListener(this);
        panel1.add(box3);
       
        panel1.setLayout(null);
     
        this.getContentPane().add(panel1);  
        this.setTitle("Proyect 1 OLC1");
        this.setSize(800,500);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setResizable(false);
        this.setVisible(true);
       
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        
        
       
        if (ae.getSource() == box1 ) {
            
            String dato = box1.getSelectedItem().toString();
                if("Abrir_Archivo".equals(dato)){
                
                    try {
                            JFileChooser venfc = new JFileChooser();
                            FileNameExtensionFilter filter = new FileNameExtensionFilter("olc","OLC");
                            venfc.setFileFilter(filter);
                            venfc.showOpenDialog(this);
                            File archivo = venfc.getSelectedFile();
                            String ruta = archivo.getAbsolutePath();
                            Cargar_Ficheros.LeerOCL1(ruta); 
                    }catch (NullPointerException exception) { JOptionPane.showMessageDialog(null,"SE CANCELO ABRIR EL ARCHIVO"); }
                    
                }else if("Guardar Como".equals(dato)){
                      try {
                    
                            JFileChooser guardar = new JFileChooser();
                            guardar.showSaveDialog(null);
                            guardar.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);
                            File archivo = guardar.getSelectedFile();      
                            Cargar_Ficheros.GuardarOLC1(area1.getText(),archivo);
                      }catch (NullPointerException exception) { JOptionPane.showMessageDialog(null,"SE CANCELO GUARDAR EL ARCHIVO"); }
                }else{
                    System.out.println("pass");
                }
              

              
            
        }else if(ae.getSource() == box3){
            String dato2 = box3.getSelectedItem().toString();
            
            if("Manual_Tecnico".equals(dato2)){
                try {
                     File path = new File ("src/Documentacion/Manual_Tecnico.pdf");
                     Desktop.getDesktop().open(path);
                }catch (IOException ex) {ex.printStackTrace();}

            }else if("Manual_Usuario".equals(dato2)){
                try {
                     File path = new File ("src/Documentacion/Manual_Usuario.pdf");
                     Desktop.getDesktop().open(path);
                }catch (IOException ex) {ex.printStackTrace();}
                
            }else{
                System.out.println("pass");
            }
            
            
            
        }else if(ae.getSource() == box2){
              
             String dato3 = box2.getSelectedItem().toString();
             if("Lista_Errores".equals(dato3)){
                Metodos.GenerarHTML();
                try {
                     File path = new File ("src/Documentacion/Errores.html");
                     Desktop.getDesktop().open(path);
                }catch (IOException ex) {ex.printStackTrace();}

            }
            
        }else if(ae.getSource() == run){
            try{
            Analizador_Lexico  lexico = new Analizador_Lexico(new BufferedReader(new StringReader(area1.getText())));
            Analizador_sintactico sintactico = new Analizador_sintactico(lexico);
            sintactico.parse();
            
            Errores.setText(String.valueOf(Analizador_Lexico.Count_Lexico)+"   Errores");
           }catch(Exception e){}
            
            
        }else if(ae.getSource() == clean){
                               Errores.setText("0 Errores");
                               area1.setText(null);
        }
    }
    
    
   

    
   
    
    
    
}
