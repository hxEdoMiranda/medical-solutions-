import { SaveOrder, CreateGuestCart, CreateCart, orderPaySuccessfuly, CreateInvoice, UpdateOrderPagoFarmazon, UpdateOrderStatus, SaveOrderSubscription } from '../apis/carro-compras-fetch.js';
import { enviarCorreoSuscripcionDidi } from '../apis/correos-fetch.js';
import { agregarTarjeta } from '../PasarelaPago/HomeWallet.js';
import { GetCardsByUid } from '../apis/resumen-atencion-custom-fetch.js';


var medicamentosListChecked = new Array();
var examenesListChecked = new Array();
var interconsultaListChecked = new Array();
var dataCartFarmazon = new Array();
var medicoDerivacion = new Array();
var globalData;
var medicamentosShipping = new Array();
let idCarro = 0;
let idEstadoCarrito = 0;
let agendar = null;
let interconsultaId = 0;
var CartOrder = null;
let shipping = null;
let resInter = null;
let mpBrick = null;
let bricksBuilder = null;
let renderPaymentBrick = null;
let preapprovalPlanId = "";
let isPageReloaded = false;

let urlMercadoPagoCL = "https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=";
let urlMercadoPagoMX = "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=";

let isBackButton = false;
let cardsId = "";
let crearNuevasTarjetasMP = false;

var nombreCheckbox = $('#idFacturaEsp').attr('name');
var valorCheckbox = $('#idFacturaEsp').val();

let totalDescuento = 0;
let modelFactura = modelVista.invoiceModel;

const codigoPais = window.codigoTelefono;
const moduloExamenes = $("#DivExamenes");
const moduloMedicamentos = $("#DivMedicamentos");
const moduloInterconsulta = $("#DivInterconsulta");
const sinTarjetas = $("#msjSinTarjetasWallet");
const listaGral = $("#divLista");
const listaSF = $("#divListaSinFactura");
const wowResumen = $("#DivWowResumen");

