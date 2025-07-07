import { putActualizarTriage, postNspPaciente, inicioAtencionPaciente } from '../apis/atencion-fetch.js?rnd=9';
import { personaFotoPerfil } from "../shared/info-user.js?rnd=9";
import { getResultAtencionEspera } from '../apis/resultAtencionEspera-fetch.js?rnd=9';
import { personasDatosByUser, logPacienteViaje } from '../apis/personas-fetch.js?rnd=9';
import { nuevoPacienteUrgencia } from '../apis/correos-fetch.js?rnd=9';

var tipoAccion;
var connectionActualizar;
export async function init(data) {
    
    await personaFotoPerfil();
    await agendarRealTime();
    let page = document.getElementById('page');

    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencionPacienteCall == null) {
        await inicioAtencionPaciente(data.atencion.id);
    }
    tipoAccion = "actualizar";
    //nombre medico header chat;
    document.getElementById("headName").innerHTML = data.atencion.nombreMedico;
    page.innerHTML = "Atención con Dr." + data.atencion.nombreMedico;

    document.querySelector("#especialidad").innerHTML = data.atencion.especialidad;

    //click boton salir 
    let btnRetorno = document.getElementById("retorno");
    btnRetorno.onclick = async () => {
        retornoCanal();
        await grabarLog(data.atencion.id)
    }

    document.getElementById("btnSalirVC").onclick = async () => {
        await grabarLog(data.atencion.id)
    }
    //datos profesional
    var idMedico = data.atencion.idMedico;
    var fichaMedico = await personasDatosByUser(idMedico);
    
    if (fichaMedico != null) {
        if (fichaMedico.fotoPerfil != null) {
            var ruta;
            if (!fichaMedico.fotoPerfil.includes('Avatar.svg')) {
                ruta = baseUrl + fichaMedico.fotoPerfil.replace(/\\/g, '/');
            }
            else {
                ruta = baseUrlWeb + '/upload/foto_perfil/' + fichaMedico.fotoPerfil;
            }
        }
    }
    if (connectionActualizar.state === signalR.HubConnectionState.Connected) {
         connectionActualizar.invoke('SubscribeCalendarMedico', parseInt(data.atencion.idMedico)).then(r => {
            connectionActualizar.invoke("ActualizarListaUrgencia", parseInt(data.atencion.idMedico), data.atencion.fecha, data.atencion.horaDesdeText, tipoAccion).then(r => {
                connectionActualizar.invoke('UnsubscribeCalendarMedico', parseInt(data.atencion.idMedico)).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }).catch((err) => {
            return console.error(err.toString());
        });
    }
    $("#divChat").show();
}

async function grabarLog(idAtencion) {
    var log = {
        IdPaciente: uid,
        Evento: "Paciente abandona atención",
        IdAtencion: parseInt(idAtencion)
    }
    await logPacienteViaje(log);
}
function retornoCanal() {
    
    location.href = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
    }
async function nspPaciente(data) {
    Swal.fire({
        title: `Hola ${data.atencion.nombrePaciente}: <br><br> Al salir de la sala de espera  perderás tu lugar en la fila de atención. Si sales tendrás que tomar la hora nuevamente.`,
        text: "¿Está seguro de abandonar la atención?",
        type: "question",
        showCancelButton: true,
        cancelButtonColor: 'rgb(190, 190, 190)',
        confirmButtonColor: '#3085d6',
        cancelButtonStyle: 'position:absolute; right:45px',
        customClass: 'swal-wide',
        reverseButtons: true,
        cancelButtonText: "Volver a la sala de espera",
        confirmButtonText: "Quiero salir"
    }).then(async (result) => {
        if (result.value) {
            
            var resultNsp = await postNspPaciente(data.atencion.id, uid)
            tipoAccion = "nspPaciente";
            if (resultNsp.status == "OK") {
                // no se hace callback por peticion de consalud, excepcion pacientes nsp 
                //await getResultAtencionEspera(data.atencion.id)
                if (connectionActualizar.state === signalR.HubConnectionState.Connected) {
                    connectionActualizar.invoke('SubscribeCalendarMedico', parseInt(data.atencion.idMedico)).then(r => {
                        connectionActualizar.invoke("ActualizarListaUrgencia", parseInt(data.atencion.idMedico), data.atencion.fecha, data.atencion.horaDesdeText, tipoAccion).then(r => {
                            connectionActualizar.invoke('UnsubscribeCalendarMedico', parseInt(data.atencion.idMedico)).catch(err => console.error(err));
                        }).catch(err => console.error(err));
                    }).catch((err) => {
                        return console.error(err.toString());
                    });
                }
                window.onbeforeunload = false;
                retornoCanal();
            }
        }
    });
}
async function agendarRealTime() {

    connectionActualizar = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionActualizar.start();
    } catch (err) {
        
    }


}