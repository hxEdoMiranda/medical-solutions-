import { personByUser } from '../apis/personas-fetch.js';
import { putAgendarMedicosHoras } from '../apis/agendar-fetch.js';

var datosPaciente = await personByUser(uid);


export async function init(data) {
    if ($("#agendarOcupacional").length) {
        let btnAgendarInformeAtencion = document.getElementById("agendarOcupacional");
        btnAgendarInformeAtencion.onclick = async () => {
            debugger;
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
                idBloqueHora: parseInt(data.idBloqueHora),
                fechaText: data.fechaHora.substring(0, 10),
                triageObservacion: '',
                antecedentesMedicos: '',
                idPaciente: uid,
                SospechaCovid19: false,
                IdMedicoHora: parseInt(data.idMedicoHora),
                Estado: 'P',
                AceptaProfesionalInvitado: false,
                idCliente: parseInt(idCliente)
            };
            let valida = await putAgendarMedicosHoras(agendar, 0, uid);
            if (valida !== 0) {

                var url = `/Paciente/Agenda_3?idMedicoHora=${valida.infoAtencion.idHora}&idMedico=${data.idMedico}&idBloqueHora=${valida.atencionModel.idBloqueHora}&fechaSeleccion=${data.fechaHora.substring(0, 10)}&hora=${data.horaDesdeText}&horario=True&idAtencion=${valida.infoAtencion.idAtencion}&m=1&r=1&c=${data.idConvenio}&tipoatencion`;
                window.location.href = url;
            }
            else {
                Swal.fire("Error!", "Ha ocurrido un problema. Intente nuevamente.", "error");

            }
        }
    }
}
