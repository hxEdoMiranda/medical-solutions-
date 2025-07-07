
import { EditInfoPerfilInvitado, findUsernameEmpresa, personByUser, compareOldPassword, saveOldPassword, getUserByUserName, cambioIdCliente } from "../apis/personas-fetch.js";
import { putAgendarMedicosHoras, putEliminarAtencion } from '../apis/agendar-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js";
import { enviarCitaEniax } from "../apis/eniax-fetch.js?rnd=1"
import { sendCorreoBienvenida } from "../apis/correos-fetch.js";

import { PostPagoInvitado, valorizar, EmitirbonoParticular, emitirPrebono } from "../apis/medipass-fetch.js";

 

var connection;
var connectionAgendar;
var camposCompletados = false;
var archivoCovid = false;
var codPaisPaciente = "";
export async function init(data) {

    let datosMedico = await personByUser(idMedico);
    
    document.getElementById("nombre-profesional").innerHTML = datosMedico.nombre;
    document.getElementById("apellidos-profesional").innerHTML = datosMedico.apellidoPaterno +' '+ datosMedico.apellidoMaterno;   
    var imgProf = document.getElementById("fotoProfesional");
    imgProf.src = datosMedico.rutaAvatar;
    imgProf.src = baseUrl  + datosMedico.rutaAvatar;
    document.getElementById("fecha-reserva").innerHTML = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a').format("DD-MM-YYYY");
    document.getElementById("hora-reserva").innerHTML = horaText;

    await personaFotoPerfil();

    let page = document.getElementById('page');

    // Input Info
    let inputInfo = document.getElementById('input-info');
    let tipDoc = document.getElementById('tipDoc');
    let btnClose = document.getElementById('btnClose');

    // Mostrar Tip
    inputInfo.addEventListener('click', () => {
        event.preventDefault()
        tipDoc.classList.add('show-tip');
    });

    // Cerrar Tip
    btnClose.addEventListener('click', () => {
        event.preventDefault()
        tipDoc.classList.remove('show-tip');
    })
    page.innerHTML = "Agendar atención"; 
    if (idCliente == 108) {
        if (window.tipoatencion == "I") {
            page.innerHTML = "Atención Inmediata";
            swal.fire({
                html: `
              <strong style="font-size: 18px !important;font-weight: 800;">¿Tu consulta es por COVID-19?</strong><br><br><br>
              <p class="text-left">En caso de tener <strong style="font-size: 15px !important;font-weight: 800;">un PCR Positivo,</strong> debes adjuntar tu examen.</p>
              <p class="text-left">En caso de <strong style="font-size: 15px !important;font-weight: 800;"> tener un test de antígeno positivo,</strong> deberás adjuntar una foto del examen y una foto del envase.</p>
              <p class="text-left">Es <strong style="font-size: 15px !important;font-weight: 800;">requisito</strong> que en tu hora médica adjuntes esta documentación</p>
             `,
                confirmButtonText: 'SI',
                cancelButtonText: 'NO',
                showCancelButton: true,
                allowOutsideClick: false,
                type: 'question'
            }).then(async function (result) {
                if (result.value) {
                    archivoCovid = true;
                    document.getElementById('ejemImg').classList.remove('d-none')
                }
            });
        }
    }
    else {
        if (window.tipoatencion == "I") {
            page.innerHTML = "Atención Inmediata";
            swal.fire({
                html: `
              <strong style="font-size: 18px !important;font-weight: 800;">¡Hola! ¿Tu consulta es por COVID—19?.</strong><br><br><br>
              <p class="text-left">En caso de tener <strong style="font-size: 15px !important;font-weight: 800;">PCR Positivo,</strong> debes adjuntar tu examen.</p>
              <p class="text-left">En caso de <strong style="font-size: 15px !important;font-weight: 800;">Antígeno,</strong> deberás adjuntar una imagen con el test positivo y su envase.</p>
              <p class="text-left">Ambos son <strong style="font-size: 15px !important;font-weight: 800;">requisitos</strong> para poder atenderte. <img src="/img/emojiDemora.png" style="width: 20px;"> <img src="/img/emojiDemora.png" style="width: 20px;"></p>
             `,
                confirmButtonText: 'SI',
                cancelButtonText: 'NO',
                showCancelButton: true,
                allowOutsideClick: false,
                type: 'question'
            }).then(async function (result) {
                if (result.value) {
                    archivoCovid = true;
                    document.getElementById('ejemImg').classList.remove('d-none')
                }
            });
        }
    }
       
    await agendarRealTime();
    if ($("#fechaTextInfo").length) {
        document.getElementById("fechaTextInfo").innerHTML = window.fechaText;
        document.getElementById("bloqueHoraText").innerHTML = horaText;
    }
    var buttonConfirmar = document.getElementById("btnConfirmar");
    buttonConfirmar.innerHTML = "Aceptar y registrarse";

        
	if (idCliente === 148) {
			 m = "2";
			 }
        var url;
        var estadoAtencion;   
        let result;
        let formData= {};

    //if (m === "2") {

    //    if ((r === "1" || r === "2")) {
    //        valorAtencion = data.personasDatos.valorAtencion;
    //    } else {
    //        var valorizacion = await valorizar(data.personasDatos.especialidad,
    //            rutUsuario,
    //            data.personas.identificador,
    //            data.personasDatos.codigoPrestacion,
    //            document.getElementById('genero').value,
    //            document.getElementById('fechaNacimiento').value,
    //            data.personasDatos.valorAtencion,
    //            data.personasDatos.idSucursal.toString(),
    //            data.personasDatos.idLugarAtencion.toString(),
    //            idAtencion, true);

    //        if (valorizacion) {
    //            if (!valorizacion.particular) {
    //                valorAtencion = valorizacion.copago;
    //            } else {
    //                valorAtencion = valorizacion.valorConvenio;
    //            }
    //        }

    //    }

    //}
    //if (valorAtencion == 0) {
    //    document.getElementById("btnConfirmar").innerHTML = "Confirmar";
    //}



   /* document.getElementById("valorAtencion").innerHTML = formatNumber(valorAtencion).toLocaleString();*/
    buttonConfirmar.addEventListener("click", async function (event) {
        event.preventDefault();        
        $('#btnConfirmar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
       // 2534449  -- Produccion    2143659 QA

        if (data.personas.id == 2534449) {   
            $('#modalCreacionPaciente').modal('toggle');            
             $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
         }
    });

    const identificador = document.getElementById("Identificador");
    identificador.onblur = async () => {


            if ($.validateRut(identificador)) {

                Swal.fire("Error!", "El rut " + rut + " es inválido.", "error");
                
            } else {
                let valida = await validarRutConvenio(identificador);
                if (valida.length > 0) {

                    Swal.fire({
                        title: 'El rut ingresado ya se encuentra registrado',
                        text: 'Para continuar debe loguearse',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: "OK"
                    }).then(resultado => {
                        if (resultado.value) {                          
                            $('#loginPost1').removeAttr("style");
                            $('#form_crea_user').addClass('d-none');   
                            $('#exampleModalLabel').addClass('d-none');   
                            $('#idicono').addClass('d-none');                           
                            
                        }
                        else  {
                            $('#modalCreacionPaciente').modal('toggle');
                            limpiar();
                        }
                    });


                }  
            }
                      
        }
// INICIO LOGIN USUARIO EXISTENTE
        async function doAjax(formData) {
            const result = await $.ajax({
                type: "POST",
                url: '/account/guestLogin',
                data: formData,
            });

            return result;
        }
       

        document.querySelector("#kt_login_signin_submit").onclick = async () => {
            $('#kt_login_signin_submit').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');

         
            formData = {
                userName: document.querySelector('[name="Username"]').value,
                password: document.querySelector('[name="Password"]').value,
                rol: document.querySelector('[name="rol"]').value,
                JsonData: document.querySelector('[name="JsonData"]').value,
            };
            var respuesta = await doAjax(formData)
          
            if (!respuesta == ' ') {
                
                if (respuesta.status === 'Encontrado') {
                 
                    var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a').format("YYYY-MM-DD HH:mm:ss");
               
                    if (m === "2") {
                        url = "/PacienteInvitado/Agenda_Invitado_4" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila + "&newUid=" + respuesta.user;
                        estadoAtencion = "P";
                    }
                    else {
                        url = "/Paciente/ConfirmarAtencion" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila;;
                        if (window.tipoatencion === "I")
                            url = `/Ingresar_Sala_FU/${idAtencion}`;
                        estadoAtencion = "I";
                    }
                    let agendar = {};
                    agendar = {
                        id: idAtencion,
                        idBloqueHora: idBloqueHora,
                        fechaText: fechaSeleccion,
                        triageObservacion: document.querySelector('[name="triageObservacion"]').value,
                        antecedentesMedicos: document.querySelector('[name="antecedentesMedicos"]').value,
                        idPaciente: respuesta.user,//uid,-- User Nuevo
                        SospechaCovid19: false,
                        IdMedicoHora: idMedicoHora,
                        Estado: estadoAtencion,
                    }

                    let valida = await putAgendarMedicosHoras(agendar, idMedico, uid);

                    if (valida.status === "NOK") {
                        if (valida.err == 3) {

                            swal.fire({
                                title: valida.msg,
                                text: "¿Desea agendar nuevamente?",
                                type: 'error',
                                showCancelButton: true,
                                reverseButtons: true,
                                cancelButtonText: 'No, volver a Atenciones',
                                confirmButtonText: 'Sí, ir a Agendar'
                            }).then(async function (result) {
                                if (result.value) {
                                    window.location.href = "Agendar"
                                }
                                else {
                                    window.location.href = "Index";
                                }
                            });
                            $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                        }
                        else {
                            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                            $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                        }
                    }
                    else {
                        if (connection.state === signalR.HubConnectionState.Connected) {
                            connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {

                                connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "actualizar").then(r => {
                                    connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                                }).catch(err => console.error(err));
                            }).catch((err) => {
                                return console.error(err.toString());
                            });
                        }

                        connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {

                            return console.error(err.toString());
                        });

                        if (estadoAtencion === "I" && !valida.infoAtencion.atencionDirecta && data.personas.codigoTelefono != "CO") {
                            await enviarCitaEniax(valida.infoAtencion.idAtencion)
                        }

                        $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                        var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a').format("YYYY-MM-DD HH:mm:ss");


                        //redireccionamiento atencion directa
                        if (valida.infoAtencion.atencionDirecta && m == "1") {
                            Swal.fire({
                                title: 'Atención confirmada',
                                html: 'Serás redireccionado de forma automática a la sala de espera.',
                                timer: 7000,
                                // backdrop: false,
                                allowOutsideClick: false,
                                type: "success",
                                showConfirmButton: false,
                                timerProgressBar: true,

                            })
                            window.location = `/Ingresar_Sala_FU/${valida.infoAtencion.idAtencion}`;
                        }
                        window.location.href = url;
                    }

                }
                else {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                }
                $('#kt_login_signin_submit').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
               

            }
        }
    document.querySelector("#kt_login_forgot_cancel").onclick = async () => {
        $('.modal-backdrop').remove();
        $('#kt_login_signin_submit').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

        $('#loginPost').addClass('d-none');       ;
        $('#idicono').addClass('d-none');
        $('#form_crea_user').removeClass('d-none');
        $('#exampleModalLabel').removeClass('d-none');
        limpiar();
        
    }
    document.querySelector("#kt_login_forgot").onclick = async () => {

        /*$('#loginPost1').css('display', 'none !important');*/ 
        $('#pageReset').removeClass('d-none');        
        $('#loginPost').addClass('d-none');      
        $('#idicono').addClass('d-none');
        limpiar();
    }
     

