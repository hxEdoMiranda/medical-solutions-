import { sendMensaje, getConversacion } from '../apis/chat-fetch.js';

var connectionNotificaciones;

(async function () {
    console.log("notificacion.js load");
    const uid = document.querySelector('[name="uid"]').value;
    const idAtencion = document.querySelector('[name="idEntidad"]').value;
   
    await notificationRealTime(idAtencion);
    

    window.addEventListener("beforeunload", function (event) {
        if (connectionNotificaciones.state === signalR.HubConnectionState.Connected) {
            connectionNotificaciones.invoke('UnsubscribeChatAtencion', parseInt(idAtencion)).catch((err) => {
                return console.error(err.toString());
            });
        }
    });

})();
async function sendNotificacionGES(idAtencion, patologia) {
    console.log("sendNotificacionGES", idAtencion);
    connectionNotificaciones.invoke("EnviarNotificacionPaciente", JSON.stringify({ idAtencion: "" + idAtencion, mensaje: "Debido a tu patologia. Tu medico te llenara un formulario GES" + (patologia? (". Por " + patologia): "") })).catch(err => console.error(err));
}
async function sendNotificacionENO(idAtencion, patologia) {
    console.log("sendNotificacionENO", idAtencion);
    connectionNotificaciones.invoke("EnviarNotificacionPaciente", JSON.stringify({ idAtencion: "" + idAtencion, mensaje: "Debido a tu patologia. Tu medico te llenara un formulario ENO" + (patologia ? (". Por " + patologia) : "" ) })).catch(err => console.error(err));
}

window.sendNotificacionGES = sendNotificacionGES;
window.sendNotificacionENO = sendNotificacionENO;
    
   


async function notificationRealTime(idAtencion) {
    console.log("notificationRealTime", idAtencion);
    connectionNotificaciones = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/notificationhub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();
    var options = {
        autoClose: true,
        progressBar: true,
        enableSounds: true,
        transition: "slideUpFade",
        sounds: {
            info: "/Toasty.js-master/dist/sounds/info/1.mp3",
            // path to sound for successfull message:
            success: "/Toasty.js-master/dist/sounds/success/1.mp3",
            // path to sound for warn message:
            warning: "/Toasty.js-master/dist/sounds/info/1.mp3",
            // path to sound for error message:
            error: "/Toasty.js-master/dist/sounds/info/1.mp3",
        },
    };
    var toast = new Toasty(options);

    connectionNotificaciones.on('notificacionImed', (data) => {
        let dataNotificacion = JSON.parse(data);
        console.log("notificacionImed", dataNotificacion);
        

        toast.configure(options);
        toast.info(dataNotificacion.mensaje);

    });

    try {
        await connectionNotificaciones.start();
    } catch (err) {
        
    }

    if (connectionNotificaciones.state === signalR.HubConnectionState.Connected) {
        connectionNotificaciones.invoke('SubscribeImedAtencion', parseInt(idAtencion)).catch((err) => {
            return console.error(err.toString());
        });
    }
}