import { consultarCuestionario, terminarCuestionario, guardarRespuesta, resultadosCuestionario3, resultadosCuestionario2 } from '../apis/nom035-fetch.js';


var secciones;
var preguntasTotalSeccion = 0;
var totalPreguntasVisualizadas = 0;
var inicioPreguntaSeccion = 0;
var finPreguntaSeccion = 8;
var seccionActual = 0;
var percent = 0;
var porcentajeSeccion = 0;
var totalPreguntas = 0;


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
    secciones = dataCuestionarios.data;

    for (var i = 0; i < secciones.length; i++) {
        totalPreguntas += secciones[i].questions.length;
    } //Math.round(100 / Math.ceil(totalPreguntas / 10));

    loadStateFromLocalStorage();

    // Guardar el estado inicial en localStorage
    saveStateToLocalStorage();

    // Dibujar la interfaz inicial con las preguntas de la primera sección
    dibujarInicial();

    // Actualizar los botones de navegación
    actualizarBotones();
    $('#SiguienteP').on('click', async function (ev) {
        //seccionActual += 1;

        MostrarLoading(true);
        var guardado = await guardarPreguntasSeccion();
        if (guardado) {
            moverProgeso();
            inicioPreguntaSeccion = finPreguntaSeccion + 1;
            saveStateToLocalStorage(); // Guardar el estado después de actualizar
            if ((secciones.length - 1) == seccionActual && preguntasTotalSeccion <= finPreguntaSeccion) {
                guardarTerminarCuestionario();
            }
            if ((secciones.length - 1) != seccionActual && preguntasTotalSeccion <= finPreguntaSeccion) {
                seccionActual += 1;
                inicioPreguntaSeccion = 0;
                finPreguntaSeccion = 8;
                saveStateToLocalStorage(); // Guardar el estado después de actualizar
                $("#divPreguntas").empty();
                dibujarInicial();//Comentar aquí para purebas JAVIER
                actualizarBotones();
            } else {
                finPreguntaSeccion += 9;
                saveStateToLocalStorage(); // Guardar el estado después de actualizar
                CambiarBloquePregunta();
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
            Swal.fire("", "No fue posible guardar la respuesta de la pregunta " + respuesta.id_pregunta, "warning");
            return false;
        }

        objResultado = {
            id_usuario_medi: idUsuario,
            id_usuario: idUsuarioBH,
            id_encuesta: cuestionarioBH
        };

        var responseResultado = "";

        if (cuestionarioBH == 2)
            responseResultado = await resultadosCuestionario2(objResultado);
        else if (cuestionarioBH == 3)
            responseResultado = await resultadosCuestionario3(objResultado);

        /*if (responseResultado == "0") {
            Swal.fire("", "No fue posible Obtener los resultados, por favor contacte al administrador", "warning");
            return false;
        }*/

        window.location = "/Cuestionario/FinalCuestionario";
    }

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

        //Enviar respuestas a BH


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
        percent = Math.round(100 / (totalPreguntas / (totalPreguntasVisualizadas)));// porcentajeSeccion;
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
            estructura += '<div class="row"><h4> <span> </span>' + preguntaName + '</h4></div></div>';
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
        if (secciones[seccionActual].questions.length - 1 < finPreguntaSeccion)
            finPreguntaSeccion = secciones[seccionActual].questions.length - 1;

        var seccionName = secciones[seccionActual].name;
        var estructura = "";
        estructura = '<div class="form-group"><label class="form-label"><h5>' + seccionName + '</h5></label></div>';
        estructura += '<div class="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app"><div class="preguntas_box"> ';
        var idR = 0;

        //dibujarSeccion(seccionActual);
        if (inicioPreguntaSeccion == finPreguntaSeccion) {
            estructura += '<div class="col-lg-4 px-0 px-md-2">' +
                '<div class="container-fluid">' +
                '<div class="row">' +
                '<div class="col p-0">' +
                '<div class="test_innerbox card-profile">' +
                '<div class="form-group">';

            var preguntaName = preguntas[finPreguntaSeccion].question;
            var preguntaNumber = preguntas[finPreguntaSeccion].question_number;
            var circuloNumero = (parseInt(preguntas[finPreguntaSeccion].question_number) < 10 ? ("0" + preguntas[finPreguntaSeccion].question_number) : preguntas[finPreguntaSeccion].question_number);
            totalPreguntasVisualizadas += 1;
            var textoPregunta = "";

            estructura += '<div class="row"><h4> <span> </span>' + preguntaName + '</h4></div></div>';
            for (var opcion of preguntas[finPreguntaSeccion].options) {
                var opcioneSeleccionada = "";
                for (var respuesta of preguntas[finPreguntaSeccion].respondido) {
                    opcioneSeleccionada = respuesta.option_id == opcion.option_id ? "checked" : "";
                }
                var identificadorPregunta = secciones[seccionActual].section_number + "_" + preguntas[finPreguntaSeccion].question_number + "_" + opcion.option_id;
                textoPregunta += '<div class="form-group"><label for="' + identificadorPregunta + '" class="form-label">' + opcion.question_option + '</label> <INPUT TYPE="Radio" Name="' + idR + '" ID="' + identificadorPregunta + '" Value="' + opcion.value + '" ' + opcioneSeleccionada + ' ></div>';

                //var opcionName = opcion.value + " - " + opcion.question_option;
            }
            estructura += '<div class="test_selectmultiple">' + textoPregunta + '</div></div></div></div></div></div>';

            estructura += '</div></div>';
            $("#divPreguntas").append(estructura);
            //dibujarPreguntas(inicioPreguntaSeccion);            
        } else {
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

                estructura += '<div class="row"><h4> <span>  </span>' + preguntaName + '</h4></div></div>';
                for (var opcion of preguntas[i].options) {
                    var opcioneSeleccionada = "";
                    for (var respuesta of preguntas[i].respondido) {
                        opcioneSeleccionada = respuesta.option_id == opcion.option_id ? "checked" : "";
                    }
                    var identificadorPregunta = secciones[seccionActual].section_number + "_" + preguntas[i].question_number + "_" + opcion.option_id;
                    textoPregunta += '<div class="form-group"><label for="' + identificadorPregunta + '" class="form-label">' + opcion.question_option + '</label> <INPUT TYPE="Radio" Name="' + idR + '" ID="' + identificadorPregunta + '" Value="' + opcion.value + '" ' + opcioneSeleccionada + ' ></div>';

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

