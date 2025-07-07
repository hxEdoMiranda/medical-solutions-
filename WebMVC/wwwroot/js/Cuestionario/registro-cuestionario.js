import { resultadosCuestionario1, resultadosCuestionario2, resultadosCuestionario3, terminarCuestionario, guardarRespuesta } from '../apis/nom035-fetch.js';


var secciones;
var preguntasTotalSeccion = 0;
var totalPreguntasVisualizadas = 0;
var inicioPreguntaSeccion = 0;
var finPreguntaSeccion = 8;
var seccionActual = 0;
var percent = 0;
var porcentajeSeccion = 0;
var totalPreguntas = 0;
var indexPreguntas = 0;
var clicky = 1



function cargarRespuestas() {
    return JSON.parse(localStorage.getItem('respuestasCuestionario') || '{}');
}

function guardarRespuestas(event, idPregunta, respuesta) {
    event.preventDefault();
    let respuestasActuales = cargarRespuestas();
    respuestasActuales[idPregunta] = respuesta;
    localStorage.setItem('respuestasCuestionario', JSON.stringify(respuestasActuales));

    // Refresca la interfaz para mostrar la respuesta actualizada

}


function actualizarBotones() {
    if (seccionActual === 0) {
        $('#RegresarP').hide();
    } else {
        $('#RegresarP').show();
    }
    if (seccionActual > 0) {
        $('#TerminarP').show();
    } else {
        $('#TerminarP').hide();
    }
}
function saveStateToLocalStorage() {
    localStorage.setItem('inicioPreguntaSeccion', inicioPreguntaSeccion);
    localStorage.setItem('finPreguntaSeccion', finPreguntaSeccion);
    localStorage.setItem('seccionActual', seccionActual);
}
function loadStateFromLocalStorage() {
    inicioPreguntaSeccion = parseInt(localStorage.getItem('inicioPreguntaSeccion')) || 0;
    finPreguntaSeccion = parseInt(localStorage.getItem('finPreguntaSeccion')) || 8;
    seccionActual = parseInt(localStorage.getItem('seccionActual')) || 0;
}


