import { SaveOrder, CreateGuestCart, CreateCart, orderPaySuccessfuly, CreateInvoice, UpdateOrderPagoFarmazon } from '../apis/carro-compras-fetch.js';
import { enviarCorreoExamedi } from '../apis/correos-fetch.js';
import { putAgendarMedicosHoras, getAtencionByIdMedicoHora, confirmarEstadoAtencionWow } from '../apis/agendar-fetch.js?rnd=8';
var medicamentosListChecked = new Array();
var examenesListChecked = new Array();
var dataCartFarmazon = new Array();
var medicoDerivacion = new Array();
var globalData;
var medicamentosShipping = new Array();
let idCarro = 0;
let idEstadoCarrito = 0;
let agendar = null;
let interconsultaId = 0;
var CartOrder = null;
let idAtencion = 0;

const noTruncarDecimales = {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
};
export async function init(data) {
    debugger
    globalData = data;
    //idAtencion = data.atencion.id;
    idAtencion = data.atencion && data.atencion.id !== null && data.atencion.id !== undefined ? data.atencion.id : 0;

    $("#agregar-direccion-examenes, #agregar-direccion-medicamentos, #seleccionar-direccion-examenes, #seleccionar-direccion-medicamentos").click(async function (e) {
        e.preventDefault();

        const tipo = e.currentTarget.id.includes("examenes") ? "E" : "M";
        const accion = e.currentTarget.id.includes("agregar") ? "A" : "S";

        if (accion === "A")
            await cargarModalAgregarDireccion(tipo);
        else
            await cargarModalSeleccionarDireccion(tipo);
    });


    var listadoMed = $("#listadoMedicamentos");
    var listadoExa = $("#listadoExamenes");
    if (listadoMed.children().length === 0) {
        window.billing_address = "inactivo"
        $("#divDireccionMedi").hide();
        $("#DivTituloMedicamentos").hide();
    }
    if (listadoExa.children().length === 0) {
        window.billing_addressEx = "inactivo"
        $("#divDireccionExa").hide();
        $("#DivTituloExamenes").hide();
    }


    $('#pagarlista').on('click', async function (ev) {
        if (window.billing_address == undefined || window.billing_addressEx == undefined) {

            Swal.fire("¡Por favor, recuerda seleccionar dirección de despacho!");
            return false;
        }
        else {
            $("#modalGeneral").modal("show");
        }
    });
    $("#btnCerrarGeneral").click(function () {
        $("#modalGeneral").modal("hide");
    });


    await sizeImgMedico();
    cargarSoloInterconsulta();
}



async function cargarSoloInterconsulta() {
    var costoDespacho = $("#costoDespachoTotalCustom").text();
    costoDespacho = $.trim(costoDespacho.replace('$', ''));
    costoDespacho = parseInt(costoDespacho);

    var costoDscto = $("#costoDsctoMedismart").text();
    costoDscto = $.trim(costoDscto.replace('$', ''));
    costoDscto = parseInt(costoDscto);

    if (costoDespacho == 0 && costoDscto == 0) {
        $("#compraDespacho").hide();
        $("#compraSubTotal").hide();
        $("#compraDescuento").hide();
        $('.wow__lista-body_compra').css('margin-top', '50px');
    }
}

async function sizeImgMedico() {
    var examen = $("#listaExamen").length > 0;
    var medicamento = $("#listaMedicamento").length > 0;
    var interconsulta = $("#listaInterconsulta").length > 0;

    if (examen && medicamento && interconsulta) {
        $(".imagenMedicoCompra__sm").css("height", "600px");
    }
    else if (examen && medicamento || medicamento && interconsulta || examen && interconsulta) {
        $(".imagenMedicoCompra__sm").css("height", "600px");
    }
}

$('#volverInicio').on('click', async function (ev) {
    debugger
    if (window.codigoTelefono == "CL") {
        window.location = "/";
    }
    else if (window.codigoTelefono == "MX") {
        window.location = `/InformeAtencion/${idAtencion}`;
    }
});
