import { EditConvenio, getEspecialidadesByTipoProfesion, addConvenioEspecialidades, getTipoProfesionales, validarConvenio } from "../apis/convenios-fetch.js";
import {deleteAgendaHoraMedico} from "../apis/vwhorasmedicos-fetch.js"
export async function init(data) {
   
    var todayDate = moment().startOf("day");
    var TODAY = todayDate.format("YYYY-MM-DD");
    if (data.convenios.id == 0)
        document.getElementById("divSeleccionProfesional").style = "display:none";

    let page = document.getElementById('page');
    page.innerHTML = "Configuración de cuenta";
    page.setAttribute('style', '');
     
   if (data.convenios.fotoConvenio != null) {
        var ruta;
        //ruta = baseUrl + data.convenios.fotoConvenio.replace(/\\/g, '/');
       ruta = baseUrl + data.convenios.fotoConvenio;
        document.getElementById('divAvatar').style.backgroundImage = "url(" + ruta + ")";

    }
    let idConvenio = data.convenios.id;
 
    document.querySelector("#tipoProfesional").onchange = async () => {
        cargarEspecialidades(idConvenio);
    }
  
    document.getElementById("modalEspecialidad").onclick = async () => {
        let tipoProfesionales = await getTipoProfesionales();
        tipoProfesionales.forEach(tipoProfesional => {
            $("#tipoProfesional").append('<option value="' + tipoProfesional.id + '">' + tipoProfesional.nombre + '</option>');
        });

        cargarEspecialidades(idConvenio);
        $("#kt_modal_3").modal("show");
       
    }
    $('#form_edit_convenio').validate({
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

            $('#btn_guardar_convenio').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            var formData = new FormData(form);
            formData.append('Convenios.Id', data.convenios.id);
            formData.append('Convenios.Estado', data.convenios.estado);
            formData.append('convenios.idUsuarioModifica', uid);

            // Aca validacion convenio
            var fechaTermino = moment($("#convenios_FechaTermino").val(),'DD/MM/YYYY HH:mm:ss').format("DD-MM-YYYY");
            if (idConvenio != 0) {
                let resultAgenda = await validarConvenio(idConvenio, fechaTermino)
                if (resultAgenda.estado.substring(0, 2) === "ER") {

                    Swal.fire({
                        title: "Alto!",
                        //text: "Este convenio tiene atenciones asociadas, favor reasignar horas" + '\n',
                        html: "Este convenio tiene atenciones asociadas, favor reasignar horas" + '<br/>' + resultAgenda.glosa,
                        type: "warning",
                        confirmButtonText: "OK"
                    }).then(() => {

                    });
                    $('#btn_guardar_convenio').removeAttr('disabled').children('.spinner-border').remove();
                    return;
                }
                else if (resultAgenda.estado === "") {
                    Swal.fire({
                        tittle: "Cuidado!",
                        text: "Este convenio tiene Agendas asociadas, ¿Desea continuar?",
                        type: "warning",
                        confirmButtonText: "OK",
                        confirmCancelButton: "Cancelar",
                        showCancelButton: true
                    }).then((result) => {
                        if (result.value) {
                            guardarConvenio(formData, uid)
                            var deleteAgenda = deleteAgendaHoraMedico(idConvenio, fechaTermino)
                            
                        }
                        else {
                            $('#btn_guardar_convenio').removeAttr('disabled').children('.spinner-border').remove();
                            return;
                        }
                    });

                }
                else if (resultAgenda.estado === "SA") {
                    guardarConvenio(formData, uid)
                }
            }
            else {
                guardarConvenio(formData, uid);
            }
            



            //let result = await EditConvenio(formData, uid);
            //$('#btn_guardar_convenio').removeAttr('disabled').children('.spinner-border').remove();
            //if (result.status === 'Actualizado') {
                
            //    Swal.fire({
            //        tittle: "Éxito!",
            //        text: "Convenio actualizado.",
            //        type: "success",
            //        confirmButtonText: "OK"
            //    }).then(() => {
                   
            //    });
            //}
            //else if (result.status === 'Ingresado') {
            //    $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
            //    Swal.fire({
            //        tittle: "Éxito!",
            //        text: "Convenio Ingresado.",
            //        type: "success",
            //        confirmButtonText: "OK"
            //    }).then(() => {
            //      location.href = '/Admin/EditConvenio?idConvenio='+ result.id;

            //    });
            //}
            //else {
            //    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            //}
        }

    
        
    });



}
async function guardarConvenio(formData, uid) {
    let result = await EditConvenio(formData, uid);
    $('#btn_guardar_convenio').removeAttr('disabled').children('.spinner-border').remove();
    if (result.status === 'Actualizado') {

        Swal.fire({
            tittle: "Éxito!",
            text: "Convenio actualizado.",
            type: "success",
            confirmButtonText: "OK"
        }).then(() => {

        });
    }
    else if (result.status === 'Ingresado') {
        $('#btn_guardar_pw').removeAttr('disabled').children('.spinner-border').remove();
        Swal.fire({
            tittle: "Éxito!",
            text: "Convenio Ingresado.",
            type: "success",
            confirmButtonText: "OK"
        }).then(() => {
            location.href = '/Admin/EditConvenio?idConvenio=' + result.id;

        });
    }
    else {
        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
    }
}

