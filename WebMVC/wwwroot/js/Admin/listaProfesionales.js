import { GetListaProfesionales, ChangeStatePersona } from "../apis/personas-fetch.js";

export async function init(data, urlEdit) {

    $('#kt_form_status,#especialidades').selectpicker();
	// basic demo
	cargarEspecialidades(data.especialidades);


    
    

		var datatable = $('.kt-datatable').KTDatatable({
			// datasource definition
            data: {
                type: 'local',
                source: await GetListaProfesionales(),
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
                    //width: 400,
                    autoHide: false,
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
                    //width: 150,
                    title: 'Tipo de profesional',
                    autoHide: false,
                    //template: function (row) {
                        
                    //    var tituloProfesional = row.tituloMedicoDetalle;
                    //    if (tituloProfesional === null)
                    //        tituloProfesional = 'N/A';

                    //    return tituloProfesional;
                    //}
                }, {
                    field: 'especialidad',
                    //width: 150,
                    autoHide: false,
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
                    //width: 250,
                    autoHide: false,
                    title: 'Correo',
                }
                ,
                {
                    field: 'telefono',
                    autoHide: false,
                    title: 'Teléfono',
                }, {
                    field: 'estado',
                    title: 'Estado',
                    autoHide: false,
                    width: 90,
                    //overflow: 'visible',
                    template: function (row) {

                        if (row.estado === 'V')
                            return '<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">Activo</span>';
                        else
                            return '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">Inactivo</span>';
                    }
                    
                }, {
                    field: 'a',
                    title: 'Editar',
                    
                    sortable: false,
                   //overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        var url = urlEdit + '?idProfesional=' + row.id;
                        
                        return '\
                        <button class="btn btn-sm btn-clean btn-icon btn-icon-md cambiaEstado" data-idPersona="'+ row.id + '"  data-nombre="' + row.nombre +'" title="Cambiar estado">\
							<i class="fa fa-exchange-alt"></i>\
						</button>\
						<a href="'+ url+'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit details">\
							<i class="la la-edit"></i>\
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


                
                await ChangeStatePersona(id);
                location.reload();
                swal.fire({
                    position: 'top-right',
                    type: 'success',
                    title: 'Estado modificado',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });


        
        
    });
   

    

        $('#especialidades').on('change', function () {
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