


import { putActualizarTriage, postNspPaciente, getAtencionEspera, getAtencion, getEstadoFilaUnica } from '../apis/atencion-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js?rnd=9";
import { EditPhoneEmail, logPacienteViaje } from '../apis/personas-fetch.js?rnd=9';
import { actualizarPreAtencion } from '../apis/pre-atencion-fetch.js?rnd=9';
import { getArchivosByIdEntidad, deleteFile } from '../apis/archivo-fetch.js?rnd=9';

var connectionArchivo;
var tipoAccion;
var connection;
var idAtencion = 0;
var atencion = {};
var connectionActualizar;
var idEntidad = 0;
var codEntidad = "ATENCIONES"
var connectionTermino;
const asyncIntervals = [];

const runAsyncInterval = async (cb, interval, intervalIndex) => {
    await cb();
    if (asyncIntervals[intervalIndex]) {
        setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    }
};

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

var rutaDescarga = `${baseUrl}/agendamientos/archivo/DescargarArchivo?id=`;
export async function init(data) {
    //swal.fire({
    //    html: `<img src="/img/emojiDemora.png" style="width: 90px;"><br><br>
    //          <strong style="font-size: 15px !important;font-weight: 800;">Ooops!! Perdón por la demora!</strong><br><br>
    //          <p>Estamos con tiempos de espera mayores dado el COVID-19, por favor mantente en la sala de espera hasta que llegue tu turno.</p>
    //          <p style="font-weight: 800;">¡La fila avanza rápido!</p>`,
    //    reverseButtons: true,
    //    confirmButtonText: 'ENTENDIDO'
    //})

    await personaFotoPerfil();
 
    let page = document.getElementById('page');
    await agendarRealTime();
    if (data.atencion.id > 0) {
        idAtencion = data.atencion.id;
        atencion = data.atencion;

        var constraints = { audio: true, video: true };
        try {
            DetectRTC.load(async function () {
                var permisoMic = DetectRTC.isWebsiteHasMicrophonePermissions;
                var permisoCamara = DetectRTC.isWebsiteHasWebcamPermissions;
                var existeMic = DetectRTC.hasMicrophone;
                var existeCam = DetectRTC.hasWebcam;
                var mobilDevice = DetectRTC.isMobileDevice;
                var browser = DetectRTC.browser.name;
                DetectRTC.isWebsiteHasWebcamPermissions = true;
                var evento = `Paciente MicrophonePermissions: ${permisoMic} - WebcamPermissions: ${permisoCamara} - dispositivo mic: ${existeMic} - dispositivo cam: ${existeCam} -  Dispositivo Mobile: ${mobilDevice} -  Navegador:  ${browser} - (Sala de espera)`;
                await grabarLog(idAtencion, evento);
                navigator.mediaDevices.getUserMedia(constraints)
                    .then(async function (stream) {
                    })
                    .catch(async function (err) {
                        Swal.fire("Aviso", "Para el funcionamiento de esta video llamada es necesario que habilites los permisos de video y audio. De lo contrario no se podrá realizar la atención", "warning")
                    });
            });
        }
        catch (err) {
            var evento = "catch error";
            await grabarLog(idAtencion, evento);
        }
        try {
            var evento = "";
            switch (idCliente) {
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
            if (window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia") || window.host.includes("masproteccionsalud") || window.host.includes("saludproteccion")  || idCliente == 1 ) {

                $("#salaEsperaDesk").show();
                $("#panelEstado").show();
                setAsyncInterval(async () => buscarAtencion(idAtencion), 40000); //10seg
                
            }

        }
        catch (error) {
            var evento = "catch en atención vigente" + error;
            await grabarLog(idAtencion, evento)
        }
        await terminoAtencionRT(uid,idAtencion);
    }

    else {
        //$('#modal-validacion').modal('show');
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
    const btnArchivoWeb = document.getElementById('tab-archivos-web');
    btnArchivoWeb.onclick = () => {
        ActualizarArchivos(idEntidad, "ATENCIONES", uid, "lista_archivos_espera");
    }

    if (detectSmartcheck == 1) {
        listaArchivosSmartcheck(idEntidad, "ATENCIONES", uid, "listaArchivos_smartcheck");
        $("#modalSmartcheck").modal("show");
    }

    const btnArchivoMobile = document.getElementById('tab-archivos-mobile');
    btnArchivoMobile.onclick = () => {
        ActualizarArchivos(idEntidad, "ATENCIONES", uid, "lista_archivos_mobile");
    }
    let htmlSegundaLinea = "";
    let correoExterno = "";
    let telefonoExterno = "";
    let correo = "";
    let telefono = "";

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

    //document.getElementById("btnConfirmarTerminos").onclick = async () => {

    //    var check = document.getElementById("checkTerminos");
    //    if (!check.checked) {
    //        Swal.fire({
    //            title: `${data.fichaPaciente.nombreCompleto}, es necesario que aceptes los términos y condiciones para acceder a la atención.`,
    //            text: "",
    //            type: "question",
    //            showCancelButton: true,
    //            cancelButtonColor: 'rgb(190, 190, 190)',
    //            confirmButtonColor: '#3085d6',
    //            cancelButtonStyle: 'position:absolute; right:45px',
    //            customClass: 'swal-wide',
    //            reverseButtons: true,
    //            cancelButtonText: "No acepto y deseo salir",
    //            allowOutsideClick: false,
    //            allowEscapeKey: false,
    //            confirmButtonText: "Entendido"
    //        }).then(async (result) => {
    //            if (!result.value) {
    //                retornoCanal();
    //            }
    //        });
    //        return;
    //    }
    //    else {
    //        var radios = document.getElementsByName('customRadio');
    //        var telefonoUpdate = "";
    //        var emailUpdate = "";
    //        emailUpdate = document.getElementById("correoMedical").value;
    //        telefonoUpdate = document.getElementById("telefonoMedical").value;

    //        if (emailUpdate == "" || telefonoUpdate == "") {
    //            Swal.fire("", "Debe completar los datos de contacto", "warning");
    //            return;
    //        }
    //        var emailOk = isEmail(emailUpdate);
    //        if (!emailOk) {
    //            Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
    //            return;
    //        }
    //        $('#btnConfirmarTerminos').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
    //        var respuesta = await EditPhoneEmail(emailUpdate, telefonoUpdate, uid);
    //        var respuestaTerminos = await actualizarPreAtencion(uid, idSesion)
    //        if (respuestaTerminos.status == "OK") {
    //            var evento = "Paciente acepta tèrminos y condiciones";
    //            await grabarLog(0, evento)
    //            atencion = await getAtencionEspera(uid, idSesion, idCliente)

    //            if (atencion.id != -1) {
    //                try {
    //                    idAtencion = atencion.id;
    //                    var evento = "Paciente con atención asignada";
    //                    await grabarLog(idAtencion, evento)
    //                    await ingresoAtencion(atencion.id);
    //                    idEntidad = idAtencion;
    //                    setAsyncInterval(async () => buscarAtencion(idAtencion), 40000); //10seg
    //                    drop();
    //                    //-----------------
    //                    archivoRealTime(idAtencion, codEntidad, uid);
    //                    if (atencion.inicioAtencion) {
    //                        connection.invoke("IniciarAtencion", parseInt(atencion.id)).catch(err => console.error(err));
    //                    }
    //                    $('#modal-validacion').modal('hide');
    //                }
    //                catch (error) {
    //                    var evento = "catch despues de aceptar términos y condiciones " + error;
    //                    await grabarLog(idAtencion, evento, info)
    //                }

    //            }
    //            else {
    //                atencionTerminada();
    //            }
    //            $('#btnConfirmarTerminos').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).attr('style', 'padding-right: 3.5rem;');
    //        }

    //        else {
    //            $('#btnConfirmarTerminos').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).attr('style', 'padding-right: 3.5rem;');
    //            return;
    //        }
    //    }
    //}

  
    document.getElementById("btnAbandonarAtencion").onclick = async () => {
        location.href = `/`;
    }
    document.getElementById("btnAbandonarAtencionMobile").onclick = async () => {
        location.href = `/`;
    }
    function atencionTerminada() {
        Swal.fire({
            text: `Hola! hemos detectado que no estás avanzando en la fila, te recomendamos salir y volver a ingresar. 
                                Si tienes dudas comunícate a WhatsApp  sala de espera`,
            title: "",
            type: "warning",
            showConfirmButton: true
        }).then(async (result) => {
            if (result.value) {
                var evento = "Paciente acepta atención nsp";
                await grabarLog(idAtencion, evento)
                location.href = `/`;
            }
        });
    }
    async function buscarAtencion(idAtencion) {
        try {
            var estado = await getEstadoFilaUnica("A2", 0, idAtencion)
            if (estado.mensaje != null && estado.mensaje != "") {
                //web
                if (estado.posicion === '1') {
                    document.getElementById('tiempo-desk').setAttribute('class', 'd-none')
                    document.getElementById('tiempo-mobile').setAttribute('class', 'd-none');
                    document.getElementById('salaEsperaDesk').classList.add('minSalaEspera');

                }
                else {
                    document.getElementById('tiempo-desk').setAttribute('class', 'tiempo-atencion')
                    document.getElementById('tiempo-mobile').setAttribute('class', 'tiempo-atencion');
                }
                document.getElementById("horaFila-desk").innerHTML = estado.tiempo;
                document.getElementById("posicionFila-desk").innerHTML = estado.posicion;
                //mobile
                document.getElementById("horaFila-mobile").innerHTML = estado.tiempo;
                document.getElementById("posicionFila-mobile").innerHTML = estado.posicion;


                document.getElementById("mensaje").innerHTML = estado.mensaje;
                document.getElementById("mensajeMobile").innerHTML = estado.mensaje;
            }
            var atencion = await getAtencion(idAtencion);
            var info = "Inicio Atencion = " + atencion.inicioAtencion + " ESTADO = " + atencion.estado;
            var evento = "INGRESO A TIMER";
            await grabarLog(idAtencion, evento, info)
            if (atencion.inicioAtencion != null && atencion.estado == "I") {
                var evento = "médico en call, paciente redireccionado por timer";
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
            if (atencion.nsp) {
                atencionTerminada();
            };
        }
        catch (error) {
            var evento = "catch timer " + error;
            await grabarLog(idAtencion, evento, info)
        }

    }
    async function nspPaciente(atencion) {
        Swal.fire({
            title: `Hola ${atencion.nombrePaciente}: <br><br> Al salir de la sala de espera  perderás tu lugar en la fila de atención. Si sales tendrás que tomar la hora nuevamente.`,
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
                var resultNsp = await postNspPaciente(idAtencion, uid)
                tipoAccion = "nspPaciente";
                if (resultNsp.status == "OK") {
                    // no se hace callback por peticion de consalud, excepcion pacientes nsp 
                    //await getResultAtencionEspera(data.atencion.id)
                    if (connectionActualizar.state === signalR.HubConnectionState.Connected) {
                        connectionActualizar.invoke('SubscribeCalendarMedico', parseInt(atencion.idMedico)).then(r => {
                            connectionActualizar.invoke("ActualizarListaUrgencia", parseInt(atencion.idMedico), atencion.fecha, atencion.horaDesdeText, tipoAccion).then(r => {
                                connectionActualizar.invoke('UnsubscribeCalendarMedico', parseInt(atencion.idMedico)).catch(err => console.error(err));
                            }).catch(err => console.error(err));
                        }).catch((err) => {
                            return console.error(err.toString());
                        });
                    }
                    window.onbeforeunload = false;
                    await grabarLog(idAtencion, "Paciente abandona atención salir sala de espera");
                    retornoCanal();
                }
            }
        });
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
                    connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
                    ActualizarArchivos(idEntidad, codEntidad, uid);
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
                idEntidad,
                codEntidad,
                idUsuario: uid
            },

            init: function () {
                const dropzone = this;

                dropzone.on("queuecomplete", function () {
                    ActualizarArchivos(idEntidad, codEntidad, uid, "lista_archivos_espera");
                    connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
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
                idEntidad,
                codEntidad,
                idUsuario: uid
            },

            init: function () {

                const dropzone = this;

                dropzone.on("queuecomplete", function () {
                    ActualizarArchivos(idEntidad, codEntidad, uid, "lista_archivos_mobile");
                    connectionArchivo.invoke("ActualizarArchivos", parseInt(idEntidad), codEntidad).catch(err => console.error(err));
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
//                    location.href = `/Paciente/AtencionDirecta?idAtencion=${idAtencion}`;
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
        ActualizarArchivos(idEntidad, codEntidad, uid);

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

//#end region
