import { ValidaGuardaEmpresaxUsuario } from '../apis/nom035-fetch.js';
import { GetCardsByUid } from '../apis/resumen-atencion-custom-fetch.js';
var cardIdSeleccionada = "";
let codigoPais = "";
export let cardForm = "";

export async function init(data) {
    codigoPais = data.codigotelefono;
    for (var i = 0; i < data.tarjetas.length; i++) {
        let chk = document.getElementById(data.tarjetas[i].cardId.toString());
        let btnDelete = document.getElementById("btn" + data.tarjetas[i].cardId.toString());
        let btnAutorizo = document.getElementById("btnAutorizo" + data.tarjetas[i].cardId.toString());

        if (chk != null) {

            chk.addEventListener("click", e => {
                const id = e.target.getAttribute("id");

                for (var d = 0; d < data.tarjetas.length; d++) {
                    if (data.tarjetas[d].cardId != id) {
                        let chkQuitar = document.getElementById(data.tarjetas[d].cardId.toString());
                        chkQuitar.checked = false;
                    }
                }
                let objUsuario = null;
                var checkedField = false;
                if ($('#' + id).prop('checked')) {
                    checkedField = true;
                }

                objUsuario = {
                    idUser: $("#iduser").val(),
                    cardId: id,
                    CustomerId: "",
                    numberCard: "string",
                    expirationDate: "string",
                    franchiseCard: "string",
                    payment_type_id: 0,
                    status: true,
                    default_card: checkedField,
                    textoFranchiseCardNumberCard: "string",
                    publicKey: "string",
                    creditorDebit: "string",
                    cardHolderName: "string",
                    lastFourDigit: "string",
                    segurityCodeLength: "string"
                }

                var baseUrl = servicesUrlPago;
                const uri = baseUrl + '/PaymentCard';

                let response = fetch(`${uri}/updateDefaultPaymentCard`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(objUsuario)
                });

            });
        }

        if (btnAutorizo != null) {

            btnAutorizo.addEventListener("click", e => {
                const id = e.target.getAttribute("id").substring(11, e.target.getAttribute("id").length);
                let objUsuario = null;
                var checkedField = false;
                if ($("#" + e.target.getAttribute("id")).prop('checked')) {
                    checkedField = true;
                }

                objUsuario = {
                    idUser: $("#iduser").val(),
                    cardId: id,
                    CustomerId: "",
                    numberCard: "string",
                    expirationDate: "string",
                    franchiseCard: "string",
                    payment_type_id: 0,
                    status: true,
                    default_card: false,
                    shared_card_load: checkedField,
                    textoFranchiseCardNumberCard: "string",
                    publicKey: "string",
                    creditorDebit: "string",
                    cardHolderName: "string",
                    lastFourDigit: "string",
                    segurityCodeLength: "string"
                }

                var baseUrl = servicesUrlPago;
                const uri = baseUrl + '/PaymentCard';

                let response = fetch(`${uri}/updateSharedCardPaymentCard`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(objUsuario)
                });

            });
        }

        if (btnDelete != null) {

            btnDelete.addEventListener("click", e => {
                const id = e.target.getAttribute("id");
                cardIdSeleccionada = id.substring(3, id.length);
                $("#modalConfirmarDeleteCard").modal("show");
            });
        }
    }




    $('#btnAceptarDelete').on('click', async function (ev) {
        let objUsuario = null;

        objUsuario = {
            idUser: $("#iduser").val(),
            cardId: cardIdSeleccionada,
            CustomerId: "",
            numberCard: "string",
            expirationDate: "string",
            franchiseCard: "string",
            payment_type_id: 0,
            status: true,
            default_card: true,
            textoFranchiseCardNumberCard: "string",
            publicKey: "string",
            creditorDebit: "string",
            cardHolderName: "string",
            lastFourDigit: "string",
            segurityCodeLength: "string"
        }

        var baseUrl = servicesUrlPago;
        const uri = baseUrl + '/PaymentCard';

        let response = fetch(`${uri}/detelePaymentCard`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objUsuario)
        }).then(res => res.text()).then((data) => {
            $("#modalConfirmarDeleteCard").modal("hide");
            Swal.fire({
                tittle: "Éxito!",
                text: "Tarjeta eliminada correctamente.",
                type: "success",
                confirmButtonText: "Ok"
            }).then(() => {
                document.location.reload(true);
            });
        });



    });
    $("#btnCancelarDelete").click(function () {
        $("#modalConfirmarDeleteCard").modal("hide");
    });


    $('#btnAceptarDefault').on('click', async function (ev) {
        $("#modalConfirmarDefaultCard").modal("hide");
    });
    $("#btnCancelarDefault").click(function () {
        $("#modalConfirmarDefaultCard").modal("hide");
    });

    $('#manejoDatosMS').on('click', async function (ev) {
        $("#modalGeneral").modal("show");
    });

    $('#AddNewCard').on('click', async function (ev) {
        $('#DivAddCard').show();
        $('#DivAddNewCard').hide();
        $('#DivListCard').hide();
        const nuevaTarjeta = await agregarTarjeta(codigoPais);
        const tarjetasNuevas = await GetCardsByUid(uid);
    });
}