// FIN LOGIN USUARIO EXISTENTE
//--------------------------------------------------------------//

// INICIO VALIDACION CREACION CUENTA USUARIO NUEVO
//------------------------------------------------------------//


    $('#form_crea_user').validate({
        errorClass: 'text-danger',
        error:'has-error',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('has-error', 'text-danger');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('has-error', 'text-danger');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        },
        submitHandler: async function (form, e) {
            e.preventDefault();

                formData = {
                    Nombre: document.querySelector('[name="Nombre"]').value,
                    ApellidoPaterno: document.querySelector('[name="ApellidoPaterno"]').value,
                    ApellidoMaterno: document.querySelector('[name="ApellidoMaterno"]').value,
                    Identificador: document.querySelector('[name="Identificador"]').value,
                    Correo: document.querySelector('[name="Correo"]').value,
                    idCliente: idCliente
                };

             result = await EditInfoPerfilInvitado(formData, uid);     
           
            $('#btnCrear').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);

            

            // AGREGAR VALIDACION DE CREACION CUENTA USUARIO NUEVO
            if (!result == ' ') {
                await sendCorreoBienvenida(formData);
                if (result.status === 'Ingresado') {
                    var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a').format("YYYY-MM-DD HH:mm:ss");
                    if (m === "2") {
                        url = "/PacienteInvitado/Agenda_Invitado_4" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila + "&newUid=" + result.user;
                        estadoAtencion = "P";
                    }
                    else {
                        url = "/Paciente/ConfirmarAtencion" + "?idMedicoHora=" + idMedicoHora + "&idMedico=" + idMedico + "&idBloqueHora=" + idBloqueHora + "&fechaSeleccion=" + fecha + "&hora=" + horaText + "&horario=" + horario + "&idAtencion=" + idAtencion + "&m=" + m + "&r=" + r + "&c=" + c + "&tipoatencion=" + window.tipoatencion + "&especialidad=" + especialidadFila;;
                        if (window.tipoatencion === "I")
                            url = `/Ingresar_Sala_FU/${idAtencion}`;
                        estadoAtencion = "I";
                    }
                    let agendar = {};
                    agendar = {
                        id: idAtencion,
                        idBloqueHora: idBloqueHora,
                        fechaText: fechaSeleccion,
                        triageObservacion: document.querySelector('[name="triageObservacion"]').value,
                        antecedentesMedicos: document.querySelector('[name="antecedentesMedicos"]').value,
                        idPaciente: result.user,//uid,-- User Nuevo
                        SospechaCovid19: false,
                        IdMedicoHora: idMedicoHora,
                        Estado: estadoAtencion,
                    }

                    let valida = await putAgendarMedicosHoras(agendar, idMedico, uid);

                    if (valida.status === "NOK") {
                        if (valida.err == 3) {

                            swal.fire({
                                title: valida.msg,
                                text: "¿Desea agendar nuevamente?",
                                type: 'error',
                                showCancelButton: true,
                                reverseButtons: true,
                                cancelButtonText: 'No, volver a Atenciones',
                                confirmButtonText: 'Sí, ir a Agendar'
                            }).then(async function (result) {
                                if (result.value) {
                                    window.location.href = "Agendar"
                                }
                                else {
                                    window.location.href = "Index";
                                }
                            });
                            $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                        }
                        else {
                            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                            $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                        }
                    }
                    else {
                        if (connection.state === signalR.HubConnectionState.Connected) {
                            connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {

                                connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "actualizar").then(r => {
                                    connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                                }).catch(err => console.error(err));
                            }).catch((err) => {
                                return console.error(err.toString());
                            });
                        }

                        connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {

                            return console.error(err.toString());
                        });

                        if (estadoAtencion === "I" && !valida.infoAtencion.atencionDirecta && data.personas.codigoTelefono != "CO") {
                            await enviarCitaEniax(valida.infoAtencion.idAtencion)
                        }

                        $('#btnConfirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                        var fecha = moment(fechaSeleccion, 'DD/MM/YYYY HH:mm:ss a').format("YYYY-MM-DD HH:mm:ss");


                        //redireccionamiento atencion directa
                        if (valida.infoAtencion.atencionDirecta && m == "1") {
                            Swal.fire({
                                title: 'Atención confirmada',
                                html: 'Serás redireccionado de forma automática a la sala de espera.',
                                timer: 7000,
                                // backdrop: false,
                                allowOutsideClick: false,
                                type: "success",
                                showConfirmButton: false,
                                timerProgressBar: true,

                            })
                            window.location = `/Ingresar_Sala_FU/${valida.infoAtencion.idAtencion}`;
                        }
                        window.location.href = url;
                    }

                }
                else {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    $('#btnCrear').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

                }

            }
     
    //} // Fin Boton crear
        }
    });

