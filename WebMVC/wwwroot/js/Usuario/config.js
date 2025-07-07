import {EditPwPerfil } from "../apis/personas-fetch.js";
import { compareOldPassword } from '../apis/personas-fetch.js';
import { saveOldPassword } from '../apis/personas-fetch.js';
import { logPacienteViaje } from '../apis/personas-fetch.js?7';

(async function () {
    //let page = document.getElementById('page');
    //page.innerHTML = "Configuración de cuenta";
    //page.setAttribute('style', '')


    $("#agregar-direccion-examenes, #agregar-direccion-medicamentos, #seleccionar-direccion-examenes, #seleccionar-direccion-medicamentos").click(async function (e) {
        e.preventDefault();

        const tipo = "P";
        const accion = e.currentTarget.id.includes("agregar") ? "A" : "S";

        if (accion === "A")
            await cargarModalAgregarDireccion(tipo);
        else
            await cargarModalSeleccionarDireccion(tipo);
    });


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

            var pwMin = document.forms["form_change_pw"]["Password"].minLength;
            var pwMax = document.forms["form_change_pw"]["Password"].maxLength;
            var pwRMin = document.forms["form_change_pw"]["PasswordRepeat"].minLength;
            var pwRMax = document.forms["form_change_pw"]["PasswordRepeat"].maxLength;

            e.preventDefault();
            
            //A Continuacion se utilizan funciones para veririfcar que la clave contenga minimo
            //Una letra minuscula, mayuscula, un numero, la clave no haya sido utilizada anteriormente,
            //Y Validar que las claves en el campo de repetir Contraseña sean iguales
            
            let mayus = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            let minus = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z'];
            let num = ['0','1','2','3','4','5','6','7','8','9'];

            function buscar(find,cont){
                let found = new Boolean();
                found = false;
                
                for(let val of find){
                    if(cont.includes(val)){
                        found = true;
                        break;
                    }
                } 
                return found; 
            }


            if (pw.length < pwMin || pw.length > pwMax){
                Swal.fire("", "La contraseña debe tener entre " + pwMin + " y  " + pwMax + " caracteres ","warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }

            if( !buscar(pw,mayus) || !buscar(pw,minus) || !buscar(pw,num)){
                Swal.fire("","La contraseña deben tener como minimo una letra minúscula, una letra mayúscula y un número","warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (pw != pwR) {
                Swal.fire("","Las contraseñas deben coincidir","warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            let username = '';
            if (!$("#Identificador").length) 
                username = document.getElementById("personas_Identificador").value;
            else
                username = document.getElementById("Identificador").value;
            
            

            let oldPass = await compareOldPassword(username,pw);

            if ( oldPass ) {
                Swal.fire("","No puedes usar una clave ingresada anteriormente","warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }

            
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
                    formData.append('userId', uid);
                    formData.append('idCliente', idCliente);
                    formData.append('idUsuarioModifica', uid);
                    let save = await saveOldPassword(username); // Guarda la clave antigua (Encriptada) en la base de Datos para no volver a utilizarla

                    let result = await EditPwPerfil(formData);
                    if (result.status === 'OK') {
                        $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                        document.forms["form_change_pw"]["Password"].value = "";
                        document.forms["form_change_pw"]["PasswordRepeat"].value = "";
                        Swal.fire({
                            tittle: "Éxito!",
                            text: "Su contraseña se ha actualizado de forma correcta.",
                            type: "success",
                            confirmButtonText: "OK"
                        }).then(() => {
                          
                        });

                        var log = {
                            IdPaciente: uid,
                            Evento: `Cambio de contraseña por usuario ${uid} desde perfil`,
                            Info: `idCliente = ${idCliente}`
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


async function cargarModalAgregarDireccion(tipo) {
    try {
        const response = await fetch(`/ModalAgregarDireccionPerfil/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista)
        });
        if (response.ok) {
            const html = await response.text();
            $("#dynamic-modal").empty();
            $("#dynamic-modal").html(html);
            $("#dynamic-modal-div").modal("show");
        } else {
            console.error(response)
        }
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}
async function cargarModalSeleccionarDireccion(tipo) {
    try {
        const response = await fetch(`/ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista)
        });
        if (response.status === 200) {
            const html = await response.text();
            $("#dynamic-modal").empty();
            $("#dynamic-modal").html(html);
            $("#dynamic-modal-div").modal("show");
        } else if (response.status === 204) {
            Swal.fire("No existen direcciones guardadas para seleccionar", "", "warning");
        } else {
            console.error(response)
        }
    } catch (error) {
        console.error('CargarModalSeleccionarDireccion.', error);
    }
}

//Validar direcciones, si existen, de lo contrario no mostrar los botones
async function verificarDireccionesGuardadasEx(tipo) {
    try {
        const response = await fetch(`../ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista)
        });

        if (response.status === 200) {
            $("#seleccionar-direccion-examenes").show();
            $("#seleccionar-direccion-medicamentos").show();
            await verificarLibretaDirecciones(uid, "E");
        }
        else if (response.status === 204) {
            $("#seleccionar-direccion-examenes").hide();
        }
        else {
            console.error(response)
        }
    } catch (error) {
        console.error('VerificarDireccionesGuardadas.', error);
    }
}

//Validar direcciones, si existen, de lo contrario no mostrar los botones
async function verificarDireccionesGuardadasMed(tipo) {
    try {
        const response = await fetch(`../ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista)
        });

        if (response.status === 200) {
            $("#seleccionar-direccion-medicamentos").show();
            $("#seleccionar-direccion-examenes").show();
            await verificarLibretaDirecciones(uid, "M");
        }
        else if (response.status === 204) {
            $("#seleccionar-direccion-medicamentos").hide();
        }
        else {
            console.error(response)
        }
    } catch (error) {
        console.error('VerificarDireccionesGuardadas.', error);
    }
}


async function validarCampoDireccion() {
    var campoDireccion = $("#profileAddress");
    if (campoDireccion.val() && campoDireccion.val().trim().length > 0) {
        $("#seleccionar-direccion-medicamentos").show();
        return;
    }
    else { 
        campoDireccion.on('click', function () {
        $("#agregar-direccion-medicamentos").trigger('click');
    });
    }
}

jQuery(document).ready(function () {

    validarCampoDireccion();

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