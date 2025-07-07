var calendar;

export async function init(data) {
    
    KTCalendarBasic.init();
    cargarCalendar(data.calendarData);
    cargarTimeline(data.timelineData);

 
}

function cargarCalendar(calendarData) {
    let eventos = calendar.getEvents();
    eventos.forEach(evento => evento.remove());
    calendarData.forEach(horaAgendada => {
        let event = {};
        event.title = horaAgendada.nombrePaciente;
        event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
        event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
        event.url = `Medico/FichaPaciente/${horaAgendada.idPaciente}`;
        event.color = '#83caea';
        calendar.addEvent(event);
     
    });
}

function cargarTimeline(timelineData) {
  
    timelineData.forEach(horaAgendadaBloqueHora => {
        let divTimeline = document.getElementById('kt-timeline-v2__items');
        let div = document.createElement('div');
        div.classList.add('kt-timeline-v2__item');
        let span = document.createElement('span');
        span.classList.add('kt-timeline-v2__item-time');
        span.innerHTML = horaAgendadaBloqueHora.horaDesdeText.substring(0, horaAgendadaBloqueHora.horaDesdeText.lastIndexOf(':'));
        div.appendChild(span);
        if (horaAgendadaBloqueHora.idPaciente) {
            let divCircle = document.createElement('div');
            divCircle.classList.add('kt-timeline-v2__item-cricle');
            let i = document.createElement('i');
            i.setAttribute('class', 'fa fa-genderless kt-font-danger');
            let divItemText = document.createElement('div');
            divItemText.setAttribute('class', 'kt-timeline-v2__item-text kt-padding-top-5');
            if (horaAgendadaBloqueHora.estadoAtencion == "I") {
                divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Home/Atencion/${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-brand btn-bold btn-sm">Ir a la Atención</a>`;
            }
            else {
                divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Medico/InformeAtencion?idAtencion=${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-brand btn-bold btn-sm">Ver informe</a>`;
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
            divItemText.innerHTML = `&nbsp; &nbsp; &nbsp; ${horaAgendadaBloqueHora.nombrePaciente}`;
            div.appendChild(divItemText);
            divTimeline.appendChild(div);
        }
    });
}

var KTCalendarBasic = function () {

    return {
        //main function to initiate the module
        init: function () {
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

                editable: true,
                eventLimit: true, // allow "more" link when too many events
                navLinks: true,
                events: [],

                eventClick: function (event) {
                    if (event.event.url) {
                        event.jsEvent.preventDefault();
                        window.open(event.event.url, "_blank");
                    }
                },

                eventRender: function (info) {
                    var element = $(info.el);

                    if (info.event.extendedProps && info.event.extendedProps.description) {
                        if (element.hasClass('fc-day-grid-event')) {
                            element.data('content', info.event.extendedProps.description);
                            element.data('placement', 'top');
                            KTApp.initPopover(element);
                        } else if (element.hasClass('fc-time-grid-event')) {
                            element.find('.fc-title').append('<div class="fc-description" >' + info.event.extendedProps.description + '</div>');
                        } else if (element.find('.fc-list-item-title').lenght !== 0) {
                            element.find('.fc-list-item-title').append('<div class="fc-description">"' + info.event.extendedProps.description + '</div>');
                        }
                    }
                }
            });

            calendar.render();
        }
    };
}();