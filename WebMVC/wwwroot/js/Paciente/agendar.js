
import { getMedicosHoraProxima } from '../apis/agendar-fetch.js';
import { getRutUsuario, agendar, persona } from "../shared/info-user.js";
import { putAgendarMedicosHoras, getAtencionByIdMedicoHora } from '../apis/agendar-fetch.js';
import { EditPhoneEmail, personasDatosByUser, logPacienteViaje } from '../apis/personas-fetch.js?rnd=10';
import { getParametro, getParametroByCodigo, getSelectorEspecialidades } from '../apis/parametro.js?rnd=10';
import { sendContacto, sendEnvioExitoso } from '../apis/correos-fetch.js?rnd=9';

var mask;
var connection;
var rutUsuario = "";
var verificacionRedirect;
var showModalEmail = false;
var fecha;
var tipoFiltro = "";
var arrayIdEspec = [];
var medicosAux = [];
var msjPediatrico = "";
var fichaPaciente = {};
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}

function quitarTilde(s) {
    var r = s.toLowerCase();
    r = r.replace(new RegExp(/\s/g), "");
    r = r.replace(new RegExp(/[àáâãäå]/g), "a");
    r = r.replace(new RegExp(/æ/g), "ae");
    r = r.replace(new RegExp(/ç/g), "c");
    r = r.replace(new RegExp(/[èéêë]/g), "e");
    r = r.replace(new RegExp(/[ìíîï]/g), "i");
    r = r.replace(new RegExp(/ñ/g), "n");
    r = r.replace(new RegExp(/[òóôõö]/g), "o");
    r = r.replace(new RegExp(/œ/g), "oe");
    r = r.replace(new RegExp(/[ùúûü]/g), "u");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");
    r = r.replace(new RegExp(/\W/g), "");
    return r;
}

function isUnab() {
    return window.host.includes("unabactiva.") || window.host.includes("activa.unab.")
}

