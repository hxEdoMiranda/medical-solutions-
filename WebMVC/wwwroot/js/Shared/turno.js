import { postNspPaciente, getAtencion, getEstadoFilaUnica } from '../apis/atencion-fetch.js';
import { putEliminarAtencion } from '../apis/agendar-fetch.js';
import { logPacienteViaje } from '../apis/personas-fetch.js?rnd=9';



const asyncIntervals = [];
var connectionBox;
var connectionActualizar;
var intervalos;
const runAsyncInterval = async (cb, interval, intervalIndex) => {
    await cb();
    if (asyncIntervals[intervalIndex]) {
        setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    }
};

const setAsyncInterval = (cb, interval) => {
    if (cb && typeof cb === "function") {
        const intervalIndex = asyncIntervals.length;
        asyncIntervals.push(true);
        runAsyncInterval(cb, interval, intervalIndex);
        return intervalIndex;
    } else {
        throw new Error('Callback must be a function');
    }
};

const clearAsyncInterval = (intervalIndex) => {
    if (asyncIntervals[intervalIndex]) {
        asyncIntervals[intervalIndex] = false;
    }
};
export async function initTurno() {
    if (window.host.includes("prevenciononcologica") || window.host.includes("clinicamundoscotia.") || window.host.includes("masproteccionsalud.") || window.host.includes("saludproteccion.") || idCliente == 1) {
        await ingresoPacienteRT(uid);
    } else {
       await agendarRealTime();
        var dataDirecta = atencionVigente.filter(itemF => itemF.atencionDirecta && itemF.estadoAtencion == "I"); //&& itemF.idEspecialidadFilaUnica == 1 comentado para ver turno 
        var url = new URL(window.location.href);
        if (url.pathname.includes("/Atencion_Box")) {
            $(".control-atencion").hide();
        } else {
            if (dataDirecta.length > 0) {
                var idAtencion = dataDirecta[0]["idAtencion"];
                setAsyncInterval(async () => buscarAtencion(idAtencion), 60000); //10seg 
                if (url.pathname.includes("/Ingresar_Sala_FU")) {
                    $(".btnGoHome").show();
                    $(".btnGoHome").addClass('d-lg-inline-block');
                    $(".btnIrSalaEspera").hide();
                    $(".btnIrSalaEspera").removeClass('d-lg-inline-block');
                    $(".alerta-superior").hide();
                    $(".mensaje-mobile").hide();
                }
                else {
                    $(".btnGoHome").hide();
                    $(".btnGoHome").removeClass('d-lg-inline-block');
                }
             

                //if (dataDirecta[0]["inicioAtencion"] != null && dataDirecta[0]["estado"] == "I") {
                  
                //        var evento = "médico en call, paciente redireccionado por timer";
                //        await grabarLog(idAtencion, evento, info)
                //        $(".btn-control-atencion").css("display", "none");
                //        $(".container-fila-tiempo").css("display", "none");
                //        $(".time-ingreso-sala").show();

                //    $("#salaEsperaDesk-new").show();
                //    $("#salaEsperaDesk-mobile-new").show();

                //    if (dataDirecta[0]["inicioAtencionPacienteCall"] == null)
                //        await cuentaRegresiva(idAtencion);
                //    else {

                //    }
                    
                //}
                //else {
                //    $("#salaEsperaDesk-new").show();
                //    $("#salaEsperaDesk-mobile-new").show();
                //     $(".stepper").addClass('stepper-medismart');
                //    $(".menu-home").addClass('menu-top-turnero');

                //}
              
            }
        }
        await ingresoPacienteRT(uid);
    }



}

async function ingresoPacienteRT(uid) {
    connectionBox = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxhub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionBox.on('IngresarBox', async (id) => {
        var urlBox = window.location;
        if (!urlBox.pathname.includes("Atencion_Box")) {
            let aud = document.getElementById("ingresoBox");
            aud.play();
            $(".btn-control-atencion").css("display", "none");
            $(".container-fila-tiempo").css("display", "none");
            $(".time-ingreso-sala").show();
            var dataDirecta = atencionVigente.filter(itemF => itemF.estadoAtencion == "I");

            if (dataDirecta.length <= 0)
                return;
            else if (dataDirecta[0].atencionDirecta)
                await cuentaRegresiva(id);
            else
                swal.fire({
                    title: 'El profesional ya está ingresando a la consulta',
                    text: "Ir a la Atención",
                    type: 'success',
                    showCancelButton: false,
                    reverseButtons: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Continuar',
                    allowOutsideClick: false,
                    allowEscapekey: false
                    }).then(async function (result) {
                        if (result.value)
                            location.href = `/Atencion_Box/${id}`;  
                });
        }
        if (urlBox.pathname.includes("Atencion_Box")) {
            const div = document.getElementById('estilo');
            div.className = "status-profesional online";
            document.getElementById('onLine').innerText = 'Online';
        };

    });
    connectionBox.on('EnLinea', (id) => {
        var urlBox = window.location;
        if (!urlBox.pathname.includes("Atencion_Box")) {


        }
        if (urlBox.pathname.includes("Atencion_Box")) {
            const div = document.getElementById('estilo');
            div.className = "status-profesional online";
            document.getElementById('onLine').innerText = 'Online';
        };

    });

    try {
        await connectionBox.start();
    } catch (err) {
        console.log(err);
    }

    if (connectionBox.state === signalR.HubConnectionState.Connected) {
        connectionBox.invoke('SubscribeIngresoBox', uid, parseInt(idCliente)).catch((err) => {
            return console.error(err.toString());
        });
    }


}


