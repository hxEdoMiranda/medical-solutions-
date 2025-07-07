const uri = baseUrl + '/loguso/LogUsoServicio';

export async function logUsoServicio(idTipoServicio, idAccionServicio, urL_Proceso) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "idTipoServicio": idTipoServicio,
            "idAccionServicio": idAccionServicio,
            "idUsuario": uid,
            "urL_Proceso": urL_Proceso,
            "idCliente": idCliente
        });

        let response = await fetch(`${uri}`, {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Your activity could not be logged.', error);
    }
}

