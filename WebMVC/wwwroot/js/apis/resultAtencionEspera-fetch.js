const uri = baseUrl + '/agendamientos/resultAtencionEspera';

export async function getResultAtencionEspera(idAtencion) {
    try {
        //let response = await fetch(`${uri}/getResultAtencionEspera?idAtencion=${idAtencion}`, {
        //    method: 'GET'
        //});
        //let responseJson = await response.json();
        return "";
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}