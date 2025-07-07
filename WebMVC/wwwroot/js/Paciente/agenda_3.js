
import { EditAntecedentesMedicos, EditDatosObligatorios} from "../apis/personas-fetch.js?1";
import { putAgendarMedicosHoras, putEliminarAtencion } from '../apis/agendar-fetch.js';
import { setCorreoUsuario, personaFotoPerfil } from "../shared/info-user.js";
import { enviarCitaEniax, cambioEstado } from "../apis/eniax-fetch.js?rnd=1"
import { TipoAtencion } from "../apis/medipass-fetch.js";
import { eliminarDerivacion } from '../apis/paciente-derivacion-fetch.js';

var connection;
var connectionAgendar;
var camposCompletados = false;
var archivoCovid = false;
var codPaisPaciente = "";
var hostUrl = new URL(window.location.href);
export async function init(data) {
    debugger
    // Verificar si la fecha de modificación existe y no es nula
    const fechaActual = new Date();
    let aux1;
    if (data.personas.fechaModifica) {
        const fechaModificacion = new Date(data.personas.fechaModifica);
        const diferenciaEnMilisegundos = fechaActual - fechaModificacion;
        const diasDiferencia = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

        if (diasDiferencia > 60) {
            aux1 = true;
        } else {
            aux1 = false;
        }
    } else {
        //"No hay fecha de modificación";
        aux1 = true;
    }

    if (!(window.host.includes("prevenciononcologica")
        || window.host.includes("clinicamundoscotia.")
        || window.host.includes("masproteccionsalud.")
        || window.host.includes("saludproteccion.")
        || window.host.includes("saludtumundoseguro.")
        || window.host.includes("unabactiva.")
        || window.host.includes("metlife.")
        || window.host.includes("positiva.")
        || (aux1 === false))) {

        $('#modal-validacion-datos').modal('show');

        const inputTelefono = document.querySelector("#telefonoMedical");
        let codigoTelefonoform = data.personas.codigoTelefono.toLowerCase();
        inputTelefono.setAttribute('data-codigo-telefono', codigoTelefonoform);
        const iti = window.intlTelInput(inputTelefono, {
            preferredCountries: ['cl', 'co', 'ec', 'mx', 'pe', 'bo', 'br'],
            initialCountry: codigoTelefonoform,
            geoIpLookup: callback => {
                fetch("https://ipapi.co/json")
                    .then(res => res.json())
                    .then(data => callback(data.country_code))
                    .catch(() => callback("cl"));
            },
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
        });

        iti.setNumber(inputTelefono.value.replace("(", "").replace(")", "").replace(" ", ""));

        if (data.personas) {
            //document.getElementById("nombreUsuarioModalValidacion").innerHTML = `Hola ${data.personas.nombre}`
            //validacion de campos
            data.personas.telefonoMovil ??= "";
            data.personas.telefono ??= "";
            data.personas.correo ??= "";
            data.personas.identificador ??= "";
            data.personas.fNacimiento ??= "";
            data.personas.nombre ??= "";
            data.personas.apellidoPaterno ??= "";

            //despliegue de datos
            document.getElementById('correoMedical').value = data.personas.correo;
            document.getElementById('cedulaMedical').value = data.personas.identificador;
            document.getElementById('fechanacMedical').value = data.personas.fNacimiento.split('T')[0];
            if (data.personas.fechaModifica) {
                document.getElementById('fechaModificaMedical').innerHTML = 'actualizado el: ' + data.personas.fechaModifica.split('T')[0].split('-')[2] + '-' + data.personas.fechaModifica.split('T')[0].split('-')[1] + '-' + data.personas.fechaModifica.split('T')[0].split('-')[0];
            }
            document.getElementById('telefonoMedical').value = data.personas.telefonoMovil;
            document.getElementById('nombreMedical').value = data.personas.nombre;
            document.getElementById('apellidoMedical').value = data.personas.apellidoPaterno;

            if (!data.personas.nombre || !/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(data.personas.nombre.trim()) || data.personas.nombre.trim().length === 0) {
                document.getElementById('nombreMedical').removeAttribute('disabled');
            }

            if (!data.personas.apellidoPaterno || !/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(data.personas.apellidoPaterno.trim()) || data.personas.apellidoPaterno.trim().length === 0) {
                document.getElementById('apellidoMedical').removeAttribute('disabled');
            }

            if (data.personas.telefono && data.personas.telefono != null && data.personas.telefono != '') {
                iti.setNumber(data.personas.telefono.replace("(", "").replace(")", "").replace(" ", ""));
            }
        }
        document.getElementById("btnModificarTelefonoEmail").onclick = async () => {
            //def de variables
            var telefonoUpdate = "";
            var emailUpdate = "";
            var fechaNacUpdate = "";
            var nombreUpdate = "";
            var apellidoUpdate = "";
            //var codigoPaisUpdate = "";
            //recuperacion de datos de vista
            emailUpdate = document.getElementById("correoMedical").value;
            telefonoUpdate = iti.getNumber();
            fechaNacUpdate = document.getElementById("fechanacMedical").value;
            nombreUpdate = document.getElementById("nombreMedical").value;
            apellidoUpdate = document.getElementById("apellidoMedical").value;
            //recuperacion de codigo de bandera
            //const inputTelefono = document.querySelector("#telefonoMedical");
            //let codigoTelefonoform = inputTelefono.getAttribute('data-codigo-telefono');
            //console.log(codigoTelefonoform); // Imprime el valor de codigoTelefonoform en la consola
            /*codigoPaisUpdate = document.getElementById("telefonoMedical").value;*/
            //envio de datos actualizados
            var personas = {
                correo: emailUpdate,
                telefono: telefonoUpdate,
                fNacimiento: fechaNacUpdate,
                Nombre: nombreUpdate,
                ApellidoPaterno: apellidoUpdate
            }

        console.log('objeto persona', personas)

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
        var respuesta = await EditDatosObligatorios(personas, uid);

        console.log('respuesa', respuesta)

        if (respuesta.status == "Actualizado") {


            return Swal.fire({
                tittle: "Éxito!",
                text: "Datos actualizados.",
                type: "success",
                confirmButtonText: "OK"
            }).then(() => {
                $('#modal-validacion-datos').modal('hide');

                showModalEmail = false;

            });



        } else {

           return Swal.fire("Error al actualizar datos", "", "error")
             
        }
    }
	}

    await setCorreoUsuario();
    await personaFotoPerfil();
    let page = document.getElementById('page');

    // Input Info
    let inputInfo = document.getElementById('input-info');
    let tipDoc = document.getElementById('tipDoc');
    let btnClose = document.getElementById('btnClose');
    let btnCloseAntecedentes = document.getElementById('cierreModalAntecedentes');
    // Mostrar Tip
    inputInfo.addEventListener('click', () => {
        event.preventDefault()
        tipDoc.classList.add('show-tip');
    });

    // Cerrar Tip 
    btnClose.addEventListener('click', () => {
        event.preventDefault()
        tipDoc.classList.remove('show-tip');
    })

    btnCloseAntecedentes.addEventListener('click', () => {
        $("#modal-am").modal("hide");
        camposCompletados = true;
    })

    if (window.location.host.includes("positiva."))
        camposCompletados = true;

    if (window.tipoatencion == null || window.tipoatencion == "") {
          tipoatencion = "A";//Agendable
   }
    page.innerHTML = "Agendar atención";
    if (idCliente == 108) {
        if (window.tipoatencion == "I") {
            page.innerHTML = "Atención Inmediata";
            swal.fire({
                html: `
              <strong style="font-size: 18px !important;font-weight: 800;">¿Tu consulta es por COVID-19?</strong><br><br><br>
              <p class="text-left">En caso de tener <strong style="font-size: 15px !important;font-weight: 800;">un PCR Positivo,</strong> debes adjuntar tu examen.</p>
              <p class="text-left">En caso de <strong style="font-size: 15px !important;font-weight: 800;"> tener un test de antígeno positivo,</strong> deberás adjuntar una foto del examen y una foto del envase.</p>
              <p class="text-left">Es <strong style="font-size: 15px !important;font-weight: 800;">requisito</strong> que en tu hora médica adjuntes esta documentación</p>
             `,
                confirmButtonText: 'SI',
                cancelButtonText: 'NO',
                showCancelButton: true,
                allowOutsideClick: false,
                type: 'question'
            }).then(async function (result) {
                if (result.value) {
                    archivoCovid = true;
                    document.getElementById('ejemImg').classList.remove('d-none')
                }
            });
        }
    }
    //else {
    //    if (window.tipoatencion == "I") {
    //        page.innerHTML = "Atención Inmediata";
    //        swal.fire({
    //            html: `
    //          <strong style="font-size: 18px !important;font-weight: 800;">¡Hola! ¿Tu consulta es por COVID—19?.</strong><br><br><br>
    //          <p class="text-left">En caso de tener <strong style="font-size: 15px !important;font-weight: 800;">PCR Positivo,</strong> debes adjuntar tu examen.</p>
    //          <p class="text-left">En caso de <strong style="font-size: 15px !important;font-weight: 800;">Antígeno,</strong> deberás adjuntar una imagen con el test positivo y su envase.</p>
    //          <p class="text-left">Ambos son <strong style="font-size: 15px !important;font-weight: 800;">requisitos</strong> para poder atenderte. <img src="/img/emojiDemora.png" style="width: 20px;"> <img src="/img/emojiDemora.png" style="width: 20px;"></p>
    //         `,
    //            confirmButtonText: 'SI',
    //            cancelButtonText: 'NO',
    //            showCancelButton: true,
    //            allowOutsideClick: false,
    //            type: 'question'
    //        }).then(async function (result) {
    //            if (result.value) {
    //                archivoCovid = true;
    //                document.getElementById('ejemImg').classList.remove('d-none')
    //            }
    //        });
    //    }
    //}

    await agendarRealTime();
    if ($("#fechaTextInfo").length) {
        document.getElementById("fechaTextInfo").innerHTML = window.fechaText;
        document.getElementById("bloqueHoraText").innerHTML = horaText;
    }
    var buttonConfirmar = document.getElementById("btnConfirmar");

    var btnAnura = document.getElementById("btnAnura");


    //buttonConfirmar.innerHTML = "Confirmar";
    if ($("#motivoConsulta").length && window.tipoEspecialidad == "examenes") {
        $("#motivoConsulta").val(3).change();
        let motivo = document.getElementById("motivoConsulta");
        document.getElementById("triageObservacion").value = motivo.options[motivo.selectedIndex].text;
    }

    $('#form_edit_am').validate({
        errorClass: 'text-danger',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        },
        submitHandler: async function (form, e) {
            e.preventDefault();

            let medicamentos = document.getElementById("Medicamentos").value
            let habitos = document.getElementById("Habitos").value
            let enfermedades = document.getElementById("Enfermedades").value
            let alergias = document.getElementById("Alergias").value
            let cirugias = document.getElementById("Cirugias").value

            if (document.querySelector('input[name="radioAlergia"]:checked').value == "false")
                alergias = "No refiere";
            else {
                if (alergias == "") {
                    document.getElementById("Alergias").focus();
                    return;
                }
            }

            if (document.querySelector('input[name="radioMedicamento"]:checked').value == "false")
                medicamentos = "No refiere";
            else {
                if (medicamentos == "") {
                    document.getElementById("Medicamentos").focus();
                    return;
                }
            }

            if (document.querySelector('input[name="radioEnfermedad"]:checked').value == "false")
                enfermedades = "No refiere";
            else {
                if (enfermedades == "") {
                    document.getElementById("Enfermedades").focus();
                    return;
                }
            }

            if (document.querySelector('input[name="radioCirugia"]:checked').value == "false")
                cirugias = "No refiere";
            else {
                if (cirugias == "") {
                    document.getElementById("Cirugias").focus();
                    return;
                }
            }

            if (document.querySelector('input[name="radioHabito"]:checked').value == "false")
                habitos = "No refiere"
            else {
                if (habitos == "") {
                    document.getElementById("Habitos").focus();
                    return;
                }
            }
            $('#btn_guardar_am').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);

            let formAnt = {
                Medicamentos: medicamentos,
                Habitos: habitos,
                Enfermedades: enfermedades,
                Alergias: alergias,
                Cirugias: cirugias,
                Id: uid
            }

            let result = await EditAntecedentesMedicos(formAnt, uid);
            $('#btn_guardar_am').removeAttr('disabled').children('.spinner-border').remove();
            if (result.status === 'OK') {
                $('#btn_guardar_am').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Antecedentes médicos actualizados.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {

                });
                $("#modal-am").modal("hide")
                camposCompletados = true;
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }
        }
    });
    //check Acepta todo
    let contCheckAceptaTodo = document.createElement('div');
    contCheckAceptaTodo.classList.add('text-right');

    let checkAceptaTodo = document.createElement('input');
    checkAceptaTodo.type = 'checkbox';
    checkAceptaTodo.id = 'aceptaTodo';
    checkAceptaTodo.name = 'aceptaTodo';
    checkAceptaTodo.classList.add('form-check-label');

    let labelCheckAceptaTodo = document.createElement('label');
    labelCheckAceptaTodo.htmlFor = 'aceptaTodo';
    labelCheckAceptaTodo.classList.add('fuente-accesible');
    //labelCheckAceptaTodo.setAttribute('style', 'margin-top: 20px; margin-left:5px;')
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

    codPaisPaciente = data.personas.codigoTelefono;
    if (data.personas.codigoTelefono == "CO") {
        // Elements inside label
        labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/documentosLegalesCO/TERMINOS-Y-CONDICIONES-GENERALES-DE-FUNCIONAMIENTO-Medical-Solutions-Colombia-S.A.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
        <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de Telemedicina de ${window.textoMarca}.
        Declaro haber leído y aceptado a mi entera conformidad.
        <br /> <strong>AVISO:</strong>
        El servicio de consulta de telemedicina online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
        <br>
        Conoce tus
        <a href="https://medical.medismart.live/terminosycondicionesco/DerechosDeberes_CO.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
        <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
        para la consulta de telemedicina.
        `;
    } else if (data.personas.codigoTelefono == "MX") {
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
    } else if (data.personas.codigoTelefono == "EC") {
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
    else if (window.host.includes('clinicamundoscotia.')) {
        // Elements inside label
        labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/Terminosycondiciones/TERMINOSYCONDICIONES.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a> 
        <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina de Clinica Online.
        Declaro haber leído y aceptado a mi entera conformidad.
        <br /> AVISO:
        El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma. <br />
        <br>
        Conoce tus
        <a href="https://medical.medismart.live/DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
        <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
        para la consulta de telemedicina.
        `;
    }
    else if (window.host.includes('prevenciononcologica.')) {

        labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/terminoscla/TERMINOSYCONDICIONESCLA.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina de Onocológica. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma Oncológico.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la consulta de telemedicina.
                                                `;
    } else if (window.host.includes('masproteccionsalud.')) {

        labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/terminoscla/TERMINOSYCONDICIONESCLA.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina de +Protección. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma de +Protección.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la consulta de telemedicina.
                                                `;
    }
    else if (window.host.includes('unabactiva.')) {

        labelCheckAceptacion.innerHTML = `*Acepto los <a href="/TerminosyCondicionesUnab/Terminos_y_Condiciones_VF.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a>
                                                <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas de telemedicina de Onocológica. Declaro haber leído y aceptado a mi entera conformidad.
                                                <br /> AVISO: El servicio de consulta de telemedicina es proporcionado por el médico y facilitado por la plataforma Oncológico.
                                                <br>
                                                Conoce tus
                                                <a href="https://medical.medismart.live/DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a>
                                                <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>
                                                para la consulta de telemedicina.
                                                `;
    }
    else if (window.host.includes('prestasalud.')){
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
        // Elements inside label
        labelCheckAceptacion.innerHTML = `*Acepto los <a href="https://medical.medismart.live/Terminosycondiciones/TERMINOSYCONDICIONES.pdf" target="_blank" class="d-inline-block d-lg-none">términos y condiciones</a> 
        <a href="javascript:void(0);" id="terminos" class="d-none d-lg-inline-block fuente-accesible">términos y condiciones</a> en el servicio de consultas Tele-medica de ${textoMarca}. 
        Declaro haber leído y aceptado a mi entera conformidad.
        <br /> <strong>AVISO:</strong>
        El servicio de consulta tele-médica online es proporcionado por el médico y facilitado por la plataforma ${textoMarca}. <br />
        <br>
        Conoce tus
        <a href="https://medical.medismart.live/DeberesDerechos/DerechosDeberes.pdf" target="_blank" class="d-inline-block d-lg-none">derechos y deberes</a> 
        <a href="javascript:void(0);" id="deberes" class="d-none d-lg-inline-block fuente-accesible">derechos y deberes</a>         
        para la consulta Tele-medica.
        `;
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
   // labelCheckAceptaCuentaPersonal.setAttribute('style', 'margin-top: -15px;')
    // Elements inside label
    labelCheckAceptaCuentaPersonal.innerHTML = `Declaro que reconozco que la cuenta es personal e intransferible, que los datos contenidos son personales y sensibles, por lo que no podrán ser utilizados por otra persona que no sea el titular`;
    if (codPaisPaciente == "CO") {
        labelCheckAceptaCuentaPersonal.innerHTML = `Declaro que reconozco que la cuenta es personal e intransferible, que los datos contenidos son personales y sensibles, por lo que no podrán ser utilizados por otra persona que no sea el titular
            <a href="/Terminosycondiciones_Co/POLÍTICAS-DE-PRIVACIDAD-Y-TRATAMIENTO-DE-DATOS-Medical-Solutions-Colombia_S.A.pdf" target="_blank" class="d-inline-block d-lg-none"></a>
            <a href="javascript:void(0);" id="politicas" class="d-none d-lg-inline-block">Políticas de privacidad</a> `;
    }


    //check Acepta concentimiento
    let contCheckAceptaConsentimiento = document.createElement('div');
    //if (medico.personasDatos.especialidad.includes("Veterinaria"))
    //    contCheckAceptaConsentimiento.classList.add('d-none');
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
    var urlConsentimiento = "https://medical.medismart.live/Consentimiento-Informado/Consentimiento-Informado.pdf";
    if (window.host.includes("prevenciononcologica")) {
        urlConsentimiento = "https://medical.medismart.live/terminoscla/consentimientoinformadoCLA.pdf";
    }
    //Consentimiento CO
    else if (data.personas.codigoTelefono == "CO") {
        var urlConsentimiento = "https://medical.medismart.live/documentosLegalesCO/CONSENTIMIENTO-INFORMADO-PARA-ATENCION-POR-TELEMEDICINA-Medical-Solutions-Colombia.pdf";
    }
    else if (data.personas.codigoTelefono == "EC") {
        var urlConsentimiento = "https://medical.medismart.live/documentosLegalesEC/CONSENTIMIENTO-INFORMADO-MEDISMART-ECUADOR-SAS.pdf";
    }
    if (data.personas.codigoTelefono == "CO") {
        labelCheckAceptaConsentimiento.innerHTML = `He leído y acepto el
        <a href="`+ urlConsentimiento + `" target="_blank" class="d-inline-block d-lg-none">consentimiento informado</a> 
        <a href="javascript:void(0);" id="consentimiento" class="d-none d-lg-inline-block fuente-accesible">consentimiento informado</a>  `;

    }
    else if (window.host.includes("unabactiva.")){
        labelCheckAceptaConsentimiento.innerHTML = `He leído y acepto el
        <a href="/TerminosyCondicionesUnab/Consentimiento_Informado_VF.pdf" target="_blank" class="d-inline-block d-lg-none">consentimiento informado</a> 
        <a href="javascript:void(0);" id="consentimiento" class="d-none d-lg-inline-block fuente-accesible">consentimiento informado</a>  `;
    }
    else {
        labelCheckAceptaConsentimiento.innerHTML = `He leído y acepto el
        <a href="`+ urlConsentimiento + `" target="_blank" class="d-inline-block d-lg-none">consentimiento informado</a>
        <a href="javascript:void(0);" id="consentimiento" class="d-none d-lg-inline-block fuente-accesible">consentimiento informado</a>  `;

    }
    contCheckAceptaTodo.appendChild(checkAceptaTodo);
    contCheckAceptaTodo.appendChild(labelCheckAceptaTodo);
    contCheckAceptacion.appendChild(checkAceptacion);
    contCheckAceptacion.appendChild(labelCheckAceptacion);
    contCheckAceptaConsentimiento.appendChild(checkAceptaConsentimiento);
    contCheckAceptaConsentimiento.appendChild(labelCheckAceptaConsentimiento);
    // Cuenta personal
    contCheckAceptaCuentaPersonal.appendChild(checkAceptaCuentaPersonal);
    contCheckAceptaCuentaPersonal.appendChild(labelCheckAceptaCuentaPersonal);

    var divChecks = document.getElementById('checks');
    divChecks.appendChild(contCheckAceptaTodo);
    divChecks.appendChild(contCheckAceptacion);
    divChecks.appendChild(contCheckAceptaConsentimiento);
    if (!window.host.includes("prevenciononcologica.") && !window.host.includes("masproteccionsalud.") && !window.host.includes("saludproteccion") && !window.host.includes("clinicamundoscotia.")) {
        divChecks.appendChild(contCheckAceptaCuentaPersonal);
    }


    
    //Fin Check Aceptacion
    if (window.host.includes("clinicamundoscotia.")) {
        checkAceptaConsentimiento.checked = true;
        checkAceptacion.checked = true;
    }
    else if (window.tipoatencion != "I" || window.especialidadFila == 77) {
        divChecks.classList.add('d-none');
        checkAceptaConsentimiento.checked = true;
        checkAceptacion.checked = true;
        checkAceptaCuentaPersonal.checked = true;
    }



    var check = document.getElementById("aceptaTodo");
    check.onchange = async () => {
        var aceptaTerminos = document.getElementById("aceptaTerminos");
        var aceptaConsentimiento = document.getElementById("aceptaConsentimiento");
        var aceptaCuentaPersonal = document.getElementById("aceptaCuentaPersonal");
        if (check.checked) {
            aceptaTerminos.checked = true;
            aceptaConsentimiento.checked = true;
            aceptaCuentaPersonal.checked = true;
        }
        else {
            aceptaTerminos.checked = false;
            aceptaConsentimiento.checked = false;
            aceptaCuentaPersonal.checked = false;
        }
    }
    var motivo = document.getElementById("motivoConsulta");
    if (motivo && motivo != null) {
        motivo.onchange = async () => {
            
            if (motivo.value > 0) {
                document.getElementById("triageObservacion").value = motivo.options[motivo.selectedIndex].text;
            }
        }
    }
    //#region camposRadioButton change radiobuttons
    if ($("#terminos").length) {
        let terminos = document.getElementById('terminos');

        var UrlTerminosyCondiciones = "/Terminosycondiciones/TERMINOSYCONDICIONES.pdf";
        if (data.personas.codigoTelefono == "CO") {
            UrlTerminosyCondiciones = "/documentosLegalesCO/TERMINOS-Y-CONDICIONES-GENERALES-DE-FUNCIONAMIENTO-Medical-Solutions-Colombia-S.A.pdf";
        }
        if (data.personas.codigoTelefono == "EC") {
            UrlTerminosyCondiciones = "/documentosLegalesEC/TERMINOS-Y-CONDICIONES-VIDEOCONSULTA-Medismart-Ecuador-SAS.pdf";
        }
        if (window.host.includes("unabactiva.")) {
            UrlTerminosyCondiciones = "https://medical.medismart.live/TerminosyCondicionesUnab/Terminos_y_Condiciones_VF.pdf";
        }
        if (data.personas.codigoTelefono == "MX") {
            UrlTerminosyCondiciones = "/documentosLegalesMX/TerminosycondicionesMX.pdf";
        }
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
    }

    if ($("#consentimiento").length) {
        let consentimiento = document.getElementById('consentimiento');
        var urlConsentimiento = "https://medical.medismart.live/Consentimiento-Informado/Consentimiento-Informado.pdf";
        if (data.personas.codigoTelefono == "CO") {
            urlConsentimiento = "/documentosLegalesCO/CONSENTIMIENTO-INFORMADO-PARA-ATENCION-POR-TELEMEDICINA-Medical-Solutions-Colombia.pdf";
        }
        if (data.personas.codigoTelefono == "EC") {
            urlConsentimiento = "/documentosLegalesEC/CONSENTIMIENTO-INFORMADO-MEDISMART-ECUADOR-SAS.pdf";
        }
        if (window.host.includes("unabactiva.")) {
            urlConsentimiento = "https://medical.medismart.live/TerminosyCondicionesUnab/Consentimiento_Informado_VF.pdf";
        }
        if (data.personas.codigoTelefono == "MX") {
            urlConsentimiento = "/documentosLegalesMX/Consentimiento-InformadoMX.pdf";
        }
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
    if ($("#deberes").length) {
        let deberes = document.getElementById('deberes');
        var urlDeberes = "https://medical.medismart.live/DeberesDerechos/DerechosDeberes.pdf";
        if (data.personas.codigoTelefono == "CO") {
            urlDeberes = "https://medical.medismart.live/terminosycondicionesco/DerechosDeberes_CO.pdf";
        }
        if (data.personas.codigoTelefono == "MX") {
            urlDeberes = "/documentosLegalesMX/DerechosDeberesMX.pdf";
        }
        if (data.personas.codigoTelefono == "EC") {
            urlDeberes = "https://medical.medismart.live/documentosLegalesEC/DerechosDeberes_EC.pdf";
        }
        if (window.host.includes("prestasalud.")) {
            urlDeberes = "https://medical.medismart.live/documentosLegalesPrestaSalud/DerechosDeberes_PS.pdf";
        }
        deberes.onclick = async () => {
            let modalBodyDeberes = document.getElementById('modalBodyDeberes');
            $("#modalBodyDeberes").empty();
            let embed = document.createElement('embed');
            embed.src = urlDeberes;
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyDeberes.appendChild(embed);
            $("#modalDeberes").modal("show");
        }
    }
    if (data.personas.codigoTelefono == "CO") {
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
    $('input[type=radio][name="radioAlergia"]').change(function () {
        if ($(this).val() == "true") {
            document.getElementById("Alergias").setAttribute('class', 'form-control')
        }
        else {
            document.getElementById("Alergias").setAttribute('class', 'd-none')
        }
    });

    $('input[type=radio][name="radioCirugia"]').change(function () {
        if ($(this).val() == "true") {
            document.getElementById("Cirugias").setAttribute('class', 'form-control')
        }
        else {
            document.getElementById("Cirugias").setAttribute('class', 'd-none')
        }
    });

    $('input[type=radio][name="radioMedicamento"]').change(function () {
        if ($(this).val() == "true") {
            document.getElementById("Medicamentos").setAttribute('class', 'form-control')
        }
        else {
            document.getElementById("Medicamentos").setAttribute('class', 'd-none')
        }
    });

    $('input[type=radio][name="radioEnfermedad"]').change(function () {
        if ($(this).val() == "true") {
            document.getElementById("Enfermedades").setAttribute('class', 'form-control')
        }
        else {
            document.getElementById("Enfermedades").setAttribute('class', 'd-none')
        }
    });

    $('input[type=radio][name="radioHabito"]').change(function () {
        if ($(this).val() == "true") {
            document.getElementById("Habitos").setAttribute('class', 'form-control')
        }
        else {
            document.getElementById("Habitos").setAttribute('class', 'd-none')
        }
    });

    //#endregion fin change radiobuttons


    buttonConfirmar.addEventListener("click", async function (event) {
        
        event.preventDefault();
        document.getElementById('btnConfirmar')?.classList.add("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
        document.getElementById('btnConfirmar')?.setAttribute('disabled', true);

        var motivo = document.getElementById("motivoConsulta");
        if (motivo && motivo.options[motivo.selectedIndex].value <= 0) {
            Swal.fire(
                '',
                'Debe elegiar un motivo de consulta.',
                'warning'
            );
            // Antes de retornar, quitar el spinner y habilitar el botón
            document.getElementById('btnConfirmar')?.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
            document.getElementById('btnConfirmar')?.removeAttribute('disabled');
            return;
        }
        if (!document.getElementById('aceptaTerminos').checked) {
            Swal.fire(
                '',
                'Debe aceptar los términos y condiciones.',
                'warning'
            );
            // Antes de retornar, quitar el spinner y habilitar el botón
            document.getElementById('btnConfirmar')?.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
            document.getElementById('btnConfirmar')?.removeAttribute('disabled');
            return;
        }

        if (!document.getElementById('aceptaConsentimiento').checked) {
            Swal.fire(
                '',
                'Debe aceptar consentimiento informado.',
                'warning'
            );
            // Antes de retornar, quitar el spinner y habilitar el botón
            document.getElementById('btnConfirmar')?.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
            document.getElementById('btnConfirmar')?.removeAttribute('disabled');
            return;
        }

        if (!window.host.includes("masproteccionsalud.") && !window.host.includes("prevenciononcologica.") && !window.host.includes("saludproteccion") && !window.host.includes("clinicamundoscotia.") && !document.getElementById('aceptaCuentaPersonal').checked) {
            Swal.fire(
                '',
                'Debe aceptar las condiciones de uso de la cuenta.',
                'warning'
            );
            // Antes de retornar, quitar el spinner y habilitar el botón
            document.getElementById('btnConfirmar')?.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
            document.getElementById('btnConfirmar')?.removeAttribute('disabled');
            return;
        }

        if (archivoCovid && $("#lista_archivos .kt-widget4__item").length == 0) {

            swal.fire({
                html: `<h3>Ooops!</h3>
              <strong style="font-size: 18px !important;font-weight: 800;"></strong><br><br><br>
              <p>Hemos detectado que no ajuntaste tu examen PCR o Imagen del Antígeno <span style='font-size:20px;'>&#128542;</span><span style='font-size:20px;'>&#128542;</span></p>
              <p>Recuerda que esto es <strong style="font-size: 15px !important;font-weight: 800;">requisito </strong> para poder ingresar a la Sala de Espera
              <span style='font-size:20px;'>&#128521;</span><span style='font-size:20px;'>&#128521;</span><span style='font-size:20px;'>&#128521;</span></p>`,
                reverseButtons: true,
                confirmButtonText: 'ENTENDIDO'
            });
            // Antes de retornar, quitar el spinner y habilitar el botón
            document.getElementById('btnConfirmar')?.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
            document.getElementById('btnConfirmar')?.removeAttribute('disabled');
            return;
        }
        if (!camposCompletados) {
            if ((data.personas.alergias == null || data.personas.alergias == "") ||
                (data.personas.medicamentos == null || data.personas.medicamentos == "") ||
                (data.personas.enfermedades == null || data.personas.enfermedades == "") ||
                (data.personas.habitos == null || data.personas.habitos == "") ||
                (data.personas.cirugias == null || data.personas.cirugias == "")) {

                configAntecedentesMedicos(data.personas);
                $("#modal-am").modal("show")
                // Antes de retornar, quitar el spinner y habilitar el botón
                document.getElementById('btnConfirmar')?.classList.remove("kt-spinner", "kt-spinner--right", "kt-spinner--md", "kt-spinner--light");
                document.getElementById('btnConfirmar')?.removeAttribute('disabled');
                return;
            }
        }

        if (idCliente === 148) {
            m = "2";
        }
        var url;
        var estadoAtencion;
        var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a')
            .format("YYYY-MM-DD HH:mm:ss");
        if (m === "2") {
            url = "/Paciente/Agenda_4" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila;
            estadoAtencion = "P";
        }
        else {
            url = "/Paciente/ConfirmarAtencion" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila;
            if (window.tipoatencion === "I")
                url = `/Ingresar_Sala_FU/${idAtencion}`;
            estadoAtencion = "I";
        }
        let agendar = {};
        agendar = {
            id: idAtencion,
            idBloqueHora: idBloqueHora,
            fechaText: fechaSeleccion,
            triageObservacion: document.querySelector('[name="triageObservacion"]').value,
            antecedentesMedicos: document.querySelector('[name="antecedentesMedicos"]').value,
            idPaciente: uid,
            SospechaCovid19: false,
            IdMedicoHora: idMedicoHora,
            Estado: estadoAtencion,
        }

        let valida = await putAgendarMedicosHoras(agendar, idMedico, uid);

        if (valida.status === "NOK") {
            if (valida.err == 3) {

                swal.fire({
                    title: valida.msg,
                    text: "¿Desea agendar nuevamente?",
                    type: 'error',
                    showCancelButton: true,
                    reverseButtons: true,
                    cancelButtonText: 'No, volver a Atenciones',
                    confirmButtonText: 'Sí, ir a Agendar'
                }).then(async function (result) {
                    if (result.value) {
                        window.location.href = "Agendar"
                    }
                    else {
                        window.location.href = "Index";
                    }
                });
                $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
        }
        else {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {

                    connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "actualizar").then(r => {
                        connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                    }).catch(err => console.error(err));
                }).catch((err) => {
                    return console.error(err.toString());
                });
            }

            connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {

                return console.error(err.toString());
            });
            
            if (estadoAtencion === "I" && !valida.infoAtencion.atencionDirecta) {
                if (!window.host.includes('unabactiva.') && !window.host.includes('activa.unab.') && !window.host.includes('achs.') && !window.host.includes('uoh')) {
                    await enviarCitaEniax(valida.infoAtencion.idAtencion);
                }
            }

            $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a').format("YYYY-MM-DD HH:mm:ss");


            //redireccionamiento atencion directa
            if (valida.infoAtencion.atencionDirecta && m == "1") {
                Swal.fire({
                    title: 'Atención confirmada',
                    html: 'Serás redireccionado de forma automática a la sala de espera.',
                    timer: 7000,
                    // backdrop: false,
                    allowOutsideClick: false,
                    type: "success",
                    showConfirmButton: false,
                    timerProgressBar: true,

                })
                window.location = `/Ingresar_Sala_FU/${valida.infoAtencion.idAtencion}`;
            }
            
            window.location.href = url;
        }
    });



    /*flujo smartcheck atencion inmediata / agendable*/
    if ($("#btnAnura").length) {
        btnAnura.addEventListener("click", async function (event) {
            
            event.preventDefault();
            var motivo = document.getElementById("motivoConsulta");
            if (motivo && motivo.options[motivo.selectedIndex].value <= 0) {
                Swal.fire(
                    '',
                    'Debe elegiar un motivo de consulta.',
                    'warning'
                );
                return;
            }
            if (!document.getElementById('aceptaTerminos').checked) {
                Swal.fire(
                    '',
                    'Debe aceptar los términos y condiciones.',
                    'warning'
                );
                return;
            }

            if (!document.getElementById('aceptaConsentimiento').checked) {
                Swal.fire(
                    '',
                    'Debe aceptar consentimiento informado.',
                    'warning'
                );
                return;
            }

            if (!window.host.includes("prevenciononcologica.") && !window.host.includes("saludproteccion") && !window.host.includes("clinicamundoscotia.") && !document.getElementById('aceptaCuentaPersonal').checked) {
                Swal.fire(
                    '',
                    'Debe aceptar las condiciones de uso de la cuenta.',
                    'warning'
                );
                return;
            }

            if (archivoCovid && $("#lista_archivos .kt-widget4__item").length == 0) {

                swal.fire({
                    html: `<h3>Ooops!</h3>
              <strong style="font-size: 18px !important;font-weight: 800;"></strong><br><br><br>
              <p>Hemos detectado que no ajuntaste tu examen PCR o Imagen del Antígeno <span style='font-size:20px;'>&#128542;</span><span style='font-size:20px;'>&#128542;</span></p>
              <p>Recuerda que esto es <strong style="font-size: 15px !important;font-weight: 800;">requisito </strong> para poder ingresar a la Sala de Espera
              <span style='font-size:20px;'>&#128521;</span><span style='font-size:20px;'>&#128521;</span><span style='font-size:20px;'>&#128521;</span></p>`,
                    reverseButtons: true,
                    confirmButtonText: 'ENTENDIDO'
                });
                return;
            }
            if (!camposCompletados) {
                if ((data.personas.alergias == null || data.personas.alergias == "") ||
                    (data.personas.medicamentos == null || data.personas.medicamentos == "") ||
                    (data.personas.enfermedades == null || data.personas.enfermedades == "") ||
                    (data.personas.habitos == null || data.personas.habitos == "") ||
                    (data.personas.cirugias == null || data.personas.cirugias == "")) {

                    configAntecedentesMedicos(data.personas);
                    $("#modal-am").modal("show")
                    return;
                }
            }

            if (idCliente === 148) {
                m = "2";
            }
            var url = "";

            var estadoAtencion = "P";
            $('#btnAnura').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a')
                .format("YYYY-MM-DD HH:mm:ss");


            if (m == 1) { // inmediata                
                url = "/Paciente/ConfirmarAtencion" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila + "&anura=1";
                if (window.tipoatencion === "I")
                    url = `/Ingresar_Sala_FU/${idAtencion}?anura=1`;
            }
            else {
                url = "/Paciente/Agenda_4" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila + "&anura=1";
            }
            let agendar = {};
            agendar = {
                id: idAtencion,
                idBloqueHora: idBloqueHora,
                fechaText: fechaSeleccion,
                triageObservacion: document.querySelector('[name="triageObservacion"]').value,
                antecedentesMedicos: document.querySelector('[name="antecedentesMedicos"]').value,
                idPaciente: uid,
                SospechaCovid19: false,
                IdMedicoHora: idMedicoHora,
                Estado: estadoAtencion,
            }

            let valida = await putAgendarMedicosHoras(agendar, idMedico, uid);
            window.location.href = window.urlSmartcheck+`/?userId=${uid}&redirect=${encodeURIComponent(location.origin + url)}&onCancelRedirect=${encodeURIComponent(location.href)}`;
        });

    };
   /* if (btnAnura) { 
        btnAnura.addEventListener("click", async function (event) {
            event.preventDefault();
            var url;
            url = "https://smartcheckapp.medismart.live/?userID=" + uid + "&link=" + ( window.location.href + "&anura=true");
            //window.open(url);
            window.location.href = url;
        });
    }*/

    document.querySelector("#btnCancelarAtencion").onclick = async () => {
        swal.fire({
            title: 'Eliminar Atención',
            text: "¿Está seguro de eliminar esta atención?",
            type: 'question',
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, Eliminala'
        }).then(async function (result) {
            if (result.value) {
                let valida = await putEliminarAtencion(idAtencion, uid);

                // Carito
                if (connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {
                        connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "eliminar").then(r => {
                            connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                        }).catch(err => console.error(err));
                    }).catch((err) => {
                        return console.error(err.toString());
                    });
                }

                //connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {
                //    return console.error(err.toString());
                //});

                if (valida !== 0) {
                    Swal.fire({
                        tittle: "Éxito!",
                        text: "Ha eliminado la atención",
                        type: "success",
                        confirmButtonText: "OK"
                    });
                    if (window.tipoatencion == "I") {
                        window.location.href = "/Paciente/Home";
                    } else {
                        //window.location.href = "Agenda_2?idMedico=" + idMedico + "&fechaPrimeraHora=" + valida.infoAtencion.fecha + "&m=" + valida.infoAtencion.idModeloAtencion + "&r=" + valida.infoAtencion.idReglaPago + "&c=" + valida.infoAtencion.idConvenio + "&especialidad=" + especialidadFila + "&tipoatencion=" + window.tipoatencion;
                        window.location.href = "Agenda_2?idMedico=" + idMedico + "&fechaPrimeraHora=" + window.fechaAgenda2 + "&m=" + window.m + "&r=" + window.r + "&c=" + window.c + "&especialidad=" + especialidadFila + "&tipoatencion=" + window.tipoatencion;
                    }
                }
            }
        });
    }




};

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
async function guardarAtencion(estado) {
    let agendar = {
        id: idAtencion,
        idBloqueHora: idBloqueHora,
        fechaText: fechaSeleccion,
        triageObservacion: document.querySelector('[name="triageObservacion"]').value,
        antecedentesMedicos: document.querySelector('[name="antecedentesMedicos"]').value,
        idPaciente: uid,
        SospechaCovid19: false,
        IdMedicoHora: idMedicoHora,
        Estado: estado,
        CodigoTelefono: codPaisPaciente
    };
    let resultado = await putAgendarMedicosHoras(agendar, idMedico, uid);

    if (resultado.status === 'NOK') {
        return resultado;
    }
    else {

        if (connection.state === signalR.HubConnectionState.Connected) {
            connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {

                connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), resultado.infoAtencion.fecha, resultado.infoAtencion.horaDesdeText, "actualizar").then(r => {
                    connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                }).catch(err => console.error(err));
            }).catch((err) => {
                return console.error(err.toString());
            });
        }

        connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {
            return console.error(err.toString());
        });

        return resultado;
    }


}


