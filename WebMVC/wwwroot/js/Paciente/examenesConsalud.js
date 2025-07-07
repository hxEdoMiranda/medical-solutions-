import { sendOrdenMedicaConsalud } from "../apis/correos-fetch.js?rnd=3";

export async function init() {
    $("#fecha-nacimiento").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
    });

    $("#btnsend").click(async function (e) {
        e.preventDefault();

        if (!validarCampos())
            return;

        try {
            $('#btnsend').prepend('<span class="spinner-border spinner-border-sm m-r-10 mr-2" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            $('#btnsend').attr('disabled', 1);

            let examenes = [];
            $("#tabla-examenes input:checked").each(function (index, el) {
                examenes.push(el.value)
            });

            const request = {
                nombreCompleto: $("#nombre-completo").val(),
                fechaNacimiento: $("#fecha-nacimiento").val(),
                rut: $("#rut").val(),
                direccion: $("#direccion").val(),
                correo: $("#correo").val(),
                telefono: $("#telefono").val(),
                examenes: examenes
            }

            const selectedFile = document.getElementById('orden').files[0];
            const jsonBlob = new Blob([JSON.stringify(request)], { type: 'application/json' })

            const formData = new FormData();

            formData.append('file', selectedFile);
            formData.append('content', jsonBlob);

            let response = await sendOrdenMedicaConsalud(formData, window.idCliente);

            if (response != null && response.status == "OK") {
                Swal.fire('Solicitud enviada', 'Nuestro equipo se pondrá en contacto contigo para coordinar la toma de tus exámenes', 'success')
                .then(() => {
                    window.onbeforeunload = false;
                    window.location = '/Account/logout?rol=Paciente';
                });
            } else {
                Swal.fire('¡Ups! Algó salió mal', 'Puedes reintentar o contactar a mesa de ayuda para solucionar este problema, envía un correo a ayuda@medismart.live o llama al +56 2 28696207', 'error')
            }
        } catch (e) {
            
            Swal.fire('¡Ups! Algó salió mal', 'Puedes reintentar o contactar a mesa de ayuda para solucionar este problema, envía un correo a ayuda@medismart.live o llama al +56 2 28696207', 'error')
        }

        $('#btnsend').removeAttr('disabled').children('.spinner-border').remove();
        $('#btnsend').removeAttr('disabled');
    });
}

function validarCampos() {
    let success = true;

    $("#mensaje-sin-examenes").hide();
    $("#solicitud-examenes-consalud input.validate.is-invalid").each(function (index, el) {
        $(el).removeClass("is-invalid");
    });

    // Valida que los campos no sean vacíos
    $("#solicitud-examenes-consalud input.validate").each(function (index, el) {
        if ((el.value ?? "") == "") {
            $(el).addClass("is-invalid");
            success = false;
        }
    });

    // Valida exámenes
    if ($("#tabla-examenes input:checked").length == 0) {
        $("#mensaje-sin-examenes").show();
        success = false;
    }

    // Valida fecha nacimiento
    if (new Date($("#fecha-nacimiento").val().split('/').reverse().join('-')) == 'Invalid Date' || new Date($("#fecha-nacimiento").val().split('/').reverse().join('-')) >= new Date()) {
        $("#fecha-nacimiento").addClass("is-invalid");
        success = false;
    }

    // Valida correo
    if (!isEmail($("#correo").val())) {
        $("#correo").addClass("is-invalid");
        success = false;
    }

    // Valida correo
    if (!VerificaRut($("#rut").val().replaceAll('.', ''))) {
        $("#rut").addClass("is-invalid");
        success = false;
    }

    return success;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function VerificaRut(rut) {
    if (rut.toString().trim() != '' && rut.toString().indexOf('-') > 0) {
        var caracteres = new Array();
        var serie = new Array(2, 3, 4, 5, 6, 7);
        var dig = rut.toString().substr(rut.toString().length - 1, 1);
        rut = rut.toString().substr(0, rut.toString().length - 2);

        for (var i = 0; i < rut.length; i++) {
            caracteres[i] = parseInt(rut.charAt((rut.length - (i + 1))));
        }

        var sumatoria = 0;
        var k = 0;
        var resto = 0;

        for (var j = 0; j < caracteres.length; j++) {
            if (k == 6) {
                k = 0;
            }
            sumatoria += parseInt(caracteres[j]) * parseInt(serie[k]);
            k++;
        }

        resto = sumatoria % 11;
        var dv = 11 - resto;

        if (dv == 10) {
            dv = "K";
        }
        else if (dv == 11) {
            dv = 0;
        }

        if (dv.toString().trim().toUpperCase() == dig.toString().trim().toUpperCase())
            return true;
        else
            return false;
    }
    else {
        return false;
    }
}