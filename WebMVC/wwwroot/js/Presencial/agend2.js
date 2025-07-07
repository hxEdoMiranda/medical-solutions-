import { getCalendar, confirmaPaciente } from '../apis/agenda-presencial.js';
import { personaFotoPerfil } from "../shared/info-user.js";
import { personByUser } from '../apis/personas-fetch.js';

var fechaProxima = moment(fechaPrimeraHora)._i;
var liHoraMedico;
var seleccion = false;
let lostSlot = false;
var spanSelectorHorasL;
var spanSelectorHorasR;
var disabledDays = []; 
let spanHoraTop = document.createElement('span');
let tiempoDuracion = 0;
let buttonInside;
let dataConfirmacion = {
    patient: {
        identifier: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        birth_date: ""
    },
    specialty: "",
    service: "",
    slots: []
}

function cleanString(input) {
    var output = "";
    output = input.replace("&#xE1;", "á").replace("&#xE9;", "é")
        .replace("&#xED;", "í").replace("&#xF3;", "ó")
        .replace("&#xFA;", "ú").replace("&#xC1;", "Á")
        .replace("&#xC9;", "É").replace("&#xCD;", "Í")
        .replace("&#xD3;", "Ó").replace("&#xDA;", "Ú")
        .replace("&#xF1;", "ñ").replace("&#xD1;", "Ñ")
    return output;
}


var slotHoras = await getCalendar(cleanString(m), r, cleanString(idMedico));
var datosPaciente = await personByUser(uid);
totalSlots = slotHoras[0] == null ? 0 : slotHoras[0].ranurasNecesarias;
dataConfirmacion.patient.identifier = datosPaciente.identificador;
dataConfirmacion.patient.first_name = datosPaciente.nombre;
dataConfirmacion.patient.last_name = datosPaciente.apellidoPaterno;
dataConfirmacion.patient.phone = datosPaciente.telefono === true ? datosPaciente.telefono : datosPaciente.telefonoMovil;
dataConfirmacion.patient.email = datosPaciente.correo;
dataConfirmacion.patient.birth_date = moment(datosPaciente.fNacimiento).format("YYYY-MM-DD");
dataConfirmacion.specialty = r;
dataConfirmacion.service = cleanString(tipoServicio);
document.getElementById('listaHoras').innerHTML = "";
let unique = [...new Set(slotHoras[0]?.horasDisponibles?.map(({ inicio }) => moment(inicio).format("DD-MM-YYYY")))];
let uniqueHours = [...new Set(slotHoras[0]?.horasDisponibles?.map(({ inicio }) => moment(inicio).format("DD-MM-YYYYTHH:mm")))];
let uniqueHoursStart = [...new Set(slotHoras[0]?.horasDisponibles?.map(({ inicio }) => moment(inicio).startOf('hour').format("YYYY-MM-DDTHH:mm")))];

let uniqueHoursStartSelect = [];
let uniqueHoursRange = [];
uniqueHoursStart.forEach((date) => moment(date).format("YYYY-MM-DD") === moment(fechaProxima, "DD-MM-YYYY").format("YYYY-MM-DD") ? uniqueHoursStartSelect.push(moment(date).format("YYYY-MM-DDTHH:mm")) : null);

let indexUniqueS = 0;

cargarInfoMedico();
await cargaTituloHorario();


