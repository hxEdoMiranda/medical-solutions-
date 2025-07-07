import { consultarCuestionario, guardarRespuesta, guadarRespuestasOcupacional, validateTestOcupacionalForCreatePdf } from '../apis/nom035-fetch.js';
import { personaFotoPerfil } from "../shared/info-user.js";
import { personByUser } from '../apis/personas-fetch.js';


var datosPaciente = await personByUser(uid);
var secciones;
var preguntas = null;
var totalPreguntasVisualizadas = 0;
var inicioPreguntaSeccion = 0;
var finPreguntaSeccion = 10;
var seccionActual = 0;
var percent = 0;
var porcentajeSeccion = 0;
var totalPreguntas = 0;
var indexPreguntas = -1;
var clicky = 1


function guardarRespuestas(event = null, idPregunta, idOpcion, tipo) {
    if(event != null){
        event.preventDefault()
    }

    var textInput = "";
    if (tipo == 2) {
        var idInput = "respuesta_" + idPregunta;
        textInput = document.getElementById(idInput).value;
        guadarRespuestasOcupacional(idPregunta, idOpcion, datosPaciente.id, textInput);
        clicky = 1;
        return;
    }

    for (var x = 0; x < $("button[id^='respuesta_']").length; x++) {
        if ($("button[id^='respuesta_']").hasClass("btn-success", "btn-guardar-info")) {
            $("button[id^='respuesta_']").removeClass("btn-success", "btn-guardar-info");
        }
    }
    if(event != null){
        textInput = document.getElementById(event.srcElement.id).classList.add("btn-success", "btn-guardar-info");
    }else{
        textInput = document.getElementById('SiguienteOcupacional').classList.add("btn-success", "btn-guardar-info");
    }
    guadarRespuestasOcupacional(idPregunta, idOpcion, datosPaciente.id);
    clicky = 1;
}

