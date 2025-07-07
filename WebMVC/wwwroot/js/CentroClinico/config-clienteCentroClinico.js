import { EditInfoPerfilPacienteCentroClinico, PostNewPersonaConvenios, getPersonasConveniosByIdFull } from "../apis/personas-fetch.js";
import { getUserIdByUserNameAndRole, personByUser, findByUsername, validateUser } from '../apis/personas-fetch.js';
import { getConvenios } from '../apis/convenios-fetch.js'

var validaRut = true;
var rutValido = true;
var idPaciente;
export async function init(data) {
    let infoadmin = await personByUser(uid);
    let identificadorAdmin = infoadmin.identificador;

    let page = document.getElementById('page');
    page.innerHTML = "Configuración de cuenta";
    page.setAttribute('style', '');

    await configElementos();
    if (idEdit < 0)
        idPaciente = idEdit;
    else
        idPaciente = data.id;
   
    let conveniosPersona = [];
    let listConveniosPersona = await getPersonasConveniosByIdFull(idPaciente);
    listConveniosPersona.filter(el => el.idConvenio == window.IdConvenio).forEach(async item => {
       conveniosPersona.push(item.idConvenio);
    });

    $('select[name="convenio"]').val(conveniosPersona);
    $('select[name="convenio"]').trigger('change');

    $('#convenio').on('select2-removed',async function (e) {
        var id = e.val; //your id
        let result = await PostNewPersonaConvenios(idPaciente, id, uid)
        // Do something with your id
    });

    $('#convenio').on('select2-selecting',async function (e) {
        var id = e.val; //your id
        let result = await PostNewPersonaConvenios(idPaciente, id, uid)
      
    });
   
    if (data.rutaAvatar != null) {
        var ruta;
        if (!data.rutaAvatar.includes('Avatar.svg')) {
            ruta = baseUrl + data.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            ruta = baseUrlWeb + '/upload/foto_perfil/' + data.rutaAvatar;
        }
        document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";


        //var ruta = baseUrl + data.personasDatos.fotoPerfil.replace(/\\/g, '/');
        //document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
    }

    const identificador = document.getElementById("identificador");
    identificador.onblur = async () => {
        /*let valida = await validarRut(data.personas.identificador);
         if (!valida)
             Swal.fire("El rut ingresado ya se encuentra registrado");*/
        
        if (identificador.value != '' && idEdit < 0) {
            let usuario = await getUserIdByUserNameAndRole(identificador.value, 3);
            if (usuario != null) {
                // usuario.userId;
                Swal.fire({
                    text: "Ya existe un paciente con este RUT, ¿Desea editarlo?",
                    type: "warning",
                    confirmButtonText: "Sí",
                    cancelButtonText: "No",
                    showCancelButton: true
                }).then((result) => {
                    if (result.value) {
                        window.location.replace(`/AdminCentroClinico/EditPacienteCentroClinico?idPaciente=${usuario.userId}`);
                    }
                    else {
                        identificador.value = '';
                    }
                });
            }
        }
    }
   
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
            if (!rutValido) {
                Swal.fire("", "Ingrese un rut válido", "error")
                return;
            }
            /*let valida = await validarRut(data.identificador);
            if (!valida) {
                //Swal.fire("El rut ingresado ya se encuentra registrado");
                return;
            }*/
                

          $("#kt_modal_3").modal("show");
            document.querySelector('#btnConfirmar').onclick = async () => {
                 
                $('#btnConfirmar').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
                $('#btnCerrar').attr('disabled', 1);
                let validarUser = await validateUser(identificadorAdmin, document.querySelector('#password').value, 'AdministradorCentro')
                if (validarUser.userId != uid) {
                    $('#btnConfirmar').removeAttr('disabled').children('.spinner-border').remove();
                    $('#btnCerrar').removeAttr('disabled').children('.spinner-border').remove();
                    Swal.fire("", "Contraseña incorrecta", "error");
                    return;
                }
                else {
                    $('#btn_guardar_info').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
                    $('#btnConfirmar').attr('disabled', 1);
                    $('#btnCerrar').attr('disabled', 1);
                    var formData = new FormData(form);
                    formData.append('Id', data.id);
                    formData.append('Estado', data.estado);
                    //formData.append('IdUsuarioCreacion', data.idUsuarioCreacion);
                    formData.append('IdUsuarioModifica', uid);
                     
                    let result = await EditInfoPerfilPacienteCentroClinico(formData, idEdit, idCentroClinico);
                    $('#btn_guardar_info').removeAttr('disabled').children('.spinner-border').remove();
                    $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
                    $('#btnConfirmar').removeAttr('disabled').children('.spinner-border').remove();
                    $('#btnCerrar').removeAttr('disabled');
                    if (result.status === 'Actualizado') {
                        Swal.fire({
                            tittle: "Éxito!",
                            text: "Perfil Actualizado.",
                            type: "success",
                            confirmButtonText: "OK"
                        }).then(() => {
                            $("#kt_modal_3").modal("hide");
                        });
                    }
                    else if (result.status === 'Ingresado') {
                        Swal.fire({
                            tittle: "Éxito!",
                            text: "Perfil Ingresado.",
                            type: "success",
                            confirmButtonText: "OK"
                        }).then(() => {
                            $("#kt_modal_3").modal("hide");
                            window.location.replace(`/AdminCentroClinico/EditPacienteCentroClinico?idPaciente=${result.userId}`);
                        });
                    }
                    else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    }
                }
            };
         
        }
    });



}

async function configElementos() {
    let select = document.querySelector('select[name="convenio"]');
    select.required = true;
    const convenios = await getConvenios();
    let opcion = document.createElement('option');
    convenios.filter(el => el.id == window.IdConvenio).forEach(async param => {
        opcion = document.createElement('option');
        opcion.setAttribute('value', param.id);
        opcion.innerHTML = param.nombre;
        select.appendChild(opcion);
    });
}
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
async function validarRut(identificador) {
     
    const campoIdentificador = document.getElementById("identificador");
    if (campoIdentificador.value != identificador) {
        let usuario = await findByUsername(campoIdentificador.value);
        if(!usuario)
            campoIdentificador.value = "";
        return usuario;
    }
    else {
        return true;
    }
}
jQuery(document).ready(function () {
 
    $(".kt-avatar__upload").on('click', function (event) {

        $("#cargaFoto").toggle();
    });



    $("#FNacimiento").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
    });



});