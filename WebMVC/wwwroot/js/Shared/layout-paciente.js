
import { getNotificaciones } from '../apis/personas-fetch.js?rnd=9';

import { comprobanteAnulacion, comprobantePaciente, comprobanteMedico } from '../apis/correos-fetch.js';
import { logPacienteViaje } from '../apis/personas-fetch.js';
import { getHoraMedicoByCalendar} from '../apis/vwhorasmedicos-fetch.js?1';
import { getAgendaMedicoInicial } from '../apis/agendar-fetch.js'; 
import { putEliminarAtencion, confirmaPaciente, reagendarApp } from '../apis/agendar-fetch.js';
import { enviarCitaEniax, cambioEstado } from "../apis/eniax-fetch.js";
var cliente = 0;
export async function init(data) {
    var fechaHoy = moment().format("DD-MM-YYYY");
    setAsyncInterval(async () => actualizarMensaje(uid), 60000); //10seg
    await ingresoPacienteRT(uid);
    if (window.host.includes("saludproteccion") || window.host.includes("masproteccionsalud") || window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia") || window.host.includes("saludtumundoseguro"))
        return;
    if (window.TimelineData.length > 0) {
        await horasHoy(window.TimelineData.filter(itemF => !itemF.atencionDirecta && moment(itemF.fecha).format("DD-MM-YYYY") == fechaHoy));
    }

    ProximasAtenciones(window.ProximasHorasPaciente);

    if ($("#kt_widget2_tab1_content").html()) {
        document.getElementById('divSinAtenciones').hidden = true;
        var cantAgendada = $('#kt_widget2_tab1_content').children().length??0;
        if (cantAgendada > 0) {
            $(".circulo-alerta-numero-agendada").html(cantAgendada);
            $(".circulo-alerta-agendada").show();
        }
    } else {
        document.getElementById('divSinAtenciones').hidden = false;

    }


    $(".btn-close-agendada").click(function () {
        $(".dropdown-wow").removeClass('show');
    });


    $(".btnAhoraNo").click(function () {
        $("#modalControlAtencionAgendadaCancela").modal("hide");

    });

    $(".btnAhoraNo").click(function () {
        $("#modalControlAtencionAgendadaConfirma").modal("hide");

    });



    $('body').on('click', function (e) {

        // Verificar si dropdown tiene class show
        var findClass = 'show';
        if ($('.dropdown-wow').is("." + findClass)) {
            e.stopPropagation();
        } else {
            $(".dropdown-wow").removeClass('show');
        }
    });

    await actualizaNumeroAtenciones();

}

if ($("#item-wallet").length) {
    let btn_itemwallet = document.getElementById("item-wallet");
    btn_itemwallet.onclick = async () => {
        location.href = '/PasarelaPago/HomeWallet';
        //'#modalPronto').modal('show');
    }
}

const asyncIntervals = [];
var connectionBox;
const runAsyncInterval = async (cb, interval, intervalIndex) => {
    await cb();
    if (asyncIntervals[intervalIndex]) {
        setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    }
};

const setAsyncInterval = (cb, interval) => {
    if (cb && typeof cb === "function") {
        const intervalIndex = asyncIntervals.length;
        asyncIntervals.push(true);
        runAsyncInterval(cb, interval, intervalIndex);
        return intervalIndex;
    } else {
        throw new Error('Callback must be a function');
    }
};

const clearAsyncInterval = (intervalIndex) => {
    if (asyncIntervals[intervalIndex]) {
        asyncIntervals[intervalIndex] = false;
    }
};


async function actualizaNumeroAtenciones() {

    if ($("#kt_widget2_tab1_content").html()) {
        document.getElementById('divSinAtenciones').hidden = true;
        var cantAgendada = $('#kt_widget2_tab1_content').children().length;
        if (cantAgendada > 0) {
            $(".circulo-alerta-numero-agendada").html(cantAgendada);
            $(".circulo-alerta-agendada").show();
        }
    } else {
        document.getElementById('divSinAtenciones').hidden = false;
        $(".circulo-alerta-agendada").hide();


    }
}

async function ingresoPacienteRT(uid) {
    //debugger
    //connectionBox = new signalR.HubConnectionBuilder()
    //    .withUrl(`${baseUrl}/ingresoboxhub`)
    //    .configureLogging(signalR.LogLevel.None)
    //    .withAutomaticReconnect()
    //    .build();

    //connectionBox.on('IngresarBox', (id) => {
    //    var urlBox = window.location;
    //    if (!urlBox.pathname.includes("Atencion_Box")) {
    //        let aud = document.getElementById("ingresoBox");
    //        aud.play();
    //        swal.fire({
    //            title: 'El profesional ya está ingresando a la consulta',
    //            text: "Ir a la Atención",
    //            type: 'success',
    //            showCancelButton: false,
    //            reverseButtons: true,
    //            cancelButtonText: 'Cancelar',
    //            confirmButtonText: 'Continuar',
    //            allowOutsideClick: false,
    //            allowEscapekey: false
    //        }).then(async function (result) {
    //            if (result.value) {
    //                location.href = `/Atencion_Box/${id}`;
    //            }

    //        });
    //    }        
    //    if (urlBox.pathname.includes("Atencion_Box")) {      
    //        const div = document.getElementById('estilo');            
    //        div.className = "status-profesional online";   
    //        document.getElementById('onLine').innerText = 'Online';       
    //    };
    
    //});
    //connectionBox.on('EnLinea', (id) => {
    //    var urlBox = window.location;
    //    if (!urlBox.pathname.includes("Atencion_Box")) {           

     
    //    }
    //    if (urlBox.pathname.includes("Atencion_Box")) {
    //        const div = document.getElementById('estilo');
    //        div.className = "status-profesional online";            
    //        document.getElementById('onLine').innerText = 'Online';    
    //    };

    //});

    //try {
    //    await connectionBox.start();
    //} catch (err) {
    //    console.log(err);
    //}

    try {
        await connectionBox.start();
    } catch (err) {
        
    }

    
}
async function actualizarMensaje(uid) {

    var mensaje = await getNotificaciones(uid, idCliente);
    mensaje.forEach(item => {
        if (item.tipo == "Mensaje") {
            //
            var clase = `inner-mensaje ${item.claseNotificacion}`;
            var claseAtencion = "aviso-atencion container-fluid " + item.claseNotificacion;
            //
            var url = new URL(window.location.href);
            if (item.tiempoRestante === 1 && !url.pathname.includes("/Atencion")) {
                swal.fire({
                    title: "",
                    text: "Ha llegado la hora de tu atención, ¿Dónde deseas ingresar?",
                    type: 'question',
                    showCancelButton: true,
                    reverseButtons: true,
                    cancelButtonText: 'Sala de espera',
                    confirmButtonText: "Box de atención",
                    //allowOutsideClick: false,
                    //allowEscapekey: false
                }).then(async function (result) {
                    //
                    if (result.value) {
                        location.href = `/Atencion_Box/${item.idAtencion}`
                    }
                    else if (result.dismiss == "cancel") {
                        location.href = `/Atencion_SalaEspera/${item.idAtencion}`
                    }
                });
            }
        }

    });


    //            if ($("#innerMensaje").length) {
    //                document.getElementById("innerMensaje").onclick = () => {
    //                    if (item.claseNotificacion == "ahora") {
    //                        location.href = "/Atencion/" + item.idAtencion
    //                    }
    //                    else {
    //                        location.href = "javascript:;";
    //                    }
    //                }


    //                document.getElementById("innerMensaje").setAttribute("class", clase)
    //                document.getElementById("innerMensaje").innerHTML = item.mensaje;
    //                if ($("#" + item.idAtencion).length) {
    //                    document.getElementById(item.idAtencion).setAttribute("class", claseAtencion)
    //                }
    //                else if ($(".aviso-atencion").length) {
    //                    document.querySelectorAll(".aviso-atencion").forEach(item => {
    //                        item.setAttribute("class", claseAtencion)
    //                    })
    //                }
    //            }
    //    }

    //});


    setTimeout(async () => {
        if ($("#tipoAsistencia").val() != undefined) {
            var Estado = $("#estado").val();
            var TipoAsistencia = $("#tipoAsistencia").val();
            var FechaCreacion = $("#fechaCreacion").val().slice(0, 10);
            let fechaHoy = new Date().toLocaleDateString();

            if (Estado == "T" && TipoAsistencia == "Ambulancia" && FechaCreacion == fechaHoy) {
                document.getElementById('mensajeSuperiorAsistAmb').setAttribute('style', 'display=flex');
            }
            else if (Estado == "T" && TipoAsistencia == "Médico a Domicilio" && FechaCreacion == fechaHoy) {
                document.getElementById('mensajeSuperiorAsistMed').setAttribute('style', 'display=flex');
            }
        }
       
    }, "1000");
}

function horasHoy(data) {
    data.forEach(item => {
        if (item.fecha > moment().format()) {
            var foto;
            if (!item.fotoPerfil.includes('Avatar.svg')) {
                foto = baseUrl + item.fotoPerfil.replace(/\\/g, '/');
            }
            else {
                foto = baseUrlWeb + item.fotoPerfil;
            }
            let link = document.createElement('div')

            link.setAttribute('class', 'caja-atencion-home container-fluid cont-atencion-proxima')
            link.setAttribute('style', 'background-color:#e1a72c;color:white');



            let contAviso = document.createElement('div');
            //contAviso.setAttribute('class', 'cont-aviso row h-100 align-items-center');
            contAviso.setAttribute('class', 'cont-aviso');
            //contAviso.setAttribute('style', 'min-height: 135px');


            let contDatos = document.createElement('div');
            contDatos.setAttribute('class', 'col-12 col-md-12 pr-md-0');

            let dataMedico = document.createElement('div');
            dataMedico.setAttribute('class', 'data-atencion');

            let calificacion = document.createElement('div');
            calificacion.setAttribute('class', 'calificacion')
            for (var i = 0; i < 5; i++) {
                let divEstrellaPositiva = document.createElement('i');
                divEstrellaPositiva.classList.add('fas');
                divEstrellaPositiva.classList.add('fa-star');
                divEstrellaPositiva.classList.add('positiva');
                calificacion.appendChild(divEstrellaPositiva);

            }
            let header = document.createElement('span');
            header.setAttribute('class', 'header-aviso-atencion');


            let iCalendar = document.createElement('i');
            iCalendar.setAttribute('class', 'fal fa-calendar-alt');
            var hora = item.horaDesdeText.substring(0, 5);
            let fechaHora = document.createElement('span');
            fechaHora.setAttribute('class', 'fechaHora_' + item.idAtencion);
            fechaHora.innerHTML = moment(item.fecha).format("DD-MM-YYYY") + ' | ' + (hora ? hora : item.horaDesdeText);;

            let spanNombreMedico = document.createElement('span');
            spanNombreMedico.setAttribute('class', 'nombre-profesional');
            spanNombreMedico.setAttribute('style', 'color:white;text-align:left;');
            spanNombreMedico.setAttribute('title', 'Ir a la Atención');
            spanNombreMedico.onclick = async () => {
                var log = {
                    IdPaciente: uid,
                    Evento: "Paciente presiona link para ingresar al box",
                    IdAtencion: parseInt(item.idAtencion)
                }
                await logPacienteViaje(log);
                var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(10, 'minutes').format('HH:mm');
                var horaAntes = moment(item.fecha).format("DD-MM-YYYY") + " " + item.horaDesdeText;

                if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp) {
                    Swal.fire("Ya han pasado 10 min. desde que comenzó tu atención, se ha cancelado", "", "warning")
                    return;
                }

                else {
                    window.location = "/Atencion_SalaEspera/" + item.idAtencion;
                }
            }
            spanNombreMedico.innerHTML = item.nombreMedico;

            let tituloProfesional = document.createElement('span');
            tituloProfesional.setAttribute('class', 'titulo-profesional');
            tituloProfesional.setAttribute('style', 'color:white;text-align:left;');
            //tituloProfesional.innerHTML = '&nbsp;' + item.especialidad;
            tituloProfesional.innerHTML = item.especialidad;

            let contDatosAtencion = document.createElement('div');
            contDatosAtencion.setAttribute('class', 'col');

            let datosFecha = document.createElement('div');
            datosFecha.setAttribute('class', 'datos-fecha');

            let spanFechaAtencion = document.createElement('span');
            spanFechaAtencion.setAttribute('class', 'fecha-atencion');
            spanFechaAtencion.innerHTML = item.fechaText;

            let spanHoraAtencion = document.createElement('span');
            spanHoraAtencion.setAttribute('class', 'hora-atencion');
            spanHoraAtencion.innerHTML = item.horaDesdeText;

            let divStatusAtencion = document.createElement('div');
            let divLeyenda = document.createElement('div');

            if (item.confirmaPaciente != null) {
                divStatusAtencion.setAttribute('class', 'status-atencion');
                divLeyenda.setAttribute('class', 'leyenda');
                divLeyenda.setAttribute('style', 'text-align-last: right;');
                divLeyenda.innerHTML = 'Atención Confirmada';
            }


            let atencionToolbar = document.createElement('div');
            atencionToolbar.setAttribute('class', 'col-lg-12 atencion-toolbar atencion-proxima-toolbar');


            let aAnular = document.createElement('a');
            //aAnular.setAttribute('style', 'color:red');
            aAnular.innerHTML = "Cancelar";
            let iconAnular = document.createElement('i');
            iconAnular.setAttribute('class', 'fal fa-calendar-times');
            iconAnular.setAttribute('style', 'margin: 0 auto');

            aAnular.onclick = () => {
                if (item.cobrar) {
                    Swal.fire("Esta atención no se puede cancelar", "Para cancelar esta estención comunicate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                    return;
                }
                document.getElementById('fotoMedicoModal').src = foto;
                document.getElementById('nombreProfesionalModal').innerHTML = item.nombreMedico;
                document.getElementById('tituloMedicoModal').innerHTML = item.especialidad;
                document.getElementById('fechaAtencionModal').innerHTML = item.fechaText;
                document.getElementById('horaAtencionModal').innerHTML = item.horaDesdeText;

                /*Contenido Modal*/
                if (item.fotoPerfil.includes('Avatar.svg'))
                    foto = "/img/avatar-medico.png";

                document.getElementById('imgModalAgendarCancela').src = foto;
                $(".fecha_modal").html('<i class="fal fa-calendar-alt"></i> ' + moment(item.fecha).format("DD-MM-YYYY") + ' / ' + item.horaDesdeText);
                $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
                $(".especialidad_modal").html(item.especialidad);


                //$('#modalAnulacion').modal('show');
                $('#modalControlAtencionAgendadaCancela').modal('show');
                $(".btnAnulaAtencionx").show();
                document.getElementById('btnAnulaAtencionx').onclick = async () => {
                    var valida = await putEliminarAtencion(item.idAtencion, uid);
                    if (valida.status !== "NOK") {
                        $('#modalControlAtencionAgendadaCancela').modal('hide');
                        link.remove();
                        if ($('#kt_widget2_tab1_content').children().length == 0 && $('#atenciones').children().length == 0)
                            document.getElementById('divSinAtenciones').hidden = false;
                        await cambioEstado(item.idAtencion.toString(), "E") // E = Anulada
                        await comprobanteAnulacion(valida.atencion);
                    }
                    else {
                        Swal.fire('', 'No fue posible cancelar esta atención, comuniquese con mesa de ayuda', 'error')
                    }

                    await actualizaNumeroAtenciones();
                }

            }

            let aReagendar = document.createElement('a');
            aReagendar.innerHTML = "Reagendar";
            //aReagendar.setAttribute('style', 'color: rgba(24, 98, 118, 1)');
            aReagendar.setAttribute('id', "btnAgendar" + item.idAtencion)
            let iconReagendar = document.createElement('i');
            iconReagendar.setAttribute('class', 'fal fa-calendar-edit');
            iconReagendar.setAttribute('style', 'margin: 0 auto');

            aReagendar.onclick = async () => {
                var idMedico = item.idMedico;
                $('#rowDatePicker').empty();
                $('#btnConf').empty();
                $('#btnHorario').empty();
                spanFechaAtencion.classList.add("fecha" + item.idAtencion);
                spanHoraAtencion.classList.add("hora" + item.idAtencion);

                await dataCalendar(item.idConvenio, item.fecha, item.idAtencion, idMedico);
                document.getElementById('nombreprofesional').innerHTML = `Dr(a) ${item.nombreMedico}`;
                $('#modalReagendar').modal('show');
            }


            let aConfirmar = document.createElement('a');
            aConfirmar.innerHTML = "Confirmar";
            //aConfirmar.setAttribute('style', 'color:rgba(24, 98, 118, 1)');
            let iconConfirmar = document.createElement('i');
            iconConfirmar.setAttribute('class', 'fal fa-calendar-check');
            iconConfirmar.setAttribute('style', 'margin: 0 auto');

            aConfirmar.onclick = async () => {
                if (divLeyenda.innerHTML === "Atención Confirmada") {
                    Swal.fire('', 'Ya confirmaste tu hora', 'info');
                    return;
                }
                document.getElementById('nombreProfesionalConfirma').innerHTML = item.nombreMedico;
                document.getElementById('tituloMedicoConfirma').innerHTML = item.especialidad;
                document.getElementById('fechaAtencionConfirma').innerHTML = moment(item.fecha).format("DD-MM-YYYY");
                document.getElementById('horaAtencionConfirma').innerHTML = item.horaDesdeText.substring(0, 5);
                document.getElementById('horaAtencionConfirma').setAttribute("class", "hora-atencion text-center");

                /*Contenido Modal*/
                /*Contenido Modal*/
                if (item.fotoPerfil.includes('Avatar.svg'))
                    foto = "/img/avatar-medico.png";

                document.getElementById('imgModalAgendarConfirma').src = foto;
                $(".fecha_modal").html(moment(item.fecha).format("DD-MM-YYYY") + ' / ' + item.horaDesdeText);
                $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
                $(".especialidad_modal").html(item.especialidad);

                //$('#modalConfirmacion').modal('show');
                $('#modalControlAtencionAgendadaConfirma').modal('show');
                $(".btnConfirmaAtencionx").show();
                document.getElementById('btnConfirmaAtencionx').onclick = async () => {

                    let result = await confirmaPaciente(item.idAtencion, uid)
                    if (result.status === "OK") {
                        $('#modalControlAtencionAgendadaConfirma').modal('hide');
                        await cambioEstado(item.idAtencion.toString(), "C") // C = confirmada
                        await comprobantePaciente(baseUrlWeb, result.atencion);
                        Swal.fire("", "Hora Confirmada", "success");

                    }
                    else {
                        Swal.fire('', 'No fue posible confirmar esta atención, intentelo más tarde', 'error')
                    }


                }

            }


            let aIrBox = document.createElement('a');
            aIrBox.setAttribute('class', 'btn-icon');
            aIrBox.href = "javascript:void(0);";
            let divIconoIrBox = document.createElement('div');
            divIconoIrBox.setAttribute('class', 'icono');
            let iIrBox = document.createElement('i');
            iIrBox.setAttribute('class', 'fal fa-calendar-check');
            iIrBox.setAttribute('style', 'margin: 0 auto');

            let divLeyendaIrBox = document.createElement('div');
            divLeyendaIrBox.setAttribute('class', 'leyenda-icono');
            divLeyendaIrBox.innerHTML = "Ir a la Atención";
            aIrBox.onclick = async () => {

                var log = {
                    IdPaciente: uid,
                    Evento: "Paciente presiona link para ingresar al box",
                    IdAtencion: parseInt(item.idAtencion)
                }
                // await logPacienteViaje(log);
                var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(10, 'minutes').format('HH:mm');

                if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
                    Swal.fire("Ya han pasado 10 min. desde que comenzó tu atención, se ha cancelado", "", "warning")
                    return;
                }
                //else if(horaAntes > moment().format("DD-MM-YYYY HH:mm")) {
                //    Swal.fire("Aún no es hora de tu atención", "", "warning")
                //    return;
                //}
                else {
                    window.location = "/Atencion_SalaEspera/" + item.idAtencion;
                }
            }

            let div = document.getElementById('kt_widget2_tab1_content');
            div.setAttribute('class', 'tab-pane active')

            link.appendChild(contAviso);

            contAviso.appendChild(contDatos);
            contDatos.appendChild(dataMedico);
            dataMedico.appendChild(header);

            //header.appendChild(proximaAtencion);
            header.appendChild(fechaHora);
            dataMedico.appendChild(spanNombreMedico);
            dataMedico.appendChild(tituloProfesional);
            contAviso.appendChild(contDatosAtencion);
            contDatosAtencion.appendChild(datosFecha);


            contAviso.appendChild(divStatusAtencion);
            divStatusAtencion.appendChild(divLeyenda);

            aAnular.appendChild(iconAnular);
            aReagendar.appendChild(iconReagendar);
            aConfirmar.appendChild(iconConfirmar);
            aIrBox.appendChild(divIconoIrBox);

            atencionToolbar.appendChild(aAnular);
            atencionToolbar.appendChild(aReagendar);
            atencionToolbar.appendChild(aConfirmar);
            contAviso.appendChild(atencionToolbar);
            div.appendChild(link);
            //div.appendChild(atencionToolbar);
        }
    })


    //proximasAtenciones(data.proximasHorasPaciente);
    //historialAtenciones(data.historialAtenciones);

    if (!window.host.includes("achs.")) { }
    //camposValidos(uid);
}


