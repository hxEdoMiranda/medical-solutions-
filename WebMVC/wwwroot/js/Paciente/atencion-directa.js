import { putActualizarTriage, postNspPaciente, inicioAtencionPaciente } from '../apis/atencion-fetch.js?rnd=9';
import { personaFotoPerfil } from "../shared/info-user.js?rnd=9";
import { getResultAtencionEspera } from '../apis/resultAtencionEspera-fetch.js?rnd=9';
import { personasDatosByUser, logPacienteViaje } from '../apis/personas-fetch.js?rnd=9';
import { nuevoPacienteUrgencia } from '../apis/correos-fetch.js?rnd=9';

var tipoAccion;
var connectionActualizar;
export async function init(data) {
    document.getElementById("cont-vc").setAttribute('class', 'kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid medismart-atencion');
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

    document.getElementById("btnSalirVC").onclick = async () => {
        await grabarLog(data.atencion.id)
    }
    //datos profesional
    var idMedico = data.atencion.horaMedico.idMedico;
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
//function retornoCanal() {

//    location.href = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
//}

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