import { getEmpresasPersonaSsu, getCargasXEmpresa, personByUser, findByUsername, getInfoCargasxEmpresa, getVerificaExistenciaPersona, changeStateBeneficiario, EditInfoPerfilCargas, getDatosPersonaUsername, verificarUsuarioCarga } from "../apis/personas-fetch.js?";



export async function initCarga(data, idEdit, idEditor, idCliente, editState) {

    var empresaPersona = await getEmpresasPersonaSsu(data.id, window.idCliente);

    await cargaEmpresas(empresaPersona);

    await abrirModalNewCarga();

    await verEditarCarga();

    if ($("#rut_addCarga").length) {
        const identificador = document.getElementById("rut_addCarga");
        identificador.onblur = async () => {
            var auxRut = identificador.value;
            auxRut = auxRut.replace(!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/, '');
            let rutFormato = await formato_rut(auxRut);
            if (data.codigoTelefono == 'CL') {
                    identificador.value = rutFormato;
            } else {
                rutFormato = identificador.value;
            } 

            let titular = await personByUser(idEditor);
            let rutTitular = titular.identificador;

            let documentoIdentidad = "RUT"

            if (window.codigoTelefono == "CO") {
                documentoIdentidad = "Cédula de ciudadanía"
            }
            else if (window.host.includes('wedoctorsmx.mx') || window.codigoTelefono == "MX") {
                documentoIdentidad = "CURP o RFC"
            }
    
            if (rutTitular == rutFormato || rutFormato == rutTitular.toUpperCase()) {
                Swal.fire({
                    tittle: "Información!",
                    text: documentoIdentidad + "ya esta registrado, por favor intente con otro.",
                    type: "info",
                    confirmButtonText: "OK"
                }).then(() => {

                });
                const campoIdentificador2 = document.getElementById("rut_addCarga");
                campoIdentificador2.value = "";
                return;

            } else {

                let userExist = await getVerificaExistenciaPersona(rutFormato)

                if (userExist) {

                    for (var i in userExist) {
                        var nombreCarga = userExist[i].nombre;
                        var apellidoPaterno = userExist[i].apellidoPaterno;
                        var apellidoMaterno = userExist[i].apellidoMaterno;
                        var rut = userExist[i].identificador;
                        var fechaNac = moment(userExist[i].fNacimiento).format("YYYY-MM-DD");
                        var telefono = userExist[i].telefono;
                        var correo = userExist[i].correo;
                        var genero = userExist[i].genero;
                        var direccion = userExist[i].direccion;

                        if (genero == 'M')
                            genero = 'Masculino';
                        else if (genero == 'F')
                            genero = 'Femenino';
                        else
                            genero = "";

                        document.forms["formNewCarga"]["nombre_addCarga"].value = nombreCarga;
                        document.forms["formNewCarga"]["apellidoPaterno_addCarga"].value = apellidoPaterno;
                        document.forms["formNewCarga"]["apellidoMaterno_addCarga"].value = apellidoMaterno;
                        document.forms["formNewCarga"]["rut_addCarga"].value = rut;
                        document.forms["formNewCarga"]["fecha_addCarga"].value = fechaNac;
                        document.forms["formNewCarga"]["telefono_addCarga"].value = telefono;
                        document.forms["formNewCarga"]["correo_addCarga"].value = correo;
                        document.forms["formNewCarga"]["genero_addCarga"].value = genero;
                        document.forms["formNewCarga"]["direccion_addCarga"].value = direccion;


                        //Swal.fire("Información existente", "Se encontro información del paciente.", "warning");
                    }
                }



            }
        }
    }
    $('#formNewCarga').validate({

        errorClass: 'text-danger',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
        },
        submitHandler: async function (form, e) {
            e.preventDefault();

            var idAction = $("#idAction_newCarga").val();
            await addCarga(idEditor, idEdit, idAction, empresaPersona, data.codigoTelefono);

            return false;

        }


    });


    $('body').on('click', '.btn_desactivaCarga', function () {
        let usuarioId = $(this).attr('attr-idUserCarga');
        let nameUsuario = $(this).attr('attr-name');
        let idCliente = $(this).attr('attr-idCliente');
        let idCarga = $(this).attr('attr-idCarga');
        let nameEmpresa = $(this).attr('attr-nameCliente'); 
        var fechaCreacion = $(this).attr('attr-fechacreacion'); 
        var UrlServicio = new URL(window.location.href);
        var idZurich = -1;

        //if (nameEmpresa == 'Zurich') {
        //    if (UrlServicio.hostname.includes("localhost")) {
        //        idZurich = 359;
        //    }
        //    else if (UrlServicio.hostname.includes("qa")) {
        //        idZurich = 359;
        //    }
        //    else {
        //        idZurich = 401
        //    }
        //}


        //Cliente Zurich QA = 359 y Prod = 401
        if (window.host.includes("zurich.")) {
            console.log("es Zurich, fecha creacion:", fechaCreacion)

            var fechaActual = new Date();
            var fechaProx = new Date(fechaCreacion); 
            fechaProx.setFullYear(fechaProx.getFullYear() + 1);
            if (fechaActual > fechaProx) {
                Swal.fire({
                    title: '¿Seguro que desea eliminar a ' + nameUsuario + ' de sus beneficiarios ?',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    html:
                        "<br>" +
                        '<button type="button" id="btn1" role="button" tabindex="0" data-idpersonacarga="' + idCarga + '" data-id="' + usuarioId + '" data-idCliente="' + idCliente + '" " data-nameEmpresa ="' + nameEmpresa + '" class="btn btn-warning">' + 'confirmar' + '</button>' +
                        '<button type="button" id="btn2" role="button" tabindex="0" class="btn btn-info ">' + 'cancelar' + '</button>',
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', '', 'success')
                    } else if (result.isCancel) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
            }
            else {
                Swal.fire({
                    title: 'No Puede eliminar a ' + nameUsuario + '.',
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    html:
                        "<br>" +
                        '<button type="button" id="btn2" role="button" tabindex="0" class="btn btn-info ">' + 'cancelar' + '</button>',
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', '', 'success')
                    } else if (result.isCancel) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
            }
        }
        else {
            Swal.fire({
                title: '¿Seguro que desea eliminar a ' + nameUsuario + ' de sus beneficiarios ?',
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: false,
                html:
                    "<br>" +
                    '<button type="button" id="btn1" role="button" tabindex="0" data-idpersonacarga="' + idCarga + '" data-id="' + usuarioId + '" data-idCliente="' + idCliente + '" " data-nameEmpresa ="' + nameEmpresa + '" class="btn btn-warning">' + 'confirmar' + '</button>' +
                    '<button type="button" id="btn2" role="button" tabindex="0" class="btn btn-info ">' + 'cancelar' + '</button>',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Saved!', '', 'success')
                } else if (result.isCancel) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            })
        }
            
    });


    $('body').on('click', '#btn1', async function () {
        console.log("ejectar boton eliminar")
        let usuarioId2 = $(this).attr("data-id");
        let clienteId2 = $(this).attr("data-idCliente");
        let idCarga = $(this).attr("data-idpersonacarga");
        let nameEmpresa = $(this).attr("data-nameEmpresa");

 
        let agregar = await changeStateBeneficiario(usuarioId2, idEditor, clienteId2);
        if (agregar.status === 'Actualizado') {

            swal.fire("Usuario eliminado de sus beneficiarios.", {
                icon: "warning",
            }).then(() => {
           
                $("#colInfo_" + clienteId2 + "_" + usuarioId2).remove();
                addElementCargaVacia(clienteId2, nameEmpresa);

            });

        }else {
            swal.fire("Error al agregar usuario", {
                icon: "error",
            });
        }
    });

    $('body').on('click', '#btn2', function () {

        swal.close();
        return false;
    });



    if (data.codigoTelefono == "CL") {
        $("#titulo_identidad").html("RUT");

    } else if (data.codigoTelefono == "MX") {
        $("#titulo_identidad").html("CURP");
        document.getElementById('rut_addCarga').placeholder = "QFFB..."

    } else {
        $("#titulo_identidad").html("DOCUMENTO DE IDENTIDAD");
        document.getElementById('rut_addCarga').placeholder = ""
       
    } 


}


