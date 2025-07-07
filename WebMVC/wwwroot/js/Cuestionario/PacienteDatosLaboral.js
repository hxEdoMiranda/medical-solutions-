import { EditInfoPerfil, EditAntecedentesMedicos, getPersonasConveniosByIdFull, getPuestosxAreas } from "../apis/personas-fetch.js";
import { GuardarPaciente } from '../apis/nom035-fetch.js';
var mask;
export async function init(data) {


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

            $('#btn_guardar_info').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            var formData = new FormData(form);
            formData.append('Id', data.id);
            formData.append('Estado', data.estado);

            var jsonPreguntasSeccion = new Array();
            let objUsuario = null;

            MostrarLoading(true);

            let dateIngresoString = $("#Fecha_Ingreso").val();
            let datePartsIng = dateIngresoString.split("/");


            let dateIngresoPuestoString = $("#Fecha_Ingreso_Puesto").val();
            let datePartsIngPuesto = dateIngresoPuestoString.split("/");
            

            objUsuario = {
                id_usuario: data.idPersona_Bh,
                id_persona: data.personaDatosBasicos.id,
                id_persona_bh: data.idPersona_Bh,
                id_personadatoslaboral: data.id_PersonadatosLaboral,
                id_empresa: 0,//data.idEmpresa,
                id_puesto: parseInt($("#Id_Puesto").val()), //data.id_Puesto,
                id_area: parseInt($("#Id_Area").val()), //data.id_Area,
                num_empleado: 0,
                nombre: data.personaDatosBasicos.nombre,
                apellido_paterno: data.personaDatosBasicos.apellidoPaterno,
                apellido_materno: data.personaDatosBasicos.apellidoMaterno,
                genero: data.personaDatosBasicos.genero,
                fecha_nacimiento: new Date(data.personaDatosBasicos.fNacimiento).toISOString("yyyy-MM-dd").slice(0, 10),
                estado_civil: data.personaDatosBasicos.estadoCivil,
                tipo_contrato: $("#Id_Tipo_Contrato").val(),
                experiencia_laboral: $("#Experiencia_Laboral").val(),
                tiempo_en_empresa: new Date(+datePartsIng[2], datePartsIng[1] - 1, +datePartsIng[0]).toISOString("yyyy-MM-dd").slice(0, 10),
                tiempo_en_puesto: new Date(+datePartsIngPuesto[2], datePartsIngPuesto[1] - 1, +datePartsIngPuesto[0]).toISOString("yyyy-MM-dd").slice(0, 10),
                tipo_jornada: $("#Id_Tipo_Jornada").val(),
                rotacion_turno: $("#Rotacion_Turno").val(),
                curp: data.personaDatosBasicos.identificador,
                telefono: data.personaDatosBasicos.telefonoMovil,
                correo_electronico: data.personaDatosBasicos.correo,
                activa_cuestionario: true
            };
            jsonPreguntasSeccion.push(objUsuario)

            let result = await GuardarPaciente(objUsuario);
            MostrarLoading(false);

            if (result != "Ok") {
                Swal.fire("Ha ocurrido un evento", result.message, "error")
            }

            $('#btn_guardar_info').removeAttr('disabled').children('.spinner-border').remove();
            //if (result.status === 'Actualizado') {

            $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
            window.location = "/Cuestionario/ListadoCuestionario";

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



            $('#btn_guardar_am').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);

            let formAnt = {
                Medicamentos: medicamentos,
                Habitos: habitos,
                Enfermedades: enfermedades,
                Alergias: alergias,
                Cirugias: cirugias,
                Id: uid
            }

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

    $("#Id_Area").change(async function () {
        //alert($(this).val());
        let objPuestos = await getPuestosxAreas($(this).val());
        $("#Id_Puesto").empty();
        $.each(objPuestos, function (index, row) {
            $("#Id_Puesto").append("<option value='" + row.id_puesto + "'>" + row.nombre_puesto + "</option>")
        });
    });
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


function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

jQuery(document).ready(function () {

    $("#Fecha_Ingreso").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
        oncomplete: function (buffer, opts) {
            //if ((new Date(this.value) == "Invalid Date")) {
            //    Swal.fire("Ingrese fecha de ingreso invalida", "Valide por favor", "warning");
            //    this.value = "";
            //}
        }
    });
    $("#Fecha_Ingreso_Puesto").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
        oncomplete: function (buffer, opts) {
            //
            //if ((new Date(this.value) == "Invalid Date") && isNaN(new Date(this.value))) {
            //    Swal.fire("Ingrese fecha de ingreso al puesto invalida", "Valide por favor", "warning");
            //    this.value = "";
            //}
        }
    });

});