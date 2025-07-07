const uri = baseUrl + '/usuarios/EmpresaCentroClinico';


export async function getEmpresaCentroClinico(UserId) {
    try {
        let response = await fetch(`${uri}/getEmpresaCentroClinico?UserId=${UserId}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getCentroClinicoByUser(uid) {
    try {
        let response = await fetch(`${uri}/getCentroClinicoByUser?uid=${uid}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getCentroClinicoByMedico(idMedico) {

    try {
        let response = await fetch(`${uri}/getCentroClinicoByMedico?idMedico=${idMedico}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getListaCentrosClinicos() {

    try {
        let response = await fetch(`${uri}/getListaCentrosClinicos`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

