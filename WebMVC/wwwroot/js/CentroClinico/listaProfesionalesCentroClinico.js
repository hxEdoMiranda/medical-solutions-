import { ChangeStatePersona } from "../apis/personas-fetch.js";
import { getListaProfesionalesCentro, ChangeStatePersonaCentroClinico } from "../apis/conveniocentroclinico-fetch.js";
export async function init(data, urlEdit) {
    $('#kt_form_status,#especialidades').selectpicker();
	// basic demo
    cargarEspecialidades(data.especialidades);
   
		var datatable = $('.kt-datatable').KTDatatable({
			// datasource definition
            data: {
                type: 'local',
              //  source: await getListaProfesionalesConvenioCentroClinico(idConvenio, idCentroClinico),
                source: await getListaProfesionalesCentro(idCentroClinico),
                pageSize: 10,
            },

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

                        var apellidoMaterno = row.apellidoMaterno;
                        if (apellidoMaterno === undefined)
                            apellidoMaterno = '';

                        var titulofecha = '';
                        if (row.fechaCreacion != null)
                            titulofecha = moment(row.fechaCreacion).format("DD/MM/YYYY");
                        else
                            titulofecha = '-';

                        var fechaInactivacion = '';
                        if (row.estado !== 'V')
                            fechaInactivacion = ', Fecha inactivación: ' + moment(row.fechaCambioEstado).format("DD/MM/YYYY");
                        
                        /*return '<strong>' + row.nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno + '</strong><br/>' +
                            'Fecha creación: ' + moment(row.fechaCreacion).format("DD/MM/YYYY") + fechaInactivacion;*/

                        var url = urlEdit + '?idProfesional=' + row.id;

                        return '<a href="' + url + '" class="" title="Editar">\
							    <strong>' + row.nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno + '</strong> <i class="la la-edit"></i>\
						    </a>\<br/>' +
                            'Fecha creación: ' + titulofecha + fechaInactivacion;
                    }
                },
                {
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
                },
                {
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

                        /*if (row.estado === 'V')
                            return '<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">Activo</span>';
                        else
                            return '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">Inactivo</span>';*/

                        if (row.estado === 'V')
                            return '\
                        <button class="btn btn-sm btn-icon btn-icon-md cambiaEstado" data-idPersona="'+ row.id + '"  data-nombre="' + row.nombre + '" title="Activo">\
							<i class="fas fa-toggle-on fa-2x" id="'+ row.id + '" style="color:#44c678"></i>\
						</button>';
                        else
                            return '\
                        <button class="btn btn-sm btn-icon btn-icon-md cambiaEstado" data-idPersona="'+ row.id + '"  data-nombre="' + row.nombre + '" title="Inactivo">\
							<i class="fas fa-toggle-off fa-2x" id="'+ row.id + '" style="color:red"></i>\
						</button>';
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


                
                await ChangeStatePersonaCentroClinico(id);
                // location.reload();
                swal.fire({
                    position: 'top-right',
                    type: 'success',
                    title: 'Estado modificado',
                    showConfirmButton: false,
                    timer: 1500
                });
                
                let element = document.getElementById(id);
                if (element.getAttribute("class") == "fas fa-toggle-on fa-2x") {
                    element.setAttribute('class', 'fas fa-toggle-off fa-2x')
                    element.setAttribute('style', 'color:red');
                }
                else {
                    element.setAttribute('class', 'fas fa-toggle-on fa-2x')
                    element.setAttribute('style', 'color:#44c678');
                }
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