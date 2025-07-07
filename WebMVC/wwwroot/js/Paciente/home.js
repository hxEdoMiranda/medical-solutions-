
import { personaHome, saludoPaciente } from '../shared/info-user.js?rnd=4';
import { getDatosPaciente, EditPhoneEmail, logPacienteViaje, getBeneficiarios, cambiarBeneficiario, cambioIdCliente, getEdadBeneficiarioById, updateEstadoNotice, cambioIdClienteVip } from '../apis/personas-fetch.js?7';
import { putEliminarAtencion, confirmaPaciente, reagendarApp } from '../apis/agendar-fetch.js';
import { comprobanteAnulacion, comprobantePaciente } from '../apis/correos-fetch.js?1';
import { getHoraMedicoByCalendar, getAtencionPendienteSala } from '../apis/vwhorasmedicos-fetch.js?1';
import { getAgendaMedicoInicial } from '../apis/agendar-fetch.js'
import { putAgendarMedicosHoras, getAtencionByIdMedicoHora } from '../apis/agendar-fetch.js';
import { cambioEstado, enviarCitaEniax } from "../apis/eniax-fetch.js";
import { putVolverSala } from "../apis/atencion-fetch.js?1";
import { EditInfoPerfilInvitado, EditInfoPerfilInvitadoFirebase, findByUsername, findUsernameConvenio, personByUser, DeleteCookiesFirebase } from "../apis/personas-fetch.js";
import { sendCorreoBienvenidaFirebase } from "../apis/correos-fetch.js";
import { getEspecialidadInmediata } from "../apis/especialidades-fetch.js?1";
import { getToken } from "../apis/vida-sana.js";

var validarNSP = false;
var connection;
var parsedUrl = new URL(window.location.href);
let nsp = parsedUrl.href.substring(parsedUrl.href.lastIndexOf('=') + 1);
var idMedico;
var cliente;
var idAtencionFila;
var showModalEmail = false;
var beneficiarios = {};
var edad;
var urlAgent;
var idConvenio = 0;
var testCam = false;
let recording = false;
var especialidad = 0;
var baseUrlNow = new URL(window.location.href); //url base para servicios.
var idBloque = 596 // 68106; //desa
var idMedicoHora = 189086 // 10397; //desa
var dataBtn;
var dataLocalizacion = null;
var apiKey = '875e06efb1c446d89eb05bfaca2ca3ec'; // Your api key found at: https://www.bigdatacloud.net/customer/account
var consultaEspecialidadInmediata = [];
var minValidacion = 10;
var dataEspecialidades = [];
function isUnab() {
    return parsedUrl.host.includes("unabactiva.") || parsedUrl.host.includes("activa.unab.")
}

//vanilla implementation
var client = new BDCApiClient(apiKey);
/* You can set the default api language as needed */
client.localityLanguage = 'es';

getBDCClientIp(
    /* provide a callback function for receiving the client ip */
    function (result) {

        client.call(
            /* api endpoint */
            'ip-geolocation-full',

            /* api query parameters */
            {
                'ip': result.ipString,
                localityLanguage: 'es'
            },
            function (jsonResult) {
                dataLocalizacion = jsonResult;


            },
            function (err, code) {


            }
        );
    }
);

