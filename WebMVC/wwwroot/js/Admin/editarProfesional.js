import { EditFichaMedico } from "../apis/personas-fetch.js";
import { getParametro } from "../apis/parametro.js";
import { getArchivoUnico, deleteFile } from '../apis/archivo-fetch.js';
import { personByUser, findByUsername, getModalidadByIdFull, PostNewPersonaDatosModalidad, postCentroClinicobyMedico} from '../apis/personas-fetch.js';
import { validateUser } from '../apis/personas-fetch.js'
import { getCentroClinicoByUser, getCentroClinicoByMedico, getListaCentrosClinicos } from '../apis/empresacentroclinico-fetch.js'
import { getEspecialidadByTipoProfesional } from '../apis/agendar-fetch.js'
import { getProfesionalesAsociados, postProfesionalAsociadosByMedico, getProfesionalesAsociadosByIdMedico } from '../apis/profesionales-asociados-fetch.js'

var rutValido = true;
var idPersona;
var foto = false;
var userId;
export async function init(data) {

    let infoadmin = await personByUser(uid);
    let identificadorAdmin = infoadmin.identificador;
    var lblFoto = document.createElement('p');
    lblFoto.setAttribute('id', 'lblFoto');
    lblFoto.innerHTML = foto;
    lblFoto.setAttribute("class","d-none")
    document.getElementById('formFichaMedico').appendChild(lblFoto)
    let page = document.getElementById('page');
    page.innerHTML = "Configuración de cuenta";
    page.setAttribute('style', '')

    await configElementos();
    if (idEdit < 0) {
        idPersona = idEdit;
        userId = uid;
    }
    else {
        idPersona = data.personas.id;
        userId = idPersona;
    }

    let modalidadPago = [];
    let listModalidadPago = await getModalidadByIdFull(idPersona);
    listModalidadPago.forEach(async item => {
        modalidadPago.push(item.idModalidad);

    });

    //getCentroMedicos asociados al profesional por admin
    //getCentroMedicos asociados al profesional
    let centroClinicoList = []
    let centroClinico = [];
    if (idEdit < 0) centroClinicoList = [];
    else centroClinicoList = await getCentroClinicoByMedico(userId);
    
    centroClinicoList.forEach(async item => {
        centroClinico.push(item.idCentroClinico);

    });
    $('select[name="centrosClinicos"]').val(centroClinico);
    $('select[name="centrosClinicos"]').trigger('change');

    //obtener profesionales asociados por idMedico
    let profesionalesAsociados = [];
    
    let listProfesionalesAsociados = await getProfesionalesAsociadosByIdMedico(idEdit);
    listProfesionalesAsociados.forEach(async item => {
        profesionalesAsociados.push(item.idMedicoAsociado);

    });
    $('select[name="profesionalesAsociados"]').val(profesionalesAsociados);
    $('select[name="profesionalesAsociados"]').trigger('change');

    if (modalidadPago.includes(1)) {
        document.getElementById("cvp").removeAttribute("hidden");
    }
    $('select[name="modalidadPago"]').val(modalidadPago);
    $('select[name="modalidadPago"]').trigger('change');

    let CertificadoRegistroPDF = null;
    ;
    if (data.personas.rutaAvatar != null && data.personas.rutaAvatar != "") {

        foto = true;
        lblFoto.innerHTML = foto;
        var ruta;
        if (!data.personas.rutaAvatar.includes('Avatar.svg')) {
            ruta = baseUrl + data.personas.rutaAvatar.replace(/\\/g, '/');
        }
        else {
            ruta = baseUrlWeb + '/upload/foto_perfil/' + data.personas.rutaAvatar;
        }
        document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";

        
        //var ruta = baseUrl + data.personasDatos.fotoPerfil.replace(/\\/g, '/');
        //document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";
    }

    const tipoProfesional = document.querySelector("#personasDatos_IdTituloMedico");
    await validarTipoInvitado(tipoProfesional.value);

    tipoProfesional.onchange = async () => {
       let especialidades = await getEspecialidadByTipoProfesional(tipoProfesional.value);
        cargarEspecialidades(especialidades);
        await validarTipoInvitado(tipoProfesional.value);
    }

    $('#modalidadPago').on('select2-removed', async function (e) {
        var id = e.val;
        let result = await PostNewPersonaDatosModalidad(idPersona, id, uid)
        if (id == 1) {
            document.getElementById("cvp").setAttribute("hidden",true);
        }
    });

    $('#modalidadPago').on('select2-selecting', async function (e) {
        var id = e.val;
        let result = await PostNewPersonaDatosModalidad(idPersona, id, uid)
        if (id == 1) {
            document.getElementById("cvp").removeAttribute("hidden");
        }

    });

    $('#profesionalesAsociados').on('select2-removed', async function (e) {
        var id = e.val;
        let result = await postProfesionalAsociadosByMedico(idEdit, id);
    });

    $('#profesionalesAsociados').on('select2-selecting', async function (e) {
        var id = e.val;
        let result = await postProfesionalAsociadosByMedico(idEdit, id);
    });

    $('#centrosClinicos').on('select2-removed', async function (e) {
        
        var id = e.val;       
        let result = await postCentroClinicobyMedico(idEdit, id);
    });   
    $('#centrosClinicos').on('select2-selecting', async function (e) {
        var id = e.val;      
        let result = await postCentroClinicobyMedico(idEdit, id);
    });


    if (data.personasDatos.firmaMedico != null) {
        
        var ruta = baseUrl + data.personasDatos.firmaMedico.replace(/\\/g, '/');
        document.getElementById('divFirma').style.backgroundImage = "url(" + ruta + ")";
    }

    $('#urlRegistro').hide();
    if (data.personasDatos.certificadoRegistroPDF != null) {
        
        $('#urlRegistro').val(data.personasDatos.certificadoRegistroPDF);
        
        // data-id-file="@item.Id" data-nombre="@item.Nombre"

        var el = document.getElementById('eliminarCertificadoRegistro');
        el.setAttribute('data-id-file', data.personasDatos.idCertificadoRegistro);
        el.setAttribute('data-nombre', data.personasDatos.nombreCertificadoRegistro);

        $('#eliminarCertificadoRegistro').show();

    }
    const identificador = document.getElementById("personas_Identificador");
    
    identificador.onblur = async () => {
        let valida = await validarRut(data.personas.identificador);
        if (!valida)
            Swal.fire("El rut ingresado ya se encuentra registrado");
    }
    $('#formFichaMedico').validate({
        errorClass: 'text-danger',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.validate').append(error);
        },
        submitHandler: async function (form, e) {
            e.preventDefault();
            
            if (document.getElementById('lblFoto').innerHTML != "true") {
                Swal.fire("Ingrese una foto de perfil", "", "warning")
                return;
            }
            var mail = isEmail($("#personas_Correo").val());
            if (!mail) {
                Swal.fire("Ingrese un formato de correo válido", "ej: nombre@dominio.cl", "warning")
                return;
            }
                
            if (!rutValido) {
                Swal.fire("", "Ingrese un rut válido", "error")
                return;
            }
            let valida = await validarRut(data.personas.identificador);
            if (!valida) {
                //Swal.fire("El rut ingresado ya se encuentra registrado");
                return;
            }   

            // Obtén los valores de las fechas
            var fechaRegistroMedico = $("#personasDatos_FechaRegistroMedico").val();
            var fechaGraduacion = $("#personasDatos_FechaGraduacion").val();
            var fechaNacimiento = $("#personas_FNacimiento").val();


            // Valida las fechas
            if (!validarFecha(fechaRegistroMedico) || !validarFecha(fechaGraduacion) || !validarFecha(fechaNacimiento)) {
                Swal.fire("Por favor, introduce una fecha válida (año entre 1900 y el año actual)", "", "warning");
                return;
            }

            $("#kt_modal_4").modal("show");
            document.querySelector('#btnConfirmar').onclick = async () => {
                 
                let validarUser = await validateUser(identificadorAdmin, document.querySelector('#password').value, 'Administrador')
                if (validarUser.userId != uid) {
                    Swal.fire("", "Contraseña incorrecta", "error");
                    return;
                }
                else {
                    $('#btnGuardar').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
                    var formData = new FormData(form);
                    let result = await EditFichaMedico(formData, idEdit);
                    $('#btnGuardar').removeAttr('disabled').children('.spinner-border').remove();
                    if (result.status === 'OK' || result.status === 'Actualizado' || result.status === 'Ingresado') {
                        $('#btnGuardar').removeAttr('disabled').children('.spinner-border').remove();
                        Swal.fire({
                            tittle: "Éxito!",
                            text: "Perfil actualizado.",
                            type: "success",
                            confirmButtonText: "OK"
                        }).then(() => {
                            $("#kt_modal_4").modal("hide");
                        });
                    }
                    else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    }
                }
            }
        }
    });
    document.querySelector('#certificadoPDF').onclick = async () => {
         
        //@Html.Hidden("urlRegistro")
        //@Html.Hidden("urlCert")
        var url = $('#urlRegistro').val();
        if (url) {
            CertificadoRegistroPDF = baseUrl + url.replace(/\\/g, '/');
            $("#modalBody").empty();
            let embed = document.createElement('embed');
            embed.src = CertificadoRegistroPDF;
            embed.style.width = "100%";
            embed.style.height = "750px";
            document.getElementById('titleModal').innerHTML = 'Certificado de Registro'
            document.getElementById('modalBody').appendChild(embed);

            $("#kt_modal_3").modal("show");
        }
        else {
            $("#cargaCertificado").toggle();
        }
    }


   
}