export async function init(data) {

    if (window.host.includes("masproteccionsalud.")) {
        $(document).ready(function () {
            $('#especialidades').select2({
                minimumResultsForSearch: -1
            });
        });
    }
   


    fichaPaciente = data.fichaPaciente;
    msjPediatrico = "Estimado paciente, te recordamos que para agendar una consulta pediátrica es necesario utilizar el RUT del menor.";
    if (codigoTelefono == "CO")
        msjPediatrico = "Estimado paciente, te recordamos que para agendar una consulta pediátrica es necesario utilizar el Registro Civil del menor.";
    else if (codigoTelefono == "MX")
        msjPediatrico = "Estimado paciente, te recordamos que para agendar una consulta pediátrica es necesario utilizar el CURP del menor.";

    document.getElementById("mensajePediatrico").innerHTML = msjPediatrico;
    var parsedUrl = new URL(window.location.href);
    verificacionRedirect = parsedUrl.href.substring(parsedUrl.href.lastIndexOf('=') + 1);
    //if (data.idCliente === "0") {
    //    $("#nombreConvenio").text("Medismart");
    //    $("#divVeterinaria").removeAttr('hidden');
    //    $("#bannerVete").removeAttr('hidden');

    //}
    if (document.querySelectorAll('.cont-banner a').length > 0) {
        document.querySelectorAll('.cont-banner a')[0].setAttribute('class', 'd-none')
    }
    if (verificacionRedirect != "true")
        verificacionRedirect = false;
    await agendar(verificacionRedirect);

    let page = document.getElementById('page');
    page.innerHTML = "Agendar atención";
    rutUsuario = await getRutUsuario();
    switch (tipo) {
        case "medicina":
            //document.getElementById('divSuscripcion').hidden = false;
            //document.getElementById('divOndemand').hidden = false;
            //document.getElementById('divVeterinaria').hidden = true;
            tipoFiltro = "O"
            changeClassTipo(tipoFiltro);
            break;
        case "suscripcion":
            //document.getElementById('divSuscripcion').hidden = false;
            //document.getElementById('divOndemand').hidden = false;
            //document.getElementById('divVeterinaria').hidden = true;
            tipoFiltro = "S";
            changeClassTipo(tipoFiltro);
            break;
        case "lifestyle":
            //document.getElementById('divVeterinaria').hidden = false;
            tipoFiltro = "V"
            changeClassTipo(tipoFiltro);
            break;
        default:
            tipoFiltro = "S"
            changeClassTipo(tipoFiltro);
            break;
    }

    
    if ($("#divSuscripcion").length) {
        var btnSuscripcion = document.getElementById('divSuscripcion');
        btnSuscripcion.onclick = async () => {
            tipoFiltro = "S"
            changeClassTipo(tipoFiltro);
        }
    }

    if ($("#divOndemand").length) {
        var btnOndemand = document.getElementById('divOndemand');
        btnOndemand.onclick = async () => {
            tipoFiltro = "O"
            changeClassTipo(tipoFiltro);
        }
    }
    if ($("#divVeterinaria").length) {
        var btnVete = document.getElementById('divVeterinaria');
        btnVete.onclick = async () => {
            tipoFiltro = "V"
            changeClassTipo(tipoFiltro);
        }
    }

    if ($("#divEspecialidadCaja").length) {
        var btnEspecialidadCaja = document.getElementById('divEspecialidadCaja');
        btnEspecialidadCaja.onclick = async () => {
            tipoFiltro = "CS"
            changeClassTipo(tipoFiltro);
        }
    }

    if ($("#divEspecialidadCajaOncologia").length) {
        var btnEspecialidadCajaOncologia = document.getElementById('divEspecialidadCajaOncologia');
        btnEspecialidadCajaOncologia.onclick = async () => {
            tipoFiltro = "CON"
            changeClassTipo(tipoFiltro);
        }
    }

    if ($("#bannerVete").length) {
        var bannerVete = document.getElementById('bannerVete');
        bannerVete.onclick = async () => {
            tipoFiltro = "V"
            changeClassTipo(tipoFiltro);
        }
    }

    if ($("#bannerVete1").length) {
        var bannerVete1 = document.getElementById('bannerVete1');
        bannerVete1.onclick = async () => {
            tipoFiltro = "V"
            changeClassTipo(tipoFiltro);
        }
    }

    if ($("#divPresencial").length) {
        var btnPre = document.getElementById('divPresencial');
        btnPre.onclick = async () => {
            location.href = "/presencial/agendar";
        }
    }
    var todayDate = moment().startOf('day');
    var TODAY = todayDate.format('YYYY-MM-DD');
    fecha = TODAY;


    const inputTelefono = document.querySelector("#telefonoMedical");
    const iti = window.intlTelInput(inputTelefono, {
        preferredCountries: ['cl', 'co', 'ec', 'mx', 'pe', 'bo', 'br'],
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("cl"));
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
    });
    iti.setNumber(inputTelefono.value.replace("(", "").replace(")", "").replace(" ", ""));

    if (data.fichaPaciente && !window.host.includes("masproteccionsalud.") && !window.host.includes("clinicamundoscotia.")) {

        if (data.fichaPaciente.correo === "" || data.fichaPaciente.correo === null) {
            showModalEmail = true;
        }
        if (data.fichaPaciente.telefono === "" || data.fichaPaciente.telefono === null) {
            showModalEmail = true;
        }
        if (showModalEmail) {
            document.getElementById("nombreUsuarioModalValidacion").innerHTML = `Hola ${data.fichaPaciente.nombreCompleto}`
            document.getElementById('correoMedical').value = data.fichaPaciente.correo;
            document.getElementById('telefonoMedical').value = data.fichaPaciente.telefono;
            iti.setNumber(data.fichaPaciente.telefono.replace("(", "").replace(")", "").replace(" ", ""));

        }

    }

    document.querySelector(".itemEspecialidad").onchange = async () => {
        const especialidad = document.getElementById('especialidades').value;
        const bloque = $("#bloquesHora").val();
        const fecha = document.querySelector('[name="fechaBusqueda"]').value;
        if (tipoEspecialidad == "orientacion" || tipoEspecialidad == "examenes") especialidad = 77;
        let medicos = await getMedicosHoraProxima(tipoFiltro, especialidad, bloque, uid, fecha, idCliente, tipoEspecialidad);

        clearProfesionales("divProfesionales");
        cargarMedicos(medicos);


    }
    
    if (tipoEspecialidad == 'orientacion' || tipoEspecialidad == 'examenes') {
            const especialidad = 77;
            const bloque = $("#bloquesHora").val();
            const fecha = document.querySelector('[name="fechaBusqueda"]').value;
            let medicos = await getMedicosHoraProxima(tipoFiltro, especialidad, bloque, uid, fecha, idCliente, tipoEspecialidad);

            clearProfesionales("divProfesionales");
            cargarMedicos(medicos);
    }

    if (tipoEspecialidad == 'personalTrainer' || tipoEspecialidad == 'PersonalTrainer') {
        const especialidad = 65;
        const bloque = $("#bloquesHora").val();
        const fecha = document.querySelector('[name="fechaBusqueda"]').value;
        let medicos = await getMedicosHoraProxima(tipoFiltro, especialidad, bloque, uid, fecha, idCliente, tipoEspecialidad);

        clearProfesionales("divProfesionales");
        cargarMedicos(medicos);
    }

    if (tipoEspecialidad == 'yoga' || tipoEspecialidad == 'Yoga') {
        const especialidad = 68;
        const bloque = $("#bloquesHora").val();
        const fecha = document.querySelector('[name="fechaBusqueda"]').value;
        let medicos = await getMedicosHoraProxima(tipoFiltro, especialidad, bloque, uid, fecha, idCliente, tipoEspecialidad);

        clearProfesionales("divProfesionales");
        cargarMedicos(medicos);
    }

    if (tipoEspecialidad == 'veterinaria' || tipoEspecialidad == 'Veterinaria') {
        const especialidad = 57;
        const bloque = $("#bloquesHora").val();
        const fecha = document.querySelector('[name="fechaBusqueda"]').value;
        let medicos = await getMedicosHoraProxima(tipoFiltro, especialidad, bloque, uid, fecha, idCliente, tipoEspecialidad);

        clearProfesionales("divProfesionales");
        cargarMedicos(medicos);
    }

    if (tipoEspecialidad == 'pilates' || tipoEspecialidad == 'Pilates') {
        const especialidad = 88;
        const bloque = $("#bloquesHora").val();
        const fecha = document.querySelector('[name="fechaBusqueda"]').value;
        let medicos = await getMedicosHoraProxima(tipoFiltro, especialidad, bloque, uid, fecha, idCliente, tipoEspecialidad);

        clearProfesionales("divProfesionales");
        cargarMedicos(medicos);
    }
 

    

    $("#bloquesHora").change(function () {
            cargarMedicos();
    });
    //parametros segun host (chileno o boliviano);
    //data.fichaPaciente.codigoTelefono = "CO"; // solo para efectos de prueba
    //var param = await getParametroByCodigo(data.fichaPaciente.codigoTelefono);
    //mask = param.util2;
    //$("#telefonoMedical").inputmask("mask", {
    //    "mask": mask
    //});

    document.getElementById("telefonoMedical").placeholder = "Ejemplo: +5X999999999";
    $("#fechaBusqueda").change(function () {
        if (document.querySelector('[id="fechaBusqueda"]').value < TODAY) {
            Swal.fire("", "La fecha seleccionada no puede ser menor a la fecha de hoy", "warning");
            document.querySelector('[id="fechaBusqueda"]').value = TODAY;
            return;
        }
        cargarMedicos();
    });
    $("#emailPaciente").inputmask({
        mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
        greedy: false,
        onBeforePaste: function (pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace("mailto:", "");
        },
        definitions: {
            '*': {
                validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                cardinality: 1,
                casing: "lower"
            }
        }
    });
    //$("#telefonoPaciente").inputmask("mask", {
    //    "mask": "(+56) 99 999 9999"
    //});


    document.getElementById("btnModificarTelefonoEmail").onclick = async () => {

        var telefonoUpdate = "";
        var emailUpdate = "";
        emailUpdate = document.getElementById("correoMedical").value;
        telefonoUpdate = document.getElementById("telefonoMedical").value;


        if (inputTelefono.value.trim()) {
            if (!iti.isValidNumber()) {
                const errorCode = iti.getValidationError();
                // Para el teléfono
                const errorMapTelefono = ["Número de teléfono inválido", "Código de país inválido", "Número demasiado corto", "Número demasiado largo", "Número inválido"];
                Swal.fire(errorMapTelefono[errorCode], " teléfono ", "warning");
                return;
            }
        }
        if (emailUpdate == "" || telefonoUpdate === "") {
            Swal.fire("", "Debe completar los datos de contacto", "warning");
            return;
        }
        var emailOk = isEmail(emailUpdate);
        if (!emailOk) {
            Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
            return;
        }
        telefonoUpdate = iti.getNumber();
        //$('#btnConfirmarTerminos').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        var respuesta = await EditPhoneEmail(emailUpdate, telefonoUpdate, uid);
       
        $('#modal-validacion').modal('hide');
        if (respuesta.status == "OK") {
            showModalEmail = false;
        }
    }

};