function detectDispos() {
       try {
        DetectRTC.load(async function () {

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
            //await grabarLog(data.atencion.id, evento);

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
                            if (permisoMic && permisoCamara && existeAudio) {
                                $("#validate-redirect").removeAttr("disabled");
                            }
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
            }
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
                            if (permisoMic && permisoCamara && existeAudio) {
                                $("#validate-redirect").removeAttr("disabled");
                            }
                            setTimeout(() => {
                                media.stop();
                                recording = false;
                                stream.getAudioTracks()[0].stop();
                                $("#record").html("GRABAR");
                            }, 5000);
                        });
                });
            }

            if (permisoMic && permisoCamara && existeAudio) {
                $("#validate-redirect").removeAttr("disabled");
            }

            $("#validate-redirect").on("click", () => {
                window.location.href = urlAgent;
            })

            
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
        console.log(evento);
    }

}
export async function init(data) {

    if (!(window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia.") || window.host.includes("masproteccionsalud.") || window.host.includes("saludproteccion.") || window.host.includes("saludtumundoseguro.") || idCliente == 1)) {

        detectDispos();
    }
    dataBtn = data;
    var fechaHoy = moment().format("DD-MM-YYYY");
    dataBtn = data;

    if (window.host.includes('unabactiva.')) {
        minValidacion = 15;
    }

    if ($("#saludoPaciente").length > 0)
        await saludoPaciente();


    if (window.actualizarDatos) {
        $("#modalActualizacionPaciente").modal("show");
        document.getElementById("kt_firebase").value = "";
        await formatRut();
    } else {
        $("#modalActualizacionPaciente").modal("hide");
        await personaHome();
    }


    if ($("#btnBlanco").length > 0) {
        let btnBlanco = document.getElementById("btnBlanco");
        btnBlanco.onclick = async () => {
            location.href = "/Paciente/examenes";
        }
    }
    if ($("#susCardif").length > 0) {
        let btn = document.getElementById("susCardif");
        btn.onclick = async () => {
            await GrabarLogs("Paciente presiona Suscripción.", `cardif suscripcion`);
            location.href = "/Paciente/Agendar?tipo=suscripcion";
        }
    }
    if ($("#oncoCardif").length > 0) {
        let btn = document.getElementById("oncoCardif");
        btn.onclick = async () => {
            await GrabarLogs("Paciente presiona oncología.", `cardif ongológico`);
            location.href = "/Paciente/Agendar?tipoEspecialidad=oncologia";
        }
    }
    if ($("#susPsico").length > 0) {
        let btn = document.getElementById("susPsico");
        btn.onclick = async () => {
            await GrabarLogs("Paciente presiona Psicológica.", `cardif Psicologia oncológico`);
            location.href = "/Paciente/Agendar?tipoEspecialidad=psicologia";
        }
    }
    if ($("#susCargas").length > 0) {
        let btn = document.getElementById("susCargas");
        btn.onclick = async () => {
            await GrabarLogs("Paciente presiona Contactos de emergencia.", `cardif oncológico`);
            location.href = "/Paciente/ListaContactos";
        }
    }

    if (data.fichaPaciente) {

        if (data.fichaPaciente.correo === "" || data.fichaPaciente.correo === null) {
            showModalEmail = true;
        }
        if (data.fichaPaciente.telefono === "" || data.fichaPaciente.telefono === null) {
            showModalEmail = true;
        }
        if (showModalEmail) {
            document.getElementById("nombreUsuarioModalValidacion").innerHTML = `Hola ${data.fichaPaciente.nombreCompleto}`
            document.getElementById('correoMedical').value = data.fichaPaciente.correo;
            document.getElementById('telefonoMedical').value = data.fichaPaciente.telefono;


        }

    }
    if ($("#telefonoMedical").length) {
        document.getElementById("telefonoMedical").placeholder = "Ejemplo: +5X999999999";
    }
    if ($("#btnModificarTelefonoEmail").length) {
        document.getElementById("btnModificarTelefonoEmail").onclick = async () => {

            var telefonoUpdate = "";
            var emailUpdate = "";
            emailUpdate = document.getElementById("correoMedical").value;
            telefonoUpdate = document.getElementById("telefonoMedical").value;


            if (emailUpdate == "" || telefonoUpdate === "") {
                Swal.fire("", "Debe completar los datos de contacto", "warning");
                return;
            }
            var emailOk = isEmail(emailUpdate);
            if (!emailOk) {
                Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
                return;
            }
            //$('#btnConfirmarTerminos').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            var respuesta = await EditPhoneEmail(emailUpdate, telefonoUpdate, uid);

            $('#modal-validacion').modal('hide');
            if (respuesta.status == "OK") {
                showModalEmail = false;
            }
        }
    }
    if (data.timelineData.length > 0) {
        if ($("#atencionesA").length > 0)
            await horasHoyA(data.timelineData.filter(itemF => !itemF.atencionDirecta && moment(itemF.fecha).format("DD-MM-YYYY") >= fechaHoy));
    }

    if ($("#btnSelectBeneficiario").length) {
        edad = await getEdadBeneficiarioById(uid);
        beneficiarios = await getBeneficiarios(uid, idCliente); // busca usuarios asociados a la cuenta, devuelve titular y cargas, por eso se compara a 1, porque el titular se cuenta, esto para que se muestre el boton "beneficiarios"
        if (beneficiarios.length > 1) {
            let btnSelectBeneficiario = document.getElementById("btnSelectBeneficiario");
            if ($("#btnSelectBeneficiario").length) {
                btnSelectBeneficiario.onclick = async () => {
                    $('#modalBeneficiarios').modal('show');
                    await configElementos(beneficiarios);

                    var btnAceptar = document.getElementById("btnAceptar");
                    btnAceptar.onclick = async () => {
                        var select = document.getElementById("selectBeneficiario").value;
                        if (select == "0") {
                            swal.fire("", "Debe seleccionar un beneficiario", "warning");
                            return;

                        }
                        var cambioBenef = await cambiarBeneficiario(select);
                        if (cambioBenef == "ok") {
                            Swal.fire("", "Se cambió el usuario", "success");
                            location.reload();
                        } else {
                            if (cambioBenef.err == 2) {
                                window.location.href = "/Account/loginPaciente";
                            }
                            else {
                                Swal.fire("", "Ha ocurrido un error vuelva a intentarlo más tarde", "error");
                            }

                        }
                    }
                }
            }
        }
        else {
            btnSelectBeneficiario.classList.add("d-none")
        }
    }

    dataEspecialidades = await getEspecialidadInmediata(uid, idCliente);
    var idEspec = 0;
    dataEspecialidades.forEach((elemento) => {
        if (elemento.id != idEspec) {
            consultaEspecialidadInmediata.push(elemento);
        }
        idEspec = elemento.id;
    });

    if (consultaEspecialidadInmediata.length == 1) {
        //await AtencionPendiente(uid, 0, idCliente); //busca atención estado nsp y la muestra para volver a la fila 
        var dataDirecta = data.timelineData.filter(itemF => itemF.atencionDirecta && itemF.estadoAtencion == "I")
        //filtrarAtencionVigente(dataDirecta)//filtra atención vigente según especialidad, cuando se carga la pagina no es necesario enviarle idEspecialidad, para que muestre otras especiliadidades.
        switch (idCliente) {
            case 148://colmena
                idConvenio = 21;
                break;
            case 108://coopeuch codigo convenio atencion inmediata medicina general
                idConvenio = 45;
                break;
            case 206://TODO: en prod cambiar a 44
                idConvenio = 48;
                break;
            default:
                idConvenio = 46;
                break;
        }
    }






    document.querySelectorAll(".btnAtencionDirectaGeneral").forEach(item => {
        item.onclick = async () => {
            if (showModalEmail) {
                $('#modal-validacion').modal('show');
                return;
            }
            var idEmpresa = item.getAttribute('data-id') ? item.getAttribute('data-id') : 0;
            if (parseInt(idEmpresa) != 0) {
                window.idCliente = parseInt(idEmpresa);
                var cambioCliente = await cambioIdCliente(idCliente);
                if (cambioCliente == "ok") {
                }
            }
            especialidad = 1;
            await GrabarLogs("Paciente presiona medicina general inmediata.", "");
            
         
            if (consultaEspecialidadInmediata.length > 1 || (idCliente === 366 && consultaEspecialidadInmediata.length >= 1)) {
                $("#opciones_esinmediata").html("");

                for (var i in consultaEspecialidadInmediata) {
                    var nombreEspecialidad = consultaEspecialidadInmediata[i].nombre;
                    var idEspecialidad = consultaEspecialidadInmediata[i].id;
                    var precioEspecialidad = consultaEspecialidadInmediata[i].precioEspecialidad;


                    /*Iteracion de btn especialidad inmediata*/

                    //var divBtnEspecialidad = document.createElement('div');
                    //divBtnEspecialidad.classList.add('cont-btn-especialidad');
                    //divBtnEspecialidad.style = "padding:10px 10px;";

                    var btnEspecialidad = document.createElement('a');
                    btnEspecialidad.classList.add('btn-especialidad');
                    //btnEspecialidad.style = "border-radius: 25px; height:60px; text-transform: full-width; ";
                    btnEspecialidad.setAttribute('data-idEspecialidad', idEspecialidad);
                    btnEspecialidad.setAttribute('data-uid', uid);
                    btnEspecialidad.setAttribute('data-idCliente', idCliente);
                    btnEspecialidad.setAttribute('data-valorAtencion', precioEspecialidad);

                    var text = document.createElement('span');
                    text.innerHTML = nombreEspecialidad;
                    text.style = "";

                    var icon = document.createElement('i');
                    switch (idEspecialidad) {

                        case 1: icon.classList.add('fal', 'fa-user-md', 'fa-lg');
                            break;
                        case 94: icon.classList.add('fal', 'fa-salad', 'fa-lg');
                            break;
                        case 95: icon.classList.add('fal', 'fa-head-side-brain', 'fa-lg');
                            break;
                        default: icon.classList.add('fal', 'fa-user-md', 'fa-lg');
                            break;
                    }
                    //icon.style = "float:left;margin-top:10px;";

                    btnEspecialidad.appendChild(icon);
                    btnEspecialidad.appendChild(text);

                    //divBtnEspecialidad.appendChild(btnEspecialidad);

                    let divListaEspecialidades = document.getElementById('opciones_esinmediata');
                    divListaEspecialidades.appendChild(btnEspecialidad);
                    //divListaEspecialidades.appendChild(divBtnEspecialidad);
                }



                $("#modal-especialidad-inmediata").modal("show");

                /* click btn */
                $(".btn-especialidad").on("click", async function () {


                    /* Captura de atributos especialidad */
                    let idEspecialidad = $(this).attr('data-idEspecialidad');
                    let uid = $(this).attr('data-uid');


                    var restriccion = restriccionTiempo(parseInt(idCliente), idEspecialidad)
                    if (restriccion == false) {
                        return;
                    }
                    /*Validacion horarios*/

                    // var validaHorarioEsInmediata = await getHorarioEsInmediata(idEspecialidad);
                    var dataDirecta = data.timelineData.filter(itemF => itemF.atencionDirecta && itemF.estadoAtencion == "I" && itemF.idEspecialidadFilaUnica == idEspecialidad)

                    var filtro = filtrarAtencionVigente(dataDirecta);

                    if (filtro == 1)
                        return;

                    var atencionPendienteSala = await AtencionPendiente(uid, idEspecialidad, parseInt(idCliente));

                    if (atencionPendienteSala === 0) {
                        //se modifica var restriccion = restriccionTiempo(parseInt(idCliente), 1) por:
                        var restriccion = restriccionTiempo(parseInt(idCliente), idEspecialidad)
                        if (restriccion == false) {
                            return;
                        }
                        var sessionPlataforma = 'MEDISMART';
                        if (idCliente == 148) {
                            sessionPlataforma = 'COLMENA';
                        }

                        switch (idCliente) {
                            case 0:
                                sessionPlataforma = 'MEDISMART';
                                if (window.codigoTelefono.includes("CO")) {
                                    sessionPlataforma = "COLOMBIA_DIRECTO";
                                    idCliente = window.idClienteSesion;
                                } else if (window.codigoTelefono.includes("MX")) {
                                    sessionPlataforma = "MEXICO_DIRECTO";
                                    idCliente = window.idClienteSesion;
                                }
                                else if (window.codigoTelefono.includes("PE")) {
                                    sessionPlataforma = "PERU_DIRECTO";
                                    idCliente = window.idClienteSesion;
                                }
                                else if (window.codigoTelefono.includes("EC")) {
                                    sessionPlataforma = "ECUADOR_DIRECTO";
                                    idCliente = window.idClienteSesion;
                                }
                                break;
                            case 108:
                                sessionPlataforma = "MEDISMART";
                                break;
                            case 204:
                                sessionPlataforma = "MEDISMART";
                                break;
                            case 244:
                                sessionPlataforma = "MEDISMART";
                                break;
                            case 236:
                                sessionPlataforma = "MEDISMART";
                                break;
                            case 241:
                                sessionPlataforma = "MEDISMART";
                                break;
                            case 206:
                                sessionPlataforma = "COLOMBIA_DIRECTO";
                            case 255:
                                sessionPlataforma = "AECSA";
                            case 256:
                                sessionPlataforma = "RAPPI";
                            default:
                                sessionPlataforma = 'MEDISMART';
                                break;

                        }

                        if (idCliente == 148) {
                            urlAgent = `/Paciente/Agenda_1?idMedico=0&fechaPrimeraHora=${moment().format("YYYY-MM-DD")}&m=2&r=2&c=${idConvenio}&especialidad=${idEspecialidad}&tipoatencion=I`
                            //validationModalDevices()
                            modalDeviceOrContingencia()
                        } else {

                            //atención inmediata sin pago
                            let agendar = {
                                id: 0,
                                idBloqueHora: idBloque,
                                idPaciente: parseInt(uid),
                                IdMedicoHora: idMedicoHora,
                                Estado: 'P',
                                idCliente: parseInt(idCliente),
                                idEspecialidadFilaUnica: parseInt(idEspecialidad),
                                idSesionPlataformaExterna: sessionPlataforma
                            };
                            let valida = await putAgendarMedicosHoras(agendar, 0, uid);

                            if (valida !== 0) {
                                urlAgent = `/Paciente/Agenda_3?idMedicoHora=${valida.infoAtencion.idHora}&idMedico=${valida.infoAtencion.idMedico}&idBloqueHora=${valida.atencionModel.idBloqueHora}&fechaSeleccion=${valida.infoAtencion.fecha}&hora=${valida.infoAtencion.horaDesdeText}&horario=True&idAtencion=${valida.infoAtencion.idAtencion}&m=1&r=1&c=${idConvenio}&tipoatencion=I&especialidad=${idEspecialidad}`
                            }
                            //validationModalDevices()
                            modalDeviceOrContingencia()
                        }
                    } //fin if atencion pendiente sala
                });



            } else {
                $("#btnAtencionDirectaGeneralLoading").addClass("loading").attr('disabled', true);
                item.setAttribute('style', 'pointer-events: none;')
                var idEspecialidad = '';
                var valorAtencion = '';
                if (consultaEspecialidadInmediata.length == 1) {
                    idEspecialidad = consultaEspecialidadInmediata[0]['id'];
                    valorAtencion = consultaEspecialidadInmediata[0]['precioEspecialidad'];
                } else {
                    idEspecialidad = 1;
                }
                var dataDirecta = data.timelineData.filter(itemF => itemF.atencionDirecta && itemF.estadoAtencion == "I" && itemF.idEspecialidadFilaUnica == idEspecialidad)

                var filtro = filtrarAtencionVigente(dataDirecta);

                if (filtro == 1)
                    return;

                urlAgent = `/Paciente/Agenda_1?idMedico=0&fechaPrimeraHora=${moment().format("YYYY-MM-DD")}&m=2&r=2&c=${idConvenio}&especialidad=${idEspecialidad}&tipoatencion=I`
                var atencionPendienteSala = await AtencionPendiente(uid, idEspecialidad, parseInt(idCliente));
                if (atencionPendienteSala === 0) {
                    var restriccion = restriccionTiempo(parseInt(idCliente), idEspecialidad)
                    if (restriccion == false) {
                        return;
                    }
                    var sessionPlataforma = 'MEDISMART';
                    if (idCliente == 148) {
                        sessionPlataforma = 'COLMENA';
                    }


                    switch (idCliente) {
                        case 0:
                            sessionPlataforma = 'MEDISMART';
                            if (window.codigoTelefono.includes("CO")) {
                                sessionPlataforma = "COLOMBIA_DIRECTO";
                                idCliente = window.idClienteSesion;
                            }
                            else if (window.codigoTelefono.includes("MX")) {
                                sessionPlataforma = "MEXICO_DIRECTO";
                                idCliente = window.idClienteSesion;
                            }
                            else if (window.codigoTelefono.includes("PE")) {
                                sessionPlataforma = "PERU_DIRECTO";
                                idCliente = window.idClienteSesion;
                            }
                            else if (window.codigoTelefono.includes("EC")) {
                                sessionPlataforma = "ECUADOR_DIRECTO";
                                idCliente = window.idClienteSesion;
                            }
                            break;
                        case 148:
                            window.location.href = urlAgent;
                            break;
                        case 108:
                            sessionPlataforma = "MEDISMART";
                            break;
                        case 204:
                            sessionPlataforma = "MEDISMART";
                            break;
                        case 244:
                            sessionPlataforma = "MEDISMART";
                            break;
                        case 236:
                            sessionPlataforma = "MEDISMART";
                            break;
                        case 241:
                            sessionPlataforma = "MEDISMART";
                            break;
                        case 206:
                            sessionPlataforma = "COLOMBIA_DIRECTO";
                        case 255:
                            sessionPlataforma = "AECSA";
                        case 256:
                            sessionPlataforma = "RAPPI";
                        default:
                            sessionPlataforma = 'MEDISMART';
                            break;

                    }

                    //if (valorAtencion > 0) {
                    //    var url = `/Paciente/Agenda_1?idMedico=0&fechaPrimeraHora=${moment().format("YYYY-MM-DD")}&m=2&r=2&c=${idConvenio}&especialidad=${idEspecialidad}&tipoatencion=I`
                    //    window.location.href = url;
                    //} else {
                    //atención inmediata sin pago
                    let agendar = {
                        id: 0,
                        idBloqueHora: idBloque,
                        idPaciente: uid,
                        IdMedicoHora: idMedicoHora,
                        Estado: 'P',
                        idCliente: parseInt(idCliente),
                        idEspecialidadFilaUnica: parseInt(idEspecialidad),
                        idSesionPlataformaExterna: sessionPlataforma
                    };
                    let valida = await putAgendarMedicosHoras(agendar, 0, uid);
                    if (valida !== 0) {
                        if (valorAtencion > 0) {
                            urlAgent = `/Paciente/Agenda_3?idMedicoHora=${valida.infoAtencion.idHora}&idMedico=${valida.infoAtencion.idMedico}&idBloqueHora=${valida.atencionModel.idBloqueHora}&fechaSeleccion=${valida.infoAtencion.fecha}&hora=${valida.infoAtencion.horaDesdeText}&horario=True&idAtencion=${valida.infoAtencion.idAtencion}&m=2&r=1&c=${idConvenio}&tipoatencion=I&especialidad=${idEspecialidad}`;
                            //validationModalDevices()
                            modalDeviceOrContingencia()
                        } else {
                            urlAgent = `/Paciente/Agenda_3?idMedicoHora=${valida.infoAtencion.idHora}&idMedico=${valida.infoAtencion.idMedico}&idBloqueHora=${valida.atencionModel.idBloqueHora}&fechaSeleccion=${valida.infoAtencion.fecha}&hora=${valida.infoAtencion.horaDesdeText}&horario=True&idAtencion=${valida.infoAtencion.idAtencion}&m=1&r=1&c=${idConvenio}&tipoatencion=I&especialidad=${idEspecialidad}`;
                            //validationModalDevices()
                            modalDeviceOrContingencia()
                        }
                    }
                    else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");

                    }
                    //validationModalDevices()
                    modalDeviceOrContingencia()

                    //}

                }

            }
        }
    })


    if ($("#btnAtencionDirectaPed").length) {

        let btnAtencionDirectaPed = document.getElementById("btnAtencionDirectaPed");
        var atencionAhora = moment().format("HH:mm");
        btnAtencionDirectaPed.onclick = async () => {
            especialidad = 4;

            await GrabarLogs("Paciente presiona pediatría inmediata.", `idCliente = ${idCliente}  -  Hora: ${atencionAhora}`);

            var dataDirecta = data.timelineData.filter(itemF => itemF.atencionDirecta && itemF.estadoAtencion == "I" && itemF.idEspecialidadFilaUnica == 4)
            var filtro = filtrarAtencionVigente(dataDirecta)
            if (filtro == 1)
                return;

            var atencionPendienteSala = await AtencionPendiente(uid, 4, idCliente);
            if (atencionPendienteSala != 1) {
                var restriccion = restriccionTiempo(idCliente, 4)
                if (restriccion == false) {
                    return;
                }
                if (idCliente == 148) {
                    var resultEdad = await getEdadBeneficiario();
                    if (resultEdad == 1)
                        return;

                    urlAgent = `/Paciente/Agenda_1?idMedico=0&fechaPrimeraHora=${moment().format("YYYY-MM-DD")}&m=2&r=2&c=${idConvenio}&especialidad=4&tipoatencion=I`;
                    //validationModalDevices()
                    modalDeviceOrContingencia()

                }
            }
        }

    }

    if ($("#btnOndemand").length) {
        let btnOndemand = document.getElementById("btnOndemand");
        btnOndemand.onclick = async () => {
            //esta validación para pacientes pediatricos es solo hasta que en colmena agreguen mas especialidad, despues esta validación irá al agendar??
            var url = "/Paciente/Agendar?tipo=medicina";
            if (idCliente == 148) {
                var resultEdad = await getEdadBeneficiario();
                if (resultEdad == 1)
                    return;
            }
            window.location.href = url;


        }
    }


    if ($("#psicologica-caja").length) {
        let btnPsicologia = document.getElementById("psicologica-caja");
        btnPsicologia.onclick = async () => {
            $('#modal-psicologica-caja').modal('show');
            await GrabarLogs("Paciente presiona psicologia.", `psicologia modal`);
        }
    }

    if ($("#btnNutricionUnab").length) {
        let btnNutricionUnab = document.getElementById("btnNutricionUnab");
        btnNutricionUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=nutricion";
            window.location.href = url;
        }
    }

    if ($("#btnObstetriciaUnab").length) {
        let btnObstetriciaUnab = document.getElementById("btnObstetriciaUnab");
        btnObstetriciaUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=obstetricia";
            window.location.href = url;
        }
    }

    if ($("#btnKineUnab").length) {
        let btnKineUnab = document.getElementById("btnKineUnab");
        btnKineUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=kinesiologia";
            window.location.href = url;
        }
    }

    if ($("#btnFonoaudiologiaUnab").length) {
        let btnFonoaudiologiaUnab = document.getElementById("btnFonoaudiologiaUnab");
        btnFonoaudiologiaUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=grupofonoaudiologia";
            window.location.href = url;
        }
    }

    if ($("#btnPsicopedagogiaUnab").length) {
        let btnPsicopedagogiaUnab = document.getElementById("btnPsicopedagogiaUnab");
        btnPsicopedagogiaUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=psicopedagogia";
            window.location.href = url;
        }
    }

    if ($("#btnMedicinaUnab").length) {
        let btnPsicopedagogiaUnab = document.getElementById("btnMedicinaUnab");
        btnPsicopedagogiaUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=medicina";
            window.location.href = url;
        }
    }

    if ($("#btnTerapiaOcupacionalUnab").length) {
        let btnTerapiaOcupacionalUnab = document.getElementById("btnTerapiaOcupacionalUnab");
        btnTerapiaOcupacionalUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=grupoterapiaocupacional";
            window.location.href = url;
        }
    }
    /*if ($("#btnPsicologiaUnab").length) { 
        console.log("entro al if psicologia");
        let btnPsicologiaUnab = document.getElementById("btnPsicologiaUnab");
        btnPsicologiaUnab.onclick = async () => {
            const url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=psicologia";
            window.location.href = url;
        }
    }*/
    

    //inicio Estos dos botones de sekure 
    if ($("#btnOriePsi").length) {
        let btnOriePsi = document.getElementById("btnOriePsi");
        btnOriePsi.onclick = async () => {
            var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=psicologia";
            window.location.href = url;
        }
    }

    if ($("#btnOrieNutri").length) {
        let btnOrieNutri = document.getElementById("btnOrieNutri");
        btnOrieNutri.onclick = async () => {
            var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=nutricion";
            window.location.href = url;
        }
    }
    //fin botones sekure
    if ($("#btnOrientaciontrata").length) {
        let btnOrientaciontrata = document.getElementById("btnOrientaciontrata");
        btnOrientaciontrata.onclick = async () => {
            var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=orientacion";
            window.location.href = url;
        }
    }
    //inicio botones GNBLIBERTY
    if ($("#btnOriePsiGL").length) {
        let btnOriePsiGL = document.getElementById("btnOriePsiGL");
        btnOriePsiGL.onclick = async () => {
            var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=psicologia";
            window.location.href = url;
        }
    }

    if ($("#btnOrieNutriGL").length) {
        let btnOrieNutriGL = document.getElementById("btnOrieNutriGL");
        btnOrieNutriGL.onclick = async () => {
            var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=nutricion";
            window.location.href = url;
        }
    }

    if ($("#btnOrieVetGL").length) {
        let btnOrieVetGL = document.getElementById("btnOrieVetGL");
        btnOrieVetGL.onclick = async () => {
            var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=veterinaria";
            window.location.href = url;
        }
    }
    //fin botones GNBLIBERTY
    if ($("#btnOrientacion").length) {
        let btnOrientacion = document.getElementById("btnOrientacion");
        btnOrientacion.onclick = async () => {
            //esta validación para pacientes pediatricos es solo hasta que en colmena agreguen mas especialidad, despues esta validación irá al agendar??
            switch (idCliente) {
                case 108:
                    window.location.href = "/Gescaec/index";
                    break;
                default: window.location.href = "/examenesPreventivos/index";
                    break;

            }
        }
    }

    if ($("#btnSmartCheck").length) {
        let btnSmartCheck = document.getElementById("btnSmartCheck");
        btnSmartCheck.onclick = async () => {
            //esta validación para pacientes pediatricos es solo hasta que en colmena agreguen mas especialidad, despues esta validación irá al agendar??
            switch (idCliente) {
                case 108:
                    window.location.href = "/Gescaec/index";
                    break;
                default: window.location.href = "/examenesPreventivos/SmartCheck";
                    break;

            }
        }
    }

    if ($("#btnAtencionPresencial").length) {
        let btnAtencionPresencial = document.getElementById("btnAtencionPresencial");
        btnAtencionPresencial.onclick = async () => {
            //esta validación para pacientes pediatricos es solo hasta que en colmena agreguen mas especialidad, despues esta validación irá al agendar??
            switch (idCliente) {
                case 108:
                    //window.location.href = "/Presencial/Agendar"; aun no sale a producción snabb
                    $('#modalPronto').modal('show');
                    break;
                default: $('#modalPronto').modal('show');
                    break;

            }
        }
    }

    if ($("#btnAsesoriaCaja").length) {
        let btnExamenes = document.getElementById("btnAsesoriaCaja");
        btnExamenes.onclick = async () => {
            await GrabarLogs("Paciente presiona asesoria.", '');
            window.location.href = "/Gescaec/index";
        }
    }

    if ($("#btnExamenes").length) {
        let btnExamenes = document.getElementById("btnExamenes");
        btnExamenes.onclick = async () => {
            await GrabarLogs("Paciente presiona exámenes.", `Examanes`);
            //esta validación para pacientes pediatricos es solo hasta que en colmena agreguen mas especialidad, despues esta validación irá al agendar??
            switch (idCliente) {
                case 108:
                    window.location.href = "/asistenciatomaexamenes/index";
                    break;
                case 330:
                    window.open("https://lab.clini.cl/adomicilio/", '_blank');
                    break;
                default:
                    if (window.host.includes("clinicamundoscotia"))
                        window.location.href = "/asistenciatomaexamenes/asistenciaClinicaOnline";
                    else if (window.host.includes("prevenciononcologica") || window.host.includes("masproteccionsalud.") || window.host.includes("saludtumundoseguro"))
                        window.location.href = "/asistenciatomaexamenes/AsistenciaExamenes";
                    else if (window.activaBlanco == "0" || !window.codigoTelefono.includes("CL"))
                        window.location.href = "/Paciente/Examenes";
                    else
                        $('#modal-blanco').modal('show');
                    break;

            }
        }
    }

    if ($("#btnFarmacia").length) {
        let url = "/Paciente/Farmacias";
        if (window.host.includes("clinicamundoscotia") || window.host.includes("masproteccionsalud.")) {
            url = "/FarmaciaOnline/index";
        }
        let btnFarmacia = document.getElementById("btnFarmacia");
        btnFarmacia.onclick = async () => {
            await GrabarLogs("Paciente presiona farmacia.", ``);
            window.location.href = url;
        }
    }

    if ($("#btnOrientacionCardif").length) {
        let btnCardif = document.getElementById("btnOrientacionCardif");
        btnCardif.onclick = async () => {
            await GrabarLogs("Paciente presiona asesorias.", `cardif Gescaec`);
            window.location.href = "/Gescaec/index";
        }
    }

    if ($("#btnBiblioteca").length) {
        let btnBiblioteca = document.getElementById("btnBiblioteca");
        btnBiblioteca.onclick = async () => {
            await GrabarLogs("Paciente presiona wikidoc.", "");
            location.href = '/Biblioteca/index';
            //'#modalPronto').modal('show');
        }
    }

    if ($("#btnLife").length) {
        let btnLife = document.getElementById("btnLife");
        btnLife.onclick = async () => {
            await await GrabarLogs("Paciente presiona lifestyle&wellnes.", `lifetyle`);
            location.href = "/Paciente/Agendar?tipo=lifestyle";
        }
    }

    if ($("#btnDermapp").length) {
        let btnDermapp = document.getElementById("btnDermapp");
        btnDermapp.onclick = async () => {
            window.open(
                'https://www.dermapp.com/consulta/sobre-ti?tenant=medismartmx',
                '_blank' // <- This is what makes it open in a new window.
            );
        }
    }

    if ($("#btnNom035").length) {
        let btnNom035 = document.getElementById("btnNom035");
        btnNom035.onclick = async () => {
            location.href = '/Cuestionario/Home035';
            //'#modalPronto').modal('show');
        }
    }

    if ($("#item-wallet").length) {
        let btn_itemwallet = document.getElementById("item-wallet");
        btn_itemwallet.onclick = async () => {
            location.href = '/PasarelaPago/HomeWallet';
            //'#modalPronto').modal('show');
        }
    }

    if ($("#btnSeguros").length) {
        let btnSeguros = document.getElementById("btnSeguros");
        btnSeguros.onclick = async () => {
            let modalBodySeguros = document.getElementById('modalBodySeguros');
            $("#modalBodySeguros").empty();
            let embed = document.createElement('embed');
            embed.src = "/documentosLegalesMX/PDF-POLIZA-SEGUROMX-NEW.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodySeguros.appendChild(embed);
            $("#modal-seguros").modal("show");
        }
    }

    if ($("#btnFarmaciaWD").length) {
        let btnFarmaciaWD = document.getElementById("btnFarmaciaWD");
        btnFarmaciaWD.onclick = async () => {

            //$("#modal-farmacia").modal("show");
            $("#modal-farmacia-salud").modal("show");
        }
    }

    if ($("#btnLaboratorio").length) {
        let btnLaboratorio = document.getElementById("btnLaboratorio");
        btnLaboratorio.onclick = async () => {
            if (window.host.includes("sunglass.") || window.host.includes("essilorluxottica.")) {
                window.location = "/AsistenciaTomaExamenes/asistenciaExamenes";
            }
            else {
                $("#modal-laboratorio").modal("show");
            }
           
        }
    }

    if ($("#btnOrientacionWD").length) {
        let btnOrientacionWD = document.getElementById("btnOrientacionWD");
        btnOrientacionWD.onclick = async () => {

            $("#modal-saludpreventiva-salud").modal("show");
        }
    }
    if ($("#btnWellnessWD").length) {
        let btnWellnessWD = document.getElementById("btnWellnessWD");
        btnWellnessWD.onclick = async () => {
            if (window.host.includes("sunglass.") || window.host.includes("essilorluxottica.")) {
                $("#modal-wellnesswd").modal("show");
            }
            else if (window.idCliente == 388) {
                $("#modal-wellnesswd").modal("show");
            }
            else if (window.host.includes("siigo.") || window.host.includes("glory.wedoctorsmx.") || window.host.includes("crehana.wedoctorsmx.")) {
                window.location = "/Paciente/Agendar?tipo=lifestyle";
            }
            else if (window.idCliente == 389) {
                window.location = "/Paciente/Agendar?tipo=lifestyle";
            }
            else {
                $("#modal-wellnesswd-salud").modal("show");
            }
        }
    }

    $("#btnModalCoachApp").click(async function () {
        $("#modal-wellnesswd").modal("hide");
        $("#modal-wellnesswd-coachapp").modal("show");
    });

    $("#boxHanu a").click(async function (event) {
        event.preventDefault();
        $("#boxHanu a").attr('disabled', true);
        const loadingDiv = $("<div></div>").css({
            position: "absolute",
            height: "100%",
            width: "100%"
        }).addClass("loading");
        $("#boxHanu .card-body").append(loadingDiv);
        const result = await getToken(uid);
        if (result.ok) {
            swal.fire("", "Estas siendo redireccionado", "success")
            window.location.href = result.data.redirectUrl;
        }
        else if (!result.ok) {
            swal.fire("", "Ocurrió un error", "error")
        }
        $(".loading").remove();
        $("#boxHanu a").attr('disabled', false);
    });

}


