import { historialReporteEnfermeria } from "../apis/reporte-enfermeria-fetch.js";

//Initialize table
var datatable = $('.kt-datatable').KTDatatable(null);
var idCliente = 0;
export async function init() {
    //let historial = await getAtencionHistorialPaciente(24);
    

    $("#btnBuscar").click(function () {
        document.getElementById('input_codigo').value = "";
        idCliente = 0;
        datatable.destroy();
        getData();
    });

    document.getElementById('btnNuevoReporte').onclick = () => {
        if (idCliente == 0) {
            Swal.fire("", "Debes seleccionar un paciente para continuar", "warning");
            return;
        }
        window.location = `/Medico/NuevoReporte?idPaciente=${idCliente}`
    }
    //Close modal that show patien's atention
    document.querySelector('#btnCerrar').onclick = async () => {
        $("#modalBody").empty();
    };

    //Click on table to show modal patien's atention
    $('#json_data').on('click', '.modalInforme', function () {
        var id = $(this)[0].dataset.id;
        var ruta = 'InformeAtencionPartial/' + id;
        //create element embed on modal.
        $.ajax({
            url: ruta,
            type: 'GET',
            success: function (data) {
                $('#modalBody').html(data);
                $("#kt_modal_3").modal("show");
            },
            error: function () {
                alert("There is some problem in the service!")
            }
        });
    });


    // Autocomplete patients -----------------------------------------------------------------------
    var bloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + '/usuarios/Personas/getPacientesPorCriterios/%QUERY',
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
            return item.nombreCompleto;
        }
    }).bind("typeahead:selected", function (obj, datum, name) {
        idCliente = datum.id;
        datatable.destroy();
        getData();
    });
    // END > Autocomplete patients -----------------------------------------------------------------------

    //Fill table with database data
    async function getData() {

        datatable = $('.kt-datatable').KTDatatable({
            // datasource definition

            data: {
                type: 'local',
                source: await historialReporteEnfermeria(idCliente),
                pageSize: 10,
            },

            // layout definition
            layout: {
                scroll: true,
                height: 550,
                footer: false
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch')
            },

            // columns definition
            columns: [
                {
                    field: 'nombrePaciente',
                    title: 'Nombre Paciente',

                },
                {
                    field: 'nombreProfesional',
                    width: 150,
                    title: 'Nombre Profesional'
                },
                {
                    field: 'fechaCreacion',
                    width: 150,
                    title: 'Fecha',
                    template: function (row) {
                        var fecha = row.fechaCreacion.substring(0,10);
                        return fecha;
                    }
                },
               
                {
                    field: 'a',
                    title: 'Editar',
                    sortable: false,
                    width: 100,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        var url = '/Medico/EditarReporte?id=' + row.id;
                        if (row.idUsuarioCreacion == uid) {
                            return '\
						<a href="' + url + '" type="button" class="btn btn-label-brand btn-bold btn-sm" data-id="' + row.id + '" title="Editar Reporte" target="_blank">\
                        <i class="fa fa-edit"></i>\
						</a>\
                    ';
                        }
                        else {
                            return '';
                        }
                     
                    }
                }
            ],

        });
    };
}

