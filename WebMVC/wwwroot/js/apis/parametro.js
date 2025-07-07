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

const uri = baseUrl + '/agendamientos/parametro';

export async function getParametro(grupo) {
    try {
        let response = await fetch(`${uri}/getParametros?grupo=${grupo}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        responseJson = responseJson.sort((a, b) => a.orden - b.orden);
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getParametroByCodigo(codigo) {
    try {
        let response = await fetch(`${uri}/getParametroByCodigo?codigo=${codigo}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getSelectorEspecialidades(idUsuario, idCliente, tipo, tipoEspecialidad) {
    try {
        let response = await fetch(`${uri}/getSelectorEspecialidades?idUsuario=${idUsuario}&idCliente=${idCliente}&tipo=${tipo}&GrupoEspecialidad=${tipoEspecialidad}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getSelectorCiudades(codigopais) {
    try {
        let response = await fetch(`${uri}/getSelectorCiudades?codigoPais=${codigopais}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}