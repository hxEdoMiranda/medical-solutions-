import { personaPaciente } from '../shared/info-user.js';
import { getVwHorasMedicosByMedic, getHoraMedico, getVwHorasMedicoByAtencionCentro } from '../apis/vwhorasmedicos-fetch.js';
import { getMedicosbyEspecialidadCentroClinico, putAgendarMedicosHoras, reagendarAppCentro } from '../apis/agendar-fetch.js?5';
import { comprobantePaciente, comprobanteMedico } from '../apis/correos-fetch.js';
import { personByUser } from '../apis/personas-fetch.js'
import { enviarCitaEniax, cambioEstado } from "../apis/eniax-fetch.js?rnd=1"
import { validate, reagendar, cancelar } from "../apis/consalud-fetch.js?rnd=1"
import { getCentroClinicoByUser, getCentroClinicoByMedico, getListaCentrosClinicos } from '../apis/empresacentroclinico-fetch.js'

var calendar;
var dateType = 'month';
var viewType = 'dayGridMonth';
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD');
var timeType = TODAY;
var connection;
var idMedico;
var idMedicoHora;
var idPaciente;
var calendarData;
var idBloqueHora;
var fechaAgenda;
var connectionAgendar;
var TODAY;
var horas;
var duracionMin = 0;
var horaPaciente = {};
var horaDesdeText;
var idConvenio = 0;
var CentrosClinicos = [];
var bloqueProfesionalInvitado = false;
export async function init(data) {
    idPaciente = window.idPaciente;
    idCliente = window.idCliente;
    await personaPaciente(idPaciente);
    cargarEspecialidades(data.especialidades);  
    CentrosClinicos = await getCentroClinicoByUser(uid);
    muestraCentroClinico()

    if (idAtencion != 0) {
        var idEspecialidad;
        var idMedicoAtencion;
        var fecha;
        let dataAtencion = await getVwHorasMedicoByAtencionCentro(idAtencion);
            idEspecialidad = dataAtencion.idEspecialidad;
            idMedicoAtencion = dataAtencion.idMedico;
            idMedico = dataAtencion.idMedico;
            idHoraMedico = dataAtencion.idHora;         
            fecha = dataAtencion.fecha;
        horaPaciente = dataAtencion;
        idConvenio = dataAtencion.idConvenio;
        // cliente = IdEmpresa;//dataAtencion.idCliente;
        
        dateType = 'day';
        viewType = 'timeGridDay';
        timeType = moment(fecha.replace("-", "").substring(0, 10), "YYYYMMDD").format("YYYY-MM-DD");
        

        document.getElementById('especialidades').value = idEspecialidad;
        let medicos = await getMedicosbyEspecialidadCentroClinico(idEspecialidad, idconvenio);
        
        cargarMedicos(medicos);
         
        document.getElementById('medicos').value = idMedicoAtencion;
        if (document.getElementById('medicos').innerHTML.includes(idMedicoAtencion))
            idMedico = document.getElementById('medicos').value;
        else
            document.getElementById('medicos').value = 0;

    }

    horas = moment().format('HH:mm:ss');
    await agendarRealTime();

    window.addEventListener("beforeunload", function (event) {
        if (connectionAgendar.state === signalR.HubConnectionState.Connected) {
            connectionAgendar.invoke('UnsubscribeAgendarPaciente').catch((err) => {
                return console.error(err.toString());
            });
        }
    });
    let especialidad = document.getElementById('especialidades');
    let selectMedicos = document.getElementById('medicos');
    if (typeAgenda != "E") {
        idMedico = selectMedicos.value;
    }
    KTCalendarBasic.init();

    especialidad.onchange = async () => {
        let idEspecialidad = especialidad.value;
        let medicos = await getMedicosbyEspecialidadCentroClinico(idEspecialidad, idconvenio);
        cargarMedicos(medicos);
    };

    medicos.onchange = async () => {
        calendar.destroy();
        idMedico = selectMedicos.value;
        KTCalendarBasic.init();

    };
  
}

