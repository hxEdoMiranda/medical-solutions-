
var connectionBox;
export async function init() {
    
    await ingresoPacienteRT(uid);
}


async function ingresoPacienteRT(uid) {
    connectionBox = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();
    
    connectionBox.on('IngresarBoxMedico', (id) => {
        var urlBox = window.location;          
        if (urlBox.pathname.includes("/Medico/Atencion_Box")) {        
            const div = document.getElementById('estilo');
            div.className = "status-profesional online";
            document.getElementById('onLine').innerText = 'Online';
        }      

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
        connectionBox.invoke('SubscribeIngresoBoxMedico', uid).catch((err) => {
            return console.error(err.toString());
        });
    }
}



