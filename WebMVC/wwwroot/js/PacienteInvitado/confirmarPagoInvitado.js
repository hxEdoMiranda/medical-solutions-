import { personaFotoPerfil } from "../shared/info-user.js";
import { getAtencion, getDestinatariosAsociados } from "../apis/atencion-fetch.js";
import { comprobantePaciente, comprobanteMedico, comprobanteProfesionalAsociados } from '../apis/correos-fetch.js?2';

import { TipoAtencion, certificacion, emitirPrebono, EmitirbonoParticular } from "../apis/medipass-fetch.js?10";

var tipoAccion;
var connection;

export async function init(atencion) {
    //await personaFotoPerfil();
    await cargarInfoMedico(atencion);
    let page = document.getElementById('page');

    page.innerHTML = "Agendar atención";
    //if (tipoatencion == "I")
    //    page.innerHTML = "Atención Inmediata";
    await  agendarRealTime();
  
    if (atencion.pagoAprobado || atencion.estado == "I") {
        await comprobantePaciente(baseUrlWeb, atencion);
        await comprobanteMedico(baseUrlWeb, atencion);
        tipoAccion = "actualizar";



        if (atencion.pagoAprobado) {
             try {
                if (atencion.particular) {//particular
                     await EmitirbonoParticular(atencion);

                 } else //fonasa
                 {
                     await emitirPrebono(atencion);

                 }
                 //var resultCert = await certificacion(rutPaciente);

                //if (resultCert.response.data.validarResponse.estado === 1) {
                //    esParticular = false;
                //    planSalud = resultCert.response.data.beneficiario.cotizante.planSalud;
                //}
            } catch (error) {

            }
        }
       


    }
    else if (!atencion.pagoAprobado) {
        tipoAccion = "eliminar";
    }
 

    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('SubscribeCalendarMedico', parseInt(atencion.horaMedico.idMedico)).then(r => {
            connection.invoke("ActualizarCalendarMedico", parseInt(atencion.horaMedico.idMedico), atencion.horaMedico.fecha, atencion.horaDesdeText, tipoAccion).then(r => {
                connection.invoke('UnsubscribeCalendarMedico', parseInt(atencion.horaMedico.idMedico)).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }).catch((err) => {
            return console.error(err.toString());
        });
    }
    // Fin Busqueda inicial

    $('#volverInicio').on('click', async function (ev) {

        window.location = "/paciente/Index";
    });


}
async function cargarInfoMedico(atencion) {
    var foto;
    const divFotoProfesional = document.getElementById('fotoMedico');
    
    if (!atencion.fotoPerfil.includes('Avatar.svg')) {
        foto = baseUrl + atencion.fotoPerfil.replace(/\\/g, '/');
    }
    else {
        foto = baseUrlWeb + '/upload/foto_perfil/' + atencion.fotoPerfil;
    }
       
        divFotoProfesional.src = foto;
}

async function agendarRealTime() {
 
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
    } catch (err) {
        
    }

   
}
