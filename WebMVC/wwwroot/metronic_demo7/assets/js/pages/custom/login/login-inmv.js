import { findUsersByEmail } from '../../../../../../js/apis/personas-fetch.js';
var baseUrlWeb = new URL(window.location.href); // url base para mostrar imagenes.
if (baseUrlWeb.hostname.includes("qa")) {

    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.medical.medismart.live";

} else {

    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.live";

}

var rutValido = true;
var dataLocalizacion = null;
var showErrorMsg;
var apiKey = '875e06efb1c446d89eb05bfaca2ca3ec'; // Your api key found at: https://www.bigdatacloud.net/customer/account



//vanilla implementation
var client = new BDCApiClient(apiKey);

/* You can set the default api language as needed */
client.localityLanguage = 'es';

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

    // Private Functions
    var displaySignUpForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--reset');


        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');
        login.removeClass('kt-login--reset');


        login.addClass('kt-login--signin');
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function () {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');
        login.removeClass('kt-login--reset');


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

    var handleFormSwitch = function () {
        $('#kt_login_forgot').click(function (e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_forgot_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function () {
        $('#kt_login_signin_submit').click(function (e) {
            $('.alert').remove();
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un rut v�lido.');
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

            form.ajaxSubmit({
                url: '/account/login',
                success: function (response, status, xhr, $form) {
                    if (response.msg == "error") {
                        // similate 1s delay
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            showErrorMsg(form, 'danger', 'Usuario o clave incorrecta. Por favor intente nuevamente.');
                        }, 1000);
                    }
                    else if (response.msg == "Inactivo") {
                        // similate 1s delay
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            showErrorMsg(form, 'danger', 'Usuario inactivo, contactese con mesa de ayuda para solucionar este problema, envia un correo a ayuda@medismart.live o llamando al +56 9 4804 2543');
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
                showErrorMsg(form, 'danger', 'Ingrese un rut v�lido.');
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
                showErrorMsg(form, 'danger', 'Ingrese un rut v�lido.');
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
                                showErrorMsg(form, 'danger', `No se ha podido encontrar tu cuenta de Medical`);
                                break;
                            case 3:
                                showErrorMsg(form, 'danger', 'Usuario inactivo, contactese con mesa de ayuda para solucionar este problema, envia un correo a ayuda@medismart.live o llamando al +56 9 4804 2543');
                                break;
                            default:
                                showErrorMsg(form, 'danger', `Ocurri� un error. Favor intenta nuevamente.`);
                        }
                        return;
                    }
                    else {
                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.kt-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', `La instrucci${decodeURI("%C3%B3")}n de recuperaci${decodeURI("%C3%B3")}n de contrase${decodeURI("%C3%B1")}a ha sido enviada a tu correo.`);
                    }
                }
            });
        });
    }


    var handlePasswordReset = function () {
        $('#kt_password_reset_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');
            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un rut v�lido.');
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
                url: '/account/ResetPassword',
                success: function (response, status, xhr, $form) {
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
                                showErrorMsg(form, 'danger', `El c${decodeURI("%C3%B3")}digo de validaci�n no es correcto`);
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

                        showErrorMsg(signInForm, 'success', `Tu contrase${decodeURI("%C3%B1")}a ha sido modificada correctamente.`);
                    }
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgotFormSubmit();
            handlePasswordReset();


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
                ;
                dataLocalizacion = jsonResult;
                $("#JsonData").val(JSON.stringify(dataLocalizacion));

                if (dataLocalizacion == null) {
                    //que hacemos si no podemos obtener la data de lolazacion

                } else {
                    $("#labelIdentificador").text("C�dula de Identidad");
                    $("#labelIdentificadorReset").text("C�dula de Identidad");
                    $("#kt_rut").attr("placeholder", "11.111.111-1");
                    $("#kt_email").attr("placeholder", "11.111.111-1");
                   
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
            
            console.log(users);
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
        rutValido = true;;
        $(this).val($.formatRut($(this).val(), false));
    });

    $("input#kt_email").rut({ useThousandsSeparator: false }).on('rutInvalido', async function (e) {
        if (dataLocalizacion.country.isoAlpha2 !== "CL") {
            rutValido = true;
        } else {
            rutValido = false;
        }
        
    }).on('rutValido', function () {
        rutValido = true;;

        if (dataLocalizacion.country.isoAlpha2 === "CL") {
            $(this).val($.formatRut($(this).val(), false));
        }

    });


});
