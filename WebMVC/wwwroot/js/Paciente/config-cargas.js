import { EditInfoPerfilCargas, getPersonasConveniosByIdFull, findByUsername, agregarByRut, personByUser, getDatosPersonaUsername} from "../apis/personas-fetch.js?1";
import { personaFotoPerfil } from "../shared/info-user.js";
var isContactEmergency = window.isContacto && window.isContacto.length >0? true: false;
var textoBeneficiario = window.Titulo
export async function init(data, idEdit, idEditor, idCliente, editState) {
    await personaFotoPerfil();
    if (data.rutaAvatar != null) {
        var ruta;
        if (!data.rutaAvatar.includes('Avatar.svg')) {
            ruta = baseUrl + data.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            ruta = baseUrlWeb + '/upload/foto_perfil/' + data.rutaAvatar;
        }
        document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
    }
    
    if (idEdit < 0) {
        
    } else {
        
    }


    //////////////////// botones agregar usuarios existentes
   
    var idPersonaCarga = 0;
    const identificador = document.getElementById("Identificador");
    identificador.onblur = async () => {
        var auxRut = identificador.value;
        //auxRut = auxRut.replace(/\./g, '');
        //auxRut = auxRut.replace(/[^0-9]/g, '');
        auxRut = auxRut.replace(!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/, '');
        
        let rutFormato = await formato_rut(auxRut);
        if (!identificador.value.includes('-')) {
            identificador.value = rutFormato;
        }
        let titular = await personByUser(idEditor);
        let rutTitular = titular.identificador;
        
        if (rutTitular == rutFormato || rutFormato == rutTitular.toUpperCase()) {
            Swal.fire({
                tittle: "Información!",
                text: "Rut ya esta registrado, por favor intente con otro.",
                type: "info",
                confirmButtonText: "OK"
            }).then(() => {

            });
            const campoIdentificador2 = document.getElementById("Identificador");
            campoIdentificador2.value = "";
            return;
        } 
       
        let valida = await validarRut(data.identificador);
        
        var rut = document.getElementById("Identificador").value;
        if (!valida && idCliente != 108) {
            var persona = await getDatosPersonaUsername(rut);
            if (persona != null && idCliente != 108) {
                idEdit = persona.userId;
                idPersonaCarga = persona.id;
                data.estado = persona.estado ? persona.estado : "V";
                document.getElementById('Nombre').value = persona.nombre;
                document.getElementById('Correo').value = persona.correo;
                document.getElementById('ApellidoPaterno').value = persona.apellidoPaterno;
                document.getElementById('ApellidoMaterno').value = persona.apellidoMaterno;
                document.getElementById('FNacimiento').value = moment(persona.fNacimiento).format("DDMMYYYY");
                document.getElementById('Genero').value = persona.genero;
                document.getElementById('TelefonoMovil').value = persona.telefonoMovil;
                document.getElementById('Telefono').value = persona.telefono;
                document.getElementById('Direccion').value = persona.direccion ? persona.direccion : "";
            }

        }
        //    Swal.fire({
        //        title: 'Rut ya se encuentra registrado',
        //        showDenyButton: false,
        //        showCancelButton: false,
        //        showConfirmButton: false,
        //        html: "¿Desea agregar este usuario a sus beneficiarios?" +
        //            "<br><br><br>" +
        //            '<button type="button" id="btn1" role="button" tabindex="0" class="btn btn-success">' + 'agregar' + '</button> <br>' +
        //            '<button type="button" id="btn2" role="button" tabindex="0" class="btn btn-danger ">' + 'cancelar' + '</button>',
        //    }).then((result) => {
        //        /* Read more about isConfirmed, isDenied below */
        //        if (result.isConfirmed) {
        //            Swal.fire('Saved!', '', 'success')
        //        } else if (result.isCancel) {
        //            Swal.fire('Changes are not saved', '', 'info')
        //        }
        //    })
        //const btn1 = document.getElementById("btn1");
        //btn1.onclick = async () => {
        //    let agregar = await agregarByRut(rutFormato, idEditor, idCliente);
        //    if (agregar.status === 'Actualizado') {
        //        swal.fire("Usuario agregado a sus beneficiarios", {
        //            icon: "success",
        //        });
        //    } else if (agregar.status === 'EXISTE')
        //    {
        //        swal.fire("Usuario ya es su beneficiario", {
        //            icon: "info",
        //        });
        //    }
        //    else {
        //        swal.fire("Error al agregar usuario", {
        //            icon: "error",
        //        });
        //    }
            
        //};
        //const btn2 = document.getElementById("btn2");
        //btn2.onclick = async () => {
        //    swal.close();
        //    return false;
        //};
    }

    



    let page = document.getElementById('page');
    page.innerHTML = "Configuración de cuenta";
    page.setAttribute('style', '')

    $('#form_edit_perfil').validate({
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
            e.preventDefault();
            var mail = isEmail($("#Correo").val());
            if (!mail) {
                Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
                return;
            }
            var rut = $("#Identificador").val();
            if (data.codigoTelefono == "CL") {
                let validaRut = VerificaRut(rut);
                if (!validaRut) {
                    Swal.fire("Ingrese un rut válido");
                    return;
                }
            }
            $('#btn_guardar_info').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            var formData = new FormData(form);
            
            formData.append('Id', idPersonaCarga);
            formData.append('Estado', data.estado);
            let result = await EditInfoPerfilCargas(formData, idEdit, idEditor, idCliente, editState, isContactEmergency);
            $('#btn_guardar_info').removeAttr('disabled').children('.spinner-border').remove();
            if (result.status === 'Actualizado') {
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Perfil actualizado.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    if (isContactEmergency)
                        location.href = "/Paciente/ListaContactos";
                    else
                        location.href = "/Paciente/ListaCargas";

                });
            } else if  (result.status === 'Ingresado'){
                $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    html: "¡"+capitalize(textoBeneficiario) +" agregado!",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    if (isContactEmergency)
                        location.href = "/Paciente/ListaContactos";
                    else
                        location.href = "/Paciente/ListaCargas";
                });
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }

        }
    });   


}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}



