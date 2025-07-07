

import { TipoAtencion, valorizar } from "../apis/medipass-fetch.js";
import { putAgendarMedicosHoras, getAtencionByIdMedicoHora, getAgendaMedicoInicial, getMedicosHoraProximaValida } from '../apis/agendar-fetch.js?rnd=8';
import { getRutUsuario, personaFotoPerfil } from "../shared/info-user.js";
import { getHoraMedicoByCalendar } from '../apis/vwhorasmedicos-fetch.js?13';

var rutUsuario = "";

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}
var valorizacion = null;
var rangoIni;
var rangoFin;
var ultimaHoraLista;
var spanSelectorHorasR;
var spanSelectorHorasL;
export async function init(dataMedico) {

    //await datosUsuario();

    rutUsuario = await getRutUsuario();
    await personaFotoPerfil();
    let page = document.getElementById('page');

    page.innerHTML = "Agendar atención";
    if (tipoatencion == "I")
        page.innerHTML = "Atención Inmediata";
    var seleccion = false;
    var idMedicoHoraSeleccionada = 0;
    var idMedicoSeleccionada = 0;
    var idBloqueHoraSeleccionada = 0;
    var fechaSeleccionSeleccionada = "";
    var horaSeleccionada = "";
    //document.querySelector('#buttonConfirma').addEventListener("click", () => loadEdit(event), false);
    var fechaSeleccionEstatica = moment(fechaPrimeraHora);
    var fechaSeleccion = moment(fechaPrimeraHora);

    $('#kt_datepicker_6').datepicker('setDate', fechaSeleccion._d).datepicker('fill');
    //$('.new').hide() //oculta los días del mes siguiente, con la clase.new
    await pintaCalendar();

    async function pintaCalendar() {
        //obtener la data de los dias con la fecha seleccionada desde calendario
        var diasConAgenda = await getHoraMedicoByCalendar(idMedico, moment(fechaSeleccion).format('YYYYMMDD'), c, moment(fechaSeleccionEstatica).format('YYYYMMDD'), uid);
        diasConAgenda.forEach(itemDias => {
            var dia = itemDias.info;
            var mes = itemDias.fecha;
            if (itemDias.fecha >= moment().format()) {
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
            //var diaSeleccionado = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("DD")
            var m = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("MM"); //mes fecha seleccionada
            var mc = moment(mes).format('MM'); //mes fecha desde bd
            if (dia == item.innerHTML && m == mc && a == ac) {
                /*solo se pintan los dias que pertenezcan al dia, 
                mes y año de la fecha que se selecciono, los demas dias quedan desactivados en el siguiente paso*/
                if (!item.getAttribute('class').includes('new') && !item.getAttribute('class').includes('old')) {
                    item.classList.add('active');
                    var diaSeleccionado = moment(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss")).format("DD")
                    let diaCalendar = item.innerHTML;
                    if (diaCalendar.length == 1)
                        diaCalendar = `0${diaCalendar}`;
                    if (diaSeleccionado == diaCalendar) {
                        item.classList.remove('day');
                        item.setAttribute("style", "background:#1da70c")

                    }
                }


            }


        })
    }


    let initValue = 0;

    var horario = true;


    // Busqueda inicial
    var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
    var agendaMedico = await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"), idMedico, horario, true, c, uid, 0);

    await cargarInfoMedico(dataMedico);

    document.getElementById('listaHoras').innerHTML = "";


    var agendaIterar = agendaMedico.slice(initValue, 4);
    if (agendaMedico.length)
        rangoHora(agendaMedico);
    await cargaTituloHorario(agendaIterar[0]);

    agendaIterar.forEach(iterarAgendas);

    // Fin Busqueda inicial

    $('#btnManana').on('click', async function (ev) {
        $('#btnManana').addClass("active");
        $('#btnTarde').removeClass("active");
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        reloadData(true, 1); //Horario de mañana = 1
        await pintaCalendar();
    });

    $('#btnTarde').on('click', async function (ev) {
        $('#btnTarde').addClass("active");
        $('#btnManana').removeClass("active");
        reloadData(false, 2); //Horario de tarde = 2
        fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();
        await pintaCalendar();
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
        reloadData(horario, 0);
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

    var UrlTerminosyCondiciones = "/Terminosycondiciones/TERMINOSYCONDICIONES.pdf";
    if (window.host.includes("prevenciononcologica") || window.host.includes("masproteccionsalud")) {
        UrlTerminosyCondiciones = "https://medical.medismart.live/terminoscla/TERMINOSYCONDICIONESCLA.pdf";
    }
    var codigoPaisValida = document.getElementById('codigoPais').value;
    // Elements inside label
    if (codigoPaisValida == "CO") {
        UrlTerminosyCondiciones = "/documentosLegalesCO/TERMINOS-Y-CONDICIONES-GENERALES-DE-FUNCIONAMIENTO-Medical-Solutions-Colombia-S.A.pdf";
    }
    if (window.host.includes("unabactiva.")) {
        UrlTerminosyCondiciones = "https://medical.medismart.live/TerminosyCondicionesUnab/Terminos_y_Condiciones_VF.pdf";
    }
    if (codigoTelefono == "MX") {
        UrlTerminosyCondiciones = "/documentosLegalesMX/TerminosycondicionesMX.pdf";
    }
    if (codigoTelefono == "EC") {
        UrlTerminosyCondiciones = "/documentosLegalesEC/TERMINOS-Y-CONDICIONES-VIDEOCONSULTA-Medismart-Ecuador-SAS.pdf";
    }
    let terminos = document.getElementById('terminos');
    terminos.onclick = async () => {
        let modalBody = document.getElementById('modalBody');
        $("#modalBody").empty();
        let embed = document.createElement('embed');
        embed.src = UrlTerminosyCondiciones;
        embed.style.width = "100%";
        embed.style.height = "700px";
        modalBody.appendChild(embed);
        $("#modalTerminos").modal("show");
    }

    let consentimiento = document.getElementById('consentimiento');
    var urlConsentimiento = "https://medical.medismart.live/Consentimiento-Informado/Consentimiento-Informado.pdf";
    if (codigoPaisValida == "CO") {
        urlConsentimiento = "https://medical.medismart.live/documentosLegalesCO/CONSENTIMIENTO-INFORMADO-PARA-ATENCION-POR-TELEMEDICINA-Medical-Solutions-Colombia.pdf";
    }
    if (window.host.includes("unabactiva.")) {
        urlConsentimiento = "https://medical.medismart.live/TerminosyCondicionesUnab/Consentimiento_Informado_VF.pdf";
    }
    if (codigoTelefono == "MX") {
        urlConsentimiento = "https://medical.medismart.live/documentosLegalesMX/Consentimiento-InformadoMX.pdf";
    }
    if (codigoTelefono == "EC") {
        urlConsentimiento = "https://medical.medismart.live/documentosLegalesEC/CONSENTIMIENTO-INFORMADO-MEDISMART-ECUADOR-SAS.pdf";
    }
    if (consentimiento) {
        consentimiento.onclick = async () => {
            let modalBodyConsentimiento = document.getElementById('modalBodyConsentimiento');
            $("#modalBodyConsentimiento").empty();
            let embed = document.createElement('embed');
            embed.src = urlConsentimiento;
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyConsentimiento.appendChild(embed);
            $("#modalConsentimiento").modal("show");
        }
    }

    let deberes = document.getElementById('deberes');
    if (deberes) {
        deberes.onclick = async () => {
            let modalBodyDeberes = document.getElementById('modalBodyDeberes');
            $("#modalBodyDeberes").empty();
            let embed = document.createElement('embed');
            embed.src = "/DeberesDerechos/DerechosDeberes.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyDeberes.appendChild(embed);
            $("#modalDeberes").modal("show");
            if (codigoPaisValida == "CO") {
                embed.src = "https://medical.medismart.live/terminosycondicionesco/DerechosDeberes_CO.pdf";
            }
            if (codigoTelefono == "MX") {
                embed.src = "/documentosLegalesMX/DerechosDeberesMX.pdf";
            }
            if (codigoTelefono == "EC") {
                embed.src = "/documentosLegalesEC/DerechosDeberes_EC.pdf";
            }
            if (window.host.includes("prestasalud.")) {                
                embed.src = "https://medical.medismart.live/documentosLegalesPrestaSalud/DerechosDeberes_PS.pdf";
            }
        }
    }
    if (idCliente == 204) {
        let terminosClaro = document.getElementById('terminosClaro');
        if (terminosClaro) {
            terminosClaro.onclick = async () => {
                let modalBodyDeberes = document.getElementById('modalBodyClaro');
                $("#modalBodyClaro").empty();
                let embed = document.createElement('embed');
                embed.src = "/Terminosycondicionesclaro/Terminos_Claro.pdf";
                embed.style.width = "100%";
                embed.style.height = "700px";
                modalBodyDeberes.appendChild(embed);
                $("#modalTerminosClaro").modal("show");
            }
        }
    }
    if (codigoPaisValida == "CO") {
        let politicas = document.getElementById('politicas');
        if (politicas) {
            politicas.onclick = async () => {
                let modalBodyPoliticas = document.getElementById('modalBodyPoliticas');
                $("#modalBodyPoliticas").empty();
                let embed = document.createElement('embed');
                embed.src = "/documentosLegalesCO/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf";
                embed.style.width = "100%";
                embed.style.height = "700px";
                modalBodyPoliticas.appendChild(embed);
                $("#modalPoliticas").modal("show");
            }
        }
    }
    if (codigoPaisValida == "EC") {
        let politicas = document.getElementById('politicas');
        if (politicas) {
            politicas.onclick = async () => {
                let modalBodyPoliticas = document.getElementById('modalBodyPoliticas');
                $("#modalBodyPoliticas").empty();
                let embed = document.createElement('embed');
                embed.src = "/documentosLegalesEC/POLITICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medismart-Ecuador.pdf";
                embed.style.width = "100%";
                embed.style.height = "700px";
                modalBodyPoliticas.appendChild(embed);
                $("#modalPoliticas").modal("show");
            }
        }
    }

    var check = document.getElementById("aceptaTodo");
    if (check) {
        check.onchange = async () => {
            var aceptaTerminos = document.getElementById("aceptaTerminos");
            var aceptaConsentimiento = document.getElementById("aceptaConsentimiento");
            var aceptaTerminosClaro = document.getElementById("aceptaTerminosClaro"); // FILTRO SOLO PARA CLARO
            var aceptaCuentaPersonal = document.getElementById("aceptaCuentaPersonal"); // FILTRO SOLO PARA CLARO
            var buttonInside = document.getElementById("btnAceptar");
            if (check.checked) {
                aceptaTerminos.checked = true;
                aceptaConsentimiento.checked = true;
                if (aceptaCuentaPersonal)
                    aceptaCuentaPersonal.checked = true;
                aceptaCuentaPersonal ? aceptaCuentaPersonal.checked : null;
                if (idCliente == 204) aceptaTerminosClaro.checked = true;
                if (idCliente === 108) {
                    buttonInside.removeAttribute("disabled", "");
                }
            }
            else {
                aceptaTerminos.checked = false;
                aceptaConsentimiento.checked = false;
                if (aceptaCuentaPersonal)
                    aceptaCuentaPersonal.checked = false;
                if (idCliente == 204) aceptaTerminosClaro.checked = false;
                if (idCliente === 108) {
                    buttonInside.setAttribute("disabled", "true");
                }
            }

        }
    }
    var checkAceptTerminos = document.getElementById("aceptaTerminos");
    checkAceptTerminos.onchange = async () => {

        var aceptaTerminos = document.getElementById("aceptaTerminos");
        var aceptaConsentimiento = document.getElementById("aceptaConsentimiento");
        var aceptaCuentaPersonal = document.getElementById("aceptaCuentaPersonal");
        var buttonInside = document.getElementById("btnAceptar");
        if (aceptaTerminos.checked && aceptaConsentimiento.checked && aceptaCuentaPersonal.checked) {
            if (idCliente === 108) {
                buttonInside.removeAttribute("disabled", "");
            }
        } else {
            if (idCliente === 108) {
                buttonInside.setAttribute("disabled", "");
            }
        }
    }

    var checkAceptConsetimiento = document.getElementById("aceptaConsentimiento");
    if (checkAceptConsetimiento) {
        checkAceptConsetimiento.onchange = async () => {
            var aceptaTerminos = document.getElementById("aceptaTerminos");
            var aceptaConsentimiento = document.getElementById("aceptaConsentimiento");
            var aceptaCuentaPersonal = document.getElementById("aceptaCuentaPersonal");
            var buttonInside = document.getElementById("btnAceptar");

            if (aceptaTerminos.checked && aceptaConsentimiento.checked && aceptaCuentaPersonal.checked) {
                if (idCliente === 108) {
                    buttonInside.removeAttribute("disabled", "");
                }
            } else {
                if (idCliente === 108) {
                    buttonInside.setAttribute("disabled", "");
                }
            }
        }
    }

    var checkAceptCuentaPersonal = document.getElementById("aceptaCuentaPersonal");
    if (checkAceptCuentaPersonal) {
        checkAceptCuentaPersonal.onchange = async () => {
            var aceptaTerminos = document.getElementById("aceptaTerminos");
            var aceptaConsentimiento = document.getElementById("aceptaConsentimiento");
            var aceptaCuentaPersonal = document.getElementById("aceptaCuentaPersonal");
            var buttonInside = document.getElementById("btnAceptar");

            if (aceptaTerminos.checked && aceptaConsentimiento.checked && aceptaCuentaPersonal.checked) {
                if (idCliente === 108) {
                    buttonInside.removeAttribute("disabled", "");
                }
            } else {
                if (idCliente === 108) {
                    buttonInside.setAttribute("disabled", "");
                }
            }
        }
    }

    async function reloadData(manana, tipoHorario) {


        horario = manana;
        initValue = 0;
        var fechaSeleccion = $("#kt_datepicker_6").data('datepicker').getDate();

        agendaMedico =
            await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"),
                idMedico,
                horario,
                false, c, uid, tipoHorario);

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


    async function cargarInfoMedico(medico) {
        document.getElementById("divPerfilProfesional").innerHTML = "";

        let divPerfilProfesional = document.createElement('div');
        divPerfilProfesional.classList.add('perfil-profesional');


        //Header Perfil
        let divHeaderPerfil = document.createElement('div');
        divHeaderPerfil.classList.add('header-perfil');

        let divFotoProfesional = document.createElement('img');
        divFotoProfesional.classList.add('foto-profesional');

        var baseS3 = 'https://appdiscoec2.s3.amazonaws.com'

        if (!medico.personas.rutaAvatar.includes('Avatar.svg') && (!window.host.includes("unabactiva.") && !window.host.includes("activa.unab"))) {
            divFotoProfesional.src = baseS3 + medico.personas.rutaAvatar.replace(/\\/g, '/');
        } else if (window.host.includes("unabactiva.") || window.host.includes("activa.unab.")) {
            if (medico.personas.genero == "F") {
                divFotoProfesional.src = baseUrlWeb + '/img/unab/doctora.svg';
            } else {
                divFotoProfesional.src = baseUrlWeb + '/img/unab/doctor.svg';
            }
        }
        else {
            divFotoProfesional.src = baseUrlWeb + '/upload/foto_perfil/' + medico.personas.rutaAvatar;
        }


        //divFotoProfesional.src = foto;
        divHeaderPerfil.appendChild(divFotoProfesional);

        let divDataPerfil = document.createElement('div');
        divDataPerfil.classList.add('data');


        let spanNombreProfesional = document.createElement('span');
        spanNombreProfesional.classList.add('nombre-profesional');

        let spanPrefijoProfesional = document.createElement('span');
        spanPrefijoProfesional.classList.add('titulo-profesional');
        spanPrefijoProfesional.innerHTML = medico.personasDatos.prefijoDetalle + ' ';


        let labelNombreProfesional = document.createElement('span');
        labelNombreProfesional.innerHTML = medico.personas.nombreCompleto;

        spanNombreProfesional.appendChild(spanPrefijoProfesional);
        spanNombreProfesional.appendChild(labelNombreProfesional);


        let labelInstitucionProfesional = document.createElement('small');
        labelInstitucionProfesional.classList.add('d-block');
        labelInstitucionProfesional.innerHTML = `${medico.personasDatos.almaMater} - ${medico.personasDatos.numeroRegistro}`;
        labelNombreProfesional.appendChild(labelInstitucionProfesional);


        divDataPerfil.appendChild(spanNombreProfesional);

        let spanTituloProfesional = document.createElement('span');
        spanTituloProfesional.classList.add('titulo-profesional');
        spanTituloProfesional.innerHTML = medico.personasDatos.especialidad;


        divDataPerfil.appendChild(spanTituloProfesional);


        divHeaderPerfil.appendChild(divDataPerfil);

        divPerfilProfesional.appendChild(divHeaderPerfil);
        //Fin Header Perfil

        //Body Profesional
        let divBodyProfesional = document.createElement('div');
        divBodyProfesional.classList.add('body-profesional');

        let parrafoInfo = document.createElement('p');
        parrafoInfo.innerHTML = medico.personasDatos.infoPersona1;
        divBodyProfesional.appendChild(parrafoInfo);

        var labelValor = "Valor Consulta Particular ";
        if (idCliente == "148")
            labelValor = "Valor a pagar ";
        //medico.personasDatos.valorAtencion
        if (m === "2") {
            if (r === "1" || r === "2") {

                valorizacion = await valorizar(medico.personasDatos.especialidad,
                    rutUsuario,
                    medico.personas.identificador,
                    medico.personasDatos.codigoPrestacion,
                    document.getElementById('genero').value,
                    document.getElementById('fechaNacimiento').value,
                    medico.personasDatos.valorAtencion,
                    medico.personasDatos.idSucursal.toString(),
                    medico.personasDatos.idLugarAtencion.toString(), 0,
                    false);
                let divValorConsulta = document.createElement('div');
                divValorConsulta.classList.add('valor-consulta');


                let spanValorConvenio = document.createElement('span');
                spanValorConvenio.classList.add('label-valor');
                spanValorConvenio.innerHTML = labelValor;
                divValorConsulta.appendChild(spanValorConvenio);

                let spanVConvenio = document.createElement('span');
                spanVConvenio.classList.add('valor');
                let smallSimbolo = document.createElement('small');
                smallSimbolo.innerHTML = "$ ";
                spanVConvenio.appendChild(smallSimbolo);
                let spanPrecioConvenio = document.createElement('label');

                spanPrecioConvenio.innerHTML = formatNumber(medico.personasDatos.valorAtencion);
                spanVConvenio.appendChild(spanPrecioConvenio);

                divValorConsulta.appendChild(spanVConvenio);

                divBodyProfesional.appendChild(divValorConsulta);
            }
            else {
                let tituloConvenios = document.createElement('h3');
                tituloConvenios.innerHTML = "Convenios";
                divBodyProfesional.appendChild(tituloConvenios);

                let divImagenesConvenios = document.createElement('div');
                divImagenesConvenios.classList.add('cont-convenios');

                let divWebPay = document.createElement('img');
                divWebPay.classList.add('img-convenio');
                divWebPay.classList.add('mr-5');
                divWebPay.src = "/img/webpay.png";
                divImagenesConvenios.appendChild(divWebPay);

                let divFonasa = document.createElement('img');
                divFonasa.classList.add('img-convenio');
                //divFonasa.src = "/img/fonasa.svg";
                divImagenesConvenios.appendChild(divFonasa);

                divBodyProfesional.appendChild(divImagenesConvenios);


                valorizacion = await valorizar(medico.personasDatos.especialidad,
                    rutUsuario,
                    medico.personas.identificador,
                    medico.personasDatos.codigoPrestacion,
                    document.getElementById('genero').value,
                    document.getElementById('fechaNacimiento').value,
                    medico.personasDatos.valorAtencion,
                    medico.personasDatos.idSucursal.toString(),
                    medico.personasDatos.idLugarAtencion.toString(), 0,
                    true);

                if (!valorizacion.particular) {

                    let divValorConsulta = document.createElement('div');
                    divValorConsulta.classList.add('valor-consulta');


                    let spanValorConvenio = document.createElement('span');
                    spanValorConvenio.classList.add('label-valor');
                    spanValorConvenio.innerHTML = labelValor;
                    divValorConsulta.appendChild(spanValorConvenio);

                    let spanVConvenio = document.createElement('span');
                    spanVConvenio.classList.add('valor');
                    let smallSimbolo = document.createElement('small');
                    smallSimbolo.innerHTML = "$ ";
                    spanVConvenio.appendChild(smallSimbolo);
                    let spanPrecioConvenio = document.createElement('label');

                    spanPrecioConvenio.innerHTML = formatNumber(valorizacion.valorConvenio);
                    spanVConvenio.appendChild(spanPrecioConvenio);

                    divValorConsulta.appendChild(spanVConvenio);

                    divBodyProfesional.appendChild(divValorConsulta);


                    if (valorizacion.aporteCaff != 0) {
                        let divAporteCaja = document.createElement('div');
                        divAporteCaja.classList.add('valor-consulta');


                        let spanAporteCaja = document.createElement('span');
                        spanAporteCaja.classList.add('label-valor');
                        spanAporteCaja.innerHTML = "Aporte caja compensación ";
                        divAporteCaja.appendChild(spanAporteCaja);

                        let spanVCaja = document.createElement('span');
                        spanVCaja.classList.add('valor');
                        let smallSimbolo = document.createElement('small');
                        smallSimbolo.innerHTML = "$ ";
                        spanVCaja.appendChild(smallSimbolo);
                        let spanPrecioCaja = document.createElement('label');

                        spanPrecioCaja.innerHTML = formatNumber(valorizacion.aporteCaff);
                        spanVCaja.appendChild(spanPrecioCaja);

                        divAporteCaja.appendChild(spanVCaja);

                        divBodyProfesional.appendChild(divAporteCaja);
                    }
                    if (valorizacion.aporteFinanciador != 0) {

                        let divAporteFinanciador = document.createElement('div');
                        divAporteFinanciador.classList.add('valor-consulta');


                        let spanAporteFinanciador = document.createElement('span');
                        spanAporteFinanciador.classList.add('label-valor');
                        spanAporteFinanciador.innerHTML = "Aporte financiador ";
                        divAporteFinanciador.appendChild(spanAporteFinanciador);

                        let spanVFinanciador = document.createElement('span');
                        spanVFinanciador.classList.add('valor');
                        let smallSimbolo = document.createElement('small');
                        smallSimbolo.innerHTML = "$ ";
                        spanVFinanciador.appendChild(smallSimbolo);
                        let spanPrecioFinanciador = document.createElement('label');

                        spanPrecioFinanciador.innerHTML = formatNumber(valorizacion.aporteFinanciador);
                        spanVFinanciador.appendChild(spanPrecioFinanciador);

                        divAporteFinanciador.appendChild(spanVFinanciador);

                        divBodyProfesional.appendChild(divAporteFinanciador);
                    }
                    if (valorizacion.copago != 0) {
                        let divCopago = document.createElement('div');
                        divCopago.classList.add('valor-consulta');


                        let spanCopago = document.createElement('span');
                        spanCopago.classList.add('label-valor');
                        spanCopago.innerHTML = "Copago ";
                        divCopago.appendChild(spanCopago);

                        let spanVCopago = document.createElement('span');
                        spanVCopago.classList.add('valor');
                        let smallSimbolo = document.createElement('small');
                        smallSimbolo.innerHTML = "$ ";
                        spanVCopago.appendChild(smallSimbolo);
                        let spanPrecioCopago = document.createElement('label');

                        spanPrecioCopago.innerHTML = formatNumber(valorizacion.copago);
                        spanVCopago.appendChild(spanPrecioCopago);

                        divCopago.appendChild(spanVCopago);

                        divBodyProfesional.appendChild(divCopago);
                    }
                }
                else {
                    let divValorConsulta = document.createElement('div');
                    divValorConsulta.classList.add('valor-consulta');


                    let spanValorConvenio = document.createElement('span');
                    spanValorConvenio.classList.add('label-valor');
                    spanValorConvenio.innerHTML = labelValor;
                    divValorConsulta.appendChild(spanValorConvenio);

                    let spanVConvenio = document.createElement('span');
                    spanVConvenio.classList.add('valor');
                    let smallSimbolo = document.createElement('small');
                    smallSimbolo.innerHTML = "$ ";
                    spanVConvenio.appendChild(smallSimbolo);
                    let spanPrecioConvenio = document.createElement('label');

                    spanPrecioConvenio.innerHTML = formatNumber(valorizacion.valorConvenio);
                    spanVConvenio.appendChild(spanPrecioConvenio);

                    divValorConsulta.appendChild(spanVConvenio);

                    divBodyProfesional.appendChild(divValorConsulta);
                }


            }
        }





        divPerfilProfesional.appendChild(divBodyProfesional);
        //Fin Body Profesional
        //Fin Body Profesional

        //check Acepta todo

        let contCheckAceptaTodo = document.createElement('div');
        contCheckAceptaTodo.classList.add('text-left');

        let checkAceptaTodo = document.createElement('input');
        checkAceptaTodo.type = 'checkbox';
        checkAceptaTodo.id = 'aceptaTodo';
        checkAceptaTodo.name = 'aceptaTodo';
        checkAceptaTodo.classList.add('form-check-label');

        let labelCheckAceptaTodo = document.createElement('label');
        labelCheckAceptaTodo.htmlFor = 'aceptaTodo';
        labelCheckAceptaTodo.classList.add('fuente-accesible');
        //labelCheckAceptaTodo.setAttribute('style', 'margin-top: -15px; margin-left:5px;')
        // Elements inside label
        labelCheckAceptaTodo.innerHTML = ` Aceptar Todo`;

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
        let codigoPais = document.getElementById('codigoPais').value;
        // Elements inside label

        if (window.host.includes('clinicamundoscotia.')) {

            labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/Terminosycondiciones/TERMINOSYCONDICIONES.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina de Clinica Online. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma Clinica Online.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/}DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la consulta de telemedicina.
                                                `;
        }
        else if (window.host.includes('prevenciononcologica.')) {

            labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/terminoscla/TERMINOSYCONDICIONESCLA.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina Onocológica. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma Oncológica.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/}DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la consulta de telemedicina.
                                                `;
        }
        else if (window.host.includes('saludtumundoseguro.')) {

            labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/terminoscla/TERMINOSYCONDICIONESCLA.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina de Tumundoseguro. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma de Tumundoseguro.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/}DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la consulta de telemedicina.
                                                `;
        }
        else if (window.host.includes('masproteccionsalud.')) {

            labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/terminoscla/TERMINOSYCONDICIONESCLA.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina +Protección. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma +Protección.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/}DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la consulta de telemedicina.
                                                `;
        }
        else if (window.host.includes('unabactiva.')) {

            labelCheckAceptacion.innerHTML = `*Acepto los <a href="/TerminosyCondicionesUnab/Terminos_y_Condiciones_VF.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de teleatención de UNAB Activa. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de teleatención es proporcionado por el profesional y facilitado por la plataforma UNAB Activa.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/}DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la teleatención.
                                                `;
        }
        else if (window.host.includes('prestasalud.')) {
            labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/documentosLegalesEC/TERMINOS-Y-CONDICIONES-VIDEOCONSULTA-Medismart-Ecuador-SAS.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de Telemedicina de ${textoMarca}.
                                                Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> <strong>AVISO:</strong>
                                                El servicio de consulta de Telemedicina online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/documentosLegalesPrestaSalud/DerechosDeberes_PS.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
                                                para la consulta de telemedicina.
                                                `;
        }
        else {

            if (codigoPais == "CO" || window.host.includes('gallagher.') || window.host.includes('aecsa.') || window.host.includes('ajg.medismart.')) {
                labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/documentosLegalesCO/TERMINOS-Y-CONDICIONES-GENERALES-DE-FUNCIONAMIENTO-Medical-Solutions-Colombia-S.A.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de Telemedicina de ${textoMarca}.
                                                Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> <strong>AVISO:</strong>
                                                El servicio de consulta de Telemedicina online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/terminosycondicionesco/DerechosDeberes_CO.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
                                                para la consulta de telemedicina.
                                                `;
            } else if (codigoPais == "MX") {
                labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/documentosLegalesMX/TerminosycondicionesMX.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de Telemedicina de ${textoMarca}.
                                                Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> <strong>AVISO:</strong>
                                                El servicio de consulta de Telemedicina online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/documentosLegalesMX/DerechosDeberesMX.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
                                                para la consulta de telemedicina.
                                                `;
            } else if (codigoPais == "EC") {
                labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/documentosLegalesEC/TERMINOS-Y-CONDICIONES-VIDEOCONSULTA-Medismart-Ecuador-SAS.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de Telemedicina de ${textoMarca}.
                                                Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> <strong>AVISO:</strong>
                                                El servicio de consulta de Telemedicina online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/documentosLegalesEC/DerechosDeberes_EC.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
                                                para la consulta de telemedicina.
                                                `;
            }
            else {
                labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/Terminosycondiciones/TERMINOSYCONDICIONES.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a> 
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas Tele-medica de ${textoMarca}. 
                                                Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> <strong>AVISO:</strong>
                                                El servicio de consulta Tele-medica online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
                                                para la consulta Tele-medica.
                                                `;
            }
        }

        //check Acepta concentimiento
        let contCheckAceptaConsentimiento = document.createElement('div');
        contCheckAceptaConsentimiento.classList.add('check-aceptacion');

        let checkAceptaConsentimiento = document.createElement('input');
        checkAceptaConsentimiento.type = 'checkbox';
        checkAceptaConsentimiento.id = 'aceptaConsentimiento';
        checkAceptaConsentimiento.name = 'aceptaConsentimiento';
        checkAceptaConsentimiento.classList.add('form-check-label');

        let labelCheckAceptaConsentimiento = document.createElement('label');
        labelCheckAceptaConsentimiento.htmlFor = 'aceptaConsentimiento';
        labelCheckAceptaConsentimiento.classList.add('fuente-accesible');
        //labelCheckAceptaConsentimiento.setAttribute('style', 'margin-top: -15px;')
        // Elements inside label
        if (codigoPais == "CO") {
            labelCheckAceptaConsentimiento.innerHTML = `He leído y acepto el
        <a href="https://medical.medismart.live/documentosLegalesCO/CONSENTIMIENTO-INFORMADO-PARA-ATENCION-POR-TELEMEDICINA-Medical-Solutions-Colombia.pdf" target="_blank" class="d-inline-block d-lg-none">consentimiento informado</a> 
        <a href="javascript:void(0);" id="consentimiento" class="d-none d-lg-inline-block fuente-accesible">consentimiento informado</a>  `;
        }
        else if (codigoPais == "EC") {
            labelCheckAceptaConsentimiento.innerHTML = `He leído y acepto el
        <a href="https://medical.medismart.live/documentosLegalesEC/CONSENTIMIENTO-INFORMADO-MEDISMART-ECUADOR-SAS.pdf" target="_blank" class="d-inline-block d-lg-none">consentimiento informado</a> 
        <a href="javascript:void(0);" id="consentimiento" class="d-none d-lg-inline-block fuente-accesible">consentimiento informado</a>  `;
        }
        else if (window.host.includes("unabactiva.")) {
            labelCheckAceptaConsentimiento.innerHTML = `He leído y acepto el
        <a href="/TerminosyCondicionesUnab/Consentimiento_Informado_VF.pdf" target="_blank" class="d-inline-block d-lg-none">Consentimiento Informado</a> 
        <a href="javascript:void(0);" id="consentimiento" class="d-none d-lg-inline-block fuente-accesible">Consentimiento Informado</a>  `;
        }
        else {
            labelCheckAceptaConsentimiento.innerHTML = `He leído y acepto el
        <a href="https://medical.medismart.live/Consentimiento-Informado/Consentimiento-Informado.pdf" target="_blank" class="d-inline-block d-lg-none">consentimiento informado</a> 
        <a href="javascript:void(0);" id="consentimiento" class="d-none d-lg-inline-block fuente-accesible">consentimiento informado</a>  `;
        }

        // check cuenta personal
        let contCheckAceptaCuentaPersonal = document.createElement('div');
        contCheckAceptaCuentaPersonal.classList.add('check-aceptacion');

        let checkAceptaCuentaPersonal = document.createElement('input');
        checkAceptaCuentaPersonal.type = 'checkbox';
        checkAceptaCuentaPersonal.id = 'aceptaCuentaPersonal';
        checkAceptaCuentaPersonal.name = 'aceptaCuentaPersonal';
        checkAceptaCuentaPersonal.classList.add('form-check-label');

        let labelCheckAceptaCuentaPersonal = document.createElement('label');
        labelCheckAceptaCuentaPersonal.htmlFor = 'aceptaCuentaPersonal';
        labelCheckAceptaCuentaPersonal.classList.add('fuente-accesible');
        //labelCheckAceptaCuentaPersonal.setAttribute('style', 'margin-top: -15px;')
        // Elements inside label
        labelCheckAceptaCuentaPersonal.innerHTML = `Declaro que reconozco que la cuenta es personal e intransferible, que los datos contenidos son personales y sensibles, por lo que no podrán ser utilizados por otra persona que no sea el titular`;
        if (codigoPais == "CO") {
            labelCheckAceptaCuentaPersonal.innerHTML = `Declaro que reconozco que la cuenta es personal e intransferible, que los datos contenidos son personales y sensibles, por lo que no podrán ser utilizados por otra persona que no sea el titular
            <a href="/Terminosycondiciones_Co/POLÍTICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf" target="_blank" class="d-inline-block d-lg-none"></a>
            <a href="javascript:void(0);" id="politicas" class="d-none d-lg-inline-block">Políticas de privacidad</a> `;
        }

        // INICIO TERMINOS CLARO
        let contCheckAceptaClaro = document.createElement('div');
        contCheckAceptaClaro.classList.add('check-aceptacion');
        let checkAceptacionClaro = document.createElement('input');
        checkAceptacionClaro.type = 'checkbox';
        checkAceptacionClaro.id = 'aceptaTerminosClaro';
        checkAceptacionClaro.name = 'aceptaTerminosClaro';
        checkAceptacionClaro.classList.add('form-check-label');

        let labelClaroAceptacion = document.createElement('label');
        labelClaroAceptacion.htmlFor = 'aceptaTerminosClaro';
        labelClaroAceptacion.classList.add('fuente-accesible');
        //labelClaroAceptacion.setAttribute('style', 'margin-top: -15px;')
        labelClaroAceptacion.innerHTML = `*Declaro haber leído, y aceptar expresamente <a href="https://medical.medismart.live/Terminosycondicionesclaro/Terminos_Claro.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
        <a href="javascript:void(0);" id="terminosClaro" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> que regulan el beneficio otorgado por Claro`;
        // FIN TERMINOS CLARO

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
        //labelCheckAceptacionInvitado.setAttribute('style', 'margin-top: -15px;')

        // Elements inside label
        labelCheckAceptacionInvitado.innerHTML = `Acepto que esta atención es de carácter docente-asistencial pudiendo existir la posibilidad de ser atendido/a por el profesional, acompañado por estudiantes del área de la salud.`;

        // Cuenta personal
        contCheckAceptaCuentaPersonal.appendChild(checkAceptaCuentaPersonal);
        contCheckAceptaCuentaPersonal.appendChild(labelCheckAceptaCuentaPersonal);
        if (window.especialidadFila != 77) {
            contCheckAceptaTodo.appendChild(checkAceptaTodo);
            contCheckAceptaTodo.appendChild(labelCheckAceptaTodo);

            // Aceptación
            contCheckAceptacion.appendChild(checkAceptacion);
            contCheckAceptacion.appendChild(labelCheckAceptacion);
            // Consentimiento
            contCheckAceptaConsentimiento.appendChild(checkAceptaConsentimiento);
            contCheckAceptaConsentimiento.appendChild(labelCheckAceptaConsentimiento);
            if (idCliente == 204) {
                contCheckAceptaClaro.appendChild(checkAceptacionClaro); // FILTRO SOLO PARA CLARO
                contCheckAceptaClaro.appendChild(labelClaroAceptacion);
            }
            contCheckAceptacionInvitado.appendChild(checkAceptacionInvitado);
            contCheckAceptacionInvitado.appendChild(labelCheckAceptacionInvitado);

            divPerfilProfesional.appendChild(contCheckAceptaTodo);
            divPerfilProfesional.appendChild(contCheckAceptacion);
            divPerfilProfesional.appendChild(contCheckAceptaConsentimiento);
            if (idCliente == 204) {
                divPerfilProfesional.appendChild(contCheckAceptaClaro); //PONER FILTRO SOLO PARA CLARO
            }
            if (medico.personasDatos.especialidad.includes("Veterinaria")) {
                //    contCheckAceptaConsentimiento.classList.add('d-none');
                contCheckAceptaTodo.classList.add('d-none');
                contCheckAceptaConsentimiento.classList.add('d-none');
                checkAceptaConsentimiento.checked = true;
            }
            divPerfilProfesional.appendChild(contCheckAceptacionInvitado);
        }
        if (!window.host.includes("prevenciononcologica.") && !window.host.includes("saludproteccion") && !window.host.includes("clinicamundoscotia.") && !window.host.includes("masproteccionsalud.")) {
            // Cuenta personal
            divPerfilProfesional.appendChild(contCheckAceptaCuentaPersonal);
        }

        //Fin Check Aceptacion


        //if (medico.personasDatos.especialidad.includes("Veterinaria")) {
        //    contCheckAceptaTodo.classList.add('d-none');
        //    contCheckAceptaConsentimiento.classList.add('d-none');
        //    checkAceptaConsentimiento.checked = true;
        //}




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

        buttonInside1.onclick = function () {
            history.back();
        }

        let buttonInside = document.createElement('button');
        buttonInside.id = "btnAceptar";

        if (idCliente === 108) {
            buttonInside.setAttribute("disabled", "");
        }
        if (window.especialidadFila == 77 && idCliente == 108)
            buttonInside.removeAttribute("disabled");
        buttonInside.setAttribute('class', 'btn btn-primary btn-block btn-sm nroPlan='+idCliente);

        if (idCliente === 108) {
            buttonInside.innerHTML = "Agendar";
        } else {
            buttonInside.innerHTML = "Aceptar";
        }


        // Funcion boton cancelar
        // Funcion boton aceptar
        buttonInside.addEventListener("click", async function () {
            this.classList.add("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
            this.setAttribute("disabled", true);

            if (window.especialidadFila != 77) {
                if (!document.getElementById('aceptaTerminos').checked) {
                    Swal.fire(
                        '',
                        'Debes aceptar los términos y condiciones.',
                        'warning'
                    );
                    return;
                }

                if (!document.getElementById('aceptaConsentimiento').checked) {
                    Swal.fire(
                        '',
                        'Debes aceptar consentimiento informado.',
                        'warning'
                    );
                    return;
                }

                if (idCliente == 204 && !document.getElementById('aceptaTerminosClaro').checked) { //FILTRO PARA CLARO
                    Swal.fire(
                        '',
                        'Debes aceptar los términos y condiciones de Claro.',
                        'warning'
                    );
                    return;
                }
            }
            if (!window.host.includes("prevenciononcologica.") && !window.host.includes("masproteccionsalud.") && !window.host.includes("saludproteccion") && !window.host.includes("clinicamundoscotia.") && !document.getElementById('aceptaCuentaPersonal').checked) {
                Swal.fire(
                    '',
                    'Debes aceptar las condiciones de uso de la cuenta.',
                    'warning'
                );
                return;
            }
            //if (document.getElementById('aceptaTerminos').checked && document.getElementById('aceptaConcentimiento').checked) {
            if (!seleccion) {
                Swal.fire("", "Debes seleccionar una hora", "warning");
            } else {
                //validación reglas convenio
                //let getHoraValida = await getMedicosHoraProximaValida(uid, idMedicoHoraSeleccionada);
                //if (getHoraValida.swalVisible) {
                //    swal.fire({
                //        title: getHoraValida.titleSwal,
                //        html: getHoraValida.mensajeRetorno,
                //        type: 'info',
                //        showCancelButton: false,
                //        reverseButtons: true,
                //        cancelButtonText: 'Cancelar',
                //        confirmButtonText: getHoraValida.buttonType,
                //        //allowOutsideClick: false,
                //        //allowEscapekey: false
                //    }).then(async function (result) {
                //        if (result.value) {
                //            switch (getHoraValidatipoMensaje) {
                //                case "1":
                //                    await sendContacto(getHoraValida.textMail);
                //                    Swal.fire("Un ejecutivo se pondrá en contacto a la brevedad")
                //                    break;
                //                case "2":
                //                    break;
                //                default:
                //                    break;
                //            }
                //        }

                //    });

                //    return;
                //}
                let valida = await guardarAtencion(idMedicoSeleccionada,
                    idBloqueHoraSeleccionada,
                    moment(fechaSeleccion).format("DD-MM-YYYY"),
                    idMedicoHoraSeleccionada,
                    uid);
                if (valida.err == 1) {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                    this.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
                    this.setAttribute("disabled", false);
                }
                else if (valida.err == 2) {
                    Swal.fire("", "Lo sentimos, esta hora ya no está disponible.", "info");
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                    this.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
                    this.setAttribute("disabled", false);
                }
                else if (valida.err == 3) {
                    Swal.fire("Error!", valida.msg, "error");
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                    this.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
                    this.setAttribute("disabled", false);
                }
                else {
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                    var url = "/Paciente/Agenda_3" + "?idMedicoHora=" + idMedicoHoraSeleccionada + "&idMedico=" + idMedicoSeleccionada + "&idBloqueHora=" + idBloqueHoraSeleccionada + "&fechaSeleccion=" + fechaSeleccionSeleccionada + "&hora=" + horaSeleccionada + "&horario=" + horario + "&idAtencion=" + valida.infoAtencion.idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + parseInt(medico.personasDatos.idEspecialidad) + "&tipoEspecialidad=" + window.tipoEspecialidad;
                    window.location.href = url;

                    /*if (m ==1) {
                        var url = "/Paciente/ConfirmarAtencion?idMedicoHora=" + idMedicoHoraSeleccionada + "&idMedico=" + idMedicoSeleccionada + "&idBloqueHora=" + idBloqueHoraSeleccionada + "&fechaSeleccion=" + fechaSeleccionSeleccionada + "&hora=" + horaSeleccionada + "&horario=" + horario + "&idAtencion=" + valida.infoAtencion.idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + parseInt(medico.personasDatos.idEspecialidad);

                    } else if (m == 2) {
                        var url = "/Paciente/Agenda_4?idMedicoHora=" + idMedicoHoraSeleccionada + "&idMedico=" + idMedicoSeleccionada + "&idBloqueHora=" + idBloqueHoraSeleccionada + "&fechaSeleccion=" + fechaSeleccionSeleccionada + "&hora=" + horaSeleccionada + "&horario=" + horario + "&idAtencion=" + valida.infoAtencion.idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + parseInt(medico.personasDatos.idEspecialidad);

                    }

                     window.location.href = "https://smartcheckapp.medismart.live/?userID=" + uid + "&link=https://localhost:44363" + (url);*/

                }



            }
            //} else {
            //    Swal.fire(
            //        '',
            //        'Debes aceptar los términos y condiciones.',
            //        'warning'
            //    )
            //}






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



        //CargamosInfoPrimeraHora




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


        let spanTituloDataHorario = document.createElement('div');
        spanTituloDataHorario.classList.add('titulo-data-horario', 'fuente-accesible');
        spanTituloDataHorario.innerHTML = "Agenda " + medico.textoHorario;

        let rangoHorario = document.createElement('div');
        rangoHorario.classList.add('rango-horario');

        if (idCliente === 108) {
            rangoHorario.innerHTML = `Horario de atención: <br> de ${rangoIni} Hrs. a ${rangoFin} hrs.`;
        } else {
            rangoHorario.innerHTML = `De ${rangoIni} Hrs. a ${rangoFin} hrs.`;
        }



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
            //ultimaHoraLista = document.querySelectorAll('.detalle-hora')[document.querySelectorAll('.detalle-hora').length - 1].innerText;
            //agendaMedico.slice(initValue, initValue + 4).forEach(iterarAgendas);

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
        liHoraMedico.setAttribute('data-pa', medico.profesionalesAsociados);
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
            var asociados = liHora.getAttribute('data-pa');

            var spanAsociados = document.getElementById('spanAsociados');
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
                if (asociados == "true") {
                    spanAsociados.hidden = false
                }
                else {
                    var check = document.querySelector('[name="aceptaTerminosInvitado"]');
                    if (check) {
                        check.checked = false;
                        spanAsociados.hidden = true;
                    }

                }


            } else {
                Swal.fire("", "Horario no disponible", "warning");
            }
        });


        document.getElementById('listaHoras').appendChild(liHoraMedico);


    }



    async function guardarAtencion(idMedico, idBloqueHora, fechaSeleccion, idMedicoHora, uid) {

 
        //Verificamos si existe atencion
        var atencion = await getAtencionByIdMedicoHora(idMedicoHora, uid);

        var idAtencion = 0;
        if (atencion && atencion.atencion && atencion.atencion.id !== 0)
            idAtencion = atencion.atencion.id;

        let isChecked = false;
        var check = document.querySelector('[name="aceptaTerminosInvitado"]');
        if (check)
            isChecked = check.checked;
        let agendar;
        if (window.idProgramaSalud != 0 && window.isProgramaSalud != false)

            agendar = {
                id: parseInt(idAtencion),
                idBloqueHora: parseInt(idBloqueHora),
                fechaText: fechaSeleccion,
                triageObservacion: '',
                antecedentesMedicos: '',
                idPaciente: uid,
                SospechaCovid19: false,
                IdMedicoHora: parseInt(idMedicoHora),
                Estado: 'P',
                AceptaProfesionalInvitado: isChecked,
                idCliente: idCliente,
                idProgramaSalud: parseInt(window.idProgramaSalud),
                isProgramaSalud: true,
            };
        else {
            agendar = {
                id: parseInt(idAtencion),
                idBloqueHora: parseInt(idBloqueHora),
                fechaText: fechaSeleccion,
                triageObservacion: '',
                antecedentesMedicos: '',
                idPaciente: uid,
                SospechaCovid19: false,
                IdMedicoHora: parseInt(idMedicoHora),
                Estado: 'P',
                AceptaProfesionalInvitado: isChecked,
                idCliente: idCliente
            };
        }

        if (valorizacion) {
            agendar.aporteFinanciador = valorizacion.aporteFinanciador;
            agendar.aporteSeguro = valorizacion.aporteSeguro;
            agendar.copago = valorizacion.copago;
            agendar.valorConvenio = valorizacion.valorConvenio;
            agendar.Particular = valorizacion.particular;
        }


        let resultado = await putAgendarMedicosHoras(agendar, idMedico, uid);

        //if (resultado.err == 1) {
        //    return 1;
        //}
        //else if (resultado.err == 2) {
        //    return 2;
        //}
        /* else {*/
        //if (connection.state === signalR.HubConnectionState.Connected) {
        //    connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {
        //        connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), resultado.infoAtencion.fecha, resultado.infoAtencion.horaDesdeText).then(r => {
        //            connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
        //        }).catch(err => console.error(err));
        //    }).catch((err) => {
        //        return console.error(err.toString());
        //    });
        //}

        //connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {
        //    return console.error(err.toString());
        //});

        return resultado;
        //}


    }
};

function rangoHora(agendaMedico) {
    rangoIni = agendaMedico[0].horaDesdeText
    rangoFin = agendaMedico[agendaMedico.length - 1].horaDesdeText;
}
