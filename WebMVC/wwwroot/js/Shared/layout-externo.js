
var connectionBox;
export async function init() {
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
            let aud = document.getElementById("myAudio");
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
        
        if(urlBox.pathname.includes("Atencion_Box")) {
            const div = document.getElementById('estilo');
            div.className = "status-profesional online";
            document.getElementById('onLine').innerText = 'Online';    
          
        }
    });

    try {
        await connectionBox.start();
    } catch (err) {
        
    }

    if (connectionBox.state === signalR.HubConnectionState.Connected) {
        connectionBox.invoke('SubscribeIngresoBox', uid, idCliente).catch((err) => {
            return console.error(err.toString());
        });
    }
}