export async function init(dataCuestionarios) {

    if (dataCuestionarios.preguntas[0].assets.length != 0) {
        var dataLeft = dataCuestionarios.preguntas.filter(x => x.assets[0].asset_url.includes("LEFT"));
        var dataRigth = dataCuestionarios.preguntas.filter(x => x.assets[0].asset_url.includes("RIGTH"));
        dataCuestionarios.preguntas = dataLeft.concat(dataRigth);
    }

    preguntas = dataCuestionarios.preguntas;

    totalPreguntas += preguntas.length;

    $('#SiguienteOcupacional').on('click', function (ev) {
        ev.preventDefault();

        $('#icon-test-audiometria').hide()
        $('#icon-test-visiometria').hide()
        $('#icon-test-psicologia').hide()

        var inputValue= $("input[id^='respuesta_']")[0]?.value;

        if (inputValue != undefined) {
            if (preguntas[0].assets.length == 0) {
                inputValue = [];
                if($("input[id^='respuesta_']:checked").length != ($("input[id^='respuesta_']").length)/4){
                    Swal.fire("Error", "Debes responder todas las preguntas para continuar.");
                    return;
                }
                if($("input[id^='respuesta_']:checked").length != 0){
                    for(let i = 0; i < $("input[id^='respuesta_']:checked").length; i++){ 
                        let dataFindQuestions = preguntas.find(x => x.id_pregunta == $("input[id^='respuesta_']:checked")[i].name);
                        inputValue = inputValue.concat($("input[id^='respuesta_']:checked")[i].value);
                        guardarRespuestas(null, $("input[id^='respuesta_']:checked")[i].name, $("input[id^='respuesta_']:checked")[i].value, inputValue, dataFindQuestions.tipo_pregunta);
                    };
                }
            }
        }

        if (inputValue != null && inputValue < 0 || inputValue == "") {
            Swal.fire("Error", "Debe responder la pregunta para continuar.");
            return;
        }

        if (clicky == 0) {
            Swal.fire("Error", "Debe responder la pregunta para continuar.");
            return;
        }

        if (indexPreguntas >= totalPreguntas) {
            validateTestOcupacionalForCreatePdf(datosPaciente.id, uid);
            window.location = "/Cuestionario/FinalCuestionarioOcupacional";
            return 0;
        }

        var element;

        if (inputValue != undefined) {
            if (preguntas[0].assets.length == 0) {
                element = document.getElementById("steps_" + ((indexPreguntas/10 )+ 1));
            }
            else{
                indexPreguntas += 1;
                element = document.getElementById("steps_" + (indexPreguntas + 1));
            }
        }
       else{
            indexPreguntas += 1;
            element = document.getElementById("steps_" + (indexPreguntas + 1));
        }
        
        console.log((indexPreguntas + 1))
        if (element != null) {
            element.classList.add("passed")
        }
        else {
            validateTestOcupacionalForCreatePdf(datosPaciente.id, uid);
            window.location = "/Cuestionario/FinalCuestionarioOcupacional";
            return 0;
        }

        $('#div-ocupacional').empty();
        $('#div-preguntas-ocupacional').empty();
        if (preguntas[indexPreguntas].assets.length > 0) {
            if (preguntas[indexPreguntas].assets[0].tipo_asset == 1) {
                if (indexPreguntas == 0) {
                    Swal.fire({
                        title: "Información",
                        html:
                            "¡Bienvenido/a a su prueba de visión! Se evaluará su capacidad para ver letras, leer frases y distinguir numero en una serie de pasos. En particular, le pedimos que  <b>tape su ojo izquierdo</b> durante la prueba. Esto nos permitirá evaluar específicamente su capacidad visual en el ojo derecho."
                    });
                }
                if (indexPreguntas == (preguntas.length/2)) {
                    Swal.fire({
                        title: "Información",
                        html: "¡Excelente! Ahora le pedimos que destape su ojo izquierdo y <b>tape su ojo derecho</b> para continuar con la prueba. De esta manera, podremos evaluar también la capacidad visual de su ojo izquierdo."
                    });
                }
                $("#div-ocupacional").append('<img width="200px" height="200px" src="' + window.origin + preguntas[indexPreguntas].assets[0].asset_url + '"/>');
            }
            else if (preguntas[indexPreguntas].assets[0].tipo_asset == 2) {
                if (indexPreguntas == 0) {
                    Swal.fire({
                        title: "Información",
                        html: "¡Bienvenido/a a su prueba de audiometría! se evaluará la capacidad de su oído para escuchar diferentes sonidos. le pedimos que esté especialmente <b>atento/a al oído izquierdo</b> durante la prueba."
                    });
                }
                if (indexPreguntas == (preguntas.length/2)) {
                    Swal.fire({
                        title: "Información",
                        html: "¡Muy bien! Ahora es momento de cambiar de atención auditiva. Le pedimos que preste atención a su oído derecho durante la prueba y que ya no preste atención <b>a su oído derecho.</b>"
                    });
                }
                $("#div-ocupacional").append('<audio controls><source type="audio/mp3" src="' + window.origin + preguntas[indexPreguntas].assets[0].asset_url + '"></audio>');
            }
        }

        //$("#div-preguntas-ocupacional").append('<img width="100px" height="100px" src="' + preguntas[0].questions[indexPreguntas].upload_photo + '"/>');
        $("#div-preguntas-ocupacional").append('<div class="form-group"><label id="texto-pregunta" class="form-label">' + preguntas[indexPreguntas].texto_pregunta + '</label></div>');
        if (preguntas[indexPreguntas].tipo_pregunta == 1) {
            if (preguntas[indexPreguntas].assets.length == 0) {

                var estructura = "";
                var idR = 0;
                var preguntaNumber = preguntas[finPreguntaSeccion].question_number;
                var textoPregunta = "";
                var rangoPreguntasInicio = 0;

                for (var p = 0; p < finPreguntaSeccion; p++) {
                    estructura = '<div class="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"><div class="preguntas_box" style="width: 100%; margin-bottom: 1em;"> ';
                    estructura += 
                        '<div class="test_innerbox card-profile">' +
                        '<div class="form-group">';
                    estructura += '<div class="row"><h4> <span>' + (indexPreguntas + 1) + '. </span>' + preguntas[indexPreguntas].texto_pregunta + '</h4></div></div>';
                    for (let i = 0; i < preguntas[indexPreguntas].opcionesRespuesta.length; i++) {
                        $('#btnHome035').hide()
                        $('#texto-pregunta').hide()
                        $('#contenedor-psico')
                        clicky = 0
                        let questionId = preguntas[indexPreguntas].id_pregunta;
                        let questionOption = preguntas[indexPreguntas].opcionesRespuesta[i];
                        let optionId = preguntas[indexPreguntas].opcionesRespuesta[i].id_preguntaopciones;
                        var identificadorPregunta = '<div class="form-group"><label for="' + optionId + '" class="form-label">' + questionOption.texto_preguntaopcion + '</label> <INPUT TYPE="Radio" Name="' + questionId + '" ID="respuesta_' + optionId + '" Value="' + questionOption.id_preguntaopciones + ' "></div>';
                        textoPregunta += '<div class="form-group">' + identificadorPregunta + '</div>';
                    }
                    estructura += '<div class="test_selectmultiple">' + textoPregunta + '</div></div></div></div></div></div>';
                    textoPregunta = "";

                    estructura += '</div></div>';
                    $("#div-preguntas-ocupacional").append(estructura);
                    estructura = '<br/><div class="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"><div class="preguntas_box" style="width: 100%;"> ';
                    indexPreguntas++;
                }
            }

            else {
                for (let i = 0; i < preguntas[indexPreguntas].opcionesRespuesta.length; i++) {
                    clicky = 0
                    let questionId = preguntas[indexPreguntas].id_pregunta;
                    let questionOption = preguntas[indexPreguntas].opcionesRespuesta[i];
                    let optionId = preguntas[indexPreguntas].opcionesRespuesta[i].id_preguntaopciones;
                    $("#div-preguntas-ocupacional").append('<div class="form-group"><button id="respuesta_' + optionId + '" class="btn success">' + questionOption.texto_preguntaopcion + '</button></div>');
                    document.getElementById("respuesta_" + optionId).addEventListener("click", (e) => guardarRespuestas(e, questionId, questionOption.id_preguntaopciones, 1), true);
                }
            }
        } else if (preguntas[indexPreguntas].tipo_pregunta == 2) {
            let questionId = preguntas[indexPreguntas].id_pregunta;
            let questionOption = preguntas[indexPreguntas].opcionesRespuesta[0].id_preguntaopciones;
            let inputId = "respuesta_" + questionId;
            let respuestaTexto = "";
            if (preguntas[indexPreguntas].respuestas.length > 0)
                respuestaTexto = preguntas[indexPreguntas].respuestas[0].texto_respuesta;
            if (preguntas[indexPreguntas].opcionesRespuesta[0].texto_preguntaopcion == 'numerico') {
                $("#div-preguntas-ocupacional").append('<div class="form-group"><input id="' + inputId + '" value="' + respuestaTexto + '" type="number" class="form-control"></input></div>');
            }
            else {
                $("#div-preguntas-ocupacional").append('<div class="form-group"><input id="' + inputId + '" value="' + respuestaTexto + '" class="form-control"></input></div>');
            }

            document.getElementById(inputId).addEventListener("blur", (e) => guardarRespuestas(e, questionId, questionOption, 2), true);

        }


        document.getElementById("SiguienteOcupacional").innerText = "Siguiente";
    });
}
