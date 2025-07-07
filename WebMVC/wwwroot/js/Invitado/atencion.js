
/*-------------JS ATENCION MEDICO MODALIDAD ONDEMAND O SUSCRIPCION----------------------*/



import { putAtencionView, inicioAtencionMedico } from '../apis/atencion-fetch.js';

import { insertAtencionMedicamentos, deleteMedicamentos } from '../apis/medicamentos-fetch.js';
import { insertAtencionesPatologias, deletePatologia } from '../apis/patologias-fetch.js';
import { insertAtencionesExamenes, deleteExamen } from '../apis/examenes-fetch.js';
import { EditAntecedentesMedicos, logPacienteViaje } from "../apis/personas-fetch.js";

var connection;
var connectionAtencion;
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD') + " " + moment().format('HH:mm:ss');
var textCheck = document.querySelector('[name="DescripcionNSP"]');
var check = document.querySelector('[name="nsp"]');
let idArchivo;
var idAtencion;
var codigoPais = "CL";
let yappMedicamento;
export async function init(data) {
    

    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencion == null) {
        var resultInicio = await inicioAtencionMedico(data.atencion.id);
    }
    //----------------------------------------------------------
    check.checked = data.atencion.nsp;
    textCheck.value = data.atencion.descripcionNSP;
    checkBox();


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
 
    check.onchange = async () => {
        checkBox();
    }


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
            Swal.fire("","atención guardada","success")
        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
        }
        $('#btnGuardar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
    };

    const btnGuardarMedicamento = document.getElementById("btnGuardarMedicamento");
    btnGuardarMedicamento.onclick = async () => {
        let inputMedicamento = document.getElementById("input_codigoMedicamento");
        let posologia = document.getElementById("posologia");
        if (inputMedicamento.value == "") {
            Swal.fire("", "Debe ingresar medicamento", "warning");
            return;
        }
        if (codigoPais === "CL") {

            let existMedicamento = await getMedicamentosBD(inputMedicamento.value, codigoPais);
            if (existMedicamento.length === 0) {
                saveM = await saveMedicamento(yappMedicamento)
                saveM = saveM.medicamento;
            } else {
                saveM = existMedicamento[0];
            }
            idMed = saveM.medicamentoId !== undefined ? saveM.medicamentoId : saveM.id;
            auxArray.push({
                product_id: saveM.product_id,
                id: saveM.id,
                description: saveM.product_name
            })
            //products
            postGetLink.data.products.push({
                id: saveM.product_id,
                description: saveM.product_name,
                quantity: 1
            })

            //sendPostLink = await postGL(postGetLink, tokenData); se hará la generacion del link en finalizar atencion
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

//document.querySelector('#btnCerrar').onclick = async () => {
//    await deleteFisico(idArchivo);
//    $("#modalBody").empty();

//};

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

        //list.append('<li data-id =' + datum.id + '>' + $("#input_codigo").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');

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
    }).bind("typeahead:selected", async function (obj, datum, name) {
        let atencionExamen = {
            idAtencion: parseInt(idAtencion),
            idExamen: parseInt(datum.id),
        }
        var resultInsert = await insertAtencionesExamenes(atencionExamen);
        if (resultInsert.status === "OK") {
            const list = $("#listaTipoExamen");
            list.append('<li data-id =' + resultInsert.atencionesExamenes.id + '>' + $("#input_codigoExamen").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
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
    }).bind("typeahead:selected", function (obj, datum, name) {
        const inputMedicamento = document.getElementById("input_codigoMedicamento");
        inputMedicamento.setAttribute('data-id', datum.id);
        //$('#input_codigoMedicamento').typeahead('val', '');
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


async function checkON() {
    let btnSave = document.querySelector('#btnGuardar');
   
    textCheck.setAttribute('style', 'display:block');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:block');
    document.querySelector('[id="listaNSP"]').classList.remove('d-none');
    document.querySelector('[name="DiagnosticoMedico"]').setAttribute('disabled', 'disabled');
    document.getElementById('input_codigo').disabled = true;
    document.getElementById('input_codigoExamen').disabled = true;
    document.querySelector('[name="ExamenMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="CertificadoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="MedicamentosMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="Observaciones"]').setAttribute('disabled', 'disabled');
}

async function checkOFF() {
    let btnSave = document.querySelector('#btnGuardar');
  
    textCheck.setAttribute('style', 'display:none');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:none');
    document.querySelector('[name="DiagnosticoMedico"]').removeAttribute('disabled', 'disabled');
    document.getElementById('input_codigo').disabled = false;
    document.getElementById('input_codigoExamen').disabled = false;
    document.querySelector('[name="ExamenMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="CertificadoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="MedicamentosMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="Observaciones"]').removeAttribute('disabled', 'disabled');
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

    const inicioAtencion = document.querySelector('[name="Atencion.InicioAtencion"]').value;
    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    var motivoNSP = 0;

    if (document.querySelector('input[name="motivosNSP"]:checked') != null) {
        motivoNSP = document.querySelector('input[name="motivosNSP"]:checked').value;
    }
    //let json = {
    //    atencion: {}
    //};

    let patologias = [];
    Array.from(document.querySelector('#listaEnfermedad').children).forEach(patologia => {

        let obj = {};
        obj.Id = parseInt(patologia.dataset.id);
        patologias.push(obj);
    });

    let examenes = [];
    Array.from(document.querySelector('#listaTipoExamen').children).forEach(examen => {

        let obj = {};
        obj.Id = parseInt(examen.dataset.id);
        examenes.push(obj);
    });


    let atencion = {
        NSP: document.querySelector('[name="nsp"]').checked,
        DescripcionNSP: document.querySelector('[name="DescripcionNSP"]').value,
        MotivoNsp: parseInt(motivoNSP),
        ConsentimientoInformado: document.querySelector('[name="consentimiento"]').checked,
    };


    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => atencion[textArea.name] = textArea.value);

    atencion.Patologias = patologias;
    atencion.Examenes = examenes;

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