async function changeClassTipo(tipoFiltro) {

    $("#divProfesionales").empty();

    const numberOfIterations = (window.innerWidth <= 991.98) ? 1 : 4;

    for (var i = 0; i < numberOfIterations; i++) {
        const newDiv = document.createElement('div');
        const div1 = document.createElement("div");
        const h1_1 = document.createElement('h1');
        const h1_2 = document.createElement("h1");
        const h1_3 = document.createElement("h1");
        const h1_4 = document.createElement("h1");
        const h1_5 = document.createElement("h1");
        const h1_6 = document.createElement("h1");
        const h1_7 = document.createElement("h1");
        const h1_8 = document.createElement("h1");
        newDiv.appendChild(div1);
        div1.appendChild(h1_1);
        div1.appendChild(h1_2);
        div1.appendChild(h1_3);
        div1.appendChild(h1_4);
        div1.appendChild(h1_5);
        div1.appendChild(h1_6);
        div1.appendChild(h1_7);
        div1.appendChild(h1_8);
        div1.classList.add("div1", "fade-in");
        h1_1.classList.add("h1_1", "placeholder-squeleton");
        h1_2.classList.add("h1_2", "placeholder-squeleton");
        h1_3.classList.add("h1_3", "placeholder-squeleton");
        h1_4.classList.add("h1_4", "placeholder-squeleton");
        h1_5.classList.add("h1_5", "placeholder-squeleton");
        h1_6.classList.add("h1_6", "placeholder-squeleton");
        h1_7.classList.add("h1_7", "placeholder-squeleton");
        h1_8.classList.add("h1_8", "placeholder-squeleton");
        document.getElementById("divProfesionales").appendChild(div1);
    }


    var grupo = "";
    var especia = "";
    document.getElementById('divSuscripcion')?.classList.remove('active');
    document.getElementById('divOndemand')?.classList.remove('active');
    document.getElementById('divVeterinaria')?.classList.remove('active');
    document.getElementById('divEspecialidadCaja')?.classList.remove('active');
    document.getElementById('divEspecialidadCajaOncologia')?.classList.remove('active');
    arrayIdEspec = [];
    switch (tipoFiltro) {
        case "S": document.getElementById('divSuscripcion')?.classList.add('active');
            break;
        case "O": document.getElementById('divOndemand').classList.add('active');
            break;
        case "V": document.getElementById('divVeterinaria').classList.add('active');
            break;
        case "CON": document.getElementById('divEspecialidadCajaOncologia').classList.add('active');
            tipoEspecialidad = tipoEspecialidad == "" ? "oncologia" : tipoEspecialidad
            break;
        default:
            tipoFiltro = "S";
            break;
    }

    especia = await getSelectorEspecialidades(uid, parseInt(idCliente), tipoFiltro, tipoEspecialidad);

    if (tipoEspecialidad != 'examenes' && tipoEspecialidad != 'orientacion' && window.host.includes("masproteccionsalud")) {
        especia = especia.filter(x => x.codigo != "77" && x.codigo != "1")
    }

    $("#especialidades").empty();
    if (idCliente == 108) {
        $("#especialidades").append('<option class="dropdown-item" data-id="0" value="0">Seleccione especialidad</option>');
    }
    else if (window.host.includes("laaraucana.")) {
        $("#especialidades").append('<option class="dropdown-item" data-id="0" value="0">Búsqueda de especialidades</option>');
    }
    else {
        $("#especialidades").append('<option class="dropdown-item" data-id="0" value="0">Búsqueda de especialidad</option>');
    }
    especia.forEach(especialidad => {
        $("#especialidades").append('<option class="dropdown-item" data-id="' + especialidad.codigo + '" value="' + especialidad.codigo + '">' + especialidad.detalle + '</option>');
        arrayIdEspec.push(especialidad.codigo);
    });
    if (tipoEspecialidad != null && tipoEspecialidad != "") {
        especia.forEach(especialidad => {
             if (tipoEspecialidad === 'telemedicina') {
                if (especialidad.codigo == 54 || especialidad.codigo == 65 || especialidad.codigo == 77 || especialidad.codigo == 79) {
                    $(`option[value=${especialidad.codigo}]`).remove();
                }
            }

        });
    }
    $("#comunas").empty();
    $("#comunas").append('<option class="dropdown-item" data-id="0" value="0">Búsqueda comunas</option>');
    especia.forEach(especialidad => {

        $("#comunas").append('<option class="dropdown-item" data-id="' + especialidad.codigo + '" value="' + especialidad.codigo + '">' + especialidad.detalle + '</option>');
    });

    const especialidad = document.getElementById('especialidades').value;
    var bloque = $("#bloquesHora").val();
    if (bloque == null)
        bloque = '0';
    let medicos = [];
    if (idCliente == 241) {
        tipoFiltro = "S";
    }
	
  

    medicos = await getMedicosHoraProxima(tipoFiltro, especialidad, bloque, uid, fecha, idCliente, tipoEspecialidad);
    if (window.host.includes("masproteccionsalud")) {
        var ids = especia.map(function (f) {
            return f.codigo;
        });
        medicos = medicos.filter(x => ids.includes(x.codigoEspecialidad));
    }
    cargarMedicos(medicos);

    if (tipoEspecialidad == "kinesiologia" && isUnab())
        Swal.fire("Información importante", "Si usted no cuenta con la orden médica para kinesiología, no puede agendar.", "info");
    // PopUp aviso UNAB terapia ocupacional
    //else if (tipoEspecialidad == "grupoterapiaocupacional" && isUnab())
    //    Swal.fire("Información importante", "<b>Salud Mental - Programa Bienestar</b> sólo está disponible para mujeres.", "info");

    if (window.host.includes("prevenciononcologica") && tipoEspecialidad != "examenes" && tipoEspecialidad != "orientacion") { // PARA PODER REINICIAR EL FILTRO PARA VISTA TELEMEDICINA DE MOBILE DE CAJALOSANDES
        tipoEspecialidad = "";
    }
    //if (medicos) {
    //    $("option[value='16']").remove();
    //}
    if (window.host.includes("tratame.") && tipoEspecialidad == "") // tratame 
        $("option[value='77']").remove();

    //if (medicos.length > 0 && medicos[0].tienePsiquiatra == "N" && tipoFiltro == "S")
    //    $("option[value='16']").remove();
}


function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