const noTruncarDecimales = {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
};
export async function init(data) {
    globalData = data;
    preapprovalPlanId = data.invoiceCf.preapprovalPlanId;

    async function callBackTarjetaGuardada() {

        const tarjetasNuevas = await GetCardsByUid(uid);
        cardsId = "";
        customer_id = tarjetasNuevas.tarjetas[0].customerId;
        for (var i = 0; i < tarjetasNuevas.tarjetas.length; i++) {
            cardsId += cardsId == "" ? tarjetasNuevas.tarjetas[i].cardId.toString() : "," + tarjetasNuevas.tarjetas[i].cardId.toString();
        }
        $("#btnCerrarModalPago").click();
        $("#buttonpagos").click();
    }

    $('#agregarTarjetaMP').on('click', async function (ev) {
        $("#loaderCar").modal("hide");
        $('#DivPayment').hide();
        $('#agregarTarjetaMP').hide();
        $('#titleTarjetas').hide();
        $('#paymentBrick_container').hide();
        $("#pagoNoProcesadoMP").hide();
        $("#loaderCarBack").modal("hide");
        $("#modalGeneral").modal("show");
        $('#DivAddCard').show();
        if (crearNuevasTarjetasMP == true)
            $(".back_cta").css("display", "none");
        if (window.paymentBrickController != undefined)
            window.paymentBrickController.unmount();
        const agregarNuevaTarjeta = await agregarTarjeta(codigoPais, callBackTarjetaGuardada);
    });

    $("#pagarlista").click(function () {
        botonesPagoValidar("DivPagoTransBank");
    });

    $("#btnFormBack").click(function () {
        isBackButton = true;
        $("#modalGeneral").modal("hide");
        $("#DivAddCard").hide();
        botonesPagoValidar("DivPagoMercadoPago");
        $('#agregarTarjetaMP').show();
        if (window.paymentBrickController != undefined)
            window.paymentBrickController.unmount();
    });

    $("#buttonsuscripcion").click(async function () {
        await crearCarrito();
        window.location.href = (modelVista.fichaPaciente.codigoTelefono === "CL") ? urlMercadoPagoCL + preapprovalPlanId : urlMercadoPagoMX + preapprovalPlanId;
        //if ($("#suscripcionesMP .modal-body iframe").length === 0) {
        //    const iframe = $("<iframe>")
        //        .attr("src", "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=" + preapprovalPlanId)  //prod: 2c93808487f97f040188013237b60257  pruebas: 2c93808487f97f0401880103da230241
        //        .attr("width", "100%")
        //        .attr("sandbox", "allow-top-navigation")
        //        .attr("height", "100%")
        //        .attr("id", "mp-iframe").on("load", function () {
        //            $("#loaderCar").modal("hide");
        //        });
        //    $("#suscripcionesMP .modal-body").append(iframe);
        //}
        //$("#suscripcionesMP").modal("show");
        //$("#modalCorreoMP").modal("hide");
    });


    $("#btnCerrarModalPagoIFrame").click(async function () {
        $("#suscripcionesMP").modal("hide");
        comprobarSuscripcionMP();
    });

    $("#buttonpagos").click(function () {
        crearNuevasTarjetasMP = false;
        botonesPagoValidar("DivPagoMercadoPago");
        $('#agregarTarjetaMP').show();
    });

    $("#buttonAddCardWC").click(async function () {
        crearNuevasTarjetasMP = true;
        $("#bannerTarjetas").hide();
        await botonesPagoValidar("agregarTarjetaMP");
    });

    async function validarVistaGral() {
        if (modelFactura == null || modelFactura.estado != "A") {
            listaGral.css("visibility", "visible");
            listaSF.css("visibility", "hidden");
        }
        else {
            listaGral.css("visibility", "hidden");
            wowResumen.css("margin-top", "1rem");
            listaSF.css("visibility", "visible");
            wowResumen.css("max-width", "1200px");
            wowResumen.css("margin-top", "2rem");
            listaSF.css("width", "40%");
            listaSF.css("margin-left", "58%");
            listaSF.css("margin-top", "-43rem");
        }
    }

    async function botonesPagoValidar(pasarelaPago) {
        var valorTotalCar = $("#totalPrice").text().substring(1, $("#totalPrice").text().length);
        let examenes = $("#examenes-list input").is(":checked");
        if (valorTotalCar > 0) {
            if (examenes) {
                if (isBackButton == true) {
                    $("#loaderCarBack").modal("show");
                    await crearCarrito();
                    var div = document.getElementById(pasarelaPago);
                    div.click();
                }
                else {
                    $("#loaderCar").modal("show");
                    await crearCarrito();
                    $("#loaderCar").modal("hide");
                    var div = document.getElementById(pasarelaPago);
                    div.click();
                }
            }
            else {
                Swal.fire("¡Por favor, recuerda seleccionar los elementos que deseas adicionar al pago!");
            }

        }
        else {
            Swal.fire("¡Por favor, recuerda seleccionar los elementos que deseas adicionar al pago!");
        }
    }

    $("#btnCerrarGeneral").click(function () {
        $("#modalGeneral").modal("hide");
        comprobarSuscripcionMP();
    });

    for (var i = 0; i < data.datosTarjetasMercadoPago.tarjetas.length; i++) {
        let chk = document.getElementById(data.datosTarjetasMercadoPago.tarjetas[i].cardId.toString());

        if (chk != null) {

            chk.addEventListener("click", e => {
                const id = e.target.getAttribute("id");
                for (var d = 0; d < data.datosTarjetasMercadoPago.tarjetas.length; d++) {
                    if (data.datosTarjetasMercadoPago.tarjetas[d].cardId != id) {
                        window.document.getElementById("cardNumber").value = data.datosTarjetasMercadoPago.tarjetas[d].cardId;
                        $("#form-checkout__identificationNumber").val = data.datosTarjetasMercadoPago.identificador;
                        $("#form-checkout__cardholderEmail").val = data.datosTarjetasMercadoPago.nombreUser;
                        //window.document.getElementById("cardNumber").value = data.datosTarjetasMercadoPago[m].nombreUser

                    }
                }
            });
        }

    }

    async function validarEstadosCarro(order_status, newInvoiceId) {
        if (modelVista.orderAttention != null)
            if (order_status == 3) {
                $("#loaderSuscrip").modal("show");
                $(".checkbox").hide();
                $("#divLista").hide();
                $("#divtotales").hide();
                $("#pagarlista").hide();
                await sendCorreoSuscripcionDidi();
                await cambioEstadoOrden(modelVista.orderAttention.id, 5);
                $("#loaderSuscrip").modal("show");
                await redireccionCompraSuscripcion(newInvoiceId);
                //fin
            }
            else if (order_status === 2) {
                idEstadoCarrito = data.orderAttention.order_status_id;
                idCarro = modelVista.orderAttention.id;
                await pagoNoExitoso();
            }
            else if (order_status === 4) {
                $("#lista-medico-intertconsulta").prop("disabled", true);
            }
            else if (order_status === 5) {
                await confirmedBuyHide();
            }
            else {
                idEstadoCarrito = modelVista.orderAttention.order_status_id;
                idCarro = modelVista.orderAttention.id;
            }
    }

    async function validarPagina() {
        if (moduloExamenes.length == 0 && moduloMedicamentos.length == 0 && moduloInterconsulta.length == 0) {
            $(".wow__resumen").css("max-width", "600px");
            $(".wow__tabs").css("width", "100%");
            $(".tab-content__header").css("gap", "2rem");
        }
    }

    async function mostrarPagoSinTarjeta() {
        if (sinTarjetas.length > 0) {
            $("#totalPrice").hide();
            $("#totalLabel").hide();
            $("#buttonpagos").prop("disabled", true);
            $("#buttonpagos").css("pointer-events", "none");
        }
    }

    async function comprobarSuscripcionMP() {
        let baseUrl = servicesUrlPago;
        const uri = baseUrl + '/MercadoPago';
        let finalUrl = "";
        let objUsuario = null;
        idCarro = modelVista.orderAttention.id
        objUsuario = {
            description: "Descripción del producto",
            cardId: "",
            order_id: idCarro.toString(),
            userId: parseInt(uid),
            payer: {
                email: modelVista.fichaPaciente.correo,
            }
        };

        finalUrl = uri + "/SearchPreapproval/" + codigoPais + "?email=" + modelVista.fichaPaciente.correo + "&preapprovalplanid=" + preapprovalPlanId;
        try {
            const response = await fetch(finalUrl, {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objUsuario)
            });
            const data = await response.json();
            if (data.status == "authorized") {
                await validarEstadosCarro(data.order_status, data.invoice_id);
            }
            else {
                $("#pagoNoProcesadoMP").show();
                //Swal.fire("¡Error al generar tu pago!", resultado.msg, "error");
            }
        } catch (error) {
            // manejar la respuesta de error al intentar crear el pago
            console.log(error);
        }
    }

    await validarVistaGral()
    await validarPagina();
    await mostrarPagoSinTarjeta();
    await comprobarSuscripcionMP();
    await checkAllList();
    await validarEstadosCarro();

}


