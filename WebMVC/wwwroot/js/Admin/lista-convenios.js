import { getConvenios} from "../apis/convenios-fetch.js";
import { getProximasHorasPaciente } from '../apis/vwhorasmedicos-fetch.js';
import { putEliminarAtencion } from '../apis/agendar-fetch.js';
import { comprobanteAnulacion } from '../apis/correos-fetch.js';

var tableAtencionPaciente = $('#tableProximasAtenciones').KTDatatable(null);
export async function init(data, urlEdit) {
   
    let convenios = await getConvenios();
   
    var datatable = $('#json_data').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: convenios,
            pageSize: 25,
        },

        // layout definition
        layout: {
            scroll: true,
            height: 550,
            footer: false,
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
                field: 'a',
                title: '',
                width: 30,
                align:'center',
                sortable: false,
                //overflow: 'visible',
                autoHide: false,
                template: function (row) {
                    var url = urlEdit + '?idConvenio=' + row.id;

                    return '\<a href="' + url + '" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit details">\
							<i class="la la-edit"></i>\
						</a>\
                    ';
                }
            },
            {
                field: 'nombre',
                title: 'Nombre',
                autoHide: false,
                
             
            }, {
                field: 'modeloAtencion',
                //width: 150,
                autoHide: false,
                title: 'Modelo Atención'
            }, 
            {
                field: 'fechaInicio',
                //width: 100,
                autoHide: false,
                title: 'Fecha Inicio',
                template: function (row) {
                    var titulofechaInicio= '';
                    if (row.fechaInicio != null)
                        titulofechaInicio = moment(row.fechaInicio).format("DD/MM/YYYY");
                    else
                        titulofechaInicio = '-';

                    return titulofechaInicio;
                }
            },
            {
                field: 'fechaTermino',
                //width: 100,
                autoHide: false,
                title: 'Fecha Termino',
                template: function (row) {
                    var titulofechaInicio = '';
                    if (row.fechaTermino != null)
                        titulofechaInicio = moment(row.fechaTermino).format("DD/MM/YYYY");
                    else
                        titulofechaInicio = '-';

                    return titulofechaInicio;
                }
            },
            {
                field: 'estado',
                title: 'Estado',
                width: 60,
                autoHide: false,
                //overflow: 'visible',
                template: function (row) {
                    if (row.estado === 'I')
                        return 'Inactivo';
                    else
                        return 'Activo';
                }

            }
        ],

    });



    $('#kt_form_status').on('change', function () {
        datatable.search($("#kt_form_status option:selected").val(), 'estado');
    });

}

