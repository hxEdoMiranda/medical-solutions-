const uri = baseUrl + '/agendamientos/convenios';

export async function getConvenios() {
    try {
        let response = await fetch(`${uri}/getConvenios`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function getConveniosCentroClinico() {
    try {
        let response = await fetch(`${uri}/getConveniosCentroClinico`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getConveniosById(id) {
    try {
        let response = await fetch(`${uri}/getConveniosById?id=${id}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function validarConvenio(idConvenio, fechaTermino) {
    try {
        let response = await fetch(`${uri}/validarConvenio?idConvenio=${idConvenio}&fechaTermino=${fechaTermino}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getResumenConvenio() {
    try {
        let response = await fetch(`${uri}/getResumenConvenio`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function EditConvenio(formData, uid) {
    try {
        let response = await fetch(`${uri}/updateConvenio?uid=${uid}`, {
            method: 'PUT',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function addConvenioEspecialidades(idEspecialidad,idConvenio,reglaServicio) {
    try {
        let response = await fetch(`${uri}/addConvenioEspecialidades?idEspecialidad=${idEspecialidad}&idConvenio=${idConvenio}&reglaServicio=${reglaServicio}`, {
            method: 'POST'});
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function getEspecialidadesByTipoProfesion(tipo, idConvenio) {
    try {
        let response = await fetch(`${uri}/getEspecialidadesByTipoProfesion/${tipo}/${idConvenio}`, {
            method: 'GET',
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}


const uriAgendar = baseUrl + '/agendamientos/Agendar';
export async function getTipoProfesionales() {
    try {
        let response = await fetch(`${uriAgendar}/getTipoProfesionales`, {
            method: 'GET',
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}