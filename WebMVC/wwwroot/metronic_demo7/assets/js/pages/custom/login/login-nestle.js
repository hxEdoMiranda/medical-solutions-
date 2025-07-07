import { sendCorreoBienvenida } from "../../../../../../js/apis/correos-fetch.js";


$(async function () {
    $("#btnCrearCuenta").click(function (e) {
        e.preventDefault();
        var nombre = $("#nombreCuenta").val();
        var apellido = $("#apellidoCuenta").val();
        var rut = $("#rutCuenta").val();
        var correo = $("#correoCuenta").val();


        if (nombre == "" || nombre.length < 2) {
            console.log('Ingrese un nombre!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un nombre!"
            return
        }
        if (apellido == "" || apellido.length < 2) {
            console.log('Ingrese un apellido!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un apellido!"
            return
        }
        if (rut == "") {
            console.log('Ingrese un rut!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un rut!"
            return
        }
        let validaRut = VerificaRut(rut);
        if (!validaRut || rut.length < 7) {
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un rut valido";
            return;
        }
        if (correo == "") {
            console.log('Ingrese una direccion de email por favor')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese una direccion de email";
            return
        }

        let valida = validar_email(correo);
        if (!valida) {
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese una direccion de email valida";
            return;
        }


        var data = { nombre: nombre, apellido: apellido, rut: rut, correo: correo };
        var formEnvio = {
            Nombre: nombre,
            ApellidoPaterno: apellido,
            ApellidoMaterno: '',
            Identificador: rut,
            Correo: correo,
            idCliente: 160
        };

        $.ajax({
            url: "/account/CreateUserPrueba",
            type: "POST",
            data: data,
            success: async function (response) {
                console.log(response);
                const jsonResponse2 = JSON.parse(response);
                console.log(jsonResponse2);

                if (jsonResponse2.err) {
                    switch (jsonResponse2.err) {

                        case 1:

                            await sendCorreoBienvenida(formEnvio);
                            Swal.fire({
                                title: "Usuario fue creado con éxito!",
                                text: "Ahora ingresa con tu rut y contraseña conformada por los 6 primeros dígitos del rut!",
                                type: "success",
                                confirmButtonText: "OK",
                            }).then(() => {
                                console.log("exito");
                                //SHOW MODAL
                                $('#modalCrearCuenta').modal('hide');
                            });
                            break;
                        case 2:
                            console.log("error al crear usuario");
                            Swal.fire({
                                title: "Error al crear usuario!",
                                text: "Por favor intente mas tarde!",
                                type: "danger",
                                confirmButtonText: "OK",
                            }).then(() => {
                                console.log("error");
                                //SHOW MODAL
                                $('#modalCrearCuenta').modal('hide');
                            });
                            break;
                    }
                    return;
                }
                else {

                    await sendCorreoBienvenida(formEnvio);
                    document.querySelector('#div-alert').classList.add('d-none');
                    Swal.fire({
                        title: "Usuario fue creado con éxito!",
                        text: "Ahora ingresa con tu rut y contraseña conformada por los 6 primeros dígitos del rut!",
                        type: "success",
                        confirmButtonText: "OK",
                    }).then(() => {
                        console.log("exito");
                        //SHOW MODAL
                        $('#modalCrearCuenta').modal('hide');
                    });
                    console.log("usuario creado correctamente");
                    showErrorMsg('success', `Usuario creado correctamente.`);
                }
            }
        });
    });
});

/** 
$(function () {
    $("#btnCrearCuenta").click(function (e) {
        e.preventDefault();
        var nombre = $("#nombreCuenta").val();
        var apellido = $("#apellidoCuenta").val();
        var rut = $("#rutCuenta").val();
        var correo = $("#correoCuenta").val();
        var codigo = $("#codigoCuenta").val();


        if (nombre == "" || nombre.length < 2) {
            console.log('Ingrese un nombre!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un nombre!"
            return
        }
        if (apellido == "" || apellido.length < 2) {
            console.log('Ingrese un apellido!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un apellido!"
            return
        }
        if (rut == "") {
            console.log('Ingrese un rut!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un rut!"
            return
        }
        let validaRut = VerificaRut(rut);
        if (!validaRut || rut.length < 7) {
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un rut valido";
            return;
        }
        if (correo == "") {
            console.log('Ingrese una direccion de email por favor')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese una direccion de email";
            return
        }

        let valida = validar_email(correo);
        if (!valida) {
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese una direccion de email valida";
            return;
        }


        var data = { nombre: nombre, apellido: apellido, rut: rut, correo: correo, codigo: codigo };

        $.ajax({
            url: "/account/NuevoBeneficiarioCodigo",
            type: "POST",
            data: data,
            success: function (response) {
                console.log(response);
                const jsonResponse2 = JSON.parse(response);
                console.log(jsonResponse2);

                if (jsonResponse2.err) {
                    switch (jsonResponse2.err) {
                        case 1:
                            //document.querySelector('#div-alert').classList.remove('d-none');
                            //document.getElementById("errMessage").innerHTML = "rut ya existe en el sistema";
                            Swal.fire({
                                title: "Usuario fue creado con éxito!",
                                text: "Ahora ingresa con tu rut y contraseña conformada por los 6 primeros dígitos del rut!",
                                type: "success",
                                confirmButtonText: "OK",
                            }).then(() => {
                                console.log("exito");
                                //SHOW MODAL
                                $('#modalCrearCuenta').modal('hide');
                            });
                            break;
                        case 2:
                            console.log("error al crear usuario");
                            //document.querySelector('#div-alert').classList.remove('d-none');
                            //document.getElementById("errMessage").innerHTML = "Error al crear usuario, intente denuevo";
                            Swal.fire({
                                title: "Error al crear usuario!",
                                text: "Por favor intente mas tarde!",
                                type: "danger",
                                confirmButtonText: "OK",
                            }).then(() => {
                                console.log("error");
                                //SHOW MODAL
                                $('#modalCrearCuenta').modal('hide');
                            });
                            break;
                    }
                    return;
                }
                else {
                    document.querySelector('#div-alert').classList.add('d-none');
                    //document.querySelector('#div-alert-succes').classList.remove('d-none');
                    //document.getElementById("successMessage").innerHTML = "Usuario creado correctamente.";
                    Swal.fire({
                        title: "Usuario fue creado con éxito!",
                        text: "Ahora ingresa con tu rut y contraseña conformada por los 6 primeros dígitos del rut!",
                        type: "success",
                        confirmButtonText: "OK",
                    }).then(() => {
                        console.log("exito");
                        //SHOW MODAL
                        $('#modalCrearCuenta').modal('hide');
                    });
                    console.log("usuario creado correctamente");
                    showErrorMsg('success', `Usuario creado correctamente.`);
                }
            }
        });
    });
});
*/


function validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

const identificador = document.getElementById("rutCuenta");
identificador.onblur = () => {
    var auxRut = identificador.value;
    if (auxRut.length > 7) {
        let rutFormato = formatRut(auxRut);
        identificador.value = rutFormato;
    }

}

function formatRut(rut) {
    // Despejar Puntos
    var valor = rut.replace('.', '');
    // Despejar Guión
    var valor = valor.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    var cuerpo = valor.slice(0, -1);
    var dv = valor.slice(-1).toUpperCase();

    // Formatear RUN
    rut = cuerpo + '-' + dv;
    console.log("rut es:" + rut);
    return rut;
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

$('#modalCrearCuenta').on('hidden.bs.modal', function () {
    $('#div-alert').toggleClass("d-none");
    $("#nombreCuenta").val("");
    $("#apellidoCuenta").val("");
    $("#apellidoCuentaM").val("");
    $("#genero").val("");
    $("#rutCuenta").val("");
    $("#correoCuenta").val("");
})


/** 
$(function () {
    $("#kt_codigo_submit").click(function () {


        var codigo = $("#CodigoProm").val();
        var btn = $(this);

        document.querySelector('#div-alert').classList.add('d-none');
        document.querySelector('#div-alert-succes').classList.add('d-none');
        //var form = $(this).closest('form');
        btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

        var data = { codigo: codigo };

        $.ajax({
            url: "/account/codigoPromocional",
            type: "POST",
            data: data,
            success: function (response) {
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                $("#codigoCuenta").val(codigo)
                //form.clearForm(); // clear form
                //form.validate().resetForm(); // reset validation states

                const jsonResponse = JSON.parse(response);


                if (jsonResponse.err) {
                    switch (jsonResponse.err) {
                        case 1:
                            document.querySelector('#alert-code').classList.remove('d-none');
                            document.getElementById("errMessageCode").innerHTML = `El c${decodeURI("%C3%B3")}digo ingresado no es valido`;
                            break;
                        case 2:
                            document.querySelector('#alert-code').classList.remove('d-none');
                            document.getElementById("errMessageCode").innerHTML = `Ya hay una cuenta asociada a este c${decodeURI("%C3%B3")}digo`;
                            break;
                    }
                    return;
                }
                else {
                    //SHOW MODAL
                    $('#modalCrearCuenta').modal('show');
                }
            }
        });
    });
});
*/

$(function () {
    $("#kt_email_submit").click(function () {


        var email = $("#emailCreaUusario").val();
        var btn = $(this);

        document.querySelector('#div-alert').classList.add('d-none');
        document.querySelector('#div-alert-succes').classList.add('d-none');
        //var form = $(this).closest('form');
        btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);


        let valida = validar_email(email);
        if (!valida) {
            document.querySelector('#alert-code').classList.remove('d-none');
            document.getElementById("errMessageCode").innerHTML = "Ingrese una direccion de email valida";
            return;
        } else {
            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            //SHOW MODAL
            $('#modalCrearCuenta').modal('show');
            $("#correoCuenta").val(email);
        }
    });
});