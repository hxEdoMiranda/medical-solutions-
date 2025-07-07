import { validaCodigo, findUsersByEmail, compareOldPassword, saveOldPassword } from '../../../../../../js/apis/personas-fetch.js';
var baseUrlWeb = new URL(window.location.href); // url base para mostrar imagenes.
var mensaje = "Usuario inactivo, contactese con mesa de ayuda para solucionar este problema, envia un correo a ayuda@medismart.live o llamando al +56 9 4804 2543";



if (baseUrlWeb.hostname.includes("saludproteccion.cl")) {
    mensaje = "Usuario inactivo"
}


if (baseUrlWeb.hostname.includes(".website")) {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.website";
} else if (baseUrlWeb.hostname.includes("qa")) {

    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.medical.medismart.live";

} else {

    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.live";

}

var rutValido = true;
var validarPW = false;
var validarCaptchaPW = false;
var dataLocalizacion = null;
var showErrorMsg;
var apiKey = '875e06efb1c446d89eb05bfaca2ca3ec'; // Your api key found at: https://www.bigdatacloud.net/customer/account
var identificador = "";
//vanilla implementation
var client = new BDCApiClient(apiKey);

/* You can set the default api language as needed */
client.localityLanguage = 'es';


$(function () {
    $("#kt_rut, #rutCuenta, #kt_email").keyup(function () {
        $(this).val(formatRut($(this).val())?.trim() ?? '');
    });
});
// Class Definition
var KTLoginGeneral = function () {

    var login = $('#kt_login');

    showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+ msg + '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    var quitarFormCode = function () {
        let divForm = $('#formCodigo');
        divForm.removeClass('d-none');
        let divCaptcha = $('#recaptcha_v_m');
        divCaptcha.addClass('d-none');
        let divForm2 = $('#formClaveNueva');
        divForm2.addClass('d-none')
    }
    // Private Functions
    var displaySignUpForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--reset');
        quitarFormCode()
        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');
        login.removeClass('kt-login--reset');
        quitarFormCode()

        login.addClass('kt-login--signin');
        $("#kt_create_account").css("display", "block");
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function () {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');
        login.removeClass('kt-login--reset');
        $("#kt_create_account").css("display", "none");

        $("#kt_email").val("");
        $("#code1").val("");
        $("#code2").val("");
        $("#code3").val("");
        $("#code4").val("");
        $("#code5").val("");
        $("#code6").val("");
        $("#passwordNP").val("");
        $("#RepeatPassword").val("");
        $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
        $('#pswLargo').removeClass("valido");
        $('#pswAlfa').removeClass("valido");
        $('#pswUsada').removeClass("valido");
        $('#pswIgual').removeClass("valido");

        $("#kt_email").keyup(function () {
            var ktMail = $("#kt_email").val();
            if (ktMail.length > 3) {
                $("#kt_login_forgot_submit").removeAttr('disabled');
                $("#kt_login_forgot_submit").addClass("active");
            } else {
                $("#kt_login_forgot_submit").attr("disabled");
                $("#kt_login_forgot_submit").removeClass('active');
            }
        });


        quitarFormCode()

        login.addClass('kt-login--forgot');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login__forgot')[0], 'flipInX animated');

    }

    var displayResetPasswordForm = function () {
        login.removeClass('kt-login--signup');
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--forgot');

        login.addClass('kt-login--reset');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login--reset')[0], 'flipInX animated');

    }

    var reSendCorreo = function () {
        $('#kt_login_resend_link').click(function (e) {
            e.preventDefault();
            $("#username_code").val(identificador)
            var form = $(this).closest('form');

            /*form.validate({
                rules: {
                    Username: {
                        required: true
                    }
                }
            });*/
            if (!form.valid()) {
                return;
            }

            //btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            form.ajaxSubmit({
                url: '/account/pagereset?baseUrl=' + baseUrlWeb,
                success: function (response, status, xhr, $form) {
                    //btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states
                    
                    const jsonResponse = JSON.parse(response);
                    if (jsonResponse.err) {
                        switch (jsonResponse.err) {
                            case 1:
                                //showErrorMsg(form, 'danger', `No se ha podido encontrar tu cuenta de Medical`);
                                break;
                            case 3:
                                //showErrorMsg(form, 'danger', mensaje);
                                break;
                            default:
                                //showErrorMsg(form, 'danger', `Ocurri� un error. Favor intenta nuevamente.`);
                        }
                        return;
                    }
                }
            });
        });

    }

    var handleFormSwitch = function () {
        $('#kt_login_forgot').click(function (e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_account').click(function (e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_forgot_cancel').click(function (e) {
            e.preventDefault();
            $("#kt_login_forgot_submit").attr("disabled");
            $("#kt_login_forgot_submit").removeClass('active');
            displaySignInForm();
        });

        $('#kt_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_code_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_new_psw_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_resend_link').click(function (e) {
            e.preventDefault();
            reSendCorreo();
        });
    }

    //FUNCIONA PARA CAPTCHA
    var onLoadRecaptcha = function (posCaptcha) {
        //posCaptcha ES LA POSICION (el elemento div captcha)  DEL CAPTCHA QUE SE QUIERE COMPROBAR  (HAY 2 ACTUALMENTE PARA LOGIN Y RECUPERAR CONTRASEÑA)
        var response = grecaptcha.getResponse(posCaptcha);
        return response;
    };




    var handleSignInFormSubmit = function () {
        $('#kt_login_signin_submit').click(function (e) {
            $('.alert').remove();
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un rut válido.');
                return;
            }
            var usuario = $("#kt_rut").val();

            var emailRegex = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

            if ((usuario.includes(".") || usuario.includes("@"))  && emailRegex.test(usuario)) {
                showErrorMsg(form, 'danger', 'No se permite el ingreso por email, por favor ingrese su RUT');
                return;
            }


            form.validate({
                rules: {
                    Username: {
                        required: true

                    },
                    Password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            //aqui captcha
            var captchaValido = onLoadRecaptcha(0);
            if (captchaValido.length == 0) {
               btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                showErrorMsg(form, 'danger', 'Debe completar la verificación Captcha.');
                return;
            }

            form.ajaxSubmit({
                url: '/account/login',
                success: function (response, status, xhr, $form) {
                    if (response.msg == "error") {
                        // similate 1s delay
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            showErrorMsg(form, 'danger', 'Usuario o contraseña incorrecta. Por favor intente nuevamente.');
                        }, 1000);
                    }
                    else if (response.msg == "Inactivo") {
                        // similate 1s delay
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            showErrorMsg(form, 'danger', mensaje);
                        }, 1000);
                    }

                    else if (response.msg == "Menor") {
                        // similate 1s delay
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            showErrorMsg(form, 'danger', 'Usuario menor de edad, debe ingresar titular y seleccionar beneficiario menor de edad.');
                        }, 1000);
                    }
                    else
                        window.location.href = response.returnUrl;

                }
            });
        });
    }

    var handleSignUpFormSubmit = function () {
        $('#kt_login_signup_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un rut válido.');
                return;
            }


            form.validate({
                rules: {
                    fullname: {
                        required: true
                    },
                    email: {
                        required: true

                    },
                    password: {
                        required: true
                    },
                    rpassword: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '',
                success: function (response, status, xhr, $form) {
                    // similate 2s delay
                    setTimeout(function () {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        form.clearForm();
                        form.validate().resetForm();

                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.kt-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', 'Thank you. To complete your registration please check your email.');
                    }, 2000);
                }
            });
        });
    }

    var handleForgotFormSubmit = function () {
        $('#kt_login_forgot_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un rut válido.');
                return;
            }
            form.validate({
                rules: {
                    Username: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }
            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            form.ajaxSubmit({
                url: '/account/pagereset?baseUrl=' + baseUrlWeb,
                success: function (response, status, xhr, $form) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states

                    
                    const jsonResponse = JSON.parse(response);
                    if (jsonResponse.err) {
                        switch (jsonResponse.err) {
                            case 1:

                                showErrorMsg(form, 'danger', `No se ha podido encontrar tu cuenta de Salud Protección`);
                                break;
                            case 3:
                                showErrorMsg(form, 'danger', mensaje);
                                break;
                            default:
                                showErrorMsg(form, 'danger', `Ocurri� un error. Favor intenta nuevamente.`);
                        }
                        return;
                    }
                    else {
                        // display signup form
                        //displaySignInForm();
                        //var signInForm = login.find('.kt-login__signin form');
                        //signInForm.clearForm();
                        //signInForm.validate().resetForm();

                        //showErrorMsg(signInForm, 'success', `La instrucci${decodeURI("%C3%B3")}n de recuperaci${decodeURI("%C3%B3")}n de contrase${decodeURI("%C3%B1")}a ha sido enviada a tu correo.`);
                        if(jsonResponse.hasOwnProperty("email")){
                            var dataHide = jsonResponse.email.split("@");
                            var effectHide = "*".repeat(dataHide[0].length-3);
                            document.getElementById("email-user").innerHTML = `a ${jsonResponse.email[0]}${jsonResponse.email[1]}${effectHide}${dataHide[0].substr(-1)}@${dataHide[1]} `;
                        }
                            
                            displayResetPasswordForm();
                        
                    }
                }
            });
        });
    }

    var handleCodeFormSubmit = function () {
        $('#kt_login_code_submit').click(async function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');
            var codigoConc = "";

            for (var i = 0; i < form[0].length; i++) {
                if (document.getElementById("code" + (i + 1))) {

                    if (document.getElementById("code" + (i + 1)).value == "") {
                        showErrorMsg(form, 'danger', `Debe ingresar el código completo`);
                        return;
                    } else {
                        codigoConc += document.getElementById("code" + (i + 1)).value;
                    }
                }
            }
            if (codigoConc.length < 6) {
                $("#errorCodigo").removeClass("d-none");
                return;
            }
            //DESCOMENTAR LO SUIGUIENTE SINO EL CODIGO NO FUNCIONA
            let res = await validaCodigo(identificador, codigoConc);
            if (res==null || res?.status == "NOK") {
                //showErrorMsg(form, 'danger', `Código ingresado no válido`);
                $("#errorCodigo").removeClass("d-none");
                $("#vencimientoCodigo").addClass("d-none");
                return;
            } else if (res == null || res?.status == "NVOK") {
                $("#vencimientoCodigo").removeClass("d-none");
                $("#errorCodigo").addClass("d-none");
                return;
            } else {
                let divForm = $('#formCodigo');
                divForm.addClass('d-none');
                let divCaptcha = $('#recaptcha_v_m');
                divCaptcha.removeClass('d-none');
                let divForm2 = $('#formClaveNueva');
                divForm2.removeClass('d-none');
                $("#errorCodigo").addClass("d-none");
                $("#vencimientoCodigo").addClass("d-none");


            }

             
        });
    }
    var handlePasswordReset = function () {
        $('#kt_password_reset_submit').click(async function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            //var pw = $('form').serializeArray();
            //var pwR = Object.values(pw[10]);
            //pw = Object.values(pw[9]);
            //pw = pw[1];
            //pwR = pwR[1];


            var pw = document.getElementById('passwordNP').value;
            var pwR = document.getElementById('RepeatPassword').value;

            //A Continuacion se utilizan funciones para veririfcar que la clave contenga minimo
            //Una letra minuscula, mayuscula, un numero, la clave no haya sido utilizada anteriormente,
            //Y Validar que las claves en el campo de repetir Contraseña sean iguales

            let mayus = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            let minus = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            let num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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

            if (pw.length < 6 || pw.length > 8) {
                //Swal.fire("", "La contraseña debe tener entre 8 y 15 caracteres ", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }
            if (!buscar(pw, minus) || !buscar(pw, num)) {
                //Swal.fire("", "La contraseña deben tener como minimo una letra minúscula, una letra mayúscula y un número", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (pw != pwR) {
                //Swal.fire("", "Las contraseñas deben coincidir", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }
            document.querySelector('[name="username"]').value = identificador;
            var userName = document.querySelector('[name="username"]').value;
            let oldPass = await compareOldPassword(identificador, pw);
            if (oldPass) {
                //Swal.fire("", "No puedes usar una clave ingresada anteriormente", "warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un rut válido.');
                return;
            }
            form.validate({
                rules: {
                    Username: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            //aqui captcha
            var captchaValido = onLoadRecaptcha(1);
            if (captchaValido.length == 0) {
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                showErrorMsg(form, 'danger', 'Completar la verificación Captcha.');
                return;
            }

            if (!validarPW) return;

            form.ajaxSubmit({
                url: '/account/ResetPassword',
                success: async function (response, status, xhr, $form) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states

                    const jsonResponse = JSON.parse(response);
                    if (jsonResponse.err) {
                        switch (jsonResponse.err) {
                            case 1:
                                showErrorMsg(form, 'danger', `No se ha podido encontrar tu cuenta de Medical`);
                                break;
                            case 7:
                                showErrorMsg(form, 'danger', `El c${decodeURI("%C3%B3")}digo de validación no es correcto`);
                                break;
                            case 8:
                                showErrorMsg(form, 'danger', `Debe ingresar una contrase${decodeURI("%C3%B1")}a.`);
                                break;
                            case 9:
                                showErrorMsg(form, 'danger', `Debe confirmar su contrase${decodeURI("%C3%B1")}a.`);
                                break;
                            case 10:
                                showErrorMsg(form, 'danger', `Las contrase${decodeURI("%C3%B1")}as ingresadas no son iguales`);
                                break;
                            default:
                                showErrorMsg(form, 'danger', `Ocurri${decodeURI("%C3%B3")} un error. Favor intenta nuevamente.`);
                        }
                        return;
                    }
                    else {
                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.kt-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();
                        let save = await saveOldPassword(userName);
                        validarPW = false;
                        $('#pswIgual').removeClass("valido");
                        $('#pswUsada').removeClass("valido");
                        $('#pswAlfa').removeClass("valido");
                        $('#pswLargo').removeClass("valido");
                        $('#modal-exito').modal('show');
                        //showErrorMsg(signInForm, 'success', `Tu contrase${decodeURI("%C3%B1")}a ha sido modificada correctamente.`);
                    }
                }
            });
        });
    }

    var handValidateCodeEmpty = function () {
        $('#code1').keyup(async function (e) {
            e.preventDefault();

            var code1 = $("#code1").val();
            var code2 = $("#code2").val();
            var code3 = $("#code3").val();
            var code4 = $("#code4").val();
            var code5 = $("#code5").val();
            var code6 = $("#code6").val();

            if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0 || code5.length == 0 || code5.length == 0 || code6.length == 0 ) {
                $("#kt_login_code_submit").removeClass("active");
                $("#kt_login_code_submit").attr('disabled', true);
                return;
            }
            $("#kt_login_code_submit").removeAttr('disabled');
            $("#kt_login_code_submit").addClass("active");

        });
        $('#code2').keyup(async function (e) {
            e.preventDefault();

            var code1 = $("#code1").val();
            var code2 = $("#code2").val();
            var code3 = $("#code3").val();
            var code4 = $("#code4").val();
            var code5 = $("#code5").val();
            var code6 = $("#code6").val();

            if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0 || code5.length == 0 || code5.length == 0 || code6.length == 0) {
                $("#kt_login_code_submit").removeClass("active");
                $("#kt_login_code_submit").attr('disabled', true);
                return;
            }
            $("#kt_login_code_submit").removeAttr('disabled');
            $("#kt_login_code_submit").addClass("active");

        });
        $('#code3').keyup(async function (e) {
            e.preventDefault();
            var code1 = $("#code1").val();
            var code2 = $("#code2").val();
            var code3 = $("#code3").val();
            var code4 = $("#code4").val();
            var code5 = $("#code5").val();
            var code6 = $("#code6").val();

            if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0 || code5.length == 0 || code5.length == 0 || code6.length == 0) {
                $("#kt_login_code_submit").removeClass("active");
                $("#kt_login_code_submit").attr('disabled', true);
                return;
            }
            $("#kt_login_code_submit").removeAttr('disabled');
            $("#kt_login_code_submit").addClass("active");

        });
        $('#code4').keyup(async function (e) {
            e.preventDefault();

            var code1 = $("#code1").val();
            var code2 = $("#code2").val();
            var code3 = $("#code3").val();
            var code4 = $("#code4").val();
            var code5 = $("#code5").val();
            var code6 = $("#code6").val();

            if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0 || code5.length == 0 || code5.length == 0 || code6.length == 0) {
                $("#kt_login_code_submit").removeClass("active");
                $("#kt_login_code_submit").attr('disabled', true);
                return;
            }
            $("#kt_login_code_submit").removeAttr('disabled');
            $("#kt_login_code_submit").addClass("active");

        });
        $('#code5').keyup(async function (e) {
            e.preventDefault();

            var code1 = $("#code1").val();
            var code2 = $("#code2").val();
            var code3 = $("#code3").val();
            var code4 = $("#code4").val();
            var code5 = $("#code5").val();
            var code6 = $("#code6").val();

            if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0 || code5.length == 0 || code5.length == 0 || code6.length == 0) {
                $("#kt_login_code_submit").removeClass("active");
                $("#kt_login_code_submit").attr('disabled', true);
                return;
            }
            $("#kt_login_code_submit").removeAttr('disabled');
            $("#kt_login_code_submit").addClass("active");

        });
        $('#code6').keyup(async function (e) {
            e.preventDefault();

            var code1 = $("#code1").val();
            var code2 = $("#code2").val();
            var code3 = $("#code3").val();
            var code4 = $("#code4").val();
            var code5 = $("#code5").val();
            var code6 = $("#code6").val();
            if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0 || code5.length == 0 || code5.length == 0 || code6.length == 0) {
                $("#kt_login_code_submit").removeClass("active");
                $("#kt_login_code_submit").attr('disabled', true);
                return;
            }
            $("#kt_login_code_submit").removeAttr('disabled');
            $("#kt_login_code_submit").addClass("active");

        });
    }

    var handleValidateNewPW = function () {
        $('#passwordNP').keyup(async function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            validarPW = true;
            //var pw = $('form').serializeArray();
            //var pwR = Object.values(pw[10]);
            //pw = Object.values(pw[9]);
            //pw = pw[1];
            //pwR = pwR[1];

            var pw = document.getElementById('passwordNP').value;
            var pwR = document.getElementById('RepeatPassword').value;

            //A Continuacion se utilizan funciones para veririfcar que la clave contenga minimo
            //Una letra minuscula, mayuscula, un numero, la clave no haya sido utilizada anteriormente,
            //Y Validar que las claves en el campo de repetir Contraseña sean iguales

            let mayus = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            let minus = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            let num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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

            if (pw.length <6) {
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswAlfa').removeClass("valido");
                $('#pswUsada').removeClass("valido");
                $('#pswLargo').removeClass("valido");
                validarPW = false;
            }
            if (pw != pwR && pw.length>0) {
                //Swal.fire("", "Las contraseñas deben coincidir", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswIgual').removeClass("valido")
                validarPW = false;
            } else {
                $('#pswIgual').addClass("valido")
            }

            if (pw.length < 6 || pw.length > 8) {
                //Swal.fire("", "La contraseña debe tener entre 8 y 15 caracteres ", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswLargo').removeClass("valido")
                validarPW = false;
            } else {
                $('#pswLargo').addClass("valido")
            }

            if (!buscar(pw, mayus) || !buscar(pw, minus) || !buscar(pw, num)) {
                //Swal.fire("", "La contraseña deben tener como minimo una letra minúscula, una letra mayúscula y un número", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswAlfa').removeClass("valido")
                validarPW = false;
            } else {
                $('#pswAlfa').addClass("valido")
            }
            

            document.querySelector('[name="username"]').value = identificador;
            //var userName = document.querySelector('[name="username"]').value;
            if (pw.length > 5) {
                let oldPass = await compareOldPassword(identificador, pw);            
                if (oldPass) {
                    //Swal.fire("", "No puedes usar una clave ingresada anteriormente", "warning");
                    $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                    $('#pswUsada').removeClass("valido")
                    validarPW = false;
                } else {
                    $('#pswUsada').addClass("valido")
                }
            }



            if (!validarPW) {
                //Swal.fire("", "Las contraseñas deben coincidir", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswIgual').removeClass("valido")
            } else {
                $('#pswIgual').addClass("valido");
            }
            if (validarPW) $('.kt_password_reset_submit').removeAttr("disabled")
            else $('.kt_password_reset_submit').prop("disabled", true)

            activateResetPassBtnField();
        });
    }

    var activateLoginBtn = function () {
        if ($('#kt_rut').val() && $('#kt_rut').val().length > 0 && $('#kt_pw').val().length > 0) {
            $("#kt_login_signin_submit").removeAttr('disabled');
            $("#kt_login_signin_submit").addClass("active");
        } else {
            $("#kt_login_signin_submit").attr('disabled');
            $("#kt_login_signin_submit").removeClass("active");
        }
    };

    var activateResetPassBtn = function () {
        validarCaptchaPW = true;
        if (validarPW) {
            $("#kt_password_reset_submit").removeAttr('disabled');
            $("#kt_password_reset_submit").addClass("active");
        }
    };
    var activateResetPassBtnField = function () {
        var captchaValidado = onLoadRecaptcha(1);
        if (captchaValidado && validarPW) {
            $("#kt_password_reset_submit").removeAttr('disabled');
            $("#kt_password_reset_submit").addClass("active");
        } else {
            $("#kt_password_reset_submit").removeClass("active");
            $("#kt_password_reset_submit").attr('disabled', true);
            
        }
    };

    var handleSamePW = function () {
        $('#RepeatPassword').keyup(async function (e) {
            e.preventDefault();

            var pw = document.getElementById('passwordNP').value;
            var pwR = document.getElementById('RepeatPassword').value;

            if (pw.length > 0 && pwR.length > 0) {
                if (pw != pwR) {
                    //Swal.fire("", "Las contraseñas deben coincidir", "warning");
                    $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                    $('#pswIgual').removeClass("valido")
                    validarPW = false;
                } else {
                    $('#pswIgual').addClass("valido");
                    validarPW = true;
                }
            }

            let mayus = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            let minus = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            let num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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

            if (pw.length < 6) {
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswAlfa').removeClass("valido");
                $('#pswUsada').removeClass("valido");
                $('#pswLargo').removeClass("valido");
                validarPW = false;
            }

            if (pw.length < 6 || pw.length > 8) {
                //Swal.fire("", "La contraseña debe tener entre 8 y 15 caracteres ", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswLargo').removeClass("valido")
                validarPW = false;
            } else {
                $('#pswLargo').addClass("valido")
            }

            if (!buscar(pw, mayus) || !buscar(pw, minus) || !buscar(pw, num)) {
                //Swal.fire("", "La contraseña deben tener como minimo una letra minúscula, una letra mayúscula y un número", "warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                $('#pswAlfa').removeClass("valido")
                validarPW = false;
            } else {
                $('#pswAlfa').addClass("valido")
            }

            document.querySelector('[name="username"]').value = identificador;
            //var userName = document.querySelector('[name="username"]').value;
            if (pw.length > 5) {
                let oldPass = await compareOldPassword(identificador, pw);
                if (oldPass) {
                    //Swal.fire("", "No puedes usar una clave ingresada anteriormente", "warning");
                    $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                    $('#pswUsada').removeClass("valido")
                    validarPW = false;
                } else {
                    $('#pswUsada').addClass("valido")
                }
            }


            activateResetPassBtnField();

        });
    }

    function onKeyDown(e) { //FUNCION PARA EL CODIGO DE INGRESO CAMBIO DE HORA
        var key = e.which;
        if (key === 8 || key === 46 || key === 9 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
            return true;
        }

        e.preventDefault();
        return false;
    }

    function goToNextInput(e) { //FUNCION PARA EL CODIGO DE INGRESO CAMBIO DE HORA
        var key = e.which,
            t = $(e.target),
            sib = t.next('input');

        if (key === 8 || key === 46) {
            sib = t.prev('input');
            sib.select().focus();
            return true;
        }
        if (key != 9 && !(key >= 48 && key <= 57) && !(key >= 96 && key <= 105)) {
            e.preventDefault();
            return false;
        }

        if (key === 9) {
            return true;
        }

        sib.select().focus();
    }

    function validateLoginField() {
        var captchaValido = onLoadRecaptcha(0);
        if (captchaValido && $('#kt_rut').val() && $('#kt_rut').val().length > 0 && $('#kt_pw').val().length > 0) {
            $("#kt_login_signin_submit").removeAttr('disabled');
            $("#kt_login_signin_submit").addClass("active");
        } else {
            $("#kt_login_signin_submit").attr('disabled');
            $("#kt_login_signin_submit").removeClass("active");
        }
    }


    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleCodeFormSubmit()
            handleForgotFormSubmit();
            handlePasswordReset();
            handleValidateNewPW();
            activateLoginBtn();
            activateResetPassBtn();
            handleSamePW();
            handValidateCodeEmpty();
            $("#divCodes").on('keyup', 'input', goToNextInput);
            $("#divCodes").on('keydown', 'input', onKeyDown);
            var validation = document.getElementsByName("ActivationCode")[0];
            if (validation && validation.value !== "00000000-0000-0000-0000-000000000000") {
                displayResetPasswordForm();
            }


        }
    };
}();