// FIN VALIDACION CREACION CUENTA USUARIO NUEVO
//------------------------------------------------------------//
    var buttonCancelarAtencion = document.getElementById("btnCancelarAtencion");
    buttonCancelarAtencion.addEventListener("click", async function (event) {
        event.preventDefault();
        
        swal.fire({
            title: 'Eliminar Atención',
            text: "¿Está seguro de eliminar esta atención?",
            type: 'question',
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, Eliminala'
        }).then(async function (result) {
            if (result.value) {
                let valida = await putEliminarAtencion(idAtencion, uid);

                // Carito
                if (connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {
                        connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), valida.infoAtencion.fecha, valida.infoAtencion.horaDesdeText, "eliminar").then(r => {
                            connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                        }).catch(err => console.error(err));
                    }).catch((err) => {
                        return console.error(err.toString());
                    });
                }

                if (valida !== 0) {
                    Swal.fire({
                        tittle: "Éxito!",
                        text: "Ha eliminado la atención",
                        type: "success",
                        confirmButtonText: "OK"
                    });
                    if (window.tipoatencion == "I") {
                        window.location.href = "/Paciente/Home";
                    } else {
                       // window.location.href = "Agenda_Invitado_2?idMedico=" + idMedico + "&fechaPrimeraHora=" + valida.infoAtencion.fecha + "&m=" + valida.infoAtencion.idModeloAtencion + "&r=" + valida.infoAtencion.idReglaPago + "&c=" + valida.infoAtencion.idConvenio + "&especialidad=" + especialidadFila + "&tipoatencion=" + window.tipoatencion;
                         window.location.href = "Agenda_Invitado_2?idMedico=" + idMedico + "&fechaPrimeraHora=" + window.fechaAgenda2 + "&m=" + window.m + "&r=" + window.r + "&c=" + window.c + "&especialidad=" + especialidadFila + "&tipoatencion=" + window.tipoatencion;

                    }
                }
            }

        });
    });


};

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
async function guardarAtencion(estado) {
    let agendar = {
        id: idAtencion,
        idBloqueHora: idBloqueHora,
        fechaText: fechaSeleccion,
        triageObservacion: document.querySelector('[name="triageObservacion"]').value,
        antecedentesMedicos: document.querySelector('[name="antecedentesMedicos"]').value,
        idPaciente: uid,
        SospechaCovid19: false,
        IdMedicoHora: idMedicoHora,
        Estado: estado,
        CodigoTelefono: codPaisPaciente
    };
    let resultado = await putAgendarMedicosHoras(agendar, idMedico, uid);

    if (resultado.status === 'NOK') {
        return resultado;
    }
    else {

        if (connection.state === signalR.HubConnectionState.Connected) {
            connection.invoke('SubscribeCalendarMedico', parseInt(idMedico)).then(r => {

                connection.invoke("ActualizarCalendarMedico", parseInt(idMedico), resultado.infoAtencion.fecha, resultado.infoAtencion.horaDesdeText, "actualizar").then(r => {
                    connection.invoke('UnsubscribeCalendarMedico', parseInt(idMedico)).catch(err => console.error(err));
                }).catch(err => console.error(err));
            }).catch((err) => {
                return console.error(err.toString());
            });
        }

        connectionAgendar.invoke("ActualizarAgendarPaciente").catch((err) => {
            return console.error(err.toString());
        });

        return resultado;
    }


}


