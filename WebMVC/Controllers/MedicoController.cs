using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
//using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebMVC.Models;
using System.Security.Principal;
using System.Text;
using Microsoft.AspNetCore.Mvc.Rendering;
using static System.Net.Mime.MediaTypeNames;
using System.Runtime.InteropServices;
using DocumentFormat.OpenXml.Office2010.Excel;
using Newtonsoft.Json.Linq;

namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "MedicoSchemes")]
    public class MedicoController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
       

        //public IActionResult FichaPaciente()
        //{
        //    return View();

        //}
        public MedicoController(IHttpClientFactory httpClientFactory, IConfiguration config = null)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
           
        }



        public async Task<IActionResult> IndexAsync()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            List<VwHorasMedicosBloquesHorasAtencion> horasAgendadasBloquesHoras;
            Atenciones atencion;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/VwHorasMedicos/getVwHorasMedicosBloquesHorasByMedic?uid={uid}&tipoLista={"A"}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicosBloquesHorasAtencion>>(apiResponse);
                }
            }
            foreach (var horasmedico in horasAgendadasBloquesHoras)
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    string url = $"/agendamientos/Atenciones/{horasmedico.IdAtencion}";
                    using (var response = await httpClient.GetAsync(url))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                        horasmedico.Peritaje = atencion.Peritaje;
                    }
                }
            }

            //HomeViewModel homeModel = new HomeViewModel() { CalendarData = horasAgendadas, TimelineData = horasAgendadasBloquesHoras };
            HomeViewModel homeModel = new HomeViewModel() { TimelineData2 = horasAgendadasBloquesHoras };
            return View("~/Views/Medico/Index.cshtml", homeModel);
        }
        public async Task<IActionResult> HomeUrgencia()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            List<VwHorasMedicosBloquesHoras> horasAgendadasBloquesHoras;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/VwHorasMedicos/getVwHorasMedicosBloquesHorasByMedic?uid={uid}&tipoLista={"U"}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicosBloquesHoras>>(apiResponse);
                }
            }

            //HomeViewModel homeModel = new HomeViewModel() { CalendarData = horasAgendadas, TimelineData = horasAgendadasBloquesHoras };
            HomeViewModel homeModel = new HomeViewModel() { TimelineData = horasAgendadasBloquesHoras };
            return View(homeModel);
        }
        public async Task<IActionResult> AtencionAsync(int id)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            Atenciones atencion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/{id}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }


            if ((atencion == null) || ((atencion.HoraMedico.IdMedico != int.Parse(uid)) && (atencion.IdMedicoFirmante != int.Parse(uid)))) return RedirectToAction("Index");

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                int idAtencion = atencion.Id;
                var jsonString = JsonConvert.SerializeObject(idAtencion);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                string url = $"/agendamientos/Atenciones/inicioAtencionMedico?idAtencion={idAtencion}";
                using (var response = await httpClient.PostAsync(url, httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            var log = new LogPacienteViaje();
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                log.Evento = "Médico ingresa al box de atención inmediata.";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = atencion.Id;
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                string url = $"/usuarios/personas/grabarLogPacienteViaje";
                using (var response = await httpClient.PostAsync(url, httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            if (string.IsNullOrEmpty(atencion.IdVideoCall))
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    var jsonString = JsonConvert.SerializeObject(id);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    string url = $"/agendamientos/Vonage";
                    using (var response = await httpClient.PutAsync(url, httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        string sessionId = apiResponse;
                        atencion.IdVideoCall = sessionId;
                    }
                }
            }

            List<Examenes> examenes;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Examenes";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenes = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }

            PersonasViewModel persona;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/personByUser/{atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = persona, Examenes = examenes, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria };

            switch (atencion.HoraMedico.IdEspecialidad)
            {
                case 57: return View("AtencionVeterinaria", atencionModel);

                default:
                    if (atencion.AtencionDirecta)
                        return View("AtencionEspera", atencionModel);
                    else
                        return View(atencionModel);

            }


        }

        public async Task<IActionResult> AtencionFirma(int id)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            Atenciones atencion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/{id}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            int idMedico = Convert.ToInt32(uid);
            if (atencion == null || atencion.IdMedicoFirmante != idMedico) return RedirectToAction("Index");

            if (string.IsNullOrEmpty(atencion.IdVideoCall))
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    var jsonString = JsonConvert.SerializeObject(id);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    string url = $"/agendamientos/Vonage";
                    using (var response = await httpClient.PutAsync(url, httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        string sessionId = apiResponse;
                        atencion.IdVideoCall = sessionId;
                    }
                }
            }

            List<Examenes> examenes;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Examenes";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenes = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }
            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, Examenes = examenes, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria };

            if (atencion.AtencionDirecta)
                return View("AtencionEspera", atencionModel);
            else
                return View(atencionModel);
        }
        [Route("Medico/FichaPaciente/{idPaciente}")]
        public async Task<IActionResult> FichaPacienteAsync(int idPaciente)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            PersonasViewModel paciente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/personas/getFichaPaciente?idPaciente={idPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            List<Atenciones> historialAtenciones;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{idPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }
            Paciente pacienteModel = new Paciente() { fichaPaciente = paciente, HistorialAtenciones = historialAtenciones };
            return View(pacienteModel);
        }

        //[Route("Medico/InformeAtencion/{idAtencion}")]
        public async Task<IActionResult> InformeAtencionAsync(int idAtencion, bool sendInforme = true)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.sendInforme = sendInforme;
            Atenciones atencion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/{idAtencion}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }
            ViewBag.idEspecialidad = 0;
            if (atencion.HoraMedico != null)
            {
                ViewBag.idEspecialidad = Convert.ToInt32(atencion.HoraMedico.IdEspecialidad);
            }
            PersonasViewModel paciente;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {

                string url = $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            if (sendInforme)
            {
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    var jsonString = JsonConvert.SerializeObject(idAtencion);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    string url = $"/correos/sendemail/enviarInforme?idAtencion={idAtencion}&baseUrl=${ViewBag.HostURL}";
                    using (var response = await httpClient.PostAsync(url, httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }

            }
            //interconsulta 
            List<string> especialidades = new List<string>();
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getAllSpecialityDerivacionName/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        try
                        {
                            especialidades = JsonConvert.DeserializeObject<List<string>>(apiResponse);
                        }
                        catch (JsonException ex)
                        {
                            Console.WriteLine($"Error de deserialización: {ex.Message}");
                        }
                    }
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Error de solicitud HTTP: {ex.Message}");
            }

            List<Archivo> archivosAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Archivo/getArchivoByPaciente?uid={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    archivosAtenciones = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
                }
            }

            using (var httpClient = new HttpClient())
            {
                string medikitUrl = _config["ServicesMediKit"] + $"/api/Medikit/AddPrescription/{idAtencion}";
                using (var response = await httpClient.PostAsync(medikitUrl, null))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string medikitResponseString = await response.Content.ReadAsStringAsync();
                        var medikitResponse = JsonConvert.DeserializeObject<MedikitResponse>(medikitResponseString);
                        if (medikitResponse.operationSuccess)
                        {
                            string newUrl = medikitResponse.objectResponse;
                            string newName = "Receta Medikit";
                            Archivo nuevaReceta = new Archivo // Crear un nuevo objeto Archivo para la receta de Medikit
                            {
                                nombreArchivo = newName,
                                url = newUrl,
                            };
                            archivosAtenciones.Add(nuevaReceta); // Agregar la receta de Medikit a la lista archivosAtenciones
                        }
                    }
                }
            }
            ViewBag.derivaciones = especialidades;
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente, Archivo = archivosAtenciones/*, Archivo = archivo */};
            return View(atencionModel);
        }


        public async Task<IActionResult> InformeTeledoc(string username, [FromQuery] string idConsulta)
        {
            ViewData["view"] = "Paciente";
            ViewBag.HostURL = "http://app.teledoc.cl";

            // Realizar la consulta a Teledoc
            var model = await ConsultarTeledoc(username, idConsulta);

            if (model != null && model.archivos != null)
            {
                foreach (var archivo in model.archivos)
                {
                    // Acceder a las propiedades del archivo y realizar las operaciones necesarias
                    int idArchivo = archivo.idArchivo;
                    string nombreArchivo = archivo.nombreArchivo;
                    string idPropietario = archivo.idPropietario;
                }
            }

            return View(model);
        }

        [Route("Medico/InformeAtencionPartial/{idAtencion}")]
        public async Task<IActionResult> InformeAtencionPartialAsync(int idAtencion)
        {
            //Invoke : view ListaAtencionPaciente -- esto esta pendiente por ahora se abre una nueva vista, si quieren un modal se debe habilitar

            ViewData["view"] = Roles.Medico;
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            Atenciones atencion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/{idAtencion}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            PersonasViewModel paciente;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }


            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente/*, Archivo = archivo */};
            return PartialView("~/Views/Shared/_InformeAtencionPartial.cshtml", atencionModel);
        }

        //public ActionResult Configuracion()
        //{
        //    var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    ViewBag.uid = uid;
        //    return View();
        //}

        public async Task<IActionResult> Configuracion()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel persona;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/personByUser/{uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            PersonasDatos personaDatos;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/personasDatos/personasDatosByUser/{uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);

                }
            }

            //List<Especialidades> especialidades;
            //using (var httpClient = new HttpClient())
            //{
            //    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/getEspecialidades"))
            //    {
            //        string apiResponse = await response.Content.ReadAsStringAsync();
            //        especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);

            //    }
            //}

            var idEntidad = uid;
            var codEntidad = "CERTIFICACIONES";
            List<Archivo> archivo;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/archivo/getArchivosByIdEntidad?idEntidad={idEntidad}&codEntidad={codEntidad}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    archivo = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
                }
            }
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, archivos = archivo/*, especialidades = especialidades */};
            return View(fichaMedico);
        }
        //public async Task<IActionResult> InformacionPersonal()
        //{
        //    var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    ViewBag.uid = uid;

        //    PersonasDatosViewModel persona;
        //    using (var httpClient = new HttpClient())
        //    {
        //        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
        //        {
        //            string apiResponse = await response.Content.ReadAsStringAsync();
        //            persona = JsonConvert.DeserializeObject<PersonasDatosViewModel>(apiResponse);
        //        }
        //    }

        //    PersonasDatos personaDatos;
        //    using (var httpClient = new HttpClient())
        //    {
        //        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
        //        {
        //            string apiResponse = await response.Content.ReadAsStringAsync();
        //            personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
        //        }
        //    }



        //    FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() {personas = persona, personasDatos = personaDatos};
        //    return View(fichaMedico);
        //}

        //public IActionResult InformeAtencion()
        //{
        //    return View();
        //}

        public async Task<IActionResult> ListaAtencionPaciente()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            bool Epecialidad = false;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/atenciones/getDataIsPeritaje/{uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    Epecialidad = JsonConvert.DeserializeObject<bool>(apiResponse);
                }
            }
            
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.Epecialidad = Epecialidad;
            return View();
        }

        public ActionResult ReporteEnfermeria()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<IActionResult> NuevoReporte(int? idPaciente)
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            ViewBag.idPaciente = idPaciente;
            ReporteEnfermeria reporteEnfermeria = new ReporteEnfermeria();
            PersonasViewModel persona = new PersonasViewModel();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/getDatosPaciente/{idPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            List<Parametros> motivoConsulta;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/parametro/getParametros?grupo=MOTIVO-CONSULTA";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    motivoConsulta = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            List<Parametros> control;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/parametro/getParametros?grupo=CONTROL";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    control = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }

            ReportePaciente reportePaciente = new ReportePaciente() { motivoConsulta = motivoConsulta, control = control, persona = persona, reporteEnfermeria = reporteEnfermeria };
            return View("EditarReporte", reportePaciente);

        }

        public async Task<IActionResult> EditarReporte(int id)
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            ReporteEnfermeria reporteEnfermeria = new ReporteEnfermeria();
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/reporteEnfermeria/getReportebyId?id={id}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<ReporteEnfermeria>(apiResponse);
                }
            }
            ViewBag.IdPaciente = reporteEnfermeria.IdPaciente;
            PersonasViewModel persona = new PersonasViewModel();
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/getDatosPaciente/{reporteEnfermeria.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            List<Parametros> motivoConsulta;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/parametro/getParametros?grupo=MOTIVO-CONSULTA";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    motivoConsulta = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            List<Parametros> control;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/parametro/getParametros?grupo=CONTROL";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    control = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }

            ReportePaciente reportePaciente = new ReportePaciente() { motivoConsulta = motivoConsulta, control = control, persona = persona, reporteEnfermeria = reporteEnfermeria };
            return View(reportePaciente);
        }
        public async Task<IActionResult> InformeEnfermeria(int id)
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ReporteEnfermeria reporteEnfermeria;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/reporteEnfermeria/getInformebyId?id={id}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<ReporteEnfermeria>(apiResponse);
                }
            }
            ViewBag.IdPaciente = reporteEnfermeria.IdPaciente;
            return View(reporteEnfermeria);
        }

        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
        [Route("Medico/Atencion_Box/{idAtencion}")]
        [Authorize]
        public async Task<IActionResult> Atencion_Box(int idAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idFormularioEnfermera = _config["idEnfermeraFormulario"];
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.idFormularioEnfermera = idFormularioEnfermera;
            List<Especialidades> especialidades = new List<Especialidades>();
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/especialidades/getEspecialidadesDerivacion";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }
            Atenciones atencion;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/{idAtencion}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            // Atención no encontrada
            if (atencion == null)
                return RedirectToAction("Index");

            if (atencion.AtencionDirecta && atencion.IdSesionPlataformaExterna == "MEDISMART_APP")
            {
                try
                {
                    //ACTUALIZA EL ESTADO PARA LA APP, ESTADO EN FIREBASE
                    var responsefirebase = new JsonArrayAttribute();
                    using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                    {
                        string url = $"/agendamientos/Atenciones/actualizarEstadoAtencion?idAtencion={idAtencion}";
                        using (var response = await httpClient.GetAsync(url))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            responsefirebase = JsonConvert.DeserializeObject<JsonArrayAttribute>(apiResponse);
                        }
                    }
                }
                catch (Exception)
                {
                    // ignored
                }
            }
            var conveniosConfig = _config.GetSection("ConveniosTeleperitajeCargaMasiva").Get<List<ConveniosTeleperitaje>>();
            var numeroBanmedica = conveniosConfig
                .FirstOrDefault(convenio => convenio.Text == "Banmedica")?.Value;
            ViewBag.banmedica = numeroBanmedica;
            ViewBag.idConvenio = atencion.HoraMedico.IdConvenio;
            ConvenioEspecialidadAtencion convenioEs;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/especialidades/especialidadAtencionBox/{atencion.HoraMedico.IdEspecialidad}/{atencion.HoraMedico.IdConvenio}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    convenioEs = JsonConvert.DeserializeObject<ConvenioEspecialidadAtencion>(apiResponse);
                }
            }

            ViewBag.codConvenio = "";
            ViewBag.boxEspecial = 0;
            if (convenioEs != null)
            {
                ViewBag.codConvenio = convenioEs.CodConvenio;
                ViewBag.boxEspecial = convenioEs.BoxEspecial;
            }

            //ViewBag.especialidad = atencion.Especialidad;
            bool teleview = false;
            var estadoTele = "";
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/parametro/getOpcionTeleperitaje";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    estadoTele = apiResponse;
                }
            }

            if (estadoTele == "V")
            {
                teleview = true;
            }
            else
            {
                teleview = false;
            }

            ViewBag.teleperitajeView = teleview;


            if ((atencion == null) || ((atencion.HoraMedico.IdMedico != int.Parse(uid)) && (atencion.IdMedicoFirmante != int.Parse(uid)))) return RedirectToAction("Index");

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {

                var jsonString = JsonConvert.SerializeObject(idAtencion);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                string url = $"/agendamientos/Atenciones/inicioAtencionMedico?idAtencion={idAtencion}";
                using (var response = await httpClient.PostAsync(url, httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            var log = new LogPacienteViaje();
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                log.Evento = "Médico ingresa al box de atención inmediata jitsi.";
                log.IdPaciente = Convert.ToInt32(uid);
                log.IdAtencion = atencion.Id;
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                string url = $"/usuarios/personas/grabarLogPacienteViaje";
                using (var response = await httpClient.PostAsync(url, httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            List<Examenes> examenes;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Examenes";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenes = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

          

            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }

            int activaDerivacion = 0;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/parametro/getActivaDerivacion";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    activaDerivacion = JsonConvert.DeserializeObject<int>(apiResponse);
                }
            }

            ViewBag.activaDerivacion = activaDerivacion;
            PersonasViewModel persona;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/personByUserCliente/{atencion.IdPaciente}/{atencion.IdCliente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            persona.UserId = atencion.IdPaciente;
            CuestionarioSueno cuestionarioSueno = null;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/programasalud/GetProgramaSaludCuestionarioPittsburg?idCliente=" +atencion.IdCliente+"&uid="+atencion.IdPaciente+"&getRecentOnly=true";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();

                    ResponseGetCuestionarioSueno res = null;

                    try
                    {
                        res = JsonConvert.DeserializeObject<ResponseGetCuestionarioSueno>(apiResponse);
                    }
                    catch (JsonSerializationException)
                    {
                        Console.WriteLine("no se encontro cuestionario");
                    }

                    if (res != null && res.cuestionario is CuestionarioSueno)
                    {
                        cuestionarioSueno = res.cuestionario;
                    }
                    else
                    {
                        cuestionarioSueno = null;
                    }
                }
            }

            ProgramaSaludCuestionario programaSaludCuestionario = null;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/programasalud/getProgramaSaludCuestionario?idProgramaSalud=" +atencion.IdProgramaSalud+"&idCliente=" + atencion.IdCliente + "&uid=" + atencion.IdPaciente;
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    ProgramaSaludCuestionario res = JsonConvert.DeserializeObject<ProgramaSaludCuestionario>(apiResponse);
                    if (res != null)
                    {
                        programaSaludCuestionario = res;
                    }
                }
            }



            ProgramaSaludPaciente programaSaludPaciente = null;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ProgramaSalud/getOneProgramaSaludPaciente?id={atencion.IdProgramaSalud}&idCliente={atencion.IdCliente}&idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    programaSaludPaciente = JsonConvert.DeserializeObject<ProgramaSaludPaciente>(apiResponse);

                }
            }
            List<PersonasViewModel> encargados = new List<PersonasViewModel>();
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPersonasEncargadosDeCarga/{persona.Id}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        encargados = JsonConvert.DeserializeObject<List<PersonasViewModel>>(apiResponse);

                    }
                }
            }catch(Exception ex)
            {
                encargados = new List<PersonasViewModel>();
            }

            dynamic saludDocumentos = null;
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/salud/GetAllSaludInAtencion?idAtencion={atencion.Id}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        saludDocumentos = JsonConvert.DeserializeObject<List<SaludIntegraciones>>(apiResponse);

                    }
                }
            }
            catch (Exception ex)
            {
                saludDocumentos = new List<dynamic>();
            }



            string IdentificadorTeledoc = persona.Identificador.Replace("-", "");
            var teledocAtenciones = await ConsultarTeledoc(IdentificadorTeledoc);

            if (teledocAtenciones != null && teledocAtenciones.Count > 0)
            {
                historialAtenciones.AddRange(teledocAtenciones);
            }

            string videoCallUrl = "";

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = _config["microservices_vidcallms01002"] + $"/videocall?atencionId={atencion.Id}&userId={uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    videoCallUrl = JsonConvert.DeserializeObject<VideoCallResponse>(apiResponse).urlRoom;
                }
            }
            ViewBag.isTeledoc = false;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/personas/validaSiTeledoc?idCliente=" + atencion.IdCliente;
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    
                    if (apiResponse.Equals("1"))
                    {
                        ViewBag.isTeledoc = true;
                    }
                }
            }

            Empresa empresa; 
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/empresa/EmpresaConfigById?idCliente={atencion.IdCliente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    empresa = JsonConvert.DeserializeObject<Empresa>(apiResponse);
                }
            }

            bool HistExterno = empresa.HistExterno;
            //si no existe idRegistro en la la atencion,
            //traerse el ultimo idRegistro con el endpoint de find
            string idResgistroExterno = null;
            if (HistExterno == true) {
                ViewBag.urlHistExterno = _config["api-HistorialExterno"];
                //string idResgistroExterno = null;
                if (atencion.IdRegistro == null)
                {
                    using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                    {
                        //mover host + stage a env
                        string url = _config["api-HistorialExterno"] + "FindDiagnostic?idCliente=" + atencion.IdCliente + "&dni=" + persona.Identificador;
                        using (var response = await httpClient.GetAsync(url))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            dynamic resp = JsonConvert.DeserializeObject(apiResponse);
                            string estado = resp.estado;
                            if ("OK".Equals(estado))
                            {
                                idResgistroExterno = resp.message.idRegistro;
                            }
                        }
                    }
                }
                else
                {
                    idResgistroExterno = atencion.IdRegistro;
                }
            }


            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = persona, Examenes = examenes, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria, especialidades = especialidades,  cuestionarioSueno = cuestionarioSueno, programaSaludPaciente = programaSaludPaciente, programaSaludCuestionario = programaSaludCuestionario, urlVideoCall = videoCallUrl, idRegistroHisExterno = idResgistroExterno, HistExterno = HistExterno };

            switch (atencion.HoraMedico.IdEspecialidad)
            {
                case 57: return View("AtencionVeterinaria", atencionModel);

                default:
                    return View(atencionModel);

            }


        }

        /*
        [Route("Medico/Atencion_Box_Teledoc/{idAtencion}")]
        public async Task<IActionResult> Atencion_Box_Teledoc(string username)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            Atenciones atencion;

            

            List<Atenciones> historialAtenciones;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{username}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }
        

            AtencionViewModel atencionModel = new AtencionViewModel() { HistorialAtenciones = historialAtenciones };

            /*
            switch (atencion.HoraMedico.IdEspecialidad)
            {
                case 57: return View("AtencionVeterinaria", atencionModel);

                default:
                    return View(atencionModel);

            }
            

            return View(atencionModel);

        }

        */
        

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

        class ConsultarTeledocRequest<T>
        {
            public String estado;
            public T data;
        }
        // METODO QUE RELAIZA CONSULTA A TELEDOC
        private async Task<AtencionesTeledocViewModel> ConsultarTeledoc(string username, string idConsulta)
        {
            using (var httpClient = new HttpClient())
            {
                    // Realizar la consulta al segundo endpoint usando el token obtenido
                    var detailedUrl = $"https://api.medibuslive.com/prod/teledoc/DetailsAttentions?attentionId={idConsulta}";
                    httpClient.DefaultRequestHeaders.Clear();
                    httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Host", "api.medibuslive.com");

                    var detailedResponse = await httpClient.GetAsync(detailedUrl);

                    if (detailedResponse.IsSuccessStatusCode)
                    {
                        var detailedResponseJson = await detailedResponse.Content.ReadAsStringAsync();
                        var res = JsonConvert.DeserializeObject<ConsultarTeledocRequest<AtencionesTeledocViewModel>>(detailedResponseJson);
                        var model = res.data;
                        // Actualizar URLs de archivos
                        foreach (var archivo in model.archivos)
                        {
                            archivo.url = $"https://api.medibuslive.com/prod/teledoc/FilesAttentions?idFile={archivo.idArchivo}&attentionId={model.idConsulta}";
                        }

                        return model;
                    }
                    else
                    {
                        // Error en la consulta al segundo endpoint
                        Console.WriteLine("Error en la consulta al segundo endpoint");
                    }
            }

            return null;
        }


        public async Task<List<Atenciones>> ConsultarTeledoc(string username)
        {
            var atencionesActualizadas = new List<Atenciones>();

            try
            {
                using (var httpClient = new HttpClient())
                {
                    var attentionUrl = $"https://api.medibuslive.com/prod/teledoc/GetAttentions?identificador={username}";

                    httpClient.DefaultRequestHeaders.Clear();
                    httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Host", "api.medibuslive.com");

                    var attentionResponse = await httpClient.GetAsync(attentionUrl);

                    if (attentionResponse.IsSuccessStatusCode)
                    {
                        var attentionResponseJson = await attentionResponse.Content.ReadAsStringAsync();
                        var consultasExternas = JsonConvert.DeserializeObject<ConsultarTeledocRequest<List<ConsultaTeledoc>>>(attentionResponseJson);

                        if (!consultasExternas.estado.Equals("OK"))
                            return atencionesActualizadas;

                        foreach (var consultaExterna in consultasExternas.data)
                        {
                            var atencion = new Atenciones
                            {
                                Id = consultaExterna.id_clienteMS,
                                NombreMedico = consultaExterna.nombreDoctor,
                                NombrePaciente = consultaExterna.nombrePaciente,
                                FechaText = DateTime.Parse(consultaExterna.tsCreacion).ToString("dd/MM/yyyy"),
                                HoraDesdeText = DateTime.Parse(consultaExterna.tsCreacion).ToString("HH:mm:ss"),
                                Especialidad = consultaExterna.especialidad,
                                IdConsultaTeledoc = consultaExterna.idConsulta,
                                username = username,


                            };

                            atencionesActualizadas.Add(atencion);
                        }
                    }
                }
                

            }
            catch (Exception)
            {

                //throw;
            }
            return atencionesActualizadas;
        }
    }
}
