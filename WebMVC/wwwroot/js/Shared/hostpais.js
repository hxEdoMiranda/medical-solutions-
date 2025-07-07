import { getParametroByCodigo } from "../apis/parametro.js";

export async function parametrosPais() {
    var baseUrlPais = new URL(window.location.href); // url para pais
    var count = baseUrlPais.hostname.split(".").length - 1
    var codigo;


    var baseUrl = new URL(window.location.href); //url base para servicios.
    if (baseUrl.hostname.includes("inmv")) {
        codigo = "cl";
    }
    else if (baseUrl.hostname.includes("qa")) {
        if (count <= 3) {
            codigo = "cl";
        }
        else {
            codigo = baseUrlPais.hostname.substring(0, 2);
        }
    }
    else {
        if (count <= 2) {
            codigo = "cl";
        }
        else {
            codigo = baseUrlPais.hostname.substring(0, 2);
        }
    }


   
    var result = await getParametroByCodigo(codigo);
    return result;
}