async function agendarRealTime() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
    } catch (err) {
        
    }

    connectionAgendar = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/agendarpacientehub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionAgendar.start();
    } catch (err) {
        
    }
}


var KTLoginGeneral = function () {
    var showErrorMsg = function (form, type, msg) {
    var alert = $('<div class="alert alert-bold alert-solid-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+ msg + '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

    form.find('.alert').remove();
    alert.prependTo(form);
    KTUtil.animateClass(alert[0], 'fadeIn animated');
}

    var rutValido = true;
    var userNameReset;
    var handleForgotFormSubmit = function () {
        userNameReset = document.getElementById("identificadorReset").value;
        $('#kt_login_forgot_submit').click(async function (e) {
            e.preventDefault();

            var login = $('#loginPost');
            var btn = $(this);
            var form = $(this).closest('form');

            userNameReset = document.getElementById("identificadorReset").value;
          

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
                url: '/account/pageresetinvitado?baseUrl=' + baseUrlWeb,
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
                        //$('#loginPost').removeClass('d-none');
                        $('#cambioClave').removeClass('d-none');

                        var signInForm = login.find('.kt-login__signin form');
                        //$('#idicono').removeClass('d-none');
                        $('#pageReset').addClass('d-none');
                        showErrorMsg(signInForm, 'success', `La instrucci${decodeURI("%C3%B3")}n de recuperaci${decodeURI("%C3%B3")}n de contrase${decodeURI("%C3%B1")}a ha sido enviada a tu correo.`);
                    }
                }
            });
        });
    }