async function validarTipoInvitado(idTipoProfesional) {
    if (idTipoProfesional == 15) {
        document.getElementById("divProfesionalesAsociados").setAttribute("hidden", true);
        document.querySelector('select[name="modalidadPago"]').required = false;
    }
    else {
        document.getElementById("divProfesionalesAsociados").removeAttribute("hidden");
    }
}

async function configElementos() {
    //modalidad de pago
    let select = document.querySelector('select[name="modalidadPago"]');
    if (document.querySelector("#personasDatos_IdTituloMedico").value != 15)
        select.required = true;
    else
        select.required = false;
    var grupo = "MODALIDAD";
    const modalidad = await getParametro('MODALIDAD');
    let opcion = document.createElement('option');
    modalidad.forEach(async param => {
        opcion = document.createElement('option');
        opcion.setAttribute('value', param.id);
        opcion.innerHTML = param.detalle;
        select.appendChild(opcion);
    });

    // profesionales invitados
    let selectAsociado = document.querySelector('select[name="profesionalesAsociados"]');
    selectAsociado.required = false;

    const profesionales = await getProfesionalesAsociados();
    let opcion2 = document.createElement('option');
    profesionales.forEach(async param => {
        opcion2 = document.createElement('option');
        opcion2.setAttribute('value', param.idMedicoAsociado);
        opcion2.innerHTML = param.nombreCompleto;
        selectAsociado.appendChild(opcion2);
    });

    //Centros clinicos
    let selectCentrosMedicos = document.querySelector('select[name="centrosClinicos"]');
    const centroClinico = await getListaCentrosClinicos();
    let opcion3 = document.createElement('option');
    centroClinico.forEach(async param => {
        
        opcion3 = document.createElement('option');
        opcion3.setAttribute('value', param.idCentroClinico);
        opcion3.innerHTML = param.nombre;
        selectCentrosMedicos.appendChild(opcion3);
    });


}

