const uri = baseUrl + '/agendamientos/chatAtencion';


export async function sendMensaje(chat) {
    try {
        let response = await fetch(`${uri}/sendMensaje`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chat)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getConversacion(idAtencion,uid) {
    try {
        let response = await fetch(`${uri}/getConversacion?idAtencion=${idAtencion}&idUsuario=${uid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}