var handlePasswordReset = function () {
    $('#kt_password_reset_submit').click(async function (e) {        
        e.preventDefault();
        var login = $('#loginPost');
        var btn = $(this);
        var form = $(this).closest('form');
        var pw = $('form').serializeArray();
       
        //var pwR = Object.values(pw[10]);
        //pw = Object.values(pw[9]);
        var pwR = Object.values(pw[21]);
        pw = Object.values(pw[20]);
        pw = pw[1];
        pwR = pwR[1];

        let usuario = await getUserByUserName(userNameReset);
       

        document.querySelector('[name="username"]').value = userNameReset;
        document.querySelector('[name="ActivationCode"]').value = usuario.activationCode;
        
        

        //A Continuacion se utilizan funciones para veririfcar que la clave contenga minimo
        //Una letra minuscula, mayuscula, un numero, la clave no haya sido utilizada anteriormente,
        //Y Validar que las claves en el campo de repetir Contraseña sean iguales

        let mayus = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let minus = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        function buscar(find, cont) {
            let found = new Boolean();
            found = false;

            for (let val of find) {
                if (cont.includes(val)) {
                    found = true;
                    break;
                }
            }
            return found;
        }


        if (pw.length < 8 || pw.length > 15) {
            Swal.fire("", "La contraseña debe tener entre 8 y 15 caracteres ", "warning");
            $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
            return;
        }

        if (!buscar(pw, mayus) || !buscar(pw, minus) || !buscar(pw, num)) {
            Swal.fire("", "La contraseña deben tener como mínimo una letra minúscula, una letra mayúscula y un número", "warning");
            $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
            return;
        }


        if (pw != pwR) {
            Swal.fire("", "Las contraseñas deben coincidir", "warning");
            $('#kt_password_reset_submit').removeAttr('disabled').children('.spinner-border').remove();
            return;
        }

       var userName = document.querySelector('[name="username"]').value;
        let oldPass = await compareOldPassword(userName, pw);

        if (oldPass) {
            Swal.fire("", "No puedes usar una clave ingresada anteriormente", "warning");
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
                    required: true,
                    
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
     
                    var signInForm = $('#loginPost'); //login.find('.kt-login__signin form');
              
                    $('#cambioClave').addClass('d-none');
                    $('#loginPost').removeClass('d-none');
            
                    showErrorMsg(signInForm, 'success', `Tu contrase${decodeURI("%C3%B1")}a ha sido modificada correctamente.`);

                 
                 
                    let save = await saveOldPassword(userName);
                }
            }
        });
    });
}


