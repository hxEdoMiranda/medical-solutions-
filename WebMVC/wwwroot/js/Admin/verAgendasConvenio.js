import { getListaProfesionalesConvenio } from "../apis/personas-fetch.js";
import { getEspecialidadesConvenio } from "../apis/agendar-fetch.js";

var idconvenio = 0;
var urlEdit = "";
var datatable = $('.kt-datatable').KTDatatable(null);
export async function init(data, url) {
  
    $('#kt_form_status,#especialidades,#convenios').selectpicker();
    // basic demo
    cargarEspecialidades(data.especialidades);
    cargarConvenios(data.convenios);

  
    $("#divTablaDatos").hide();
    urlEdit = url;

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

    $('#convenios').on('change', async function () {
        
        idconvenio = $("#convenios option:selected").val();
        var especialidades = await getEspecialidadesConvenio(idconvenio);


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
    });


    $('.kt-datatable__row').on('click', function () {
        datatable.search($("#especialidades option:selected").val(), 'especialidad');
    });

    $('#kt_form_status').on('change', function () {
        datatable.search($("#kt_form_status option:selected").val(), 'estado');
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
    //especialidades.forEach(especialidad => {
    //    $("#especialidades").append('<option value="' + especialidad.nombre + '">' + especialidad.nombre + '</option>');
    //});
}


async function getdata() {
    document.getElementById('lblInfoConvenio').innerHTML = "";
    let data = await getListaProfesionalesConvenio(idconvenio);
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
                field: 'nombre',
                title: 'Nombre',
                width: 300,
                template: function (row) {

                    var apellidoPaterno = row.apellidoPaterno;
                    if (apellidoPaterno === undefined)
                        apellidoPaterno = '';

                    var apellidomaterno = row.apellidomaterno;
                    if (apellidomaterno === undefined)
                        apellidomaterno = '';

                    var fechaInactivacion = '';
                    if (row.estado !== 'V')
                        fechaInactivacion = ', Fecha inactivación: ' + moment(row.fechaCambioEstado).format("DD/MM/YYYY");

                    return '<strong>' + row.nombre + ' ' + apellidoPaterno + ' ' + apellidomaterno + '</strong><br/>' +
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
                    var url = urlEdit + '?idProfesional=' + row.id + '&idConvenio=' + idconvenio;

                    return '\
                        <a href="'+ url + '" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit details">\
							<i class="la la-calendar"></i>\
						</a>\
                    ';
                }
            }
        ],


    });

    if (data.length > 0)
        document.getElementById('lblInfoConvenio').innerHTML = "Horas Convenio : " + data[0].horasConvenio + " | Con agenda : " + data[0].horasConvenioConAgenda + "(" + parseFloat((data[0].horasConvenioConAgenda * 100) / data[0].horasConvenio).toFixed(1) + "%) | Libres : " + parseInt(parseInt(data[0].horasConvenio) - parseInt(data[0].horasConvenioConAgenda)) + "(" + Math.round((((data[0].horasConvenio - data[0].horasConvenioConAgenda) * 100) / data[0].horasConvenio), 3) + "%)";


}