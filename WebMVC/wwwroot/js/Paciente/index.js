import { saludoPaciente } from '../shared/info-user.js?rnd=4';
import { getDatosPaciente, EditPhoneEmail, logPacienteViaje } from '../apis/personas-fetch.js';
import { putEliminarAtencion, confirmaPaciente, reagendarApp, putAgendarMedicosHoras, getAgendaMedicoInicial } from '../apis/agendar-fetch.js';
import { comprobanteAnulacion, comprobantePaciente } from '../apis/correos-fetch.js?1';
import { getHoraMedicoByCalendar } from '../apis/vwhorasmedicos-fetch.js';
import { cambioEstado, enviarCitaEniax } from "../apis/eniax-fetch.js";
var nombre;
var apellidoPaterno;
var apellidoMaterno;
var correo;
var telefono;
var telefonoMovil;
var genero;
var direccion;
var fNacimiento;
var connection;
var parsedUrl = new URL(window.location.href);
let nsp = parsedUrl.href.substring(parsedUrl.href.lastIndexOf('=') + 1);
var idMedico;
var cliente;
var validarNSP = false;

function isUnab() {
    return parsedUrl.host.includes("unabactiva.") || parsedUrl.host.includes("activa.unab.")
}

const asyncIntervals = [];

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
export async function init(data) {
    await indexRealTime(uid);
    var fechaHoy = moment().format("DD-MM-YYYY");
   
    if (data.timelineData.length > 0) {
        await Index(data.timelineData.filter(itemF => !itemF.atencionDirecta && moment(itemF.fecha).format("DD-MM-YYYY") == fechaHoy));
    }
    
    ProximasAtenciones(data.proximasHorasPaciente);
    await saludoPaciente();


    if ($('#kt_widget2_tab1_content').children().length == 0 && $('#atenciones').children().length == 0)
        document.getElementById('divSinAtenciones').hidden = false;

    if ($("#atencionesPreviasColmena").length) {
        document.getElementById("atencionesPreviasColmena").onclick = () => {
            Swal.fire({
                title: 'Atenciones previas',
                html: `Estimado(a) afiliado(a): La actualización de la plataforma, junto a las mejoras realizadas, consideró un cambio de prestador para el servicio de telemedicina.
                       </br></br> El historial clínico es considerado un dato sensible que pertenece al paciente y que, de acuerdo con la Ley 20.584 de derechos y deberes de los pacientes, no puede ser traspasado de un prestador a otro.
                       Por lo anterior, en caso de querer acceder a tu historial de atenciones previas, puedes hacerlo ingresando al sitio web del antiguo prestado <a target="_blank" id="redireccion" href="https://www.mediclic.cl">www.mediclic.cl</a>, con tus antiguas credenciales
                       de Doctor Online o recuperar tu clave de acceso en el mismo sitio.`,
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Ir a Mediclic",
                reverseButton: true,
                type: 'info',
            }).then(async (result) => {
                if (result.value) {
                    var link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                    link.href = 'http://www.mediclic.cl';
                    link.target = '_blank';
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': false,
                        'cancelable': true
                    });
                    link.dispatchEvent(event);
                    
                  
                }
                
            })
        }
    }
}

