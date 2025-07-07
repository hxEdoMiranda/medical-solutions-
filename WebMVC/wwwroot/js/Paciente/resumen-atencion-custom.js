import { SaveOrder, CreateGuestCart, CreateCart, orderPaySuccessfuly, CreateInvoice, UpdateOrderPagoFarmazon, UpdateOrderStatus } from '../apis/carro-compras-fetch.js';
import { enviarCorreoExamedi, enviarCorreoWowMX } from '../apis/correos-fetch.js';
import { putAgendarMedicosHoras, getAtencionByIdMedicoHora, confirmarEstadoAtencionWow, enviarConfirmacionWow } from '../apis/agendar-fetch.js?rnd=8';
import { insertAtencionesInterconsultas } from '../apis/atenciones-interconsultas-fetch.js';
import { agregarTarjeta } from '../PasarelaPago/HomeWallet.js';
import { GetCardsByUid, GetTimeLineDataCostoCero, getAtencionInterconsulta } from '../apis/resumen-atencion-custom-fetch.js';
import { getComunasById, getCiudadesById } from "../apis/examenes-fetch.js?rnd=9";

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
let selectOptions = "";
let selectCosto = "";
const direccionMedicamentosDiv = $('#divDireccionMedi');
const direccionMedicamentosDivEx = $('#divDireccionExa');
let mpBrick = null;
let bricksBuilder = null;
let renderPaymentBrick = null;
let telefonoIngresado = "";

let brickRendered = false;
let isBackButton = false;
let cardsId = "";
let crearNuevasTarjetasMP = false;

let totalAPagar = 0;
let totalAPagarSinOferta = 0;
let totalValorEnvios = 0;
let totalValorEnviosSo = 0;
let totalDescuento = 0;

const codigoPais = modelVista.fichaPaciente.codigoTelefono
const moduloExamenes = $("#DivExamenes");
const moduloMedicamentos = $("#DivMedicamentos");
const moduloInterconsulta = $("#DivInterconsulta");
const sinTarjetas = $("#msjSinTarjetasWallet");

