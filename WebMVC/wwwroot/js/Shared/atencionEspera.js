
/*----------------------JS ATENCIÓN VONAGE PACIENTES MODALIDAD DIRECTA---------------------*/

import { enterSession } from '../apis/vonage-fetch.js';
import { getAtencion } from '../apis/atencion-fetch.js';
import { personByUser, logPacienteViaje } from '../apis/personas-fetch.js';
import { getVwHorasMedicoByAtencion } from '../apis/vwhorasmedicos-fetch.js'
import { putActualizarTriage } from '../apis/atencion-fetch.js';
var session;
var connectionCount = 1;
var publisher;
var subscriber
var apiKey;
var sessionId;
var token;
var name;
var isConnected;
var ruta;
var camera_on = true;
var microphone = true;
var subscriber;
var avatarConectado;
var idAtencion;
var retrySignalOnReconnect = true;
var uid;
var idfirmante;
var idCliente;
(async function () {
    uid = document.querySelector('[name="uid"]').value;
    idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    await videoPoster(idAtencion);

    idCliente = document.querySelector('[name="Atencion.IdCliente"]').value;

    if ($("#divChat").length) {
        document.querySelector('#panel_chat').onclick = () => {
            $("#scroll").animate({ scrollTop: 20000000 }, "slow");
            jsPanel('#divChat');

        };
    }

    if ($("#divArchivos").length) {
        document.querySelector('#panel_archivos').onclick = () => {
            const btnArchivos = document.querySelector('[id="panel_archivos"]');

            resetButton();
            document.querySelector('[id="panel_archivos"]').classList.remove('btn-success');
            btnArchivos.classList.add('btn-outline-success')
            jsPanel('#divArchivos');
        };
    }

    if ($("#divHistorial").length) {
        document.querySelector('#panel_historial').onclick = () => {
            const btnArchivos = document.querySelector('[id="panel_historial"]');
            resetButton();
            document.querySelector('[id="panel_historial"]').classList.remove('btn-success');
            btnArchivos.classList.add('btn-outline-success')
            jsPanel('#divHistorial');
        };
    }

    if ($("#divReporte").length) {
        document.querySelector('#panel_reporte').onclick = () => {
            const btnArchivos = document.querySelector('[id="panel_reporte"]');
            resetButton();
            document.querySelector('[id="panel_reporte"]').classList.remove('btn-success');
            btnArchivos.classList.add('btn-outline-success')
            jsPanel('#divReporte');
        };
    }
    if ($("#divReporteEnfermeria").length) {
        document.querySelector('#panel_reporteEnfermeria').onclick = () => {
            const btnReporte = document.querySelector('[id="panel_reporteEnfermeria"]');
            resetButton();
            document.querySelector('[id="panel_reporteEnfermeria"]').classList.remove('btn-success');
            btnReporte.classList.add('btn-outline-success')
            jsPanel('#divReporteEnfermeria');
        };
    }
    if ($("#divAntecedentesMedicos").length) {
        document.querySelector('#panel_antecedentes_medicos').onclick = () => {
            const btnAntecedentes = document.querySelector('[id="panel_antecedentes_medicos"]');
            resetButton();
            //document.querySelector('[id="panel_antecedentes_medicos"]').classList.remove('btn-success');
            //btnAntecedentes.classList.add('btn-outline-success')
            jsPanel('#divAntecedentesMedicos');
        };
    }
    if ($("#reload").length) {
        document.querySelector("#reload").onclick = () => {
            location.reload();
        };
    }

    if ($("#btnCamera").length) {
        document.querySelector('#btnCamera').onclick = () => {
            camera_on = !camera_on;
            publisher.publishVideo(camera_on);

            if (camera_on) {
                document.getElementById("avatarPublisher").classList.add("d-none");
                document.getElementById('btnCamera').innerHTML = '<i class="far fa-video" style="padding-right:unset"></i>';
            }
            else {
                cameraOff();
                document.getElementById('btnCamera').innerHTML = '<i class="far fa-video-slash" style="padding-right:unset"></i>';

            };
        };
    };

    if ($("#btnMic").length) {
        document.querySelector('#btnMic').onclick = () => {
            microphone = !microphone;
            publisher.publishAudio(microphone);
            if (microphone) {
                document.getElementById('btnMic').innerHTML = '<i class="far fa-microphone-alt" style="padding-right:unset"></i>';
            }
            else {
                document.getElementById('btnMic').innerHTML = '<i class="far fa-microphone-alt-slash" style="padding-right:unset"></i>'
            };
        };
    }

    //boton web
    if ($("#btnConfirmar").length) {
        var buttonConfirmar = document.getElementById("btnConfirmar");
        buttonConfirmar.addEventListener("click", async function (event) {
            
            event.preventDefault();
            $('#btnConfirmar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            let valida = await guardarAtencion(parseInt(idAtencion));

            if (valida !== 0) {
                $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                Swal.fire("Ok", "Datos guardados.", "success");
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
        });
    }

    //boton mobile
    if ($("#btnConfirmar2").length) {
        var buttonConfirmar = document.getElementById("btnConfirmar2");
        buttonConfirmar.addEventListener("click", async function (event) {
            
            event.preventDefault();
            $('#btnConfirmar2').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            let valida = await guardarAtencion(parseInt(idAtencion));

            if (valida !== 0) {
                $('#btnConfirmar2').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                Swal.fire("Ok", "Datos guardados.", "success");
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmar2').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
        });
    }

    let result = await enterSession(idAtencion, uid);
    if (!result.error) {
        apiKey = result.apiKey;
        sessionId = result.sessionId;
        token = result.token;
        name = result.name;


        connect();
    }

})();

//--------------------------ingresar triage----------------------------------------
async function guardarAtencion(idAtencion) {
    let triageObservacion = "";
    let antecedentesMedicos = "";

    if (document.querySelector('[name="triageObservacion"]').value != "") {
        triageObservacion = document.querySelector('[name="triageObservacion"]').value
    }
    else if (document.querySelector('[name="triageObservacionMobile"]').value != "") {
        triageObservacion = document.querySelector('[name="triageObservacionMobile"]').value
    }

    if (document.querySelector('[name="antecedentesMedicos"]').value != "") {
        antecedentesMedicos = document.querySelector('[name="antecedentesMedicos"]').value
    }
    else if (document.querySelector('[name="antecedentesMedicosMobile"]').value) {
        antecedentesMedicos = document.querySelector('[name="antecedentesMedicosMobile"]').value
    }
    let atencion = {
        id: parseInt(idAtencion),
        triageObservacion: triageObservacion,
        antecedentesMedicos: antecedentesMedicos,
        idPaciente: uid,
        SospechaCovid19: false
    };
    let resultado = await putActualizarTriage(atencion);

    if (resultado.status === 'NOK') {
        return 0;
    }
    else {
        return resultado;
    }


}
//-------------------------------------------------------------------------------
async function cameraOff() {


    $("#avatarPublisher").empty();
    let imgAvatarPublisher = document.createElement('img');
    let spanInicialesPublisher = document.createElement('span');
    avatarConectado = await personByUser(window.uid);
    if (avatarConectado.rutaAvatar != "") {
        imgAvatarPublisher.src = baseUrl /*'https://localhost:44363'*/ + avatarConectado.rutaAvatar.replace(/\\/g, '/');
        document.getElementById('avatarPublisher').appendChild(imgAvatarPublisher);
    }
    else {
        var iniciales;
        iniciales = avatarConectado.nombre.substring(0, 1) + avatarConectado.apellidoPaterno.substring(0, 1);
        spanInicialesPublisher.innerHTML = iniciales;
        document.getElementById('avatarPublisher').appendChild(spanInicialesPublisher);

    }
    document.getElementById("avatarPublisher").classList.remove("d-none");


}

async function videoPoster(idAtencion, publisher, subscriber) {

    var atencion = await getVwHorasMedicoByAtencion(idAtencion);
    const rol = document.querySelector('[name="rol"]').value;

    switch (rol) {
        case 'Medico':
            ruta = await personByUser(atencion.idPaciente);
            break;
        case 'Paciente':
            ruta = await personByUser(atencion.idMedico);
            break;
        case 'Invitado':
            ruta = await personByUser(atencion.idPaciente);
            break;

    }
    var iniciales;

    iniciales = ruta.nombre.substring(0, 1) + ruta.apellidoPaterno.substring(0, 1);
    document.querySelector("#nombre-profesional").innerHTML = ruta.nombre + " " + ruta.apellidoPaterno;
    if (ruta.rutaAvatar != "") {
        document.querySelector("#inicial").classList.add("d-none");
        document.querySelector(".avatar-profesional").classList.remove("d-none");
        document.getElementById('img-prof').src = baseUrl /*'https://localhost:44363'*/ + ruta.rutaAvatar.replace(/\\/g, '/')
    }
    else {
        document.getElementById('inicial').innerHTML = iniciales;
        document.querySelector("#inicial").classList.remove("d-none");
        document.querySelector("#img-prof").classList.add("d-none");
        document.querySelector(".avatar-profesional").classList.remove("d-none");
    }

    

}

function resetButton() {
    document.querySelector('[id="panel_archivos"]').classList.remove('btn-outline-success');
    document.querySelector('[id="panel_historial"]').classList.remove('btn-outline-success');

    document.querySelector('[id="panel_archivos"]').classList.add('btn-success');
    document.querySelector('[id="panel_historial"]').classList.add('btn-success');

    if ($("#divReporte").length) {
        document.querySelector('[id="panel_reporte"]').classList.remove('btn-outline-success');
        document.querySelector('[id="panel_reporte"]').classList.add('btn-success');
    }
}

function jsPanel(opcion) {
    if ($("#divReporte").length) $("#divReporte").hide();
    if ($("#divReporteEnfermeria").length) $("#divReporteEnfermeria").hide();
    $("#divChat").hide();
    $("#divArchivos").hide();
    $("#divHistorial").hide();
    $("#divAntecedentesMedicos").hide();
    $(opcion).show();
}

function connect() {
    var rol = document.querySelector('[name="rol"]').value;
    var constraints = { audio: true, video: true };
    var evento;
    navigator.mediaDevices.getUserMedia(constraints)
        .then(async function (stream) {
            evento = `${rol} con permisos de video habilitados`;
            await grabarLog(idAtencion, evento);
        })
        .catch(async function (err) {
            evento = `${rol} con permisos de video deshabilitados`;
            await grabarLog(idAtencion, evento);
            Swal.fire("Aviso","Para el funcionamiento de esta video llamada es necesario que habilites los permisos de video y audio. De lo contrario no se podrá realizar la atención","warning")
        });
    
    if (OT.checkSystemRequirements() == 1) {
        session = OT.initSession(apiKey, sessionId); //Inicializamos la session
        //OT.setLogLevel(OT.DEBUG); //debug level
        session.on({
            streamPropertyChanged: function (event) {

                var subscribers = session.getSubscribersForStream(event.stream);
                var publisher = session.getPublisherForStream(event.stream);
               

                var infoStream = event.stream.connection.data.split(',')
                var rolStream = infoStream[4];
                var uidInvitado = infoStream[2];
                var r = rolStream.substring(rolStream.lastIndexOf('=') + 1);

                //Cambio de rolStream en perfil invitado, para que medico quede alineado a la derecha. (solo en perfil invitado.)
                if (rol == "Invitado") {
                    if (r == "Medico") {
                        r = "Invitado";
                    }
                }
                else if (rol=="Paciente") {
                    //event.stream.hasVideo = false;
                    //event.stream.hasAudio = false;
                }
                if (subscribers.length > 0)
                    changeCameraStream(r, subscribers[0].stream.hasVideo, uidInvitado);
            },
            connectionCreated:async function (event) {
                connectionCount++;
                if (event.connection.connectionId != session.connection.connectionId) {
                    try {
                        var evento = `Connection creada ${event.connection.data} rol conectado ${rol}`;
                        await grabarLog(idAtencion, evento);
                    }
                    catch (error) {
                        var evento = error;
                        await grabarLog(idAtencion, evento);
                    }
                    
                }


            },
            connectionDestroyed: function connectionDestroyedHandler(event) {
               
                var infoStream = event.connection.data.split(',')
                var rolStream = infoStream[4];
                var r = rolStream.substring(rolStream.lastIndexOf('=') + 1);
                connectionCount--;
                
            },
            sessionReconnecting: function () {
                mostrarMensaje('Reconectando');
            },
            sessionReconnected: function () {
                mostrarMensaje('Reconectado');
            },
            sessionDisconnected: function (event) {

                
                if (event.reason === "networkDisconnected") {
                    alert("Your network connection terminated.");
                    var infoStream = event.connection.data.split(',')
                    var rolStream = infoStream[4];
                    var r = rolStream.substring(rolStream.lastIndexOf('=') + 1);
                    connectionCount--;
                }
            },
            streamCreated: async function (event) {

                
                try {
                    var evento = `stream creado perfil = ${event.stream.connection.data} camara = ${event.stream.hasVideo} rol conectado ${rol}`;
                    await grabarLog(idAtencion, evento);
                }
                catch (error) {
                    var evento = error;
                    await grabarLog(idAtencion, evento);
                }
                var subscriberProperties = {
                    insertMode: 'append', width: '100%',
                    height: '100%'
                };


                var subscribers = session.getSubscribersForStream(event.stream);
                if (subscribers.length === 0) {

                    subscriber = session.subscribe(event.stream,
                        'subscriber',
                        subscriberProperties,
                        function (error) {
                            if (error) {
                               
                            } else {
                               
                            }
                        });
                    


                    const rol = document.querySelector('[name="rol"]').value;
                    var infoStream = subscriber.stream.connection.data.split(',')
                    var rolStream = infoStream[4];
                    var r = rolStream.substring(rolStream.lastIndexOf('=') + 1);

                    //idusuario stream viene solo, sin identificarlo
                    var uid = infoStream[2];
                    subscriber.element.id = uid;
                    subscriber.element.class = r;

                    var cadenaIniciales = infoStream[3];
                    var iniciales = cadenaIniciales.substring(cadenaIniciales.lastIndexOf('=') + 1)
                    
                    var spanTextoInicial = document.createElement('span');
                    spanTextoInicial.innerHTML = iniciales;
                    let contentVisitor = document.getElementById('contentVisitor');
                    // Aca volver a implementar cuando ingresa el médico a la sala de espera.
                    //if (rol == "Paciente") {
                    //    if (r == "Medico") {
                    //        swal.fire({
                    //            title: 'El profesional ya está ingresando a la consulta',
                    //            text: "Si tienes cambios sin guardar, se guardarán automáticamente",
                    //            type: 'success',
                    //            showCancelButton: false,
                    //            reverseButtons: true,
                    //            cancelButtonText: 'Cancelar',
                    //            confirmButtonText: 'Continuar',
                    //            allowOutsideClick: false,
                    //            allowEscapekey: false
                    //        }).then(async function (result) {
                    //            if (result.value) {
                    //                await guardarAtencion(parseInt(idAtencion));
                    //            }
                    //            if ($(".sala-espera-mobile").length) {
                    //                document.querySelector(".sala-espera-mobile").setAttribute('class', 'd-none');
                    //            }
                    //            document.querySelector(".sala-espera").setAttribute('class', 'd-none');
                    //            document.querySelector(".medismart-atencion").removeAttribute('class', "d-none");
                    //        });

                    //    }
                    //  }
                    
                    if (rol == "Invitado") {
                        if (r == "Medico") {
                            r = "Invitado";
                        }
                    }
                    
                    if ((r != "Paciente" && r != "Medico")) {
                        spanTextoInicial.setAttribute('id', uid + r);
                        document.getElementById(subscriber.element.id).setAttribute('class', 'OT_root OT_subscriber OT_fit-mode-cover OT_mini ' + r);
                        document.querySelectorAll('.Invitado').forEach(item => {
                            //item.setAttribute('style', 'width:100px;height:120px;overflow: hidden;margin-bottom:10px;margin-top:10px;');
                            item.classList.add("cajaInvitado");
                            //spanTextoInicial.setAttribute('style', 'font-size: 3rem;color: #FFF;display:flex;align-items:center;justify-content:center;position:absolute;z-index:100;left:0;right:0;top:0;bottom:0;border-radius:10px;');
                            spanTextoInicial.classList.add("textoInicial");
                            item.appendChild(spanTextoInicial);
                            contentVisitor.appendChild(item);
                        })
                    }
                    changeCameraStream(r, subscriber.stream.hasVideo, uid);
                }
            },
            streamDestroyed: async function (event) {
                const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
                let estadoAtencion = await getAtencion(idAtencion);
                const rol = document.querySelector('[name="rol"]').value;
                if (rol === 'Paciente' && estadoAtencion.estado == "T") {
                    window.onbeforeunload = false;
                        window.location = `/InformeAtencion/${idAtencion}`;
                }
                if (rol === 'Medico' && estadoAtencion.estado == "T") {
                    window.onbeforeunload = false;
                    window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}&sendInforme=false`;
                }
                var subscribers = session.getSubscribersForStream(event.stream);
                
                if (subscribers.length > 0) {
                    var subscriber = document.getElementById(subscribers[0].id);
                    // Display error message inside the Subscriber
                    subscriber.innerHTML = 'Lost connection. This could be due to your internet connection '
                        + 'or because the other party lost their connection.';
                }
                

                connectionCount--;
                var infoStream = event.stream.connection.data.split(',')
                var rolStream = infoStream[4];
                var r = rolStream.substring(rolStream.lastIndexOf('=') + 1);
                connectionCount--;
            }
        });





        session.connect(token, function (error) {

            const rol = document.querySelector('[name="rol"]').value;
            if (error) {
                document.getElementById('overlay_text').innerText = 'Error connecting to the session.';
                return;
            }

            if (session.capabilities.publish == 1) {
                if (rol === "Invitado") {
                    cameraOff();
                    document.getElementById('btnCamera').innerHTML = '<i class="far fa-video-slash" style="padding-right:unset"></i>';
                    document.getElementById('btnMic').innerHTML = '<i class="far fa-microphone-alt-slash" style="padding-right:unset"></i>';
                    camera_on = false;
                    microphone = false;
                    publisher = OT.initPublisher('publisher',
                        {
                            insertMode: 'append',
                            width: '100%',
                            height: '100%',
                            publishVideo: false,
                            publishAudio: false
                        });
                    publisher.on({
                        streamCreated: function (event) {
                            
                        },
                        streamDestroyed: function (event) {
                            
                            connectionCount--;
                        }
                    });
                    session.publish(publisher);
                }
                else {
                    publisher = OT.initPublisher('publisher',
                        {
                            insertMode: 'append',
                            width: '100%',
                            height: '100%'
                        });
                    publisher.on({
                        streamCreated: function (event) {
                            
                        },
                        streamDestroyed: function (event) {
                            
                            connectionCount--;
                        }
                    });
                    session.publish(publisher);
                    if ($(".img-pro").length)
                        document.querySelector(".avatar-profesional").classList.add("d-none");
                }
            } else {
                
            }
            document.getElementById('overlay_text').innerText = 'Connected to the session.';

            document.getElementById("overlay_text").style.display = "none";
            document.getElementById('btnCamera').style.display = "block";
            document.getElementById("overlay").classList.add('fondo-vc');
            // document.getElementById("overlay").setAttribute('style', 'background:transparent')

            //document.querySelector('#btnCall').removeAttribute('disabled');
            //document.querySelector('#btnCamera').removeAttribute('disabled');
            //document.querySelector('#btnMic').removeAttribute('disabled');
        });
    } else {
        alert('Cliente no soporta WebRTC');
    }
}

// funcion para mostrar avatars al activar o desactivar camara segun roles de stream
function changeCameraStream(r, subscriber, uid) {

    const rol = document.querySelector('[name="rol"]').value;
    if (!subscriber) {
        switch (rol) {
            case 'Paciente':
                if (r === "Medico" || r === "Paciente") {
                    videoPoster(idAtencion);
                }
                else {
                    document.getElementById(uid + r).classList.remove("d-none")
                }
                break;
            case 'Invitado':
                if (r === "Medico" || r === "Paciente") {
                    videoPoster(idAtencion);
                }
                else {
                    document.getElementById(uid + r).classList.remove("d-none")
                }
                break;
            case 'Medico':
                if (r === "Medico" || r === "Paciente") {
                    videoPoster(idAtencion);
                }
                else {
                    document.getElementById(uid + r).classList.remove("d-none")
                }
                break;
        }

    }
    else {
        switch (rol) {
            case 'Paciente':
                if (r === "Medico" || r === "Paciente") {
                    document.querySelector(".avatar-profesional").classList.add("d-none");
                }
                else {
                    document.getElementById(uid + r).classList.add("d-none");
                }
                break;
            case 'Invitado':
                if (r === "Medico" || r === "Paciente") {
                    document.querySelector(".avatar-profesional").classList.add("d-none");
                }
                else {
                    document.getElementById(uid + r).classList.add("d-none");
                }

                break;
            case 'Medico':
                if (r === "Medico" || r === "Paciente") {
                    document.querySelector(".avatar-profesional").classList.add("d-none");
                }
                else {
                    document.getElementById(uid + r).classList.add("d-none");
                }
                break;
        }
    }
}

async function grabarLog(idAtencion, evento, info) {
    
    var log = {
        IdPaciente: 0,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
}

function mostrarMensaje(mensaje) {
    document.querySelector('#overlay_text').innerHTML = mensaje;
    document.getElementById("overlay_text").style.display = "block";
}

function disconnect() {
    connectionCount--;
    session.unpublish(publisher, function (error) {
        
    });
    session.disconnect();
}