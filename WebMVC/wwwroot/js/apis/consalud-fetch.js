var baseUrl = new URL(window.location.href); //url base para servicios.
if (baseUrl.hostname.includes("localhost")) {
    baseUrl = "http://localhost:7006";
} else if (baseUrl.hostname.includes("desa")) {
    baseUrl = "https://desa.external.medismart.live";
} else if (baseUrl.hostname.includes("qa")) {
    baseUrl = "https://qa.external.medismart.live";
} else {
    baseUrl = "https://external.medismart.live";
}
const uri = baseUrl + '/api/Consalud';

var api = "e19c0d76-801e-4317-88bc-ffe4e54fad71";
export async function validate(idAtencion) {
    try {

        let response = await fetch(`${uri}/validate?idAtencion=${idAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'ApiKey': api
            }
        });
        if (response.ok) {
            let responseJson = await response.json();
            
            return responseJson;
        }
        else {
            return "NOK";
        }
            
    }
    catch (error) {
        return "NOK"
        console.error('Unable to get item.', error);
    }
}

export async function reagendar(idAtencion, idAtencionOld, fechaNuevaAtencion) {
    try {

        let response = await fetch(`${uri}/reschedule?id_agenda=${idAtencion}&old_id_agenda=${idAtencionOld}&date_agenda=${fechaNuevaAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'ApiKey': api
            }
        });
        if (response.ok) {
            let responseJson = await response.json();
            
            return responseJson;
        }
        else {
            return "NOK";
        }
    }
    catch (error) {
        return "NOK";
        console.error('Unable to get item.', error);
    }
}

export async function cancelar(idAtencion) {
    try {

        let response = await fetch(`${uri}/cancel?id_agenda=${idAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'ApiKey': api
            }
        });
        if (response.ok) {
            let responseJson = await response.json();
            
            return responseJson;
        }
        else {
            return "NOK";
        }
    }
    catch (error) {
        return "NOK";
        console.error('Unable to get item.', error);
    }
}