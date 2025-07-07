const uri = baseUrl + '/agendamientos/salud';

var gesEnoRequest = {
    "IdAtencion": null,
    "IdPaciente": null,
    "IdResponsable": 0,
    "IdMedico": "",
    "TipoDocumento": "",
    "Representativo": "0",
    "PrestadorDireccion": "",
    "PrestadorDireccionNumero": "",
    "PrestadorComuna": "",
    "Patology": "",
    "Financer": "",
    "Stage": "",
    "Institution": "",
    "InstitutionCode": "",
    "Seremi": "",
    "SeremiCode": "",
    "Office": "",
    "OfficeCode": "",
    "MedicalRecord": "",
    "Birthday": "",
    "Nationality": "",
    "NationalityCode": "",
    "AddressNumber": "",
    "AddressApartment": "",
    "PostalCode": "",
    "CommuneCode": "",
    "PhoneNumber": "",
    "MobileNumber": "",
    "AgeUnit": "",
    "Native": "",
    "Town": "",
    "Profession": "",
    "ProfessionCode": "",
    "Condition": "",
    "ProfessionCategory": "",
    "Diagnostic": "",
    "DiagnosticCode": "",
    "SymptomDate": "",
    "Infection": "",
    "Vaccination": "",
    "Pregnancy": "",
    "DoseDate": "",
    "DoseNumber": "",
    "HasRepresentative": "",
    "OtherDiagnostic": "",
    "OtherDiagnosticCode": "",
    "InfectionCountry": "",
    "Tbc1": "",
    "Tbc2": "",
    "Clinic": "",
    "Epidemiologica": "",
    "Frotis": "",
    "Cultivo": "",
    "Serologia": "",
    "Biopsia": "",
    "Autopsia": "",
    "UrlCallback": "",
    "TypeSign": "",
    "TypeSignLender": "",
    "RepresentativeTypeSign": "",
    "TipoFirma": "",
    "TipoFirmaProfecional": "",
    "RepresentanteFirma": "",
    "LocationCode": "",

}
export async function generarLME(LMEGenerateInfo) {
    var request = {
        ...{
            IdAtencion: "",
            IdDoctor: "",
            IdPaciente: "",

            HijoRut: "",
            HijoNombre: "",
            HijoApellidoPaterno: "",
            HijoApellidoMaterno: "",
            HijoFechaNacimiento: "",
            HijoFechaConcepcion: "",
            HijoFechaInicio: "",

            ReposoInicio: "",
            LicenciaDuracion: "",
            LicenciaRecuperabilidad: "",
            TramiteInvalidez: "",
            FechaAccidente: "",
            Trayecto: "",
            LicenciaNumeroEmpleadores: "",
            LicenciaTipo: "",
            LicenciaSubtipo: "",
            ReposoTipo: "",
            ReposoJornada: "",
            ReposoLugar: "",
            ReposoDomicilioJustificarOtro: "",
            ReposoDomicilioCalle: "",
            ReposoDomicilioComuna: "",
            ReposoDomicilioFono: "",
            ReposoDomicilioLugar: "",
            ReposoDomicilioJustificarOtro2: "",
            ReposoDomicilioCalle2: "",
            ReposoDomicilioComuna2: "",
            ReposoDomicilioFono2: "",
            DiagnosticoPrincipal: "",
            DiagnosticoPrincipalCie10: "",
            DiagnosticoSecundario: "",
            DiagnosticoSecundarioCie10: "",
            DiagnosticoOtro: "",
            DiagnosticoOtroCie10: "",
            AntecedentesClinicos: "",
            ExamenesApoyo: "",
            OrigenLicencia: ""
        }
        ,...LMEGenerateInfo
    }
    try {
        let response = await fetch(`${uri}/GenerateLME`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            },
            body: JSON.stringify(request)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function generarGES(GESGenerateInfo) {
    var request = {
        ...gesEnoRequest,
        ...GESGenerateInfo
    }
    try {
        let response = await fetch(`${uri}/GenerateGES`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            },
            body: JSON.stringify(request)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function generarENO(ENOGenerateInfo) {
    var request = {
        ...gesEnoRequest,
        ...ENOGenerateInfo
    }
    try {
        let response = await fetch(`${uri}/GenerateENO`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            },
            body: JSON.stringify(request)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}


export async function consultarEstadoLME(idAtencion) {
    try {
        let response = await fetch(`${uri}/ConsultarEstadoLME?idAtencion=${idAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function consultarGES(idAtencion,idpatologia) {
    try {
        let response = await fetch(`${uri}/consultarGES?idAtencion=${idAtencion}&idPatologia=${idpatologia}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function cancelarGES(idAtencion, idpatologia, uidpaciente, uiddoctor, estadoNotificacion, motivo) {
    try {
        let type = "imed_GES_" + idpatologia;
        let response = await fetch(`${uri}/CancelarGESENO?type=${type}&idAtencion=${idAtencion}&uidpaciente=${uidpaciente}&uiddoctor=${uiddoctor}&estadoNotificacion=${estadoNotificacion}&motivo=${motivo}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function cancelarENO(idAtencion, idpatologia, uidpaciente, uiddoctor, estadoNotificacion, motivo) {
    try {
        let type = "imed_ENO_" + idpatologia;
        let response = await fetch(`${uri}/CancelarGESENO?type=${type}&idAtencion=${idAtencion}&uidpaciente=${uidpaciente}&uiddoctor=${uiddoctor}&estadoNotificacion=${estadoNotificacion}&motivo=${motivo}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function consultarENO(idAtencion, idpatologia) {
    try {
        let response = await fetch(`${uri}/consultarENO?idAtencion=${idAtencion}&idPatologia=${idpatologia}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}

export async function consultarDataFormulario(idAtencion, type) {
    try {
        let response = await fetch(`${uri}/GetDataFormularios?idAtencion=${idAtencion}&type=${type}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            }
        });
        let responseJson = await response.json();
        if (responseJson == null || ((responseJson.status != undefined || responseJson.status != null) && responseJson.status != 200))
            return null;
        return responseJson;
    } catch (error) {
        return null;
    }
}
/*
let typeStatus = {
    LME:"imed_LME",
    GES:"imed_GES",
    ENO: "imed_ENO",
}
*/