// Public Functions
return {
    // public functions
    init: function () {             
        handlePasswordReset();
        handleForgotFormSubmit();

        var validation = document.getElementsByName("ActivationCode")[0];

        if (validation && validation.value !== "00000000-0000-0000-0000-000000000000") {
            //displayResetPasswordForm();
        }


    }
};
}();

$('#kt_password_reset_cancel').click(async function (e) {
    e.preventDefault();

    $('#pageReset').addClass('d-none');
    $('#cambioClave').addClass('d-none');
    //$('#loginPost1').removeClass('d-none');
    $('#loginPost1').removeAttr("style");
    $('#idicono').removeClass('d-none');
    limpiar();
});


async function validarRutConvenio(identificador) {
    const campoIdentificador =  document.getElementById("Identificador");
    if (campoIdentificador.value != identificador) {
        let usuario = await findUsernameEmpresa(campoIdentificador.value, idCliente);
        
        if (!usuario)
            campoIdentificador.value = "";
        return usuario;
    }
    else {
        return true;
    }
}

$("input#Identificador").rut({
    formatOn: 'keyup',
    minimumLength: 4,
    validateOn: 'change',
    useThousandsSeparator: false
}).on('rutInvalido', function (e) {
    Swal.fire("Error!", "El rut " + $(this).val() + " es inválido.", "error");
});


$("input#kt_rut").rut({
    formatOn: 'keyup',
    minimumLength: 4, 
    validateOn: 'change',
    useThousandsSeparator: false
}).on('rutInvalido', function (e) {
    Swal.fire("Error!", "El rut " + $(this).val() + " es inválido.", "error");
});

$("input#identificadorReset").rut({
    formatOn: 'keyup',
    minimumLength: 4,
    validateOn: 'change',
    useThousandsSeparator: false
}).on('rutInvalido', function (e) {
    Swal.fire("Error!", "El rut " + $(this).val() + " es inválido.", "error");
});


function limpiar() {
    document.getElementById("Nombre").value = "";
    document.getElementById("ApellidoPaterno").value = "";
    document.getElementById("ApellidoMaterno").value = "";
    document.getElementById("Identificador").value = "";
    document.getElementById("Correo").value = "";
}



// Class Initialization
jQuery(document).ready(async function () {

    var parsedUrl = new URL(window.location.href);
    var url = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1);

    KTLoginGeneral.init();

});