async function guardarAtencion() {

    let horaTomada = await getHoraMedico(idBloqueHora, fechaAgenda, idPaciente)
    if (horaTomada.status != "NOK") {
        if (horaTomada.horasmedico.horaDesde.value.minutes == 0)
            horaTomada.horasmedico.horaDesde.value.minutes = horaTomada.horasmedico.horaDesde.value.minutes + "0";

        let fechaFormato = moment(horaTomada.horasmedico.fecha.replace("-", "").substring(0, 10), "YYYYMMDD").format("DD-MM-YYYY");
        let horaFormato = horaTomada.horasmedico.horaDesde.value.hours + ":" + horaTomada.horasmedico.horaDesde.value.minutes
        Swal.fire("",
            "El Paciente " + horaTomada.horasmedico.nombrePaciente + ", tiene una hora registrada el día " + fechaFormato + " a las: " + horaFormato + " con Dr. " + horaTomada.horasmedico.nombreMedico,
            "warning");
        return;
    }
    
    let agendar = {
        idBloqueHora: idBloqueHora,
        fechaText: fechaAgenda,
        idPaciente: idPaciente,
        idMedicoHora: idMedicoHora,
        id: idAtencion,
        idCliente: idCliente
    };

    var title = "Confirmar Atención";
    var text = `¿Desea confirmar?`;
    if (typeAgenda === "E") {
        var fechaNueva = moment(fechaAgenda, "YYYYMMDD").format("DD-MM-YYYY");
        title = "Reagendar Atención";
        text = `Esta cancelando la atención de paciente ${horaPaciente.nombrePaciente} fecha ${moment(horaPaciente.fecha.replace("-", "").substring(0, 10), "YYYYMMDD").format("DD-MM-YYYY")} a las ${horaPaciente.horaDesdeText.substring(0, 5)}, Esta asignando una nueva hora ${fechaNueva} - ${horaDesdeText.substring(0,5)} ¿desea continuar?`;
    }
    var hidden = "hidden";
    if (bloqueProfesionalInvitado) {
        hidden = "";
    }
    Swal.fire({
        title: title,
        text: text,
        type: "question",
        showCancelButton: true,
        cancelButtonColor: 'rgb(190, 190, 190)',
        confirmButtonColor: '#3085d6',
        cancelButtonStyle: 'position:absolute; right:45px',
        reverseButtons: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, Confirmar",
        html: `
        <div class="ml-5">
            <div class="form-check text-left" hidden>
                <input class="form-check-input" type="checkbox" value="" id="checkbox1">
                <label class="form-check-label" for="checkbox1">
                    Peritaje
                </label>
            </div>
            <div class="form-check text-left" ${hidden}>
                <input class="form-check-input" type="checkbox" value="" id="checkbox2">
                <label class="form-check-label" for="checkbox2">
                   ¿Acepta atención con invitado?
                </label>
            </div>
        </div>
    `,
        focusConfirm: false,
        preConfirm: () => {
            agendar.peritaje = document.getElementById('checkbox1').checked;
            agendar.aceptaProfesionalInvitado = document.getElementById('checkbox2').checked;
            
        }
        
    }).then(async (result) => {
       if (result.value) {
           let valida = "";
           switch (idCliente) {
                case 1://flujo reagendar consalud
                    let validar = await validate(idAtencion);
                    if (validar != "NOK") {
                        if (!validar.reschedule && validar.id_agenda == 0) {
                            Swal.fire("No es posible reagendar esta atención", "Indicar a usuario que debe reagendar atención por sucursal digital.", "error");
                            return;
                        }
                        var fechaBono = moment(validar.date_to).format("YYYY-MM-DD");
                        if (validar.reschedule && fechaAgenda <= fechaBono) {
                            agendar.bonoPlataformaExterna = validar.num_bono.toString();
                            agendar.idCliente = 1;
                            valida = await reagendarAppCentro(agendar, idMedico, uid);
                            if (valida !== 0) {
                                var fechaHoraNueva = `${moment(valida.infoAtencion.fecha).format("YYYY-MM-DD")}T${valida.infoAtencion.horaDesdeText}`
                                var reagenda = await reagendar(valida.infoAtencion.idAtencion, idAtencion, fechaHoraNueva);
                                //if (reagenda == "NOK") {
                                //    var revert = await revertReagenda(idAtencion, valida.infoAtencion.idAtencion, uid);
                                //    if (revert.status == "OK") {
                                //        Swal.fire("Atención!", "Se revierte nueva atención", "warning");
                                //    }
                                //    return;
                                //}
                                var cancela = await cancelar(idAtencion);
                            }
                        }
                        else {
                            Swal.fire("", "No es posible reagendar esta atención.", "error");
                            return;
                        }
                    }
                    break;
                default:
                    agendar.idCliente = idCliente ? idCliente : 0;
                    
                    if (idAtencion == 0) {
                        valida = await putAgendarMedicosHoras(agendar, idMedico, uid);
                    }
                    else {
                        valida = await reagendarAppCentro(agendar, idMedico, uid);
                    }
                    break;
            }
            
            if (valida !== 0) {
                var fecha = valida.infoAtencion.fecha;
               if (connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {
                        connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "actualizar").then(r => {
                            connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                        }).catch(err => console.error(err));
                    }).catch((err) => {
                        return console.error(err.toString());
                    });
                }

                connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {
                    return console.error(err.toString());
                });
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Ha confirmado la atención.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                        calendar.destroy();
                        viewType = 'timeGridDay';
                        timeType = moment(fecha.replace("-", "").substring(0, 10), "YYYYMMDD").format("YYYY-MM-DD");
                        idHoraMedico = valida.infoAtencion.idHora;
                        KTCalendarBasic.init();
                 });

                

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
                    id: valida.infoAtencion.idAtencion,
                    especialidad: valida.infoAtencion.especialidad,
                    horaDesdeTextPaciente: valida.infoAtencion.horaDesdeTextPaciente,
                    peritaje: valida.atencionModel.peritaje,
                    idPaciente: valida.atencionModel.idPaciente,
                    idCliente: valida.atencionModel.idCliente
                };
                await comprobantePaciente(baseUrlWeb,valida.atencionModel);
                await comprobanteMedico(baseUrlWeb, valida.atencionModel);

                let locationHref = new URL(window.location.href);
                if (typeAgenda != "E" && idCliente != 1 && !locationHref.origin.includes('achs.')) {
                   // await enviarCitaEniax(valida.infoAtencion.idAtencion);
                    await cambioEstado(idAtencion, "E") // E = Anulada
                }                   
                location.href = `/AdminCentroClinico/EditaAgenda?idAtencion=${valida.infoAtencion.idAtencion}&idPaciente=${valida.infoAtencion.idPaciente}`;
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
              
            }
        }
    });
    

    
    }

