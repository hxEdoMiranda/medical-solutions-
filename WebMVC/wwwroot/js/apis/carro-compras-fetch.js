var baseUrl = new URL(window.location.href); //url base para servicios.

if (baseUrl.hostname.includes("localhost")) {
    //baseUrl = "http://localhost:8081";
    baseUrl = "https://paymentgateway-dev.azurewebsites.net";
} else if (baseUrl.hostname.includes("desa")) {
    baseUrl = "https://paymentgateway-dev.azurewebsites.net";
} else if (baseUrl.hostname.includes("qa")) {
    baseUrl = "https://paymentgateway-dev.azurewebsites.net";
} else if (baseUrl.hostname.includes("staging")) {
    baseUrl = "https://paymentgateway-dev.azurewebsites.net";
} else {
    baseUrl = "https://paymentgateway-prod.azurewebsites.net";
}

const uriOrder = baseUrl + '/Order';
const uriOrderP = baseUrl + '/OrderPayment';

//const uri = baseUrl + '/nom035';



/*Método Crear carrito de compras*/
export async function SaveOrder(data) {
    try {
        let response = await fetch(`${uriOrder}/SaveOrder`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

/*Método Crear carrito de suscripcion*/
export async function SaveOrderSubscription(data) {
    try {
        let response = await fetch(`${uriOrder}/SaveOrderSubscription`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

/*Método Crear carrito de compras*/
export async function UpdateOrderPagoFarmazon(idorder,facturafarmazon) {
    try {
        let response = await fetch(`${uriOrder}/UpdateOrderPagoFarmazon/${idorder}/${facturafarmazon}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
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

/*Método actualizar estado carrito de compras*/
export async function UpdateOrderStatus(idorder, status) {
    try {
        let response = await fetch(`${uriOrder}/UpdateOrderStatus/${idorder}/${status}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
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

//FARMAZON
export async function CreateGuestCart(guestCart) {
    try {
        let response = await fetch(`${window.servicesUrl}/yapp/Farmazon/CreateGuestCart`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(guestCart)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function CreateCart(Cart) {
    try {
        let response = await fetch(`${window.servicesUrl}/yapp/Farmazon/CreateOrder`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Cart)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Unable to get item. ', error);
    }
}

export async function CreateInvoice(id) {
    try {
        let response = await fetch(`${window.servicesUrl}/yapp/Farmazon/CreateInvoice/`+id, {
            method: 'POST',
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

export async function orderPaySuccessfuly(order_header_id) {
    try {
        let response = await fetch(`${uriOrderP}/GetOrderPaymentSuccesfullybyIdOrderHeader/${order_header_id}`, {
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

//export async function terminarCuestionario(data) {
//    try {

//        let response = await fetch(`${uri}/TerminarCuestionario`, {
//            method: 'PUT',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(data)
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to get item. ', error);
//    }
//}

//export async function resultadosCuestionario1(data) {
//    try {

//        let response = await fetch(`${uri}/ResultadosIndividualCuestionario1`, {
//            method: 'PUT',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(data)
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to get item. ', error);
//    }
//}

//export async function resultadosCuestionario2(data) {
//    try {

//        let response = await fetch(`${uri}/ResultadosIndividualCuestionario2`, {
//            method: 'PUT',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(data)
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to get item. ', error);
//    }
//}

//export async function resultadosCuestionario3(data) {
//    try {

//        let response = await fetch(`${uri}/ResultadosIndividualCuestionario3`, {
//            method: 'PUT',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(data)
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to get item. ', error);
//    }
//}

//export async function GuardarPaciente(data) {
//    try {

//        let response = await fetch(`${uri}/CrearUsuario`, {
//            method: 'POST',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(data)
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to get item. ', error);
//    }
//}


//export async function ValidaGuardaEmpresaxUsuario(idPaciente) {
//    try {
//        let response = await fetch(`${uri}/validarRegistrarEmpresaxPaciente/${idPaciente}`, {
//            method: 'GET',
//            headers: {
//                'Accept': 'application/json',
//                'Content-Type': 'application/json'
//            }
//        });
//        let responseJson = await response.json();
//        return responseJson;
//    } catch (error) {
//        console.error('Unable to get item. ', error);
//    }
//}