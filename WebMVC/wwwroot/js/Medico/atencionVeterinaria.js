
/*-------------JS ATENCION MEDICO MODALIDAD ONDEMAND O SUSCRIPCION----------------------*/


import { getInformeMedico } from '../apis/reportes-fetch.js';
import { putAtencionView, getProfesionalesAsociadosByMedico, inicioAtencionMedico, getAtencion } from '../apis/atencion-fetch.js';
import { getArchivoUnico, deleteFisico } from '../apis/archivo-fetch.js'
import { comprobanteProfesionalAsociados } from '../apis/correos-fetch.js';
import { activarBono } from '../apis/medipass-fetch.js'
import { enviarInforme, enviarInformeMedico } from '../apis/correos-fetch.js';
import { EditAntecedentesMedicos, logPacienteViaje } from "../apis/personas-fetch.js";
import { cambioEstado } from "../apis/eniax-fetch.js";
var connection;
var connectionAtencion;
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD') + " " + moment().format('HH:mm:ss');
var textCheck = document.querySelector('[name="DescripcionNSP"]');
var check = document.querySelector('[name="nsp"]');
let idArchivo;
var idAtencion;
export async function init(data) {
    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencion == null) {
        var resultInicio = await inicioAtencionMedico(data.atencion.id);
    }
    //----------------------------------------------------------
    check.checked = data.atencion.nsp;
    textCheck.value = data.atencion.descripcionNSP;
    checkBox();

    refreshReport();

    //-----------------------realTime---------------------------
    //#region realtime
    await AtencionPacienteRealTime();
    await indexRealTime(uid);
    //#endregion 
    //-----------------------------------------------------------
    var momentDate = moment(todayDate).format(TODAY);
    document.querySelector('[name="Atencion.InicioAtencion"]').value = momentDate;
    let page = document.getElementById('page');

    page.innerHTML = "Atención con paciente &nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;" + data.atencion.nombrePaciente + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Teléfono: " + data.atencion.telefonoPaciente;
    page.setAttribute('style', 'margin-left:20px;')

    idAtencion = document.querySelector('[name="Atencion.Id"]').value;

    //nombre paciente header chat
    document.getElementById("headName").innerHTML = data.atencion.nombrePaciente;
    let destinatarios = await getProfesionalesAsociadosByMedico(idAtencion, uid, parseInt(data.atencion.idCliente));
    if (destinatarios.length > 0)
        document.getElementById('btnInvitar').removeAttribute('hidden', false)

    await configElementos(destinatarios);
    
    check.onchange = async () => {
        checkBox();
    }

    document.querySelector("#btnConfirmarInvitados").onclick = async () => {

        if ($('#profesionalesAsociados option:selected').length == 0) {
            return;
        }
        $('#btnConfirmarInvitados').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        var lista = $('select[name="profesionalesAsociados"]').val();
        var cadena = lista.toString();
        data.atencion.correoInvitados = cadena;
        let envio = await comprobanteProfesionalAsociados(baseUrlWeb, data.atencion);
        if (envio.status == "OK") {

            $('#btnConfirmarInvitados').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            document.getElementById('btnConfirmarInvitados').removeAttribute('style', 'padding-right: 3.5rem;');
            document.getElementById('btnConfirmarInvitados').disabled = false;
            Swal.fire("", "Se envió la invitación de forma exitosa", "success");
            $("#kt_modal_4").modal("hide");

        }
    }

    document.querySelector('#btnInvitar').onclick = async () => {
        $("#kt_modal_4").modal("show");
    }

    //---------------------finzalizar atención-------------------------------
    document.querySelector('#btnFinalizar').onclick = async () => {
        const rol = document.querySelector('[name="rol"]').value;

        var validaCampos = await validarCampos();
        if (validaCampos.length > 0) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }

        $('#btnFinalizar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        var tipo = "F";
        let valida = await guardarFinalizarAtencion(tipo);
        if (valida.status == "OK") {
            await activarBono(idAtencion);

            let result = await enviarInforme(idAtencion, baseUrlWeb);
            await enviarInformeMedico(idAtencion, baseUrlWeb);
            await cambioEstado(idAtencion.toString(), "T") // o PAC?? -- Paciente Asiste a cita, por ahora deje T --Informe Listo
            await cambioEstado(idAtencion.toString(), "PAC")//Paciente asiste a cita
            $("#kt_modal_3").modal("hide");
            $("#modalBody").empty();
            window.onbeforeunload = false;
            window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}&sendInforme=false`;
        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
        }
        $('#btnFinalizar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
    };
    //-----------------------------------------------------------------------
    //------------previsualizar informe o marcar paciente NSP---------------------
    document.querySelector('#btnGuardar').onclick = async () => {
        var tipo = "G";
        let validaCampos = await validarCampos();
        if (validaCampos.length > 0) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }
        $('#btnGuardar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        let valida = await guardarFinalizarAtencion(tipo);
        //previsualizar informe
        if (valida.status == "OK") {
            if (!check.checked) {
                await getInformeMedico(idAtencion, uid);
                let informe = await getArchivoUnico(idAtencion, "ATENCIONES-INFORME");
                idArchivo = informe.id;
                var ruta = baseUrl + informe.rutaVirtual.replace(/\\/g, '/');
                //var ruta = "https://localhost:44363/" + informe.rutaVirtual.replace(/\\/g, '/');
                //crea elemento embed en el modal.
                let embed = document.createElement('embed');
                embed.src = ruta;
                embed.style.width = "100%";
                embed.style.height = "500px";
                document.getElementById('modalBody').appendChild(embed);

                $("#kt_modal_3").modal("show");
            }
            else {
                //PACIENTE NPS, ACTUALIZACION ETIQUETA ATENCIONES VISTA PACIENTE
                var evento = "Médico guarda NSP";
                await grabarLog(data.atencion.id, evento, parseInt(data.atencion.idPaciente));
                if (connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke('SubscribeProximasAtencionesPaciente', parseInt(data.atencion.idPaciente)).then(r => {
                        connection.invoke("ActualizarProximasAtencionesPaciente", parseInt(data.atencion.idPaciente), parseInt(data.atencion.id)).then(r => {
                            connection.invoke('UnsubscribeProximasAtencionesPaciente', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
                        }).catch(err => console.error(err));
                    }).catch((err) => {
                        return console.error(err.toString());
                    });
                }
                await cambioEstado(idAtencion.toString(), "PA") // PA = Paciente Ausente
                window.onbeforeunload = false;
                window.location = `/Medico/Index`;
            }

        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
        }
        $('#btnGuardar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
    };

 

    $('#form_edit_am').validate({
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

            let medicamentos = document.getElementById("Medicamentos").value
            let habitos = document.getElementById("Habitos").value
            let enfermedades = document.getElementById("Enfermedades").value
            let alergias = document.getElementById("Alergias").value
            let cirugias = document.getElementById("Cirugias").value

            $('#btn_guardar_am').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);

            let formAnt = {
                Medicamentos: medicamentos,
                Habitos: habitos,
                Enfermedades: enfermedades,
                Alergias: alergias,
                Cirugias: cirugias,
                Id: data.atencion.idPaciente
            }
            let result = await EditAntecedentesMedicos(formAnt, uid);
            $('#btn_guardar_am').removeAttr('disabled').children('.spinner-border').remove();
            if (result.status === 'OK') {
                $('#btn_guardar_am').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Antecedentes médicos actualizados.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {

                });
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }
    });
};

document.querySelector('#btnCerrar').onclick = async () => {
    await deleteFisico(idArchivo);
    $("#modalBody").empty();

};

async function checkBox() {
    if (check.checked) {
        checkON();
    }
    else {
        checkOFF();
    }
}

async function configElementos(destinatarios) {

    // profesionales invitados
    let selectAsociado = document.querySelector('select[name="profesionalesAsociados"]');
    selectAsociado.required = false;
    let opcion2 = document.createElement('option');
    destinatarios.forEach(async param => {
        opcion2 = document.createElement('option');
        opcion2.setAttribute('value', param.correoInvitados);
        opcion2.innerHTML = param.nombreMedico;
        selectAsociado.appendChild(opcion2);
    });


}

async function checkON() {
    let btnSave = document.querySelector('#btnGuardar');
    btnSave.innerHTML = "Guardar";
    btnSave.setAttribute('class', 'btn btn-warning');
    textCheck.setAttribute('style', 'display:block');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:block');
    document.querySelector('[id="listaNSP"]').classList.remove('d-none');
    document.querySelector('[name="DiagnosticoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="ExamenMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="MedicamentosMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').setAttribute('disabled', 'disabled');
}

async function checkOFF() {
    let btnSave = document.querySelector('#btnGuardar');
    btnSave.innerHTML = "Previsualizar";
    btnSave.setAttribute('class', 'btn btn-brand');

    textCheck.setAttribute('style', 'display:none');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:none');
    document.querySelector('[name="DiagnosticoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="ExamenMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="MedicamentosMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').removeAttribute('disabled', 'disabled');
}

async function refreshReport() {
    const divContent = document.getElementById("contentLabel");
    const divButton = document.createElement("div");
    divButton.setAttribute('class', 'kt-portlet__head-label');

    const buttonRefresh = document.createElement('button');
    buttonRefresh.setAttribute('class', 'btn btn-success');

    const icon = document.createElement('i');
    icon.setAttribute('class', 'fa fa-refresh');

    buttonRefresh.appendChild(icon);
    divButton.appendChild(buttonRefresh);
    divContent.appendChild(divButton);

    buttonRefresh.onclick = async () => {
        var atencion = await getAtencion(idAtencion);

        document.querySelector('textarea[name="DiagnosticoMedico"]').value = atencion.diagnosticoMedico;
        document.querySelector('textarea[name="ExamenMedico"]').value = atencion.examenMedico;
        document.querySelector('textarea[name="TratamientoMedico"]').value = atencion.tratamientoMedico;
        document.querySelector('textarea[name="CertificadoMedico"]').value = atencion.certificadoMedico;
        document.querySelector('textarea[name="ControlMedico"]').value = atencion.controlMedico;
    };

}
async function validarCampos() {

    let mensaje = "";
    if (document.querySelector('[name="DiagnosticoMedico"]').value === "" && document.querySelector('[name="nsp"]').checked == false) {
        mensaje += "Debe ingresar diagnostico médico <br>";
    }
    if (check.checked && document.querySelector('[name="DescripcionNSP"]').value === "") {
        mensaje += "Debe ingresar justificación en NSP<br>";

    }
    if (check.checked && (document.querySelector('input[name="motivosNSP"]:checked') == null)) {
        mensaje += "Debe ingresar motivo de NSP<br>";
    }
    return mensaje;
}

async function guardarFinalizarAtencion(tipo) {

    const inicioAtencion = document.querySelector('[name="Atencion.InicioAtencion"]').value;
    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    var motivoNSP = 0;

    if (document.querySelector('input[name="motivosNSP"]:checked') != null) {
        motivoNSP = document.querySelector('input[name="motivosNSP"]:checked').value;
    }
    let atencion = {
        NSP: document.querySelector('[name="nsp"]').checked,
        DescripcionNSP: document.querySelector('[name="DescripcionNSP"]').value,
        MotivoNsp: parseInt(motivoNSP)
    };

    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => atencion[textArea.name] = textArea.value);

    let resultado = await putAtencionView(idAtencion, atencion, tipo, uid, inicioAtencion);
    if (resultado.status === 'NOK') {
        return false;
    }
    else {
        return resultado;
    }


}

//real time para pacientes que no se presentan
async function AtencionPacienteRealTime() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/proximasatencionespacientehub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
    } catch (err) {
        
    }
}

//metodo para mostrar mensaje de nuevas atenciones
async function ActualizarCalendarMedico(uid, fecha, horaDesdeText, tipoAccion) {
    var typeMessage = "";
    var title = "";
    if (tipoAccion == "actualizar") {
        typeMessage = "success";
        title = `Tiene una nueva atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`

    }
    else if (tipoAccion == "nspPaciente") {
        typeMessage = "warning";
        title = `Abandono de atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`

    }
    else {
        typeMessage = "error";
        title = `Se canceló una atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`;

    }

    Swal.fire({
        position: 'top-end',
        toast: true,
        onOpen: function () {
            var zippi = new Audio('/notifications/alertNuevaAtencion.mp3')
            zippi.play();
        },
        showClass: {
            popup: 'swal2-noanimation',
            backdrop: 'swal2-noanimation'
        },
        animation: true,
        customClass: {
            container: '',
            popup: '',
            header: '',
            title: 'swal2-styled2',
            closeButton: '...',
            icon: '',
            image: '',
            content: '',
            input: '',
            validationMessage: '',
            actions: '',
            confirmButton: '',
            denyButton: '',
            cancelButton: '',
            loader: '',
            footer: ''
        },
        timerProgressBar: true,
        icon: typeMessage,
        type: typeMessage,
        title: title,
        showConfirmButton: false,
        timer: 15000
    })
}

// real time nuevas atenciones
async function indexRealTime(uid) {
    connectionAtencion = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionAtencion.on('ActualizarCalendarMedico', (fecha, horaDesdeText, tipoAccion) => {
        ActualizarCalendarMedico(uid, fecha, horaDesdeText, tipoAccion);
    });

    try {
        await connectionAtencion.start();
    } catch (err) {
        
    }

    if (connectionAtencion.state === signalR.HubConnectionState.Connected) {

        connectionAtencion.invoke('SubscribeCalendarMedico', uid).catch((err) => {
            return console.error(err.toString());
        });
    }
}

async function grabarLog(idAtencion, evento, idPaciente, info) {

    var log = {
        IdPaciente: idPaciente,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
}