async function checkAllList() {
    $(".checkbox").each(function () {
        $(this).prop("checked", true);
    });
}

async function confirmedBuyHide() {
    listaGral.css("visibility", "hidden");
    listaSF.css("visibility", "visible");
    wowResumen.css("max-width", "1200px");
    wowResumen.css("margin-top", "2rem");
    listaSF.css("width", "40%");
    listaSF.css("margin-left", "58%");
    listaSF.css("margin-top", "-43rem");
}


function examenesActions(data) {
    if ($("#examenes-list")) {
        $('#examenes-list input').each(async function () {
            var check1 = $(this).attr("id");
            $(this).on("change", function () {
                $('#examenes-list-tab input').each(function () {
                    if (($(this).attr("id") == check1 + "_tab")) {
                        this.checked = !this.checked;
                        return 0;
                    }

                });
                listExamenes(data);
                actualizarTextoBoton();
            });
        });
    }
    if ($("#examenes-list-tab")) {
        $('#examenes-list-tab input').each(async function () {
            var check1 = $(this).attr("id");
            $(this).on("click", function () {
                $('#examenes-list input').each(function () {
                    if (($(this).attr("id") + "_tab") == check1) {
                        this.checked = !this.checked;
                        return 0;
                    }
                });
                listExamenes(data);
            });
        });
    }
}

