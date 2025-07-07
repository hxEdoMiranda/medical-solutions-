import { GetListaPacientesCentroClinico, ChangeStatePersona } from "../apis/personas-fetch.js";
import { getProximasHorasPaciente } from '../apis/vwhorasmedicos-fetch.js';
import { putEliminarAtencion } from '../apis/agendar-fetch.js';
import { comprobanteAnulacion } from '../apis/correos-fetch.js';
import { cambioEstado } from "../apis/eniax-fetch.js?rnd=1";
import { validate, cancelar } from "../apis/consalud-fetch.js?rnd=2"
var tableAtencionPaciente = $('#tableProximasAtenciones').KTDatatable(null);
var connection;
var connectionAgendar;
var idMedico;
var datatable;
export async function init(data, urlEdit) {
   
    let btnBuscar = document.getElementById('buscar');
    btnBuscar.onclick = async () => {
        
        let textBusqueda = document.getElementById('generalSearch');
        let selectEstado = document.getElementById('kt_form_status');
        if (textBusqueda.value == "")
            return;
        if(datatable!=null)
            datatable.destroy();
        let pacientes = await GetListaPacientesCentroClinico(textBusqueda.value, selectEstado.value, idCentroClinico);
        dataPacientes(pacientes);
    }

    async function dataPacientes(pacientes) {
        datatable = $('#json_data').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: pacientes,
                pageSize: 25,
            },

            // layout definition
            layout: {
                scroll: true,
                height: 550,
                footer: false,
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
                    autoHide: false,
                    //width: 400,
                    template: function (row) {
                        var url = urlEdit + '?idPaciente=' + row.userId;
                        var fechaInactivacion = '';
                        var titulofecha = '';
                        if (row.fechaCreacion != null)
                            titulofecha = moment(row.fechaCreacion).format("DD/MM/YYYY");
                        else
                            titulofecha = '-';
                        if (row.estado !== 'V')
                            fechaInactivacion = ', Fecha inactivación: ' + moment(row.fechaCambioEstado).format("DD/MM/YYYY");

                        return '<a href="' + url + '" class="" title="Editar">\
							    <strong>' + row.nombreCompleto + '</strong> <i class="la la-edit"></i>\
						    </a>\<br/>' +
                            'Fecha creación: ' + titulofecha + fechaInactivacion;
                    }
                }, {
                    field: 'identificador',
                    //width: 150,
                    autoHide: false,
                    title: 'RUT'
                }, {
                    field: 'fNacimiento',
                    //width: 100,
                    autoHide: false,
                    title: 'Fecha de Nacimiento',
                    template: function (row) {
                        var titulofechaNacimiento = '';
                        if (row.fNacimiento != null)
                            titulofechaNacimiento = moment(row.fNacimiento).format("DD/MM/YYYY");
                        else
                            titulofechaNacimiento = '-';

                        return titulofechaNacimiento;
                    }
                },
                {
                    field: 'telefono',
                    //width: 130,
                    autoHide: false,
                    title: 'Teléfono',
                },
                {
                    field: 'telefonoMovil',
                    // width: 130,
                    autoHide: false,
                    title: 'Celular',
                },
                {
                    field: 'correo',
                    //  width: 250,
                    autoHide: false,
                    title: 'Correo',
                },
                {
                    field: 'estado',
                    title: 'Estado',
                    width: 60,
                    autoHide: false,
                    //overflow: 'visible',
                    template: function (row) {
                        if (row.estado === 'V')
                            return '\
                        <button class="btn btn-sm btn-icon btn-icon-md cambiaEstado" data-userid="'+ row.userId + '"  data-nombre="' + row.nombre + '" title="Activo">\
							<i class="fas fa-toggle-on fa-2x" id="'+ row.userId +'" style="color:#44c678"></i>\
						</button>';
                        else
                            return '\
                        <button class="btn btn-sm btn-icon btn-icon-md cambiaEstado" data-userid="'+ row.userId + '"  data-nombre="' + row.nombre + '" title="Inactivo">\
							<i class="fas fa-toggle-off fa-2x" id="'+ row.userId +'" style="color:red"></i>\
						</button>';
                    }

                }, {
                    field: 'a',
                    title: 'Agendar',
                    sortable: false,
                    // width: 110,
                    //overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        if (row.estado == "I") {
                            return '\
                        <a href="/AdminCentroClinico/AgendaPaciente/'+ row.userId + '" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="reserva'+row.userId+'" title="Reservar Hora" hidden>\
							<i class="far fa-calendar-plus" ></i>\
						</a>\
                       <button class="btn btn-sm btn-clean btn-icon btn-icon-md openModal" id="btnEditarAgenda'+ row.userId + '" data-userid="' + row.userId + '" hidden title="Editar Agenda">\
							<i class="la la-edit"></i>\
						</button>';
                        }
                        else {
                            return '\
                        <a href="/AdminCentroClinico/AgendaPaciente?idPaciente='+ row.userId + '" class="btn btn-sm btn-clean btn-icon btn-icon-md" id="reserva' + row.userId +'" title="Reservar Hora">\
							<i class="far fa-calendar-plus"></i>\
						</a>\
                       <button class="btn btn-sm btn-clean btn-icon btn-icon-md openModal" id="btnEditarAgenda'+ row.userId +'" data-userid="'+ row.userId + '" title="Editar Agenda">\
							<i class="la la-edit"></i>\
						</button>';
                        }

                    }
                }
            ],

        });    //Abrir modal con info de paciente

    $('#json_data').on('click', '.openModal', async function () {
        var id = parseInt($(this)[0].dataset.userid);
        let proximasAtenciones = await getProximasHorasPaciente(id);
        

      
        if (proximasAtenciones.length == 0) {
            Swal.fire("Sin próximas atenciones","Paciente no registra atenciones","info");
            return;
        } else {
            tableAtencionPaciente.destroy();
            await getTable(proximasAtenciones);
            $("#kt_modal_3").modal("show");
        }
     });

    $('#json_data').on('click', '.cambiaEstado',async function () {
        var id = $(this)[0].dataset.userid;
        var nombre = $(this)[0].dataset.nombre;
        swal.fire({
            title: 'Cambio de estado',
            text: nombre,
            type: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, cámbialo'
        }).then(async function (result) {
            if (result.value) {
                await ChangeStatePersona(id);
                swal.fire({
                    position: 'top-right',
                    type: 'success',
                    title: 'Estado modificado',
                    showConfirmButton: false,
                    timer: 1500
                });
                let element = document.getElementById(id);
                let btnAgenda = document.getElementById("reserva" + id);
                let btnEditarAgenda = document.getElementById("btnEditarAgenda"+id)
                if (element.getAttribute("class") == "fas fa-toggle-on fa-2x") {
                    element.setAttribute('class', 'fas fa-toggle-off fa-2x')
                    element.setAttribute('style', 'color:red');
                    btnAgenda.setAttribute("hidden",true);
                    btnEditarAgenda.setAttribute("hidden",true);
                }
                else {
                    element.setAttribute('class', 'fas fa-toggle-on fa-2x')
                    element.setAttribute('style', 'color:#44c678');
                    btnAgenda.removeAttribute("hidden");
                    btnEditarAgenda.removeAttribute("hidden");
                }

                //location.reload();
            }
        });




    });


    $('#kt_form_status').on('change', function () {
        datatable.search($("#kt_form_status option:selected").val(), 'estado');
    });
    
    }

}

