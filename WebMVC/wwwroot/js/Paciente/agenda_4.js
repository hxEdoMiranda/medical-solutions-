

import { PostPago, valorizar, emitirPrebono, EmitirbonoParticular, certificacion } from "../apis/medipass-fetch.js?rnd=199";
import { getAgendaByIdMedicoHora, putAgendarMedicosHoras } from '../apis/agendar-fetch.js';
import { setCorreoUsuario, personaFotoPerfil } from "../shared/info-user.js";
import { enviarCitaEniax, cambioEstado } from "../apis/eniax-fetch.js?rnd=1";
import { getHashAtencionExistente } from '../apis/atencion-fetch.js';



var connection;
var connectionAgendar;
var rutUsuario = "";
var valorAtencion = 0;
var valorizacion = null;
export async function init(data) {
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    }

    await personaFotoPerfil();
    let page = document.getElementById('page');

    if (window.tipoatencion == null || window.tipoatencion == "") {
        tipoatencion = "A";//Agendable
    }
    page.innerHTML = "Agendar atención";
    if (tipoatencion == "I")
        page.innerHTML = "Atención Inmediata";
    rutUsuario = await setCorreoUsuario();
    await agendarRealTime();
    const divFotoProfesional = document.getElementById('fotoProfesional')
    if (!data.personas.rutaAvatar.includes('Avatar.svg')) {
        divFotoProfesional.src = baseUrl + data.personas.rutaAvatar.replace(/\\/g, '/');
    }
    else {
        divFotoProfesional.src = baseUrlWeb + '/upload/foto_perfil/' + data.personas.rutaAvatar;
    }
    var agenda = await getAgendaByIdMedicoHora(idMedicoHora);


    if (m === "2") {
        
        if ((r === "1" || r === "2")) {
            valorAtencion = data.personasDatos.valorAtencion;
        } else {
               valorizacion = await valorizar(data.personasDatos.especialidad,
                rutUsuario,
                data.personas.identificador,
                data.personasDatos.codigoPrestacion,
                document.getElementById('genero').value,
                document.getElementById('fechaNacimiento').value,
                data.personasDatos.valorAtencion,
                data.personasDatos.idSucursal.toString(),
                data.personasDatos.idLugarAtencion.toString(),
                idAtencion,true);


            if (valorizacion) {
                
               if (!valorizacion.particular) {
                    valorAtencion = valorizacion.copago;
                } else {
                      valorAtencion = valorizacion.valorConvenio;
                }
            }

        }
       
    }
    if (valorAtencion == 0) {
       document.getElementById("btnConfirmar").innerHTML = "Confirmar";
    }

    

    document.getElementById("valorAtencion").innerHTML = formatNumber(valorAtencion).toLocaleString();
    //if ($("#valorAtencionDirecta").length) {
    //    document.getElementById("valorAtencionDirecta").innerHTML = formatNumber(valorAtencion).toLocaleString();
    //}
    var buttonConfirmar = document.getElementById("btnConfirmar");

    buttonConfirmar.addEventListener("click", async function (event) {
        event.preventDefault();
        document.getElementById('btnConfirmar')?.classList.add("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
        document.getElementById('btnConfirmar')?.setAttribute('disabled', true);
        
        var estadoAtencion = "";
        if (valorAtencion == 0) {
            estadoAtencion = "I";
            let agendar = {
                id: idAtencion,
                idBloqueHora: idBloqueHora,
                fechaText: fechaSeleccion,
                idPaciente: uid,
                SospechaCovid19: false,
                IdMedicoHora: idMedicoHora,
                Estado: estadoAtencion,

            };
            let valida = await putAgendarMedicosHoras(agendar, idMedico, uid);

            var url = "/Paciente/ConfirmarAtencion" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&anura=" + checkAnura;


            if (valida.status === "NOK") {
                if (valida.err == 3) {


                    swal.fire({
                        title: valida.msg,
                        text: "¿Desea agendar nuevamente?",
                        type: 'error',
                        showCancelButton: true,
                        reverseButtons: true,
                        cancelButtonText: 'No, volver a Atenciones',
                        confirmButtonText: 'Sí, ir a Agendar'
                    }).then(async function (result) {
                        if (result.value) {
                            window.location.href = "Agendar"
                        }
                        else {
                            window.location.href = "Index";
                        }
                    });
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                }
                else {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                }
            }
            else {
                if (connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {

                        connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "actualizar").then(r => {
                            connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                        }).catch(err => console.error(err));
                    }).catch((err) => {
                        return console.error(err.toString());
                    });
                }

                connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {

                    return console.error(err.toString());
                });
                if (estadoAtencion === "I" && !valida.infoAtencion.atencionDirecta) {
                    if (!window.host.includes('unabactiva.') && !window.host.includes('activa.unab.') && !window.host.includes('achs.') && !window.host.includes('uoh')) {
                        await enviarCitaEniax(valida.infoAtencion.idAtencion);
                    }
                }

                $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a').format("YYYY-MM-DD HH:mm:ss");
                if (valida.infoAtencion.atencionDirecta) {
                    url = `/Ingresar_Sala_FU/${valida.infoAtencion.idAtencion}`;
                }

               


                location.href = url;

                
            }
        }
        else
        {
                // Emision Pre Bono Medipass
            var hashBono = null;
            if (!valorizacion || valorizacion.particular) {  
                //particular
                hashBono =await EmitirbonoParticular(data.atencion);
                //hashBono = data.atencion.id;
            }
            else //fonasa
            {
                 hashBono = await emitirPrebono(data.atencion);
            }
            if (hashBono) {
               var validaAtencionRepetida = await getHashAtencionExistente(uid, hashBono, data.atencion.id);
               if (validaAtencionRepetida.status == "EXISTE") {
                   Swal.fire({
                    title: '<strong>Hora pendiente</strong>',
                    icon: 'info',
                    html:
                   'Tienes una hora pendiente con el mismo profesional',
                    showCloseButton: true,
                    showCancelButton: false,
                   focusConfirm: false,
                   confirmButtonText:
                   '<i class="fa fa-thumbs-up"></i> Entendido!',
                   confirmButtonAriaLabel: 'Entendido!'
                   });
               }
               else {
                   var responseJson = await PostPago(hashBono, document.getElementById('correoUsuario').value, agenda.especialidad, valorAtencion);
                   if (responseJson)
                       window.location.href = responseJson.url_redirect;
               }
                
            }
            //idAtencion, correoUsuario, especialidad, valorAtencion
        }
       

    });
};

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

    connectionAgendar = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/agendarpacientehub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionAgendar.start();
    } catch (err) {
        
    }
}