$("#buttonsuscripcionModal").click(function () {
    $("#modalCorreoMP").modal("show");
});

$('#btnCopiarCorreo').click(function () {
    const correo = $('#txtCorreo').val();
    $(this).focus();
    setTimeout(function () {
        navigator.clipboard.writeText(correo)
            .then(function () {
                $('#imgCopiarCorreo').attr('src', '/img/didi/circle-check-didi.svg');
                $('#btnCopiarCorreo').attr('title', 'Copiado');
                setTimeout(function () {
                    $('#imgCopiarCorreo').attr('src', '/img/didi/copy-mail.svg');
                    $('#btnCopiarCorreo').attr('title', 'Copiar dirección de correo electrónico');
                }, 3000);
            })
            .catch(function (error) {
                console.error('Error al copiar al portapapeles:', error);
            });
    }, 100);
});



async function createDetails() {
    let OrderDetails = new Array();
    let objOrderDetail = null;
    var sale_timestamp = new Date();
    var sale_period = parseInt(sale_timestamp.getFullYear() + '' + (sale_timestamp.getMonth() + 1 > 9 ? sale_timestamp.getMonth() + 1 : '0' + (sale_timestamp.getMonth() + 1).toString()));
    /*if (accion == "examenes") {*/
    if ($("#idFacturaEsp").is(":checked")) {
        objOrderDetail = {
            id: 0,
            order_header_id: 0,
            sale_period: sale_period,
            line_sequence: 0,
            product_id: parseInt(nombreCheckbox), //item."productID"
            external_product_id: '',
            order_product_status_id: 1,
            category: 4, //4 - PagoSuscripcion
            total_items: 1,
            total_amount: valorCheckbox, //price_Without_discount PRECIO SIN DESCUENTO 
            discount_amount: valorCheckbox, //discount_amount
            tax_amount: 0,
            final_amount: valorCheckbox, //price
            total_cost: valorCheckbox, //price
            total_margin: 0,
            has_warranty: false,
            unit_product_price: parseInt(valorCheckbox) //prie
        };
        OrderDetails.push(objOrderDetail);
    }

    return OrderDetails;
}
export async function crearCarrito() {
    //
    var OrderHeader = new Array();
    let OrderDetails;
    var totalCost = 0;
    var line = 1;
    var data = globalData;
    var sale_timestamp = new Date();
    var sale_period = parseInt(sale_timestamp.getFullYear() + '' + (sale_timestamp.getMonth() + 1 > 9 ? sale_timestamp.getMonth() + 1 : '0' + (sale_timestamp.getMonth() + 1).toString()));
    let objOrderHeader = new Array();
    let derliveryAmount = 0;
    let customIdAddress = 0;

    //let objRes = createDetails(medicoDerivacion, "interconsulta")
    //if (objRes)
    //    objOrderDetail.push(objRes);
    /*if (accion == "examenes") {*/
    OrderDetails = await createDetails();
    //}
    /*if (accion == "medicamentos") {*/
    //objRes = createDetails(modelVista.medicamentos, "medicamentos");
    //OrderDetail = objRes;
    customIdAddress = 0;
    derliveryAmount = 0;
    //}

    objOrderHeader = {
        id: (modelFactura == null || modelFactura.estado == "C") ? 0 : idCarro,  //Crea nuevo carro si la factura está cancelada "C"
        attention_id: null,
        sale_timestamp: sale_timestamp.toISOString().slice(0, 10),
        sale_period: sale_period,
        transaction_type: 1,
        order_status_id: 1,
        was_pay_by_promotion: false,
        total_amount: valorCheckbox,
        delivery_amount: 0, // medicamentos - dejar en 0 cuando venga retiro en tienda
        discount_amount: totalDescuento,
        tax_amount: 0,
        final_amount: valorCheckbox,
        total_cost: valorCheckbox,
        total_margin: 0,
        total_lines: OrderDetails.length,
        total_items: OrderDetails.length,
        customer_delivery_address_id: window.billing_address !== undefined ? window.billing_address.customer_delivery_address_id : 0, // medicamentos
        customer_exam_address_id: window.billing_addressEx !== undefined ? window.billing_addressEx.customer_delivery_address_id : 0, // examenes
        Items_details: OrderDetails,
        detail_add_optional: JSON.stringify(CartOrder),
        userId: parseInt(uid),
        invoice_id: (modelFactura != null && modelFactura.estado == "P") ? modelFactura.id : null
    };

    //if (idCarro == 0)

    idCarro = await SaveOrderSubscription(objOrderHeader);
    //console.log(carrito);
}


