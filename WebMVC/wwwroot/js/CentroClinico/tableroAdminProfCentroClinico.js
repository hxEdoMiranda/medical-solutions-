import { persona } from '../shared/info-user.js';
import { getResumenConvenio, getConvenios } from '../apis/conveniocentroclinico-fetch.js';
import { getEmpresaCentroClinico } from '../apis/empresacentroclinico-fetch.js';
import { getResumenMedicosPorEspecialidad,
    getResumenEstadoMedicosyGrupos,
    getResumenDetalleMedicosPorEspecialidad,
    getResumenDetalleMedicosPorEspecialidadConvenio    
} from '../apis/vwhorasmedicos-fetch.js';

var calendar;
var dateType = 'month';
var calendarData;
var tipoConsulta;
var fechaQuery;
var date;
var calendarDataConvenio;
export async function init(data) {
    await persona();
    
    let btnProfesional = document.getElementById("btnProfesionales");
    let btnConvenio = document.getElementById("btnConvenios");

    KTCalendarBasic.init();
    date = calendar.getDate();
    fechaQuery = moment(date).format('DD/MM/YYYY');

    btnProfesional.onclick = async () => {
        document.getElementById("Titulo").innerHTML ="Tablero Profesionales";
        tipoConsulta = "profesional";
        calendar.destroy();
        KTCalendarBasic.init();
    }

    btnConvenio.onclick = async () => {
        tipoConsulta = "convenio";
        calendar.destroy();
        KTCalendarBasic.init();
    }

    //Initial Load
    calendarData = await getResumenMedicosPorEspecialidad(fechaQuery, 0);
    await cargarCalendar(calendarData);

   

    //Get summary
    let resumen = await getResumenEstadoMedicosyGrupos();
    document.querySelector('[id="lblProfesionalesActivos"]').textContent = resumen[0].profesionalesActivos;
    document.querySelector('[id="lblProfesionalesInactivos"]').textContent = resumen[0].profesionalesInactivos;

    let resumenConvenios = await getResumenConvenio();
    document.querySelector('[id="lblConveniosActivos"]').textContent = resumenConvenios.activos;
    document.querySelector('[id="lblConveniosInactivos"]').textContent = resumenConvenios.inactivos;



    ////Get getEmpresaCentroClinico
    //let EmpresaCentroClinico = await getEmpresaCentroClinico(30189);
    //document.querySelector('[id="idEmpresa"]').textContent = EmpresaCentroClinico.IdEmpresa;
    //document.querySelector('[id="idPersonaEmpresa"]').textContent = EmpresaCentroClinico.IdPersona;
    //document.querySelector('[id="idCentroClinico"]').textContent = EmpresaCentroClinico.IdCentroClinico;


    let convenios = await getConvenios();
    cargarConvenios(convenios);

    document.getElementById('selectConvenios').onchange = async () => {
        document.getElementById("Titulo").innerHTML = "Tablero Convenios : " + document.getElementById('selectConvenios').options[document.getElementById('selectConvenios').selectedIndex].text;

        let idConvenio = document.getElementById('selectConvenios').value;
        //Get summary by convenio
        calendarDataConvenio = await getResumenMedicosPorEspecialidad(fechaQuery, idConvenio);
        
        tipoConsulta = "convenio";
        calendar.destroy();
        await cargarCalendar(calendarDataConvenio);
        KTCalendarBasic.init();
    };

}

function cargarConvenios(convenios) {
    convenios.forEach(convenio => {
        $("#selectConvenios").append('<option value="' + convenio.id + '">' + convenio.nombre + '</option>');
    });
}

function cargarCalendar(calendarData) {
    calendar.batchRendering(function () {
        let eventos = calendar.getEvents();
        eventos.forEach(evento => evento.remove());

        calendarData.forEach(horaAgendada => {
            var event = {};
            event.title = `${horaAgendada.cantidadHistorial}  ${horaAgendada.especialidad}`;
            event.description = event.title;
            event.start = horaAgendada.fecha;
            event.color = '#dee2e3';
            calendar.addEvent(event);
        });
    });
}

async function OpenModal(date, tipoConsulta) {
    const fechaQuery = moment(date).format('DD/MM/YYYY');
    let resumen;
    var idConvenio = document.getElementById('selectConvenios').value;
    var url = "";
    if (tipoConsulta !== "convenio")
        resumen = await getResumenDetalleMedicosPorEspecialidad(fechaQuery);
    else
        resumen = await getResumenDetalleMedicosPorEspecialidadConvenio(fechaQuery, idConvenio);
    

    let body = '<h5>' + fechaQuery + '</h5>';

    resumen.forEach(datos => {
        if (datos.idBloqueHora === 1)
            body += '<br><h5>' + datos.nombrePaciente + '</h5>'
        else {
            if (tipoConsulta !== "convenio")
                url = "Admin/CrearAgenda?idProfesional=" + datos.idMedico + "";
            else
                url = "Admin/CrearAgendaConvenio?idProfesional=" + datos.idMedico + "&idConvenio=" + idConvenio + "";

            body += ' - ' + datos.nombrePaciente + ' | <a href="' + url + '" target="blank"> ver agenda</a> <br>'
        }
           
    });

    $('#modalBody').html(body);
    $("#kt_modal_3").modal("show");
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
                    right: 'dayGridMonth'
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

                minTime: "00:00",
                maxTime: "23:45",
                editable: false,
                eventLimit: false, // allow "more" link when too many events
                navLinks: true,
                events: [],

                datesRender: async function (info) {
                    KTApp.block('#kt_calendar', {});
                    dateType = 'month';
                    date = calendar.getDate();
                    fechaQuery = moment(date).format('DD/MM/YYYY')
                    var calendarData;
                    
                    if (tipoConsulta != "convenio")
                        calendarData = await getResumenMedicosPorEspecialidad(fechaQuery, 0)
                    else {
                        let idConvenio = document.getElementById('selectConvenios').value;
                        calendarData = await getResumenMedicosPorEspecialidad(fechaQuery, idConvenio);// aqui consulta de convenios
                    }

                    await cargarCalendar(calendarData)
                    KTApp.unblock('#kt_calendar');
                },

                //eventClick: function (event) {
                //    OpenModal();
                //    //if (event.event.url) {
                //    //    event.jsEvent.preventDefault();
                //    //    window.open(event.event.url, "_self");
                //    //}
                //},

                dateClick: function (info) {
                    OpenModal(info.dateStr, tipoConsulta);
                    //if (info.view.type === 'dayGridMonth')
                    //    document.querySelector(`td.fc-day-top[data-date="${info.dateStr}"]`).querySelector('a.fc-day-number').click();
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

                    var title = element.find('.fc-title, .fc-list-item-title');
                    title.html(title.text());

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
