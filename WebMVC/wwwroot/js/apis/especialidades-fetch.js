var baseUrl = new URL(window.location.href); //url base para servicios.
if (baseUrl.hostname.includes("localhost")) {
    baseUrl = "http://localhost:7000";
} else if (baseUrl.hostname.includes("desa")) {
    baseUrl = "https://desa.services.medismart.live";
} else if (baseUrl.hostname.includes("t.qa")) {
    baseUrl = "https://test.services.medismart.live";
} else if (baseUrl.hostname.includes("qa")) {
    baseUrl = "https://qa.services.medismart.live";
} else if (baseUrl.hostname.includes("staging")) {
    baseUrl = "https://staging.services.medismart.live";
} else {
    baseUrl = "https://services.medismart.live";
}


const uri = baseUrl + '/agendamientos/especialidades';

export async function getEspecialidadInmediata(uid,idCliente) {
    try {
        let response = await fetch(`${uri}/getEspecialidadInmediata?uid=${uid}&idCliente=${idCliente}`, { 
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

