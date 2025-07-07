var baseUrl = new URL(window.location.href); //url base para servicios.

if (baseUrl.hostname.includes("localhost")) {
    baseUrl = "http://localhost:7000";
} else if (baseUrl.hostname.includes("desa")) {
    baseUrl = "https://desa.services.medismart.live";
} else if (baseUrl.hostname.includes("t.qa")) {
    baseUrl = "https://test.services.medismart.live";
} else if (baseUrl.hostname.includes("qa")) {
    baseUrl = "https://qa.services.medismart.live";
} else if (baseUrl.hostname.includes("staging")) {
    baseUrl = "https://staging.services.medismart.live";

} else {
    baseUrl = "https://services.medismart.live";
}

const uri = baseUrl + '/nom035';
const uriocupacional = baseUrl + '/medicinaocupacional';


export async function getEspecialidad(localidad,comuna) {
    try {
        let response = await fetch(`${uri}/GetSpecialties?localidad=${localidad}&city=${comuna}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}

export async function getLocalidades() {
    try {
        let response = await fetch(`${uri}/GetLocations`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get locations.', error);
    }
}


export async function getMedicos(localidad, comuna, especialidad) {
    try {
        let response = await fetch(`${uri}/GetDoctores?localidad=${localidad}&comuna=${comuna}&especialidad=${especialidad}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}
export async function getCalendar(localidad, especialidad, facultativo) {

    
    try {
        let response = await fetch(`${uri}/GetCalendario?localidad=${localidad}&especialidad=${especialidad}&facultativo=${facultativo}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}

export async function insertNewTests(idpersona) {
    try {
        let response = await fetch(`${uriocupacional}/InsertNewTests/${idpersona}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}


export async function consultarCuestionario(data) {
    try {

        let response = await fetch(`${uri}/ConsultarCuestionario`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function guardarRespuesta(data) {
    try {

        let response = await fetch(`${uri}/GuardarRespuesta`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function InsertEncuestaComentario(data2) {
    try {
       // console.log(JSON.stringify(data2));
        let response = await fetch(`${uri}/InsertEncuestaComentario`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        });
       // let responseJson = await response.json();
      //  return responseJson;
        return response;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function guadarRespuestasOcupacional(idPregunta, idRespuesta, idpersona, textInput) {
    try {
        let response = await fetch(`${uriocupacional}/GuardarRespuestacupacional/${idPregunta}/${idRespuesta}/${idpersona}/${textInput}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}

export async function getOccupationalMedicineTestResults(idpersona){
    try {
        let responseAudiometria = await fetch(`${uriocupacional}/CalcularResultadosAudiometria/${idpersona}`, {
            method: 'GET'
        });
        let responsePsicologia = await fetch(`${uriocupacional}/ConsultarResultadosPsicologia/${idpersona}`, {
            method: 'GET'
        });
        let responseVisiometira = await fetch(`${uriocupacional}/CalcularResultadosVisiometria/${idpersona}`, {
            method: 'GET'
        });
        let responseJson = {
            Audiometria: await responseAudiometria.json(),
            Psicologia: await responsePsicologia.json(),
            Visiometria: await responseVisiometira.json(),
        } 
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}

export async function validateTestOcupacionalForCreatePdf(id, uid) {
    try {
        var idClienteInt = parseInt(idCliente);
        let response = await fetch(`${uriocupacional}/ValidateTestOcupacional/${id}/${uid}/${idClienteInt}`, {
            method: 'GET'
        });
        return response;

    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}



export async function terminarCuestionario(data) {
    try {

        let response = await fetch(`${uri}/TerminarCuestionario`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function resultadosCuestionario1(data) {
    try {

        let response = await fetch(`${uri}/ResultadosIndividualCuestionario1`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function resultadosCuestionario2(data) {
    try {

        let response = await fetch(`${uri}/ResultadosIndividualCuestionario2`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function resultadosCuestionario3(data) {
    try {

        let response = await fetch(`${uri}/ResultadosIndividualCuestionario3`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}



export async function GuardarPaciente(data) {
    try {

        let response = await fetch(`${uri}/CrearUsuario`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}


export async function ValidaGuardaEmpresaxUsuario(idPaciente) {
    try {
        let response = await fetch(`${uri}/validarRegistrarEmpresaxPaciente/${idPaciente}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function PermisoComentarioEmpresa() {
    try {
        
        let response = await fetch(`${uri}/PermisoComentarioEmpresa/${idCliente}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {

            let idC = await response.text();
            return idC; // Devuelve id_Cliente obtenido de la respuesta
        } else {
            console.error('Error en la solicitud: ', response.status);
            return null; 
        }
    } catch (error) {
        console.error('Error al obtener el item: ', error);
        return null; 
    }
}
