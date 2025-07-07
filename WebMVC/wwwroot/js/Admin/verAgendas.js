import { GetListaProfesionalesAgenda, ChangeStatePersona } from "../apis/personas-fetch.js";

export async function init(data, urlEdit) {

    $('#kt_form_status,#especialidades').selectpicker();
	// basic demo
	cargarEspecialidades(data.especialidades);


    
    

		var datatable = $('.kt-datatable').KTDatatable({
			// datasource definition
            data: {
                type: 'local',
                source: await GetListaProfesionalesAgenda(),
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
                    field: 'nombre',
                    title: 'Nombre',
                    width: 400,
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
                    
                    title: 'Teléfono',
                }, {
                    field: 'a',
                    title: 'Editar',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        var url = urlEdit + '?idProfesional=' + row.id;

                        return '\
                        <a href="'+ url +'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit details">\
							<i class="la la-calendar"></i>\
						</a>\
                    ';
                    }
                }
            ],

        });


    $('#json_data').on('click', '.cambiaEstado', function () {


        var id = $(this)[0].dataset.idpersona;
        var nombre =  $(this)[0].dataset.nombre;
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


    $('.kt-datatable__row').on('click', function () {
            datatable.search($("#especialidades option:selected").val(), 'especialidad');
        });

        $('#kt_form_status').on('change', function () {
            datatable.search($("#kt_form_status option:selected").val(), 'estado');
        });
}



function cargarEspecialidades(especialidades) {
    especialidades.forEach(especialidad => {
        $("#especialidades").append('<option value="' + especialidad.nombre + '">' + especialidad.nombre + '</option>');
    });
}