async function checkEmailValidity(email) {

    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {

        return (true);
    }
    return (false);
}

getBDCClientIp(
    /* provide a callback function for receiving the client ip */
    function (result) {

        
        client.call(
            /* api endpoint */
            'ip-geolocation-full',

            /* api query parameters */
            {
                'ip': result.ipString,
                localityLanguage: 'es'
            },
            function (jsonResult) {
                dataLocalizacion = jsonResult;
                $("#JsonData").val(JSON.stringify(dataLocalizacion));

                if (dataLocalizacion == null) {
                    //que hacemos si no podemos obtener la data de lolazacion

                } else {
                    dataLocalizacion.country.isoAlpha2 = "CL";
                    if (dataLocalizacion.country.isoAlpha2 === "CL") {
                        $("#labelIdentificador").text("Ingresa tu E-MAIL o RUT");
                        $("#labelIdentificadorReset").text("Ingresa tu RUT");
                        var baseUrl = new URL(window.location.href); //url base para servicios.

                        if (baseUrl.hostname.includes("doctoronline.cl")) {
                            $("#kt_rut").attr("placeholder", "11111111-1");
                        }
                        else {
                            $("#kt_rut").attr("placeholder", "Ingresa tu RUT");
                        }

                        $("#kt_email").attr("placeholder", "Ingresa tu RUT");
                    } else if (dataLocalizacion.country.isoAlpha2 === "BO") {
                        $("#labelIdentificador").text("Ingresa tu E-MAIL o C\xE9dula de Identidad");
                        $("#labelIdentificadorReset").text("Ingresa tu C\xE9dula de Identidad");
                        $("#kt_rut").attr("placeholder", "ejemplo@mail.com o AA111111");
                        $("#kt_email").attr("placeholder", "AA111111");
                        var cssId = 'cssBol';  // you could encode the css path itself to generate id..
                        if (!document.getElementById(cssId)) {
                            var head = document.getElementsByTagName('head')[0];
                            var link = document.createElement('link');
                            link.id = cssId;
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            link.href = '/css/Bolivia/bolivia.css?rnd=' + Math.floor(Math.random() * 10000);
                            head.appendChild(link);
                            $(".convenioChile").hide();
                            $(".convenioBOL").show();
                        }

                    } else if (dataLocalizacion.country.isoAlpha2 === "CO") {
                        $("#labelIdentificador").text("Ingresa tu E-MAIL o DI");
                        $("#labelIdentificadorReset").text("Ingresa tu DI");
                        $("#kt_rut").attr("placeholder", "ejemplo@mail.com o 111111");
                        $("#kt_email").attr("placeholder", "111111");
                        var cssId = 'cssBol';  // you could encode the css path itself to generate id..
                        if (!document.getElementById(cssId)) {
                            var head = document.getElementsByTagName('head')[0];
                            var link = document.createElement('link');
                            link.id = cssId;
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            link.href = '/css/Colombia/colombia.css?rnd=' + Math.floor(Math.random() * 10000);
                            head.appendChild(link);
                            $(".convenioChile").hide();
                            $(".convenioBOL").show();
                        }
                    } else {
                        $(".convenioChile").hide();
                        $(".convenioBOL").hide();
                    }
                }
            },
            function (err, code) {

                console.log('Vanilla error', err, code);
            }
        );
    }
);