async function cargarEspecialidades(idConvenio) {
    let divContenedor = document.getElementById('divContenedor');
    $("#divContenedor").empty();

    const tipo = document.querySelector("#tipoProfesional").value;
    
    let especialidades = await getEspecialidadesByTipoProfesion(tipo, idConvenio);
    //let reglaServicio = document.querySelector("#convenios_IdReglaServicio").value
     especialidades.forEach(especialidad => {

        let divEspecialidades = document.createElement('div');
        divEspecialidades.setAttribute("class","row col-lg-12 form-group ml-3")

        let divSpanName = document.createElement('div');
        divSpanName.setAttribute('class', 'col-lg-4');

        let spanName = document.createElement('span');
        spanName.innerHTML = especialidad.nombre;

        let divInputHoras = document.createElement('div');
        divInputHoras.setAttribute('class', 'col-lg-4');

        let inputHoras = document.createElement('input');
        inputHoras.setAttribute('class', 'form-control col-lg-12');
        inputHoras.value = especialidad.reglaServicioHorasBolsa;

        let btnActualizar = document.createElement('button');
        let iActualizar = document.createElement('i');
        iActualizar.setAttribute('class', 'far fa-save fa-2x');

        //let btnSeleccionar = document.createElement('button')
        //let iElement = document.createElement('i');
        btnActualizar.setAttribute("class", "btn btn-sm btn-icon btn-icon-md");
        //if (especialidad.idEspecialidad == 0) {
        //    btnSeleccionar.setAttribute("class", "btn btn-sm btn-icon btn-icon-md");
        //    iElement.setAttribute("class", "fas fa-toggle-off fa-2x");
        //    iElement.style = "color:red";
        //    iActualizar.setAttribute('disabled', 'disabled');
        //}

        //else {
        //    btnSeleccionar.setAttribute("class", "btn btn-sm btn-icon btn-icon-md");
        //    iElement.setAttribute("class", "fas fa-toggle-on fa-2x");
        //    iElement.style = "color:#44c678";
        //}
        
        divContenedor.appendChild(divEspecialidades);

        divSpanName.appendChild(spanName);
        divInputHoras.appendChild(inputHoras);
        divEspecialidades.appendChild(divSpanName);
        
        divEspecialidades.appendChild(divInputHoras);
        divEspecialidades.appendChild(btnActualizar);
       //divEspecialidades.appendChild(btnSeleccionar);
        
       // btnActualizar.appendChild(iActualizar);
        //btnSeleccionar.appendChild(iElement);
        
       //Numero de horas

        let bolsaHoras;
        $(inputHoras).inputmask({
            alias: 'numeric',
            allowMinus: false,
        });
       inputHoras.onchange = async (e) => {

             
           
            e.preventDefault();
            //if (inputHoras.value =="" && especialidad.idEspecialidad == 0) {
            //    Swal.fire("", "debes ingresar Número de horas", "warning");
            //    return;
            //}

            bolsaHoras = inputHoras.value;

            if (inputHoras.value == "")
                bolsaHoras = 0;


                let addEspecialidad = await addConvenioEspecialidades(especialidad.id, idConvenio, bolsaHoras);
            if (addEspecialidad.status == "OK" && addEspecialidad.accion == "Eliminado") {
                Swal.fire("", "Horas Eliminadas", "warning")
                //iElement.setAttribute("class", "fas fa-toggle-off fa-2x");
                //iElement.style = "color:red";
            }
            else if (addEspecialidad.status == "OK" && addEspecialidad.accion == "Ingresado") {
                Swal.fire("", "Horas ingresadas", "success");
                //iElement.setAttribute("class", "fas fa-toggle-on fa-2x");
                //iElement.style = "color:#44c678";
            }
            else if (addEspecialidad.status == "OK" && addEspecialidad.accion == "Actualizado") {
                inputHoras.value = addEspecialidad.reglaServicio;
                Swal.fire("", "Horas Actualizadas", "success");
            }
             
            

        } 

       
    });
}

jQuery(document).ready(function () {

    $(".kt-avatar__upload").on('click', function (event) {

        $("#cargaFoto").toggle();
    });



    $("#convenios_FechaInicio").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
    });
    $("#convenios_FechaTermino").inputmask("99/99/9999", {
        "placeholder": "dd/mm/yyyy",
    });
    $("#convenios_ValorReglaPago").inputmask({
        alias: 'numeric'
       
    });





});