async function iterarMedicos(medico, index, array) {
    {
        if ((tipoEspecialidad == "lifestyle" || tipoEspecialidad == "" || tipoEspecialidad == "telemedicina" || tipoEspecialidad == "suscripcion") && (medico.codigoEspecialidad == 77 || medico.codigoEspecialidad == 54) && (idCliente == 108)) {
            return;
        }
        let divCajMedico = document.createElement('div');
        divCajMedico.classList.add('col-12', 'col-sm-6', 'col-lg-4', 'col-xl-3', 'mb-3',);
        divCajMedico.classList.add('cajaInfoMedico');
        divCajMedico.setAttribute('data-idMedicoHora', medico.idMedicoHora);
        divCajMedico.setAttribute('data-nombreMedico', medico.nombreMedico);
        divCajMedico.setAttribute('data-tituloMedico', medico.especialidad);
        divCajMedico.setAttribute('data-prefijoProfesional', medico.prefijoProfesional);
        divCajMedico.setAttribute('data-infoMedico', medico.infoPersona1);
        divCajMedico.setAttribute('data-idMedico', medico.idMedico);
        divCajMedico.setAttribute('data-codigoPrestacion', medico.codigoPrestacion);
        divCajMedico.setAttribute('data-rutMedico', medico.rutMedico);
        divCajMedico.setAttribute('data-especialidad', medico.especialidad);
        divCajMedico.setAttribute('data-fecha', medico.fecha);
        divCajMedico.setAttribute('data-m', medico.idModeloAtencion);
        divCajMedico.setAttribute('data-r', medico.idReglaPago);
        divCajMedico.setAttribute('data-alma', medico.almaMater);
        divCajMedico.setAttribute('data-c', medico.idConvenio);
        divCajMedico.setAttribute('data-d', medico.atencionDirecta);

        divCajMedico.setAttribute('data-idSucursal', medico.idSucursal.toString());

        divCajMedico.setAttribute('data-idLugarAtencion', medico.idLugarAtencion.toString());
        var divCard = document.createElement('div');
        var divBack;
        var baseS3 = 'https://appdiscoec2.s3.amazonaws.com'
        if (!medico.fotoPerfil.includes('Avatar.svg')) {
            divCajMedico.setAttribute('data-fotoMedico', baseS3 + medico.fotoPerfil.replace(/\\/g, '/'));
        } 
        else {
            divCajMedico.setAttribute('data-fotoMedico', baseUrlWeb + medico.fotoPerfil);
        }
        let buttonInside = document.createElement('button');
        var url;


        var modalidad;
        if (medico.modalidad != null && medico.modalidad.length > 0) {
            if (medico.modalidad.includes("3")) {
                modalidad = "Particular";
            }
        }

        divCajMedico.addEventListener("click", async function () {
            var idMedico = $(this)[0].dataset.idmedico;
            let divPerfilProfesional = document.createElement('div');
            var classMedico = `.${idMedico}`;
            divPerfilProfesional.classList.add('perfil-profesional');

            divPerfilProfesional.classList.add(idMedico);

            // if (medico.cobrar && !medico.modalidad.includes("1")) {
            
            if (medico.cobrar) {
                if ($(classMedico).length >= 1) {
                    divCard.classList.toggle('flipped');
                    return;
                }
                else {
                    divCard.classList.toggle('flipped');
                }
                var targetElement = event.target || event.srcElement;
                var cajaInfo = targetElement.closest('.cajaInfoMedico');
                document.getElementById("divPerfilProfesional").innerHTML = "";

                //Header Perfil
                let divHeaderPerfil = document.createElement('div');
                divHeaderPerfil.classList.add('header-perfil');

                let divFotoProfesional = document.createElement('img');
                divFotoProfesional.classList.add('foto-profesional');
                divFotoProfesional.src = cajaInfo.getAttribute('data-fotoMedico');
                divHeaderPerfil.appendChild(divFotoProfesional);

                let divDataPerfil = document.createElement('div');
                divDataPerfil.classList.add('data');


                let spanNombreProfesional = document.createElement('span');
                spanNombreProfesional.classList.add('nombre-profesional');

                let spanPrefijoProfesional = document.createElement('span');
                spanPrefijoProfesional.classList.add('titulo-profesional');
                spanPrefijoProfesional.innerHTML = cajaInfo.getAttribute('data-prefijoProfesional') + ' ';


                let labelNombreProfesional = document.createElement('span');
                labelNombreProfesional.innerHTML = cajaInfo.getAttribute('data-nombreMedico');

                spanNombreProfesional.appendChild(spanPrefijoProfesional);
                spanNombreProfesional.appendChild(labelNombreProfesional);

                divDataPerfil.appendChild(spanNombreProfesional);


                let spanAlmaProfesional = document.createElement('small');
                // spanAlmaProfesional.classList.add('titulo-profesional');
                spanAlmaProfesional.innerHTML = cajaInfo.getAttribute('data-alma');

                spanNombreProfesional.appendChild(spanAlmaProfesional);


                let spanTituloProfesional = document.createElement('span');
                spanTituloProfesional.classList.add('especialidad-profesional', 'back-especialidad');
                spanTituloProfesional.innerHTML = cajaInfo.getAttribute('data-tituloMedico');

                divDataPerfil.appendChild(spanTituloProfesional);
                divHeaderPerfil.appendChild(divDataPerfil);

                divPerfilProfesional.appendChild(divHeaderPerfil);
                //Fin Header Perfil

                //Body Profesional
                let divBodyProfesional = document.createElement('div');
                divBodyProfesional.classList.add('body-profesional');

                let parrafoInfo = document.createElement('p');
                parrafoInfo.innerHTML = cajaInfo.getAttribute('data-infoMedico');
                divBodyProfesional.appendChild(parrafoInfo);


                var m = cajaInfo.getAttribute('data-m');
                var r = cajaInfo.getAttribute('data-r');


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



                if (medico.modalidad.includes("1")) {
                    if (idCliente !== 2 && idCliente != 148) { //INMV = 2, Colmena = 148
                        let divFonasa = document.createElement('img');
                        divFonasa.classList.add('img-convenio');
                        divFonasa.src = "/img/fonasa.svg";
                        divImagenesConvenios.appendChild(divFonasa);
                        let calificacionStars = document.querySelector('.calificacion');
                        calificacionStars.classList.add('d-none');

                    }
                }




                divBodyProfesional.appendChild(divImagenesConvenios);


                let divValorConsulta = document.createElement('div');
                divValorConsulta.classList.add('valor-consulta');


                let spanValorConvenio = document.createElement('span');
                spanValorConvenio.classList.add('label-valor');

                var labelValor = "Valor Consulta Particular"
                if (idCliente == "148")
                    labelValor = "Valor a pagar ";

                spanValorConvenio.innerHTML = labelValor;
                divValorConsulta.appendChild(spanValorConvenio);

                let spanVConvenio = document.createElement('span');
                spanVConvenio.classList.add('valor');
                let smallSimbolo = document.createElement('small');
                smallSimbolo.innerHTML = "$ ";
                spanVConvenio.appendChild(smallSimbolo);
                let spanPrecioConvenio = document.createElement('label');
                
                spanPrecioConvenio.innerHTML = formatNumber(medico.valorAtencion);
                spanVConvenio.appendChild(spanPrecioConvenio);

                divValorConsulta.appendChild(spanVConvenio);

                divBodyProfesional.appendChild(divValorConsulta);
                divPerfilProfesional.appendChild(divBodyProfesional);
                //Fin Body Profesional


                //Boton Aceptar
                let divBotones = document.createElement('div');
                //divBotones.classList.add('row');
                //divBotones.classList.add('mt-4');// Modificar
                


                let divCol = document.createElement('div');
                //divCol.classList.add('col');

                //let buttonInside = document.createElement('button');
                buttonInside.setAttribute('class', 'btn btn-primary btn-block btn-sm');
                buttonInside.innerHTML = "Agendar";

                var especialidad = document.getElementById('especialidades').value;
                url = "/Paciente/Agenda_1" + "?idMedico=" + cajaInfo.getAttribute('data-idMedico') + "&fechaPrimeraHora=" + cajaInfo.getAttribute('data-fecha') + "&m=" + cajaInfo.getAttribute('data-m') + "&r=" + cajaInfo.getAttribute('data-r') + "&c=" + cajaInfo.getAttribute('data-c') + "&especialidad=" + medico.codigoEspecialidad;

                divBotones.appendChild(divCol);
                divCol.appendChild(buttonInside);
                //divBotones.appendChild(buttonInside);
                divPerfilProfesional.appendChild(divBotones);
                //Fin boton Aceptar
                divBack.appendChild(divPerfilProfesional);
            }
        });

        // start Front Card
        divCard.classList.add('card', 'caja-profesional');

        // Se genera Front de tarjeta
        let divFront = document.createElement('div');
        divFront.classList.add('front');

        let fotoProfesional = document.createElement('img');
        // fotoProfesional.classList.add('card-img-top');
        
        var baseS3 = 'https://appdiscoec2.s3.amazonaws.com'
        if (!medico.fotoPerfil.includes('Avatar.svg')) {
            fotoProfesional.src = baseS3 + medico.fotoPerfil.replace(/\\/g, '/');
        }
        else {
            fotoProfesional.src = baseUrlWeb + medico.fotoPerfil;
        }
        let divCardBody = document.createElement('div');
        divCardBody.classList.add('card-body');

        let divContData = document.createElement('div');
        divContData.classList.add('cont-data');

        let divDataAtencion = document.createElement('div');
        divDataAtencion.classList.add('data-atencion');


        let calendarIcon = document.createElement('i');
        calendarIcon.classList.add('fal', 'fa-calendar-alt');

        let spanHeader = document.createElement('span');
        spanHeader.classList.add('header-aviso-atencion');
        spanHeader.appendChild(calendarIcon);


        let labelProximaAtencion = document.createElement('span');

        labelProximaAtencion.innerHTML = "Próxima Atención";

        spanHeader.appendChild(labelProximaAtencion);

        divDataAtencion.appendChild(spanHeader);


        let divClasificación = document.createElement('div');
        divClasificación.classList.add("calificacion");

        for (var i = 0; i < 5; i++) {
            let divEstrellaPositiva = document.createElement('i');
            divEstrellaPositiva.classList.add('fas');
            divEstrellaPositiva.classList.add('fa-star');
            divEstrellaPositiva.classList.add('positiva');
            divClasificación.appendChild(divEstrellaPositiva);

        }
        for (var i = 0; i < 0; i++) {
            let divEstrellaNeutra = document.createElement('i');
            divEstrellaNeutra.classList.add('fal');
            divEstrellaNeutra.classList.add('fa-star');
            divClasificación.appendChild(divEstrellaNeutra);
        }


        if (tipoFiltro == 'O' && idCliente != 241 && idCliente != 148) {
            if (medico.modalidad.includes("1")) {    //DEBE APARECER BOTON FONASA Y PARTICULAR

                divClasificación.classList.add("d-none");
                let divTipoAtencion = document.createElement('div');
                divTipoAtencion.classList.add('tipo-atencion');
                divCard.classList.add('atencion-fonasa');

                let atencionFonasa = document.querySelector('atencion-fonasa');

                let atencionFonasaBot = document.createElement('div');
                atencionFonasaBot.classList.add('btn', 'btn-primary', 'btn-sm');
                atencionFonasaBot.textContent = 'Agendar';

                divFront.appendChild(atencionFonasaBot);
            } else { //SOLO DEBE APARECER BOTON PARTICULAR

                divClasificación.classList.add("d-none");
                let divTipoAtencion = document.createElement('div');
                divTipoAtencion.classList.add('tipo-atencion');
                divCard.classList.add('atencion-fonasa', 'particular');

                let atencionFonasa = document.querySelector('atencion-fonasa');

                let atencionFonasaBot = document.createElement('div');
                atencionFonasaBot.classList.add('btn', 'btn-primary', 'btn-sm'); //Not
                atencionFonasaBot.textContent = 'Agendar';
                divFront.appendChild(atencionFonasaBot);

            }
        }


        // data atencion - clasificacion

        let spanNombreMedico = document.createElement('span');
        spanNombreMedico.classList.add('nombre-profesional');


        let spanTituloProfesionalNombre = document.createElement('span');
        spanTituloProfesionalNombre.classList.add('titulo-profesional');
        spanTituloProfesionalNombre.textContent = medico.prefijoProfesional + ' ';

        spanNombreMedico.appendChild(spanTituloProfesionalNombre);

        let labelNombreProfesional = document.createElement('span');
        labelNombreProfesional.innerHTML = `${medico.nombreMedico} ${medico.apellidoPaternoMedico} <br> ${medico.apellidoMaternoMedico}`;

        let labelInstitucionProfesional = document.createElement('small');
        // labelInstitucionProfesional.innerHTML = medico.almaMater;
        var numRegistro = (medico.numeroRegistro == 0) ? "" : ` - ${ medico.numeroRegistro}` ;
        labelInstitucionProfesional.innerHTML = `${medico.almaMater} ${numRegistro}`;


        spanNombreMedico.appendChild(labelNombreProfesional);
        spanNombreMedico.appendChild(labelInstitucionProfesional);
        divDataAtencion.appendChild(spanNombreMedico);

        //let spanAlmaProfesional = document.createElement('span');
        //spanAlmaProfesional.classList.add('titulo-profesional');
        //spanAlmaProfesional.innerHTML = medico.almaMater;

        //divDataAtencion.appendChild(spanAlmaProfesional);
        let spanTituloProfesional = document.createElement('span');
        spanTituloProfesional.classList.add('especialidad-profesional', 'fuente-accesible');
        spanTituloProfesional.innerHTML = medico.especialidad;

        if (idCliente != 108) {
            divDataAtencion.appendChild(spanTituloProfesional);
        }


        /* let labelAtencionCercana = document.createElement('div');
         labelAtencionCercana.classList.add('label-atencion');
         labelProximaAtencion.innerHTML = "Atención más cercana";*/

        divDataAtencion.appendChild(divClasificación);
        // divDataAtencion.appendChild(labelAtencionCercana);

        let spanFechaAtencion = document.createElement('span');
        spanFechaAtencion.classList.add('d-block');
        spanFechaAtencion.classList.add('fecha-atencion', 'front-fecha-atencion');
        if (idCliente == 108) {
            spanFechaAtencion.appendChild(spanTituloProfesional);
        }

        let lblFechaAtencion = document.createElement('strong');
        lblFechaAtencion.innerHTML = `${medico.fechaText} - ${medico.horaDesdeText} HRS`;

        spanFechaAtencion.appendChild(lblFechaAtencion);


        divDataAtencion.appendChild(spanFechaAtencion);



        if (!medico.atencionDirecta) {

            let spanHoraAtencion = document.createElement('span');
            spanHoraAtencion.classList.add('d-block');
            spanHoraAtencion.classList.add('hora-atencion');

            let lblHoraAtencion = document.createElement('span');
            lblHoraAtencion.innerHTML = `${medico.horaDesdeText} hrs`;


            if (medico.cobrar) {
                let atencionParticular = document.createElement('div');
                atencionParticular.classList.add('atencion-particular');

                if (idCliente != "148")
                    atencionParticular.innerHTML = ` <span>Atención Particular</span>`;

                spanHoraAtencion.appendChild(lblHoraAtencion);
                divDataAtencion.appendChild(spanHoraAtencion);
                divDataAtencion.appendChild(atencionParticular);
            }




            if (index === 0) {
                let lblHoraMasProxima = document.createElement('span');
                // lblHoraMasProxima.classList.add('d-block');
                lblHoraMasProxima.classList.add('aviso-hora');
                lblHoraMasProxima.innerHTML = "Hora más próxima";
                divDataAtencion.appendChild(lblHoraMasProxima);

            }
        }

        let spanHoraAtencionProxima = document.createElement('span');
        spanHoraAtencionProxima.classList.add('d-block');
        spanHoraAtencionProxima.classList.add('aviso-hora');

        let divOpciones = document.createElement('div');

        let linkSearch = document.createElement('a');
        linkSearch.href = "#";
        let iconSearch = document.createElement('i');
        iconSearch.classList.add("fal");
        iconSearch.classList.add("fa-search");
        linkSearch.appendChild(iconSearch);


        let linkCalendar = document.createElement('a');
        linkCalendar.href = "#";
        let iconSearch2 = document.createElement('i');
        iconSearch2.classList.add("fal");
        iconSearch2.classList.add("fa-calendar-alt");
        linkCalendar.appendChild(iconSearch2);


        divOpciones.classList.add('caja-opciones');

        divOpciones.appendChild(linkSearch);
        divOpciones.appendChild(linkCalendar);

        // end. Front Card


        //start. Back Card
        divBack = document.createElement('div');
        divBack.classList.add('back');
        // divBack.innerHTML = `<div class="loader">
        //    <div class="fa-2x">
        //      <i class="fas fa-spinner fa-spin"></i>
        //      </div>
        //  </div>`;
        divBack.innerHTML = '';

        // end. Back Card


        divContData.appendChild(divDataAtencion);
        divContData.appendChild(divOpciones);
        divCardBody.appendChild(fotoProfesional);
        divCardBody.appendChild(divContData);
        // divCard.appendChild(fotoProfesional);
        divFront.appendChild(divCardBody);
        //divBack.appendChild(divPerfilProfesional);
        divCard.appendChild(divFront);
        divCard.appendChild(divBack);
        divCajMedico.appendChild(divCard);

        let divProfesionales = document.getElementById('divProfesionales');

        divProfesionales.appendChild(divCajMedico);
        // Evalua si profesional cobra o no
        if (!medico.cobrar) {
            divCard.classList.add('no-flip');
            buttonInside.setAttribute('class', 'btn btn-primary btn-block btn-sm my-2 btn-agendar nroPlan=' + idCliente);
            buttonInside.innerHTML = "Agendar";
            divCardBody.appendChild(buttonInside);
            url = "/Paciente/Agenda_2" + "?idMedico=" + medico.idMedico + "&fechaPrimeraHora=" + medico.fecha + "&m=" + medico.idModeloAtencion + "&r=" + medico.idReglaPago + "&c=" + medico.idConvenio + "&especialidad=" + medico.codigoEspecialidad + "&tipoatencion=" + window.tipo + "&tipoEspecialidad=" + tipoEspecialidad;

        }
        //click botón agendar
        buttonInside.addEventListener("click", async function () {
            // divCard.classList.remove("flipped");
         
            this.classList.add("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");

            if (medico.atencionDirecta) {
                let valida = await guardarAtencionIngresada(medico.idMedico,
                    medico.idBloqueHora,
                    moment(medico.fecha).format("DD-MM-YYYY"),
                    medico.idMedicoHora,
                    uid,
                    'I');
                if (valida !== 0) {
                    await agendarRealTime();
                    if (connection.state === signalR.HubConnectionState.Connected) {
                        connection.invoke('SubscribeCalendarMedico', parseInt(medico.idMedico)).then(r => {

                            connection.invoke("ActualizarCalendarMedico", parseInt(medico.idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "actualizar").then(r => {
                                connection.invoke('UnsubscribeCalendarMedico', parseInt(medico.idMedico)).catch(err => console.error(err));
                            }).catch(err => console.error(err));
                        }).catch((err) => {
                            return console.error(err.toString());
                        });
                    }
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                    let timerInterval
                    Swal.fire({
                        title: `Estás siendo redireccionado a la atención, seras atendido por ${medico.prefijoProfesional} ${medico.nombreMedico}`,
                        html: '',
                        timer: 6000,
                        backdrop: 'static',
                        timerProgressBar: true,
                        confirmButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                        onClose: () => {
                            clearInterval(timerInterval)
                        }
                    });
                    window.location.href = "/Atencion/" + valida.infoAtencion.idAtencion;

                }
                else {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                }
            }
            //convenio tipo suscripcion, sin pago, pasa a agenda 2, sin ingresar numero de serie de cedula de identidad
            else if (!medico.cobrar) {
                if (medico.codigoEspecialidad == 4 && !(window.host.includes("clinicamundoscotia."))) {
                    await $("#modalAlertaPediatria").modal("show");

                    document.getElementById("btnCerrar").onclick = async () => {
                        location.href = url;
                    }
                }


                else {
                    location.href = url;
                }
                divCard.classList.remove("flipped");
               
            }
            // tarjeta pago
            else {
                if (medico.codigoEspecialidad == 4) {
                    await $("#modalAlertaPediatria").modal("show");

                    document.getElementById("btnCerrar").onclick = async () => {
                        location.href = url;
                    }
                }


                else {
                    location.href = url;
                }
                divCard.classList.remove("flipped");
            }
        });

    }
}


async function cargarMedicos(medicos) {

    if (tipoEspecialidad == "oncologia" && medicos.length > 0) {
        medicos = medicos.filter(x => quitarTilde(x.especialidad.toLowerCase()) == tipoEspecialidad)
    }
    if (tipoEspecialidad == "" && (window.host.includes("prevenciononcologica") || window.host.includes("masproteccionsalud"))) {
        medicos = medicos.filter(x => x.codigoEspecialidad != "1")
    }

    if (idCliente == 241 || window.host.includes("unabactiva.") || window.host.includes("activa.unab")) {
        medicosAux = []
        medicos.forEach(medico => {
            if (arrayIdEspec.includes(medico.codigoEspecialidad)) {
                medicosAux.push(medico);
            }
        });

        medicos = medicosAux;
    }



    $("#tab-content").empty();
    let divMedicos = document.getElementById('tab-content');

    if (medicos.length == 0) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", "divSinHorasDisponibles");

        //newDiv.setAttribute("style", "display: flex; align-items: center; max-width: 500px; margin: auto; gap: 1rem; padding: 2rem; background-color: white; border-radius: 10px; border: 1px solid #ddd; margin-top: 5rem;");

        const newImg = document.createElement('img');
        // const src = document.querySelector("#kt_aside_brand a").style.backgroundImage.match(/"([^']+)"/)[1];
        // newImg.setAttribute("src", src);
        // newImg.setAttribute("width", "180px");
        const backgroundImage = document.querySelector("#kt_aside_brand a")?.style.backgroundImage;

        // Verificar si backgroundImage existe y contiene una URL
        let src = '';
        if (backgroundImage && backgroundImage.includes('url(')) {
            const match = backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
            if (match) {
                src = match[1];
            }
        }

        if (src) {
            newImg.setAttribute("src", src);
            newImg.setAttribute("width", "180px");
        } else {
            console.error('No se pudo encontrar la URL de la imagen de fondo.');
        }

        newDiv.appendChild(newImg);
        const newText = document.createElement('span');
        if (window.host.includes("saludtumundoseguro."))
            newText.innerHTML = "Próximamente tendrás horas disponibles para agendar en esta Especialidad. Estamos trabajando para mejorar tu experiencia.";
        else
            newText.innerHTML = "Estamos trabajando para mejorar tu experiencia. Próximamente tendrás horas disponibles para agendar en esta Especialidad.";
        newText.setAttribute("style", "font-size: 1.4rem;")
        newDiv.appendChild(newText);

        $("#divProfesionales").empty();
        document.getElementById("divProfesionales").appendChild(newDiv);

        /*Swal.fire("", "Estamos trabajando para mejorar tu experiencia. Próximamente tendrás horas disponibles para agendar en esta Especialidad", "info").then(() => {
            if (showModalEmail) {
                $('#modal-validacion').modal('show');
            }
        });*/
        return;
    } else if (showModalEmail) {
        if ((window.host.includes("prevenciononcologica")
            || window.host.includes("clinicamundoscotia.")
            || window.host.includes("masproteccionsalud.")
            || window.host.includes("saludproteccion.")
            || window.host.includes("saludtumundoseguro.")
            || window.host.includes("unabactiva."))) {
            $('#modal-validacion').modal('show');
        }
    }
    clearProfesionales("divProfesionales");
    if (medicos[0].swalVisible && medicos[0].tipoMensaje == "1") {
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", "divSinHorasDisponibles");

            const newImg = document.createElement('img');
            const src = document.querySelector("#kt_aside_brand a").style.backgroundImage.match(/"([^']+)"/)[1];
            newImg.setAttribute("src", src);
            newImg.setAttribute("width", "180px");
            newDiv.appendChild(newImg);
            const newText = document.createElement('span');
            newText.innerHTML = `<span style="font-size: 2.0rem; line-height: 1; font-weight: 700; color: #3BC1CD">${medicos[0].titleSwal}</span><br>${medicos[0].mensajeRetorno}`;
            newText.setAttribute("style", "font-size: 1.2rem;")
            newDiv.appendChild(newText);

            $("#divProfesionales").empty();
            document.getElementById("divProfesionales").appendChild(newDiv);

            swal.fire({
                title: medicos[0].titleSwal,
                html: medicos[0].mensajeRetorno,
                type: 'info',
                showCancelButton: false,
                reverseButtons: true,
                showCloseButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: medicos[0].buttonType,
                //allowOutsideClick: false,
                //allowEscapekey: false
            }).then(async function (result) {
                if (result.value) {
                    switch (medicos[0].tipoMensaje) {
                        case "1":
                            await sendContacto(medicos[0].textMail);
                            Swal.fire({
                                title: "Un ejecutivo se pondrá en contacto a la brevedad",
                                customClass: {

                                    title: 'mi-clase-css'

                                }
                            });
                            break;
                        case "2":

                            break;
                        default:

                            break;
                    }
                }
            });



        }
        else if (medicos[0].swalVisible && medicos[0].tipoMensaje == "3") {
            const newDiv = document.createElement('div');
            newDiv.setAttribute("id", "divSinHorasDisponibles");

            // newDiv.setAttribute("style", "display: flex; align-items: flex-start; max-width: 500px; margin: auto; gap: 1rem; padding: 2rem; background-color: white; border-radius: 10px; border: 1px solid #ddd; margin-top: 5rem;");

            const newImg = document.createElement('img');
            const src = document.querySelector("#kt_aside_brand a").style.backgroundImage.match(/"([^']+)"/)[1];
            newImg.setAttribute("src", src);
            newImg.setAttribute("width", "180px");
            newDiv.appendChild(newImg);
            const newText = document.createElement('span');
            newText.innerHTML = `<span style="font-size: 2.0rem; line-height: 1; font-weight: 700; color: #3BC1CD">${medicos[0].titleSwal}</span><br>${medicos[0].mensajeRetorno}`;
            newText.setAttribute("style", "font-size: 1.2rem;")
            newDiv.appendChild(newText);

            $("#divProfesionales").empty();
            document.getElementById("divProfesionales").appendChild(newDiv);

            $("#modal-psiquiatria").modal("show");
            if ($("#btn-agenda-ps").length > 0) {
                //document.getElementById("btn-agenda-ps").onclick = async () => {
                //    document.getElementById("especialidades").value = 47
                //    $("#especialidades").val(47).trigger("change");
                //    $("#modal-psiquiatria").modal("hide");
                //}
                document.getElementById("btn-agenda-ps").onclick = async () => {
                    let idRedirect = 47;
                    //if (window.host.includes("falp.")) {
                    //    idRedirect = 117; // convenio falp (117 terapia psicologica)
                    //}
                    document.getElementById("especialidades").value = idRedirect;
                    $("#especialidades").val(idRedirect).trigger("change");
                    $("#modal-psiquiatria").modal("hide");
                }
            }


            //swal.fire({
            //    title: medicos[0].titleSwal,
            //    html: medicos[0].mensajeRetorno,
            //    type: 'info',
            //    showCancelButton: false,
            //    reverseButtons: true,
            //    cancelButtonText: 'Cancelar',
            //    confirmButtonText: medicos[0].buttonType,
            //    //allowOutsideClick: false,
            //    //allowEscapekey: false
            //}).then(async function (result) {
            //    if (result.value) {
            //        switch (medicos[0].tipoMensaje) {
            //            case "1":
            //                //await sendContacto(medicos[0].textMail);
            //                //Swal.fire("")
            //                break;
            //            case "2":
            //                break;
            //            default:
            //                break;
            //        }
            //    }

            //});
        }
        else if (medicos[0].swalVisible && medicos[0].tipoMensaje == "2") {
            const newDiv = document.createElement('div');
            newDiv.setAttribute("id", "divSinHorasDisponibles");

            // newDiv.setAttribute("style", "display: flex; align-items: flex-start; max-width: 500px; margin: auto; gap: 1rem; padding: 2rem; background-color: white; border-radius: 10px; border: 1px solid #ddd; margin-top: 5rem;");

            const newImg = document.createElement('img');
            const src = document.querySelector("#kt_aside_brand a").style.backgroundImage.match(/"([^']+)"/)[1];
            newImg.setAttribute("src", src);
            newImg.setAttribute("width", "180px");
            newDiv.appendChild(newImg);
            const newText = document.createElement('span');
            newText.innerHTML = `<span style="font-size: 2.0rem; line-height: 1; font-weight: 700; color: #3BC1CD">${medicos[0].titleSwal}</span><br>${medicos[0].mensajeRetorno}`;
            newText.setAttribute("style", "font-size: 1.2rem;")
            newDiv.appendChild(newText);

            $("#divProfesionales").empty();
            document.getElementById("divProfesionales").appendChild(newDiv);


            document.getElementById("nombreMC").value = fichaPaciente.nombreCompleto;
            document.getElementById("rutMC").value = fichaPaciente.identificador;
            document.getElementById("telefonoMC").value = fichaPaciente.telefono;
            document.getElementById("correoMC").value = fichaPaciente.correo;
            var stringText = medicos[0].textMail;
            $("#modal-psiquiatria-ccu").modal("show");
            if ($("#btnEnviarSac").length > 0) {
                document.getElementById("btnEnviarSac").onclick = async () => {
                    if (document.getElementById("telefonoMC").value == "" || document.getElementById("correoMC").value == "") {
                        swal.fire({
                            title: "Ooops aún faltan campos por completar!",
                            text: "Es necesario que completes toda la información.",
                            type: "warning",
                            confirmButtonText: "Entendido",
                            showCancelButton: false
                        });
                        return;
                    }

                    stringText = stringText + document.getElementById("telefonoMC").value + " - " + document.getElementById("correoMC").value;
                    var response = await sendContacto(stringText);
                    var responseMailPaciente = await sendEnvioExitoso(document.getElementById("correoMC").value); // Se envia correo a paciente, se gestiona hora en backoffice
                    var respuesta = await EditPhoneEmail(document.getElementById("correoMC").value, document.getElementById("telefonoMC").value, uid);

                    $("#modal-psiquiatria-ccu").modal("hide");
                    $("#modal-envio-sac").modal("show");
                }
            }

        }


        else {
            medicos.forEach(iterarMedicos);
        }



        if ($(".kt_widget4_tab1_content").length == 0) {

            $("#tab-content").empty();
            document.querySelector('[id="pnlMedicos"]').setAttribute('style', 'display:block')
        }
    }


    async function clearProfesionales(elementID) {
        document.getElementById(elementID).innerHTML = "";
    }



    async function cargarEspecialidades(especialidadesM) {

        const especialidad = $("#especialidadSeleccionada").val();
        const bloque = $("#bloquesHora").val();
        const fecha = document.querySelector('[name="fechaBusqueda"]').value;
        let especialidades = await getMedicosHoraProxima("S", especialidad, bloque, fecha, uid, idCliente);

        especialidades.forEach(especialidad => {
            $("#especialidades").append('<a class="dropdown-item itemEspecialidad" data-id="' + especialidad.idEspecialidad + '" href="#">' + especialidad.especialidad + '</a>');
        });
    }
    function cargarBloquesHora(bloqueshora) {
        bloqueshora.forEach(bloques => {
            $("#bloquesHora").append('<option value="' + bloques.idBloqueHora + '">' + moment(bloques.horaDesdeText, "HH:mm:ss").format("HH:mm") /*+ ' - ' + bloques.horaHastaText*/ + '</option>');
        });
    }

    async function guardarAtencionIngresada(idMedico, idBloqueHora, fechaSeleccion, idMedicoHora, uid, estado) {
        var atencion = await getAtencionByIdMedicoHora(idMedicoHora, uid);
        var idAtencion = 0;
        if (atencion && atencion.atencion && atencion.atencion.id !== 0)
            idAtencion = atencion.atencion.id;
        let agendar = {
            id: parseInt(idAtencion),
            idBloqueHora: parseInt(idBloqueHora),
            fechaText: fechaSeleccion,
            triageObservacion: '',
            antecedentesMedicos: '',
            idPaciente: uid,
            SospechaCovid19: false,
            IdMedicoHora: parseInt(idMedicoHora),
            Estado: estado
        };
        let resultado = await putAgendarMedicosHoras(agendar, idMedico, 0);

        if (resultado.status === 'NOK') {
            return 0;
        }
        else {

            return resultado;
        }


    }

    async function agendarRealTime() {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/calendarmedicohub`)
            .configureLogging(signalR.LogLevel.None)
            .withAutomaticReconnect()
            .build();

        try {
            await connection.start();
        } catch (err) {

        }
    }

