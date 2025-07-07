
/*--------------------JS ACCIONES ATENCION MÉDICO MODALIDAD DIRECTA*/

import { getInformeMedico } from '../apis/reportes-fetch.js';
import { putAtencionView, getProfesionalesAsociadosByMedico, inicioAtencionMedico, solicitarFirma , apiFarmacia} from '../apis/atencion-fetch.js';
import { getArchivoUnico, deleteFisico } from '../apis/archivo-fetch.js'
import { comprobanteProfesionalAsociados } from '../apis/correos-fetch.js';
import { getResultAtencionEspera } from '../apis/resultAtencionEspera-fetch.js';
import { enviarInforme, enviarInformeMedico } from '../apis/correos-fetch.js';
import { insertAtencionMedicamentos, deleteMedicamentos } from '../apis/medicamentos-fetch.js';
import { insertAtencionesPatologias, deletePatologia } from '../apis/patologias-fetch.js';
import { insertAtencionesExamenes, deleteExamen } from '../apis/examenes-fetch.js';
import { EditAntecedentesMedicos, logPacienteViaje  } from "../apis/personas-fetch.js?rnd=9";
import { derivaEspecialidad } from '../apis/paciente-derivacion-fetch.js';

var connection;
var connectionAtencion;
var connectionUrgencia;
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD') + " " + moment().format('HH:mm:ss');
var textCheck = document.querySelector('[name="DescripcionNSP"]');
var check = document.querySelector('[name="nsp"]');
let idArchivo;
var idAtencion;
var idFirmante;
var checkConsentimiento = document.querySelector('[name="consentimiento"]');
var continuar;