export async function agregarTarjeta(Pais, callBack) {
    let tarjetaValida = 0;
    // ;
    // Importar la biblioteca de Mercado Pago
    const mp = new MercadoPago(publicKey);
    if(Pais == "MX") {
        cardForm = mp.cardForm({
            amount: "10000",
            iframe: true,
            form: {
                id: "form-checkout",
                cardNumber: {
                    id: "form-checkout__cardNumber",
                    placeholder: "Ingrese el número de tarjeta",
                },
                expirationDate: {
                    id: "form-checkout__expirationDate",
                    placeholder: "MM/YY",
                },
                securityCode: {
                    id: "form-checkout__securityCode",
                    placeholder: "Código de seguridad",
                },
                cardholderName: {
                    id: "form-checkout__cardholderName",
                    placeholder: "Ingrese el nombre del titular",
                },
                issuer: {
                    id: "form-checkout__issuer",
                    placeholder: "Banco emisor",
                },
                installments: {
                    id: "form-checkout__installments",
                    placeholder: "Cuotas",
                },
                cardholderEmail: {
                    id: "form-checkout__cardholderEmail",
                    placeholder: "E-mail",
                },
            },
            callbacks: {
                onFormMounted: error => {
                    if (error) return console.warn("Form Mounted handling error: ", error);
                },
                onFormUnmounted: error => {
                    if (error) {
                        cardForm.unmount();
                        return console.warn('Form Unmounted handling error: ', error)
                    }
                },
                onIdentificationTypesReceived: (error, identificationTypes) => {
                    if (error) return console.warn('identificationTypes handling error: ', error)
                },
                onPaymentMethodsReceived: (error, paymentMethods) => {
                    if (error) tarjetaValida = 0; else tarjetaValida = 1;

                },
                onIssuersReceived: (error, issuers) => {
                    if (error) return console.warn('issuers handling error: ', error)
                },
                onInstallmentsReceived: (error, installments) => {
                    if (error) return console.warn('installments handling error: ', error)
                },
                onCardTokenReceived: (error, token) => {
                    if (error) return console.warn('Token handling error: ', error)
                },
                cardholderEmailReceived: (error, token) => {
                    if (error) return console.warn('Email handling error: ', error)
                },
                onSubmit: event => {
                    event.preventDefault();
                    if (tarjetaValida == 0) {
                        Swal.fire("Error!", "Verifique e ingrese un número de tarjeta válido", "error"); //return console.warn('paymentMethods handling error: ', error)
                        return;
                    }
                    if ($("#form-checkout__cardholderEmail").val() == "") {
                        Swal.fire("Error!", "El E-Mail está vacio", "error"); //return console.warn('paymentMethods handling error: ', error)
                        return;
                    }
                    const {
                        paymentMethodId: payment_method_id,
                        issuerId: issuer_id,
                        cardholderEmail: email,
                        amount,
                        token,
                        installments,
                        identificationNumber,
                        identificationType,
                    } = cardForm.getCardFormData();
                    let objUsuario = null;
                    objUsuario = {
                        token,
                        issuer_id,
                        payment_method_id,
                        transaction_amount: Number(amount),
                        installments: Number(installments),
                        description: "Descripción del producto",
                        userId: $("#iduser").val(),
                        customerId: $("#CustomerId").val(),
                        cardId: "",
                        shared_card_load: $('#sharedCard').prop('checked') ? true : false,
                        payer: {
                            email
                        }
                    };


                    var baseUrl = servicesUrlPago;//"https://localhost:7011";
                    const uri = baseUrl + '/PaymentCard';

                    //alert($("#CustomerId").val());

                    let response = fetch(`${uri}/create_card_user/${Pais}`, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(objUsuario)
                    }).then(res => res.text())
                        .then((data) => {
                            if (data == '"Proceso almacenado correctamente"') {
                                Swal.fire({
                                    tittle: "Éxito!",
                                    text: "Tarjeta agregada correctamente.",
                                    type: "success",
                                    confirmButtonText: "Ok"
                                }).then(async () => {
                                    if (window.location.href.includes("HomeWallet")) {
                                        $('#DivAddCard').hide();
                                        $('#DivAddNewCard').show();
                                        $('#DivListCard').show();
                                        document.location.reload(true);
                                    }
                                    else if (window.location.href.includes("FacturacionSuscripcion")) {
                                        await callBack();
                                    }
                                });
                            } else if (data == '"Error al guardar la tarjeta del usuario"') {
                                Swal.fire({
                                    tittle: "Error!",
                                    text: "Error al agregar la tarjeta al usuario",
                                    type: "error",
                                    confirmButtonText: "Aceptar"
                                }).then(() => {
                                    if (window.location.href.includes("HomeWallet")) {
                                        $('#DivAddCard').hide();
                                        $('#DivAddNewCard').show();
                                        $('#DivListCard').show();
                                        document.location.reload(true);
                                    }
                                    else if (window.location.href.includes("FacturacionSuscripcion")) {
                                        $('#DivPayment').show();
                                        $('#paymentBrick_container').show();
                                        $('#DivAddCard').hide();
                                        $('#probarModalMP').show();
                                    }
                                });
                            } else if (data == '"Error al guardar la tarjeta de la carga"') {

                                Swal.fire({
                                    tittle: "Error!",
                                    text: "Error al agregar la tarjeta a la carga",
                                    type: "error",
                                    confirmButtonText: "Aceptar"
                                }).then(() => {
                                    $('#DivAddCard').hide();
                                    $('#DivAddNewCard').show();
                                    $('#DivListCard').show();
                                    document.location.reload(true);
                                });
                            } else {

                                Swal.fire({
                                    tittle: "Error!",
                                    text: "Error al agregar la tarjeta, verifica los datos ingresados.",
                                    type: "error",
                                    confirmButtonText: "Aceptar"
                                }).then(async () => {
                                    if (window.location.href.includes("HomeWallet")) {
                                        $('#DivAddCard').hide();
                                        $('#DivAddNewCard').show();
                                        $('#DivListCard').show();
                                        document.location.reload(true);
                                    }
                                    else if (window.location.href.includes("FacturacionSuscripcion")) {
                                        await callBack();
                                    }
                                });
                            }
                        }).catch(error => {
                            console.error(error)
                        });

                },
                onFetching: (resource) => {
                    console.log("Fetching resource: ", resource);

                },
                onValidityChange: (error, validityChangeResponse, field) => {
                    //;
                    console.log("mesagge resource: ", error)
                },
                onBinChange: (error) => {
                    //;
                    console.log("onBinChange resource: ", error)
                },
                onReady: () => {
                    // handle form ready
                },
                onError: (error) => {
                    // handle error
                    let resp = error[0].message.includes("Invalid cardholder.identification.number") ? { Respuesta: "Número de identificación no valido" } : error[0].message.includes("expirationYear value should be greater or equal than") ? { Respuesta: "El año de vecimiento es menor al actual" } : error[0].message.includes("expirationMonth value should be greater") ? { Respuesta: "El mes de vecimiento es menor al actual" } : getErroresMP(users, error[0].message);
                    Swal.fire("Error!", resp.Respuesta, "error");
                    console.log(error);
                }
            },
        });

        $("#form-checkout__identificationNumber").keyup(function () {
            $("#form-checkout__identificationNumber").val(replaceName($("#form-checkout__identificationNumber").val()));
        });

        function replaceName(e) {
            return e = e.replace("-", "");
        }
    }
         
    else {
    cardForm = mp.cardForm({
        amount: "10000",
        iframe: true,
        form: {
            id: "form-checkout",
            cardNumber: {
                id: "form-checkout__cardNumber",
                placeholder: "Ingrese el número de tarjeta",
            },
            expirationDate: {
                id: "form-checkout__expirationDate",
                placeholder: "MM/YY",
            },
            securityCode: {
                id: "form-checkout__securityCode",
                placeholder: "Código de seguridad",
            },
            cardholderName: {
                id: "form-checkout__cardholderName",
                placeholder: "Ingrese el nombre del titular",
            },
            issuer: {
                id: "form-checkout__issuer",
                placeholder: "Banco emisor",
            },
            installments: {
                id: "form-checkout__installments",
                placeholder: "Cuotas",
            },
            identificationType: {
                id: "form-checkout__identificationType",
                placeholder: "Tipo de documento",
            },
            identificationNumber: {
                id: "form-checkout__identificationNumber",
                placeholder: "Ingrese el número de documento",
            },
            cardholderEmail: {
                id: "form-checkout__cardholderEmail",
                placeholder: "E-mail",
            },
        },
        callbacks: {
            onFormMounted: error => {
                if (error) return console.warn("Form Mounted handling error: ", error);
            },
            onFormUnmounted: error => {
                if (error) {
                    cardForm.unmount();
                    return console.warn('Form Unmounted handling error: ', error)
                }
            },
            onIdentificationTypesReceived: (error, identificationTypes) => {
                if (error) return console.warn('identificationTypes handling error: ', error)
            },
            onPaymentMethodsReceived: (error, paymentMethods) => {
                if (error) tarjetaValida = 0; else tarjetaValida = 1;

            },
            onIssuersReceived: (error, issuers) => {
                if (error) return console.warn('issuers handling error: ', error)
            },
            onInstallmentsReceived: (error, installments) => {
                if (error) return console.warn('installments handling error: ', error)
            },
            onCardTokenReceived: (error, token) => {
                if (error) return console.warn('Token handling error: ', error)
            },
            cardholderEmailReceived: (error, token) => {
                if (error) return console.warn('Email handling error: ', error)
            },
            onSubmit: event => {
                event.preventDefault();
                if (tarjetaValida == 0) {
                    Swal.fire("Error!", "Verifique e ingrese un número de tarjeta válido", "error"); //return console.warn('paymentMethods handling error: ', error)
                    return;
                }
                if ($("#form-checkout__cardholderEmail").val() == "") {
                    Swal.fire("Error!", "El E-Mail está vacio", "error"); //return console.warn('paymentMethods handling error: ', error)
                    return;
                }
                const {
                    paymentMethodId: payment_method_id,
                    issuerId: issuer_id,
                    cardholderEmail: email,
                    amount,
                    token,
                    installments,
                    identificationNumber,
                    identificationType,
                } = cardForm.getCardFormData();
                let objUsuario = null;
                objUsuario = {
                    token,
                    issuer_id,
                    payment_method_id,
                    transaction_amount: Number(amount),
                    installments: Number(installments),
                    description: "Descripción del producto",
                    userId: $("#iduser").val(),
                    customerId: $("#CustomerId").val(),
                    cardId: "",
                    shared_card_load: $('#sharedCard').prop('checked') ? true : false,
                    payer: {
                        email,
                        identification: {
                            type: identificationType,
                            number: identificationNumber
                        }
                    }
                };

                var baseUrl = servicesUrlPago;//"https://localhost:7011";
                const uri = baseUrl + '/PaymentCard';

                //alert($("#CustomerId").val());

                let response = fetch(`${uri}/create_card_user/${Pais}`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(objUsuario)
                }).then(res => res.text())
                    .then((data) => {
                        if (data == '"Proceso almacenado correctamente"') {
                            Swal.fire({
                                tittle: "Éxito!",
                                text: "Tarjeta agregada correctamente.",
                                type: "success",
                                confirmButtonText: "Ok"
                            }).then(async () => {
                                if (window.location.href.includes("HomeWallet")) {
                                    $('#DivAddCard').hide();
                                    $('#DivAddNewCard').show();
                                    $('#DivListCard').show();
                                    document.location.reload(true);
                                }
                                else if (window.location.href.includes("ResumenAtencion")) {
                                    await callBack();
                                }
                            });
                        } else if (data == '"Error al guardar la tarjeta del usuario"') {
                            Swal.fire({
                                tittle: "Error!",
                                text: "Error al agregar la tarjeta al usuario",
                                type: "error",
                                confirmButtonText: "Aceptar"
                            }).then(() => {
                                if (window.location.href.includes("HomeWallet")) {
                                    $('#DivAddCard').hide();
                                    $('#DivAddNewCard').show();
                                    $('#DivListCard').show();
                                    document.location.reload(true);
                                }
                                else if (window.location.href.includes("ResumenAtencion")) {
                                    $('#DivPayment').show();
                                    $('#paymentBrick_container').show();
                                    $('#DivAddCard').hide();
                                    $('#probarModalMP').show();
                                }
                            });
                        } else if (data == '"Error al guardar la tarjeta de la carga"') {

                            Swal.fire({
                                tittle: "Error!",
                                text: "Error al agregar la tarjeta a la carga",
                                type: "error",
                                confirmButtonText: "Aceptar"
                            }).then(() => {
                                $('#DivAddCard').hide();
                                $('#DivAddNewCard').show();
                                $('#DivListCard').show();
                                document.location.reload(true);
                            });
                        } else {

                            Swal.fire({
                                tittle: "Error!",
                                text: "Error al agregar la tarjeta, verifica los datos ingresados.",
                                type: "error",
                                confirmButtonText: "Aceptar"
                            }).then(async () => {
                                if (window.location.href.includes("HomeWallet")) {
                                    $('#DivAddCard').hide();
                                    $('#DivAddNewCard').show();
                                    $('#DivListCard').show();
                                    document.location.reload(true);
                                }
                                else if (window.location.href.includes("ResumenAtencion")) {
                                    await callBack();
                                }
                            });
                        }
                    }).catch(error => {
                        console.error(error)
                    });

            },
            onFetching: (resource) => {
                console.log("Fetching resource: ", resource);

            },
            onValidityChange: (error, validityChangeResponse, field) => {
                //;
                console.log("mesagge resource: ", error)
            },
            onBinChange: (error) => {
                //;
                console.log("onBinChange resource: ", error)
            },
            onReady: () => {
                // handle form ready
            },
            onError: (error) => {
                // handle error
                let resp = error[0].message.includes("Invalid cardholder.identification.number") ? { Respuesta: "Número de identificación no valido" } : error[0].message.includes("expirationYear value should be greater or equal than") ? { Respuesta: "El año de vecimiento es menor al actual" } : error[0].message.includes("expirationMonth value should be greater") ? { Respuesta: "El mes de vecimiento es menor al actual" } : getErroresMP(users, error[0].message);
                Swal.fire("Error!", resp.Respuesta, "error");
                console.log(error);
            }
        },
    });

}
$("#form-checkout__identificationNumber").keyup(function () {
    $("#form-checkout__identificationNumber").val(replaceName($("#form-checkout__identificationNumber").val()));
});