function cargarEspecialidades(especialidades) {
    especialidades.forEach(especialidad => {
        $("#especialidades").append('<option value="' + especialidad.id + '">' + especialidad.nombre + '</option>');
    });
}

function cargarMedicos(medicos) {
    $("#medicos").empty();
    $("#medicos").append('<option value="0">Seleccionar Médico</option>');
    medicos.forEach(medico => {
        $("#medicos").append('<option value="' + medico.idMedico + '">' + medico .nombreMedico + '</option>');
    });
}

function cargarCalendar(calendarData, dateType) {
  calendar.batchRendering(function () {
        let eventos = calendar.getEvents();
        eventos.forEach(evento => evento.remove());
        calendarData.forEach(horaAgendada => {
          var dateObj = new Date(horaAgendada.fechaText + " " + horaAgendada.horaDesdeText);
          var momentObj = moment(dateObj);
          
            var event = {};
            switch (dateType) {
                case 'month':
                    event.title = horaAgendada.proximaHrDisponible ? `Hr. Inicio: ${horaAgendada.proximaHrDisponible.substring(0, 5)}` : 'No hay horas disp.';
                    event.description = event.title;
                    event.start = horaAgendada.fecha;
                    event.color = '#dee2e3';
                    calendar.addEvent(event);

                    event = {}
                    event.title = `Bloque: ${horaAgendada.cantidadHrsOcupadas}/${horaAgendada.cantidadHrsTotales}`;
                    event.description = event.title;
                    event.start = horaAgendada.fecha.slice(0, -1) + '1';
                    event.color = '#dee2e3';
                    document.querySelector(".fc-view-container").removeAttribute("style", "overflow: auto;height: 600px;")
                    calendar.addEvent(event);
                    break;

                case 'day':
                    
                    var profesionalInvitado = horaAgendada.profesionalesAsociados ? 'SI' : 'NO';
                    if (momentObj >= moment()) {
                        event.clic = true;
                    }
                    if (!horaAgendada.atencionDirecta) {
                        if (horaAgendada.nombrePaciente === "Disponible" && event.clic) {
                            event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente} - ${horaAgendada.info} - zh:${horaAgendada.zonaHoraria} || Profesional Invitado: ${profesionalInvitado} `;
                            event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente} - ${horaAgendada.info} - zh:${horaAgendada.zonaHoraria} || Profesional Invitado: ${profesionalInvitado}` + "<i style='margin-left:5px;' class='fa fa-plus'></i>";
                            event.description = event.title;
                            event.color = '#80e6be';
                            event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                            event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                            event.idBloqueHora = horaAgendada.idBloqueHora;
                            event.fechaText = horaAgendada.fechaText;
                            event.idMedicoHora = horaAgendada.idMedicoHora;
                            event.nombrePaciente = horaAgendada.nombrePaciente;
                            event.horaDesdeText = horaAgendada.horaDesdeText;
                            event.idConvenio = horaAgendada.idConvenio;
                            event.bloqueProfesionalInvitado = horaAgendada.profesionalesAsociados;
                        }
                        else if (horaAgendada.nombrePaciente != "Disponible") {
                            event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}`;
                            var profesionalInvitado = horaAgendada.aceptaProfesionalInvitado ? 'SI' : 'NO';
                            var peritaje = horaAgendada.peritaje ? 'SI' : 'NO';
                            event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente} - ${horaAgendada.info} - zh:${horaAgendada.zonaHoraria} || Profesional Invitado: ${profesionalInvitado} || Peritaje: ${peritaje}`;
                            event.description = event.title;
                            event.color = '#22b9ff';
                            event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                            event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                            event.idMedicoHora = horaAgendada.idMedicoHora;
                        }

                        if (document.querySelector('.fc-now-indicator-line') != null) {
                            document.querySelector('.fc-view-container').scrollTo({
                                top: document.querySelector('.fc-now-indicator-line').offsetTop,
                                behavior: 'smooth'
                            });
                        }
                        document.querySelector(".fc-view-container").setAttribute("style", "overflow: auto;height: 700px;");
                        calendar.addEvent(event);
                    }
                   
                    break;

                case 'week':
                    if (momentObj >= moment()) {
                        event.clic = true;
                    }
                    if (horaAgendada.nombrePaciente === "Disponible" && event.clic) {
                        event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}`;
                        event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}` + "<i style='margin-left:5px;' class='fa fa-plus'></i>";
                        event.description = event.title;
                        event.color = '#80e6be';
                        event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                        event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                        event.idBloqueHora = horaAgendada.idBloqueHora;
                        event.fechaText = horaAgendada.fechaText;
                        event.idMedicoHora = horaAgendada.idMedicoHora;
                        event.nombrePaciente = horaAgendada.nombrePaciente;
                        event.horaDesdeText = horaAgendada.horaDesdeText;

                    }
                    else if (horaAgendada.nombrePaciente != "Disponible") {
                        event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}`;
                        event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}`;
                        event.description = event.title;
                        event.color = '#22b9ff';
                        event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                        event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                    }
                    document.querySelector(".fc-view-container").setAttribute("style", "overflow: auto;height: 700px;")
                    calendar.addEvent(event);
                    break;

            }

        });
    });
}