function ProximasAtenciones(data) {

    data.forEach(item => {
        if (item.fecha > moment().format()) {
            var foto;
            if (!item.fotoPerfil.includes('Avatar.svg')) {
                foto = baseUrl + item.fotoPerfil.replace(/\\/g, '/');
            }
            else {
                foto = baseUrlWeb + item.fotoPerfil;
            }
            let link = document.createElement('div')

            link.setAttribute('class', 'caja-atencion-home container-fluid cont-atencion-proxima')



            let contAviso = document.createElement('div');
            contAviso.setAttribute('class', 'cont-aviso');


            let contDatos = document.createElement('div');

            let dataMedico = document.createElement('div');
            dataMedico.setAttribute('class', 'data-atencion');

            let calificacion = document.createElement('div');
            calificacion.setAttribute('class', 'calificacion')
            for (var i = 0; i < 5; i++) {
                let divEstrellaPositiva = document.createElement('i');
                divEstrellaPositiva.classList.add('fas');
                divEstrellaPositiva.classList.add('fa-star');
                divEstrellaPositiva.classList.add('positiva');
                calificacion.appendChild(divEstrellaPositiva);

            }
            let header = document.createElement('span');
            header.setAttribute('class', 'header-aviso-atencion');


            let iCalendar = document.createElement('i');
            iCalendar.setAttribute('class', 'fal fa-calendar-alt');

            let fechaHora = document.createElement('span');
            fechaHora.innerHTML = item.fechaText + ' | ' + item.horaDesdeText;;

            let spanNombreMedico = document.createElement('span');
            spanNombreMedico.setAttribute('class', 'nombre-profesional');
            spanNombreMedico.innerHTML = item.nombreMedico;

            let tituloProfesional = document.createElement('span');
            tituloProfesional.setAttribute('class', 'titulo-profesional');
            tituloProfesional.innerHTML = item.especialidad;

            let contDatosAtencion = document.createElement('div');
            contDatosAtencion.setAttribute('class', 'col');

            let datosFecha = document.createElement('div');
            datosFecha.setAttribute('class', 'datos-fecha');

            let spanFechaAtencion = document.createElement('span');
            spanFechaAtencion.setAttribute('class', 'fecha-atencion');
            spanFechaAtencion.innerHTML = item.fechaText;

            let spanHoraAtencion = document.createElement('span');
            spanHoraAtencion.setAttribute('class', 'hora-atencion');
            spanHoraAtencion.innerHTML = item.horaDesdeText;

            let divStatusAtencion = document.createElement('div');
            let divLeyenda = document.createElement('div');

            if (item.confirmaPaciente != null) {
                divStatusAtencion.setAttribute('class', 'status-atencion');
                divLeyenda.setAttribute('class', 'leyenda');
                divLeyenda.innerHTML = 'Atención Confirmada';
            }


            let atencionToolbar = document.createElement('div');
            atencionToolbar.setAttribute('class', 'col-lg-12 atencion-toolbar atencion-proxima-toolbar');


            let aAnular = document.createElement('a');
            aAnular.innerHTML = "Cancelar";
            let iconAnular = document.createElement('i');
            iconAnular.setAttribute('class', 'fal fa-calendar-times');
            iconAnular.setAttribute('style', 'margin: 0 auto');

            aAnular.onclick = () => {
                if (item.cobrar) {
                    Swal.fire("Esta atención no se puede cancelar", "Para cancelar esta estención comunicate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                    return;
                }
                document.getElementById('fotoMedicoModal').src = foto;
                document.getElementById('nombreProfesionalModal').innerHTML = item.nombreMedico;
                document.getElementById('tituloMedicoModal').innerHTML = item.especialidad;
                document.getElementById('fechaAtencionModal').innerHTML = item.fechaText;
                document.getElementById('horaAtencionModal').innerHTML = item.horaDesdeText;

                /*Contenido Modal*/
                /*Contenido Modal*/
                if (item.fotoPerfil.includes('Avatar.svg'))
                    foto = "/img/avatar-medico.png";

                document.getElementById('imgModalAgendarCancela').src = foto;
                $(".fecha_modal").html('<i class="fal fa-calendar-alt"></i> ' + item.fechaText + ' / ' + item.horaDesdeText);
                $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
                $(".especialidad_modal").html(item.especialidad);


                //$('#modalAnulacion').modal('show');
                $('#modalControlAtencionAgendadaCancela').modal('show');
                document.getElementById('btnAnulaAtencionx').onclick = async () => {
                    var valida = await putEliminarAtencion(item.idAtencion, uid);
                    if (valida.status !== "NOK") {
                        $('#modalControlAtencionAgendadaCancela').modal('hide');
                        link.remove();
                        if ($('#kt_widget2_tab1_content').children().length == 0 && $('#atenciones').children().length == 0)
                            document.getElementById('divSinAtenciones').hidden = false;
                        await cambioEstado(item.idAtencion.toString(), "E") // E = Anulada
                        await comprobanteAnulacion(valida.atencion);
                    }
                    else {
                        Swal.fire('', 'No fue posible cancelar esta atención, comuniquese con mesa de ayuda', 'error')
                    }

                    await actualizaNumeroAtenciones();
                }

                $(".dropdown-wow").addClass('show');


            }

            let aReagendar = document.createElement('a');
            aReagendar.innerHTML = "Reagendar";
            //aReagendar.setAttribute('style', 'color: rgba(24, 98, 118, 1)');
            aReagendar.setAttribute('id', "btnAgendar" + item.idAtencion)
            let iconReagendar = document.createElement('i');
            iconReagendar.setAttribute('class', 'fal fa-calendar-edit');
            iconReagendar.setAttribute('style', 'margin: 0 auto');
            aReagendar.onclick = async () => {
                var idMedico = item.idMedico;
                cliente = item.idCliente;
                $('#rowDatePicker').empty();
                $('#btnConf').empty();
                $('#btnHorario').empty();
                spanFechaAtencion.classList.add("fecha" + item.idAtencion);
                spanHoraAtencion.classList.add("hora" + item.idAtencion);

                await dataCalendar(item.idConvenio, item.fecha, item.idAtencion, idMedico);
                document.getElementById('nombreprofesional').innerHTML = `Dr(a) ${item.nombreMedico}`;
                $('#modalReagendar').modal('show');
                $(".dropdown-wow").addClass('show');

            }


            let aConfirmar = document.createElement('a');
            aConfirmar.innerHTML = "Confirmar";
            //aConfirmar.setAttribute('style', 'color:rgba(24, 98, 118, 1)');
            let iconConfirmar = document.createElement('i');
            iconConfirmar.setAttribute('class', 'fal fa-calendar-check');
            iconConfirmar.setAttribute('style', 'margin: 0 auto');

            aConfirmar.onclick = async () => {
                if (divLeyenda.innerHTML === "Atención Confirmada") {
                    Swal.fire('', 'Ya confirmaste tu hora', 'info');
                    return;
                }
                document.getElementById('nombreProfesionalConfirma').innerHTML = item.nombreMedico;
                document.getElementById('tituloMedicoConfirma').innerHTML = item.especialidad;
                document.getElementById('fechaAtencionConfirma').innerHTML = moment(item.fecha).format("DD-MM-YYYY");
                document.getElementById('horaAtencionConfirma').innerHTML = item.horaDesdeText.substring(0, 5);
                document.getElementById('horaAtencionConfirma').setAttribute("class", "hora-atencion text-center");

                /*Contenido Modal*/
                /*Contenido Modal*/
                if (item.fotoPerfil.includes('Avatar.svg'))
                    foto = "/img/avatar-medico.png";

                document.getElementById('imgModalAgendarConfirma').src = foto;
                $(".fecha_modal").html(item.fechaText + ' / ' + item.horaDesdeText);
                $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
                $(".especialidad_modal").html(item.especialidad);

                //$('#modalConfirmacion').modal('show');
                $('#modalControlAtencionAgendadaConfirma').modal('show');
                $("#btnConfirmaAtencionx").show();
                document.getElementById('btnConfirmaAtencionx').onclick = async () => {

                    let result = await confirmaPaciente(item.idAtencion, uid)
                    if (result.status === "OK") {
                        $('#modalControlAtencionAgendadaConfirma').modal('hide');
                        await cambioEstado(item.idAtencion.toString(), "C") // C = confirmada
                        await comprobantePaciente(baseUrlWeb, result.atencion);
                        Swal.fire("", "Hora Confirmada", "success");

                    }
                    else {
                        Swal.fire('', 'No fue posible confirmar esta atención, intentelo más tarde', 'error')
                    }


                }

                $(".dropdown-wow").addClass('show');


            }

            let div = document.getElementById('kt_widget2_tab1_content');
            div.setAttribute('class', 'tab-pane active')

            link.appendChild(contAviso);

            contAviso.appendChild(contDatos);
            contDatos.appendChild(dataMedico);
            dataMedico.appendChild(header);
            // header.appendChild(proximaAtencion);

            header.appendChild(fechaHora);
            dataMedico.appendChild(spanNombreMedico);
            dataMedico.appendChild(tituloProfesional);
            contAviso.appendChild(contDatosAtencion);
            contDatosAtencion.appendChild(datosFecha);


            contAviso.appendChild(divStatusAtencion);
            divStatusAtencion.appendChild(divLeyenda);

            aAnular.appendChild(iconAnular);
            aReagendar.appendChild(iconReagendar);
            aConfirmar.appendChild(iconConfirmar);
            atencionToolbar.appendChild(aAnular);
            atencionToolbar.appendChild(aReagendar);
            atencionToolbar.appendChild(aConfirmar);
            contAviso.appendChild(atencionToolbar);
            div.appendChild(link);
            //div.appendChild(atencionToolbar);
        }
    })


    //proximasAtenciones(data.proximasHorasPaciente);
    //historialAtenciones(data.historialAtenciones);

    if (!window.host.includes("achs.")) { }
    //camposValidos(uid);

}

async function dataCalendar(idConvenio, fecha, idAtencion, idMedico) {

    var rangoIni;
    var rangoFin;
    var ultimaHoraLista;
    var spanSelectorHorasR;
    var spanSelectorHorasL;
    var seleccion = false;
    var idMedicoHoraSeleccionada = 0;
    var idMedicoSeleccionada = 0;
    var idBloqueHoraSeleccionada = 0;
    var fechaSeleccionSeleccionada = "";
    var horaSeleccionada = "";

    var fechaSeleccion = moment();

    let btnMañana = document.createElement("button")
    btnMañana.setAttribute("id", "btnManana");
    btnMañana.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-am mr-3");
    btnMañana.innerHTML = "Mañana"
    document.getElementById("btnHorario").appendChild(btnMañana);


    let btnTarde = document.createElement("button")
    btnTarde.setAttribute("id", "btnTarde");
    btnTarde.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-pm");
    btnTarde.innerHTML = "Tarde"

    document.getElementById("btnHorario").appendChild(btnTarde);

    let buttonInside = document.createElement("button");
    buttonInside.setAttribute("id", "btnConfirmarHora");
    buttonInside.setAttribute('class', 'btn btn-success btn-sm');
    buttonInside.innerHTML = "Confirmar Hora";
    document.getElementById("btnConf").appendChild(buttonInside);

    let row = document.getElementById('rowDatePicker');
    let drop = document.createElement('div');
    drop.setAttribute('class', 'cont-datepicker');
    drop.setAttribute('id', 'kt_datepicker_6');
    row.appendChild(drop);
    var fechaSeleccionEstatica = moment();
    var fechaSeleccion = moment();

    $('#kt_datepicker_6').datepicker('setDate', fechaSeleccion._d).datepicker('fill');
    //$('.new').hide() //oculta los días del mes siguiente, con la clase.new
    await pintaCalendar();

    async function pintaCalendar() {

        //obtener la data de los dias con la fecha seleccionada desde calendario
        var diasConAgenda = await getHoraMedicoByCalendar(idMedico, moment(fechaSeleccion).format('YYYYMMDD'), idConvenio, moment(fechaSeleccionEstatica).format('YYYYMMDD'), uid);
        diasConAgenda.forEach(itemDias => {
            var dia = itemDias.info;
            var mes = itemDias.fecha;
            if (moment(mes).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD")) {
                comparaDias(dia, mes)
            }
        })

        document.querySelectorAll('.day').forEach(el => {
            /*en caso de cualquier inconveniente volver a una version anterior del calendario, y ocultar los días nuevos con la clase .new, los dias con clase
             .old, no se pueden ocultar ya que se pierde el orden en las columnas.*/
            //todo dia del calendario que en el paso de comparacion haya quedado distinto a activo, ya sea porque no cayo en el dia con horas, quedara desactivado
            if (!el.getAttribute('class').includes('active')) {
                el.classList.add('disabled');
            }
            //el dia actual siempre quedara activo por defecto
            if (el.getAttribute('class').includes('today')) {
                el.classList.remove('disabled');
                el.classList.add('active');
            }
        })
    }
    function comparaDias(dia, mes) {
        document.querySelectorAll('.day').forEach(item => {
            var a = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("YYYY"); //año fecha seleccionada
            var ac = moment(mes).format('YYYY'); // año compara, desde fecha de bd

            var m = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("MM"); //mes fecha seleccionada
            var mc = moment(mes).format('MM'); //mes fecha desde bd
            if (dia == item.innerHTML && m == mc && a == ac) {
                /*solo se pintan los dias que pertenezcan al dia, 
                mes y año de la fecha que se selecciono, los demas dias quedan desactivados en el siguiente paso*/
                if (!item.getAttribute('class').includes('new') && !item.getAttribute('class').includes('old')) {
                    var d = moment().format('D');
                    if (item.innerHTML == d && m == moment().format("MM") && a == moment().format("YYYY")) {
                        item.classList.add('today');
                    }
                    item.classList.add('active');
                }

            }

        })
    }


    let initValue = 0;

    var horario = true;


    // Busqueda inicial
    var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
    var agendaMedico = await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"), idMedico, horario, true, idConvenio, uid);

    //await cargarInfoMedico(dataMedico);
    document.getElementById('listaHoras').innerHTML = "";

    try {
        var agendaIterar = agendaMedico.slice(initValue, 4);
        if (agendaMedico.length)
            rangoHora(agendaMedico);
        await cargaTituloHorario(agendaIterar[0]);

        agendaIterar.forEach(iterarAgendas);
    } catch (e) {
    }



    // Fin Busqueda inicial

    $('#btnManana').on('click', async function (ev) {
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        reloadData(true);
    });

    $('#btnTarde').on('click', async function (ev) {
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        reloadData(false);
        // await pintaCalendar();
    });

    $('#kt_datepicker_6').datepicker().on('changeDate', async function (ev) {

        //reseteamos parametros seleccionados

        seleccion = false;
        idMedicoHoraSeleccionada = 0;
        idMedicoSeleccionada = 0;
        idBloqueHoraSeleccionada = 0;
        fechaSeleccionSeleccionada = "";
        horaSeleccionada = "";
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();

        reloadData(horario);
        await pintaCalendar();
    });

    $('#kt_datepicker_6').datepicker().on('changeMonth', async function (ev) {

        //reseteamos parametros seleccionados
        seleccion = false;
        idMedicoHoraSeleccionada = 0;
        idMedicoSeleccionada = 0;
        idBloqueHoraSeleccionada = 0;
        fechaSeleccionSeleccionada = "";
        horaSeleccionada = "";
        fechaSeleccion = moment(moment(ev.date).format("YYYY-MM-DD HH:mm:ss")).startOf('month').format("YYYY-MM-DD HH:mm:ss");
        await pintaCalendar();
    });

    async function reloadData(manana) {
        horario = manana;
        initValue = 0;
        var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        agendaMedico = await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"),
            idMedico,
            horario,
            false, idConvenio, uid);

        document.getElementById('listaHoras').innerHTML = "";


        var agendaIterar = agendaMedico.slice(initValue, 4);
        if (agendaIterar.length) {

            rangoHora(agendaMedico);
            await cargaTituloHorario(agendaIterar[0]);
            agendaIterar.forEach(iterarAgendas);

        } else {
            MensajeSinHoras();
        }
    }

    async function MensajeSinHoras() {


        document.getElementById("headerSeleccion").innerHTML = "";

        let divDataHorario = document.createElement('div');
        divDataHorario.classList.add('data-horario');


        let spanTituloDataHorario = document.createElement('span');
        spanTituloDataHorario.classList.add('titulo-data-horario');
        spanTituloDataHorario.innerHTML = "No hay horas disponibles en este momento. Vuelva a intentarlo";
        divDataHorario.appendChild(spanTituloDataHorario);

        document.getElementById("headerSeleccion").appendChild(divDataHorario);
    }
    async function cargaTituloHorario(medico) {
        document.getElementById("headerSeleccion").innerHTML = "";

        let divDataHorario = document.createElement('div');
        divDataHorario.classList.add('data-horario');
        divDataHorario.classList.add('col-lg-8');

        let spanTituloDataHorario = document.createElement('div');
        spanTituloDataHorario.classList.add('titulo-data-horario');

        spanTituloDataHorario.innerHTML = "Agenda " + medico.textoHorario + " " + moment(fechaSeleccion).format("DD-MM-YYYY");

        let rangoHorario = document.createElement('div');
        rangoHorario.classList.add('rango-horario');


        rangoHorario.innerHTML = `De ${rangoIni} Hrs. a ${rangoFin} hrs.`


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

            initValue = initValue - 4;
            if (initValue < 0) {

                initValue = 0;
                spanSelectorHorasL
            }

            document.getElementById('listaHoras').innerHTML = "";

            var agendaIterar = agendaMedico.slice(initValue, initValue + 4);


            await cargaTituloHorario(agendaIterar[0]);


            agendaIterar.forEach(iterarAgendas);
        });

        divHorario.appendChild(spanSelectorHorasL);



        let spanHoraTop = document.createElement('span');
        spanHoraTop.classList.add('hora-top');
        spanHoraTop.setAttribute("id", "spanHoraTop");
        spanHoraTop.innerHTML = moment(moment(fechaSeleccion).format("YYYY-MM-DD" + "T" + medico.horaDesdeText)).startOf('hour').format("HH:mm");
        divHorario.appendChild(spanHoraTop);


        spanSelectorHorasR = document.createElement('span');
        spanSelectorHorasR.classList.add('selector-horas');

        let spanIcono = document.createElement('i');
        spanIcono.classList.add('fas');
        spanIcono.classList.add('fa-chevron-circle-right');
        spanSelectorHorasR.appendChild(spanIcono);

        spanSelectorHorasR.addEventListener("click", async function () {
            initValue = initValue + 4;
            if (initValue > (agendaMedico.length - 4)) {
                initValue = agendaMedico.length - 4;
            }
            document.getElementById('listaHoras').innerHTML = "";

            var agendaIterar = agendaMedico.slice(initValue, initValue + 4);
            await cargaTituloHorario(agendaIterar[0]);


            agendaIterar.forEach(iterarAgendas);

        });

        divHorario.appendChild(spanSelectorHorasR);

        document.getElementById("headerSeleccion").appendChild(divDataHorario);
        document.getElementById("headerSeleccion").appendChild(divHorario);
    }

    async function iterarAgendas(medico, index, array) {

        let liHoraMedico = document.createElement('li');
        liHoraMedico.classList.add('hora');

        if (medico.nombrePaciente === "Disponible" || medico.estadoAtencion == "E") {
            if (idMedicoHoraSeleccionada.toString() === medico.idMedicoHora.toString())
                liHoraMedico.classList.add('seleccionado');
            else
                liHoraMedico.classList.add('disponible');
        }


        else
            liHoraMedico.classList.add('ocupado');


        liHoraMedico.setAttribute('data-idMedicoHora', medico.idMedicoHora);
        liHoraMedico.setAttribute('data-idMedico', medico.idMedico);
        liHoraMedico.setAttribute('data-idBloqueHora', medico.idBloqueHora);
        if (medico.nombrePaciente == "Disponible")
            liHoraMedico.setAttribute('data-estado', medico.nombrePaciente);
        else if (medico.estadoAtencion == "E")
            liHoraMedico.setAttribute('data-estado', "Disponible");
        liHoraMedico.setAttribute('data-horaText', medico.horaDesdeText);

        let spanHoraMedico = document.createElement('span');
        spanHoraMedico.classList.add('detalle-hora');
        spanHoraMedico.innerHTML = medico.horaDesdeText;

        //quitar flecha izquiera cuando la hora de inicio de la lista sea igual a la primera hora de atención del medico
        if (medico.horaDesdeText == agendaMedico[0].horaDesdeText) {
            spanSelectorHorasL.setAttribute("style", "display:none;")
        }

        //quitar flecha derecha cuando la ultima hora de la lista sea igual a la ultima hora de atención del médico.
        if (medico.horaDesdeText == agendaMedico[agendaMedico.length - 1].horaDesdeText) {
            spanSelectorHorasR.setAttribute("style", "display:none;")
        }
        else {
            spanSelectorHorasR.setAttribute("style", "display:block;")

        }
        liHoraMedico.appendChild(spanHoraMedico);


        let spanEstado = document.createElement('span');
        spanEstado.classList.add('estado-hora');

        let smallEstado = document.createElement('small');
        smallEstado.classList.add('estado-hora');

        if (idMedicoHoraSeleccionada.toString() === medico.idMedicoHora.toString())
            smallEstado.innerHTML = "Seleccionado";
        else if (medico.estadoAtencion == "E")
            smallEstado.innerHTML = "Disponible";
        else
            smallEstado.innerHTML = medico.nombrePaciente;



        spanEstado.appendChild(smallEstado);
        liHoraMedico.appendChild(spanEstado);


        liHoraMedico.addEventListener("click", async function () {

            var targetElement = event.target || event.srcElement;
            var liHora = targetElement.closest('.hora');
            var idMedicoHora = liHora.getAttribute('data-idMedicoHora');
            var idMedico = liHora.getAttribute('data-idMedico');
            var idBloqueHora = liHora.getAttribute('data-idBloqueHora');
            var estado = liHora.getAttribute('data-estado');
            var horaText = liHora.getAttribute('data-horaText');


            if (estado === "Disponible") {
                var fechaSeleccion = moment($("#kt_datepicker_6").data('datepicker').getDate())
                    .format("YYYY-MM-DD HH:mm:ss");


                document.querySelectorAll('.seleccionado').forEach(function (li) {
                    li.classList.remove('seleccionado');
                    li.classList.add('disponible');
                });

                document.querySelectorAll('.estado-hora > small').forEach(function (small) {
                    if (small.innerHTML !== "Ocupado")
                        small.innerHTML = "Disponible";

                });


                liHora.classList.remove("disponible");
                liHora.classList.add('seleccionado');


                liHora.querySelectorAll('.estado-hora > small').forEach(function (small) {

                    small.innerHTML = "Seleccionado";

                });
                idMedicoHoraSeleccionada = idMedicoHora;
                idMedicoSeleccionada = idMedico;
                idBloqueHoraSeleccionada = idBloqueHora;
                fechaSeleccionSeleccionada = fechaSeleccion;
                horaSeleccionada = horaText;
                seleccion = true;
            } else {
                Swal.fire("", "Horario no disponible", "warning");
            }
        });


        document.getElementById('listaHoras').appendChild(liHoraMedico);


    }
    async function guardarAtencion(idMedico, idBloqueHora, fechaSeleccion, idMedicoHora, uid) {


        //Verificamos si existe atencion

        let agendar = {
            id: parseInt(idAtencion),
            idBloqueHora: parseInt(idBloqueHora),
            fechaText: fechaSeleccion,
            triageObservacion: '',
            antecedentesMedicos: '',
            idPaciente: uid,
            SospechaCovid19: false,
            IdMedicoHora: parseInt(idMedicoHora),
            IdCliente: idCliente ? idCliente : 0
        };




        let resultado = await reagendarApp(agendar, idMedico, uid);

        if (resultado.err == 1) {
            return 1;
        }
        else if (resultado.err == 2) {
            return 2;
        }
        else {

            return resultado;
        }


    }

    document.getElementById("btnConfirmarHora").addEventListener("click", async function () {
        if (!seleccion) {
            Swal.fire("", "Debe seleccionar una hora", "warning");
            return;
        } else {
            $('#btnConfirmarHora').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            //Swal.fire("",idMedicoHoraSeleccionada + idAtencion+ idBloqueHoraSeleccionada,"question")

            let valida = await guardarAtencion(idMedicoSeleccionada,
                idBloqueHoraSeleccionada,
                moment(fechaSeleccion).format("DD-MM-YYYY"),
                idMedicoHoraSeleccionada,
                uid);
            if (valida.err == 1) {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
            else if (valida.err == 2) {
                Swal.fire("Error!", "Esta hora ya fue tomada, favor seleccionar otra hora", "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
            else if (valida.err == 3) {
                Swal.fire("Error!", valida.msg, "error");
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }

            else {
                // document.querySelector(".fecha" + idAtencion).innerHTML = moment(fechaSeleccion).format("DD/MM/YYYY")
                // document.querySelector(".hora" + idAtencion).innerHTML = horaSeleccionada;
                $(".fechaHora_" + idAtencion).html(moment(fechaSeleccion).format("DD/MM/YYYY") + ' | ' + horaSeleccionada);

                await comprobantePaciente(baseUrlWeb, valida.atencionModel);
                if (!window.host.includes('unabactiva.') &&
                    !window.host.includes('activa.unab.') &&
                    !window.host.includes('achs.') &&
                    !window.host.includes('uoh')) {
                    await enviarCitaEniax(valida.infoAtencion.idAtencion);
                    await cambioEstado(idAtencion, "E") // E = Anulada
                }
                $('#btnConfirmarHora').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                $('#modalReagendar').modal('hide');
                Swal.fire("Hora Reagendada", `Tú hora ha sido reagendada para el día  ${moment(fechaSeleccion).format("DD/MM/YYYY")} a las ${horaSeleccionada} hrs.`, "success")
                //location.reload();
            }



        }







    });
    function rangoHora(agendaMedico) {
        rangoIni = agendaMedico[0].horaDesdeText
        rangoFin = agendaMedico[agendaMedico.length - 1].horaDesdeText;
    }

}

