import { GetListaAtenciones } from "../apis/atencion-fetch.js";



var datatable;
export async function init(data, urlEdit) {
   
    let btnBuscar = document.getElementById('buscar');
    btnBuscar.onclick = async () => {

        
        let fechaInicio = document.getElementById('fechaInicio');
        let fechaFin = document.getElementById('fechaFin');
        let buscador = document.getElementById('generalSearch');

        if (fechaInicio.value == "")
            return;
        if (fechaFin.value == "")
            return;
        if(datatable!=null)
            datatable.destroy();
        
        let atenciones = await GetListaAtenciones(fechaInicio.value, fechaFin.value, window.idEmpresa);
        dataAtenciones(atenciones);
    }

    async function dataAtenciones(atenciones) {
        datatable = $('#json_data').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: atenciones,
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
                    field: 'nombreMedico',
                    title: 'Nombre Medico',
                    autoHide: false,
                    width: 170,
                }, {
                    field: 'nombre',
                    width: 150,
                    autoHide: false,
                    title: 'Nombre Paciente',
                    template: function (row) {
                        var nombreCompleto = row.nombre + ' ' + row.apellidoPaterno;
                        return nombreCompleto;
                    }
                }, {
                    field: 'identificador',
                    width: 100,
                    autoHide: false,
                    title: 'Rut'
                }, {
                    field: 'inicioAtencion',
                    width: 150,
                    autoHide: false,
                    title: 'Fecha de Inicio',
                    template: function (row) {
                        var fecha = new Date(row.inicioAtencion).toISOString().
                            replace(/T/, ' ').      // replace T with a space
                            replace(/\..+/, '');
                        return fecha;
                    }
                },               
                {
                    field: 'estado',
                    title: 'Archivos',
                    width: 80,
                    autoHide: false,
                    //overflow: 'visible',
                    template: function (row) {
                        var url = '/Admin/InformeAtencion?idAtencion=' + row.id + '&sendInforme=false';
                        return '<a href="' + url + '" class="" title="Edit details">\
							    <strong> Informes </strong> <i class="la la-edit"></i>\
						    </a>\<br/>';
                    }
                }
            ]
        });
    }
}