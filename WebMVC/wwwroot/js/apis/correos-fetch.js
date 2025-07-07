// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
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
}
else {
    baseUrl = "https://services.medismart.live";
}

const uri = baseUrl + '/correos/sendEmail';

export async function enviarInforme(idAtencion, baseUrl, idCliente) {
  
    try {
        let response = await fetch(`${uri}/enviarInforme?idAtencion=${idAtencion}&baseUrl=${baseUrl}`, {
            method: 'POST'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function enviarInformeMedico(idAtencion, baseUrl) {
    try {
        let response = await fetch(`${uri}/enviarInformeMedico?idAtencion=${idAtencion}&baseUrl=${baseUrl}`, {
            method: 'POST'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function enviarAtencionAsistencia(data) {
    try {
        let response = await fetch(`${uri}/enviarAtencionAsistencia`, {
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
        console.error('Unable to get item.', error);
    }
}

export async function enviarCorreoExamedi(objListaCorreo) {
    try {
        let response = await fetch(`${uri}/enviarCorreoExamedi`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objListaCorreo)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function enviarCorreoWowMX(objListaCorreo) {
    try {
        let response = await fetch(`${uri}/enviarCorreoWowMX`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objListaCorreo)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function enviarExamenesAsistencia(idHistorialAsistencia, uid) {

    try {
        let response = await fetch(`${uri}/enviarExamenesAsistencia?idHistorialAsistencia=${idHistorialAsistencia}&uid=${uid}`, {
            method: 'POST'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function enviarCorreoSuscripcionDidi(objListaCorreo) {
    try {
        let response = await fetch(`${uri}/enviarCorreoSuscripcionDidi`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objListaCorreo)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function comprobantePaciente(baseUrl,atencion) {
    try {
       var urlCliente = location.origin;
       atencion.token = auth;
        let response = await fetch(`${uri}/sendComprobanteAtencionPaciente?baseUrl=${urlCliente}`, {
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
export async function comprobanteMedico(baseUrl, atencion) {
    try {
        let response = await fetch(`${uri}/sendComprobanteAtencionMedico?baseUrl=${baseUrl}`, {
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
export async function nuevoPacienteUrgencia(baseUrl, atencion) {
    try {
        let response = await fetch(`${uri}/sendNuevoPacienteUrgencia?baseUrl=${baseUrl}`, {
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

export async function comprobanteProfesionalAsociados(baseUrl, atencion) {
    try {
        let response = await fetch(`${uri}/sendcomprobanteProfesionalAsociados?baseUrl=${baseUrl}`, {
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
export async function comprobanteAnulacion(atencion) {
    try {
        let response = await fetch(`${uri}/sendComprobanteAnulacion`, {
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

export async function sendContacto(body){
    try {
        let response = await fetch(`${uri}/sendContacto`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function sendEnvioExitoso(body) {
    try {
        let response = await fetch(`${uri}/SolicitudHoraSac`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function sendCorreoBienvenida(body, baseUrl) {
    try {
        let response = await fetch(`${uri}/sendCorreoBienvenida?baseUrl=${baseUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function sendCorreoBienvenidaFirebase(body, baseUrl) {
    try {
        let response = await fetch(`${uri}/sendCorreoBienvenidaFirebase?baseUrl=${baseUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }

}

export async function sendOrdenMedicaConsalud(formData, idCliente) {
    try {
        let response = await fetch(`${uri}/sendOrdenMedicaConsalud/${idCliente}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
        return null;
    }
}
export async function enviarExamenPreventivo(idHistorial, idCliente) {

    try {
        let response = await fetch(`${uri}/sendComprobanteExamenesPreventivos?idHistorial=${idHistorial}&idCliente=${idCliente}`, {
            method: 'POST'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}