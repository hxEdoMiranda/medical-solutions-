using Dapper;
using Encuestas.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Nom035.Data;
using Nom035.Models;
using RestSharp;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static Encuestas.API.Models.EncuestaPersona;

namespace Nom035.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class Nom035Controller : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly Nom035Context _context;

        public Nom035Controller(Nom035Context context = null, IConfiguration config = null)
        {
            _config = config;
            _context = context ?? new Nom035Context(_config);
        }

        [HttpGet]
        [Route("Test")]
        public  ActionResult Test()
        {
         
            string[] result = new string[] { "1", "2", "3", _config["UrlNom035"], _config["master_key"] };
            return Ok(new JsonResult(new { status = "OK", err = 1, msg = "Consulta con resultados OK", result }));
        }

        #region Empresas

        [HttpGet]
        [Route("ConsultarEmpresas")]
        public async Task<IActionResult> ConsultarEmpresasAsync()
        {
            string respuesta = string.Empty;
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-all-companies";
                //string body = JsonConvert.SerializeObject(SolHora);
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\"}";

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                //request.AddHeader("x-api-key", Funciones.ApiKey);
                //request.AddHeader("Content-Type", MediaTypeNames.Application.Json);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;

                //if (response.StatusCode == HttpStatusCode.BadRequest)
                //{
                //    throw new SystemException(respuesta);
                //}

                var empresas = JsonConvert.DeserializeObject<EmpresasResponseModel>(respuesta);

                if (empresas.data == null)
                    return NotFound(empresas);

                return Ok(empresas);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally {
                //await Log();
            }
        }

        [HttpGet]
        [Route("ConsultarEmpresaPorId/{idEmpresa}")]
        public async Task<IActionResult> ConsultarEmpresaPorIdAsync(string idEmpresa)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-company-by-id";
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_empresa\": \"" + idEmpresa + "\"}";

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var empresa = JsonConvert.DeserializeObject<EmpresaResponseModel>(respuesta);

                if (empresa.data == null)
                    return NotFound(empresa);

                return Ok(empresa);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPost]
        [Route("CrearEmpresa")]
        public async Task<IActionResult> CrearEmpresaAsync(EmpresaRequestModel empresaRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/createCompany";
                empresaRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(empresaRequest);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);



                return StatusCode((int)HttpStatusCode.Created, result);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }
        private async Task Log(LogNom035 log) {
            try
            {
                string Url = _config["UrlLog"];
                string strLog = JsonConvert.SerializeObject(log);
                var client = new HttpClient();
                //var request = new HttpRequestMessage(HttpMethod.Post, "https://ciukfpz1fi.execute-api.us-east-1.amazonaws.com/dev/log-nom");
                var request = new HttpRequestMessage(HttpMethod.Post, Url);
                //var content = new StringContent("{\r\n  \"mensaje\": \"Sitio Enroll - EliminarPuestoNom035_BH\",  \r\n  \"data\": {\r\n\t\"URL\":\"https://devms.bluehand.com.mx/backend/api/v1/eliminarpuestos\",\r\n\t\"Body\":{\"master_key\":\"$2a$12$n1ifj4zomb1OS0sn/lW8COTSd5cV7lKGsgcdbC.ZBtVnAFFGt0DEV.ie\",\"id_area\":0,\"id_puesto\":997},\r\n\t\"Response\":\"error de red\"\r\n  }\r\n}\r\n", null, "application/json");
                var content = new StringContent(strLog);
                request.Content = content;
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                Console.WriteLine(await response.Content.ReadAsStringAsync());

            }
            catch (Exception ex)
            {
                LogNom035 l= new LogNom035();
                l.mensaje = "Nom035Controller - Log";
                l.data.MsgError = ex.Message;
                l.data.ex = ex;
                await Log(l);
                //throw;
            }
        }

        [HttpPut]
        [Route("ModificarEmpresa")]
        public async Task<IActionResult> ModificarEmpresaAsync(EmpresaRequestModel empresaRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/updateCompany";
                empresaRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(empresaRequest);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        #endregion
        
        #region Areas

        [HttpGet]

        [Route("ConsultarAreasPorEmpresa/{idEmpresa}")]
        public async Task<IActionResult> ConsultarAreasPorEmpresaAsync(string idEmpresa)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-all-areas-by-id";
                Ldata.url = url;
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_empresa\": \"" + idEmpresa + "\"}";
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
                Ldata.response = respuesta;
                AreaResponseModel areas = new AreaResponseModel();
                if (respuesta.Contains("data")) {
                    areas = JsonConvert.DeserializeObject<AreaResponseModel>(respuesta);
                    Ldata.response = areas;
                }

                return Ok(areas);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - ConsultarAreasPorEmpresaAsync " + Ldata.MsgError;
                log.data = Ldata; // "{" + JsonConvert.SerializeObject(LUrl) + "," + JsonConvert.SerializeObject(LBody) + "," + JsonConvert.SerializeObject(LRes) +"}";
                await Log(log);
            }
        }

        [HttpPost]
        [Route("CrearArea")]
        public async Task<IActionResult> CrearAreaAsync(AreaRequestModel areaRequest)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/createArea";
                Ldata.url = url;
                areaRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(areaRequest);
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
                Ldata.response = respuesta;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);
                
                if (result.result_code.Equals("0"))
                    return BadRequest(result);
                
                return StatusCode((int)HttpStatusCode.Created, result);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - CrearAreaAsync " + Ldata.MsgError;
                log.data = Ldata; // "{" + JsonConvert.SerializeObject(LUrl) + "," + JsonConvert.SerializeObject(LBody) + "," + JsonConvert.SerializeObject(LRes) +"}";
                await Log(log);
            }
        }

        [HttpPut]
        [Route("ModificarArea")]
        public async Task<IActionResult> ModificarAreaAsync(AreaRequestModel areaRequest)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/updateArea";
                Ldata.url = url;
                areaRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(areaRequest);
                Ldata.body = body;

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);
                Ldata.response = respuesta;

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - ModificarAreaAsyn " + Ldata.MsgError;
                log.data = Ldata; 
                await Log(log);
            }
        }

        #endregion

        #region Puestos

        [HttpGet]
        [Route("ConsultarPuestosPorArea/{idArea}")]
        public async Task<IActionResult> ConsultarPuestosPorAreaAsync(string idArea)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-all-positions-by-id";
                Ldata.url = url;
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_area\": \"" + idArea + "\"}";
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
                Ldata.response = respuesta;
                PuestoResponseModel areas = new PuestoResponseModel();
                if (respuesta.Contains("data"))
                    areas = JsonConvert.DeserializeObject<PuestoResponseModel>(respuesta);

                //if (areas.data == null)
                //    return StatusCode((int)HttpStatusCode.InternalServerError, areas);
                //else if (areas.data.Count == 0)
                //    return NotFound(areas);

                return Ok(areas);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - ConsultarPuestosPorAreaAsync " + Ldata.MsgError;
                log.data = Ldata;
                await Log(log);
            }
        }

        [HttpPost]
        [Route("CrearPuesto")]
        public async Task<IActionResult> CrearPuestoAsync(PuestoRequestModel puestoRequest)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/createPosition";
                Ldata.url = url;
                puestoRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(puestoRequest);
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
              
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);
                Ldata.response = respuesta;
                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return StatusCode((int)HttpStatusCode.Created, result);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - CrearPuestoAsync " + Ldata.MsgError;
                log.data = Ldata; // "{" + JsonConvert.SerializeObject(LUrl) + "," + JsonConvert.SerializeObject(LBody) + "," + JsonConvert.SerializeObject(LRes) +"}";
                await Log(log);
            }
        }

        [HttpPut]
        [Route("ModificarPuesto")]
        public async Task<IActionResult> ModificarPuestoAsync(PuestoRequestModel puestoRequest)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/updatePosition";
                Ldata.url = url;
                puestoRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(puestoRequest);
                Ldata.body = body;

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);
                Ldata.response = respuesta;
                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - ModificarPuestoAsync " + Ldata.MsgError;
                log.data = Ldata; // "{" + JsonConvert.SerializeObject(LUrl) + "," + JsonConvert.SerializeObject(LBody) + "," + JsonConvert.SerializeObject(LRes) +"}";
                await Log(log);
            }
        }

        #endregion
        #region ConsultarCrearAreaPuesto
        [HttpPost]
        [Route("ConsultarCrearAreaPuesto")]
        public async Task<IActionResult> ConsultarCrearAreaPuestoAsync(string idEmpresa, string nombreArea, string nombrePuesto)
        {            
            try
            {

                // Consultar áreas por empresa
                IActionResult areasResponse = await ConsultarAreasPorEmpresaAsync(idEmpresa);

                if (areasResponse is OkObjectResult)
                {
                    int c = 0;

                    var areas = (areasResponse as OkObjectResult).Value as AreaResponseModel;
                    if (areas.data != null)
                        c = areas.data.Where(x => x.nombre_area == nombreArea).Count();
                    // Si el resultado es 0, no hay áreas disponibles
                    if (c == 0)
                    {
                        // Crear área
                        IActionResult crearAreaResponse = await CrearAreaAsync(new AreaRequestModel() { nombre_area = nombreArea, id_empresa = Convert.ToInt32(idEmpresa) });
                        if ((crearAreaResponse as ObjectResult).StatusCode == 201)
                        //if (crearAreaResponse is StatusCodeResult && ((StatusCodeResult)crearAreaResponse).StatusCode == 201)
                        {
                            // Área creada exitosamente, intentar crear puesto
                            IActionResult crearPuestoResponse = await CrearPuestoAsync(new PuestoRequestModel());
                            if ((crearPuestoResponse as ObjectResult).StatusCode == 201)
                            // if (crearPuestoResponse is StatusCodeResult && ((StatusCodeResult)crearPuestoResponse).StatusCode == 201)
                            {
                                return Ok("Área y puesto creados exitosamente");
                            }
                            else
                            {
                                return BadRequest("Error al crear puesto");
                            }
                        }
                        else
                        {
                            return BadRequest("Error al crear área");
                        }
                    }
                    else
                    {
                        int idArea = areas.data.Where(x => x.nombre_area == nombreArea).FirstOrDefault().id_area;
                        IActionResult puestosResponse = await ConsultarPuestosPorAreaAsync(idArea.ToString());


                        if (puestosResponse is OkObjectResult)
                        {
                            int p = 0;



                            var puestos = (puestosResponse as OkObjectResult).Value as PuestoResponseModel;
                            if (puestos.data != null)
                                p = puestos.data.Where(x => x.nombre_puesto == nombrePuesto).Count();
                            if (p == 0)
                            {
                                IActionResult crearPuestoResponse = await CrearPuestoAsync(new PuestoRequestModel() { id_area = idArea, nombre_puesto = nombrePuesto });
                                if ((crearPuestoResponse as OkObjectResult).StatusCode == 201)
                                // if (crearPuestoResponse is StatusCodeResult && ((StatusCodeResult)crearPuestoResponse).StatusCode == 201)// que sea diferente a una respuesta negativa 
                                {
                                    return Ok("puesto creados exitosamente");
                                }
                                else
                                {
                                    return BadRequest("Error al crear puesto");
                                }
                            }
                        }
                        return Ok("Hay áreas disponibles, no es necesario crear");
                    }
                }
                else
                {
                    return BadRequest("Error al consultar áreas");
                }
            }
            catch (Exception ex)
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - Error en ConsultarCrearAreaPuestoAsync";
               // log.data = new LogNom035Datos();
                log.data.MsgError = ex.Message;
                log.data.ex = ex;
                await Log(log);

                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message }));
            }
        }

        #endregion

        #region Usuarios

        [HttpGet]
        [Route("ConsultarUsuariosPorEmpresa/{idEmpresa}")]
        public async Task<IActionResult> ConsultarUsuariosPorEmpresaAsync(string idEmpresa)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-all-users-by-company";
                Ldata.url = url;
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_empresa\": \"" + idEmpresa + "\"}";
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
                Ldata.response = respuesta;
                var usuarios = JsonConvert.DeserializeObject<PacientesResponseModel>(respuesta);

                if (usuarios.data == null)
                    return StatusCode((int)HttpStatusCode.InternalServerError, usuarios);
                else if (usuarios.data.Count == 0)
                    return NotFound(usuarios);

                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - ConsultarUsuariosPorEmpresaAsync " + Ldata.MsgError;
                log.data = Ldata; //
                await Log(log);
            }
        }

        [HttpGet]
        [Route("ConsultarUsuarioPorId/{idUsuario}")]
        public async Task<IActionResult> ConsultarUsuarioPorIdAsync(string idUsuario)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-all-users-by-id";
                Ldata.url = url;
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_usuario\": \"" + idUsuario + "\"}";
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
                Ldata.response = respuesta;
                var usuario = JsonConvert.DeserializeObject<PacienteResponseModel>(respuesta);

                if (usuario.data == null)
                    return NotFound(usuario);

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - ConsultarUsuarioPorIdAsync " + Ldata.MsgError;
                log.data = Ldata; // "{" + JsonConvert.SerializeObject(LUrl) + "," + JsonConvert.SerializeObject(LBody) + "," + JsonConvert.SerializeObject(LRes) +"}";
                await Log(log);
            }
        }



        [HttpPost]
        [Route("CrearUsuario")]
        public async Task<IActionResult> CrearUsuarioAsync(PacienteRequestModel pacienteRequest, string idCliente)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string MasterKey = _config["master_key"];
                string url = _config["UrlNom035"] + "/v1/api/createUser";
                pacienteRequest.master_key = MasterKey;
                int idArea = pacienteRequest.id_area;
                EmpresaDataModel ObjEmpresa = _context.ConsultarEmpresaPorIdArea(idArea);  //_context.ConsultarEmpresaPorIdPaciente(pacienteRequest.id_persona);
                pacienteRequest.id_empresa = ObjEmpresa.IdEmpresaBH;
                int IdEmpresaBH = ObjEmpresa.IdEmpresaBH;
                pacienteRequest.num_empleado = Convert.ToInt32(ObjEmpresa.cantidad_empleados);
                AreaDataModel ObjArea = _context.ConsultarAreaxId(idArea);
                AreaRequestModel areaRequest = new AreaRequestModel();
                pacienteRequest.id_area = ObjArea.id_area_bh;
                if (ObjArea.id_area_bh == 0)
                {
                    areaRequest.nombre_area = ObjArea.nombre_area;
                    areaRequest.id_empresa = ObjEmpresa.IdEmpresaBH;
                    areaRequest.master_key = MasterKey;
                    var resultadoArea = await CrearAreaAsync(areaRequest);

                    if (((ObjectResult)resultadoArea).StatusCode == 201)
                    {
                        ResponseModel responseArea = (ResponseModel)((ObjectResult)resultadoArea).Value;
                        int guardado = _context.UpdateIdAreaBHxId(idArea, Convert.ToInt32(responseArea.data));
                        pacienteRequest.id_area = Convert.ToInt32(responseArea.data);
                    }
                }

                int IdPuesto = pacienteRequest.id_puesto;
                PuestoDataModel objPuesto = _context.ConsultarPuestoxId(IdPuesto);
                PuestoRequestModel puestoRequest = new PuestoRequestModel();
                if (objPuesto.id_puesto_bh == 0)
                {
                    puestoRequest.nombre_puesto = objPuesto.nombre_puesto;
                    puestoRequest.id_area = pacienteRequest.id_area;
                    puestoRequest.master_key = MasterKey;
                    var resultadoPuesto = await CrearPuestoAsync(puestoRequest);

                    if (((ObjectResult)resultadoPuesto).StatusCode == 201)
                    {
                        ResponseModel responsePuesto = (ResponseModel)((ObjectResult)resultadoPuesto).Value;
                        int guardado = _context.UpdateIdPuestoBHxId(IdPuesto, Convert.ToInt32(responsePuesto.data));
                        pacienteRequest.id_puesto = Convert.ToInt32(responsePuesto.data);
                    }
                }
                // llamada mi supermetodo idEmpresa ObjArea.nombre_area   objPuesto.nombre_puesto
                IActionResult consultaAreaPuestoResponse = await ConsultarCrearAreaPuestoAsync(IdEmpresaBH.ToString(), ObjArea.nombre_area, objPuesto.nombre_puesto);

                pacienteRequest.id_area = ObjArea.id_area_bh;
                pacienteRequest.id_puesto = objPuesto.id_puesto_bh;
                PersonasDatosLaborales datosLaboral = new PersonasDatosLaborales();
                if (pacienteRequest.id_persona_bh == 0)
                {
                    try
                    {
                        string body = JsonConvert.SerializeObject(pacienteRequest);
                        Ldata.body = body;
                        Ldata.url = url;
                        var client = new RestClient(url);
                        client.Timeout = -1;
                        var request = new RestRequest(Method.POST);
                        request.AddParameter("application/json", body, ParameterType.RequestBody);

                        IRestResponse response = await client.ExecuteAsync(request);
                        respuesta = response.Content;
                        respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
                        Ldata.response = respuesta;
                        var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                        if (result.result_code.Equals("0"))
                            return BadRequest(result);

                        datosLaboral.idpersona = pacienteRequest.id_persona;
                        datosLaboral.idpersona_bh = Convert.ToInt32(result.data);// Convert.ToInt32(subs[3].Replace("}",""));
                        datosLaboral.experiencia_laboral = Convert.ToInt32(pacienteRequest.experiencia_laboral);
                        datosLaboral.id_area = ObjArea.id_area;
                        datosLaboral.id_puesto = objPuesto.id_puesto;
                        datosLaboral.fecha_ingreso = Convert.ToDateTime(pacienteRequest.tiempo_en_empresa);
                        datosLaboral.fecha_ingreso_puesto = Convert.ToDateTime(pacienteRequest.tiempo_en_puesto);
                        datosLaboral.id_tipo_contrato = pacienteRequest.tipo_contrato;
                        datosLaboral.id_tipo_jornada = pacienteRequest.tipo_jornada;
                        datosLaboral.rotacion_turno = pacienteRequest.rotacion_turno;

                        var Guardado = _context.InsertarDatosLaborales(datosLaboral);

                    }
                    catch (Exception ex)
                    {
                        Ldata.MsgError = ex.Message;
                        Ldata.ex = ex;
                        throw;
                    }
                    finally 
                    {
                        LogNom035 log = new LogNom035();
                        log.mensaje = "Nom035Controller - CrearUsuario - log1 ";
                        log.data = Ldata;
                        await Log(log);
                    }
                }
                else
                {
                    try
                    {
                        url = _config["UrlNom035"] + "/v1/api/updateUser" +
                       "";
                        string body = JsonConvert.SerializeObject(pacienteRequest);
                        Ldata.body = body;
                        Ldata.url = url;
                        var client = new RestClient(url);
                        client.Timeout = -1;
                        var request = new RestRequest(Method.POST);
                        request.AddParameter("application/json", body, ParameterType.RequestBody);
                        IRestResponse response = await client.ExecuteAsync(request);
                        respuesta = response.Content;
                        respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
                        Ldata.response = respuesta;
                        var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                        if (result.result_code.Equals("0"))
                            return BadRequest(result);

                        datosLaboral.id_personadatoslaboral = pacienteRequest.id_personadatoslaboral;
                        datosLaboral.idpersona = pacienteRequest.id_persona;
                        datosLaboral.idpersona_bh = pacienteRequest.id_persona_bh;
                        datosLaboral.experiencia_laboral = Convert.ToInt32(pacienteRequest.experiencia_laboral);
                        datosLaboral.id_area = ObjArea.id_area;
                        datosLaboral.id_puesto = objPuesto.id_puesto;
                        datosLaboral.fecha_ingreso = Convert.ToDateTime(pacienteRequest.tiempo_en_empresa);
                        datosLaboral.fecha_ingreso_puesto = Convert.ToDateTime(pacienteRequest.tiempo_en_puesto);
                        datosLaboral.id_tipo_contrato = pacienteRequest.tipo_contrato;
                        datosLaboral.id_tipo_jornada = pacienteRequest.tipo_jornada;
                        datosLaboral.rotacion_turno = pacienteRequest.rotacion_turno;
                        var Guardado = _context.UpdateDatosLaborales(datosLaboral);
                        Ldata.body = body;

                    }
                    catch (Exception ex)
                    {
                        Ldata.MsgError = ex.Message;
                        Ldata.ex = ex;
                        throw;
                    }
                    finally
                    {
                        LogNom035 log = new LogNom035();
                        log.mensaje = "Nom035Controller - CrearUsuario - log2 ";
                        log.data = Ldata;
                        await Log(log);
                    }
                   
                }

                PeriodoRequestModel ObjPeriodoEmpresa = _context.ConsultarPeriodoPorIdEmpresa(ObjEmpresa.id);
                ResultadoRequestModel objPeriodoUsuario = new ResultadoRequestModel();
                objPeriodoUsuario.id_periodo = ObjPeriodoEmpresa.id_periodo_bh;
                objPeriodoUsuario.id_usuario = datosLaboral.idpersona_bh;
                objPeriodoUsuario.master_key = MasterKey;
                var resultado = await AsignarCuestionarioPorUsuarioAsync(objPeriodoUsuario);

                if (((ResponseModel)(((ObjectResult)resultado).Value)).result_code.Equals("0"))
                    return BadRequest(resultado);
                

                return StatusCode((int)HttpStatusCode.Created, "Ok");
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - CrearUsuario Error " + Ldata.MsgError;
                log.data = Ldata;
                await Log(log);
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPut]
        [Route("ModificarUsuario")]
        public async Task<IActionResult> ModificarUsuarioAsync(PacienteRequestModel pacienteRequest)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/updateUser";
                Ldata.url = url;
                pacienteRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(pacienteRequest);
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                Ldata.response = respuesta;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - ModificarUsuarioAsync " + Ldata.MsgError;
                log.data = Ldata; 
                await Log(log);
            }
        }

        [HttpDelete]
        [Route("EliminarUsuarioPorId/{idUsuario}")]
        public async Task<IActionResult> EliminarUsuarioPorIdAsync(string idUsuario)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/eliminar-usuario";
                Ldata.url = url;
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_usuario\": \"" + idUsuario + "\"}";
                Ldata.body = body;
                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                Ldata.response = respuesta;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally 
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - EliminarUsuarioPorIdAsync " + Ldata.MsgError;
                log.data = Ldata; 
                await Log(log);
            }
        }

        [HttpPut]
        [Route("EliminarEspacioUsuarioPorId/{idUsuario}")]
        public async Task<IActionResult> EliminarEspacioUsuarioPorIdAsync(string idUsuario)
        {
            string respuesta = string.Empty;
            LogNom035Datos Ldata = new LogNom035Datos();
            try
            {
                string url = _config["UrlNom035"] + "/v1/api/eliminar-espacio-usuario";
                string master_key = _config["master_key"];
                Ldata.url = url;
                string body = "{\"master_key\": \"" + master_key + "\", \"id_usuario\": \"" + idUsuario + "\"}";

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);
                Ldata.body = body;
                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                Ldata.response = respuesta;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Ldata.MsgError = ex.Message;
                Ldata.ex = ex;
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
            finally
            {
                LogNom035 log = new LogNom035();
                log.mensaje = "Nom035Controller - EliminarEspacioUsuarioPorIdAsync " + Ldata.MsgError;
                log.data = Ldata;
                await Log(log);
            }
        }

        #endregion
        #region Periodos

        [HttpGet]
        [Route("ConsultarPeriodosPorEmpresa/{idEmpresa}")]
        public async Task<IActionResult> ConsultarPeriodosPorEmpresaAsync(string idEmpresa)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-periodos-por-empresa";
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_empresa\": \"" + idEmpresa + "\"}";

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var periodos = JsonConvert.DeserializeObject<PeriodoEmpresaResponseModel>(respuesta);

                if (periodos.data == null)
                    return StatusCode((int)HttpStatusCode.InternalServerError, periodos);
                else if (periodos.data.Count == 0)
                    return NotFound(periodos);

                return Ok(periodos);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ConsultarPeriodosPorUsuario/{idUsuario}")]
        public async Task<IActionResult> ConsultarPeriodosPorUsuarioAsync(string idUsuario)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-periodos-por-usuario";
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\", \"id_usuario\": \"" + idUsuario + "\"}";

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var periodos = JsonConvert.DeserializeObject<PeriodoUsuarioResponseModel>(respuesta);

                if (periodos.data == null)
                    return StatusCode((int)HttpStatusCode.InternalServerError, periodos);
                else if (periodos.data.Count == 0)
                    return NotFound(periodos);

                return Ok(periodos);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPost]
        [Route("CrearPeriodo")]
        public async Task<IActionResult> CrearPeriodoAsync(PeriodoRequestModel periodoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/createPeriod";
                periodoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(periodoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return StatusCode((int)HttpStatusCode.Created, result);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPut]
        [Route("ModificarPeriodo")]
        public async Task<IActionResult> ModificarPeriodoAsync(PeriodoRequestModel periodoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/actualiza-periodo";
                periodoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(periodoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPost]
        [Route("AsignarCuestionarioPorUsuario")]
        public async Task<IActionResult> AsignarCuestionarioPorUsuarioAsync(ResultadoRequestModel periodoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/createPeriod-one-user";
                periodoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(periodoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return StatusCode((int)HttpStatusCode.Created, result);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        #endregion
        #region Cuestionarios

        [HttpGet]
        [Route("ConsultarCuestionarioPorUsuario")]
        public async Task<IActionResult> ConsultarCuestionarioPorUsuarioAsync(CuestionarioRequestModel cuestionarioRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-data-user-for-questionnaries";
                cuestionarioRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(cuestionarioRequest);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                
                if (result.result_code.Equals("0"))
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ConsultarCuestionario")]
        public async Task<IActionResult> ConsultarCuestionarioAsync(CuestionarioRequestModel cuestionarioRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-questions";
                cuestionarioRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(cuestionarioRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var cuestionarios = JsonConvert.DeserializeObject<CuestionarioResponseModel>(respuesta);
                List<OptionsDataModel> respuestaOpciones = _context.ConsultarIdOpcion(Convert.ToInt32(cuestionarioRequest.id_cuestionario_respondido));

                for (int i = 0; i < cuestionarios.data.Count; i++)
                {
                    for (int j = 0; j < cuestionarios.data[i].questions.Count; j++)
                    {
                        for (int l = 0; l < cuestionarios.data[i].questions[j].options.Count; l++)
                        {
                            int id_opcion = cuestionarios.data[i].questions[j].options[l].option_id;
                            //
                            foreach (var item in respuestaOpciones)
                            {
                                if(item.id_respuesta_bh == id_opcion)
                                {
                                    cuestionarios.data[i].questions[j].options[l].id_preguntaopciones = item.id_preguntaopciones;
                                    cuestionarios.data[i].questions[j].options[l].id_pregunta = item.id_pregunta;
                                }
                            }
                        }
                    }
                }

                if (cuestionarios.data == null)
                    return StatusCode((int)HttpStatusCode.InternalServerError, cuestionarios);
                else if (cuestionarios.data.Count == 0)
                    return NotFound(cuestionarios);

                return Ok(cuestionarios);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPut]
        [Route("GuardarRespuesta")]
        public async Task<IActionResult> GuardarRespuestaAsync(RespuestaRequestModel respuestaRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/create-up-response";
                respuestaRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(respuestaRequest);

                EncuestaRespuestaModel objRespuesta = new EncuestaRespuestaModel();

                objRespuesta.id_preguntaopciones = respuestaRequest.id_preguntaopciones;
                objRespuesta.id_pregunta = respuestaRequest.id_pregunta;
                objRespuesta.id_encuesta_persona = respuestaRequest.idCuestionarioPersona;
                objRespuesta.texto_respuesta = null;
                objRespuesta.enviada = true;

                EncuestaRespuestaModel objRespuestaExiste = ValidarRespuestaPreguntaAsync(objRespuesta);

                if (objRespuestaExiste == null)
                    await RegistrarRespuestaPreguntaAsync(objRespuesta);
                else
                {
                    objRespuesta.id_respuesta = objRespuestaExiste.id_respuesta;
                    await ModificarRespuestaPreguntaAsync(objRespuesta);
                }

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest("0");


                return Ok("1");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPut]
        [Route("TerminarCuestionario")]
        public async Task<IActionResult> TerminarCuestionarioAsync(CuestionarioRequestModel cuestionarioRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/finish-quest";
                cuestionarioRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(cuestionarioRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var result = JsonConvert.DeserializeObject<ResponseModel>(respuesta);

                if (result.result_code.Equals("0"))
                    return BadRequest("0");
                int R = await _context.TerminarCuestionarioAsync(cuestionarioRequest);
                return Ok("1");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ConsultarSecciones")]
        public async Task<IActionResult> ConsultarSeccionesAsync()
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-all-sections";
                string master_key = _config["master_key"];
                string body = "{\"master_key\": \"" + master_key + "\"}";

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var cuestionarios = JsonConvert.DeserializeObject<SeccionResponseModel>(respuesta);

                if (cuestionarios.data == null)
                    return StatusCode((int)HttpStatusCode.InternalServerError, cuestionarios);
                else if (cuestionarios.data.Count == 0)
                    return NotFound(cuestionarios);

                return Ok(cuestionarios);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ConsultarCuestionarioPorSeccion")]
        public async Task<IActionResult> ConsultarCuestionarioPorSeccionAsync(CuestionarioRequestModel cuestionarioRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-questions-by-section";
                cuestionarioRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(cuestionarioRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var cuestionarios = JsonConvert.DeserializeObject<CuestionarioResponseModel>(respuesta);

                if (cuestionarios.data == null)
                    return StatusCode((int)HttpStatusCode.InternalServerError, cuestionarios);
                else if (cuestionarios.data.Count == 0)
                    return NotFound(cuestionarios);

                return Ok(cuestionarios);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ConsultarUltimaPregunta")]
        public async Task<IActionResult> ConsultarUltimaPreguntaAsync(UltimaRespuestaRequestModel cuestionarioRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/get-last-answer";
                cuestionarioRequest.master_key = _config["master_key"];
                string body = JsonConvert.SerializeObject(cuestionarioRequest);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var cuestionarios = JsonConvert.DeserializeObject<UltimaRespuestaResponseModel>(respuesta);

                if (cuestionarios.data == null)
                    return StatusCode((int)HttpStatusCode.InternalServerError, cuestionarios);
                else if (cuestionarios.data.id_respuesta == 0)
                    return NotFound(cuestionarios);

                return Ok(cuestionarios);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        #endregion
        #region Resultados

        [HttpGet]
        [Route("ResultadosPorcentajePorEmpresa")]
        public async Task<IActionResult> ResultadosPorcentajePorEmpresaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/porcentaje-respondido-por-empresa";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var resultados = JsonConvert.DeserializeObject<ResultadoPorcentajeResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosPorcentajePorArea")]
        public async Task<IActionResult> ResultadosPorcentajePorAreaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/porcentaje-respondido-por-area";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var resultados = JsonConvert.DeserializeObject<ResultadoPorcentajeResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosPorcentajePorPuesto")]
        public async Task<IActionResult> ResultadosPorcentajePorPuestoAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/porcentaje-respondido-por-puesto";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var resultados = JsonConvert.DeserializeObject<ResultadoPorcentajeResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario1PorArea")]
        public async Task<IActionResult> ResultadosCuestionario1PorAreaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario1-area";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario1ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario1PorEmpresa")]
        public async Task<IActionResult> ResultadosCuestionario1PorEmpresaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario1-empresa";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario1ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario1PorPuesto")]
        public async Task<IActionResult> ResultadosCuestionario1PorPuestoAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario1-puesto";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario1ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario2PorArea")]
        public async Task<IActionResult> ResultadosCuestionario2PorAreaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario2-area";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario2PorEmpresa")]
        public async Task<IActionResult> ResultadosCuestionario2PorEmpresaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario2-empresa";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario2PorPuesto")]
        public async Task<IActionResult> ResultadosCuestionario2PorPuestoAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario2-puesto";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario3PorArea")]
        public async Task<IActionResult> ResultadosCuestionario3PorAreaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario3-area";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario3PorEmpresa")]
        public async Task<IActionResult> ResultadosCuestionario3PorEmpresaAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario3-empresa";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosCuestionario3PorPuesto")]
        public async Task<IActionResult> ResultadosCuestionario3PorPuestoAsync(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario3-puesto";
                resultadoRequest.master_key = _config["master_key"];
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoCuestionario2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpPut]
        [Route("ResultadosIndividualCuestionario1")]
        public async Task<IActionResult> ResultadosIndividualCuestionario1Async(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario1-individual";
                resultadoRequest.master_key = _config["master_key"];
                PeriodoRequestModel objRespuestaExiste = _context.ConsultarPeriodoxIdPaciente(resultadoRequest.id_usuario_medi);

                if (objRespuestaExiste == null)
                    return NotFound("0");
                else
                {
                    resultadoRequest.id_periodo = objRespuestaExiste.id_periodo_bh;
                }
                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
                var resultados = JsonConvert.DeserializeObject<ResultadoIndividual1ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return NotFound("0");
                else if (resultados.data == null)
                    return NotFound("0");

                EncuestaResultadoRequestModel objResultado= new EncuestaResultadoRequestModel();

                objResultado.resultados_cuestionario = resultados.data.resultados_cuestionario_1;
                objResultado.cuerpo_html = resultados.data.tabla_html;
                objResultado.id_encuesta_persona = resultadoRequest.id_encuesta;

                int guardado = await _context.InsertarResultadosEncuestas(objResultado);

                return Ok(resultados.data.resultados_cuestionario_1);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosIndividualCuestionario2")]
        public async Task<IActionResult> ResultadosIndividualCuestionario2Async(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario2-individual";
                resultadoRequest.master_key = _config["master_key"];
                PeriodoRequestModel objRespuestaExiste = _context.ConsultarPeriodoxIdPaciente(resultadoRequest.id_usuario_medi);
                if (objRespuestaExiste == null)
                    return NotFound("0");
                else
                {
                    resultadoRequest.id_periodo = objRespuestaExiste.id_periodo_bh;
                }

                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var resultados = JsonConvert.DeserializeObject<ResultadoIndividual2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                EncuestaResultadoRequestModel objResultado = new EncuestaResultadoRequestModel();

                objResultado.resultados_cuestionario = resultados.data.resultados.puntuacion + " - " + resultados.data.resultados.etiqueta;
                objResultado.cuerpo_html = resultados.data.tabla_html;
                objResultado.id_encuesta_persona = resultadoRequest.id_encuesta;

                int guardado = await _context.InsertarResultadosEncuestas(objResultado);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("ResultadosIndividualCuestionario3")]
        public async Task<IActionResult> ResultadosIndividualCuestionario3Async(ResultadoRequestModel resultadoRequest)
        {
            string respuesta = string.Empty;

            try
            {
                string url = _config["UrlNom035"] + "/v1/api/resultados-cuestionario3-individual";
                resultadoRequest.master_key = _config["master_key"];
                PeriodoRequestModel objRespuestaExiste = _context.ConsultarPeriodoxIdPaciente(resultadoRequest.id_usuario_medi);
                if (objRespuestaExiste == null)
                    return NotFound("0");
                else
                {
                    resultadoRequest.id_periodo = objRespuestaExiste.id_periodo_bh;
                }

                //Configuracon para omitir datos nulos
                JsonSerializerSettings JsonSettings = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };
                string body = JsonConvert.SerializeObject(resultadoRequest, JsonSettings);

                var client = new RestClient(url);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddParameter("application/json", body, ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                respuesta = response.Content;
				respuesta = Regex.Replace(respuesta, "^[^\\{]*", "");
				var resultados = JsonConvert.DeserializeObject<ResultadoIndividual2ResponseModel>(respuesta);

                if (resultados.result_code.Equals("0"))
                    return StatusCode((int)HttpStatusCode.InternalServerError, resultados);
                else if (resultados.data == null)
                    return NotFound(resultados);

                EncuestaResultadoRequestModel objResultado = new EncuestaResultadoRequestModel();

                objResultado.resultados_cuestionario = resultados.data.resultados.puntuacion + " - " + resultados.data.resultados.etiqueta;
                objResultado.cuerpo_html = resultados.data.tabla_html;
                objResultado.id_encuesta_persona = resultadoRequest.id_encuesta;

                int guardado = await _context.InsertarResultadosEncuestas(objResultado);

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        #endregion
        
        #region Otros

        [HttpGet]
        [Route("RegistrarCuestionarioCompleto")]
        public async Task<IActionResult> RegistrarCuestionarioCompletoAsync(CuestionarioRequestModel cuestionarioRequest)
        {
            string respuesta = string.Empty;

            try
            {
                var resultado = await ConsultarCuestionarioAsync(cuestionarioRequest);
                if (((ObjectResult)resultado).StatusCode == 200)
                {
                    var cuestionarios = (CuestionarioResponseModel)((ObjectResult)resultado).Value;
                    var atencionesExamenes = _context.ConsultarEncuestaPorId(cuestionarioRequest.id_cuestionario);

                    var encuesta = new Encuesta()
                    {
                        id_tipo_encuesta = 1,
                        nom_cuestionario = "Cuestionario " + cuestionarioRequest.id_cuestionario,
                        id_encuesta_bh = cuestionarioRequest.id_cuestionario
                    };
                    int idEncuesta = await _context.InsertarEncuesta(encuesta);

                    foreach (var seccion in cuestionarios.data)
                    {
                        var encuestaSeccion = new EncuestaSeccion()
                        {
                            id_encuesta = cuestionarioRequest.id_cuestionario,
                            nombre_seccion = seccion.name,
                            id_seccion_bh = seccion.id_seccion
                        };
                        int idSeccion = await _context.InsertarSeccion(encuestaSeccion);

                        foreach (var pregunta in seccion.questions)
                        {
                            var encuestaPregunta = new EncuestaPregunta()
                            {
                                id_seccion = idSeccion,
                                texto_pregunta = pregunta.question,
                                tipo_pregunta = cuestionarioRequest.id_cuestionario,
                                id_pregunta_bh = pregunta.question_id
                            };
                            int idPregunta = await _context.InsertarPregunta(encuestaPregunta);

                            foreach (var opcion in pregunta.options)
                            {
                                var encuestaPreguntaOpciones = new EncuestaPreguntaOpciones()
                                {
                                    id_pregunta = idPregunta,
                                    texto_preguntaopcion = opcion.question_option,
                                    id_respuesta_bh = opcion.option_id
                                };
                                await _context.InsertarOpcion(encuestaPreguntaOpciones);
                            }
                        }
                    }
                }

                return Ok("Ok");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }


        [HttpGet]
        [Route("RegistrarEncuestaPersona")]
        public async Task<int> RegistrarEncuestaPersonaAsync(EncuestaPersonaModel cuestionarioRequest)
        {
            string respuesta = string.Empty;

            try
            {
                var encuestaPersonaAsigna = _context.ConsultarEncuestaPersonaPorIdBH(cuestionarioRequest.id_cuestionario_respondido);
                int idEncuesta = 0;
                if(encuestaPersonaAsigna == null)
                    idEncuesta = await _context.InsertarEncuestaPersona(cuestionarioRequest);
                else if (encuestaPersonaAsigna.id_cuestionario_respondido == 0)
                    idEncuesta = await _context.InsertarEncuestaPersona(cuestionarioRequest);
                else
                    idEncuesta = encuestaPersonaAsigna.id_encuesta_persona;

                return idEncuesta;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        [HttpPost]
        [Route("InsertEncuestaComentario")]
        public async Task<IActionResult> InsertEncuestaComentarioAsync(EncuestaComentario comentario)
        {
            string respuesta = string.Empty;

            try
            {
                //mimodelo
                //int rescomentario = await _context.InsertarEncuestaComentario(comentario);
                if (comentario == null) return BadRequest();
                if (comentario.id_Cliente == 0) return BadRequest();
                if (comentario.Comentario.Trim().Length<3) return BadRequest();
                EncuestaComentarioEmpresa rescomentario = await _context.InsertarEncuestaComentario(comentario);
                if (rescomentario == null) return NotFound("no se pudo insertar el comentario");
                else {

                    string body = rescomentario.body.Replace("{{Comentario}}", comentario.Comentario);

                    await EnviarCorreo(rescomentario.correo_Cliente, rescomentario.asunto, body);
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpGet]
        [Route("PermisoComentarioEmpresa/{id_Cliente}")]
        public async Task<IActionResult> PermisoComentarioEmpresaAsync(int id_Cliente)
        {
            string respuesta = string.Empty;
            try
            {
                bool rescomentario = await _context.PermisoComentarioEmpresa(id_Cliente);
                if (!rescomentario) return NotFound("no hay empresas");
                else
                {
                    return Ok(id_Cliente);
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        public static async Task EnviarCorreo(string to, string subject, string body, string nombreArchivo ="", string copy = "")
        {
            try
            {
                copy = "";// ConfigurationManager.AppSettings["EmailToCopy"];
                var para = new EmailAddress(to);
                var client = new SendGridClient("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");
                //var client = new SendGridClient(ConfigurationManager.AppSettings["ApiKeySenGrid"]);
                var from = new EmailAddress("notificacion@medismart.live", "Comentario Anonimos Nom035");
                var plainTextContent = "";
                var htmlContent = body;
                var msg = MailHelper.CreateSingleEmail(from, para, subject, plainTextContent, htmlContent);
                if (!string.IsNullOrEmpty(copy))
                {
                    string listaDestinatarios = copy;
                    string[] destinatarios = listaDestinatarios.Split(',');
                    foreach (var destinatario in destinatarios)
                    {
                        msg.AddBcc(destinatario);
                    }
                }
                msg.AddBcc("notificacion@medismart.live");
                if (!string.IsNullOrEmpty(nombreArchivo))
                {
                    byte[] bytes = System.IO.File.ReadAllBytes(nombreArchivo);
                    string fileContentsAsBase64 = Convert.ToBase64String(bytes);

                    var attachment = new SendGrid.Helpers.Mail.Attachment
                    {
                        Filename = "altas.csv",
                        Type = "text/csv",
                        Content = fileContentsAsBase64
                    };

                    msg.AddAttachment(attachment);
                }


                var response = await client.SendEmailAsync(msg);
                Console.WriteLine(response.StatusCode);
                if (response.StatusCode.ToString() == "Accepted")
                {
                    Console.WriteLine("\n\n Archivo envíado para el día " + DateTime.Now.ToString(@"MM\/dd\/yyyy h\:mm tt"));
                }
                else
                {
                    Console.WriteLine("\n\n Error en el envío del archivo del día : " + DateTime.Now.ToString(@"MM\/dd\/yyyy h\:mm tt"));
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        [HttpGet]
        [Route("validarRegistrarEmpresaxPaciente/{id}")]
        public async Task<IActionResult> ValidarRegistrarEmpresaxPacienteAsync(int id)
        {
            string respuesta = string.Empty;

            try
            {
                EmpresaDataModel ObjEmpresa = _context.ConsultarEmpresaPorIdPaciente(id);
                EmpresaRequestModel empresaRequest = new EmpresaRequestModel();
                if (ObjEmpresa == null)
                {
                    return NotFound("No se han configurado los datos de la empresa");
                }
                else if (ObjEmpresa.IdEmpresaBH == 0)
                {
                    empresaRequest.rfc = ObjEmpresa.rfc;
                    empresaRequest.razon_social = ObjEmpresa.razon_social;
                    empresaRequest.cantidad_empleados = ObjEmpresa.cantidad_empleados;
                    empresaRequest.nombre_comercial = ObjEmpresa.nombre_comercial;
                    var resultado = await CrearEmpresaAsync(empresaRequest);

                    if (((ObjectResult)resultado).StatusCode == 201)
                    {
                        ResponseModel response = (ResponseModel)((ObjectResult)resultado).Value;
                        respuesta = response.message;
                        int guardado = _context.UpdateIdEmpresaBHxId(ObjEmpresa.id, Convert.ToInt32(response.data));
                        PeriodoRequestModel periodo = new PeriodoRequestModel();
                        periodo.id_empresa = ObjEmpresa.IdEmpresaBH == 0 ? Convert.ToInt32(response.data): ObjEmpresa.IdEmpresaBH;
                        periodo.cuestionarios_disponibles = Convert.ToInt32(ObjEmpresa.cantidad_empleados);
                        periodo.fecha_inicio = DateTime.Now.ToString("yyyy-MM-dd");
                        periodo.fecha_fin = DateTime.Now.AddDays(30).ToString("yyyy-MM-dd");
                        periodo.nombre = "Periodo para empresa ID: " + respuesta;

                        var resultadoPeriodo = await CrearPeriodoAsync(periodo);
                        if (((ObjectResult)resultadoPeriodo).StatusCode == 201)
                        {
                            ResponseModel responsePeriodo = (ResponseModel)((ObjectResult)resultadoPeriodo).Value;
                            periodo.id_empresa = ObjEmpresa.id;
                            respuesta = responsePeriodo.message;
                            periodo.id_periodo_bh = Convert.ToInt32(responsePeriodo.data);
                            int guardadoPeriodo = await _context.InsertarPeriodo(periodo);
                        }
                        else
                        {
                            return NotFound("Se presentó un problema al crear el período " +  respuesta);
                        }
                    }
                    else
                    {
                        return NotFound("Se presentó un problema al crear la empresa " + respuesta);
                    }
                }

                return Ok("Ok");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new JsonResult(new { msg = ex.Message, respuesta }));
            }
        }

        [HttpGet]
        [Route("validarInfoLaboralPacienteAsync/{id}")]
        public  PersonasDatosLaborales ValidarInfoLaboralPacienteAsync(int id)
        {
            string respuesta = string.Empty;

            try
            {
                PersonasDatosLaborales ObjEmpresa = _context.ConsultarDatosLaborales(id);
                return ObjEmpresa;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }

        }


        [HttpGet]
        [Route("ValidarAvanceEncuesta/{id}/{idpersona}/{idcliente}")]
        public async Task<EncuestaAvanceModel> ValidarAvanceEncuestaAsync(int id, int idpersona, int idcliente)
        {
            string respuesta = string.Empty;

            try
            {
                EncuestaAvanceModel objRespuesta = new EncuestaAvanceModel();
                EncuestaAvanceModel objAvancePreguntas = _context.ConsultarPorcentajePregutasAvance(id, idpersona, idcliente);
                EncuestaAvanceModel objAvanceRespuestas = _context.ConsultarPorcentajeRespuestasAvance(id, idpersona, idcliente);
                objRespuesta.porcentaje= objAvanceRespuestas.respuestas==0?0:(objAvanceRespuestas.respuestas/ objAvancePreguntas.preguntas)*100 ;
                objRespuesta.respuestas= objAvanceRespuestas.respuestas;
                objRespuesta.preguntas = objAvancePreguntas.preguntas;

                EmpresaDataModel encuesta;
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/nom035/ValidarInfoPacienteEmpresaBH/{idpersona}/{idcliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        encuesta = JsonConvert.DeserializeObject<EmpresaDataModel>(apiResponse);
                    }
                }

                ResponseModel responseModel;
                using (var httpClient = new HttpClient())
                {

                    CuestionarioRequestModel cuestionarioRequest = new CuestionarioRequestModel()
                    {
                        id_empresa = encuesta.IdEmpresaBH,
                        id_cuestionario = id,
                        id_usuario = encuesta.idpersona_bh
                    };
                    var jsonStringCuestionario = JsonConvert.SerializeObject(cuestionarioRequest);

                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(_config["ServicesUrl"] + $"/Nom035/ConsultarCuestionarioPorUsuario"),
                        Content = new StringContent(jsonStringCuestionario, Encoding.UTF8, MediaTypeNames.Application.Json),
                    };

                    using (var response = await httpClient.SendAsync(request))
                    {
						string apiResponse = await response.Content.ReadAsStringAsync();
						apiResponse = Regex.Replace(apiResponse, "^[^\\{]*", "");
						responseModel = JsonConvert.DeserializeObject<ResponseModel>(apiResponse);
					}
                }
                    if (responseModel.message != "OK")
                        objRespuesta.porcentaje = 100;
                    return objRespuesta;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("ValidarInfoEncuestaEmpresa/{id}/{id_cliente}")]
        public EmpresaDataModel ValidarInfoEncuestaEmpresaAsync(int id, int id_cliente)
        {
            string respuesta = string.Empty;

            try
            {
                EmpresaDataModel ObjEmpresa = _context.ConsultarPacienteEmpresaBH(id, id_cliente);
                return ObjEmpresa;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("ValidarInfoPacienteEmpresaBH/{id}/{id_cliente}")]
        public EmpresaDataModel ValidarInfoPacienteEmpresaBHAsync(int id, int id_cliente)
        {
            string respuesta = string.Empty;

            try
            {
                EmpresaDataModel ObjEmpresa = _context.ConsultarPacienteEmpresaBH(id, id_cliente);
                return ObjEmpresa;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        public EncuestaRespuestaModel ValidarRespuestaPreguntaAsync(EncuestaRespuestaModel datos)
        {
            string respuesta = string.Empty;

            try
            {
                EncuestaRespuestaModel objRespuesta = _context.ConsultarRespuestaPregunta(datos.id_pregunta,datos.id_encuesta_persona);
                return objRespuesta;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        public async Task<int> RegistrarRespuestaPreguntaAsync(EncuestaRespuestaModel datos)
        {
            string respuesta = string.Empty;

            try
            {
                int objDevuelto = await _context.InsertarRespuestaPregunta(datos);
                return objDevuelto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        public async Task<int> ModificarRespuestaPreguntaAsync(EncuestaRespuestaModel datos)
        {
            string respuesta = string.Empty;

            try
            {
                int objDevuelto = await _context.UpdateRespuestaPregunta(datos);
                return objDevuelto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }
        #endregion
    }
}
