"use strict";
var baseUrlWeb = new URL(window.location.href); // url base para mostrar imagenes.

if (baseUrlWeb.hostname.includes(".website")) {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.website";
} else if (baseUrlWeb.hostname.includes("qa")) {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.medical.medismart.live";
}
else {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.live";
}




var rutValido = true;
var dataLocalizacion = null;
var showErrorMsg;
var showErrorMsgCURP;
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

    showErrorMsgCURP = function (type, msg) {$('.alert').remove();
        var alert = $('<div id="alert1"  class="alert alert-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+ msg + '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');
        var form = $('#formMx');
        //form.find('.alert').remove();
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
            
            let valCurp = document.getElementById("kt_rut");

            let ret = validarInput(valCurp.value);
            if (ret == false) {
                showErrorMsgCURP('danger', 'CURP Inválido');
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
                            showErrorMsg(form, 'danger', 'Usuario inactivo, contactese con mesa de ayuda para solucionar este problema, envia un correo a ayuda@medismart.live o llamando al +56 2 28696207');
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
            console.log(baseUrlWeb)
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
                                showErrorMsg(form, 'danger', 'Usuario inactivo, contactese con mesa de ayuda para solucionar este problema, envia un correo a ayuda@medismart.live o llamando al +56 2 28696207');
                                break;
                            default:
                                showErrorMsg(form, 'danger', `Ocurrió un error. Favor intenta nuevamente.`);
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



            //Handler para el evento cuando cambia el input
            //Lleva la CURP a mayúsculas para validarlo
            function validarInput(valor) {
                var curp = valor.toUpperCase(),
                    resultado = document.getElementById("resultado"),
                    valido = "Inválido";

                if (curpValida(curp)) { // ⬅️ Acá se comprueba
                    valido = "Válido";
                    resultado.classList.add("ok");
                    return true;

                } else {
                    resultado.classList.remove("ok");
                    return false;

                }

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

        console.log(result);
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
                //console.log(dataLocalizacion.country.isoAlpha2);
                // dataLocalizacion.country.isoAlpha2 = "MX"; 
                $("#JsonData").val(JSON.stringify(dataLocalizacion));

                if (dataLocalizacion == null) {
                    //que hacemos si no podemos obtener la data de lolazacion

                } else {
                    dataLocalizacion.country.isoAlpha2 = "MX";
                    if (dataLocalizacion.country.isoAlpha2 === "MX") {
                        $("#labelIdentificador").text("Ingresa tu E-MAIL o CURP");
                        $("#labelIdentificadorReset").text("Ingresa tu CURP");
                        $("#kt_rut").attr("placeholder", "ejemplo@mail.com o HIBK111111MOCNRR11");
                        $("#kt_email").attr("placeholder", "HIBK111111MOCNRR11");
                        var cssId = 'cssBol';  // you could encode the css path itself to generate id..
                        if (!document.getElementById(cssId)) {
                            var head = document.getElementsByTagName('head')[0];
                            var link = document.createElement('link');
                            link.id = cssId;
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            //link.href = '/css/Mexico/mexico.css?rnd=' + Math.floor(Math.random() * 10000);
                            head.appendChild(link);
                            $(".convenioChile").hide();
                            $(".convenioBOL").show();
                        }
                    }
                    else {
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




    $("input#kt_rut").rut({ useThousandsSeparator: false }).on('rutInvalido', async function (e) {
        //  dataLocalizacion.country.isoAlpha2 = "MX";
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
        rutValido = true;

        if (dataLocalizacion.country.isoAlpha2 === "CL") {
            $(this).val($.formatRut($(this).val(), false));
        }

    });

    $("input#kt_email").rut({ useThousandsSeparator: false }).on('rutInvalido', async function (e) {
        if (dataLocalizacion.country.isoAlpha2 !== "CL") {
            rutValido = true;
        } else {
            rutValido = false;
        }
        if (await checkEmailValidity($(this).val())) {
            ;
            rutValido = true;
            var users = await findUsersByEmail($(this).val());
            ;
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
        rutValido = true;

        if (dataLocalizacion.country.isoAlpha2 === "CL") {
            $(this).val($.formatRut($(this).val(), false));
        }

    });


});


//Función para validar una CURP
function curpValida(curp) {
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = curp.match(re);

    if (!validado)  //Coincide con el formato general?
        return false;

    //Validar que coincida el dígito verificador
    function digitoVerificador(curp17) {
        //Fuente https://consultas.curp.gob.mx/CurpSP/
        var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
            lngSuma = 0.0,
            lngDigito = 0.0;
        for (var i = 0; i < 17; i++)
            lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
        lngDigito = 10 - lngSuma % 10;
        if (lngDigito == 10) return 0;
        return lngDigito;
    }

    if (validado[2] != digitoVerificador(validado[1]))
        return false;

    return true; //Validado
}