function replaceName(e) {
    return e = e.replace("-", "");
}
}


$("#btnFormBack").click(function () {
    if (cardForm != "")
        cardForm.unmount();
});

$("#btnCerrarModalPago").click(function () {
    if (cardForm != "")
        cardForm.unmount();
});

$(document).ready(function () {

});

function getErroresMP(users, userId) {
    return users.find(user => user.Error === userId);
}

const users = [{
    Error: 'cardNumber should be a number.',
    Respuesta: 'El número tarjeta debe ser un valor numérico'
}, {
    Error: 'cardNumber is empty.',
    Respuesta: 'El número de la tarjeta está vacio'
}, {
    Error: "cardNumber should be of length '16'.",
    Respuesta: 'El número tarjeta debe ser de 16 dígitos'
}, {
    Error: "cardNumber should be of length '15'.",
    Respuesta: 'El número tarjeta debe ser de 15 dígitos'
}, {
    Error: "cardNumber should be of length between '8' and '19'.",
    Respuesta: 'El número tarjeta está incompleto'
}, {
    Error: 'securityCode should be a number.',
    Respuesta: 'Código CVV debe ser númerico'
}, {
    Error: "securityCode should be of length '3'.",
    Respuesta: 'Código CVV incompleto'
}, {
    Error: "securityCode should be of length '4'.",
    Respuesta: 'Código CVV incompleto'
}, {
    Error: 'securityCode is empty.',
    Respuesta: 'Código CVV está vacio'
}, {
    Error: 'expirationMonth should be a number.',
    Respuesta: 'El mes de vencimiento debe ser un número'
}, {
    Error: 'expirationMonth is empty.',
    Respuesta: 'El mes de vencimiento está vacio'
}, {
    Error: "expirationYear should be of length '2' or '4'.",
    Respuesta: 'El mes de vencimiento está incompleto'
}, {
    Error: 'expirationYear should be a number.',
    Respuesta: 'El año de vencimiento debe ser un número'
}, {
    Error: 'expirationYear is empty.',
    Respuesta: 'El año de vencimiento está vacio'
}, {
    Error: 'parameter identificationNumber can not be null/empty',
    Respuesta: 'El número de identificación está vacio'
}, {
    Error: 'invalid parameter identificationNumber',
    Respuesta: 'La identificación debe ser un número'
}, {
    Error: 'Invalid cardholder.identification.number',
    Respuesta: 'El número de identificación es errado'
}, {
    Error: 'parameter cardholderName can not be null/empty',
    Respuesta: 'Ingresa un nombre de titular de la tarjeta '
}, {
    Error: 'expirationMonth should be a value from 1 to 12.',
    Respuesta: 'Ingresa un mes de vencimiento válido'
}
];