function configAntecedentesMedicos(data) {
    if ((data.alergias == "No refiere")) {
        document.getElementById('radioAlergia2').checked = true;
    }
    else if (data.alergias != "" && data.alergias != "No refiere") {
        document.getElementById('radioAlergia1').checked = true;
        document.getElementById("Alergias").setAttribute('class', 'form-control')
    }


    if ((data.medicamentos == "No refiere")) {
        document.getElementById('radioMedicamento2').checked = true;
    }
    else if (data.medicamentos != "" && data.medicamentos != "No refiere") {
        document.getElementById('radioMedicamento1').checked = true;
        document.getElementById("Medicamentos").setAttribute('class', 'form-control');
    }

    if (data.enfermedades == "No refiere") {
        document.getElementById('radioEnfermedad2').checked = true;
    }
    else if (data.enfermedades != "" && data.enfermedades != "No refiere") {
        document.getElementById('radioEnfermedad1').checked = true;
        document.getElementById("Enfermedades").setAttribute('class', 'form-control');
    }

    if (data.habitos == "No refiere") {
        document.getElementById('radioHabito2').checked = true;
    }
    else if (data.habitos != "" && data.habitos != "No refiere") {
        document.getElementById('radioHabito1').checked = true;
        document.getElementById("Habitos").setAttribute('class', 'form-control');
    }

    if (data.cirugias == "No refiere") {
        document.getElementById('radioCirugia2').checked = true;
    }
    else if (data.cirugias != "" && data.cirugia != "No refiere") {
        document.getElementById('radioCirugia1').checked = true;
        document.getElementById("Cirugias").setAttribute('class', 'form-control');
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

    connectionAgendar = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/agendarpacientehub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionAgendar.start();
    } catch (err) {
        
    }
}