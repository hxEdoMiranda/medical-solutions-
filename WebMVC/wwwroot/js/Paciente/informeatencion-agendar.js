import { putAgendarMedicosHoras, putActualizarAtencionExamenenesPayzen } from '../apis/agendar-fetch.js';
import { getSelectorCiudades } from '../apis/parametro.js?rnd=10';
var arrayIdCiudad = [];
var valorAtencion = 0;
export async function init(data) {
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    }

    function generateRandomString(num) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result1;
    }

    function generarsignature() {
        
        document.getElementById("vads_trans_id").value = generateRandomString(6);
        let vads_action_mode = document.getElementById('vads_action_mode').value;
        let vads_amount = document.getElementById("vads_amount").value;
        let vads_ctx_mode = document.getElementById('vads_ctx_mode').value;
        let vads_currency = document.getElementById('vads_currency').value;
        let vads_order_id = document.getElementById('vads_order_id').value;
        let vads_page_action = document.getElementById('vads_page_action').value;
        let vads_payment_config = document.getElementById('vads_payment_config').value;
        let vads_site_id = document.getElementById('vads_site_id').value;
        let vads_trans_date = document.getElementById('vads_trans_date').value;
        let vads_trans_id = document.getElementById('vads_trans_id').value;
        let vads_version = document.getElementById('vads_version').value;
        let signature = document.getElementById('signature').value;
        let cadenaSignature = document.getElementById('cadenaSignature').value;
        
        let cadena = vads_action_mode + "+" + vads_amount + "+" + vads_ctx_mode + "+" + vads_currency + "+" + vads_order_id + "+" + vads_page_action + "+" + vads_payment_config + "+" + vads_site_id + "+" +
            vads_trans_date + "+" + vads_trans_id + "+" + vads_version + "+" + cadenaSignature;

        var hash = CryptoJS.HmacSHA256(cadena, cadenaSignature);
        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        document.getElementById('signature').value = hashInBase64;
    }


    if (data.atencion.codigoPais == "CO") {

        arrayIdCiudad = [];
        var ciudad = await getSelectorCiudades("CO");
        $("#ciudades").empty();

        $("#ciudades").append('<option class="dropdown-item" data-id="0" value="0">Seleccione Ciudad</option>');

        ciudad.forEach(ciudad => {
            $("#ciudades").append('<option class="dropdown-item" data-id="' + ciudad.codigo + '" value="' + ciudad.codigo + '">' + ciudad.detalle + '</option>');
            arrayIdCiudad.push(ciudad.codigo);
        });

        for (var i = 0; i < data.examenes.length; i++) {
            let chk = document.getElementById(data.examenes[i].idExamen.toString());
            
            if (chk != null) {
                valorAtencion += parseFloat(data.examenes[i].tarifaOfertaMedismart);
                chk.onclick = async () => {
                    valorAtencion = 0;
                    $("input:checkbox[name=chkValor]:checked").each(function () {
                        
                        for (var d = 0; d < data.examenes.length; d++) {
                            if (data.examenes[d].idExamen == $(this).val()) {
                                valorAtencion += parseFloat(data.examenes[d].tarifaOfertaMedismart);
                            }
                        }
                    });
                    var ciudad = parseInt($("#ciudades option:selected").val());
                    if (valorAtencion == 0 || ciudad == 0) {
                        document.getElementById("pagar").disabled = true;
                    } else {
                        document.getElementById("pagar").disabled = false;
                    }
                    document.getElementById("valorAtencion").innerHTML = formatNumber(valorAtencion).toLocaleString();
                    document.getElementById("vads_amount").value = valorAtencion.toString() + "00";
                    generarsignature();
                }
            }
        }
        if (document.getElementById("vads_amount") != null) {
            document.getElementById("vads_amount").value = valorAtencion.toString() + "00";
            document.getElementById("valorAtencion").innerHTML = formatNumber(valorAtencion).toLocaleString();
        }
        generarsignature();
        let btnPagar = document.getElementById("pagar");

        if (btnPagar != null) {
            btnPagar.onclick = async () => {
                var seleccionadoPago = "";
                var ciudad = parseInt($("#ciudades option:selected").val());
                var datosAtencionExamenes = new Array();
                let objAtencionExamen = null;
                $("input:checkbox[name=chkValor]").each(function () {
                    if ($(this).prop('checked')) {
                        seleccionadoPago = "SI";
                    } else {
                        seleccionadoPago = "NO";
                    }

                    var idExamen = parseInt($(this).val());
                    objAtencionExamen = {
                        idatencion: data.atencion.id,
                        idExamen: idExamen,
                        idCiudad: ciudad,
                        seleccionadoPago: seleccionadoPago,
                        enProcesoPagoPayzen: seleccionadoPago == "SI" ? 1 : 0
                    };
                    datosAtencionExamenes.push(objAtencionExamen)
                });
                let respuesta = await putActualizarAtencionExamenenesPayzen(datosAtencionExamenes);
                if (respuesta == null) {
                    Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                } else {
                    if (respuesta.estado == "OK") {
                        $('#formPagar').submit();
                    } else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    }
                }
            }
        }
        let btnCiudades = document.getElementById("ciudades");
        if (btnCiudades != null) {
        btnCiudades.onclick = async () => {
            var ciudad = parseInt($("#ciudades option:selected").val());
            if (ciudad == 0 || parseInt(document.getElementById("vads_amount").value) == 0) {

                document.getElementById("pagar").disabled = true;
                document.getElementById("pagar").addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            } else {
                document.getElementById("pagar").disabled = false;
            }
            }
        }

    }


    if ($("#agendarInforme").length) {
        let btnAgendarInformeAtencion = document.getElementById("agendarInforme");
        btnAgendarInformeAtencion.onclick = async () => {
            
            var sessionPlataforma = 'MEDISMART';
            switch (idCliente) {
                case 0:
                    sessionPlataforma = 'MEDISMART';
                    break;
                case 148:
                    window.location.href = url;
                    break;
                case 108:
                    sessionPlataforma = "MEDISMART";
                    break;
                case 204:
                    sessionPlataforma = "MEDISMART";
                    break;
                default:
                    sessionPlataforma = 'MEDISMART';
                    break;

            }
            //atención inmediata sin pago
            let agendar = {
                id: 0,
                idBloqueHora: parseInt(data.horaDerivacion.idBloqueHora),
                fechaText: data.horaDerivacion.fechaHora.substring(0, 10),
                triageObservacion: '',
                antecedentesMedicos: '',
                idPaciente: uid,
                SospechaCovid19: false,
                IdMedicoHora: parseInt(data.horaDerivacion.idMedicoHora),
                Estado: 'P',
                AceptaProfesionalInvitado: false,
                idCliente: parseInt(idCliente)
            };
            let valida = await putAgendarMedicosHoras(agendar, 0, uid);
            if (valida !== 0) {
                
                var url = `/Paciente/Agenda_3?idMedicoHora=${valida.infoAtencion.idHora}&idMedico=${data.horaDerivacion.idMedico}&idBloqueHora=${valida.atencionModel.idBloqueHora}&fechaSeleccion=${data.horaDerivacion.fechaHora.substring(0, 10)}&hora=${data.horaDerivacion.horaDesdeText}&horario=True&idAtencion=${valida.infoAtencion.idAtencion}&m=1&r=1&c=${data.horaDerivacion.idConvenio}&tipoatencion`;
                window.location.href = url;
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");

            }
        }
    }
}