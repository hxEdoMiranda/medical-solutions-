import { datosUsuario, personaFotoPerfil } from "../shared/info-user.js";
import { TipoAtencion, validarIdentificacion } from "../apis/medipass-fetch.js";
import { putAgendarMedicosHoras } from '../apis/agendar-fetch.js';
var numDoc;
var baseUrl = new URL(window.location.href); //url base para servicios.
var idBloque = 596 // 68106; //desa
var idMedicoHora = 189086 // 10397; //desa


export async function init(data, urlPaso1) {
	
    if (especialidad == 4 && idCliente == 148) {
        document.getElementById('divNumDoc').hidden = true
    }
	
	if (uid == 729152)
		 document.getElementById('divNumDoc').hidden = true
    await datosUsuario();
    await personaFotoPerfil();
    let page = document.getElementById('page');
    page.innerHTML = "Agendar atención";
    if (tipoatencion == "I")
        page.innerHTML = "Atención Inmediata";

    document.querySelector('#buttonConfirma').addEventListener("click", () => loadEdit(event), false);

    // Input Info
    let inputInfo = document.getElementById('input-info');
    let tipDoc = document.getElementById('tipDoc');
    let btnClose = document.getElementById('btnClose');

    // Mostrar Tip
    inputInfo.addEventListener('click', () => {
        event.preventDefault()
        tipDoc.classList.add('show-tip');
    });

    // Cerrar Tip
    btnClose.addEventListener('click', () => {
        event.preventDefault()
        tipDoc.classList.remove('show-tip');
    })
    if ($("#numeroDocumento").length) {
        $("#numeroDocumento").bind("keypress", function (e) {
            if (e.keyCode == 13) {
                return false;
            }
        });
        $("#numeroDocumento").blur(function () {
            numDoc = document.getElementById('numeroDocumento').value.replace(/\./g, '');
            document.getElementById('numeroDocumento').value = numDoc;
        });
    }


    async function loadEdit(event) {
        event.preventDefault();

        if (document.getElementById('aceptaTerminos').checked) {
            var rut = document.getElementById("rut").value.split('-');
            var numeroDocumento = numDoc;



            var respuesta = await validarIdentificacion(rut[0], rut[1], numeroDocumento);
            var url = "";

            if ((idCliente == 148 || idCliente == 108) && especialidad == 4) { // 148 = colmena, 108 coopeuch
                respuesta.estado = 1;
            }
			if (uid == 729152)
				 respuesta.estado = 1;
			 
            if (respuesta.estado == 1) {

                if (tipoatencion == "I") {
                    var idsesion = "";
                    switch (idCliente) {
                        case 148:
                            var atencionAhora = moment().format("HH:mm");
                            if (especialidad == 4) {
                                if (atencionAhora < "18:00" || atencionAhora > "19:58") {//se deja a las 19 la restrccion por peticion de consuelo cifuentes.
                                    Swal.fire({
                                        title: 'Lo sentimos!',
                                        html: `<p>Las últimas horas pediátricas han sido ocupadas! Te recomendamos volver en el siguiente bloque de atención.</p><br>
                        <p>Tarde: 18:00 a 19:58</p><br>
                        <p style="font-size: 12px;
                        font-style: italic;
                        font-weight: bold;">*Te recomendamos llegar 15 minutos antes del horario de cierre</p>`,
                                        type: 'warning',
                                        confirmButtonText: 'Ok',
                                    });
                                    return
                                }
                            }
                            idsesion = "COLMENA";
                            break;
                        case 108: idsesion = "COOPEUCH";
                            break;
                        default: break;
                    }
                    let agendar = {
                        id: 0,
                        idBloqueHora: idBloque,
                        idPaciente: uid,
                        IdMedicoHora: idMedicoHora,
                        Estado: 'P',
                        idCliente: parseInt(idCliente),
                        idEspecialidadFilaUnica: especialidad,
                        idSesionPlataformaExterna: idsesion
                    };


                    let valida = await putAgendarMedicosHoras(agendar, 0, uid);
					
                    if (valida !== 0) {
                        url = "/Paciente/Agenda_3" + "?idMedicoHora=" + valida.infoAtencion.idHora + "&idMedico=" + valida.infoAtencion.idMedico + "&idBloqueHora=" + valida.atencionModel.idBloqueHora + "&fechaSeleccion=" + valida.infoAtencion.fecha + "&hora=" + valida.infoAtencion.horaDesdeText + "&horario=True&idAtencion=" + valida.infoAtencion.idAtencion + "&m=2&r=2&c=" + c + "&tipoatencion=I&especialidad=" + especialidad;
                        window.location.href = url;
                    }
                    else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");

                    }


                }
                else {
                    url = "/Paciente/Agenda_2" + "?idMedico=" + idMedico + "&fechaPrimeraHora=" + fechaPrimeraHora + "&m=" + m + "&r=" + r + "&c=" + c + "&especialidad=" + especialidad;
                    window.location.href = url;
                }


            } else {
                Swal.fire(
                    '',
                    'El número de documento no es válido.',
                    'warning'
                )
            }
        } else {
            Swal.fire(
                '',
                'Debes aceptar los términos y condiciones.',
                'warning'
            )
        }
    }

};
