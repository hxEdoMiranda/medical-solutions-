
/*-------------JS ATENCION MEDICO MODALIDAD ONDEMAND O SUSCRIPCION----------------------*/


import { getInformeMedico } from '../apis/reportes-fetch.js';
import { putAtencionView, getProfesionalesAsociadosByMedico, inicioAtencionMedico, apiFarmacia, getAtencion } from '../apis/atencion-fetch.js';
import { getArchivoUnico, deleteFisico } from '../apis/archivo-fetch.js';
import { obtenerToken, getMedicamento, postGL } from '../apis/yapp.js'
import { comprobanteProfesionalAsociados } from '../apis/correos-fetch.js';
import { getResultAtencionEspera } from '../apis/resultAtencionEspera-fetch.js';
import { activarBono } from '../apis/medipass-fetch.js'
import { enviarInforme, enviarInformeMedico } from '../apis/correos-fetch.js';
import { insertAtencionMedicamentos, deleteMedicamentos, getMedicamentosBD, saveMedicamento } from '../apis/medicamentos-fetch.js';
import { insertAtencionesPatologias, deletePatologia } from '../apis/patologias-fetch.js';
import { insertAtencionesExamenes, deleteExamen} from '../apis/examenes-fetch.js';
import { EditAntecedentesMedicos, logPacienteViaje } from "../apis/personas-fetch.js";
import { cambioEstado } from "../apis/eniax-fetch.js";
import { personByUser } from "../apis/personas-fetch.js"
import { derivaEspecialidad } from '../apis/paciente-derivacion-fetch.js';
var connection;
var connectionAtencion;
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD') + " " + moment().format('HH:mm:ss');
var textCheck = document.querySelector('[name="DescripcionNSP"]');
var check = document.querySelector('[name="nsp"]');
var checkConsentimiento = document.querySelector('[name="consentimiento"]');
let idArchivo;
var idAtencion;
let yappMedicamento;
let saveM;
let dataPaciente;
let dataMedico;
let tokenData;
let sendPostLink;
let postGetLink = {
    "email": "",
    "request_type": "search",
    "client_id": "d31fc78c-e9aa-11eb-80c2-06db",
    "data": {
        "patient": {
            "name": "",
            "phone": "",
            "email": "",
            "identity": ""
        },
        "professional": {
            "name": "",
            "identity": "",
            "email": ""
        },
        "products": [
            //{
                //"description": "LOSARTAN 100 MG X 30 COMPRIMIDOS RECUBIERTOS",
                //"code_isp": "",
                //"code_snomed": "",
                //"quantity": 1,
                //"id": "a371697f-dad3-11ea-8ff7-0a57"
            //}
        ]
    }
};

const reg = new RegExp('^[0-9]+$');

