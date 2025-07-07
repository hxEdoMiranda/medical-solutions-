import { EditInfoPerfil, EditAntecedentesMedicos, getPersonasConveniosByIdFull } from "../apis/personas-fetch.js";
import { InsertEncuestaComentario } from '../apis/nom035-fetch.js';

import { personaFotoPerfil } from "../shared/info-user.js";
import { parametrosPais } from '../shared/hostpais.js';
import { getParametroByCodigo } from "../apis/parametro.js";
var mask;

export async function init(data) { 

    if (document.getElementById("btn_guardar_opinion")) {
        document.getElementById("btn_guardar_opinion").addEventListener("click", async function () {
            var opinionText = document.getElementById("opinionArea").value;
            var dataComment = { id_Cliente: parseInt(idCliente), Comentario: opinionText };
            //console.log(dataComment);
            try {

                const respuesta = await InsertEncuestaComentario(dataComment);

                if (respuesta.ok) {
                    // Si la solicitud fue exitosa
                    Swal.fire({
                        type: "success",
                        title: "¡Tu mensaje ha sido enviado con éxito!",
                        text: "Puedes enviar todos los mensajes que necesites.",
                        confirmButtonText: "Entendido"
                    }).then(() => {

                        document.getElementById("opinionArea").value = '';
                    });
                } else {
                    // Si la solicitud falla
                    Swal.fire("Error!", "Hubo un problema al enviar tu mensaje.", "error");
                }
            } catch (error) {
                // En caso de errores en la solicitud
                Swal.fire("Error!", "Hubo un problema al enviar tu mensaje.", "error");
                console.error('Error al enviar comentario:', error);
            }


            //console.log('opinionArea', opinionText);
        });
    }
    
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

            MostrarLoading(true);
            $('#btn_guardar_info').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            var formData = new FormData(form);
            formData.append('Id', data.id);
            formData.append('Estado', data.estado);
            formData.append('ZonaHoraria', data.zonaHoraria)
            let result = await EditInfoPerfil(formData, uid);
            $('#btn_guardar_info').removeAttr('disabled').children('.spinner-border').remove();

            MostrarLoading(false);
            if (result.status === 'Actualizado') {
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                if(window.ocupacional ==1)
                    window.location = "/Cuestionario/ListadoCuestionario?ocupacional=1";
                else
                    window.location = "/Cuestionario/RegistroDatosLaborales";
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }
    });
   
    var controlsInputsDatos = document.querySelectorAll('.form-control');
    controlsInputsDatos.forEach(x => {
        /*if (x.id.includes("Apellido") || x.id.includes("Nombre")) {
            x.disabled = true
        }*/
    });
}

function getEdad(dateString) {

    let hoy = new Date();
    let fechaArray = dateString.split("/");
    let fechaNacimiento = new Date(fechaArray[2], fechaArray[1], fechaArray[0])
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (
        diferenciaMeses < 0 ||
        (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
        edad--
    }
    return edad
}

function MostrarLoading(mostrar) {
    if (mostrar) {
        $('#loaderNom35').addClass('d-flex justify-content-center bakg_loading');
        $('#loaderNom35').html('<div class="spinner-border" role="status"></div><br><span class="message_nom035">Un momento por favor...</span>');
    } else {
        $('#loaderNom35').fadeIn(10).html("");
        $('#loaderNom35').removeClass('d-flex justify-content-center bakg_loading');
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

    $("#FNacimiento").change(function () {
        $("#Edad").val(getEdad($(this).val()));
    });

});