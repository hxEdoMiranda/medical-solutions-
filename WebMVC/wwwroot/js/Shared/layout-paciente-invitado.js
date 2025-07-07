import { getNotificaciones } from '../apis/personas-fetch.js?1';

const asyncIntervals = [];
var connectionBox;
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
export async function init() {
    setAsyncInterval(async () => actualizarMensaje(uid), 60000); //10seg
    await ingresoPacienteRT(uid);
}


async function ingresoPacienteRT(uid) {
    
    connectionBox = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxhub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionBox.on('IngresarBox', (id) => {
        var urlBox = window.location;
        if (!urlBox.pathname.includes("Atencion_Box")) {
            let aud = document.getElementById("ingresoBox");
            aud.play();
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
                if (result.value) {
                    location.href = `/Atencion_Box/${id}`;
                }

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
        
    }

    if (connectionBox.state === signalR.HubConnectionState.Connected) {
        connectionBox.invoke('SubscribeIngresoBox', uid, parseInt(idCliente)).catch((err) => {
            return console.error(err.toString());
        });
    }
}
async function actualizarMensaje(uid) {
   
    var mensaje = await getNotificaciones(uid, idCliente);
    mensaje.forEach(item => {
            if (item.tipo == "Mensaje") {
            //
            var clase = `inner-mensaje ${item.claseNotificacion}`;
                var claseAtencion = "aviso-atencion container-fluid " + item.claseNotificacion;
                //
                var url = new URL(window.location.href);
                if (item.tiempoRestante === 1 && !url.pathname.includes("/Atencion")) {
                    swal.fire({
                        title: "",
                        text: "Ha llegado la hora de tu atención, ¿Dónde deseas ingresar?",
                        type: 'question',
                        showCancelButton: true,
                        reverseButtons: true,
                        cancelButtonText: 'Sala de espera',
                        confirmButtonText: "Box de atención",
                        //allowOutsideClick: false,
                        //allowEscapekey: false
                    }).then(async function (result) {
                        //
                        if (result.value) {
                            location.href = `/Atencion_Box/${item.idAtencion}`
                        }
                        else if(result.dismiss == "cancel"){
                            location.href = `/Atencion_SalaEspera/${item.idAtencion}`
                        }

                    });
                }

                if ($("#innerMensaje").length) {
                    document.getElementById("innerMensaje").onclick = () => {
                        if (item.claseNotificacion == "ahora") {
                            location.href = "/Atencion/" + item.idAtencion
                        }
                        else {
                            location.href = "javascript:;";
                        }
                    }


                    document.getElementById("innerMensaje").setAttribute("class", clase)
                    document.getElementById("innerMensaje").innerHTML = item.mensaje;
                    if ($("#" + item.idAtencion).length) {
                        document.getElementById(item.idAtencion).setAttribute("class", claseAtencion)
                    }
                    else if ($(".aviso-atencion").length) {
                        document.querySelectorAll(".aviso-atencion").forEach(item => {
                            item.setAttribute("class", claseAtencion)
                        })
                    }
                }
        }
    });
}
    
    