async function cargaSlots() {
    tiempoDuracion = slotHoras[0]?.horasDisponibles[0]?.duration;
    uniqueHoursRange = [];
    
    slotHoras[0]?.horasDisponibles?.forEach(({inicio, termino, slot, tipoServicio }, index) => {
        if (moment(fechaProxima, "DD-MM-YYYY").format("YYYY-MM-DD") === moment(inicio).format("YYYY-MM-DD")) {
            uniqueHoursRange.push({ id: slot, hora: moment(inicio).format("HH:mm") });
            if (moment(inicio).startOf('hour').format("YYYY-MM-DDTHH:mm") === uniqueHoursStartSelect[indexUniqueS]) {
                inicio = moment(inicio).format("HH:mm");
                liHoraMedico = document.createElement('li');
                liHoraMedico.classList.add('hora');
                liHoraMedico.classList.add('disponible');
                liHoraMedico.setAttribute('data-idMedico', slotHoras[0].rutDoctor);
                liHoraMedico.setAttribute('data-idBloqueHora', slot);
                liHoraMedico.setAttribute('data-estado', "Disponible");
                liHoraMedico.setAttribute('data-horaText', inicio);
                let spanHoraMedico = document.createElement('span');
                spanHoraMedico.classList.add('detalle-hora');

                //spanHoraTop.innerHTML = moment(uniqueHoursStartSelect[indexUniqueS], "DD-MM-YYYYTHH:mm").format("HH:mm"); 
                spanHoraMedico.innerHTML = inicio;
                liHoraMedico.appendChild(spanHoraMedico);

                let spanEstado = document.createElement('span');
                spanEstado.classList.add('estado-hora');

                let smallEstado = document.createElement('small');
                smallEstado.classList.add('estado-hora');
                smallEstado.innerHTML = "Disponible";
                spanEstado.appendChild(smallEstado);
                liHoraMedico.appendChild(spanEstado);
                document.getElementById('listaHoras').appendChild(liHoraMedico);

                liHoraMedico.addEventListener("click", async function (e) {
                    await cargaTituloHorario();
                    seleccion = true;
                    document.querySelectorAll('.article-title')
                    var targetElement = event.target || event.srcElement;
                    var liHora = targetElement.closest('.hora');
                    var estado = liHora.getAttribute('data-estado');
                    if (estado === "Disponible") {


                        document.querySelectorAll('.seleccionado').forEach(function (li) {
                            li.classList.remove('seleccionado');
                            li.classList.add('disponible');
                        });

                        document.querySelectorAll('.estado-hora > small').forEach(function (small) {
                            small.innerHTML = "Disponible";
                        });
                        liHora.classList.remove("disponible");
                        liHora.classList.add('seleccionado');
                        liHora.querySelectorAll('.estado-hora > small').forEach(function (small) {
                            small.innerHTML = "Seleccionado";
                        });
                        
                     

                    } else {
                        Swal.fire("", "Horario no disponible", "warning");
                    }

                });
            }
        }
    });
    validarUniqueHoursRange();
}
cargaSlots()
await personaFotoPerfil()

function validarUniqueHoursRange() {
    if (uniqueHoursRange.length < totalSlots) {
        Swal.fire("", "No es posible agendar el servicio en este dia, se requiere " + totalSlots + " agendas.", "warning");
    }
}

function addSlotsHours(idSlots) {
    let needSlots = false;
    uniqueHoursRange.forEach(({ id, hora }, index) => {
        
        if (idSlots === id) {
            needSlots = true;
        }

        if (needSlots && index < (uniqueHoursRange.length) - 1 && dataConfirmacion.slots.length < totalSlots) {
            let start = moment(hora, "HH:mm")
            let end = moment(uniqueHoursRange[index + 1].hora, "HH:mm")
            const minutesDiff = end.diff(start, "minutes");
            if (minutesDiff === tiempoDuracion) { dataConfirmacion.slots.push(uniqueHoursRange[index + 1].id) }
            else { Swal.fire("", "No es posible agendar el servicio en la hora seleccionada, se requiere " + totalSlots + " agendas consecutivas.", "warning"); lostSlot = true; }
        }
 
    })

    
    enviarReserva();
}