const noTruncarDecimales = {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
};
export async function init(data) {
    debugger
    window.contieneExamenes = data.examenes.length > 0 ? 1 : 0;
    window.contieneMedicamentos = data.farmacias.length > 0 ? 1 : 0;
    globalData = data;
    $("#precio-interconsulta-total").text("$0");
    $("#tab-precio-interconsulta-total").text("$0");
    $("#costoMedDespacho").text("$0");
    //CHECKBOX DE MEDICAMENTOS DEL TAB Y LISTADO/CARRITO
    medicamentosActions(data);
    examenesActions(data);
    medicosActions(data);
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

    $("#pagarButton").click(function () {
        botonesPagoValidar("soloInterc");
    });

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

        $('#DivPayment').hide();
        $('#agregarTarjetaMP').hide();
        $('#titleTarjetas').hide();
        $('#paymentBrick_container').hide();
        $("#pagoNoProcesadoMP").hide();
        $("#loaderCarBack").modal("hide");
        $("#loaderCar").modal("hide");
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


    async function botonesPagoValidar(pasarelaPago) {
        debugger
        var valorTotalCar = $("#totalPrice").text().substring(1, $("#totalPrice").text().length);
        let medicamentos = $("#medicamentos-list input").is(":checked");
        let examenes = $("#examenes-list input").is(":checked");
        let interconsultaCheck = $("#chk-medico-interconsulta").is(":checked");
        let medicoSeleccionado = medicoDerivacion.length > 0;
        let pagoTotalMsg = $("#totalPrice").text();
        let chkIntercSelect = $('#lista-medico-intertconsulta').val() > 0;
        let valorCeroInterconsultaExiste = 0;
        let soloPagarInterconsulta = 0;
        validarTelefonosPaciente();
        if (examenes == false && medicamentos == false && interconsultaCheck && medicoSeleccionado && chkIntercSelect) { //Solo existe interconsulta
            soloPagarInterconsulta = 1;
        }
        for (var item of medicoDerivacion) {
            if (item.valorAtencion == 0)
                valorCeroInterconsultaExiste += 1;
        };
        if (valorCeroInterconsultaExiste > 0 && soloPagarInterconsulta == 1) {
            confirmarCostoCero();
        }
        else if (valorTotalCar > 0) {
            if (medicamentos && window.billing_address == undefined) {
                Swal.fire("¡Por favor, recuerda seleccionar dirección de despacho para los medicamentos!");
                return false;
            }
            if (validarTelefonosPaciente()) {
                Swal.fire("¡Por favor, agrega tu número telefónico!");
                return false;
            }
            if (examenes && window.billing_addressEx == undefined && codigoPais == "CL") {
                Swal.fire("¡Por favor, recuerda seleccionar dirección de despacho para los exámenes!");
                return false;
            }
            else if (medicamentos || examenes || soloPagarInterconsulta) {
                resInter = null;
                if (agendar) {
                    resInter = await reservarInterconsulta();
                    agendar.id = resInter ? resInter.infoAtencion.idAtencion : 0;
                    interconsultaId = resInter.infoAtencion.idAtencion;
                    await insertarAtencionInterconsulta();
                    if (valorCeroInterconsultaExiste > 0) {
                        var interconsultaConfirmar = parseInt(interconsultaId);
                        await confirmarEstadoAtencionWow(interconsultaConfirmar, 0)
                        await enviarConfirmacionWow(interconsultaId);
                        await getAtencionCostoCero();
                    }
                }
                if (isBackButton == true) {
                    $("#loaderCarBack").modal("show");
                    await crearCarrito();
                    var div = document.getElementById(pasarelaPago);
                    div.click();
                }
                else {
                    $("#loaderCar").modal("show");
                    await crearCarrito();
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
    });

    await cargarResumenWow();

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

    $(".tab-antecedentes").click(async function () {
        $(".tab--antecedentes").show();
        $(".tab-examenes").removeClass("active");
        $(".tab-medicamentos").removeClass("active");
        $(".tab-interconsultas").removeClass("active");
        $(".tab-antecedentes").addClass("active");
        $(".tab--examenes").css("display", "none");
        $(".tab--medicamentos").css("display", "none");
        $(".tab--interconsultas").css("display", "none");
    });

    $(".tab-examenes").click(async function () {
        $(".tab--examenes").show();
        $(".tab-antecedentes").removeClass("active");
        $(".tab-medicamentos").removeClass("active");
        $(".tab-interconsultas").removeClass("active");
        $(".tab-examenes").addClass("active");
        $(".tab--antecedentes").css("display", "none");
        $(".tab--medicamentos").css("display", "none");
        $(".tab--interconsultas").css("display", "none");
    });

    $(".tab-medicamentos").click(async function () {
        $(".tab--medicamentos").show();
        $(".tab-interconsultas").removeClass("active");
        $(".tab-examenes").removeClass("active");
        $(".tab-antecedentes").removeClass("active");
        $(".tab-medicamentos").addClass("active");
        $(".tab--examenes").css("display", "none");
        $(".tab--antecedentes").css("display", "none");
        $(".tab--interconsultas").css("display", "none");
    });

    $(".tab-interconsultas").click(async function () {
        $(".tab--interconsultas").show();
        $(".tab-examenes").removeClass("active");
        $(".tab-antecedentes").removeClass("active");
        $(".tab-medicamentos").removeClass("active");
        $(".tab-interconsultas").addClass("active");
        $(".tab--examenes").css("display", "none");
        $(".tab--medicamentos").css("display", "none");
        $(".tab--antecedentes").css("display", "none");
    });

    async function cargarResumenWow() {
        $(".tab--antecedentes").show();
        $(".tab-antecedentes").addClass("active");
        $(".tab-antecedentes").addClass("wow__tab.active");
        $(".tab--examenes").css("display", "none");
        $(".tab--medicamentos").css("display", "none");
        $(".tab--interconsultas").css("display", "none");
    }
    if (data.orderAttention != null)
        if (data.orderAttention.order_status_id == 3) {
            $("#loader").modal("show");
            $(".checkbox").hide();
            $("#divDireccionMedi").hide();
            $("#divDireccionExa").hide();
            $("#divtotales").hide();
            $("#divTotalAPagar").hide();
            $("#divDomicilio").hide();
            $("#divMedicamentoCotiza").hide();
            $("#pagarlista").hide();
            //
            var existeMedicamento = 0;
            var existeExamen = 0;
            for (var item of data.orderAttention.items_details) {
                switch (item.category) {
                    case 1:
                        existeExamen += 1;
                        break;
                    case 2:
                        existeMedicamento += 1;
                        break;
                    case 3:
                        var interconsultaConfirmar = parseInt(item.external_product_id);
                        await confirmarEstadoAtencionWow(interconsultaConfirmar, 0)
                        break;

                    default:
                }
            }
            if (existeMedicamento > 0) {
                //
                let userObj = JSON.parse(data.orderAttention.detail_add_optional);
                let rescart = await CreateCart(userObj); //creación de carro para farmazon
                if (rescart && rescart.status == 502) return; //si hubo error al generar el carro - exit
                //genera boleta
                let resinvoice = await CreateInvoice(rescart.objectResponse);
                await UpdateOrderPagoFarmazon(data.orderAttention.id, resinvoice.objectResponse.increment_id);
            }
            if (existeExamen > 0 && codigoPais == "CL") {
                await sendCorreoExamedi(); //Correo Examedi
            }
            else if (existeExamen > 0 && codigoPais == "MX") {
                await sendCorreoCompraMX();
            }
            await cambioEstadoOrden(data.orderAttention.id, 5);
            $("#loader").modal("show");
            await redireccionCompraCustom();


            //fin
        }
        else if (data.orderAttention.order_status_id === 2) {
            idEstadoCarrito = data.orderAttention.order_status_id;
            idCarro = data.orderAttention.id;
            await pagoNoExitoso();
        }
        else if (data.orderAttention.order_status_id === 4) {
            $("#lista-medico-intertconsulta").prop("disabled", true);
        }
        else if (data.orderAttention.order_status_id === 5) {
            await confirmedBuyHide();
        }
        else {
            idEstadoCarrito = data.orderAttention.order_status_id;
            idCarro = data.orderAttention.id;
        }


    async function atencionNula() {
        //let examenesSinExamedi = modelVista.examenes.filter(examen => !examen.isExamedi);
        let examenesExamedi = modelVista.examenes.filter(examen => examen.isExamedi);
        let examenesWowMx = modelVista.examenes.filter(examen => examen.wowMx);

        if (codigoPais === "CL") {
            if (examenesExamedi.length === 0 && modelVista.farmacias.length === 0 && modelVista.atencion.idEspecialidadDerivacion === 0) {
                hideElements();
            }
        }
        else if (codigoPais === "MX" && window.host.includes("vivetuseguro.")) {
            if (examenesWowMx.length === 0 && modelVista.farmacias.length === 0 && modelVista.atencion.idEspecialidadDerivacion === 0) {
                hideElements();
            }
        }

        function hideElements() {
            $("#divLista").hide();
            $(".checkbox").hide();
            $("#divDireccionMedi").hide();
            $("#divDireccionExa").hide();
            $("#divtotales").hide();
            $("#divTotalAPagar").hide();
            $("#divDomicilio").hide();
            $("#divMedicamentoCotiza").hide();
            $("#pagarlista").hide();
        }
    }

    async function validarPagina() {
        if (moduloExamenes.length == 0 && moduloMedicamentos.length == 0 && moduloInterconsulta.length == 0) {
            $(".wow__resumen").css("max-width", "600px");
            $(".wow__tabs").css("width", "100%");
            $(".tab-content__header").css("gap", "2rem");
            $("#divLista").hide();
        }
    }

    //Validar si existen teléfonos desde la tabla Personas
    function validarTelefonosPaciente() {
        telefonoIngresado = modelVista.fichaPaciente.telefono || modelVista.fichaPaciente.TelefonoMovil || "";
        if (telefonoIngresado == "") {
            return true;
        }
        else {
            return false;
        }
    }

    //Agregar número de teléfono
    $("#buttonAddTel").click(function () {
        let telefono = $("#inputTelefono").val();
        if (telefono != "") {
            telefonoIngresado = telefono;
            const butonTel = $("#buttonAddTel");
            if (butonTel.text() == "Agregar") {
                butonTel.text("Editar")
                $("#inputTelefono").prop("disabled", true);
                $("#imgIngresarTelefono").attr("src", "/img/momento-wow/check-cuadro.svg");
            }
            else {
                butonTel.text("Agregar");
                telefonoIngresado = "";
                $("#inputTelefono").prop("disabled", false);
            }
        }
    });

    async function mostrarPagoSinTarjeta() {
        if (sinTarjetas.length > 0) {
            $("#totalPrice").hide();
            $("#totalLabel").hide();
            $("#buttonpagos").prop("disabled", true);
            $("#buttonpagos").css("pointer-events", "none");
        }
    }

    await validarPagina();
    await updatePagarlistaState();
    await atencionNula();
    await verificarDireccionesGuardadasEx(uid, "E");
    await verificarDireccionesGuardadasMed(uid, "M");
    await marcarCheckboxInterconsulta();
    await mostrarPagoSinTarjeta();

    //Gráfico puntaje
    let puntajeSmartcheck = "calc((" + parseFloat($("#calculoSmart").val()) + "/ 100) * 100%)";
    $("#puntoSmartcheck").css("margin-left", puntajeSmartcheck);

}

async function checkAllList() {
    $(".checkbox").each(function () {
        $(this).prop("checked", true);
    });
    calcularTotal();
}

async function getAtencionCostoCero() {
    const atencionCostoCero = await GetTimeLineDataCostoCero(uid, window.idCliente);
    var fechaHoy = moment().format("DD-MM-YYYY");
    if (window.TimelineData.length > 0) {
        await horasHoy(atencionCostoCero.filter(itemF => !itemF.atencionDirecta && moment(itemF.fecha).format("DD-MM-YYYY") == fechaHoy));
    }

    if ($("#kt_widget2_tab1_content").html()) {
        document.getElementById('divSinAtenciones').hidden = true;
        var cantAgendada = $('#kt_widget2_tab1_content').children().length ?? 0;
        if (cantAgendada > 0) {
            $(".circulo-alerta-numero-agendada").html(cantAgendada);
            $(".circulo-alerta-agendada").show();
        }
    } else {
        document.getElementById('divSinAtenciones').hidden = false;

    }

    const atencionInterconsulta = await getAtencionInterconsulta(parseInt(modelVista.atencion.id));
}

function horasHoy(data) {
    data.forEach(item => {
        if (item.fecha > moment().format()) {
            var foto;
            if (!item.fotoPerfil.includes('Avatar.svg')) {
                foto = baseUrl + item.fotoPerfil.replace(/\\/g, '/');
            }
            else {
                foto = baseUrlWeb + item.fotoPerfil;
            }
            let link = document.createElement('div')

            link.setAttribute('class', 'caja-atencion-home container-fluid cont-atencion-proxima')
            link.setAttribute('style', 'background-color:#e1a72c;color:white');



            let contAviso = document.createElement('div');
            //contAviso.setAttribute('class', 'cont-aviso row h-100 align-items-center');
            contAviso.setAttribute('class', 'cont-aviso');
            //contAviso.setAttribute('style', 'min-height: 135px');


            let contDatos = document.createElement('div');
            contDatos.setAttribute('class', 'col-12 col-md-12 pr-md-0');

            let dataMedico = document.createElement('div');
            dataMedico.setAttribute('class', 'data-atencion');

            let calificacion = document.createElement('div');
            calificacion.setAttribute('class', 'calificacion')
            for (var i = 0; i < 5; i++) {
                let divEstrellaPositiva = document.createElement('i');
                divEstrellaPositiva.classList.add('fas');
                divEstrellaPositiva.classList.add('fa-star');
                divEstrellaPositiva.classList.add('positiva');
                calificacion.appendChild(divEstrellaPositiva);

            }
            let header = document.createElement('span');
            header.setAttribute('class', 'header-aviso-atencion');


            let iCalendar = document.createElement('i');
            iCalendar.setAttribute('class', 'fal fa-calendar-alt');
            var hora = item.horaDesdeText.substring(0, 5);
            let fechaHora = document.createElement('span');
            fechaHora.setAttribute('class', 'fechaHora_' + item.idAtencion);
            fechaHora.innerHTML = moment(item.fecha).format("DD-MM-YYYY") + ' | ' + (hora ? hora : item.horaDesdeText);;

            let spanNombreMedico = document.createElement('span');
            spanNombreMedico.setAttribute('class', 'nombre-profesional');
            spanNombreMedico.setAttribute('style', 'color:white;text-align:left;');
            spanNombreMedico.setAttribute('title', 'Ir a la Atención');
            spanNombreMedico.onclick = async () => {
                var log = {
                    IdPaciente: uid,
                    Evento: "Paciente presiona link para ingresar al box",
                    IdAtencion: parseInt(item.idAtencion)
                }
                await logPacienteViaje(log);
                var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(5, 'minutes').format('HH:mm');
                var horaAntes = moment(item.fecha).format("DD-MM-YYYY") + " " + item.horaDesdeText;

                if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp) {
                    Swal.fire("Ya han pasado 5 min. desde que comenzó tu atención, se ha cancelado", "", "warning")
                    return;
                }

                else {
                    window.location = "/Atencion_SalaEspera/" + item.idAtencion;
                }
            }
            spanNombreMedico.innerHTML = item.nombreMedico;

            let tituloProfesional = document.createElement('span');
            tituloProfesional.setAttribute('class', 'titulo-profesional');
            tituloProfesional.setAttribute('style', 'color:white;text-align:left;');
            //tituloProfesional.innerHTML = '&nbsp;' + item.especialidad;
            tituloProfesional.innerHTML = item.especialidad;

            let contDatosAtencion = document.createElement('div');
            contDatosAtencion.setAttribute('class', 'col');

            let datosFecha = document.createElement('div');
            datosFecha.setAttribute('class', 'datos-fecha');

            let spanFechaAtencion = document.createElement('span');
            spanFechaAtencion.setAttribute('class', 'fecha-atencion');
            spanFechaAtencion.innerHTML = item.fechaText;

            let spanHoraAtencion = document.createElement('span');
            spanHoraAtencion.setAttribute('class', 'hora-atencion');
            spanHoraAtencion.innerHTML = item.horaDesdeText;

            let divStatusAtencion = document.createElement('div');
            let divLeyenda = document.createElement('div');

            if (item.confirmaPaciente != null) {
                divStatusAtencion.setAttribute('class', 'status-atencion');
                divLeyenda.setAttribute('class', 'leyenda');
                divLeyenda.setAttribute('style', 'text-align-last: right;');
                divLeyenda.innerHTML = 'Atención Confirmada';
            }


            let atencionToolbar = document.createElement('div');
            atencionToolbar.setAttribute('class', 'col-lg-12 atencion-toolbar atencion-proxima-toolbar');


            let aAnular = document.createElement('a');
            //aAnular.setAttribute('style', 'color:red');
            aAnular.innerHTML = "Cancelar";
            let iconAnular = document.createElement('i');
            iconAnular.setAttribute('class', 'fal fa-calendar-times');
            iconAnular.setAttribute('style', 'margin: 0 auto');

            aAnular.onclick = () => {
                if (item.cobrar) {
                    Swal.fire("Esta atención no se puede cancelar", "Para cancelar esta estención comunicate con mesa de ayuda al teléfono +56948042543 o al correo contacto@medismart.live", "info");
                    return;
                }
                document.getElementById('fotoMedicoModal').src = foto;
                document.getElementById('nombreProfesionalModal').innerHTML = item.nombreMedico;
                document.getElementById('tituloMedicoModal').innerHTML = item.especialidad;
                document.getElementById('fechaAtencionModal').innerHTML = item.fechaText;
                document.getElementById('horaAtencionModal').innerHTML = item.horaDesdeText;

                /*Contenido Modal*/
                if (item.fotoPerfil.includes('Avatar.svg'))
                    foto = "/img/avatar-medico.png";

                document.getElementById('imgModalAgendarCancela').src = foto;
                $(".fecha_modal").html('<i class="fal fa-calendar-alt"></i> ' + moment(item.fecha).format("DD-MM-YYYY") + ' / ' + item.horaDesdeText);
                $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
                $(".especialidad_modal").html(item.especialidad);


                //$('#modalAnulacion').modal('show');
                $('#modalControlAtencionAgendadaCancela').modal('show');
                $(".btnAnulaAtencionx").show();
                document.getElementById('btnAnulaAtencionx').onclick = async () => {
                    var valida = await putEliminarAtencion(item.idAtencion, uid);
                    if (valida.status !== "NOK") {
                        $('#modalControlAtencionAgendadaCancela').modal('hide');
                        link.remove();
                        if ($('#kt_widget2_tab1_content').children().length == 0 && $('#atenciones').children().length == 0)
                            document.getElementById('divSinAtenciones').hidden = false;
                        await cambioEstado(item.idAtencion.toString(), "E") // E = Anulada
                        await comprobanteAnulacion(valida.atencion);
                    }
                    else {
                        Swal.fire('', 'No fue posible cancelar esta atención, comuniquese con mesa de ayuda', 'error')
                    }

                    await actualizaNumeroAtenciones();
                }

            }

            let aReagendar = document.createElement('a');
            aReagendar.innerHTML = "Reagendar";
            //aReagendar.setAttribute('style', 'color: rgba(24, 98, 118, 1)');
            aReagendar.setAttribute('id', "btnAgendar" + item.idAtencion)
            let iconReagendar = document.createElement('i');
            iconReagendar.setAttribute('class', 'fal fa-calendar-edit');
            iconReagendar.setAttribute('style', 'margin: 0 auto');

            aReagendar.onclick = async () => {
                var idMedico = item.idMedico;
                $('#rowDatePicker').empty();
                $('#btnConf').empty();
                $('#btnHorario').empty();
                spanFechaAtencion.classList.add("fecha" + item.idAtencion);
                spanHoraAtencion.classList.add("hora" + item.idAtencion);

                await dataCalendar(item.idConvenio, item.fecha, item.idAtencion, idMedico);
                document.getElementById('nombreprofesional').innerHTML = `Dr(a) ${item.nombreMedico}`;
                $('#modalReagendar').modal('show');
            }


            let aConfirmar = document.createElement('a');
            aConfirmar.innerHTML = "Confirmar";
            //aConfirmar.setAttribute('style', 'color:rgba(24, 98, 118, 1)');
            let iconConfirmar = document.createElement('i');
            iconConfirmar.setAttribute('class', 'fal fa-calendar-check');
            iconConfirmar.setAttribute('style', 'margin: 0 auto');

            aConfirmar.onclick = async () => {
                if (divLeyenda.innerHTML === "Atención Confirmada") {
                    Swal.fire('', 'Ya confirmaste tu hora', 'info');
                    return;
                }
                document.getElementById('nombreProfesionalConfirma').innerHTML = item.nombreMedico;
                document.getElementById('tituloMedicoConfirma').innerHTML = item.especialidad;
                document.getElementById('fechaAtencionConfirma').innerHTML = moment(item.fecha).format("DD-MM-YYYY");
                document.getElementById('horaAtencionConfirma').innerHTML = item.horaDesdeText.substring(0, 5);
                document.getElementById('horaAtencionConfirma').setAttribute("class", "hora-atencion text-center");

                /*Contenido Modal*/
                /*Contenido Modal*/
                if (item.fotoPerfil.includes('Avatar.svg'))
                    foto = "/img/avatar-medico.png";

                document.getElementById('imgModalAgendarConfirma').src = foto;
                $(".fecha_modal").html(moment(item.fecha).format("DD-MM-YYYY") + ' / ' + item.horaDesdeText);
                $(".medico_modal").html('<b>' + item.nombreMedico + '</b>');
                $(".especialidad_modal").html(item.especialidad);

                //$('#modalConfirmacion').modal('show');
                $('#modalControlAtencionAgendadaConfirma').modal('show');
                $(".btnConfirmaAtencionx").show();
                document.getElementById('btnConfirmaAtencionx').onclick = async () => {

                    let result = await confirmaPaciente(item.idAtencion, uid)
                    if (result.status === "OK") {
                        $('#modalControlAtencionAgendadaConfirma').modal('hide');
                        await cambioEstado(item.idAtencion.toString(), "C") // C = confirmada
                        await comprobantePaciente(baseUrlWeb, result.atencion);
                        Swal.fire("", "Hora Confirmada", "success");

                    }
                    else {
                        Swal.fire('', 'No fue posible confirmar esta atención, intentelo más tarde', 'error')
                    }


                }

            }


            let aIrBox = document.createElement('a');
            aIrBox.setAttribute('class', 'btn-icon');
            aIrBox.href = "javascript:void(0);";
            let divIconoIrBox = document.createElement('div');
            divIconoIrBox.setAttribute('class', 'icono');
            let iIrBox = document.createElement('i');
            iIrBox.setAttribute('class', 'fal fa-calendar-check');
            iIrBox.setAttribute('style', 'margin: 0 auto');

            let divLeyendaIrBox = document.createElement('div');
            divLeyendaIrBox.setAttribute('class', 'leyenda-icono');
            divLeyendaIrBox.innerHTML = "Ir a la Atención";
            aIrBox.onclick = async () => {

                var log = {
                    IdPaciente: uid,
                    Evento: "Paciente presiona link para ingresar al box",
                    IdAtencion: parseInt(item.idAtencion)
                }
                // await logPacienteViaje(log);
                var horaPasada = moment(item.fecha).format("DD-MM-YYYY") + " " + moment(item.horaDesdeText, 'hh:mm:ss').add(5, 'minutes').format('HH:mm');

                if (horaPasada <= moment().format('DD-MM-YYYY HH:mm') || item.nsp || validarNSP) {
                    Swal.fire("Ya han pasado 5 min. desde que comenzó tu atención, se ha cancelado", "", "warning")
                    return;
                }
                //else if(horaAntes > moment().format("DD-MM-YYYY HH:mm")) {
                //    Swal.fire("Aún no es hora de tu atención", "", "warning")
                //    return;
                //}
                else {
                    window.location = "/Atencion_SalaEspera/" + item.idAtencion;
                }
            }

            let div = document.getElementById('kt_widget2_tab1_content');
            div.setAttribute('class', 'tab-pane active')

            link.appendChild(contAviso);

            contAviso.appendChild(contDatos);
            contDatos.appendChild(dataMedico);
            dataMedico.appendChild(header);

            //header.appendChild(proximaAtencion);
            header.appendChild(fechaHora);
            dataMedico.appendChild(spanNombreMedico);
            dataMedico.appendChild(tituloProfesional);
            contAviso.appendChild(contDatosAtencion);
            contDatosAtencion.appendChild(datosFecha);


            contAviso.appendChild(divStatusAtencion);
            divStatusAtencion.appendChild(divLeyenda);

            aAnular.appendChild(iconAnular);
            aReagendar.appendChild(iconReagendar);
            aConfirmar.appendChild(iconConfirmar);
            aIrBox.appendChild(divIconoIrBox);

            atencionToolbar.appendChild(aAnular);
            atencionToolbar.appendChild(aReagendar);
            atencionToolbar.appendChild(aConfirmar);
            contAviso.appendChild(atencionToolbar);
            div.appendChild(link);
            //div.appendChild(atencionToolbar);
        }
    })


    //proximasAtenciones(data.proximasHorasPaciente);
    //historialAtenciones(data.historialAtenciones);

    if (!window.host.includes("achs.")) { }
    //camposValidos(uid);
}

//Función para confirmar una interconsulta con costo cero cuando no se agrega nada más al carro
async function confirmarCostoCero() {
    if (agendar) {
        resInter = await reservarInterconsulta();
        agendar.id = resInter ? resInter.infoAtencion.idAtencion : 0;
        interconsultaId = resInter.infoAtencion.idAtencion;
        await insertarAtencionInterconsulta();
    }
    var interconsultaConfirmar = parseInt(interconsultaId);
    await confirmarEstadoAtencionWow(interconsultaConfirmar, 0);
    await enviarConfirmacionWow(interconsultaId);
    if (confirmarEstadoAtencionWow) {
        var url;
        var fechaActual = new Date();
        var fechaFormateada = moment(fechaActual).format("YYYY-MM-DD HH:mm:ss");
        url = "/Paciente/ConfirmarAtencion" + "?idMedicoHora=" + resInter.infoAtencion.idMedicoHora + "&idMedico=" + resInter.infoAtencion.idMedico + "&idBloqueHora=" + resInter.infoAtencion.idBloqueHora + "&fechaSeleccion=" + fechaFormateada + "&hora=" + resInter.infoAtencion.horaDesdeText + "&horario=" + resInter.infoAtencion.horaHastaText + "&m=" + resInter.infoAtencion.idModeloAtencion + "&r=" + resInter.infoAtencion.idReglaPago + "&c=" + resInter.infoAtencion.idConvenio + "&tipoatencion=" + resInter.infoAtencion.estadoAtencion + "&idAtencion=" + resInter.infoAtencion.idAtencion + "&especialidad=" + resInter.infoAtencion.especialidad;
        if (resInter.infoAtencion.estadoAtencion === "I")
            url = `/Ingresar_Sala_FU/${idAtencion}`;
        window.location.href = url;
    }
}


//Funcion para confirmar interconsulta con costo cero cuando el carro tiene algo más agregado. Esta se llama desde el pagoCarroCostoCero
async function confirmarCostoCeroConCarro() {
    resInter = null;
    if (agendar) {
        resInter = await reservarInterconsulta();
        agendar.id = resInter ? resInter.infoAtencion.idAtencion : 0;
        interconsultaId = resInter.infoAtencion.idAtencion;
        var interconsultaConfirmar = parseInt(interconsultaId);
        await confirmarEstadoAtencionWow(interconsultaConfirmar, 0)
        if (confirmarEstadoAtencionWow) {
            return;
        }
        else {
            Swal.fire({
                tittle: "Error",
                text: "Tu interconsulta no ha sido agendada.",
                type: "error",
                confirmButtonText: "Aceptar",
                success: function () {
                    alert("Error!");
                }
            });
        }
    }

}

//Función para pagar el carro cuando venga interconsulta con costo cero
async function pagoCarroCostoCero() {
    //
    await confirmarCostoCeroConCarro();
    $("#loaderIni").modal("show");
    await crearCarrito();
    let locationHref = new URL(window.location.href);

    let url = (locationHref.hostname.includes('unabactiva.') || locationHref.hostname.includes('activa.unab.')) ? locationHref.origin : urlBase;
    let totalCarroPago = $("#totalPriceCarro").text();
    var idAtencion = parseInt(modelVista.atencion.id);
    let userId = modelVista.atencion.idPaciente;

    $('#DivPayment').hide();
    $('#PagoTrasbank').show();

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
            $("#PagoTrasbank").empty();
            $("#PagoTrasbank").append('<a href="' + resultadoPaykiu.url + '">Ir a realizar el pago</a>');
            cambioEstadoOrden(idCarro, 2);
            //Método para ir directo al pago de paikiu mientras arreglamos mercadopago
            let urlPago = resultadoPaykiu.url;
            window.location.replace(urlPago);
            //});
        }).catch(error => {
            console.error(error)
        });
}