async function validarRut(identificador) {

    const campoIdentificador = document.getElementById("Identificador");
    var auxRut = campoIdentificador.value;
    auxRut = auxRut.replace(/\./g, '');
    if (campoIdentificador.value != identificador) {
        let usuario = await findByUsername(campoIdentificador.value);
        //if (!usuario)
        //    campoIdentificador.value = "";
        return usuario;
    }
    else {
        return true;
    }
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

/*async function formato_rut(rut) {
    
    var sRut1 = rut;      //contador de para saber cuando insertar el . o la -
    var nPos = 0; //Guarda el rut invertido con los puntos y el guión agregado
    var sInvertido = ""; //Guarda el resultado final del rut como debe ser
    var sRut = "";
    for (var i = sRut1.length - 1; i >= 0; i--)
    {
        sInvertido += sRut1.charAt(i);
        if (i == sRut1.length - 1)
            sInvertido += "-";
        else if (nPos == 3) {
            sInvertido ;
            nPos = 0;
        }
        nPos++;
    }
    for (var j = sInvertido.length - 1; j >= 0; j-- )
    {
        if (sInvertido.charAt(sInvertido.length - 1) != ".")
            sRut += sInvertido.charAt(j);
        else if (j != sInvertido.length - 1)
            sRut += sInvertido.charAt(j);
    }
    //Pasamos al campo el valor formateado
    rut = sRut.toUpperCase();
    return rut;
}*/


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

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

jQuery(document).ready(function () {

    $(".kt-avatar__upload").on('click', function (event) {

        $("#cargaFoto").toggle();
    });



    $("#FNacimiento").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
    });



});