function pintarCalendar() {
    disabledDays = [];

    document.querySelectorAll('.day:not(.disabled)').forEach(item => {
        let valorDate = item.getAttribute("data-date");
        let valorDateISO = moment.unix(valorDate / 1000).toISOString();
        unique.forEach((object) => object === moment(valorDateISO).add(1, "days").format("DD-MM-YYYY") ? item.setAttribute("style", "background:#3BC1CD;") : disabledDays.push(moment(valorDateISO).add(1, "days").format("DD-MM-YYYY")));
    })

    var uniqueDis = [...new Set(disabledDays.map((inicio) => inicio))];

    var intersection = uniqueDis.filter(function (e) {
        return unique.indexOf(e) > -1;
    });

    var result = uniqueDis.filter(function (item) {
        return intersection.indexOf(item) === -1;
    });

    document.querySelectorAll('.day:not(.disabled)').forEach(item => {
        let valorDate = item.getAttribute("data-date");
        let valorDateISO = moment.unix(valorDate / 1000).toISOString();
        result.forEach((object) => object === moment(valorDateISO).add(1, "days").format("DD-MM-YYYY") ? item.classList.add("disabled") : null);
    })
}

export async function init(dataMedico) {

    //await cargarInfoMedico(dataMedico);


    $("#kt_datepicker_agenda2").datepicker({

        weekStart: 1,
        language: 'es',
        todayHighlight: true,
        startDate: fechaProxima,
        endDate: unique[unique.length - 1],
        //beforeShowDay: function (date) {
        //    var hilightedDays = [1, 3, 8, 20, 21, 16, 26, 30];
        //    if (hilightedDays.indexOf(date.getDate())) {
        //        return { classes: 'highlight', tooltip: 'Title' };
        //    }
        //}
    });

    $('#kt_datepicker_agenda2').datepicker('setDate', fechaProxima).datepicker('fill');

    pintarCalendar();

    $('#btnManana').on('click', async function (ev) {
        fechaProxima = $("#kt_datepicker_agenda2").data('datepicker').getDate();
        indexUniqueS = 0;
        uniqueHours = [];
        uniqueHoursStartSelect = [];
        uniqueHoursStart.forEach((date) => moment(date).format("YYYY-MM-DD") === moment(fechaProxima, "DD-MM-YYYY").format("YYYY-MM-DD") ? uniqueHoursStartSelect.push(moment(date).format("YYYY-MM-DDTHH:mm")) : null);
        await cargaTituloHorario();
        document.getElementById('listaHoras').innerHTML = "";
        await cargaSlots();
    });

    $('#btnTarde').on('click', async function (ev) {
        fechaProxima = $("#kt_datepicker_agenda2").data('datepicker').getDate();
       
        uniqueHours = [];
        uniqueHoursStartSelect = [];
        uniqueHoursStart.forEach((date) => moment(date).format("YYYY-MM-DD") === moment(fechaProxima, "DD-MM-YYYY").format("YYYY-MM-DD") ? uniqueHoursStartSelect.push(moment(date).format("YYYY-MM-DDTHH:mm")) : null);
        indexUniqueS = uniqueHoursStartSelect.length-1;

        await cargaTituloHorario();
        document.getElementById('listaHoras').innerHTML = "";
        await cargaSlots();
    });

    $('#kt_datepicker_agenda2').datepicker().on('changeDate', async function (ev) {
        await pintarCalendar();
        fechaProxima = $("#kt_datepicker_agenda2").data('datepicker').getDate();
        $('#listaHoras').empty();
        uniqueHours = [];
        uniqueHoursStartSelect = [];
        uniqueHoursStart.forEach((date) => moment(date).format("YYYY-MM-DD") === moment(fechaProxima, "DD-MM-YYYY").format("YYYY-MM-DD") ? uniqueHoursStartSelect.push(moment(date).format("YYYY-MM-DDTHH:mm")) : null);
        
        await cargaTituloHorario();
        cargaSlots();
        seleccion = true;
    });
}

