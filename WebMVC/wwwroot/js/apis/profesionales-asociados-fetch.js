const uri = baseUrl + '/usuarios/profesionalesAsociados';

export async function getProfesionalesAsociados() {
    try {
        let response = await fetch(`${uri}/getProfesionalesAsociados`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function getProfesionalesAsociadosCentroClinico(idCentroClinico) {
    try {
        let response = await fetch(`${uri}/getProfesionalesAsociadosCentroClinico?idCentroClinico=${idCentroClinico}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

//se utiliza UserId para ambos id's, idMedico y idMedicoAsociado
export async function postProfesionalAsociadosByMedico(idMedico, idMedicoAsociado, idCentroClinico) {

    try {
        let response = await fetch(`${uri}/postProfesionalAsociadosByMedico?idMedico=${idMedico}&idMedicoAsociado=${idMedicoAsociado}&idCentroClinico=${idCentroClinico}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function getProfesionalesAsociadosByIdMedico(idMedico, idCentroClinico = 0) {

    try {
        let response = await fetch(`${uri}/getProfesionalesAsociadosByIdMedico?idMedico=${idMedico}&idCentroClinico=${idCentroClinico}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}