export async function init(data) {
    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencion == null) {
        var resultInicio = await inicioAtencionMedico(data.atencion.id);
    }

    //----------------------------------------------------------
    check.checked = data.atencion.nsp;
    textCheck.value = data.atencion.descripcionNSP;
    checkBox();
    await ingresoAtencion(data.atencion.id)

    connectionUrgencia.invoke("IniciarAtencion", parseInt(data.atencion.id)).catch(err => console.error(err));
    idFirmante = document.querySelector('[name="Atencion.IdMedicoFirmante"]').value;
    if (idFirmante == uid) {
        document.querySelector('[name="rol"]').value = "Invitado";
        document.getElementById('btnSolicitarFirma').setAttribute("style", "display:none");
        document.getElementById('divBtnFirma').classList.remove('d-flex');
        document.getElementById('divBtnFirma').classList.remove('justify-content-between');
        document.getElementById('divBtnFirma').setAttribute('style', 'text-align:right;');
    }
   
    //-----------------------realTime---------------------------
                               //#region RT
    await AtencionPacienteRealTime();
    await indexRealTime(uid);
    //#endregion
    //-----------------------------------------------------------
    var momentDate = moment(todayDate).format(TODAY);
    document.querySelector('[name="Atencion.InicioAtencion"]').value = momentDate;
    let page = document.getElementById('page');

    page.innerHTML = "Atención con paciente &nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;" + data.atencion.nombrePaciente + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Teléfono: " + data.atencion.telefonoPaciente + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Convenio: " + data.atencion.infoPaciente;
    page.setAttribute('style', 'margin-left:20px;')

    idAtencion = document.querySelector('[name="Atencion.Id"]').value;

    //nombre paciente header chat
    document.getElementById("headName").innerHTML = data.atencion.nombrePaciente;
    let destinatarios = await getProfesionalesAsociadosByMedico(idAtencion, uid);
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
        if (!checkConsentimiento.checked) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }
        var validaCampos = await validarCampos();
        if (validaCampos.length > 0) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }

        $('#btnFinalizar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        var tipo = "F";
        let valida = await guardarFinalizarAtencion(tipo);
        if (valida.status == "OK") {
            //Llamada WS Callback Consalud
            if(valida.atencion.idCliente == 1)
            await getResultAtencionEspera(idAtencion);

            //api farmacia
            //var telefono = valida.atencion.telefonoPaciente;

            //if (telefono.includes("(+56)")) {

            if (valida.atencion.idCliente != 148) {
                try {
                    var medicamentos = [];
                    if (valida.atencion.medicamentos != null) {
                        valida.atencion.medicamentos.forEach(item => {
                            var med = `${item.principioActivo}`
                            medicamentos.push(med);
                        })

                        //var ur = "https://qa.medical.medismart.live";
                        let data = {
                            medicamentos: medicamentos,
                            medico: valida.atencion.nombreMedico,
                            especialidad: valida.atencion.especialidad,
                            url_receta: baseUrlWeb + valida.atencion.receta.rutaVirtual.replace(/\\/g, '/'),
                            celular: valida.atencion.telefonoPaciente,
                            rut: valida.atencion.identificador,
                            email: valida.atencion.correoPaciente,
                            nombre: valida.atencion.nombre,
                            apellido: valida.atencion.apellidoPaterno,
                            idArchivo: valida.atencion.receta.id
                        }
                        
                        await apiFarmacia(data);

                    }
                } catch (error) {
                    console.error(error);
                }
            }
        //}
            
            await enviarInforme(idAtencion, baseUrlWeb);
            await enviarInformeMedico(idAtencion, baseUrlWeb);

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

    //----------------------------previsualizar informe, tipo G = Guardar datos
    document.querySelector('#btnGuardar').onclick = async () => {
        var tipo = "G";
        if (!checkConsentimiento.checked && !check.checked) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }
        let validaCampos = await validarCampos();
        if (validaCampos.length > 0) {

            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }

        const inputMedicamento = document.getElementById('input_codigoMedicamento');
        const posologia = document.getElementById('posologia');
        if (inputMedicamento.value != "" || posologia.value != "") {
            Swal.fire("¡Cuidado! <br>Tienes medicamentos que no han sido agregados a la lista <br>", "", "error");
            return;
        }
        const medicamentosMedico = document.querySelector("[name='MedicamentosMedico']");
        if ($("#listaMedicamentos")[0].innerText == "" && medicamentosMedico.value == "" && !check.checked) {
             Swal.fire({
                title: "Atención sin medicamentos",
                text: `´Se emitirán informes sin receta medica, ¿Es correcto?`,
                type: "question",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                confirmButtonText: "Sí, Continuar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.value) {
                    await guardar();
                }
            });
        }
        else {
            await guardar();
        }
        async function guardar() {
        $('#btnGuardar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        let valida = await guardarFinalizarAtencion(tipo);


        if (valida.status == "OK") {
            //Swal.fire("", "Atención Guardada exitosamente", "success");
            if (!check.checked) {
                await getInformeMedico(idAtencion, uid);
                let informe = await getArchivoUnico(idAtencion, "ATENCIONES-INFORME");
                idArchivo = informe.id;
                var ruta = baseUrl + informe.rutaVirtual.replace(/\\/g, '/');
                let embed = document.createElement('embed');
                embed.src = ruta;
                embed.style.width = "100%";
                embed.style.height = "500px";
                document.getElementById('modalBody').appendChild(embed);

                $("#kt_modal_3").modal("show");
            }
            else {
                
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
                window.onbeforeunload = false;
                window.location = `/Medico/HomeUrgencia`;
            }

        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
        }
        $('#btnGuardar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
    }
    };


    if ($("#btnSolicitarFirma").length) {
        document.querySelector('#btnSolicitarFirma').onclick = async () => {
            Swal.fire({
                title: "Solicitar Firma",
                text: ``,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                confirmButtonText: "Sí, Solicitar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.value) {
                    var tipo = "SF";
                    let validaCampos = await validarCampos();
                    if (validaCampos.length > 0) {

                        Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
                        return;
                    }
                    $('#btnSolicitarFirma').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
                    let valida = await guardarFinalizarAtencion(tipo);


                    if (valida) {
                        Swal.fire("", "En unos momentos vendrá un médico a firmar el reporte solicitado, ", "success");
                    }
                    else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    }
                    $('#btnSolicitarFirma').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                }
            });
        };
    }

    const btnGuardarMedicamento = document.getElementById("btnGuardarMedicamento");
    btnGuardarMedicamento.onclick = async () => {
        let inputMedicamento = document.getElementById("input_codigoMedicamento");
        let posologia = document.getElementById("posologia");
        if (inputMedicamento.value == "") {
            Swal.fire("", "Debe ingresar medicamento", "warning");
            return;
        }
        
        let atencionMedicamento = {
            idAtencion: parseInt(idAtencion),
            idMedicamento: parseInt(inputMedicamento.getAttribute('data-id')),
            idUsuarioCreacion: parseInt(uid),
            posologia: posologia.value
        }
        var resultInsert = await insertAtencionMedicamentos(atencionMedicamento);
        if (resultInsert.status === "OK") {
            const list = $("#listaMedicamentos");
            list.append('<li data-id =' + resultInsert.atencionMedicamentos.id + '>' + $("#input_codigoMedicamento").val() + posologia.value + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
            posologia.value = "";
            inputMedicamento.value = "";
        }
        else {
            Swal.fire("", resultInsert.msg, "warning");
        }
    }
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


            //if (alergias == "") {
            //    document.getElementById("Alergias").focus();
            //    return;
            //}



            //if (medicamentos == "") {
            //    document.getElementById("Medicamentos").focus();
            //    return;
            //}



            //if (enfermedades == "") {
            //    document.getElementById("Enfermedades").focus();
            //    return;
            //}


            //if (cirugias == "") {
            //    document.getElementById("Cirugias").focus();
            //    return;
            //}


            //if (habitos == "") {
            //    document.getElementById("Habitos").focus();
            //    return;
            //}


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
    //derivar otra especialidad
    if ($("#btnDerivar").length) {
        document.getElementById('btnDerivar').onclick = async () => {
            let derivar = {
                IdPaciente: data.atencion.idPaciente,
                IdConvenio: data.atencion.horaMedico.idConvenio,
                IdEspecialidadOrigen: data.atencion.horaMedico.idEspecialidad,
                IdEspecialidadDestino: data.atencion.idEspecialidadDestino,
                IdMedico: data.atencion.horaMedico.idMedico,
            }

            var pacienteDeriva = await derivaEspecialidad(derivar);
            if (pacienteDeriva.status == "OK") {
                Swal.fire("", "Se derivó al paciente", "success");
                document.getElementById("infoDeriva").value = `Paciente derivado`;
                document.getElementById("btnDerivar").setAttribute("class", "d-none");
            } else {
                Swal.fire("", "No se derivó al paciente", "error")
            }
        };
    }
};

