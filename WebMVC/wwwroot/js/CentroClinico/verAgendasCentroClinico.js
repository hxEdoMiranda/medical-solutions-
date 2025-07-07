import { getListaProfesionalesConvenioCentroClinico } from "../apis/conveniocentroclinico-fetch.js";
import { getEspecialidadesConvenio } from "../apis/agendar-fetch.js";

var idconvenio = 0;
var urlEdit = "";
var datatable = $('.kt-datatable').KTDatatable(null);
export async function init(data, url) {

   // $('#kt_form_status,#especialidades,#convenios').selectpicker();
    $('#kt_form_status,#especialidades,#centroClinico').selectpicker();
    // basic demo
    cargarEspecialidades(data.especialidades);
   // cargarConvenios(data.convenios)
    muestraCentroClinico(data.convenios);   
 
    $("#divTablaDatos").hide();
    urlEdit = url;
}

function cargarConvenios(convenios) {
    convenios.forEach(convenio => {        
        let atencionDirectaText = "";
        if (convenio.atencionDirecta)
            atencionDirectaText = "Atencion Directa - ";
       $("#convenios").append('<option value="' + convenio.id + '">' + atencionDirectaText + convenio.nombre + '</option>');

    });
}

function muestraCentroClinico(convenios) {
    convenios.forEach(centroclinico => {
        let atencionDirectaText = "";
        if (centroclinico.atencionDirecta)
            atencionDirectaText = "Atencion Directa - ";
        document.getElementById("centroClinico").innerText = "Agenda " + atencionDirectaText + centroclinico.nombre;
        cargaEspecialideades(centroclinico.id);
  
    });

}

function cargarEspecialidades(especialidades) {
   // especialidades.forEach(especialidad => {
   //     $("#especialidades").append('<option value="' + especialidad.nombre + '">' + especialidad.nombre + '</option>');
   // });
}



$('#json_data').on('click', '.cambiaEstado', function () {
    var id = $(this)[0].dataset.idpersona;
    var nombre = $(this)[0].dataset.nombre;
    swal.fire({
        title: 'Cambio de estado',
        text: nombre,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, cambialo'
    }).then(async function (result) {
        if (result.value) {

            alert("Click crear agenda");

            //await ChangeStatePersona(id);
            //location.reload();

        }
    });
});

$('#especialidades').on('change', function () {
    datatable.search($("#especialidades option:selected").val(), 'especialidad');
});

async function cargaEspecialideades() {

    var especialidades = await getEspecialidadesConvenio(idConvenio);
    if (especialidades) {
        $('#especialidades').selectpicker('destroy');
        document.getElementById("especialidades").innerHTML = "";
        $("#especialidades").append('<option value="">Todos</option>');
        especialidades.forEach(especialidad => {
            $("#especialidades")
                .append('<option value="' + especialidad.nombre + '">' + especialidad.nombre + '</option>');
        });
        $('#especialidades').selectpicker();
    }
    $("#divTablaDatos").show();
    datatable.search($("#especialidades option:selected").val(), 'especialidad');
    datatable.destroy();
    await getdata();
}

$('.kt-datatable__row').on('click', function () {
    datatable.search($("#especialidades option:selected").val(), 'especialidad');
});

$('#kt_form_status').on('change', function () {
    datatable.search($("#kt_form_status option:selected").val(), 'estado');
});

