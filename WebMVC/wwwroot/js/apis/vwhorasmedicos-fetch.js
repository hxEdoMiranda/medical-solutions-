// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const uri = baseUrl + '/agendamientos/VwHorasMedicos';
const uriCentro = baseUrl + '/agendamientos/VwHorasMedicosCentroClinico';

export async function getVwHorasMedicosByMedic(uid, fechaQuery, dateType) {
    try {
        let response = await fetch(`${uri}/getVwHorasMedicosByMedic?uid=${uid}&fechaQuery=${fechaQuery}&dateType=${dateType}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function getHoraMedicoByCalendar(idMedico, fechaSeleccion, idConvenio, fechaSeleccionEstatica, uid) {
   try {
        let response = await fetch(`${uri}/getHoraMedicoByCalendar?idMedico=${idMedico}&fechaSeleccion=${fechaSeleccion}&idConvenio=${idConvenio}&fechaSeleccionEstatica=${fechaSeleccionEstatica}&idPaciente=${uid}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getProgramaSaludHoras(idMedico, fechaSeleccion, idConvenio, fechaSeleccionEstatica, uid) {
   try {
       let response = await fetch(`${uri}/getProgramaSaludHoras?idMedico=${idMedico}&fechaSeleccion=${fechaSeleccion}&idConvenio=${idConvenio}&fechaSeleccionEstatica=${fechaSeleccionEstatica}&idPaciente=${uid}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getProgramaSaludHorasCalendario(idMedico, fechaSeleccion, idConvenio, fechaSeleccionEstatica, uid) {
    try {
        let response = await fetch(`${uri}/getProgramaSaludHorasCalendario?idMedico=${idMedico}&fechaSeleccion=${fechaSeleccion}&idConvenio=${idConvenio}&fechaSeleccionEstatica=${fechaSeleccionEstatica}&idPaciente=${uid}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getVwMedico(idMedico) {
    try {
        let response = await fetch(`${uri}/getViewMedicos?idMedico=${idMedico}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function getAtencionPendienteSala(idPaciente, idEspecialidad, idCliente) {
    try {
        
        let response = await fetch(`${uri}/getAtencionPendienteSala?idPaciente=${idPaciente}&idEspecialidad=${idEspecialidad}&idCliente=${idCliente}`,{
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getAgendaDiariaPeritaje(idConvenio, fecha, idEspecialidad, estado) {
    try {

        let response = await fetch(`${uri}/getAgendaDiariaPeritaje?idConvenio=${idConvenio}&fecha=${fecha}&idEspecialidad=${idEspecialidad}&estado=${estado}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getResumenMedicosPorEspecialidad(fechaQuery,idConvenio) {
    try {
        let response = await fetch(`${uri}/getResumenMedicosPorEspecialidad?fechaQuery=${fechaQuery}&idConvenio=${idConvenio}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function getResumenDetalleMedicosPorEspecialidad(fechaQuery) {
    try {
        let response = await fetch(`${uri}/getResumenDetalleMedicosPorEspecialidad?fechaQuery=${fechaQuery}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getResumenDetalleMedicosPorEspecialidadConvenio(fechaQuery,idConvenio) {
    try {
        let response = await fetch(`${uri}/getResumenDetalleMedicosPorEspecialidadConvenio?fechaQuery=${fechaQuery}&idConvenio=${idConvenio}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getResumenEstadoMedicosyGrupos() {
    try {
        let response = await fetch(`${uri}/getResumenEstadoMedicosyGrupos`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function enviarAgendaMedico(uid,email,nombre ) {
    try {
        let response = await fetch(`${uri}/enviarAgendaMedico?uid=${uid}&email=${email}&nombre=${nombre}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getVwHorasMedicosBloquesHorasByMedic(uid, tipoLista) {
    try {
        let response = await fetch(`${uri}/getVwHorasMedicosBloquesHorasByMedic?uid=${uid}&tipoLista=${tipoLista}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getVwHorasMedicoByAtencion(idAtencion) {
    try {
        let response = await fetch(`${uri}/getVwHorasMedicoByAtencion?idAtencion=${idAtencion}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function getProximasHorasPaciente(idPaciente) {
    try {
        let response = await fetch(`${uri}/getProximasHorasPaciente?uid=${idPaciente}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getVwHorasMedicosBloquesHorasByVistaPaciente(uid) {
    try {
        let response = await fetch(`${uri}/getVwHorasMedicosBloquesHorasByVistaPaciente?uid=${uid}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getHoraMedico(idBloque, fecha, idPaciente) {
    try {
        let response = await fetch(`${uri}/getVwHorasMedicos/${idBloque}&${fecha}&${idPaciente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function generarHorasMedico(formData) {
    
    try {
        let response = await fetch(`${uri}/generarHorasMedico`, {
            method: 'POST',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function generarHorasMedicoConvenio(formData) {

    try {
        let response = await fetch(`${uri}/generarHorasMedicoConvenio`, {
            method: 'POST',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}


export async function eliminaHoraMedico(formData) {
    
    try {
        let response = await fetch(`${uri}/eliminaHoraMedico`, {
            method: 'POST',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}
//eliminacion de agenda por convenio
export async function deleteAgendaHoraMedico(idConvenio, fecha) {

    try {
        let response = await fetch(`${uri}/deleteAgendaHoraMedico?idConvenio=${idConvenio}&fecha=${fecha}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

//eliminar agenda por rango de fecha
export async function eliminarAgendaRango(formData) {

    try {
        // let response = await fetch(`${uri}/eliminarAgendaRango?idprofesional=${idProfesional}&fecha=${fecha}&horaDesde=${horaDesde}&horaHasta=${horaHasta}`, {
        let response = await fetch(`${uri}/eliminarAgendaRango`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function getVwHorasMedicoByAtencionCentro(idAtencion) {
    try {
        let response = await fetch(`${uriCentro}/getVwHorasMedicoByAtencionCentro?idAtencion=${idAtencion}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