async function accionesSala(atencionVigente, idAtencion) {

    var evento = "";

    $(".btnDeleteTurno").click(async function () {

        $("#modalConservaTurno").modal("hide");


        evento = `Paciente abandona atención salir sala de espera se elimina atencion, cliente: ${idCliente}`

        await nspPaciente(atencionVigente, idAtencion);
        var valida = await putEliminarAtencion(idAtencion, uid, false);
        retornoCanal();
        var informacion = "Posicion fila: " + document.getElementById("posicionFila-desk-new").textContent + " " + "Hora aprox: " + document.getElementById("horaFila-desk-new").textContent; 
        await grabarLog(idAtencion, evento, informacion);
       
    });

    $(".btnMantenerTurno").click(async function () {
        var log = {
            IdPaciente: uid,
            Evento: "Paciente mantiene turno atención",
            IdAtencion: parseInt(idAtencion)
        }
        await logPacienteViaje(log);
        $("#modalConservaTurno").modal("hide")

    });

    $(".btnModalDeleteTurno").click(function () {
        $("#modalConservaTurno").modal("show");

    });

    $(".btnGoHome").click(function () {
        var urlHome = "/Paciente/Home?view=true";
        location.href = urlHome;

    });

    $(".btnIrSalaEspera").click(function () {
        var redirect = `/Ingresar_Sala_FU/${idAtencion}`;
        location.href = redirect;

    });

    $(".btnCancelaTurno").click(async function () {

        cuentaRegresiva(idAtencion, 1)

        var mensajeHtml = "¿Quieres cancelar el ingreso a sala?";
        var redirect = `/Ingresar_Sala_FU/${idAtencion}`;
        var showCancel = true;
        var confirmText = "Si, deseo cancelar";

        $("#modalCancelarIngresoSala").modal("show");

       /* Swal.fire({
            title: mensajeHtml,
            text: "",
            showCancelButton: showCancel,
            cancelButtonText: "No, volver a ingresar",
            confirmButtonText:confirmText,
            reverseButton: true,
            type: 'question',
        }).then(async (result) => {

            if (result.value == true) {
                Swal.fire(
                    'Atención eliminada',
                    'Su atención fue eliminada correctamente',
                    'success'
                )
                await nspPaciente(atencionVigente, idAtencion);
                retornoCanal();
            } else {
                cuentaRegresiva(idAtencion)
            }
        })*/

    });

    $(".btnVolverTurno").click(async function () {

        location.href = `/Atencion_Box/${idAtencion}`;

    });

    $("#btnCancelarIngreso").click(async function () {
        $("#modalCancelarIngresoSala").modal("hide");

        //Swal.fire(
        //    'Atención eliminada',
        //    'Su atención fue eliminada correctamente',
        //    'success'
        //)
        await nspPaciente(atencionVigente, idAtencion);
        var urlHome = "/Paciente/Home?view=true";
        location.href = urlHome;

    });

    $(".btnEntrarSala").click(async function () {
        $("#modalCancelarIngresoSala").modal("hide");

        location.href = `/Atencion_Box/${idAtencion}`;
    });

    $(".closeCuentaRegresiva").click(async function () {
        await cuentaRegresiva(idAtencion)
    });


  



}


