const uri = baseUrl + '/agendamientos/programasalud';

//Inscripcion paciente en programa Salud
export async function ingresoProgramaSalud(idPrograma, idCliente, uid) {
    try {

        let response = await fetch(`${uri}/ingresoProgramaSalud?idPrograma=${idPrograma}&idCliente=${idCliente}&idPaciente=${uid}`, {
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

export async function putActualizarCambioEspecialista(dataBody) {
    try {
        let response = await fetch(`${uri}/putActualizarCambioEspecialista`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function postRecurrencia(recurrencia) {
    try {
        let response = await fetch(`${uri}/programaSaludRecurrencia`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recurrencia)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

//Programa Salud Cuestionario
export async function ProgramaSaludCuestionario(idProgramaSalud, uid, edad, sexo, peso, altura, tabaco, actividad, especificar, idCliente) {
    try {
        let response = await fetch(`${uri}/insertProgramaSaludCuestionario?idProgramaSalud=${idProgramaSalud}&idPaciente=${uid}&edad=${edad}&sexo=${sexo}&peso=${peso}&altura=${altura}&tabaco=${tabaco}&actividad=${actividad}&especificar=${especificar}&idCliente=${idCliente}`, {
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

export async function getProgramaSaludCuestionario(idPrograma, idCliente, uid) {
    try {
        const response = await fetch(`${uri}/getProgramaSaludCuestionario?idPrograma=${idPrograma}&idCliente=${idCliente}&uid=${uid}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting data:', error);
    }
}



export async function UpdateProgramaSaludCuestionario(idProgramaSalud, uid, edad, sexo, peso, altura, tabaco, actividad, especificar, idCliente,id) {
    try {
        let response = await fetch(`${uri}/updateProgramaSaludCuestionario?idProgramaSalud=${idProgramaSalud}&idPaciente=${uid}&edad=${edad}&sexo=${sexo}&peso=${peso}&altura=${altura}&tabaco=${tabaco}&actividad=${actividad}&especificar=${especificar}&idCliente=${idCliente}&id=${id}`, {
            method: 'PUT',
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

//Programa Salud Cuestionario Pittsburg
export async function InsertProgramaSaludCuestionarioPittsburg(dataBody) {
    try {
        let response = await fetch(`${uri}/insertProgramaSaludCuestionarioPittsburg`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody) });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function insertCicloProgramaSalud(programaSaludCiclo) {
    try {
        let response = await fetch(`${uri}/programaSaludCiclo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programaSaludCiclo)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function getProgramaSaludCiclo(idUsuario, idCliente, idProgramaSaludPaciente) {
    try {
        let response = await fetch(`${uri}/getIdProgramaSaludCiclo/${idUsuario}/${idCliente}/${idProgramaSaludPaciente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getProgramaSaludRecurrencia(idProgramaCiclo, idEspecialidad) {
    try {
        let response = await fetch(`${uri}/getProgramaSaludRecurrencia/${idProgramaCiclo}/${idEspecialidad}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function insertAtencionEspecialidad(atencionEspecialidad) {
    try {
        let response = await fetch(`${uri}/insertarProgramaSaludEspecialidad`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencionEspecialidad)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}


export async function InsertProgramaSaludFormularioEnfermera(formularioEnfermera) {
    try {
        let response = await fetch(`${uri}/insertProgramaSaludFormularioEnfermera`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formularioEnfermera)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to insert formularioEnfermera.', error);
    }
}

export async function getProgramaSaludFormularioEnfermera(idUsuario, idCliente, idAtention) {
    try {
        let response = await fetch(`${uri}/getProgramaSaludFormularioEnfermera?idCliente=${idCliente}&uid=${idUsuario}&idAtention=${idAtention}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
