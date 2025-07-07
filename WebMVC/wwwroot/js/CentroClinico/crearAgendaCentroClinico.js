import { personaAgenda } from "../shared/info-user.js";
import { getVwHorasMedicosByMedic,
    generarHorasMedico,
    eliminaHoraMedico,
    generarHorasMedicoConvenioCentroClinico,
    enviarAgendaMedico,
    eliminarAgendaRango
} from "../apis/vwhorasmedicoscentroclinico-fetch.js";
import {
    getProfesionalesAsociados,    
    getProfesionalesAsociadosCentroClinico,
    postProfesionalAsociadosByMedico,
    getProfesionalesAsociadosByIdMedico
} from '../apis/profesionales-asociados-fetch.js'

var calendar;
var dateType = "month";
var duracionAtencionProfesionalId = 0;
var duracionAtencionProfesionalMin = 0;
var idProfesional = 0;
var convenioJson = null;
var fecha;
export async function init(data) {

    //await configElementos();
    convenioJson = data.convenio;
    await personaAgenda();
    duracionAtencionProfesionalId = document.getElementById("duracionAtencionProfesionalId").value;
    duracionAtencionProfesionalMin = document.getElementById("duracionAtencionProfesionalMin").value;

    if (data.convenio.atencionDirecta) 
        duracionAtencionProfesionalMin = "02";

    idProfesional = document.getElementById("idProfesionalHidden").value;

    KTCalendarBasic.init();
     
    var spanNombreConvenio = document.getElementById("NombreConvenio");
    spanNombreConvenio.innerHTML = convenioJson.nombre;

    var tituloConvenio = document.getElementById("TituloConvenio");
    tituloConvenio.innerHTML = convenioJson.nombre;

    const profesionales = await getProfesionalesAsociadosByIdMedico(uid, idCentroClinico);
    const selectAsociado = document.getElementById('combo-profesionales-asociados')
    profesionales.forEach(async param => {
        let opcion2 = document.createElement('option');
        opcion2.setAttribute('value', param.idMedicoAsociado);
        opcion2.innerHTML = param.nombreCompleto;
        selectAsociado.appendChild(opcion2);
    });

    $('#profesionalesAsociados').click(function () {
        if ($(this).is(':checked'))
            $('#div-combo-profesionales-asociados').show('fast');
        else
            $('#div-combo-profesionales-asociados').hide('fast');

        $("#combo-profesionales-asociados").val(null).trigger("change");
    });

    document.getElementById('btnCrearAgendaConvenioCentroClinico').addEventListener('click', async () => {
        const formData = new FormData();

        formData.append("idProfesional", document.getElementById("hiddenIdProfesional").value);
        formData.append("FechaInicio", document.getElementById("hiddenFechaInicio").value);
        formData.append("FechaFin", document.getElementById("hiddenFechaFechaFin").value);
        formData.append("IdConvenio", convenioJson.id);
        formData.append("IdsProfesionalesAsociados", $("#combo-profesionales-asociados").val().join(','));


        let e = document.getElementById("TipoAgenda");
        let idTipoAgenda = e.options[e.selectedIndex].value;

        let m = document.getElementById("ModeloAtencion");
        let idModeloAtencion = m.options[m.selectedIndex].value;
        let zonaHoraria = document.getElementById("ZonaHoraria").value;
        let IdDuracionTiempo;
        if ($('#IdDuracionTiempo').is(":visible"))
            IdDuracionTiempo = document.getElementById("IdDuracionTiempo").value;
        else
            IdDuracionTiempo = duracionAtencionProfesionalId;

        formData.append("IdTipoAgenda", idTipoAgenda);
        formData.append("IdModeloAtencion", idModeloAtencion);
        formData.append("ZonaHoraria", zonaHoraria);
        formData.append("IdDuracionTiempo", IdDuracionTiempo);
        //formData.append("CadenaProfesionalesAsociados", $('select[name="profesionalesAsociados"]').val())
        formData.append("ProfesionalesAsociados", document.getElementById('profesionalesAsociados').checked)

        //  Genera las horas de un medico
        var agendaGenerada = await generarHorasMedicoConvenioCentroClinico(formData);
        if (agendaGenerada.typeSwal != 'error') {
            Swal.fire(
                'Se ha generado la agenda!',
                agendaGenerada.mensaje,
                'success'
            );
        } else {
            Swal.fire(
                'No se generó la agenda',
                agendaGenerada.mensaje,
                agendaGenerada.typeSwal
            );
        }

        await reloadcalendar();
        $('#modalDatosConvenio').modal('hide');

    });

    //-------------------------eliminar agenda-----------------------------------------------

    let btnModalEliminar = document.getElementById("btnEliminarAgenda");
    btnModalEliminar.onclick = () => {
        $('#modalEliminarAgenda').modal('show')
    }

    let btnEliminar = document.getElementById('btnEliminar');
    btnEliminar.onclick = async () => {
        
        let inputFecha = document.getElementById('fecha').value;
        let horaDesde = document.getElementById('horaDesde').value;
        let horaHasta = document.getElementById('horaHasta').value;
        let idConvenio = convenioJson.id;
        if (inputFecha != "" || horaDesde != "" || horaHasta != "") {
            let bloques = {
                idMedico: parseInt(idProfesional),
                horaDesde: horaDesde,
                horaHasta: horaHasta,
                fecha: inputFecha,
                idConvenio: idConvenio
            }
            let respuesta = await eliminarAgendaRango(bloques);
            if (respuesta.status == "OK") {
                Swal.fire("", "Horas eliminadas", "success");
                $('#modalEliminarAgenda').modal('hide')
                await reloadcalendar();
            }
            else {
                Swal.fire("","ocurrión error, vuelve a  intentarlo.","error")
            }
        }
        else {
            Swal.fire("","Debe completar los campos","warning")
        }
    }



    //---------------------------------------------------------------------------------------
    document.getElementById('btnEnviarAgenda').addEventListener('click', async () => {
        var correoProfesional = duracionAtencionProfesionalId = document.getElementById("correoProfesional").value;

        var nombreProfesional = duracionAtencionProfesionalId = document.getElementById("nombreProfesional").value;
        $('#btnEnviarAgenda').prepend('<span class="spinner-border spinner-border-sm m-r-10 mr-3" role="status" aria-hidden="true"></span>').attr('disabled', 1);
        var lista = await enviarAgendaMedico(idProfesional, correoProfesional, nombreProfesional);
         if (lista.lenght != 0) {
            Swal.fire({
                tittle: "Éxito!",
                text: "Se envió agenda por correo a profesional de forma correcta.",
                type: "success",
                confirmButtonText: "OK"
            })
        }
        else {
            Swal.fire({
                tittle: "No se envió correo",
                text: "No fue posible enviar correo a profesional, Vuelve a intentarlo más tarde",
                type: "error",
                confirmButtonText: "OK"
            })
        }
        $('#btnEnviarAgenda').removeAttr('disabled').children('.spinner-border').remove();
         
    });
}