async function confirmedBuyHide() {
    //$(".checkbox").hide();
    //$("#divLista").hide();
    $("#divContentInterconsulta").hide();
    $(".wow__resumen").css("max-width", "600px");
    $(".wow__tabs").css("width", "100%");
    $(".tab-content__header").css("gap", "2rem");
}

// Función para ordenar por fecha
function ordenarPorFecha() {
    selectOptions = $('#lista-medico-intertconsulta option');

    selectOptions.sort(function (a, b) {
        var fechaA = $(a).data("fecha-hora");
        var fechaB = $(b).data("fecha-hora");
        return new Date(fechaA) - new Date(fechaB);
    }).appendTo("#lista-medico-intertconsulta");
}

// Función para ordenar por costo
function ordenarPorCosto() {
    selectCosto = $('#lista-medico-intertconsulta option');
    selectCosto.sort(function (a, b) {
        var precioA = $(a).data('value2');
        var precioB = $(b).data('value2');
        return precioA - precioB;
    }).appendTo("#lista-medico-intertconsulta");
}

// Evento click del botón para ordenar por fecha
$('#btn-ordenar-fecha').on('click', function () {
    $('#chk-medico-interconsulta').click();
    ordenarPorFecha();
    $('#lista-medico-intertconsulta').val($('#lista-medico-intertconsulta option:first').val()).change();
    $('#lista-medico-intertconsulta').val($('#lista-medico-intertconsulta option[value!=0]').first().val());
    if ($(this).is(':checked')) {
        $('#btn-ordenar-costo').prop('checked', false);
    }
    $('#chk-medico-interconsulta').click(); //Asignamos click para recalcular el costo según el listado
    actualizarTextoBoton(); //Llamamos a la función para actualizar el texto del botón
});

