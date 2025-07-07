import { personaFotoPerfil } from "../shared/info-user.js";
import { inicioAtencionPaciente, getAtencion } from '../apis/atencion-fetch.js';
import { getTipoAtencionesAsistencias } from '../apis/atenciones-asistencias-fetch.js';

var connectionTermino;
var connectionRT;
const asyncIntervals = [];
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

export async function init(data) {
    console.log(data)
    await personaFotoPerfil();
    let page = document.getElementById('page');
    /*setAsyncInterval(async () => getAtencionesAsistenciasById(data.atencion.id), 60000); //10seg*/

    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencionPacienteCall == null) {
        await inicioAtencionPaciente(data.atencion.id);
    }
   
    if ($("#volverSalaEspera").length) {
        let btnVolverSala = document.getElementById('volverSalaEspera');
        btnVolverSala.onclick = () => {
            location.href = `/Atencion_SalaEspera/${data.atencion.id}`;
        }
    }

    //EVENTO WHEREBY PARTICIPANT_LEAVE
    const elm = document.querySelector("whereby-embed");

    elm.addEventListener("participant_leave", async (e) => {

        console.log('Event', e.type);

        var estadoAtencion = await getAtencion(idAtencion);
        if (estadoAtencion.estado == "T") {
            var momentoWow = $("#momentoWow").val();
            var codigoTelefono = $("#codigoTelefono").val();

            var urlInformeWow = `/ResumenAtencionCustom?idAtencion=${idAtencion}`;

            if (estadoAtencion.isProgramaSalud && estadoAtencion.horaMedico.idEspecialidad == 33) {
                urlInformeWow = `/programaSalud/ConfirmacionInterconsulta?idAtencion=${idAtencion}`
                $("#modalFinalizarAtencionWOW").modal("show");
                setTimeout(async () => {
                    window.onbeforeunload = false;
                    location.href = urlInformeWow;
                }, "5000");
            }
            else if (momentoWow === "True" && codigoTelefono == "CL") {
                $("#modalFinalizarAtencionWOW").modal("show");
                setTimeout(async () => {
                    window.onbeforeunload = false;
                    location.href = urlInformeWow;
                }, "5000");
            }
            else {
                var urlInforme = `/InformeAtencion/${idAtencion}`;
                swal.fire({
                    title: 'La Atención ha finalizado',
                    text: 'Serás redireccionado de forma automática al informe de atención',
                    type: 'success',
                    reverseButtons: true,
                    confirmButtonText: 'Ok'
                }).then(async function (result) {
                    window.onbeforeunload = false;
                    location.href = urlInforme;
                });
            }
        }
    })
   

    //----------------------------------------------------------
    //-----------------------realTime---------------------------
    //#region realtime
    await ingresoPacienteRT();
    
    if (connectionRT.state === signalR.HubConnectionState.Connected) {
        connectionRT.invoke('SubscribeIngresoBoxMedico', parseInt(data.atencion.horaMedico.idMedico)).then(r => {
            connectionRT.invoke("IngresarBoxMedico", parseInt(data.atencion.horaMedico.idMedico), parseInt(data.atencion.id)).then(r => {
                //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }).catch((err) => {
            return console.error(err.toString());
        });
    }

        
    function llamarPaciente() {        
        if (connectionRT.state === signalR.HubConnectionState.Connected) {
            connectionRT.invoke('SubscribeIngresoBoxMedico', parseInt(data.atencion.horaMedico.idMedico)).then(r => {
                connectionRT.invoke("IngresarBoxMedico", parseInt(data.atencion.horaMedico.idMedico), parseInt(data.atencion.id)).then(r => {
                    //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
                }).catch(err => console.error(err));
            }).catch((err) => {
                return console.error(err.toString());
            });
        }
    }

    setAsyncInterval(async () => llamarPaciente(40000)); //10seg

    //nombre medico header chat;
    document.getElementById("headName").innerHTML = data.atencion.nombreMedico;
    page.innerHTML = `Atención con ${data.atencion.prefijoProfesional} ${data.atencion.nombreMedico}`;

    if ($("#consentimiento").length) {
        let consentimiento = document.getElementById('consentimiento');
        consentimiento.onclick = async () => {
            let modalBodyConsentimiento = document.getElementById('modalBodyConsentimiento');
            $("#modalBodyConsentimiento").empty();
            let embed = document.createElement('embed');
            embed.src = "/Consentimiento-Informado/Consentimiento-Informado.pdf";
            embed.style.width = "100%";
            embed.style.height = "700px";
            modalBodyConsentimiento.appendChild(embed);
            $("#modalConsentimiento").modal("show");
        }
    }
    $("#divChat").show();
    await terminoAtencionRT(uid, data.atencion.id);

};

async function terminoAtencionRT(uid, id) {
    connectionTermino = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxhub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionTermino.on('TerminoAtencion', async (id) => {
        var momentoWow = $("#momentoWow").val();
        var codigoTelefono = $("#codigoTelefono").val();
        var urlInforme = `/InformeAtencion/${id}`;
        var idAtencion = id;
        debugger

        var estadoAtencion = await getAtencion(idAtencion);
        var urlInformeWow = `/ResumenAtencionCustom?idAtencion=${idAtencion}`;

        if (estadoAtencion.estado == "T") {
            if (estadoAtencion.isProgramaSalud && estadoAtencion.horaMedico.idEspecialidad == saludEspecialidad) {
                urlInformeWow = `/programaSalud/ConfirmacionInterconsulta?idAtencion=${idAtencion}`
                $("#modalFinalizarAtencionWOW").modal("show");
                setTimeout(async () => {
                    window.onbeforeunload = false;
                    location.href = urlInformeWow;
                }, "5000");
            }
            else if (momentoWow === "True" && codigoTelefono == "CL") {
                $("#modalFinalizarAtencionWOW").modal("show");
                setTimeout(async () => {
                    window.onbeforeunload = false;
                    location.href = urlInformeWow;
                }, "5000");
        }else if (window.host && (window.host.includes("saludproteccion.") || window.host.includes("masproteccionsalud.") || window.host.includes("prevenciononcologica.") || window.host.includes("clinicamundoscotia.")))
        {
            swal.fire({
                title: 'La Atención ha finalizado',
                text: 'Serás redireccionado de forma automática al informe de atención',
                type: 'success',
                reverseButtons: true,
                confirmButtonText: 'Ok'
            }).then(async function (result) {
                window.onbeforeunload = false;
                location.href = urlInforme;
            });
        }
        else if (window.host && window.host.includes("happ."))
        {
            location.href = 'https://app.happlabs.cl/';
        }
        else if (window.host && momentoWow === "True" && codigoTelefono == "CL")
        {
            var urlInformeWow = `/ResumenAtencionCustom?idAtencion=${idAtencion}`;
            $("#modalFinalizarAtencionWOW").modal("show");
            setTimeout(async () => {
                window.onbeforeunload = false;
                location.href = urlInformeWow;
            }, "5000");
        }
        else if (window.host && window.host.includes("vivetuseguro.") && momentoWow === "True" && codigoTelefono == "MX")
        {
            var urlInformeWowMX = `/ResumenAtencionCustom?idAtencion=${idAtencion}`;
            $("#modalFinAtencionWowCardifMX").modal("show");
            setTimeout(async () => {
                window.onbeforeunload = false;
                location.href = urlInformeWowMX;
            }, "5000");
        }
        else {
            var urlInforme = `/InformeAtencion/${id}`;
            if (!location.href.includes("saludproteccion.") && !location.href.includes("masproteccionsalud.") && !location.href.includes("prevenciononcologica.") && !location.href.includes("clinicamundoscotia.")) {
                $("#modalFinalizarAtencionWOW").modal("show");
                setTimeout(async () => {
                    $("#modalFinalizarAtencionWOW").modal("hide");
                    window.onbeforeunload = false;
                    location.href = urlInforme;
                }, "20000");
            } else if (location.href.includes("happ.")) {
                location.href = 'https://app.happlabs.cl/';
            } else {
                swal.fire({
                    title: 'La Atención ha finalizado',
                    text: 'Serás redireccionado de forma automática al informe de atención',
                    type: 'success',
                    reverseButtons: true,
                    confirmButtonText: 'Ok'
                }).then(async function (result) {
                    window.onbeforeunload = false;
                    location.href = urlInforme;
                });
            }
            }
        }
    });

    try {
        await connectionTermino.start();
    } catch (err) {
        
    }

    if (connectionTermino.state === signalR.HubConnectionState.Connected) {
        connectionTermino.invoke('SubscribeIngresoBox', uid, idCliente).catch((err) => {
            return console.error(err.toString());
        });
    }
}


document.querySelector('#panel_ConfirmarAsistenciaAmb').onclick = async () => {
        $("#modalConfirmarAsistencia").modal("show");
        $(".btnCerrarModal").click(function () {
            $("#modalConfirmarAsistencia").modal("hide");
        });
        $(".btnAceptarAsistencia").click(function () {
            $("#modalConfirmarAsistencia").modal("hide");
        });
}

document.querySelector('#panel_ModalResumen').onclick = async () => {
    $("#modalFinalizarAtencionWOW").modal("show");
    $(".btnCerrarModalWow").click(function () {
        $("#modalFinalizarAtencionWOW").modal("hide");
    });
    setTimeout(async () => {
        $("#modalFinalizarAtencionWOW").modal("hide");
    }, "200000");
}
//Modal CardifMX
document.querySelector('#panel_ModalResumenCardifMX').onclick = async () => {
    $("#modalFinAtencionWowCardifMX").modal("show");
    $(".btnCerrarModalWow").click(function () {
        $("#modalFinAtencionWowCardifMX").modal("hide");
    });
    setTimeout(async () => {
        $("#modalFinAtencionWowCardifMX").modal("hide");
    }, "200000");
}

document.querySelector('#btnWowVerDespues').onclick = async () => {
    location.href = '/Paciente/Home/';
}

    document.querySelector('#panel_ConfirmarAsistenciaMed').onclick = async () => {
        $("#modalConfirmarAsistenciaMed").modal("show");
        $(".btnCerrarModalMed").click(function () {
            $("#modalConfirmarAsistenciaMed").modal("hide");
        });
        $(".btnAceptarAsistencia").click(function () {
            $("#modalConfirmarAsistenciaMed").modal("hide");
        });
    }


var IdAtencion = document.querySelector('[name="Atencion.Id"]').value;
let interval;
if (!interval) { 
    interval = setInterval(async () => {

    
    let res = await getTipoAtencionesAsistencias(parseInt(IdAtencion))
    if (res && res.tipoAsistencia == "Ambulancia") {
        $("#modalConfirmarAsistencia").modal("show");
        $(".btnCerrarModal").click(function () {
            $("#modalConfirmarAsistencia").modal("hide");
            clearInterval(interval);
        });
        $(".btnAceptarAsistencia").click(function () {
            $("#modalConfirmarAsistencia").modal("hide");
            clearInterval(interval);
        });
        
    }
    else if (res && res.tipoAsistencia == "Médico a Domicilio") {
        $("#modalConfirmarAsistenciaMed").modal("show");
        $(".btnCerrarModalMed").click(function () {
            $("#modalConfirmarAsistenciaMed").modal("hide");
            clearInterval(interval);
        });
        $(".btnAceptarAsistencia").click(function () {
            $("#modalConfirmarAsistenciaMed").modal("hide");
            clearInterval(interval);
        });
    } 
}, 10000); //Cada 10seg hasta que se cumpla
}



async function ingresoPacienteRT() {
    connectionRT = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionRT.start();
    } catch (err) {
        
    }

}