async function listExamenes(data) {
    examenesListChecked = [];
    $('#examenes-list input:checked').each(function () {
        examenesListChecked.push($(this).attr('name'));
        $("#divCostoEnvioExamen").show();
        $("#divDireccionExa").show();
    });
    if (examenesListChecked.length < 1) {
        //return -1;
        $("#divCostoEnvioExamen").hide();
        $("#divDireccionExa").hide();
    }
}



async function redireccionCompraSuscripcion(invoiceIdNew) {
    location.href = `./CompraSuscripcion?idFactura=${invoiceIdNew}&idEmpPayed=${modelVista.orderAttention.items_details[0].product_id}`;
}

async function pagoNoExitoso() {
    Swal.fire({
        tittle: "¡Aviso!",
        text: "Tu compra no ha sido confirmada.",
        type: "warning",
        confirmButtonText: "Aceptar",
        success: function () {
            alert("Ups!");
        }
    })
}

//async function buildBrickMP() {

//    userIdCard = uid;
//    let totalCarroPago = $("#totalPriceCarro").text();
//    const totalPriceFormat = $("#totalPrice").text();
//    mpBrick = new MercadoPago(publicKey);
//    bricksBuilder = mpBrick.bricks({ theme: 'flat' });
//    renderPaymentBrick = async (bricksBuilder) => {
//        const settings = {
//            initialization: {
//                amount: totalCarroPago, // monto a ser pago
//                payer: {
//                    customerId: customer_id,
//                    cardsIds: [cardsId],
//                    email: "",
//                    cardholderName: ""
//                },

//            },
//            customization: {
//                paymentMethods: {
//                    creditCard: ['visa', 'master', 'amex'],
//                    /*                    debitCard: 'all'*/
//                },
//                visual: {
//                    texts: {
//                        formTitle: '',
//                        formSubmit: 'PAGAR:  ' + totalPriceFormat,
//                        paymentMethods: {
//                            newCreditCardTitle: "Pagar con otra tarjeta",
//                            creditCardValueProp: "Pagar con tarjeta crédito",
//                        }
//                    },
//                }
//            },
//            callbacks: {
//                onReady: () => {

//                    $("#loaderCarBack").modal("hide");
//                    $("#loaderCar").modal("hide");
//                    $("#modalGeneral").modal("show");
//                    $('#DivPayment').show();
//                    $('#agregarTarjetaMP').show();
//                    $('#titleTarjetas').show();
//                    $('#paymentBrick_container').show();
//                    $('#DivAddCard').hide();
//                    /*
//                      Callback llamado cuando Brick está listo
//                      Aquí puedes ocultar loadings de su sitio, por ejemplo.
//                    */
//                },
//                onSubmit: ({ selectedPaymentMethod, formData }, additionalData) => {
//                    // callback llamado al hacer clic en el botón de envío de datos
//                    var baseUrl = servicesUrlPago;
//                    var baseUrlWeb = servicesUrlWeb;
//                    const uri = baseUrl + '/MercadoPago';

//                    var finalUrl = "";

//                    let objUsuario = null;


