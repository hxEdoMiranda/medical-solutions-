import { EditInfoPerfil, EditAntecedentesMedicos, getPersonasConveniosByIdFull } from "../apis/personas-fetch.js";
import { personaFotoPerfil } from "../shared/info-user.js";
import { parametrosPais } from '../shared/hostpais.js';
import { getParametroByCodigo } from "../apis/parametro.js";
var mask;
export async function init(data) {
    await personaFotoPerfil();
    if (data.rutaAvatar != null) {
        var ruta;
        if (!data.rutaAvatar.includes('Avatar.svg')) {
            ruta = baseUrl + data.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            ruta = baseUrlWeb + '/upload/foto_perfil/' + data.rutaAvatar;
        }
        document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
    }

    configAntecedentesMedicos(data);
 
    //parametros segun host (chileno o boliviano);
    //data.codigoTelefono = "BO"; // solo para efectos de prueba
    var param = await getParametroByCodigo(data.codigoTelefono);
    //mask = param.util2;
    
    //valida si corresponde mostrar prevision desde parametros segun host
    if (param.util1 === "Sin Prevision") {
        if (document.getElementById("datosPrevisionales")) {
            document.getElementById("datosPrevisionales").setAttribute('style', 'display:none');
        }
    }
    // se obtiene mascara desde parametros;
    //$("#TelefonoMovil").inputmask("", {
    //});
    //$("#Telefono").inputmask("", {
    //});
    //telefono country
    const inputel = document.querySelector("#Telefono");
    const inputCel = document.querySelector("#TelefonoMovil");

    const iti = window.intlTelInput(inputel, {
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
    iti.setNumber(inputel.value.replace("(", "").replace(")", "").replace(" ", ""));
    const iti2 = window.intlTelInput(inputCel, {
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
    iti2.setNumber(inputCel.value.replace("(", "").replace(")", "").replace(" ", ""));

    
    

    let page = document.getElementById('page');
    page.innerHTML = "Configuración de cuenta";
    page.setAttribute('style', '')

    $('#form_edit_perfil').validate({
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
            var mail = isEmail($("#Correo").val());
            if (!mail) {
                Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
                return;
            }
            if (inputel.value.trim()) {
                if (!iti.isValidNumber()) {
                    const errorCode = iti.getValidationError();
                    // Para el teléfono
                    const errorMapTelefono = ["Número de teléfono inválido", "Código de país inválido", "Número demasiado corto", "Número demasiado largo", "Número inválido"];
                    Swal.fire(errorMapTelefono[errorCode]," teléfono ", "warning");
                    return;
                }
            }
            if (inputCel.value.trim()) {
                if (!iti2.isValidNumber()) {
                    const errorCode = iti2.getValidationError();
                    // Para el celular
                    const errorMapCelular = ["Número de celular inválido", "Código de país inválido", "Número demasiado corto", "Número demasiado largo", "Número inválido"];
                    Swal.fire(errorMapCelular[errorCode], " Celular ", "warning");
                    return;

                }
            }
            $('#btn_guardar_info').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            var formData = new FormData(form);


            formData.append('Id', data.id);
            formData.append('Estado', data.estado);
            formData.set('TelefonoMovil', iti2.getNumber());
            formData.set('Telefono', iti.getNumber());
            let result = await EditInfoPerfil(formData, uid);
            $('#btn_guardar_info').removeAttr('disabled').children('.spinner-border').remove();
            if (result.status === 'Actualizado') {
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Perfil actualizado.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    if (window.host.includes("clinicamundoscotia"))
                        window.location = "/";
                    
                });
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }
    });
   
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
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }
    });
   
    
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
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

jQuery(document).ready(function () {
   
    $(".kt-avatar__upload").on('click', function (event) {
        
        $("#cargaFoto").toggle();
    });

    
    
    $("#FNacimiento").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
    });

});