
/*-------------JS ATENCION MEDICO TELEPERITAJE ----------------------*/

import { putAtencionView, inicioAtencionMedico, getAtencion, getDataInformes, createReport, getRutaVirtualByAtencion, guardarFarmalisto } from '../apis/atencion-fetch.js';
import { getArchivoUnico, deleteFisico } from '../apis/archivo-fetch.js';
import { getResultAtencionEspera } from '../apis/resultAtencionEspera-fetch.js';
import { activarBono } from '../apis/medipass-fetch.js';
import { logPacienteViaje, EditPeritaje, InsertPeritaje, GetPeritaje, InsertNumeroLicenciaPerito } from "../apis/personas-fetch.js";
import { personByUser } from "../apis/personas-fetch.js"
import { enviarInforme, enviarInformeMedico } from "../apis/correos-fetch.js"

var connectionRT;
var connectionTermino;
var connection;
var connectionAtencion;
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD') + " " + moment().format('HH:mm:ss');
var textCheck = document.querySelector('[name="DescripcionNSP"]');
var check = document.querySelector('[name="nsp"]');
var checkistCausas = document.querySelector('[name="checkistCausas"]');
var checkTratamiento1 = document.querySelector('[id="tratamientoAdecuado1"]');
var checkTratamiento2 = document.querySelector('[id="tratamientoAdecuado2"]');
var reposoSI = document.querySelector('[id="reposoSI"]');
var reposoNO = document.querySelector('[id="reposoNO"]');
var checkConsentimiento = document.querySelector('[name="consentimiento"]');
var checkReporteConsalud = document.querySelector('[name="checkReporteConsalud"]');
var checkProrrogaNo = document.querySelector('[id="ProrrogaNO"]'); 
var checkProrrogaSI = document.querySelector('[id="ProrrogaSI"]');


// checkbox pregunta laboral colmena 2
var checkSobrecarga = document.querySelector('[id="checkSobrecarga"]');
var checkErgonomia = document.querySelector('[id="checkErgonomia"]');
var checkSeguridad = document.querySelector('[id="checkSeguridad"]');
var checkProteccion = document.querySelector('[id="checkProteccion"]');
var checkQuimico = document.querySelector('[id="checkQuimico"]');
var checkBio = document.querySelector('[id="checkBio"]');
var checkAmbiental = document.querySelector('[id="checkAmbiental"]');
var checkHerr = document.querySelector('[id="checkHerr"]');
// checkbox pregunta laboral colmena 3
var checkPermanente = document.querySelector('[id="checkPermanente"]');
var checkFluctuante = document.querySelector('[id="checkFluctuante"]');
var checkIntermitente = document.querySelector('[id="checkIntermitente"]');


let idArchivo;
var idAtencion;
var codigoPais;
let dataMedico;
let postGetLink = {
    "email": "",
    "request_type": "search",
    "client_id": "d7278538-5ef3-11ec-b94d-02c6",
    "data": {
        "patient": {
            "name": "",
            "phone": "",
            "email": "",
            "identity": ""
        },
        "professional": {
            "name": "",
            "identity": "",
            "email": ""
        },
        "products": [
        ]
    }
};


