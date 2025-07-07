import { getAtencionHistorialPacientePorCriterios } from "../apis/atencion-fetch.js";

//Initialize table
var datatable = $('.kt-datatable').KTDatatable(null);
var idCliente = 0;
var fechaDesde;
var fechaHasta;
var peritajeBool = false;

//Set dates
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD');

var fromDate = moment().startOf('day').add(-1, 'month');
var FROMDAY = fromDate.format('YYYY-MM-DD');

document.querySelector('[id="fechaDesde"]').value = FROMDAY;
document.querySelector('[id="fechaHasta"]').value = TODAY;

export async function init(especialidad) {
    //let historial = await getAtencionHistorialPaciente(24);

    if (especialidad == 'True') {
        var htmlPeritaje = document.getElementById('peritaje');
        htmlPeritaje.value = 1;
        $("#peritaje").prop('checked', true);
    }


    $('#peritaje').click(function () {
        if (document.getElementById('peritaje').value == 1) {
            document.getElementById('peritaje').value = 0;
        } else {
            document.getElementById('peritaje').value = 1;
        }
    })

    $("#btnBuscar").click(function () {
        fechaDesde = document.querySelector('[id="fechaDesde"]').value;
        fechaHasta = document.querySelector('[id="fechaHasta"]').value;
        fechaDesde = moment(fechaDesde.replace("-", ""), "YYYYMMDD").format("YYYY-MM-DD");
        fechaHasta = moment(fechaHasta.replace("-", ""), "YYYYMMDD").format("YYYY-MM-DD");
        peritajeBool = document.getElementById('peritaje').value == 1;
        datatable.destroy();
        getData();
    });

    //Close modal that show patien's atention
    document.querySelector('#btnCerrar').onclick = async () => {
        $("#modalBody").empty();
    };

    //Click on table to show modal patien's atention
    //Click on table to show modal patien's atention
    $('#json_data').on('click', '.modalInforme', function () {
        var idConsulta = $(this).data('idConsulta');
        var id = $(this).data('id');
        var ruta;

        if (idConsulta) {
            ruta = 'InformeTeledoc/' + idConsultaTeledoc;
        } else if (id) {
            ruta = 'InformeAtencion?idAtencion=' + id + '&sendInforme=false';
        } else {
            alert("No se pudo determinar el valor de idConsulta o id.");
            return;
        }

        //create element embed on modal.
        $.ajax({
            url: ruta,
            type: 'GET',
            success: function (data) {
                $('#modalBody').html(data);
                $("#kt_modal_3").modal("show");
            },
            error: function () {
                alert("There is some problem in the service!");
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
    });
    // END > Autocomplete patients -----------------------------------------------------------------------

    //Fill table with database data
    async function getData() {

        datatable = $('.kt-datatable').KTDatatable({
            // datasource definition

            data: {
                type: 'local',
                source: await getAtencionHistorialPacientePorCriterios(idCliente, fechaDesde, fechaHasta, peritajeBool),
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
                    field: 'fechaText',
                    width: 150,
                    title: 'Fecha',
                    template: function (row) {
                        console.log(row)
                        var fecha = row.fechaText;
                        var hora = row.horaDesdeText;
                        return fecha + " : " + hora;
                    }
                },
                {
                    field: 'especialidad',
                    width: 150,
                    title: 'Especilidad'
                },
                {
                    field: 'nombreMedico',
                    title: 'Nombre Médico',
                    width: 200
                },
                {
                    field: 'patologiasString',
                    title: 'Diagnostico',
                    width: 250
                },
                {
                    field: 'estado',
                    title: 'Estado',
                    overflow: 'visible',
                    width: 80,
                    template: function (row) {
                        if (row.nsp === true)
                            return '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">NSP</span>';
                        else if (row.estado === 'T')
                            return '<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">Terminada</span>';
                        else if (row.estado === 'I')
                            return '<span class="kt-badge kt-badge--info kt-badge--inline kt-badge--pill">Ingresada</span>';
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
                       

                        var url;
                        if (row.fuente === 'Teledoc' && row.idConsultaTeledoc) {
                            url = 'InformeTeledoc?idConsulta=' + row.idConsultaTeledoc + '&username=' + row.username; // URL para Teledoc
                        } else {
                            url = 'InformeAtencion?idAtencion=' + row.id + '&sendInforme=false'; // URL para Medismart
                        }

                        if (row.idConsultaExterna !== null) {
                            row.nsp = true; // Establecer row.nsp en true si row.idConsultaExterna es null
                        }

                        if (!row.nsp && url) {
                            console.log(row.username); // Imprime el valor de username en la consola

                            // Agrega un evento de click al enlace
                            var linkOnClick = 'event.preventDefault(); enviarSolicitudAJAX("' + row.username + '", ' + row.idConsultaTeledoc + ');';

                            return '\
                            <a href="' + url + '" onclick="' + linkOnClick + '" type="button" class="btn btn-label-brand btn-bold btn-sm modalInforme" data-id="' + row.id + '" title="Ver Informe" target="_blank">\
                                ver informe\
                            </a>\
                        ';
                        } else {
                            return '';
                        }
                    }



                },
                {
                    field: 'fuente',
                    title: 'Origen',
                    width: 100,
                    template: function (row) {
                        var fuente = row.fuente === 'Teledoc' ? 'Teledoc' : 'Medismart';
                        var colorClass = row.fuente === 'Teledoc' ? 'kt-badge--purple' : 'kt-badge--blue';
                        var backgroundColor = row.fuente === 'Teledoc' ? '#9c83ff' : '#9ed6f7';
                        var textColor = row.fuente === 'Teledoc' ? '#ffffff' : '#000000';
                        return '<span class="kt-badge ' + colorClass + ' kt-badge--inline kt-badge--pill" style="background-color: ' + backgroundColor + '; color: ' + textColor + ';">' + fuente + '</span>';
                    }
                }
            ],

        });
    };
}