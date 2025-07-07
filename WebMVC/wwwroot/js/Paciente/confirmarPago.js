import { personaFotoPerfil } from "../shared/info-user.js";
import { getAtencion, getDestinatariosAsociados } from "../apis/atencion-fetch.js";
import { comprobantePaciente, comprobanteMedico, comprobanteProfesionalAsociados } from '../apis/correos-fetch.js?2';
import { getProgramaSaludCiclo, getProgramaSaludRecurrencia, postRecurrencia } from "../apis/programa-salud-fetch.js";



var tipoAccion;
var connection;

export async function init(atencion) {
    //await personaFotoPerfil();
    await cargarInfoMedico(atencion);
    let page = document.getElementById('page');

    page.innerHTML = "Agendar atención";
    if (tipoatencion == "I")
        page.innerHTML = "Atención Inmediata";
    await  agendarRealTime();
  
    if (atencion.pagoAprobado || atencion.estado == "I") {
        // Parche url UNAB
        let locationHref = new URL(window.location.href);
        let url = (locationHref.hostname.includes('unabactiva.') || locationHref.hostname.includes('activa.unab.')) ? locationHref.origin : baseUrlWeb;
        await comprobantePaciente(url, atencion);
        await comprobanteMedico(url, atencion);
        tipoAccion = "actualizar";

        //let destinatarios = await getDestinatariosAsociados(atencion.id)


        //if (destinatarios.correoInvitados.length != 0) {
        //    atencion.correoInvitados = destinatarios.correoInvitados;
        //    await comprobanteProfesionalAsociados(baseUrlWeb, atencion);
        //}
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
    if (atencion.isProgramaSalud) {
        const programaSaludCliclo = await getProgramaSaludCiclo(atencion.idPaciente, atencion.idCliente, atencion.idProgramaSalud);
        if (programaSaludCliclo) {
            let programaEspecialidad = await getProgramaSaludRecurrencia(programaSaludCliclo, atencion.horaMedico.idEspecialidad);
            if (programaEspecialidad) {
                if (programaEspecialidad.initDate == null) {
                    programaEspecialidad.initDate = atencion.horaMedico.fecha;
                    await postRecurrencia(programaEspecialidad);
                }
            }
        }
    }

    $('#volverInicio').on('click', async function (ev) {
        document.getElementById('volverInicio').classList.add("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
        window.location = "/";
    });

    if ($('#volverAtenciones')) {
        $('#volverAtenciones').on('click', async function (ev) {

            window.location = "/Paciente/Index";
        });
    }


}
async function cargarInfoMedico(atencion) {
    var foto;
    var baseS3 = 'https://appdiscoec2.s3.amazonaws.com'
    const divFotoProfesional = document.getElementById('fotoMedico');
    
    if (!atencion.fotoPerfil.includes('Avatar.svg') && (!window.host.includes("unabactiva.") && !window.host.includes("activa.unab")))
    {
        foto = baseS3 + atencion.fotoPerfil.replace(/\\/g, '/');
    }
    else if (window.host.includes("unabactiva.") || window.host.includes("activa.unab.")) {
        if (atencion.datosMedico.genero == "F") {
            foto = baseUrlWeb + '/img/unab/doctora.svg';
        }
        else {
            foto = baseUrlWeb + '/img/unab/doctor.svg';
        }
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