async function cargarInfoMedico(medico) {
    
    document.getElementById("divPerfilProfesional").innerHTML = "";

    let divPerfilProfesional = document.createElement('div');
    divPerfilProfesional.classList.add('perfil-profesional');
    //Header Perfil
    let divHeaderPerfil = document.createElement('div');
    divHeaderPerfil.classList.add('header-perfil');

    let divFotoProfesional = document.createElement('img');
    divFotoProfesional.classList.add('foto-profesional');
    if (generoMed === 'male')
        divFotoProfesional.src = baseUrlWeb + '/upload/foto_perfil/noPerfilProfesional/ManAvatar.svg';
    else
        divFotoProfesional.src = baseUrlWeb + '/upload/foto_perfil/noPerfilProfesional/WomanAvatar.svg';
    divHeaderPerfil.appendChild(divFotoProfesional);

    let divDataPerfil = document.createElement('div');
    divDataPerfil.classList.add('data');
    let spanNombreProfesional = document.createElement('span');
    spanNombreProfesional.classList.add('nombre-profesional');
    let labelNombreProfesional = document.createElement('span');
    labelNombreProfesional.innerHTML = idMedico;

    spanNombreProfesional.appendChild(labelNombreProfesional);


    let labelInstitucionProfesional = document.createElement('small');
    labelInstitucionProfesional.classList.add('d-block');
    //labelInstitucionProfesional.innerHTML = `123`;
    labelNombreProfesional.appendChild(labelInstitucionProfesional);


    divDataPerfil.appendChild(spanNombreProfesional);

    let spanTituloProfesional = document.createElement('span');
    spanTituloProfesional.classList.add('titulo-profesional');
    spanTituloProfesional.innerHTML = titulo;


    divDataPerfil.appendChild(spanTituloProfesional);


    divHeaderPerfil.appendChild(divDataPerfil);

    divPerfilProfesional.appendChild(divHeaderPerfil);
    //Fin Header Perfil

    //Body Profesional
    let divBodyProfesional = document.createElement('div');
    divBodyProfesional.classList.add('body-profesional');

    let parrafoInfo = document.createElement('p');
    divBodyProfesional.appendChild(parrafoInfo);


    divPerfilProfesional.appendChild(divBodyProfesional);
    //Fin Body Profesional
 
    //Check Aceptacion
    let contCheckAceptacion = document.createElement('div');
    contCheckAceptacion.classList.add('check-aceptacion');

    let checkAceptacion = document.createElement('input');
    checkAceptacion.type = 'checkbox';
    checkAceptacion.id = 'aceptaTerminos';
    checkAceptacion.name = 'aceptaTerminos';
    checkAceptacion.classList.add('form-check-label');

    let labelCheckAceptacion = document.createElement('label');
    labelCheckAceptacion.htmlFor = 'aceptaTerminos';
    labelCheckAceptacion.classList.add('fuente-accesible');

    // Elements inside label
    labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/Terminosycondiciones/TERMINOSYCONDICIONES.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a> 
        <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block">términos y condiciones</a> en el servicio de consultas Tele-medica de ${textoMarca}. 
        Declaro haber leído y aceptado a mi entera conformidad.
        <br /> <strong>AVISO:</strong>
        El servicio de consulta Tele-medica online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
        <br>
        Conoce tus
        <a href="https://medical.medismart.live/}DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
        <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block">derechos y deberes</a>         
        para la consulta Tele-medica.
        `;

    //Check Aceptacion invitado
    let contCheckAceptacionInvitado = document.createElement('div');
    contCheckAceptacionInvitado.classList.add('check-aceptacion');
    contCheckAceptacionInvitado.setAttribute('id', 'spanAsociados');
    contCheckAceptacionInvitado.hidden = true;
    let checkAceptacionInvitado = document.createElement('input');
    checkAceptacionInvitado.type = 'checkbox';
    checkAceptacionInvitado.id = 'aceptaTerminosInvitado';
    checkAceptacionInvitado.name = 'aceptaTerminosInvitado';
    checkAceptacionInvitado.checked = true;
    checkAceptacionInvitado.classList.add('form-check-label');

    let labelCheckAceptacionInvitado = document.createElement('label');
    labelCheckAceptacionInvitado.htmlFor = 'aceptaTerminosInvitado';
    labelCheckAceptacionInvitado.setAttribute('style', 'margin-top: -15px;')

    // Elements inside label
    labelCheckAceptacionInvitado.innerHTML = `Acepto que esta atención es de carácter docente-asistencial pudiendo existir la posibilidad de ser atendido/a por el profesional, acompañado por estudiantes del área de la salud.`;
    contCheckAceptacion.appendChild(checkAceptacion);
    contCheckAceptacion.appendChild(labelCheckAceptacion);
    contCheckAceptacionInvitado.appendChild(checkAceptacionInvitado);
    contCheckAceptacionInvitado.appendChild(labelCheckAceptacionInvitado);
    divPerfilProfesional.appendChild(contCheckAceptacion);
    divPerfilProfesional.appendChild(contCheckAceptacionInvitado);
    //Fin Check Aceptacion


    //Boton Aceptar y Cancelar
    let divBotones = document.createElement('div');
    divBotones.classList.add('row');
    divBotones.classList.add('mt-4');

    // Columnas contenedoras de botones
    let divCol = document.createElement('div');
    divCol.classList.add('col');

    let divCol1 = document.createElement('div');
    divCol.classList.add('col');

    let buttonInside1 = document.createElement('a');
    buttonInside1.setAttribute('class', 'btn btn-outline-secondary btn-block btn-sm');
    buttonInside1.innerHTML = "Volver";
    buttonInside1.href = "Agendar";

    buttonInside = document.createElement('button');
    buttonInside.setAttribute('class', 'btn btn-primary btn-block btn-sm');
    buttonInside.innerHTML = "Aceptar";

    // Funcion boton cancelar

    // Funcion boton aceptar
    buttonInside.addEventListener("click", async function () {
        if (!document.getElementById('aceptaTerminos').checked) {
            Swal.fire(
                '',
                'Debes aceptar los términos y condiciones.',
                'warning'
            );
            return;
        } 

        //if (document.getElementById('aceptaTerminos').checked && document.getElementById('aceptaConcentimiento').checked) {
        if (!seleccion) {
            Swal.fire("", "Debe seleccionar una hora", "warning"); 
        } else {

                document.querySelectorAll('li.seleccionado').forEach(function (li) {
                    dataConfirmacion.slots = [];
                    lostSlot = false;
                    var idBloqueHora = li.getAttribute('data-idBloqueHora');
                    dataConfirmacion.slots.push(idBloqueHora);
                    addSlotsHours(idBloqueHora);
                });      
        }
    });

    // Contenedor botón Volver

    const contBtnVolver = document.getElementById('contVolver');


    divBotones.appendChild(divCol1);
    divBotones.appendChild(divCol);
    // divCol1.appendChild(buttonInside1);
    contBtnVolver.appendChild(buttonInside1);
    divCol.appendChild(buttonInside);
    divPerfilProfesional.appendChild(divBotones);
    document.getElementById("divPerfilProfesional").appendChild(divPerfilProfesional);
    document.getElementById("divPerfilProfesional").style.display = "block";

}

async function enviarReserva() {
    if (!lostSlot) {
        let conf = await confirmaPaciente(dataConfirmacion);
       

        if (conf.start === "0001-01-01T00:00:00" || conf.id === null) {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente seleccionar en un horario, dia o profesional distinto.<br/><b>" + conf.errorSnab, "error");
        } else {
            var url = "/Presencial/ConfirmarAtencion" + "?idMedicoHora=" + dataConfirmacion.slots[0] + "&idMedico=" + slotHoras[0].nombreDoctor + "&idBloqueHora=" + dataConfirmacion.slots[0] + "&lugar=" + cleanString(lugar) + "&fechaSeleccion=" + fechaProxima + "&hora=" + fechaProxima + "&horario=" + fechaProxima + "&idAtencion=" + dataConfirmacion.slots[0] + "&m=" + m + "&r=" + r + "&c=" + titulo;
            window.location.href = url;
            document.getElementById('aceptaTerminos').checked = false;
            seleccion = false;
        }
    }
}
async function cargaTituloHorario() {
    
    if (uniqueHoursStartSelect[indexUniqueS] !== undefined) {
        spanHoraTop.innerHTML = moment(uniqueHoursStartSelect[indexUniqueS], "DD-MM-YYYYTHH:mm").format("HH:mm");

        var ar = [];
        uniqueHours = [...new Set(slotHoras[0]?.horasDisponibles?.map(({ inicio }) => moment(inicio).format("DD-MM-YYYYTHH:mm")))];

        if (uniqueHours?.length > 0) {
            uniqueHours.forEach((uniqueHour) => moment(uniqueHour, "DD-MM-YYYYTHH:mm").format("DD-MM-YYYY") === moment(fechaProxima, "DD-MM-YYYY").format("DD-MM-YYYY") ? ar.push(uniqueHour) : null);
            document.getElementById("headerSeleccion").innerHTML = "";

            let divDataHorario = document.createElement('div');
            divDataHorario.classList.add('data-horario');


            let spanTituloDataHorario = document.createElement('div');
            spanTituloDataHorario.classList.add('titulo-data-horario', 'fuente-accesible');
            spanTituloDataHorario.innerHTML = "Agenda"

            let rangoHorario = document.createElement('div');
            rangoHorario.classList.add('rango-horario');


            rangoHorario.innerHTML = `De ${moment(ar[0], "DD-MM-YYYYTHH:mm").format("HH:mm")} Hrs. a ${moment(ar[ar.length - 1], "DD-MM-YYYYTHH:mm").format("HH:mm")} hrs.`


            divDataHorario.appendChild(spanTituloDataHorario);
            spanTituloDataHorario.appendChild(rangoHorario);


            let divHorario = document.createElement('div');
            divHorario.classList.add('horario');

            spanSelectorHorasL = document.createElement('span');
            spanSelectorHorasL.classList.add('selector-horas');
            spanSelectorHorasL.classList.add('mr-2');

            let spanIconoL = document.createElement('i');
            spanIconoL.classList.add('fas');
            spanIconoL.classList.add('fa-chevron-circle-left');
            spanSelectorHorasL.appendChild(spanIconoL);
            spanSelectorHorasL.addEventListener("click", async function () {

                if (indexUniqueS <= 0) {

                    indexUniqueS = 0;
                } else {
                    indexUniqueS = indexUniqueS - 1;
                }

                await cargaTituloHorario();


                document.getElementById('listaHoras').innerHTML = "";


                await cargaSlots();
            });

            divHorario.appendChild(spanSelectorHorasL);
            spanHoraTop = document.createElement('span');
            spanHoraTop.classList.add('hora-top');
            spanHoraTop.setAttribute("id", "spanHoraTop");
            spanHoraTop.innerHTML = moment(uniqueHoursStartSelect[indexUniqueS], "DD-MM-YYYYTHH:mm").format("HH:mm");
            divHorario.appendChild(spanHoraTop);
            spanSelectorHorasR = document.createElement('span');
            spanSelectorHorasR.classList.add('selector-horas');

            let spanIcono = document.createElement('i');
            spanIcono.classList.add('fas');
            spanIcono.classList.add('fa-chevron-circle-right');
            spanSelectorHorasR.appendChild(spanIcono);

            spanSelectorHorasR.addEventListener("click", async function () {
                if (indexUniqueS >= uniqueHoursStartSelect.length - 1) {

                    indexUniqueS = uniqueHoursStartSelect.length - 1;
                } else {
                    indexUniqueS = indexUniqueS + 1;
                }
                await cargaTituloHorario();
                document.getElementById('listaHoras').innerHTML = "";
                await cargaSlots();
            });

            divHorario.appendChild(spanSelectorHorasR);

            document.getElementById("headerSeleccion").appendChild(divDataHorario);
            document.getElementById("headerSeleccion").appendChild(divHorario);
        } else {
            
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente seleccionar en un horario, dia o profesional distinto", "error");
        }
    }
}