// Evento click del botón para ordenar por costo
$('#btn-ordenar-costo').on('click', function () {
    $('#chk-medico-interconsulta').click();
    ordenarPorCosto();
    $('#lista-medico-intertconsulta').val($('#lista-medico-intertconsulta option:first').val()).change();
    $('#lista-medico-intertconsulta').val($('#lista-medico-intertconsulta option[value!=0]').first().val());
    if ($(this).is(':checked')) {
        $('#btn-ordenar-fecha').prop('checked', false);
    }
    $('#chk-medico-interconsulta').click(); //Asignamos click para recalcular el costo según el listado
    actualizarTextoBoton(); //Llamamos a la función para actualizar el texto del botón

});

function actualizarTextoBoton() {
    if ($('#medicamentos-list input[type=checkbox]:checked').length === 0 && $('#examenes-list input[type=checkbox]:checked').length === 0 && $('#chk-medico-interconsulta').is(':checked') && $('#precio-interconsulta-total').text() === '$0') {
        $('#pagarButton').text('Agendar');
        $('#pagarButton').show();
        $('.otrosBotones').hide();
    } else {
        $('#pagarButton').text('Pagar');
        $('#pagarButton').hide();
        $('.otrosBotones').show();
    }
}

//function mostrarBotones() {
//    $("#pagarButton").on("click", function () {
//        
//        $(this).hide();
//        $(".otrosBotones").removeClass("hideButton");
//        setTimeout(function () {
//            console.log("Acción asíncrona completada");
//        }, 3000);
//    });
//}


