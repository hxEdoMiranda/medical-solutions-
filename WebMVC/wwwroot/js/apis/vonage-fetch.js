const uri = baseUrl + '/agendamientos/vonage';

export async function enterSession(idAtencion, user) {
    try {
        let response = await fetch(`${uri}/token/${idAtencion}/${user}`, {
            method: 'POST'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to enter session.', error);
    }
}
