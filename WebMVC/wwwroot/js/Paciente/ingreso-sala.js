
import { putActualizarTriage, postNspPaciente, getAtencionEspera, getAtencion, getEstadoFilaUnica, putVolverSala } from '../apis/atencion-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js?rnd=9";
import { EditPhoneEmail, logPacienteViaje } from '../apis/personas-fetch.js?rnd=9';
import { actualizarPreAtencion } from '../apis/pre-atencion-fetch.js?rnd=9';
import { getArchivosByIdEntidad, deleteFile } from '../apis/archivo-fetch.js?rnd=9';
import { putEliminarAtencion } from '../apis/agendar-fetch.js';
var connectionArchivo;
var tipoAccion;
var connection;
var idAtencion = 0;
var atencion = {};
var connectionActualizar;
var idEntidad = 0;
var codEntidad = "ATENCIONES"
var connectionTermino;
var idEspecialidad;
const asyncIntervals = [];
var testCam = false;
let recording = false;
const runAsyncInterval = async (cb, interval, intervalIndex) => {
    await cb();
    if (asyncIntervals[intervalIndex]) {
        setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    }
};

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
const setAsyncInterval = (cb, interval) => {
    if (cb && typeof cb === "function") {
        const intervalIndex = asyncIntervals.length;
        asyncIntervals.push(true);
        runAsyncInterval(cb, interval, intervalIndex);
        return intervalIndex;
    } else {
        throw new Error('Callback must be a function');
    }
};

const clearAsyncInterval = (intervalIndex) => {
    if (asyncIntervals[intervalIndex]) {
        asyncIntervals[intervalIndex] = false;
    }
};
var tipoLista = "lista_archivos_espera";
var rutaDescarga = `${baseUrl}/agendamientos/archivo/DescargarArchivo?id=`;