//                    if (typeof formData.payer.email !== '' && formData.payer.email !== undefined && formData.payer.email !== null) {
//                        objUsuario = {
//                            token: formData.token,
//                            issuer_id: formData.issuer_id,
//                            payment_method_id: formData.payment_method_id,
//                            transaction_amount: Number(formData.transaction_amount),
//                            installments: Number(formData.installments),
//                            description: "Descripción del producto",
//                            userId: userIdCard,// $("#iduser").val(),
//                            customerId: customer_id,// $("#CustomerId").val(),
//                            cardId: "",
//                            order_id: idCarro.toString(),
//                            payer: {
//                                email: formData.payer.email,
//                                identification: {
//                                    type: formData.payer.identification.type,
//                                    number: formData.payer.identification.number,
//                                }
//                            }
//                        };
//                        finalUrl = uri + "/Process_Payment/" + codigoPais;
//                    } else {

//                        objUsuario = {
//                            token: formData.token,
//                            issuer_id: formData.issuer_id,
//                            payment_method_id: formData.payment_method_id,
//                            transaction_amount: Number(formData.transaction_amount),
//                            installments: Number(formData.installments),
//                            description: "Descripción del producto",
//                            userId: userIdCard,// $("#iduser").val(),
//                            customerId: customer_id,// $("#CustomerId").val(),
//                            cardId: "",
//                            order_id: idCarro.toString(),
//                            payer: {
//                                id: formData.payer.id,
//                                email: modelVista.fichaPaciente.correo,
//                                type: formData.payer.type,
//                            }
//                        };
//                        finalUrl = uri + "/Process_Payment/" + codigoPais;

//                    }
//                    return new Promise((resolve, reject) => {
//                        fetch(finalUrl, {
//                            method: "POST",
//                            mode: 'cors',
//                            headers: {
//                                'Access-Control-Allow-Origin': '*',
//                                'Accept': 'application/json',
//                                'Content-Type': 'application/json'
//                            },
//                            body: JSON.stringify(objUsuario)
//                        })
//                            .then(response => response.json())
//                            .then(data => {

//                                if (data.payment_status_id == 3) {
//                                    resolve();
//                                    Swal.fire("¡Pago Exitoso!");
//                                    location.reload();
//                                }
//                                else {

//                                    reject();
//                                    $("#pagoNoProcesadoMP").show();
//                                    //Swal.fire("¡Error al generar tu pago!", resultado.msg, "error");
//                                    return;
//                                }
//                            })
//                            .catch((error) => {
//                                // manejar la respuesta de error al intentar crear el pago
//                                reject();
//                            })
//                    });
//                },
//                onError: (error) => {
//                    // callback solicitado para todos los casos de error de Brick
//                    console.log(JSON.stringify(error))
//                },
//            },
//        };

//        window.paymentBrickController = await bricksBuilder.create(
//            'payment',
//            'paymentBrick_container',
//            settings
//        );
//    };
//    renderPaymentBrick(bricksBuilder);
//}