export async function init(data) {

    dataPaciente = data;
    dataMedico = await personByUser(uid);

    postGetLink.email = dataPaciente.fichaPaciente.correo;
    postGetLink.data.patient.email = dataPaciente.fichaPaciente.correo;
    postGetLink.data.patient.name = dataPaciente.fichaPaciente.nombreCompleto;
    postGetLink.data.patient.phone = dataPaciente.fichaPaciente.telefonoMovil;
    postGetLink.data.patient.identity = dataPaciente.identificador;
    postGetLink.data.professional.identity = dataMedico.identificador;
    postGetLink.data.professional.name = dataMedico.nombreCompleto;
    postGetLink.data.professional.email = dataMedico.correo;
    //const medicamento = await getMedicamento(tokenData, "Rize");

    
    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencion == null) {
        var resultInicio = await inicioAtencionMedico(data.atencion.id);
    }
    //----------------------------------------------------------
    check.checked = data.atencion.nsp;
    textCheck.value = data.atencion.descripcionNSP;
    checkBox(data);
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
        checkBox(data);
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
        if (envio.status == "OK")
        {
             
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
        var validaCampos = await validarCampos(data);
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


        $('#btnFinalizar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        var tipo = "F";
        let valida = await guardarFinalizarAtencion(tipo);
        if (valida.status == "OK") {
            await activarBono(idAtencion);
           //llamada a ws consalud cuando idCliente es 1
            if(valida.atencion.idCliente == 1)
                await getResultAtencionEspera(idAtencion);

            

            //envio wsp api farmacia chile
        
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
                        
                        await apiFarmacia(data)

                    }
                } catch (error) {
                   
                }
            }
                
            //}
            
            
            let result = await enviarInforme(idAtencion, baseUrlWeb);
            await enviarInformeMedico(idAtencion, baseUrlWeb);
            await cambioEstado(idAtencion.toString(), "T") // o PAC?? -- Paciente Asiste a cita, por ahora deje T --Informe Listo
            await cambioEstado(idAtencion.toString(), "PAC")
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


        if (!checkConsentimiento.checked && !check.checked && !data.atencion.peritaje) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }
        let validaCampos = await validarCampos(data);
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
          await  guardar();
        }
        async function guardar() {
            $('#btnGuardar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');

            if (data.atencion.peritaje) {
                tipo = "F";
            }
            let valida = await guardarFinalizarAtencion(tipo);
            //previsualizar informe
            if (valida.status == "OK") {
                if (!check.checked && !data.atencion.peritaje) {
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

                    if (check.checked) {
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
                    }

                    window.onbeforeunload = false;
                    window.location = `/Medico/Index`;
                }

            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }
            $('#btnGuardar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
        }
    };

    const btnGuardarMedicamento = document.getElementById("btnGuardarMedicamento");
    btnGuardarMedicamento.onclick = async () => {
        let inputMedicamento = document.getElementById("input_codigoMedicamento");
        
        let posologia = document.getElementById("posologia");
        if (inputMedicamento.value.length > 0) {
            let existMedicamento = await getMedicamentosBD(inputMedicamento.value);
         
            if (existMedicamento.length === 0) {
                saveM = await saveMedicamento(yappMedicamento)
            } else {
                saveM = existMedicamento[0];
            }
        }
        else if (inputMedicamento.value === "") {
            Swal.fire("", "Debe ingresar medicamento", "warning");
            return;
        }
        
        let atencionMedicamento = {
            idAtencion: parseInt(idAtencion),
            idMedicamento: saveM.medicamentoId !== undefined ? saveM.medicamentoId : saveM.id,
            idUsuarioCreacion: parseInt(uid),
            posologia: posologia.value
        }
        var resultInsert = await insertAtencionMedicamentos(atencionMedicamento);

 //products
        postGetLink.data.products.push({
            id: saveM.product_id,
            description: saveM.product_name
        })
        sendPostLink = await postGL(postGetLink, tokenData);
        if (resultInsert.status === "OK") {
            const list = $("#listaMedicamentos");
            list.append('<li data-id =' + resultInsert.atencionMedicamentos.id + '>' + $("#input_codigoMedicamento").val() + posologia.value + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
            posologia.value = "";
            inputMedicamento.value = "";
        }
        else {
            Swal.fire("",resultInsert.msg,"warning");
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
                document.getElementById("infoDeriva").innerHTML = `Paciente derivado`;
                document.getElementById("btnDerivar").setAttribute("class","d-none");
            } else {
                Swal.fire("","No se derivó al paciente","error")
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
            if(deleteMedicamento.status === "OK")
                $(this).remove();
        }
    });

});

function respMedicamentosVacio() {
    const medicamentosMedico = document.querySelector("[name='MedicamentosMedico']");

    if ($("#listaMedicamentos")[0].innerText == "" && medicamentosMedico.value == "") {
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
                return 1;
            }

            else {
                return 0;
            }
        });
        return;
    }
    else {
        return 1;
    }
   
}
jQuery(document).ready(async function () {
    const token = await obtenerToken();
    tokenData = token.data.idToken; 

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
            list.append('<li data-id =' + resultInsert.atencionesPatologias.id + '>' + $("#input_codigo").val()+ ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
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
        let atencionExamen= {
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
            url: baseUrl + '/yapp/yapp/GetVademecum?token=' + tokenData,
            prepare: function (query, settings) {
                settings.url = settings.url + '&text=' + query
                return settings;
            }
        }
    });

    $('#input_codigoMedicamento').typeahead({
        minLength: 3
    }, {
        name: 'codigos',
        source: bloodhoundMedicamentos,
        limit: 20,
            display: function (item) {
                if (item !== "Error") return item.product_name;
                else Swal.fire("", "Producto no encontrado", "warning").then(() => {
        }); ;
        }
    }).bind("typeahead:selected", function (obj, datum, name) {
        yappMedicamento = datum;
        yappMedicamento.codigo = parseInt((datum.product_id).replace(/\D/g, '').slice(0, 6));
        yappMedicamento.principioActivo = datum.product_name;
        yappMedicamento.estado = 'V';
        yappMedicamento.is_product = Boolean(Number(datum.is_product));
        yappMedicamento.has_benefit = Boolean(Number(datum.has_benefit));

        if (datum !== "Error") {
            const inputMedicamento = document.getElementById("input_codigoMedicamento");
            inputMedicamento.setAttribute('data-id', datum.product_id);
            
        }
        
            //$('#input_codigoMedicamento').typeahead('val', '');
    });
});