function validationModalDevices() {
    if (window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia.") || window.host.includes("masproteccionsalud.") || window.host.includes("saludproteccion.") || window.host.includes("saludtumundoseguro.") || idCliente == 1) {
        return
    } else {
        $("#modal-devices").modal("show");
    }
}
export async function init(data) {
   // validationModalDevices();  


    document.querySelector('[name="triageObservacion"]').value = data.atencion.triageObservacion;
    document.querySelector('[name="triageObservacionMobile"]').value = data.atencion.triageObservacion;

    var fechaHoy = moment().format("DD-MM-YYYY HH:mm");
    var fechaCierre = "03-07-2022 07:00";

    //if (idCliente == 1 && (fechaHoy < fechaCierre)) {
    //    swal.fire({
    //        html: `<img src="/img/emojiDemora.png" style="width: 90px;"><br><br>
    //          <strong style="font-size: 15px !important;font-weight: 800;">Ooops!! Lo sentimos!</strong><br><br>
    //          <p>Click Doctor está temporalmente fuera de servicio. La atención se retomará mañana a partir de las 07:00 hrs.</p>
    //          `,
    //        reverseButtons: true,
    //        confirmButtonText: 'ENTENDIDO'
    //    }).then(async (result) => {
    //        retornoCanal();
    //    });
    //    return
    //}

    await personaFotoPerfil();
    //$("#telefonoMedical").inputmask("mask", {
    //    "mask": "(+56) 99 999 9999"
    //});
    let page = document.getElementById('page');
    await agendarRealTime();

    var constraints = { audio: true, video: true };
    try {
        DetectRTC.load(async function () {
            if (window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia.") || window.host.includes("masproteccionsalud.") || window.host.includes("saludproteccion.") || window.host.includes("saludtumundoseguro.") || idCliente == 1) {
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
    if (data.atencion.id > 0) {
        
        idAtencion = data.atencion.id;
        atencion = data.atencion;
        idEspecialidad = data.atencion.idEspecialidadFilaUnica;
        archivoRealTime(idEntidadArchivo, codEntidadArchivo, uid);
        tipoLista = "lista_archivos_espera";

        //await FilaEspera(idAtencion, idEspecialidad);
        if ($("#lista_archivos_espera_mobile").length) {
            tipoLista = "lista_archivos_espera_mobile";
        }

        ActualizarArchivos(idEntidadArchivo, codEntidadArchivo, uid, tipoLista);
        if (detectSmartcheck == 1) {
            listaArchivosSmartcheck(idEntidadArchivo, codEntidadArchivo, uid, tipoLista);
            $("#modalSmartcheck").modal("show");
        }
        window.addEventListener("beforeunload", function (event) {
            if (connectionArchivo.state === signalR.HubConnectionState.Connected) {
                connectionArchivo.invoke('UnsubscribeArchivo', parseInt(idEntidadArchivo), codEntidadArchivo).catch((err) => {
                    return console.error(err.toString());
                });
            }
        });

        try {
            var evento = "";
            switch (idCliente) {
                case 1: evento = "Paciente con atención asignada, no se levanta modal, atención en espera consalud";
                    break;
                case 148: evento = "Paciente con atención asignada, no se levanta modal, atención en espera colmena";
                    break;
                case 108: evento = "Paciente con atención asignada, no se levanta modal, atención en espera coopeuch";
                    break;
                default: evento = "Paciente con atención asignada, no se levanta modal, atención en espera Medismart";
                    break;
            }
            await grabarLog(idAtencion, evento)
            //await ingresoAtencion(idAtencion);
            idEntidad = idAtencion;
            if (window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia") || window.host.includes("masproteccionsalud") || window.host.includes("saludproteccion") || idCliente == 1 ) {
                $("#salaEsperaDesk").show();
                $("#panelEstado").show();
                setAsyncInterval(async () => buscarAtencion(idAtencion), 40000); //10seg
                
            }
            //inicializacion dropzone
            drop()

            //-----------------

            if (atencion.inicioAtencion) {
                connection.invoke("IniciarAtencion", parseInt(atencion.id)).catch(err => console.error(err));
            }
        }
        catch (error) {
            var evento = "catch en atención vigente" + error;
            await grabarLog(idAtencion, evento)
        }
        await terminoAtencionRT(uid, idAtencion);
        //desplegarPanelArchivos();
    }

    else {
        if (idCliente == 1) {
            $('#modal-validacion').modal('show');
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
    if ($("#consentimientounab").length) {
        let consentimientounab = document.getElementById('consentimientounab');
        consentimientounab.onclick = async () => {
            let modalBodyConsentimientounab = document.getElementById('modalBodyConsentimientounab');
            $("#modalBodyConsentimientounab").empty();
            let embed = document.createElement('embed');
            embed.src = "/TerminosyCondicionesUnab/Consentimiento_Informado_VF.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyConsentimientounab.appendChild(embed);
            $("#modalConsentimientounab").modal("show");
        }
    }

    const btnArchivoWeb = document.getElementById('tab-archivos-web');
    btnArchivoWeb.onclick = () => {
        ActualizarArchivos(idEntidadArchivo, codEntidadArchivo, uid, "lista_archivos_espera");
    }

    const btnArchivoMobile = document.getElementById('tab-archivos-mobile');
    btnArchivoMobile.onclick = () => {
        ActualizarArchivos(idEntidadArchivo, codEntidadArchivo, uid, "lista_archivos_mobile");
    }
    let correo = "";
    let telefono = "";
	let htmlSegundaLinea = "";
    let correoExterno = "";
    let telefonoExterno = "";
	if (data.fichaPaciente.correoPlataformaTercero != null)
        correoExterno = data.fichaPaciente.correoPlataformaTercero;
    if (data.fichaPaciente.telefonoPlataformaTercero != null)
        telefonoExterno = data.fichaPaciente.telefonoPlataformaTercero;
    if (data.fichaPaciente.telefonoMovil != null)
        telefono = data.fichaPaciente.telefonoMovil;
    if (data.fichaPaciente.correo != null)
        correo = data.fichaPaciente.correo;

    //completar datos modal términos y condiciones.

    document.getElementById("nombreUsuario").innerHTML = `Hola ${data.fichaPaciente.nombreCompleto}`
    document.getElementById("correoMedical").value = correo;
    document.getElementById("telefonoMedical").value = telefono;

    document.getElementById("btnConfirmarTerminos").onclick = async () => {

        var check = document.getElementById("checkTerminos");
        if (!check.checked) {
            Swal.fire({
                title: `${data.fichaPaciente.nombreCompleto}, es necesario que aceptes los términos y condiciones para acceder a la atención.`,
                text: "",
                type: "question",
                showCancelButton: true,
                cancelButtonColor: 'rgb(190, 190, 190)',
                confirmButtonColor: '#3085d6',
                cancelButtonStyle: 'position:absolute; right:45px',
                customClass: 'swal-wide',
                reverseButtons: true,
                cancelButtonText: "No acepto y deseo salir",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: "Entendido"
            }).then(async (result) => {
                if (!result.value) {
                    retornoCanal();
                }
            });
            return;
        }
        else {
            var radios = document.getElementsByName('customRadio');
            var telefonoUpdate = "";
            var emailUpdate = "";
            emailUpdate = document.getElementById("correoMedical").value;
            telefonoUpdate = document.getElementById("telefonoMedical").value;

            if (emailUpdate == "" || telefonoUpdate == "") {
                Swal.fire("", "Debe completar los datos de contacto", "warning");
                return;
            }
            var emailOk = isEmail(emailUpdate);
            if (!emailOk) {
                Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
                return;
            }
            $('#btnConfirmarTerminos').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            var respuesta = await EditPhoneEmail(emailUpdate, telefonoUpdate, uid);
            var respuestaTerminos = await actualizarPreAtencion(uid, idSesion)
            if (respuestaTerminos.status == "OK") {
                var evento = "Paciente acepta tèrminos y condiciones";
                await grabarLog(0, evento)
                atencion = await getAtencionEspera(uid, idSesion, idCliente, idEspecialidadFU)
                
                if (atencion.id != -1) {
                    try {
                        idAtencion = atencion.id;
                        //await FilaEspera(idAtencion, idEspecialidad);
                        var evento = "Paciente con atención asignada";
                        await grabarLog(idAtencion, evento)
                        //await ingresoAtencion(atencion.id);
                        idEntidad = idAtencion;
                        setAsyncInterval(async () => buscarAtencion(idAtencion), 40000); //10seg
                        window.idEntidadArchivo = idAtencion;
                        window.codEntidadArchivo = 'ATENCIONES';
                        drop();
                        archivoRealTime(idEntidadArchivo, codEntidadArchivo, uid);
                        ActualizarArchivos(idEntidadArchivo, codEntidadArchivo, uid, tipoLista); 

                        if (atencion.inicioAtencion) {
                            connection.invoke("IniciarAtencion", parseInt(atencion.id)).catch(err => console.error(err));
                        }
                        await terminoAtencionRT(uid, idAtencion);
                        $('#modal-validacion').modal('hide');

                        $("#salaEsperaDesk").show();
                        $("#panelEstado").show();
                        setAsyncInterval(async () => buscarAtencion(idAtencion), 40000); //10seg
                    }
                    catch (error) {
                        var evento = "catch despues de aceptar términos y condiciones " + error;
                        await grabarLog(idAtencion, evento, info)
                    }

                }
                else {
                    atencionTerminada();
                }
                $('#btnConfirmarTerminos').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).attr('style', 'padding-right: 3.5rem;');
                desplegarPanelArchivos();
            }

            else {
                $('#btnConfirmarTerminos').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).attr('style', 'padding-right: 3.5rem;');
                return;
            }
        }
    }

    document.getElementById("btnAbandonarAtencion").onclick = async () => {
        nspPaciente(atencion);
    }
    document.getElementById("btnAbandonarAtencionMobile").onclick = async () => {
        nspPaciente(atencion);
    }

    function atencionTerminada() {
        var showCancel = true;
        if (idCliente == 1)
            showCancel = false;
        Swal.fire({
            html: `Ooops!
                   <p>El médico llegó al box de atención y no te encontró disponible.</p>
                   <p>Recuerda estar pendiente de tu posicion en la fila y en la Sala de Espera.</p>
                   <p></p>`,
            title: "",
            type: "warning",
            showConfirmButton: true,
            confirmButtonText: "Salir",
            showCancelButton: showCancel,
            cancelButtonText: "Volver a la sala de espera"
        }).then(async (result) => {
            if (result.value) {
                var evento = "Paciente acepta atención nsp";
                await grabarLog(idAtencion, evento);
                retornoCanal();
            }
            if (result.dismiss == "cancel") {

                var restriccion = restriccionTiempo(idCliente, idEspecialidad)
                if (restriccion == false) {
                    return;
                }
                var resp = await putVolverSala(idAtencion)
                if (resp.status != "NOK") {
                    window.location = `/Ingresar_Sala_FU/${idAtencion}/0`;
                }
            }
        });
    }
    function restriccionTiempo(idCliente, idEspecialidad) {
        var atencionAhora = moment().format("HH:mm");
        switch (idCliente) {
            case 1:
                if (idEspecialidad == 1) {
                    if (atencionAhora > "03:00" && atencionAhora < "08:00") {
                        //if (atencionAhora < "08:00" || atencionAhora > "21:59") {
                        Swal.fire("", "Te recordamos que los horarios para ingresar a una consulta inmediata de Medicina General son 08:00 - 03:00 Hrs.", "error")
                        retornoCanal();
                        return false;
                    }

                }

                else if (idEspecialidad == 4) {
                    if (atencionAhora < "18:00" || atencionAhora > "22:00") {
                        Swal.fire({
                            title: 'Lo sentimos!',
                            html: `<p>Las últimas horas pediátricas han sido ocupadas! Te recomendamos volver en el siguiente bloque de atención.</p><br>
                        <p>Tarde: 18:00 a 22:00</p><br>
                        <p style="font-size: 12px;
                        font-style: italic;
                        font-weight: bold;">*Te recomendamos llegar 15 minutos antes del horario de cierre</p>`,
                            type: 'warning',
                            confirmButtonText: 'Ok',
                        });
                        retornoCanal();
                        return false;
                    }
                }
                break;
            case 148:
                if (idEspecialidad == 1) {
                    if (atencionAhora < "08:00" || atencionAhora > "23:50") {
                        Swal.fire("", "Te recordamos que los horarios para ingresar a una consulta inmediata de Medicina General son 08:00 - 23:59 Hrs.", "error")
                        return false;
                    }
                }
                else if (idEspecialidad == 4) {
                    if (atencionAhora < "18:00" || atencionAhora > "18:50") {
                        Swal.fire({
                            title: 'Lo sentimos!',
                            html: `<p>Las últimas horas pediátricas han sido ocupadas! Te recomendamos volver en el siguiente bloque de atención.</p><br>
                        <p>Tarde: 18:00 a 19:00</p><br>
                        <p style="font-size: 12px;
                        font-style: italic;
                        font-weight: bold;">*Te recomendamos llegar 15 minutos antes del horario de cierre</p>`,
                            type: 'warning',
                            confirmButtonText: 'Ok',
                        });
                        return false;
                    }
                }
                break;
            case 108:
                break;
            default:
                if (idEspecialidad == 1) {
                    if (atencionAhora > "03:00" && atencionAhora < "08:00") {
                        //if (atencionAhora < "08:00" || atencionAhora > "21:59") {
                        Swal.fire("", "Te recordamos que los horarios para ingresar a una consulta inmediata de Medicina General son 08:00 - 03:00 Hrs.", "error")
                        return false;
                    }

                }

        }
    }

   async function FilaEspera(idAtencion, idEspecialidad) {
        if ((codigoTelefono == "CL" || idCliente == 1) && !(idCliente == 359 || idCliente == 242 || idCliente == 108)) {

            var posicion = await getEstadoFilaUnica("A2", 0, idAtencion)
            if (posicion.posicion < 15 && (posicion.minutos < 30 || posicion.minutos == undefined))
                return;
            //demora atención fila con redirección a medicina general agendable
            var msj = 'Estamos con tiempos de espera mayores, por favor mantente en la sala de espera hasta que llegue tu turno.';
            var textoButton = 'ENTENDIDO';
            var visibleAgendable = false;
            var textoAgendable = 'Agendar Hora';
            if (window.host.includes("medismart.live") && idCliente != 1) {
                msj = 'Estamos con tiempos de espera mayores a los habituales, te invitamos a que puedas tomar una hora agendable para una mejor planificación de tu cita médica.';
                visibleAgendable = true;
                textoButton = 'Ir a la fila';
            }
            swal.fire({
                html: `<img src="/img/emojiDemora.png" style="width: 90px;"><br><br>
              <strong style="font-size: 15px !important;font-weight: 800;">Ooops!! Perdón por la demora!</strong><br><br>
              <p>${msj}</p>
              <p style="font-weight: 800;">¡La fila avanza rápido!</p>`,
                reverseButtons: true,
                confirmButtonText: textoButton,
                showCancelButton: visibleAgendable,
                cancelButtonText: textoAgendable

            }).then(async (result) => {
                if (result.dismiss == "cancel") {
                    var valida = await putEliminarAtencion(data.atencion.id, uid, false);
                    window.location = `/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=general`;
                }
            });
        }
    }
  
    async function buscarAtencion(idAtencion) {
        try {
            var info = "";
            var evento = "";
            var atencion = await getAtencion(idAtencion);
            if (atencion.nsp) {
                if ($('.cont-alerta-sala').length) {
                    $('.cont-alerta-sala').addClass('d-none');
                }

                if ($('.alerta-sala').length) {
                    $('.alerta-sala').addClass('d-none');
                }
                atencionTerminada();
                info = atencion.descripcionNSP;
                evento = "Paciente NSP";
                await grabarLog(idAtencion, evento, info)
            };
            var estado = await getEstadoFilaUnica("A2", 0, idAtencion)
            if (estado.mensaje != null && estado.mensaje != "") {
                //web
                //if (estado.posicion === '1') {
                //    document.getElementById('tiempo-desk').setAttribute('class', 'd-none')
                //    document.getElementById('tiempo-mobile').setAttribute('class', 'd-none');
                //    document.getElementById('salaEsperaDesk').classList.add('minSalaEspera');

                //}
                //else {
                    document.getElementById('tiempo-desk').setAttribute('class', 'tiempo-atencion')
                    document.getElementById('tiempo-mobile').setAttribute('class', 'tiempo-atencion');
                //}
                document.getElementById("horaFila-desk").innerHTML = estado.tiempo;
                document.getElementById("posicionFila-desk").innerHTML = estado.posicion;
                //mobile
                document.getElementById("horaFila-mobile").innerHTML = estado.tiempo;
                document.getElementById("posicionFila-mobile").innerHTML = estado.posicion;


                document.getElementById("mensaje").innerHTML = capitalize(estado?.mensaje.toLowerCase()) ;
                document.getElementById("mensajeMobile").innerHTML = capitalize(estado?.mensaje.toLowerCase()) ;
            }
            
            info = "Inicio Atencion = " + atencion.inicioAtencion + " ESTADO = " + atencion.estado + " POSICION = " + estado.posicion;
			evento = "INGRESO A TIMER" ;
            await grabarLog(idAtencion, evento, info)
            if (atencion.inicioAtencion != null && atencion.estado == "I") {
                evento = "médico en call, paciente redireccionado por timer";
                await grabarLog(idAtencion, evento, info)
                swal.fire({
                    title: 'El profesional ya está ingresando a la consulta',
                    text: "Ir a la Atención",
                    type: 'success',
                    showCancelButton: false,
                    reverseButtons: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Continuar',
                    allowOutsideClick: false,
                    allowEscapekey: false
                }).then(async function (result) {
                    if (result.value) {
                        location.href = `/Atencion_Box/${idAtencion}`;
                    }

                });
            }
           
        }
        catch (error) {
            var evento = "catch timer " + error;
            await grabarLog(idAtencion, evento, info)
        }

    }
    async function nspPaciente(atencion) {
        var tittle = `Hola ${atencion.nombrePaciente}: <br><br> Al salir de la sala de espera perderás tu lugar en la fila de atención. Si sales tendrás que tomar la hora nuevamente.`;
        var confirmText = "Quiero salir";
        var cancelText = "Volver a la sala de espera";
        if (idCliente != 1) {
            tittle = `Hola ${atencion.nombrePaciente}: <br><br> Al salir de la sala de espera perderás tu lugar en la fila y tu atención será cancelada automáticamente.`;
            confirmText = "SI, quiero abandonar";
            cancelText = "NO, quiero mantenerme";
        }
            
        Swal.fire({
            title: tittle,
            text: "¿Está seguro de abandonar la atención?",
            type: "question",
            showCancelButton: true,
            cancelButtonColor: 'rgb(190, 190, 190)',
            confirmButtonColor: '#3085d6',
            cancelButtonStyle: 'position:absolute; right:45px',
            customClass: 'swal-wide',
            reverseButtons: true,
            cancelButtonText: cancelText,
            confirmButtonText: confirmText
        }).then(async (result) => {
            if (result.value) {
                var evento = "";
                tipoAccion = "nspPaciente";
                        var resultNsp = await postNspPaciente(idAtencion, uid);
                        if (resultNsp.status != "OK")
                            return;

                        evento = "Paciente abandona atención salir sala de espera Consalud";
                        if (connectionActualizar.state === signalR.HubConnectionState.Connected) {
                            connectionActualizar.invoke('SubscribeCalendarMedico', parseInt(atencion.idMedico)).then(r => {
                                connectionActualizar.invoke("ActualizarListaUrgencia", parseInt(atencion.idMedico), atencion.fecha, atencion.horaDesdeText, tipoAccion).then(r => {
                                    connectionActualizar.invoke('UnsubscribeCalendarMedico', parseInt(atencion.idMedico)).catch(err => console.error(err));
                                }).catch(err => console.error(err));
                            }).catch((err) => {
                                return console.error(err.toString());
                            });
                        }
                       
                await grabarLog(idAtencion, evento);
                retornoCanal();
            }
        });
    }
    function retornoCanal() {
        switch (idCliente) {
            case 1: location.href = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
                break;
            default: location.href = `/`;
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
    function desplegarPanelArchivos() {
        document.getElementById("panel").classList.add("show-panel");
        $("#tab-archivos-web").trigger("click");

        document.getElementById("panel-m").classList.add("show-panel");
        $("#tab-archivos-mobile").trigger("click");
     //   swal.fire({
     //       html: `<img src="/img/emojiDemora.png" style="width: 90px;"><br><br>
					//<strong style="font-size: 15px !important;font-weight: 800;">Ooops!! Perdón por la demora!</strong><br><br>
					//<p>Estamos con tiempos de espera mayores dado el COVID-19, por favor mantente en la sala de espera hasta que llegue tu turno.</p><br>
					//<p style="font-weight: 800;">Importante</p>
					//<p style="font-weight: 800;">Si eres COVID-19 positivo y necesitas atención médica, licencia u orientación, debes adjuntar OBLIGATORIAMENTE en la SALA DE ESPERA tu resultado PCR y/o foto del
					//test de antígeno con la caja que lo contenía para poder llevar a cabo la atención.</p>`,
     //       reverseButtons: true,
     //       confirmButtonText: 'ENTENDIDO'
     //   }).then(async (result) => {
     //       if (result.value) {
     //           document.getElementById("panel").classList.add("show-panel");
     //           $("#tab-archivos-web").trigger("click");

     //           document.getElementById("panel-m").classList.add("show-panel");
     //           $("#tab-archivos-mobile").trigger("click");
     //       }
     //   });
    }
    function drop() {
        window.addEventListener("beforeunload", function (event) {
            if (connectionArchivo.state === signalR.HubConnectionState.Connected) {
                connectionArchivo.invoke('UnsubscribeArchivo', parseInt(idEntidad), codEntidad).catch((err) => {
                    return console.error(err.toString());
                });
            }

        });

        document.querySelectorAll('.eliminar_archivo').forEach(a => a.onclick = (e) => {
            let element = e.target;
            if (!e.target.dataset.idFile) element = e.target.parentElement;
            swal.fire({
                title: 'Eliminar archivo',
                text: element.dataset.nombre,
                type: 'warning',
                showCancelButton: true,
                reverseButtons: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sí, elimínalo'
            }).then(async function (result) {
                if (result.value) {

                    await deleteFile(element.dataset.idFile);
                    connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidadArchivo), codEntidadArchivo).catch(err => console.error(err));
                    ActualizarArchivos(idEntidadArchivo, codEntidadArchivo, uid, tipoLista);
                    swal.fire({
                        position: 'top-right',
                        type: 'success',
                        title: 'Archivo eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        });

        // multiple file upload
        $('#kt_dropzone_3').dropzone({
            url: baseUrl + '/agendamientos/archivo/upload',
            paramName: "file", // The name that will be used to transfer the file
            autoProcessQueue: !0,
            addRemoveLinks: !1,
            dictRemoveFile: "Remover",
            dictCancelUpload: "Cancelar carga",
            dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
            uploadMultiple: 1,
            parallelUploads: 2,
            maxFilesize: 3, // MB,
            dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 3MB',
            acceptedFiles: '.jpeg, .png, .xlsx, .docx, .pdf',
            params: {
                idEntidad: idEntidadArchivo,
                codEntidad: codEntidadArchivo,
                idUsuario: uid
            },

            init: function () {
                const dropzone = this;

                dropzone.on("queuecomplete", function () {
                    ActualizarArchivos(idEntidadArchivo, codEntidadArchivo, uid, "lista_archivos_espera"); 
                    connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidadArchivo), codEntidadArchivo).catch(err => console.error(err));
                });

                dropzone.on("complete", function (file) {
                    dropzone.removeFile(file);
                });
            }
        });
        $('#kt_dropzone_4').dropzone({
            url: baseUrl + '/agendamientos/archivo/upload',
            paramName: "file", // The name that will be used to transfer the file
            autoProcessQueue: !0,
            addRemoveLinks: !1,
            dictRemoveFile: "Remover",
            dictCancelUpload: "Cancelar carga",
            dictCancelUploadConfirmation: "¿Quiéres cancelar esta carga?",
            uploadMultiple: 1,
            parallelUploads: 2,
            maxFilesize: 3, // MB,
            dictFileTooBig: 'Archivo demasiado grande. Tamaño máximo permitido: 3MB',
            acceptedFiles: '.jpeg, .png, .xlsx, .docx, .pdf',
            params: {
                idEntidad: idEntidadArchivo,
                codEntidad: codEntidadArchivo,
                idUsuario: uid
            },

            init: function () {

                const dropzone = this;

                dropzone.on("queuecomplete", function () {
                    ActualizarArchivos(idEntidadArchivo, codEntidadArchivo, uid, "lista_archivos_mobile");
                    connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidadArchivo), codEntidadArchivo).catch(err => console.error(err));
                });

                dropzone.on("complete", function (file) {
                    dropzone.removeFile(file);
                });

            }
        });
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

async function ActualizarArchivos(idEntidad, codEntidad, uid, tipoLista) {
    //

    const rol = document.querySelector('[name="rol"]').value;
    var archivos = await getArchivosByIdEntidad(idEntidad, "");
    const divListaArchivos = document.getElementById(tipoLista);
    while (divListaArchivos.firstChild)
        divListaArchivos.removeChild(divListaArchivos.firstChild);

    archivos.forEach(archivo => {
        if (archivo.codEntidadAsociada == 'ATENCIONES') {
            const divWidget4Item = document.createElement('div');
            divWidget4Item.setAttribute('class', 'kt-widget4__item');
            const divWidget4Pic = document.createElement('div');
            divWidget4Pic.setAttribute('class', 'kt-widget4__pic kt-widget4__pic--icon');
            const iconFile = document.createElement('i');
            iconFile.setAttribute('class', 'flaticon-doc');
            iconFile.setAttribute('style', 'font-size: 2.5rem;');
            const divWidget4Info = document.createElement('div');
            divWidget4Info.setAttribute('class', 'kt-widget4__info');
            const aTitleTexto = document.createElement('p');
            const aTitle = document.createElement('a');
            if (archivo.estado == "E") {
                aTitleTexto.setAttribute('class', '');
                aTitleTexto.setAttribute('style', 'text-decoration:line-through;margin-bottom: 0px;font-weight: 500;color: #c3c6c8;font-size: 14px;');
                aTitleTexto.innerHTML = archivo.nombre;
                divWidget4Info.appendChild(aTitleTexto);
            } else {
                var rutaDes = `${rutaDescarga}${archivo.idenc}`;
                aTitle.href = rutaDes;
                aTitle.target = "_blank";
                aTitle.setAttribute('class', 'kt-widget4__title');
                aTitle.setAttribute('style', 'font-size: 10px;');
                aTitle.innerHTML = archivo.nombre;
                divWidget4Info.appendChild(aTitle);
            }

            const pTexto = document.createElement('p');
            divWidget4Item.appendChild(divWidget4Pic);
            divWidget4Pic.appendChild(iconFile);
            divWidget4Item.appendChild(divWidget4Info);

            divWidget4Info.appendChild(pTexto);

            if (archivo.idUsuario === parseInt(uid) && archivo.estado != "E") {

                const divWidget4Tools = document.createElement('div');
                divWidget4Tools.setAttribute('class', 'kt-widget4__tools');
                const aBtn = document.createElement('a');
                aBtn.href = "#";
                aBtn.setAttribute('class', 'btn btn-sm eliminar_archivo');
                aBtn.setAttribute('style', 'position: sticky;')
                aBtn.setAttribute('data-id-file', archivo.id);

                aBtn.onclick = async () => {
                    swal.fire({
                        title: 'Eliminar archivo',
                        text: archivo.nombre,
                        type: 'warning',
                        showCancelButton: true,
                        reverseButtons: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Sí, elimínalo'
                    }).then(async function (result) {
                        if (result.value) {
                            await deleteFile(archivo.id);
                            connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                            aTitle.remove();
                            pTexto.remove();
                            aTitleTexto.setAttribute('class', 'kt-widget4__title');
                            aTitleTexto.setAttribute('style', 'text-decoration:line-through;margin-bottom: 0px;font-weight: 500;color: #c3c6c8;font-size: 14px;');
                            aTitleTexto.innerHTML = archivo.nombre;
                            divWidget4Info.appendChild(aTitleTexto);
                            pTexto.setAttribute('class', 'kt-widget4__text');

                            divWidget4Info.appendChild(pTexto);
                            divWidget4Tools.remove();
                            swal.fire({
                                position: 'top-right',
                                type: 'success',
                                title: 'Archivo eliminado',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                };
                const iDownload = document.createElement('i');
                iDownload.setAttribute('class', 'flaticon-delete');
                divWidget4Item.appendChild(divWidget4Tools);
                divWidget4Tools.appendChild(aBtn);
                aBtn.appendChild(iDownload);
            }

            divListaArchivos.appendChild(divWidget4Item);


        }
    });
}

async function listaArchivosSmartcheck(idEntidad, codEntidad, uid, tipoLista) {
    //

    var archivos = await getArchivosByIdEntidad(idEntidad, "");
    var i = 0;
    const divListaArchivos = document.getElementById("listaArchivos_smartcheck");
    while (divListaArchivos.firstChild)
        divListaArchivos.removeChild(divListaArchivos.firstChild);

    archivos.forEach(archivo => {
        if (archivo.codEntidadAsociada == 'ATENCIONES') {
            const divWidget4Item = document.createElement('div');
            divWidget4Item.setAttribute('class', 'kt-widget4__item');
            const divWidget4Pic = document.createElement('div');
            divWidget4Pic.setAttribute('class', 'kt-widget4__pic kt-widget4__pic--icon');
            const iconFile = document.createElement('i');
            iconFile.setAttribute('class', 'flaticon-doc');
            iconFile.setAttribute('style', 'font-size: 2.5rem;');
            const divWidget4Info = document.createElement('div');
            divWidget4Info.setAttribute('class', 'kt-widget4__info');
            const aTitleTexto = document.createElement('p');
            const aTitle = document.createElement('a');
            if (archivo.estado == "E") {
                aTitleTexto.setAttribute('class', '');
                aTitleTexto.setAttribute('style', 'text-decoration:line-through;margin-bottom: 0px;font-weight: 500;color: #c3c6c8;font-size: 14px;');
                aTitleTexto.innerHTML = archivo.nombre;
                divWidget4Info.appendChild(aTitleTexto);
            } else {
                var rutaDes = `${rutaDescarga}${archivo.idenc}`;
                aTitle.href = rutaDes;
                aTitle.target = "_blank";
                aTitle.setAttribute('class', 'kt-widget4__title');
                aTitle.setAttribute('style', 'font-size: 10px;');
                aTitle.innerHTML = archivo.nombre;
                divWidget4Info.appendChild(aTitle);
            }

            const pTexto = document.createElement('p');
            divWidget4Item.appendChild(divWidget4Pic);
            divWidget4Pic.appendChild(iconFile);
            divWidget4Item.appendChild(divWidget4Info);

            divWidget4Info.appendChild(pTexto);

            if (archivo.idUsuario === parseInt(uid) && archivo.estado != "E") {

                const divWidget4Tools = document.createElement('div');
                divWidget4Tools.setAttribute('class', 'kt-widget4__tools');
                const aBtn = document.createElement('a');
                aBtn.href = "#";
                aBtn.setAttribute('class', 'btn btn-sm eliminar_archivo');
                aBtn.setAttribute('style', 'position: sticky;')
                aBtn.setAttribute('data-id-file', archivo.id);

                aBtn.onclick = async () => {
                    swal.fire({
                        title: 'Eliminar archivo',
                        text: archivo.nombre,
                        type: 'warning',
                        showCancelButton: true,
                        reverseButtons: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Sí, elimínalo'
                    }).then(async function (result) {
                        if (result.value) {
                            await deleteFile(archivo.id);
                            connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                            aTitle.remove();
                            pTexto.remove();
                            aTitleTexto.setAttribute('class', 'kt-widget4__title');
                            aTitleTexto.setAttribute('style', 'text-decoration:line-through;margin-bottom: 0px;font-weight: 500;color: #c3c6c8;font-size: 14px;');
                            aTitleTexto.innerHTML = archivo.nombre;
                            divWidget4Info.appendChild(aTitleTexto);
                            pTexto.setAttribute('class', 'kt-widget4__text');

                            divWidget4Info.appendChild(pTexto);
                            divWidget4Tools.remove();
                            swal.fire({
                                position: 'top-right',
                                type: 'success',
                                title: 'Archivo eliminado',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                };
                const iDownload = document.createElement('i');
                iDownload.setAttribute('class', 'flaticon-delete');
                divWidget4Item.appendChild(divWidget4Tools);
                //divWidget4Tools.appendChild(aBtn);
                aBtn.appendChild(iDownload);
            }

            divListaArchivos.appendChild(divWidget4Item);


        }
        i++;
    });

    var texto = "Subiste " + i + " archivo(s)";

    $("#titulo_cant_archivos").html(texto);

    if (archivos == '') {
        $("#msj_smartcheck").html("Ya tenemos tus resultados de Smartcheck, !Estás listo para tu atención!");
    } else {
        $("#msj_smartcheck").html("Ya tenemos tus resultados de Smartcheck y tus archivos adjuntos,!Estás listo para tu atención!");
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

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

//#region  ---------REAL TIME------------------

//async function ingresoAtencion(idAtencion) {

//    connection = new signalR.HubConnectionBuilder()
//        .withUrl(`${baseUrl}/ingreso-sala-hub`)
//        .configureLogging(signalR.LogLevel.None)
//        .withAutomaticReconnect()
//        .build();

//    connection.on('IniciarAtencion', async (idAtencion) => {
//        try {
//            var evento = "Real Time médico en call, paciente redireccionado";
//            await grabarLog(idAtencion, evento)
//            Swal.fire({
//                title: 'Ha llegado tu médico',
//                text: "Presiona Ir a la Atención, para ingresar a la atención",
//                allowOutsideClick: false,
//                showConfirmButton: true,
//                confirmButtonText: "Ir a la atención",
//            }).then(async (result) => {
//                if (result.value) {
//                    var evento = "Paciente presiona Ir a la Atención";
//                    await grabarLog(idAtencion, evento)
//                    location.href = "/Paciente/AtencionEspera";
//                }
//            });
//        }
//        catch (error) {
//            var evento = "catch " + error;
//            await grabarLog(idAtencion, evento)
//        }

//        //Swal.fire("Ha llegado tu médico", "Serás redireccionado al box de atención", "success")
//        //location.href = "/Paciente/AtencionEspera"
//    });
//    try {
//        await connection.start();
//    } catch (err) {
//        
//    }

//    if (connection.state === signalR.HubConnectionState.Connected) {
//        connection.invoke('SubscribeAtencionUrgencia', idAtencion).catch((err) => {
//            return console.error(err.toString());
//        });
//    }
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
async function archivoRealTime(idEntidad, codEntidad, uid) {
    connectionArchivo = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/archivoshub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionArchivo.on('ActualizarArchivos', (archivoId) => {
        ActualizarArchivos(idEntidad, codEntidad, uid, tipoLista);

    });

    try {
        await connectionArchivo.start();
    } catch (err) {
        
    }

    if (connectionArchivo.state === signalR.HubConnectionState.Connected) {

        connectionArchivo.invoke('SubscribeArchivo', parseInt(idEntidad), codEntidad).catch((err) => {
            return console.error(err.toString());
        });
    }
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
        connectionTermino.invoke('SubscribeIngresoBox', uid, idCliente).catch((err) => {
            return console.error(err.toString());
        });
    }
}

function selectSecondaryCamera() {
    checkDeviceSupport(function () {
        var secondDevice = videoInputDevices[1];
        if (!secondDevice) return alert('Secondary webcam is NOT available.');

        var videoConstraints = {
            deviceId: secondDevice.deviceId
        };

        if (!!navigator.webkitGetUserMedia) {
            videoConstraints = {
                mandatory: {},
                optional: [{
                    sourceId: secondDevice.deviceId
                }]
            }
        }

        navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        navigator.getUserMedia({ video: videoConstraints }, function (stream) {
            //
        }, function (error) {
            alert(JSON.stringify(error));
        });
    });
}
//#end region
