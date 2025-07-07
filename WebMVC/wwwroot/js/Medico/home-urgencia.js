import { persona } from '../shared/info-user.js';
import { getVwHorasMedicosByMedic, getVwHorasMedicosBloquesHorasByMedic } from '../apis/vwhorasmedicos-fetch.js';
import { getDatosProfesional, personByUser } from '../apis/personas-fetch.js';
import { actualizarPreAtencion } from '../apis/pre-atencion-fetch.js';
import { getAtencion, getListSolicitaFirma, medicoFirmante } from '../apis/atencion-fetch.js';

var calendar;
var dateType = 'month';
var connectionIngreso;
var connection;
var duracionMin = 0;
var limitAlerta = 0;
export async function init(data) {

    camposValidos(uid);
    //indexRealTime(uid) se comenta por la intermitencia de real time
    await persona();
    await IngresoBox()
    let duracion = await personByUser(uid)
    if (duracion != null)
        duracionMin = duracion.duracionAtencionMin;
    setInterval(actualizaTimeline, 15000); // c/15segs.
    //KTCalendarBasic.init();
    cargarTimeline(data.timelineData);

    const listaSolicitaFirma = await getListSolicitaFirma(uid);
    cargarSolicitaFirma(listaSolicitaFirma);
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
                    event.title = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}`;
                    event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente} ${horaAgendada.cantidadHistorial > 0 ? "<i style='margin-left:5px;' class='flaticon-interface-3'></i>" : ""}`;
                    event.description = event.title;
                    event.start = `${horaAgendada.fechaText}T${horaAgendada.horaDesdeText}`;
                    event.end = `${horaAgendada.fechaText}T${horaAgendada.horaHastaText}`;
                    if (horaAgendada.idPaciente != 0 && horaAgendada.estadoAtencion == 'I')
                        event.url = `Medico/FichaPaciente/${horaAgendada.idPaciente}`;



                    if (horaAgendada.fechaText < TODAY && horaAgendada.nombrePaciente != "Disponible") {
                        event.color = '#dee2e3';
                    }
                    else if (horaAgendada.idPaciente != 0 && horaAgendada.estadoAtencion == 'P') {
                        event.htmlTitle = `${horaAgendada.horaDesdeText.substring(0, 5)} - ${horaAgendada.nombrePaciente}  -  Pendiente de pago`;
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
                        event.url = `Medico/FichaPaciente/${horaAgendada.idPaciente}`;

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

async function cargarTimeline(timelineData) {
    let primerI = false;
    let divTimeline = document.getElementById('kt-timeline-v2__items');
    while (divTimeline.firstChild) {
        divTimeline.removeChild(divTimeline.firstChild)
    }

    timelineData.forEach(horaAgendadaBloqueHora => {
        let div = document.createElement('div');
        div.classList.add('kt-timeline-v2__item');
        div.classList.add('lista-item');
        if (horaAgendadaBloqueHora.idPaciente) {
            let divCircle = document.createElement('div');
            divCircle.classList.add('kt-timeline-v2__item-cricle');
            divCircle.setAttribute('style','left:1.12rem !important')
            let i = document.createElement('i');
            i.setAttribute('class', 'fa fa-plus-circle kt-font-danger');
            let divItemText = document.createElement('div');
            divItemText.setAttribute('class', 'kt-timeline-v2__item-text kt-padding-top-5');
            divItemText.setAttribute('style','padding:1px 0 0 2rem !important')

            const textoAtencionTelefonica = horaAgendadaBloqueHora.idSesionPlataformaExterna?.toUpperCase().includes("VONAGE") ? "<p><em>Atención telefónica</em></p>" : "";
            if (horaAgendadaBloqueHora.estadoAtencion == "I") {
                if (!primerI) {
                    divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <button data-id="${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-brand btn-bold btn-sm box">Ir a la Atención</button>${textoAtencionTelefonica}`;
                    primerI = true;
                } else {
                    divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente}${textoAtencionTelefonica}`;
                }
            }
            else if (horaAgendadaBloqueHora.estadoAtencion.includes('T')) {
                if (horaAgendadaBloqueHora.nsp) {
                    if (horaAgendadaBloqueHora.nspPaciente) {
                        divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <button type="button" class="btn btn-label-youtube  btn-bold btn-sm " disabled>NSP por Paciente</button>${textoAtencionTelefonica}`;
                    }
                    else {
                        divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <button type="button" class="btn btn-label-youtube  btn-bold btn-sm " disabled>NSP</button>${textoAtencionTelefonica}`;
                    }
                }
                else
                    divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <a href="/Medico/InformeAtencion?idAtencion=${horaAgendadaBloqueHora.idAtencion}" type="button" class="btn btn-label-brand btn-bold btn-sm">Ver informe</a>${textoAtencionTelefonica}`;
            }
            else if (horaAgendadaBloqueHora.estadoAtencion.includes('P')) {
                divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp;- <label class="label text-warning font-weight-bold">Pendiente pago</label>${textoAtencionTelefonica}`;
            }

            div.appendChild(divCircle);
            divCircle.appendChild(i);
            div.appendChild(divItemText);
            divTimeline.appendChild(div);
        }
        else {
            let divItemText = document.createElement('div');
            divItemText.setAttribute('class', 'kt-timeline-v2__item-text kt-padding-top-5');
            divItemText.setAttribute('style', 'margin-right :10px !important; padding:1px 0 0 2rem !important');
            divItemText.innerHTML = `&nbsp; &nbsp; &nbsp; ${horaAgendadaBloqueHora.nombrePaciente}`;
            div.appendChild(divItemText);
            divTimeline.appendChild(div);
        }

        document.querySelectorAll('.box').forEach(irBox => {
            irBox.onclick = async () => {
                var data = irBox.getAttribute('data-id');
              
                let atencion = await getAtencion(data);
                if (!atencion.nspPaciente ) {
                    var url = `/Medico/Atencion_Box/${data}`;
                    
                    if (connectionIngreso.state === signalR.HubConnectionState.Connected) {
                        connectionIngreso.invoke('SubscribeAtencionUrgencia', parseInt(data)).then(r => {
                            connectionIngreso.invoke("IniciarAtencion", parseInt(data)).then(r => {
                                connectionIngreso.invoke('UnsubscribeAtencionUrgencia', parseInt(data)).catch(err => console.error(err));
                            }).catch(err => console.error(err));
                        }).catch((err) => {
                            return console.error(err.toString());
                        });
                    }
                    location.href = url;
                }
                else {
                    actualizaTimeline();
                    Swal.fire("","El paciente ha abandonado la atención","warning")
                }
            }
        })
    });

    $(".kt-scroll").animate({ scrollTop: 200000 }, "slow");
}

async function cargarSolicitaFirma(listSolicitanFirma) {
    let primerI = false;
    let divTimeline = document.getElementById('kt-timeline-v3__items');
    while (divTimeline.firstChild) {
        divTimeline.removeChild(divTimeline.firstChild)
    }

    listSolicitanFirma.forEach(horaAgendadaBloqueHora => {
        let div = document.createElement('div');
        div.classList.add('kt-timeline-v2__item');
        if (horaAgendadaBloqueHora.idPaciente) {
            let divCircle = document.createElement('div');
            divCircle.classList.add('kt-timeline-v2__item-cricle');
            divCircle.setAttribute('style', 'left:1.12rem !important')
            let i = document.createElement('i');
            i.setAttribute('class', 'fa fa-plus-circle kt-font-danger');
            let divItemText = document.createElement('div');
            divItemText.setAttribute('class', 'kt-timeline-v2__item-text kt-padding-top-5');
            divItemText.setAttribute('style', 'padding:1px 0 0 2rem !important')

            
            if (horaAgendadaBloqueHora.solicitaFirma && horaAgendadaBloqueHora.idMedico != uid && horaAgendadaBloqueHora.estado == "I") {
                    divItemText.innerHTML = `${horaAgendadaBloqueHora.nombrePaciente} &nbsp; <button data-id="${horaAgendadaBloqueHora.id}" type="button" class="btn btn-label-brand btn-bold btn-sm firmar">Ir a firmar</button>`;
                div.appendChild(divCircle);
                divCircle.appendChild(i);
                div.appendChild(divItemText);
                divTimeline.appendChild(div);
            }
           
        }
   

        document.querySelectorAll('.firmar').forEach(firma => {
            firma.onclick = async () => {
                ;
                var data = firma.getAttribute('data-id');
                let atencion = await getAtencion(data);
                if ((atencion.idMedicoFirmante == null && atencion.solicitaFirma) || atencion.idMedicoFirmante == uid) {
                    let firmar = await medicoFirmante(data, uid);
                    if (firmar.status === "OK") {
                        var url = `/Medico/Atencion_Box/${data}`;
                        location.href = url;
                    }
                    else {
                        Swal.fire("", "ocurrió un error, intenta más tarde", "warning")
                    }
                }
                else {
                    actualizaTimeline();
                    Swal.fire("", "ya ingresó un médico a firmar", "warning")
                }
            }
        })
    });

    $(".kt-scroll").animate({ scrollTop: 200000 }, "slow");
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
            Swal.fire({
                title: "Bienvenido a Medismart.live!, Faltan algunos campos por completar en tu perfil",
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
            //if (duracionMin < 10)
            //    duracionMin = "0" + duracionMin;
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
                slotDuration: "00:02:00",
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

async function actualizaTimeline() {
    
    var elementosAntes = document.querySelectorAll(".lista-item").length;
    const timelineData = await getVwHorasMedicosBloquesHorasByMedic(uid, "U");
    var atencionActivas = timelineData.filter(x => x.estadoAtencion == "I");
    const listaSolicitaFirma = await getListSolicitaFirma(uid);
    cargarSolicitaFirma(listaSolicitaFirma);

    cargarTimeline(timelineData);
    

    var elementosDespues = document.querySelectorAll(".lista-item").length;
    var tipo = "";
    var typeMessage = "";
    var title = "";
    var timerModal = 15000;

    if (atencionActivas && atencionActivas.length > 0 && limitAlerta < 2 && !(elementosDespues > elementosAntes)) {
        tipo = "Activa";
        typeMessage = "success";
        title = `Tiene una  atención vigente, favor revisar su timeline`;
        limitAlerta++;
        timerModal = 8000;
    }
    if (elementosDespues > elementosAntes) {
        tipo = "actualizar";
        typeMessage = "success";
        title = `Tiene una nueva atención, favor revisar su timeline`;
        limitAlerta = 0;
    }
    else if (elementosDespues < elementosAntes) {
        tipo = "eliminar";
        typeMessage = "success";
        title = `Se reasignó una atención`;
        limitAlerta = 0;
    }

    if (tipo != "") {
        Swal.fire({
            onOpen: function () {
                var zippi = new Audio('/notifications/alertNuevaAtencion.mp3')
                zippi.play();
            },
            position: 'top-end',
            icon: typeMessage,
            type: typeMessage,
            title: title,
            showConfirmButton: false,
            timer: timerModal,
            backdrop: false
        })
    }
   

}

async function ActualizarCalendarMedico(uid, fecha, horaDesdeText, tipoAccion) {
    const timelineData = await getVwHorasMedicosBloquesHorasByMedic(uid, "U");
    cargarTimeline(timelineData)

    var typeMessage = "";
    var title = "";
    if (tipoAccion == "actualizar") {
        typeMessage = "success";
        title = `Tiene una nueva atención, favor revisar tu timeline`;

    }
    else if(tipoAccion == "nspPaciente") {
        typeMessage = "success";
        title = `Abandono de atención, favor revisar tu timeline`

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


//async function agendarRealTime() {

//    connection = new signalR.HubConnectionBuilder()
//        .withUrl(`${baseUrl}/calendarmedicohub`)
//        .configureLogging(signalR.LogLevel.None)
//        .withAutomaticReconnect()
//        .build();

//    try {
//        await connection.start();
//    } catch (err) {
//        
//    }


//}

async function IngresoBox() {
    connectionIngreso = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingreso-sala-hub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionIngreso.start();
    } catch (err) {
        
    }
}

