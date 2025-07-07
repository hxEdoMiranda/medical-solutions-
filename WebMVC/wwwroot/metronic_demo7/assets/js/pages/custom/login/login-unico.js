import { findUsersByEmail, compareOldPassword, saveOldPassword } from '../../../../../../js/apis/personas-fetch.js';
var baseUrlWeb = new URL(window.location.href); // url base para mostrar imagenes.
var mensaje = "Usuario inactivo, contactese con mesa de ayuda para solucionar este problema, envía un correo a ayuda@medismart.live o contactándonos por mensaje de whatsapp al +56 9 4804 2543";



if (baseUrlWeb.hostname.includes(".website")) {
    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.website";
} else if (baseUrlWeb.hostname.includes("qa")) {

    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://qa.medical.medismart.live";

} else {

    baseUrlWeb = baseUrlWeb.hostname.includes("localhost") ? "https://localhost:44363" : "https://medical.medismart.live";

}

var rutValido = true;
var dataLocalizacion = null;
var showErrorMsg;
var apiKey = '875e06efb1c446d89eb05bfaca2ca3ec'; // Your api key found at: https://www.bigdatacloud.net/customer/account;
let linkPlan = "";
let urlConvenio = "";
let us = "";
let rol = "";
let pass = "";
let ajaxRequest;
let loginInProgress = false;


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
                showErrorMsg(form, 'danger', 'Ingrese un RUT válido.');
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

            ajaxRequest = form.ajaxSubmit({
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
                        // Simular un retraso de 1 segundo
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                        
                                showErrorMsg(form, 'danger', mensaje);
                            
                        }, 1000);
                    }
                        

                        
                    
                    else if (response.msg == "CorreoEnviado")
                    {
                        // similate 1s delay
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                        // Ocultar el div anterior y mostrar el div de código de validación
                        $('#divCodigoValidacion').show();

                        $('#loginPassword').hide();
                        $('#loginUsername').hide();
                    }
                    else if (response.msg == "errorValidationCode") {
                        // similate 1s delay
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            showErrorMsg(form, 'danger', 'Código incorrecto. Por favor intente nuevamente.');
                        }, 1000);
                    }
                    else if (response.msg == "Menor") {
                        // similate 1s delay
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            showErrorMsg(form, 'danger', 'Usuario menor de edad, debe ingresar titular y seleccionar beneficiario menor de edad.');
                        }, 1000);
                    }
                    else if (response.msg == "multiconvenio") {
                        $("#contentPlanes").empty();
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                        var data = response.listaMultiEmpresa;
                        let divContent = document.getElementById('contentPlanes');
                        var conve = "";
                        
                        data.forEach(item => {
                            if (conve == item.urlPrincipal)
                                return;
                            let divContentPlan = document.createElement('div');
                            divContentPlan.setAttribute('class', 'prehome__plan');

                            let imgEmpresa = document.createElement('img');
                            imgEmpresa.setAttribute('class', 'consorcio-img')
                            if (item.urlPrincipal.includes("medical.")) {
                                imgEmpresa.setAttribute('class', 'consorcio-img img-medical')
                            }
                            imgEmpresa.src = item.logoEmpresa
                            if (item.urlPrincipal.includes("cns."))
                                imgEmpresa.src = "/img/iso-consorcio.svg";
                                             
                            let title = document.createElement('h5');
                            title.setAttribute('class', 'modal-title title-convenio');
                            if (item.urlPrincipal.includes("medical.")) {
                                title.setAttribute('class', 'modal-title title-convenio especial');
                            }
                            title.innerText = item.convenio;

    
                            divContentPlan.appendChild(imgEmpresa);
                            divContentPlan.appendChild(title);
                           
                            divContent.appendChild(divContentPlan);
                            

                            divContentPlan.onclick = () => {
                                $('.prehome__plan').removeClass('selected-plan');
                                divContentPlan.removeAttribute('data-link');
                                divContentPlan.setAttribute('class', 'prehome__plan selected-plan');
                                divContentPlan.setAttribute('data-link', item.urlPrincipal);
                                //$('.prehome__plan').addClass('selected-plan');

                            }
                            conve = item.urlPrincipal;
                        });

                       

                        $('#modalConveniosIngresar').modal('show');
                    }
                    else
                        window.location.href = response.returnUrl;

                }
            });
        });
    }


    $('#btnIngresar').click(async function (event) {
        event.preventDefault(); // Evita la recarga automática de la página

        $(this).prop('disabled', true);
        $(this).css('cursor', 'wait');
        $(this).html('<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...');

        const us = document.getElementById('kt_rut').value;
        const rol = document.querySelector('[name=rol]').value;
        const pass = document.querySelector('#Password').value;
        const linkPlan = document.querySelector('.selected-plan').getAttribute("data-link");

        try {
            const responseLogin = await fetch(`/account/loginRedirectEmpresa?userName=${us}&password=${pass}&hostname=${linkPlan}&returnUrl=null&rol=${rol}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (responseLogin.ok) {
                const dataLogin = await responseLogin.json();
                window.location.href = dataLogin.returnUrl;
            } else {
                throw new Error('Error al iniciar sesión');
            }
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al iniciar sesión');
        }
    });





    var handleSignUpFormSubmit = function () {
        $('#kt_login_signup_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un RUT válido.');
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
                showErrorMsg(form, 'danger', 'Ingrese un RUT válido.');
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
                                showErrorMsg(form, 'danger', mensaje);
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
        $('#kt_password_reset_submit').click(async function (e) {
            e.preventDefault();
            
            var btn = $(this);
            var form = $(this).closest('form');
            var allInputs = form.serializeArray();

            var pw = allInputs.find((e) => e.name == "Password")?.value;
            var pwR = allInputs.find((e) => e.name == "RepeatPassword")?.value;

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


            if(pw.length < 8 || pw.length > 15){
                Swal.fire("","La contraseña debe tener entre 8 y 15 caracteres ","warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }

            if( !buscar(pw,mayus) || !buscar(pw,minus) || !buscar(pw,num)){
                Swal.fire("","La contraseña deben tener como mínimo una letra minúscula, una letra mayúscula y un número","warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (pw != pwR) {
                Swal.fire("","Las contraseñas deben coincidir","warning");
                $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }
            
            
            var userName = document.querySelector('[name="username"]').value;

            let oldPass = await compareOldPassword(userName,pw);

            if ( oldPass ) {
                Swal.fire("","No puedes usar una clave ingresada anteriormente","warning");
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                return;
            }


            if (!rutValido) {
                showErrorMsg(form, 'danger', 'Ingrese un RUT válido.');
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
                dataLocalizacion = jsonResult;
                $("#JsonData").val(JSON.stringify(dataLocalizacion));
           
                
            
                if (dataLocalizacion == null) {
                    //que hacemos si no podemos obtener la data de localizacion
                    $('#logos-google').hide(); //oculta mediante id
                    $('#invitado').hide(); //oculta mediante id
                    $('#divider-invitado').hide(); //oculta mediante id  
                    $("#labelIdentificador").text("Ingresa tu Documento de identidad");
                    $("#labelIdentificadorReset").text("Ingresa tu Documento de identidad");
                    $("#kt_rut").attr("placeholder", "111111");
                    $("#kt_email").attr("placeholder", "111111");
                    var baseUrl = new URL(window.location.href); //url base para servicios.
                    $("#kt_email").attr("placeholder", "11111111-1");
                    $(".convenioChile").hide();
                    $(".convenioBOL").hide();

                } else {
                    //dataLocalizacion.country.isoAlpha2 = "BO";                     
                    //dataLocalizacion.country.isoAlpha2 = "CO";
                    if (dataLocalizacion.country.isoAlpha2 === "CL") {   
                        $('#logos-google').show(); //muestro mediante id
                        $('#invitado').show(); //muestro mediante id    
                        $('#divider-invitado').show(); //muestro mediante id  
                        $("#labelIdentificador").text("Ingresa tu RUT");
                        $("#labelIdentificadorReset").text("Ingresa tu RUT");
                        var baseUrl = new URL(window.location.href); //url base para servicios.
                        
                        if (baseUrl.hostname.includes("doctoronline.cl")) {
                            $("#kt_rut").attr("placeholder", "11111111-1");
                        }
                        else {
                            $("#kt_rut").attr("placeholder", "11111111-1");
                        }
                        
                        $("#kt_email").attr("placeholder", "11111111-1");
                    } else if (dataLocalizacion.country.isoAlpha2 === "BO") {
                        $('#logos-google').hide(); //oculta mediante id
                        $('#invitado').hide(); //oculta mediante id
                        $('#divider-invitado').hide(); //oculta mediante id  
                        $("#labelIdentificador").text("Ingresa tu C\xE9dula de Identidad");
                        $("#labelIdentificadorReset").text("Ingresa tu C\xE9dula de Identidad");
                        $("#kt_rut").attr("placeholder", "AA111111");
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
                        $('#logos-google').hide(); //oculta mediante id
                        $('#invitado').hide(); //oculta mediante id
                        $('#divider-invitado').hide(); //oculta mediante id  
                        $("#labelIdentificador").text("Ingresa tu Documento de identidad");
                        $("#labelIdentificadorReset").text("Ingresa tu Documento de identidad");
                        $("#kt_rut").attr("placeholder", "111111");
                        $("#kt_email").attr("placeholder", "111111");
                        validationTermsCo = true;
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
                    } else if (dataLocalizacion.country.isoAlpha2 === "PE") {
                            $('#logos-google').hide(); //oculta mediante id
                            $('#invitado').hide(); //oculta mediante id
                            $('#divider-invitado').hide(); //oculta mediante id  
                            $("#labelIdentificador").text("Ingresa tu Documento de identidad");
                            $("#labelIdentificadorReset").text("Ingresa tu Documento de identidad");
                            $("#kt_rut").attr("placeholder", "11111111");
                            $("#kt_email").attr("placeholder", "11111111");
                            var baseUrl = new URL(window.location.href); //url base para servicios.
                            $(".convenioChile").hide();
                            $(".convenioBOL").hide();
                    } else if (dataLocalizacion.country.isoAlpha2 === "EC") {
                            $('#logos-google').hide(); //oculta mediante id
                            $('#invitado').hide(); //oculta mediante id
                            $('#divider-invitado').hide(); //oculta mediante id  
                            $("#labelIdentificador").text("Ingresa tu Documento de identidad");
                            $("#labelIdentificadorReset").text("Ingresa tu Documento de identidad");
                            $("#kt_rut").attr("placeholder", "1111111111");
                            $("#kt_email").attr("placeholder", "1111111111");
                            var baseUrl = new URL(window.location.href); //url base para servicios.
                            $(".convenioChile").hide();
                            $(".convenioBOL").hide();
                    }
                    else {
                        $('#logos-google').hide(); //oculta mediante id
                        $('#invitado').hide(); //oculta mediante id
                        $('#divider-invitado').hide(); //oculta mediante id  
                        $("#labelIdentificador").text("Ingresa tu Documento de identidad");
                        $("#labelIdentificadorReset").text("Ingresa tu Documento de identidad");
                        $("#kt_rut").attr("placeholder", "111111");
                        $("#kt_email").attr("placeholder", "111111");
                        var baseUrl = new URL(window.location.href); //url base para servicios.
                        $("#kt_email").attr("placeholder", "11111111-1");
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
        var form = $(this).closest('form');
        // dataLocalizacion.country.isoAlpha2 = "CO";
       // dataLocalizacion.country.isoAlpha2 = "MX";
        if (dataLocalizacion.country.isoAlpha2 !== "CL") {
            rutValido = true;
        }
        else {
            setTimeout(function () {
                showErrorMsg(form, 'danger', 'Ingrese un rut válido');
            }, 1000);
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
						if (dataLocalizacion.country.isoAlpha2 !== "CL") 
							$('#kt_rut').val($(this).data("identificador"));
						else
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

            if ($('.alert').length) {
                document.querySelector('.alert').remove();
            }
            $(this).val($.formatRut($(this).val(), false));
        }
       
    });

    $("input#kt_email").rut({ useThousandsSeparator: false }).on('rutInvalido', async function (e) {
        var form = $(this).closest('form');
        if (dataLocalizacion.country.isoAlpha2 !== "CL") {
            rutValido = true;
        } else {
            setTimeout(function () {
                showErrorMsg(form, 'danger', 'Ingrese un RUT válido');
            }, 1000);
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
                       if (dataLocalizacion.country.isoAlpha2 !== "CL") 
							$('#kt_rut').val($(this).data("identificador"));
						else
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
            if ($('.alert').length) {
                document.querySelector('.alert').remove();
            }
            $(this).val($.formatRut($(this).val(), false));
        }

    });


});
