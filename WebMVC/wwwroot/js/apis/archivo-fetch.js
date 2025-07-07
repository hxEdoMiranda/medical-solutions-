const uri = baseUrl + '/agendamientos/archivo';

export async function getArchivosByIdEntidad(idEntidad, codEntidad) {
    try {
        let response = await fetch(`${uri}/getArchivosByIdEntidad?idEntidad=${idEntidad}&codEntidad=${codEntidad}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getArchivoUnico(idEntidad, codEntidad) {
    try {
        let response = await fetch(`${uri}/getArchivoUnico?idEntidad=${idEntidad}&codEntidad=${codEntidad}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
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
export async function deleteFisico(idFile) {
    try {
        let response = await fetch(`${uri}/deleteFisico?id=${idFile}`, {
            method: 'POST'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to delete item.', error);
    }
}