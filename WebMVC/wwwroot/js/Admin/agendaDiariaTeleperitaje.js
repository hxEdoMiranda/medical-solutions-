import { getListaProfesionalesConvenio } from "../apis/personas-fetch.js";
import { getEspecialidadesConvenio, getAtencionConfirma } from "../apis/agendar-fetch.js";
import { getAgendaDiariaPeritaje } from "../apis/vwhorasmedicos-fetch.js";
import { comprobantePaciente } from '../apis/correos-fetch.js';
import { getLinkAtencion } from '../apis/atencion-fetch.js';
var idconvenio = 0;
var urlEdit = "";
var datatable = $('.kt-datatable').KTDatatable(null);
var fecha = "";
var idEspecialidad = 0;
var estado = "";
export async function init(data, url) {

    fecha = moment().format("YYYY-MM-DD");
    document.getElementById("fechaDesde").value = fecha;
    $("#divTablaDatos").show();
    datatable.destroy();
    await getdata();
    $('#kt_form_status,#especialidades,#convenios').selectpicker();
    // basic demo
    cargarEspecialidades(data.especialidades);
    cargarConvenios(data.convenios);

  
    //$("#divTablaDatos").hide();
    urlEdit = url;

 
    $('#especialidades').on('change',async function () {
        datatable.search($("#especialidades option:selected").val(), 'especialidad');
        $("#divTablaDatos").show();
        datatable.destroy();
        await getdata();
    });

    $('#convenios').on('change', async function () {
        
        idconvenio = $("#convenios option:selected").val();
        var especialidades = await getEspecialidadesConvenio(idconvenio);

        if (especialidades) {
            $('#especialidades').selectpicker('destroy');
            document.getElementById("especialidades").innerHTML = "";
            $("#especialidades").append('<option value="0">Todos</option>');
            especialidades.forEach(especialidad => {
                $("#especialidades")
                    .append('<option value="' + especialidad.id+ '">' + especialidad.nombre + '</option>');
            });
            $('#especialidades').selectpicker();
        }
        $("#divTablaDatos").show();
        datatable.destroy();
        await getdata();
    });

    $('#fechaDesde').on('change', async function () {

       $("#divTablaDatos").show();
        datatable.destroy();
        await getdata();
    });

    $('.kt-datatable__row').on('click',async function () {
        datatable.search($("#especialidades option:selected").val(), 'especialidad');
    });

    $('#kt_form_status').on('change', async function () {
        datatable.search($("#kt_form_status option:selected").val(), 'estado');
        $("#divTablaDatos").show();
        datatable.destroy();
        await getdata();
    });
}

function cargarConvenios(convenios) {
    convenios.forEach(convenio => {
        let atencionDirectaText = "";
        if (convenio.atencionDirecta)
            atencionDirectaText = "Atencion Directa - ";
        $("#convenios").append('<option value="' + convenio.id + '">' + atencionDirectaText + convenio.nombre + '</option>');
    });
}

function cargarEspecialidades(especialidades) {
    especialidades.forEach(especialidad => {
        $("#especialidades").append('<option value="' + especialidad.id + '">' + especialidad.nombre + '</option>');
    });
}


async function getdata() {
    debugger
    document.getElementById('lblInfoConvenio').innerHTML = "";
    var cambioFecha = document.getElementById("fechaDesde").value;
    idEspecialidad = $("#especialidades").val();
    estado = $("#kt_form_status").val();
    debugger
    let data = await getAgendaDiariaPeritaje(idconvenio, moment(cambioFecha).format("YYYYMMDD"), idEspecialidad, estado);
    datatable = $('.kt-datatable').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: data,
            pageSize: 10,
        },

        order: [[5, 'desc']],
                
        // layout definition
        layout: {
            scroll: true,
            height: 550,
            footer: false
        },

        // column sorting
        sortable: false,
        pagination: true,

        search: {
            input: $('#generalSearch')
        },
        
        // columns definition
        columns: [
           
            {
                field: 'nombrePaciente',
                title: 'Nombre Paciente'
            },
            {
                field: 'rutPaciente',
               title: 'Rut Paciente'
            },
            {
                field: 'fechaText',
                title: 'Fecha'
            },
            {
                field: 'nombreMedico',
               title: 'Nombre Profesional'
            },
            {
                field: 'especialidad',
                title: 'Especialidad'
            },
            {
                field: 'estado',
                title: 'Estado',
                sortable: false,
                autoHide: false,
                template: function (row) {
                    debugger
                    if (row.estadoAtencion == "I") {
                        return "Ingresada";
                    }
                    else if (row.estadoAtencion == "E") {
                        return "Eliminada";
                    }
                    else if (row.estadoAtencion == "T" && !row.nsp) {
                        return "Terminada";
                    }
                    else if (row.estadoAtencion == "T" && row.nsp) {
                        return "NSP";
                    }
                    else
                        return  ""
                }
            },
            {
                field: 'a',
                title: '',
                sortable: false,
                // width: 110,
                //overflow: 'visible',
                autoHide: false,
                template: function (row) {
                     return '\
                        <a href="/Admin/EditaAgenda?idAtencion='+ row.idAtencion + '&idPaciente=' + row.idPaciente + '" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar Atención">\
							<i class="fad fa-calendar-edit fa-2x"></i>\
						</a>\
                       <button class="btn btn-sm btn-clean btn-icon btn-icon-md openModal" id="btnReenviar'+ row.idAtencion + '" data-userid="' + row.idAtencion + '" title="Reenviar Correo">\
							<i class="fad fa-envelope-open-text fa-2x"></i>\
						</button>\
                         <button class="btn btn-sm btn-clean btn-icon btn-icon-md openModalLink" id="btnLink'+ row.idAtencion + '" data-userid="' + row.idAtencion + '" title="Copiar Link">\
							<i class="fad fa-external-link-square-alt fa-2x"></i>\
						</button>';

                    
                }
            }
        ],
    });

    $('#json_data').on('click', '.openModal', async function () {
        var id = parseInt($(this)[0].dataset.userid);
        let atencion = await getAtencionConfirma(id);
        if (atencion.length == 0) {
            Swal.fire("Sin próximas atenciones", "Paciente no registra atenciones", "info");
            return;
        }
        else {
            document.getElementById("correo").value = atencion.correoPaciente;
            $("#modalReenviarCorreo").modal("show");
        }
        document.getElementById("btnReenviar").onclick = async function () {
            atencion.correoPaciente = document.getElementById("correo").value;
            var envio = await comprobantePaciente(baseUrlWeb, atencion);
            if (envio.status == "OK")
                Swal.fire("Éxito!", "Se reenvio correo de forma exitosa", "success");
        }
    });

    $('#json_data').on('click', '.openModalLink', async function () {
        var id = parseInt($(this)[0].dataset.userid);
        let atencion = await getAtencionConfirma(id);
        let link = await getLinkAtencion(atencion);
         if (link.status == "NOK") {
            Swal.fire("Sin próximas atenciones", "Paciente no registra atenciones", "info");
            return;
        }
        else {
            document.getElementById("link").value = link.baseUrl;
            $("#modalGetLink").modal("show");
         }


        document.getElementById("btnCopiar").onclick = async function () {

            document.getElementById("link").select();
            var copy = document.execCommand("copy");
            debugger
            if (copy)
                Swal.fire("","Link copiado al portapapeles!","success")
        }
    });
}