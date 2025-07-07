import { updateReporteEnfermeria } from "../apis/reporte-enfermeria-fetch.js";

var idPcte = 0;
export async function init(data) {

    if (idPaciente != 0) {
        idPcte = idPaciente;
        document.getElementById('reporteEnfermeria_IdPaciente').value = parseInt(idPaciente);
    }

    if (data.reporteEnfermeria.motivoConsulta == 3) {
        document.getElementById("derivacion").hidden = false;
    }
    document.getElementById("reporteEnfermeria_MotivoConsulta").onchange = async () => {
        if (document.getElementById("reporteEnfermeria_MotivoConsulta").value == "3") {
            document.getElementById("derivacion").hidden = false
        }
        else {
            document.getElementById("derivacion").hidden = true
        }
    }
    $('#form_edit_reporte').validate({
        errorClass: 'text-danger',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.validate').append(error);
        },
        submitHandler: async function (form, e) {
            e.preventDefault();
            $('#btn_guardar_info').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            var formData = new FormData(form);
            let result = await updateReporteEnfermeria(formData, uid);
            $('#btn_guardar_info').removeAttr('disabled').children('.spinner-border').remove();
            if (result.status === 'OK') {
                $('#btn_guardar_info').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Reporte actualizado.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then((value) => {
                    location.href = `/Medico/EditarReporte?id=${result.reporteEnfermeria.id}`;
                });
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }

    });
}