// Class Initialization
jQuery(document).ready(async function () {


    var parsedUrl = new URL(window.location.href);
    var url = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1);

    KTLoginGeneral.init();



    $("#show_hide_password a").on('click', function (event) {
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
    $("#show_hide_password_new a").on('click', function (event) {
        if ($('#show_hide_password_new input').attr("type") == "text") {
            $('#show_hide_password_new input').attr('type', 'password');
            $('#show_hide_password_new i').addClass("fa-eye-slash");
            $('#show_hide_password_new i').removeClass("fa-eye");
        } else if ($('#show_hide_password_new input').attr("type") == "password") {
            $('#show_hide_password_new input').attr('type', 'text');
            $('#show_hide_password_new i').removeClass("fa-eye-slash");
            $('#show_hide_password_new i').addClass("fa-eye");
        }
    });
    $("#show_hide_password_newr a").on('click', function (event) {
        if ($('#show_hide_password_newr input').attr("type") == "text") {
            $('#show_hide_password_newr input').attr('type', 'password');
            $('#show_hide_password_newr i').addClass("fa-eye-slash");
            $('#show_hide_password_newr i').removeClass("fa-eye");
        } else if ($('#show_hide_password_newr input').attr("type") == "password") {
            $('#show_hide_password_newr input').attr('type', 'text');
            $('#show_hide_password_newr i').removeClass("fa-eye-slash");
            $('#show_hide_password_newr i').addClass("fa-eye");
        }
    });

    $("input#kt_rut").rut({ useThousandsSeparator: false }).on('rutInvalido', async function (e) {
        //dataLocalizacion.country.isoAlpha2 = "CO";
        if (dataLocalizacion.country.isoAlpha2 !== "CL") {
            rutValido = true;
        }
        else {
            rutValido = false;
        }
        if (await checkEmailValidity($(this).val())) {

            rutValido = true;
            var users = await findUsersByEmail($(this).val());

            
            if (users.length > 1) {
                document.getElementById("tablaUsuarios").innerHTML = "";
                users.forEach(function (item) {
                    let filaPersona = document.createElement('tr');
                    let divTdPersona = document.createElement('td');
                    divTdPersona.innerHTML = item.nombre + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno;
                    let divTdPersonaButton = document.createElement('td');
                    let buttonInside = document.createElement('button');
                    buttonInside.setAttribute('class', 'btn btn-primary');
                    buttonInside.innerHTML = "Seleccionar";
                    buttonInside.setAttribute('data-identificador', item.identificador);
                    buttonInside.addEventListener("click", async function () {
                        $('#kt_rut').val($.formatRut($(this).data("identificador"), true));
                        $('#myModal').modal('hide');
                    });
                    divTdPersonaButton.appendChild(buttonInside);
                    filaPersona.appendChild(divTdPersona);
                    filaPersona.appendChild(divTdPersonaButton);
                    document.getElementById("tablaUsuarios").appendChild(filaPersona);
                });
                $('#myModal').modal('show')
            }

        }
    }).on('rutValido', function () {
        rutValido = true;
        if (dataLocalizacion.country.isoAlpha2 === "CL") {
            $(this).val($.formatRut($(this).val(), false));
        }

    });

    $("input#kt_email").rut({ useThousandsSeparator: false }).on('rutInvalido', async function (e) {
        if (dataLocalizacion.country.isoAlpha2 !== "CL") {
            rutValido = true;
            identificador = $("input#kt_email").val();
        } else {
            rutValido = false;
        }
        if (await checkEmailValidity($(this).val())) {
            ;
            rutValido = true;
            var users = await findUsersByEmail($(this).val());
            ;
            
            if (users.length > 1) {
                document.getElementById("tablaUsuarios").innerHTML = "";
                users.forEach(function (item) {
                    let filaPersona = document.createElement('tr');
                    let divTdPersona = document.createElement('td');
                    divTdPersona.innerHTML = item.nombre + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno;
                    let divTdPersonaButton = document.createElement('td');
                    let buttonInside = document.createElement('button');
                    buttonInside.setAttribute('class', 'btn btn-primary');
                    buttonInside.innerHTML = "Seleccionar";
                    buttonInside.setAttribute('data-identificador', item.identificador);
                    buttonInside.addEventListener("click", async function () {
                        $('#kt_rut').val($.formatRut($(this).data("identificador"), true));
                        $('#myModal').modal('hide');

                    });
                    divTdPersonaButton.appendChild(buttonInside);
                    filaPersona.appendChild(divTdPersona);
                    filaPersona.appendChild(divTdPersonaButton);
                    document.getElementById("tablaUsuarios").appendChild(filaPersona);
                });
                $('#myModal').modal('show')
            }

        }
    }).on('rutValido', function () {
        rutValido = true;
        if (dataLocalizacion.country.isoAlpha2 === "CL") {
            $(this).val($.formatRut($(this).val(), false));
        }
        identificador = $("input#kt_email").val();
    });


});

function formatRut(rut) {
    // Despejar Puntos
    let valor = rut.replace('.', '');
    // Despejar Guión
    valor = valor.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1).toUpperCase();

    if (rut == '')
        return '';

    // Formatear RUN
    rut = `${cuerpo}-${dv}`;
    return rut;
}