document.querySelector('#btnCerrar').onclick = async () => {
    await deleteFisico(idArchivo);
    $("#modalBody").empty();

};
$("#listaEnfermedad").on("click", "li", function () {

    Swal.fire({
        title: "",
        text: `¿Desea Eliminar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true,
        confirmButtonText: "Sí, Eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.value) {
            var deletePatol = await deletePatologia($(this)[0].dataset.id);
            if (deletePatol.status === "OK")
                $(this).remove();
        }
    });
});

$("#listaTipoExamen").on("click", "li", function () {
    Swal.fire({
        title: "",
        text: `¿Desea Eliminar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true,
        confirmButtonText: "Sí, Eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (resultado) => {
        if (resultado.value) {
            var deleteEx = await deleteExamen($(this)[0].dataset.id);
            if (deleteEx.status === "OK")
                $(this).remove();
        }
    });

});

$("#listaMedicamentos").on("click", "li", function () {
    Swal.fire({
        title: "",
        text: `¿Desea Eliminar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true,
        confirmButtonText: "Sí, Eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (resultado) => {
        if (resultado.value) {
            var deleteMedicamento = await deleteMedicamentos($(this)[0].dataset.id);
            if (deleteMedicamento.status === "OK")
                $(this).remove();
        }
    });

});
jQuery(document).ready(function () {

    var bloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + '/agendamientos/Patologias/getPatologias/%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#input_codigo').typeahead({
        minLength: 3
    }, {
        name: 'codigos',
        source: bloodhound,
        limit: 20,
        display: function (item) {
            return item.codigo + '–' + item.nombre;
        }
    }).bind("typeahead:selected", async function (obj, datum, name) {
        let atencionPatologia = {
            idAtencion: parseInt(idAtencion),
            idPatologia: parseInt(datum.id),
        }
        var resultInsert = await insertAtencionesPatologias(atencionPatologia);
        if (resultInsert.status === "OK") {
            const list = $("#listaEnfermedad");
            list.append('<li data-id =' + resultInsert.atencionesPatologias.id + '>' + $("#input_codigo").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
            $('#input_codigo').typeahead('val', '');
        }
    });



    var bloodhoundExamenes = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + '/agendamientos/Examenes/getExamenes/%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#input_codigoExamen').typeahead({
        minLength: 3
    }, {
        name: 'codigos',
        source: bloodhoundExamenes,
        limit: 20,
        display: function (item) {
            return item.codigo + '–' + item.nombre;
        }
    }).bind("typeahead:selected",async function (obj, datum, name) {
        let atencionExamen = {
            idAtencion: parseInt(idAtencion),
            idExamen: parseInt(datum.id),
        }
        var resultInsert = await insertAtencionesExamenes(atencionExamen);
        if (resultInsert.status === "OK") {
            const list = $("#listaTipoExamen");
            list.append('<li data-id =' + resultInsert.atencionesExamenes.id  + '>' + $("#input_codigoExamen").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
            $('#input_codigoExamen').typeahead('val', '');
        }
    });

    var bloodhoundMedicamentos = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + '/agendamientos/Medicamentos/getMedicamentos/%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#input_codigoMedicamento').typeahead({
        minLength: 3
    }, {
        name: 'codigos',
        source: bloodhoundMedicamentos,
        limit: 20,
        display: function (item) {
            
            return item.principioActivo + "" + item.presentacionFarmaceutica;
        }
    }).bind("typeahead:selected",async function (obj, datum, name) {
        const inputMedicamento = document.getElementById("input_codigoMedicamento");
        inputMedicamento.setAttribute('data-id', datum.id);
    });
});

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
    document.querySelector('[id="listaNSP"]').classList.remove('d-none');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:block');
    document.querySelector('[name="DiagnosticoMedico"]').setAttribute('disabled', 'disabled');
    document.getElementById('input_codigo').disabled = true;
    document.getElementById('input_codigoExamen').disabled = true;
    document.querySelector('[name="ExamenMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="CertificadoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').setAttribute('disabled', 'disabled');
}

async function checkOFF() {
    let btnSave = document.querySelector('#btnGuardar');
    btnSave.innerHTML = "Previsualizar";
    btnSave.setAttribute('class', 'btn btn-brand');

    textCheck.setAttribute('style', 'display:none');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:none');
    document.querySelector('[name="DiagnosticoMedico"]').removeAttribute('disabled', 'disabled');
    document.getElementById('input_codigo').disabled = false;
    document.getElementById('input_codigoExamen').disabled = false;
    document.querySelector('[name="ExamenMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="CertificadoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').removeAttribute('disabled', 'disabled');
}

async function validarCampos() {

    let mensaje = "";
    if (document.querySelector('#listaEnfermedad').innerText === "" && document.querySelector('[name="nsp"]').checked == false) {
        mensaje += "Debe ingresar un codigo o descripción <br>";
    }
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
    var inicioAtencion = document.querySelector('[name="Atencion.InicioAtencion"]').value;
    var motivoNSP = 0;
    if (document.querySelector('input[name="motivosNSP"]:checked') != null) {
        motivoNSP = document.querySelector('input[name="motivosNSP"]:checked').value;
    }
    let atencion = {
        Id: parseInt(idAtencion),
        NSP: document.querySelector('[name="nsp"]').checked,
        DescripcionNSP: document.querySelector('[name="DescripcionNSP"]').value,
        MotivoNsp: parseInt(motivoNSP),
        ConsentimientoInformado: document.querySelector('[name="consentimiento"]').checked,
    };
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => atencion[textArea.name] = textArea.value);


    var result;
    if (tipo == "SF") {
       result = await solicitarFirma(atencion, uid);
    }
    else {
       result = await putAtencionView(idAtencion, atencion, tipo, uid, inicioAtencion);
    }
    if (result.status === 'NOK') {
            return false;
        }
        else {
        return result;
        }
    
   


}
async function grabarLog(idAtencion, evento,idPaciente, info) {
    
    var log = {
        IdPaciente: idPaciente,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
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

async function ingresoAtencion(idAtencion) {
    
    connectionUrgencia = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingreso-sala-hub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionUrgencia.on('IniciarAtencion', (idAtencion) => {
        if (connectionUrgencia.state === signalR.HubConnectionState.Connected) {
            connectionUrgencia.invoke('SubscribeAtencionUrgencia', parseInt(idAtencion)).then(r => {
                connectionUrgencia.invoke("IniciarAtencion", parseInt(idAtencion)).then(r => {
                    connectionUrgencia.invoke('UnsubscribeAtencionUrgencia', parseInt(idAtencion)).catch(err => console.error(err));
                }).catch(err => console.error(err));
            }).catch((err) => {
                return console.error(err.toString());
            });
        }
    });
    try {
        await connectionUrgencia.start();
    } catch (err) {
        
    }

    if (connectionUrgencia.state === signalR.HubConnectionState.Connected) {
        connectionUrgencia.invoke('SubscribeAtencionUrgencia', idAtencion).catch((err) => {
            return console.error(err.toString());
        });
    }
}
