const uri = baseUrl + '/agendamientos/atencionesAsistencias';


export async function insertAtencionesAsistencias(atencionesAsistencias) {
    try {
        let response = await fetch(`${uri}/insertAtencionesAsistencias`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencionesAsistencias)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function getTipoAtencionesAsistencias(IdAtencion) {
    
    try {
        let response = await fetch(`${uri}/getTipoAsistenciaById/${IdAtencion}`, {
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
