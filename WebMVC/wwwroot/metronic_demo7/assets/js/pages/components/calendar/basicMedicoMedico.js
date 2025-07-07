"use strict";

var KTCalendarBasic = function () {

    return {
        //main function to initiate the module
        init: function () {
            var pagina = 'fichaPacienteMedico.html';
            var todayDate = moment().startOf('day');
            var YM = todayDate.format('YYYY-MM');
            var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
            var TODAY = todayDate.format('YYYY-MM-DD');
            var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

            var calendarEl = document.getElementById('kt_calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
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
                now: TODAY + 'T09:25:00', // just for demo

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
                events: [
                    {
                        title: 'Pedro Rivera',
                        start: YM + '-14T13:30:00',
                        //description: 'Hora 10:00',
                        url: pagina,
                        color: '#83caea'
                        //className: "fc-event-info"
                    },
                    {
                        title: 'Gonzalo Mendez',
                        start: TODAY + 'T10:30:00',
                        end: TODAY + 'T10:50:00',
                        url: pagina,
                        color: 'yellow'
                        
                    },
                    {
                        title: 'Pedro Rivera',
                        start: TODAY + 'T11:45:00',
                        end: TODAY + 'T12:00:00',
                        url: pagina,
                        color: '#83caea'
                    },
                    {
                        title: 'Antonia Reyes',
                        start: TODAY + 'T14:30:00',
                        end: TODAY + 'T14:45:00',
                        url: pagina,
                        color: 'silver'
                    }, {
                        title: 'Antonia Reyes',
                        start: YESTERDAY + 'T14:30:00',
                        end: YESTERDAY + 'T14:45:00',
                        url: pagina,
                        color: 'silver'
                    }
                   
                ],
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

jQuery(document).ready(function () {
    KTCalendarBasic.init();
});