async function addCarga(idEditor, idEdit, idAction, empresaPersona, codigoTelefono) {

    /*CAPTURA DE DATOS FORM*/
    var idPersonaCarga = 0;
    var rut = document.forms["formNewCarga"]["rut_addCarga"].value;
    var persona = await getDatosPersonaUsername(rut);
    if (persona != null)
        idEdit = persona.userId, idPersonaCarga = persona.id;
    else
        idEdit = 0;


    var nombre = document.forms["formNewCarga"]["nombre_addCarga"].value;
    var apellidoPaterno = document.forms["formNewCarga"]["apellidoPaterno_addCarga"].value;
    var apellidoMaterno = document.forms["formNewCarga"]["apellidoMaterno_addCarga"].value;
    var fecha = document.forms["formNewCarga"]["fecha_addCarga"].value;
    var telefono = document.forms["formNewCarga"]["telefono_addCarga"].value;
    var correo = document.forms["formNewCarga"]["correo_addCarga"].value;
    var genero = document.forms["formNewCarga"]["genero_addCarga"].value;
    var direccion = document.forms["formNewCarga"]["direccion_addCarga"].value;
    var idCliente = document.forms["formNewCarga"]["idCliente_newCarga"].value;
    var idUserCarga = document.forms["formNewCarga"]["idUserCarga_actual"].value;
    var nombrePaciente = nombre + " " + apellidoPaterno + " " + apellidoMaterno;
    if (genero == "Masculino")
        genero = "M";
    else
        genero = "F";


    /*Validaciones de correo y rut*/
    var mail = isEmail(correo);
    if (!mail) {
        Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
        return;
    }

    if (window.codigoTelefono == "CL") {
        if (!window.host.includes('comparaonline.')){
            let validaRut = VerificaRut(rut);
            if (!validaRut) {
                Swal.fire("Ingrese un rut válido");
                return;
            }
        }
    }
    else if (window.codigoTelefono == "CO") {
        let validaCiudadania = VerificaCedula(rut);
        if (!validaCiudadania) {
            Swal.fire("Ingrese Cédula de Ciudadanía válida");
            return;
        }
    }

    else if (window.host.includes('wedoctorsmx.mx') || window.codigoTelefono == "MX") {
        let validaCURP = VerificaCurp(rut);
        if (!validaCURP) {
            Swal.fire("Ingrese un CURP válido");
            return;
        }
    }

    $('.btn-guardar-cargas').html(
        '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
    );
    $('.btn-guardar-cargas').attr('disabled', true);

    var validaExistenciaCargaXEmpresa;
    validaExistenciaCargaXEmpresa = await getInfoCargasxEmpresa(rut, idCliente);
    if (validaExistenciaCargaXEmpresa != '' && idAction==0) {

        Swal.fire("Información", "El rut ingresado ya es beneficiario en el convenio actual", "info");
        limpiarModalNewCarga();
        $('.btn-guardar-cargas').html('');
        $('.btn-guardar-cargas').attr('disabled', false);
        return;

    } else {



        var formData = new FormData();
        // validar los id de los input para que sea unicos
        /*add variables form para guardar*/
        formData.append('Identificador', rut);
        formData.append('Nombre', nombre);
        formData.append('ApellidoPaterno', apellidoPaterno);
        formData.append('ApellidoMaterno', apellidoMaterno);
        formData.append('Correo', correo);
        formData.append('FNacimiento', fecha);
        formData.append('Genero', genero);
        formData.append('TelefonoMovil', telefono);
        formData.append('Telefono', telefono);
        formData.append('Direccion', direccion);
        formData.append('ZonaHoraria', "");
        formData.append('Prevision', "");
        formData.append('CodigoTelefono', window.codigoTelefono);
        if (idAction == 0)
            formData.append('Id', idEditor);
        else
            formData.append('Id', idEdit);


 
        

        let result;

        result = await EditInfoPerfilCargas(formData, idEdit, idEditor, idCliente, idAction);

        if (result.status === 'Actualizado') {
            $('.btn-guardar-cargas').html('Actualizar');
            $('.btn-guardar-cargas').attr('disabled', false);
            Swal.fire({
                tittle: "Éxito!",
                html: "Beneficiario actualizado correctamente",
                type: "success",
                confirmButtonText: "OK"
            }).then(() => {

                $("#cupo_" + idUserCarga).val(nombrePaciente);
            });

            

        } else if (result.status === 'Ingresado') {
            $('.btn-guardar-cargas').html('Guardar');
            $('.btn-guardar-cargas').attr('disabled', false);
            Swal.fire({
                tittle: "Éxito!",
                html: "Beneficiario agregado correctamente",
                type: "success",
                confirmButtonText: "OK"
            }).then(() => {
                document.querySelectorAll("#div-cargas").forEach(e => e.remove());
                cargaEmpresas(empresaPersona);
                limpiarModalNewCarga();
                $("#modalNewCarga").modal("hide");

            });

            
        }
        else {
            $('.btn-guardar-cargas').html('Guardar');
            $('.btn-guardar-cargas').attr('disabled', false);
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            

        }
    }



        
    

}


