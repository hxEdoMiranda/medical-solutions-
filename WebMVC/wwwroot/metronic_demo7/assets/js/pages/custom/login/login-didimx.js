import { sendCorreoBienvenida } from "../../../../../../js/apis/correos-fetch.js";




$(async function  () {
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
            console.log('Ingrese un CURP!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un CURP!"
            return
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
            console.log('entro ')
            return;
        }


        var data = { nombre: nombre, apellido: apellido, rut: rut, correo: correo };
        var formEnvio = {
            Nombre: nombre,
            ApellidoPaterno: apellido,
            ApellidoMaterno: '',
            Identificador: rut,
            Correo:correo,
            idCliente: 363
        };

        $.ajax({
            url: "/account/CreateUserDidi",  //CreateUserPrueba para dejarlos gratis
            type: "POST",
            data: data,
            success: async function (response) {
                const jsonResponse = response;
                if (jsonResponse.success) {
                    //await sendCorreoBienvenida(formEnvio);
                    Swal.fire({
                        title: "Usuario fue creado con éxito!",
                        text: "Ahora ingresa con tu CURP y contraseña conformada por los 6 primeros dígitos del CURP!",
                        type: "success",
                        confirmButtonText: "OK",
                    }).then(() => {
                        console.log("exito");
                        //SHOW MODAL
                        $('#modalCrearCuenta').modal('hide');
                    });
                } else {
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
                }
            }
        });
    });
});


function validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
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