function medicosActions(data) {

    if ($("#chk-medico-interconsulta-tab")) {
        $('#chk-medico-interconsulta-tab').on('change', function () {
            var idBloque = $('#lista-medico-intertconsulta-tab').find(":selected").val() ?? 0;
            $('#lista-medico-intertconsulta').val(idBloque).change()
            $('#chk-medico-interconsulta')[0].checked = this.checked;
            if (idBloque == 0) return false;
            getPreSaveInterconsulta(this, data);
            if ($('#chk-medico-interconsulta').length < 1) {
                $("#dropdown-medico-interconsulta").val("0");
            }
        });
    }

    if ($("#chk-medico-interconsulta")) { //ONCHANGE check MEDICO
        $("#chk-medico-interconsulta").on('change', function () {
            var idBloque = $('#lista-medico-intertconsulta').find(":selected").val() ?? 0;
            $('#lista-medico-intertconsulta-tab').val(idBloque).change()
            $('#chk-medico-interconsulta-tab')[0].checked = this.checked;
            if (idBloque == 0) return false;
            getPreSaveInterconsulta(this, data);
            actualizarTextoBoton();
        });
    }

    if ($("#lista-medico-intertconsulta")) { //ONCHANGE MEDICO
        $("#lista-medico-intertconsulta").on('change', function () {
            var idBloque = $(this).find(":selected").val() ?? 0;
            if (idBloque == $('#lista-medico-intertconsulta-tab').find(":selected").val()) return;
            $('#lista-medico-intertconsulta-tab').val(idBloque).change()
            if (idBloque == 0) return;
            let medico = data.horasDerivacion.find(x => x.idMedicoHora == parseInt(idBloque));
            if ($("#chk-medico-interconsulta")[0].checked) {
                $("#precio-interconsulta-total").text('$' + medico.valorAtencion);
                $("#tab-precio-interconsulta-total").text('$' + medico.valorAtencion);
                //ordenarOpciones($('#lista-medico-intertconsulta'));
                getPreSaveInterconsulta($("#chk-medico-interconsulta")[0], data);
                actualizarTextoBoton();
            }
        });
    }

    if ($("#lista-medico-intertconsulta-tab")) { //ONCHANGE MEDICO
        $("#lista-medico-intertconsulta-tab").on('change', function () {
            var idBloque = $(this).find(":selected").val() ?? 0;
            if (idBloque == $('#lista-medico-intertconsulta').find(":selected").val()) return;
            $('#lista-medico-intertconsulta').val(idBloque).change()
            if (idBloque == 0) return;
            let medico = data.horasDerivacion.find(x => x.idMedicoHora == parseInt(idBloque));
            if ($("#chk-medico-interconsulta-tab")[0].checked) {
                $("#precio-interconsulta-total").text('$' + medico.valorAtencion);
                //ordenarOpciones($('#lista-medico-intertconsulta'));
                getPreSaveInterconsulta($("#chk-medico-interconsulta")[0], data);
            }
        });
    }
}

function checkDisabled() {
    var medicamentosCheck = $('#medicamentos-list input[type="checkbox"]').prop('disabled');
    var examenesCheck = $('#examenes-list input[type="checkbox"]').prop('disabled');
    var interconsultaCheck = $('#chk-medico-interconsulta').prop('disabled');
    if (medicamentosCheck && examenesCheck && interconsultaCheck) {
        return true;
    }
    return false;
}

async function updatePagarlistaState() {
    if (checkDisabled()) {
        $('#pagarlista').prop('disabled', true);
    } else {
        $('#pagarlista').prop('disabled', false);
    }
}

$('#medicamentos-list input[type="checkbox"], #examenes-list input[type="checkbox"], #chk-medico-interconsulta').on('change', function () {
    updatePagarlistaState();
});

function getPreSaveInterconsulta(inputThis, data) {
    var idBloque = $('#lista-medico-intertconsulta').find(":selected").val() ?? 0;
    if (idBloque == 0) return false;
    let valorConsulta = 0;
    medicoDerivacion = [];
    agendar = null;
    if (!inputThis.checked)
        medicoDerivacion = medicoDerivacion.filter(x => x.idMedicoHora != parseInt(idBloque)); //NO ES NECESARIO POR LA ASIGNACION DE MEDICODERIVACION = [] - IMPLEMENTADO PARA CUANDO EXISTAN MAS DERIVACIONES
    else {
        let medico = data.horasDerivacion.find(x => x.idMedicoHora == parseInt(idBloque));
        if (!medico) return 0;
        medicoDerivacion.push(medico);
        valorConsulta = medico.valorAtencion;
        //OBJ PARA GENERAR LA HORA AL PAGAR
        agendar = {
            id: 0,
            idBloqueHora: parseInt(medico.idBloqueHora),
            fechaText: medico.fechaText,
            triageObservacion: '', //PARA TENER EN CUENTA AL SABER QUE VIENE REMITIDO DE INTERCONSULTA
            antecedentesMedicos: '',
            idPaciente: window.uid,
            SospechaCovid19: false,
            IdMedicoHora: parseInt(medico.idMedicoHora),
            Estado: 'P',
            AceptaProfesionalInvitado: false,
            idCliente: window.idCliente
        };
    }
    $("#precio-interconsulta-total").text(valorConsulta.toLocaleString('es-CL', noTruncarDecimales));
    $("#tab-precio-interconsulta-total").text(valorConsulta.toLocaleString('es-CL', noTruncarDecimales));
    calcularTotal();


    return true
}

//Marcar checkbox por defecto
async function marcarCheckboxInterconsulta() {
    var $dropdown = $('#lista-medico-intertconsulta');
    var $checkbox = $('#chk-medico-interconsulta');
    var $checkFecha = $('#btn-ordenar-fecha');
    var $selectedOption = $dropdown.find('option[selected]').first();
    var selectedValue = $selectedOption.val();
    if (selectedValue != 0) {
        var precio = parseFloat($selectedOption.data('value2'));
        var $precioTotal = $('#precio-interconsulta-total');
        $precioTotal.text('$' + precio.toLocaleString('es-CL'));
        $precioTotal.parent().show();
        calcularTotal();
    }
    if ($('#lista-medico-intertconsulta').val() == 0) {
        $("#precio-interconsulta-total").text("$0");
    }
    $checkFecha.trigger('click');
    $checkbox.trigger('click');
    calcularTotal();
}