function restriccionTiempo(idCliente, idEspecialidad) {
    var atencionAhora = moment().format("HH:mm");
    var consulta = [];
 
    if (consultaEspecialidadInmediata.length > 0) {
        consulta = dataEspecialidades.filter(item => item.id == idEspecialidad && item.tieneRestriccion);
    }
    

    if (consulta.length > 0) {
        if (consulta.length > 1) {
            var todasRestringidas = true;
            var restricciones = "";
            for (var i = 0; i < consulta.length; i++) {
                var horaInicioRestriccion = moment(consulta[i].horaInicio).format("HH:mm");
                var horaFinRestriccion = moment(consulta[i].horaFin).format("HH:mm");
                if (consulta[i].mensaje != "") {
                    restricciones += consulta[i].mensaje + "\n";
                    swal.fire("Ooops!", consulta[i].mensaje, "info")
                    return false;
                }
                if (atencionAhora <= horaInicioRestriccion || atencionAhora > horaFinRestriccion) {
                    if (i === 0) {
                        restricciones += `Lo sentimos el horario de ${consulta[i].nombre} es de ${horaInicioRestriccion} a ${horaFinRestriccion} hrs\n`;
                    } else {
                        restricciones += ` y ${horaInicioRestriccion} a ${horaFinRestriccion} hrs`;
                    }
                } else {
                    todasRestringidas = false;
                }
            }
            if (todasRestringidas) {
                swal.fire("Ooops!", restricciones, "info");
                return false;
            }
        }
        else {
            var horaInicioRestriccion = moment(consulta[0].horaInicio).format("HH:mm");
            var horaFinRestriccion = moment(consulta[0].horaFin).format("HH:mm");
            if (consulta[0].mensaje != "") {
                $("#btnAtencionDirectaGeneralLoading").removeClass("loading").attr('disabled', false);
                document.getElementById("btnAtencionDirectaGeneral").setAttribute('style', 'pointer-events: auto;');
                swal.fire("Ooops!", consulta[0].mensaje, "info")
                return false;
            }
            if (atencionAhora <= horaInicioRestriccion || atencionAhora > horaFinRestriccion) {
                swal.fire("Ooops!", `Lo sentimos el horario de ${consulta[0].nombre} es de ${horaInicioRestriccion} a ${horaFinRestriccion} hrs`, "info")
                return false;
            }
        }

    }

    switch (idCliente) {
        case 148:
            if (idEspecialidad == 1) {
                if (atencionAhora < "08:00" || atencionAhora > "23:50") {
                    Swal.fire("", "Te recordamos que los horarios para ingresar a una consulta inmediata de Medicina General son 08:00 - 23:59 Hrs.", "error")
                    return false;
                }
            }
            else if (idEspecialidad == 4) {
                if (atencionAhora < "18:00" || atencionAhora > "20:58") {//se deja a las 19 la restrccion por peticion de consuelo cifuentes.
                    Swal.fire({
                        title: 'Lo sentimos!',
                        html: `<p>Las últimas horas pediátricas han sido ocupadas! Te recomendamos volver en el siguiente bloque de atención.</p><br>
                        <p>Tarde: 18:00 a 21:00</p><br>
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
            /*if (idEspecialidad == 1 && (dataLocalizacion && dataLocalizacion.country.isoAlpha2 == "CO")) {
                var atencionDesde = "07:00";
                //if (dataLocalizacion && dataLocalizacion.country.isoAlpha2 == "CO") {
                //    atencionDesde = "07:00";
                //}
                if (atencionAhora > "03:00" && atencionAhora < atencionDesde) {
                    //if (atencionAhora < "08:00" || atencionAhora > "21:59") {
                    Swal.fire("", `Te recordamos que los horarios para ingresar a una consulta inmediata de Medicina General son ${atencionDesde} - 03:00 Hrs.`, "error")
                    return false;
                }

            }*/

    }
}
function filtrarAtencionVigente(dataDirecta) {
    if (dataDirecta.length > 0) {

        dataDirecta.forEach(item => {
            var mensajeHtml = "¿Quieres Ingresar a la fila?";
            var mensajeConfirm = "¿Quieres ingresar a la sala de espera?";
            var redirect = `/Ingresar_Sala_FU/${item.idAtencion}`;
            var showCancel = true;
            var confirmText = "Si, volver a la SALA"


            if (item.idBloqueHora != idBloque && item.idMedicoHora != idMedicoHora) {
                //mensajeHtml = `<p>Atención con <strong>${item.nombreMedico}</strong> </br> especialidad <strong>${item.especialidad}</strong></p>`
                mensajeConfirm = '¿Quieres ingresar al box?';
                confirmText = "Si, volver al BOX"
                showCancel = false;
                redirect = `/Atencion_Box/${item.idAtencion}`;

            }
            switch (idCliente) {
                case 148:
                    showCancel = false;
                    break;
                case 240: //id empresa caja los andes
                    showCancel = false;
                    confirmText = "Si, volver al BOX";
                    break;
                case 108:
                    showCancel = true;
                    break;
            }
            var texto = "Oooops! Hemos detectado que tienes una atención pendiente!";
            if (idCliente == 108) {
                texto = "¡Ups! Hemos detectado que tienes una atención pendiente.";
            } else if (parsedUrl.hostname.includes("clinicamundoscotia")) {
                texto = "Hemos detectado que tienes una atención muy pronto.";
            }
            else if (parsedUrl.hostname.includes("masproteccionsalud")) {
                texto = "¡Ups! Tienes una atención pendiente.";
            }


            if (window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia.") || window.host.includes("masproteccionsalud.") || window.host.includes("saludproteccion.") || window.host.includes("bo.medical.") || idCliente == 1) {
                Swal.fire({
                    title: texto,
                    text: (idCliente == 108) ? '¿Quieres ingresar a la sala de espera y recuperar tu turno?' : mensajeConfirm,
                    showCancelButton: showCancel,
                    cancelButtonText: (idCliente == 108) ? 'No, volver al inicio' : "No, volver al HOME",
                    confirmButtonText: (idCliente == 108) ? 'Sí, volver a la sala de espera' : confirmText,
                    reverseButton: true,
                    type: 'question',
                }).then(async (result) => {
                    if (result.value) {
                        var restriccion = restriccionTiempo(idCliente, item.idEspecialidadFilaUnica)
                        if (restriccion == false) {
                            return;
                        }

                        Swal.fire({
                            title: 'Serás redireccionado de forma automática a la atención',
                            html: '',
                            timer: 7000,
                            // backdrop: false,
                            allowOutsideClick: false,
                            type: "success",
                            showConfirmButton: false,
                            timerProgressBar: true,

                        })
                        window.location = redirect;

                    }
                    if (result.dismiss == "cancel") {
                        Swal.fire({
                            title: '¿Estás seguro de eliminar esta atención?',
                            confirmButtonText: 'Si, eliminar',
                            reverseButton: true,
                            cancelButtonText: 'No',
                            type: 'question',
                            showCancelButton: true
                        }).then(async (result) => {
                            if (result.value) {
                                var valida = await putEliminarAtencion(item.idAtencion, uid);
                                if (valida.status !== "NOK") {
                                    var log = {
                                        IdPaciente: uid,
                                        Evento: "Paciente Elimina atencion sala de espera",
                                        IdAtencion: parseInt(item.idAtencion)
                                    }
                                    await logPacienteViaje(log);
                                    Swal.fire('', 'Atención eliminada', 'success');
                                    location.reload();
                                }
                                else {
                                    Swal.fire('', 'No fue posible cancelar esta atención, comuniquese con mesa de ayuda', 'error')
                                }
                            }

                        })

                    }
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {

                    }

                });
            } else {
                window.location = redirect;
            }




        });
        return 1;
    }

}
//Atencion nsp 
async function AtencionPendiente(uid, idEspecialidad, idCliente) {
	debugger
	if (window.codigoTelefono.includes("CO")) {
       idCliente = window.idClienteSesion;
       } else if (window.codigoTelefono.includes("MX")) {
                                    idCliente = window.idClienteSesion;
                                }
                                else if (window.codigoTelefono.includes("PE")) {
                                    idCliente = window.idClienteSesion;
                                }
                                else if (window.codigoTelefono.includes("EC")) {
                                    idCliente = window.idClienteSesion;
                                }
    var atencionPendienteSala = await getAtencionPendienteSala(uid, idEspecialidad, idCliente);
    if (atencionPendienteSala.status == "OK") {
        if (idEspecialidad == 0)
            idEspecialidad = atencionPendienteSala.horasMedicos.idEspecialidadFilaUnica;
        idAtencionFila = atencionPendienteSala.horasMedicos.idAtencion;
        var restriccion = restriccionTiempo(idCliente, idEspecialidad)
        if (restriccion == false) {
            return;
        }
        var resp = await putVolverSala(idAtencionFila)
        if (resp.status != "NOK") {
            window.location = `/Ingresar_Sala_FU/${idAtencionFila}`;
        }
        return 1;
    }
    else return 0;
}
//validación paciente mayor de 18 para pediatria
async function getEdadBeneficiario() {
    if (edad >= 18) {
        Swal.fire({
            title: '¡Importante!',
            text: '',
            html: `<p>Recuerda que siempre para agendar una atención pediátrica, debes <strong>seleccionar</strong> a tu beneficiario menor a <strong>18 años.</strong></p></br><p>Puedes cambiar tu beneficiario en el costado superior derecho pestaña <strong>Beneficiarios</strong></p></br> <div class="btn-home">
                <i class= "fal fa-user-friends d-block"></i>
                <span>Beneficiarios</span>
                </div >`,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            confirmButtonText: "Entiendo",
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            type: 'info',
            //backdrop: false
            allowOutsideClick: false
        })
        return 1;
    }
    else
        return 0;
}
async function horasHoyA(data) {

    var i = 0;
    $("#atencionesA").empty();
    data.forEach(item => {
        if (item.nsp || i >= 1)
            return;
        var atencionAhora = moment(item.fecha).format("YYYY-MM-DD") + " " + moment(item.horaDesdeText, 'hh:mm:ss').format("HH:mm");
        var hora = moment().format("HH:mm");
        document.getElementById('contentAtenciones').hidden = false
        let link = document.createElement('a')
        link.setAttribute('class', 'link-aviso');

        let divContent = document.createElement('div');
        divContent.setAttribute("id", item.idAtencion);
        divContent.setAttribute('class', 'card-atencion mb-3');


        if (item.nsp)
            divContent.classList.add('nsp');

        let divConfirmaAtencion = document.createElement('div');
        if (item.confirmaPaciente != null) {
            divConfirmaAtencion.setAttribute("class", "label-confirma-atencion");
            divConfirmaAtencion.innerHTML = "Atención Confirmada";
        }


        let divContentItemCenter = document.createElement('div');
        divContentItemCenter.setAttribute('class', 'row align-items-center');

        let contImgProf1 = document.createElement('div');
        contImgProf1.setAttribute('class', 'col-auto col-lg-auto');

        let contImgProf2 = document.createElement('div');
        contImgProf2.setAttribute('class', 'img-pro');

        let imgProf = document.createElement('img');
        var foto;
        var baseS3 = 'https://appdiscoec2.s3.amazonaws.com'
        if (!item.fotoPerfil.includes('Avatar.svg')) {
            foto = baseS3 + item.fotoPerfil.replace(/\\/g, '/');
        }
        else {
            foto = baseUrlWeb + item.fotoPerfil;
        }

        if (isUnab())
            foto = item.fotoPerfil;

        imgProf.src = foto;

        let divContDatos1 = document.createElement('div');
        divContDatos1.setAttribute('class', 'col col-lg');

        let divContDatos2 = document.createElement('div');
        divContDatos2.setAttribute('class', 'datos-atencion');

        let divNombreProf = document.createElement('div');
        divNombreProf.setAttribute('class', 'nombre-pro');

        let spanNombre = document.createElement('span');
        spanNombre.innerHTML = item.nombreMedico;
        spanNombre.setAttribute('style', 'cursor:pointer');
        spanNombre.onclick = async () => {
            var log = {
                IdPaciente: uid,
                Evento: "Paciente presiona link para ingresar al box",
                IdAtencion: parseInt(item.idAtencion)
            }
            await logPacienteViaje(log);
            var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(minValidacion, 'minutes').format('HH:mm');

            if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
                Swal.fire(`Ya han pasado ${minValidacion} min. desde que comenzó tu atención, se ha cancelado`, "", "warning")
                return;
            }
            else {
                if (item.atencionDirecta)
                    window.location = "/Paciente/AtencionDirecta?idAtencion=" + item.idAtencion;
                else
                    window.location = "/Atencion_SalaEspera/" + item.idAtencion;
            }
        }
        let divRegistro = document.createElement('div');
        divRegistro.setAttribute('class', 'registro-institucion');
        divRegistro.innerHTML = item.numeroRegistro;

        let divEspecialidad = document.createElement('div');
        divEspecialidad.setAttribute('class', 'especialidad');
        divEspecialidad.innerHTML = item.especialidad;

        let divContIconos = document.createElement('div');
        divContIconos.setAttribute('class', 'col-12 col-lg-auto');

        let divIconos = document.createElement('div');
        divIconos.setAttribute('class', 'iconos-atencion');

        let aAnular = document.createElement('a');
        aAnular.setAttribute('class', 'btn-icon danger');
        aAnular.href = "javascript:void(0);";
        let divIconoAnular = document.createElement('div');
        divIconoAnular.setAttribute('class', 'icono');
        let iAnular = document.createElement('i');
        iAnular.setAttribute('class', 'fal fa-calendar-times');
        let divLeyendaAnular = document.createElement('div');
        divLeyendaAnular.setAttribute('class', 'leyenda-icono');
        divLeyendaAnular.innerHTML = "Cancelar";
        aAnular.onclick = () => {
            var ahora = moment().format('YYYY-MM-DD HH:mm');
            var diferencia = moment(atencionAhora).diff(ahora, 'hours');
            //if (diferencia <= 4) {
            //    Swal.fire("Esta atención ya no es posible cancelarla", "", "warning")
            //    return;
            //}
            var validarHorario = validaHorario(item);
            if (validarHorario)
                return;
            if (item.cobrar) {
                Swal.fire("Esta atención no se puede cancelar", "Para cancelar esta estención comunicate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                return;
            }
            document.getElementById('fotoMedicoModal').src = foto;
            document.getElementById('nombreProfesionalModal').innerHTML = item.nombreMedico;
            document.getElementById('tituloMedicoModal').innerHTML = item.especialidad;
            document.getElementById('fechaAtencionModal').innerHTML = item.fechaText;
            document.getElementById('horaAtencionModal').innerHTML = item.horaDesdeText?.substring(0, 5);
            //$('#modalAnulacion').modal('show');

            document.getElementById('nombreProfesionalModal').innerHTML = item.nombreMedico;
            document.getElementById('tituloMedicoModal').innerHTML = item.especialidad;
            document.getElementById('fechaAtencionModal').innerHTML = item.fechaText;
            document.getElementById('horaAtencionModal').innerHTML = item.horaDesdeText;


            /*Contenido Modal*/
            if (item.fotoPerfil.includes('Avatar.svg'))
                foto = "/img/avatar-medico.png";

            document.getElementById('imgModalAgendarCancela').src = foto;
            $(".fecha_modal").html('<i class="fal fa-calendar-alt"></i> ' + moment(item.fecha).format("DD-MM-YYYY") + ' / ' + item.horaDesdeText);
            $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
            $(".especialidad_modal").html(item.especialidad);

            $('#modalControlAtencionAgendadaCancela').modal('show');
            $(".btnAnulaAtencionx").show();
            document.getElementById('btnAnulaAtencionx').onclick = async () => {

                var valida = await putEliminarAtencion(item.idAtencion, uid);
                if (valida.status !== "NOK") {
                    $('#modalControlAtencionAgendadaCancela').modal('hide');
                    document.getElementById('subtitulo').hidden = true;
                    link.remove();
                    //PARA ELMINAR ATENCION DEL MODAL DE ATENCIONES LAYOUTHOME
                    if ($("#card_" + item.idAtencion))
                        $("#card_" + item.idAtencion).remove();
                    if ($('#kt_widget2_tab1_content')?.children().length > 0 && $('#atenciones').children().length >= 0) {
                        var cantAgendada = $('#kt_widget2_tab1_content').children().length;
                        $(".circulo-alerta-numero-agendada").html(cantAgendada);
                        $(".circulo-alerta-agendada").show();
                    }
                    else {
                        document.getElementById('divSinAtenciones').hidden = false;
                        $(".circulo-alerta-agendada").hide();
                    }


                    //FIN ELIMINAR ATENCION
                    await cambioEstado(item.idAtencion.toString(), "E") // E = Anulada
                    await comprobanteAnulacion(valida.atencion);
                }
                else {
                    Swal.fire('', 'No fue posible cancelar esta atención, comuniquese con mesa de ayuda', 'error')
                }

            }

        }
        let aReagendar = document.createElement('a');
        aReagendar.setAttribute('class', 'btn-icon');
        aReagendar.href = "javascript:void(0);";
        let divIconoReagendar = document.createElement('div');
        divIconoReagendar.setAttribute('class', 'icono');
        let iReagendar = document.createElement('i');
        iReagendar.setAttribute('class', 'fal fa-calendar-edit');
        let divLeyendaReagendar = document.createElement('div');
        divLeyendaReagendar.setAttribute('class', 'leyenda-icono');
        divLeyendaReagendar.innerHTML = "Reagendar";
        aReagendar.onclick = () => {
            var validarHorario = validaHorario(item);
            if (validarHorario)
                return;
            idMedico = item.idMedico;
            cliente = item.idCliente;
            divFecha.classList.add("fecha" + item.idAtencion);
            divHora.classList.add("hora" + item.idAtencion);
            $('#rowDatePicker').empty();
            $('#btnConf').empty();
            $('#btnHorario').empty();
            dataCalendar(item.idConvenio, item.fecha, item.idAtencion, idMedico);

            document.getElementById('nombreprofesional').innerHTML = `Dr(a) ${item.nombreMedico}`;
            $('#modalReagendar').modal('show');
        }

        let aConfirmar = document.createElement('a');
        aConfirmar.setAttribute('class', 'btn-icon');
        aConfirmar.href = "javascript:void(0);";
        let divIconoConfirmar = document.createElement('div');
        divIconoConfirmar.setAttribute('class', 'icono');
        let iConfirmar = document.createElement('i');
        iConfirmar.setAttribute('class', 'fal fa-calendar-check');
        let divLeyendaConfirmar = document.createElement('div');
        divLeyendaConfirmar.setAttribute('class', 'leyenda-icono');
        divLeyendaConfirmar.innerHTML = "Confirmar";
        aConfirmar.onclick = async () => {
            var validarHorario = validaHorario(item);
            if (validarHorario)
                return;
            if (divConfirmaAtencion.innerHTML === "Atención Confirmada") {
                Swal.fire('', 'Ya confirmaste tu hora', 'info');
                return;
            }
            document.getElementById('nombreProfesionalConfirma').innerHTML = item.nombreMedico;
            document.getElementById('tituloMedicoConfirma').innerHTML = item.especialidad;
            document.getElementById('fechaAtencionConfirma').innerHTML = moment(item.fecha).format("DD-MM-YYYY");
            document.getElementById('horaAtencionConfirma').innerHTML = item.horaDesdeText.substring(0, 5);
            document.getElementById('horaAtencionConfirma').setAttribute("class", "hora-atencion text-center");

            /*Contenido Modal*/
            /*Contenido Modal*/
            if (item.fotoPerfil.includes('Avatar.svg'))
                foto = "/img/avatar-medico.png";

            document.getElementById('imgModalAgendarConfirma').src = foto;
            $(".fecha_modal").html(moment(item.fecha).format("DD-MM-YYYY") + ' / ' + item.horaDesdeText);
            $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
            $(".especialidad_modal").html(item.especialidad);

            //$('#modalConfirmacion').modal('show');
            $('#modalControlAtencionAgendadaConfirma').modal('show');
            $(".btnConfirmaAtencionx").show();
            document.getElementById('btnConfirmaAtencionx').onclick = async () => {

                let result = await confirmaPaciente(item.idAtencion, uid)
                if (result.status === "OK") {
                    divConfirmaAtencion.setAttribute("class", "label-confirma-atencion");
                    divConfirmaAtencion.innerHTML = "Atención Confirmada";
                    divContent.appendChild(divConfirmaAtencion);
                    $('#modalControlAtencionAgendadaConfirma').modal('hide');
                    await cambioEstado(item.idAtencion.toString(), "C") // C = Confirmada
                    await comprobantePaciente(baseUrlWeb, result.atencion);
                }
                else {
                    Swal.fire('', 'No fue posible confirmar esta atención, intentelo más tarde', 'error')
                }


            }

        }

        let aIrBox = document.createElement('a');
        aIrBox.setAttribute('class', 'btn-icon');
        aIrBox.href = "javascript:void(0);";
        let divIconoIrBox = document.createElement('div');
        divIconoIrBox.setAttribute('class', 'icono');
        let iIrBox = document.createElement('i');
        iIrBox.setAttribute('class', 'fal fa-check-circle');
        let divLeyendaIrBox = document.createElement('div');
        divLeyendaIrBox.setAttribute('class', 'leyenda-icono');
        divLeyendaIrBox.innerHTML = "Ir a la Atención";
        aIrBox.onclick = async () => {

            var log = {
                IdPaciente: uid,
                Evento: "Paciente presiona link para ingresar al box",
                IdAtencion: parseInt(item.idAtencion)
            }
            // await logPacienteViaje(log);
            var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(minValidacion, 'minutes').format('HH:mm');

            if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
                Swal.fire(`Ya han pasado ${minValidacion} min. desde que comenzó tu atención, se ha cancelado`, "", "warning")
                return;
            }
            //else if(horaAntes > moment().format("DD-MM-YYYY HH:mm")) {
            //    Swal.fire("Aún no es hora de tu atención", "", "warning")
            //    return;
            //}
            else {
                window.location = "/Atencion_SalaEspera/" + item.idAtencion;
            }
        }

        let divContFecha = document.createElement('div');
        divContFecha.setAttribute('class', 'col-12 col-lg-auto ml-auto p-0');

        let divFechaHora = document.createElement('div');
        divFechaHora.setAttribute('class', 'fecha-atencion');

        let divFecha = document.createElement('div');
        divFecha.setAttribute('class', 'fecha');
        divFecha.innerHTML = moment(item.fecha).format("DD-MM-YYYY");

        let divHora = document.createElement('div');
        divHora.setAttribute('class', 'hora');
        divHora.innerHTML = item.horaDesdeText?.substring(0, 5);


        let div = document.getElementById('atencionesA');
        link.appendChild(divContent);
        //atencionConfirmada
        divContent.appendChild(divConfirmaAtencion);
        //contenedor de img profesional;
        divContent.appendChild(divContentItemCenter);
        divContentItemCenter.appendChild(contImgProf1);
        contImgProf1.appendChild(contImgProf2);
        contImgProf2.appendChild(imgProf);
        //------------------------------

        //contenedor de datos de medico;
        divContentItemCenter.appendChild(divContDatos1);
        divContDatos1.appendChild(divContDatos2);
        divContDatos2.appendChild(divNombreProf);
        divNombreProf.appendChild(spanNombre);
        divContDatos2.appendChild(divRegistro);
        divContDatos2.appendChild(divEspecialidad);
        //-------------------------------

        //-------------iconos
        divContentItemCenter.appendChild(divContIconos);
        divContIconos.appendChild(divIconos);
        divIconos.appendChild(aAnular);
        aAnular.appendChild(divIconoAnular);
        divIconoAnular.appendChild(iAnular);
        aAnular.appendChild(divLeyendaAnular);

        divIconos.appendChild(aReagendar);
        aReagendar.appendChild(divIconoReagendar);
        divIconoReagendar.appendChild(iReagendar);
        aReagendar.appendChild(divLeyendaReagendar);

        //confirmar Atención
        if (!window.host.includes('clinicamundoscotia.')) {
            divIconos.appendChild(aConfirmar);
            aConfirmar.appendChild(divIconoConfirmar);
            divIconoConfirmar.appendChild(iConfirmar);
            aConfirmar.appendChild(divLeyendaConfirmar);
        }

        var fechac = moment(item.fecha).format("DD-MM-YYYY");
        var fechahoy = moment().format("DD-MM-YYYY");
        if (fechac == fechahoy) {
            divIconos.appendChild(aIrBox);
            aIrBox.appendChild(divIconoIrBox);
            divIconoIrBox.appendChild(iIrBox);
            aIrBox.appendChild(divLeyendaIrBox);
        }
        //----------------------
        //--------------fecha y hora atencion
        divContentItemCenter.appendChild(divContFecha);
        divContFecha.appendChild(divFechaHora);
        divFechaHora.appendChild(divFecha);
        divFechaHora.appendChild(divHora);


        div.appendChild(link);
        i++;
    });
}

function validaHorario(item) {
    var horaPasada;
    if (parsedUrl.hostname.includes("bo."))
        horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').subtract(5, 'minutes').format('HH:mm');
    else
        horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').subtract(5, 'minutes').format('HH:mm');
    if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
        Swal.fire("", "Está atención ya no puede ser modificada.", "warning")
        return true;
    }
}
async function dataCalendar(idConvenio, fecha, idAtencion, idMedico) {

    var rangoIni;
    var rangoFin;
    var ultimaHoraLista;
    var spanSelectorHorasR;
    var spanSelectorHorasL;
    var seleccion = false;
    var idMedicoHoraSeleccionada = 0;
    var idMedicoSeleccionada = 0;
    var idBloqueHoraSeleccionada = 0;
    var fechaSeleccionSeleccionada = "";
    var horaSeleccionada = "";

    //var fechaSeleccion = moment();

    let btnMañana = document.createElement("button")
    btnMañana.setAttribute("id", "btnManana");
    btnMañana.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-am mr-3");
    btnMañana.innerHTML = "Mañana"
    document.getElementById("btnHorario").appendChild(btnMañana);


    let btnTarde = document.createElement("button")
    btnTarde.setAttribute("id", "btnTarde");
    btnTarde.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-pm");
    btnTarde.innerHTML = "Tarde"

    document.getElementById("btnHorario").appendChild(btnTarde);

    let buttonInside = document.createElement("button");
    buttonInside.setAttribute("id", "btnConfirmarHora");
    buttonInside.setAttribute('class', 'btn btn-success btn-sm');
    buttonInside.innerHTML = "Confirmar Hora";
    document.getElementById("btnConf").appendChild(buttonInside);

    let row = document.getElementById('rowDatePicker');
    let drop = document.createElement('div');
    drop.setAttribute('class', 'cont-datepicker');
    drop.setAttribute('id', 'kt_datepicker_6');
    row.appendChild(drop);
    var fechaSeleccionEstatica = moment();
    var fechaSeleccion = moment();

    $('#kt_datepicker_6').datepicker('setDate', fechaSeleccion._d).datepicker('fill');
    //$('.new').hide() //oculta los días del mes siguiente, con la clase.new
    await pintaCalendar();

    async function pintaCalendar() {

        //obtener la data de los dias con la fecha seleccionada desde calendario
        var diasConAgenda = await getHoraMedicoByCalendar(idMedico, moment(fechaSeleccion).format('YYYYMMDD'), idConvenio, moment(fechaSeleccionEstatica).format('YYYYMMDD'), uid);
        diasConAgenda.forEach(itemDias => {
            var dia = itemDias.info;
            var mes = itemDias.fecha;
            if (moment(mes).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD")) {
                comparaDias(dia, mes)
            }
        })

        document.querySelectorAll('.day').forEach(el => {
            /*en caso de cualquier inconveniente volver a una version anterior del calendario, y ocultar los días nuevos con la clase .new, los dias con clase
             .old, no se pueden ocultar ya que se pierde el orden en las columnas.*/
            //todo dia del calendario que en el paso de comparacion haya quedado distinto a activo, ya sea porque no cayo en el dia con horas, quedara desactivado
            if (!el.getAttribute('class').includes('active')) {
                el.classList.add('disabled');
            }
            //el dia actual siempre quedara activo por defecto
            if (el.getAttribute('class').includes('today')) {
                el.classList.remove('disabled');
                el.classList.add('active');
            }
        })
    }
    function comparaDias(dia, mes) {
        document.querySelectorAll('.day').forEach(item => {
            var a = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("YYYY"); //año fecha seleccionada
            var ac = moment(mes).format('YYYY'); // año compara, desde fecha de bd

            var m = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("MM"); //mes fecha seleccionada
            var mc = moment(mes).format('MM'); //mes fecha desde bd
            if (dia == item.innerHTML && m == mc && a == ac) {
                /*solo se pintan los dias que pertenezcan al dia, 
                mes y año de la fecha que se selecciono, los demas dias quedan desactivados en el siguiente paso*/
                if (!item.getAttribute('class').includes('new') && !item.getAttribute('class').includes('old')) {
                    var d = moment().format('D');
                    if (item.innerHTML == d && m == moment().format("MM") && a == moment().format("YYYY")) {
                        item.classList.add('today');
                    }
                    item.classList.add('active');
                }

            }

        })
    }


    let initValue = 0;

    var horario = true;


    // Busqueda inicial
    var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
    var agendaMedico = await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"), idMedico, horario, true, idConvenio, uid);

    //await cargarInfoMedico(dataMedico);
    document.getElementById('listaHoras').innerHTML = "";

    try {
        var agendaIterar = agendaMedico.slice(initValue, 4);
        if (agendaMedico.length)
            rangoHora(agendaMedico);
        await cargaTituloHorario(agendaIterar[0]);

        agendaIterar.forEach(iterarAgendas);
    } catch (e) {
    }



    // Fin Busqueda inicial

    $('#btnManana').on('click', async function (ev) {
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        reloadData(true);
    });

    $('#btnTarde').on('click', async function (ev) {
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        reloadData(false);
        // await pintaCalendar();
    });

    $('#kt_datepicker_6').datepicker().on('changeDate', async function (ev) {

        //reseteamos parametros seleccionados

        seleccion = false;
        idMedicoHoraSeleccionada = 0;
        idMedicoSeleccionada = 0;
        idBloqueHoraSeleccionada = 0;
        fechaSeleccionSeleccionada = "";
        horaSeleccionada = "";
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();

        reloadData(horario);
        await pintaCalendar();
    });

    $('#kt_datepicker_6').datepicker().on('changeMonth', async function (ev) {

        //reseteamos parametros seleccionados
        seleccion = false;
        idMedicoHoraSeleccionada = 0;
        idMedicoSeleccionada = 0;
        idBloqueHoraSeleccionada = 0;
        fechaSeleccionSeleccionada = "";
        horaSeleccionada = "";
        fechaSeleccion = moment(moment(ev.date).format("YYYY-MM-DD HH:mm:ss")).startOf('month').format("YYYY-MM-DD HH:mm:ss");
        await pintaCalendar();
    });

    async function reloadData(manana) {
        horario = manana;
        initValue = 0;
        var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        agendaMedico = await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"),
            idMedico,
            horario,
            false, idConvenio, uid);

        document.getElementById('listaHoras').innerHTML = "";


        var agendaIterar = agendaMedico.slice(initValue, 4);
        if (agendaIterar.length) {

            rangoHora(agendaMedico);
            await cargaTituloHorario(agendaIterar[0]);
            agendaIterar.forEach(iterarAgendas);

        } else {
            MensajeSinHoras();
        }
    }

    async function MensajeSinHoras() {


        document.getElementById("headerSeleccion").innerHTML = "";

        let divDataHorario = document.createElement('div');
        divDataHorario.classList.add('data-horario');


        let spanTituloDataHorario = document.createElement('span');
        spanTituloDataHorario.classList.add('titulo-data-horario');
        spanTituloDataHorario.innerHTML = "No hay horas disponibles en este momento. Vuelva a intentarlo";
        divDataHorario.appendChild(spanTituloDataHorario);

        document.getElementById("headerSeleccion").appendChild(divDataHorario);
    }
    async function cargaTituloHorario(medico) {
        document.getElementById("headerSeleccion").innerHTML = "";

        let divDataHorario = document.createElement('div');
        divDataHorario.classList.add('data-horario');
        divDataHorario.classList.add('col-lg-8');

        let spanTituloDataHorario = document.createElement('div');
        spanTituloDataHorario.classList.add('titulo-data-horario');

        spanTituloDataHorario.innerHTML = "Agenda " + medico.textoHorario + " " + moment(fechaSeleccion).format("DD-MM-YYYY");

        let rangoHorario = document.createElement('div');
        rangoHorario.classList.add('rango-horario');


        rangoHorario.innerHTML = `De ${rangoIni} Hrs. a ${rangoFin} hrs.`


        divDataHorario.appendChild(spanTituloDataHorario);
        spanTituloDataHorario.appendChild(rangoHorario);

        let divHorario = document.createElement('div');
        divHorario.classList.add('horario');

        spanSelectorHorasL = document.createElement('span');
        spanSelectorHorasL.classList.add('selector-horas');
        spanSelectorHorasL.classList.add('mr-2');

        let spanIconoL = document.createElement('i');
        spanIconoL.classList.add('fas');
        spanIconoL.classList.add('fa-chevron-circle-left');
        spanSelectorHorasL.appendChild(spanIconoL);

        spanSelectorHorasL.addEventListener("click", async function () {

            initValue = initValue - 4;
            if (initValue < 0) {

                initValue = 0;
                spanSelectorHorasL
            }

            document.getElementById('listaHoras').innerHTML = "";

            var agendaIterar = agendaMedico.slice(initValue, initValue + 4);


            await cargaTituloHorario(agendaIterar[0]);


            agendaIterar.forEach(iterarAgendas);
        });

        divHorario.appendChild(spanSelectorHorasL);



        let spanHoraTop = document.createElement('span');
        spanHoraTop.classList.add('hora-top');
        spanHoraTop.setAttribute("id", "spanHoraTop");
        spanHoraTop.innerHTML = moment(moment(fechaSeleccion).format("YYYY-MM-DD" + "T" + medico.horaDesdeText)).startOf('hour').format("HH:mm");
        divHorario.appendChild(spanHoraTop);


        spanSelectorHorasR = document.createElement('span');
        spanSelectorHorasR.classList.add('selector-horas');

        let spanIcono = document.createElement('i');
        spanIcono.classList.add('fas');
        spanIcono.classList.add('fa-chevron-circle-right');
        spanSelectorHorasR.appendChild(spanIcono);

        spanSelectorHorasR.addEventListener("click", async function () {
            initValue = initValue + 4;
            if (initValue > (agendaMedico.length - 4)) {
                initValue = agendaMedico.length - 4;
            }
            document.getElementById('listaHoras').innerHTML = "";

            var agendaIterar = agendaMedico.slice(initValue, initValue + 4);
            await cargaTituloHorario(agendaIterar[0]);


            agendaIterar.forEach(iterarAgendas);

        });

        divHorario.appendChild(spanSelectorHorasR);

        document.getElementById("headerSeleccion").appendChild(divDataHorario);
        document.getElementById("headerSeleccion").appendChild(divHorario);
    }

    async function iterarAgendas(medico, index, array) {

        let liHoraMedico = document.createElement('li');
        liHoraMedico.classList.add('hora');

        if (medico.nombrePaciente === "Disponible" || medico.estadoAtencion == "E") {
            if (idMedicoHoraSeleccionada.toString() === medico.idMedicoHora.toString())
                liHoraMedico.classList.add('seleccionado');
            else
                liHoraMedico.classList.add('disponible');
        }


        else
            liHoraMedico.classList.add('ocupado');


        liHoraMedico.setAttribute('data-idMedicoHora', medico.idMedicoHora);
        liHoraMedico.setAttribute('data-idMedico', medico.idMedico);
        liHoraMedico.setAttribute('data-idBloqueHora', medico.idBloqueHora);
        if (medico.nombrePaciente == "Disponible")
            liHoraMedico.setAttribute('data-estado', medico.nombrePaciente);
        else if (medico.estadoAtencion == "E")
            liHoraMedico.setAttribute('data-estado', "Disponible");
        liHoraMedico.setAttribute('data-horaText', medico.horaDesdeText);

        let spanHoraMedico = document.createElement('span');
        spanHoraMedico.classList.add('detalle-hora');
        spanHoraMedico.innerHTML = medico.horaDesdeText;

        //quitar flecha izquiera cuando la hora de inicio de la lista sea igual a la primera hora de atención del medico
        if (medico.horaDesdeText == agendaMedico[0].horaDesdeText) {
            spanSelectorHorasL.setAttribute("style", "display:none;")
        }

        //quitar flecha derecha cuando la ultima hora de la lista sea igual a la ultima hora de atención del médico.
        if (medico.horaDesdeText == agendaMedico[agendaMedico.length - 1].horaDesdeText) {
            spanSelectorHorasR.setAttribute("style", "display:none;")
        }
        else {
            spanSelectorHorasR.setAttribute("style", "display:block;")

        }
        liHoraMedico.appendChild(spanHoraMedico);


        let spanEstado = document.createElement('span');
        spanEstado.classList.add('estado-hora');

        let smallEstado = document.createElement('small');
        smallEstado.classList.add('estado-hora');

        if (idMedicoHoraSeleccionada.toString() === medico.idMedicoHora.toString())
            smallEstado.innerHTML = "Seleccionado";
        else if (medico.estadoAtencion == "E")
            smallEstado.innerHTML = "Disponible";
        else
            smallEstado.innerHTML = medico.nombrePaciente;



        spanEstado.appendChild(smallEstado);
        liHoraMedico.appendChild(spanEstado);


        liHoraMedico.addEventListener("click", async function () {

            var targetElement = event.target || event.srcElement;
            var liHora = targetElement.closest('.hora');
            var idMedicoHora = liHora.getAttribute('data-idMedicoHora');
            var idMedico = liHora.getAttribute('data-idMedico');
            var idBloqueHora = liHora.getAttribute('data-idBloqueHora');
            var estado = liHora.getAttribute('data-estado');
            var horaText = liHora.getAttribute('data-horaText');


            if (estado === "Disponible") {
                var fechaSeleccion = moment($("#kt_datepicker_6").data('datepicker').getDate())
                    .format("YYYY-MM-DD HH:mm:ss");


                document.querySelectorAll('.seleccionado').forEach(function (li) {
                    li.classList.remove('seleccionado');
                    li.classList.add('disponible');
                });

                document.querySelectorAll('.estado-hora > small').forEach(function (small) {
                    if (small.innerHTML !== "Ocupado")
                        small.innerHTML = "Disponible";

                });


                liHora.classList.remove("disponible");
                liHora.classList.add('seleccionado');


                liHora.querySelectorAll('.estado-hora > small').forEach(function (small) {

                    small.innerHTML = "Seleccionado";

                });
                idMedicoHoraSeleccionada = idMedicoHora;
                idMedicoSeleccionada = idMedico;
                idBloqueHoraSeleccionada = idBloqueHora;
                fechaSeleccionSeleccionada = fechaSeleccion;
                horaSeleccionada = horaText;
                seleccion = true;
            } else {
                Swal.fire("", "Horario no disponible", "warning");
            }
        });


        document.getElementById('listaHoras').appendChild(liHoraMedico);


    }
    async function guardarAtencion(idMedico, idBloqueHora, fechaSeleccion, idMedicoHora, uid) {


        //Verificamos si existe atencion

        let agendar = {
            id: parseInt(idAtencion),
            idBloqueHora: parseInt(idBloqueHora),
            fechaText: fechaSeleccion,
            triageObservacion: '',
            antecedentesMedicos: '',
            idPaciente: uid,
            SospechaCovid19: false,
            IdMedicoHora: parseInt(idMedicoHora),
            IdCliente: idCliente ? idCliente : 0
        };




        let resultado = await reagendarApp(agendar, idMedico, uid);

        if (resultado.err == 1) {
            return 1;
        }
        else if (resultado.err == 2) {
            return 2;
        }
        else {

            return resultado;
        }


    }

    document.getElementById("btnConfirmarHora").addEventListener("click", async function () {
        if (!seleccion) {
            Swal.fire("", "Debe seleccionar una hora", "warning");
            return;
        } else {
            $('#btnConfirmarHora').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            //Swal.fire("",idMedicoHoraSeleccionada + idAtencion+ idBloqueHoraSeleccionada,"question")

            let valida = await guardarAtencion(idMedicoSeleccionada,
                idBloqueHoraSeleccionada,
                moment(fechaSeleccion).format("DD-MM-YYYY"),
                idMedicoHoraSeleccionada,
                uid);
            if (valida.err == 1) {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
            else if (valida.err == 2) {
                Swal.fire("Error!", "Esta hora ya fue tomada, favor seleccionar otra hora", "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
            else if (valida.err == 3) {
                Swal.fire("Error!", valida.msg, "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }

            else {
                document.querySelector(".fecha" + idAtencion).innerHTML = moment(fechaSeleccion).format("DD/MM/YYYY")
                document.querySelector(".hora" + idAtencion).innerHTML = horaSeleccionada;

                await comprobantePaciente(baseUrlWeb, valida.atencionModel);
                if (!window.host.includes('unabactiva.') &&
                    !window.host.includes('activa.unab.') &&
                    !window.host.includes('achs.') &&
                    !window.host.includes('uoh')) {
                    await enviarCitaEniax(valida.infoAtencion.idAtencion);
                    await cambioEstado(idAtencion, "E") // E = Anulada
                }
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                $('#modalReagendar').modal('hide');
                Swal.fire("Hora Reagendada", `Tú hora ha sido reagendada para el día  ${document.querySelector(".fecha" + idAtencion).innerHTML} a las ${document.querySelector(".hora" + idAtencion).innerHTML} hrs.`, "success")
                location.reload();
            }



        }







    });
    function rangoHora(agendaMedico) {
        rangoIni = agendaMedico[0].horaDesdeText
        rangoFin = agendaMedico[agendaMedico.length - 1].horaDesdeText;
    }

}
async function configElementos(beneficiarios) {

    // profesionales invitados
    let selectAsociado = document.querySelector('select[name="selectBeneficiario"]');
    $("#selectBeneficiario").empty();
    let option = document.createElement('option');
    option.setAttribute('value', 0);
    option.innerHTML = "Seleccionar";
    selectAsociado.appendChild(option);
    let opcion2 = document.createElement('option');
    beneficiarios.forEach(async param => {
        opcion2 = document.createElement('option');
        opcion2.setAttribute('value', param.userId);
        opcion2.innerHTML = param.nombreCompleto;
        selectAsociado.appendChild(opcion2);
    });


}
async function ActualizarNSP(uid, id) {
    var idAtencion = document.getElementById(id);
    idAtencion.setAttribute('class', 'aviso-atencion container-fluid nsp');
    validarNSP = true;

}

if ($("#plan-nutricion").length) {
    let btnNutricion = document.getElementById("plan-nutricion");
    btnNutricion.onclick = async () => {
        remover(btnNutricion);
        var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=nutricion";
        redireccionar(url);
    }
}

if ($("#telemedicina").length) {
    let btnTelemedicina = document.getElementById("telemedicina");
    btnTelemedicina.onclick = async () => {
        remover(btnTelemedicina);
        var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=telemedicina";
        redireccionar(url);

    }
}
if ($("#medicamentos").length) {
    let btnMedicamentos = document.getElementById("medicamentos");
    btnMedicamentos.onclick = async () => {
        remover(btnMedicamentos);
        var url = "/Paciente/Farmacias";
        redireccionar(url);

    }
}
if ($("#toma-examenes").length) {
    let btnExamenesCpu = document.getElementById("toma-examenes");
    btnExamenesCpu.onclick = async () => {
        remover(btnExamenesCpu);
        var url = "/asistenciatomaexamenes/index";
        redireccionar(url);
    }
}
if ($("#orientacion-salud").length) {
    let btnOrientacionDeSaludCpu = document.getElementById("orientacion-salud");
    btnOrientacionDeSaludCpu.onclick = async () => {
        remover(btnOrientacionDeSaludCpu);
        var url = "/Gescaec/index";
        redireccionar(url);
    }
}
if ($("#fitness").length) {
    let btnFitnessCpu = document.getElementById("fitness");
    btnFitnessCpu.onclick = async () => {
        remover(btnFitnessCpu);
        var url = "/Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=fitness";
        redireccionar(url);
    }
}

if ($("#plan-salud").length) {
    let btnPlan = document.getElementById("plan-salud");
    btnPlan.onclick = async () => {
        location.href = "/Paciente/PlanSalud";
    }
}

if ($("#atencion-inmediata").length) {
    let btnAtencionInmediataCpu = document.getElementById("atencion-inmediata");
    btnAtencionInmediataCpu.onclick = async () => {
        remover(btnAtencionInmediataCpu);
        especialidad = 1;

        var dataDirecta = dataBtn.timelineData.filter(itemF => itemF.atencionDirecta && itemF.estadoAtencion == "I" && itemF.idEspecialidadFilaUnica == 1)

        var filtro = filtrarAtencionVigente(dataDirecta)
        if (filtro == 1)
            return;
        urlAgent = `/Paciente/Agenda_1?idMedico=0&fechaPrimeraHora=${moment().format("YYYY-MM-DD")}&m=2&r=2&c=${idConvenio}&especialidad=1&tipoatencion=I`
        var atencionPendienteSala = await AtencionPendiente(uid, 1, idCliente);
        if (atencionPendienteSala != 1) {
            var restriccion = restriccionTiempo(idCliente, 1)
            if (restriccion == false) {
                return;
            }
            var sessionPlataforma = 'COOPEUCH';


            //atención inmediata sin pago
            let agendar = {
                id: 0,
                idBloqueHora: idBloque,
                idPaciente: uid,
                IdMedicoHora: idMedicoHora,
                Estado: 'P',
                idCliente: parseInt(idCliente),
                idEspecialidadFilaUnica: especialidad,
                idSesionPlataformaExterna: sessionPlataforma
            };
            let valida = await putAgendarMedicosHoras(agendar, 0, uid);
            await GrabarLogs("Paciente presiona atención inmediata.", `cardif inmediata`);
            if (valida !== 0) {
                urlAgent = `/Paciente/Agenda_3?idMedicoHora=${valida.infoAtencion.idHora}&idMedico=${valida.infoAtencion.idMedico}&idBloqueHora=${valida.atencionModel.idBloqueHora}&fechaSeleccion=${valida.infoAtencion.fecha}&hora=${valida.infoAtencion.horaDesdeText}&horario=True&idAtencion=${valida.infoAtencion.idAtencion}&m=1&r=1&c=${idConvenio}&tipoatencion=I&especialidad=${especialidad}`;
                //validationModalDevices()
                modalDeviceOrContingencia()
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");

            }
            // window.location.href = url;
        }
        //validationModalDevices()
        modalDeviceOrContingencia()
        //var url = "/Gescaec/index";
        //redireccionar(url);
    }
}


function cambioImg(obj, boolImg) {
    var urlImg = "~/img/coopeuch/iconos/home/" + obj.id + ".svg"
    var urlImgB = "~/img/coopeuch/iconos/home/" + obj.id + "-b.svg"

    if (boolImg == false) {

    }

}



function redireccionar(url) {
    let btnContinuar = document.getElementById("btnContinuar");
    btnContinuar.onclick = async () => {
        window.location.href = url;
    }
}

function remover(obj) {

    var elems = document.querySelectorAll('.card-coopeuch');
    var index = 0, length = elems.length;
    var urlImg = "/img/coopeuch/iconos/home/";

    if (!obj.classList.contains('card-coopeuch-click')) {

        for (; index < length; index++) {
            elems[index].classList.remove('card-coopeuch-click');
            elems[index].getElementsByTagName('img')[0].src = urlImg + elems[index].id + ".svg"

        }
        document.getElementById("btnContinuar").disabled = false;
        obj.classList.add('card-coopeuch-click');
        //  document.querySelector("#" + obj.id + ">img:first-child").src = urlImg + '-b.svg';
        obj.getElementsByTagName('img')[0].src = urlImg + obj.id + "-b.svg"

    }
    else {
        for (; index < length; index++) {
            elems[index].classList.remove('card-coopeuch-click');
            elems[index].getElementsByTagName('img')[0].src = urlImg + elems[index].id + ".svg";
        }
        document.getElementById("btnContinuar").disabled = true;

    }

}
/*
const map = new Map();
map.set(260, "cl");
map.set(261, "co");
map.set(262, "mx");*/


$('.flag').each(function (i, obj) {
    var bandera = $(this).data("id");
    if (bandera == "cl" && idCliente == 260) {
        $("#chileFlag").attr('style', 'background-color:#ddd');
    } else if (bandera == "co" && idCliente == 261) {
        $("#colombiaFlag").attr('style', 'background-color:#ddd');
    } else if (bandera == "mx" && idCliente == 262) {
        $("#mexicoFlag").attr('style', 'background-color:#ddd');
    } else {

    }
});

if ($("#chileFlag").length > 0) {
    var chile = document.getElementById('chileFlag');
    chile.onclick = async function () {
        var countryCode = "cl";
        var cambioCliente = await cambioIdClienteVip(countryCode);
        if (cambioCliente == "ok") {
            location.reload();
        } else {
            swal.fire("", "Ha ocurrido un error", "warning");
        }
    };
}


if ($("#colombiaFlag").length > 0) {
    var colombia = document.getElementById('colombiaFlag');
    colombia.onclick = async function () {
        var countryCode = "co";
        var cambioCliente = await cambioIdClienteVip(countryCode);
        if (cambioCliente == "ok") {
            location.reload();
        } else {
            swal.fire("", "Ha ocurrido un error", "warning");
        }
    };
}

if ($("#mexicoFlag").length > 0) {
    var mexico = document.getElementById('mexicoFlag');
    mexico.onclick = async function () {
        var countryCode = "mx";
        var cambioCliente = await cambioIdClienteVip(countryCode);
        if (cambioCliente == "ok") {
            location.reload();
        } else {
            swal.fire("", "Ha ocurrido un error", "warning");
        }
    };
}


$('#form_crea_user').validate({
    errorClass: 'text-danger',
    error: 'has-error',
    highlight: function (input) {
        $(input).parents('.form-line').addClass('has-error', 'text-danger');
    },
    unhighlight: function (input) {
        $(input).parents('.form-line').removeClass('has-error', 'text-danger');
    },
    errorPlacement: function (error, element) {
        $(element).parents('.form-group').append(error);
    },
    submitHandler: async function (form, e) {
        e.preventDefault();

        /*document.querySelector("#btnActualizar").onclick = async () => {*/
        //$('#btnCrear').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');


        var formData = {
            Nombre: document.querySelector('[name="Nombre"]').value,
            ApellidoPaterno: document.querySelector('[name="ApellidoPaterno"]').value,
            ApellidoMaterno: document.querySelector('[name="ApellidoMaterno"]').value,
            Identificador: document.querySelector('[name="Identificador"]').value.trim(),
            Correo: document.querySelector('[name="Correo"]').value,
            Telefono: document.querySelector('[name="Telefono"]').value,
            UidFirebase: document.querySelector('[name="uidFirebase"]').value
        };


        //INICIO JS VALIDACION CAMPOS

        //if ($("#Nombre").val().trim() == '') {
        //    Swal.fire("", "Ingrese un Nombre", "warning");
        //    $("#Nombre").focus();
        //    return;
        //}
        //if ($("#ApellidoPaterno").val().trim() == '') {
        //    Swal.fire("", "Ingrese un Apellido Paterno", "warning")
        //    $("#ApellidoPaterno").focus();
        //    return;
        //}
        //if ($("#Telefono").val().trim() == '') {
        //    Swal.fire("", "Ingrese un número de Teléfono", "warning")
        //    $("#Telefono").focus();
        //    return;
        //}
        //if ($("#Identificador").val().trim() == '') {
        //    Swal.fire("", "Ingrese su número de Identificación", "warning")
        //    $("#Identificador").focus();
        //    return;
        //}


        //FIN JS VALIDACION CAMPOS

        var result = await EditInfoPerfilInvitadoFirebase(formData, document.querySelector('[name="uidFirebase"]').value);
        //var cookies = await DeleteCookiesFirebase();
        $('#btnActualizar').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);

        if (result.status === 'Ingresado') {

            await sendCorreoBienvenidaFirebase(formData);
        }
        window.location.href = window.location.href;
    }
});

//const identificador = document.getElementById("Identificador");
//identificador.onblur = async () => {


//    if ($.validateRut(identificador)) {
//        Swal.fire("Error!", "El rut " + rut + " es inválido.", "error");
//    }
//    else {
//        let valida = await validarRutConvenio(identificador);
//        if (valida.length > 0) {

//            Swal.fire({
//                title: 'El rut ingresado ya se encuentra registrado',
//                text: 'Para continuar debe loguearse',
//                type: 'warning',
//                showCancelButton: false,
//                confirmButtonText: "OK"
//            }).then(resultado => {
//                if (resultado.value) {
//                    //$('#modalActualizacionPaciente').modal('toggle');
//                    //$('#modalLogin').modal('toggle');                    
//                    $('#loginPost1').removeAttr("style");
//                    $('#form_crea_user').addClass('d-none');
//                    $('#exampleModalLabel').addClass('d-none');
//                    $('#idicono').addClass('d-none');     
//                }
//                else {
//                    $('#modalActualizacionPaciente').modal('toggle');
//                    $('.modal-backdrop').remove();
//                }
//            });


//        }
//    }

//    }
//}



// INICIO LOGIN USUARIO EXISTENTE
async function doAjax(formData) {
    const result = await $.ajax({
        type: "POST",
        url: '/account/guestLogin',
        data: formData,
    });

    return result;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
if ($("#kt_login_signin_submit").length > 0) {
    document.querySelector("#kt_login_signin_submit").onclick = async () => {
        $('#kt_login_signin_submit').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');

        var formData = {
            userName: document.querySelector('[name="Username"]').value,
            password: document.querySelector('[name="Password"]').value,
            rol: document.querySelector('[name="rol"]').value,
            JsonData: document.querySelector('[name="JsonData"]').value,
        };
        var respuesta = await doAjax(formData)

        var cookies = await DeleteCookiesFirebase();
        if (!respuesta == ' ') {

            if (respuesta.status === 'Encontrado') {

                window.location.href = '/';
            }
            else {
                $('#kt_login_signin_submit').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }


        }
    }
}

if ($("#kt_login_forgot_cancel").length > 0) {
    document.querySelector("#kt_login_forgot_cancel").onclick = async () => {
        $('.modal-backdrop').remove();
        $('#kt_login_signin_submit').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

        $('#loginPost').addClass('d-none');;
        $('#idicono').addClass('d-none');
        $('#form_crea_user').removeClass('d-none');
        $('#exampleModalLabel').removeClass('d-none');
        limpiar();

    }
}
if ($("#kt_login_forgot").length > 0) {
    document.querySelector("#kt_login_forgot").onclick = async () => {

        /*$('#loginPost1').css('display', 'none !important');*/
        $('#pageReset').removeClass('d-none');
        $('#loginPost').addClass('d-none');
        $('#idicono').addClass('d-none');
        limpiar();
    }
}
// FIN LOGIN USUARIO EXISTENTE
//--------------------------------------------------------------//



// VALIDACION CAMBIO DE CLAVE

var KTLoginGeneral = function () {
    var showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="alert alert-bold alert-solid-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+ msg + '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        KTUtil.animateClass(alert[0], 'fadeIn animated');
    }

    var rutValido = true;
    var userNameReset;
    var handleForgotFormSubmit = function () {
        userNameReset = document.getElementById("identificadorReset").value;
        $('#kt_login_forgot_submit').click(async function (e) {
            e.preventDefault();

            var login = $('#loginPost');
            var btn = $(this);
            var form = $(this).closest('form');

            userNameReset = document.getElementById("identificadorReset").value;


            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un RUT válido.');
                return;
            }
            form.validate({
                rules: {
                    Username: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '/account/pageresetinvitado?baseUrl=' + baseUrlWeb,
                success: function (response, status, xhr, $form) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states

                    const jsonResponse = JSON.parse(response);

                    if (jsonResponse.err) {
                        switch (jsonResponse.err) {
                            case 1:
                                showErrorMsg(form, 'danger', `No se ha podido encontrar tu cuenta de Medical`);
                                break;
                            case 3:
                                showErrorMsg(form, 'danger', mensaje);
                                break;
                            default:
                                showErrorMsg(form, 'danger', `Ocurrió un error. Favor intenta nuevamente.`);
                        }
                        return;
                    }
                    else {
                        // display signup form
                        //$('#loginPost').removeClass('d-none');
                        $('#cambioClave').removeClass('d-none');

                        var signInForm = login.find('.kt-login__signin form');
                        //$('#idicono').removeClass('d-none');
                        $('#pageReset').addClass('d-none');
                        showErrorMsg(signInForm, 'success', `La instrucci${decodeURI("%C3%B3")}n de recuperaci${decodeURI("%C3%B3")}n de contrase${decodeURI("%C3%B1")}a ha sido enviada a tu correo.`);
                    }
                }
            });
        });
    }

    var handlePasswordReset = function () {
        $('#kt_password_reset_submit').click(async function (e) {
            e.preventDefault();
            var login = $('#loginPost');
            var btn = $(this);
            var form = $(this).closest('form');
            var pw = $('form').serializeArray();

            //var pwR = Object.values(pw[10]);
            //pw = Object.values(pw[9]);
            var pwR = Object.values(pw[21]);
            pw = Object.values(pw[20]);
            pw = pw[1];
            pwR = pwR[1];

            let usuario = await getUserByUserName(userNameReset);


            document.querySelector('[name="username"]').value = userNameReset;
            document.querySelector('[name="ActivationCode"]').value = usuario.activationCode;



            //A Continuacion se utilizan funciones para veririfcar que la clave contenga minimo
            //Una letra minuscula, mayuscula, un numero, la clave no haya sido utilizada anteriormente,
            //Y Validar que las claves en el campo de repetir Contraseña sean iguales

            let mayus = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            let minus = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            let num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            function buscar(find, cont) {
                let found = new Boolean();
                found = false;

                for (let val of find) {
                    if (cont.includes(val)) {
                        found = true;
                        break;
                    }
                }
                return found;
            }


            if (pw.length < 8 || pw.length > 15) {
                Swal.fire("", "La contraseña debe tener entre 8 y 15 caracteres ", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }

            if (!buscar(pw, mayus) || !buscar(pw, minus) || !buscar(pw, num)) {
                Swal.fire("", "La contraseña deben tener como mínimo una letra minúscula, una letra mayúscula y un número", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (pw != pwR) {
                Swal.fire("", "Las contraseñas deben coincidir", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }

            var userName = document.querySelector('[name="username"]').value;
            let oldPass = await compareOldPassword(userName, pw);

            if (oldPass) {
                Swal.fire("", "No puedes usar una clave ingresada anteriormente", "warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un RUT válido.');
                return;
            }
            form.validate({
                rules: {
                    Username: {
                        required: true,

                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '/account/ResetPassword',
                success: async function (response, status, xhr, $form) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states

                    const jsonResponse = JSON.parse(response);
                    if (jsonResponse.err) {
                        switch (jsonResponse.err) {
                            case 1:
                                showErrorMsg(form, 'danger', `No se ha podido encontrar tu cuenta de Medical`);
                                break;
                            case 7:
                                showErrorMsg(form, 'danger', `El c${decodeURI("%C3%B3")}digo de validación no es correcto`);
                                break;
                            case 8:
                                showErrorMsg(form, 'danger', `Debe ingresar una contrase${decodeURI("%C3%B1")}a.`);
                                break;
                            case 9:
                                showErrorMsg(form, 'danger', `Debe confirmar su contrase${decodeURI("%C3%B1")}a.`);
                                break;
                            case 10:
                                showErrorMsg(form, 'danger', `Las contrase${decodeURI("%C3%B1")}as ingresadas no son iguales`);
                                break;
                            default:
                                showErrorMsg(form, 'danger', `Ocurri${decodeURI("%C3%B3")} un error. Favor intenta nuevamente.`);
                        }
                        return;
                    }
                    else {
                        // display signup form

                        var signInForm = $('#loginPost'); //login.find('.kt-login__signin form');

                        $('#cambioClave').addClass('d-none');
                        $('#loginPost').removeClass('d-none');

                        showErrorMsg(signInForm, 'success', `Tu contrase${decodeURI("%C3%B1")}a ha sido modificada correctamente.`);



                        let save = await saveOldPassword(userName);
                    }
                }
            });
        });
    }


    // Public Functions
    return {
        // public functions
        init: function () {
            handlePasswordReset();
            handleForgotFormSubmit();

            var validation = document.getElementsByName("ActivationCode")[0];

            if (validation && validation.value !== "00000000-0000-0000-0000-000000000000") {
                //displayResetPasswordForm();
            }


        }
    };
}();

$('#kt_password_reset_cancel').click(async function (e) {
    e.preventDefault();

    $('#pageReset').addClass('d-none');
    $('#cambioClave').addClass('d-none');
    //$('#loginPost1').removeClass('d-none');
    $('#loginPost1').removeAttr("style");
    $('#idicono').removeClass('d-none');
    limpiar();
});


// FIN VALIDACION CAMBIO DE CLAVE


async function validarRutConvenio(identificador) {

    const campoIdentificador = document.getElementById("Identificador");
    if (campoIdentificador.value != identificador) {
        let usuario = await findUsernameConvenio(campoIdentificador.value);

        if (!usuario)
            campoIdentificador.value = "";
        return usuario;
    }
    else {
        return true;
    }
}

async function formatRut() {
    try {

        $("input#Identificador").rut({
            formatOn: 'keyup',
            minimumLength: 4,
            validateOn: 'blur',
            useThousandsSeparator: false
        }).on('rutInvalido', function (e) {
            if (document.getElementById("Identificador").value != "") {
                Swal.fire("Error!", "El rut " + document.getElementById("Identificador").value + " es inválido.", "error");
                document.getElementById("Identificador").value = "";
            }
        }).on('rutValido', async function (e) {
            var identificador = document.getElementById("Identificador");
            let valida = await validarRutConvenio(identificador);
            if (valida.length > 0) {
                Swal.fire({
                    title: 'El rut ingresado ya se encuentra registrado',
                    text: 'Para continuar debe loguearse',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: "OK"
                }).then(resultado => {
                    if (resultado.value) {
                        //$('#modalActualizacionPaciente').modal('toggle');
                        //$('#modalLogin').modal('toggle');
                        $('#loginPost1').removeAttr("style");
                        $('#form_crea_user').addClass('d-none');
                        $('#exampleModalLabel').addClass('d-none');
                        $('#idicono').addClass('d-none');
                        document.getElementById("kt_firebase").value = identificador.value;
                    }
                    else {
                        $('#modalActualizacionPaciente').modal('toggle');
                        $('.modal-backdrop').remove();
                    }
                });


            }
        });

        $("input#kt_firebase").rut({
            formatOn: 'keyup',
            minimumLength: 4,
            validateOn: 'blur',
            useThousandsSeparator: false
        }).on('rutInvalido', function (e) {
            if (document.getElementById("kt_firebase").value != "") {
                Swal.fire("Error!", "El rut " + document.getElementById("kt_firebase").value + " es inválido.", "error");
                document.getElementById("kt_firebase").value = "";
            }
        });


        $("input#identificadorReset").rut({
            formatOn: 'keyup',
            minimumLength: 4,
            validateOn: 'change',
            useThousandsSeparator: false
        }).on('rutInvalido', function (e) {
            Swal.fire("Error!", "El rut " + $(this).val() + " es inválido.", "error");
            document.getElementById("identificadorReset").value = "";
        });

    } catch (e) {

    }

}

// Class Initialization
jQuery(document).ready(async function () {

    var parsedUrl = new URL(window.location.href);
    var url = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1);

    KTLoginGeneral.init();

});

async function GrabarLogs(evento, info) {
    var log = {
        IdPaciente: window.uid,
        Evento: evento,
        Info: info,
        IdCliente: window.idCliente
    }
    await logPacienteViaje(log);
}

export function validationModalDevices() {
    console.log('llamo a validation devices')
    if (window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia.") || window.host.includes("masproteccionsalud.") || window.host.includes("saludproteccion.") || window.host.includes("saludtumundoseguro.") || idCliente == 1) {
        window.location.href = urlAgent;
    } else {
        $("#btnAtencionDirectaGeneralLoading").removeClass("loading").attr('disabled', false);
        document.getElementById("btnAtencionDirectaGeneral").setAttribute('style', 'pointer-events: auto;');
        $("#modal-devices").modal("show");
    }
}


function modalContingenciaFila() {
    $("#btnAtencionDirectaGeneralLoading").removeClass("loading").attr('disabled', false);
    document.getElementById("btnAtencionDirectaGeneral").setAttribute('style', 'pointer-events: auto;');

    $('#modalContingenciaFila').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function modalDeviceOrContingencia() {
    if (window.codigoTelefono.includes("CL") && !window.host.includes("masproteccionsalud.") && !window.host.includes("saludproteccion.") && !window.host.includes("clinicamundoscotia.") && !window.host.includes("andessalud.")) {
        modalContingenciaFila()
    } else {
        validationModalDevices()
    }   
}