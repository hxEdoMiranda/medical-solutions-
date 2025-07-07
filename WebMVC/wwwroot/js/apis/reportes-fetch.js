const uri = baseUrl + '/reportes/reportes';

export async function getInformeMedico(idAtencion,uid) {
    //try {
        let response = await fetch(`${uri}/getInformeMedico?id=${idAtencion}&uid=${uid}`, {
            method: 'GET'
        });
    //    let responseJson = await response.json();
    //    return responseJson;
    //} catch (error) {
    //    console.error('Unable to get item.', error);
    //}
}

export async function deleteFile(idFile) {
    try {
        let response = await fetch(`${uri}/${idFile}`, {
            method: 'POST'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to delete item.', error);
    }
}