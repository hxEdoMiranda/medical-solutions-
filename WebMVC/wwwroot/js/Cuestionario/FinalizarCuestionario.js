import { personaFotoPerfil } from "../shared/info-user.js";
import { getAtencion, getDestinatariosAsociados } from "../apis/atencion-fetch.js";
import { comprobantePaciente, comprobanteMedico, comprobanteProfesionalAsociados } from '../apis/correos-fetch.js?2';

import { TipoAtencion, certificacion, emitirPrebono, EmitirbonoParticular } from "../apis/medipass-fetch.js?10";

var tipoAccion;
var connection;

export async function init(atencion) {

    $('#Siguiente').on('click', async function (ev) {
        let isOcupacional = window.ocupacional ?? 0;
        window.location = "/Cuestionario/ListadoCuestionario?ocupacional=" + isOcupacional;
    });


}
