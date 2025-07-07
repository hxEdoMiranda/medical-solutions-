import { enviarInforme, enviarInformeMedico } from '../apis/correos-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js";
import { createReport, apiFarmacia, getAtencion, guardarPharol } from "../apis/atencion-fetch.js";
import { cambioEstado } from "../apis/eniax-fetch.js";
import { logPacienteViaje } from '../apis/personas-fetch.js?6';
export async function init(data) {

    await personaFotoPerfil();
    let page = document.getElementById('page');
    page.innerHTML = "Informe de atención";
    page.setAttribute('style', '');
    const idAtencion = document.querySelector('[name="Atencion.Id"]').value;
    if (estadoEniax == "False") {
        if (!data.atencion.nsp) {
			
            await cambioEstado(idAtencion.toString(), "T") // o PAC?? -- Paciente Asiste a cita, por ahora deje T --Informe Listo
            await cambioEstado(idAtencion.toString(), "PAC")
            var log = {
                IdPaciente: data.atencion.idPaciente,
                Evento: "Envio data a eniax cita terminada",
                Info: "id atencion" + data.atencion.id,
                IdAtencion: data.atencion.id
            }
            await logPacienteViaje(log);
        }
        else {
            await cambioEstado(idAtencion.toString(), "PA") // PA = Paciente Ausente
        }
    }
    

  

    if ($("#btnEnviarInforme").length) {
        document.querySelector('#btnEnviarInforme').onclick = async() => {
            Swal.fire({
                title: "Enviar Informe de Atención",
                text: `¿Desea enviar el informe?`,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                confirmButtonText: "Sí, Enviar",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.value) {
                    $('#btnEnviarInforme').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true).attr('style', 'padding-right: 3.5rem;');
                    var result = await enviarInforme(idAtencion, baseUrlWeb);
                    await enviarInformeMedico(idAtencion, baseUrlWeb);
                    if (result.status === "OK") {
                        Swal.fire({
                            title: "Éxito!",
                            text: "Se envió el informe de forma exitosa",
                            type: "success",
                            confirmButtonText: "OK",
                        });
                    }
                    else {
                        Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");
                    }
                    $('#btnEnviarInforme').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false).removeAttr('style');
                }
            });
        };

    }
}