async function cargaEmpresas(empresaPersona) {
    empresaPersona.forEach(dibujaCargasXEmpresa);
}



async function dibujaCargasXEmpresa(empresaPersona) {

    let html = '';

    var veriUserCarga = await verificarUsuarioCarga(empresaPersona.userId, empresaPersona.idEmpresa);
    
    if (veriUserCarga == false) {

   
        html += '<input type="hidden" id="idClienteActual" value="" />';

        html += '<div id="div-cargas" class="kt-portlet mb-4 col-md-12" >';
        html += '<div class="kt-portlet__head">';

        html += '<div class="kt-portlet__head-label">';
        html += '<h3 class="kt-portlet__head-title" >' + empresaPersona.nombre + '</h3>';
        html += '</div>';
        html += '</div>';

        html += '<div class="kt-section kt-section--first pb-0 mb-0">';
        html += '<div class="kt-section__body">';
        html += '<div class="row pt-3">';
        html += '<div class="col-lg-12">';
        html += '<div class="kt-widget kt-widget--user-profile-1 mb-0 pb-0">';
        html += '<div class="form-group">';
        html += '<div class="col-12 col-md mb-4 mb-md-0 px-0" id="cont_' + empresaPersona.idEmpresa +'">';

        var cargasXEmpresa = await getCargasXEmpresa(empresaPersona.id, empresaPersona.idEmpresa);
        var cantidadCupos = empresaPersona.cantCargas;
        var contador = 0;
        var idCliente = empresaPersona.idEmpresa;
        
        if (cargasXEmpresa)
            for (var i in cargasXEmpresa) {
                var nombreCarga = cargasXEmpresa[i].nombre + ' ' + cargasXEmpresa[i].apellidoPaterno + ' ' + cargasXEmpresa[i].apellidoMaterno;
                var idPersonaCarga = cargasXEmpresa[i].idPersonaCarga;
                var identificador = cargasXEmpresa[i].identificador;
                var userIdPaciente = cargasXEmpresa[i].userId;
                var fechaCreacion = cargasXEmpresa[i].fechaCreacion;

                html += '<div id="colInfo_' + idCliente + '_' + userIdPaciente +'" class="input-group" >';
                html += '<input type="text" name="cupo_' + idPersonaCarga + '" id="cupo_' + idPersonaCarga + '" class="form-control" value="' + nombreCarga + '" disabled>';
                html += '<div class="input-group-append">';
                html += '<span style="" class="">';
                html += '<a class="btn btn-outline-primary btn-sm btn_newCarga btn_editar_cargaNew ml-auto" attr-idCarga="' + idPersonaCarga + '"  attr-idCliente="' + idCliente + '" attr-nameCliente="' + empresaPersona.nombre + '" attr-identificador="' + identificador + '" attr-idUserCarga="' + userIdPaciente + '" title="Editar"><i class="fa fa-edit center" aria-hidden="true"></i></a>';
                html += '<a class="btn btn-outline-danger btn-sm ml-auto btn_desactivaCarga" attr-idUserCarga="' + userIdPaciente + '" attr-idCarga="' + idPersonaCarga + '"   attr-idCliente="' + idCliente + '" attr-nameCliente="' + empresaPersona.nombre + '" attr-identificador="' + identificador + '" attr-name="' + nombreCarga + '" attr-fechacreacion="' + fechaCreacion + '" title="Eliminar"><i class="fal fa-trash" aria-hidden="true"></i></a>';
                html += '</span>';
                html += '</div>';
                html += '</div>';
                contador++;

            }


        if (cantidadCupos != contador) {
            var diferencia = cantidadCupos - contador;

            for (var i = 0; i < diferencia; i++) {
                var aleatorio = Math.random()+1;
                html += '<div id="colVacio_' + idCliente + '_' + aleatorio +'" class="input-group" >';
                html += '<input type="text" name="cupo_1_204" maxlength="15" minlength="5" class="form-control" placeholder="Cupo Sin Asignar" disabled>';
                html += '<div class="input-group-append">';
                html += '<span class="">';
                html += '<a id="btn_asignar_modal"  class="btn btn-outline-primary btn-sm btn_newCarga ml-auto" attr-random"' + aleatorio + '" attr-idCarga="" attr-idCliente="' + idCliente + '" attr-nameCliente="' + empresaPersona.nombre + '" title="Asignar"><i class="fa fa-user-plus" aria-hidden="true"></i></a>';
                html += '</span>';
                html += '</div>';
                html += '</div>';
            }
        }

        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '</div>';

        $("#cont-cargas").append(html);
        $("#msjErrorCarga").hide();


    }


    
};