function cargarEspecialidades(especialidades) {
     
    $("#personasDatos_IdEspecialidad").empty();
    $("#personasDatos_IdEspecialidad").append('<option value="0">Seleccione especialidad</option>');
    especialidades.forEach(especialidad => {
        $("#personasDatos_IdEspecialidad").append('<option value="' + especialidad.id + '">' + especialidad.nombre + '</option>');
    });
}
async function validarRut(identificador) {
     
    const campoIdentificador = document.getElementById("personas_Identificador");
    if (campoIdentificador.value != identificador) {
        let usuario = await findByUsername(campoIdentificador.value);
        if (!usuario)
            campoIdentificador.value = "";
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

function validarFecha(value) {
    var dateParts = value.split("/");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    var minYear = 1900;
    var maxYear = new Date().getFullYear();

    if (dateObject.getFullYear() < minYear || dateObject.getFullYear() > maxYear) {
        return false;
    }
    return true;
}
jQuery(document).ready(function () {


    
    $("input#personas_Identificador").rut({ useThousandsSeparator: false }).on('rutInvalido', function (e) {
        //swal.fire({
        //    position: 'top-right',
        //    type: 'error',
        //    title: "El rut " + $(this).val() + " es inválido",
        //    showConfirmButton: false,
        //    timer: 1500
        //});
        
        rutValido = true;
        //$(this).val("");
        //$(this).focus();
    }).on('rutValido', function () {
        //document.getElementById("btnGuardar").disabled = false;
        rutValido = true;;
    });

    $(".editAvatar").on('click', function (event) {
        $("#cargaFoto").toggle();
    });

    $(".editFirmaMedico").on('click', function (event) {
        $("#cargaFirma").toggle();
    });
    $("#personas_FNacimiento").inputmask("99/99/9999", {
        "placeholder": "dd/mm/aaaa",
    });

    $("#personasDatos_FechaRegistroMedico").inputmask("99/99/9999", {
        "placeholder": "dd/mm/aaaa",
    });

    $("#personasDatos_FechaGraduacion").inputmask("99/99/9999", {
        "placeholder": "dd/mm/aaaa",
    });
    //$("#personas_Telefono").inputmask("mask", {
    //    "mask": "(+56) 99 999 9999"
    //});


    //$("#personas_Correo").inputmask({
    //    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    //    greedy: false,
    //    onBeforePaste: function (pastedValue, opts) {
    //        pastedValue = pastedValue.toLowerCase();
    //        return pastedValue.replace("mailto:", "");
    //    },
    //    definitions: {
    //        '*': {
    //            validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
    //            cardinality: 1,
    //            casing: "lower"
    //        }
    //    }
    //});
});