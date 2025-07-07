using ExcelDataReader;
//using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using WebMVC.Models;

namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "AdministradorCentroSchemes")]
    public class AdminCentroClinico : Controller
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public AdminCentroClinico(IHttpClientFactory httpClientFactory, IConfiguration config = null)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        // GET: Administrador
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public async Task<IActionResult> VerAgendasConvenio()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);

            List<Especialidades> especialidades;
            string urlEspecialidades = $"/agendamientos/AgendarCentroClinico/getEspecialidades";
            using (var response = await httpClient.GetAsync(urlEspecialidades))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
            }

            List<Convenios> convenios;
            string urlConvenios = $"/agendamientos/ConveniosCentroClinico/getConvenios";
            using (var response = await httpClient.GetAsync(urlConvenios))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                convenios = JsonConvert.DeserializeObject<List<Convenios>>(apiResponse);
            }

            AgendaProfesionales adminProfesional = new AgendaProfesionales() { especialidades = especialidades, convenios = convenios };
            return View(adminProfesional);

        }

        public async Task<IActionResult> VerAgendasCentroClinico()

        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);            
            ViewBag.uid = uid;

            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            int idConvenio = data.idConvenio;
            ViewBag.UserId = data.UserId;
            ViewBag.IdPersona = data.IdPersona;
            ViewBag.idCentroClinico = data.IdCentroClinico;
            ViewBag.IdEmpresa = data.IdEmpresa;
            ViewBag.CodigoConvenio = data.CodigoConvenio;
            ViewBag.idConvenio = data.idConvenio;

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);

            List<Especialidades> especialidades;
            string urlEspecialidades = $"/agendamientos/AgendarCentroClinico/getEspecialidadesCentroClinico?idConvenio={idConvenio}";
            using (var response = await httpClient.GetAsync(urlEspecialidades))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
            }

            List<Convenios> convenios;
            string urlConvenios = $"/agendamientos/ConveniosCentroClinico/getConvenioCentroClinico?idConvenio={idConvenio}";
            using (var response = await httpClient.GetAsync(urlConvenios))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                convenios = JsonConvert.DeserializeObject<List<Convenios>>(apiResponse);
            }

            AgendaProfesionales adminProfesional = new AgendaProfesionales() { especialidades = especialidades, convenios = convenios };
            return View(adminProfesional);
          

        }

        public async Task<IActionResult> CrearAgendaCentroClinico(int idProfesional, int idConvenio)
        {
            var uid = idProfesional;
            ViewBag.uid = idProfesional;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var horaInt = HttpContext.User.FindFirstValue("HoraInt");
            ViewBag.ZonaHorariaAdmin = horaInt;

            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            ViewBag.idCentroClinico = data.IdCentroClinico;

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);

            List<VwHorasMedicosBloquesHoras> horasAgendadasBloquesHoras;
            string urlHorasAgendadasBloquesHoras = $"/agendamientos/VwHorasMedicosCentroClinico/GetVwHorasMedicosBloquesHorasByMedicCentroClinico?uid={uid}";
            using (var response = await httpClient.GetAsync(urlHorasAgendadasBloquesHoras))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicosBloquesHoras>>(apiResponse);
            }

            Convenios convenio;
            string urlConvenios = $"/agendamientos/ConveniosCentroClinico/getConvenio/{idConvenio}";
            using (var response = await httpClient.GetAsync(urlConvenios))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);
            }

            List<Parametros> modeloAtencion;
            string urlModeloAtencion = $"/agendamientos/ConveniosCentroClinico/getModeloAtencion";
            using (var response = await httpClient.GetAsync(urlModeloAtencion))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                modeloAtencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            List<Parametros> tipoAgenda;
            string urlTipoAgenda = $"/agendamientos/ConveniosCentroClinico/getTipoAgenda";
            using (var response = await httpClient.GetAsync(urlTipoAgenda))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                tipoAgenda = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            HomeViewModel homeModel = new HomeViewModel() { TimelineData = horasAgendadasBloquesHoras , convenio = convenio, modeloAtencion =  modeloAtencion, tipoAgenda = tipoAgenda, ZonaHoraria = horaInt };
            return View(homeModel);

        }

        public ActionResult Index()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            ViewBag.uid = uid;
            return View();
        }

        public ActionResult AgendaAdministrador()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        // GET: Administrador/Details/5
        public ActionResult Details(int id)
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        public async Task<IActionResult> ListaProfesionales()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;

            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            int idConvenio = data.idConvenio;
            ViewBag.UserId = data.UserId;
            ViewBag.idCentroClinico = data.IdCentroClinico;
            ViewBag.idConvenio = data.idConvenio;
            ViewBag.uid = uid;
            List<Especialidades> especialidades;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/AgendarCentroClinico/getEspecialidadesCentroClinico?idConvenio={idConvenio}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }


            AgendaProfesionales adminProfesional = new AgendaProfesionales() { especialidades = especialidades };
            return View(adminProfesional);
        }

        public ActionResult ListaPacientesCentroClinico()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);

            ViewBag.IdCentroClinico = data.IdCentroClinico;
            ViewBag.CodigoConvenio = data.CodigoConvenio;

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
         
            return View();
        }

        public async Task<IActionResult> NuevoProfesionalCentroClinico()
        {
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            ViewBag.idEdit = tempID;
            PersonasViewModel persona = new PersonasViewModel();
            persona.IdAdmin = uid;
            persona.IdCentroClinico = data.IdCentroClinico;
            var horaInt = HttpContext.User.FindFirstValue("HoraInt");
            persona.ZonaHoraria = horaInt;
            ViewBag.ZonaHorariaAdmin = horaInt;
            ViewBag.IdCentroClinico = data.IdCentroClinico;
            ViewBag.CodigoConvenio = data.CodigoConvenio;
            ViewBag.idConvenio = data.idConvenio;
            ViewBag.UserId = data.UserId;
            PersonasDatos personaDatos = new PersonasDatos();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            personaDatos.TempID = tempID;

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);

            List<TipoProfesionalViewModel> profesiones;
            string urlProfesiones = $"/agendamientos/AgendarCentroClinico/getTipoProfesionalesCentroClinico/{ViewBag.IdCentroClinico}";
            using (var response = await httpClient.GetAsync(urlProfesiones))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                profesiones = JsonConvert.DeserializeObject<List<TipoProfesionalViewModel>>(apiResponse);
            }

            List<Especialidades> especialidades = new List<Especialidades>();
            var tipoProfesional = profesiones.FirstOrDefault() != null ? profesiones.First().Id : 0;
            if (tipoProfesional != 0)
            {
                string urlEspecialidades = $"/agendamientos/AgendarCentroClinico/getEspecialidadesByTipoProfesional/{tipoProfesional}/{ViewBag.IdCentroClinico}";
                using (var response = await httpClient.GetAsync(urlEspecialidades))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }

            List<Parametros> pref_prof;
            string urlPrefijosEspecialidades = $"/agendamientos/AgendarCentroClinico/getPrefijoEspecilidad";
            using (var response = await httpClient.GetAsync(urlPrefijosEspecialidades))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                pref_prof = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            List<Parametros> dur_atencion;
            string urlDuracionAtencion = $"/agendamientos/AgendarCentroClinico/obtenerDuracionAtencion";
            using (var response = await httpClient.GetAsync(urlDuracionAtencion))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                dur_atencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, especialidades = especialidades, prefijoProfesion = profesiones, prefijo = pref_prof, duracionAtencion = dur_atencion };
            
            return View("EditarProfesional", fichaMedico);
        }

        public async Task<IActionResult> EditarProfesional(int idProfesional)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            ViewBag.uid = uid;
            ViewBag.idEdit = idProfesional;
            ViewBag.IdCentroClinico = data.IdCentroClinico;
            ViewBag.CodigoConvenio = data.CodigoConvenio;
            ViewBag.UserId = data.UserId;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.idConvenio = data.idConvenio;

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");

            PersonasViewModel persona;
            string urlPersonas = $"/usuarios/personas/personByUser/{idProfesional}";
            using (var response = await httpClient.GetAsync(urlPersonas))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
            }

            PersonasDatos personaDatos;
            string urlPersonasDatos = $"/usuarios/personasDatos/personasDatosByUser/{idProfesional}";
            using (var response = await httpClient.GetAsync(urlPersonasDatos))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
            }

            var idEntidad = uid;
            var codEntidad = "CERTIFICACIONES";
            List<Archivo> archivo;
            string urlArchivos = $"/agendamientos/archivo/getArchivosByIdEntidad?idEntidad={idEntidad}&codEntidad={codEntidad}";
            using (var response = await httpClient.GetAsync(urlArchivos))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                archivo = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
            }

            List<Especialidades> especialidades;
            string urlEspecialidades = $"/agendamientos/AgendarCentroClinico/getEspecialidadesByTipoProfesional/{personaDatos.IdTituloMedico}/{ViewBag.IdCentroClinico}";
            using (var response = await httpClient.GetAsync(urlEspecialidades))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
            }

            List<TipoProfesionalViewModel> profesiones;
            string urlProfesiones = $"/agendamientos/AgendarCentroClinico/getTipoProfesionalesCentroClinico/{ViewBag.IdCentroClinico}";
            using (var response = await httpClient.GetAsync(urlProfesiones))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                profesiones = JsonConvert.DeserializeObject<List<TipoProfesionalViewModel>>(apiResponse);
            }


            List<Parametros> pref_prof;
            string urlPrefijosEspecialidades = $"/agendamientos/AgendarCentroClinico/getPrefijoEspecilidad";
            using (var response = await httpClient.GetAsync(urlPrefijosEspecialidades))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                pref_prof = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            List<Parametros> dur_atencion;
            string urlDuracionAtencion = $"/agendamientos/AgendarCentroClinico/obtenerDuracionAtencion";
            using (var response = await httpClient.GetAsync(urlDuracionAtencion))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                dur_atencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, archivos = archivo, especialidades = especialidades, prefijoProfesion = profesiones, prefijo = pref_prof, duracionAtencion = dur_atencion };
            return View(fichaMedico);
        }

        public async Task<IActionResult> NuevoPaciente()
        {
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = tempID;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            ViewBag.IdCentroClinico = data.IdCentroClinico;
            ViewBag.CodigoConvenio = data.CodigoConvenio;
            ViewBag.IdConvenio = data.idConvenio;
            var horaInt = HttpContext.User.FindFirstValue("HoraInt");
            ViewBag.ZonaHorariaAdmin = horaInt;

            PersonasViewModel persona = new PersonasViewModel();

            var codigoTelefono = persona.CodigoTelefono ?? ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono") ?? "CL";

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/personas/getPrevisiones/{codigoTelefono}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                }
            }

            persona.TempID = tempID;
            persona.ZonaHoraria = horaInt;

            return View("EditPacienteCentroClinico", persona);

        }

        public async Task<IActionResult> EditPacienteCentroClinico(int idPaciente)
        {
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
   
            ViewBag.IdCentroClinico = data.IdCentroClinico;
            ViewBag.CodigoConvenio = data.CodigoConvenio;
            ViewBag.IdConvenio = data.idConvenio;
            ViewBag.IdEmpresa = data.IdEmpresa;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = idPaciente;
            // ViewBag.idCliente = "0";
            ViewBag.IdEmpresa = data.IdEmpresa;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");

            PersonasViewModel paciente;
            string urlPaciente = $"/usuarios/personas/personByUser/{idPaciente}";
            using (var response = await httpClient.GetAsync(urlPaciente))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
            }

            var codigoTelefono = paciente.CodigoTelefono ?? ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono") ?? "CL";
            if (string.IsNullOrEmpty(codigoTelefono))
                codigoTelefono = "CL";

            string urlPrevisiones = $"/usuarios/personas/getPrevisiones/{codigoTelefono}";
            using (var response = await httpClient.GetAsync(urlPrevisiones))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
            }

            return View(paciente);
        }

        public async Task<IActionResult> AgendaPaciente(int idPaciente)
        {

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);

            ViewBag.IdCentroClinico = data.IdCentroClinico;
            ViewBag.idConvenio = data.idConvenio;
            ViewBag.idCliente = data.IdEmpresa;

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var typeAgenda = "A";
            ViewBag.uid = uid;
            ViewBag.idAtencion = 0;
            ViewBag.idPaciente = idPaciente;
            ViewBag.idHoramedico = 0;
            ViewBag.typeAgenda = typeAgenda; //edit
            
            List<Especialidades> especialidades;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url= "";
                if (ViewBag.HostURL.Contains("positiva"))
                {
                    url = $"/agendamientos/AgendarCentroClinico/getEspecialidadesCentroClinicoEmpresa?idCliente={data.IdEmpresa}";
                }
                else
                {
                    url = $"/agendamientos/AgendarCentroClinico/getEspecialidadesCentroClinico?idConvenio={data.idConvenio}";
                }               
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }

            AgendaViewModel agendaModel = new AgendaViewModel() { especialidades = especialidades};
            return View(agendaModel);
        }
        public async Task<IActionResult> EditaAgenda(int idPaciente, int idAtencion)
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);

            ViewBag.IdCentroClinico = data.IdCentroClinico;
            ViewBag.idConvenio = data.idConvenio;
            ViewBag.idCliente = data.IdEmpresa;

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var typeAgenda = "E";
            ViewBag.idAtencion = idAtencion;
            ViewBag.idPaciente = idPaciente;
            ViewBag.typeAgenda = typeAgenda; //edit
            ViewBag.idHoramedico = 0;

            List<Especialidades> especialidades;
            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/AgendarCentroClinico/getEspecialidades";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }

            AgendaViewModel agendaModel = new AgendaViewModel() { especialidades = especialidades };
            return View("AgendaPaciente",agendaModel);
        }

        //se comenta este metodo porque no se ocupara.
        //public async Task<IActionResult> ReagendarHora(int idHoraMedico)
        //{
        //    var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    ViewBag.uid = uid;
        //    var typeAgenda = "R";
            
        //    VwHorasMedicos vwHorasMedicoss;
        //    using (var httpClient = new HttpClient())
        //    {
        //        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/vwHorasMedicos/getHoraMedicoByidHoraMedico?idHoraMedico={idHoraMedico}"))
        //        {
        //            string apiResponse = await response.Content.ReadAsStringAsync();
        //            vwHorasMedicoss = JsonConvert.DeserializeObject<VwHorasMedicos>(apiResponse);
        //        }
        //    }
        //    ViewBag.idCliente = vwHorasMedicoss.IdPaciente;
        //    ViewBag.idAtencion = vwHorasMedicoss.IdAtencion;
        //    ViewBag.idHoramedico = vwHorasMedicoss.IdHora;
        //    ViewBag.typeAgenda = typeAgenda; // reagendar
        //    List<Especialidades> especialidades;
        //    using (var httpClient = new HttpClient())
        //    {
        //        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades"))
        //        {
        //            string apiResponse = await response.Content.ReadAsStringAsync();
        //            especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
        //        }
        //    }
        //    AgendaViewModel agendaModel = new AgendaViewModel() { especialidades = especialidades, horasMedicos = vwHorasMedicoss};
        //    return View("AgendaPaciente", agendaModel);
        //}
        public async Task<IActionResult> MantenedorConvenioAsync()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

         
            ViewBag.idEdit = tempID;
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;

            Convenios convenio = new Convenios();
            convenio.TempID = tempID;

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);

            List<Parametros> modeloAtencion;
            string urlModeloAtencion = $"/agendamientos/ConveniosCentroClinico/getModeloAtencion";
            using (var response = await httpClient.GetAsync(urlModeloAtencion))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                modeloAtencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            List<Parametros> reglaPago;
            string urlReglaPago = $"/agendamientos/ConveniosCentroClinico/getReglaPago";
            using (var response = await httpClient.GetAsync(urlReglaPago))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                reglaPago = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            List<Parametros> reglaServicio;
            string urlReglaServicio = $"/agendamientos/ConveniosCentroClinico/getReglaServicio";
            using (var response = await httpClient.GetAsync(urlReglaServicio))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                reglaServicio = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            AdminConvenios adminConvenios = new AdminConvenios() { modeloAtencion = modeloAtencion, reglaPago = reglaPago, reglaServicio = reglaServicio, convenios = convenio };
            return View(adminConvenios);
        }
        public async Task<IActionResult> EditConvenioAsync(int idConvenio)
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = idConvenio;
            Convenios convenio;

            using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);

            string urlConvenios = $"/agendamientos/ConveniosCentroClinico/getConvenio/{idConvenio}";
            using (var response = await httpClient.GetAsync(urlConvenios))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);
            }

            List<Parametros> modeloAtencion;
            string urlModeloAtencion = $"/agendamientos/ConveniosCentroClinico/getModeloAtencion";
            using (var response = await httpClient.GetAsync(urlModeloAtencion))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                modeloAtencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            List<Parametros> reglaPago;
            string urlReglaPago = $"/agendamientos/ConveniosCentroClinico/getReglaPago";
            using (var response = await httpClient.GetAsync(urlReglaPago))
            {
                string apiResponse = await response.Content.ReadAsStringAsync();
                reglaPago = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            }

            //List<Parametros> reglaServicio;
            //using (var httpClient = new HttpClient())
            //{
            //    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getReglaServicio"))
            //    {
            //        string apiResponse = await response.Content.ReadAsStringAsync();
            //        reglaServicio = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
            //    }
            //}

            AdminConvenios adminConvenios = new AdminConvenios() { modeloAtencion = modeloAtencion, reglaPago = reglaPago, /*reglaServicio = reglaServicio,*/ convenios = convenio };
            
            return View("MantenedorConvenio", adminConvenios);
        }

        public async Task<ActionResult> ListaConveniosAsync()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            Convenios convenio;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/ConveniosCentroClinico/getResumenConvenio";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);
                }
            }

            return View(convenio);
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

        public async Task<IActionResult> CargarProfesionales()
        {
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.idCentroClinico = data.IdCentroClinico;
            ViewBag.IdPersona = data.IdPersona;

            ViewBag.Convenio = data.idConvenio;

            return View();
        }

        [HttpPost]
        public async Task<JsonResult> PostLoadProfesionales(IFormFile file, [FromServices] IHostingEnvironment hostingEnviroment, int convenio, int centroClinico)
        {
            try
            {
                IList<CargaProfesional> cargas = new List<CargaProfesional>();
                
                //string fileName = _config["ServicesUrlWeb"]+"\\files\\"+file.FileName;
                try
                {
                    string fileName = $"{hostingEnviroment.WebRootPath}\\files\\{file.FileName}";
                    using (FileStream fileStream = System.IO.File.Create(fileName))
                    {
                        file.CopyTo(fileStream);
                        fileStream.Flush();
                    }
                }
                catch
                {
                    return new JsonResult(new { status = "NOK1" });
                }

                var profesionalesList = this.GetListaProfesionales(file.FileName, centroClinico);
                var baseUrlWeb = _config["ServicesUrlWeb"];
                baseUrlWeb = HttpUtility.UrlEncode(baseUrlWeb);
                // delete archivo files
                try
                {
                    var filename = $"{Directory.GetCurrentDirectory()}{@"\\wwwroot\\files"}" + "\\" + file.FileName;
                    System.IO.File.Delete(filename);
                }
                catch (System.IO.IOException e)
                {
                    Console.WriteLine(e.Message);
                }



                foreach (var profesional in profesionalesList)
                {

                    // sacar ceros inicio rut
                    var rutValidate = profesional.Identificador.TrimStart(new Char[] { '0' });
                    profesional.Identificador = rutValidate;
                    if (profesional.Identificador != null && !profesional.Identificador.Contains("-"))
                    {
                        string lastChar = profesional.Identificador.Substring(profesional.Identificador.Length - 1);
                        string rut = profesional.Identificador.Remove(profesional.Identificador.Length - 1);
                        profesional.Identificador = rut + "-" + lastChar;
                    }
                    FormFichaMedicoViewModel persona = new FormFichaMedicoViewModel();
                    var newUsuario = new PersonasViewModel();
                    newUsuario.Nombre = profesional.Nombres;
                    newUsuario.Identificador = profesional.Identificador;
                    newUsuario.ApellidoPaterno = profesional.ApellidoPaterno;
                    newUsuario.ApellidoMaterno = profesional.ApellidoMaterno;
                    newUsuario.Genero = profesional.Sexo;
                    newUsuario.FNacimiento = Convert.ToDateTime(profesional.FechaNacimiento);
                    newUsuario.Telefono = profesional.Telefono;
                    newUsuario.Correo = profesional.Email;
                    newUsuario.IdCentroClinico = profesional.IdCentroClinico;
                    newUsuario.IdentificadorProfesorAsociado = profesional.IdentificadorProfesorAsociado;
                    newUsuario.Rol = profesional.Rol;
                    newUsuario.ZonaHoraria = HttpContext.User.FindFirstValue("HoraInt");

                    var id = await this.GetIdPaciente(profesional.Identificador); // VA A LA TABLA USERS ASI QUE SIRVE PARA MEDICOS}
                    int idPersona = 0;
                    var uidMedico = "-1";
                    if (!String.IsNullOrEmpty(id))
                    {
                        uidMedico = id;
                        idPersona = await this.GetIdPersona(Convert.ToInt32(id));
                    }

                    persona.personas = newUsuario;
                    persona.personas.Id = idPersona;
                    persona.personas.Estado = "V";
                    persona.idCentroClinico = profesional.IdCentroClinico;
                    persona.personasDatos = new PersonasDatosViewModel();
                    persona.personasDatos.IdUsuarioModifica = Convert.ToInt32(uidMedico)<0?0:Convert.ToInt32(uidMedico);
                    persona.personasDatos.IdEspecialidad = profesional.IdEspecialidad;
                    persona.personasDatos.IdDuracionAtencion = profesional.IdDuracionAtencion;
                    persona.personasDatos.NumeroRegistro = profesional.NumeroRegistro;
                    var jsonString = JsonConvert.SerializeObject(persona);

                    var content = new StringContent(jsonString, Encoding.UTF8, "application/json");

                    using var client = _httpClientFactory.CreateClient(HttpClientNames.Services);
                    HttpResponseMessage responseUpload = await client.PostAsync($"/usuarios/PersonasDatos/LoadProfesionales?uid={uidMedico}", content);
                    responseUpload.EnsureSuccessStatusCode();
                    var resp = await responseUpload.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<BaseResponse>(resp);

                    cargas.Add(new CargaProfesional()
                    {
                        Nombres = newUsuario.Nombre,
                        Identificador = newUsuario.Identificador,
                        ApellidoPaterno = newUsuario.ApellidoPaterno,
                        ApellidoMaterno = newUsuario.ApellidoMaterno,
                        Status = response.Status
                    });
                }

                var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
                EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                ViewBag.uid = uid;

                ViewBag.idCentroClinico = data.IdCentroClinico;
                ViewBag.IdPersona = data.IdPersona;

                //return View(listaFinal);
                return new JsonResult(new { status = "OK", cargas });
            }
            catch (Exception e)
            {
                return new JsonResult(new { status = "NOK", error = e.ToString() });
            }

        }

        private List<CargaProfesional> GetListaProfesionales(string fName, int idCentroClinico)
        {
            List<CargaProfesional> list = new List<CargaProfesional>();
            var filename = $"{Directory.GetCurrentDirectory()}{@"\\wwwroot\\files"}" + "\\" + fName;
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            bool firstLine = true;
            using (var stream = System.IO.File.Open(filename, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    while (reader.Read())
                    {
                        if (firstLine)
                        {
                            firstLine = false;
                            continue;
                        }

                        try
                        {
                           list.Add(new CargaProfesional()
                            {
                                Identificador = reader.GetValue(0)?.ToString() ?? string.Empty,
                                Nombres = reader.GetValue(1)?.ToString() ?? string.Empty,
                                ApellidoPaterno = reader.GetValue(2)?.ToString() ?? string.Empty,
                                ApellidoMaterno = reader.GetValue(3)?.ToString() ?? string.Empty,
                                IdEspecialidad = Convert.ToInt32(reader.GetValue(4) ?? 0),
                                Email = reader.GetValue(5)?.ToString() ?? string.Empty,
                                Sexo = reader.GetValue(6)?.ToString() ?? string.Empty,
                                Telefono = reader.GetValue(7)?.ToString(),
                                FechaNacimiento = reader.GetValue(8)?.ToString(),
                                IdentificadorProfesorAsociado = reader.GetValue(9)?.ToString() ?? string.Empty,
                                IdDuracionAtencion = Convert.ToInt32(reader.GetValue(10) ?? 0),
                                NumeroRegistro = Convert.ToInt32(reader.GetValue(11) ?? 0),
                                Rol = reader.GetValue(12)?.ToString() ?? string.Empty,
                                IdCentroClinico = idCentroClinico
                            });
                        }
                        catch (System.IO.IOException e)
                        {
                            Console.WriteLine(e.Message);
                        }

                    }
                }
            }
            return list;
        }

        private async Task<string> GetIdPaciente(string rut)
        {
            string apiResponse = "0";

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/personas/getIdPaciente/{rut}";
                using (var response = await httpClient.GetAsync(url))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }

        private async Task<int> GetIdPersona(int id)
        {
            int idPersona = 0;
            PersonasViewModel persona = new PersonasViewModel();
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            try
            {
                using var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services);
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                string url = $"/usuarios/personas/personByUser/{id}";
                using (var response = await httpClient.GetAsync(url))
                {
                    var res = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(res);
                    idPersona = persona.Id;
                }
            }
            catch 
            {
                idPersona = 0;
            }

            return idPersona;
        }
    }
}