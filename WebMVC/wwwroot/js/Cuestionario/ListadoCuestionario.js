import { personaFotoPerfil } from "../shared/info-user.js";
import { getAtencion, getDestinatariosAsociados } from "../apis/atencion-fetch.js";
import { comprobantePaciente, comprobanteMedico, comprobanteProfesionalAsociados } from '../apis/correos-fetch.js?2';

import { TipoAtencion, certificacion, emitirPrebono, EmitirbonoParticular } from "../apis/medipass-fetch.js?10";
import { insertNewTests } from "../apis/nom035-fetch.js";
import { personByUser } from '../apis/personas-fetch.js';

var tipoAccion;
var connection;

export async function init(atencion) {

    var porcentajeC1 = $('#porcentajeC1');
    var btnC1 = $("#btnCuetionario1");
    if (Cuestionario1Avance > 0 && Cuestionario1Avance < 100) {
        porcentajeC1.removeClass('porcentaje_cero');
        porcentajeC1.removeClass('porcentaje_finalizado');
        porcentajeC1.addClass('porcentaje_pendiente');
    } else if (Cuestionario1Avance == 100) {
        porcentajeC1.removeClass('porcentaje_cero');
        porcentajeC1.removeClass('porcentaje_pendiente');
        porcentajeC1.addClass('porcentaje_finalizado');
        btnC1.empty();
        btnC1.append("FINALIZADA");
        btnC1.attr("disabled", true);
        btnC1.removeClass('btnCuestionarioHabilitado');
        btnC1.addClass('btnCuestionarioDeshabilitado');
    }


    var porcentajeC2 = $('#porcentajeC2');
    var btnC2 = $("#btnCuetionario2");
    if (Cuestionario2Avance > 0 && Cuestionario2Avance < 100) {
        porcentajeC2.removeClass('porcentaje_cero');
        porcentajeC2.removeClass('porcentaje_finalizado');
        porcentajeC2.addClass('porcentaje_pendiente');
    } else if (Cuestionario2Avance == 100) {
        porcentajeC2.removeClass('porcentaje_cero');
        porcentajeC2.removeClass('porcentaje_pendiente');
        porcentajeC2.addClass('porcentaje_finalizado');
        btnC2.empty();
        btnC2.append("FINALIZADA");
        btnC2.attr("disabled", true);
        btnC2.removeClass('btnCuestionarioHabilitado');
        btnC2.addClass('btnCuestionarioDeshabilitado');
    }


    var porcentajeC3 = $('#porcentajeC3');
    var btnC3 = $("#btnCuetionario3");
    if (Cuestionario3Avance > 0 && Cuestionario3Avance < 100) {
        porcentajeC3.removeClass('porcentaje_cero');
        porcentajeC3.removeClass('porcentaje_finalizado');
        porcentajeC3.addClass('porcentaje_pendiente');
    } else if (Cuestionario3Avance == 100) {
        porcentajeC3.removeClass('porcentaje_cero');
        porcentajeC3.removeClass('porcentaje_pendiente');
        porcentajeC3.addClass('porcentaje_finalizado');
        btnC3.empty();
        btnC3.append("FINALIZADA");
        btnC3.attr("disabled", true);
        btnC3.removeClass('btnCuestionarioHabilitado');
        btnC3.addClass('btnCuestionarioDeshabilitado');
    }

    var validationProgress = [];
    var testFinish = $("div[class^='porcentaje_pendiente']");
    for (let i = 0; i < testFinish.length; i++) {
        if (testFinish[i].outerText.includes("100%")) {
            validationProgress.push(true);
        } else {
            validationProgress.push(false);
        }
    }

    var persona = await personByUser(uid);
    
    if (document.referrer.includes("FinalCuestionarioOcupacional") && !validationProgress.includes(false)) {
        Swal.fire({
            title: "Información",
            text: "¡Felicitaciones! Ha completado exitosamente sus pruebas médicas. ¿Desea ser redirigido a su historial de visualización para ver sus resultados y obtener más información sobre su estado de salud?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.value) {
                window.location.href = location.origin + "/Paciente/HistorialCustom";
            }
        });
    } else if (!validationProgress.includes(false) && window.ocupacional == 1) {
		debugger
        var save = insertNewTests(persona.id);
        //Swal.fire('Guardado!', '', 'success')
        location.reload();
        //Swal.fire({
        //    title: "Información",
        //    text: "¿Desea iniciar un nuevo test ahora que los últimos ya han sido completados?",
        //    showDenyButton: true,
        //    showCancelButton: true,
        //    confirmButtonText: 'Aceptar',
        //    denyButtonText: 'Cancelar',
        //}).then((result) => {
        //    /* Read more about isConfirmed, isDenied below */
        //    if (result.value) {
        //        var save = insertNewTests(persona.id);
        //        //Swal.fire('Guardado!', '', 'success')
        //        location.reload();
        //    }
        //});
    }

    $('#btnCuetionario1').on('click', async function (ev) {
        // Resetea cualquier progreso guardado para que siempre inicie desde la primera sección
        localStorage.removeItem('inicioPreguntaSeccion');
        localStorage.removeItem('finPreguntaSeccion');
        localStorage.removeItem('seccionActual');
        // Redirige al cuestionario 1
        window.location = "/Cuestionario/RegistroCuestionario?cuestionario=1";
    });

    $('#btnCuetionario2').on('click', async function (ev) {
        localStorage.removeItem('inicioPreguntaSeccion');
        localStorage.removeItem('finPreguntaSeccion');
        localStorage.removeItem('seccionActual');
        window.location = "/Cuestionario/RegistroCuestionario2?cuestionario=2";
    });

    $('#btnCuetionario3').on('click', async function (ev) {
        localStorage.removeItem('inicioPreguntaSeccion');
        localStorage.removeItem('finPreguntaSeccion');
        localStorage.removeItem('seccionActual');
        window.location = "/Cuestionario/RegistroCuestionario2?cuestionario=3";
    });

}
