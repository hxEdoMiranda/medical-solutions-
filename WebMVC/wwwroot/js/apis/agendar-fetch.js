const uri = baseUrl + '/agendamientos/agendar';
const uricc = baseUrl + '/agendamientos/agendarcentroclinico';

export async function getMedicos(idEspecialidad, idBloque,fecha) {
    try {
        let response = await fetch(`${uri}/getMedicos/${idEspecialidad}/${idBloque}/${fecha}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getAgendaMedicoInicial(fecha,idMedico,boolManana,inicial, c, idPaciente, tipoHorario = 0) {
    try {
        let response = await fetch(`${uri}/getAgendaMedicoInicial?fecha=${fecha}&idMedico=${idMedico}&maniana=${boolManana}&inicial=${inicial}&c=${c}&idPaciente=${idPaciente}&tipoHorario=${tipoHorario}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getEspecialidadByTipoProfesional(tipoProfesional) {
    try {

        let response = await fetch(`${uri}/getEspecialidadesByTipoProfesional/${tipoProfesional}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getEspecialidadByTipoProfesionalCentroClinico(tipoProfesional, centroClinico) {
    try {

        let response = await fetch(`${uricc}/getEspecialidadesByTipoProfesional/${tipoProfesional}/${centroClinico}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getEspecialidadesConvenio(idConvenio) {
    try {
         
        let response = await fetch(`${uri}/getEspecialidadesConvenio/${idConvenio}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


//getAgendaByIdMedicoHora/{idMedicoHora}
export async function getAgendaByIdMedicoHora(idMedicoHora) {
    try {

        let response = await fetch(`${uri}/getAgendaByIdMedicoHora/${idMedicoHora}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;

    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getMedicosHoraProxima(paraEspecialidad, idEspecialidad, idBloque, userId, fecha, idCliente, tipoEspecialidad) {
    try {
        let response = await fetch(`${uri}/getMedicosHoraProxima?paraEspecialidad=${paraEspecialidad}&idEspecialidad=${idEspecialidad}&idBloque=${idBloque}&userId=${userId}&fecha=${fecha}&idCliente=${idCliente}&tipoEspecialidad=${tipoEspecialidad}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function getMedicosHoraProximaValida(userId, idMedicoHora) {
    try {
        let response = await fetch(`${uri}/getMedicosHoraProximaValida?userId=${userId}&idMedicoHora=${idMedicoHora}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function getMedicosbyEspecialidad(idEspecialidad) {
    try {
        let response = await fetch(`${uri}/getMedicosbyEspecialidad/${idEspecialidad}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getMedicosProgramaSaludbyEspecialidad(idEspecialidad) {
    try {
        let response = await fetch(`${uri}/getMedicosProgramaSaludbyEspecialidad/${idEspecialidad}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function putEliminarAtencion(idAtencion, uid, nsp = false) {
    try {
        let response = await fetch(`${uri}/putEliminarAtencion?idAtencion=${idAtencion}&uid=${uid}&nsp=${nsp}`, {
            method: 'PUT',
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

export async function getTriageNivel() {
    try {
        let response = await fetch(`${uri}/getTriageNivel`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }


}
export async function getTriageMolestia() {
    try {
        let response = await fetch(`${uri}/getTriageMolestia`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }


}
export async function getTriageTiempo() {
    try {
        let response = await fetch(`${uri}/getTriageTiempo`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }


}

//getAtencionByIdMedicoHora/{IdMedicoHora}/{IdPaciente}
export async function getAtencionByIdMedicoHora(idMedicoHora, idPaciente) {
    
    try {
        let response = await fetch(`${uri}/getAtencionByIdMedicoHora/${idMedicoHora}/${idPaciente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }


}

export async function getAtencionConfirma(idAtencion) {

    try {
        let response = await fetch(`${uri}/getAtencionConfirma?idAtencion=${idAtencion}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }


}

export async function putAgendarMedicosHoras(atencion, idMedico, uid) {
    try {
        
        let response = await fetch(`${uri}/putAgendarMedicosHoras/${idMedico}&${uid}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}
export async function putAgendarMedicosHorasList(atenciones) {
    try {
        
        let response = await fetch(`${uri}/putAgendarMedicosHorasList`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atenciones)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}
export async function reagendarApp(atencion, idMedico, uid) {
    try {

        let response = await fetch(`${uri}/reagendar?idMedico=${idMedico}&uid=${uid}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function revertReagenda(idAtencionAnterior, idAtencionNueva, uid) {
    try {

        let response = await fetch(`${uri}/revertReagenda?idAtencionAnterior=${idAtencionAnterior}&idAtencionNueva=${idAtencionNueva}&uid=${uid}`, {
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
export async function confirmaPaciente(idAtencion, uid) {
    try {

        let response = await fetch(`${uri}/confirmarAtencion?idAtencion=${idAtencion}&uid=${uid}`, {
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

export async function getMedicosbyEspecialidadCentroClinico(idEspecialidad, idConvenio) {
    try {
        let response = await fetch(`${uricc}/getMedicosbyEspecialidadCentroClinico/${idEspecialidad}/${idConvenio}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function putActualizarAtencionExamenenesPayzen(datosAtencionExamenes) {
    try {

        let response = await fetch(`${uri}/putActualizarAtencionExamenenesPayzen/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosAtencionExamenes)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function reagendarAppCentro(atencion, idMedico, uid) {
    try {

        let response = await fetch(`${uricc}/reagendarAppCentro?idMedico=${idMedico}&uid=${uid}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

/*Método Crear carrito de compras*/
export async function confirmarEstadoAtencionWow(idAtencion, estado) {
    try {
        let response = await fetch(`${uri}/cambiarEstado/${idAtencion}/${estado}`, {
            method: 'PUT',
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

export async function enviarConfirmacionWow(idAtencion) {
    try {
        let response = await fetch(`${uri}/enviarConfirmacionWow/${idAtencion}`, {
            method: 'PUT',
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