async function Index(data) {
    
    $("#atenciones").empty();
    data.forEach(item => {
        if (item.nsp)
            return;
        let link = document.createElement('a')
        let classLink = `link-aviso`;
        link.setAttribute('class', classLink);
        var atencionAhora = moment(item.fecha).format("YYYY-MM-DD") + " " + moment(item.horaDesdeText, 'hh:mm:ss').format("HH:mm");;
        link.onclick = async() => {
            var log = {
                IdPaciente: uid,
                Evento: "Paciente presiona link para ingresar al box",
                IdAtencion: parseInt(item.idAtencion)
            }
            await logPacienteViaje(log);
            var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(5, 'minutes').format('HH:mm');
            
            if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
                Swal.fire("Ya han pasado 5 min. desde que comenzó tu atención, se ha cancelado", "", "warning")
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

        let divContent = document.createElement('div');
        divContent.setAttribute("id", item.idAtencion)
         
        let text = document.createElement('p');
        divContent.setAttribute('class', 'aviso-atencion container-fluid');
        var ahora = moment().format('YYYY-MM-DD HH:mm');
        var diferencia = moment(atencionAhora).diff(ahora, 'm');
        var ahoraMenos = moment(ahora).subtract(5, "minutes").format('YYYY-MM-DD HH:mm');
        var atencionAhoraMenos = moment(atencionAhora).subtract(5, "minutes").format('YYYY-MM-DD HH:mm');
        
        if (diferencia <= 30 && ahora <= atencionAhoraMenos ) {
            divContent.classList.add("pronto");
        }
        if ((diferencia <= 5 && atencionAhora >= ahora)) {
            divContent.classList.add("ahora");
        }
       
        /*if (item.nsp) */
            //divContent.classList.add('nsp')
      

       

        let contAviso = document.createElement('div');
        contAviso.setAttribute('class', 'cont-aviso row h-100 align-items-center');
        contAviso.setAttribute('style', 'min-height: 135px');

        let contImgProfesional = document.createElement('div');
        if (window.host.includes("saludtumundoseguro")) 
            contImgProfesional.setAttribute('class', 'col-auto cont-foto-profesional p-0');
        else 
            contImgProfesional.setAttribute('class', 'col-auto cont-foto-profesional p-0 d-none d-md-block');

        let imgProfesional = document.createElement('img');
        var foto;
        if (!item.fotoPerfil.includes('Avatar.svg')) {
            foto = baseUrl + item.fotoPerfil.replace(/\\/g, '/');
        }
        else {
            foto = baseUrlWeb + item.fotoPerfil;
        }

        if (isUnab())
            foto = item.fotoPerfil;

        imgProfesional.src = foto;
        imgProfesional.setAttribute('class', 'foto-profesional');
        if (window.host.includes("saludtumundoseguro"))
            imgProfesional.setAttribute('style', 'height:auto;width:auto;');
        else
            imgProfesional.setAttribute('style', 'height:100px;width:100px;');
        let contDatos = document.createElement('div');
        contDatos.setAttribute('class', 'col-12 col-md-auto col-xl pl-0 pl-md-3 pr-md-0');

        let dataMedico = document.createElement('div');
        dataMedico.setAttribute('class', 'data-atencion');

        let header = document.createElement('span');
        header.setAttribute('class', 'header-aviso-atencion d-block');


        let iCalendar = document.createElement('i');
        iCalendar.setAttribute('class', 'fal fa-calendar-alt');

        let proximaAtencion = document.createElement('span');
        proximaAtencion.innerHTML = ' Próxima Atención';

        let spanNombreMedico = document.createElement('span');
        spanNombreMedico.setAttribute('class', 'nombre-profesional');
        spanNombreMedico.innerHTML = item.nombreMedico;

        let tituloProfesional = document.createElement('span');
        tituloProfesional.setAttribute('class', 'titulo-profesional fuente-accesible');
        tituloProfesional.innerHTML = '<span>&nbsp;</span>' + item.especialidad;

        let contDatosAtencion = document.createElement('div');
        contDatosAtencion.setAttribute('class', 'col-12 col-md-auto col-xl-auto pr-md-3');

        let datosFecha = document.createElement('div');
        datosFecha.setAttribute('class', 'datos-fecha');

        let spanFechaAtencion = document.createElement('span');
        spanFechaAtencion.setAttribute('class', 'fecha-atencion');
        spanFechaAtencion.innerHTML = moment(item.fecha).format("DD-MM-YYYY");
        
        let spanHoraAtencion = document.createElement('span');
        spanHoraAtencion.setAttribute('class', 'hora-atencion fuente-accesible');
        spanHoraAtencion.innerHTML = item.horaDesdeText.substring(0, 5);

        let divStatusAtencion = document.createElement('div');
        let divLeyenda = document.createElement('div');
        
        if (item.confirmaPaciente != null) {
            divStatusAtencion.setAttribute('class', 'status-atencion');
            divLeyenda.setAttribute('class', 'leyenda');
            divLeyenda.innerHTML = 'Atención Confirmada';
        }
       

        let atencionToolbar = document.createElement('div');
        atencionToolbar.setAttribute('class', `atencion-toolbar mb-3 id-${item.idAtencion}`);
       

        let aAnular = document.createElement('a');
        aAnular.setAttribute('class', 'btn-atencion');
        if (!window.host.includes("masproteccionsalud"))
            aAnular.classList.add('class', 'btn-atencion-accion');
        let iconAnular = document.createElement('i');
        iconAnular.setAttribute('class', 'fal fa-calendar-times');
        var textAnular = document.createTextNode('Anular'); // para prevenciononcologica/ masproteccionsalud
        aAnular.innerHTML = "Anular";
        aAnular.onclick = () => {
            var validarHorario = validaHorario(item);
            if (validarHorario)
                return;
            if (item.cobrar) {
                Swal.fire("Esta atención no se puede anular", "Para anular esta estención comunicate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                return;
            }
            
            document.getElementById('fotoMedicoModal').src = foto;
            document.getElementById('nombreProfesionalModal').innerHTML = item.nombreMedico;
            document.getElementById('tituloMedicoModal').innerHTML = item.especialidad;
            document.getElementById('fechaAtencionModal').innerHTML = moment(item.fecha).format("DD-MM-YYYY");
            document.getElementById('horaAtencionModal').innerHTML = item.horaDesdeText.substring(0, 5);
            $('#modalAnulacion').modal('show');

            document.getElementById('btnAnular').onclick = async () => {
                var ahora = moment().format('YYYY-MM-DD HH:mm');
                var diferencia = moment(atencionAhora).diff(ahora, 'hours');
                //if (diferencia <= 4) {
                //    Swal.fire("Esta atención ya no es posible cancelarla", "", "warning")
                //    return;
                //}
                var valida = await putEliminarAtencion(item.idAtencion,uid);
                if (valida.status !== "NOK") {
                    Swal.fire('', 'Se anuló la atención', 'success');
                    $('#modalAnulacion').modal('hide');
                    link.remove();
                    atencionToolbar.remove();
                    if ($('#kt_widget2_tab1_content').children().length == 0 && $('#atenciones').children().length == 0)
                        document.getElementById('divSinAtenciones').hidden = false;
                    await cambioEstado(item.idAtencion.toString(), "E") // E=Anulada
                    await comprobanteAnulacion(valida.atencion);
                }
                else {
                    Swal.fire('', 'No fue posible anular esta atención, comuniquese con mesa de ayuda', 'error')
                }
                  
            }

        }

        let aReagendar = document.createElement('a');
        aReagendar.setAttribute('class', 'btn-atencion');
        if (!window.host.includes("masproteccionsalud"))
            aReagendar.classList.add('class', 'btn-atencion-accion');
        let iconReagendar= document.createElement('i');
        iconReagendar.setAttribute('class', 'fal fa-calendar-edit');
        var textReagendar = document.createTextNode('Reagendar'); // para prevenciononcologica/ masproteccionsalud
        aReagendar.innerHTML = "Reagendar";
        aReagendar.onclick = () => {
            var validarHorario = validaHorario(item);
            if (validarHorario)
                return;
            idMedico = item.idMedico;
            cliente = item.idCliente;
            spanFechaAtencion.classList.add("fecha" + item.idAtencion);
            spanHoraAtencion.classList.add("hora" + item.idAtencion);
            $('#rowDatePicker').empty();
            $('#btnConf').empty();
            $('#btnHorario').empty();
            dataCalendar(item.idConvenio, item.fecha, item.idAtencion,idMedico);
            
            document.getElementById('nombreprofesional').innerHTML = `Dr(a) ${item.nombreMedico}`;
            $('#modalReagendar').modal('show');
        }


        let aConfirmar= document.createElement('a');
        aConfirmar.setAttribute('class', 'btn-atencion');
        if (!window.host.includes("masproteccionsalud"))
            aConfirmar.classList.add('class', 'btn-atencion-accion');
        let iconConfirmar= document.createElement('i');
        iconConfirmar.setAttribute('class', 'fal fa-calendar-check');
        var textConfirmar = document.createTextNode('Confirmar') // para prevenciononcologica/ masproteccionsalud
        aConfirmar.innerHTML = "Confirmar";
        aConfirmar.onclick = async () => {
            var validarHorario = validaHorario(item);
            if (validarHorario)
                return;
            if (divLeyenda.innerHTML === "Atención Confirmada")
            {
                Swal.fire('', 'Ya confirmaste tu hora', 'info');
                return;
            }
            document.getElementById('nombreProfesionalConfirma').innerHTML = item.nombreMedico;
            document.getElementById('tituloMedicoConfirma').innerHTML = item.especialidad;
            document.getElementById('fechaAtencionConfirma').innerHTML = moment(item.fecha).format("DD-MM-YYYY");
            document.getElementById('horaAtencionConfirma').innerHTML = item.horaDesdeText.substring(0, 5);
            document.getElementById('horaAtencionConfirma').setAttribute("class", "hora-atencion text-center");
            $('#modalConfirmacion').modal('show');
            document.getElementById('btnConfirma').onclick = async () => {
                let result = await confirmaPaciente(item.idAtencion,uid)
                if (result.status === "OK") {
                    divStatusAtencion.setAttribute('class', 'status-atencion');
                    divLeyenda.setAttribute('class', 'leyenda');
                    divLeyenda.innerHTML = 'Atención Confirmada';
                    contAviso.appendChild(divStatusAtencion);
                    divStatusAtencion.appendChild(divLeyenda);
                    $('#modalConfirmacion').modal('hide');
                    await cambioEstado(item.idAtencion.toString(), "C") // C = confirmada
                    await comprobantePaciente(baseUrlWeb, result.atencion);
                }
                else {
                    Swal.fire('', 'No fue posible confirmar esta atención, intentelo más tarde', 'error')
                }
                
                
            }
            
        }

        let aIrBox = document.createElement('a');
        aIrBox.setAttribute('class', 'btn-atencion');
        let iconIrBox = document.createElement('i');
        iconIrBox.setAttribute('class', 'fal fa-check-circle');
        var textIrBox = document.createTextNode('Ir a la Atención') // para prevenciononcologica/ masproteccionsalud
        aIrBox.innerHTML = "Ir a la Atención";
        
        aIrBox.onclick = async () => {
            var log = {
                IdPaciente: uid,
                Evento: "Paciente presiona link para ingresar al box",
                IdAtencion: parseInt(item.idAtencion)
            }
            // await logPacienteViaje(log);
            var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(5, 'minutes').format('HH:mm');

            if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
                Swal.fire("Ya han pasado 5 min. desde que comenzó tu atención, se ha cancelado", "", "warning")
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


        let div = document.getElementById('atenciones');

        link.appendChild(divContent);
        divContent.appendChild(contAviso);
        contAviso.appendChild(contImgProfesional);
        contImgProfesional.appendChild(imgProfesional);
        contAviso.appendChild(contDatos);
        contDatos.appendChild(dataMedico);
        if (window.host.includes('masproteccionsalud') || window.host.includes('prevenciononcologica')){
            contDatos.appendChild(datosFecha);
            //se quitan los textos de los botones
            aAnular.innerHTML = "";
            aReagendar.innerHTML = "";
            aConfirmar.innerHTML = "";
            aIrBox.innerHTML = "";
        }
        dataMedico.appendChild(header);

        if (!window.host.includes('masproteccionsalud') && !window.host.includes('prevenciononcologica')) {
            header.appendChild(iCalendar);
            header.appendChild(proximaAtencion);
            dataMedico.appendChild(spanNombreMedico);
            dataMedico.appendChild(tituloProfesional);

        } else {
            dataMedico.appendChild(tituloProfesional);
            dataMedico.appendChild(spanNombreMedico);
        }
        
        contAviso.appendChild(contDatosAtencion);
        if (!window.host.includes('masproteccionsalud') && !window.host.includes('prevenciononcologica')) {
            contDatosAtencion.appendChild(datosFecha);
        }
       
        datosFecha.appendChild(spanFechaAtencion);
        datosFecha.appendChild(spanHoraAtencion);

         contAviso.appendChild(divStatusAtencion);
         divStatusAtencion.appendChild(divLeyenda);

        aAnular.appendChild(iconAnular);

        aReagendar.appendChild(iconReagendar);

        aConfirmar.appendChild(iconConfirmar);

        aIrBox.appendChild(iconIrBox);
        if (window.host.includes('masproteccionsalud') || window.host.includes('prevenciononcologica')) {

            aAnular.appendChild(textAnular);
            aReagendar.appendChild(textReagendar)
            aConfirmar.appendChild(textConfirmar)
            aIrBox.appendChild(textIrBox)
        }

        atencionToolbar.appendChild(aAnular);
        atencionToolbar.appendChild(aReagendar);
        if (!window.host.includes("clinicamundoscotia."))
            atencionToolbar.appendChild(aConfirmar);
        atencionToolbar.appendChild(aIrBox);
        div.appendChild(link);
        div.appendChild(atencionToolbar);
    })
}

function validaHorario(item) {
    var horaPasada;
    if (parsedUrl.hostname.includes("bo."))
        horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').subtract(5, 'minutes').format('HH:mm');
    else
        horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').subtract(5, 'minutes').format('HH:mm');
    if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
        Swal.fire("", "Está atención ya no puede ser modificada.", "warning")
        return true;
    }
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

            link.setAttribute('class', 'caja-atencion container-fluid cont-atencion-proxima')

          
            let contAviso = document.createElement('div');
            contAviso.setAttribute('class', 'cont-aviso row h-100 align-items-center');
            contAviso.setAttribute('style', 'min-height: 135px');


            let contDatos = document.createElement('div');
            contDatos.setAttribute('class', 'col-12 col-md-5 pr-md-0');

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

            let proximaAtencion = document.createElement('span');
            proximaAtencion.innerHTML = ' Próxima Atención';

            let spanNombreMedico = document.createElement('span');
            spanNombreMedico.setAttribute('class', 'nombre-profesional proxima-cardif');
            spanNombreMedico.innerHTML = item.nombreMedico;

            let tituloProfesional = document.createElement('span');
            tituloProfesional.setAttribute('class', 'titulo-profesional');
            tituloProfesional.innerHTML = '&nbsp;' + item.especialidad;

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
            aAnular.setAttribute('class', 'btn-atencion');
            if (!window.host.includes("masproteccionsalud"))
                aAnular.classList.add('class', 'btn-atencion-accion');
            let iconAnular = document.createElement('i');
            iconAnular.setAttribute('class', 'fal fa-calendar-times');
            var textAnular = document.createTextNode('Anular'); // para prevenciononcologica/ masproteccionsalud
            aAnular.innerHTML = "Anular";
            aAnular.onclick = () => {
                if (item.cobrar) {
                    Swal.fire("Esta atención no se puede anular", "Para anular esta estención comunicate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                    return;
                }
                document.getElementById('fotoMedicoModal').src = foto;
                document.getElementById('nombreProfesionalModal').innerHTML = item.nombreMedico;
                document.getElementById('tituloMedicoModal').innerHTML = item.especialidad;
                document.getElementById('fechaAtencionModal').innerHTML = item.fechaText;
                document.getElementById('horaAtencionModal').innerHTML = item.horaDesdeText;
                $('#modalAnulacion').modal('show');

                document.getElementById('btnAnular').onclick = async () => {
                    var valida = await putEliminarAtencion(item.idAtencion, uid);
                    if (valida.status !== "NOK") {
                        Swal.fire('', 'Se anuló la atención', 'success');
                        $('#modalAnulacion').modal('hide');
                        link.remove();
                        if ($('#kt_widget2_tab1_content').children().length == 0 && $('#atenciones').children().length == 0)
                            document.getElementById('divSinAtenciones').hidden = false;
                        await cambioEstado(item.idAtencion.toString(), "E") // E = Anulada
                        await comprobanteAnulacion(valida.atencion);
                    }
                    else {
                        Swal.fire('', 'No fue posible anular esta atención, comuniquese con mesa de ayuda', 'error')
                    }

                }

            }

            let aReagendar = document.createElement('a');
            aReagendar.setAttribute('class', 'btn-atencion');
            if (!window.host.includes("masproteccionsalud"))
                aReagendar.classList.add('class', 'btn-atencion-accion');
            aReagendar.setAttribute('id',"btnAgendar"+item.idAtencion)
            let iconReagendar = document.createElement('i');
            iconReagendar.setAttribute('class', 'fal fa-calendar-edit');
            var textReagendar = document.createTextNode('Reagendar'); // para prevenciononcologica/ masproteccionsalud
            aReagendar.innerHTML = "Reagendar";
            aReagendar.onclick = async () => {
                idMedico = item.idMedico;
                cliente = item.idCliente;
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
            aConfirmar.setAttribute('class', 'btn-atencion');
            if (!window.host.includes("masproteccionsalud"))
                aConfirmar.classList.add('class', 'btn-atencion-accion');
            let iconConfirmar = document.createElement('i');
            iconConfirmar.setAttribute('class', 'fal fa-calendar-check');
            var textConfirmar = document.createTextNode('Confirmar'); // para prevenciononcologica/ masproteccionsalud
            aConfirmar.innerHTML = "Confirmar";
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
                $('#modalConfirmacion').modal('show');
                document.getElementById('btnConfirma').onclick = async () => {

                    let result = await confirmaPaciente(item.idAtencion, uid)
                    if (result.status === "OK") {
                        divStatusAtencion.setAttribute('class', 'status-atencion col-lg-12');
                        divLeyenda.setAttribute('class', 'leyenda');
                        divLeyenda.setAttribute('style', 'text-align-last: right;');
                        divLeyenda.innerHTML = 'Atención Confirmada';

                        divStatusAtencion.setAttribute('class', 'status-atencion col-lg-12');
                        divLeyenda.setAttribute('class', 'leyenda');
                        divLeyenda.setAttribute('style', 'text-align-last: right;');
                        divLeyenda.innerHTML = 'Atención Confirmada';
                        divStatusAtencion.appendChild(divLeyenda);
                        let tr2 = document.querySelector('.atencion-proxima-toolbar');

                        let parentBody = tr2.parentNode;
                        contAviso.insertBefore(divStatusAtencion, atencionToolbar);

                        //contAviso.appendChild(divStatusAtencion);
                        //divStatusAtencion.appendChild(divLeyenda);
                        $('#modalConfirmacion').modal('hide');
                        await cambioEstado(item.idAtencion.toString(), "C") // C = confirmada
                        await comprobantePaciente(baseUrlWeb, result.atencion);
                    }
                    else {
                        Swal.fire('', 'No fue posible confirmar esta atención, intentelo más tarde', 'error')
                    }


                }

            }

            let div = document.getElementById('kt_widget2_tab1_content');
            div.setAttribute('class', 'tab-pane active')

            link.appendChild(contAviso);

            contAviso.appendChild(contDatos);
            contDatos.appendChild(dataMedico);
            dataMedico.appendChild(header);
            if (!window.host.includes('masproteccionsalud') && !window.host.includes('prevenciononcologica')) {

                header.appendChild(iCalendar);
            }

            header.appendChild(proximaAtencion);
            dataMedico.appendChild(calificacion);
            dataMedico.appendChild(spanNombreMedico);
            dataMedico.appendChild(tituloProfesional);
            contAviso.appendChild(contDatosAtencion);
            contDatosAtencion.appendChild(datosFecha);

            datosFecha.appendChild(spanFechaAtencion);
            datosFecha.appendChild(spanHoraAtencion);

            contAviso.appendChild(divStatusAtencion);
            divStatusAtencion.appendChild(divLeyenda);

            if (window.host.includes('masproteccionsalud') || window.host.includes('prevenciononcologica')) {
                //se quitan los textos de los botones
                aAnular.innerHTML = "";
                aReagendar.innerHTML = "";
                aConfirmar.innerHTML = "";
            }
            aAnular.appendChild(iconAnular);
            aReagendar.appendChild(iconReagendar);
            aConfirmar.appendChild(iconConfirmar);

            if (window.host.includes('masproteccionsalud') || window.host.includes('prevenciononcologica')) {

                aAnular.appendChild(textAnular);
                aReagendar.appendChild(textReagendar)
                aConfirmar.appendChild(textConfirmar)
            }
            atencionToolbar.appendChild(aAnular);
            atencionToolbar.appendChild(aReagendar);
            if (!window.host.includes("clinicamundoscotia."))
                atencionToolbar.appendChild(aConfirmar);
            contAviso.appendChild(atencionToolbar);
            div.appendChild(link);
            //div.appendChild(atencionToolbar);
        }
        })


    //proximasAtenciones(data.proximasHorasPaciente);
    //historialAtenciones(data.historialAtenciones);

    if (!window.host.includes("achs."))
        camposValidos(uid);
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
    
    //var fechaSeleccion = moment();

    let btnMañana = document.createElement("button")
    btnMañana.setAttribute("id", "btnManana");
    btnMañana.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-am mr-3");
    btnMañana.innerHTML = "Mañana"
    document.getElementById("btnHorario").appendChild(btnMañana);


    let btnTarde = document.createElement("button")
    btnTarde.setAttribute("id", "btnTarde");
    btnTarde.setAttribute("class", "btn btn-brand btn-elevate btn-pill btn-pm");
    btnTarde.innerHTML = "Tarde"
    
    document.getElementById("btnHorario").appendChild(btnTarde );

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
        var diasConAgenda = await getHoraMedicoByCalendar(idMedico, moment(fechaSeleccion).format('YYYYMMDD'), idConvenio, moment(fechaSeleccionEstatica).format('YYYYMMDD'),uid);
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
        agendaMedico =  await getAgendaMedicoInicial(moment(fechaSeleccion).format("YYYY-MM-DD HH:mm:ss"),
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



        //let resultado = await putAgendarMedicosHoras(agendar, idMedico, uid);
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
                          document.querySelector(".fecha" + idAtencion).innerHTML = moment(fechaSeleccion).format("DD/MM/YYYY")
                          document.querySelector(".hora" + idAtencion).innerHTML= horaSeleccionada;
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
                      Swal.fire("Hora Reagendada", `Tú hora ha sido reagendada para el día  ${document.querySelector(".fecha" + idAtencion).innerHTML} a las ${document.querySelector(".hora" + idAtencion).innerHTML} hrs.`,"success")
                      location.reload()
                  }
        }
    });
    function rangoHora(agendaMedico) {
        rangoIni = agendaMedico[0].horaDesdeText
        rangoFin = agendaMedico[agendaMedico.length - 1].horaDesdeText;
    }

}