function medicamentosActions(data) {
    //VER FORMA DE DEFINIR LAS 2 ACCIONES EN 1 -- MODULARIZAR
    if ($("#medicamentos-list")) {
        $('#medicamentos-list input').each(async function () {
            var check1 = $(this).attr("id");
            $(this).on("change", function () {
                $('#medicamentos-list-tab input').each(function () {
                    if (($(this).attr("id") == check1 + "_tab")) {
                        this.checked = !this.checked;
                        return 0;
                    }

                });
                listMedicamentos(data);
                createFirstGuestCart(data);
                actualizarTextoBoton();
            });
        });
    }
    if ($("#medicamentos-list-tab")) {
        $('#medicamentos-list-tab input').each(async function () {
            var check1 = $(this).attr("id");
            $(this).on("click", function () {
                $('#medicamentos-list input').each(function () {
                    if (($(this).attr("id") + "_tab") == check1) {
                        this.checked = !this.checked;
                        return 0;
                    }
                });
                listMedicamentos(data);
                createFirstGuestCart(data);
            });
        });
    }
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

async function reservarInterconsulta() {
    let resultado = null;
    $("#loaderInterc").modal("show");
    if (!medicoDerivacion && !medicoDerivacion[0]) return false;
    //INICIO - COPIADO AGENDAR_2
    var atencion = await getAtencionByIdMedicoHora(medicoDerivacion[0]?.idMedicoHora, uid);
    var idAtencion = 0;
    if (atencion && atencion.atencion && atencion.atencion.id != 0)
        idAtencion = atencion.atencion.id;

    var idMedico = medicoDerivacion[0]?.idMedico;
    if (idMedico > 0) {
        resultado = await putAgendarMedicosHoras(agendar, idMedico, uid); //GUARDAR LA ATENCION EN P
        if (resultado && resultado.err == 2) //err = 2, HORA YA TOMADA.
        {
            Swal.fire("¡Error al agendar la interconsulta!", resultado.msg, "error") //AQUI AGREGAR UN REFRESH??? -- MEJORA?: LEVANDAR UN POPUP CON LAS HORAS DELOS MEDICOS REFRESCADAS
                .then(function () {
                    $("#loaderInterc").modal("hide");
                });
            return;
        }
    }
    //FIN - COPIADO AGENDAR_2
    $("#loaderInterc").modal("hide");
    return resultado;
}


async function insertarAtencionInterconsulta() {
    await insertAtencionesInterconsultas(modelVista.atencion.id, interconsultaId);
}

async function cargarModalAgregarDireccion(tipo) {
    try {
        const response = await fetch(`/ModalAgregarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(globalData.fichaPaciente)
        });
        if (response.ok) {
            const html = await response.text();
            $("#dynamic-modal").empty();
            $("#dynamic-modal").html(html);
            $("#dynamic-modal-div").modal("show");
        } else {
            console.error(response)
        }
    } catch (error) {
        console.error('Unable to get especialidad.', error);
    }
}
async function cargarModalSeleccionarDireccion(tipo) {
    try {
        const response = await fetch(`/ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(globalData.fichaPaciente)
        });
        if (response.status === 200) {
            const html = await response.text();
            $("#dynamic-modal").empty();
            $("#dynamic-modal").html(html);
            $("#dynamic-modal-div").modal("show");
        } else if (response.status === 204) {
            Swal.fire("No existen direcciones guardadas para seleccionar", "", "warning");
        } else {
            console.error(response)
        }
    } catch (error) {
        console.error('CargarModalSeleccionarDireccion.', error);
    }
}