function addElementCargaVacia(idCliente, nameEmpresa) {
    let html = '';
    html += '<div id="colVacio_" class="input-group" >';
    html += '<input type="text" name="cupo_1_204" maxlength="15" minlength="5" class="form-control" placeholder="Cupo Sin Asignar" disabled>';
    html += '<div class="input-group-append">';
    html += '<span class="">';
    html += '<a id="btn_asignar_modal"  class="btn btn-outline-primary btn-sm btn_newCarga ml-auto"  attr-idCarga="" attr-idCliente="' + idCliente + '" attr-nameCliente="' + nameEmpresa + '" title="Asignar"><i class="fa fa-user-plus" aria-hidden="true"></i></a>';
    html += '</span>';
    html += '</div>';
    html += '</div>';

    $("#cont_" + idCliente).append(html);
}



async function verEditarCarga() {

    $('body').on('click', '.btn_editar_cargaNew', async function (e) {

        e.preventDefault();
        var idCarga = $(this).attr('attr-idCarga');
        var idCliente = $(this).attr('attr-idCliente');
        var identificador = $(this).attr('attr-identificador'); 
        var infoCargas;
        $("#idAction_newCarga").val(2);
        infoCargas = await getInfoCargasxEmpresa(identificador, idCliente);

        if (infoCargas)
            for (var i in infoCargas) {
                var nombreCarga = infoCargas[i].nombre;
                var apellidoPaterno = infoCargas[i].apellidoPaterno;
                var apellidoMaterno = infoCargas[i].apellidoMaterno;
                var rut = infoCargas[i].identificador;
                var fechaNac = moment(infoCargas[i].fNacimiento).format("dd-MM-yyyy");
                var telefono = infoCargas[i].telefono;
                var correo = infoCargas[i].correo;
                var genero = infoCargas[i].genero;
                var direccion = infoCargas[i].direccion;

                if (genero == 'M')
                    genero = 'Masculino';
                else if (genero == 'F')
                    genero = 'Femenino';
                else
                    genero = "";

                

                document.forms["formNewCarga"]["nombre_addCarga"].value = nombreCarga;
                document.forms["formNewCarga"]["apellidoPaterno_addCarga"].value = apellidoPaterno;
                document.forms["formNewCarga"]["apellidoMaterno_addCarga"].value = apellidoMaterno;
                document.forms["formNewCarga"]["rut_addCarga"].value = rut;
                document.forms["formNewCarga"]["fecha_addCarga"].value =moment(infoCargas[i].fNacimiento).format("YYYY-MM-DD");
                document.forms["formNewCarga"]["telefono_addCarga"].value = telefono;
                document.forms["formNewCarga"]["correo_addCarga"].value = correo;
                document.forms["formNewCarga"]["genero_addCarga"].value = genero;
                document.forms["formNewCarga"]["direccion_addCarga"].value = direccion;

            }
        else
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
    });


    
    
}

