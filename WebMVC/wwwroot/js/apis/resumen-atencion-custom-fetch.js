var baseUrl = new URL(window.location.origin);
//debugger;
//if (baseUrl.hostname.includes("localhost")) {
//    var baseUrlCompleta = "https://" + baseUrl;
//}
//else {
//    var baseUrlCompleta = baseUrl;
//}


export async function verificarLibretaDirecciones(uid, tipo) {
    try {
        //const response = await fetch(`${baseUrl}/GetLibretaDireccionesCount/${uid}/${tipo}`, {
        //    method: "GET",
        //    headers: {
        //        "Content-Type": "application/json"
        //    },
        //    credentials: "same-origin"
        //});

        
        const count = parseInt(totalDirecciones);
            if (count == 1) {
                $("#seleccionar-direccion-examenes").show();
                $("#seleccionar-direccion-medicamentos").show();
                $("#selectAddressMed").text("Seleccionar dirección");
                $("#selectAddressExa").text("Seleccionar dirección");
                $("#divCostoEnvioExamen").show();
                //$("#examenes-list input").is(":checked");
            }
            else if (count >= 2) {
                $("#seleccionar-direccion-examenes").show();
                $("#seleccionar-direccion-medicamentos").show();
                $("#selectAddressMed").text("Cambiar dirección");
                $("#selectAddressExa").text("Cambiar dirección");
                //$("#examenes-list input").is(":checked");
                $("#divCostoEnvioExamen").show();
            }

            await checkAllList();
    } catch (error) {
        console.error('VerificarLibretaDirecciones.', error);
    }
}


//Validar direcciones, si existen, de lo contrario no mostrar los botones
export async function verificarDireccionesGuardadasMed(uid, tipo) {
    try {
        const response = await fetch(`${baseUrl}/ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista.fichaPaciente)
        });

        if (response.status === 200) {
            $("#seleccionar-direccion-medicamentos").show();
        }
        else if (response.status === 204) {
            $("#seleccionar-direccion-medicamentos").hide();
        }
        else {
            console.error(response)
        }
    } catch (error) {
        console.error('VerificarDireccionesGuardadas.', error);
    }
}

export async function verificarDireccionesGuardadasEx(uid, tipo) {
    try {
        const response = await fetch(`${baseUrl}/ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista.fichaPaciente)
        });

        if (response.status === 200) {
            $("#seleccionar-direccion-examenes").show();
        }
        else if (response.status === 204) {
            $("#seleccionar-direccion-examenes").hide();
        }
        else {
            console.error(response)
        }
    } catch (error) {
        console.error('VerificarDireccionesGuardadas.', error);
    }
}

export async function GetCardsByUid(uid) {
    try {
        let response = await fetch(`${baseUrl}GetCardsByUid/${uid}`, {
            method: 'GET',
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

export async function GetTimeLineDataCostoCero(uid, idCliente) {
    try {
        let response = await fetch(`${baseUrl}GetTimeLineDataCostoCero/${uid}/${idCliente}`, {
            method: 'GET',
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

export async function getAtencionInterconsulta(idAtencion) {
    try {
        let response = await fetch(`${baseUrl}GetAtencionInterconsulta/${idAtencion}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            $("#DivInterconsulta").load(location.href + " #DivInterconsulta");
        }
        else {
            console.error(response)
        }
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

//export async function agregarTelefonoPaciente(telefono) {
//    const responsePersona = await fetch(`${window.baseUrl}/usuarios/personas/updateProfilePhone`, {
//        method: "POST",
//        headers: {
//            "Accept": "application/json",
//            "Content-Type": "application/json"
//        },
//        body: JSON.stringify(telefono)
//    });
//    if (responsePersona.ok) {
//        $("#profileAddress").val(direccion.direccion);
//    }
//    else if (!responsePersona.ok) {
//        Swal.fire("¡Ups! Algo salió mal.", "El teléfono no se guardó en la tabla personas, por favor, inténtalo nuevamente", "error");
//        console.error(responsePersona)
//        return;
//    }
//}

//export async function EnviarPago(obj) {
//    try {
//        const response = await fetch(`${baseUrl}/PasarelaPago/EnviarPago` , {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json"
//            },
//            credentials: "same-origin",
//            body: JSON.stringify(obj)
//        });

//        if (response.status === 200) {
//            console.log(response)
//        }
//        else {
//            console.error(response)
//        }
//    } catch (error) {
//        console.error(error)

//    }
//}

