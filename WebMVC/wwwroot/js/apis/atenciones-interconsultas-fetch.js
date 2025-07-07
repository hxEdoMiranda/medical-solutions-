const uri = baseUrl + '/agendamientos/atencionesInterconsultas';


export async function insertAtencionesInterconsultas(idAtencion, idInterconsulta) {
    try {
        let response = await fetch(`${uri}/insertAtencionesInterconsultas/${idAtencion}/${idInterconsulta}`, {
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

export async function asociarAtencionesInterconsultas(idAtencion, idInterconsulta) {
    try {
        let response = await fetch(`${uri}/asociarAtencionesInterconsultas/${idAtencion}/${idInterconsulta}`, {
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


export async function guardarDerivacion(derivacion) {
    try {
        let response = await fetch(`${uri}/PutInterconsulta`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(derivacion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getInterconsultasByIdAtencion(IdAtencion) {
    
    try {
        let response = await fetch(`${uri}/getInterconsultasByIdAtencion/${IdAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function getHorasProximasInterconsultas(IdAtencion) {

    try {
        let response = await fetch(`${uri}/getHorasProximasInterconsultas/${IdAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}
//export async function insertAtencionesAsistencias(formData, uid) {
//    try {
//        let response = await fetch(`${uri}/insertAtencionesAsistencias?uid=${uid}`, {
//            method: 'PUT',
//            body: formData
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to update item.', error);
//    }
//}

//export async function insertAtencionesAsistencias(formData, IdAtencion) {
//    try {

//        let response = await fetch(`${uri}/InsertAtencionesAsistencias?IdAtencion=${IdAtencion}`, {
//            method: 'PUT',
//            body: formData
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to update item.', error);
//    }
//}
