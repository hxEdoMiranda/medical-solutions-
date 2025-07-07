import { personaFotoPerfil } from "../shared/info-user.js";
import { inicioAtencionPaciente, putActualizarTriage } from '../apis/atencion-fetch.js';
import { logPacienteViaje } from '../apis/personas-fetch.js';
var connectionTermino;
var testCam = false;
let recording = false;  

function validationModalDevices() {
    if (window.location.host.includes("prevenciononcologica") || window.location.host.includes("clinicamundoscotia.") || window.location.host.includes("masproteccionsalud.") || window.location.host.includes("saludproteccion.") || window.location.host.includes("saludtumundoseguro.") || idCliente == 1) {
        return
    } else {
        $("#modal-devices").modal("show");
    }
}

export async function init(data) {
    validationModalDevices();  
    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencionPacienteCall == null) {
        await inicioAtencionPaciente(data.atencion.id);
    }
    const uid = document.querySelector('[name="uid"]').value;
    await personaFotoPerfil();
    let page = document.getElementById('page');
    document.querySelector('[name="triageObservacion"]').value = data.atencion.triageObservacion;
    document.querySelector('[name="triageObservacionMobile"]').value = data.atencion.triageObservacion;
    //page.innerHTML = "Atención con Dr." + data.atencion.nombreMedico;
    page.innerHTML = `Atención con ${data.atencion.prefijoProfesional} ${data.atencion.nombreMedico}`;

    const idAtencion = data.atencion.id;
    await terminoAtencionRT(uid, idAtencion);

    var constraints = { audio: true, video: true };
    try {
        DetectRTC.load(async function () {
            if (window.location.host.includes("prevenciononcologica") || window.location.host.includes("clinicamundoscotia.") || window.location.host.includes("masproteccionsalud.") || window.location.host.includes("saludproteccion.") || window.location.host.includes("saludtumundoseguro.") || idCliente == 1) {
				return
            } 
            var audioInputDevices = DetectRTC.audioInputDevices    // microphones
            var audioOutputDevices = DetectRTC.audioOutputDevices   // speakers
            var videoInputDevices = DetectRTC.videoInputDevices    // cameras
            var permisoMic = DetectRTC.isWebsiteHasMicrophonePermissions;
            var permisoCamara = DetectRTC.isWebsiteHasWebcamPermissions;
            var permisoAudio = DetectRTC.isWebsiteHasSpeakersPermissions;
            var existeMic = DetectRTC.hasMicrophone;
            var existeCam = DetectRTC.hasWebcam;
            var existeAudio = DetectRTC.hasSpeakers;
            var mobilDevice = DetectRTC.isMobileDevice;
            var browser = DetectRTC.browser.name;
            DetectRTC.isWebsiteHasWebcamPermissions = true;
            var evento = `Paciente MicrophonePermissions: ${permisoMic} - WebcamPermissions: ${permisoCamara} - dispositivo mic: ${existeMic} - dispositivo cam: ${existeCam} -  Dispositivo Mobile: ${mobilDevice} -  Navegador:  ${browser} - (Sala de espera Consalud)`;
            await grabarLog(data.atencion.id, evento);

            var video = document.getElementById('test-video');
            var mic = document.getElementById('test-mic');

            if (existeCam) {
                if (!permisoCamara) {
                    $(".modal-devices-camara-estado-activa").hide();
                    $(".modal-devices-camara-estado-inactivo").show();
                    //$("#modal-devices").modal("show");
                }


                document.querySelector('#btn-test-video').addEventListener('click', function () {
                    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                        .then(function (stream) {
                            if (!testCam) {
                                video.srcObject = stream;
                                video.play();
                                testCam = true;
                                $(".modal-devices-camara-estado-activa")
                                $("#btn-test-video").text("DETENER PRUEBA");
                            } else {
                                stream.getVideoTracks()[0].stop();
                                video.srcObject = stream;
                                testCam = false;
                                $("#btn-test-video").text("PROBAR CÁMARA");
                            }
                            permisoCamara = true
                            $(".modal-devices-camara-estado-activa").show();
                            $(".modal-devices-camara-estado-inactivo").hide();

                        })

                });
            }

            if (existeAudio) {
                document.querySelector('#btn-test-audio').addEventListener('click', function () {
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.autoplay = true;
                    audio.src = '/notifications/alertNuevaAtencion.mp3';
                })
            } else
                //$("#modal-devices").modal("show");





                if (existeMic) {
                    if (!permisoMic) {
                        $(".modal-devices-microfono-estado-activa").hide();
                        $(".modal-devices-microfono-estado-inactivo").show();
                        //$("#modal-devices").modal("show");
                    }

                    var media = null;//guardar el steam actual
                    $("#record").on("click", () => {
                        navigator.mediaDevices.getUserMedia({ audio: true })
                            .then(function (stream) {
                                const mediaRecorder = new MediaRecorder(stream);
                                let chunks = [];
                                mediaRecorder.ondataavailable = (event) => {
                                    chunks.push(event.data);
                                }
                                mediaRecorder.onstop = () => {
                                    const audio = new Audio();
                                    audio.setAttribute("controls", "");
                                    document.getElementById("sound-clip").innerHTML = '';
                                    $("#sound-clip").append(audio);
                                    $("#sound-clip").append("<br />");
                                    const blob = new Blob(chunks, { "type": "audio/ogg; codecs=opus" });
                                    audio.src = window.URL.createObjectURL(blob);
                                    chunks = [];
                                };
                                if (!recording) {
                                    document.getElementById("sound-clip").innerHTML = '';
                                    mediaRecorder.start();
                                    media = mediaRecorder;
                                    recording = true;
                                    $("#record").html("DETENER");
                                } else {
                                    media.stop();
                                    recording = false;
                                    stream.getAudioTracks()[0].stop();
                                    $("#record").html("GRABAR");

                                }
                                permisoMic = true
                                $(".modal-devices-microfono-estado-activa").show();
                                $(".modal-devices-microfono-estado-inactivo").hide();
                                setTimeout(() => {
                                    media.stop();
                                    recording = false;
                                    stream.getAudioTracks()[0].stop();
                                    $("#record").html("GRABAR");
                                }, 5000);
                            });
                    });
                }
            //$("#modal-devices").modal("show");
            //        navigator.mediaDevices.getUserMedia(constraints)
            //            .then(async function (stream) {
            //            })
            //            .catch(async function (err) {

            ////Swal.fire("Aviso", "Para el funcionamiento de esta video llamada es necesario que habilites los permisos de video y audio. De lo contrario no se podrá realizar la atención", "warning")
            //            });
        });
    }
    catch (err) {
        var evento = "catch error";
        await grabarLog(data.atencion.id, evento);
    }
    //click boton salir 
    if ($("#retorno").length) {
        let btnRetorno = document.getElementById("retorno");
        btnRetorno.onclick = async () => {
            var evento = "Paciente abandona atención salir layout";
            await grabarLog(idAtencion, evento);
            window.onbeforeunload = false;
            location.href = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
        }
    }

    if ($("#consentimiento").length) {
        let consentimiento = document.getElementById('consentimiento');
        consentimiento.onclick = async () => {
            let modalBodyConsentimiento = document.getElementById('modalBodyConsentimiento');
            $("#modalBodyConsentimiento").empty();
            let embed = document.createElement('embed');
            embed.src = "/Consentimiento-Informado/Consentimiento-Informado.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyConsentimiento.appendChild(embed);
            $("#modalConsentimiento").modal("show");
        }
    }
    if ($("#consentimientoco").length) {
        let consentimientoco = document.getElementById('consentimientoco');
        consentimientoco.onclick = async () => {
            let modalBodyConsentimientoco = document.getElementById('modalBodyConsentimientoco');
            $("#modalBodyConsentimientoco").empty();
            let embed = document.createElement('embed');
            embed.src = "/documentosLegalesCO/CONSENTIMIENTO-INFORMADO-PARA-ATENCION-POR-TELEMEDICINA-Medical-Solutions-Colombia.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyConsentimientoco.appendChild(embed);
            $("#modalConsentimientoco").modal("show");
        }
    }
    if ($("#consentimientomx").length) {
        let consentimientomx = document.getElementById('consentimientomx');
        consentimientomx.onclick = async () => {
            let modalBodyConsentimientomx = document.getElementById('modalBodyConsentimientomx');
            $("#modalBodyConsentimientomx").empty();
            let embed = document.createElement('embed');
            embed.src = "/documentosLegalesMX/Consentimiento-InformadoMX.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyConsentimientomx.appendChild(embed);
            $("#modalConsentimientomx").modal("show");
        }
    }
    if ($("#consentimientoec").length) {
        let consentimientoec = document.getElementById('consentimientoec');
        consentimientoec.onclick = async () => {
            let modalBodyConsentimientoec = document.getElementById('modalBodyConsentimientoec');
            $("#modalBodyConsentimientoec").empty();
            let embed = document.createElement('embed');
            embed.src = "/documentosLegalesEC/CONSENTIMIENTO-INFORMADO-MEDISMART-ECUADOR-SAS.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyConsentimientoec.appendChild(embed);
            $("#modalConsentimientoec").modal("show");
        }
    }
    document.getElementById("btnAbandonarAtencion").onclick = async () => {
        var log = {
            IdPaciente: uid,
            Evento: "Paciente abandona atención",
            IdAtencion: parseInt(data.atencion.id)
        }
        await logPacienteViaje(log);
        var urlSalir = `/Paciente/Index`;

        if (data.atencion.idCliente === 1) {
            urlSalir = `/Account/logout?rol=Paciente`;
        }
        else if (location.origin.includes("happ.")) {
            urlSalir = '/Account/logout?rol=Paciente';
        } 

        window.onbeforeunload = false;
        window.location = urlSalir;

    }
    if ($("#hs-g").length) {
        var btnIngresar = document.getElementById("hs-g");
        btnIngresar.onclick = () => {
            location.href = `/Atencion_Box/${data.atencion.id}`;
        }
    }

    if ($("#volverSala").length) {
        var btnVolver = document.getElementById("volverSala");
        btnVolver.onclick = () => {
            debugger
            window.onbeforeunload = false;
            if (data.atencion.idCliente === 1) {
                location.href = `/Account/logout?rol=Paciente`;
            }
            else if (location.origin.includes("happ.")) {
                location.href = '/Account/logout?rol=Paciente';
            } 
            location.href = `/Paciente/Index`;
        }
    }

    if ($("#ingreso-m").length) {
        var btnIngresar = document.getElementById("ingreso-m");
        btnIngresar.onclick = () => {
            location.href = `/Atencion_Box/${data.atencion.id}`;
        }
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


  

};
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

async function grabarLog(idAtencion, evento, info) {
    var log = {
        IdPaciente: uid,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
}

async function terminoAtencionRT(uid, id) {
    connectionTermino = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxhub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionTermino.on('TerminoAtencion', (id) => {
        var urlInforme = `/InformeAtencion/${id}`;
        swal.fire({
            title: 'La Atención ha finalizado',
            text: 'Serás redireccionado de forma automática al informe de atención',
            type: 'success',
            reverseButtons: true,
            confirmButtonText: 'Ok'
        }).then(async function (result) {
            window.onbeforeunload = false;
            location.href = urlInforme;
        });
    });

    try {
        await connectionTermino.start();
    } catch (err) {
        
    }

    if (connectionTermino.state === signalR.HubConnectionState.Connected) {
        connectionTermino.invoke('SubscribeIngresoBox', parseInt(uid), parseInt(idCliente)).catch((err) => {
            return console.error(err.toString());
        });
    }
}