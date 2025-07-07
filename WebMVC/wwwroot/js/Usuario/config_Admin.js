import { EditPwPerfil } from "../apis/personas-fetch.js";
import { compareOldPassword } from '../apis/personas-fetch.js';
import { saveOldPassword } from '../apis/personas-fetch.js';
import { logPacienteViaje } from '../apis/personas-fetch.js?7';

(async function () {
    //let page = document.getElementById('page');
    //page.innerHTML = "Configuración de cuenta";
    //page.setAttribute('style', '')

    $('#form_change_pw').validate({
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
            var pw = document.forms["form_change_pw"]["Password"].value;
            var pwR = document.forms["form_change_pw"]["PasswordRepeat"].value

            e.preventDefault();

            //A Continuacion se utilizan funciones para veririfcar que la clave contenga minimo
            //Una letra minuscula, mayuscula, un numero, la clave no haya sido utilizada anteriormente,
            //Y Validar que las claves en el campo de repetir Contraseña sean iguales

            function buscar(find, cont) {
                let found = new Boolean();
                found = false;

                for (let val of find) {
                    if (cont.includes(val)) {
                        found = true;
                        break;
                    }
                }
                return found;
            }


            if (pw.length < 5 || pw.length > 15) {
                Swal.fire("", "La contraseña debe tener entre 5 y 15 caracteres ", "warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (pw != pwR) {
                Swal.fire("", "Las contraseñas deben coincidir", "warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            let username = document.getElementById("Identificador").value;
            

           


            Swal.fire({
                title: "Cambiar Contraseña",
                text: `¿Desea cambiar?`,
                type: "question",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                confirmButtonText: "Sí, Confirmar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                // 
                if (result.value) {
                    $('#btn_guardar_pw').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
                    var formData = new FormData(form);
                    formData.append('userId', idEdit);
                    formData.append('idCliente', parseInt(idCliente) || 0);
                    formData.append('idUsuarioModifica', uid);
                    
                    let save = await saveOldPassword(username); // Guarda la clave antigua (Encriptada) en la base de Datos para no volver a utilizarla
                    
                    let result = await EditPwPerfil(formData);
                    if (result.status === 'OK') {
                        $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                        Swal.fire({
                            tittle: "Éxito!",
                            text: "Su contraseña se ha actualizado de forma correcta.",
                            type: "success",
                            confirmButtonText: "OK"
                        }).then(() => {

                        });
                        var log = {
                            IdPaciente: idEdit,
                            Evento: `Cambio de contraseña por usuario ${uid} desde administrador`,
                            Info: ``
                        }
                        
                        await logPacienteViaje(log);
                    }
                    else {
                        if (result.err == 10) {
                            Swal.fire("Error!", result.msg, "error");
                        }
                        else
                            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    }
                }
            });

        }
    });
})();


jQuery(document).ready(function () {

    $("#show_hide_password a").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass("fa-eye-slash");
            $('#show_hide_password i').removeClass("fa-eye");
        } else if ($('#show_hide_password input').attr("type") == "password") {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass("fa-eye-slash");
            $('#show_hide_password i').addClass("fa-eye");
        }
    });

    $("#show_hide_rpassword a").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_rpassword input').attr("type") == "text") {
            $('#show_hide_rpassword input').attr('type', 'password');
            $('#show_hide_rpassword i').addClass("fa-eye-slash");
            $('#show_hide_rpassword i').removeClass("fa-eye");
        } else if ($('#show_hide_rpassword input').attr("type") == "password") {
            $('#show_hide_rpassword input').attr('type', 'text');
            $('#show_hide_rpassword i').removeClass("fa-eye-slash");
            $('#show_hide_rpassword i').addClass("fa-eye");
        }
    });
});