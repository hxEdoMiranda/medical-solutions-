
import { logPacienteViaje,cambioIdCliente} from '../apis/personas-fetch.js?7';
import { putEliminarAtencion, confirmaPaciente, reagendarApp } from '../apis/agendar-fetch.js';
import { getHoraMedicoByCalendar, getAtencionPendienteSala } from '../apis/vwhorasmedicos-fetch.js?1';
import { putAgendarMedicosHoras, getAtencionByIdMedicoHora } from '../apis/agendar-fetch.js';
import { putVolverSala, getHorasBloqueadasPendientes } from "../apis/atencion-fetch.js?1";
var idConvenio = 0;
var idBloque = 596 // 68106; //desa
export async function init() {
    //ESTO ESTÁ PUESTO PARA MAS PROTECCION SALUD -- ATENCIÓN DIRECTA DESDE EL MENU PACIENTE
    if ($("#btnAtencionDirectaGeneralMenuMobile").length > 0) {
        let btnMGMenuMobile = document.getElementById("btnAtencionDirectaGeneralMenuMobile");
        btnMGMenuMobile.onclick = async () => {
            btnMGMenuMobile.setAttribute('disabled', true);
            $('#modal-caja-cargando').modal('show');
            await atencionMgLayout();
        }
    }

    if ($("#btnAtencionDirectaGeneralMenu").length > 0) {
        let btnMGMenu = document.getElementById("btnAtencionDirectaGeneralMenu");
        btnMGMenu.onclick = async () => {
            btnMGMenu.setAttribute('disabled', true);
            $('#modal-caja-cargando').modal('show');
            await atencionMgLayout();
        }
    }

    async function atencionMgLayout() {
         idBloque = 596 // 68106; //desa
        var idMedicoHora = 189086 // 10397; //desa
        var idEmpresa = window.idCliente ? window.idCliente : 0;
        if (parseInt(idEmpresa) != 0) {
            window.idCliente = parseInt(idEmpresa);
            var cambioCliente = await cambioIdCliente(idCliente);
            if (cambioCliente == "ok") {
            }
        }
        var especialidad = 1;
        var log = {
            IdPaciente: uid,
            Evento: "Paciente presiona medicina general inmediata.",
            Info: "idCliente = " + idCliente
        }
        await logPacienteViaje(log);

        //LLAMAR A PROXIMAS HORAS Y HORAS BLOQUEADAS            
        var data = await getHorasBloqueadasPendientes(window.uid, idEmpresa);
        if (!data)
            return;
        var dataDirecta = data.filter(itemF => itemF.atencionDirecta && itemF.estadoAtencion == "I" && itemF.idEspecialidadFilaUnica == 1)

        var filtro = filtrarAtencionVigente(dataDirecta)
        if (filtro == 1)
            return;
        idConvenio = 46;

        var url = `/Paciente/Agenda_1?idMedico=0&fechaPrimeraHora=${moment().format("YYYY-MM-DD")}&m=2&r=2&c=${idConvenio}&especialidad=1&tipoatencion=I`
        var atencionPendienteSala = await AtencionPendiente(uid, 1, parseInt(idCliente));
        if (atencionPendienteSala === 0) {
            var restriccion = restriccionTiempo(parseInt(idCliente), 1)
            if (restriccion == false) {
                return;
            }
            var sessionPlataforma = 'MEDISMART';


            //atención inmediata sin pago
            let agendar = {
                id: 0,
                idBloqueHora: idBloque,
                idPaciente: uid,
                IdMedicoHora: idMedicoHora,
                Estado: 'P',
                idCliente: parseInt(idCliente),
                idEspecialidadFilaUnica: especialidad,
                idSesionPlataformaExterna: sessionPlataforma
            };

            let btnMGMenu = document.getElementById("btnAtencionDirectaGeneralMenu");
            let btnMGMenuMobile = document.getElementById("btnAtencionDirectaGeneralMenuMobile");
            let valida = await putAgendarMedicosHoras(agendar, 0, uid);
            if (valida !== 0) {
                url = `/Paciente/Agenda_3?idMedicoHora=${valida.infoAtencion.idHora}&idMedico=${valida.infoAtencion.idMedico}&idBloqueHora=${valida.atencionModel.idBloqueHora}&fechaSeleccion=${valida.infoAtencion.fecha}&hora=${valida.infoAtencion.horaDesdeText}&horario=True&idAtencion=${valida.infoAtencion.idAtencion}&m=1&r=1&c=${idConvenio}&tipoatencion=I&especialidad=${especialidad}`;
                btnMGMenuMobile.setAttribute('disabled', false);
                btnMGMenu.setAttribute('disabled', false);
                window.location.href = url;
            }
            else {
                $('#modal-caja-cargando').modal('hide');
                btnMGMenuMobile.setAttribute('disabled', false);
                btnMGMenu.setAttribute('disabled', false);

            }
            window.location.href = url;
        }
    }
    //Atencion nsp 
    async function AtencionPendiente(uid, idEspecialidad, idCliente) {
        //descomentar return, cuando se cierre la fila, para no volver al flujo pacientes nsp
        //return;

        var atencionPendienteSala = await getAtencionPendienteSala(uid, idEspecialidad, idCliente);
        var texto = "¡Ups! Tienes una atención pendiente.";
        var titulo = "¡Ups! Tienes una atención pendiente.";
        var texto = "¿Quieres ingresar a la sala de espera?";
        var btnTextoConf = "Si, volver a la SALA";
        var btnTextoCanc = "No, volver al HOME";

        if (atencionPendienteSala.status == "OK") {
            var showCancel = true;
            if (idEspecialidad == 0)
                idEspecialidad = atencionPendienteSala.horasMedicos.idEspecialidadFilaUnica;
            let idAtencionFila = atencionPendienteSala.horasMedicos.idAtencion;

            Swal.fire({
                title: titulo,
                text: texto,
                showCancelButton: showCancel,
                cancelButtonText: btnTextoCanc,
                confirmButtonText: btnTextoConf,
                reverseButton: true,
                type: 'question',
            }).then(async (result) => {
                if (result.value) {
                    var restriccion = restriccionTiempo(idCliente, idEspecialidad)
                    if (restriccion == false) {
                        return;
                    }
                    var resp = await putVolverSala(idAtencionFila)
                    if (resp.status != "NOK") {
                        Swal.fire({
                            title: 'Serás redireccionado de forma automática a la sala de espera',
                            html: '',
                            timer: 7000,
                            // backdrop: false,
                            allowOutsideClick: false,
                            type: "success",
                            showConfirmButton: false,
                            timerProgressBar: true,

                        })
                        window.location = `/Ingresar_Sala_FU/${idAtencionFila}`;
                    }
                }
                if (result.dismiss == "cancel") {
                    Swal.fire({
                        title: '¿Estás seguro de eliminar esta atención?',
                        confirmButtonText: 'Si, eliminar',
                        reverseButton: true,
                        cancelButtonText: 'No',
                        type: 'question',
                        showCancelButton: true
                    }).then(async (result) => {
                        if (result.value) {
                            var valida = await putEliminarAtencion(idAtencionFila, uid);
                            if (valida.status !== "NOK") {
                                var log = {
                                    IdPaciente: uid,
                                    Evento: "Paciente Elimina atencion NSP",
                                    IdAtencion: parseInt(idAtencionFila)
                                }
                                await logPacienteViaje(log);
                                Swal.fire('', 'Atención eliminada', 'success');
                                location.reload();
                            }
                            else {
                                Swal.fire('', 'No fue posible anular esta atención, comuniquese con mesa de ayuda', 'error')
                            }
                        }

                    })

                }
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                   
                }
            })


            return 1;
        }
        else return 0;
    }


    if ($("#item-wallet").length) {
        let btn_itemwallet = document.getElementById("item-wallet");
        btn_itemwallet.onclick = async () => {
            location.href = '/PasarelaPago/HomeWallet';
            //'#modalPronto').modal('show');
        }
    }

}


