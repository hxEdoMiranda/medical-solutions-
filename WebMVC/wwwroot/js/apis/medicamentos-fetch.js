const uri = baseUrl + '/agendamientos/atencionMedicamentos';
const uriMed = baseUrl + '/agendamientos/Medicamentos';

export async function insertAtencionMedicamentos(atencionMedicamentos) {
    try {
        let response = await fetch(`${uri}/insertAtencionMedicamentos`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(atencionMedicamentos)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item.', error);
    }
}
export async function deleteMedicamentos(id) {
   
    try {
        let response = await fetch(`${uri}/deleteMedicamentos?id=${id}`, {
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

export async function getMedicamentosBD(name, codigoPais) {
    
    var body =
    {
        nameMedicamento: name,
        codigoPais: codigoPais
    }
    try {
        let response = await fetch(`${uriMed}/getMedicamentos`, {
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
        console.error('Unable to get medicamentos bd.', error);
    }
}
export async function getMedicamentosCentroClinicoBD(name, codigoPais) {
   
    var body =
    {
        nameMedicamento: name,
        codigoPais: codigoPais
    }
    try {
        let response = await fetch(`${uriMed}/getMedicamentosCentroClinico`, {
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
        console.error('Unable to get medicamentos bd.', error);
    }
}

export async function saveMedicamento(medicamentoYapp) {
    
    try {
        let response = await fetch(`${uriMed}/saveMedicamento`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicamentoYapp)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to post medicamento.', error);
    }
}