async function reloadcalendar() {
    switch (calendar.view.type) {
        // Mes.
        case "dayGridMonth":
            dateType = "month";
            break;
        // Semana.
        case "timeGridWeek":
            dateType = "week";
            break;
        // Dia.
        case "timeGridDay":
            dateType = "day";
            break;

        default:
            break;
    }
    const date = calendar.getDate();
    const fechaQuery = moment(date).format("DD/MM/YYYY");
    const calendarData = await getVwHorasMedicosByMedic(
        uid,
        fechaQuery,
        dateType
    );
    await cargarCalendar(calendarData, dateType);
    KTApp.unblock("#kt_calendar");
}
function cargarCalendar(calendarData, dateType) {
    var todayDate = moment().startOf("day");
    var TODAY = todayDate.format("YYYY-MM-DD");
    calendar.batchRendering(function () {
        let eventos = calendar.getEvents();
        eventos.forEach((evento) => evento.remove());
        
        calendarData.forEach((horaAgendada) => {
            
            var event = {};
            switch (dateType) {
               
                // Mes.
                case "month":
                    document.getElementById('btnEliminarAgenda').classList.add("d-none");
                    event.title = horaAgendada.proximaHrDisponible
                        ? `Hr. Inicio: ${horaAgendada.proximaHrDisponible.substring(0, 5)}`
                        : "No hay horas disp.";
                    event.description = event.title;
                    event.start = horaAgendada.fecha;
                    event.color = "#dee2e3";
                    calendar.addEvent(event);

                    event = {};
                    event.title = `Bloque: ${horaAgendada.cantidadHrsOcupadas}/${horaAgendada.cantidadHrsTotales}`;
                    event.description = event.title;
                    event.start = horaAgendada.fecha.slice(0, -1) + "1";
                    event.color = "#dee2e3";
                    calendar.addEvent(event);
                    break;

                case "day":
                    
                    document.getElementById('btnEliminarAgenda').classList.remove("d-none");
                    var puedeEliminar = horaAgendada.idConvenio == convenioJson.id;
                    event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente} - zh:${horaAgendada.zonaHoraria}`;
                    if (horaAgendada.idAtencion !== 0)
                        event.title = `${event.title} - Atención: ${horaAgendada.idAtencion}`
                    event.description = event.title;
                    event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                    event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                    
                    event.IdDuracionAtencion = horaAgendada.IdDuracionAtencion;
                    event.DuracionAtencion = horaAgendada.DuracionAtencion;
                    event.FechaText = horaAgendada.FechaText;
                    event.nombrePaciente = horaAgendada.nombrePaciente;
                    event.horaDesdeText = horaAgendada.horaDesdeText;
                    event.horaHastaText = horaAgendada.horaHastaText;

                    event.IdMedicoHora = horaAgendada.idMedicoHora ?? 0;
                    event.IdBloqueHora = horaAgendada.idBloqueHora ?? 0;
                    event.IdAtencion = horaAgendada.idAtencion ?? 0;
                    event.IdPaciente = horaAgendada.idPaciente ?? 0;
                    event.Fecha = horaAgendada.fecha;

                    if (
                        horaAgendada.fechaText < TODAY &&
                        horaAgendada.nombrePaciente != "Disponible"
                    ) {
                        event.color = "#dee2e3";
                    } else if (
                        horaAgendada.nombrePaciente == "Disponible" &&
                        horaAgendada.fechaText >= TODAY
                    ) {
                        event.color = "#80e6be";
                    } else if (
                        horaAgendada.nombrePaciente == "Disponible" &&
                        horaAgendada.fechaText < TODAY
                    ) {
                        event.start = "0000-00-00";
                        event.end = "0000-00-00";
                    } else {
                        event.color = "#83caea";
                    }

                    var profesionalInvitado = horaAgendada.profesionalesAsociados ? 'SI' : 'NO';
                    if (puedeEliminar) {
                        event.clic = true;
                        event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}- ${horaAgendada.info} - zh:${horaAgendada.zonaHoraria} || Profesional Invitado: ${profesionalInvitado} ${horaAgendada.idAtencion !== 0 ? `|| Atención: ${horaAgendada.idAtencion}` : ''}<i style='margin-left:5px;' class='fa fa-trash pull-right'></i>`;
                    }
                    else {
                        event.clic = false;
                        event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente} - ${horaAgendada.info} - zh:${horaAgendada.zonaHoraria} || Profesional Invitado: ${profesionalInvitado} ${horaAgendada.idAtencion !== 0 ? `|| Atención: ${horaAgendada.idAtencion}` : ''}`;
                        event.color = "#ffad99";
                    }
                    if (document.querySelector('.fc-now-indicator-line') != null) {
                        document.querySelector('.fc-view-container').scrollTo({
                            top: document.querySelector('.fc-now-indicator-line').offsetTop,
                            behavior: 'smooth'
                        });
                    }
                    document.querySelector(".fc-view-container").setAttribute("style", "overflow: auto;height: 800px;");
                    calendar.addEvent(event);
                    break;

                default:
                    event.title = horaAgendada.nombrePaciente + "sss";
                    event.description = event.title;
                    event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                    event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                    if (horaAgendada.idPaciente != 0)
                        event.url = `Medico/FichaPaciente/${horaAgendada.idPaciente}`;

                    if (
                        horaAgendada.fechaText < TODAY &&
                        horaAgendada.nombrePaciente != "Disponible"
                    ) {
                        event.color = "#dee2e3";
                    } else if (
                        horaAgendada.nombrePaciente == "Disponible" &&
                        horaAgendada.fechaText >= TODAY
                    ) {
                        event.color = "#80e6be";
                    } else if (
                        horaAgendada.nombrePaciente == "Disponible" &&
                        horaAgendada.fechaText < TODAY
                    ) {
                        event.start = "0000-00-00";
                        event.end = "0000-00-00";
                    } else {
                        event.color = "#83caea";
                    }

                    calendar.addEvent(event);
                    break;
            }
        });
    });
}

var KTCalendarBasic = (function () {
    return {
        //main function to initiate the module
        init: function () {
            var todayDate = moment().startOf("day");
            var TODAY = todayDate.format("YYYY-MM-DD");
            
            //if (duracionAtencionProfesionalMin < 10)
            //    duracionAtencionProfesionalMin = "0" + duracionAtencionProfesionalMin;

            
            var calendarEl = document.getElementById("kt_calendar");
            calendar = new FullCalendar.Calendar(calendarEl, {
                plugins: ["interaction", "dayGrid", "timeGrid", "list"],

                isRTL: KTUtil.isRTL(),
                header: {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridDay",
                },
                showNonCurrentDates: false,
                fixedWeekCount: false,
                firstDay: 1,
                allDaySlot: false,
                displayEventTime: false,
                locale: "es",
                height: 800,
                contentHeight: 780,
                aspectRatio: 2, // see: https://fullcalendar.io/docs/aspectRatio
                editable: false,

                selectable: true,
                nowIndicator: true,
                now: moment().format("YYYY-MM-DDTHH:mm:ss"),

                views: {
                    dayGridMonth: { buttonText: "Mes" },
                    timeGridDay: { buttonText: "Dia" },
                    listWeek: { buttonText: "Lista semanal" },
                },

                defaultView: "dayGridMonth",
                defaultDate: TODAY,

                businessHours: [
                    // specify an array instead
                    {
                        daysOfWeek: [1, 2, 3, 4, 5, 6],
                        startTime: "00:00", // 8am
                        endTime: "23:45", // 6pm
                    },
                ],
                slotDuration: "00:" + duracionAtencionProfesionalMin + ":00",

                minTime: "00:00",
                endTime: "23:45", // 6pm

                eventLimit: true, // allow "more" link when too many events
                navLinks: true,
                events: [],

                datesRender: async function (info) {
                    KTApp.block("#kt_calendar", {});
                    await reloadcalendar();
                    if (document.querySelector('.fc-now-indicator-line') != null) {
                        document.querySelector('.fc-view-container').scrollTo({
                            top: document.querySelector('.fc-now-indicator-line').offsetTop,
                            behavior: 'smooth'
                        });
                    }
                    document.querySelector(".fc-view-container").setAttribute("style", "overflow: auto;height: 800px;");
                  
                },
                selectAllow: function (selectInfo) {
                    return moment().diff(selectInfo.start) <= 0;
                },
                eventClick: async function (calEvent, jsEvent, view) {
                    
                    if (calEvent.view.type === "timeGridDay") {
                         
                        var dateObj = new Date(calEvent.event.extendedProps.Fecha.replace('T00:00:00', 'T' + calEvent.event.extendedProps.horaDesdeText));
                        var momentObj = moment(dateObj);
                        var clic = false;
                        if (momentObj >= moment()) {
                            clic = true;
                        }



                        if (clic === true && calEvent.event.extendedProps.clic) {
                            var IdMedicoHora = calEvent.event.extendedProps.IdMedicoHora;
                            var IdAtencion = calEvent.event.extendedProps.IdAtencion;
                            var IdPaciente = calEvent.event.extendedProps.IdPaciente;
                            var formData = new FormData();
                            formData.append("IdMedicoHora", IdMedicoHora);


                            if (calEvent.event.extendedProps.nombrePaciente == "Disponible") {
                                await eliminaHoraMedico(formData);
                                KTApp.block("#kt_calendar", {});
                                await reloadcalendar();


                            } else {
                                Swal.fire({
                                    title: 'Hora tomada',
                                    text: "No puede eliminar una hora cuando existe un paciente agendado.",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Entiendo',
                                    cancelButtonText: 'Reagendar'
                                }).then(async (result) => {
                                    if (!result.value) {
                                        //location.href = "/Admin/ReagendarHora?idHoraMedico="+IdMedicoHora;
                                        location.href = `/AdminCentroClinico/EditaAgenda?idAtencion=${IdAtencion}&idPaciente=${IdPaciente}`;
                                    }
                                });
                            }
                        }
                    }
                },
                dateClick: function (info) {
                    if (info.view.type === "dayGridMonth")
                        document
                            .querySelector(`td.fc-day-top[data-date="${info.dateStr}"]`)
                            .querySelector("a.fc-day-number")
                            .click();
                    fecha = info.dateStr;
                    document.getElementById('fecha').value = fecha;
                },
                select: async function (info) {
                    if (!info.allDay) {
                        document.getElementById("hiddenIdProfesional").value = idProfesional;
                        document.getElementById("hiddenFechaInicio").value = moment(info.start.toISOString()).format("YYYY-MM-DD HH:mm")// info.start.toISOString();
                        document.getElementById("hiddenFechaFechaFin").value = moment(info.end.toISOString()).format("YYYY-MM-DD HH:mm") // info.end.toISOString();
                        $("#combo-profesionales-asociados").val(null).trigger("change");
                        $('#modalDatosConvenio').modal('show')
                    } else {
                        //alert('No puede crear horas en mas de un día');
                    }
                },
                dayRender: function (info) { },
                eventRender: function (info) {
                    if (info.view.type === "timeGridDay") {
                        if ("htmlTitle" in info.event.extendedProps) {
                            info.el.firstChild.innerHTML = info.event.extendedProps.htmlTitle;
                            $(info.el).css("width", "50%");
                        }
                    }
                    var element = $(info.el);
                    if (
                        info.event.extendedProps &&
                        info.event.extendedProps.description
                    ) {
                        element.data("content", info.event.extendedProps.description);
                        element.data("placement", "top");
                        KTApp.initPopover(element);
                    }


                },
            });

            calendar.render();
        },
    };
})();

async function configElementos() {
   
    // profesionales invitados
    let selectAsociado = document.querySelector('select[name="profesionalesAsociados"]');
    selectAsociado.required = false;

   // const profesionales = await getProfesionalesAsociados();
    const profesionales = await getProfesionalesAsociadosCentroClinico();
    let opcion2 = document.createElement('option');
    profesionales.forEach(async param => {
        opcion2 = document.createElement('option');
        opcion2.setAttribute('value', param.idMedicoAsociado);
        opcion2.innerHTML = param.nombreCompleto;
        selectAsociado.appendChild(opcion2);
    });


}

async function CrearAgenda() {

    var formData = new FormData();

    formData.append("idProfesional", idProfesional);
    formData.append("FechaInicio", info.start.toISOString());
    formData.append("FechaFin", info.end.toISOString());

    //  Genera las horas de un medico
    var agendaGenerada = await generarHorasMedico(formData);
   
    if (agendaGenerada.typeSwal != 'error')
        Swal.fire(
            'Se ha generado la agenda!',
            agendaGenerada.mensaje,
            'success'
        )
    else {
        Swal.fire(
            'No se generó la agenda',
            agendaGenerada.mensaje,
            agendaGenerada.typeSwal
        )
    }
}
