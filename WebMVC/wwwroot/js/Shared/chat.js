import { sendMensaje, getConversacion } from '../apis/chat-fetch.js';

var connectionChat;

(async function () {
    const uid = document.querySelector('[name="uid"]').value;
    const idAtencion = document.querySelector('[name="idEntidad"]').value;
   
    await chatRealTime(idAtencion);
    await actualizarConversacion(idAtencion);
    

    window.addEventListener("beforeunload", function (event) {
        if (connectionChat.state === signalR.HubConnectionState.Connected) {
            connectionChat.invoke('UnsubscribeChatAtencion', parseInt(idAtencion)).catch((err) => {
                return console.error(err.toString());
            });
        }
    });
    var msj = document.getElementById('mensaje');
    msj.addEventListener('keypress', function (e) {
         
        msj = $("#mensaje").val().replace(/\r?\n/g, "")
        var keycode = e.keyCode || e.which;
        if (keycode == 13 && msj != "") {
            sendMsj(idAtencion, uid);
        }
       
    });
    document.querySelector('#btnEnviar').onclick = async () => {
        
       sendMsj(idAtencion, uid)
    }

})();
async function sendMsj(idAtencion, uid) {
    var mensaje = document.getElementById('mensaje').value;
    let chat = {
        idAtencion: parseInt(idAtencion),
        idUsuario: parseInt(uid),
        mensaje: mensaje
    };
    var send;
    if (mensaje != "") {
        send = await sendMensaje(chat);
        if (send.status == "OK") {
            document.querySelector("#mensaje").value = "";
            actualizarConversacion(idAtencion);
            connectionChat.invoke("ActualizarConversacion", parseInt(idAtencion)).catch(err => console.error(err));
        }
       
    }
    
   
}
async function actualizarConversacion(idAtencion) {

    var conversacion = await getConversacion(parseInt(idAtencion), uid);


    let divContChat = document.querySelector('#divContChat');
    $("#scroll").animate({ scrollTop: 200000 }, "slow");
    $("#divContChat").empty();
   
    
    conversacion.forEach(item => {
      
        var iniciales;
        if (item.rutaAvatar != "") {

            iniciales = baseUrl + item.rutaAvatar.replace(/\\/g, '/')
        }
        else {
            var cadena = item.nombreCompleto.split(' ');
            var inicialNombre = cadena[0].substring(0, 1);
            var inicialApellido;
            if (cadena[1] == "")
                inicialApellido = cadena[2].substring(0, 1);
            else 
                inicialApellido = cadena[1].substring(0, 1);
        
        
        
            iniciales = inicialNombre + inicialApellido;
        }
        
        
        let divMessageChat = document.createElement('div');
        let datamessage = document.createElement('div');
        let divContData = document.createElement('div');
        let divAvatarChat = document.createElement('div');
        let imgAvatarChat = document.createElement('img');
        imgAvatarChat.setAttribute("id", "imgAvatar")
        let divNombreChat = document.createElement('div');
        let divTiempoRespuesta = document.createElement('div');
                
        let messageUser = document.createElement('div');
        let spanMensaje = document.createElement('span');
          
        datamessage.setAttribute('class', 'data-message');
        divContData.setAttribute('class', 'cont-data');
        divAvatarChat.setAttribute('class', 'avatar-chat');
        divNombreChat.setAttribute('class', 'nombre-chat fuente-accesible');
        messageUser.setAttribute('class', 'message-user fuente-accesible');
        divTiempoRespuesta.setAttribute('class', 'tiempo-respuesta');
        divTiempoRespuesta.innerHTML = item.fechaText;
        if (item.idUsuario == uid) {
            divMessageChat.setAttribute('class', 'message-chat usuario-chat1');
            divNombreChat.innerHTML = "Yo"; //item.nombreCompleto;
            if (item.rutaAvatar != "") {
                imgAvatarChat.src = iniciales;
                divAvatarChat.appendChild(imgAvatarChat)
            }
               
            else
                divAvatarChat.innerHTML = iniciales;
            let spanCheck = document.createElement('span');
            let iCheck = document.createElement('i');
            let iCheck2 = document.createElement('i');
            spanCheck.setAttribute('class', 'check');
            iCheck.setAttribute('class', 'fal fa-check');
            iCheck2.setAttribute('class', 'fal fa-check');
            spanMensaje.innerHTML = item.mensaje;
            
           
            messageUser.appendChild(spanMensaje)
            messageUser.appendChild(spanCheck);
            spanCheck.appendChild(iCheck);
            spanCheck.appendChild(iCheck2);
          
        }
        else {
            divMessageChat.setAttribute('class', 'message-chat usuario-chat2');
            divNombreChat.innerHTML = item.nombreCompleto;
            if (item.rutaAvatar != "") {
                imgAvatarChat.src = iniciales;
                divAvatarChat.appendChild(imgAvatarChat)
            }
                
            else
                divAvatarChat.innerHTML = iniciales;
            spanMensaje.innerHTML = item.mensaje;
            messageUser.appendChild(spanMensaje)
        }
        
        divContData.appendChild(divAvatarChat);
        divContData.appendChild(divNombreChat);
        divContData.appendChild(divTiempoRespuesta);
        datamessage.appendChild(divContData);

        divMessageChat.appendChild(datamessage);
        divMessageChat.appendChild(messageUser);
      
        divContChat.appendChild(divMessageChat);
       


    })
  
}

async function chatRealTime(idAtencion) {
    connectionChat = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/chathub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionChat.on('ActualizarConversacion', (idAtencion) => {
        actualizarConversacion(idAtencion);
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
        toast.configure(options);
        toast.success("Tienes un nuevo mensaje");
        //if (!$("#divChat").is(":visible")) {
        //    toast.success("Tienes un nuevo mensaje");
        //} 
        
    });

    try {
        await connectionChat.start();
    } catch (err) {
        
    }

    if (connectionChat.state === signalR.HubConnectionState.Connected) {
        connectionChat.invoke('SubscribeChatAtencion', parseInt(idAtencion)).catch((err) => {
            return console.error(err.toString());
        });
    }
}