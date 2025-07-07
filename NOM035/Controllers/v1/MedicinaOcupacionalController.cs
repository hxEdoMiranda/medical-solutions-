using Encuestas.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Nom035.Data;
using Nom035.Models;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using static Encuestas.API.Models.EncuestaPersona;

namespace Encuestas.API.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class MedicinaOcupacional : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly CuestionarioOcupacional _ocupacional;
        private readonly EncuestaPersona _encuestaPersona;

        public MedicinaOcupacional(CuestionarioOcupacional ocupacional = null, EncuestaPersona encuestaPersona = null, IConfiguration config = null)
        {
            _config = config;
            _ocupacional = ocupacional ?? new CuestionarioOcupacional(_config);
            _encuestaPersona = encuestaPersona ?? new EncuestaPersona(_config);
        }

        [HttpGet]
        [Route("Test")]
        public ActionResult Test()
        {
            string[] result = new string[] { "MedicinaOcupacional ok" };
            return Ok(new JsonResult(new { status = "OK", err = 1, msg = "Consulta con resultados OK", result }));
        }

        [HttpGet]
        [Route("GetCuestionario/{idCuestionario}/{idPersona}")]
        public CuestionarioOcupacional GetCuestionario(int idCuestionario, int idPersona)
        {
            var idEncuestaPersona = _encuestaPersona.GetOneIdEncuestaPersona(idCuestionario, idPersona);
            var cuestionario = _ocupacional.GetCuestionario(idCuestionario, idPersona, idEncuestaPersona);
            return cuestionario;
        }

        [HttpGet]
        [Route("GuardarRespuestacupacional/{idPregunta}/{idRespuesta}/{idpersona}/{textInput}")]
        public async Task<IActionResult> GuardarRespuestacupacionalAsync(int idPregunta, int idRespuesta, int idpersona, string textInput = "")
        {
            string respuesta = string.Empty;
            try
            {
                var idencuesta = _encuestaPersona.GetIdEncuestaByQuestion(idPregunta);
                var id = idencuesta.id_encuesta;


                EncuestaPersona encuestaPersona = new EncuestaPersona();
                encuestaPersona.Id_persona = idpersona;
                encuestaPersona.Id_cuestionario_respondido = idRespuesta;
                encuestaPersona.Id_encuesta_persona = _encuestaPersona.GetOneIdEncuestaPersona(id, idpersona);
                encuestaPersona.Fecha_inicio_diligencia = DateTime.Now;
                encuestaPersona.Id_encuesta = id;
                encuestaPersona.Configuration = _config;


                _encuestaPersona.InsertEncuesta(encuestaPersona, textInput);


                return Ok(new JsonResult(new { status = "OK" }));
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = "NOK", msg = ex.Message, respuesta });
            }
        }

        [HttpGet]
        [Route("GetProgresoCuestinario/{idEncuesta}/{idPersona}/{idEncuestaPersona}")]
        public CuestionarioProgreso GetProgresoCuestinario(int idEncuesta, int idPersona, int idEncuestaPersona)
        {
            var cuestionario = _ocupacional.GetProgresoCuestinario(idEncuesta, idPersona, idEncuestaPersona);
            return cuestionario;
        }

        [HttpGet]
        [Route("GetEncuestaCondiciones/{idCuestionario}")]
        public EncuestaCondiciones GetEncuestaCondiciones(int idCuestionario)
        {
            var cuestionario = _ocupacional.GetEncuestaCondiciones(idCuestionario);
            return cuestionario;
        }

        [HttpGet]
        [Route("AddEncuestaPersona/{idPersona}")]
        public IActionResult AgregarNuevaEncuestaPersona(int idPersona) {
            try
            {

                List<string> response = new List<string>();
                List<IdEncuesta> cuestionariosVigentes = _encuestaPersona.GetEncuestaByNameTextNotNull();
                cuestionariosVigentes.ForEach(x =>
                {
                    response.Add(_encuestaPersona.CreateNewMedicalExamUser(x.id_encuesta, idPersona));
                });
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpGet]
        [Route("InsertNewTests/{idPersona}")]
        public IActionResult insertNewTests(int idPersona)
        {
            try
            {
                string[] codigos = new string[3] { "visual", "audiometria", "psicologico" };
                List<string> response = new List<string>();
                foreach (string codigo in codigos)
                {
                    int idEncuesta = _encuestaPersona.GetIdEncuestaByNameText(codigo);
                    string responseQuery = _encuestaPersona.CreateNewMedicalExamUser(idEncuesta, idPersona);
                    response.Add(responseQuery);
                }
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        [HttpGet]
        [Route("CalcularResultadosVisiometria/{idPersona}")]
        public TestOcupacionalesResult CalcularResultadosVisiometria(int idPersona)
        {
            var idCuestionario = _encuestaPersona.GetIdEncuestaByNameText("visual");
            var idEncuestaPersona = _encuestaPersona.GetOneIdEncuestaPersona(idCuestionario, idPersona);
            var cuestionario = _ocupacional.GetRespuestasIngresadas(idCuestionario, idPersona, idEncuestaPersona);
            var puntosRigthLetra = 0;
            var puntosLeftLetra = 0;
            var puntosRigthDaltonismo = 0;
            var puntosLeftDaltonismo = 0;
            var puntosFraseRigth = 0;
            var puntosFraseLeft = 0;

            foreach (var respuesta in cuestionario.respuestas)
            {
                if (respuesta.texto_preguntaopcion == "Lee la siguiente frase y responde la pregunta.") {
                    if (respuesta.respuesta == respuesta.texto_respuesta)
                    {
                        if (respuesta.asset_url.Contains("RIGTH"))
                        {
                            puntosFraseRigth++;
                        }
                        else
                        {
                            puntosFraseLeft++;
                        }
                    }
                }
                else if (respuesta.texto_preguntaopcion == "numerico")
                {
                    if (respuesta.respuesta == respuesta.texto_respuesta)
                    {
                        if (respuesta.asset_url.Contains("RIGTH"))
                        {
                            puntosRigthDaltonismo++;
                        }
                        else
                        {
                            puntosLeftDaltonismo++;
                        }
                    }
                }
                else
                {
                    if (respuesta.texto_preguntaopcion == respuesta.respuesta)
                    {
                        if (respuesta.asset_url.Contains("RIGTH"))
                        {
                            puntosRigthLetra++;
                        }
                        else
                        {
                            puntosLeftLetra++;
                        }
                    }
                }
            }

            TestOcupacionalesResult data = new TestOcupacionalesResult();
            data.colometria_Ojo_izquierdo = puntosLeftDaltonismo == 5 ? "SIN ALTERACIÓN DE COLOR" : "SOSPECHA DE DALTONISMO";
            data.colometria_Ojo_derecho = puntosRigthDaltonismo == 5 ? "SIN ALTERACIÓN DE COLOR" : "SOSPECHA DE DALTONISMO";
            data.lectura_Ojo_izquierdo = puntosFraseLeft == 1 ? "SIN ALTERACIÓN VISUAL" : "ALTERACIÓN VISUAL";
            data.lectura_Ojo_derecho = puntosFraseRigth == 1 ? "SIN ALTERACIÓN VISUAL" : "ALTERACIÓN VISUAL";
            data.visiometria_Ojo_izquierdo = (puntosLeftLetra >= 8 && puntosLeftLetra <= 10) ? "SIN ALTERACIONES VISUALES SIGNIFICATIVAS" : (puntosLeftLetra >= 6 && puntosLeftLetra <= 7) ? "DISMINUCIÓN VISUAL LEVE" : "ALTERACIÓN VISUAL SERVERA";
            data.visiometria_Ojo_derecho = (puntosRigthLetra >= 8 && puntosRigthLetra <= 10) ? "SIN ALTERACIONES VISUALES SIGNIFICATIVAS" : (puntosRigthLetra >= 6 && puntosRigthLetra <= 7) ? "DISMINUCIÓN VISUAL LEVE" : "ALTERACIÓN VISUAL SERVERA";



            return data;
        }

        [HttpGet]
        [Route("CalcularResultadosAudiometria/{idPersona}")]
        public TestOcupacionalesResult CalcularResultadosAudiometria(int idPersona)
        {
            var idCuestionario = _encuestaPersona.GetIdEncuestaByNameText("visual");
            var idEncuestaPersona = _encuestaPersona.GetOneIdEncuestaPersona(idCuestionario, idPersona);
            var cuestionario = _ocupacional.GetRespuestasIngresadas(idCuestionario, idPersona, idEncuestaPersona);
            var puntosRigth = 0;
            var puntosLeft = 0;
            var cuestionarioResult = new List<RespuestasIngresadas>();

            foreach (var respuesta in cuestionario.respuestas)
            {
                if (int.TryParse(respuesta.texto_respuesta, out int textoRespuestaInt))
                {
                    if (respuesta.texto_respuesta == "7")
                    {
                        if (respuesta.asset_url.Contains("RIGTH"))
                        {
                            puntosRigth += 0;
                        }
                        else
                        {
                            puntosLeft += 0;
                        }
                    }
                    else if (textoRespuestaInt > 7 || respuesta.respuesta == "1")
                    {
                        if (respuesta.asset_url.Contains("RIGTH"))
                        {
                            puntosRigth += 35;
                        }
                        else
                        {
                            puntosLeft += 35;
                        }
                    }
                    else
                    {
                        if (respuesta.asset_url.Contains("RIGTH"))
                        {
                            puntosRigth += respuesta.puntaje_respuesta;
                        }
                        else
                        {
                            puntosLeft += respuesta.puntaje_respuesta;
                        }
                    }
                }
            }
            var promedioLeft = 0;
            var promedioRigth = 0;
            if (cuestionario.respuestas.Count != 0)
            {
                promedioLeft = puntosLeft / (cuestionario.respuestas.Count / 2);
                promedioRigth = puntosRigth / (cuestionario.respuestas.Count / 2);
            }


            TestOcupacionalesResult data = new TestOcupacionalesResult();
            data.audiometria_Oido_izquierdo = (promedioLeft >= 0 && promedioLeft <= 0.9) ? "SIN SEÑALES DE DETERIORO AUDITIVA" : (promedioLeft >= 1 && promedioLeft <= 5.9) ? "Rango auditivo normal" : (promedioLeft >= 6 && promedioLeft <= 17.5) ? "Hipoacusia leve" : "Hipoacusia";
            data.audiometria_Oido_derecho = (promedioRigth >= 0 && promedioRigth <= 0.9) ? "SIN SEÑALES DE DETERIORO AUDITIVA" : (promedioRigth >= 1 && promedioRigth <= 5.9) ? "Rango auditivo normal" : (promedioRigth >= 6 && promedioRigth <= 17.5) ? "Hipoacusia leve" : "Hipoacusia";

            return data;
        }

        [HttpGet]
        [Route("ConsultarResultadosPsicologia/{idPersona}")]
        public RespuestaProgreso ConsultarResultadosPsicologia(int idPersona)
        {
            var idCuestionario = _encuestaPersona.GetIdEncuestaByNameText("visual");
            var idEncuestaPersona = _encuestaPersona.GetOneIdEncuestaPersona(idCuestionario, idPersona);
            var cuestionario = _ocupacional.GetRespuestasIngresadas(idCuestionario, idPersona, idEncuestaPersona);

            return cuestionario;
        }
        [HttpGet]
        [Route("TestResultFull/{idPersona}")]
        public TestOcupacionalesResult TestResultFull(int idPersona)
        {
            TestOcupacionalesResult listDataAudiometria = CalcularResultadosAudiometria(idPersona);
            TestOcupacionalesResult listDataVisiometria = CalcularResultadosVisiometria(idPersona);
            TestOcupacionalesResult dataResultTests = new TestOcupacionalesResult();


            dataResultTests.audiometria_Oido_derecho = listDataAudiometria.audiometria_Oido_derecho;
            dataResultTests.audiometria_Oido_izquierdo = listDataAudiometria.audiometria_Oido_izquierdo;
            dataResultTests.colometria_Ojo_izquierdo = listDataVisiometria.colometria_Ojo_izquierdo;
            dataResultTests.colometria_Ojo_derecho = listDataVisiometria.colometria_Ojo_derecho;
            dataResultTests.visiometria_Ojo_derecho = listDataVisiometria.visiometria_Ojo_derecho;
            dataResultTests.visiometria_Ojo_izquierdo = listDataVisiometria.visiometria_Ojo_izquierdo;
            dataResultTests.lectura_Ojo_izquierdo = listDataVisiometria.lectura_Ojo_izquierdo;
            dataResultTests.lectura_Ojo_derecho = listDataVisiometria.lectura_Ojo_derecho;
            return dataResultTests;
        }
        [HttpGet]
        [Route("TestResultFullDB/{idPersona}")]
        public List<TestOcupacionalesResult> TestResultFullDB(int idPersona)
        {
            List<TestOcupacionalesResult> dataResultTestsList = _encuestaPersona.GetEncuestaResults(idPersona);

            return dataResultTestsList;
        }

        [HttpGet]
        [Route("SaveResultsTest/{idPersona}")]
        public string SaveResultsTest(int idPersona)
        {
            TestOcupacionalesResult dataResultTestList = TestResultFull(idPersona);
            TestOcupacionalesResult dataResultTest = dataResultTestList;
            string responseId = _encuestaPersona.CreateResultMedicalExams(idPersona, dataResultTest.audiometria_Oido_derecho, dataResultTest.audiometria_Oido_izquierdo, dataResultTest.colometria_Ojo_izquierdo, dataResultTest.colometria_Ojo_derecho, dataResultTest.visiometria_Ojo_derecho, dataResultTest.visiometria_Ojo_izquierdo, dataResultTest.lectura_Ojo_izquierdo, dataResultTest.lectura_Ojo_derecho);
            return responseId;
        }

        [HttpGet]
        [Route("ValidateTestOcupacional/{idPersona}/{uid}/{idCliente}")]
        public async Task<bool> ValidateTestOcupacional(int idPersona, int uid, int idCliente)
        {
            List<EncuestaEmpresas> encuestaEmpresas = new List<EncuestaEmpresas>();

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getCuestionariosEmpresa/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    encuestaEmpresas = JsonConvert.DeserializeObject<List<EncuestaEmpresas>>(apiResponse);
                }
            }
            CuestionarioProgreso preguntasAvance = new CuestionarioProgreso();
            foreach (var item in encuestaEmpresas)
            {
                using (var httpClient = new HttpClient())
                {
                    var idEncuesta = item.id_encuesta_activa;
                    int idEncuestaPersona = GetOneIdEncuestaPersona(idEncuesta, idPersona);
                    preguntasAvance = GetProgresoCuestinario(idEncuesta, idPersona, idEncuestaPersona);
                }
                if (preguntasAvance != null)
                {
                    if (preguntasAvance.Avance != 100)
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }

            var responseSaveResults = SaveResultsTest(idPersona);

            using (var httpClient = new HttpClient())
            {
                var pdf = await httpClient.GetAsync(_config["ServicesUrl"] + $"/reportes/reportes/createReport?id={idPersona}&uid={uid}&medicamento={false}&examen={false}&certificadoMedico={false}&examenPreventivo={false}&testocupacional={true}");

            }

            return true;
        }

        [HttpGet]
        [Route("GetOneIdEncuestaPersona/{idEncuesta}/{idPersona}")]
        public int GetOneIdEncuestaPersona(int idEncuesta, int idPersona)
        {
            int cuestionario = _encuestaPersona.GetOneIdEncuestaPersona(idEncuesta, idPersona);
            return cuestionario;
        }
    }
}
