import { personByUser, logPacienteViaje, EditInfoPerfil } from '../apis/personas-fetch.js';
import { insertAtencionesAsistencias } from '../apis/atenciones-asistencias-fetch.js';
import { enviarAtencionAsistencia} from '../apis/correos-fetch.js';

/*---------------------JS ATENCION VONAGE MODALIDAD ONDEMAND O SUSCRIPCION-------------------*/
//js compartidos por tener algunos paneles en común
(async function () {

    var evento;
    var idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    var constraints = { audio: true, video: true };
    var rol = document.querySelector('[name="rol"]').value;
    try {
        DetectRTC.load(async function () {
            var permisoMic = DetectRTC.isWebsiteHasMicrophonePermissions;
            var permisoCamara = DetectRTC.isWebsiteHasWebcamPermissions;
            var existeMic = DetectRTC.hasMicrophone;
            var existeCam = DetectRTC.hasWebcam;
            var mobilDevice = DetectRTC.isMobileDevice;
            var browser = DetectRTC.browser.name;
            DetectRTC.isWebsiteHasWebcamPermissions = true;
            evento = `${rol}  MicrophonePermissions: ${permisoMic} - WebcamPermissions: ${permisoCamara} - dispositivo mic: ${existeMic} - dispositivo cam: ${existeCam} -  Dispositivo Mobile: ${mobilDevice} -  Navegador:  ${browser}  Atencion_Box`;
            await grabarLog(idAtencion, evento);
            navigator.mediaDevices.getUserMedia(constraints)
                .then(async function (stream) {
                })
                .catch(async function (err) {
                    //Aca Modal para activar permisos
                    Swal.fire("Aviso", "Para el funcionamiento de esta video llamada es necesario que habilites los permisos de video y audio. De lo contrario no se podrá realizar la atención", "warning")
                });
        });
    }
    catch (err) {
        evento = "catch error";
        await grabarLog(idAtencion, evento);
    }
    //select panel chat
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

    if ($("#divCuestionarioProgramaSaludSueno").length) {
        document.querySelector('#panel_cuestionarioSueno').onclick = () => {
            const btnReporte = document.querySelector('[id="panel_cuestionarioSueno"]');
            resetButton();
            btnReporte.classList.remove('btn-success');
            btnReporte.classList.add('btn-outline-success')
            jsPanel('#divCuestionarioProgramaSaludSueno');
        };
    }

    /*if ($("#divLicenciaMedicaElectronica").length) {
        document.querySelector('#panel_licenciaMedica').onclick = () => {
            const btnReporte = document.querySelector('[id="panel_licenciaMedica"]');
            resetButton();
            btnReporte.classList.remove('btn-success');
            btnReporte.classList.add('btn-outline-success')
            jsPanel('#divLicenciaMedicaElectronica');
        };
    }*/

    if ($("#divCuestionarioProgramaSaludCronico").length) {
        document.querySelector('#panel_cuestionarioCronico').onclick = () => {
            const btnReporte = document.querySelector('[id="panel_cuestionarioCronico"]');
            resetButton();
            btnReporte.classList.remove('btn-success');
            btnReporte.classList.add('btn-outline-success')
            jsPanel('#divCuestionarioProgramaSaludCronico');
        };
    }

    if ($("#divFormAsistenciaAmbulancia").length) {
        document.querySelector('#btnSolicitarAsistAmbulancia1').onclick = () => {
            const btnReporte = document.querySelector('[id="btnSolicitarAsistAmbulancia1"]');
            resetButton();
            var Prevision = $("#Prevision").val();
            
            if (Prevision == "") {
                Swal.fire("Error!", "Paciente no cuenta con EPS.", "error");
                $("#modalSolicitarAsistencia").modal("hide");
            }
            else { 
            document.querySelector('[id="btnSolicitarAsistAmbulancia1"]').classList.remove('btn-success');
            btnReporte.classList.add('btn-outline-success')
            jsPanel('#divFormAsistenciaAmbulancia');
                $("#modalSolicitarAsistencia").modal("hide");
            }
        };
    } if ($("#divFormAsistenciaMedDom").length) {
        document.querySelector('#btnSolicitarAsistMedicoDomi1').onclick = () => {
            const btnReporte = document.querySelector('[id="btnSolicitarAsistMedicoDomi1"]');
            resetButton();
            var Prevision = $("#Prevision").val();
            
            if (Prevision == "") {
                Swal.fire("Error!", "Paciente no cuenta con EPS.", "error");
                $("#modalSolicitarAsistencia").modal("hide");
            }
            else {
                document.querySelector('[id="btnSolicitarAsistMedicoDomi1"]').classList.remove('btn-success');
                btnReporte.classList.add('btn-outline-success')
                jsPanel('#divFormAsistenciaMedDom');
                $("#modalSolicitarAsistencia").modal("hide");
            }
        };
    }
    if ($("#divAntecedentesMedicos").length) {
        document.querySelector('#panel_antecedentes_medicos').onclick = () => {
            resetButton();
            jsPanel('#divAntecedentesMedicos');
        };
    }
    if ($("#reload").length) {
        document.querySelector("#reload").onclick = () => {
            location.reload();
        };
    }

    if ($("#divConclusionPeritaje").length) {
        document.querySelector('#panel_conclusionPeritaje').onclick = () => {
            resetButton();
            jsPanel('#divConclusionPeritaje');
        };
    }

    if ($("#divReporteAnura").length) {
        document.querySelector('#panel_anura').onclick = () => {
            resetButton();
            jsPanel('#divReporteAnura');
        };
    }

})();

    function abrirModalPaciente() {
    $("#modalConfirmarAsistencia").modal("show");
    };

    function resetButton() {
        document.querySelector('[id="panel_archivos"]').classList.remove('btn-outline-success');
        document.querySelector('[id="panel_historial"]').classList.remove('btn-outline-success');
        document.querySelector('[id="panel_historial"]').classList.remove('btn-outline-success');
        document.querySelector('[id="panel_archivos"]').classList.add('btn-success');
        document.querySelector('[id="panel_historial"]').classList.add('btn-success');


        if ($("#divReporteAnura").length) {
            document.querySelector('[id="panel_anura"]').classList.add('btn-success');
        }

        if ($("#divReporte").length) {
            document.querySelector('[id="panel_reporte"]').classList.remove('btn-outline-success');
            document.querySelector('[id="panel_reporte"]').classList.add('btn-success');
        }
}

