const uri = baseUrl + '/agendamientos/preAtencion';

export async function actualizarPreAtencion(idUser,idSesion) {
    try {
        let response = await fetch(`${uri}/actualizarPreAtencion?idUser=${idUser}&idSesion=${idSesion}`, {
            method: 'POST',
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