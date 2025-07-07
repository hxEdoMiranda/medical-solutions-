using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebMVC.Models;

namespace WebMVC.Controllers
{
    public class CuestionarioController : Controller
    {
        //private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        public CuestionarioController(IConfiguration config = null)
        {
            _config = config;
        }
        // GET: CuestionarioController
        public ActionResult Index()
        {
            return View();
        }

        // GET: CuestionarioController/Details/5
        public async Task<ActionResult> Home035Async()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            return View(paciente);
        }
        public async Task<ActionResult> FinalCuestionarioAsync()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);


            return View();
        }
        public async Task<ActionResult> FinalCuestionarioOcupacionalAsync()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);


            return View();
        }
        public async Task<ActionResult> FinalCuestionarioAgendarAsync()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);


            return View();
        }


        // GET: CuestionarioController/RegistroCuestionario
        public async Task<ActionResult> RegistroCuestionarioAsync(int cuestionario)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            int id_cuestionario;
            if (cuestionario == 1)
            {
                ViewBag.tituloEncuesta = "Acontecimiento Traumático";
                ViewBag.cuestionarioBH = 1;
            }
            else if (cuestionario == 2)
            {
                ViewBag.tituloEncuesta = "Entorno Organizacional";
                ViewBag.cuestionarioBH = 2;
            }
            else
            {
                ViewBag.tituloEncuesta = "Entorno Organizacional";
                ViewBag.cuestionarioBH = 3;
            }

            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            EmpresaEncuestaModel encuesta;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/Nom035/ValidarInfoPacienteEmpresaBH/{paciente.Id}/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    encuesta = JsonConvert.DeserializeObject<EmpresaEncuestaModel>(apiResponse);
                }
            }

            ResponseModel responseModel;
            using (var httpClient = new HttpClient())
            {

                ViewBag.idUsuarioBH = encuesta.idpersona_bh;
                ViewBag.idUsuario = encuesta.idpersona;
                CuestionarioRequestModel cuestionarioRequest = new CuestionarioRequestModel()
                {
                    id_empresa = encuesta.IdEmpresaBH,
                    id_cuestionario = cuestionario,
                    id_usuario = encuesta.idpersona_bh
                };
                var jsonStringCuestionario = JsonConvert.SerializeObject(cuestionarioRequest);

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(_config["ServicesUrl"] + $"/nom035/ConsultarCuestionarioPorUsuario"),
                    Content = new StringContent(jsonStringCuestionario, Encoding.UTF8, MediaTypeNames.Application.Json),
                };

                using (var response = await httpClient.SendAsync(request))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    responseModel = JsonConvert.DeserializeObject<ResponseModel>(apiResponse);
                }
            }

            if (responseModel.result_code.Equals("1") && responseModel.message.Equals("OK"))
            {
                CuestionarioResponseModel cuestionarios;
                id_cuestionario = Convert.ToInt32(responseModel.data);
                ViewBag.idCuestionario = id_cuestionario;


                int idAgregado;
                using (var httpClient = new HttpClient())
                {

                    ViewBag.idUsuarioBH = encuesta.idpersona_bh;
                    ViewBag.idUsuario = encuesta.idpersona;
                    EncuestaPersonaModel cuestionarioPersonaRequest = new EncuestaPersonaModel()
                    {
                        id_encuesta = cuestionario,
                        id_cuestionario_respondido = id_cuestionario,
                        id_persona = encuesta.idpersona,
                        fecha_inicio_diligencia=DateTime.Now,
                        id_empresa = Convert.ToInt32(idCliente) 
                    };
                    var jsonStringCuestionario = JsonConvert.SerializeObject(cuestionarioPersonaRequest);

                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(_config["ServicesUrl"] + $"/nom035/RegistrarEncuestaPersona"),
                        Content = new StringContent(jsonStringCuestionario, Encoding.UTF8, MediaTypeNames.Application.Json),
                    };

                    using (var response = await httpClient.SendAsync(request))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        idAgregado = JsonConvert.DeserializeObject<int>(apiResponse);
                    }
                }

                ViewBag.idCuestionarioPersona = idAgregado;


                using (var httpClient = new HttpClient())
                {
                    CuestionarioRequestModel cuestionarioRequest = new CuestionarioRequestModel()
                    {
                        //id_empresa = 160, //encuesta.IdEmpresaBH
                        id_cuestionario = cuestionario,
                        id_cuestionario_respondido = id_cuestionario
                    };
                    var jsonStringCuestionario = JsonConvert.SerializeObject(cuestionarioRequest);

                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(_config["ServicesUrl"] + $"/nom035/ConsultarCuestionario"),
                        Content = new StringContent(jsonStringCuestionario, Encoding.UTF8, MediaTypeNames.Application.Json),
                    };

                    using (var response = await httpClient.SendAsync(request))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        cuestionarios = JsonConvert.DeserializeObject<CuestionarioResponseModel>(apiResponse);
                    }
                }

                return View(cuestionarios);
            }

            return View();
        }
        // GET: CuestionarioController/RegistroCuestionario
        public async Task<ActionResult> RegistroCuestionario2Async(int cuestionario)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            int id_cuestionario;
            if (cuestionario == 1)
            {
                ViewBag.tituloEncuesta = "Acontecimiento Traumático";
                ViewBag.cuestionarioBH = 1;
            }
            else if (cuestionario == 2)
            {
                ViewBag.tituloEncuesta = "Entorno Organizacional";
                ViewBag.cuestionarioBH = 2;
            }
            else
            {
                ViewBag.tituloEncuesta = "Entorno Organizacional";
                ViewBag.cuestionarioBH = 3;
            }

            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            EmpresaEncuestaModel encuesta;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/nom035/ValidarInfoPacienteEmpresaBH/{paciente.Id}/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    encuesta = JsonConvert.DeserializeObject<EmpresaEncuestaModel>(apiResponse);
                }
            }

            ResponseModel responseModel;
            using (var httpClient = new HttpClient())
            {

                ViewBag.idUsuarioBH = encuesta.idpersona_bh;
                ViewBag.idUsuario = encuesta.idpersona;
                CuestionarioRequestModel cuestionarioRequest = new CuestionarioRequestModel()
                {
                    id_empresa = encuesta.IdEmpresaBH,
                    id_cuestionario = cuestionario,
                    id_usuario = encuesta.idpersona_bh
                };
                var jsonStringCuestionario = JsonConvert.SerializeObject(cuestionarioRequest);

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(_config["ServicesUrl"] + $"/nom035/ConsultarCuestionarioPorUsuario"),
                    Content = new StringContent(jsonStringCuestionario, Encoding.UTF8, MediaTypeNames.Application.Json),
                };

                using (var response = await httpClient.SendAsync(request))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    responseModel = JsonConvert.DeserializeObject<ResponseModel>(apiResponse);
                }
            }

            if (responseModel.result_code.Equals("1") && responseModel.message.Equals("OK"))
            {
                CuestionarioResponseModel cuestionarios;
                id_cuestionario = Convert.ToInt32(responseModel.data);
                ViewBag.idCuestionario = id_cuestionario;


                int idAgregado;
                using (var httpClient = new HttpClient())
                {

                    ViewBag.idUsuarioBH = encuesta.idpersona_bh;
                    ViewBag.idUsuario = encuesta.idpersona;
                    EncuestaPersonaModel cuestionarioPersonaRequest = new EncuestaPersonaModel()
                    {
                        id_encuesta = cuestionario,
                        id_cuestionario_respondido = id_cuestionario,
                        id_persona = encuesta.idpersona,
                        fecha_inicio_diligencia = DateTime.Now,
                        id_empresa = Convert.ToInt32(idCliente)
                    };
                    var jsonStringCuestionario = JsonConvert.SerializeObject(cuestionarioPersonaRequest);

                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(_config["ServicesUrl"] + $"/nom035/RegistrarEncuestaPersona"),
                        Content = new StringContent(jsonStringCuestionario, Encoding.UTF8, MediaTypeNames.Application.Json),
                    };

                    using (var response = await httpClient.SendAsync(request))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        idAgregado = JsonConvert.DeserializeObject<int>(apiResponse);
                    }
                }

                ViewBag.idCuestionarioPersona = idAgregado;


                using (var httpClient = new HttpClient())
                {
                    CuestionarioRequestModel cuestionarioRequest = new CuestionarioRequestModel()
                    {
                        id_empresa = encuesta.IdEmpresaBH,
                        id_cuestionario = cuestionario,
                        id_cuestionario_respondido = id_cuestionario
                    };
                    var jsonStringCuestionario = JsonConvert.SerializeObject(cuestionarioRequest);

                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(_config["ServicesUrl"] + $"/nom035/ConsultarCuestionario"),
                        Content = new StringContent(jsonStringCuestionario, Encoding.UTF8, MediaTypeNames.Application.Json),
                    };

                    using (var response = await httpClient.SendAsync(request))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        cuestionarios = JsonConvert.DeserializeObject<CuestionarioResponseModel>(apiResponse);
                    }
                }

                return View(cuestionarios);
            }

            return View();
        }

        public async Task<ActionResult> RegistroDatosPacienteAsync(int ocupacional = 0)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.ocupacional = ocupacional;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a perfil";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            DateTime fechaActual = DateTime.Now;
            paciente.Edad = paciente.FNacimiento==null?0:fechaActual.Year - paciente.FNacimiento.Value.Year;
            paciente.EstadoCivil = paciente.EstadoCivil != null ? paciente.EstadoCivil.Trim() : "";
            return View(paciente);
        }

        public async Task<ActionResult> RegistroDatosLaboralesAsync()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a perfil";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            PersonasDatosLaboral paciente = new PersonasDatosLaboral();
            PersonasDatosLaboral pacienteResult = new PersonasDatosLaboral();

            PersonasViewModel persona = new PersonasViewModel();

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/nom035/validarInfoLaboralPacienteAsync/{persona.Id}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    pacienteResult = JsonConvert.DeserializeObject<PersonasDatosLaboral>(apiResponse);
                }
            }
            paciente = pacienteResult !=null ? pacienteResult : new PersonasDatosLaboral();
            paciente.PersonaDatosBasicos = persona;


            DateTime fechaActual = DateTime.Now;
            paciente.PersonaDatosBasicos.Edad = paciente.PersonaDatosBasicos.FNacimiento == null ? 0 : fechaActual.Year - paciente.PersonaDatosBasicos.FNacimiento.Value.Year;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasdatoslaboral/getListaAreasEmpresa?idUsuario={paciente.PersonaDatosBasicos.Id}&idEmpresa={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente.Areas = JsonConvert.DeserializeObject<List<AreasPersonaLaboral>>(apiResponse);
                }
            }
            int idAreaConsulta = pacienteResult != null ? paciente.Id_Area : paciente.Areas[0].id_area;
            using (var httpClient = new HttpClient())
            {
                //httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasdatoslaboral/getListaPuestos/{ idAreaConsulta }"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente.Puestos = JsonConvert.DeserializeObject<List<PuestoPersonaLaboral>>(apiResponse);
                }
            }

            return View(paciente);
        }

        public async Task<ActionResult> ListadoCuestionarioAsync(int ocupacional =0)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.ocupacional = ocupacional;
            PersonasViewModel paciente;
            List<int> cuestionariosDeEmpresa = new List<int>();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            } 
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
            var index = 0;
            foreach (var item in encuestaEmpresas)
            {

                using (var httpClient = new HttpClient())
                {
                    var idEncuesta = item.id_encuesta_activa;
                    var idPersona = paciente.Id;
                    var ResponseEncuestaId = await httpClient.GetAsync(_config["ServicesUrl"] + $"/medicinaocupacional/GetOneIdEncuestaPersona/{idEncuesta}/{idPersona}");
                    string apiResponseEncuestaId = await ResponseEncuestaId.Content.ReadAsStringAsync();
                    int idEncuestaPersona = JsonConvert.DeserializeObject<int>(apiResponseEncuestaId);
                    var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/medicinaocupacional/GetProgresoCuestinario/{idEncuesta}/{idPersona}/{idEncuestaPersona}");
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    preguntasAvance = JsonConvert.DeserializeObject<CuestionarioProgreso>(apiResponse);
                    
                }
                if(preguntasAvance != null)
                    encuestaEmpresas[index].Avance = preguntasAvance.Avance;
                else
                    encuestaEmpresas[index].Avance = 0;
                index++;
            }
            

            ViewBag.cuestionariosEmpresa = encuestaEmpresas;
            EmpresaEncuestaModel encuesta;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/nom035/ValidarInfoEncuestaEmpresa/{paciente.Id}/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    encuesta = JsonConvert.DeserializeObject<EmpresaEncuestaModel>(apiResponse);
                }
            }
            EncuestaAvanceModel avance;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/Nom035/ValidarAvanceEncuesta/{1}/{paciente.Id}/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    avance = JsonConvert.DeserializeObject<EncuestaAvanceModel>(apiResponse);
                }
            }
            ViewBag.Cuestionario1Avance = Math.Ceiling(avance == null ? 0 : avance.porcentaje);
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/nom035/ValidarAvanceEncuesta/{2}/{paciente.Id}/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    avance = JsonConvert.DeserializeObject<EncuestaAvanceModel>(apiResponse);
                }
            }
            ViewBag.Cuestionario2Avance = Math.Ceiling(avance == null ? 0 : avance.porcentaje);
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/nom035/ValidarAvanceEncuesta/{3}/{paciente.Id}/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    avance = JsonConvert.DeserializeObject<EncuestaAvanceModel>(apiResponse);
                }
            }
            ViewBag.Cuestionario3Avance = Math.Ceiling(avance == null ? 0 : avance.porcentaje);

            return View(encuesta);
        }
        
        public async Task<ActionResult> MedicinaOcupacionalAsync()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a perfil";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }



            return View();
        }

        public async Task<ActionResult> MedicinaOcupacionalAgendar()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a perfil";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            List<VwHorasMedicos> proximaHora = new List<VwHorasMedicos>();
            using (var httpClient = new HttpClient())
            {
                var fechaHoy = DateTime.Parse(DateTime.Now.ToString()).ToString("yyyy-MM-dd");
                httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "bearer " + auth);
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/getMedicosHoraProxima?paraEspecialidad=S&idEspecialidad={1}&idBloque={0}&userId={uid}&fecha={fechaHoy}&idCliente={idCliente}&tipoEspecialidad="))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximaHora = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            ViewBag.horaEspecialidad = proximaHora;
            if (proximaHora.Count() > 0)
                ViewBag.horaEspecialidad = proximaHora[0];
        
           
            return View();
        }

        public async Task<ActionResult> TestOcupacionalAsync(int idCuestionario)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            //titulo test debe venir por la db
            ViewBag.idCuestionario = idCuestionario;

            EncuestaCondiciones condiciones;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/medicinaocupacional/GetEncuestaCondiciones/{idCuestionario}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    condiciones = JsonConvert.DeserializeObject<EncuestaCondiciones>(apiResponse);
                }
            }

            ViewBag.Condiciones = condiciones;
            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a Test Ocupacional";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }


            CuestionarioOcupacional cuestionarios = new CuestionarioOcupacional();
            cuestionarios = await CuestionarioOcupacional(idCuestionario);

            return View(cuestionarios);
        }

        public async Task<CuestionarioOcupacional> CuestionarioOcupacional(int idCuestionario)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            CuestionarioOcupacional cuestionarios = new CuestionarioOcupacional();

            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/medicinaocupacional/GetCuestionario/{idCuestionario}/{paciente.Id}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    cuestionarios = JsonConvert.DeserializeObject<CuestionarioOcupacional>(apiResponse);
                }
            }

            return cuestionarios;
        }

        public string GetHostValue(string value)
        {
            string demoVip = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid);
            if (demoVip == _config["DEMO-CHILE"])
                return "demo.";
            else if (demoVip == _config["DEMO-COLOMBIA"])
                return "demo.";
            else if (demoVip == _config["DEMO-MEXICO"])
                return "mx.medical";


            var hostTest = _config["HostTest"];
            if (!string.IsNullOrEmpty(hostTest))
                return hostTest;
            else
                return value;
        }
    }
}
