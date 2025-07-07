const uri = baseUrl + '/agendamientos/reporteEnfermeria';


export async function historialReporteEnfermeria(idPaciente) {
    try {
        let response = await fetch(`${uri}/historialReporteEnfermeria?idPaciente=${idPaciente}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function updateReporteEnfermeria(formData, uid) {
    ;
    try {
        let response = await fetch(`${uri}/updateReporteEnfermeria?uid=${uid}`, {
            method: 'POST',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

