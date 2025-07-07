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

const uri = baseUrl + '/presencial/snabb';


export async function getEspecialidad(localidad,comuna) {
    try {
        let response = await fetch(`${uri}/GetSpecialties?localidad=${localidad}&city=${comuna}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}

export async function getLocalidades() {
    try {
        let response = await fetch(`${uri}/GetLocations`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get locations.', error);
    }
}


export async function getMedicos(localidad, comuna, especialidad) {
    try {
        let response = await fetch(`${uri}/GetDoctores?localidad=${localidad}&comuna=${comuna}&especialidad=${especialidad}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}
export async function getCalendar(localidad, especialidad, facultativo) {

    
    try {
        let response = await fetch(`${uri}/GetCalendario?localidad=${localidad}&especialidad=${especialidad}&facultativo=${facultativo}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}


export async function confirmaPaciente(data) {
    try {

        let response = await fetch(`${uri}/PostAgendar`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}
