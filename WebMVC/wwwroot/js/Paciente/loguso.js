import { logUsoServicio } from '../apis/log-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js";

export async function init(data) {
    //Tabla TipoServicio
    //ID    Descripcion
    //=====================================
    //1	    Asistencia Toma de Examenes
    //2	    Que Plan

    //Tabla AccionTipoServicio
    //ID    Descripcion
    //=====================================
    //1	    Contacto por Telefonico
    //2	    Contacto por WhatsApp
    //3	    Agendamiento de Hora
    //4	    Consulta de Hora
    //5	    Anulacion de Hora

    //logUsoServicio(idTipoServicio, idAccionServicio, urL_Proceso)

    await personaFotoPerfil();
    

    //Boton llamado orientacion telefonica.
    if ($("#btnOrientacionTelefonica").length) {        
        let btnLog = document.getElementById("btnOrientacionTelefonica");
        btnLog.addEventListener('click', async () => {
            event.preventDefault();
            //alert("clic");
            //await logUsoServicio(1, 1, uid, document.URL, idCliente)
            await logUsoServicio(1, 1, document.URL);//revisar estos ID
            window.location.href = "tel:56228696900";
        });
    }
    //Boton llamado Que Plan
    if ($("#btnLlamanosQuePlan").length) {
        let btnLog = document.getElementById("btnLlamanosQuePlan");
        btnLog.addEventListener('click', async () => {
            event.preventDefault();
            await logUsoServicio(2, 1, document.URL);
            window.location.href = "tel:56228696900";
        });
    }
    //Boton WhatsApp Que Plan
    if ($("#btnWhatsAppQuePlan").length) {
        let btnLog = document.getElementById("btnWhatsAppQuePlan");
        btnLog.addEventListener('click', async () => {
            event.preventDefault();
            await logUsoServicio(2, 2, document.URL);
            window.location.href = "https://wa.me/56948042543?text=Asistencia%20al%20Paciente%20-%20Medismart%20";
        });
    }
    //Boton llamado Asistencia Toma Examenes
    if ($("#btnLlamanosAsistenciaTomaExamenes").length) {
        let btnLog = document.getElementById("btnLlamanosAsistenciaTomaExamenes");
        btnLog.addEventListener('click', async () => {
            event.preventDefault();
            await logUsoServicio(1, 1, document.URL);
            window.location.href = "tel:56228696900";
        });
    }
    //Boton WhatsApp Asistencia Toma Examenes
    if ($("#btnWhatsAppAsistenciaTomaExamenes").length) {
        let btnLog = document.getElementById("btnWhatsAppAsistenciaTomaExamenes");
        btnLog.addEventListener('click', async () => {
            event.preventDefault();
            await logUsoServicio(1, 2, document.URL);
            window.location.href = "https://wa.me/56948042543?text=Asistencia%20al%20Paciente%20-%20Medismart%20";
        });
    }


}