var KTCalendarBasic = function () {
  
    return {
        //main function to initiate the module

        init:async function () {
            const id = document.getElementById('medicos').value
            if (id != 0) {
                let duracion = await personByUser(id)
                if (duracion != null)
                    duracionMin = duracion.duracionAtencionMin;
            }
            else {
                duracionMin = 15;//por defecto cuando no existe duracion de atencion de un profesional.
            }
            var todayDate = moment().startOf('day');
            var TODAY = todayDate.format('YYYY-MM-DD');
           
            var calendarEl = document.getElementById('kt_calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],

                isRTL: KTUtil.isRTL(),
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
              
                showNonCurrentDates: false,
                fixedWeekCount: false,
                firstDay: 1,
                allDaySlot: false,
                displayEventTime: false,
                locale: 'es',
                height: 900,
                contentHeight: 880,
                aspectRatio: 2,  // see: https://fullcalendar.io/docs/aspectRatio

                nowIndicator: true,
                now: moment().format('YYYY-MM-DDTHH:mm:ss'),
                eventLimit: true,
                views: {
                    dayGridMonth: { buttonText: 'Mes', eventLimit: 4},
                    timeGridWeek: { buttonText: 'Semana' },
                    timeGridDay: { buttonText: 'Dia' }
                   
                },

                defaultView: viewType,
                defaultDate: timeType,

                businessHours: [ // specify an array instead
                    {
                        daysOfWeek: [1, 2, 3, 4, 5, 6],
                        startTime: "00:00", // 8am
                        endTime: "23:59", // 6pm
                    }
                ],
                slotDuration: "00:"+ duracionMin +":00",
                minTime: "00:00",
                maxTime: "23:59",
                editable: false,
                eventLimit: true, // allow "more" link when too many events
                navLinks: true,
                events: [],
                editable: true,
                
                datesRender: async function (info) {
                    KTApp.block('#kt_calendar', {});
                    switch (info.view.type) {
                        // Mes.
                        case 'dayGridMonth':
                            dateType = 'month'
                            break;
                        // Semana.
                        case 'timeGridWeek':
                            dateType = 'week'
                            break;
                        // Dia.
                        case 'timeGridDay':
                            dateType = 'day'
                            break;

                        default:
                            break;
                    }
                    const date = calendar.getDate();
                    const fechaQuery = moment(date).format('DD/MM/YYYY')
                    calendarData = await getVwHorasMedicosByMedic(idMedico, fechaQuery, dateType)
                    await cargarCalendar(calendarData, dateType)
                    if (idHoraMedico > 0) {
                       if (document.getElementById(idHoraMedico) != null) {
                            $('.fc-view-container').animate({
                                scrollTop: $("#" + idHoraMedico).offset().top - 250
                            }, 2000);
                           
                        }
                    }
                    KTApp.unblock('#kt_calendar');
                },

                eventClick: async function (calEvent, event) {
                    var nombrePaciente = calEvent.event.extendedProps.nombrePaciente;
                    horaDesdeText = calEvent.event.extendedProps.horaDesdeText;
                    idBloqueHora = calEvent.event.extendedProps.idBloqueHora;
                    fechaAgenda = calEvent.event.extendedProps.fechaText;
                    idMedicoHora = calEvent.event.extendedProps.idMedicoHora;
                    bloqueProfesionalInvitado = calEvent.event.extendedProps.bloqueProfesionalInvitado;
                    if (nombrePaciente === "Disponible" && calEvent.event.extendedProps.clic) {
                        if (idCliente != 1)
                            guardarAtencion();
                        else {
                            if(idConvenio == calEvent.event.extendedProps.idConvenio)
                                guardarAtencion();
                            else
                                Swal.fire("","No se puede reagendar una atención de otro convenio","error")
                        }
                        
                       
                    }
                    
                },

                dateClick: function (info) {
                    if (info.view.type === 'dayGridMonth')
                        document.querySelector(`td.fc-day-top[data-date="${info.dateStr}"]`).querySelector('a.fc-day-number').click();
                },
               
                dayRender: function (info) {
                },
                eventRender: function (info) {
                    if (info.view.type === 'timeGridDay') {
                        if ("htmlTitle" in info.event.extendedProps)
                            info.el.firstChild.innerHTML = info.event.extendedProps.htmlTitle;
                        }

                    var element = $(info.el);
                    element.find('.fc-content').append('<div class="fc-id" id="' + info.event.extendedProps.idMedicoHora+'"></div>')
                    //info.el.setAttribute('title', info.event.title)
                    if (info.event.extendedProps && info.event.extendedProps.description) {
                        element.data('content', info.event.extendedProps.description);
                        element.data('placement', 'top');
                        KTApp.initPopover(element);
                    }
                }
            });

            calendar.render();
          
        }
        
    };
    
}();

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
        calendar.destroy();
        KTCalendarBasic.init();
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

function muestraCentroClinico() {

    document.getElementById("centroClinico").innerText = "Convenio " + CentrosClinicos[0].nombreCentroClinico;
    CentrosClinicos[0].idCentroClinico

}