export async function init(data) {

    $(document).ready(async function () {
        var idAtencion = document.querySelector('[name="Atencion.Id"]').value;

        document.querySelector('[id="reposoParcialTotal"]').classList.add('d-none');
        //#llenar campos peritaje
        let peritaje = await GetPeritaje(idAtencion);
        
        if (peritaje) {
            $('#ocupacionPaciente').val(peritaje.ocupacion);
            $('[name="historiaClinica"]').val(peritaje.historiaClinica);
            $('[name="edadPaciente"]').val(peritaje.edadPaciente);
            $('[name="hisMorbido"]').val(peritaje.hisMorbido);
            $('[name="hisQuirurgica"]').val(peritaje.hisQuirurgica);
            $('[name="hisAlergias"]').val(peritaje.hisAlergias);
            $('[name="hisHabitoso"]').val(peritaje.hisHabitoso);
            $('[name="hisPsiquiatrico"]').val(peritaje.hisPsiquiatrico);
            $('[name="hisPsiquiatricoFamilia"]').val(peritaje.hisPsiquiatricoFamilia);
            $('[name="hisBiografico"]').val(peritaje.hisBiografico);
            $('[name="ExaFisicoMental"]').val(peritaje.examenFisicoMental);
            $('[name="ExaLaboratorio"]').val(peritaje.exaLaboratorio);
            $('[name="TratamientoActual"]').val(peritaje.tratamientoActual);
            // inputs conclusión multiespecialidades
            $('[name="dgPerito"]').val(peritaje.dgPerito);
            $('[name="fechaDg"]').val(peritaje.fechaDg);
            $('[name="ObservacionEntrevista"]').val(peritaje.observacionEntrevista);
            $('[name="fechaRetorno"]').val(peritaje.fechaRetorno);
            $('[name="rolLicencia"]').val(peritaje.rolLicencia);

            $('#diasLicencia').val(peritaje.diasLicencia);
            $('#nLicencia').val(peritaje.numeroLicencia); 
            $('#dgLicencia').val(peritaje.dgLicencia);
            $('[name="conclusionPeritaje"]').val(peritaje.conclusionPeritaje);
            $('[name="tratamientoAdecuado"]').each(function (e) {
                if ($(this).val() == peritaje.tratAdecuado) {
                    $(this).attr("checked", "checked");
                }
            });
            if (peritaje.tratAdecuado == 0) {
                document.querySelector('[id="asktratamientoAdecuado"]').classList.remove('d-none');
            }
            else {
                document.querySelector('[id="asktratamientoAdecuado"]').classList.add('d-none');
            }

            $('[name="tratamientoIndicado"]').val(peritaje.tratAdecuadoMedicoPerito);
            $('[name="EstadoActual"]').val(peritaje.estadoFuncionalPaciente);


            $('[name="patologiaGes"]').each(function (e) {
                if ($(this).val() == peritaje.patologiaGes) {
                    $(this).attr("checked", "checked");
                }
            });
            $('[name="tratamientoGes"]').each(function (e) {
                if ($(this).val() == peritaje.tratamientoGes) {
                    $(this).attr("checked", "checked");
                }
            });
            $('[name="licenciaGes"]').each(function (e) {
                if ($(this).val() == peritaje.licenciaGes) {
                    $(this).attr("checked", "checked");
                }
            });
            $('[name="reposo"]').each(function (e) {
                if ($(this).val() == peritaje.reposo) {
                    $(this).attr("checked", "checked");
                }
            });
            $('[name="Prorroga"]').each(function (e) {
                if ($(this).val() == peritaje.prorroga) {
                    $(this).attr("checked", "checked");
                }
            });
            $('[name="Recuperabilidad"]').each(function (e) {
                if ($(this).val() == peritaje.recuperabilidad) {
                    $(this).attr("checked", "checked");
                }
            });
            $('[name="Invalidez"]').each(function (e) {
                if ($(this).val() == peritaje.tramiteInvalidez) {
                    $(this).attr("checked", "checked");
                }
            });
            $('[name="Origen"]').each(function (e) {
                if ($(this).val() == peritaje.origenPatologia) {
                    $(this).attr("checked", "checked");
                }
            });
            if (peritaje.reposo == 1) { 
                document.querySelector('[id="reposoParcialTotal"]').classList.remove('d-none');               
            }
            $('[name="reposoTotal"]').each(function (e) {
                if ($(this).val() == peritaje.reposoTotalParcial) {
                    $(this).attr("checked", "checked");
                }
            });

            $('#diasProrroga').val(peritaje.diasProrroga);
            
            if (peritaje.causaLaboral == 1) {
                $('[name="checkistCausas"]').each(function (e) {
                    $(this).attr("checked", "checked");
                    document.querySelector('[id="divListaCausas"]').setAttribute('style', 'display:block');
                    document.querySelector('[id="listaCausas"]').classList.remove('d-none');
                });
                $('[id="dgLicencia"]').val(peritaje.dgLicencia);
                $('[name="quest1"]').val(peritaje.causaLaboralQuest1);
                $('[name="quest1.1"]').val(peritaje.causaLaboralQuest11);
                $('[name="quest1.2"]').val(peritaje.causaLaboralQuest12);
                $('[name="quest3"]').val(peritaje.causaLaboralQuest3);
                $('[name="quest4"]').val(peritaje.causaLaboralQuest4);
                $('[name="quest5"]').val(peritaje.causaLaboralQuest5);
                $('[name="quest6"]').val(peritaje.causaLaboralQuest6);
                $('[name="quest7"]').val(peritaje.causaLaboralQuest7);
                $('[id="checkSobrecarga"]').each(function (e) {
                    if (peritaje.sobrecargaLaboral == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkErgonomia"]').each(function (e) {
                    if (peritaje.ergonomiaCheck == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkSeguridad"]').each(function (e) {
                    if (peritaje.seguridadCheck == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkProteccion"]').each(function (e) {
                    if (peritaje.proteccionCheck == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkQuimico"]').each(function (e) {
                    if (peritaje.quimicoCheck == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkBio"]').each(function (e) {
                    if (peritaje.biologicoCheck == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkAmbiental"]').each(function (e) {
                    if (peritaje.ambientalCheck == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkHerr"]').each(function (e) {
                    if (peritaje.herramientasCheck == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                //siguientes check Intensidad del problema gatillante:
                $('[id="checkPermanente"]').each(function (e) {
                    if (peritaje.permanenteLaboral == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkFluctuante"]').each(function (e) {
                    if (peritaje.fluctuanteLaboral == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
                $('[id="checkIntermitente"]').each(function (e) {
                    if (peritaje.intermintenteLaboral == 1) {
                        $(this).attr("checked", "checked");
                    }
                });
            }
        }

        const dateControl = document.getElementById('currentDate');
        dateControl.valueAsDate = new Date();



    });
    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencion == null) {
        var resultInicio = await inicioAtencionMedico(data.atencion.id);
    }
    codigoPais = data.atencion.codigoPais;
    if (data.atencion.codigoPais == null)
        codigoPais = "CL";

    if (codigoPais == "CL") {
        dataMedico = await personByUser(uid);
        postGetLink.email = data.fichaPaciente.correo;
        postGetLink.data.patient.email = data.fichaPaciente.correo;
        postGetLink.data.patient.name = data.fichaPaciente.nombreCompleto;
        postGetLink.data.patient.phone = data.fichaPaciente.telefonoMovil;
        postGetLink.data.patient.identity = data.fichaPaciente.identificador;
        postGetLink.data.professional.identity = dataMedico.identificador;
        postGetLink.data.professional.name = dataMedico.nombreCompleto;
        postGetLink.data.professional.email = dataMedico.correo;
        if (data.atencion.medicamentos.length != 0) {
            data.atencion.medicamentos.forEach(item => {
                //products
                postGetLink.data.products.push({
                    id: item.product_id,
                    description: item.product_name,
                    quantity: 1
                })
            })
        }
    }

    //----------------------------------------------------------
    //-----------------------realTime---------------------------
    //#region realtime
    await ingresoPacienteRT();

    if (connectionRT.state === signalR.HubConnectionState.Connected) {
        connectionRT.invoke('SubscribeIngresoBox', parseInt(data.atencion.idPaciente), parseInt(data.atencion.idCliente)).then(r => {
            connectionRT.invoke("IngresarBox", parseInt(data.atencion.idPaciente), parseInt(data.atencion.id), parseInt(data.atencion.idCliente)).then(r => {
                //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }).catch((err) => {
            return console.error(err.toString());
        });
    }


    await AtencionPacienteRealTime();
    await indexRealTime(uid);
    //#endregion
    //-----------------------------------------------------------

    document.getElementById('volverLlamar').onclick = async () => {
        if (connectionRT.state === signalR.HubConnectionState.Connected) {
            connectionRT.invoke('SubscribeIngresoBox', parseInt(data.atencion.idPaciente), parseInt(data.atencion.idCliente)).then(r => {
                connectionRT.invoke("IngresarBox", parseInt(data.atencion.idPaciente), parseInt(data.atencion.id), parseInt(data.atencion.idCliente)).then(r => {
                    //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
                }).catch(err => console.error(err));
            }).catch((err) => {
                return console.error(err.toString());
            });
        }
    }
    check.checked = data.atencion.nsp;
    textCheck.value = data.atencion.descripcionNSP;
    checkBox(data);
    refreshReport();


    var momentDate = moment(todayDate).format(TODAY);
    document.querySelector('[name="Atencion.InicioAtencion"]').value = momentDate;
    let page = document.getElementById('page');

    idAtencion = document.querySelector('[name="Atencion.Id"]').value;

    page.innerHTML = "Atención con paciente &nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;" + data.atencion.nombrePaciente + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Teléfono: " + data.atencion.telefonoPaciente + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Convenio: " + data.atencion.infoPaciente;
    page.setAttribute('style', 'margin-left:20px;')
    
    check.onchange = async () => {
        if (check.checked) {
            document.getElementById("consentimiento").disabled = true;
        } else {
            document.getElementById("consentimiento").disabled = false;
        }
        checkBox(data);
    }

    checkConsentimiento.onchange = async () => {
        if (checkConsentimiento.checked) document.getElementById("nsp").disabled = true;
        else document.getElementById("nsp").disabled = false;
    }


    checkistCausas.onchange = async () => {
        if (checkistCausas.checked) {
            document.querySelector('[id="divListaCausas"]').setAttribute('style', 'display:block');
            document.querySelector('[id="listaCausas"]').classList.remove('d-none');
        }
        else {
            document.querySelector('[id="divListaCausas"]').setAttribute('style', 'display:none');
        }
    }

    checkTratamiento1.onchange = async () => {
        let valorCheck = parseInt($('[name="tratamientoAdecuado"]:checked').val());
        if (valorCheck == 0) {
            document.querySelector('[id="asktratamientoAdecuado"]').classList.remove('d-none');
        }
        else {
            document.querySelector('[id="asktratamientoAdecuado"]').classList.add('d-none');
        }
    }

    checkProrrogaNo.onchange = async () => {
        if (checkProrrogaNo.checked) {
            
            $('#diasProrroga').val(0);
        }
    }

    checkTratamiento2.onchange = async () => {
        
        let valorCheck = parseInt($('[name="tratamientoAdecuado"]:checked').val());
        if (valorCheck == 0) {
            document.querySelector('[id="asktratamientoAdecuado"]').classList.remove('d-none');
        }
        else {
            document.querySelector('[id="asktratamientoAdecuado"]').classList.add('d-none');
        }
    }



    reposoSI.onchange = async () => {
        
        let valorCheck = parseInt($('[name="reposo"]:checked').val());
        if (valorCheck == 1) {
            document.querySelector('[id="reposoParcialTotal"]').classList.remove('d-none');
        }
        else {
            document.querySelector('[id="reposoParcialTotal"]').classList.add('d-none');
        }
    }

    reposoNO.onchange = async () => {
        
        let valorCheck = parseInt($('[name="reposo"]:checked').val());
        if (valorCheck == 1) {
            document.querySelector('[id="reposoParcialTotal"]').classList.remove('d-none');
        }
        else {
            document.querySelector('[id="reposoParcialTotal"]').classList.add('d-none');
        }
    }


    //---------------------finzalizar atención-------------------------------
    document.querySelector('#btnFirmarPeritaje').onclick = async () => {
        const rol = document.querySelector('[name="rol"]').value;
        if (!checkConsentimiento.checked) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }
        var validaCampos = await validarCampos(data);
        if (validaCampos.length > 0) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }


        $('#btnFirmar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        var tipo = "F";

        let valida = await guardarFinalizarAtencion(tipo);
        if (valida.status == "OK") {
            Swal.fire({
                title: "Generando Informes",
                text: `Se estan generando los informes de esta atención, no salga de esta ventana.`,
                type: "info",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            swal.showLoading();
            await createReport(idAtencion);
            var rutaVirtual = "";
            var idArchivo = "";
            var res = await getRutaVirtualByAtencion(idAtencion);
            if (res && res.archivo) {
                rutaVirtual = res.archivo.rutaVirtual;
                idArchivo = res.archivo.id;
            }
            await activarBono(idAtencion);
            //llamada a ws consalud cuando idCliente es 1
            if (valida.atencion.idCliente == 1)
                await getResultAtencionEspera(idAtencion);


            let result = await enviarInforme(idAtencion, baseUrlWeb);
            await enviarInformeMedico(idAtencion, baseUrlWeb);

            window.onbeforeunload = false;
            await terminoAtencionRT()
            if (connectionTermino.state === signalR.HubConnectionState.Connected) {
                connectionTermino.invoke('SubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).then(r => {
                    connectionTermino.invoke("TerminoAtencion", parseInt(valida.atencion.idPaciente), parseInt(idAtencion), parseInt(valida.atencion.idCliente)).then(r => {
                        connectionTermino.invoke('UnsubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).catch(err => console.error(err));
                    }).catch(err => console.error(err));
                }).catch((err) => {
                    return console.error(err.toString());
                });
            }
            $('#btnFirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

            debugger

            window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}&sendInforme=true`;
            //window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}`;
        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            $('#btnFirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
        }
    };

    //------------previsualizar informe o marcar paciente NSP---------------------
    document.querySelector('#btnGuardar').onclick = async () => {
        var tipo = "G";


        if (!checkConsentimiento.checked && !check.checked && !data.atencion.peritaje) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }

        if (checkReporteConsalud) {
            if (data.atencion.peritaje && checkReporteConsalud.checked) {
                tipo = "F";
                let valida = await guardarFinalizarAtencion(tipo);
                if (valida.status == "OK") {
                    await terminoAtencionRT()
                    if (connectionTermino.state === signalR.HubConnectionState.Connected) {
                        connectionTermino.invoke('SubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).then(r => {
                            connectionTermino.invoke("TerminoAtencion", parseInt(valida.atencion.idPaciente), parseInt(idAtencion), parseInt(valida.atencion.idCliente)).then(r => {
                                connectionTermino.invoke('UnsubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).catch(err => console.error(err));
                            }).catch(err => console.error(err));
                        }).catch((err) => {
                            return console.error(err.toString());
                        });
                    }
                    if (valida.atencion.atencionDirecta) {
                        window.location = `/Medico/homeUrgencia`;
                    }
                    else {
                        window.location = `/Medico/Index`;
                    }
                }
            }
        }
        

        let validaCampos = await validarCampos(data);
        if (validaCampos.length > 0 && check.checked) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }


        let datosConcluyePerito = await GetPeritaje(idAtencion);
        if (!datosConcluyePerito && !check.checked) {
            Swal.fire("Error!", "Debe llenar los datos del panel Conclusión peritaje.", "error");
            return;
        }
        var causaLaboral = 0;

        if (checkistCausas.checked) {
            causaLaboral = 1;
        } else {
            causaLaboral = 0;
        } 

        var idAtencionPeritaje = parseInt(idAtencion);
        let ocupacion = $('#ocupacionPaciente').val();
        let edadPaciente = parseInt($('#edadPaciente').val());
        let nLicencia = $('#nLicencia').val();
        let historiaClinica = $('[name="historiaClinica"]').val();
        let diagnosticoMedico = $('[name="historiaClinica"]').val();
        let exaFisicoMental = $('[name="ExaFisicoMental"]').val();
        let ExaLaboratorio = $('[name="ExaLaboratorio"]').val();
        let tratamientoActual = $('[name="TratamientoActual"]').val();
        let diasLicencia = parseInt($('#diasLicencia').val());
        let dgLicencia = $('#dgLicencia').val();
        let TratAdecuado = parseInt($('[name="tratamientoAdecuado"]:checked').val());
        let tratamientoIndicado = ($('[name="tratamientoIndicado"]').val());
        let EstadoActual = $('[name="EstadoActual"]').val();
        let conclusionPeritaje = $('[name="conclusionPeritaje"]').val();
        let causaLaboralQuest1 = $('[name="quest1"]').val();
        let causaLaboralQuest11 = $('[name="quest1.1"]').val();
        let causaLaboralQuest12 = $('[name="quest1.2"]').val();
        let causaLaboralQuest2 = $('[name="quest2"]').val();
        let causaLaboralQuest3 = $('[name="quest3"]').val();
        let causaLaboralQuest4 = $('[name="quest4"]').val();
        let causaLaboralQuest5 = $('[name="quest5"]').val(); // breve descripción trabajo en multiespecialdiad
        let causaLaboralQuest6 = $('[name="quest6"]').val();
        let causaLaboralQuest7 = $('[name="quest7"]').val();
        // antecedentes medicos
        let hisMorbido = $('[name="hisMorbido"]').val();
        let hisQuirurgica = $('[name="hisQuirurgica"]').val();
        let hisAlergias = $('[name="hisAlergias"]').val();
        let hisHabitoso = $('[name="hisHabitoso"]').val();
        let hisPsiquiatrico = $('[name="hisPsiquiatrico"]').val();
        let hisBiografico = $('[name="hisBiografico"]').val();

        // inputs conclusión multiespecialidades
        let dgPerito = $('[name="dgPerito"]').val();
        let fechaDg = $('[name="fechaDg"]').val();
        let ObservacionEntrevista = $('[name="ObservacionEntrevista"]').val();
        let fechaRetorno = $('[name="fechaRetorno"]').val();
        let rolLicencia = $('[name="rolLicencia"]').val();


        var sobrecarga = 0;
        var ergonomiaCheck = 0;
        var seguridadCheck = 0;
        var permanente = 0;
        var fluctuante = 0;
        var intermintente = 0;
        var proteccionCheck = 0;
        var quimicoCheck = 0;
        var biologicoCheck = 0;
        var ambientalCheck = 0;
        var herramientasCheck = 0;

        // check laboral
        let origen = parseInt($('[name="Origen"]:checked').val());

        if (data.atencion.horaMedico.idConvenio.toString() !== banmedica.toString()) {
            if (origen == 0 && !checkistCausas.checked) {
                Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo, ya que tiene marcado en panel conclusión como causa laboral <br>", "", "error");
                return;
            }
        }
        if ((causaLaboralQuest1 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest11 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest12 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if (checkistCausas.checked) {
            if (checkSobrecarga.checked) sobrecarga = 1;
            else sobrecarga = 0;

            if (checkErgonomia.checked) ergonomiaCheck = 1;
            else ergonomiaCheck = 0; 

            if (checkSeguridad.checked) seguridadCheck = 1;
            else seguridadCheck = 0;

            if (checkProteccion.checked) proteccionCheck = 1;
            else proteccionCheck = 0;

            if (checkQuimico.checked) quimicoCheck = 1;
            else quimicoCheck = 0;

            if (checkBio.checked) biologicoCheck = 1;
            else biologicoCheck = 0;

            if (checkAmbiental.checked) ambientalCheck = 1;
            else ambientalCheck = 0;

            if (checkHerr.checked) herramientasCheck = 1;
            else herramientasCheck = 0;
           
            // pregunta 3
            if (checkPermanente.checked) permanente = 1;
            else permanente = 0;

            if (checkFluctuante.checked) fluctuante = 1;
            else fluctuante = 0;

            if (checkIntermitente.checked) intermintente = 1;
            else intermintente = 0;
        }


        //antecedentes colmena y preguntas laborales
        if (((hisMorbido == "" || hisQuirurgica == "" || hisAlergias == "" || hisHabitoso == "") && (!check.checked && (data.atencion.horaMedico.idConvenio == 42 || data.atencion.horaMedico.idConvenio == 33)))) {
            Swal.fire("¡Cuidado! <br>LLenar antecedentes clinicos  <br>", "", "error");
            return;
        }

        if ((causaLaboralQuest2 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest3 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest4 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest5 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest6 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest7 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((ocupacion == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar campo Ocupación <br>", "", "error");
            return;
        }
        if ((nLicencia == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar número de licencia <br>", "", "error");
            return;
        }
        if ((dgLicencia == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar diagnóstico licencia <br>", "", "error");
            return;
        }
        if ((edadPaciente == "" || isNaN(edadPaciente) && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar edad paciente <br>", "", "error");
            return;
        }
        if ((diagnosticoMedico == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar campo Anamnesis  <br>", "", "error");
            return;
        }
        if ((historiaClinica == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar campo Historia Clínica  <br>", "", "error");
            return;
        }
        if ((Number.isNaN(diasLicencia) && !check.checked)) {
            Swal.fire("¡Cuidado! <br>Añadir dias licencia  <br>", "", "error");
            return;
        }
		if ((Number.isNaN(TratAdecuado) && !check.checked)) {
            Swal.fire("¡Cuidado! <br>Debe seleccionar tratamiento adecuado.  <br>", "", "error");
            return;
        }
        if ((conclusionPeritaje == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>Añadir conclusión del peritaje  <br>", "", "error");
            return;
        }
        
        let formPeritaje = {
            HistoriaClinica: historiaClinica,
            Anamnesis: diagnosticoMedico,
            ExamenFisicoMental: exaFisicoMental,
            ExaLaboratorio,
            TratamientoActual: tratamientoActual,
            DiasLicencia: diasLicencia,
            TratAdecuadoMedicoPerito: tratamientoIndicado,
            EstadoFuncionalPaciente: EstadoActual,
            idPaciente: data.atencion.idPaciente,
            idAtencion: idAtencionPeritaje,
            ocupacion: ocupacion,
            conclusionPeritaje: conclusionPeritaje,
            causaLaboralQuest1: causaLaboralQuest1,
            causaLaboralQuest2: causaLaboralQuest2,
            causaLaboralQuest3: causaLaboralQuest3,
            causaLaboralQuest4: causaLaboralQuest4,
            causaLaboralQuest5: causaLaboralQuest5,
            causaLaboralQuest6: causaLaboralQuest6,
            TratAdecuado: TratAdecuado,
            numeroLicencia: nLicencia,
            causaLaboral: causaLaboral,
            EdadPaciente: edadPaciente,
            causaLaboralQuest11: causaLaboralQuest11,
            causaLaboralQuest12: causaLaboralQuest12,
            sobrecargaLaboral: sobrecarga,
            ergonomiaCheck,
            seguridadCheck,
            permanenteLaboral: permanente,
            fluctuanteLaboral: fluctuante,
            intermintenteLaboral: intermintente,
            hisMorbido: hisMorbido,
            hisQuirurgica: hisQuirurgica,
            hisAlergias: hisAlergias,
            hisHabitoso: hisHabitoso,
            hisPsiquiatrico: hisPsiquiatrico,
            hisBiografico: hisBiografico,
            causaLaboralQuest7: causaLaboralQuest7,
            dgLicencia,
            dgPerito,
            fechaDg,
            ObservacionEntrevista,
            fechaRetorno,
            rolLicencia,
            proteccionCheck,
            quimicoCheck,
            biologicoCheck,
            ambientalCheck,
            herramientasCheck
        }

        let resultPerito = await InsertPeritaje(formPeritaje, uid);

        if (resultPerito.status === 'OK' || check.checked) {
            await guardar();
        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            return;
        }
        //-------------------------------------------------------------------------

        async function guardar() {
            $('#btnGuardar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');

            debugger

            if (data.atencion.peritaje) {
                tipo = "F";
            }
            let valida = await guardarFinalizarAtencion(tipo);

            
            //previsualizar informe
            if (valida.status == "OK") {
                if (!check.checked && data.atencion.peritaje) {
                    // get data nbuevo para peritaje
                    var dataR = await getDataInformes(data.atencion.id);
                    var logoConv = document.getElementById("logoConvenio2");
                    logoConv.src = dataR.logoConvenio;
                    document.getElementById("fechaInforme2").innerHTML = dataR.fechaHoy;
                    document.getElementById("nombreMedico2").innerHTML = dataR.prefijoEspecialidad + ' ' + dataR.nombreCompletoMedico;
                    document.getElementById("rutMedico2").innerHTML = dataR.rutMedico;
                    document.getElementById("especialidadMedico2").innerHTML = dataR.especialidadMedico;
                    document.getElementById("regMedico2").innerHTML = dataR.regMedico;

                    document.getElementById("nombrePaciente2").innerHTML = dataR.nombreCompletoPaciente;
                    document.getElementById("domicilioPaciente2").innerHTML = dataR.domicilioPaciente;
                    document.getElementById("rutPaciente2").innerHTML = dataR.rutPaciente;
                    

                    let peritaje = await GetPeritaje(idAtencion);
                    document.getElementById("edad2").innerHTML = peritaje.edadPaciente;
                    document.getElementById("ocupacionInforme").innerHTML = peritaje.ocupacion;
                    document.getElementById("historiaClinica").innerHTML = peritaje.historiaClinica;
                    document.getElementById("historiahisMorbido").innerHTML = peritaje.hisMorbido;
                    document.getElementById("historiahisQuirurgica").innerHTML = peritaje.hisQuirurgica;
                    document.getElementById("historiahisAlergias").innerHTML = peritaje.hisAlergias;
                    document.getElementById("historiahisHabitoso").innerHTML = peritaje.hisHabitoso;
                    document.getElementById("historiahisPsiquiatrico").innerHTML = peritaje.hisPsiquiatrico;
                    document.getElementById("historiahisBiografico").innerHTML = peritaje.hisBiografico;

                    document.getElementById("diagnosticoMedico2").innerHTML = peritaje.anamnesis;
                    document.getElementById("tratamientoActual").innerHTML = peritaje.tratamientoActual;
                    document.getElementById("estadoFuncional").innerHTML = peritaje.estadoFuncionalPaciente;
                    document.getElementById("licenciaInforme").innerHTML = peritaje.numeroLicencia;
                    document.getElementById("reposoInforme").innerHTML = peritaje.diasLicencia;
                    document.getElementById("conclusionInforme").innerHTML = peritaje.conclusionPeritaje;
                    document.getElementById("prorrogaInforme").innerHTML = peritaje.diasProrroga;
                    document.getElementById("eeafInforme").innerHTML = peritaje.puntajePeritaje;
                    
                    document.getElementById("diasProrrogaInforme").value = peritaje.diasProrroga;

                    $('[name="patologiaGesinforme"]').each(function (e) {
                        if ($(this).val() == peritaje.patologiaGes) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $('[name="tratamientoGesinforme"]').each(function (e) {
                        if ($(this).val() == peritaje.tratamientoGes) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $('[name="licenciaGesinforme"]').each(function (e) {
                        if ($(this).val() == peritaje.licenciaGes) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $('[name="reposoinforme"]').each(function (e) {
                        if ($(this).val() == peritaje.reposo) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $('[name="reposoTotalInforme"]').each(function (e) {
                        if ($(this).val() == peritaje.reposoTotalParcial) {
                            document.querySelector('[id="asktratamientoAdecuado"]').classList.remove('d-none');
                            document.getElementById("reposoParcialTotalInforme").style.display = "block";

                            $(this).attr("checked", "checked");
                        } else {
                            document.getElementById("reposoParcialTotalInforme").style.display = "none";
                        }
                    });
                    $('[name="Prorrogainforme"]').each(function (e) {
                        if ($(this).val() == peritaje.prorroga) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $('[name="Recuperabilidadinforme"]').each(function (e) {
                        if ($(this).val() == peritaje.recuperabilidad) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $('[name="Invalidezinforme"]').each(function (e) {
                        if ($(this).val() == peritaje.tramiteInvalidez) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    $('[name="OrigenInforme"]').each(function (e) {
                        if ($(this).val() == peritaje.origenPatologia) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    if (peritaje.reposo == 1) {
                        document.querySelector('[id="reposoParcialTotal"]').classList.remove('d-none');
                    }
                    $('[name="reposoTotal"]').each(function (e) {
                        if ($(this).val() == peritaje.reposoTotalParcial) {
                            $(this).attr("checked", "checked");
                        }
                    });
                    document.getElementById("psiquiatria").style.display = "none";
                    document.getElementById("psiquiatria2").style.display = "none";
                    document.getElementById("psiquiatria3").style.display = "none";
                    $("#modal-informe-peritaje").modal("show");

                }
                else {
                    //PACIENTE NPS, ACTUALIZACION ETIQUETA ATENCIONES VISTA PACIENTE
                    if (check.checked) {
                        // generar reporte nsp para peritajes
                        

                        if ((nLicencia == "" && check.checked)) {
                            Swal.fire("¡Cuidado! <br>LLenar número de licencia para informe nsp peritaje<br>", "", "error");
                            $('#btnGuardar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                            return;
                        }
                        let nspLicencia = await InsertNumeroLicenciaPerito(nLicencia, idAtencion, data.atencion.idPaciente);

                        var tipo = "F";

                        let valida = await guardarFinalizarAtencion(tipo);
                        if (valida.status == "OK") {
                            Swal.fire({
                                title: "Generando Informes",
                                text: `Se estan generando el informe de inasistencia atención, no salga de esta ventana.`,
                                type: "info",
                                timer: 5000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            });
                            swal.showLoading();
                            await createReport(idAtencion);
                            var rutaVirtual = "";
                            var idArchivo = "";
                            var res = await getRutaVirtualByAtencion(idAtencion);
                            if (res && res.archivo) {
                                rutaVirtual = res.archivo.rutaVirtual;
                                idArchivo = res.archivo.id;
                            }
                            await activarBono(idAtencion);
                        }


                        var evento = "Médico guarda NSP";
                        await grabarLog(data.atencion.id, evento, parseInt(data.atencion.idPaciente));
                        if (connection.state === signalR.HubConnectionState.Connected) {
                            connection.invoke('SubscribeProximasAtencionesPaciente', parseInt(data.atencion.idPaciente)).then(r => {
                                connection.invoke("ActualizarProximasAtencionesPaciente", parseInt(data.atencion.idPaciente), parseInt(data.atencion.id)).then(r => {
                                    connection.invoke('UnsubscribeProximasAtencionesPaciente', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
                                }).catch(err => console.error(err));
                            }).catch((err) => {
                                return console.error(err.toString());
                            });
                        }
                    }

                    await terminoAtencionRT()
                    if (connectionTermino.state === signalR.HubConnectionState.Connected) {
                        connectionTermino.invoke('SubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).then(r => {
                            connectionTermino.invoke("TerminoAtencion", parseInt(valida.atencion.idPaciente), parseInt(idAtencion), parseInt(valida.atencion.idCliente)).then(r => {
                                connectionTermino.invoke('UnsubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).catch(err => console.error(err));
                            }).catch(err => console.error(err));
                        }).catch((err) => {
                            return console.error(err.toString());
                        });
                    }

                    let result = await enviarInforme(idAtencion, baseUrlWeb);
                    console.log(result);
                    let resultMedico = await enviarInformeMedico(idAtencion, baseUrlWeb);
                    console.log(resultMedico);


                    debugger
                    window.onbeforeunload = false;
                    window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}&sendInforme=true`;
                }
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }
            $('#btnGuardar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
        }
    };


    document.querySelector('#btnGuardarDatos').onclick = async (e) => {
        e.preventDefault();
        var tipo = "G";
        

        if (!checkConsentimiento.checked && !check.checked && !data.atencion.peritaje) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }



        let validaCampos = await validarCampos(data);
        if (validaCampos.length > 0 && check.checked) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }


        let datosConcluyePerito = await GetPeritaje(idAtencion);
        if (!datosConcluyePerito && !check.checked) {
            Swal.fire("Error!", "Debe llenar los datos del panel Conclusión peritaje.", "error");
            return;
        }
        var causaLaboral = 0;

        if (checkistCausas.checked) {
            causaLaboral = 1;
        } else {
            causaLaboral = 0;
        }

        var idAtencionPeritaje = parseInt(idAtencion);
        let ocupacion = $('#ocupacionPaciente').val();
        let edadPaciente = parseInt($('#edadPaciente').val());
        let nLicencia = $('#nLicencia').val();
        let dgLicencia = $('#dgLicencia').val();
        let historiaClinica = $('[name="historiaClinica"]').val();
        let diagnosticoMedico = $('[name="historiaClinica"]').val();
        let exaFisicoMental = $('[name="ExaFisicoMental"]').val();
        let ExaLaboratorio = $('[name="ExaLaboratorio"]').val();
        let tratamientoActual = $('[name="TratamientoActual"]').val();
        let diasLicencia = parseInt($('#diasLicencia').val());
        let TratAdecuado = parseInt($('[name="tratamientoAdecuado"]:checked').val());
        let tratamientoIndicado = ($('[name="tratamientoIndicado"]').val());
        let EstadoActual = $('[name="EstadoActual"]').val();
        let conclusionPeritaje = $('[name="conclusionPeritaje"]').val();
        let causaLaboralQuest1 = $('[name="quest1"]').val();
        let causaLaboralQuest11 = $('[name="quest1.1"]').val();
        let causaLaboralQuest12 = $('[name="quest1.2"]').val();
        let causaLaboralQuest2 = $('[name="quest2"]').val();
        let causaLaboralQuest3 = $('[name="quest3"]').val();
        let causaLaboralQuest4 = $('[name="quest4"]').val();
        let causaLaboralQuest5 = $('[name="quest5"]').val();
        let causaLaboralQuest6 = $('[name="quest6"]').val();
        let causaLaboralQuest7 = $('[name="quest7"]').val();

        // antecedentes clinicos colmena
        let hisMorbido = $('[name="hisMorbido"]').val();
        let hisQuirurgica = $('[name="hisQuirurgica"]').val();
        let hisAlergias = $('[name="hisAlergias"]').val();
        let hisHabitoso = $('[name="hisHabitoso"]').val();
        let hisPsiquiatrico = $('[name="hisPsiquiatrico"]').val();
        let hisBiografico = $('[name="hisBiografico"]').val();


        // inputs conclusión multiespecialidades
        let dgPerito = $('[name="dgPerito"]').val();
        let fechaDg = $('[name="fechaDg"]').val();
        let ObservacionEntrevista = $('[name="ObservacionEntrevista"]').val();
        let fechaRetorno = $('[name="fechaRetorno"]').val();
        let rolLicencia = $('[name="rolLicencia"]').val();

        var sobrecarga = 0;
        var ergonomiaCheck = 0;
        var seguridadCheck = 0;
        var permanente = 0;
        var fluctuante = 0;
        var intermintente = 0;
        var proteccionCheck = 0;
        var quimicoCheck = 0;
        var biologicoCheck = 0;
        var ambientalCheck = 0;
        var herramientasCheck = 0;

        


        if ((causaLaboralQuest1 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest11 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest12 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if (checkistCausas.checked) {
            if (checkSobrecarga.checked) sobrecarga = 1;
            else sobrecarga = 0;

            if (checkErgonomia.checked) ergonomiaCheck = 1;
            else ergonomiaCheck = 0;

            if (checkSeguridad.checked) seguridadCheck = 1;
            else seguridadCheck = 0;
            
            if (checkProteccion.checked) proteccionCheck = 1;
            else proteccionCheck = 0;

            if (checkQuimico.checked) quimicoCheck = 1;
            else quimicoCheck = 0;

            if (checkBio.checked) biologicoCheck = 1;
            else biologicoCheck = 0;

            if (checkAmbiental.checked) ambientalCheck = 1;
            else ambientalCheck = 0;

            if (checkHerr.checked) herramientasCheck = 1;
            else herramientasCheck = 0;
            // pregunta 3
            if (checkPermanente.checked) permanente = 1;
            else permanente = 0;

            if (checkFluctuante.checked) fluctuante = 1;
            else fluctuante = 0;

            if (checkIntermitente.checked) intermintente = 1;
            else intermintente = 0;
        }


        //antecedentes colmena y preguntas laborales
        if (((hisMorbido == "" || hisQuirurgica == "" || hisAlergias == "" || hisHabitoso == "") && !check.checked && (data.atencion.horaMedico.idConvenio == 42 || data.atencion.horaMedico.idConvenio == 33))) {
            Swal.fire("¡Cuidado! <br>LLenar antecedentes clinicos  <br>", "", "error");
            return;
        }

        if ((causaLaboralQuest2 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest3 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest4 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest5 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest6 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((causaLaboralQuest7 == "" && !check.checked && checkistCausas.checked)) {
            Swal.fire("¡Cuidado! <br>Llenar campos de patología por trabajo  <br>", "", "error");
            return;
        }
        if ((ocupacion == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar campo Ocupación <br>", "", "error");
            return;
        }
        if ((nLicencia == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar número de licencia <br>", "", "error");
            return;
        }
        if ((edadPaciente == "" || isNaN(edadPaciente) && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar edad paciente <br>", "", "error");
            return;
        }
        if ((diagnosticoMedico == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar historia clínica  <br>", "", "error");
            return;
        }
        if ((historiaClinica == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>LLenar campo Historia Clínica  <br>", "", "error");
            return;
        }
        if ((Number.isNaN(diasLicencia) && !check.checked)) {
            Swal.fire("¡Cuidado! <br>Añadir dias licencia  <br>", "", "error");
            return;
        }
		if ((Number.isNaN(TratAdecuado) && !check.checked)) {
            Swal.fire("¡Cuidado! <br>Debe seleccionar tratamiento adecuado.  <br>", "", "error");
            return;
        }
        if ((conclusionPeritaje == "" && !check.checked)) {
            Swal.fire("¡Cuidado! <br>Añadir conclusión del peritaje  <br>", "", "error");
            return;
        }

        let formPeritaje = {
            HistoriaClinica: historiaClinica,
            Anamnesis: diagnosticoMedico,
            ExamenFisicoMental: exaFisicoMental,
            TratamientoActual: tratamientoActual,
            DiasLicencia: diasLicencia,
            TratAdecuadoMedicoPerito: tratamientoIndicado,
            EstadoFuncionalPaciente: EstadoActual,
            idPaciente: data.atencion.idPaciente,
            idAtencion: idAtencionPeritaje,
            ocupacion: ocupacion,
            conclusionPeritaje: conclusionPeritaje,
            causaLaboralQuest1: causaLaboralQuest1,
            causaLaboralQuest2: causaLaboralQuest2,
            causaLaboralQuest3: causaLaboralQuest3,
            causaLaboralQuest4: causaLaboralQuest4,
            causaLaboralQuest5: causaLaboralQuest5,
            causaLaboralQuest6: causaLaboralQuest6,
            TratAdecuado: TratAdecuado,
            numeroLicencia: nLicencia,
            causaLaboral: causaLaboral,
            EdadPaciente: edadPaciente,
            causaLaboralQuest11: causaLaboralQuest11,
            causaLaboralQuest12: causaLaboralQuest12,
            sobrecargaLaboral: sobrecarga,
            ergonomiaCheck,
            seguridadCheck,
            permanenteLaboral: permanente,
            fluctuanteLaboral: fluctuante,
            intermintenteLaboral: intermintente,
            hisMorbido: hisMorbido,
            hisQuirurgica: hisQuirurgica,
            hisAlergias: hisAlergias,
            hisHabitoso: hisHabitoso,
            hisPsiquiatrico: hisPsiquiatrico,
            hisBiografico: hisBiografico,
            causaLaboralQuest7: causaLaboralQuest7,
            dgLicencia,
            ExaLaboratorio,
            dgPerito,
            fechaDg,
            ObservacionEntrevista,
            fechaRetorno,
            rolLicencia,
            proteccionCheck,
            quimicoCheck,
            biologicoCheck,
            ambientalCheck,
            herramientasCheck
        }

        let resultPerito = await InsertPeritaje(formPeritaje, uid);

        if (resultPerito.status === 'OK' || check.checked) {
            Swal.fire({
                tittle: "Éxito!",
                text: "Datos peritaje actualizados.",
                type: "success",
                confirmButtonText: "OK"
            }).then(() => {
                window.onbeforeunload = false;
                window.location = `/Medico/Index`;
            });
        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            return;
        }
    };

    $('#form_edit_peritaje').validate({
        errorClass: 'text-danger',
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        },
        submitHandler: async function (form, e) {
            e.preventDefault();

            let patologiaGes = parseInt($('[name="patologiaGes"]:checked').val());
            let tratamiento = parseInt($('[name="tratamientoGes"]:checked').val());
            let licencia = parseInt($('[name="licenciaGes"]:checked').val());
            let reposo = parseInt($('[name="reposo"]:checked').val());
            let prorroga = parseInt($('[name="Prorroga"]:checked').val());
            let recuperabilidad = parseInt($('[name="Recuperabilidad"]:checked').val());
            let invalidez = parseInt($('[name="Invalidez"]:checked').val());
            let origen = parseInt($('[name="Origen"]:checked').val());
            let diasProrroga = parseInt($('#diasProrroga').val());
            let reposoTotalParcial = parseInt($('[name="reposoTotal"]:checked').val());

            
            if (checkProrrogaSI.checked && diasProrroga < 1) {
                Swal.fire("¡Cuidado! <br>Días de prorroga no puede ser menor a 1 <br>", "", "error");
                return;
            }

            if ((patologiaGes != 1 && patologiaGes != 0) || (tratamiento != 1 && tratamiento != 0) || (licencia != 1 && licencia != 0)) {
                Swal.fire("¡Cuidado! <br>Tienes campos que llenar <br>", "", "error");
                return;
            }
            if ((reposo != 1 && reposo != 0) || (prorroga != 1 && prorroga != 0) || (recuperabilidad != 1 && recuperabilidad != 0)) {
                Swal.fire("¡Cuidado! <br>Tienes campos que llenar <br>", "", "error");
                return;
            }
            if ((invalidez != 1 && invalidez != 0) || (origen != 1 && origen != 0)) {
                Swal.fire("¡Cuidado! <br>Tienes campos que llenar <br>", "", "error");
                return;
            }
			
            if ( (isNaN(diasProrroga) || diasProrroga == "") && prorroga == 1) {
                Swal.fire("¡Cuidado! <br>Completar días de prorroga <br>", "", "error");
                return;
            }
            if ((reposoTotalParcial == "" || isNaN(reposoTotalParcial)) && reposo == 1) {
                
                Swal.fire("¡Cuidado! <br>Completa reposo total o parcial <br>", "", "error");
                return;
            }
            if (reposo == 0) {
                reposoTotalParcial = 0;
            }
            var idAtencionPeriaje = parseInt(idAtencion);

            $('#btn_guardar_peritaje').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);
            
            let formPeritaje = {
                PatologiaGes: patologiaGes,
                TratamientoGes: tratamiento,
                licenciaGes: licencia,
                Reposo: reposo,
                Prorroga: prorroga,
                Recuperabilidad: recuperabilidad,
                TramiteInvalidez: invalidez,
                OrigenPatologia: origen,
                DiasProrroga: diasProrroga,
                idAtencion: idAtencionPeriaje,
                idPaciente: data.atencion.idPaciente,
                ReposoTotalParcial: reposoTotalParcial
            }

            let result = await EditPeritaje(formPeritaje, uid);

            $('#btn_guardar_peritaje').removeAttr('disabled').children('.spinner-border').remove();
            if (result.status === 'OK') {
                $('#btn_guardar_am').removeAttr('disabled').children('.spinner-border').remove();
                Swal.fire({
                    tittle: "Éxito!",
                    text: "Antecedentes médicos actualizados.",
                    type: "success",
                    confirmButtonText: "OK"
                }).then(() => {

                });
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }
        }
    });

};

document.querySelector('#btnCerrar').onclick = async () => {
    await deleteFisico(idArchivo);
    $("#modalBody").empty();
};

async function checkBox(data) {
    if (check.checked) {
        checkON(data);
    }
    else {
        checkOFF(data);
    }
}


async function checkBoxCuasas(data) {
    if (check.checked) {
        checkON(data);
    }
    else {
        checkOFF(data);
    }
}

async function checkON() {
    let btnSave = document.querySelector('#btnGuardar');
    btnSave.innerHTML = "Guardar";
    btnSave.setAttribute('class', 'btn btn-warning');
    textCheck.setAttribute('style', 'display:block');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:block');
    document.querySelector('[id="listaNSP"]').classList.remove('d-none');

}

async function checkOFF(data) {
    let btnSave = document.querySelector('#btnGuardar');

    if (!data.atencion.peritaje) {
        btnSave.innerHTML = "Previsualizar";
        btnSave.setAttribute('class', 'btn btn-brand');
    }

    textCheck.setAttribute('style', 'display:none');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:none');

}

async function refreshReport() {
    const divContent = document.getElementById("contentLabel");
    const divButton = document.createElement("div");
    divButton.setAttribute('class', 'kt-portlet__head-label');

    const buttonRefresh = document.createElement('button');
    buttonRefresh.setAttribute('class', 'btn btn-success');

    const icon = document.createElement('i');
    icon.setAttribute('class', 'fa fa-refresh');

    buttonRefresh.appendChild(icon);
    divButton.appendChild(buttonRefresh);
    divContent.appendChild(divButton);

    buttonRefresh.onclick = async () => {

        var atencion = await getAtencion(idAtencion);

        document.querySelector('#consentimiento').checked = atencion.consentimientoInformado;
        var diagnostico = atencion.patologias;
        var examenes = atencion.examenes;
        var medicamentos = atencion.medicamentos;



        $("#listaMedicamentos").empty();
        const listMedicamentos = $("#listaMedicamentos");
        medicamentos.forEach(item => {

            listMedicamentos.append('<li data-id =' + item.id + '>' + item.principioActivo + ' ' + item.presentacionFarmaceutica + ' ' + item.posologia + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
        });
    };

}
async function validarCampos(data) {

    let mensaje = "";
    
    /*if (check.checked && data.atencion.horaMedico.idConvenio == 42) { 
        if (document.querySelector('[name="DescripcionNSP"]').value === "") {
            mensaje += "Debe ingresar justificación en NSP<br>";
        }
    }*/
    var motivoNSP = $('#motivosNSP').val();
    if (check.checked && (motivoNSP == "")) {
        mensaje += "Debe ingresar motivo de NSP<br>";
    }
    return mensaje;
}

async function guardarFinalizarAtencion(tipo) {

    const inicioAtencion = document.querySelector('[name="Atencion.InicioAtencion"]').value;
    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    var motivoNSP = 0;
    var motivoCheck = $('#motivosNSP').val();
    
    if (motivoCheck != "") {
        motivoNSP = $('#motivosNSP').val();
    }

    let atencion = {
        NSP: document.querySelector('[name="nsp"]').checked,
        DescripcionNSP: document.querySelector('[name="DescripcionNSP"]').value,
        MotivoNsp: parseInt(motivoNSP),
        ConsentimientoInformado: document.querySelector('[name="consentimiento"]').checked,
    };

    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(textArea => atencion[textArea.name] = textArea.value);

    atencion.Patologias = [];
    atencion.Examenes = [];
    atencion.LinkYapp = null;
    let resultado = await putAtencionView(idAtencion, atencion, tipo, uid, inicioAtencion);
    if (resultado.status === 'NOK') {
        return false;
    }
    else {
        return resultado;
    }
}

//real time para pacientes que no se presentan
async function AtencionPacienteRealTime() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/proximasatencionespacientehub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
    } catch (err) {
        
    }
}

//metodo para mostrar mensaje de nuevas atenciones
async function ActualizarCalendarMedico(uid, fecha, horaDesdeText, tipoAccion) {
    var typeMessage = "";
    var title = "";
    if (tipoAccion == "actualizar") {
        typeMessage = "success";
        title = `Tiene una nueva atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`

    }
    else if (tipoAccion == "nspPaciente") {
        typeMessage = "warning";
        title = `Abandono de atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`

    }
    else {
        typeMessage = "error";
        title = `Se canceló una atención para el día ${moment(fecha).format('DD/MM/YYYY')} a las ${horaDesdeText.substring(0, horaDesdeText.lastIndexOf(':'))} hrs`;

    }

    Swal.fire({
        position: 'top-end',
        toast: true,
        onOpen: function () {
            var zippi = new Audio('/notifications/alertNuevaAtencion.mp3')
            zippi.play();
        },
        showClass: {
            popup: 'swal2-noanimation',
            backdrop: 'swal2-noanimation'
        },
        animation: true,
        customClass: {
            container: '',
            popup: '',
            header: '',
            title: 'swal2-styled2',
            closeButton: '...',
            icon: '',
            image: '',
            content: '',
            input: '',
            validationMessage: '',
            actions: '',
            confirmButton: '',
            denyButton: '',
            cancelButton: '',
            loader: '',
            footer: ''
        },
        timerProgressBar: true,
        icon: typeMessage,
        type: typeMessage,
        title: title,
        showConfirmButton: false,
        timer: 15000
    })
}

// real time nuevas atenciones
async function indexRealTime(uid) {
    connectionAtencion = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/calendarmedicohub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    connectionAtencion.on('ActualizarCalendarMedico', (fecha, horaDesdeText, tipoAccion) => {
        ActualizarCalendarMedico(uid, fecha, horaDesdeText, tipoAccion);
    });

    try {
        await connectionAtencion.start();
    } catch (err) {
        
    }

    if (connectionAtencion.state === signalR.HubConnectionState.Connected) {

        connectionAtencion.invoke('SubscribeCalendarMedico', uid).catch((err) => {
            return console.error(err.toString());
        });
    }
}

async function ingresoPacienteRT() {
    connectionRT = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxhub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionRT.start();
    } catch (err) {
        
    }

}

async function terminoAtencionRT() {
    connectionTermino = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/ingresoboxhub`)
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

    try {
        await connectionTermino.start();
    } catch (err) {
        
    }

}

async function grabarLog(idAtencion, evento, idPaciente, info) {
    var log = {
        IdPaciente: idPaciente,
        Evento: evento,
        IdAtencion: parseInt(idAtencion),
        Info: info
    }
    await logPacienteViaje(log);
}