function filtrarAtencionVigente(dataDirecta) {
    if (dataDirecta.length > 0) {

        dataDirecta.forEach(item => {
            var mensajeHtml = "¿Quieres Ingresar a la fila?";
            var mensajeConfirm = "¿Quieres ingresar a la sala de espera?";
            var redirect = `/Ingresar_Sala_FU/${item.idAtencion}`;
            var showCancel = true;
            var confirmText = "Si, volver a la SALA"


            if (item.idBloqueHora != idBloque && item.idMedicoHora != idMedicoHora) {
                //mensajeHtml = `<p>Atención con <strong>${item.nombreMedico}</strong> </br> especialidad <strong>${item.especialidad}</strong></p>`
                mensajeConfirm = '¿Quieres ingresar al box?';
                confirmText = "Si, volver al BOX"
                showCancel = false;
                redirect = `/Atencion_Box/${item.idAtencion}`;

            }
            var texto = "¡Ups! Hemos detectado que tienes una atención pendiente.";

            Swal.fire({
                title: texto,
                text: '¿Quieres ingresar a la sala de espera y recuperar tu turno?',
                showCancelButton: showCancel,
                cancelButtonText: 'No, volver al inicio',
                confirmButtonText: 'Sí, volver a la sala de espera',
                reverseButton: true,
                type: 'question',
            }).then(async (result) => {
                if (result.value) {
                    var restriccion = restriccionTiempo(idCliente, item.idEspecialidadFilaUnica)
                    if (restriccion == false) {
                        return;
                    }
                   
                    Swal.fire({
                        title: 'Serás redireccionado de forma automática a la atención',
                        html: '',
                        timer: 7000,
                        // backdrop: false,
                        allowOutsideClick: false,
                        type: "success",
                        showConfirmButton: false,
                        timerProgressBar: true,

                    })
                    window.location = redirect;

                }
                if (result.dismiss == "cancel") {
                    Swal.fire({
                        title: '¿Estás seguro de eliminar esta atención?',
                        confirmButtonText: 'Si, eliminar',
                        reverseButton: true,
                        cancelButtonText: 'No',
                        type: 'question',
                        showCancelButton: true
                    }).then(async (result) => {
                        if (result.value) {
                            var valida = await putEliminarAtencion(item.idAtencion, uid);
                            if (valida.status !== "NOK") {
                                var log = {
                                    IdPaciente: uid,
                                    Evento: "Paciente Elimina atencion sala de espera",
                                    IdAtencion: parseInt(item.idAtencion)
                                }
                                await logPacienteViaje(log);
                                Swal.fire('', 'Atención eliminada', 'success');
                                location.reload();
                            }
                            else {
                                Swal.fire('', 'No fue posible anular esta atención, comuniquese con mesa de ayuda', 'error')
                            }
                        }

                    })

                }
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                   
                }

            });
        });
        return 1;
    }
}

