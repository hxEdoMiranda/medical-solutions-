var baseUrlEniax = new URL(window.location.href);
if (baseUrlEniax.hostname.includes("qa")) {
    baseUrlEniax = baseUrlEniax.hostname.includes("localhost") ? "https://localhost:44332" : "https://qa.eniax.medismart.live";
} else {
    baseUrlEniax = baseUrlEniax.hostname.includes("localhost") ? "https://localhost:44332" : "https://eniax.medismart.live";
}

const uri = baseUrlEniax + '/Medismart/';
var api = "748cdad7-6ddb-439e-856c-c1345708300e";
var myHeaders = new Headers();
myHeaders.append("ApiKey", api);
myHeaders.append("Content-Type", "text/plain");
export async function enviarCitaEniax(idAtencion) {
    try {
        
        //var requestOptions = {
        //    method: 'GET',
        //    headers: myHeaders,
        //    redirect: 'follow',
        //};
        //fetch(`${uri}EnviarCitaEniax?IdAtencion=${idAtencion}`, requestOptions)
        //    .then(response => response.text())
       

        let response = await fetch(`${uri}EnviarCitaEniax?IdAtencion=${idAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ApiKey': api
            }
        });
        let responseJson = await response.json();
        
        return responseJson;
    }
    catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function cambioEstado(idAtencion, estado) {
    try {
        //var requestOptions = {
        //    method: 'GET',
        //    headers: myHeaders,
        //    body: raw,
        //    redirect: 'follow'
        //};
        //fetch(`${uri}CambioEstadoEniax?idAtencion=${idAtencion}&estado=${estado}`, requestOptions)
        //    .then(response => response.text())
        
        let response = await fetch(`${uri}CambioEstadoEniax?idAtencion=${idAtencion}&estado=${estado}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ApiKey': api
            }
        });
        let responseJson = await response.json();
        
        return responseJson;

    }
    catch (error) {
        console.error('Unable to get item.', error);
    }
}

