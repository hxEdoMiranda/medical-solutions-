
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
            console.log('Ingrese un CURP!')
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un CURP!"
            return
        }
        var validaCurp = validarInput(rut);
        if (!validaCurp || rut.length < 18) {
            document.querySelector('#div-alert').classList.remove('d-none');
            document.getElementById("errMessage").innerHTML = "Ingrese un CURP válido";
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
                        text: "Ahora ingresa con tu CURP y contraseña conformada por los 6 primeros dígitos del CURP!",
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



function validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

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
//Función para validar una CURP
function curpValida(curp) {
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = curp.match(re);

    if (!validado)  //Coincide con el formato general?
        return false;
    //Validar que coincida el dígito verificador
  
    if (validado[2] != digitoVerificador(validado[1]))
        return false;

    return true; //Validado
}


//Handler para el evento cuando cambia el input
//Lleva la CURP a mayúsculas para validarlo
function validarInput(input) {
    var curp = input.toUpperCase();

    if (curpValida(curp)) { // ⬅️ Acá se comprueba
        return true;
    } else {
        return false;
    }

}



$('#modalCrearCuenta').on('hidden.bs.modal', function () {
    $('#div-alert').toggleClass("d-none");
    $("#nombreCuenta").val("");
    $("#apellidoCuenta").val("");
    $("#rutCuenta").val("");
    $("#correoCuenta").val("");
    $("#codigoCuenta").val("");
})


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
                            document.getElementById("errMessageCode").innerHTML = `El c${decodeURI("%C3%B3")}digo ingresado no es válido`;
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