export async function init(dataCuestionarios) {
    //guardarTerminarCuestionario();
    secciones = dataCuestionarios.data;

    for (var i = 0; i < secciones.length; i++) {
        totalPreguntas += secciones[i].questions.length;
    }

    loadStateFromLocalStorage();

    // Guardar el estado inicial en localStorage
    saveStateToLocalStorage();

    // Dibujar la interfaz inicial con las preguntas de la primera sección
    dibujarInicial();

    // Actualizar los botones de navegación
    actualizarBotones();
    $('#SiguienteP').on('click', async function (ev) {
        MostrarLoading(true);
        var guardado = await guardarPreguntasSeccion();
        if (guardado) {
            moverProgeso();
            if ((secciones.length - 1) == seccionActual && finPreguntaSeccion >= preguntasTotalSeccion) {
                guardarTerminarCuestionario();
            } else {
                if (finPreguntaSeccion < preguntasTotalSeccion - 1) {
                    finPreguntaSeccion += 9;
                } else if (seccionActual < secciones.length - 1) {
                    seccionActual += 1;
                    inicioPreguntaSeccion = 0;
                    finPreguntaSeccion = 8;
                    preguntasTotalSeccion = secciones[seccionActual].questions.length - 1;
                }
                saveStateToLocalStorage();
                $("#divPreguntas").empty();
                dibujarInicial();
                actualizarBotones();
            }
        }
        MostrarLoading(false);
    });

    $('#RegresarP').on('click', function () {
        if (inicioPreguntaSeccion > 0) {
            finPreguntaSeccion = inicioPreguntaSeccion - 1;
            inicioPreguntaSeccion = Math.max(inicioPreguntaSeccion - 9, 0);
            saveStateToLocalStorage(); 
            location.reload();
        } else if (seccionActual > 0) {
            seccionActual -= 1;
            inicioPreguntaSeccion = 0;
            finPreguntaSeccion = Math.min(8, secciones[seccionActual].questions.length - 1);
            preguntasTotalSeccion = secciones[seccionActual].questions.length - 1;
            saveStateToLocalStorage();
            location.reload();
        } else {
            console.log("Ya está en la primera sección.");
        }
    });


    async function guardarTerminarCuestionario() {
        let objEncuesta = null;
        let objResultado = null;
        
        objEncuesta = {
            id_cuestionario_respondido: idCuestionario,
            id_usuario: idUsuarioBH,
            id_cuestionario: cuestionarioBH
        };

        var response = await terminarCuestionario(objEncuesta);
        if (response != "1") {
            Swal.fire("", "No fue finalizar la encuesta en el servicio ", "warning");
            return false;
        }

        objResultado = {
            id_usuario_medi: idUsuario,
            id_usuario: idUsuarioBH,
            id_encuesta: cuestionarioBH
        };

        var responseResultado = await resultadosCuestionario1(objResultado);

        if (responseResultado == "0") {
            Swal.fire("", "No fue posible Obtener los resultados, por favor contacte al administrador", "warning");
            return false;
        }
        if (responseResultado =="Requiere atención clínica")
            window.location = "/Cuestionario/FinalCuestionarioAgendar";
        else
            window.location = "/Cuestionario/FinalCuestionario";
    }

    $('#SiguienteOcupacional').on('click', async function (ev) {

        if (clicky == 0) {
            Swal.fire("Error", "Debe responder la pregunta pra continuar.");
            return;
        }

        if (!secciones[0].questions[indexPreguntas]) {
            console.log(respuestasOcupacional)
            window.location = "/Cuestionario/FinalCuestionario";
            return 0;
        }
        $('#div-ocupacional').empty();
        $('#div-preguntas-ocupacional').empty();
        moverProgeso();
        $("#div-ocupacional").append('<img width="200px" height="100px" src="https://previews.123rf.com/images/racorn/racorn1307/racorn130701808/21110406-fotograf%C3%ADa-de-un-modelo-de-mujer-joven-ocultando-su-ojo-izquierdo-colocando-su-mano-en-la-frente-.jpg"/>');
        $("#div-preguntas-ocupacional").append('<img width="100px" height="100px" src="' + secciones[0].questions[indexPreguntas].upload_photo +'"/>');
        $("#div-preguntas-ocupacional").append('<div class="form-group"><label class="form-label">' + secciones[0].questions[indexPreguntas].question + '</label></div>');
        for (let i = 0; i < secciones[0].questions[indexPreguntas].options.length; i++) {
            clicky = 0
            let questionId = secciones[0].questions[indexPreguntas].question_id;
            let questionOption = secciones[0].questions[indexPreguntas].options[i].question_option;
            let optionId = secciones[0].questions[indexPreguntas].options[i].option_id;
            $("#div-preguntas-ocupacional").append('<div class="form-group"><button id="respuesta_' + optionId + '" class="btn success">' + questionOption + '</button></div>');
            document.getElementById("respuesta_" + optionId).addEventListener("click",(e) => guardarRespuestas(e, questionId, questionOption), true);
        }
        indexPreguntas+=1;
        inicioPreguntaSeccion = finPreguntaSeccion + 1;
        if ((secciones.length - 1) == seccionActual) {
        }
        if ((secciones.length - 1) != seccionActual) {
            seccionActual += 1;
            inicioPreguntaSeccion = 0;
            finPreguntaSeccion = 9;
            //moverProgeso();
            dibujarInicial();
        }
        CambiarBloquePregunta();
    });

    async function guardarPreguntasSeccion() {
        let preguntas = secciones[seccionActual].questions;
        var jsonPreguntasSeccion = new Array();
        let objPreguntasSeccion = null;
        var validaRespuesta = true;

        if (inicioPreguntaSeccion == finPreguntaSeccion) {
            validaRespuesta = true;
            for (var opcion of preguntas[finPreguntaSeccion].options) {

                var identificadorPregunta = secciones[seccionActual].section_number + "_" + preguntas[finPreguntaSeccion].question_number + "_" + opcion.option_id;
                if ($("#" + identificadorPregunta).is(':checked')) {
                    validaRespuesta = false;
                    objPreguntasSeccion = {
                        id_cuestionario_respondido: idCuestionario,
                        id_usuario: idUsuarioBH,
                        id_cuestionario: secciones[seccionActual].questionnaire_id,
                        id_seccion: secciones[seccionActual].id_seccion,
                        id_pregunta: preguntas[finPreguntaSeccion].question_id,
                        id_opcion: opcion.option_id,
                        valor: parseInt(opcion.value),
                        id_preguntaopciones: parseInt(opcion.id_preguntaopciones),
                        id_pregunta_medi: parseInt(opcion.id_pregunta),
                        idCuestionarioPersona: parseInt(idCuestionarioPersona)
                    };
                    jsonPreguntasSeccion.push(objPreguntasSeccion)
                }
            }
            if (validaRespuesta) {
                Swal.fire("", "Es necesario responder todas las preguntas", "warning");
                return false;
            }
        } else {
            if ((preguntas.length - 1) < finPreguntaSeccion)
                finPreguntaSeccion = preguntas.length - 1;

            for (var j = inicioPreguntaSeccion; j <= finPreguntaSeccion; j++) {
                validaRespuesta = true;
                for (var opcion of preguntas[j].options) {
                    var identificadorPregunta = secciones[seccionActual].section_number + "_" + preguntas[j].question_number + "_" + opcion.option_id;
                    if ($("#" + identificadorPregunta).is(':checked')) {
                        validaRespuesta = false;
                        objPreguntasSeccion = {
                            id_cuestionario_respondido: idCuestionario,
                            id_usuario: idUsuarioBH,
                            id_cuestionario: secciones[seccionActual].questionnaire_id,
                            id_seccion: secciones[seccionActual].id_seccion,
                            id_pregunta: preguntas[j].question_id,
                            id_opcion: opcion.option_id,
                            valor: parseInt(opcion.value),
                            id_preguntaopciones: parseInt(opcion.id_preguntaopciones),
                            id_pregunta_medi: parseInt(opcion.id_pregunta),
                            idCuestionarioPersona: parseInt(idCuestionarioPersona)
                        };
                        jsonPreguntasSeccion.push(objPreguntasSeccion)
                    }
                }
                if (validaRespuesta) {
                    Swal.fire("", "Es necesario responder todas las preguntas", "warning");
                    return false;
                }
            }
        }
        
        for (var respuesta of jsonPreguntasSeccion) {
            var response = await guardarRespuesta(respuesta);
            if (response != "1") {
                Swal.fire("", "No fue posible guardar la respuesta de la pregunta " + respuesta.id_pregunta, "warning");
                return false;
            }
        }

        return true;
    }

    function moverProgeso() {
        percent = Math.round(100 / (totalPreguntas / (totalPreguntasVisualizadas)));
        $('#file').val(percent);

    }

    function dibujarInicial() {

        var seccionName = secciones[seccionActual].name;
        //encabezado(seccionName);

        let preguntas = secciones[seccionActual].questions;
        if (secciones[seccionActual].questions.length - 1 < finPreguntaSeccion)
            finPreguntaSeccion = secciones[seccionActual].questions.length - 1;


        preguntasTotalSeccion = secciones[seccionActual].questions.length - 1;

        var estructura = "";
        estructura = '<div class="form-group"><label class="form-label"><h5>' + seccionName + '</h5></label></div>';
        estructura += '<div class="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"><div class="preguntas_box"> ';
        var idR = 0;
        for (var i = inicioPreguntaSeccion; i <= finPreguntaSeccion; i++) {
            idR += 1;

            estructura += '<div class="col-lg-4 px-0 px-md-2">' +
                '<div class="container-fluid">' +
                '<div class="row">' +
                '<div class="col p-0">' +
                '<div class="test_innerbox card-profile">' +
                '<div class="form-group">';

            var preguntaName = preguntas[i].question;
            var preguntaNumber = preguntas[i].question_number;
            var circuloNumero = (parseInt(preguntas[i].question_number) < 10 ? ("0" + preguntas[i].question_number) : preguntas[i].question_number);
            totalPreguntasVisualizadas += 1;
            var textoPregunta = "";
            estructura += '<div class="row"><h4> <span>' + preguntaNumber + '. </span>' + preguntaName + '</h4></div></div>';
            for (var opcion of preguntas[i].options) {
                var opcioneSeleccionada = "";
             
                for (var respuesta of preguntas[i].respondido) {
                    opcioneSeleccionada = respuesta.option_id == opcion.option_id ? "checked" : "";
                }
                var identificadorPregunta = secciones[seccionActual].section_number + "_" + preguntas[i].question_number + "_" + opcion.option_id;
                textoPregunta += '<div class="form-group"><label for="' + identificadorPregunta + '" class="form-label">' + opcion.question_option + '</label> <INPUT TYPE="Radio" Name="' + idR + '" ID="' + identificadorPregunta + '" Value="' + opcion.value + '" ' + opcioneSeleccionada + ' ></div>';
                //textoPregunta += '<div class="form-group"> <INPUT TYPE="Radio" Name="' + idR + '" ID="' + identificadorPregunta + '" Value="' + opcion.value + '" ' + opcioneSeleccionada + ' ><label for="' + identificadorPregunta + '" class="form-label">' + opcion.question_option + '</label></div>';

                //var opcionName = opcion.value + " - " + opcion.question_option;
            }
            estructura += '<div class="test_selectmultiple">' + textoPregunta + '</div></div></div></div></div></div>';

            if (((i + 1) % 3) == 0) {
                estructura += '</div></div>';
                $("#divPreguntas").append(estructura);
                estructura = '<br/><div class="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"><div class="preguntas_box"> ';
                //cuerpo(preguntaName, jsonPreguntasSeccion);
            } else if (finPreguntaSeccion < 3 && i == finPreguntaSeccion) {
                estructura += '</div></div>';
                $("#divPreguntas").append(estructura);
            } else if (i == finPreguntaSeccion) {
                estructura += '</div></div>';
                $("#divPreguntas").append(estructura);
            }
        }


    }
    
    function CambiarBloquePregunta() {
        $("#divPreguntas").empty();
        let preguntas = secciones[seccionActual].questions;
        let respuestasActuales = cargarRespuestas();

        var seccionName = secciones[seccionActual].name;
        var estructura = '<div class="form-group"><label class="form-label"><h5>' + seccionName + '</h5></label></div>';
        estructura += '<div class="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"><div class="preguntas_box"> ';

        preguntas.forEach(pregunta => {
            estructura += crearEstructuraPregunta(pregunta, respuestasActuales);
        });

        estructura += '</div></div>';
        $("#divPreguntas").html(estructura);
    }

    function crearEstructuraPregunta(pregunta, respuestasActuales) {
        let estructuraPregunta = '<div class="col-lg-4 px-0 px-md-2">' +
            '<div class="container-fluid">' +
            '<div class="row">' +
            '<div class="col p-0">' +
            '<div class="test_innerbox card-profile">' +
            '<div class="form-group">' +
            '<div class="row"><h4> <span>' + pregunta.question_number + '. </span>' + pregunta.question + '</h4></div>';

        pregunta.options.forEach(opcion => {
            let isChecked = (respuestasActuales[pregunta.question_id] === opcion.question_option) ? "checked" : "";
            let identificadorPregunta = secciones[seccionActual].section_number + "_" + pregunta.question_number + "_" + opcion.option_id;
            estructuraPregunta += '<div class="form-group"><label for="' + identificadorPregunta + '" class="form-label">' + opcion.question_option + '</label> <INPUT TYPE="Radio" Name="' + pregunta.question_id + '" ID="' + identificadorPregunta + '" Value="' + opcion.value + '" ' + isChecked + ' ></div>';
        });

        estructuraPregunta += '</div></div></div></div></div>';
        return estructuraPregunta;
    }


    actualizarBotones();
    function MostrarLoading(mostrar) {
        if (mostrar) {
            $('#loaderNom35').addClass('d-flex justify-content-center bakg_loading');
            $('#loaderNom35').html('<div class="spinner-border" role="status"></div><br><span class="message_nom035">Un momento por favor...</span>');
        } else {
            $('#loaderNom35').fadeIn(10).html("");
            $('#loaderNom35').removeClass('d-flex justify-content-center bakg_loading');
        }
    }
}

