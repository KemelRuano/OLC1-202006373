
    <template>
      <q-page class="constrain q-pa-lg">
        <div class="row" style="position:absolute; top:50px; right:950px; width: 20%;" >
          <q-bar class="bg-white text-white"  style="height: 100px;  width: 200px;">
            <input type="file" id="mostrar_olc" style="padding:1px;"/>
           </q-bar> 
          <q-bar class="bg-white text-white"  style="height: 100px;  width: 200px;">
            <q-btn push label=" ⚙️  COMPILAR    "  color="black" glossy text-color="white"  @click="ejecutar" style="height: 80px;  width: 150px; " />
          </q-bar> 
          <q-bar class="bg-white text-white"  style="height: 100px;  width: 200px; ">
            <q-btn push label=" 🗑️ LIMPIAR CONSOLA"  color="black" glossy text-color="white"  @click="limpiar"  style="height: 80px;  width: 150px; "/>
          </q-bar> 
          <q-bar class="bg-white text-white"  style="height: 100px;  width: 200px; ">
            <q-btn  push label = "añadir"  color="black" glossy text-color="white"  @click="agregar"  style="height: 80px;  width: 150px; "/>
          </q-bar>  
          <q-bar class="bg-white text-white"  style="height: 100px;  width: 200px; ">
            <q-btn  push label = "Crear y Guardar"  color="black" glossy text-color="white"  @click="exp_doc"  style="height: 80px;  width: 150px; "/>
          </q-bar>
        </div>    
     

        <div class="col-12">
          <q-card class="bg-white text-white" style="position:absolute; top:35px; left:100px; width: 105%;" >
            <q-tabs v-model="tab" class="text-white bg-black">
              <q-tab label="📝 Area de Edicion" name="editor"/>
              <q-tab label="🌳 Arbol" name="ast" />
              <q-tab label="ERRORES :(" name="errores" />
            </q-tabs> 
              <q-tab-panels v-model="tab" animated>
                <!-- Panel para el editor de texto del archivo que vamos a analizar -->
                <q-tab-panel name="editor" style="height: 500px; background-color: black;">
                  <codemirror v-model="code" :options="cmOptions" @input="codigoEditado" id='kemel_code'/>
                </q-tab-panel>


                <!-- Panel para el AST del archivo que vamos a analizar -->
                <q-tab-panel name="ast" style="height: 500px; background-color: black;">
                   <ast :dot="dot" />
                </q-tab-panel>

                <q-tab-panel name="errores">
                  <div class="q-pa-md">
                    <q-table
                      title=""
                      :data="errores"
                      :columns="columns"
                      row-key="name"
                      dark
                      color="yellow"
                      dense
                      :pagination="{ rowsPerPage: 0 }"
                    />
                  </div>
                </q-tab-panel>
              </q-tab-panels>
          </q-card> 

        </div>
      </q-page>
    </template>
    
    <script>
    import { codemirror } from "vue-codemirror";
    import "codemirror/lib/codemirror.css";
    import "codemirror/theme/abcdef.css";
    import "codemirror/mode/javascript/javascript.js";
    import AnalizadorTraduccion from "../analizador/Analizer_grammar";
    import { Ejecucion } from "../Compiler_proyect/ejecucion";
    import { Errores } from "../arbol/errores";
    import { Error as InstanciaError } from "../arbol/error";
    var text = "";
    function leerArchivo(e) {
              var archivo = e.target.files[0];
              if (!archivo) {
                return;
              }
              var lector = new FileReader();
              lector.onload = function(e) {
                var contenido = e.target.result;
                  text = "";
                  text = contenido;
                  console.log(text);
              };
              lector.readAsText(archivo);
   };

   window.addEventListener('load',() => {document.getElementById('mostrar_olc').addEventListener('change',leerArchivo)})
    export default {
      components: {
        codemirror,
        ast: require("../pages/Arbol_AST").default,
      },
      data() {
        return {
          code: "",
          cmOptions: {
            tabSize: 4,
            matchBrackets: true,
            styleActiveLine: true,
            mode: "text/javascript",
            theme: "abcdef",
            lineNumbers: true,
            line: false,
          },
          output: "salida de ejemplo",
          tab: "editor",
          dot: "",
          salida: [],
          lenguajes:[],
          errores: [],
          columns: [
            { name: "tipo", label: "Tipo", field: "tipo", align: "left" },
            { name: "linea", label: "Linea", field: "linea", align: "left" },
            { name: "columna", label: "Columna", field: "columna", align: "left" },
            {
              name: "descripcion",
              label: "Descripcion",
              field: "descripcion",
              align: "left",
            },
          ],
        };
      },
      methods: {
        notificar(variant, message) {
          this.$q.notify({
            message: message,
            color: variant,
            multiLine: true,
            avatar: "https://cdn.quasar.dev/img/chaosmonkey.png",
            actions: [
              {
                label: "Aceptar",color: "yellow",handler: () => {},},],
          });
        },
        ejecutar() {
          if (this.code.trim() == "") {
            this.notificar("black", `Ingrese primero codigo`);
            return;
          }
          this.inicializarValores();
          try {
            const raiz = AnalizadorTraduccion.parse(this.code);
            //Validacion de raiz
            if (raiz == null) {
              this.notificar(
                "negative",
                "No fue posible obtener la raíz de la ejecución"
              );
              return;
            }
            let ejecucion = new Ejecucion(raiz);
            this.dot = ejecucion.Graficar_AST();
            if(!ejecucion.puedoEjecutar(raiz)){
              return;
            }
            ejecucion.ejecutar();
            this.salida = ejecucion.getSalida();
            this.notificar("black", "Compilacion Correcta");
          } catch (error) {
            console.log(error);
            this.validarError(error);
          }
          this.errores = Errores.getInstance().lista;
        },
        inicializarValores() {
          Errores.getInstance().clear();
          this.errores = [];
          this.salida = [];
          this.dot = '';
        },
        validarError(error) {
          const json = JSON.stringify(error);
          if (json.length == 2){
            console.log(json.length);
            this.notificar("black", "Compilacion Correcta");
          }else{
            this.notificar("black",`Ocurrio un error`);
          }
          
          const objeto = JSON.parse(json);
          if (
            objeto != null &&
            objeto instanceof Object &&
            objeto.hasOwnProperty("hash")
          ) {
            Errores.getInstance().push(
              new InstanciaError({
                tipo: "ERROR SINTACTICO",
                linea: objeto.hash.loc.first_line,
                columna: objeto.hash.loc.last_column,
                descripcion: `TOKEN "---${objeto.hash.token}---"NO ESPERADO`,
              })
            );  
          }
        },
        codigoEditado(codigo){
          this.inicializarValores();
        },
        limpiar(){
          this.code = '';
          this.inicializarValores();
        },
        agregar(){
          this.code = text;
          this.notificar("black", "ARCHIVO CARGADO");
          text = "";
        },
        exp_doc(){
            const a = document.createElement("a");
            const conte = this.code,
              blob = new Blob([conte],{type:"octect/stream"}),
              url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'creado.olc';
            a.click();
            window.URL.revokeObjectURL(url);
            this.notificar("black", "ARCHIVO GUARDADO");

         }

      },
    }; 
   

    </script>
  


 <!-- estilo de codemirror    -->
<style lang="css">
.CodeMirror {
  height: 450px;
  width: 900px;
  left: 50px;
}
</style>