async function getTable(proximasAtenciones) {
   await agendarRealTime();
   tableAtencionPaciente = $('#tableProximasAtenciones').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: proximasAtenciones,
            pageSize: 10,
        },

        // layout definition
        layout: {
            scroll: true,
            height: 650,
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

        //search: {
        //    input: $('#generalSearch')
        //},

        // columns definition
        columns: [
            {
                field: 'nombrePaciente',
                title: 'Nombre',
                autoHide: false,
            }, {
                field: 'nombreMedico',
                title: 'Nombre Médico',
                autoHide: false,
            }, {
                field: 'fechaText',
                title: 'Fecha de Atención',
                autoHide: false,

            },
            {
                field: 'horaDesdeText',
                title: 'Hora de Atención',
                autoHide: false,

            },
            {
                field: 'especialidad',
                title: 'Especialidad',
                autoHide: false,

            },
            {
                field: 'a',
                title: 'Editar',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
                template: function (row) {
                        return '\
                        <a href="/AdminCentroClinico/EditaAgenda?idAtencion=' + row.idAtencion + '&idPaciente=' + row.idPaciente + '" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar Atención">\
							<i class="la la-edit"></i>\
						</a>\
                        <button class="btn btn-sm btn-clean btn-icon btn-icon-md eliminarAtencion" data-idpaciente="' + row.idPaciente + '" data-fecha="' + row.fecha + '" data-idcliente= "' + row.idCliente + '" data-idmedico="' + row.idMedico + '" data-idatencion="' + row.idAtencion + '" title="Eliminar Atención">\
							<i class="la la-trash" style="color:red"></i>\
						</button>';
                }
            }
        ],

   });
    $('#tableProximasAtenciones').on('click', '.eliminarAtencion',async function () {
        
        var id = $(this)[0].dataset.idatencion;
        idMedico = $(this)[0].dataset.idmedico;
        var idCliente = $(this)[0].dataset.idcliente;
        var fechaAgenda = moment($(this)[0].dataset.fecha).format("YYYY-MM-DD");
        var idPaciente = $(this)[0].dataset.idpaciente;

        swal.fire({
            title: 'Eliminar atención',
            text: "¿Está seguro de eliminar esta atención?",
            type: 'question',
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, Elimínala'
        }).then(async function (result) {
            if (result.value) {
                if (idCliente == 1) {
                    var validar = await validate(id);
                    if (validar != "NOK") {
                        if (!validar.reschedule && validar.id_agenda == 0) {
                            Swal.fire("No es posible cancelar esta atención", "Indicar a usuario que debe cancelar atención por sucursal digital.", "error");
                            return;
                        }
                        var cancela = await cancelar(id);
                        if (cancela == "NOK") {
                            Swal.fire("No es posible cancelar esta atención", "Indicar a usuario que debe cancelar atención por sucursal digital.", "error");
                            return;
                        }

                        if (cancela.id_agenda == null) {
                            Swal.fire("No es posible cancelar esta atención", "Indicar a usuario que debe cancelar atención por sucursal digital.", "error");
                            return;
                        }

                    }
                }
                let valida = await putEliminarAtencion(id, uid);
                if (valida !== 0) {

                    if (connection.state === signalR.HubConnectionState.Connected) {
                        connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {
                            connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "eliminar").then(r => {
                                connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                            }).catch(err => console.error(err));
                        }).catch((err) => {
                            return console.error(err.toString());
                        });
                    }
                    Swal.fire({
                        tittle: "Éxito!",
                        text: "Ha eliminado la atención, se enviará un comprobante al paciente.",
                        type: "success",
                        confirmButtonText: "OK"
                    });

                    // Recarga listado
                    let proximasAtenciones = await getProximasHorasPaciente(idPaciente);
                    
                    tableAtencionPaciente.destroy();
                    await getTable(proximasAtenciones);
                    
                    let fecha = valida.infoAtencion.fecha;
                   
                    if (valida.infoAtencion.horaDesde.value.minutes == 0)
                        valida.infoAtencion.horaDesde.value.minutes = valida.infoAtencion.horaDesde.value.minutes + "0";
                    let minutos = valida.infoAtencion.horaDesde.value.hours + ":" + valida.infoAtencion.horaDesde.value.minutes;
                    let fechaCompleta = moment(fecha.replace("-", "").substring(0, 10), "YYYYMMDD").format("DD-MM-YYYY") + " " + minutos;
                    let atencion = {
                        nombreMedico: valida.infoAtencion.nombreMedico,
                        nombrePaciente: valida.infoAtencion.nombrePaciente,
                        correoMedico: valida.infoAtencion.correoMedico,
                        correoPaciente: valida.infoAtencion.correoPaciente,
                        fechaText: fechaCompleta,
                        id: valida.infoAtencion.idAtencion
                    };
                    if (idCliente != 1) {
                        await cambioEstado(valida.infoAtencion.idAtencion, "E") // E = Anulada
                        
                    }
                    await comprobanteAnulacion(valida.atencion);
                    $("#kt_modal_3").modal("hide");
                }
                else {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                }
                
            }
        });
    });
}

async function agendarRealTime() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
    } catch (err) {
        
    }

    connectionAgendar = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/agendarpacientehub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionAgendar.on('ActualizarAgendarPaciente', () => {
        cargarMedicos();
    });

    try {
        await connectionAgendar.start();
    } catch (err) {
        
    }

    if (connectionAgendar.state === signalR.HubConnectionState.Connected) {
        connectionAgendar.invoke('SubscribeAgendarPaciente').catch((err) => {
            return console.error(err.toString());
        });
    }
}