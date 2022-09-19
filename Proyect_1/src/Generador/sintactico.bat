SET JAVA_HOME = "C:\Program Files\Java\jdk1.8.0_202\bin"
SET PATH=%JAVA_HOME%;%PATH%
SET CLASSPATH=%JAVA_HOME%;
cd C:\ProyectosUsac\COMPI_1\Proyect_1\src\Analizador
java -jar java-cup-11b.jar -parser Analizador_sintactico -symbols Tokens sintactic.cup
pause



