
import { getExamenesPreventivos, saveHistorialExamenesPreventivos, getArchivoExamen, getDataExamenPreventivo, validarExamenesPreventivos, getListExamenesPreventivos, rotacionFirmaMedica } from "../apis/examenes-fetch.js?rnd=10";
import { enviarExamenPreventivo } from '../apis/correos-fetch.js';
var ExamenesPreventivos = [];
var ListCodigoExamenes = [];
var generadoExamen = 0;
var urlDescarga = "";
var isChecked = 0;
export async function init() {    
    console.log(window.codigoTelefono);
    let puede = await validarExamenesPreventivos(window.uid);
    if (window.codigoTelefono == 'CL') {
        puede = true;
    }
    if (!puede && !location.origin.includes("demo.")) {
        document.getElementById('btnGetExamenes').disabled = true;
        document.getElementById('pesoExamenesPreventivos').disabled = true;
        document.getElementById('estaturaExamenesPreventivos').disabled = true;
        document.getElementById('edadExamenesPreventivos').disabled = true;
        Swal.fire("Lo sentimos!", "Ya has realizado las 2 solicitudes de exámenes preventivos en el año.", "warning").then((result) => {
            location.href = "/"
        })
    } else {
        window.onbeforeunload = function () {
            return "Seguro que quieres dejar la página, pérderas los datos ingresados?";
        };
    }

    if ($("#estaturaExamenesPreventivos").length > 0) {

        document.querySelector("#estaturaExamenesPreventivos").onchange = async () => {
            let estatura = document.getElementById('estaturaExamenesPreventivos').value;
            if (parseInt(estatura) > 0 && (estatura.length > 0)) {
                if (estatura.length > 3) {
                    estatura = estatura.slice(0, 3)
                }
                let estaturaDecimal = (Math.round(parseInt(estatura) * 10) / 1000).toFixed(2);
                if (estaturaDecimal > 1)
                    document.getElementById('estaturaExamenesPreventivos').value = estaturaDecimal;
                return true;
            }
            return false;
        }

        document.querySelector("#pesoExamenesPreventivos").onchange = async () => {
            let peso = document.getElementById('pesoExamenesPreventivos').value;
            if (parseInt(peso) > 0 && (peso.length > 0)) {
                if (peso.length > 3) {
                    peso = peso.slice(0, 3)
                }
                return true;
            }
            return false;
        }
    }

    
   
    if ($("#btnCheckExamenes").length > 0) {
        if (!puede && !location.origin.includes("demo.")) return;
        let btnCheckExamenes = document.getElementById('btnCheckExamenes');
        btnCheckExamenes.onclick = async () => {
            document.getElementById('btnGetExamenes').disabled = false;
            let edad = document.getElementById('edadExamenesPreventivos').value;
            let estatura = document.getElementById('estaturaExamenesPreventivos').value;
            let peso = document.getElementById('pesoExamenesPreventivos').value;            
            
            if (edad.length < 1 || parseInt(edad) < 1) {
                Swal.fire("", "Debe ingresar su edad correctamente", "warning");
                return;
            }
            if (estatura.length < 1 || parseInt(estatura) < 1) {
                Swal.fire("", "Debe ingresar su estatura correctamente", "warning");
                return;
            }
            if (peso.length < 1 || parseInt(peso) < 1) {
                Swal.fire("", "Debe ingresar su peso correctamente", "warning");
                return;
            }
            var genero = "M";
            genero = document.getElementById('genero').value;
            ExamenesPreventivos = [];
            ExamenesPreventivos = await getExamenesPreventivos(window.uid, edad, peso, estatura, genero, idCliente);
            var divExamenes = document.getElementById("listaExamenes");
            divExamenes.innerHTML = "";

            if (ExamenesPreventivos.length > 0) {
                for (let i = 0; i < ExamenesPreventivos.length; i++) {
                    let divExamen = document.createElement("div");
                    divExamen.classList.add('item-lista-examenes');
                    let inputExamenes = document.createElement("input");
                    inputExamenes.id = "examen_" + i;
                    inputExamenes.type = "checkbox";
                    inputExamenes.checked = true;
                    inputExamenes.value = ExamenesPreventivos[i].codigo;let labelExamen = document.createElement("label");
                    labelExamen.innerText = ExamenesPreventivos[i].nombre;
                    
                    divExamen.appendChild(inputExamenes);
                    divExamen.appendChild(labelExamen);
                    
                    divExamenes.appendChild(divExamen);
                }

                document.getElementById('resultExamenes').classList.remove("d-none");
                document.getElementById('datos-paciente').classList.add("d-none");

            } else {
                document.getElementById('resultExamenes').classList.add("d-none");
                document.getElementById('datos-paciente').classList.remove("d-none");
            }

        
        }
    }

    function DownloadPdfExamenes(archivo) {
       archivo.forEach(item => {
            var id = item.idenc
            window.open(
                window.urlDescarga + '/agendamientos/archivo/DescargarArchivo?id=' + id,
                '_blank'
            );
        });
    };

    if ($("#btnGetExamenes").length) {
        let btnGetExamenes = document.getElementById('btnGetExamenes');
        btnGetExamenes.onclick = async () => {  
            
            $('#listaExamenes  input').each(function (i, ob) { 
                if ($(ob).is(":checked")) {
                    isChecked = 1;
                    ListCodigoExamenes.push($(ob).val());
                }
            });
            if(isChecked == 0) {
                Swal.fire("", "Debes seleccionar por lo menos un exámen del listado", "warning");
                isChecked == 0
                return;
            }
            if (generadoExamen == 1) {
                DownloadPdfExamenes(urlDescarga);
                return;
            } else {
                btnGetExamenes.innerText = "Generando...";
            }
            $("#btnGetExamenes").addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
            let edad = document.getElementById('edadExamenesPreventivos').value;
            let estatura = document.getElementById('estaturaExamenesPreventivos').value;
            let peso = document.getElementById('pesoExamenesPreventivos').value;
            let examenes = {
                IdUsuario: window.uid,
                Edad: parseInt(edad),
                estatura: parseFloat(estatura).toFixed(2),
                peso: parseInt(peso),
                Examenes: ListCodigoExamenes,
                IdCliente: window.idCliente

            };
            
            let rotarMedico = await rotacionFirmaMedica()
            let historial = await saveHistorialExamenesPreventivos(examenes);
            let archivo = null;
            if (historial) {
                let dataExamen = await getDataExamenPreventivo(historial);
                if (dataExamen) {
                    
                    document.getElementById("fechaInforme").innerText = dataExamen.fechaInforme;
                    document.getElementById("nombreMedico").innerText = dataExamen.medico.prefijoProfesional + " " + dataExamen.medico.nombreCompleto;
                    document.getElementById("especialidadMedico").innerText = dataExamen.medico.especialidad;
                    document.getElementById("rutMedico").innerText = dataExamen.medico.rut;
                    document.getElementById("regMedico").innerText = dataExamen.medico.numeroRegistro;
                    document.getElementById("nombrePaciente").innerText = dataExamen.paciente.nombreCompleto;
                    document.getElementById("domicilioPaciente").innerText = dataExamen.paciente.domicilio;
                    document.getElementById("rutPaciente").innerText = dataExamen.paciente.rut;
                    document.getElementById("edadPaciente").innerText = dataExamen.paciente.edad;
                    let uiExamenes = document.getElementById("listaExamenesfinal");
                    dataExamen.examenes.forEach(function (elem) {
                        let liExamen = document.createElement("li");
                        liExamen.innerText = elem.nombre;
                        uiExamenes.appendChild(liExamen);
                    });

                    $("#modalBody").removeClass("d-none");
                    $("#modalBodyPre").addClass("d-none");

                }
                archivo = await getListExamenesPreventivos(historial, "EXAMEN-PREVENTIVO", "A2");
                btnGetExamenes.removeAttribute("disabled");
                if (archivo && archivo.length > 0 && archivo[0].rutaVirtual) {
                    $('#btnGetExamenes').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').removeAttr('style');
                    btnGetExamenes.innerText = "Descargar";
                    urlDescarga = archivo;
                    generadoExamen = 1;
                    //enviar examen
                    let resCorreo = await enviarExamenPreventivo(historial, window.idCliente);

                    //DownloadPdfExamenes(archivo[0].idenc);

                }
                
            } else {
                $('#listaExamenes  input').each(function (i, ob) {                    
                    $(ob).attr('disabled', 'false')
                });
            }
            

        }
    }

    if ($("#btn-agendar-examenes").length) {
        let btnAgendarExamenes = document.getElementById("btn-agendar-examenes");
        btnAgendarExamenes.onclick = async () => {
            window.open(
                'https://examedi.com/widget/medismart/',
                '_blank'
            );
        }
    }




}