async function buildBrickMP() {

    userIdCard = uid;
    let totalCarroPago = $("#totalPriceCarro").text();
    const totalPriceFormat = $("#totalPrice").text();
    mpBrick = new MercadoPago(publicKey);
    bricksBuilder = mpBrick.bricks({ theme: 'flat' });
    renderPaymentBrick = async (bricksBuilder) => {
        const settings = {
            initialization: {
                amount: totalCarroPago, // monto a ser pago
            },
            subscription: {
                planId: '2c93808487f97f0401880103da230241',
                payer: {
                    customerId: customer_id,
                    cardsIds: [cardsId],
                    email: "",
                    cardholderName: ""
                },
            },
            customization: {
                paymentMethods: {
                    creditCard: ['visa', 'master', 'amex'],
                    debitCard: 'all'
                },
                visual: {
                    texts: {
                        formTitle: '',
                        formSubmit: 'PAGAR:  ' + totalPriceFormat,
                        paymentMethods: {
                            newCreditCardTitle: "Pagar con otra tarjeta",
                            creditCardValueProp: "Pagar con tarjeta crédito",
                        }
                    },
                }
            },
            callbacks: {
                onReady: () => {
                    $("#loaderCarBack").modal("hide");
                    $("#loaderCar").modal("hide");
                    $("#modalGeneral").modal("show");
                    $('#DivPayment').show();
                    $('#agregarTarjetaMP').show();
                    $('#titleTarjetas').show();
                    $('#paymentBrick_container').show();
                    $('#DivAddCard').hide();
                },
                onSubmit: ({ selectedPaymentMethod, formData }, additionalData) => {
                    // callback llamado al hacer clic en el botón de envío de datos
                    var baseUrl = servicesUrlPago;
                    var baseUrlWeb = servicesUrlWeb;
                    const uri = baseUrl + '/MercadoPago';

                    var finalUrl = "";

                    let objUsuario = null;


                    if (typeof formData.payer.email !== '' && formData.payer.email !== undefined && formData.payer.email !== null) {
                        objUsuario = {
                            token: formData.token,
                            issuer_id: formData.issuer_id,
                            payment_method_id: formData.payment_method_id,
                            transaction_amount: Number(formData.transaction_amount),
                            installments: Number(formData.installments),
                            description: "Descripción del producto",
                            userId: userIdCard,// $("#iduser").val(),
                            customerId: customer_id,// $("#CustomerId").val(),
                            cardId: "",
                            order_id: idCarro.toString(),
                            payer: {
                                email: formData.payer.email,
                                identification: {
                                    type: formData.payer.identification.type,
                                    number: formData.payer.identification.number,
                                }
                            }
                        };
                        finalUrl = uri + "/Process_Payment/" + codigoPais;
                    } else {

                        objUsuario = {
                            token: formData.token,
                            issuer_id: formData.issuer_id,
                            payment_method_id: formData.payment_method_id,
                            transaction_amount: Number(formData.transaction_amount),
                            installments: Number(formData.installments),
                            description: "Descripción del producto",
                            userId: userIdCard,// $("#iduser").val(),
                            customerId: customer_id,// $("#CustomerId").val(),
                            cardId: "",
                            order_id: idCarro.toString(),
                            payer: {
                                id: formData.payer.id,
                                email: modelVista.fichaPaciente.correo,
                                type: formData.payer.type,
                            }
                        };
                        finalUrl = uri + "/Process_Payment/" + codigoPais;

                    }
                    return new Promise((resolve, reject) => {
                        fetch(finalUrl, {
                            method: "POST",
                            mode: 'cors',
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(objUsuario)
                        })
                            .then(response => response.json())
                            .then(data => {

                                if (data.payment_status_id == 3) {
                                    resolve();
                                    Swal.fire("¡Pago Exitoso!");
                                    location.reload();
                                }
                                else {

                                    reject();
                                    $("#pagoNoProcesadoMP").show();
                                    //Swal.fire("¡Error al generar tu pago!", resultado.msg, "error");
                                    return;
                                }
                            })
                            .catch((error) => {
                                // manejar la respuesta de error al intentar crear el pago
                                reject();
                            })
                    });
                },
                onError: (error) => {
                    console.log(JSON.stringify(error))
                },
                onSubscriptionChange: (subscription) => {
                    // ...
                }
            }
        };

        window.paymentBrickController = await bricksBuilder.create(
            'payment',
            'paymentBrick_container',
            settings
        );
    };
    renderPaymentBrick(bricksBuilder);
}

