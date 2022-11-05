export class Error {
  tipo: string;
  linea: string;
  columna: string;
  descripcion: string;

  constructor({ tipo, linea, columna, descripcion }: { tipo: string, linea: string,columna:string, descripcion: string }) {
    const valor = linea;
    const valor2 = columna;
    Object.assign(this, {tipo, linea: valor.toString(), columna: valor2.toString(), descripcion})
  }
}
