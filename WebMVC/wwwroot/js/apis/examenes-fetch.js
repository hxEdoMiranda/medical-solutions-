const uri = baseUrl + '/agendamientos/atencionesExamenes';
const uri_examenes = baseUrl + '/agendamientos/Examenes';
const uri_archivo = baseUrl + '/agendamientos/archivo';


export async function insertAtencionesExamenes(atencionesExamenes) {
    try {
        let response = await fetch(`${uri}/insertAtencionesExamenes`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencionesExamenes)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function deleteExamen(id) {
    try {
        let response = await fetch(`${uri}/deleteExamen?id=${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getExamenesPreventivos(uid, edad, peso, estatura, genero,idCliente) {
    try {
        let response = await fetch(`${uri_examenes}/getExamenesPreventivos?uid=${uid}&edad=${edad}&peso=${peso}&estatura=${parseFloat(estatura).toFixed(2)}&genero=${genero}&idCliente=${idCliente}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function saveHistorialExamenesPreventivos(examenesPreventivos) {
    try {
        let response = await fetch(`${uri_examenes}/saveHistorialExamenesPreventivos`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(examenesPreventivos)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getDataExamenPreventivo(idHistorial) {
    try {
        let response = await fetch(`${uri_examenes}/getExamenPreventivo/${idHistorial}`, {
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
        return false;
    }
}

export async function getArchivoExamen(idEntidad, codEntidad) {
    try {
        let response = await fetch(`${uri_archivo}/GetArchivoByCodigoEntidad?idEntidad=${idEntidad}&codEntidad=${codEntidad}`, {
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

export async function getListExamenesPreventivos(idEntidad, codEntidad, accion) {
    try {
        let response = await fetch(`${uri_archivo}/getArchivosByIdEntidad?idEntidad=${idEntidad}&codEntidad=${codEntidad}&accion=${accion}`, {
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

export async function addHistorialExamenesOrientacion(orientacionExamenes) {
    try {        
        let response = await fetch(`${uri_examenes}/addHistorialExamenesOrientacion`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orientacionExamenes)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getRegiones(codigoPais) {
    try {
        let response = await fetch(`${uri_examenes}/getRegiones?codigoPais=${codigoPais}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function getComunas(idRegion, codigoPais) {
    
    try {
        let response = await fetch(`${uri_examenes}/getComunas/${idRegion}/${codigoPais}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getCiudadesById(idCiudad) {

    try {
        let response = await fetch(`${uri_examenes}/getCiudadesById?idCiudad=${idCiudad}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getComunasById(idRegion) {

    try {
        let response = await fetch(`${uri_examenes}/getComunasById?idRegion=${idRegion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getExamenes(codigoPais, isScotia) {

    try {
        let response = await fetch(`${uri_examenes}/getAsistenciaExamenes/${codigoPais}/${isScotia}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function validarExamenesPreventivos(uid) {
    try {
        let response = await fetch(`${uri_examenes}/getValidaExamenesPreventivos/${uid}`, {
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
        return false;
    }
}
export async function rotacionFirmaMedica() {
    try {
        let response = await fetch(`https://r9uesj18g3.execute-api.us-east-1.amazonaws.com/default/historialExamPrev-API`, {
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
        return false;
    }
}
