

const uri = baseUrl + '/agendamientos/pacientederivacion';
const uri_especialidad = baseUrl + '/agendamientos/especialidades';


export async function derivaEspecialidad(pacienteDerivacion) {
    try {
        let response = await fetch(`${uri}/pacienteDerivacion`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacienteDerivacion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function eliminarDerivacion(uid) {
    try {
        await fetch(`${uri}/pacienteDerivacionDelete/${uid}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function insertEspecialidadDerivacionAtencion(idAtencion, idEspecialidad) {
    try {
        let response = await fetch(`${uri_especialidad}/insertEspecialidadDerivacionAtencion?idAtencion=${idAtencion}&idEspecialidad=${idEspecialidad}`, {
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

export async function getEspecialidadesByTextAndRut(text, rut) {
    try {
        let response = await fetch(`${uri_especialidad}/getEspecialidadesByTextAndRut?text=${text}&rut=${rut}`, {
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