async function abrirModalNewCarga(){

    $('body').on('click', '.btn_newCarga', function (e) {
        limpiarModalNewCarga();
        $("#modalNewCarga").modal("show");   

        var idCliente = $(this).attr('attr-idCliente');
        var idCarga = $(this).attr('attr-idCarga');
        var nombreEmpresaClick = $(this).attr('attr-nameCliente'); 
        var idUserCarga = $(this).attr('attr-idUserCarga'); 
        $("#idCliente_newCarga").val(idCliente);
        $("#idUserCarga_actual").val(idCarga);

        /*REMOVER CLASES ERROR*/
        $("#nombre_addCarga").parents('.form-line').removeClass('error');
        $("#apellidoPaterno_addCarga").parents('.form-line').removeClass('error');
        $("#apellidoMaterno_addCarga").parents('.form-line').removeClass('error');
        $("#rut_addCarga").parents('.form-line').removeClass('error');
        $("#fecha_addCarga").parents('.form-line').removeClass('error');
        $("#telefono_addCarga").parents('.form-line').removeClass('error');
        $("#correo_addCarga").parents('.form-line').removeClass('error');
        $("#genero_addCarga").parents('.form-line').removeClass('error');
        $("#direccion_addCarga").parents('.form-line').removeClass('error');

        if (idCarga == "") { 
            $("#titulo_modal_newcargas").html("INGRESAR BENEFICIARIO | <b>" + nombreEmpresaClick + "</b>");
            document.getElementById("rut_addCarga").disabled = false;
            $("#idAction_newCarga").val(0);
            $('.btn-guardar-cargas').html('Guardar');
        }
        else{
            $("#titulo_modal_newcargas").html("ACTUALIZAR AL BENEFICIARIO | <b>" + nombreEmpresaClick +"</b>");
            document.getElementById("rut_addCarga").disabled = true;
            $('.btn-guardar-cargas').html('Actualizar');
        }
    });

}




