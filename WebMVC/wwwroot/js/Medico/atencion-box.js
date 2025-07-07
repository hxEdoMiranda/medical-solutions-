
/*-------------JS ATENCION MEDICO MODALIDAD ONDEMAND O SUSCRIPCION----------------------*/

import { getAtencionAreaAjusteByIdAtencion, getAtencionAntecedentesByIdAtencion, getAtencionHipotesisPreliminarByIdAtencion, putAtencionView, insertAtencionAntecedentes, insertAtencionAreaAjustes, insertHipotesisPreliminar, getProfesionalesAsociadosByMedico, inicioAtencionMedico, guardarPharol, getPharol, getAtencion, getDataInformes, createReport, finalizarExterno, getRutaVirtualByAtencion, getLinkFarmalisto, guardarFarmalisto, guardarVitau } from '../apis/atencion-fetch.js';
import { getArchivoUnico, deleteFisico } from '../apis/archivo-fetch.js'
import { comprobanteProfesionalAsociados } from '../apis/correos-fetch.js';
import { getResultAtencionEspera } from '../apis/resultAtencionEspera-fetch.js';
import { activarBono } from '../apis/medipass-fetch.js'
import { enviarInforme, enviarInformeMedico } from '../apis/correos-fetch.js';
import { insertAtencionMedicamentos, deleteMedicamentos, getMedicamentosBD, saveMedicamento } from '../apis/medicamentos-fetch.js?1';
import { insertAtencionesPatologias, deletePatologia, insertPatologias, validaPatologiaGes, validaPatologiaEno } from '../apis/patologias-fetch.js?1';
import { insertAtencionesExamenes, deleteExamen } from '../apis/examenes-fetch.js';
import { EditAntecedentesMedicos, EditInfoPerfil, logPacienteViaje } from "../apis/personas-fetch.js";
import { cambioEstado } from "../apis/eniax-fetch.js";
import { derivaEspecialidad, insertEspecialidadDerivacionAtencion, getEspecialidadesByTextAndRut } from '../apis/paciente-derivacion-fetch.js';
import { obtenerToken, getMedicamento, postGL } from '../apis/yapp.js';
import { personByUser } from "../apis/personas-fetch.js";
import { updateAtencionInmediate } from "../apis/atencion-fetch.js";
import { generateToken } from "../apis/call-fetch.js";
import { postRecurrencia, getProgramaSaludCiclo, getProgramaSaludRecurrencia, insertAtencionEspecialidad, InsertProgramaSaludFormularioEnfermera, getProgramaSaludCuestionario, ProgramaSaludCuestionario, UpdateProgramaSaludCuestionario, getProgramaSaludFormularioEnfermera } from "../apis/programa-salud-fetch.js";
import { guardarDerivacion } from "../apis/atenciones-interconsultas-fetch.js";
import { cancelarGES, cancelarENO, generarLME, generarENO, generarGES, consultarEstadoLME, consultarGES, consultarENO, consultarDataFormulario } from "../apis/imed.js"
import { getParametro } from "../apis/parametro.js"
import { persona, personaPaciente } from '../shared/info-user.js';

var idClienteP;
var connectionRT;
var connectionTermino;
var connection;
var connectionAtencion;
var todayDate = moment().startOf('day');
var TODAY = todayDate.format('YYYY-MM-DD') + " " + moment().format('HH:mm:ss');
var textCheck = document.querySelector('[name="DescripcionNSP"]');
var check = document.querySelector('[name="nsp"]');
var checkConsentimiento = document.querySelector('[name="consentimiento"]');
var checkComercial = document.querySelector('[name="comercial"]');
let idArchivo;
var idAtencion;
var codigoPais;
let yappMedicamento;
let searchMedicamento;
let farmalistoMedicamento = [];
let saveM;
let dataMedico;
let tokenData;
let sendPostLink;
let auxArray = [];
let EspecialidadesDerivacion = [];
let listaEspecialidades;
var isOrientacion = false;
var isAchs = false;
var empresa;
let programaSalud = false;
let idProgramaSaludPaciente = 0;
let idProgramaSaludCiclo = 0;
let lisGes = {};//key idpatologia; value estado: -1:no_notificado, 0:notificado, 1:generado, 2:cancelado
let lisEno = {};
let saludDocumentos = [];
const asyncIntervals = [];
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
            //{
            //"description": "LOSARTAN 100 MG X 30 COMPRIMIDOS RECUBIERTOS",
            //"code_isp": "",
            //"code_snomed": "",
            //"quantity": 1,
            //"id": "a371697f-dad3-11ea-8ff7-0a57"
            //}
        ]
    }
};

let derivacion = {
    "IdUsuarioDeriva": 0,
    "IdAtencion": 0,
    "Derivaciones": []
};
let postGetLinkFarmalisto = {
    "products": [

    ]
};

let idClientePositiva = 722;

if (window.host.includes("localhost") || window.host.includes("qa.")) {
    idClientePositiva = 443;
}




const runAsyncInterval = async (cb, interval, intervalIndex) => {
    await cb();
    if (asyncIntervals[intervalIndex]) {
        setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    }
};

const setAsyncInterval = (cb, interval) => {
    if (cb && typeof cb === "function") {
        const intervalIndex = asyncIntervals.length;
        asyncIntervals.push(true);
        runAsyncInterval(cb, interval, intervalIndex);
        return intervalIndex;
    } else {
        throw new Error('Callback must be a function');
    }
};


