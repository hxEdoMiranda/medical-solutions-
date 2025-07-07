const uri = baseUrl + '/yapp/yapp';

export async function obtenerToken() {
    try {
        let response = await fetch(`${uri}/GetToken`, {
            method: 'GET',
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get token.', error);
    }

}

export async function getMedicamento(token, text) {
    try {
        let response = await fetch(`${uri}/GetVademecum?token=${token}&text=${token}`, {
            method: 'GET',
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        console.error('Unable to get token.', error);
    }
}


export async function postGL(getLink,token) {
    try {

        let response = await fetch(`${uri}/generateLink?token=${token}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getLink)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}