async function getdata() {
   // document.getElementById('lblInfoConvenio').innerHTML = "";
    document.getElementById('lblInfoCentroClinico').innerHTML = "";
    let data = await getListaProfesionalesConvenioCentroClinico(idConvenio, idCentroClinico);
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

        translate: {
            records: {
                processing: 'Espere por favor',
                noRecords: 'Sin registros para mostrar'
            },
            toolbar: {
                pagination: {
                    items: {
                        default: {
                            first: 'Primero',
                            prev: 'Anterior',
                            next: 'Siguiente',
                            last: 'Último',
                            more: 'Más páginas',
                            input: 'Número de página',
                            select: 'Selecciona página1'
                        },
                        info: 'Mostrando {{start}} - {{end}} de {{total}} registros'
                    }
                }
            }
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
                field: 'nombre',
                title: 'Nombre',
                width: 300,
                template: function (row) {

                    var apellidoPaterno = row.apellidoPaterno;
                    if (apellidoPaterno === undefined)
                        apellidoPaterno = '';

                    var apellidoMaterno = row.apellidoMaterno;
                    if (apellidoMaterno === undefined)
                        apellidoMaterno = '';

                    var fechaInactivacion = '';
                    if (row.estado !== 'V')
                        fechaInactivacion = ', Fecha inactivación: ' + moment(row.fechaCambioEstado).format("DD/MM/YYYY");

                    return '<strong>' + row.nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno + '</strong><br/>' +
                        'Fecha creación: ' + moment(row.fechaCreacion).format("DD/MM/YYYY") + fechaInactivacion;
                }
            }, {
                field: 'tituloMedicoDetalle',
                width: 150,
                title: 'Tipo de profesional',
                template: function (row) {

                    var tituloProfesional = row.tituloMedicoDetalle;
                    if (tituloProfesional === null)
                        tituloProfesional = 'N/A';

                    return tituloProfesional;
                }
            }, {
                field: 'especialidad',
                width: 150,
                title: 'Especilidad',
                template: function (row) {

                    var especialidad = row.especialidad;
                    if (especialidad === null)
                        especialidad = 'N/A';

                    return especialidad;
                }
            },
            {
                field: 'correo',
                width: 250,
                title: 'Correo',
            }
            ,
            {
                field: 'telefono',
                width: 100,
                title: 'Teléfono',
            }
            , {
                field: 'horasAgendaProfesional',
                title: 'Cupos',
                width: 100,
                template: function (row) {
                    if (row.horasAgendaProfesional > 0)
                        return '<spam style = "font-weight:bold" >' + row.horasAgendaProfesional + " (" + Math.round(((row.horasAgendaProfesional * 100) / row.horasConvenio), 3) + '%)</spam>'; 
                    else
                        return row.horasAgendaProfesional;
                }

            }
            , {
                field: 'a',
                title: 'Editar',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
                template: function (row) {
                    var url = urlEdit + '?idProfesional=' + row.id + '&idConvenio=' + idConvenio;

                    return '\
                        <a href="'+ url + '" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar">\
							<i class="la la-calendar"></i>\
						</a>\
                    ';
                }
            }
        ],


    });

    if (data.length > 0)
        //document.getElementById('lblInfoConvenio').innerHTML = "Horas Centro Clinico : " + data[0].horasConvenio + " | Con agenda : " + data[0].horasConvenioConAgenda + "(" + parseFloat((data[0].horasConvenioConAgenda * 100) / data[0].horasConvenio).toFixed(1) + "%) | Libres : " + parseInt(parseInt(data[0].horasConvenio) - parseInt(data[0].horasConvenioConAgenda)) + "(" + Math.round((((data[0].horasConvenio - data[0].horasConvenioConAgenda) * 100) / data[0].horasConvenio), 3) + "%)";
        document.getElementById('lblInfoCentroClinico').innerHTML = "Horas Centro Clinico : " + data[0].horasConvenio + " | Con agenda : " + data[0].horasConvenioConAgenda + "(" + parseFloat((data[0].horasConvenioConAgenda * 100) / data[0].horasConvenio).toFixed(1) + "%) | Libres : " + parseInt(parseInt(data[0].horasConvenio) - parseInt(data[0].horasConvenioConAgenda)) + "(" + Math.round((((data[0].horasConvenio - data[0].horasConvenioConAgenda) * 100) / data[0].horasConvenio), 3) + "%)";


}