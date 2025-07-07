import { personaAgenda } from "../shared/info-user.js";
import {
  getVwHorasMedicosByMedic,
  getVwHorasMedicosBloquesHorasByMedic,
  generarHorasMedico,
  eliminaHoraMedico,
  enviarAgendaMedico
} from "../apis/vwhorasmedicos-fetch.js";

var calendar;
var dateType = "month";
var duracionAtencionProfesionalId = 0;
var duracionAtencionProfesionalMin = 0;
var idProfesional = 0;
export async function init(data) {
  await personaAgenda();
  duracionAtencionProfesionalId = document.getElementById(
    "duracionAtencionProfesionalId"
  ).value;
  duracionAtencionProfesionalMin = document.getElementById(
    "duracionAtencionProfesionalMin"
  ).value;
  idProfesional = document.getElementById("idProfesionalHidden").value;
  KTCalendarBasic.init();


  document.getElementById('btnEnviarAgenda').addEventListener('click', async ()=>{
    var correoProfesional = duracionAtencionProfesionalId = document.getElementById(
        "correoProfesional"
      ).value;

      var nombreProfesional = duracionAtencionProfesionalId = document.getElementById(
        "nombreProfesional"
      ).value;
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
          event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${
            horaAgendada.nombrePaciente
          }`;
          event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${
            horaAgendada.nombrePaciente
          }`+ "<i style='margin-left:5px;' class='fa fa-trash pull-right'></i>";
          event.description = event.title;
          event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
          event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
          event.clic = false;

         
          event.IdDuracionAtencion = horaAgendada.IdDuracionAtencion;
          event.DuracionAtencion = horaAgendada.DuracionAtencion;
          event.FechaText = horaAgendada.FechaText;
          event.nombrePaciente = horaAgendada.nombrePaciente;
          event.horaDesdeText = horaAgendada.horaDesdeText;
          event.horaHastaText = horaAgendada.horaHastaText;

          event.IdMedicoHora = horaAgendada.idMedicoHora ?? 0;
          event.IdBloqueHora = horaAgendada.idBloqueHora ?? 0;
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
          switch (info.view.type) {
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
        },
        selectAllow: function (selectInfo) {
          return moment().diff(selectInfo.start) <= 0;
        },
        eventClick: async function (calEvent, jsEvent, view) {
          if (calEvent.view.type === "timeGridDay") {
             
            var dateObj = new Date(calEvent.event.extendedProps.Fecha.replace('T00:00:00','T'+calEvent.event.extendedProps.horaDesdeText));
            var momentObj = moment(dateObj);
            var clic = false;
            if (momentObj >= moment()) {
              clic = true;
            }


            
            if (clic === true) {
              var IdMedicoHora = calEvent.event.extendedProps.IdMedicoHora;
              var formData = new FormData();
              formData.append("IdMedicoHora", IdMedicoHora);


              if (calEvent.event.extendedProps.nombrePaciente == "Disponible") {
                  await eliminaHoraMedico(formData);
                    KTApp.block("#kt_calendar", {});
                    switch (calEvent.view.type) {
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
                        ///
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
                          Swal.fire(
                              'En construcción',
                              'Función no disponible aún.',
                              'warning'
                          );
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
        },
        select: async function (info) {
          if (!info.allDay) {
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



            KTApp.block("#kt_calendar", {});
            switch (info.view.type) {
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

            //$('#kt_calendar').fullCalendar( 'refetchEvents' );
            // alert('selected ' + info.startStr + ' to ' + info.endStr);
          } else {
            //alert('No puede crear horas en mas de un día');
          }
        },
        dayRender: function (info) {},
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

function createButton(text, cb) {
    return $('<button>' + text + '</button>').on('click', cb);
}