function restriccionTiempo(idCliente, idEspecialidad) {
    var atencionAhora = moment().format("HH:mm");
    switch (idCliente) {
        case 148:
            if (idEspecialidad == 1) {
                if (atencionAhora < "08:00" || atencionAhora > "23:50") {
                    Swal.fire("", "Te recordamos que los horarios para ingresar a una consulta inmediata de Medicina General son 08:00 - 23:59 Hrs.", "error")
                    return false;
                }
            }
            else if (idEspecialidad == 4) {
                if (atencionAhora < "18:00" || atencionAhora > "20:58") {//se deja a las 19 la restrccion por peticion de consuelo cifuentes.
                    Swal.fire({
                        title: 'Lo sentimos!',
                        html: `<p>Las últimas horas pediátricas han sido ocupadas! Te recomendamos volver en el siguiente bloque de atención.</p><br>
                        <p>Tarde: 18:00 a 21:00</p><br>
                        <p style="font-size: 12px;
                        font-style: italic;
                        font-weight: bold;">*Te recomendamos llegar 15 minutos antes del horario de cierre</p>`,
                        type: 'warning',
                        confirmButtonText: 'Ok',
                    });
                    return false;
                }
            }
            break;
        case 108:
            break;
        default:
            if (idEspecialidad == 1) {
                var atencionDesde = "08:00";
                if (atencionAhora > "03:00" && atencionAhora < atencionDesde) {
                    //if (atencionAhora < "08:00" || atencionAhora > "21:59") {
                    Swal.fire("", `Te recordamos que los horarios para ingresar a una consulta inmediata de Medicina General son ${atencionDesde} - 03:00 Hrs.`, "error")
                    return false;
                }

            }

    }
}