//Validar direcciones, si existen, de lo contrario no mostrar los botones
async function verificarDireccionesGuardadasEx(tipo) {
    try {
        const response = await fetch(`/ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista.fichaPaciente)
        });

        if (response.status === 200) {
            $("#seleccionar-direccion-examenes").show();
            $("#seleccionar-direccion-medicamentos").show();
            await verificarLibretaDirecciones(uid, "E");
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

//Validar direcciones, si existen, de lo contrario no mostrar los botones
async function verificarDireccionesGuardadasMed(tipo) {
    try {
        const response = await fetch(`/ModalSeleccionarDireccion/${uid}/${tipo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(modelVista.fichaPaciente)
        });

        if (response.status === 200) {
            $("#seleccionar-direccion-medicamentos").show();
            $("#seleccionar-direccion-examenes").show();
            await verificarLibretaDirecciones(uid, "M");
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

//Validar cantidad de direcciones
async function verificarLibretaDirecciones(uid, tipo) {
    try {

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



async function createDetails() {
    debugger
    let OrderDetails = new Array();
    let objOrderDetail = null;
    var sale_timestamp = new Date();
    var sale_period = parseInt(sale_timestamp.getFullYear() + '' + (sale_timestamp.getMonth() + 1 > 9 ? sale_timestamp.getMonth() + 1 : '0' + (sale_timestamp.getMonth() + 1).toString()));
    /*if (accion == "examenes") {*/
    for (var item of modelVista.examenes) {
        if ($("#" + item.id).is(":checked")) {
            objOrderDetail = {
                id: 0,
                order_header_id: 0,
                sale_period: sale_period,
                line_sequence: 0,
                //product_id: parseInt(item.idExamen), //item."productID"
                product_id: parseInt(item.idExamen === 0 ? window.idCliente : item.idExamen),
                external_product_id: item.id.toString(),
                order_product_status_id: 1,
                category: 1, //2 - medicamentos
                total_items: 1,
                total_amount: item.tarifaMedismart, //price_Without_discount
                discount_amount: item.tarifaOfertaMedismart, //discount_amount
                tax_amount: 0,
                final_amount: item.tarifaOfertaMedismart, //price
                total_cost: item.tarifaOfertaMedismart, //price
                total_margin: 0,
                has_warranty: false,
                unit_product_price: parseInt(item.tarifaOfertaMedismart) //prie
            };
            OrderDetails.push(objOrderDetail);
        }
    };
    //}

    //
    //if (accion == "medicamentos") {
    //modelVista.farmacias[0].promotionText
    if (modelVista.farmacias.length > 0) {
        await createFirstGuestCart(modelVista);
        if (!shipping == undefined) {
            if (shipping.length > 0)
                $("#precio-despacho").text('$' + shipping.amount);
        }

        for (var item of modelVista.farmacias[0].buyOrder.items) {
            if ($("#" + item.productID).is(":checked")) {
                objOrderDetail = {
                    id: 0,
                    order_header_id: 0,
                    sale_period: sale_period,
                    line_sequence: 0,
                    product_id: parseInt(item.productID), //item."productID"
                    external_product_id: '',
                    order_product_status_id: 1,
                    category: 2, //2 - medicamentos
                    total_items: 1,
                    total_amount: item.price_Without_discount,  //price_Without_discount
                    discount_amount: item.discount_amount, //discount_amount
                    tax_amount: 0,
                    final_amount: item.price, //price
                    total_cost: item.price, //price
                    total_margin: 0,
                    has_warranty: false,
                    unit_product_price: parseInt(item.price)// "price"
                };
                OrderDetails.push(objOrderDetail);
            }
        };
    }

    //if (accion == "interconsulta") {
    for (var item of medicoDerivacion) {
        if ($("#chk-medico-interconsulta").is(":checked") && item.valorAtencion > 0) {
            objOrderDetail = {
                id: 0,
                order_header_id: 0,
                sale_period: sale_period,
                line_sequence: 0,
                product_id: modelVista.atencion.idEspecialidadDerivacion, //item."productID"
                external_product_id: (interconsultaId).toString(),
                order_product_status_id: 1,
                category: 3, //1 - examenes , 2 - medicamentos 3- interconsulta
                total_items: 1,
                total_amount: item.valorAtencion,  //price_Without_discount
                discount_amount: 0, //discount_amount
                tax_amount: 0,
                final_amount: item.valorAtencion, //price
                total_cost: item.valorAtencion, //price
                total_margin: 0,
                has_warranty: false,
                unit_product_price: parseInt(item.valorAtencion) // "price"
            };
            OrderDetails.push(objOrderDetail);
        }
    };
    //}

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
    customIdAddress = data.customer_delivery_address_id;
    if (codigoPais !== "MX") {
        derliveryAmount += data.delivery_amount;
    }
    //}

    objOrderHeader = {
        id: idCarro,
        //attention_id: parseInt(modelVista.atencion.id),
        attention_id: modelVista.atencion ? parseInt(modelVista.atencion.id) : 0,
        sale_timestamp: sale_timestamp.toISOString().slice(0, 10),
        sale_period: sale_period,
        transaction_type: 1,
        order_status_id: 1,
        was_pay_by_promotion: false,
        total_amount: totalAPagar,
        delivery_amount: parseInt(totalValorEnvios), // medicamentos - dejar en 0 cuando venga retiro en tienda
        discount_amount: totalDescuento,
        tax_amount: 0,
        final_amount: totalAPagar,
        total_cost: totalAPagar,
        total_margin: 0,
        total_lines: OrderDetails.length,
        total_items: OrderDetails.length,
        customer_delivery_address_id: window.billing_address !== undefined ? window.billing_address.customer_delivery_address_id : 0, // medicamentos
        customer_exam_address_id: window.billing_addressEx !== undefined ? window.billing_addressEx.customer_delivery_address_id : 0, // examenes
        Items_details: OrderDetails,
        detail_add_optional: JSON.stringify(CartOrder),
        userId: window.uid,
        id_asistence_exam: (modelVista.examenesAsistencias && modelVista.examenesAsistencias.length > 0 ? modelVista.examenesAsistencias[0].id : null)
    };

    //if (idCarro == 0)
    idCarro = await SaveOrder(objOrderHeader);
    //console.log(carrito);
}


async function listExamenes(data) {
    examenesListChecked = [];
    calcularTotal();
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


async function calcularTotal() {
    totalAPagar = 0;
    totalAPagarSinOferta = 0;
    totalValorEnvios = 0;
    totalValorEnviosSo = 0;
    let valorTomaExamen = 0;
    let valorDespachoMed = 0;
    let valorTomaExamenSinDesc = 0;
    if (medicamentosShipping != null) {
        shipping = medicamentosShipping.filter(x => x.amount != 0);
        if (shipping.length > 0) valorDespachoMed = shipping[0].amount;
    }
    //if (medicamentosShipping.length != 0) valorDespachoMed = medicamentosShipping[0].amount;
    else valorDespachoMed = 0;
    $('#examenes-list input:checked').each(function () {
        totalAPagar += parseInt($(this).val());
        let idExamenSo = "#soExamen" + $(this).attr('name');
        let desExamen = "#desExamen" + $(this).attr('name');
        let desExamenSo = "0";
        if (codigoPais == "CL") {
            desExamenSo = "10990";
        }
        valorTomaExamenSinDesc = parseInt(desExamenSo);
        valorTomaExamen = parseInt($(desExamen).val());
        totalAPagarSinOferta += parseInt($(idExamenSo).val());
    });
    $('#medicamentos-list input:checked').each(function () {
        totalAPagar += parseInt($(this).val());
        let idMedicamentoSo = "#soMedicamento" + $(this).attr('name');
        totalAPagarSinOferta += parseInt($(idMedicamentoSo).val());
    });


    totalDescuento = totalAPagarSinOferta - totalAPagar;
    if (totalDescuento < 0) totalDescuento = 0;
    let valInt = $("#precio-interconsulta-total").text() != "" ? $("#precio-interconsulta-total").text() : "0";
    //console.log("valInt", valInt);
    valInt = valInt.replace('.', '');
    valInt = valInt.replace('$', '');
    //console.log("valInt", valInt);
    totalAPagarSinOferta += parseInt(valInt);
    $("#costoExamenSinDescuento").text(valorTomaExamenSinDesc.toLocaleString('es-CL', noTruncarDecimales));
    totalAPagar += parseInt(valInt);
    //console.log("totalAPagar", totalAPagar);
    $("#costoExamen").text(valorTomaExamen.toLocaleString('es-CL', noTruncarDecimales));
    $("#costoMedDespacho").text(valorDespachoMed.toLocaleString('es-CL', noTruncarDecimales));
    totalValorEnviosSo += (parseFloat(valorDespachoMed));
    totalValorEnviosSo += (parseFloat(valorTomaExamenSinDesc));
    totalAPagarSinOferta += (totalValorEnviosSo);
    $("#subTotalSinOferta").text(totalAPagarSinOferta.toLocaleString('es-CL', noTruncarDecimales));
    totalValorEnvios += (parseFloat(valorDespachoMed));
    totalValorEnvios += (parseFloat(valorTomaExamen));
    totalAPagar += totalValorEnvios;
    //console.log("totalAPagar", totalAPagar);
    //console.log("totalAPagar notruncate", totalAPagar.toLocaleString('es-CL', noTruncarDecimales));
    $("#totalPrice").text(totalAPagar.toLocaleString('es-CL', noTruncarDecimales));
    $("#totalPriceMP").text(totalAPagar.toLocaleString('es-CL', noTruncarDecimales));
    $("#totalPriceCarro").text(totalAPagar);
    totalDescuento = totalAPagarSinOferta - totalAPagar;
    $("#descuentoMedismart").text(totalDescuento.toLocaleString('es-CL', noTruncarDecimales));
}


async function deshabilitarPago() {
    if (sinTarjetas.length > 0) {
        $('#loaderPagosWC').show();
        $('#buttonAddCardWC').addClass('disabled');
        $('.otrosBotones').addClass('disabled');
    }
    else {
        $('#loaderPagos').show();
        $('.otrosBotones').addClass('disabled');
    }
}

async function habilitarPago() {
    setTimeout(function () {
        if (sinTarjetas.length > 0) {
            $('#loaderPagosWC').hide();
            $('#buttonAddCardWC').removeClass('disabled');
            $('.otrosBotones').removeClass('disabled');
        }
        else {
            $('#loaderPagos').hide();
            $('.otrosBotones').removeClass('disabled');
        }
    }, 4000);
}


$(document).on('click', "#seleccionar-direccion", async function seleccionarBoton() {
    await deshabilitarPago();
    createFirstGuestCart(modelVista);
    await habilitarPago();
    $("#divCostoEnvioMed").show();
    $("#divCostoEnvioExamen").show();
});

$(document).on('click', "#guardar-direccion", async function guardarBoton() {
    var $seleccionar = $("#seleccionar-direccion");
    var isChecked = $("#por-defecto").prop("checked");

    await setTimeout(async function () {
        await checkBoxAmbos(isChecked);
        $seleccionar.trigger("click");
    }, 2000);

});


async function checkBoxAmbos(isChecked) {
    if (isChecked) {
        // Checkbox está marcado
        var $seleccionar = $("#seleccionar-direccion");
        $seleccionar.trigger("click");
        createFirstGuestCart(modelVista);
        $("#divCostoEnvioMed").show();
        $("#divCostoEnvioExamen").show();
    }
}


$("#por-defecto").click(await checkBoxAmbos);


async function listMedicamentos(data) {
    medicamentosListChecked = [];
    $('#medicamentos-list input:checked').each(function () {
        $("#divCostoEnvioMed").show();
        $("#divDireccionMedi").show();
        medicamentosListChecked.push($(this).attr('name'));
    });
    if (medicamentosListChecked.length < 1) { //return -1; //BORRAR ALTER - SOLO PARA PRUEBAS
        $("#divCostoEnvioMed").hide();
        $("#divDireccionMedi").hide();
        $("#costoMedDespacho").text("$0");
    }
    calcularTotal();
}
const esVacioONull = (str) => (str.length == 0 || str == null || str == undefined);

async function createFirstGuestCart(data) {
    medicamentosListChecked = [];
    $('#medicamentos-list input:checked').each(function () {
        medicamentosListChecked.push($(this).attr('name'));
    });
    if (medicamentosListChecked.length < 1); //return -1; //BORRAR ALTER - SOLO PARA PRUEBAS

    var items = new Array(); //MEDICAMENTOS - CAMBIAR POR LOS MEDICAMENTOS SELECCIONADOS POR EL PACIENTE YA QUE AHORA SE ENVIAN TODOS LOS CARGADOS

    var paciente = data.fichaPaciente;
    var farmazon = data.farmacias.find(x => x.pharmacyName == 'Farmazon');
    if (!farmazon) return; //NO HAY FARMACIAS CON CON MEDICAMENTOS - EXIT -- NECESARIO?????

    var medicamentos = farmazon.buyOrder.items;

    if (medicamentos.length < 1) return; //NO HAY MEDICAMENTOS EN LA FARMACIA - EXIT 
    var medSelected = medicamentos.filter(x => medicamentosListChecked.some(item => item === x.productID));
    medSelected.forEach(med =>
        items.push(new Object({
            productID: med.productID,
            productName: med.productName,
            price: med.price,
            qty: 1,
            max_sale_qty: med.max_sale_qty
        }))

    );

    var guestCart = {
        customer: {
            customerid: window.uid,
            Attentionid: data.atencion.id.toString(),
            customerName: paciente.nombre + ' ' + paciente.apellidoPaterno + ' ' + paciente.apellidoMaterno,
            customerPhoneNumber: esVacioONull(paciente.telefonoMovil) ? (esVacioONull(paciente.telefono) ? telefonoIngresado : paciente.telefono) : paciente.telefonoMovil,
            customerEmail: paciente.correo
        },
        billing_address: window.billing_address,
        items: items,
        promotionText: modelVista.farmacias[0]?.promotionText //ERROR AL AGREGAR EL BONO EN FARMAZON, SE DESCOMENTA CUANDO SE PRUEBE Y ARREGLE
    }
    guestCart.billing_address.telephone = guestCart.customer.customerPhoneNumber;
    if (guestCart.billing_address == null) return;
    //
    let res = await CreateGuestCart(guestCart);
    if (res && res.status == 502) return; //SI HUBO ERROR AL GENERAR EL CARROINVITADO - EXIT

    if ((res == null || res == undefined || !res.objectResponse)) return;
    medicamentosShipping = res.objectResponse.estimateShippingResponses;
    await calcularTotal();
    //LOGICA PARA CREAR EL CARRO FINAL DE FARMAZON -> resCart
    //INICIO
    CartOrder = {
        billing_address: guestCart.billing_address,
        quoteid: res.objectResponse.quoteid,
        estimateShippingResponses: res.objectResponse.estimateShippingResponses[0] ?? 0 //esta se debe seleccionar por pantalla?
    }


    //let dataCart = {
    //    medicamentos: items,
    //    customer_delivery_address_id: guestCart.billing_address.customer_id,
    //    delivery_amount: res.objectResponse.estimateShippingResponses[0]?.amount ?? 0

    //}
    //dataCartFarmazon = dataCart;
    //
    shipping = medicamentosShipping.filter(x => x.amount != 0);
    if (shipping.length > 0) {
        $("#costoMedDespacho").text('$' + shipping[0].amount);
    }
    await calcularTotal();
    //let resCart = await crearCarrito(dataCartFarmazon, "medicamentos") //LLAMADA CARRITO DE LA ATENCION CON MEDICAMENTOS

}

//ENVÍO CORREO EXAMEDI
async function sendCorreoExamedi() {
    var objListaExamenes = new Array();
    let objCorreo = null;
    let objExamenes = null;
    let objAddressEx = await buildAddress(window.billing_addressEx);
    let data = globalData;
    let totalExamExamedi = 0;
    //console.log(data);
    let res = data.orderAttention;
    for (var item of res.items_details) {
        for (var itemExamenes of data.examenes) {
            if (itemExamenes.idExamen == item.product_id) {
                objExamenes = {
                    nombreExamen: itemExamenes.nombre,
                    codigo: itemExamenes.codigo
                }
                objListaExamenes.push(objExamenes);
                totalExamExamedi += item.total_amount;
            }
        }
    }
    objCorreo = {
        idAtencion: res.attention_id,
        costoTotal: totalExamExamedi.toLocaleString('es-CL', noTruncarDecimales),
        nombrePaciente: data.atencion.nombrePaciente,
        telefono: data.fichaPaciente.telefono,
        direccion: objAddressEx,
        email: data.fichaPaciente.correo,
        examenes: objListaExamenes
    }
    let envioCorreo = await enviarCorreoExamedi(objCorreo);
    if (envioCorreo.status === 'OK') {
        return;
    }
    else {
        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
    }
}

async function sendCorreoCompraMX() {
    debugger
    var objListaExamenes = new Array();
    let objCorreo = null;
    let objExamenes = null;
    let objAddressEx = "";
    let idCiudad = modelVista.examenesAsistencias[0].idCiudad;
    let idComuna = modelVista.examenesAsistencias[0].idComuna;
    let ciudad = await getCiudadesById(idCiudad);
    let comuna = await getComunasById(idComuna);
    let ciudadText = ciudad.ciudad;
    let comunaText = comuna.comuna;
    let data = globalData;
    let totalExamWowMX = 0;
    let res = data.orderAttention;
    for (var item of res.items_details) {
        for (var itemExamenes of data.examenes) {
            if (itemExamenes.idExamen == item.product_id || itemExamenes.id == item.external_product_id) {
                objExamenes = {
                    nombreExamen: itemExamenes.nombre,
                    codigo: itemExamenes.codigo,
                    tarifaExamen: itemExamenes.tarifaMedismart
                }
                objListaExamenes.push(objExamenes);
                totalExamWowMX += item.total_amount;
            }
        }
    }
    objCorreo = {
        idAtencion: res.attention_id,
        costoTotal: totalExamWowMX.toLocaleString('es-CL', noTruncarDecimales),
        //nombrePaciente: data.atencion.nombrePaciente,
        nombrePaciente: data.atencion && data.atencion.nombrePaciente ? data.atencion.nombrePaciente : data.fichaPaciente && data.fichaPaciente.fullName,
        telefono: data.fichaPaciente.telefono,
        direccion: 'Estado: ' + comunaText + '. Sucursal: ' + ciudadText,
        email: data.fichaPaciente.correo,
        examenes: objListaExamenes
    }
    let envioCorreo = await enviarCorreoWowMX(objCorreo);
    if (envioCorreo.status === 'OK') {
        return;
    }
    else {
        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
    }
}

async function buildAddress(address) {
    var city = address.city;
    var postcode = address.postcode;
    var region = address.region;
    var street = address.street;
    var country = address.country_id;

    var objAddressEx = street[0] + " " + street[1] + ", " + postcode + " " + city + ", Región " + region + ", " + country + ". ";
    objAddressEx += "Depto/Piso: " + street[2] + ". ";
    objAddressEx += "Referencia: " + street[3];

    return objAddressEx;
}

//let correo = await enviarAtencionAsistencia(data);
//}

//document.querySelector('#envioCorreo').onclick = async () => {
//    await sendCorreoExamedi();
//    //await crearCarrito();
//}

async function redireccionCompraCustom() {
    if (codigoPais == "CL") {
        location.href = `/CompraCustom?idAtencion=${modelVista.atencion.id}`;
    }
    else if (codigoPais == "MX") {
        debugger
        if (modelVista.atencion && modelVista.atencion.id) {
            // Si modelVista.atencion.id existe, redirige a esta URL
            location.href = `/CompraCustom?idAtencion=${modelVista.atencion.id}`;
        } else {
            var idHistorialExamen = modelVista.examenesAsistencias[0].id;
            location.href = `/CompraCustomExamenes?idHistorialExamenAtencion=${idHistorialExamen}`;
        }
        //location.href = `/CompraCustom?idAtencion=${modelVista.atencion.id}`;
    }
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
                            //creditCardTitle: "creditCardTitle",
                            creditCardValueProp: "Pagar con tarjeta crédito",
                            //newDebitCardTitle: "newDebitCardTitle",
                            //debitCardTitle: "debitCardTitle",
                            //debitCardValueProp: "debitCardValueProp",
                            //ticketTitle: "ticketTitle",
                            //ticketValueProp: "ticketValueProp",
                            //bankTransferTitle: "bankTransferTitle",
                            //bankTransferValueProp: "bankTransferValueProp",
                        },
                        cardholderName: {
                            placeholder: "Nombre del Titular"
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
                    /*
                      Callback llamado cuando Brick está listo
                      Aquí puedes ocultar loadings de su sitio, por ejemplo.
                    */
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
                            //description: `Pago Momento Wow Medismart, atención: ${modelVista.atencion.id}`,
                            description: `Pago momento wow, ${modelVista.atencion ? `atención: ${modelVista.atencion.id}` : 'Examenes Medismart'}`,
                            userId: userIdCard,// $("#iduser").val(),
                            customerId: customer_id,// $("#CustomerId").val(),
                            cardId: "",
                            order_id: idCarro.toString(),
                            payer: {
                                email: formData.payer.email,
                                ...(codigoPais !== "MX" && {
                                    identification: {
                                        type: formData.payer.identification.type,
                                        number: formData.payer.identification.number,
                                    },
                                }),
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
                            description: `Pago Momento Wow Medismart, atención: ${modelVista.atencion.id}`,
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
                    // callback solicitado para todos los casos de error de Brick
                    console.log(JSON.stringify(error))
                },
            },
        };

        window.paymentBrickController = await bricksBuilder.create(
            'payment',
            'paymentBrick_container',
            settings
        );
    };
    renderPaymentBrick(bricksBuilder);
}


async function cambioEstadoOrden(orden, estado) {
    await UpdateOrderStatus(orden, estado);
}


let customer_id, userIdCard;
$(document).ready(async function () {

    await calcularTotal();
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
                //console.log(res);
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