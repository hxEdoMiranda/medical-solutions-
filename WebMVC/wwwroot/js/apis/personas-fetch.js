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





const uri = baseUrl + '/usuarios/personas';
const uriUser = baseUrl + '/usuarios/users';
const uriFichaMedico = baseUrl + '/usuarios/personasDatos';
const uriPersonasDatosLaboral = baseUrl + '/usuarios/personasdatoslaboral';


export async function getPuestosxAreas(idArea) {
    try {
        let response = await fetch(`${uriPersonasDatosLaboral}/getListaPuestos/${idArea}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}

export async function personByUser(uid) {
    try {
        let response = await fetch(`${uri}/personByUser/${uid}`, {
            method: 'GET',
            headers: {"Authorization": `Bearer ${auth}`}
          });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getDatosPaciente(uid) {
    try {
        let response = await fetch(`${uri}/getDatosPaciente/${uid}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getDatosPersonaUsername(username) {
    try {
        let response = await fetch(`${uri}/getDatosPersonaUsername?username=${username}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function getDatosProfesional(uid) {
    try {
        let response = await fetch(`${uriFichaMedico}/getDatosProfesional/${uid}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function personasDatosByUser(uid) {
    try {
        let response = await fetch(`${uriFichaMedico}/personasDatosByUser/${uid}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function GetListaProfesionales() {
    try {
        let response = await fetch(`${uriFichaMedico}/GetListaProfesionales`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}

export async function GetGruposProfesionales() {
    try {
        let response = await fetch(`${uriFichaMedico}/GetGruposProfesionales`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}


//obtener lista pacientes
export async function GetListaPacientes(texto, estado) {
    try {
        let response = await fetch(`${uri}/GetListaPacientes?texto=${texto}&estado=${estado}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}

export async function GetListaProfesionalesAgenda() {
    try {
        let response = await fetch(`${uriFichaMedico}/GetListaProfesionalesAgenda`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}


export async function getListaProfesionalesConvenio(idConvenio) {
    try {
        let response = await fetch(`${uriFichaMedico}/getListaProfesionalesConvenio/${idConvenio}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}



export async function EditPwPerfil(formData) {
    try {
        let response = await fetch(`${uriUser}/updatePW`, {
            method: 'PUT',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}
export async function updateEstadoPassword(idUser) {
    try {
        let response = await fetch(`${uriUser}/updateEstadoPassword?idUser=${idUser}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function updateAceptaTerminos(idUser) {
    try {
        let response = await fetch(`${uriUser}/updateAceptaTerminos?idUser=${idUser}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function updateEstadoNotice(idUser) {
    try {
        let response = await fetch(`${uriUser}/updateEstadoNotice?idUser=${idUser}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function EditInfoPerfil(formData, uid) {
    try {
        let response = await fetch(`${uri}/updatePerfil?uid=${uid}`, {
            method: 'PUT',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}
export async function EditInfoPerfilInvitado(formData, uid) {
    
    try {
        let response = await fetch(`${uri}/updatePerfilInvitado?uid=${uid}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        
    }
}

export async function EditInfoPerfilInvitadoFirebase(formData, uid) {
    try {
        let response = await fetch(`${uri}/updatePerfilInvitadoFirebase?uid=${uid}`, {
            method: 'PUT',
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


export async function EditInfoPerfilCargas(formData, idEdit, idEditor, idCliente, editState, isEmergencyContact = false) {
    try {
        let response = await fetch(`${uri}/UpdatePerfilCargas?uid=${idEdit}&idTitular=${idEditor}&idCliente=${idCliente}&editState=${editState}&isEmergencyContact=${isEmergencyContact}`, {
            method: 'PUT',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function EditAntecedentesMedicos(formData, uid) {
    try {
        let response = await fetch(`${uri}/updateAntecedentesMedicos?uid=${uid}`, {
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
//// peritaje

export async function EditPeritaje(formPeritaje, uid) {
    try {
        let response = await fetch(`${uri}/updatePeritaje?uid=${uid}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formPeritaje)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function InsertPeritaje(formPeritaje, uid) {
    try {
        let response = await fetch(`${uri}/insertPeritaje?uid=${uid}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formPeritaje)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function InsertNumeroLicenciaPerito(numeroLicencia, idAtencion, idPaciente) {
    try {
        let response = await fetch(`${uri}/insertPeritajeNSP?idAtencion=${idAtencion}&numeroLicencia=${numeroLicencia}&idPaciente=${idPaciente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function GetPeritaje(idAtencion) {
    try {
        let response = await fetch(`${uri}/getPeritaje?idAtencion=${idAtencion}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}
//////////
export async function logPacienteViaje(formData) {
     try {
        let response = await fetch(`${uri}/grabarLogPacienteViaje`, {
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
export async function ChangeStatePersona(uid) {
    try {
        let response = await fetch(`${uri}/changeState/${uid}`, {
            method: 'GET'
            
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function EditFichaMedico(formData, uid) {
    try {
        let response = await fetch(`${uriFichaMedico}/updateFichaMedico?uid=${uid}`, {
            method: 'POST',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function PostNewPersonaConvenios(idPersona, idConvenio, uid) {
    try {
        let response = await fetch(`${uri}/postNewPersonaConvenio?idPersona=${idPersona}&idConvenio=${idConvenio}&uid=${uid}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}



export async function getPersonasConveniosByIdFull(idPersona) {
    try {
        let response = await fetch(`${uri}/getPersonaConveniosByIdFull?idPersona=${idPersona}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function EditPhoneEmail(email, telefono, uid) {
    try {
        let response = await fetch(`${uri}/updatePersonaAgendar?email=${email}&telefono=${encodeURIComponent(telefono)}&uid=${uid}`, {
            method: 'PUT'
       });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}
export async function validateUser(userName,password,rol) {
    try {
        let response = await fetch(`${uriUser}/validateLogin?userName=${userName}&password=${password}&rol=${rol}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }

        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}
export async function compareOldPassword(username,password) {
    try {
        let response = await fetch(`${uriUser}/compareOldPassword?username=${username}&password=${password}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}

export async function saveOldPassword(username) {
    try {
        let response = await fetch(`${uriUser}/saveOldPassword?username=${username}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}


export async function findByUsername(identificador) {
    
    try {
        let response = await fetch(`${uriUser}/findByUsername?username=${identificador}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}


export async function getUserIdByUserNameAndRole(identificador, roleId) {
    
    try {
        let response = await fetch(`${uriUser}/getUserIdByUserNameAndRole?username=${identificador}&roleId=${roleId}`, {
            method: 'GET'
        });

        if (response.status == 200)
            return await response.json()
        else
            return null
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}

// metodos para modalidad de pago, profesionales


export async function PostNewPersonaDatosModalidad(idPersona, id, uid) {

    try {
        let response = await fetch(`${uriFichaMedico}/postNewPersonaDatosModalidad?idPersona=${idPersona}&idModalidad=${id}&uid=${uid}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}


export async function getModalidadByIdFull(idPersona) {

    try {
        let response = await fetch(`${uriFichaMedico}/getModalidadByIdFull?idPersona=${idPersona}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}


export async function findUsersByEmail(email) {

    try {
        let response = await fetch(`${uriUser}/findUsersByEmail?email=${email}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}


export async function getBeneficiarios(uid, idCliente) {

    try {
        let response = await fetch(`${uriUser}/getBeneficiarios?uid=${uid}&idCliente=${idCliente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function getEdadBeneficiarioById(uid) {

    try {
        let response = await fetch(`${uri}/getEdadBeneficiarioById?uid=${uid}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function getNotificaciones(uid, idCliente) {
   try {
        let response = await fetch(`${uri}/getNotificaciones?IdUsuario=${uid}&idCliente=${idCliente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}
export async function cambiarBeneficiario(uid) {

    try {
        let response = await fetch(`/Paciente/CambioBeneficiario?uid=${uid}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function cambioIdCliente(idEmpresa) {
  
    try {
        let response = await fetch(`/Paciente/CambioIdCliente?idCliente=${idEmpresa}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function cambioIdClienteVip(countryCode) {

    try {
        let response = await fetch(`/Paciente/CambioIdClienteVip?countryCode=${countryCode}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function GetPersonasCargas(uid, idCliente) {
    try {
        let response = await fetch(`${uri}/getPersonasCargas/${uid}/${idCliente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function GetContactosEmergencia(uid, idCliente) {
    try {
        let response = await fetch(`${uri}/getContactosEmergencia/${uid}/${idCliente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function changeStateBeneficiario(usuarioId, idTitular, idCliente, isCEmergencia = false) {
    try {
        let response = await fetch(`${uri}/changeStateBeneficiario?usuarioId=${usuarioId}&idTitular=${idTitular}&idCliente=${idCliente}&isCEmergencia=${isCEmergencia}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function agregarByRut(identificador, idEditor, idCliente) {
    try {
        let response = await fetch(`${uri}/agregarByRut?identificador=${identificador}&idTitular=${idEditor}&idCliente=${idCliente}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Error al agregar beneficiario.', error)
    }
}

export async function validaCodigo(username, codigo) {
    
    try {
        let response = await fetch(`${uriUser}/validarCodigoLogin?username=${username}&codigo=${codigo}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}


export async function postCentroClinicobyMedico(idMedico, IdCentroClinico) {
    try {
        let response = await fetch(`${uri}/postCentroClinicobyMedico?idMedico=${idMedico}&IdCentroClinico=${IdCentroClinico}`, {
            method: 'PUT'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Error al agregar beneficiario.', error)
    }
}

export async function GetListaPacientesCentroClinico(texto, estado, IdCentroClinico) {
    try {
        let response = await fetch(`${uri}/GetListaPacientesCentroClinico?texto=${texto}&estado=${estado}&idcentroclinico=${IdCentroClinico}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get items.', error);
    }
}

export async function EditInfoPerfilPacienteCentroClinico(formData, uid) {
    
    try {
        let response = await fetch(`${uri}/updatePerfilPacienteCentroClinico?uid=${uid}`, {
            method: 'PUT',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}

export async function findUsernameConvenio(identificador) {
    try {
        let response = await fetch(`${uriUser}/findUsernameConvenio?username=${identificador}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}

export async function findUsernameEmpresa(identificador, idCliente = 0) {
    try {
        let response = await fetch(`${uriUser}/findUsernameEmpresa?username=${identificador}&idCliente=${idCliente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}
export async function DeleteCookiesFirebase() {
    try {
        let response = await fetch(`/Paciente/deleteCookiesFirebase`, {
            method: 'GET'
        });
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}

export async function getBuscaExcepcionesDoc(uid) {
    try {
        let response = await fetch(`${uriUser}/GetBuscaExcepcionesDoc/${uid}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getEmpresasPersonaSsu(idUser, idCliente) {
    try {
        let response = await fetch(`${uriUser}/GetEmpresasPersonaSsu/${idUser}/${idCliente}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getCargasXEmpresa(uid,idEmpresa) {
    try {
        let response = await fetch(`${uri}/GetCargasXEmpresa?uid=${uid}&idEmpresa=${idEmpresa}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getInfoCargasxEmpresa(identificador, idEmpresa) {
    try {
        let response = await fetch(`${uri}/GetInfoCargasxEmpresa?identificador=${identificador}&idEmpresa=${idEmpresa}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function getValidaExistenciaCargaxEmpresa(identificador, idEmpresa) {
    try {
        let response = await fetch(`${uri}/GetValidaExistenciaCargaxEmpresa?identificador=${identificador}&idEmpresa=${idEmpresa}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getVerificaExistenciaPersona(identificador) {
    try {
        let response = await fetch(`${uri}/GetVerificaExistenciaPersona?identificador=${identificador}`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${auth}` }
        });
        let responseJson = await response.json();
        
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}



export async function insertCargaPorPersona(formData, idEdit, idEditor, idCliente, idAction) {
    try {
        let response = await fetch(`${uri}/InsertCargaPorPersona?uid=${idEdit}&idTitular=${idEditor}&idCliente=${idCliente}&idAction=${idAction}&`, {
            method: 'PUT',
            body: formData
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to update item.', error);
    }
}


export async function verificarUsuarioCarga(uid,idCliente) {
    try {
        let response = await fetch(`${uri}/VerificarUsuarioCarga?idUser=${uid}&idCliente=${idCliente}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function getUserByUserName(identificador) {

    try {
        let response = await fetch(`${uriUser}/getUserByUserName?username=${identificador}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}


export async function getUserBtUserNameCompleto(identificador) {

    try {
        let response = await fetch(`${uriUser}/getUserByUsernameCompleto?username=${identificador}`, {
            method: 'GET'
        });
        let responseJson = await response.json();
        return responseJson;
    }
    catch (error) {
        console.error('Unable to update item.', error)
    }
}

export async function EditDatosObligatorios(formData, uid) {
    try {
        let response = await fetch(`${uri}/updatePerfilBody?uid=${uid}`, {
            method: 'PUT',
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