$(document).ready(function () {
    $("#btnSolicitarAsistencia").click(function () {
        $("#modalListaAsistencia").modal({ backdrop: true });
    });
    var div = document.getElementById('listaAsistencia');
    var but = document.getElementById('btnSolicitarAsistencia');

    function showHide(e) {
        e.preventDefault();
        e.stopPropagation();
        if (div.style.display == "none") {
            div.style.display = "block";
        } else if (div.style.display == "block") {
            div.style.display = "none";
        }
    }

    //al hacer click en el boton
    but.addEventListener("click", showHide, false);

    //funcion para cualquier clic en el documento
    document.addEventListener("click", function (e) {
        
        //obtiendo informacion del DOM para  
        var clic = e.target;
        
        if (div.style.display == "block" && clic != div) {
            div.style.display = "none";
        }
    }, false);


document.querySelector('#btnSolicitarAsistMedicoDomi').onclick = async () => {
        $("#modalSolicitarAsistencia").modal("show");
        $(".btnSolicitarAsistencia").click(function () {
            $("#modalSolicitarAsistencia").modal("hide");
        });

    }
    document.querySelector('#btnSolicitarAsistAmbulancia').onclick = async () => {
        $("#modalSolicitarAsistencia").modal("show");
        $(".btnSolicitarAsistencia").click(function () {
            $("#modalSolicitarAsistencia").modal("hide");
        });

}
})

    let page = document.getElementById('page');
    page.innerHTML = "Configuración de cuenta";
    page.setAttribute('style', '')

    document.querySelector('#btn_guardar_info_amb').onclick = async () => {

        $('#form_solcitar_ambulancia').validate({
            errorClass: 'text-danger',
            highlight: function (input) {
                $(input).parents('.form-line').addClass('error');
            },
            unhighlight: function (input) {
                $(input).parents('.form-line').removeClass('error');
            },
            errorPlacement: function (error, element) {
                $(element).parents('.form-group').append(error);
            },
            submitHandler: async function (form, e) {
                e.preventDefault();
                var atencionesAsistencias = {
                    IdAtencion: parseInt(document.querySelector('[name="Atencion.Id"]').value),
                    Sintomas: $("#Sintomas").val(),
                    Estado: "V",
                    EdadAsist: $("#EdadAsist").val(),
                    TipoDocumento: $("#TipoDocumento").val(),
                    TipoAsistencia: "Ambulancia"
                };
                var data = {
                    IdAtencion: parseInt(document.querySelector('[name="Atencion.Id"]').value),
                    Nombres: $("#Nombres").val(),
                    Documento: $("#TipoDocumento").val() + " - " + parseInt($("#NumeroIdentificacion").val()),
                    Telefono: $("#NumeroTelefono").val(),
                    Email: $("#Correo").val(),
                    Direccion: $("#Direccion").val() + " " + $("#Ciudad").val() + ", " +  $("#Departamento").val(),
                    TipoAsistencia: "Ambulancia",
                    Sintomas: $("#Sintomas").val()
                };
                $('#btn_guardar_info_amb').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
                
                ;
                let result = await insertAtencionesAsistencias(atencionesAsistencias);
                if (result.status === 'OK') {
                    Swal.fire({
                        tittle: "Éxito!",
                        text: "Atención solicitada correctamente.",
                        type: "success",
                        confirmButtonText: "OK",
                        success: function () {
                            alert("Bien!");
                        }
                    })
                }
                else {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                }
                let correo = await enviarAtencionAsistencia(data);
                $('#btn_guardar_info_amb').removeAttr('disabled').children('.spinner-border').remove();
                if (correo.status === 'OK') {
                    Swal.fire({
                        tittle: "Éxito!",
                        text: "Correo enviado.",
                        type: "success",
                        confirmButtonText: "OK",
                        success: function () {
                            alert("Bien!");
                        }
                    })
                    $("#divFormAsistenciaAmbulancia").hide();
                    $("#divReporte").show();
                    return;
                }
                else {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                }
                
            }
        });
}