async function buscarAtencion(idAtencion) {
    try {

        if (typeof atencionBox === 'undefined') {
            var atencion = await getAtencion(idAtencion);
            if (atencion) {

                var estado = await getEstadoFilaUnica("A2", 0, idAtencion)
                if (estado.mensaje != null && estado.mensaje != "") {
                    if (estado.posicion === '1') {
                        //document.getElementById('tiempo-desk').setAttribute('class', 'd-none');
                    }
                    else {
                        document.getElementById('tiempo-desk-new').setAttribute('class', 'tiempo-atencion-new');
                    }

                    document.getElementById("posicionFila-desk-new").innerHTML = estado.posicion;
                    document.getElementById("horaFila-desk-new").innerHTML = estado.tiempo;

                    document.getElementById("posicionFila-desk-mobile-new").innerHTML = estado.posicion;
                    document.getElementById("horaFila-desk-mobile-new").innerHTML = estado.tiempo;

                    var url = new URL(window.location.href);
                    if (url.pathname.includes("/Ingresar_Sala_FU")) {
                        if ($('#mensaje').length) {
                            document.getElementById("mensaje").innerHTML = estado.mensaje;
                            document.getElementById("mensajeMobile").innerHTML = estado.mensaje;
                            $("#panelEstado").show();
                            var evento = "Paciente ingresa a sala de espera atencion directa " + window.idCliente;
                            var info = "Posicion fila: " + document.getElementById("posicionFila-desk-new").textContent + " " + "Hora aprox: " + document.getElementById("horaFila-desk-new").textContent;
                            await grabarLog(idAtencion, evento, info);
                        }
                    }
                    

                }

                $(".control-atencion").show();

                await accionesSala(atencion, idAtencion);
                var info = "Inicio Atencion = " + atencion.inicioAtencion + " ESTADO = " + atencion.estado;
                var evento = "INGRESO A TIMER";
                await grabarLog(idAtencion, evento, info)
                if (atencion.inicioAtencion != null && atencion.estado == "I") {
                    var evento = "médico en call, paciente redireccionado por timer";
                    await grabarLog(idAtencion, evento, info)
                    $(".btn-control-atencion").css("display", "none");
                    $(".container-fila-tiempo").css("display", "none");
                    $(".time-ingreso-sala").show();
                    if (atencion.inicioAtencionPacienteCall == null) {
                        
                        await cuentaRegresiva(idAtencion);
                    }
                    else {
                        $(".texto_medicoingresa").text("Tienes una atención en curso");
                        $(".segundos").text("");
                        $(".btnCancelaTurno").remove();

                    }

                }
               
                $("#salaEsperaDesk-new").show();
                $("#salaEsperaDesk-mobile-new").show();
                $(".stepper").addClass('stepper-medismart');
                $(".menu-home").addClass('menu-top-turnero');
                $(".modalCancelarIngresoSala").css("width", "550px");

                if (atencion.nsp) {
                    atencionTerminada();
                };
            }
        } 

    }
    catch (error) {
        var evento = "catch timer " + error;
        await grabarLog(idAtencion, evento, info)
        // alert("entro al catch: " + evento + " / idAtencion: "+idAtencion);
    }

}


function atencionTerminada() {
    var showCancel = true;
    if (idCliente == 1)
        showCancel = false;
    Swal.fire({
        html: `Ooops!
                   <p>El médico llegó al box de atención y no te encontró disponible.</p>
                   <p>Recuerda estar pendiente de tu posicion en la fila y en la Sala de Espera.</p>
                   <p></p>`,
        title: "",
        type: "warning",
        showConfirmButton: true,
        confirmButtonText: "Salir",
        showCancelButton: showCancel,
        cancelButtonText: "Volver a la sala de espera"
    }).then(async (result) => {
        if (result.value) {
            var evento = "Paciente acepta atención nsp";
            await grabarLog(idAtencion, evento);
            retornoCanal();
        }
        if (result.dismiss == "cancel") {

            var restriccion = restriccionTiempo(idCliente, idEspecialidad)
            if (restriccion == false) {
                return;
            }
            var resp = await putVolverSala(idAtencion)
            if (resp.status != "NOK") {
                window.location = `/Ingresar_Sala_FU/${idAtencion}/0`;
            }
        }
    });
}

async function cuentaRegresiva(idAtencion, stop) {
    $(".btnVolverTurno").remove();
    if (stop == 1) {
        $('.segundos').html(10+'s');
        clearInterval(intervalos);

    } else {
        let tiempo = $('.segundos').html(10+'s');
        intervalos = setInterval(async function () {
            tiempo = $('.segundos').html();
            tiempo = tiempo.replace('s', '');
            let descuento = 1;
            if (tiempo != '0') {
                var distance = tiempo - descuento;
            }
            $('.segundos').html('0'+distance+'s');
            if (distance == 0)
                location.href = `/Atencion_Box/${idAtencion}`, clearInterval(intervalos);

        }, 1000);
    }
        
   
}