async function formato_rut(rut) {
    // Despejar Puntos
    var valor = rut.replace('.', '');
    // Despejar Guión
    var valor = valor.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    var cuerpo = valor.slice(0, -1);
    var dv = valor.slice(-1).toUpperCase();

    // Formatear RUN
    rut = cuerpo + '-' + dv;
    
    return rut;
}
async function validarRut(identificador) {

    const campoIdentificador = document.getElementById("rut");
    //var auxRut = campoIdentificador;
    //auxRut = auxRut.replace(/\./g, '');
    if (campoIdentificador != identificador) {
        let usuario = await findByUsername(campoIdentificador);
        
        //if (!usuario)
        //    campoIdentificador.value = "";
        return usuario;
    }
    else {
        return true;
    }
}


function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}



 function limpiarModalNewCarga() {

    $('#formNewCarga')[0].reset();
    $("#idAction_newCarga").val(0);
    $("#modalCarga").modal("hide");
    $('.btn-guardar-cargas').html('Guardar');
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

// Función que valida el formato de la cédula de ciudadanía de Colombia
function VerificaCedula(rut) {
    // Definir la expresión regular para validar la cédula
    const regex = /^[0-9]{6,10}$/;

    // retorna boolean
    return regex.test(rut);
}

function VerificaCurp(curp) {
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