async function camposValidos(uid) {
    
    let paciente = await getDatosPaciente(uid);
    let camposPaciente = {
        nombre: paciente.nombre,
        apellidoPaterno: paciente.apellidoPaterno,
        correo: paciente.correo,
        genero: paciente.genero,
        direccion: paciente.direccion,
    }
    if (externo == "True") {
        validarLogExterno(paciente);
    }
    else {
        for (const datos in camposPaciente) {
            if (`${camposPaciente[datos]}`.length == 0 || `${paciente[datos]}` == "null") {
                var empresaTitulo = "Medismart.live!";
                if (idCliente == "108") {
                    empresaTitulo = "Salud Protección";
                } else if (window.host.includes("clinicamundoscotia")){
                    empresaTitulo = "Clinica Online";
                } else if (window.host.includes("masproteccionsalud")) {
                    empresaTitulo = "+Protección";
                }    

                var title = "Bienvenido/a a "+ empresaTitulo+ " faltan algunos campos por completar en tu perfil";
                if (idCliente == "148")
                    title = "Bienvenido a Doctor Online! faltan algunos campos por completar en tu perfil";
                if (window.host.includes("prevenciononcologica"))
                    title = "¡Atención! Faltan algunos campos por completar en tu perfil.";
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
                        window.location = "/Paciente/Configuracion";
                    }
                });
            }
        }
    }
   
}

