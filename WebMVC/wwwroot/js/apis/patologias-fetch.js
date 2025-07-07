const uri = baseUrl + '/agendamientos/atencionesPatologias';
const uriPat = baseUrl + '/agendamientos/patologias';

export async function insertAtencionesPatologias(atencionesPatologias) {
    try {
        let response = await fetch(`${uri}/insertAtencionesPatologias`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencionesPatologias)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function insertPatologias(atencionPatologiaInsertar) {
    try {
        let response = await fetch(`${uriPat}/insertPatologias`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencionPatologiaInsertar)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function deletePatologia(id) {
    try {
        let response = await fetch(`${uri}/deletePatologia?id=${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function validaPatologiaGes(cie10) {
    try {
        let response = await fetch(`${uriPat}/validaPatologiaGes?cie10=${cie10}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function validaPatologiaEno(cie10) {
    try {
        let response = await fetch(`${uriPat}/validaPatologiaEno?cie10=${cie10}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}