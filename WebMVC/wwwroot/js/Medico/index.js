import { persona } from '../shared/info-user.js';
import { getVwHorasMedicosByMedic, getVwHorasMedicosBloquesHorasByMedic } from '../apis/vwhorasmedicos-fetch.js';
import { getDatosProfesional, personByUser } from '../apis/personas-fetch.js';



var calendar;
var dateType = 'month';
var connection;
var duracionMin = 0;
const isUnab = window.host.includes('unabactiva.') || window.host.includes('activa.unab.');
const tituloInvitadosSingular = 'Invitado';
const tituloInvitadosPlural = 'Invitados';

export async function init(data) {
    camposValidos(uid);
    indexRealTime(uid)
    await persona();

    let duracion = await personByUser(uid)
    if (duracion != null)
        duracionMin = duracion.duracionAtencionMin;


    KTCalendarBasic.init();
    cargarTimeline(data.timelineData2);


    setInterval(cambiarIndicadorTimeline, 30000); // c/30segs.

}

function cargarCalendar(calendarData, dateType) {
    var todayDate = moment().startOf('day');
    var TODAY = todayDate.format('YYYY-MM-DD');

    calendar.batchRendering(function () {
        let eventos = calendar.getEvents();
        eventos.forEach(evento => evento.remove());

        calendarData.forEach(horaAgendada => {
            var event = {};
            switch (dateType) {
                // Mes.
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
                    calendar.addEvent(event);
                    break;

                case 'day':
                    event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.horaHastaText.substring(0, 5)} - ${horaAgendada.nombrePaciente}`;
                    event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.horaHastaText.substring(0, 5)} - ${horaAgendada.nombrePaciente} ${horaAgendada.cantidadHistorial > 0 ? "<i style='margin-left:5px;' class='flaticon-interface-3'></i>" : ""}`;
                    event.description = event.title;
                    event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                    event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                    if (horaAgendada.idPaciente != 0 && horaAgendada.estadoAtencion == 'I')
                        event.url = `/Medico/FichaPaciente/${horaAgendada.idPaciente}`;



                    if (horaAgendada.fechaText < TODAY && horaAgendada.nombrePaciente != "Disponible") {
                        event.color = '#dee2e3';
                    }
                    else if (horaAgendada.idPaciente != 0 && horaAgendada.estadoAtencion == 'P') {
                        event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.horaHastaText.substring(0, 5)} - ${horaAgendada.nombrePaciente}  -  Pendiente de pago`;
                        event.color = '#f7cb54';
                    }
                    else if (horaAgendada.nombrePaciente == "Disponible" && horaAgendada.fechaText >= TODAY) {
                        event.color = '#80e6be';
                    }
                    else if (horaAgendada.nombrePaciente == "Disponible" && horaAgendada.fechaText < TODAY) {
                        event.start = "0000-00-00";
                        event.end = "0000-00-00";
                    }
                    else {
                        event.color = '#83caea';
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
                    event.title = horaAgendada.nombrePaciente;
                    event.description = event.title;
                    event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                    event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                    if (horaAgendada.idPaciente != 0 && horaAgendada.estadoAtencion == "I")
                        event.url = `/Medico/FichaPaciente/${horaAgendada.idPaciente}`;

                    if (horaAgendada.fechaText < TODAY && horaAgendada.nombrePaciente != "Disponible") {
                        event.color = '#dee2e3';
                    }
                    else if (horaAgendada.idPaciente != 0 && horaAgendada.estadoAtencion == 'P') {
                        event.title = `${horaAgendada.nombrePaciente}`;
                        event.description = `${horaAgendada.nombrePaciente} - Pendiente de pago`;
                        event.color = '#f7cb54';
                    }
                    else if (horaAgendada.nombrePaciente == "Disponible" && horaAgendada.fechaText >= TODAY) {
                        event.color = '#80e6be';
                    }
                    else if (horaAgendada.nombrePaciente == "Disponible" && horaAgendada.fechaText < TODAY) {
                        event.start = "0000-00-00";
                        event.end = "0000-00-00";
                    }
                    else {
                        event.color = '#83caea';
                    }

                    calendar.addEvent(event);
                    break;
            }

        });
    });
}

function cargarTimeline(timelineData) {


    let primerI = false;
    let divTimeline = document.getElementById('kt-timeline-v2__items');
    while (divTimeline.firstChild) {
        divTimeline.removeChild(divTimeline.firstChild)
    }

    timelineData.forEach(horaAgendadaBloqueHora => {


        let div = document.createElement('div');
        div.classList.add('kt-timeline-v2__item');
        if (horaAgendadaBloqueHora.nombrePaciente == "Disponible") {

        } else {
            let span = document.createElement('span');
            span.classList.add('kt-timeline-v2__item-time');

            span.innerHTML = horaAgendadaBloqueHora.horaDesdeText.substring(0, horaAgendadaBloqueHora.horaDesdeText.lastIndexOf(':'));
            div.appendChild(span);
        }


        if (horaAgendadaBloqueHora.idPaciente) {
            let divCircle = document.createElement('div');
            divCircle.classList.add('kt-timeline-v2__item-cricle');
            let i = document.createElement('i');
            i.setAttribute('class', 'fa fa-genderless kt-font-danger');
            let divItemText = document.createElement('div');
            divItemText.setAttribute('class', 'kt-timeline-v2__item-text kt-padding-top-5');

            let aHtml = [];
            let arrayProfesionalesAsociados = JSON.parse(horaAgendadaBloqueHora.jsonProfesionalesAsociados);
            var IdAtencionHTML = "";
            if (isUnab)
                IdAtencionHTML = `&nbsp; ${horaAgendadaBloqueHora.idAtencion}`;
            if (horaAgendadaBloqueHora.estadoAtencion == "I") {
                if (!primerI) {
                    aHtml.push(`${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Medico/Atencion_Box/${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-brand btn-bold btn-sm">Ir a la Atención</a>${IdAtencionHTML}<br>`);

                    primerI = true;
                } else if (!horaAgendadaBloqueHora.peritaje) {
                    if (isUnab)
                        aHtml.push(`${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Medico/Atencion_Box/${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-brand btn-bold btn-sm">Ir a la Atención</a>${IdAtencionHTML}<br>`);
                    else
                        aHtml.push(`${horaAgendadaBloqueHora.nombrePaciente}`);
                } else {
                    aHtml.push(`${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Medico/Atencion_Box/${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-brand btn-bold btn-sm">Ir a la Atención</a>${IdAtencionHTML}`);

                    primerI = true;
                }

                if (arrayProfesionalesAsociados.length) {
                    aHtml.push(`<p class="small font-weight-bold mb-1">${arrayProfesionalesAsociados.length == 1 ? tituloInvitadosSingular : tituloInvitadosPlural}</p>`);
                    for (const item of arrayProfesionalesAsociados) {
                        aHtml.push(`<p class="small mb-1">${item.Nombre}</p>`);
                    }
                }

                divItemText.innerHTML = aHtml.join('');
            } else if (horaAgendadaBloqueHora.estadoAtencion.includes('T')) {
                if (horaAgendadaBloqueHora.nsp) {
                    if (horaAgendadaBloqueHora.nspPaciente) {
                        aHtml.push(`${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <button type="button" class="btn btn-label-youtube  btn-bold btn-sm " disabled>NSP por Paciente</button>${IdAtencionHTML}`);
                    }
                    else {
                        aHtml.push(`${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Medico/InformeAtencion?idAtencion=${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-youtube  btn-bold btn-sm " >NSP</a>${IdAtencionHTML}`);
                    }
                } else {
                    aHtml.push(`${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Medico/InformeAtencion?idAtencion=${horaAgendadaBloqueHora.idAtencion}&sendInforme=false" type="button" class="btn btn-label-brand btn-bold btn-sm">Ver informe</a>${IdAtencionHTML}`);
                }

                if (arrayProfesionalesAsociados.length) {
                    aHtml.push(`<p class="small font-weight-bold mb-1">${arrayProfesionalesAsociados.length == 1 ? tituloInvitadosSingular : tituloInvitadosPlural}</p>`);
                    for (const item of arrayProfesionalesAsociados) {
                        aHtml.push(`<p class="small mb-1">${item.Nombre}</p>`);
                    }
                }

                divItemText.innerHTML = aHtml.join('');
            } else if (horaAgendadaBloqueHora.estadoAtencion.includes('P')) {
                divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp;- <label class="label text-warning font-weight-bold">Pendiente pago</label>`;
            }

            div.appendChild(divCircle);
            divCircle.appendChild(i);
            div.appendChild(divItemText);
            divTimeline.appendChild(div);
        }
        else {
            let divItemText = document.createElement('div');
            divItemText.setAttribute('class', 'kt-timeline-v2__item-text kt-padding-top-5');
            divItemText.setAttribute('style', 'margin-right :10px !important');
            //divItemText.innerHTML = `&nbsp; &nbsp; &nbsp; ${horaAgendadaBloqueHora.nombrePaciente}`;
            div.appendChild(divItemText);
            divTimeline.appendChild(div);
        }

    });

    const horaActual = moment()
    const resto = parseInt(duracionMin) - horaActual.minute() % parseInt(duracionMin);
    const horaIndicator = moment(horaActual).add(resto, "minutes").format("HH:mm");

    const el = Array.prototype.slice.call(document.querySelectorAll('span.kt-timeline-v2__item-time')).find(function (el) {
        return el.textContent === horaIndicator
    })


    const altura = el.parentElement.getBoundingClientRect().height;
    const divIndicator = document.createElement('div');
    divIndicator.id = 'timeline-indicator';
    divIndicator.setAttribute('style', `top: ${el.parentElement.offsetTop - (altura / 2)}px; z-index: 5;border: 1px solid red;width: 100%;position: absolute;`);
    divTimeline.appendChild(divIndicator);

    document.querySelector('div.kt-scroll').scrollTo({
        top: el.parentElement.offsetTop - 50,
        behavior: 'smooth'
    });

}

async function camposValidos(uid) {
    let profesional = await getDatosProfesional(uid);
    let camposProfesional = {
        nombre: profesional.nombre,
        apellidoPaterno: profesional.apellidoPaterno,
        apellidoMaterno: profesional.apellidoMaterno,
        correo: profesional.correo,
        telefono: profesional.telefono,
        fNacimiento: profesional.fNacimiento,
        zonaHoraria: profesional.zonaHoraria,
        redesSociales: profesional.redesSociales,
        biografia: profesional.infoPersona1
    }
    for (const datos in camposProfesional) {
        if (`${camposProfesional[datos]}`.length == 0 || `${camposProfesional[datos]}` == "null") {
            let title = window.host.includes('prevenciononcologica.') ? '¡Atención! Faltan algunos campos por completar en tu perfil.' : 'Bienvenido a Medismart.live!, Faltan algunos campos por completar en tu perfil';
            console.warn('window.host', window.host);
            Swal.fire({
                title: title,
                text: "¿Completar ahora?",
                type: "question",
                showCancelButton: true,
                cancelButtonColor: 'rgb(190, 190, 190)',
                confirmButtonColor: '#3085d6',
                cancelButtonStyle: 'position:absolute; right:45px',
                reverseButtons: true,
                cancelButtonText: "Más tarde",
                confirmButtonText: "Sí, Completar"
            }).then(async (result) => {
                if (result.value) {
                    window.location = "/Medico/Configuracion";
                }
            });
        }
    }

}

var KTCalendarBasic = function () {

    return {
        //main function to initiate the module
        init: function () {
            var todayDate = moment().startOf('day');
            var TODAY = todayDate.format('YYYY-MM-DD');
            if (duracionMin < 10)
                duracionMin = "0" + duracionMin;
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
                height: 800,
                contentHeight: 780,
                aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio

                nowIndicator: true,
                now: moment().format('YYYY-MM-DDTHH:mm:ss'),

                views: {
                    dayGridMonth: { buttonText: 'Mes' },
                    timeGridWeek: { buttonText: 'Semana' },
                    timeGridDay: { buttonText: 'Dia' }
                },

                defaultView: 'dayGridMonth',
                defaultDate: TODAY,

                businessHours: [ // specify an array instead
                    {
                        daysOfWeek: [1, 2, 3, 4, 5, 6],
                        startTime: '00:00', // 8am
                        endTime: '23:59' // 6pm
                    }
                ],
                slotDuration: "00:" + duracionMin + ":00",
                minTime: "00:00",
                maxTime: "23:59",
                editable: false,
                eventLimit: false, // allow "more" link when too many events
                navLinks: true,
                events: [],

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
                    const calendarData = await getVwHorasMedicosByMedic(uid, fechaQuery, dateType)
                    await cargarCalendar(calendarData, dateType);
                    if (document.querySelector('.fc-now-indicator-line') != null) {
                        document.querySelector('.fc-view-container').scrollTo({
                            top: document.querySelector('.fc-now-indicator-line').offsetTop,
                            behavior: 'smooth'
                        });
                    }
                    document.querySelector(".fc-view-container").setAttribute("style", "overflow: auto;height: 800px;");
                    KTApp.unblock('#kt_calendar');
                },

                eventClick: function (event) {
                    if (event.event.url) {
                        event.jsEvent.preventDefault();
                        window.open(event.event.url, "_self");
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

async function ActualizarCalendarMedico(uid, fecha, horaDesdeText, tipoAccion) {

    const date = calendar.getDate();
    const fechaQuery = moment(date).format('DD/MM/YYYY')
    const calendarData = await getVwHorasMedicosByMedic(uid, fechaQuery, dateType)
    cargarCalendar(calendarData, dateType)
    const timelineData = await getVwHorasMedicosBloquesHorasByMedic(uid, "A")
    cargarTimeline(timelineData)

    var typeMessage = "";
    var title = "";
    if (tipoAccion == "actualizar") {
        typeMessage = "success";
        title = `Tiene una nueva atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`

    }
    else if (tipoAccion == "nspPaciente") {
        typeMessage = "success";
        title = `Abandono de atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`

    }
    else {
        typeMessage = "error";
        title = `Se canceló una atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`;

    }

    Swal.fire({
        position: 'top-end',
        html: "<audio autoplay='autoplay' id='playNotifications2'><source src='/notifications/alertNuevaAtencion.mp3' type='audio/mp3'/></audio>",
        icon: typeMessage,
        type: typeMessage,
        title: title,
        showConfirmButton: false,
        timer: 15000
    })
}

async function EliminarCalendarMedico(uid) {
    const date = calendar.getDate();
    const fechaQuery = moment(date).format('DD/MM/YYYY')
    const calendarData = await getVwHorasMedicosByMedic(uid, fechaQuery, dateType)
    cargarCalendar(calendarData, dateType)
    const timelineData = await getVwHorasMedicosBloquesHorasByMedic(uid)
    cargarTimeline(timelineData)
}

async function indexRealTime(uid) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connection.on('ActualizarCalendarMedico', (fecha, horaDesdeText, tipoAccion) => {
        ActualizarCalendarMedico(uid, fecha, horaDesdeText, tipoAccion);
    });
    connection.on('EliminarCalendarMedico', () => {
        EliminarCalendarMedico(uid);
    });
    try {
        await connection.start();
    } catch (err) {

    }

    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('SubscribeCalendarMedico', uid).catch((err) => {
            return console.error(err.toString());
        });
    }
}

function cambiarIndicadorTimeline() {
    const horaActual = moment()
    const minutos = moment().minute();

    if (minutos === 0 || minutos === 15 || minutos === 30 || minutos === 45) {
        const resto = 15 - minutos % 15
        const horaIndicator = moment(horaActual).add(resto, "minutes").format("HH:mm");

        const el = Array.prototype.slice.call(document.querySelectorAll('span.kt-timeline-v2__item-time')).find(function (el) {
            return el.textContent === horaIndicator
        })
        const altura = el.parentElement.getBoundingClientRect().height

        let divIndicator = document.querySelector('#timeline-indicator');
        if (!divIndicator) {
            let divTimeline = document.getElementById('kt-timeline-v2__items');
            divIndicator = document.createElement('div');
            divIndicator.setAttribute('style', `top: ${el.parentElement.offsetTop - (altura / 2)}px; z-index: 5;border: 1px solid red;width: 100%;position: absolute;`);
            divTimeline.appendChild(divIndicator);
        } else {
            divIndicator.style.top = `${el.parentElement.offsetTop - (altura / 2)}px`
        }
    }
}