function validarLogExterno(paciente) {
   $('#modal-validacion').modal('show');
    
    let correo = "";
    let telefono = "";
    let correoExterno = "";
    let telefonoExterno = "";
    if (paciente.correoPlataformaTercero != null)
        correoExterno = paciente.correoPlataformaTercero;
    if (paciente.telefonoPlataformaTercero != null)
        telefonoExterno = paciente.telefonoPlataformaTercero;
    if (paciente.telefonoMovil != null)
        telefono = paciente.telefonoMovil;
    if (paciente.correo != null)
        correo = paciente.correo;

    document.getElementById("nombreUsuario").innerHTML = `Hola ${paciente.nombre}`
    document.getElementById("correoMedical").value = correo;
    document.getElementById("telefonoMedical").value = telefono;

    document.getElementById("btnConfirmarTerminos").onclick = async () => {
        var telefonoUpdate = "";
        var emailUpdate = "";
        emailUpdate = document.getElementById("correoMedical").value;
        telefonoUpdate = document.getElementById("telefonoMedical").value;

        if (emailUpdate == "" || telefonoUpdate == "") {
            Swal.fire("", "Debe completar los datos de contacto", "warning");
            return;
        }
        var emailOk = isEmail(emailUpdate);
        if (!emailOk) {
            Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
            return;
        }
        $('#btnConfirmarTerminos').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        var respuesta = await EditPhoneEmail(emailUpdate, telefonoUpdate, uid);

        if (respuesta.status == "OK") {
            location.href = "/Paciente/Agendar";
        }
        else {
            $('#btnConfirmarTerminos').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            return;
        }

    }
}

async function ActualizarNSP(uid, id) {
    let atencionTool = document.querySelector(`.id-${id}`);
    var idAtencion = document.getElementById(id);
    atencionTool.remove();
    idAtencion.remove();
    validarNSP = true;
   
}

async function indexRealTime(uid) {
     
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/proximasatencionespacientehub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connection.on('ActualizarProximasAtencionesPaciente', (id) => {
      ActualizarNSP(uid,id);
    });
   
    try {
        await connection.start();
    } catch (err) {
        
    }

    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('SubscribeProximasAtencionesPaciente', uid).catch((err) => {
            return console.error(err.toString());
        });
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