//ENVÍO CORREO COMPRA SUSCRIPCION
async function sendCorreoSuscripcionDidi() {

    let objCorreo = null;
    let nombreUsuario = "";
    let partesNombre = "";
    let nombreCadena = "";
    let identificadorPlan = "";
    let partes = "";
    let resultadoIdentificador = "";
    let costoPlan = 0;
    let cantidadCargasPlan = 0;
    identificadorPlan = modelVista.planes[0].identificador;
    partes = identificadorPlan.split("-");
    partes[1] = "PLAN";
    resultadoIdentificador = partes.slice(1, 3).join(" ").toUpperCase(); //Obtener solo el nombre del plan 
    nombreUsuario = modelVista.fichaPaciente.nombre;
    partesNombre = nombreUsuario.trim().split(/\s+/);
    for (var i = 0; i < partesNombre.length; i++) {
        partesNombre[i] = partesNombre[i].charAt(0).toUpperCase() + partesNombre[i].slice(1).toLowerCase();
    }
    nombreCadena = partesNombre.join(" ");
    costoPlan = modelVista.planes[0].valor;
    cantidadCargasPlan = modelVista.planes[0].cantCargas;

    objCorreo = {
        costoPlan: costoPlan,
        nombrePaciente: nombreCadena,
        tipoPlan: resultadoIdentificador,
        email: modelVista.fichaPaciente.correo,
        cantidadCargas: cantidadCargasPlan
    }
    let envioCorreo = await enviarCorreoSuscripcionDidi(objCorreo);
    if (envioCorreo.status === 'OK') {
        return;
    }
    else {
        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
    }
}


async function cambioEstadoOrden(orden, estado) {
    await UpdateOrderStatus(orden, estado);
}


let customer_id, userIdCard;
$(document).ready(async function () {

    customer_id = modelVista.datosTarjetasMercadoPago.tarjetas.length > 0 ? modelVista.datosTarjetasMercadoPago.tarjetas[0].customerId : "";
    $("#CustomerId").val(customer_id);
    userIdCard = modelVista.datosTarjetasMercadoPago.tarjetas.length > 0 ? modelVista.datosTarjetasMercadoPago.tarjetas[0].idUser : "";
    cardsId = "";

    $('#DivPayment').hide();
    $('#PagoTrasbank').hide();

    $("#DivPagoTransBank").click(async function () {
        $("#loaderCar").modal("hide");
        $("#loaderIni").modal("show");
        let locationHref = new URL(window.location.href);
        let url = (locationHref.hostname.includes('unabactiva.') || locationHref.hostname.includes('activa.unab.')) ? locationHref.origin : urlBase;
        let totalCarroPago = $("#totalPriceCarro").text();
        var idAtencion = parseInt(modelVista.atencion.id);
        let userId = modelVista.atencion.idPaciente;

        let objPago = {
            "order_id": idCarro.toString(),
            "user_id": userId.toString(),
            "user_email": modelVista.fichaPaciente.correo.toString(),
            "subject": "pruebas wow",
            "url_return": url + "/ResumenAtencionCustom?idAtencion=" + idAtencion,
            "amount": totalCarroPago.toString(),
            "consultation_id": interconsultaId.toString()
        }

        let response = fetch(`https://paymentgatewaytratame.azurewebsites.net/PaymentGateway`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objPago)
        }).then(res => res.text())
            .then((res) => {
                let resultadoPaykiu = JSON.parse(res);
                console.log(res);
                $("#PagoTrasbank").empty();
                $("#PagoTrasbank").append('<a href="' + resultadoPaykiu.url + '">Ir a realizar el pago</a>');
                cambioEstadoOrden(idCarro, 2);
                //Método para ir directo al pago de paikiu mientras arreglamos mercadopago
                let urlPago = resultadoPaykiu.url;
                window.location.replace(urlPago);
            }).catch(error => {
                console.error(error)
            });

    });

    $("#btnCerrarModalPago").click(function () {
        $("#modalGeneral").modal("hide");
        $('#DivPayment').hide();
        $('#DivAddCard').hide();
        $('#agregarTarjetaMP').hide();
        $("#pagoNoProcesadoMP").hide();
        $('#paymentBrick_container').hide();
        isBackButton = false;
        if (window.paymentBrickController != undefined)
            window.paymentBrickController.unmount();
    });
    for (var i = 0; i < modelVista.datosTarjetasMercadoPago.tarjetas.length; i++) {
        cardsId += cardsId == "" ? modelVista.datosTarjetasMercadoPago.tarjetas[i].cardId.toString() : "," + modelVista.datosTarjetasMercadoPago.tarjetas[i].cardId.toString();
    }

    $("#DivPagoMercadoPago").click(async () => {
        await buildBrickMP();
    });


});