document.querySelector('#btn_guardar_info_med').onclick = async () => {
    
    $('#form_solicitar_meddom').validate({
        errorClass: 'text-danger',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        },
        submitHandler: async function (form, e) {
            e.preventDefault();
            var atencionesAsistencias = {
                IdAtencion: parseInt(document.querySelector('[name="Atencion.Id"]').value),
                Sintomas: $("#SintomasM").val(),
                Estado: "V",
                EdadAsist: $("#EdadAsistM").val(),
                TipoDocumento: $("#TipoDocumentoM").val(),
                TipoAsistencia: "Médico a Domicilio"
            };
            
            var data = {
                IdAtencion: parseInt(document.querySelector('[name="Atencion.Id"]').value),
                Nombres: $("#NombresM").val(),
                Documento: $("#TipoDocumentoM").val() + " - " + parseInt($("#NumeroIdentificacion").val()),
                Telefono: $("#NumeroTelefonoM").val(),
                Email: $("#CorreoM").val(),
                Direccion: $("#DireccionM").val() + " " + $("#CiudadM").val() + ", " + $("#DepartamentoM").val(),
                TipoAsistencia: "Médico a Domicilio",
                Sintomas: $("#SintomasM").val()
            };
            ;
            $('#btn_guardar_info_med').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);

            ;
            let result = await insertAtencionesAsistencias(atencionesAsistencias);
            if (result.status === 'OK') {
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Atención solicitada correctamente.",
                    type: "success",
                    confirmButtonText: "OK",
                    success: function () {
                        alert("Bien!");
                    }
                })
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }
            let correo = await enviarAtencionAsistencia(data);
            $('#btn_guardar_info_med').removeAttr('disabled').children('.spinner-border').remove();
            if (correo.status === 'OK') {
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Correo enviado.",
                    type: "success",
                    confirmButtonText: "OK",
                    success: function () {
                        alert("Bien!");
                    }
                })
                $("#divFormAsistenciaMedDom").hide();
                $("#divReporte").show();
                return;
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }
    });
}


 

function jsPanel(opcion) {
    if ($("#divReporte").length) $("#divReporte").hide();
    if ($("#divReporteEnfermeria").length) $("#divReporteEnfermeria").hide();
    $("#divChat").hide();
    $("#divArchivos").hide();
    $("#divHistorial").hide();
    $("#divFormAsistenciaAmbulancia").hide();
    $("#divFormAsistenciaMedDom").hide();
    $("#divAntecedentesMedicos").hide();
    $("#divConclusionPeritaje").hide();
    $("#divReporteAnura").hide();
    $("#divCuestionarioProgramaSaludSueno").hide();
    $("#divCuestionarioProgramaSaludCronico").hide();
    $("#divLicenciaMedicaElectronica").hide();
    $("#divGES").hide();
    $("#divENO").hide();
    $(opcion).show();
}
window.jsPanel = jsPanel;
async function grabarLog(idAtencion, evento, info) {

    var log = {
        IdPaciente: uid,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
}