async function checkBox(data) {
    if (check.checked) {
        checkON(data);
    }
    else {
        checkOFF(data);
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
    btnSave.setAttribute('class','btn btn-warning');
    textCheck.setAttribute('style', 'display:block');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:block');
    document.querySelector('[id="listaNSP"]').classList.remove('d-none');
    document.querySelector('[name="DiagnosticoMedico"]').setAttribute('disabled', 'disabled');
    document.getElementById('input_codigo').disabled = true;
    document.getElementById('input_codigoExamen').disabled = true;
    document.querySelector('[name="ExamenMedico"]').setAttribute('disabled', 'disabled');
    //document.querySelector('[id="cmbExamen"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="CertificadoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="MedicamentosMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').setAttribute('disabled', 'disabled');
    document.querySelector('[name="Observaciones"]').setAttribute('disabled', 'disabled');
    
}

async function checkOFF(data) {
    let btnSave = document.querySelector('#btnGuardar');

    if (!data.atencion.peritaje) {
        btnSave.innerHTML = "Previsualizar";
        btnSave.setAttribute('class', 'btn btn-brand');
    }
    

    textCheck.setAttribute('style', 'display:none');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:none');
    document.querySelector('[name="DiagnosticoMedico"]').removeAttribute('disabled', 'disabled');
    document.getElementById('input_codigo').disabled = false;
    document.getElementById('input_codigoExamen').disabled = false;
    document.querySelector('[name="ExamenMedico"]').removeAttribute('disabled', 'disabled');
    //document.querySelector('[id="cmbExamen"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="CertificadoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="TratamientoMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="MedicamentosMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="ControlMedico"]').removeAttribute('disabled', 'disabled');
    document.querySelector('[name="Observaciones"]').removeAttribute('disabled', 'disabled');
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

    buttonRefresh.onclick = async () =>{
        
        var atencion = await getAtencion(idAtencion);

        document.querySelector('textarea[name="DiagnosticoMedico"]').value = atencion.diagnosticoMedico;
        document.querySelector('textarea[name="ExamenMedico"]').value = atencion.examenMedico;
        document.querySelector('textarea[name="TratamientoMedico"]').value = atencion.tratamientoMedico;
        document.querySelector('textarea[name="CertificadoMedico"]').value = atencion.certificadoMedico;
        document.querySelector('textarea[name="ControlMedico"]').value = atencion.controlMedico;
        document.querySelector('textarea[name="Observaciones"]').value = atencion.observaciones;
        document.querySelector('[name="MedicamentosMedico"]').value = atencion.medicamentosMedico;
        document.querySelector('#consentimiento').checked = atencion.consentimientoInformado;
        var diagnostico = atencion.patologias;
        var examenes = atencion.examenes;
        var medicamentos = atencion.medicamentos;
        $("#listaEnfermedad").empty();
        const list = $("#listaEnfermedad");
        diagnostico.forEach(item => {
            list.append('<li data-id =' + item.id + '>' + item.codigo + '-' + item.nombre + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
        });

        

        $("#listaTipoExamen").empty();
        const listExamen = $("#listaTipoExamen");
        examenes.forEach(item => {
            listExamen.append('<li data-id =' + item.id + '>' + item.codigo + '-' + item.nombre + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
        });

        $("#listaMedicamentos").empty();
        const listMedicamentos = $("#listaMedicamentos");
        medicamentos.forEach(item => {
            
            listMedicamentos.append('<li data-id =' + item.id + '>' + item.principioActivo + ' ' + item.presentacionFarmaceutica+ ' '+item.posologia+' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
        });
    };
    
}
async function validarCampos(data) {
     
    let mensaje = "";
    if (document.querySelector('#listaEnfermedad').innerText === "" && document.querySelector('[name="nsp"]').checked == false  && !data.atencion.peritaje) {
        mensaje += "Debe ingresar un codigo o descripción <br>";
    }
    if (document.querySelector('[name="DiagnosticoMedico"]').value === "" && document.querySelector('[name="nsp"]').checked == false && !data.atencion.peritaje) {
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
       NSP : document.querySelector('[name="nsp"]').checked,
       DescripcionNSP: document.querySelector('[name="DescripcionNSP"]').value,
       MotivoNsp: parseInt(motivoNSP),
       ConsentimientoInformado: document.querySelector('[name="consentimiento"]').checked,
    };

   
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => atencion[textArea.name] = textArea.value);

    atencion.Patologias = patologias;
    atencion.Examenes = examenes;
    atencion.LinkYapp = sendPostLink?.link?.data?.url ? sendPostLink.link.data.url : "error";
    
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