function fValidarTarjeta() {
    var opt = $("#lstTipoTarjeta option:selected").val();
    codigo = $("#nro_tarjeta").val().replace('-', '');
    var msg = "Valor incorrecto";
    VISA = /^4[0-9]{3}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/;
    MASTERCARD = /^5[1-5][0-9]{2}-?[0-9]{4}-?[0-9]{4}-?[0-9]   {4}$/;
    AMEX = /^3[47][0-9-]{16}$/;
    CABAL = /^(6042|6043|6044|6045|6046|5896){4}[0-9]{12}$/;
    NARANJA = /^(589562|402917|402918|527571|527572|0377798|0377799)[0-9]*$/;

    $("#err_nro_tarjeta").html("");
    if (luhn(codigo)) {
        if (opt == "VISA" && !codigo.match(VISA)) {
            alert(msg);
        }
        if (opt == "MASTERCARD" && !codigo.match(MASTERCARD)) {
            alert(msg);
        }
        if (opt == "NARANJA" && !codigo.match(NARANJA)) {
            alert(msg);
        }
        if (opt == "CABAL" && !codigo.match(CABAL)) {
            alert(msg);
        }
        if (opt == "AMEX" && !codigo.match(AMEX)) {
            alert(msg);
        }
    } else {
        alert(msg);
    }
}
function luhn(value) {
    // Accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;
    // The Luhn Algorithm. It's so pretty.
    let nCheck = 0, bEven = false;
    value = value.replace(/\D/g, "");
    for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
            nDigit = parseInt(cDigit, 10);
        if (bEven && (nDigit *= 2) > 9) nDigit -= 9; nCheck += nDigit; bEven = !bEven;
    }
    return (nCheck % 10) == 0;
}