export async function init(data) {
    console.log(data, '-->data')
    idClienteP = data.atencion.idCliente
    console.log(idClienteP)
    saludDocumentos = data.saludDocumentos;
    programaSalud = data.atencion.isProgramaSalud;
    idProgramaSaludPaciente = data.atencion.idProgramaSalud;
    if (programaSalud == true && idProgramaSaludPaciente != 0) {
        idProgramaSaludCiclo = await getProgramaSaludCiclo(data.atencion.idPaciente, data.atencion.idCliente, idProgramaSaludPaciente)
    }
    await initPhoneCall();


    let enabledLME = false;
    let enabledGES_ENOType = "";
    let LMEGenerado = false;
    let GESGenerado = false;
    let ENOGenerado = false;
    


<<<<<<< Updated upstream
    //QUERYSELECTOR PARA LISTADO DE ESPECIALIDADES DE DERIVARION
    document.querySelectorAll('[name=especialidad]').forEach(function (item) {
        item.addEventListener('change', function () {
            if (this.checked)
                EspecialidadesDerivacion.push(item.value.toString());
            else {
                const index = EspecialidadesDerivacion.indexOf(item.value.toString());
                if (index > -1) { // only splice array when item is found
                    EspecialidadesDerivacion.splice(index, 1); // 2nd parameter means remove one item only
=======
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la solicitud PUT");
          }
        })
        .then((data) => {
          console.log("Solicitud exitosa:");
          Swal.fire("Recurrencia guardada.", null, "success");
          return data;
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud PUT:", error);
          Swal.fire("error al guardar recurrencia.", null, "error");
        });
    });
  }

  let enabledLME = false;
  let enabledGES_ENOType = "";
  let LMEGenerado = false;
  let GESGenerado = false;
  let ENOGenerado = false;

  //QUERYSELECTOR PARA LISTADO DE ESPECIALIDADES DE DERIVARION
  document.querySelectorAll("[name=especialidad]").forEach(function (item) {
    item.addEventListener("change", function () {
      debugger;
      if (this.checked) EspecialidadesDerivacion.push(item.value.toString());
      else {
        const index = EspecialidadesDerivacion.indexOf(item.value.toString());
        if (index > -1) {
          // only splice array when item is found
          EspecialidadesDerivacion.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
      console.log(EspecialidadesDerivacion);
    });
  });

  listaEspecialidades = await getEspecialidadesByTextAndRut(
    "",
    data.fichaPaciente.identificador
  );
  contador_regresivo();
  empresa = data.atencion.identificadorEmpresa;

  //---- configurar header POSITIVA y CO ----------//

  //---------actualizar inicio atención medico----------------
  if (data.atencion.inicioAtencion == null) {
    var resultInicio = await inicioAtencionMedico(data.atencion.id);
  }
  codigoPais = data.atencion.codigoPais;
  if (data.atencion.codigoPais == null) codigoPais = "CL";

  //PARA ESPECIALIDAD 77 - ORIENTACION
    debugger;
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
      data.atencion.medicamentos.forEach((item) => {
        //products
        postGetLink.data.products.push({
          id: item.product_id,
          description: item.product_name,
          quantity: 1,
        });
      });
    }
  }

  //----------------------------------------------------------
  //-----------------------realTime---------------------------
  //#region realtime

  idFirmante = document.querySelector(
    '[name="Atencion.IdMedicoFirmante"]'
  ).value;
  if (idFirmante == uid) {
    document.querySelector('[name="rol"]').value = "Invitado";
    if (document.getElementById("divBtnFirma")) {
      document
        .getElementById("btnSolicitarFirma")
        .setAttribute("style", "display:none");
      document.getElementById("divBtnFirma").classList.remove("d-flex");
      document
        .getElementById("divBtnFirma")
        .classList.remove("justify-content-between");
      document
        .getElementById("divBtnFirma")
        .setAttribute("style", "text-align:right;");
    }
  } else {
    if (data.atencion.tieneHuellero) {
      if (document.getElementById("divBtnFirma")) {
        document
          .getElementById("btnSolicitarFirma")
          .setAttribute("style", "display:none");
        document.getElementById("divBtnFirma").classList.remove("d-flex");
        document
          .getElementById("divBtnFirma")
          .classList.remove("justify-content-between");
        document
          .getElementById("divBtnFirma")
          .setAttribute("style", "text-align:right;");
      }
    }
  }

  await ingresoPacienteRT();

  if (connectionRT.state === signalR.HubConnectionState.Connected) {
    connectionRT
      .invoke(
        "SubscribeIngresoBox",
        parseInt(data.atencion.idPaciente),
        parseInt(data.atencion.idCliente)
      )
      .then((r) => {
        connectionRT
          .invoke(
            "IngresarBox",
            parseInt(data.atencion.idPaciente),
            parseInt(data.atencion.id),
            parseInt(data.atencion.idCliente)
          )
          .then((r) => {
            //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        return console.error(err.toString());
      });
  }

  await AtencionPacienteRealTime();
  await indexRealTime(uid);
  //#endregion
  //-----------------------------------------------------------

  document.getElementById("volverLlamar").onclick = async () => {
    if (connectionRT.state === signalR.HubConnectionState.Connected) {
      connectionRT
        .invoke(
          "SubscribeIngresoBox",
          parseInt(data.atencion.idPaciente),
          parseInt(data.atencion.idCliente)
        )
        .then((r) => {
          connectionRT
            .invoke(
              "IngresarBox",
              parseInt(data.atencion.idPaciente),
              parseInt(data.atencion.id),
              parseInt(data.atencion.idCliente)
            )
            .then((r) => {
              //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => {
          return console.error(err.toString());
        });
    }
  };

  setAsyncInterval(async () => llamarPaciente(40000)); //10seg

  function llamarPaciente() {
    if (connectionRT.state === signalR.HubConnectionState.Connected) {
      //connectionRT.invoke('SubscribeIngresoBox', parseInt(data.atencion.idPaciente), parseInt(data.atencion.idCliente)).then(r => {
      connectionRT
        .invoke(
          "EnLinea",
          parseInt(data.atencion.idPaciente),
          parseInt(data.atencion.id),
          parseInt(data.atencion.idCliente)
        )
        .then((r) => {
          //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
          //}).catch(err => console.error(err));
        })
        .catch((err) => {
          return console.error(err.toString());
        });
    }
  }

  async function generarRecetaQR(idAten) {
    try {
      return await (
        await fetch(
          `https://c7u8atcaxj.execute-api.us-east-1.amazonaws.com/generarRecetaQr?atencionId=${idAten}`
        )
      ).json();
    } catch (e) {}
    return null;
  }

  const pesoInput = document.getElementById("peso");
  const tallaInput = document.getElementById("talla");
  const imcInput = document.getElementById("imc");
  if (tallaInput && pesoInput) {
    pesoInput.addEventListener("input", calcularIMC);
    tallaInput.addEventListener("input", calcularIMC);
  }
  // Función para calcular el IMC
  function calcularIMC() {
    if (tallaInput && pesoInput) {
      const peso = parseFloat(pesoInput?.value);
      const talla = parseFloat(tallaInput?.value) / 100;

      if (!isNaN(peso) && !isNaN(talla)) {
        const imc = (peso / (talla * talla)).toFixed(2);
        imcInput.value = imc;
      } else {
        imcInput.value = "";
      }
    }
  }
  calcularIMC();

  check.checked = data.atencion.nsp;
  textCheck.value = data.atencion.descripcionNSP;
  checkBox(data);
  refreshReport();
  if (codigoPais == "CO") validarCamposCol();

  var momentDate = moment(todayDate).format(TODAY);
  document.querySelector('[name="Atencion.InicioAtencion"]').value = momentDate;
  let page = document.getElementById("page");

  let text =
    "Atención con paciente &nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;" +
    data.atencion.nombrePaciente +
    "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Teléfono: " +
    data.atencion.telefonoPaciente +
    "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Convenio: " +
    data.atencion.infoPaciente;
  if (data.atencion.fNacimiento != null)
    text +=
      " - Edad: " +
      moment().diff(data.atencion.fNacimiento.substring(0, 10), "years") +
      " años";

  page.innerHTML = text;
  page.setAttribute("style", "margin-left:20px;");

  idAtencion = document.querySelector('[name="Atencion.Id"]').value;

  //nombre paciente header chat
  document.getElementById("headName").innerHTML = data.atencion.nombrePaciente;
  let destinatarios = await getProfesionalesAsociadosByMedico(
    idAtencion,
    uid,
    parseInt(data.atencion.idCliente)
  );
  if (destinatarios.length > 0)
    document.getElementById("btnInvitar").removeAttribute("hidden", false);
  await configElementos(destinatarios);

  check.onchange = async () => {
    checkBox(data);
  };

  const btnRecurrencia = document.querySelector("#btnRecurrencia");

  if (btnRecurrencia) {
    btnRecurrencia.onclick = async () => {
      const tope = parseInt(document.getElementById("topes").value);
      const repetir = parseInt(document.getElementById("cantidad").value);
      if (tope <= repetir) {
        Swal.fire(
          "No puedes establecer una 'Cantidad A' menor que el número de repeticiones ingresado",
          null,
          "warning"
        );
      } else {
        var objRecurrencia = {
          periodicidad: document.getElementById("periodo").value,
          cantidad: parseInt(document.getElementById("cantidad").value),
          topes: parseInt(document.getElementById("topes").value),
          idEspecialidad: data.atencion.horaMedico.idEspecialidad,
          idProgramaSaludCiclo: idProgramaSaludCiclo,
          idMedico: uid,
        };
        const resp = await postRecurrencia(objRecurrencia);
        if (resp.status === "OK") {
          Swal.fire("Recurrencia guardada.", null, "success");
        }
      }
    };
  }
  document.querySelector("#btnConfirmarInvitados").onclick = async () => {
    if ($("#profesionalesAsociados option:selected").length == 0) {
      return;
    }
    $("#btnConfirmarInvitados")
      .addClass("kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light")
      .attr("disabled", true)
      .attr("style", "padding-right: 3.5rem;");
    let lista = $('select[name="profesionalesAsociados"]').val();
    let cadena = lista.toString();
    let arrayIdsInvitados = [];
    $.each(
      $('select[name="profesionalesAsociados"] option:selected'),
      function () {
        arrayIdsInvitados.push($(this).data("id"));
      }
    );

    data.atencion.correoInvitados = cadena;
    data.atencion.idsInvitados = arrayIdsInvitados.join(",");
    // Parche url UNAB
    let locationHref = new URL(window.location.href);
    let url =
      locationHref.hostname.includes("unabactiva.") ||
      locationHref.hostname.includes("activa.unab.")
        ? locationHref.origin
        : baseUrlWeb;
    let envio = await comprobanteProfesionalAsociados(url, data.atencion);
    if (envio.status == "OK") {
      $("#btnConfirmarInvitados")
        .removeClass(
          "kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light"
        )
        .attr("disabled", true)
        .attr("style", "padding-right: 3.5rem;");
      document
        .getElementById("btnConfirmarInvitados")
        .removeAttribute("style", "padding-right: 3.5rem;");
      document.getElementById("btnConfirmarInvitados").disabled = false;
      Swal.fire("", "Se envió la invitación de forma exitosa", "success");
      $("#kt_modal_4").modal("hide");
    } else {
      $("#btnConfirmarInvitados")
        .removeClass(
          "kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light"
        )
        .attr("disabled", true)
        .attr("style", "padding-right: 3.5rem;");
      document
        .getElementById("btnConfirmarInvitados")
        .removeAttribute("style", "padding-right: 3.5rem;");
      document.getElementById("btnConfirmarInvitados").disabled = false;
      Swal.fire("", "Se produjo un error al invitar profesionales", "error");
      $("#kt_modal_4").modal("hide");
    }
  };

  document.querySelector("#btnInvitar").onclick = async () => {
    $("#kt_modal_4").modal("show");
  };

  //---------------------finzalizar atención-------------------------------
  document.querySelector("#btnFirmar").onclick = async () => {
    const rol = document.querySelector('[name="rol"]').value;
    if (!checkConsentimiento.checked) {
      Swal.fire(
        "Paciente debe aceptar consentimiento informado",
        "",
        "warning"
      );
      return;
    }
    let validaCampos = null;
    if (
      (window.host.includes("positiva.") || window.host.includes("medical.")) &&
      idClienteP == idClientePositiva
    ) {
      //validaCampos = await validarCamposPositivaPsicologia(data);
      validaCampos = [];
    } else {
      validaCampos = await validarCampos(data);
    }
    if (validaCampos.length > 0) {
      Swal.fire(
        "¡Cuidado! <br> Faltan campos por completar...<br>",
        validaCampos,
        "error"
      );
      return;
    }
    const inputMedicamento = document.getElementById("input_codigoMedicamento");
    const posologia = document.getElementById("posologia");
    if (inputMedicamento) {
      if (inputMedicamento?.value != "" || posologia?.value != "") {
        Swal.fire(
          "¡Cuidado! <br>Tienes medicamentos que no han sido agregados a la lista <br>",
          "",
          "error"
        );
        return;
      }
    }

    $("#btnFirmar")
      .addClass("kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light")
      .attr("disabled", true)
      .attr("style", "padding-right: 3.5rem;");
    var tipo = "F";
    let valida = await guardarFinalizarAtencion(tipo);
    if (valida.status == "OK") {
      //generar enfermedad cronicos y guardar derivacion
      if (document.getElementById("select_cronicos_diagnostico")) {
        const select_cronicos_diagnostico = $("#select_cronicos_diagnostico");
        let seleccionados = [select_cronicos_diagnostico.val()];
        const bodyCronico = JSON.stringify({
          clinical_condition: [select_cronicos_diagnostico.val()],
          idPatient: data.atencion.idPaciente,
          idAttention: data.atencion.id,
          idClient: data.atencion.idCliente,
        });

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyCronico,
        };

        try {
          const generarEnfermedades = await fetch(
            `${window.servicesLambda}/programhealth/admin/info/`,
            requestOptions
          );
          if (!generarEnfermedades.ok) {
            throw new Error(
              `Error en la solicitud: ${generarEnfermedades.status} - ${generarEnfermedades.statusText}`
            );
          }
          const generarEnfermedadesJson = await generarEnfermedades.json();
          console.log("generar ", generarEnfermedadesJson);
        } catch (error) {
          console.error("Error al generar enfermedades crónicas:", error);
        }

        let enfermedades;
        try {
          const Pet = await fetch(
            `${window.servicesLambda}/programhealth/admin/info`
          );
          const datos = await Pet.json();
          if (!Pet.ok) {
            throw new Error(
              `Error en la solicitud: Condición clínica - ${Pet.message}`
            );
          }
          enfermedades = datos.data;
        } catch (e) {
          console.error("Error al recuperar enfermedades:", e);
        }

        function obtenerIdsUnicos(enfermedadesSeleccionadas) {
          const idsUnicos = new Set();
          enfermedadesSeleccionadas.forEach((enfermedad) => {
            const ids = enfermedades[enfermedad];
            if (ids) {
              ids.forEach((id) => idsUnicos.add(id));
            }
          });
          return [...idsUnicos];
        }

        const resultadoEnfermedades = obtenerIdsUnicos(seleccionados);
        console.log("resultadoEnfermedades", resultadoEnfermedades);
        EspecialidadesDerivacion = resultadoEnfermedades.map((value) =>
          value.toString()
        );
      }
      //update total_done
      if (
        (data.atencion.isProgramaSalud &&
          data.atencion.idProgramaSalud === 1) ||
        (data.atencion.idProgramaSalud === 3 &&
          data.atencion.isProgramaSalud &&
          idEspecialidadGlobal !== 95) ||
        (data.atencion.idProgramaSalud === 3 &&
          data.atencion.isProgramaSalud &&
          idEspecialidadGlobal !== 1)
      ) {
        // Obtener el ciclo del paciente
        const cyclePatient = await fetch(
          `${window.servicesLambda}/programhealth/data/cycle?idPatient=${data.atencion.idPaciente}&idClient=${data.atencion.idCliente}`
        );

        if (!cyclePatient.ok) {
          throw new Error(
            `Error en la solicitud: ${cyclePatient.status} - ${cyclePatient.statusText}`
          );
        }

        const cyclePatientJson = await cyclePatient.json();

        if (cyclePatientJson.data.length > 0) {
          console.log(cyclePatientJson.data[0]);
          const arrayPeriocidades = cyclePatientJson.data[0].periocities;
          for (const arrayP of arrayPeriocidades) {
            if (
              arrayP.id_speciality.toString() ===
              data.atencion.horaMedico.idEspecialidad.toString()
            ) {
              const bodyUpdateCronico = JSON.stringify({
                idProgramCycle: cyclePatientJson.data[0].uid,
                periocities: [
                  {
                    totalDone: arrayP.total_done + 1,
                    id: arrayP._id,
                  },
                ],
              });
              const requestOptions = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: bodyUpdateCronico,
              };
              // Actualizar total_done
              const updateTotalDone = await fetch(
                `${window.servicesLambda}/programhealth/data/cycle`,
                requestOptions
              );
              if (!updateTotalDone.ok) {
                throw new Error(
                  `Error al actualizar el ciclo: ${updateTotalDone.status} - ${updateTotalDone.statusText}`
                );
              }
              const updateTotalDoneJson = await updateTotalDone.json();
              console.log(updateTotalDoneJson);

              break;
            }
          }
        }

        const reviewTotalDone = await fetch(
          `${window.servicesLambda}/programhealth/data/cycle?idPatient=${data.atencion.idPaciente}&idClient=${data.atencion.idCliente}`
        );

        const resultTotalDone = await reviewTotalDone.json();
        const arrayPeriocidadesTotalDone = resultTotalDone.data[0].periocities;

        // borrar ciclo si total_done === total_occurrences
        if (resultTotalDone.data.length > 0) {
          const hasMoreThanOneObject = arrayPeriocidadesTotalDone.length > 1;
          const hasOneOject = arrayPeriocidadesTotalDone.length === 1;

          if (hasMoreThanOneObject) {
            const allDone = arrayPeriocidadesTotalDone.every(
              (arrayElement) =>
                arrayElement.total_done === arrayElement.total_occurrences
            );
            if (allDone) {
              const idCycle = cyclePatientJson.data[0].uid;
              const deleteRequestOptions = {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              };
              const deleteResponse = await fetch(
                `${window.servicesLambda}/programhealth/data/cycle/${idCycle}`,
                deleteRequestOptions
              );
              if (!deleteResponse.ok) {
                throw new Error(
                  `Error al borrar el ciclo: ${deleteResponse.status} - ${deleteResponse.statusText}`
                );
              }
              const deleteResponseJson = await deleteResponse.json();
              console.log(deleteResponseJson);
            }
          }

          if (hasOneOject) {
            for (const arrayElement of arrayPeriocidadesTotalDone) {
              if (arrayElement.total_done === arrayElement.total_occurrences) {
                const idCycle = cyclePatientJson.data[0].uid;
                const deleteRequestOptions = {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                };
                const deleteResponse = await fetch(
                  `${window.servicesLambda}/programhealth/data/cycle/${idCycle}`,
                  deleteRequestOptions
                );
                if (!deleteResponse.ok) {
                  throw new Error(
                    `Error al borrar el ciclo: ${deleteResponse.status} - ${deleteResponse.statusText}`
                  );
>>>>>>> Stashed changes
                }
            }
            console.log(EspecialidadesDerivacion);
        })
    })
    listaEspecialidades = await getEspecialidadesByTextAndRut("", data.fichaPaciente.identificador);
    contador_regresivo();
    empresa = data.atencion.identificadorEmpresa;

    //---- configurar header POSITIVA y CO ----------//




    //---------actualizar inicio atención medico----------------
    if (data.atencion.inicioAtencion == null) {
        var resultInicio = await inicioAtencionMedico(data.atencion.id);
    }
    codigoPais = data.atencion.codigoPais;
    if (data.atencion.codigoPais == null)
        codigoPais = "CL";

    //PARA ESPECIALIDAD 77 - ORIENTACION

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

    setAsyncInterval(async () => llamarPaciente(40000)); //10seg

    function llamarPaciente() {

        if (connectionRT.state === signalR.HubConnectionState.Connected) {
            //connectionRT.invoke('SubscribeIngresoBox', parseInt(data.atencion.idPaciente), parseInt(data.atencion.idCliente)).then(r => {
            connectionRT.invoke("EnLinea", parseInt(data.atencion.idPaciente), parseInt(data.atencion.id), parseInt(data.atencion.idCliente)).then(r => {
                //connectionRT.invoke('UnsubscribeIngresoBox', parseInt(data.atencion.idPaciente)).catch(err => console.error(err));
                //}).catch(err => console.error(err));
            }).catch((err) => {
                return console.error(err.toString());
            });
        }
    }

    async function generarRecetaQR(idAten) {
        try {
            return await (await fetch(`https://c7u8atcaxj.execute-api.us-east-1.amazonaws.com/generarRecetaQr?atencionId=${idAten}`)).json();
        } catch (e) { }
        return null
    }

    const pesoInput = document.getElementById('peso');
    const tallaInput = document.getElementById('talla');
    const imcInput = document.getElementById('imc');
    if (tallaInput && pesoInput) {
        pesoInput.addEventListener('input', calcularIMC);
        tallaInput.addEventListener('input', calcularIMC);
    }
    // Función para calcular el IMC
    function calcularIMC() {
        if (tallaInput && pesoInput) {
            const peso = parseFloat(pesoInput?.value);
            const talla = parseFloat(tallaInput?.value) / 100;

            if (!isNaN(peso) && !isNaN(talla)) {
                const imc = (peso / (talla * talla)).toFixed(2);
                imcInput.value = imc;
            } else {
                imcInput.value = '';
            }
        }
    }
    calcularIMC();

    check.checked = data.atencion.nsp;
    textCheck.value = data.atencion.descripcionNSP;
    checkBox(data);
    refreshReport();
    if (codigoPais == "CO")
        validarCamposCol();

    var momentDate = moment(todayDate).format(TODAY);
    document.querySelector('[name="Atencion.InicioAtencion"]').value = momentDate;
    let page = document.getElementById('page');

    let text = "Atención con paciente &nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;&nbsp;" + data.atencion.nombrePaciente + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Teléfono: " + data.atencion.telefonoPaciente + "&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;Convenio: " + data.atencion.infoPaciente;
    if (data.atencion.fNacimiento != null)
        text += ' - Edad: ' + moment().diff(data.atencion.fNacimiento.substring(0, 10), 'years') + ' años';

    page.innerHTML = text;
    page.setAttribute('style', 'margin-left:20px;')

    idAtencion = document.querySelector('[name="Atencion.Id"]').value;



    //nombre paciente header chat
    document.getElementById("headName").innerHTML = data.atencion.nombrePaciente;
    let destinatarios = await getProfesionalesAsociadosByMedico(idAtencion, uid, parseInt(data.atencion.idCliente));
    if (destinatarios.length > 0)
        document.getElementById('btnInvitar').removeAttribute('hidden', false)
    await configElementos(destinatarios);



    check.onchange = async () => {
        checkBox(data);
    }

    const btnRecurrencia = document.querySelector("#btnRecurrencia");

    if (btnRecurrencia) {
        btnRecurrencia.onclick = async () => {
            const tope = parseInt(document.getElementById("topes").value);
            const repetir = parseInt(document.getElementById("cantidad").value);
            if (tope <= repetir) {
                Swal.fire("No puedes establecer una 'Cantidad A' menor que el número de repeticiones ingresado", null, "warning");
            } else {
                var objRecurrencia = {
                    periodicidad: document.getElementById("periodo").value,
                    cantidad: parseInt(document.getElementById("cantidad").value),
                    topes: parseInt(document.getElementById("topes").value),
                    idEspecialidad: data.atencion.horaMedico.idEspecialidad,
                    idProgramaSaludCiclo: idProgramaSaludCiclo,
                    idMedico: uid
                };
                const resp = await postRecurrencia(objRecurrencia);
                if (resp.status === "OK") {
                    Swal.fire("Recurrencia guardada.", null, "success");
                }
            }
        };
    }
    document.querySelector("#btnConfirmarInvitados").onclick = async () => {

        if ($('#profesionalesAsociados option:selected').length == 0) {
            return;
        }
        $('#btnConfirmarInvitados').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
        let lista = $('select[name="profesionalesAsociados"]').val();
        let cadena = lista.toString();
        let arrayIdsInvitados = [];
        $.each($('select[name="profesionalesAsociados"] option:selected'), function () {
            arrayIdsInvitados.push($(this).data('id'))
        });

        data.atencion.correoInvitados = cadena;
        data.atencion.idsInvitados = arrayIdsInvitados.join(',');
        // Parche url UNAB
        let locationHref = new URL(window.location.href);
        let url = (locationHref.hostname.includes('unabactiva.') || locationHref.hostname.includes('activa.unab.')) ? locationHref.origin : baseUrlWeb;
        let envio = await comprobanteProfesionalAsociados(url, data.atencion);
        if (envio.status == "OK") {

            $('#btnConfirmarInvitados').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            document.getElementById('btnConfirmarInvitados').removeAttribute('style', 'padding-right: 3.5rem;');
            document.getElementById('btnConfirmarInvitados').disabled = false;
            Swal.fire("", "Se envió la invitación de forma exitosa", "success");
            $("#kt_modal_4").modal("hide");
        }
        else {
            $('#btnConfirmarInvitados').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            document.getElementById('btnConfirmarInvitados').removeAttribute('style', 'padding-right: 3.5rem;');
            document.getElementById('btnConfirmarInvitados').disabled = false;
            Swal.fire("", "Se produjo un error al invitar profesionales", "error");
            $("#kt_modal_4").modal("hide");
        }
    }

    document.querySelector('#btnInvitar').onclick = async () => {
        $("#kt_modal_4").modal("show");
    }

    //---------------------finzalizar atención-------------------------------
    document.querySelector('#btnFirmar').onclick = async () => {
        const rol = document.querySelector('[name="rol"]').value;
        if (!checkConsentimiento.checked) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }
        let validaCampos = null;
        if ((window.host.includes("positiva.") || window.host.includes("medical.")) && (idClienteP == idClientePositiva)) {
            //validaCampos = await validarCamposPositivaPsicologia(data);
            validaCampos = []
        } else {
            validaCampos = await validarCampos(data);
        }
        if (validaCampos.length > 0) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }
        const inputMedicamento = document.getElementById('input_codigoMedicamento');
        const posologia = document.getElementById('posologia');
        if (inputMedicamento) {
            if (inputMedicamento?.value != "" || posologia?.value != "") {
                Swal.fire("¡Cuidado! <br>Tienes medicamentos que no han sido agregados a la lista <br>", "", "error");
                return;
            }
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
            if (valida && valida.atencion && valida.atencion.idSesionPlataformaExterna == "TELEDOC" || empresa.includes("TLD-"))
                await finalizarExterno(idAtencion);
            var rutaVirtual = "";
            var idArchivo = "";
            var res = await getRutaVirtualByAtencion(idAtencion);
            if (res && res.archivo) {
                rutaVirtual = res.archivo.rutaVirtual;
                idArchivo = res.archivo.id;
            }

            await activarBono(idAtencion);
            if (data.atencion.isProgramaSalud == true) {
                //Validar si ya esta creada la recurrencia
                let idProgramaEspecialidad = await getProgramaSaludRecurrencia(idProgramaSaludCiclo, data.atencion.horaMedico.idEspecialidad);
                if (idProgramaEspecialidad != null) {
                    var objAtencionEspecialidad = {
                        idAtencion: parseInt(idAtencion),
                        idProgramaEspecialidad: idProgramaEspecialidad.id
                    }
                    await insertAtencionEspecialidad(objAtencionEspecialidad);
                }

            }

            derivacion.IdAtencion = parseInt(idAtencion);
            derivacion.IdUsuarioDeriva = window.uid;
            derivacion.Derivaciones = EspecialidadesDerivacion;
            await guardarDerivacion(derivacion);
            //llamada a ws consalud cuando idCliente es 1
            if (valida.atencion.idCliente == 1)
                await getResultAtencionEspera(idAtencion);
            //api pharol, envio receta
            if (valida.atencion.idCliente != 148) {
                try {
                    var medicamentos = [];
                    if (codigoPais == "CL") {
                        if (valida.atencion.medicamentos.length > 0) {
                            valida.atencion.medicamentos.forEach(item => {
                                var med = `${item.product_name}`
                                medicamentos.push(med);
                            })
                            let dataAtencion = {
                                medicamentos: medicamentos,
                                medico: valida.atencion.nombreMedico,
                                especialidad: valida.atencion.especialidad,
                                url_receta: baseUrlWeb + (rutaVirtual ? rutaVirtual.replace(/\\/g, '/') : rutaVirtual),
                                celular: valida.atencion.telefonoPaciente,
                                rut: valida.atencion.identificador,
                                email: valida.atencion.correoPaciente,
                                nombre: valida.atencion.nombre,
                                apellido: valida.atencion.apellidoPaterno,
                                idArchivo: idArchivo
                            }

                            // ESPERAR A QUE FUNCION API FARMACIA ENROLL FUNCIONE, POR MIENTRAS VARIABLE DE PRUEBA
                            //var pharolUrl = "https://cutt.ly/bO1Y45r";
                            if (rutaVirtual && rutaVirtual.length > 0) {
                                let res = await getPharol(dataAtencion);
                                postGetLink.data.prescription_url = baseUrlWeb + (rutaVirtual ? rutaVirtual.replace(/\\/g, '/') : rutaVirtual)
                                var resYapp = await postGL(postGetLink, tokenData);
                                var yappUrl = resYapp?.link?.data?.url ? resYapp.link.data.url : null;
                                var resPharol = JSON.parse(res);
                                var pharolUrl = resPharol.urlPharol ? resPharol.urlPharol : null;

                                if (pharolUrl != null || yappUrl != null) {
                                    await guardarPharol(idAtencion, null, yappUrl, valida.atencion.idCliente);

                                    /*var urlPharol = document.getElementById('urlPharol')
                                    urlPharol.innerHTML = pharolUrl;
                                    urlPharol.href = pharolUrl;*/
                                }
                            }
                        }
                    } else if (codigoPais == "CO") {
                        if (valida.atencion.medicamentos.length > 0) {
                            postGetLinkFarmalisto.products = [];
                            valida.atencion.medicamentos.forEach(item => {
                                var med = {
                                    qty: 1,
                                    reference: item.product_id
                                };
                                postGetLinkFarmalisto.products.push(med);
                            })
                            let farmalistoUrl = await getLinkFarmalisto(postGetLinkFarmalisto);
                            if (farmalistoUrl.length > 0) {
                                farmalistoUrl = farmalistoUrl.replaceAll('"', "");
                                await guardarFarmalisto(idAtencion, farmalistoUrl);
                            }
                        }
                    } else if (codigoPais == "MX") {
                        if (valida.atencion.medicamentos.length > 0) {
                            let productos = valida.atencion.medicamentos.map(el => el.codigo);
                            let cantidades = valida.atencion.medicamentos.map(el => 1);
                            await guardarVitau(idAtencion, productos.join(','), cantidades.join(','));
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            window.onbeforeunload = false;
            if (valida.atencion.atencionDirecta == true && valida.atencion.idSesionPlataformaExterna == "MEDISMART_APP") {
                let atencionInfo = await updateAtencionInmediate(valida.atencion.id, valida.atencion.estado);
            }

            //await fetch(window.urlHistExterno + "SendNewDiagnostic?idAtencion=" + idAtencion + "&idRegistro=" + data.idRegistroHisExterno ).json();
            if (data.histExterno) {
                await envioHistorialMedico(idAtencion, data.idRegistroHisExterno)
            }

            await terminoAtencionRT()
            let redireccion = `/Medico/InformeAtencion?idAtencion=${idAtencion}&sendInforme=true`;
            if (connectionTermino.state === signalR.HubConnectionState.Connected) {
                connectionTermino.invoke('SubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).then(r => {
                    connectionTermino.invoke("TerminoAtencion", parseInt(valida.atencion.idPaciente), parseInt(idAtencion), parseInt(valida.atencion.idCliente)).then(r => {
                        connectionTermino.invoke('UnsubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).catch(err => console.error(err));
                        window.location = redireccion;
                    }).catch(err => {
                        console.error(err);
                        window.location = redireccion;
                    });
                }).catch((err) => {
                    console.error(err.toString());
                    window.location = redireccion;
                });
            } else {
                window.location = redireccion;
            }
            $('#btnFirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            //window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}`;
        }
        else {
            Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            $('#btnFirmar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
        }
    };

    jQuery("#btnRefresh").trigger("click");
    //-----------------------------------------------------------------------
    //------------previsualizar informe o marcar paciente NSP---------------------

    let next = async () => {

        var tipo = "G";
        if (!checkConsentimiento.checked && !check.checked && !data.atencion.peritaje) {
            Swal.fire("Paciente debe aceptar consentimiento informado", "", "warning");
            return;
        }
        let validaCampos = null
        if ((window.host.includes("positiva.") || window.host.includes("medical.")) && (idClienteP == idClientePositiva)) {
            //validaCampos = await validarCamposPositivaPsicologia(data);
            validaCampos = []
        } else {
            validaCampos = await validarCampos(data);
        }

        if (validaCampos.length > 0) {
            Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", validaCampos, "error");
            return;
        }

        //Validar fechas para incapacidad medica
        if (codigoPais == "CO") {
            validaCampos = await validarIncapacidadCO();
            if (validaCampos.length > 0) {
                Swal.fire("¡Cuidado! <br> Por favor validar...<br>", validaCampos, "error");
                return;
            }
        }

        //validar datos pacientes CO y si el paciente es menor , validar responsable
        if ((window.host.includes("positiva.") || window.host.includes("medical.")) && (idClienteP == idClientePositiva)) {
            const fechaNacimiento = document.querySelector('#detalles-fecha-de-nacimiento').value;
            const genero = document.querySelector('#detalles-sexo-masculino').checked ? document.querySelector('#detalles-sexo-masculino').value : document.querySelector('#detalles-sexo-femenino').value
            const tipoDocumento = document.querySelector('#detalles-tipo-documento').value;
            const numeroDocumento = document.querySelector('#detalles-nro-documento').value;
            const direccion = document.querySelector('#detalles-direccion-de-residencia').value;
            const telefono = document.querySelector('#detalles-celular').value;
            const ocupacion = document.querySelector('#detalles-ocupacion').value;
            const estadoCivil = document.querySelector('#detalles-estado-civil').value;
            const correoElectronico = document.querySelector('#detalles-correo-electronico').value;
            const municipio = document.querySelector('#detalles-municipio').value;


            if (fechaNacimiento.trim() === "") {
                Swal.fire("El campo Fecha de Nacimiento es obligatorio", "", "warning");
                return;
            }

            if (genero.trim() === "") {
                Swal.fire("Debes seleccionar una opción en el campo Sexo", "", "warning");
                return;
            }

            if (tipoDocumento.trim() === "") {
                Swal.fire("El campo Tipo de documento es obligatorio", "", "warning");
                return;
            }

            if (numeroDocumento.trim() === "") {
                Swal.fire("El campo Número de documento es obligatorio", "", "warning");
                return;
            }

            if (direccion.trim() === "") {
                Swal.fire("El campo Dirección es obligatorio", "", "warning");
                return;
            }

            if (telefono.trim() === "") {
                Swal.fire("El campo Teléfono es obligatorio", "", "warning");
                return;
            }

            if (ocupacion.trim() === "") {
                if (!check.checked) {
                    Swal.fire("El campo Ocupación es obligatorio", "", "warning");
                    return;
                }
            }

            if (estadoCivil.trim() === "") {
                Swal.fire("El campo Estado Civil es obligatorio", "", "warning");
                return;
            }

            if (correoElectronico.trim() === "") {
                Swal.fire("El campo Correo Electrónico es obligatorio", "", "warning");
                return;
            }

            if (municipio.trim() === "") {
                Swal.fire("El campo Municipio es obligatorio", "", "warning");
                return;
            }
        }
        else if (codigoPais == "CO") {
            const nombre = document.getElementById("nombreCo").value;
            const apellidos = document.getElementById("apellidosCo").value;
            const edad = document.getElementById("edadCo").value;
            const fechaNacimiento = document.getElementById("fechaNacimientoCo").value;
            const sexoF = document.getElementById("sexoF").checked;
            const sexoM = document.getElementById("sexoM").checked;
            const tipoDocumento = document.getElementById("tipoDocumentoCo").value;
            const numeroDocumento = document.getElementById("numeroDocumentoCo").value;
            const direccion = document.getElementById("direccionCo").value;
            const telefono = document.getElementById("telefonoCo").value;
            const ocupacion = document.getElementById("ocupacionCo").value;
            const estadoCivil = document.getElementById("estadoCivilCo").value;
            const escolaridad = document.getElementById("escolaridadCo").value;
            const correoElectronico = document.getElementById("correoElectronicoCo").value;
            const correoAlterno = document.getElementById("correoAlternoCo").value;
            const fechaAtencion = document.getElementById("fechaAtencionCo").value;
            const esMenorEdad = edad.trim() !== "" && parseInt(edad, 10) < 18;

            if (nombre.trim() === "") {
                Swal.fire("El campo Nombre es obligatorio", "", "warning");
                return;
            }

            if (fechaAtencion.trim() === "") {
                Swal.fire("El campo Fecha de atención es obligatorio", "", "warning");
                return;
            }

            if (apellidos.trim() === "") {
                Swal.fire("El campo Apellidos es obligatorio", "", "warning");
                return;
            }

            if (edad.trim() === "" && !check.checked) {
                Swal.fire("El campo Edad es obligatorio", "", "warning");
                return;
            }

            if (fechaNacimiento.trim() === "") {
                Swal.fire("El campo Fecha de Nacimiento es obligatorio", "", "warning");
                return;
            }

            if (!sexoF && !sexoM && !check.checked) {
                Swal.fire("Debes seleccionar una opción en el campo Sexo", "", "warning");
                return;
            }

            if (tipoDocumento == "SS") {
                Swal.fire("El campo Tipo de documento es obligatorio", "", "warning");
                return;
            }

            if (numeroDocumento.trim() === "") {
                Swal.fire("El campo Número de documento es obligatorio", "", "warning");
                return;
            }

            if (direccion.trim() === "" && !check.checked) {
                Swal.fire("El campo Dirección es obligatorio", "", "warning");
                return;
            }

            if (telefono.trim() === "") {
                Swal.fire("El campo Teléfono es obligatorio", "", "warning");
                return;
            }

            if (ocupacion.trim() === "" && !check.checked && !esMenorEdad) { 
                Swal.fire("El campo Ocupación es obligatorio", "", "warning");
                return;
            }

            if (estadoCivil.trim() === "") {
                Swal.fire("El campo Estado Civil es obligatorio", "", "warning");
                return;
            }

            if (escolaridad.trim() === "") {
                Swal.fire("El campo Escolaridad es obligatorio", "", "warning");
                return;
            }
            if (correoElectronico.trim() === "") {
                Swal.fire("El campo Correo Electrónico es obligatorio", "", "warning");
                return;
            }
            //si es menor de edad

            if (esMenorEdad && !check.checked) {
                const responsable = document.getElementById("nombreResponsable").value;
                const telefonoResponsable = document.getElementById("telefonoResponsable").value;
                const parentesco = document.getElementById("parentesco").value;
                const fechaAtencion = document.getElementById("fechaAtencionCo").value;
                const acompanante = document.getElementById("nombreAcompanante").value;
                const telefonoAcompanante = document.getElementById("telefonoAcompanante").value;

                if (responsable.trim() === "") {
                    Swal.fire("El campo Responsable es obligatorio para pacientes menores de edad", "", "warning");
                    return;
                }

                if (telefonoResponsable.trim() === "") {
                    Swal.fire("El campo Teléfono del Responsable es obligatorio para pacientes menores de edad", "", "warning");
                    return;
                }

                if (parentesco.trim() === "") {
                    Swal.fire("El campo Parentesco es obligatorio para pacientes menores de edad", "", "warning");
                    return;
                }

                if (fechaAtencion.trim() === "") {
                    Swal.fire("El campo Fecha de Atención es obligatorio para pacientes menores de edad", "", "warning");
                    return;
                }

                if (acompanante.trim() === "") {
                    Swal.fire("El campo Acompañante es obligatorio para pacientes menores de edad", "", "warning");
                    return;
                }

                if (telefonoAcompanante.trim() === "") {
                    Swal.fire("El campo Teléfono del Acompañante es obligatorio para pacientes menores de edad", "", "warning");
                    return;
                }
            }

            //antecedentes colombia
            const antecedentesPatologicos = document.getElementById("antecedentesPatologicos").value;
            const antecedentesQuirurgicos = document.getElementById("antecedentesQuirurgicos").value;
            const antecedentesGinecoObstetricos = document.getElementById("antecedentesGinecoObstetricos").value;
            const antecedentesToxicosAlergicos = document.getElementById("antecedentesToxicosAlergicos").value;
            if (
                antecedentesPatologicos.trim() === "" &&
                antecedentesQuirurgicos.trim() === "" &&
                antecedentesGinecoObstetricos.trim() === "" &&
                antecedentesToxicosAlergicos.trim() === "" 
                && !check.checked
            ) {
                Swal.fire("El campo de Antecedentes no puede estar vacío", "", "warning");
                return;
            }
        }

        const inputMedicamento = document.getElementById('input_codigoMedicamento');
        const posologia = document.getElementById('posologia');
        if (inputMedicamento) {
            if (inputMedicamento.value != "" || posologia.value != "") {
                Swal.fire("¡Cuidado! <br>Tienes medicamentos que no han sido agregados a la lista <br>", "", "error");
                return;
            }
        }

        /*valida ges y eno*/


        if (codigoPais == "CL") {
            if (enabledLME && !(LMEGenerado)) {
                Swal.fire({
                    title: "Proporcione acontinuacion los datos para la licencia medica",
                    text: `Mantenga el paciente en la llamada.`,
                    type: "info",
                    showConfirmButton: true,
                });
                window.jsPanel("#divLicenciaMedicaElectronica")
                return;
            }

            var ges = false;
            var eno = false;
            if (!check.checked && !data.atencion.peritaje) {
                ges = await validaGes();
                eno = await validaEno();
            }

            let indexgesp = (Object.keys(lisGes).find((v) => (Number.isInteger(lisGes[v]) && (lisGes[v] == 0))));
            let indexgeno = (Object.keys(lisEno).find((v) => (Number.isInteger(lisEno[v]) && (lisEno[v] == 0))));

            if (ges && indexgesp != undefined) {
                preCie10GES(indexgesp);
                jsPanel("#divGES");
                return;
            }
            else if (eno && indexgeno != undefined) {
                preCie10ENO(indexgeno);
                jsPanel("#divENO");
                return;
            }
        }
        const medicamentosMedico = document.querySelector("[name='MedicamentosMedico']");
        const especialBox = [47, 54];

        //TODO guardar datos paciente

        //FORM DETALLES

        if ((window.host.includes("positiva.") || window.host.includes("medical.")) && (idClienteP == idClientePositiva)) {

            const tipoDocumento = document.querySelector('#detalles-tipo-documento').value;
            const nroDocumento = document.querySelector('#detalles-nro-documento').value;
            //const fullName = document.querySelector('#detalles-nombre-asegurado').value;
            const ciudad = document.querySelector('#detalles-ciudad-asegurado').value;
            const departamento = document.querySelector('#detalles-departamento-asegurado').value;
            let fechaNacimiento = document.querySelector('#detalles-fecha-de-nacimiento').value;
            const genero = document.querySelector('#detalles-sexo-masculino').checked ? document.querySelector('#detalles-sexo-masculino').value : document.querySelector('#detalles-sexo-femenino').value
            const direccion = document.querySelector('#detalles-direccion-de-residencia').value;
            const telefonoMovil = document.querySelector('#detalles-celular').value;
            const estadoCivil = document.querySelector('#detalles-estado-civil').value;
            const correoElectronico = document.querySelector('#detalles-correo-electronico').value;
            const municipio = document.querySelector('#detalles-municipio').value;
            const eps = document.querySelector('#detalles-eps').value;

            const ocupacion = document.querySelector('#detalles-ocupacion').value;
            const edadDetalles = document.querySelector('#detalles-edad').value;
            const empresa = document.querySelector('#detalles-empresa').value


            if (fechaNacimiento && fechaNacimiento.includes("-")) {
                fechaNacimiento = fechaNacimiento.replace(/-/g, "/");
            }
            const partes = fechaNacimiento.split("/");
            let fechaFormateada;
            let fechaNacimientoFormateada;

            if (partes[0].length === 4) {
                fechaFormateada = new Date(partes[0], partes[1] - 1, partes[2]);
            }
            else if (partes[2].length === 4) {
                fechaFormateada = new Date(partes[2], partes[1] - 1, partes[0]);
            }
            else {
                fechaFormateada = new Date(fechaNacimiento);
            }

            if (isNaN(fechaFormateada.getTime())) {
                fechaNacimientoFormateada = new Date("10/05/1991").toISOString().split('T')[0];
            } else {
                fechaNacimientoFormateada = fechaFormateada.toISOString().split('T')[0];
            }

            const formData = new FormData();
            formData.append('TipoDocumento', tipoDocumento)
            //formData.append('FullName', fullname)
            formData.append('Documento', nroDocumento)
            formData.append('Ciudad', ciudad)
            formData.append('Departamento', departamento)
            formData.append('EstadoCivil', estadoCivil)
            formData.append('FNacimiento', fechaNacimientoFormateada)
            formData.append('Genero', genero)
            formData.append('Direccion', direccion)
            formData.append('TelefonoMovil', telefonoMovil)
            formData.append('Correo', correoElectronico)
            //formData.append('Ocupacion', ocupacion)
            formData.append('Municipio', municipio)
            formData.append('Eps', eps)
            await EditInfoPerfil(formData, data.atencion.horaMedico.idPaciente)
        }
        else if (codigoPais == "CO") {
            const nombre = document.getElementById("nombreCo").value;
            const apellidos = document.getElementById("apellidosCo").value;
            var fechaNacimiento = document.getElementById("fechaNacimientoCo").value;
            const sexoF = document.getElementById("sexoF").checked;
            const sexoM = document.getElementById("sexoM").checked;
            const tipoDocumento = document.getElementById("tipoDocumentoCo").value;
            const numeroDocumento = document.getElementById("numeroDocumentoCo").value;
            const direccion = document.getElementById("direccionCo").value;
            const telefono = document.getElementById("telefonoCo").value;
            const estadoCivil = document.getElementById("estadoCivilCo").value;
            const escolaridad = document.getElementById("escolaridadCo").value;
            const correoElectronico = document.getElementById("correoElectronicoCo").value;
            const correoAlterno = document.getElementById("correoAlternoCo").value;
            const peso = document.getElementById("peso").value;
            const talla = document.getElementById("talla").value;
            const Ocupacion = document.getElementById("ocupacionCo").value;

            const altura = talla ? parseFloat(talla) : 0;
            const pesoNumero = peso ? parseInt(peso) : 0;
            if (fechaNacimiento && fechaNacimiento.includes("-")) {
                fechaNacimiento = fechaNacimiento.replace(/-/g, "/");
            }
            const partes = fechaNacimiento.split("/");
            let fechaFormateada;
            let fechaNacimientoFormateada;

            if (partes[0].length === 4) {
                fechaFormateada = new Date(partes[0], partes[1] - 1, partes[2]);
            }
            else if (partes[2].length === 4) {
                fechaFormateada = new Date(partes[2], partes[1] - 1, partes[0]);
            }
            else {
                fechaFormateada = new Date(fechaNacimiento);
            }

            if (isNaN(fechaFormateada.getTime())) {
                fechaNacimientoFormateada = new Date("10/05/1991").toISOString().split('T')[0];
            } else {
                fechaNacimientoFormateada = fechaFormateada.toISOString().split('T')[0];
            }

            const formData = new FormData();
            formData.append('Nombre', nombre);
            formData.append('ApellidoPaterno', apellidos);
            formData.append('Correo', correoElectronico);
            formData.append('Telefono', telefono);
            formData.append('Genero', sexoM ? "M" : "F");
            formData.append('FNacimiento', fechaNacimientoFormateada);
            formData.append('Altura', altura);
            formData.append('TipoDocumento', tipoDocumento);
            formData.append('Peso', pesoNumero);
            formData.append('Direccion', direccion);
            formData.append('CorreoPlataformaTercero', correoAlterno);
            formData.append('EstadoCivil', estadoCivil);
            formData.append('Escolaridad', escolaridad);
            formData.append('Ocupacion', Ocupacion);
            await EditInfoPerfil(formData, data.atencion.horaMedico.idPaciente)
        }



        if (!window.isPsicopedagogiaUnab && $("#listaMedicamentos")[0]?.innerText == "" && medicamentosMedico?.value == "" && !check.checked && window.boxEspecial != 1 && !especialBox.includes(data.atencion.horaMedico.idEspecialidad)) {
            Swal.fire({
                title: "Atención sin medicamentos",
                text: `´Se emitirán informes sin receta medica, ¿Es correcto?`,
                type: "question",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                confirmButtonText: "Sí, Continuar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.value) {
                    await guardar();
                }
            });
        }
        else {
            await guardar();
        }

        async function guardar() {
            $('#btnGuardar').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');

            if (data.atencion.peritaje) {
                tipo = "F";
            }
            //if(codigoPais === "CL")
            //    sendPostLink = await postGL(postGetLink, tokenData);
            let valida = await guardarFinalizarAtencion(tipo);
            if (valida && valida.atencion && (valida.atencion.idSesionPlataformaExterna == "TELEDOC" || empresa.includes("TLD-")) && check.checked)
                await finalizarExterno(idAtencion);
            //previsualizar informe
            if (valida.status == "OK") {
                if (!check.checked && !data.atencion.peritaje) {

                    var dataR = await getDataInformes(data.atencion.id);

                    var logoConv = document.getElementById("logoConvenio");
                    logoConv.src = dataR.logoConvenio;
                    document.getElementById("fechaInforme").innerHTML = dataR.fechaHoy;
                    document.getElementById("nombreMedico").innerHTML = dataR.prefijoEspecialidad + ' ' + dataR.nombreCompletoMedico;
                    document.getElementById("rutMedico").innerHTML = dataR.rutMedico;
                    document.getElementById("especialidadMedico").innerHTML = dataR.especialidadMedico;
                    document.getElementById("regMedico").innerHTML = dataR.regMedico;

                    document.getElementById("nombrePaciente").innerHTML = dataR.nombreCompletoPaciente;
                    document.getElementById("domicilioPaciente").innerHTML = dataR.direccionPaciente;
                    document.getElementById("rutPaciente").innerHTML = dataR.rutPaciente;
                    document.getElementById("edad").innerHTML = dataR.edadPaciente;
                    // Datos adicionales
                    if (dataR.atencionDatosAdicionales != null) {
                        $("#divNombreAcompanante span").html(dataR.atencionDatosAdicionales?.nombreAcompanante);
                        $("#divTelefonoAcompanante span").html(dataR.atencionDatosAdicionales?.telefonoAcompanante);
                        $("#divNombreResponsable span").html(dataR.atencionDatosAdicionales?.nombreResponsable);
                        $("#divTelefonoResponsable span").html(dataR.atencionDatosAdicionales?.telefonoResponsable);
                    }

                    // Datos colombia
                    $("#divEstadoCivilPaciente span").html(dataR.estadoCivil ?? '');
                    $("#divEscolaridadPaciente span").html(dataR.escolaridad ?? '');
                    $("#divPaisNacimientoPaciente span").html(dataR.paisNacimiento ?? '');
                    $("#divCiudadNacimientoPaciente span").html(dataR.ciudadNacimiento ?? '');

                    document.getElementById("molestia").innerHTML = dataR.molestia;
                    document.getElementById("motivoConsultaMedico").innerHTML = dataR.motivoConsultaMedico;
                    document.querySelector("#modal-informe #motivoConsultaMedico").innerHTML = dataR.motivoConsultaMedico;
                    document.getElementById("diagnosticoMedico").innerHTML = dataR.diagnosticoMedico;
                    //document.getElementById("derivacion").innerHTML = dataR.diagnosticoMedico;
                    document.getElementById("patologias").innerHTML = dataR.patologias;
                    document.getElementById("medicamentosMedico").innerHTML = dataR.medicamentosMedico;
                    document.getElementById("examenes").innerHTML = dataR.examenes;
                    document.getElementById("examenMedico").innerHTML = dataR.examenMedico;
                    document.getElementById("examenMedico2").innerHTML = dataR.examenMedico;
                    document.getElementById("examenMedico3").innerHTML = dataR.examenMedico;
                    document.getElementById("tratamientoMedico").innerHTML = dataR.tratamientoMedico;
                    document.getElementById("certificadoMedico").innerHTML = dataR.certificadoMedico;
                    document.getElementById("diagnosticoPsicopedagogico").innerHTML = dataR.diagnosticoPsicopedagogico;
                    document.getElementById("objetivosDeLaSesion").innerHTML = dataR.objetivosDeLaSesion;
                    const incapacidadMedica = document.getElementById("incapacidadMedica");
                    if (incapacidadMedica != null)
                        document.getElementById("incapacidadMedica").innerHTML = dataR.incapacidadMedica;
                    document.getElementById("controlMedico").innerHTML = dataR.controlMedico;

                    if (codigoPais == "MX") {
                        document.getElementById('informe').innerHTML = "Resumen clínico";
                    } else {
                        var title = document.getElementById('informe').innerHTML;
                        if (window.host.includes('uoh.'))
                            title = "Reporte de Salud";
                        if (data.atencion.horaMedico.idEspecialidad.toString() === "129")
                            title = "Informe de enfermería";
                        document.getElementById('informe').innerHTML = title;
                    }

                    if ($("#AreaAjusteSelect").length && $('#AntecedentesSelect').length && $('#HipotesisSelect').length) {
                        let containerAntecedentesHipotesisArea = document.getElementById("containerAntecedentesHipotesisArea");
                        containerAntecedentesHipotesisArea.innerHTML = '';
                        const listParamsAnte = await getParametro("Antecedentes");
                        let dataSelectAntecedentes = await getAtencionAntecedentesByIdAtencion(idAtencion);
                        let titleAntecedentes = document.createElement("h6");
                        titleAntecedentes.textContent = "Antecedentes"
                        containerAntecedentesHipotesisArea.appendChild(titleAntecedentes);
                        dataSelectAntecedentes.data.forEach(d => {
                            let titleAnte = document.createElement("span");
                            let descripAnte = document.createElement("p");
                            let dataSearch = listParamsAnte.find(x => x.id == d.idAntecedente)
                            titleAnte.textContent = "Antecedente: " + dataSearch.detalle;
                            descripAnte.textContent = "Descripcion: " + d.descripcion;
                            containerAntecedentesHipotesisArea.appendChild(titleAnte);
                            containerAntecedentesHipotesisArea.appendChild(descripAnte);
                        })


                        const listParamsArea = await getParametro("AreaAjuste");
                        let dataSelectArea = await getAtencionAreaAjusteByIdAtencion(idAtencion);
                        let titleAreaAjuste = document.createElement("h6");
                        titleAreaAjuste.textContent = "Area Ajuste"
                        containerAntecedentesHipotesisArea.appendChild(titleAreaAjuste);
                        dataSelectArea.data.forEach(d => {
                            let titleArea = document.createElement("span");
                            let descripArea = document.createElement("p");
                            let dataSearch = listParamsArea.find(x => x.id == d.idAreaAjuste)
                            titleArea.textContent = "Area Ajuste: " + dataSearch.detalle;
                            descripArea.textContent = "Descripcion: " + d.descripcion;
                            containerAntecedentesHipotesisArea.appendChild(titleArea);
                            containerAntecedentesHipotesisArea.appendChild(descripArea);
                        })


                        const listParamsHipo = await getParametro("HipotesisPreliminar");
                        let dataSelectHipotesis = await getAtencionHipotesisPreliminarByIdAtencion(idAtencion);
                        let titleHipotesis = document.createElement("h6");
                        titleHipotesis.textContent = "Hipotesis Preliminar"
                        containerAntecedentesHipotesisArea.appendChild(titleHipotesis);
                        dataSelectHipotesis.data.forEach(d => {
                            let titleHipo = document.createElement("span");
                            let descripHipo = document.createElement("p");
                            let dataSearch = listParamsHipo.find(x => x.id == d.idHipotesisPreliminar)
                            titleHipo.textContent = "Hipotesis preliminar: " + dataSearch.detalle;
                            descripHipo.textContent = "Descripcion: " + d.descripcion;
                            containerAntecedentesHipotesisArea.appendChild(titleHipo);
                            containerAntecedentesHipotesisArea.appendChild(descripHipo);
                        })

                    }

                    if ((window.host.includes("positiva.") || window.host.includes("medical.")) && (idClienteP == idClientePositiva)) {
                        if (data.atencion.horaMedico.idEspecialidad == 88 || data.atencion.horaMedico.idEspecialidad == 68 || data.atencion.horaMedico.idEspecialidad == 76 ) {
                            // Aspecto Sobresalientes del comportamiento
                            if ($('#containerAspectosSobresalientes').length) {
                                let containerAspectosSobresalientes = document.getElementById("containerAspectosSobresalientes");
                                let titleAspectosSobresalientes = document.createElement("h6");
                                titleAspectosSobresalientes.textContent = "Aspectos sobresalientes del comportamiento";
                                containerAspectosSobresalientes.appendChild(titleAspectosSobresalientes);
                                let pAspectosSobresalientes = document.createElement("p");
                                pAspectosSobresalientes.textContent = dataR.objetivosDeLaSesion;
                                containerAspectosSobresalientes.appendChild(pAspectosSobresalientes);
                            }

                            // Conclusiones y comentarios
                            if ($('#containerConclusiones').length) {
                                let containerConclusiones = document.getElementById("containerConclusiones");
                                let titleConclusiones = document.createElement("h6");
                                titleConclusiones.textContent = "Conclusiones y comentarios";
                                containerConclusiones.appendChild(titleConclusiones);
                                let pConclusiones = document.createElement("p");
                                pConclusiones.textContent = dataR.controlMedico;
                                containerConclusiones.appendChild(pConclusiones);
                            }

                            //Plan de intervención
                            if ($('#containerPlanIntervencion').length) {
                                let containerPlanIntervencion = document.getElementById("containerPlanIntervencion");
                                let titlePlanIntervencion = document.createElement("h6");
                                titlePlanIntervencion.textContent = "Plan de intervención";
                                containerPlanIntervencion.appendChild(titlePlanIntervencion);
                                let pPlanIntervencion = document.createElement("p");
                                pPlanIntervencion.textContent = dataR.tratamientoMedico;
                                containerPlanIntervencion.appendChild(pPlanIntervencion);
                            }

                            //Diagnóstico área psicológica
                            if ($('#containerDiagnostico').length) {
                                let containerDiagnostico = document.getElementById("containerDiagnostico");
                                let titleDiagnostico = document.createElement("h6");
                                titleDiagnostico.textContent = "Diagnóstico área psicológica";
                                containerDiagnostico.appendChild(titleDiagnostico);
                                let pDiagnostico = document.createElement("p");
                                pDiagnostico.textContent = dataR.examenMedico;
                                containerDiagnostico.appendChild(pDiagnostico);
                            }

                            //Historia del problema
                            if ($('#containerHistoriaDelProblema').length) {
                                let containerHistoriaDelProblema = document.getElementById("containerHistoriaDelProblema");
                                let titleHistoriaDelProblema = document.createElement("h6");
                                titleHistoriaDelProblema.textContent = "Historia del problema";
                                containerHistoriaDelProblema.appendChild(titleHistoriaDelProblema);
                                let pHistoriaDelProblema = document.createElement("p");
                                pHistoriaDelProblema.textContent = dataR.diagnosticoMedico;
                                containerHistoriaDelProblema.appendChild(pHistoriaDelProblema);
                            }

                            //datosPaciente 
                            const genero = document.querySelector('#detalles-sexo-masculino').checked ? document.querySelector('#detalles-sexo-masculino').value : document.querySelector('#detalles-sexo-femenino').value
                            dataR.generoPaciente = genero;
                            const direccion = document.querySelector('#detalles-direccion-de-residencia').value;
                            dataR.direccionPaciente = direccion;
                            const ciudadAtencionCo = document.querySelector('#detalles-ciudad-asegurado').value;
                            document.getElementById("ciudadAtencionCo").textContent = ciudadAtencionCo;
                            document.getElementById("detalles-departamento-asegurado").textContent = document.querySelector('#detalles-departamento-asegurado').value;
                            document.getElementById("estadoCivilCo").textContent = document.querySelector('#detalles-estado-civil')[0].value;
                            document.getElementById("fechaNacimientoCo").textContent = document.querySelector('#detalles-fecha-de-nacimiento').value;
                            document.getElementById("telefonoCo").textContent = document.querySelector('#detalles-celular').value;
                            document.getElementById("correoElectronicoCo").textContent = document.querySelector('#detalles-correo-electronico').value;
                            document.getElementById("ocupacionCo").textContent = document.querySelector('#detalles-ocupacion').value;
                            document.getElementById("detalles-municipio").textContent = document.querySelector('#detalles-municipio').value;
                            document.getElementById("detalles-eps").textContent = document.querySelector('#detalles-eps').value;
                        } else {
                            // Aspecto Sobresalientes del comportamiento
                            let containerAspectosSobresalientes = document.getElementById("containerAspectosSobresalientes");
                            containerAspectosSobresalientes.innerHTML = '';
                            let titleAspectosSobresalientes = document.createElement("h6");
                            titleAspectosSobresalientes.textContent = "Aspectos sobresalientes del comportamiento";
                            containerAspectosSobresalientes.appendChild(titleAspectosSobresalientes);
                            let pAspectosSobresalientes = document.createElement("p");
                            pAspectosSobresalientes.textContent = dataR.objetivosDeLaSesion;
                            containerAspectosSobresalientes.appendChild(pAspectosSobresalientes);

                            // Conclusiones y comentarios
                            let containerConclusiones = document.getElementById("containerConclusiones");
                            containerConclusiones.innerHTML = '';
                            let titleConclusiones = document.createElement("h6");
                            titleConclusiones.textContent = "Conclusiones y comentarios";
                            containerConclusiones.appendChild(titleConclusiones);
                            let pConclusiones = document.createElement("p");
                            pConclusiones.textContent = dataR.controlMedico;
                            containerConclusiones.appendChild(pConclusiones);

                            //Plan de intervención
                            let containerPlanIntervencion = document.getElementById("containerPlanIntervencion");
                            containerPlanIntervencion.innerHTML = '';
                            let titlePlanIntervencion = document.createElement("h6");
                            titlePlanIntervencion.textContent = "Plan de intervención";
                            containerPlanIntervencion.appendChild(titlePlanIntervencion);
                            let pPlanIntervencion = document.createElement("p");
                            pPlanIntervencion.textContent = dataR.tratamientoMedico;
                            containerPlanIntervencion.appendChild(pPlanIntervencion);

                            //Diagnóstico área psicológica
                            let containerDiagnostico = document.getElementById("containerDiagnostico");
                            containerDiagnostico.innerHTML = '';
                            let titleDiagnostico = document.createElement("h6");
                            titleDiagnostico.textContent = "Diagnóstico área psicológica";
                            containerDiagnostico.appendChild(titleDiagnostico);
                            let pDiagnostico = document.createElement("p");
                            pDiagnostico.textContent = dataR.examenMedico;
                            containerDiagnostico.appendChild(pDiagnostico);

                            //Historia del problema
                            let containerHistoriaDelProblema = document.getElementById("containerHistoriaDelProblema");
                            containerHistoriaDelProblema.innerHTML = '';
                            let titleHistoriaDelProblema = document.createElement("h6");
                            titleHistoriaDelProblema.textContent = "Historia del problema";
                            containerHistoriaDelProblema.appendChild(titleHistoriaDelProblema);
                            let pHistoriaDelProblema = document.createElement("p");
                            pHistoriaDelProblema.textContent = dataR.diagnosticoMedico;
                            containerHistoriaDelProblema.appendChild(pHistoriaDelProblema);

                            //datosPaciente 
                            document.getElementById("direccionPacienteCo").textContent = dataR.direccionPaciente;
                            document.getElementById("ciudadPacienteCo").textContent = document.querySelector('#detalles-ciudad-asegurado').value;
                            document.getElementById("departamentoPacienteCo").textContent = document.querySelector('#detalles-departamento-asegurado').value;
                            document.getElementById("estadoCivilPacienteCo").textContent = document.querySelector('#detalles-estado-civil').value;
                            document.getElementById("fechaNacimientoPacienteCo").textContent = document.querySelector('#detalles-fecha-de-nacimiento').value;
                            document.getElementById("sexoPacienteCo").textContent = dataR.generoPaciente;
                            document.getElementById("celularPacienteCo").textContent = document.querySelector('#detalles-celular').value;
                            document.getElementById("correoPacienteCo").textContent = document.querySelector('#detalles-correo-electronico').value;
                            document.getElementById("ocupacionPacienteCo").textContent = document.querySelector('#detalles-ocupacion').value;
                            document.getElementById("municipioPacienteCo").textContent = document.querySelector('#detalles-municipio').value;
                            document.getElementById("epsPacienteCo").textContent = document.querySelector('#detalles-eps').value;
                        }
                        
                    }


                    $("#modal-informe").modal("show");
                }

                else {
                    //PACIENTE NPS, ACTUALIZACION ETIQUETA ATENCIONES VISTA PACIENTE

                    if (check.checked) {
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
                        //await cambioEstado(idAtencion.toString(), "PA") // PA = Paciente Ausente
                    }

                    await terminoAtencionRT()
                    if (valida.atencion.atencionDirecta == true && valida.atencion.idSesionPlataformaExterna == "MEDISMART_APP") {
                        let atencionInfo = await updateAtencionInmediate(valida.atencion.id, valida.atencion.estado);
                    }
                    let redireccion = ``;

                    if (valida.atencion.atencionDirecta) {
                        redireccion = `/Medico/homeUrgencia`;
                    }
                    else {
                        redireccion = `/Medico/Index`;
                    }
                    if (connectionTermino.state === signalR.HubConnectionState.Connected) {
                        connectionTermino.invoke('SubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).then(r => {
                            connectionTermino.invoke("TerminoAtencion", parseInt(valida.atencion.idPaciente), parseInt(idAtencion), parseInt(valida.atencion.idCliente)).then(r => {
                                connectionTermino.invoke('UnsubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).catch(err => console.error(err));
                                window.location = redireccion;
                            }).catch(err => { console.error(err); window.location = redireccion; });
                        }).catch((err) => {
                            console.error(err.toString());
                            window.location = redireccion;
                        });
                    }
                    window.onbeforeunload = false;
                    

                }

            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
            }
            $('#btnGuardar').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');

        }
    };


    document.querySelector('#btnGuardar').onclick = next;

    if (document.querySelector('#checklme')) {
        document.querySelector('#checklme').addEventListener("change", (e) => {
            enabledLME = e.target.checked;
        })
    }
    var preFunDiagnosticoPrincipal = (select) => {
        let isFirstPulse = true
        return async (e) => {
            if (isFirstPulse) {
                isFirstPulse = false;
                $("#listaEnfermedad li").each(async function () {
                    var cie10 = $(this).attr('data-cie10').trim();
                    var dataid = $(this).attr('data-id').trim();
                    var text = $(this)[0].innerText.split(/[-–]/)[1];
                    if (text.includes("\n"))
                        text = text.split("\n")[0].trim()
                    $(select).append('<option value ="' + dataid + '"  data-id =' + dataid + ' data-cie10 =' + cie10 + '>' + cie10 + " - " + text + '</option>');
                });
            }
            
        }
    }
    var preCie10GES = (item = null) => {
        Swal.fire({
            title: "Proporcione acontinuacion los datos para la documentacion GES",
            text: `Mantenga al paciente en la llamada.`,
            type: "info",
            showConfirmButton: true,
        });
        if ($("#GESCie10").length)
            $("#GESCie10")[0].innerHTML = "";
        $("#listaEnfermedad li").each(async function () {
            var cie10 = $(this).attr('data-cie10').trim();
            var dataid = $(this).attr('data-id').trim();
            var text = $(this)[0].innerText.split(/[-–]/).slice(1).map((v) => v.trim()).join("-");
            if ($("#GESCie10").length) {
                if (text.includes("\nGES")
                ) {
                    text = text.split("\nGES")[0].trim()
                    $("#GESCie10").append('<option value ="' + dataid + '"  data-id =' + dataid + ' data-cie10 =' + cie10 + '>' + cie10 + " - " + text + '</option>');
                }
            }
        });
        if (item != null) {
            $("#GESCie10").val(item);
            $("#GESCie10").prop('disabled', true);
        } else {
            $("#GESCie10").prop('disabled', false);
        }
    }
    var preCie10ENO = (item = null) => {
        Swal.fire({
            title: "Proporcione acontinuacion los datos para la documentacion ENO",
            text: `Mantenga al paciente en la llamada.`,
            type: "info",
            showConfirmButton: false,
        });
        $("#ENODiagnosticoPrincipal")[0].innerHTML =""
        $("#listaEnfermedad li").each(async function () {
            var cie10 = $(this).attr('data-cie10').trim();
            var dataid = $(this).attr('data-id').trim();
            var text = $(this)[0].innerText.split(/[-–]/).slice(1).map((v) => v.trim()).join("-");
            if ($("#GESCie10").length) {
                if (text.includes("\nENO") || text.includes("\GES")
                ) {
                    text = text.split("\nENO")[0].trim()
                    text = text.split("\nGES")[0].trim()
                    $("#ENODiagnosticoPrincipal").append('<option value ="' + dataid + '"  data-id =' + dataid + ' data-cie10 =' + cie10 + '>' + cie10 + " - " + text + '</option>');
                }
            }
            
        });
        if (item != null) {
            $("#ENODiagnosticoPrincipal").val(item);
            $("#ENODiagnosticoPrincipal").prop('disabled', true);
        } else {
            $("#ENODiagnosticoPrincipal").prop('disabled', false);
        }
    }
    window.preCie10GES = preCie10GES;
    window.preCie10ENO = preCie10ENO;

    async function setParamsIntoSelect(query, grupo) {
        try {
            if ($(query).length) {
                let select = $(query)[0]
                const listParams = await getParametro(grupo);
                let opcion = document.createElement('option');
                listParams.forEach(async param => {
                    opcion = document.createElement('option');
                    opcion.setAttribute('value', param.id);
                    opcion.innerHTML = param.detalle;
                    select.appendChild(opcion);
                });
                return listParams;
            }
        } catch (e) { }
    }

    //if (window.host.includes('positiva.') && codigoPais == "CO")
    //((ViewBag.HostURL.ToString().Contains("positiva.") || ViewBag.HostURL.ToString().Contains("medical.")) && (Model.Atencion.IdCliente == idClientePositiva))
 
    if ((window.host.includes("positiva.") || window.host.includes("medical.")) && (idClienteP == idClientePositiva))
    {
        let divButton = document.createElement('div');
        divButton.style = 'display:flex; justify-content:center; align-items:center; min-width:110px;';
        divButton.innerHTML = '<button id="btn-modal__details" style="background: #FFE5E5; border: 0.59px solid #CE1904; color: #CE1904; height:100%; max-height:32px; font-size:9.36px;"  class="btn">Ver más detalles</button>';
        let header = document.querySelector('#kt_header_menu');
        header.appendChild(divButton);

        $(document).ready(async function () {
            if ($("#AntecedentesSelect").length) {
                $('#AntecedentesSelect').select2({ width: '100%', multiple: true });
                const antecedentesParams = await setParamsIntoSelect("#AntecedentesSelect", "Antecedentes");
                $('#AntecedentesSelect').on('change', function (e) {
                    let data = $('#AntecedentesSelect').select2('data');
                    let container = document.getElementById("antecedentes-descripciones");
                    $("#antecedentes-descripciones").find("textarea").each(function () {
                        let id = $(this).attr("id");
                        if (!data.some(el => el.id === id)) {
                            $(this).parent().remove();
                        }
                    });

                    data.forEach(({ text, id }) => {
                        if (!$("#antecedentes-descripciones").find("textarea").is(`#${id}`)) {
                            let div = document.createElement("div");
                            div.classList.add("form-group");
                            let label = document.createElement("label");
                            label.textContent = "Antecedentes - " + text;
                            label.style.fontWeight = "bold";
                            let span = document.createElement("span");
                            span.classList.add("required");
                            span.textContent = "*";
                            label.appendChild(span);
                            div.appendChild(label);
                            let textarea = document.createElement("textarea");
                            textarea.addEventListener('input', function () {
                                this.style.height = ''; // Resetear la altura
                                this.style.height = this.scrollHeight + 'px'; // Establecer la altura basada en el contenido
                            });
                            textarea.classList.add("form-control");
                            textarea.setAttribute("rows", "3");
                            textarea.setAttribute("name", "antecedentes" + id);
                            textarea.setAttribute("id", id);
                            textarea.setAttribute("value", id);
                            textarea.setAttribute("required", true);
                            div.appendChild(textarea);
                            container.appendChild(div);
                        }
                    });
                });
            }
            if ($("#HipotesisSelect").length) {
                $('#HipotesisSelect').select2({ width: '100%', multiple: true });
                const hipotesisParams = await setParamsIntoSelect("#HipotesisSelect", "HipotesisPreliminar");
                $('#HipotesisSelect').on('change', function (e) {
                    let data = $('#HipotesisSelect').select2('data');
                    let container = document.getElementById("hipotesis-descripciones")
                    $("#hipotesis-descripciones").find("textarea").each(function () {
                        let id = $(this).attr("id");
                        if (!data.some(el => el.id === id)) {
                            $(this).parent().remove();
                        }
                    });
                    data.forEach(({ text, id }) => {
                        if (!$("#hipotesis-descripciones").find("textarea").is(`#${id}`)) {
                            let div = document.createElement("div");
                            div.classList.add("form-group");
                            let label = document.createElement("label");
                            label.textContent = "Hipótesis preliminares - " + text;
                            label.style.fontWeight = "bold";
                            let span = document.createElement("span");
                            span.classList.add("required");
                            span.textContent = "*";
                            label.appendChild(span);
                            div.appendChild(label);
                            let textarea = document.createElement("textarea");
                            textarea.addEventListener('input', function () {
                                this.style.height = ''; // Resetear la altura
                                this.style.height = this.scrollHeight + 'px'; // Establecer la altura basada en el contenido
                            });
                            textarea.classList.add("form-control");
                            textarea.setAttribute("rows", "3");
                            textarea.setAttribute("name", "hipotesis" + id);
                            textarea.setAttribute("id", id);
                            textarea.setAttribute("value", id);
                            textarea.setAttribute("required", true);
                            div.appendChild(textarea);
                            container.appendChild(div);

                        }
                    });
                });
            }
            if ($("#AreaAjusteSelect").length) {
                $('#AreaAjusteSelect').select2({ width: '100%' });
                const areaDeAjusteParams = setParamsIntoSelect("#AreaAjusteSelect", "AreaAjuste");
                $('#AreaAjusteSelect').on('change', function (e) {
                    let data = $('#AreaAjusteSelect').select2('data');
                    let container = document.getElementById("areadeajuste-descripciones")
                    $("#areadeajuste-descripciones").find("textarea").each(function () {
                        let id = $(this).attr("id");
                        if (!data.some(el => el.id === id)) {
                            $(this).parent().remove();
                        }
                    });
                    data.forEach(({ text, id }) => {
                        if (!$("#areadeajuste-descripciones").find("textarea").is(`#${id}`)) {
                            let div = document.createElement("div");
                            div.classList.add("form-group");
                            let label = document.createElement("label");
                            label.textContent = "Área de ajuste - " + text;
                            label.style.fontWeight = "bold";
                            let span = document.createElement("span");
                            span.classList.add("required");
                            span.textContent = "*";
                            label.appendChild(span);
                            div.appendChild(label);
                            let textarea = document.createElement("textarea");
                            textarea.addEventListener('input', function () {
                                this.style.height = ''; // Resetear la altura
                                this.style.height = this.scrollHeight + 'px'; // Establecer la altura basada en el contenido
                            });
                            textarea.classList.add("form-control");
                            textarea.setAttribute("rows", "3");
                            textarea.setAttribute("name", "areadeajuste" + id);
                            textarea.setAttribute("id", id);
                            textarea.setAttribute("value", id);
                            textarea.setAttribute("required", true);
                            div.appendChild(textarea);
                            container.appendChild(div);
                        }
                    });
                });
            }


            $('#btn-modal__details').on('click', function () {
                $('#modalDetallesContainer').modal('show')
            })

            $('#closeDetallesBtn').on('click', function () {
                $('#modalDetallesContainer').modal('hide')
            })

            const form = document.querySelector('#form-modal-detalles')


            const btnDetalles = document.querySelector('#guardarDetallesPaciente')

            btnDetalles.addEventListener('click', async () => {
                const tipoDocumento = document.querySelector('#detalles-tipo-documento').value;
                const nroDocumento = document.querySelector('#detalles-nro-documento').value;
                const ciudad = document.querySelector('#detalles-ciudad-asegurado').value;
                const departamento = document.querySelector('#detalles-departamento-asegurado').value;
                const estadoCivil = document.querySelector('#detalles-estado-civil').value;
                const fNacimiento = document.querySelector('#detalles-fecha-de-nacimiento').value;
                const genero = document.querySelector('#detalles-sexo-masculino').checked ? document.querySelector('#detalles-sexo-masculino').value : document.querySelector('#detalles-sexo-femenino').value
                const direccion = document.querySelector('#detalles-direccion-de-residencia').value;
                const telefonoMovil = document.querySelector('#detalles-celular').value;
                const correo = document.querySelector('#detalles-correo-electronico').value;
                const municipio = document.querySelector('#detalles-municipio').value;
                const eps = document.querySelector('#detalles-eps').value;
                const ocupacion = document.querySelector('#detalles-ocupacion').value;
                
                const formData = new FormData()
                formData.append('TipoDocumento', tipoDocumento)
                formData.append('Documento', nroDocumento)
                formData.append('Ciudad', ciudad)
                formData.append('Comuna', departamento)
                formData.append('EstadoCivil', estadoCivil)
                formData.append('FNacimiento', fNacimiento)
                formData.append('Genero', genero)
                formData.append('Direccion', direccion)
                formData.append('TelefonoMovil', telefonoMovil)
                formData.append('Correo', correo)
                formData.append('Municipio', municipio)
                formData.append('Eps', eps)
                formData.append('Ocupacion', ocupacion)


                if (fNacimiento.trim() === "") {
                    Swal.fire("El campo Fecha de Nacimiento es obligatorio", "", "warning");
                    return;
                }

                if (genero.trim() === "") {
                    Swal.fire("Debes seleccionar una opción en el campo Sexo", "", "warning");
                    return;
                }

                if (tipoDocumento.trim() === "") {
                    Swal.fire("El campo Tipo de documento es obligatorio", "", "warning");
                    return;
                }

                if (nroDocumento.trim() === "") {
                    Swal.fire("El campo Número de documento es obligatorio", "", "warning");
                    return;
                }

                if (direccion.trim() === "") {
                    Swal.fire("El campo Dirección es obligatorio", "", "warning");
                    return;
                }

                if (telefonoMovil.trim() === "") {
                    Swal.fire("El campo Teléfono es obligatorio", "", "warning");
                    return;
                }

                if (estadoCivil.trim() === "") {
                    Swal.fire("El campo Estado Civil es obligatorio", "", "warning");
                    return;
                }

                if (correo.trim() === "") {
                    Swal.fire("El campo Correo Electrónico es obligatorio", "", "warning");
                    return;
                }

                if (municipio.trim() === "") {
                    Swal.fire("El campo Municipio es obligatorio", "", "warning");
                    return;
                }

                if (eps.trim() === "") {
                    Swal.fire("El campo EPS es obligatorio", "", "warning");
                    return;
                }

                try {
                    const result = await EditInfoPerfil(formData, data.atencion.horaMedico.idPaciente)
                } catch (error) {
                    console.error(error, 'ERROR')
                } finally {
                    $('#modalDetallesContainer').modal('hide')
                }
            })

            /*
            form.addEventListener('submit', async (e) => {
                console.log('SUBMIT DEL FORM DETALLES')
                e.preventDefault()

                const tipoDocumento = document.querySelector('#detalles-tipo-documento').value;
                const nroDocumento = document.querySelector('#detalles-nro-documento').value;
                const fullName = document.querySelector('#detalles-nombre-asegurado').value;
                const ciudad = document.querySelector('#detalles-ciudad-asegurado').value;
                const departamento = document.querySelector('#detalles-departamento-asegurado').value;
                const estadoCivil = document.querySelector('#detalles-estado-civil').value;
                const fNacimiento = document.querySelector('#detalles-fecha-de-nacimiento').value;
                const genero = document.querySelector('#detalles-sexo-masculino').checked ? document.querySelector('#detalles-sexo-masculino').value : document.querySelector('#detalles-sexo-femenino').value
                const direccion = document.querySelector('#detalles-direccion-de-residencia').value;
                const telefonoMovil = document.querySelector('#detalles-celular').value;
                const correo = document.querySelector('#detalles-correo-electronico').value;
                const municipio = document.querySelector('#detalles-municipio').value;
                const eps = document.querySelector('#detalles-eps').value;

                const ocupacion = document.querySelector('#detalles-ocupacion').value;
                const edadDetalles = document.querySelector('#detalles-edad').value;
                const empresa = document.querySelector('#detalles-empresa').value

                const formData = new FormData()
                formData.append('TipoDocumento', tipoDocumento)
                formData.append('Documento', nroDocumento)
                formData.append('FullName', fullName)
                formData.append('Ciudad', ciudad)
                formData.append('Comuna', departamento)
                formData.append('EstadoCivil', estadoCivil)
                formData.append('FNacimiento', fNacimiento)
                formData.append('Genero', genero)
                formData.append('Direccion', direccion)
                formData.append('TelefonoMovil', telefonoMovil)
                formData.append('Correo', correo)
                formData.append('Municipio', municipio)
                formData.append('Eps', eps)


                //formData.append('Ocupacion', ocupacion)
                try {
                    const result = await EditInfoPerfil(formData, data.atencion.horaMedico.idPaciente)
                } catch (error) {
                    console.error(error, 'ERROR')
                } finally {
                    $('#modalDetallesContainer').modal('hide')
                }
            })
            */


            
            const {
                tipoDocumento,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                fNacimiento, //FECHA DE NACIMIENTO
                eps,
                empresa,
                municipio
            } = data.fichaPaciente

            const firsLetterMayus = (str) => {
                if (str == undefined || str == '' || str == null) return '';
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            const nombreCompleto = () => {
                const nombreMayus = firsLetterMayus(nombre?.trim());
                const apellidoPaternoMayus = firsLetterMayus(apellidoPaterno?.trim());
                const apellidoMaternoMayus = firsLetterMayus(apellidoMaterno?.trim());

                let resultado = '';

                if (nombreMayus !== '') {
                    resultado += nombreMayus;
                }

                if (apellidoPaternoMayus !== '') {
                    resultado += ' ' + apellidoPaternoMayus;
                }

                if (apellidoMaternoMayus !== '') {
                    resultado += ' ' + apellidoMaternoMayus;
                }

                return resultado;
            }

            const resultadoNombreCompleto = nombreCompleto();


            const getEdad = (fecha) => {
                fecha = fecha.replace(/-/g, '/');
                fecha = fecha.split('/');
                const fechaNacimiento = new Date(fecha[1] + "/" + fecha[0] + "/" + fecha[2]);
                const fechaActual = new Date();
                var anos = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                var meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
                var dias = fechaActual.getDate() - fechaNacimiento.getDate();
                if (meses < 0 || (meses === 0 && dias < 0)) {
                    anos--;
                    edad = anos;
                } else {
                    edad = anos;
                }
                return edad;
            }


            const inputNacimiento = document.getElementById("detalles-fecha-de-nacimiento")
            const inputTipoDocumento = document.getElementById('detalles-tipo-documento')

            const inputEdad = document.querySelector('#detalles-edad')

            inputNacimiento.addEventListener('change', (e) => {
                const fecha = e.target.value
                const edad = getEdad(fecha)
                inputEdad.value=edad
            })

            if (fNacimiento) {
                const fechaFormateada = new Date(fNacimiento).toISOString().split('T')[0];
                inputNacimiento.value = fechaFormateada;
                const edad = getEdad(fechaFormateada)
                inputEdad.value = edad
            }

            if (tipoDocumento) {
                for (let element of inputTipoDocumento?.children) {
                    if (element.value === tipoDocumento) element.selected = true
                }
            }


            if (resultadoNombreCompleto) {
                let input = document.querySelector('#detalles-nombre-asegurado');
                input.value = resultadoNombreCompleto
            }

            if (empresa) {
                let input = document.querySelector('#detalles-empresa');
                input.value = empresa.trim();
            }

            if (municipio) {
                let input = document.querySelector('#detalles-municipio');
                input.value = municipio;
            }

            if (eps) {
                let input = document.querySelector('#detalles-eps');
                input.value = eps;
            }
            

        });




    }

    if (codigoPais == "CO") {
        $(document).ready(async function () {

            const nombre = document.getElementById("nombreCo").value;
            const apellidos = document.getElementById("apellidosCo").value;
            let edad = document.getElementById("edadCo").value;
            const fechaNacimiento = document.getElementById("fechaNacimientoCo").value;
            const sexoF = document.getElementById("sexoF").checked;
            const sexoM = document.getElementById("sexoM").checked;
            const tipoDocumento = document.getElementById("tipoDocumentoCo").value;
            const numeroDocumento = document.getElementById("numeroDocumentoCo").value;
            const direccion = document.getElementById("direccionCo").value;
            const telefono = document.getElementById("telefonoCo").value;
            const ocupacion = document.getElementById("ocupacionCo").value;
            const estadoCivil = document.getElementById("estadoCivilCo").value;
            const escolaridad = document.getElementById("escolaridadCo").value;
            const correoElectronico = document.getElementById("correoElectronicoCo").value;
            const correoAlterno = document.getElementById("correoAlternoCo").value;
            const fechaAtencion = document.getElementById("fechaAtencionCo").value;
            const esMenorEdad = edad.trim() !== "" && parseInt(edad, 10) < 18;

          //si es menor de edad

            if (esMenorEdad && !check.checked) {
                const responsable = document.getElementById("nombreResponsable").value;
                const telefonoResponsable = document.getElementById("telefonoResponsable").value;
                const parentesco = document.getElementById("parentesco").value;
                const fechaAtencion = document.getElementById("fechaAtencionCo").value;
                const acompanante = document.getElementById("nombreAcompanante").value;
                const telefonoAcompanante = document.getElementById("telefonoAcompanante").value;                
            }

            //antecedentes colombia
            const antecedentesPatologicos = document.getElementById("antecedentesPatologicos").value;
            const antecedentesQuirurgicos = document.getElementById("antecedentesQuirurgicos").value;
            const antecedentesGinecoObstetricos = document.getElementById("antecedentesGinecoObstetricos").value;
            const antecedentesToxicosAlergicos = document.getElementById("antecedentesToxicosAlergicos").value;
                               
            const getEdad = (fecha) => {
                fecha = fecha.replace(/-/g, '/');
                fecha = fecha.split('/');
                const fechaNacimiento = new Date(fecha[1] + "/" + fecha[0] + "/" + fecha[2]);
                const fechaActual = new Date();
                var anos = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                var meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
                var dias = fechaActual.getDate() - fechaNacimiento.getDate();
                if (meses < 0 || (meses === 0 && dias < 0)) {
                    anos--;
                    edad = anos;
                } else {
                    edad = anos;
                }
                return edad;
            }

            const inputNacimiento = document.getElementById("fechaNacimientoCo")
            const fecha = inputNacimiento.value
            edad = getEdad(fecha)
            const inputEdad = document.querySelector('#edadCo')
            inputEdad.value = edad

            inputNacimiento.addEventListener('change', (e) => {
                const fecha = e.target.value
                const edad = getEdad(fecha)
                inputEdad.value = edad
            })
       
        });

    }
    if (codigoPais == "CL") {

        if ($("#GESFinanciador").length) {
            setParamsIntoSelect("#GESFinanciador", "GESFinanciadores")
        }
        if ($("#GESPatologia").length) {
            setParamsIntoSelect("#GESPatologia", "GESPatologias")
        }

        if ($("#GESRepresntante").length) { 
            let represntantes = data.encargados;
            $("#GESRepresntante")[0].addEventListener("click", () => {
                let valorseleccionado = $("#GESRepresntante")[0].value;
                if (valorseleccionado != "" && valorseleccionado != "NO_REPRESNTANTE") {
                    if (valorseleccionado != "SI_OTRO") {
                        let representante = represntantes.find((r) => ("" + r.userId) == valorseleccionado)
                        $("#GESRepresentativeFullName").val(representante.nombre.trim() + " " + representante.apellidoPaterno.trim() + " " + representante.apellidoMaterno.trim())
                        $("#GESRepresentativeRut").val(representante.identificador)
                        $("#GESRepresentativeCelular").val(representante.telefonoMovil)
                        $("#GESRepresentativeCorreo").val(representante.correo)
                        $("#GESRepresentanteForm").show();
                    } else {
                        $("#GESRepresentativeFullName").val("");
                        $("#GESRepresentativeRut").val("");
                        $("#GESRepresentativeCelular").val("");
                        $("#GESRepresentativeCorreo").val("");
                        $("#GESRepresentanteForm").show();
                    }
                } else {
                    $("#GESRepresentanteForm").hide();
                }
            })
           
            let r = [];
            if (data.encargados) {
                represntantes.filter((current, index) => {
                    if (r.find((v) => (v == current.id))) {
                        return false;
                    }
                    else {
                        r.push(current.id)
                        return true
                    }
                }).forEach((representante) => {
                    $("#GESRepresntante").append('<option value ="' + representante.userId+ '" >' + representante.nombre.trim() + " " + representante.apellidoPaterno.trim() + " " + representante.apellidoMaterno.trim() + '</option>');
                })
            }
        }
        if ($("#ENORepresntante").length) {
            let represntantes = data.encargados;
            $("#ENORepresntante")[0].addEventListener("click", () => {
                let valorseleccionado = $("#ENORepresntante")[0].value;
                if (valorseleccionado != "" && valorseleccionado != "NO_REPRESNTANTE") {
                    let representante = represntantes.find((r) => ("" + r.userId) == valorseleccionado)
                    $("#ENORepresentativeFullName").val(representante.nombre.trim() + " " + representante.apellidoPaterno.trim() + " " + representante.apellidoMaterno.trim())
                    $("#ENORepresentativeRut").val(representante.identificador)
                    $("#ENORepresentativeCelular").val(representante.telefonoMovil)
                    $("#ENORepresentativeCorreo").val(representante.correo)
                    $("#ENORepresentanteForm").show();
                } else {
                    $("#ENORepresentanteForm").hide();
                }
            })

            let r = [];
            if (data.encargados) {
                represntantes.filter((current, index) => {
                    if (r.find((v) => (v == current.id))) {
                        return false;
                    }
                    else {
                        r.push(current.id)
                        return true
                    }
                }).forEach((representante) => {
                    $("#ENORepresntante").append('<option value ="' + representante.userId + '" >' + representante.nombre.trim() + " " + representante.apellidoPaterno.trim() + " " + representante.apellidoMaterno.trim() + '</option>');
                })
            }
        }

        document.querySelector('#btn_generar_licencia_medica').onclick = async (e) => {
            e.preventDefault();
            e.target.disabled = true;
            let base = $("#divLicenciaMedicaElectronica");
            let LMEFechaInicio = base.find("#LMEFechaInicio")[0].value
            let LMEDuracion = base.find("#LMEDuracion")[0].value
            let LMELicenciaRecuperabilidad = base.find("#LMELicenciaRecuperabilidad")[0].value
            let LMELicenciaInvalidez = base.find("#LMELicenciaInvalidez")[0].value
            let LMETipo = base.find("#LMETipo")[0].value
            let LMESubTipo = base.find("#LMESubTipo")[0].value
            let LMEFechaAccidente = base.find("#LMEFechaAccidente")[0].value
            let LMEHoraAccidente = base.find("#LMEHoraAccidente")[0].value
            let LMETrayecto = base.find("#LMETrayecto")[0].value
            let LMEReposoTipo = base.find("#LMEReposoTipo")[0].value
            let LMEReposoJornada = base.find("#LMEReposoJornada")[0].value

            let LMEReposoLugar = base.find("#LMEReposoLugar")[0].value
            let LMEReposoDomicilioJustificar = (LMEReposoLugar != "3") ? "" : base.find("#LMEReposoDomicilioJustificar")[0].value
            let LMEDomicilioCalle = (LMEReposoLugar != "3") ? "" : base.find("#LMEDomicilioCalle")[0].value
            let LMEDomicilioComuna = (LMEReposoLugar != "3") ? "" : base.find("#LMEDomicilioComuna :selected")[0].value
            let LMETelefonoDomicilio = (LMEReposoLugar != "3") ? "" : base.find("#LMETelefonoDomicilio")[0].value
            //            let LMEOtroReposoLugar = (LMEOtroReposoLugar != "3") ? "" : base.find("#LMEOtroReposoLugar :selected")[0].value

            let LMEOrigenLicencia = base.find("#LMEOrigenLicencia")[0].value;

            let cie10 = $('#LMEDiagnosticoPrincipal :selected').attr("data-cie10");
            let diagnostico = ($('#LMEDiagnosticoPrincipal :selected').length > 0) ? ($('#LMEDiagnosticoPrincipal :selected')[0].innerText.split("-")[1].trim()) : "";

            let validar = () => {
                let list = [];
                return {
                    add: (condicion, name) => {
                        list = list.concat(!condicion ? [] : [name]);
                    },
                    noCumplen: () => { return list },
                    isValid: () => {
                        return list.length == 0
                    }
                }
            }
            let validador = validar()
            validador.add((LMEFechaInicio == ""), "Fecha Inicio");
            validador.add((LMEDuracion == ""), "Fecha Duracion");
            validador.add((LMELicenciaRecuperabilidad == ""), "Licencia Recuperavilidad");
            validador.add((LMELicenciaInvalidez == ""), "LicenciaInvalidez");
            validador.add((LMETipo == ""), "Tipo Licencia");
            validador.add((LMEReposoTipo == ""), "Tipo Reposo");
            validador.add((LMEReposoLugar == ""), "Reposo Lugar");
            if (LMETipo == "3") {
                validador.add((LMESubTipo == ""), "Subtipo LIcencia");
            }
            if (LMEReposoTipo == "2") {
                validador.add((LMEReposoJornada == ""), "Reposo Jornada");
            }
            if (LMEReposoTipo == "5" || LMEOrigenLicencia == "laboral") {
                validador.add((LMEFechaAccidente == ""), "Fecha Accidente");
                validador.add((LMEHoraAccidente == ""), "Hora Accidente");
                validador.add((LMETrayecto == ""), "Trayecto");
                LMEFechaAccidente = LMEFechaAccidente + "T" + LMEHoraAccidente;
            }
            if (LMEReposoLugar == "3") {
                validador.add((LMEReposoDomicilioJustificar == ""), "Reposo Domicilio Justificar");
                validador.add((LMEDomicilioCalle == ""), "Domicilio Calle");
                validador.add((LMEDomicilioComuna == ""), "Domicilio Comuna");
                validador.add((LMETelefonoDomicilio == ""), "Telefono Domicilio Del Lugar Reposo");
            }


            if (!validador.isValid()) {
                Swal.fire({
                    title: "¡Cuidado! <br> Faltan campos por completar...<br>" + validador.noCumplen().map((i) => `<br>${i}`).join(),
                    text: "",
                    type: "error",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
                e.target.disabled = false;
                return;
            }

            Swal.fire({
                title: "Redireccionando a la firma de la licencia medica",
                text: `Asegurese de que el huellero este correctamente conectado.`,
                type: "info",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
            swal.showLoading();

            var response = await generarLME({
                IdAtencion: data.atencion.id,
                IdDoctor: uid,
                IdPaciente: data.atencion.idPaciente,
                ReposoInicio: LMEFechaInicio,
                LicenciaDuracion: "" + LMEDuracion,
                LicenciaRecuperabilidad: "" + LMELicenciaRecuperabilidad,
                TramiteInvalidez: "" + LMELicenciaInvalidez,
                FechaAccidente: LMEFechaAccidente,
                Trayecto: LMETrayecto,
                LicenciaNumeroEmpleadores: "0",
                LicenciaTipo: LMETipo,
                LicenciaSubtipo: LMESubTipo,
                ReposoTipo: LMEReposoTipo,
                ReposoJornada: LMEReposoJornada,
                ReposoLugar: LMEReposoLugar,
                ReposoDomicilioJustificarOtro: LMEReposoDomicilioJustificar,
                ReposoDomicilioCalle: LMEDomicilioCalle,
                ReposoDomicilioComuna: LMEDomicilioComuna,
                ReposoDomicilioFono: LMETelefonoDomicilio,
                //               ReposoDomicilioLugar: LMEOtroReposoLugar,
                DiagnosticoPrincipal: diagnostico,
                DiagnosticoPrincipalCie10: cie10,
                OrigenLicencia: LMEOrigenLicencia

            })
            if (response.urlRedirect == "") {
                Swal.fire({
                    title: "¡Upps! <br> Tenemos dificultades para generar la licencia medica<br>",
                    text: "reintente o avandone la licencia medica",
                    type: "error",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
                e.target.disabled = false;
                return;
            }
            if (response.status != "completed") {
                window.open(response.urlRedirect, '_blank');
                Swal.fire({
                    title: "Validando firmas y obteniendo documento...",
                    text: `Asegurese de que el huellero este correctamente conectado.`,
                    type: "info",
                    showConfirmButton: false,
                });

                var validacion = await validaFirmaLME(data.atencion.id, null);
                Swal.close()
                if (validacion != null) {
                    LMEGenerado = true;
                    next()
                }
            } else {
                LMEGenerado = true;
                next()
            }

        }

        document.querySelector('#LMETipo').onchange = async (e) => {
            let base = $("#divLicenciaMedicaElectronica");
            let LMETipo = e.target.value
            let LMESubTipo = base.find("#LMESubTipo").closest(".form-group")
            if (LMETipo == "3") {
                LMESubTipo.show()
            } else {
                LMESubTipo.hide()
            }
        }

        document.querySelector('#LMEReposoTipo').onchange = async (e) => {
            let base = $("#divLicenciaMedicaElectronica");
            let LMEReposoTipo = e.target.value
            let LMEReposoJornada = base.find("#LMEReposoJornada").closest(".form-group")
            if (LMEReposoTipo == "2") {
                LMEReposoJornada.show()
            } else {
                LMEReposoJornada.hide()
            }

        }

        document.querySelector('#btn_ges').onclick = async (e) => {
            e.preventDefault();
            e.target.disabled = true;
            let base = $("#divGES");
            //ges
            let GESPatologia = base.find("#GESPatologia")[0].value;
            let GESFinanciador = base.find("#GESFinanciador")[0].value;
            let GESStage = base.find("#GESStage")[0].value;
            let idPatologia = base.find("#GESCie10")[0].value;
            // datos paciente
            let comuna = base.find("#GESComunaPaciente")[0].value;
            let ciudad = base.find("#GESCiudadPaciente")[0].value;
            let direccion = base.find("#GESDireccionPaciente")[0].value;
            let celular = base.find("#GESNumeroCelularPaciente")[0].value;
            let correo = base.find("#GESCorreoPaciente")[0].value;

            let socialName = base.find("#GESNombreSocial")[0].value;

            //datos responsable
            let Responsable = (base.find("#GESRepresntante")[0].value == "" || (base.find("#GESRepresntante")[0].value == "NO_REPRESNTANTE")) ? 0 : (base.find("#GESRepresntante")[0].value == "SI_OTRO") ? -1 : base.find("#GESRepresntante")[0].value;
            let fullname = base.find("#GESRepresentativeFullName")[0].value.trim().split(" ");
            Responsable = parseInt(Responsable);
            let NombreRepresentante = fullname.length > 0 ? fullname[0] : "";
            let ApellidoPaternoRepresentante = fullname.length > 1 ? fullname[1] : "";
            let ApellidoMaternoRepresentante = fullname.length > 2 ? fullname[2] : "";
            let IdentificadorRepresentante = base.find("#GESRepresentativeRut")[0].value
            let TelefonoMovilRepresentante = base.find("#GESRepresentativeCelular")[0].value
            let CorreoRepresentante = base.find("#GESRepresentativeCorreo")[0].value
            

            let validar = () => {
                let list = [];
                return {
                    add: (condicion, name) => {
                        list = list.concat(!condicion ? [] : [name]);
                    },
                    noCumplen: () => { return list },
                    isValid: () => {
                        return list.length == 0
                    }
                }
            }
            let validador = validar()
            validador.add((GESPatologia == ""), "Patologia");
            validador.add((GESFinanciador == ""), "Financiador");
            validador.add((GESStage == ""), "Etapa de notificación");

            validador.add((correo == ""), "Correo electronico del paciente");
            validador.add((celular == "" || !RegExp("^[+][0-9]*$").test(celular)), "Numero de celular del paciente");
            validador.add((socialName == ""), "Nombre Social");
            validador.add((comuna == ""), "Comuna paciente");
            validador.add((ciudad == ""), "Ciudad paciente");
            validador.add((direccion == ""), "Direccion paciente");

            validador.add((base.find("#GESRepresntante")[0].value == ""), "Responsable")
            if (Responsable != 0) {
                validador.add((NombreRepresentante == "" ), "Nombre responsable");
                validador.add((ApellidoPaternoRepresentante == ""), "Apellido Paterno responsable");
                //validador.add((ApellidoMaternoRepresentante == ""), "Apellido Materno responsable");
                validador.add((IdentificadorRepresentante == ""), "Rut responsable");
                validador.add((TelefonoMovilRepresentante == "" || !RegExp("^[+][0-9]*$").test(TelefonoMovilRepresentante)), "Celular responsable");
                validador.add((CorreoRepresentante == ""), "Correo responsable");
            } else {
                NombreRepresentante = "";
                ApellidoPaternoRepresentante = "";
                ApellidoMaternoRepresentante = "";
                IdentificadorRepresentante = "";
                TelefonoMovilRepresentante = "";
                CorreoRepresentante = "";
            }

            if (!validador.isValid()) {
                Swal.fire({
                    title: "¡Cuidado! <br> Faltan campos por completar...<br>" + validador.noCumplen().map((i) => `<br>${i}`).join(),
                    text: "",
                    type: "error",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
                e.target.disabled = false;
                return;
            }

            //actualizar datos de usuario
            await fetch(baseUrl + '/usuarios/personas/updatePerfilBody?uid=' + data.atencion.idPaciente, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth
                },
                body: JSON.stringify({
                    Comuna: comuna,
                    Ciudad: ciudad,
                    Direccion: direccion,
                    Telefono: celular,
                    TelefonoMovil: celular,
                    Correo: correo
                })
            })

            data.fichaPaciente.correo = base.find("#GESCorreoPaciente")[0].value;
            data.fichaPaciente.telefonoMovil = base.find("#GESNumeroCelularPaciente")[0].value;
            data.fichaPaciente.comuna = base.find("#GESComunaPaciente")[0].value;
            data.fichaPaciente.ciudad = base.find("#GESCiudadPaciente")[0].value;
            data.fichaPaciente.direccion = base.find("#GESDireccionPaciente")[0].value;

            Swal.fire({
                title: "Redireccionando a la firma del GES",
                text: `Asegurese de que el huellero este correctamente conectado.`,
                type: "info",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
            swal.showLoading();

            var response = await generarGES({
                "IdAtencion": data.atencion.id,
                "IdPaciente": data.atencion.idPaciente,
                "IdResponsable": Responsable,
                "IdMedico": uid,
                "TipoDocumento": "1",
                "Representativo": "0",
                "PrestadorDireccion": "Provicencia",
                "PrestadorDireccionNumero": "1760",
                "PrestadorComuna": "Providencia",
                "codPatologia": idPatologia,
                "Patology": GESPatologia,
                "Financer": GESFinanciador,
                "Stage": GESStage,
                "SocialName": socialName,
                "NombreRepresentante": NombreRepresentante,
                "ApellidoMaternoRepresentante": ApellidoMaternoRepresentante,
                "ApellidoPaternoRepresentante": ApellidoPaternoRepresentante,
                "IdentificadorRepresentante": IdentificadorRepresentante,
                "TelefonoMovilRepresentante": TelefonoMovilRepresentante,
                "CorreoRepresentante": CorreoRepresentante
            })
            if (response == null || response.urlRedirect == null || response.urlRedirect == "" || response.urlRedirect == null || response.urlRedirect == "") {
                Swal.fire({
                    title: "¡Upps! <br> Tenemos dificultades para generar la GES<br>",
                    text: "¿desea finalizar?",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonText: 'Abandonar creacion de GES',

                }).then((result) => {
                });
                e.target.disabled = false;
                
                return;
            }
            if (response.status != "completed") {
                jsPanel("#divReporte")
                $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".pges").html('GES, ESPERANDO FIRMAS...');
                window.open(response.urlRedirect, '_blank');
                Swal.fire({
                    title: "Validando firmas y obteniendo documento...",
                    text: `Asegurese de que el huellero este correctamente conectado.`,
                    type: "info",
                    showConfirmButton: false,
                });
                let validacion = null;
                try {
                    validacion = await validaFirmaGES(data.atencion.id, idPatologia);
                    Swal.close();
                } catch (e) { }
                if (validacion != null && validacion.estadoProceso == "completed") {
                    $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".pges").html('GES, GENERADO');
                    lisGes = { ...lisGes };
                    lisGes[idPatologia] = 1;

                } else {
                    Swal.fire({
                        title: "¡Upps! <br> Tenemos dificultades para validar las firmas del formulario GES<br>",
                        text: "¿desea finalizar?",
                        type: "error",
                        showConfirmButton: true,
                        confirmButtonText: 'Abandonar creacion de GES',

                    }).then((result) => {
                        if (result.isConfirmed) {
                            jsPanel("#divReporte")
                            $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".pges").html('GES, FIRMAS NO VALIDADAS');
                            lisGes = { ...lisGes};
                            lisGes[idPatologia] = 2;

                            cancelarGES(idAtencion, idPatologia, data.atencion.idPaciente, uid, "", "no se logro validar firmas");
                        }
                    });
                }

            } else {
                $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".pges").html('GES, GENERADO');
                lisGes = { ...lisGes}
                lisGes[idPatologia] = 1;

                jsPanel("#divReporte")
            }
        }

        document.querySelector('#btn_cancelar_ges').onclick = async (e) => {
            e.preventDefault();
            GESGenerado = true;
            let idp = $('#divGES').find("#GESCie10")[0].value;
            jsPanel("#divReporte")
            lisGes = { ...lisGes}
            lisGes[idp] = 2;
            $('#listaEnfermedad').find("li[data-id='" + idp + "']").find(".pges").html('GES, CANCELADO');
            cancelarGES(idAtencion, idp, data.atencion.idPaciente, uid, "", "doctor abandono formulario ges");

        }
        document.querySelector('#btn_cancelar_eno').onclick = async (e) => {
            e.preventDefault();
            ENOGenerado = true;
            let idp = $('#divENO').find("#ENODiagnosticoPrincipal")[0].value;
            jsPanel("#divReporte")
            lisEno = { ...lisEno}
            lisEno[idp] = 2;

            $('#listaEnfermedad').find("li[data-id='" + idp + "']").find(".peno").html('ENO, CANCELADO');
            cancelarENO(idAtencion, idp, data.atencion.idPaciente, uid, "", "doctor abandono formulario eno");
        }

        document.querySelector('#btn_eno').onclick = async (e) => {
            e.preventDefault();
            e.target.disabled = true;
            let base = $("#divENO");

            // actualizar datos del usuario

            //eno
            // let ENOSeremi = base.find("#ENOSeremi")[0].value

            let idPatologia = base.find("#ENODiagnosticoPrincipal")[0].value;
            let ENOFechaSintomas = base.find("#ENOFechaSintomas")[0].value
            let ENOVacunacion = base.find("#ENOVacunacion")[0].value
            let ENOEmbarazo = base.find("#ENOEmbarazo")[0].value
            let ENONumeroDocis = base.find("#ENONumeroDocis")[0].value
            let ENOUltimaDocis = base.find("#ENOUltimaDocis")[0].value
            let ENOInfeccion = base.find("#ENOInfeccion :selected")[0].value
            let ENOProfecion = base.find("#ENOProfecion")[0].value
            let ENOProfecionCategoria = base.find("#ENOProfecionCategoria :selected")[0].value
            let ENOProfecionActivo = base.find("#ENOProfecionActivo :selected")[0].value

            //datos paciente
            let comuna = base.find("#ENOComunaPaciente")[0].value;
            let ciudad = base.find("#ENOCiudadPaciente")[0].value;
            let direccion = base.find("#ENODireccionPaciente")[0].value;
            let celular = base.find("#ENONumeroCelularPaciente")[0].value;
            let correo = base.find("#ENOCorreoPaciente")[0].value;
            let fechaNacimiento = base.find("#ENOFechaNacimietno")[0].value;

            //datos responsable
            let Responsable = (base.find("#ENORepresntante")[0].value == "" || (base.find("#ENORepresntante")[0].value == "NO_REPRESNTANTE")) ? 0 : (base.find("#ENORepresntante")[0].value);
            let fullname = base.find("#ENORepresentativeFullName")[0].value.trim().split(" ");
            Responsable = parseInt(Responsable);
            let NombreRepresentante = fullname.length > 0 ? fullname[0] : "";
            let ApellidoPaternoRepresentante = fullname.length > 1 ? fullname[1] : "";
            let ApellidoMaternoRepresentante = fullname.length > 2 ? fullname[2] : "";
            let IdentificadorRepresentante = base.find("#ENORepresentativeRut")[0].value
            let TelefonoMovilRepresentante = base.find("#ENORepresentativeCelular")[0].value
            let CorreoRepresentante = base.find("#ENORepresentativeCorreo")[0].value



            let validar = () => {
                let list = [];
                return {
                    add: (condicion, name) => {
                        list = list.concat(!condicion ? [] : [name]);
                    },
                    noCumplen: () => { return list },
                    isValid: () => {
                        return list.length == 0
                    }
                }
            }
            let validador = validar()
            //validador.add((ENOSeremi == ""), "Seremi");
            validador.add((ENOProfecion == ""), "Profecion");
            validador.add((ENOProfecionActivo == ""), "Condicion de la profecion");
            validador.add((ENOInfeccion == ""), "Pais de contagio");
            validador.add((ENOFechaSintomas == ""), "Fecha Sintomas");
            validador.add((ENOVacunacion == ""), "Vacunacion");
            validador.add((ENOEmbarazo == ""), "Embarazo");
            validador.add((ENOUltimaDocis == ""), "Ultima docis");
            if (ENOVacunacion == "1") {
                validador.add((ENONumeroDocis == ""), "Numero de docis");
                ENONumeroDocis = "0"
            }
            let diagnostico = ($('#ENODiagnosticoPrincipal :selected').length > 0) ?
                ($('#ENODiagnosticoPrincipal :selected')[0].innerText.split("-")[1].trim()) : "";
            validador.add((diagnostico == ""), "Diagnostico Principal");
            let cie10 = $('#ENODiagnosticoPrincipal :selected').attr("data-cie10");

            validador.add((correo == ""), "Correo electronico del paciente");
            validador.add((celular == ""), "Numero de celular del paciente");
            validador.add((comuna == ""), "Comuna paciente");
            validador.add((ciudad == ""), "Ciudad paciente");
            validador.add((direccion == ""), "Direccion paciente");

            validador.add((base.find("#ENORepresntante")[0].value == ""), "Responsable")
            if (Responsable != 0) {
                validador.add((NombreRepresentante == ""), "Nombre responsable");
                validador.add((ApellidoPaternoRepresentante == ""), "Apellido responsable");
                validador.add((IdentificadorRepresentante == ""), "Rut responsable");
                validador.add((TelefonoMovilRepresentante == ""), "Celular responsable");
                validador.add((CorreoRepresentante == ""), "Correo responsable");
            } else {
                NombreRepresentante = "";
                ApellidoPaternoRepresentante = "";
                ApellidoMaternoRepresentante = "";
                IdentificadorRepresentante = "";
                TelefonoMovilRepresentante = "";
                CorreoRepresentante = "";
            }
            if (!validador.isValid()) {
                Swal.fire({
                    title: "¡Cuidado! <br> Faltan campos por completar...<br>" + validador.noCumplen().map((i) => `<br>${i}`).join(),
                    text: "",
                    type: "error",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,

                });
                e.target.disabled = false;
                return;
            }
            await fetch(baseUrl + '/usuarios/personas/updatePerfilBody?uid=' + data.atencion.idPaciente, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth
                },
                body: JSON.stringify({
                    Comuna: comuna,
                    Ciudad: ciudad,
                    Direccion: direccion,
                    Telefono: celular,
                    TelefonoMovil: celular,
                    Correo: correo,
                    FNacimiento: fechaNacimiento
                })
            })

            data.fichaPaciente.correo = base.find("#ENOCorreoPaciente")[0].value;
            data.fichaPaciente.telefonoMovil = base.find("#ENONumeroCelularPaciente")[0].value;
            data.fichaPaciente.comuna = base.find("#ENOComunaPaciente")[0].value;
            data.fichaPaciente.ciudad = base.find("#ENOCiudadPaciente")[0].value;
            data.fichaPaciente.direccion = base.find("#ENODireccionPaciente")[0].value;

            Swal.fire({
                title: "Redireccionando a la firma del ENO",
                text: `Asegurese de que el huellero este correctamente conectado.`,
                type: "info",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,

            });
            swal.showLoading();

            var response = await generarENO({
                "IdAtencion": data.atencion.id,
                "IdPaciente": data.atencion.idPaciente,
                "IdResponsable": Responsable,
                "IdMedico": uid,
                "TipoDocumento": "2",
                "MedicalRecord": "Sin Historial",
                "codPatologia": idPatologia,
                "Diagnostic": diagnostico,
                "DiagnosticCode": cie10,
                "Infection": ENOInfeccion,
                "Profession": ENOProfecion,
                "ProfessionCategory": ENOProfecionCategoria,
                "ProfessionCode": "1",
                "Condition": ENOProfecionActivo,
                "SymptomDate": ENOFechaSintomas,
                "Vaccination": ENOVacunacion,
                "Pregnancy": ENOEmbarazo,
                "DoseNumber": ENONumeroDocis,
                "DoseDate": ENOUltimaDocis,
                "NombreRepresentante": NombreRepresentante,
                "ApellidoMaternoRepresentante": ApellidoMaternoRepresentante,
                "ApellidoPaternoRepresentante": ApellidoPaternoRepresentante,
                "IdentificadorRepresentante": IdentificadorRepresentante,
                "TelefonoMovilRepresentante": TelefonoMovilRepresentante,
                "CorreoRepresentante": CorreoRepresentante
            })
            if (response == null || response.status == "error" || response.urlRedirect == null || response.urlRedirect == "") {
                Swal.fire({
                    title: "¡Upps! <br> Tenemos dificultades para generar el ENO <br>",
                    text: "¿desea finalizar?",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonText: 'Abandonar creacion de ENO',

                }).then((result) => {
                });
                e.target.disabled = false;
                
                return;
            }
            if (response.status != "completed") {
                jsPanel("#divReporte");
                $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".peno").html('ENO, ESPERANDO FIRMAS...');
                window.open(response.urlRedirect, '_blank');
                Swal.fire({
                    title: "Validando firmas y obteniendo documento...",
                    text: `Asegurese de que el huellero este correctamente conectado.`,
                    type: "info",
                    showConfirmButton: false,
                });
                var validacion = null;
                try {
                    validacion = await validaFirmaENO(data.atencion.id, idPatologia);
                    Swal.close();
                } catch (e) {}
                if (validacion != null && validacion.estadoProceso == "completed") {
                    $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".peno").html('ENO, GENERADO');
                    lisEno = { ...lisEno}
                    lisEno[idPatologia] = 1;

                } else {
                    Swal.fire({
                        title: "¡Upps! <br> Tenemos dificultades para validar las firmas del formulario GES<br>",
                        text: "¿desea finalizar?",
                        type: "error",
                        showConfirmButton: true,
                        confirmButtonText: 'Abandonar creacion de ENO',

                    }).then((result) => {
                        if (result.isConfirmed) {
                            jsPanel("#divReporte")
                            $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".peno").html('ENO, FIRMAS NO VALIDADAS');
                            lisEno = { ...lisEno }
                            liEno[idPatologia] = 2;
                            cancelarENO(idAtencion, idPatologia, data.atencion.idPaciente, uid, "", "no se logro validar firmas");
                        }
                    });
                }
            } else {
                $('#listaEnfermedad').find("li[data-id='" + idPatologia + "']").find(".peno").html('ENO, GENERADO');
                lisEno = { ...lisEno}
                lisEno[idPatologia] = 1;
                jsPanel("#divReporte")
            }
        }

        document.querySelector('#LMEReposoLugar').onchange = async (e) => {
            let base = $("#divLicenciaMedicaElectronica");
            let LMEReposoLugar = e.target.value
            let LMEOtroDomicilio = base.find("#LMEOtroDomicilio")
            if (LMEReposoLugar == "3") {
                LMEOtroDomicilio.show()
            } else {
                LMEOtroDomicilio.hide()
            }

        }

        document.querySelector('#LMEDiagnosticoPrincipal').onclick = preFunDiagnosticoPrincipal('#LMEDiagnosticoPrincipal');
        //document.querySelector('#ENODiagnosticoPrincipal').onclick = preFunDiagnosticoPrincipal('#ENODiagnosticoPrincipal');
    }
    var validaFirmaLME = (aten, callBackValidation) => {
        let atencion = aten;
        return new Promise((resolve) => {
            var consultarEstado = async () => {
                let datas = null;
                try {
                    datas = await consultarEstadoLME(atencion);
                    if (callBackValidation != null && (await callBackValidation())) {
                        resolve(datas)
                    }
                } catch (e) {
                    resolve(datas)
                }
                if (datas != null && datas.estadoProceso == "process") {
                    setTimeout(async () => {
                        await consultarEstado();
                    }, 3000);
                } else {
                    resolve(datas)
                }
            }
            consultarEstado();
        }).then(function (result) {
            return result;
        });
    }

    var validaFirmaGES = (aten, patologia) => {
        let atencion = aten;
        let idpatologia = patologia;
        return new Promise((resolve,reject) => {
            var consultarEstado = async () => {
                let datas = null;
                try {
                    datas = await consultarGES(atencion, idpatologia);
                } catch (e) {
                    reject(datas)
                }
                if (datas != null && datas.estadoProceso == "process") {
                    setTimeout(async () => {
                        await consultarEstado();
                    }, 3000);
                } else if (datas != null) {
                    resolve(datas)
                } else {
                    reject(datas)
                }
            }
            consultarEstado();
        }).then(function (result) {
            return result;
        });
    }
    var validaFirmaENO = (aten, patologia) => {
        let atencion = aten;
        let idpatologia = patologia;
        return new Promise((resolve) => {
            var consultarEstado = async () => {
                let datas = null;
                try {
                    datas = await consultarENO(atencion, idpatologia);
                } catch (e) {
                    resolve(datas)
                }
                if (datas != null && datas.estadoProceso == "process") {
                    setTimeout(async () => {
                        await consultarEstado();
                    }, 4000);
                } else if (datas != null) {
                    resolve(datas)
                } else {
                    reject(datas)
                }
            }
            consultarEstado();
        }).then(function (result) {
            return result;
        });
    }
    var setDataLME = async () => {
        try {
            let dataFormularioLME = await consultarDataFormulario(data.atencion.id, "imed_LME");
            if (dataFormularioLME == null)
                return
            let base = $("#divLicenciaMedicaElectronica");
            base.find("#LMEFechaInicio")[0].value = dataFormularioLME.ReposoInicio
            base.find("#LMEDuracion")[0].value = dataFormularioLME.LicenciaDuracion
            base.find("#LMELicenciaRecuperabilidad")[0].value = dataFormularioLME.LicenciaRecuperabilidad
            base.find("#LMELicenciaInvalidez")[0].value = dataFormularioLME.TramiteInvalidez
            base.find("#LMETipo")[0].value = dataFormularioLME.LicenciaTipo
            base.find("#LMESubTipo")[0].value = dataFormularioLME.LicenciaSubtipo
            base.find("#LMEFechaAccidente")[0].value = dataFormularioLME.FechaAccidente
            base.find("#LMETrayecto")[0].value = dataFormularioLME.Trayecto
            base.find("#LMEReposoTipo")[0].value = dataFormularioLME.ReposoTipo
            base.find("#LMEReposoJornada")[0].value = dataFormularioLME.ReposoJornada
            base.find("#LMEReposoLugar")[0].value = dataFormularioLME.ReposoLugar
            base.find("#LMEOrigenLicencia")[0].value = dataFormularioLME.OrigenLicencia
            //falta cie10 setear
        } catch (e) {

        }
    }
    var setDataGES = async () => {
        try {
            let dataFormularioGES = await consultarDataFormulario(data.atencion.id, "imed_GES");
            let base = $("#divGES");
            base.find("#GESNumeroCelularPaciente")[0].value = data.fichaPaciente.telefonoMovil
            //falta cie10 setear
        } catch (e) {

        }
    }
    var setDataENO = async () => {
        try {
            let dataFormularioENO = await consultarDataFormulario(data.atencion.id, "imed_ENO");
            let base = $("#divENO");
            base.find("#ENONumeroCelularPaciente")[0].value = data.fichaPaciente.telefonoMovil
            //falta cie10 setear
        } catch (e) {

        }
    }

    if ($("#divLicenciaMedicaElectronica").length) {
        setDataLME();
    }
    function validaGes() {
        return new Promise((resolve) => {
            let notificaGes = false;
            $("#listaEnfermedad li").map(async function () {
                var cie10 = $(this).attr('data-cie10').trim();
                var validaGes = await validaPatologiaGes(cie10);
                if (validaGes.status == 'OK') {
                    notificaGes = true;
                }
            });

            setTimeout(() => {
                resolve(notificaGes);
            }, 2500
            );

        }).then(function (result) {
            return result;
        });

    }

    function validaEno() {
        return new Promise((resolve) => {
            let notificaEno = false;
            $("#listaEnfermedad li").each(async function () {
                var cie10 = $(this).attr('data-cie10').trim();
                var validaEno = await validaPatologiaEno(cie10);
                if (validaEno.status == 'OK') {
                    notificaEno = true;
                }
            });
            setTimeout(() => {
                resolve(notificaEno);
            }, 2500
            );
        }).then(function (result) {
            return result;

        });

    }

    function validaEnoyGes() {
        return new Promise((resolve) => {
            let notificaGesyEno = false;
            let notificaGes = false;
            let notificaEno = false;
            $("#listaEnfermedad li").map(async function () {
                var cie10 = $(this).attr('data-cie10');
                var validaEno = await validaPatologiaEno(cie10);
                if (validaEno.status == 'OK') {
                    notificaEno = true;
                }
                var validaGes = await validaPatologiaGes(cie10);
                if (validaGes.status == 'OK') {
                    notificaGes = true;
                }
                if (notificaEno == true && notificaGes == true) {
                    notificaGesyEno = true;
                }
                resolve(notificaGesyEno);
            });
        });

    }

    if ($("#btnGuardarMedicamento").length > 0) {
        const btnGuardarMedicamento = document.getElementById("btnGuardarMedicamento");
        btnGuardarMedicamento.onclick = async () => {
            let inputMedicamento = document.getElementById("input_codigoMedicamento");
            var idMed = parseInt(inputMedicamento.getAttribute('data-id'));
            let posologia = document.getElementById("posologia");
            if (inputMedicamento.value === "") {
                Swal.fire("", "Debe ingresar medicamento", "warning");
                return;
            }

            if (codigoPais === "CL") {
                let existMedicamento = await getMedicamentosBD(inputMedicamento.value, codigoPais);


                if (existMedicamento.length === 0) {
                    saveM = await saveMedicamento(searchMedicamento)
                    saveM = saveM.medicamento;
                } else {
                    saveM = existMedicamento[0];
                }
                idMed = saveM.medicamentoId !== undefined ? saveM.medicamentoId : saveM.id;
                auxArray.push({
                    product_id: saveM.product_id,
                    id: saveM.id,
                    description: saveM.product_name
                })
                //products
                postGetLink.data.products.push({
                    id: saveM.product_id,
                    description: saveM.product_name,
                    quantity: 1
                })

                //sendPostLink = await postGL(postGetLink, tokenData); se hará la generacion del link en finalizar atencion
            //} else if (codigoPais === "MX") {

            //    let atencionMedicamentoMedikit = {
            //        idAtencion: parseInt(idAtencion),
            //        idMedicamento: idMed,
            //        idUsuarioCreacion: parseInt(uid),
            //        posologia: posologia.value,
            //        isComercial: isComercial
            //    }

            //    let existMedicamento = await getMedicamentosBD(inputMedicamento.value, codigoPais);
            //    if (existMedicamento.length === 0) {
            //        medikitMedicamento === inputMedicamento.value;
            //        saveM = await insertAtencionMedicamentos(atencionMedicamentoMedikit)
            //        saveM = saveM.medicamento;
            //    } else {
            //        saveM = existMedicamento[0];
            //    }
            //    idMed = saveM.medicamentoId !== undefined ? saveM.medicamentoId : saveM.id;

            //    auxArray.push({
            //        product_id: saveM.product_id,
            //        //id: saveM.id,
            //        description: saveM.product_name
            //    })
            //    //products
            //    postGetLinkFarmalisto.products.push({
            //        qty: 1,
            //        reference: saveM.product_id,
            //    })
            } else if (codigoPais == "CO") {
                let existMedicamento = await getMedicamentosBD(inputMedicamento.value, codigoPais);
                if (existMedicamento.length === 0) {
                    saveM = await saveMedicamento(farmalistoMedicamento)
                    saveM = saveM.medicamento;
                } else {
                    saveM = existMedicamento[0];
                }
                idMed = saveM.medicamentoId !== undefined ? saveM.medicamentoId : saveM.id;

                auxArray.push({
                    product_id: saveM.product_id,
                    //id: saveM.id,
                    description: saveM.product_name
                })
                //products
                postGetLinkFarmalisto.products.push({
                    qty: 1,
                    reference: saveM.product_id,
                })
            }

            var isComercial = 0;
            if (checkComercial) if (checkComercial.checked) isComercial = 1;


            let atencionMedicamento = {
                idAtencion: parseInt(idAtencion),
                idMedicamento: idMed,
                idUsuarioCreacion: parseInt(uid),
                posologia: posologia.value,
                isComercial: isComercial
            }
            var resultInsert = await insertAtencionMedicamentos(atencionMedicamento);
            if (resultInsert.status === "OK") {
                const list = $("#listaMedicamentos");
                list.append('<li data-id =' + resultInsert.atencionMedicamentos.id + '>' + $("#input_codigoMedicamento").val() + ' | ' + posologia.value + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
                posologia.value = "";
                inputMedicamento.value = "";
                $('#input_codigoMedicamento').typeahead('val', '');
            }
            else {
                Swal.fire("", resultInsert.msg, "warning");
            }

        }
    }
    $('#form_edit_am').validate({
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

            let medicamentos = document.getElementById("Medicamentos").value
            let habitos = document.getElementById("Habitos").value
            let enfermedades = document.getElementById("Enfermedades").value
            let alergias = document.getElementById("Alergias").value
            let cirugias = document.getElementById("Cirugias").value
            $('#btn_guardar_am').prepend('<span class="spinner-border spinner-border-sm m-r-10" role="status" aria-hidden="true"></span>').attr('disabled', 1);

            let formAnt = {
                Medicamentos: medicamentos,
                Habitos: habitos,
                Enfermedades: enfermedades,
                Alergias: alergias,
                Cirugias: cirugias,
                Id: data.atencion.idPaciente
            }
            let result = await EditAntecedentesMedicos(formAnt, uid);
            $('#btn_guardar_am').removeAttr('disabled').children('.spinner-border').remove();
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

    //derivar otra especialidad
    if ($("#btnDerivar").length) {
        document.getElementById('btnDerivar').onclick = async () => {
            let derivar = {
                IdPaciente: data.atencion.idPaciente,
                IdConvenio: data.atencion.horaMedico.idConvenio,
                IdEspecialidadOrigen: data.atencion.horaMedico.idEspecialidad,
                IdEspecialidadDestino: data.atencion.idEspecialidadDestino,
                IdMedico: data.atencion.horaMedico.idMedico,
            }

            var pacienteDeriva = await derivaEspecialidad(derivar);
            if (pacienteDeriva.status == "OK") {
                Swal.fire("", "Se derivó al paciente", "success");
                document.getElementById("infoDeriva").innerHTML = `Paciente derivado`;
                document.getElementById("btnDerivar").setAttribute("class", "d-none");
            } else {
                Swal.fire("", "No se derivó al paciente", "error")
            }
        };
    }
    
    

    var bloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + `/agendamientos/Patologias/getPatologias/%QUERY`,
            wildcard: '%QUERY'
        }
    });

    var bloodhoundCo = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + `/agendamientos/Patologias/getPatologiasLimit/%QUERY/15000`,
            wildcard: '%QUERY'
        }
    })

    var bloodhound2 = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + `/apimedicalsearchengine/SearchEngine/GetDiagnostico?text=%QUERY`,
            wildcard: '%QUERY'
        }
    });

    if (codigoPais === "CO") {

        $('#input_codigo').typeahead({
            minLength: 3
        }, {
            name: 'codigos',
            source: bloodhoundCo,
            limit: 20,
            display: function (item) {
                return item.codigo + ' – ' + item.nombre.toUpperCase().trim();
            }
        }).bind("typeahead:selected", async function (obj, datum, name) {
            let atencionPatologiaInsertar = {
                Codigo: datum.codigo,
                Nombre: datum.nombre,
                Estado: 'V',
                Id: datum.id,
                Cie10: datum.cie10
            }

            var verificarPatologia = await insertPatologias(atencionPatologiaInsertar);
            let atencionPatologia = {
                idAtencion: parseInt(idAtencion),
                idPatologia: (verificarPatologia.status === "OK") ? parseInt(verificarPatologia.patologiaExiste.id) : 0,
                cie10: atencionPatologiaInsertar.Cie10
            }

            var resultInsert = await insertAtencionesPatologias(atencionPatologia);
            if (resultInsert.status === "OK" && verificarPatologia.status === "OK") {
                var Cie10 = atencionPatologiaInsertar.Cie10;
                const list = $("#listaEnfermedad");
                let divGes = "";
                let divEno = "";
                let listype = "";
                try {
                    divGes = (await validaPatologiaGes(Cie10)).status == 'OK' ? '<div class="pges" style="border: solid 1px #329ab6; border-radius: 8px;width: fit-content; padding: 0px 4px;" >GES</div>' : "";
                    listype += divGes ? "GES" : "";
                } catch (e) { }
                try {
                    divEno = (await validaPatologiaEno(Cie10)).status == 'OK' ? '<div class="peno" style="border: solid 1px #329ab6; border-radius: 8px; width: fit-content; padding: 0px 4px;" >ENO</div>' : "";
                    listype += divGes ? "," : "";
                    listype += divEno ? "ENO" : "";

                } catch (e) { }
                list.append('<li data-id =' + resultInsert.atencionesPatologias.id + ' data-type="' + listype +'" data-cie10 =' + Cie10 + ' style=" display: flex;align-content: center;justify-content: space-between;align-items: center;" >' + $("#input_codigo").val() + ' &nbsp;<div>' + divGes + divEno + '</div><a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
                $('#input_codigo').typeahead('val', '');
            }

            //list.append('<li data-id =' + datum.id + '>' + $("#input_codigo").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');

        });


    } else {

        $('#input_codigo').typeahead({
            minLength: 3
        }, {
            name: 'codigos',
            source: bloodhound2,
            limit: 20,
            display: function (item) {
                return item.cie10 + ' – ' + item.term.charAt(0).toUpperCase() + item.term.slice(1);;
            }
        }).bind("typeahead:selected", async function (obj, datum, name) {
            let atencionPatologiaInsertar = {
                Codigo: datum.code,
                Nombre: datum.term,
                Estado: 'V',
                Id: 0,
                Cie10: datum.cie10
            }

            var verificarPatologia = await insertPatologias(atencionPatologiaInsertar);
            let atencionPatologia = {
                idAtencion: parseInt(idAtencion),
                idPatologia: (verificarPatologia.status === "OK") ? parseInt(verificarPatologia.patologiaExiste.id) : 0,
                cie10: atencionPatologiaInsertar.Cie10
            }

            var resultInsert = await insertAtencionesPatologias(atencionPatologia);
            if (resultInsert.status === "OK" && verificarPatologia.status === "OK") {
                var Cie10 = atencionPatologiaInsertar.Cie10;
                const list = $("#listaEnfermedad");
                let divGes = "";
                let divEno = "";
                let tipo = [];
                try {
                    divGes = (await validaPatologiaGes(Cie10)).status == 'OK' ? '<div class="sid-tipo-patologia pges" style="border: solid 1px #329ab6; border-radius: 8px;width: fit-content; padding: 0px 4px;" >GES</div>' : "";
                    if (divGes != "") {
                        tipo.push("GES");
                    }
                } catch (e) { }
                try {
                    divEno = ((await validaPatologiaEno(Cie10)).status == 'OK' )? '<div class="sid-tipo-patologia peno" style="border: solid 1px #329ab6; border-radius: 8px; width: fit-content; padding: 0px 4px;" >ENO</div>' : "";
                    if (divEno != "") {
                        tipo.push("ENO");
                    }
                } catch (e) { }

                list.append('<li data-id =' + resultInsert.atencionesPatologias.id + ' data-siGes="" data-siEno="" data-cie10 =' + Cie10 + ' data-type="' + tipo.join(",") + '" style=" display: flex;align-content: center;justify-content: space-between;align-items: center;" data-text ="' + $("#input_codigo").val() + '" >' + $("#input_codigo").val() + ' &nbsp;<div>' + divGes + divEno + '</div><a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
                $('#input_codigo').typeahead('val', '');
                if (codigoPais == "CL") {
                    if (divGes != "") {
                        console.log("levantando panel", $("#modalNotificaEnoyGesSolicitud"));
                        $("#modalNotificaEnoyGesSolicitudText")[0].innerText = "La patología seleccionada corresponde a una notificación GES. ¿Desea notificar ?";
                        $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-idp", resultInsert.atencionesPatologias.id);
                        $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-type", "ges");
                        $("#modalNotificaEnoyGesSolicitud").modal("show");
                        
                    } else if (divEno != "" && false) {
                        console.log("levantando panel", $("#modalNotificaEnoyGesSolicitud"));
                        $("#modalNotificaEnoyGesSolicitudText")[0].innerText = "La patología seleccionada corresponde a una notificación ENO. ¿desea notificar ?";
                        $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-idp", resultInsert.atencionesPatologias.id);
                        $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-type", "eno");
                        $("#modalNotificaEnoyGesSolicitud").modal("show");
                    }
                }
            }

            //list.append('<li data-id =' + datum.id + '>' + $("#input_codigo").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');

        });


    }

    let accionarSolicitudNotificacion = async () => {
        let type = $("#modalNotificaEnoyGesSolicitud")[0].getAttribute("data-type");
        if (type == "ges") {
            await solicitudNotificacionGes();
        } else if(type == "eno"){
            await solicitudNotificacionEno();
        }
    }
    let accionarCancelarNotificacion = async () => {
        let type = $("#modalNotificaEnoyGesSolicitud")[0].getAttribute("data-type");
        if (type == "ges") {
            await cancelarNotificacionGes();
        } else if (type == "eno") {
            await cancelarNotificacionEno();
        }
    }

    let solicitudNotificacionGes = async () => {
        let idp = $("#modalNotificaEnoyGesSolicitud")[0].getAttribute("data-idp");
        $('#listaEnfermedad').find("li[data-id='" + idp + "']").find(".pges").html('GES, NOTIFICADO');
        $('#listaEnfermedad').find("li[data-id='" + idp + "']")[0].setAttribute("data-siGes","true");
        let texto = $("#listaEnfermedad").find("li[data-id='" + idp + "']")[0].getAttribute("data-text")
        sendNotificacionGES(idAtencion, texto);
        $("#modalNotificaEnoyGesSolicitud").modal("hide");
        //agregar
        lisGes = { ...lisGes}
        lisGes[idp] = 0;

        preCie10GES(idp);
        jsPanel("#divGES");
        //set
        let base = $("#divGES");
        base.find("#GESCorreoPaciente")[0].value = data.fichaPaciente.correo;
        base.find("#GESNumeroCelularPaciente")[0].value = data.fichaPaciente.telefonoMovil;
        base.find("#GESComunaPaciente")[0].value = data.fichaPaciente.comuna;
        base.find("#GESCiudadPaciente")[0].value = data.fichaPaciente.ciudad;
        base.find("#GESDireccionPaciente")[0].value = data.fichaPaciente.direccion;

        base.find("#GESPatologia").val("");
        base.find("#GESFinanciador").val("");
        base.find("#GESStage").val("");
        $("#btn_ges").attr("disabled", false);
    }

    let cancelarNotificacionGes = async () => {
        let idp = $("#modalNotificaEnoyGesSolicitud")[0].getAttribute("data-idp");
        lisGes = { ...lisGes}
        lisGes[idp] = -1;
        $('#listaEnfermedad').find("li[data-id='" + idp + "']").find(".pges").html('GES, NO NOTIFICADO');
        $('#listaEnfermedad').find("li[data-id='" + idp + "']")[0].setAttribute("data-siGes", "false");
        $("#modalNotificaEnoyGesSolicitud").modal("hide");
        Swal.fire({
            title: "",
            html: `<p>selecciona un motivo de rechazo</p>
                <div class="form-group">
                  <label class="form-label" style="font-weight:bold">Responsable:</label>
                    <select id="SWALmotivoRechaza" name="GESRepresentante" class="form-control">
                        <option value="Ya esta notificado">Ya está notificado</option>
                        <option value="Rechaza notificacion">Rechaza notificación</option>
                        <option value="No cumple los criterios">No cumple los criterios</option>
                    </select>
                </div> `,
            type: "warning",
            showCancelButton: false,
            showConfirmButton: false,
            reverseButtons: true,
            onOpen: function () {
                $('#SWALmotivoRechaza')[0].addEventListener('change', ()=> {
                    let motivo = $('#SWALmotivoRechaza').val();
                    cancelarGES(idAtencion, idp, data.atencion.idPaciente, uid, "no_notificado", motivo);
                    Swal.close()
                });
            }
        });
    }
    let solicitudNotificacionEno = async () => {
        let idp = $("#modalNotificaEnoyGesSolicitud")[0].getAttribute("data-idp");
        $('#listaEnfermedad').find("li[data-id='" + idp + "']").find(".peno").html('ENO, NOTIFICADO');
        $('#listaEnfermedad').find("li[data-id='" + idp + "']")[0].setAttribute("data-siEno", "true");//acepta notificar
        let texto = $("#listaEnfermedad").find("li[data-id='" + idp + "']")[0].getAttribute("data-text")
        sendNotificacionENO(idAtencion, texto);
        $("#modalNotificaEnoyGesSolicitud").modal("hide");
        //agregar
        lisEno = { ...lisEno}//acepta
        lisEno[idp] = 0
        preCie10ENO(idp);
        jsPanel("#divENO");
        let base = $("#divENO");
        base.find("#ENOCorreoPaciente")[0].value = data.fichaPaciente.correo;
        base.find("#ENOFechaNacimietno").val((data.fichaPaciente.fNacimiento != null && data.fichaPaciente.fNacimiento != undefined && data.fichaPaciente.fNacimiento != "") ? data.fichaPaciente.fNacimiento.split("T")[0] : "")
        base.find("#ENONumeroCelularPaciente")[0].value = data.fichaPaciente.telefonoMovil;
        base.find("#ENOComunaPaciente")[0].value = data.fichaPaciente.comuna;
        base.find("#ENOCiudadPaciente")[0].value = data.fichaPaciente.ciudad;
        base.find("#ENODireccionPaciente")[0].value = data.fichaPaciente.direccion;
        //reset eno form

        $("#btn_eno").attr("disabled", false);
    }

    let cancelarNotificacionEno = async () => {
        let idp = $("#modalNotificaEnoyGesSolicitud")[0].getAttribute("data-idp");
        lisEno = { ...lisEno}
        lisEno[idp] = -1;

        $('#listaEnfermedad').find("li[data-id='" + idp + "']").find(".peno").html('ENO, NO NOTIFICADO');
        $('#listaEnfermedad').find("li[data-id='" + idp + "']")[0].setAttribute("data-siEno", "false");
        $("#modalNotificaEnoyGesSolicitud").modal("hide");
        let text = $("#listaEnfermedad").find("li[data-id='" + $(this)[0].dataset.id + "']")[0].getAttribute("data-type");
        let additional = "";
        Swal.fire({
            title: "",
            html: `
                <div class="form-group">
                  <label class="form-label" style="font-weight:bold">selecciona un motivo de rechazo</label>
                    <select id="SWALmotivoRechaza" name="GESRepresentante" class="form-control">
                        <option value="Ya esta notificado">Ya está notificado</option>
                        <option value="Rechaza notificacion">Rechaza notificación</option>
                        <option value="No cumple los criterios">No cumple los criterios</option>
                    </select>
                </div> `,
            type: "warning",
            showCancelButton: false,
            showConfirmButton: false,
            reverseButtons: true,
            onOpen: function () {
                $('#SWALmotivoRechaza')[0].addEventListener('change', () => {
                    let motivo = $('#SWALmotivoRechaza').val();
                    cancelarENO(idAtencion, idp, data.atencion.idPaciente, uid, "no_notificado", motivo);
                    Swal.close();
                });
            }
        });
    }

    if (codigoPais == "CL") {
        $("#modalNotificaEnoyGesSolicitud").find(".id-btn-ok")[0].addEventListener("click", accionarSolicitudNotificacion);
        $("#modalNotificaEnoyGesSolicitud").find(".id-btn-no")[0].addEventListener("click", accionarCancelarNotificacion);
    }

    var bloodhoundExamenes = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + `/agendamientos/Examenes/getExamenes/%QUERY/${codigoPais}`,
            wildcard: '%QUERY'
        }
    });

    $('#input_codigoExamen').typeahead({
        minLength: 3
    }, {
        name: 'codigos',
        source: bloodhoundExamenes,
        limit: 20,
        display: function (item) {
            return item.codigo + '–' + item.nombre;
        }
    }).bind("typeahead:selected", async function (obj, datum, name) {
        let atencionExamen = {
            idAtencion: parseInt(idAtencion),
            idExamen: parseInt(datum.id),
        }
        var resultInsert = await insertAtencionesExamenes(atencionExamen);
        if (resultInsert.status === "OK") {
            const list = $("#listaTipoExamen");
            list.append('<li data-id =' + resultInsert.atencionesExamenes.id + '>' + $("#input_codigoExamen").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
            $('#input_codigoExamen').typeahead('val', '');
        }
    });

    var bloodhoundEspecialidades = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseUrl + `/agendamientos/especialidades/getEspecialidadesByTextAndRut`,
            prepare: function (query, settings) {
                settings.url = settings.url + '?text=' + query + "&rut=" + data.fichaPaciente.identificador
                return settings;
            }
        }
    });

    $('#input_codigo_especialidad').typeahead({
        minLength: 3
    }, {
        name: 'codigos',
        source: bloodhoundEspecialidades,
        limit: 20,
        display: function (item) {
            return item.nombre;
        }
    }).bind("typeahead:selected", async function (obj, datum, name) {
        //PARA CARGAR LA ESPECIALIDAD
        /*let atencionExamen = {
            idAtencion: parseInt(idAtencion),
            idExamen: parseInt(datum.id),
        }*/
        var resultInsert = await insertEspecialidadDerivacionAtencion(parseInt(idAtencion), parseInt(datum.id));

<<<<<<< Updated upstream
        resultInsert.status = "OK";
        if (resultInsert.status === "OK" && $('#listaEspecialidades li').length < 1) {
            const list = $("#listaEspecialidades");
            list.append('<li data-id =' + datum.id + '>' + $("#input_codigo_especialidad").val() + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
            $('#input_codigo_especialidad').typeahead('val', '');
            $('#input_codigo_especialidad').attr("disabled", true);

=======
      resultInsert.status = "OK";
      if (
        resultInsert.status === "OK" &&
        $("#listaEspecialidades li").length < 1
      ) {
        const list = $("#listaEspecialidades");
        list.append(
          "<li data-id =" +
            datum.id +
            ">" +
            $("#input_codigo_especialidad").val() +
            ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>'
        );
        $("#input_codigo_especialidad").typeahead("val", "");
        $("#input_codigo_especialidad").attr("disabled", true);
      }
    });
    debugger;
  if (codigoPais == "CL" || codigoPais.trim() == "PE") {
    const token = await obtenerToken();
    tokenData = token.data.idToken;

      var bloodhoundMedicamentos = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: baseUrl + "/yapp/yapp/GetVademecum?token=" + tokenData,
        prepare: function (query, settings) {
          settings.url = settings.url + "&text=" + query;
          return settings;
        },
      },
    });
      debugger;
      let urlmedicamentos = baseUrl;
       urlmedicamentos = 'https://net.services.producto.medismart.live'; //comentar esto en produccion 
    var bloodhoundMedicamentos2 = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
          url: `${urlmedicamentos}/apimedicalsearchengine/SearchEngine/GetMedicines?text=%QUERY&comercial=%iscomercial`,
        /*  url: baseUrl + `/apimedicalsearchengine/SearchEngine/GetMedicines?text=%QUERY&comercial=%iscomercial`,*/
        wildcard: "%QUERY",
        replace: function (url, query) {
          var tipo = "false";
          if (checkComercial.checked) tipo = "true";
          else tipo = "false";

          return url.replace("%QUERY", query).replace("%iscomercial", tipo);
        },
      },
    });

    $("#input_codigoMedicamento")
      .typeahead(
        {
          minLength: 3,
        },
        {
          name: "codigos",
          source: bloodhoundMedicamentos2,
          limit: 20,
          display: function (item) {
            var comercial = 0;
            if (checkComercial.checked) comercial = 1;
            else comercial = 0;
            if (item !== "Error" && comercial == 1) {
              return item.standardname;
            } else if (item !== "Error" && comercial == 0) {
              return (
                item.principioActivo +
                " " +
                item.cantidad +
                item.unidad +
                " " +
                item.formaFarmaceutica
              );
            } else
              Swal.fire("", "Producto no encontrado", "warning").then(() => {});
          },
>>>>>>> Stashed changes
        }
    });

    if (codigoPais == "CL" || codigoPais.trim() == "PE") {
        const token = await obtenerToken();
        tokenData = token.data.idToken;

        var bloodhoundMedicamentos = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: baseUrl + '/yapp/yapp/GetVademecum?token=' + tokenData,
                prepare: function (query, settings) {
                    settings.url = settings.url + '&text=' + query
                    return settings;
                }
            }
        });

        var bloodhoundMedicamentos2 = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: baseUrl + `/apimedicalsearchengine/SearchEngine/GetMedicines?text=%QUERY&comercial=%iscomercial`,
                wildcard: '%QUERY',
                replace: function (url, query) {
                    var tipo = "false";
                    if (checkComercial.checked) tipo = "true";
                    else tipo = "false";

                    return url.replace('%QUERY', query).replace('%iscomercial', tipo);
                }
            }
        });

        $('#input_codigoMedicamento').typeahead({
            minLength: 3
        }, {
            name: 'codigos',
            source: bloodhoundMedicamentos2,
            limit: 20,
            display: function (item) {
                var comercial = 0;
                if (checkComercial.checked) comercial = 1;
                else comercial = 0;
                if (item !== "Error" && comercial == 1) {
                    return item.standardname;
                } else if (item !== "Error" && comercial == 0) {
                    return item.principioActivo + " " + item.cantidad + item.unidad + " " + item.formaFarmaceutica;
                }
                else Swal.fire("", "Producto no encontrado", "warning").then(() => {
                });;
            }
        }).bind("typeahead:selected", function (obj, datum, name) {
            //searchMedicamento = datum;
            // ID MECIMANETO SE LE AGREGAN 0000 CEROS PARA IDENTIFICARLOS Y Q NO HAYA DUALIDAD DE CODIGOS
            searchMedicamento = {
                Codigo: (datum.id * 10000).toString(),
                Product_id: datum.productId,
                PrincipioActivo: datum.principioActivo + " " + datum.cantidad + datum.unidad + " " + datum.formaFarmaceutica,
                Estado: 'V',
                CodigoPais: 'CL',
                Product_name: datum.standardname,
                Presentation: datum.formaFarmaceutica,
                Formula_id: datum.atc,
                Comercial: comercial
            }
            searchMedicamento.Comercial = (checkComercial && checkComercial.checked) ? true : false;
            if (datum !== "Error") {
                const inputMedicamento = document.getElementById("input_codigoMedicamento");
                inputMedicamento.setAttribute('data-id', datum.id);

            }

            //$('#input_codigoMedicamento').typeahead('val', '');
        });
    }
    else if (codigoPais == "CO") {
        var bloodhoundMedicamentosCO = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: baseUrl + '/yapp/farmalisto/Doofinder',
                prepare: function (query, settings) {
                    settings.url = settings.url + '?medicamentoText=' + query
                    return settings;
                }
            }
        });

        $('#input_codigoMedicamento').typeahead({
            minLength: 3
        }, {
            name: 'codigos',
            source: bloodhoundMedicamentosCO,
            limit: 20,
            display: function (item) {
                if (item !== "Error") return item.title;
                else Swal.fire("", "Producto no encontrado", "warning").then(() => {
                });;
            }
        }).bind("typeahead:selected", function (obj, data, name) {
            ;
            farmalistoMedicamento = data;
            farmalistoMedicamento.id = parseInt(data.id);
            farmalistoMedicamento.product_id = data.reference;
            farmalistoMedicamento.codigo = (data.id).toString();
            farmalistoMedicamento.product_name = data.title;
            farmalistoMedicamento.PrincipioActivo = data.title;
            farmalistoMedicamento.product_logo = data.image_link;
            farmalistoMedicamento.estado = 'V';
            farmalistoMedicamento.is_product = true;
            farmalistoMedicamento.has_benefit = false;
            farmalistoMedicamento.codigoPais = 'CO';
            farmalistoMedicamento.categories = [];
            if (data !== "Error") {
                const inputMedicamento = document.getElementById("input_codigoMedicamento");
                inputMedicamento.setAttribute('data-id', data.reference);

            }

        });
    }

    //Apuntar a MEDIKIT
    else if (codigoPais == "MX") {
        var bloodhoundMedicamentosDif = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: baseUrl + `/agendamientos/Medicamentos/getMedicamentosQueryDefault/%QUERY/${codigoPais}`,
                wildcard: '%QUERY'
            }
        });

        $('#input_codigoMedicamento').typeahead({
            minLength: 3
        }, {
            name: 'codigos',
            source: bloodhoundMedicamentosDif,
            limit: 20,
            display: function (item) {

                return item.principioActivo /*+ "" + item.presentacionFarmaceutica*/;
            }
        }).bind("typeahead:selected", function (obj, datum, name) {
            const inputMedicamento = document.getElementById("input_codigoMedicamento");
            inputMedicamento.setAttribute('data-id', datum.id);
            //$('#input_codigoMedicamento').typeahead('val', '');
        });
    } else {
        var bloodhoundMedicamentosDif = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: baseUrl + `/agendamientos/Medicamentos/getMedicamentosQueryDefault/%QUERY/${codigoPais}`,
                wildcard: '%QUERY'
            }
        });

        $('#input_codigoMedicamento').typeahead({
            minLength: 3
        }, {
            name: 'codigos',
            source: bloodhoundMedicamentosDif,
            limit: 20,
            display: function (item) {

                return item.principioActivo + "" + item.presentacionFarmaceutica;
            }
        }).bind("typeahead:selected", function (obj, datum, name) {
            const inputMedicamento = document.getElementById("input_codigoMedicamento");
            inputMedicamento.setAttribute('data-id', datum.id);
            //$('#input_codigoMedicamento').typeahead('val', '');
        });
    }

    if (data.atencion.horaMedico.idEspecialidad == 77 || window.host.includes('achs.') || (data.atencion.horaMedico.atiendeHapp && data.atencion.idCliente == 376)) {
        idAtencion = document.querySelector('[name="Atencion.Id"]').value;
        isOrientacion = true;
        let momentDate = moment(todayDate).format(TODAY);
        document.querySelector('[name="Atencion.InicioAtencion"]').value = momentDate;
        document.querySelector('#btnGuardarOrientacion').onclick = async () => {
            $('#btnGuardarOrientacion').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            var mensaje = "";
            if (check.checked && document.querySelector('[name="DescripcionNSP"]').value === "") {
                mensaje += "Debe ingresar justificación en NSP<br>";

            }
            if (check.checked && (document.querySelector('input[name="motivosNSP"]:checked') == null)) {
                mensaje += "Debe ingresar motivo de NSP<br>";
            }

            if (mensaje.length > 0) {
                Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", mensaje, "error");
                $('#btnGuardarOrientacion').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                return;
            }
            var tipo = "F";
            let valida = await guardarFinalizarAtencion(tipo);
            if (valida.status == "OK") {
                Swal.fire({
                    title: "Finalizando atención",
                    text: `En breve será redireccionado al resumen de la atención, no salga de esta ventana.`,
                    type: "info",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                swal.showLoading();
                //llamada a ws consalud cuando idCliente es 1
                if (valida.atencion.idCliente == 1)
                    await getResultAtencionEspera(idAtencion);
                window.onbeforeunload = false;
                await terminoAtencionRT()
                let redireccion = `/Medico/InformeAtencion?idAtencion=${idAtencion}&sendInforme=false`;
                if (connectionTermino.state === signalR.HubConnectionState.Connected) {
                    connectionTermino.invoke('SubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).then(r => {
                        connectionTermino.invoke("TerminoAtencion", parseInt(valida.atencion.idPaciente), parseInt(idAtencion), parseInt(valida.atencion.idCliente)).then(r => {
                            connectionTermino.invoke('UnsubscribeIngresoBox', parseInt(valida.atencion.idPaciente), parseInt(valida.atencion.idCliente)).catch(err => console.error(err));
                            window.location = redireccion;
                        }).catch(err => console.error(err));
                    }).catch((err) => {
                        console.error(err.toString());
                        window.location = redireccion;
                    });
                } else {
                    window.location = redireccion;
                }
                $('#btnGuardarOrientacion').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                //window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}`;
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnGuardarOrientacion').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
        };

        return;
    }


    if (window.host.includes('achs.')) {
        idAtencion = document.querySelector('[name="Atencion.Id"]').value;
        isAchs = true;
        let momentDate = moment(todayDate).format(TODAY);
        document.querySelector('[name="Atencion.InicioAtencion"]').value = momentDate;
        document.querySelector('#btnGuardarAchs').onclick = async () => {
            $('#btnGuardarAchs').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            var mensaje = "";
            if (check.checked && document.querySelector('[name="DescripcionNSP"]').value === "") {
                mensaje += "Debe ingresar justificación en NSP<br>";

            }
            if (check.checked && (document.querySelector('input[name="motivosNSP"]:checked') == null)) {
                mensaje += "Debe ingresar motivo de NSP<br>";
            }

            if (mensaje.length > 0) {
                Swal.fire("¡Cuidado! <br> Faltan campos por completar...<br>", mensaje, "error");
                $('#btnGuardarOrientacion').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                return;
            }
            var tipo = "F";
            let valida = await guardarFinalizarAtencion(tipo);
            if (valida.status == "OK") {
                Swal.fire({
                    title: "Finalizando atención",
                    text: `En breve será redireccionado al resumen de la atención, no salga de esta ventana.`,
                    type: "info",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                swal.showLoading();
                //llamada a ws consalud cuando idCliente es 1
                if (valida.atencion.idCliente == 1)
                    await getResultAtencionEspera(idAtencion);
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
                $('#btnGuardarAchs').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}&sendInforme=false`;
                //window.location = `/Medico/InformeAtencion?idAtencion=${idAtencion}`;
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                $('#btnGuardarAchs').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
            }
        };

        return;
    }
};

document.querySelector('#btnCerrar').onclick = async () => {
    await deleteFisico(idArchivo);
    $("#modalBody").empty();

};

$('#FechaInicioCertificado, #DiasCertificado').change(function () {
    var fechaInicio = $('#FechaInicioCertificado').val();
    var dias = $('#DiasCertificado').val();
    if (fechaInicio && dias) {
        if (dias >= 1) {
            var fecha = new Date(fechaInicio);
            fecha.setHours(fecha.getHours() + 5);
            fecha.setDate(fecha.getDate() + parseInt(dias - 1));
            $('#FechaTerminaCertificado').val(formatDate(fecha));
            $('[name="IncapacidadMedica"]').val("Incapacidad médica por " + dias + (dias > 1 ? " días." : " día"));
        }
        else {
            alert('La fecha Termina no puede ser superior')
            $('#DiasCertificado').val("");
        }
    }
    else {
        $('#FechaTerminaCertificado').val("");
        $('[name="IncapacidadMedica"]').val("");
    }
});

$('#borrarIncapacidad').click(function () {
    $('[name="IncapacidadMedica"]').val("");
    $('#FechaInicioCertificado').val("");
    $('#DiasCertificado').val("");
    $('#FechaTerminaCertificado').val("");
});

function formatDate(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate())).slice(-2);
}

function clickbtnpatologiapanel(btn, idp) {
    let siNotificado = "";
    Swal.close();
    
    switch (btn) {
        case "delete": 
            Swal.fire({
                title: "",
                text: `¿Desea Eliminar?`,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                confirmButtonText: "Sí, Eliminar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.value) {
                    var deletePatol = await deletePatologia(idp);
                    if (deletePatol.status === "OK") {
                        $("#listaEnfermedad").find("li[data-id='" + idp + "']").remove();
                        ((Object.keys(lisGes).filter((i) => i == idp)).length != 0) ? (lisGes[idp] = -1) : "";
                        ((Object.keys(lisEno).filter((i) => i == idp)).length != 0) ? (lisEno[idp] = -1) : "";
                    }
                }
            });
            break;
        case "panelges":
            siNotificado = $("#listaEnfermedad").find("li[data-id='" + idp + "']")[0].getAttribute("data-isges");
            if (siNotificado == "true") {
                window.preCie10GES(idp);
            } else {
                console.log("levantando panel", $("#modalNotificaEnoyGesSolicitud"));
                $("#modalNotificaEnoyGesSolicitudText")[0].innerText = "La patología seleccionada corresponde a una patología de notificación GES. desea notificar?";
                $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-idp", idp);
                $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-type", "ges");
                $("#modalNotificaEnoyGesSolicitud").modal("show");
            }
            break;
        case "paneleno":
            siNotificado = $("#listaEnfermedad").find("li[data-id='" + idp + "']")[0].getAttribute("data-iseno");
            if (siNotificado == "true") {
                window.preCie10ENO(idp);
            } else {
                console.log("levantando panel", $("#modalNotificaEnoyGesSolicitud"));
                $("#modalNotificaEnoyGesSolicitudText")[0].innerText = "La patología seleccionada corresponde a una patología de notificación ENO. desea notificar?";
                $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-idp", idp);
                $("#modalNotificaEnoyGesSolicitud")[0].setAttribute("data-type", "eno");
                $("#modalNotificaEnoyGesSolicitud").modal("show");
            }
            break;
        default:
            return;
    }
}
window.clickbtnpatologiapanel = clickbtnpatologiapanel;
$("#listaEnfermedad").on("click", "li", function () {
    let type = $("#listaEnfermedad").find("li[data-id='" + $(this)[0].dataset.id + "']")[0].getAttribute("data-type");
    let isGESENO = (type != null && type != "" && codigoPais == "CL")
    let idp = $(this)[0].dataset.id;
    if (!isGESENO) {
        Swal.fire({
            title: "",
            text: `¿Desea Eliminar?`,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            reverseButtons: true,
            confirmButtonText: "Sí, Eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.value) {
                var deletePatol = await deletePatologia($(this)[0].dataset.id);
                if (deletePatol.status === "OK") {
                    $(this).remove();
                }
            }
        });
    } else {
        let habilitarges = ((Object.keys(lisGes).filter((i) => i == idp)).length == 0) || (lisGes[idp] != 1 && lisGes[idp] != -1 );
        let habilitareno = ((Object.keys(lisEno).filter((i) => i == idp)).length == 0) || (lisEno[idp] != 1 && lisEno[idp] != -1 );
        let text = $("#listaEnfermedad").find("li[data-id='" + $(this)[0].dataset.id + "']")[0].getAttribute("data-type");
        let additional = "";
        additional += (text.includes("GES") ? "<button  " + ((habilitarges) ? "" : "disabled") + " class=\" " + ((habilitarges) ? "swal2-confirm" : "swal2-cancel") +" swal2-styled\" onclick=\"clickbtnpatologiapanel('panelges','"+$(this)[0].dataset.id+"')\">formulario GES</button>": "");
        additional += (text.includes("ENO" && false) ? "<button  " + ((habilitareno) ? "" : "disabled") + " class=\" " + ((habilitareno) ? "swal2-confirm" : "swal2-cancel") +" swal2-styled\" onclick=\"clickbtnpatologiapanel('paneleno','"+$(this)[0].dataset.id+"')\">formulario ENO</button>": "");
        Swal.fire({
            title: "Panel patologia",
            html: `<p>selecciona una opcion</p>
                ${additional}
                <button class="swal2-cancel swal2-styled"  style='display: inline-block; background-color: rgb(221, 51, 51);' onclick="clickbtnpatologiapanel('delete','${$(this)[0].dataset.id}')">Eliminar</button>
                </div> `,
            type: "warning",
            showCancelButton: false,
            showConfirmButton: false,
            reverseButtons: true,
        });
    }

});

$("#listaTipoExamen").on("click", "li", function () {
    Swal.fire({
        title: "",
        text: `¿Desea Eliminar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true,
        confirmButtonText: "Sí, Eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (resultado) => {
        if (resultado.value) {
            var deleteEx = await deleteExamen($(this)[0].dataset.id);
            if (deleteEx.status === "OK")
                $(this).remove();
        }
    });

});

$("#listaMedicamentos").on("click", "li", function (e) {
    Swal.fire({
        title: "",
        text: `¿Desea Eliminar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true,
        confirmButtonText: "Sí, Eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (resultado) => {
        if (resultado.value) {
            var deleteMedicamento = await deleteMedicamentos($(this)[0].dataset.id);
            postGetLink.data.products = auxArray.filter((item) => {
                if (item.id !== item.deleteMedicamentoId) {
                    return item;
                }
            });

            if (deleteMedicamento.status === "OK")
                $(this).remove();
        }
    });

});

$("#listaEspecialidades").on("click", "li", function () {
    Swal.fire({
        title: "",
        text: `¿Desea Eliminar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true,
        confirmButtonText: "Sí, Eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (resultado) => {
        if (resultado.value) {
            var resultInsert = await insertEspecialidadDerivacionAtencion(parseInt(idAtencion), 0);
            if (resultInsert.status === "OK") {
                $(this).remove();
                $('#input_codigo_especialidad').attr("disabled", false);
            }
        }
    });

});

function respMedicamentosVacio() {
    const medicamentosMedico = document.querySelector("[name='MedicamentosMedico']");

    if ($("#listaMedicamentos")[0].innerText == "" && medicamentosMedico.value == "") {
        Swal.fire({
            title: "Atención sin medicamentos",
            text: `´Se emitirán informes sin receta medica, ¿Es correcto?`,
            type: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            reverseButtons: true,
            confirmButtonText: "Sí, Continuar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.value) {
                return 1;
            }

            else {
                return 0;
            }
        });
        return;
    }
    else {
        return 1;
    }

}

async function envioHistorialMedico(idAtencion, idRegistroHisExterno) {
    try {
        return await fetch(window.urlHistExterno + "SendNewDiagnostic?idAtencion=" + idAtencion + "&idRegistro=" + idRegistroHisExterno).json();
    } catch (e) { }
    return null
}


async function checkBox(data) {
    if (check.checked) {
        checkON(data);
    }
    else {
        checkOFF(data);
    }
}


async function configElementos(destinatarios) {
    // profesionales invitados

    let selectAsociado = document.querySelector('select[name="profesionalesAsociados"]');
    selectAsociado.required = false;
    let opcion2 = document.createElement('option');
    destinatarios.forEach(async param => {
        opcion2 = document.createElement('option');
        opcion2.setAttribute('value', param.correoInvitados);
        opcion2.setAttribute('data-id', param.idmedicoAsociado);
        opcion2.innerHTML = param.nombreMedico;
        selectAsociado.appendChild(opcion2);
    });


}

async function checkON(data) {
    let btnSave = document.querySelector('#btnGuardar');
    btnSave.innerHTML = "Guardar";
    btnSave.setAttribute('class', 'btn btn-warning');
    textCheck.setAttribute('style', 'display:block');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:block');
    document.querySelector('[id="listaNSP"]').classList.remove('d-none');
    if (data.atencion.horaMedico.idEspecialidad != 77) {
        document.querySelector('[name="DiagnosticoMedico"]').setAttribute('disabled', 'disabled');
        document.getElementById('input_codigo').disabled = true;
        document.getElementById('input_codigoExamen').disabled = true;
        $('textarea[name="ExamenMedico"]:visible').attr("disabled", "disabled");
        // document.querySelector('[name="ExamenMedico"]').setAttribute('disabled', 'disabled');
        //document.querySelector('[id="cmbExamen"]').setAttribute('disabled', 'disabled');
        document.querySelector('[name="CertificadoMedico"]').setAttribute('disabled', 'disabled');
        document.querySelector('[name="TratamientoMedico"]').setAttribute('disabled', 'disabled');
        document.querySelector('[name="MedicamentosMedico"]').setAttribute('disabled', 'disabled');
        document.querySelector('[name="ControlMedico"]').setAttribute('disabled', 'disabled');
    }
    document.querySelector('[name="Observaciones"]').setAttribute('disabled', 'disabled');
}

async function checkOFF(data) {
    let btnSave = document.querySelector('#btnGuardar');

    if (!data.atencion.peritaje) {
        btnSave.innerHTML = "Previsualizar";
        btnSave.setAttribute('class', 'btn btn-brand');
    }


    textCheck.setAttribute('style', 'display:none');
    document.querySelector('[id="divNSP"]').setAttribute('style', 'display:none');
    if (data.atencion.horaMedico.idEspecialidad != 77) {

        document.querySelector('[name="DiagnosticoMedico"]')?.removeAttribute('disabled', 'disabled');
        if (document.getElementById('input_codigo'))
            document.getElementById('input_codigo').disabled = false;
        if (document.getElementById('input_codigo'))
            document.getElementById('input_codigo').disabled = false;
        $('textarea[name="ExamenMedico"]:visible').removeAttr("disabled");
        // document.querySelector('[name="ExamenMedico"]')?.removeAttribute('disabled', 'disabled');
        //document.querySelector('[id="cmbExamen"]').removeAttribute('disabled', 'disabled');
        document.querySelector('[name="CertificadoMedico"]')?.removeAttribute('disabled', 'disabled');
        document.querySelector('[name="TratamientoMedico"]')?.removeAttribute('disabled', 'disabled');
        document.querySelector('[name="MedicamentosMedico"]')?.removeAttribute('disabled', 'disabled');
        document.querySelector('[name="ControlMedico"]')?.removeAttribute('disabled', 'disabled');
    }

    document.querySelector('[name="Observaciones"]')?.removeAttribute('disabled', 'disabled');
}

async function refreshReport() {
    const divContent = document.getElementById("contentLabel");
    const divButton = document.createElement("div");
    divButton.setAttribute('class', 'kt-portlet__head-label');
    const buttonRefresh = document.createElement('button');
    buttonRefresh.setAttribute('class', 'btn btn-success');
    buttonRefresh.setAttribute("id", "btnRefresh");
    const icon = document.createElement('i');
    icon.setAttribute('class', 'fa fa-refresh');

    buttonRefresh.appendChild(icon);
    divButton.appendChild(buttonRefresh);
    divContent.appendChild(divButton);

    buttonRefresh.onclick = async () => {
        $("#contentLabel button.btn-success").attr("disabled", true);
        $("#contentLabel button.btn-success i").removeClass("fa-refresh");
        $("#contentLabel button.btn-success i").addClass("fa-download");

        let atencion = await getAtencion(idAtencion);


        $("#contentLabel button.btn-success").removeAttr("disabled");
        $("#contentLabel button.btn-success i").removeClass("fa-download");
        $("#contentLabel button.btn-success i").addClass("fa-refresh");

        if (atencion.horaMedico.idEspecialidad != 77) {
            if (document.querySelector('textarea[name="motivoConsultaMedico"]'))
                document.querySelector('textarea[name="motivoConsultaMedico"]').value = atencion.motivoConsultaMedico;
            if (document.querySelector('textarea[name="DiagnosticoMedico"]'))
                document.querySelector('textarea[name="DiagnosticoMedico"]').value = atencion.diagnosticoMedico;
            if ($('textarea[name="ExamenMedico"]:visible').length)
                $('textarea[name="ExamenMedico"]:visible').val(atencion.examenMedico); // document.querySelector('textarea[name="ExamenMedico"]').value = atencion.examenMedico;
            if (document.querySelector('textarea[name="TratamientoMedico"]'))
                document.querySelector('textarea[name="TratamientoMedico"]').value = atencion.tratamientoMedico;
            if ($('textarea[name="CertificadoMedico"]:visible').length)
                $('textarea[name="CertificadoMedico"]:visible').val(atencion.certificadoMedico);
            const incapacidadMedica = document.querySelector('textarea[name="IncapacidadMedica"]');
            if (incapacidadMedica)
                document.querySelector('textarea[name="IncapacidadMedica"]').value = atencion.incapacidadMedica;
            if (document.querySelector('textarea[name="ControlMedico"]'))
                document.querySelector('textarea[name="ControlMedico"]').value = atencion.controlMedico;
            if (document.querySelector('[name="MedicamentosMedico"]'))
                document.querySelector('[name="MedicamentosMedico"]').value = atencion.medicamentosMedico;
            if (document.querySelector('#consentimiento'))
                document.querySelector('#consentimiento').checked = atencion.consentimientoInformado;
            if (document.querySelector('[name="DiagnosticoPsicopedagogico"]'))
                document.querySelector('[name="DiagnosticoPsicopedagogico"]').value = atencion.diagnosticoPsicopedagogico;
            if (document.querySelector('[name="ObjetivosDeLaSesion"]'))
                document.querySelector('[name="ObjetivosDeLaSesion"]').value = atencion.objetivosDeLaSesion;
        }
        document.querySelector('textarea[name="Observaciones"]').value = atencion.observaciones;
        var diagnostico = atencion.patologias;
        var examenes = atencion.examenes;
        var medicamentos = atencion.medicamentos;
        var especialidadDerivacion = atencion.idEspecialidadDerivacion
        if (especialidadDerivacion != 0) {
            var especialidad = listaEspecialidades.filter(x => x.id == especialidadDerivacion);
            $("#input_codigo_especialidad").val(especialidad[0].nombre);
        }

        if ($('#AreaAjusteSelect').length && $('#AntecedentesSelect').length && $('#HipotesisSelect').length) {
            let dataSelectArea = await getAtencionAreaAjusteByIdAtencion(idAtencion);
            let idsdataSelectArea = await dataSelectArea.data.map(x => x.idAreaAjuste);
            let dataSelectHipotesis = await getAtencionHipotesisPreliminarByIdAtencion(idAtencion);
            let idsdataSelectHipotesis = await dataSelectHipotesis.data.map(x => x.idHipotesisPreliminar);
            let dataSelectAntecedentes = await getAtencionAntecedentesByIdAtencion(idAtencion);
            let idsdataSelectAntecedentes = await dataSelectAntecedentes.data.map(x => x.idAntecedente);
            $("#AreaAjusteSelect").val(idsdataSelectArea).change();
            let divDescArea = document.getElementById('areadeajuste-descripciones')
            let descripcionesArea = divDescArea.querySelectorAll('textarea')
            descripcionesArea.forEach(function (textarea) {
                let item = dataSelectArea.data.find(d => d.idAreaAjuste == textarea.id);
                textarea.value = item.descripcion;
            })

            $("#HipotesisSelect").val(idsdataSelectHipotesis).change();
            let divDescHipo = document.getElementById('hipotesis-descripciones')
            let descripcionesHipo = divDescHipo.querySelectorAll('textarea')
            descripcionesHipo.forEach(function (textarea) {
                let item = dataSelectHipotesis.data.find(d => d.idHipotesisPreliminar == textarea.id);
                textarea.value = item.descripcion;
            })

            $("#AntecedentesSelect").val(idsdataSelectAntecedentes).change();
            let divDescAntece = document.getElementById('antecedentes-descripciones')
            let descripcionesAntece = divDescAntece.querySelectorAll('textarea')
            descripcionesAntece.forEach(function (textarea) {
                let item = dataSelectAntecedentes.data.find(d => d.idAntecedente == textarea.id);
                textarea.value = item.descripcion;
            })
        }

        $("#listaEnfermedad").empty();
        const list = $("#listaEnfermedad");
        diagnostico.forEach(async item => {
            let divGes = "";
            let divEno = "";
            let listType = "";
            try {
                let saludGes = saludDocumentos.find((itemSalud) => { return itemSalud.tipoIntegracion.split("_")[2] == item.id });
                let proceso = (saludGes != null && saludGes.status == "process") ? [0, "NOTIFICADO"] :
                    (saludGes != null && saludGes.status == "completed") ? [1, "GENERADO"] :
                        (saludGes != null && saludGes.status == "cancelado" && saludGes.estadoNotificacion != "no_notificado") ? [2, "CANCELADO"] :
                            (saludGes != null && saludGes.status == "cancelado" && saludGes.estadoNotificacion == "no_notificado") ? [2, "NO NOTIFICADO"] :
                                [0, ""];

                divGes = (await validaPatologiaGes(item.cie10)).status == 'OK' ? '<div class="pges" style="border: solid 1px #329ab6; border-radius: 8px; width: fit-content; padding: 0px 4px;" >GES, ' + proceso[1] +'</div>' : "";
                if(divGes != "")
                    lisGes[("" + item.id)] = proceso[0];
                listType += divGes ? "GES" : "";
            } catch (e) { }
            try {
                let saludEno = saludDocumentos.find((itemSalud) => { return itemSalud.tipoIntegracion.split("_")[2] == item.id });
                let proceso = (saludEno != null && saludEno.status == "process") ? [0, "NOTIFICADO"] :
                    (saludEno != null && saludEno.status == "completed") ? [1, "GENERADO"] :
                        (saludEno != null && saludEno.status == "cancelado" && saludEno.estadoNotificacion != "no_notificado") ? [2, "CANCELADO"] :
                            (saludEno != null && saludEno.status == "cancelado" && saludEno.estadoNotificacion == "no_notificado") ? [2, "NO NOTIFICADO"] :
                                [0, ""];
                divEno = (await validaPatologiaEno(item.cie10)).status == 'OK' ? '<div class="peno" style="border: solid 1px #329ab6; border-radius: 8px; width: fit-content; padding: 0px 4px;" >ENO, ' + proceso[1] +'</div>' : "";
                if (divEno != "")
                    lisEno[("" + item.id)] = proceso[0];
                listType += divGes ? "," : "";
                listType += divEno ? "ENO" : "";

            } catch (e) { }
            list.append('<li data-id =' + item.id + ' data-type="' + listType +'" data-cie10 =' + item.cie10 + ' style=" display: flex;align-content: center;justify-content: space-between;align-items: center;">' + item.cie10 + '-' + item.nombre + ' &nbsp;<div>' + divGes + divEno + '</div><a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
        });
        $("#listaTipoExamen").empty();
        const listExamen = $("#listaTipoExamen");
        examenes.forEach(item => {
            listExamen.append('<li data-id =' + item.id + '>' + item.codigo + '-' + item.nombre + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
        });
        $("#listaMedicamentos").empty();
        const listMedicamentos = $("#listaMedicamentos");
        medicamentos.forEach(item => {

            const displayName = item.comercial === true ? item.product_name : item.principioActivo;
            const presentacion = item.presentacionFarmaceutica !== null ? item.presentacionFarmaceutica + ' ' : '';
            listMedicamentos.append('<li data-id =' + item.id + '>' + displayName + ' ' + presentacion + item.posologia + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
        });

        $("#listaEspecialidades").empty();
        const listEspecialidad = $("#listaEspecialidades");
        listaEspecialidades.forEach(item => {
            if (item.id == 54) {
                listEspecialidad.append('<li data-id =' + item.id + '>' + item.nombre + ' &nbsp;<a href="javascript:;"><i class="kt-menu__link-icon flaticon2-delete"></i></a></li>');
            }
        });

        $('#nombreAcompanante').val(atencion.atencionDatosAdicionales?.nombreAcompanante);
        $('#telefonoAcompanante').val(atencion.atencionDatosAdicionales?.telefonoAcompanante);
        $('#nombreResponsable').val(atencion.atencionDatosAdicionales?.nombreResponsable);
        $('#telefonoResponsable').val(atencion.atencionDatosAdicionales?.telefonoResponsable);
        $('#consultaCo').val(atencion.atencionDatosAdicionales?.tipoConsulta);
    };

}

function validarCamposCol() {
    var incapacidad = $('[name="IncapacidadMedica"]').val();
    if (incapacidad != "") {
        var diffTime = Math.abs(new Date($('#FechaTerminaCertificado').val()) - new Date($('#FechaInicioCertificado').val()));
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        $('#DiasCertificado').val(diffDays + 1);
    }
}

async function validarCampos(data) {

    let mensaje = "";
    let ignorarCamposObligatoriosUOH = window.boxEspecial && window.host.includes('uoh.');

    if (!ignorarCamposObligatoriosUOH) {
        if (document.querySelector('#listaEnfermedad').innerText === "" && document.querySelector('[name="nsp"]').checked == false && !data.atencion.peritaje) {
            mensaje += "Debe ingresar un codigo o descripción <br>";
        }
        if (!codigoPais === "CO") {
            if (document.querySelector('[name="DiagnosticoMedico"]').value === "" && document.querySelector('[name="nsp"]').checked == false && !data.atencion.peritaje) {
                mensaje += "Debe ingresar diagnostico médico <br>";
            }
        }
        if (check.checked && document.querySelector('[name="DescripcionNSP"]').value === "") {
            mensaje += "Debe ingresar justificación en NSP<br>";
        }
    }

    if (check.checked && (document.querySelector('input[name="motivosNSP"]:checked') == null)) {
        mensaje += "Debe ingresar motivo de NSP<br>";
    }
    return mensaje;
}

async function validarCamposPositivaPsicologia(data) {
    console.log(data);
}

async function validarIncapacidadCO() {

    var fechaInicio = $('#FechaInicioCertificado').val();
    var fechaTermina = $('#FechaTerminaCertificado').val();
    if (fechaInicio && fechaTermina) {
        if (new Date(fechaTermina) < new Date(fechaInicio))
            return "La fecha termina de la incapacidad no puede ser mayor a la inicial";
        else if ($('#DiasCertificado').val() == "")
            return "Por favor validar las fechas de la incapacidad";
    }
    if ($('#FechaInicioCertificado').val() != "" && $('#DiasCertificado').val() == "")
        return "Para registrar incapacidad debe digitar las fechas inicia y el campo Días";

    return "";
}


async function guardarFinalizarAtencion(tipo) {
    const inicioAtencion = document.querySelector('[name="Atencion.InicioAtencion"]').value;
    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    var motivoNSP = 0;
    let atencion = {};
    if (!isOrientacion && !isAchs && !window.host.includes('positiva.')) { //no es de especialidad de orientacion o no es convenio empresa achs


        if (document.querySelector('input[name="motivosNSP"]:checked') != null) {
            motivoNSP = document.querySelector('input[name="motivosNSP"]:checked').value;
        }
        let patologias = [];
        Array.from(document.querySelector('#listaEnfermedad').children).forEach(patologia => {

            let obj = {};
            obj.Id = parseInt(patologia.dataset.id);
            patologias.push(obj);
        });

        let examenes = [];
        const listaTipoExamen = document.querySelector('#listaTipoExamen');

        if (listaTipoExamen) {
            Array.from(listaTipoExamen.children).forEach(examen => {
                let obj = {};
                obj.Id = parseInt(examen.dataset.id);
                examenes.push(obj);
            });
        }
        atencion = {
            NSP: document.querySelector('[name="nsp"]').checked,
            DescripcionNSP: document.querySelector('[name="DescripcionNSP"]').value,
            MotivoNsp: parseInt(motivoNSP),
            ConsentimientoInformado: document.querySelector('[name="consentimiento"]').checked,
        };

        const textAreas = Array.from(document.querySelectorAll('#divReporte textarea, #divAntecedentesMedicos textarea'));
        for (const item of textAreas) {
            if (item.name !== "") {
                const items = textAreas.filter(el => el.name === item.name);
                if (items.length === 1) {
                    atencion[item.name] = item.value;
                } else {
                    const uniqueItem = items.find(el => $(el).is(":visible"))
                    if (uniqueItem)
                        atencion[uniqueItem.name] = uniqueItem.value;
                }
            }
        }
        if (codigoPais == "CO") {
            if ($("#antecedentesPatologicos").length > 0)
                atencion.antecedentes_Patologicos = document.getElementById("antecedentesPatologicos").value;
            if ($("#antecedentesQuirurgicos").length > 0)
                atencion.antecedentes_Quirurgicos = document.getElementById("antecedentesQuirurgicos").value;
            if ($("#antecedentesGinecoObstetricos").length > 0)
                atencion.antecedentes_GinecoObstetricos = document.getElementById("antecedentesGinecoObstetricos").value;
            if ($("#antecedentesToxicosAlergicos").length > 0)
                atencion.antecedentes_ToxicosAlergicos = document.getElementById("antecedentesToxicosAlergicos").value;
            if ($("#antecedentesFarmacologicos").length > 0)
                atencion.antecedentes_Farmacologicos = document.getElementById("antecedentesFarmacologicos").value;
            if ($("#antecedentesFamiliares").length > 0)
                atencion.antecedentes_Familiares = document.getElementById("antecedentesFamiliares").value;
        }
        // textAreas.forEach(textArea => atencion[textArea.name] = textArea.value);

        if (codigoPais == "CO") {
            var fechaInicio = $('#FechaInicioCertificado').val();
            var fechaTermina = $('#FechaTerminaCertificado').val();
            if (fechaInicio && fechaTermina) {
                atencion.FechaInicioCertificado = new Date(fechaInicio);
                atencion.FechaTerminaCertificado = new Date(fechaTermina);
            }
        }

        atencion.Patologias = patologias;
        atencion.Examenes = examenes;
        atencion.LinkYapp = sendPostLink?.link?.data?.url ? sendPostLink.link.data.url : null;
    } else {
        var motivo = document.querySelector('input[name="motivosNSP"]:checked') ? document.querySelector('input[name="motivosNSP"]:checked').value : 0
        atencion = {
            NSP: document.querySelector('[name="nsp"]').checked,
            DescripcionNSP: document.querySelector('[name="DescripcionNSP"]').value,
            MotivoNsp: parseInt(motivo),
            ConsentimientoInformado: true,
            Observaciones: document.querySelector('textarea[name="Observaciones"]').value
        };
    }

    if ($('#atencion-datos-adicionales').length) {
        let atencionDatosAdicionales = {

            nombreAcompanante: $("#nombreAcompanante").val() ?? '',
            telefonoAcompanante: $("#telefonoAcompanante").val() ?? '',
            nombreResponsable: $("#nombreResponsable").val() ?? '',
            TipoConsulta: $("#consultaCo").val() ?? '',
            telefonoResponsable: $("#telefonoResponsable").val() ?? '',
            ocupacion: $("#ocupacionCo").val() ?? '',
            edad: $("#edadCo").val() ?? '',
            ciudad_de_atencion: $("#ciudadAtencionCo").val() ?? '',
            parentesco: $("#parentesco").val() ?? '',
            FC: $("#frecuenciaCardiaca").val() ?? '',
            FR: $("#frecuenciaRespiratoria").val() ?? '',
            Temp: $("#temperatura").val() ?? '',
            TA_acostado: $("#tensionArterialAcostado").val() ?? '',
            TA_sentado: $("#tensionArterialSentado").val() ?? '',
            TA_de_pie: $("#tensionArterialPie").val() ?? '',
            Examenes_previos_y_diagnosticas: $("#examenesDiagnosticos").val() ?? '',
            Analisis_y_comentarios: $("#analisisComentarios").val() ?? '',
            Ajuste_Familiar: $("#ajusteFamiliar").val() ?? '',
            Ajuste_Laboral: $("#ajusteLaboral").val() ?? '',
            Ajuste_Academico: $("#ajusteAcademico").val() ?? '',
            Ajuste_Social: $("#ajusteSocial").val() ?? '',
            Ajuste_Religioso: $("#ajusteReligioso").val() ?? '',
            Hipotesis_Preliminares: $("#hipotesisPreliminares").val() ?? '',
            Aspectos_Sobresalientes_Comp: $("#aspectosSobreComp").val() ?? ''
            
        }

        atencion.atencionDatosAdicionales = atencionDatosAdicionales;

    }

    var resultArrayAntecedenteHipotesisArea = {}

    if ((window.host.includes("positiva.") || window.host.includes("medical.")) && (idClienteP == idClientePositiva)) {
        let atencionDatosAdicionales = {
            ocupacion: $("#detalles-ocupacion").val() ?? ''
        }

        atencion.atencionDatosAdicionales = atencionDatosAdicionales;
        atencion.ControlMedico = document.querySelector('[name="ControlMedico"]').value;
        atencion.DiagnosticoMedico = document.querySelector('[name="DiagnosticoMedico"]').value;
        atencion.TratamientoMedico = document.querySelector('[name="TratamientoMedico"]').value;
        atencion.ObjetivosDeLaSesion = document.querySelector('[name="aspectosSobresalientes"]') != null ? document.querySelector('[name="aspectosSobresalientes"]').value: '';
        atencion.ExamenMedico = document.querySelector('[name="ExamenMedico"]').value;
        if ($("#antecedentes-descripciones").length && $("#hipotesis-descripciones").length && $("#areadeajuste-descripciones").length) {
            let areaDeAjustes = []
            let hipotesis = []
            let antecedentes = []
            let textAreasAntecedentes = $("#antecedentes-descripciones").find("textarea");
            let textAreasHipotesis = $("#hipotesis-descripciones").find("textarea");
            let textAreasAreaDeAjuste = $("#areadeajuste-descripciones").find("textarea");
            textAreasAntecedentes.each(function () {
                antecedentes.push({
                    IdAtencion: parseInt(idAtencion),
                    IdAntecedente: parseInt($(this).attr("id")),
                    Descripcion: $(this).val()
                })
            });
            textAreasHipotesis.each(function () {
                hipotesis.push({
                    IdAtencion: parseInt(idAtencion),
                    IdHipotesisPreliminar: parseInt($(this).attr("id")),
                    Descripcion: $(this).val()
                })
            });
            textAreasAreaDeAjuste.each(function () {
                areaDeAjustes.push({
                    IdAtencion: parseInt(idAtencion),
                    IdAreaAjuste: parseInt($(this).attr("id")),
                    Descripcion: $(this).val()
                })
            });

            resultArrayAntecedenteHipotesisArea = {
                antecedentes,
                hipotesis,
                areaDeAjustes
            }
        }

        if (!check.checked) {
            if (resultArrayAntecedenteHipotesisArea.hasOwnProperty('antecedentes')) {
                let resultado = await insertAtencionAntecedentes(resultArrayAntecedenteHipotesisArea.antecedentes);
                if (resultado.status === 'NOK') {
                    return false;
                }
            }

            if (resultArrayAntecedenteHipotesisArea.hasOwnProperty('hipotesis')) {
                let resultado = await insertHipotesisPreliminar(resultArrayAntecedenteHipotesisArea.hipotesis);
                if (resultado.status === 'NOK') {
                    return false;
                }
            }

            if (resultArrayAntecedenteHipotesisArea.hasOwnProperty('areaDeAjustes')) {
                let resultado = await insertAtencionAreaAjustes(resultArrayAntecedenteHipotesisArea.areaDeAjustes);
                if (resultado.status === 'NOK') {
                    return false;
                }
            }
        }
    }


   

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








var m = 15;
var s = parseInt("00", 8);


var interval;
// 0 Dias 0 Horas 1 Minuto 20 Segundos

function contador_regresivo() {


    interval = setInterval(function () {
        setInter()

        innerHTML();
        // document.body.innerHTML = h+" h "+m+" m "+s+" s";
    }, 1000);
}

function setInter() {

    if (s > 0 && s <= 60) {
        s--;
        cambiar()
    }
    else if (m > 0 && m <= 60) {
        m--;
        s = 59;
        cambiar()
    }

    else {
        m = 0;
        s = 0;
        clearInterval(interval);
        cambiar()
        //alert("Tiempo Finalizado");
    }
}

function innerHTML() {
    document.getElementById("crono").innerHTML = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}

function cambiar() {

    if (m == 14) {
        document.getElementById("divReloj").style.backgroundColor = "LimeGreen";
    }
    else if (m == 9) {
        document.getElementById("divReloj").style.backgroundColor = "yellow";
    }
    else if (m == 4) {
        document.getElementById("divReloj").style.backgroundColor = "DarkOrange";
    }
    else if (m == parseInt("00", 8) && s == parseInt("00", 8)) {
        document.getElementById("divReloj").style.backgroundColor = "red";
    }
}

async function initPhoneCall() {
    const res = await generateToken();
    if (res?.success) {
        $("#div-call").removeClass("d-none");

        const USER_JWT = res.token;
        const callButton = document.getElementById("call");
        const hangupButton = document.getElementById("hangup");
        const statusElement = document.getElementById("status");
        const map = new Map([
            ["started", "marcando"],
            ["ringing", "sonando"],
            ["answered", "contestada"],
            ["unanswered", "sin respuesta"],
            ["rejected", "rechazada"],
            ["failed", "fallida"],
            ["busy", "número ocupado"],
            ["timeout", "se acabó el tiempo"],
            ["completed", "terminada"]
        ]);

        new NexmoClient({ debug: false })
            .createSession(USER_JWT)
            .then(app => {
                callButton.addEventListener("click", event => {
                    event.preventDefault();
                    statusElement.innerText = '';

                    let destination = document.getElementById("phone-number").value;
                    if (destination !== "") {
                        app.callServer(destination);
                    } else {
                        statusElement.innerText = 'Por favor, ingrese el número para realizar la llamada.';
                    }

                    $(callButton).find("span").html("Llamando");
                });

                app.on("member:call", (member, call) => {
                    hangupButton.addEventListener("click", () => {
                        call.hangUp();
                    });
                });

                app.on("call:status:changed", (call) => {
                    $(statusElement).html(`<b>Estado de la llamada:</b> <em>${map.get(call.status)}</em>`);

                    if (call.status === call.CALL_STATUS.STARTED) {
                        $(callButton).addClass("d-none");
                        $(hangupButton).removeClass("d-none");
                    }

                    if (call.status === call.CALL_STATUS.COMPLETED || call.status === call.CALL_STATUS.UNANSWERED || call.status === call.CALL_STATUS.REJECTED || call.status === call.CALL_STATUS.BUSY || call.status === call.CALL_STATUS.TIMEOUT) {
                        $(callButton).find("span").html("Llamar");
                        $(callButton).removeClass("d-none");
                        $(hangupButton).addClass("d-none");
                    }
                });
            })
            .catch(console.error);
    }
}

//reporte enfermera----------------------------------------------------------------------------------------------
const $formEnfermera = document.querySelector("#formReporteEnfermera");
const $btnMedicamento = document.querySelector("#agregarMedicamento");
const inputel = document.querySelector("#telefono_enfermera_datos_id");
let cuestionario = { estado: false };
let atencionData;

const iti = window.intlTelInput(inputel, {
    preferredCountries: ['cl', 'co', 'ec', 'mx', 'pe', 'bo', 'br'],
    initialCountry: "auto",
    geoIpLookup: callback => {
        fetch("https://ipapi.co/json")
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback("cl"));
    },
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js"
});



const obtenerDatosFormulario = async () => {
    idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    let atencion = await getAtencion(idAtencion);
    atencionData = atencion;
    if (atencion && atencion.isProgramaSalud) {
        //formularioAnteriores
        const datosFormulario = await getProgramaSaludFormularioEnfermera(atencion.idPaciente, atencion.idCliente, idAtencion);
        console.log(datosFormulario);
        if (datosFormulario.status === "OK") {
            /** document.getElementById("sigvitales_enfermera_datos_id").value = datosFormulario.formulario.signosVitales;
             document.getElementById("Prearterial_enfermera_datos_id").value = datosFormulario.formulario.presionArterial;
             document.getElementById("glicemia_enfermera_datos_id").value = datosFormulario.formulario.glicemia;**/
            //sintomas
            document.getElementById("cefalea_" + datosFormulario.formulario.sintomas.cefalea + "").checked = true;
            document.getElementById("tinitus_" + datosFormulario.formulario.sintomas.tinitus + "").checked = true;
            document.getElementById("ruidrespiratorios_" + datosFormulario.formulario.sintomas.ruidos_respiratorios + "").checked = true;
            document.getElementById("inapetencia_" + datosFormulario.formulario.sintomas.inapetencia + "").checked = true;
            document.getElementById("AumtPeso_" + datosFormulario.formulario.sintomas.aumento_de_peso + "").checked = true;
            document.getElementById("poliurea_" + datosFormulario.formulario.sintomas.poliurea + "").checked = true;
            document.getElementById("polidipsia_" + datosFormulario.formulario.sintomas.polidipsia + "").checked = true;
            document.getElementById("disnea_" + datosFormulario.formulario.sintomas.disnea + "").checked = true;
            document.getElementById("fatiga_" + datosFormulario.formulario.sintomas.fatiga + "").checked = true;
            document.getElementById("nauseas_" + datosFormulario.formulario.sintomas.nauseas + "").checked = true;
            document.getElementById("mareos_" + datosFormulario.formulario.sintomas.mareos + "").checked = true;
            //document.getElementById("icrutia_" + datosFormulario.formulario.sintomas.icrutia + "").checked = true;
            document.getElementById("debilidad_" + datosFormulario.formulario.sintomas.debilidad + "").checked = true;
            document.getElementById("estrenimiento_" + datosFormulario.formulario.sintomas.estrenimiento + "").checked = true;
            document.getElementById("dolorpies_" + datosFormulario.formulario.sintomas.dolor_en_pies + "").checked = true;
            document.getElementById("faltasensipies_" + datosFormulario.formulario.sintomas.falta_de_sensibilidad_en_pies + "").checked = true;
            //medicamentos
            const tbody = document.querySelector("#tbMedicamentos tbody");
            tbody.innerHTML = "";
            datosFormulario.formulario.medicamentos.forEach(function (medicamento) {
                var row = document.createElement("tr");
                var columnMedicamento = document.createElement("td");
                var columnIndicacion = document.createElement("td");
                var columnHorario = document.createElement("td");
                var columnEfectosAdversos = document.createElement("td");
                var columnAcciones = document.createElement("td");

                columnMedicamento.textContent = medicamento.medicamento;
                columnIndicacion.textContent = medicamento.indicacion;
                columnHorario.textContent = medicamento.horario;
                columnEfectosAdversos.textContent = medicamento.efectosAdversos;
                columnAcciones.innerHTML = '<button class="eliminar-fila btn btn-warning">x</button>';

                row.appendChild(columnMedicamento);
                row.appendChild(columnIndicacion);
                row.appendChild(columnHorario);
                row.appendChild(columnEfectosAdversos);
                row.appendChild(columnAcciones);

                tbody.appendChild(row);
            });
            //diagnóstico
            //let datediag = datosFormulario.formulario.fechaDiagnostico ? new Date(datosFormulario.formulario.fechaDiagnostico) : null;
            let datecontrol = datosFormulario.formulario.fechaUltimoControl ? new Date(datosFormulario.formulario.fechaUltimoControl) : null;
            let dateExamen = datosFormulario.formulario.fechaUltimosExamenes ? new Date(datosFormulario.formulario.fechaUltimosExamenes) : null;

            document.getElementById("diagnostico_enfermera_datos_id").value = datosFormulario.formulario.diagnostico;
            //document.getElementById("datediagnostico_enfermera_datos_id").value = datediag ? datediag.toISOString().split('T')[0] : null; 
            document.getElementById("Antfamiliares_enfermera_datos_id").value = datosFormulario.formulario.antecedentesFamiliares;
            document.getElementById("dateultControl_enfermera_datos_id").value = datecontrol ? datecontrol.toISOString().split('T')[0] : null;
            //examenes
            document.getElementById("examenes_enfermera_datos_id").value = datosFormulario.formulario.examenesIndicaciones;
            document.getElementById("datexamen_enfermera_datos_id").value = dateExamen ? dateExamen.toISOString().split('T')[0] : null;
            datosFormulario.formulario.examenesNormales ? document.getElementById("examennormal_si").checked = true : document.getElementById("examennormal_no").checked = true;
            //observaciones
            document.getElementById("observaciones_enfermera_datos_id").value = datosFormulario.formulario.observaciones;
        }

        //cuestionario
        const datosCuestionario = await getProgramaSaludCuestionario(1, atencion.idCliente, atencion.idPaciente);
        if (datosCuestionario) {
            cuestionario.estado = true;
            cuestionario.data = datosCuestionario;
            document.getElementById("peso_enfermera_datos_id").value = datosCuestionario.peso;
            document.getElementById("talla_enfermera_datos_id").value = datosCuestionario.altura;
            document.getElementById("edad_enfermera_datos_id").value = datosCuestionario.edad;
            datosCuestionario.tabaco === true ? document.getElementById("tabaco_si").checked = true : document.getElementById("tabaco_no").checked = true;
            datosCuestionario.actividad === true ? document.getElementById("actfisica_si").checked = true : document.getElementById("actfisica_no").checked = true;
        }
        const datosperson = await personByUser(atencion.idPaciente);
        document.getElementById("telefono_enfermera_datos_id").value = datosperson.telefono;
        document.getElementById("correo_enfermera_datos_id").value = datosperson.correo;

        iti.setNumber(datosperson.telefono.replace("(", "").replace(")", "").replace(" ", ""));


    }
}

obtenerDatosFormulario();


$btnMedicamento.addEventListener("click", () => {
    const $nomMedicamento = document.querySelector("#nomMedEnfer");
    const $indMedicamento = document.querySelector("#indMedEnfer");
    const $horarioMedicamento = document.querySelector("#horarioMedEnfer");
    const $efectosMedicamento = document.querySelector("#efectosMedEnfer");

    if ($nomMedicamento.value) {
        const tablaMedicamentos = document.getElementById("tbMedicamentos").querySelector("tbody");

        let row = tablaMedicamentos.insertRow();
        let cellMedicamento = row.insertCell(0);
        let cellIndicacion = row.insertCell(1);
        let cellHorario = row.insertCell(2);
        let cellEfectos = row.insertCell(3);
        let cellAcciones = row.insertCell(4);

        cellMedicamento.innerHTML = $nomMedicamento.value;
        cellIndicacion.innerHTML = $indMedicamento.value;
        cellHorario.innerHTML = $horarioMedicamento.value;
        cellEfectos.innerHTML = $efectosMedicamento.value;
        cellAcciones.innerHTML = '<button class="eliminar-fila btn btn-warning">x</button>';

        $nomMedicamento.value = "";
        $indMedicamento.value = "";
        $horarioMedicamento.value = "";
        $efectosMedicamento.value = "";
    }

});



document.getElementById("tbMedicamentos").addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar-fila")) {
        var row = event.target.closest("tr");
        row.parentNode.removeChild(row);
    }
});



if ($formEnfermera) {
    $formEnfermera.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const tablaMedicamentos = document.getElementById("tbMedicamentos").querySelector("tbody");
        const rows = tablaMedicamentos.querySelectorAll("tr");
        const datamedicamentos = [];

        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length === 5) {
                const medicamento = cells[0].innerText;
                const indicacion = cells[1].innerText;
                const horario = cells[2].innerText;
                const efectosAdversos = cells[3].innerText;

                datamedicamentos.push({
                    medicamento,
                    indicacion,
                    horario,
                    efectosAdversos,
                });
            }
        });

        const sintomasJson = {
            cefalea: data.cefalea_enfermera_datos_sintomas ? data.cefalea_enfermera_datos_sintomas : "no",
            tinitus: data.tinitus_enfermera_datos_sintomas ? data.tinitus_enfermera_datos_sintomas : "no",
            fotopsia: data.fotopsia_enfermera_datos_sintomas ? data.fotopsia_enfermera_datos_sintomas : "no",
            mareos: data.mareos_enfermera_datos_sintomas ? data.mareos_enfermera_datos_sintomas : "no",
            ruidos_respiratorios: data.ruidrespiratorios_enfermera_datos_sintomas ? data.ruidrespiratorios_enfermera_datos_sintomas : "no",
            inapetencia: data.inapetencia_enfermera_datos_sintomas ? data.inapetencia_enfermera_datos_sintomas : "no",
            aumento_de_peso: data.aumtpeso_enfermera_datos_sintomas ? data.aumtpeso_enfermera_datos_sintomas : "no",
            poliurea: data.poliurea_enfermera_datos_sintomas ? data.poliurea_enfermera_datos_sintomas : "no",
            polifagia: data.polifagia_enfermera_datos_sintomas ? data.polifagia_enfermera_datos_sintomas : "no",
            polidipsia: data.polidipsia_enfermera_datos_sintomas ? data.polidipsia_enfermera_datos_sintomas : "no",
            disnea: data.disnea_enfermera_datos_sintomas ? data.disnea_enfermera_datos_sintomas : "no",
            fatiga: data.fatiga_enfermera_datos_sintomas ? data.fatiga_enfermera_datos_sintomas : "no",
            nauseas: data.nauseas_enfermera_datos_sintomas ? data.nauseas_enfermera_datos_sintomas : "no",
            //icrutia: data.icrutia_enfermera_datos_sintomas ? data.icrutia_enfermera_datos_sintomas : "no",
            debilidad: data.debilidad_enfermera_datos_sintomas ? data.debilidad_enfermera_datos_sintomas : "no",
            estrenimiento: data.estrenimiento_enfermera_datos_sintomas ? data.estrenimiento_enfermera_datos_sintomas : "no",
            dolor_en_pies: data.dolorpies_enfermera_datos_sintomas ? data.dolorpies_enfermera_datos_sintomas : "no",
            falta_de_sensibilidad_en_pies: data.faltasensipies_enfermera_datos_sintomas ? data.faltasensipies_enfermera_datos_sintomas : "no"
        };

        const dataSend = {
            Id_usuario: parseInt(atencionData.idPaciente, 10),
            Id_cliente: parseInt(atencionData.idCliente, 10),
            CuestionarioID: null,
            SignosVitales: null,
            PresionArterial: null,
            Glicemia: null,
            Diagnostico: data.diagnostico_enfermera_datos,
            FechaDiagnostico: null,
            AntecedentesFamiliares: data.Antfamiliares_enfermera_datos,
            FechaUltimoControl: data.dateultControl_enfermera_datos ? data.dateultControl_enfermera_datos : null,
            Sintomas: JSON.stringify(sintomasJson),
            Medicamentos: JSON.stringify(datamedicamentos),
            ExamenesIndicaciones: data.examenes_enfermera_datos,
            FechaUltimosExamenes: data.datexamen_enfermera_datos ? data.datexamen_enfermera_datos : null,
            ExamenesNormales: data.examennormal_enfermera_datos === "si" ? true : false,
            Id_atencion: idAtencion,
            Observaciones: data.observaciones_enfermera_datos
        };

        if (!cuestionario.estado) {
            let tabaco = data.tabaco_enfermera_datos === "si" ? true : false;
            let actividad = data.actfisica_enfermera_datos_sintomas === "si" ? true : false;
            const result = await ProgramaSaludCuestionario(1, atencionData.idPaciente, data.edad_enfermera_datos, null, data.peso_enfermera_datos, data.talla_enfermera_datos, tabaco, actividad, null, atencionData.idCliente);
            if (result.status === "OK") {
                const datosCuestionario = await getProgramaSaludCuestionario(1, atencionData.idCliente, atencionData.idPaciente);
                dataSend.CuestionarioID = datosCuestionario.id ? datosCuestionario.id.toString() : null;
            }
        } else {
            let edad = data.edad_enfermera_datos;
            let sexo = cuestionario.data.sexo;
            let peso = data.peso_enfermera_datos;
            let altura = data.talla_enfermera_datos;
            let tabaco = data.tabaco_enfermera_datos === "si" ? true : false;
            let actividad = data.actfisica_enfermera_datos_sintomas === "si" ? true : false;;
            let especificar = null;
            let id = cuestionario.data.id;
            const result = await UpdateProgramaSaludCuestionario(1, atencionData.idPaciente, edad, sexo, peso, altura, tabaco, actividad, especificar, atencionData.idCliente, id);
            if (result.status === "OK") {
                dataSend.CuestionarioID = cuestionario.data.id.toString();
            }
        }
        console.log(dataSend);
        const respuestaFormulario = await InsertProgramaSaludFormularioEnfermera(dataSend);
        if (respuestaFormulario.status === "OK") {
            Swal.fire("Formulario guardado.", null, "success");
        } else {
            Swal.fire("Por favor, complete todos los campos del formulario e inténtelo nuevamente.", null, "warning");
        }
    });
};