async function nspPaciente(atencionVigente, idAtencion) {
    var url = new URL(window.location.href);
    //if (idCliente == 1 || url.pathname.includes('doctoronline.') || url.pathname.includes('clini.')) {
        var tipoAccion = "nspPaciente";
        var resultNsp = await postNspPaciente(idAtencion, uid);
        if (resultNsp.status != "OK")
            return;

    var evento = "Paciente abandona atención salir sala de espera Consalud";
    var info =  "Posicion fila: " + document.getElementById("posicionFila-desk-new").textContent + " " + "Hora aprox: " + document.getElementById("horaFila-desk-new").textContent; 
        if (connectionActualizar.state === signalR.HubConnectionState.Connected) {
            connectionActualizar.invoke('SubscribeCalendarMedico', parseInt(atencionVigente.idMedico)).then(r => {
                connectionActualizar.invoke("ActualizarListaUrgencia", parseInt(atencionVigente.idMedico), atencionVigente.fecha, atencionVigente.horaDesdeText, tipoAccion).then(r => {
                    connectionActualizar.invoke('UnsubscribeCalendarMedico', parseInt(atencionVigente.idMedico)).catch(err => console.error(err));
                }).catch(err => console.error(err));
            }).catch((err) => {
                return console.error(err.toString());
            });
        }
    //} else {
    //    var valida = await putEliminarAtencion(idAtencion, uid, true); //true = nspPaciente.
    //    if (valida.estado !== "OK")
    //        return;

    //    var evento = `Paciente abandona atención salir sala de espera se elimina atencion, cliente: ${idCliente}`
    //}

    await grabarLog(idAtencion, evento, info);
    
    //var tittle = `Hola ${atencionVigente.nombrePaciente}: <br><br> Al salir de la sala de espera perderás tu lugar en la fila de atención. Si sales tendrás que tomar la hora nuevamente.`;
    //var confirmText = "Quiero salir";
    //var cancelText = "Volver a la sala de espera";
    //if (idCliente != 1) {
    //    tittle = `Hola ${atencionVigente.nombrePaciente}: <br><br> Al salir de la sala de espera perderás tu lugar en la fila y tu atención será cancelada automáticamente.`;
    //    confirmText = "SI, quiero abandonar";
    //    cancelText = "NO, quiero mantenerme";
    //}

    //Swal.fire({
    //    title: tittle,
    //    text: "¿Está seguro de abandonar la atención?",
    //    type: "question",
    //    showCancelButton: true,
    //    cancelButtonColor: 'rgb(190, 190, 190)',
    //    confirmButtonColor: '#3085d6',
    //    cancelButtonStyle: 'position:absolute; right:45px',
    //    customClass: 'swal-wide',
    //    reverseButtons: true,
    //    cancelButtonText: cancelText,
    //    confirmButtonText: confirmText
    //}).then(async (result) => {
    //    if (result.value) {
    //        var evento = "";
    //        if (idCliente == 1 || host == 'doctoronline.' || host == 'clini.') {
    //            tipoAccion = "nspPaciente";
    //            var resultNsp = await postNspPaciente(idAtencion, uid);
    //            if (resultNsp.status != "OK")
    //                return;

    //            evento = "Paciente abandona atención salir sala de espera Consalud";
    //            if (connectionActualizar.state === signalR.HubConnectionState.Connected) {
    //                connectionActualizar.invoke('SubscribeCalendarMedico', parseInt(atencionVigente.idMedico)).then(r => {
    //                    connectionActualizar.invoke("ActualizarListaUrgencia", parseInt(atencionVigente.idMedico), atencionVigente.fecha, atencionVigente.horaDesdeText, tipoAccion).then(r => {
    //                        connectionActualizar.invoke('UnsubscribeCalendarMedico', parseInt(atencionVigente.idMedico)).catch(err => console.error(err));
    //                    }).catch(err => console.error(err));
    //                }).catch((err) => {
    //                    return console.error(err.toString());
    //                });
    //            }
    //        } else {
    //            var valida = await putEliminarAtencion(idAtencion, uid, true); //true = nspPaciente.
    //            if (valida.estado !== "OK")
    //                return;

    //           var evento = `Paciente abandona atención salir sala de espera se elimina atencion, cliente: ${idCliente}`
    //        }

    //        await grabarLog(idAtencion, evento);
    //        retornoCanal();

    //    }
    //});
}
function retornoCanal() {
    switch (idCliente) {
        case 1: location.href = `/Account/logoutExterno?rol=Paciente&canal=${canal}`;
            break;
        default: location.href = `/`;
    }

}

async function grabarLog(idAtencion, evento, info) {
    var log = {
        IdPaciente: uid,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
}

async function agendarRealTime() {

    connectionActualizar = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionActualizar.start();
    } catch (err) {

    }


}
function filtrarAtencionVigente(dataDirecta) {
    if (dataDirecta.length > 0) {
        dataDirecta.forEach(item => {
            var mensajeHtml = "¿Quieres Ingresar a la fila?";
            var mensajeConfirm = "¿Quieres ingresar a la sala de espera?";
            var redirect = `/Ingresar_Sala_FU/${item.idAtencion}`;
            var showCancel = true;
            var confirmText = "Si, volver a la SALA"


            return item.idAtencion;

        });

    }

}

