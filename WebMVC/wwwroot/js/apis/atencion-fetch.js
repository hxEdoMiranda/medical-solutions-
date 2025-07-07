// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const uri = baseUrl + '/agendamientos/atenciones';
const uri_pharol = baseUrl + '/yapp/pharol';
const uri_farmalisto = baseUrl + '/yapp/farmalisto';

export async function putAtencionView(id, atencion, tipo, uid, inicioAtencion) {
    try {
        console.log("putAtencionView", atencion);
        let json = JSON.stringify(atencion);
        console.log("jsonAtencion", json);
        let response = await fetch(`${uri}/putAtencionView/${id}&${tipo}&${uid}&${inicioAtencion}`, {
            method: 'PUT',
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

export async function insertAtencionAntecedentes(antecedentesAtencion) {
    try {
        let response = await fetch(`${uri}/insertarAtencionAntecedentes`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(antecedentesAtencion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function insertHipotesisPreliminar(hipotesisPreliminarAtencion) {
    try {
        let response = await fetch(`${uri}/insertarAtencionHipotesisPreliminar`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hipotesisPreliminarAtencion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function insertAtencionAreaAjustes(areaAjustesAtencion) {
    try {
        let response = await fetch(`${uri}/insertarAtencionAreaAjuste`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(areaAjustesAtencion)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getHorasBloqueadasPendientes(uid, idCliente) {
    try {
        let response = await fetch(`${uri}/getAtencionesHomePaciente?accion=A2&idPaciente=${uid}&idCliente=${idCliente}`, {
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

export async function solicitarFirma(atencion, uid) {
    try {
        let response = await fetch(`${uri}/solicitarFirma?uid=${uid}`, {
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

export async function createReport(idAtencion) {
    try {
        let response = await fetch(`${uri}/createReport?idAtencion=${idAtencion}`, {
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
export async function finalizarExterno(idAtencion) {
    try {
        let response = await fetch(`${uri}/finalizarExterno?idAtencion=${idAtencion}`, {
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

export async function getRutaVirtualByAtencion(idAtencion) {
    try {
        let response = await fetch(`${uri}/getRutaVirtualByAtencion?idAtencion=${idAtencion}`, {
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
export async function medicoFirmante(idAtencion, uid) {
    try {
        let response = await fetch(`${uri}/medicoFirmante?idAtencion=${idAtencion}&uid=${uid}`, {
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
export async function putActualizarTriage(atencion) {
    try {
        let response = await fetch(`${uri}/putActualizarTriage`, {
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
export async function putVolverSala(idAtencion) {
    try {
        let response = await fetch(`${uri}/putVolverFila?idAtencion=${idAtencion}`, {
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
export async function inicioAtencionMedico(idAtencion) {
    try {
        let response = await fetch(`${uri}/inicioAtencionMedico?idAtencion=${idAtencion}`, {
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

export async function inicioAtencionPaciente(idAtencion) {
    try {
        let response = await fetch(`${uri}/inicioAtencionPaciente?idAtencion=${idAtencion}`, {
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
export async function postNspPaciente(idAtencion, uid) {
    try {
        let response = await fetch(`${uri}/postNspPaciente?idAtencion=${idAtencion}&uid=${uid}`, {
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
export async function activarBono(id, atencion) {
    try {
        let response = await fetch(`${uri}/putDatosBono/${id}`, {
            method: 'PUT',
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

export async function putDatosBono(id, atencion) {
    try {
        let response = await fetch(`${uri}/putDatosBono/${id}`, {
            method: 'PUT',
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

export async function putValoresAtencion(id, atencion) {
    try {
        let response = await fetch(`${uri}/putValoresAtencion/${id}`, {
            method: 'PUT',
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

export async function getAtencionHistorialPaciente(idPaciente) {
    try {
        let response = await fetch(`${uri}/getHistorialAtencionesByPaciente/${idPaciente}`, {
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


export async function getDataInformes(idAtencion) {
    try {
        let response = await fetch(`${uri}/getDataInformes?idAtencion=${idAtencion}`, {
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

export async function getListSolicitaFirma(uid) {
    try {
        let response = await fetch(`${uri}/getAtencionSolicitaFirma?uid=${uid}`, {
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

export async function getAtencion(id) {
    try {
        let response = await fetch(`${uri}/${id}`, {
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

export async function getDestinatariosAsociados(idAtencion) {
    try {
        let response = await fetch(`${uri}/getDestinatariosAsociados?idAtencion=${idAtencion}`, {
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

export async function getProfesionalesAsociadosByMedico(idAtencion, uid, idEmpresa) {
    try {
        let response = await fetch(`${uri}/getProfesionalesAsociadosByMedico?idAtencion=${idAtencion}&uid=${uid}&idEmpresa=${idEmpresa}`, {
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
/*
export async function getAtencionHistorialPacientePorCriterios(idPaciente, fechaDesde, fechaHasta, peritaje = false) {
    try {
        let response = await fetch(`${uri}/getAtencionHistorialPacientePorCriterios/${idPaciente}/${fechaDesde}/${fechaHasta}/${peritaje}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': '123',
                'Host': 'app.teledoc.cl'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
*/

export async function getAtencionHistorialPacientePorCriterios(idPaciente, fechaDesde, fechaHasta, peritaje = false) {
    try {
        let response = await fetch(`${uri}/getAtencionHistorialPacientePorCriterios/${idPaciente}/${fechaDesde}/${fechaHasta}/${peritaje}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`,
            }
        });

        if (response.ok) {
            let responseJson = await response.json(); 
            return responseJson;
        } else {
            console.error('Error en la consulta a Teledoc:', response.status);
        }
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}



export async function getAtencionEspera(idPaciente, idSesion, idCliente, idEspecialidadFU) {
    try {
        let response = await fetch(`${uri}/getAtencionUrgencia?idUser=${idPaciente}&idSesion=${idSesion}&idCliente=${idCliente}&idEspecialidadFilaUnica=${idEspecialidadFU}`, {
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
//Consumo api farmacia
export async function apiFarmacia(data) {
    try {

        var uriFarmacia = "https://qa.enroll.medismart.live/api/farmacia"
        let response = await fetch(`${uriFarmacia}?data=${JSON.stringify(data)}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //params: {
            //    'data': JSON.stringify(data)
            //}
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getPharol(data) {
    try {
        let response = await fetch(`${uri_pharol}/getFarmaciaPharol`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let responseJson = await response.json();

        return responseJson;
    } catch (error) {

    }
}

export async function getEstadoFilaUnica(accion, idPaciente, idAtencion) {
    try {
        let response = await fetch(`${uri}/getEstadoFilaUnica?accion=${accion}&idpaciente=${idPaciente}&idAtencion=${idAtencion}`, {
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


export async function guardarPharol(id, pharol, yapp, idCliente) {

    try {
        let response = await fetch(`${uri}/guardarPharol?id=${id}&pharol=${pharol}&yapp=${yapp}&idCliente=${idCliente}`, {
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

export async function getLinkFarmalisto(medicamentosFarmalisto) {

    try {
        let response = await fetch(`${uri_farmalisto}/getLinkFarmalisto`, {
            method: 'POST',
            body: JSON.stringify(medicamentosFarmalisto),
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

export async function guardarFarmalisto(id, farmalisto) {
    try {
        let response = await fetch(`${uri}/guardarFarmalisto?id=${id}&farmalisto=${encodeURIComponent(farmalisto)}`, {
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

export async function guardarVitau(id, productos, cantidades) {
    try {
        let response = await fetch(`${uri}/guardarVitau?id=${id}&productos=${encodeURI(productos)}&cantidades=${encodeURI(cantidades)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function grabarCodeMedipass(codeMedipass, idAtencion) {
    try {


        let response = await fetch(`${uri}/grabarCodeMedipass?codeMedipass=${codeMedipass}&idAtencion=${idAtencion}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getHashAtencionExistente(uid, hash, idAtencion) {
    try {


        let response = await fetch(`${uri}/getHashAtencionExistente?uid=${uid}&hash=${hash}&idAtencion=${idAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function GetListaAtenciones(fechaInicio, fechaFin, idEmpresa = 0) {
    try {
        let response = await fetch(`${uri}/GetListaAtenciones?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idEmpresa=${idEmpresa}`, {
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

export async function updateAtencionInmediate(idatencion, estado) {
    try {
        //actualizarEstadoAtencion?idAtencion={idAtencion}
        //let response = await fetch(`${uri}/putAtencionView/${id}&${tipo}&${uid}&${inicioAtencion}`, {
        let response = await fetch(`${uri}/actualizarEstadoAtencion?idAtencion=${idatencion}&estado=${estado}`, {
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

export async function getLinkAtencion(atencion) {
    try {
        var urlCliente = location.origin;
        atencion.token = auth;
        let response = await fetch(`/Admin/GetLinkAtencion?baseUrl=${urlCliente}`, {
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

export async function getAtencionHipotesisPreliminarByIdAtencion(idAtencion) {
    try {
        let response = await fetch(`${uri}/getAtencionHipotesisPreliminarByIdAtencion/${idAtencion}`, {
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

export async function getAtencionAntecedentesByIdAtencion(idAtencion) {
    try {
        let response = await fetch(`${uri}/getAtencionAntecedentesByIdAtencion/${idAtencion}`, {
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

export async function getAtencionAreaAjusteByIdAtencion(idAtencion) {
    try {
        let response = await fetch(`${uri}/getAtencionAreaAjusteByIdAtencion/${idAtencion}`, {
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