using ExcelDataReader;
//using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
    [Authorize(AuthenticationSchemes = "AdministradorSchemes,AdministradorTeleperitajeSchemes")]
    public class AdminController : Controller
    {
        private readonly ILogger<AdminController> _logger;
        private readonly IConfiguration _config;
        public readonly HttpClient client = new HttpClient();
        public AdminController(IConfiguration config = null)
        {
            _config = config;
        }
        // GET: Administrador
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public async Task<IActionResult> VerAgendasConvenio()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }

            List<Convenios> convenios;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getConvenios"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    convenios = JsonConvert.DeserializeObject<List<Convenios>>(apiResponse);
                }
            }

            AgendaProfesionales adminProfesional = new AgendaProfesionales() { especialidades = especialidades, convenios = convenios };
            return View(adminProfesional);

        }


        public async Task<IActionResult> AgendaDiariaTeleperitaje()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }

            List<Convenios> convenios;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Convenios/getConveniosPeritaje"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    convenios = JsonConvert.DeserializeObject<List<Convenios>>(apiResponse);
                }
            }
           DateTime fecha = DateTime.Now;

            List<VwHorasMedicos> agenda;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/vwHorasMedicos/getAgendaDiariaPeritaje?idConvenio=0&fecha={fecha}&idEspecialidad=0"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    agenda = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            AgendaProfesionales adminProfesional = new AgendaProfesionales() { especialidades = especialidades, convenios = convenios, agenda = agenda };
            return View(adminProfesional);

        }
        public async Task<IActionResult> VerAgendas()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }




            AgendaProfesionales adminProfesional = new AgendaProfesionales() { especialidades = especialidades };
            return View(adminProfesional);

        }
        public async Task<IActionResult> CrearAgendaConvenio(int idProfesional, int idConvenio)
        {
            var uid = idProfesional;
            ViewBag.uid = idProfesional;
            List<VwHorasMedicosBloquesHoras> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/VwHorasMedicos/getVwHorasMedicosBloquesHorasByMedic?uid={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicosBloquesHoras>>(apiResponse);
                }
            }

            Convenios convenio;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getConvenio/{idConvenio}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);
                }
            }

            List<Parametros> modeloAtencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getModeloAtencion"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    modeloAtencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }


            List<Parametros> tipoAgenda;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getTipoAgenda"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    tipoAgenda = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }

            string zonaHoraria = HttpContext.User.FindFirstValue("HoraInt") ?? string.Empty;
            bool zonaHorariaIsNumeric = int.TryParse(zonaHoraria, out _);

            HomeViewModel homeModel = new HomeViewModel() { TimelineData = horasAgendadasBloquesHoras, convenio = convenio, modeloAtencion = modeloAtencion, tipoAgenda = tipoAgenda };
            
            if (zonaHorariaIsNumeric)
                homeModel.ZonaHoraria = zonaHoraria;

            return View(homeModel);

        }
        public async Task<IActionResult> CrearAgenda(int idProfesional)
        {
            var uid = idProfesional;
            ViewBag.uid = idProfesional;
            List<VwHorasMedicosBloquesHoras> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/VwHorasMedicos/getVwHorasMedicosBloquesHorasByMedic?uid={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicosBloquesHoras>>(apiResponse);
                }
            }

            //HomeViewModel homeModel = new HomeViewModel() { CalendarData = horasAgendadas, TimelineData = horasAgendadasBloquesHoras };
            HomeViewModel homeModel = new HomeViewModel() { TimelineData = horasAgendadasBloquesHoras };
            return View(homeModel);

        }

        public async Task<IActionResult> Index()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;

            var estadoTele = "";
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getOpcionTeleperitaje"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    estadoTele = apiResponse;
                }
            }
            if (estadoTele == "V")
            {
                ViewBag.teleperitaje = true;
            }
            else
            {
                ViewBag.teleperitaje = false;
            }



            return View();
        }

        public ActionResult AgendaAdministrador()
        {
            return View();
        }
        // GET: Administrador/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }
        public async Task<IActionResult> ListaPagosPaciente()
        {
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idCentroClinico = data?.IdCentroClinico ?? 1;

            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades");
                string apiResponse = await response.Content.ReadAsStringAsync();
                especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
            }
            var model = new AdminProfesionales { especialidades = especialidades };
            return View(model);
        }

        public async Task<IActionResult> ListaProfesionales()
        {
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            if (data != null)
            {
                ViewBag.idCentroClinico = data.IdCentroClinico;
                ViewBag.IdPersona = data.IdPersona;
            }
            else
            {
                ViewBag.idCentroClinico = 1;
            }           

            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }

            AdminProfesionales adminProfesional = new AdminProfesionales() { especialidades = especialidades };
            return View(adminProfesional);
        }
        [HttpGet]
        public async Task<IActionResult> Teleperitaje(List<TeleperitajeViewModel> tele = null)
        {
            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;

            ViewBag.idCentroClinico = data.IdCentroClinico;
            ViewBag.IdPersona = data.IdPersona;
            var conveniosConfig = _config.GetSection("ConveniosTeleperitajeCargaMasiva").Get<List<ConveniosTeleperitaje>>();
            ViewBag.Convenios = conveniosConfig.Select(c => new SelectListItem { Value = c.Value, Text = c.Text }).ToList();

            var zonas = new PersonasViewModel();
            ViewBag.ZonasHorarias = zonas.ZonasHorarias();


            ViewBag.Convenio = data.IdPersona;

            tele = tele == null ? new List<TeleperitajeViewModel>() : tele;

            return View(tele);
        }
        [HttpPost]
        public async Task<JsonResult> Teleperitaje(IFormFile file, [FromServices] IHostingEnvironment hostingEnviroment, string convenio, string zonahoraria)
        {
            try {
                //string fileName = _config["ServicesUrlWeb"]+"\\files\\"+file.FileName;
                try {
                    string fileName = $"{hostingEnviroment.WebRootPath}\\files\\{file.FileName}";
                    using (FileStream fileStream = System.IO.File.Create(fileName))
                    {
                        file.CopyTo(fileStream);
                        fileStream.Flush();
                    }
                } catch
                {
                    return new JsonResult(new { status = "NOK1"});
                }
               
                var teleperiajeList = this.GetTeleperitajeList(file.FileName, convenio, zonahoraria);
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



                foreach (var paciente in teleperiajeList)
                {

                    // sacar ceros inicio rut
                    var rutValidate = paciente.Rut.TrimStart(new Char[] { '0' });
                    paciente.Rut = rutValidate;
                    if(paciente.Rut != null && !paciente.Rut.Contains("-"))
                    {
                        string lastChar = paciente.Rut.Substring(paciente.Rut.Length - 1);
                        string rut = paciente.Rut.Remove(paciente.Rut.Length - 1);
                        paciente.Rut = rut + "-" + lastChar;
                    }
                    if (paciente.RutMedico != null && !paciente.RutMedico.Contains("-"))
                    {
                        string lastChar = paciente.RutMedico.Substring(paciente.RutMedico.Length - 1);
                        string rut = paciente.RutMedico.Remove(paciente.RutMedico.Length - 1);
                        paciente.RutMedico = rut + "-" + lastChar;
                    }

                    var validaUsuario = await this.GetIdPaciente(paciente.Rut);
                    if (String.IsNullOrEmpty(validaUsuario))
                    {
                        /*paciente.Estado = "Err";
                        paciente.Validacion = "No se encuentra ID paciente, verificar rut.";*/

                        //Si no existe, Crear usuario

                        var newUsuario = new IntegracionCreaPersona();
                        newUsuario.Nombre = paciente.Name;
                        newUsuario.Identificador = paciente.Rut;
                        newUsuario.ApellidoPaterno = paciente.Apellido;
                        //newUsuario.ApellidoMaterno = paciente.Apellido;
                        newUsuario.Genero = "";
                        newUsuario.FechaNacimiento = "";
                        newUsuario.Telefono = paciente.Telefono;
                        newUsuario.Correo = paciente.Email;
                        newUsuario.CodConvenio = "1";
                        //newUsuario.IdCliente = 0;
                        newUsuario.AtencionDirecta = true;
                        

                        var jsonString = JsonConvert.SerializeObject(newUsuario);

                        var content = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload =await client.PostAsync(_config["ServicesUrl"] + $"/usuarios/Users/new-user", content);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);
                    }
                    else{

                        //Actualizar Telefono y Correo Usuario
                        using (var httpClient = new HttpClient())
                         {
                            using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/updateDatosTeleperitaje/{paciente.Rut}/{paciente.Email}/{paciente.Telefono}"))
                                 {
                                     string apiResponse = await response.Content.ReadAsStringAsync();
                             }
                         }

                    }

                    var id = await this.GetIdPaciente(paciente.Rut);

                    paciente.IdPaciente = id;
                    DateTime oHora = Convert.ToDateTime(paciente.Hora);
                    DateTime oDia = Convert.ToDateTime(paciente.FechaCitacion);
                    string hora = oHora.ToString("HH:mm");
                    string dia = oDia.ToString("yyyy-MM-dd");
                    paciente.Hora = hora;
                    paciente.FechaCitacion = dia;


                    UsersViewIdModel userdata = null;
                    // extraer iduser del medico 
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/getUserByUserName?username={paciente.RutMedico}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            userdata = JsonConvert.DeserializeObject<UsersViewIdModel>(apiResponse);
                            paciente.IdMedico = userdata != null ? userdata.UserId.ToString() : "";

                            if (String.IsNullOrEmpty(paciente.IdMedico))
                            {
                                paciente.Estado = "Err";
                                paciente.Validacion = "No se encuentra ID de medico, verificar rut del archivo.";
                            }
                        }
                    }
                }
                IEnumerable<TeleperitajeViewModel> listaFinal = null;
                var listTele = JsonConvert.SerializeObject(teleperiajeList);
                var httpContent = new StringContent(listTele, Encoding.UTF8, "application/json");
                // funcion que agenda y envia mails teleperitaje,loginexterno,etc...
                using (var httpClient = new HttpClient())
                {
                    using (var responsePeritaje = await httpClient.PostAsync(_config["Servicesurl"] + $"/agendamientos/Agendar/teleperitajeMasivo/{baseUrlWeb}", httpContent))
                    {
                        var apiResponse = await responsePeritaje.Content.ReadAsStringAsync();
                        List<TeleperitajeViewModel> parts = new List<TeleperitajeViewModel>();
                        listaFinal = JsonConvert.DeserializeObject<IEnumerable<TeleperitajeViewModel>>(apiResponse);
                    }
                }


                var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
                EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                ViewBag.uid = uid;

                ViewBag.idCentroClinico = data.IdCentroClinico;
                ViewBag.IdPersona = data.IdPersona;

                //return View(listaFinal);
                return new JsonResult(new { status = "OK", atencion = listaFinal, });
            }
            catch (Exception e)
            {
                return new JsonResult(new { status = e.ToString() }); ;
            }

        }

        private async Task<string> GetIdPaciente(string rut)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getIdPaciente/{rut}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }

        [HttpPost]
        public async Task<JsonResult> GetLinkAtencion([FromBody] Atenciones atenciones, string baseUrl)
        {
            var peritajeInmv = _config["Pertiaje_Inmv"];
            var clienteAchs = _config["CLIENTE-ACHS"];
            int peritajeInmvConvert = Int32.Parse(peritajeInmv);
            var clienteByConvenio = new Dictionary<int, string>
                {
                    { 33, "1" },
                    { 42, "148" },
                    { peritajeInmvConvert, "2"},
                    { 54, clienteAchs},
                    { 64, "689"}
                };
            var modalidadByConvenio = new Dictionary<int, string>
                {
                    { 33, "CONSALUD_PERITAJE" },
                    { 42, "COlMENA_PERITAJE" },
                    { peritajeInmvConvert, "INMV_PERITAJE" },
                    { 54, "ACHS"},
                     { 64, "BANMEDICA_PERITAJE"}
                };
            var urlByConvenio = new Dictionary<int, string>
                {
                    { 33, _config["ServicesUrlWeb"] },
                    { 42, "https://doctoronline.cl" },
                    { -42, "https://qa.doctoronline.cl" },
                    { 54, "https://achs.medismart.live" },
                    { -54, "https://qa.achs.medismart.live" },
                    { peritajeInmvConvert, "https://inmv.medical.medismart.live"},
                    { peritajeInmvConvert * -1, "https://inmv.qa.medical.medismart.live"},
                    { 64, "https://peritajesisapre.medismart.live"}

                };
            // para convenios teleperitjae y ademas login externo especial ACHS
            var urlPeritaje = new Dictionary<int, string>
                {
                    { 33, "loginExterno" },
                    { 42, "LoginPeritaje" },
                    { peritajeInmvConvert, "LoginPeritajeInmv"},
                    { 54, "LoginExternoAchs"},
                    { 64, "LoginPeritajeBm" }

                };
            string urlSettings = _config["ServicesUrlWeb"].ToString();

            try
            {
                var auth = atenciones.Token;
                var host = HttpContext.Request.Host.Value;
                var idCliente = 0;
                var identificador = "MEDISMART";

                if (!String.IsNullOrEmpty(atenciones.IdCliente.ToString()))
                    idCliente = (int)atenciones.IdCliente;
                if (string.IsNullOrEmpty(baseUrl))
                {
                    baseUrl = atenciones.UrlConvenio;
                }

                Empresa empresa = new Empresa();
                empresa = await GetEmpresa(idCliente);

                if (empresa != null)
                {
                    identificador = empresa.Identificador;
                    idCliente = empresa.Id;
                }


                
                if (atenciones.Peritaje || atenciones.HoraMedico.IdConvenio == 54)
                {

                    PersonasViewModel paciente;

                    using (var httpClient = new HttpClient())
                    {
                        //httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getDatosPacienteTeleperitaje/{atenciones.IdPaciente}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                        }
                    }

                    var convenio = atenciones.HoraMedico.IdConvenio;
                    var loginExterno = new TelemedicinaUrlData();

                    if (convenio == 42)
                    {
                        loginExterno.IdCliente = idCliente.ToString();
                        loginExterno.Modalidad = "COLMENA_PERITAJE";
                    }
                    else if (convenio == 33)
                    {
                        loginExterno.IdCliente = "1";
                        loginExterno.Modalidad = "CONSALUD_PERITAJE";
                    }
                    else if (convenio == 54)
                    {
                        loginExterno.IdCliente = clienteAchs;
                        loginExterno.Modalidad = "ACHS";
                    }
                    else if (convenio == 64)
                    {
                        loginExterno.IdCliente = "689";
                        loginExterno.Modalidad = "BANMEDICA_PERITAJE";
                    }
                    else
                    {
                        loginExterno.IdCliente = "2";
                        loginExterno.Modalidad = "INMV_PERITAJE";
                    }

                    loginExterno.IdCliente = clienteByConvenio[convenio];
                    loginExterno.Modalidad = modalidadByConvenio[convenio];
                    loginExterno.CD_SESSION_ID = atenciones.IdPaciente.ToString();
                    loginExterno.Canal = "PERITAJE";
                    loginExterno.IdAtencion = atenciones.Id.ToString();


                    loginExterno.Titular = new Titular();
                    loginExterno.Titular.Rut = paciente.Identificador;
                    loginExterno.Titular.Nombres = paciente.Nombre;
                    loginExterno.Titular.ApellidoMaterno = paciente.ApellidoMaterno;
                    loginExterno.Titular.ApellidoPaterno = paciente.ApellidoPaterno;
                    loginExterno.Titular.Sexo = paciente.Genero;
                    loginExterno.Titular.Fecha_Nacimiento = paciente.FNacimiento is null ? string.Empty : paciente.FNacimiento.Value.ToString("dd-MM-yyyy");
                    loginExterno.Titular.Telefono = paciente.Telefono;
                    loginExterno.Titular.Email = paciente.Correo;
                    // carpeta dinamica 148 colmen
                    //formatoMail = System.IO.File.ReadAllText(path + clienteByConvenio[convenio] + @"\confirmarPeritajeConsalud.html"); //formato solo para consalud
                    var encriptada =  Extension.Encriptar(JsonConvert.SerializeObject(loginExterno));

                    if (_config["ServicesUrlWeb"].ToString().Contains("qa") && convenio == 42)
                    {
                        convenio = -42;
                    }
                    if (_config["ServicesUrlWeb"].ToString().Contains("qa") && convenio == peritajeInmvConvert)
                    {
                        convenio = peritajeInmvConvert * -1;
                    }
                    if (_config["ServicesUrlWeb"].ToString().Contains("qa") && convenio == 54)
                    {
                        convenio = convenio * -1;
                    }

                    string urlBase = urlByConvenio.TryGetValue(convenio, out urlSettings) == false ? _config["ServicesUrlWeb"] : urlByConvenio[convenio];

                    if (_config["ServicesUrlWeb"].ToString().Contains("localhost"))
                    {
                        urlBase = _config["ServicesUrlWeb"];
                    }
                    // service url web deberia ser doctoronline en diccionario de datos/ ver loginexterno para colmena q sea escable
                    baseUrl = urlBase + "/account/" + urlPeritaje[Math.Abs(convenio)] + "?d=" + encriptada;
                }
                else
                {
                    baseUrl = baseUrl + "/Atencion_SalaEspera/" + atenciones.Id;
                }





                return new JsonResult(new { Status = "OK", baseUrl });
            }
            catch (Exception e)
            {

                return new JsonResult(new { Status = "NOK", MessageError = e.Message, Error = e.ToString() });
            }
        }

        public async Task<Empresa> GetEmpresa(int idCliente)
        {
            Empresa empresa = new Empresa();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getEmpresaById?idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    empresa = JsonConvert.DeserializeObject<Empresa>(apiResponse);
                }
            }

            return empresa;
        }
        private List<TeleperitajeViewModel> GetTeleperitajeList(string fName, string convenio, string zonahoraria)
        {
            List<TeleperitajeViewModel> list = new List<TeleperitajeViewModel>();
            var filename = $"{Directory.GetCurrentDirectory()}{@"\\wwwroot\\files"}" + "\\" + fName;
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = System.IO.File.Open(filename, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    while (reader.Read())
                    {
                        try
                        {
                            list.Add(new TeleperitajeViewModel()
                            {
                                Name = reader.GetValue(0).ToString(),
                                Apellido = reader.GetValue(1).ToString(),
                                Rut = reader.GetValue(2).ToString(),
                                Telefono = reader.GetValue(3).ToString(),
                                Email = reader.GetValue(4).ToString(),
                                RutMedico = reader.GetValue(6).ToString(),
                                FechaCitacion = reader.GetValue(8).ToString(),
                                Hora = reader.GetValue(9).ToString(),
                                IdConvenio = convenio,
                                ZonaHoraria = zonahoraria,
                            });
                        }
                        catch (System.IO.IOException e)
                        {
                            Console.WriteLine(e.Message);
                        }

                    }
                }
            }
            list.RemoveAt(0);
            return list;
        }

        public ActionResult InformeAtenciones()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idEmpresa = HttpContext.User.FindFirstValue("Cla");
            ViewBag.uid = uid;
            ViewBag.idEmpresa = idEmpresa;
            return View();
        }

        public async Task<IActionResult> InformeAtencionAsync(int idAtencion, bool sendInforme = true)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.sendInforme = sendInforme;
            Atenciones atencion;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewData["view"] = Roles.Medico;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
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

            using (var httpClient = new HttpClient())
            {

                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }


            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente/*, Archivo = archivo */};
            return View(atencionModel);
        }


        public ActionResult ListaPacientes()
        {

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;


            return View();
        }

        public async Task<IActionResult> NuevoProfesional()
        {


            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

            var json = HttpContext.User.FindFirstValue(ClaimTypes.System);
            EmpresaCentroClinico data = JsonConvert.DeserializeObject<EmpresaCentroClinico>(json);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = tempID;
            ViewBag.idCentroClinico = data.IdCentroClinico;
            ViewBag.IdPersona = data.IdPersona;

            PersonasViewModel persona = new PersonasViewModel();


            PersonasDatos personaDatos = new PersonasDatos();

            personaDatos.TempID = tempID;

            List<TipoProfesionalViewModel> profesiones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getTipoProfesionales"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    profesiones = JsonConvert.DeserializeObject<List<TipoProfesionalViewModel>>(apiResponse);
                }
            }
            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidadesByTipoProfesional/{profesiones.FirstOrDefault().Id}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }



            List<Parametros> pref_prof;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getPrefijoEspecilidad"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    pref_prof = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            List<Parametros> dur_atencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/obtenerDuracionAtencion"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    dur_atencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
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
            ViewBag.idCentroClinico = data.IdCentroClinico;
            PersonasViewModel persona;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{idProfesional}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            PersonasDatos personaDatos;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{idProfesional}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                }
            }

            var idEntidad = uid;
            var codEntidad = "CERTIFICACIONES";
            List<Archivo> archivo;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/archivo/getArchivosByIdEntidad?idEntidad={idEntidad}&codEntidad={codEntidad}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    archivo = JsonConvert.DeserializeObject<List<Archivo>>(apiResponse);
                }
            }
            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidadesByTipoProfesional/{personaDatos.IdTituloMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }
            List<TipoProfesionalViewModel> profesiones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getTipoProfesionales"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    profesiones = JsonConvert.DeserializeObject<List<TipoProfesionalViewModel>>(apiResponse);
                }
            }


            List<Parametros> pref_prof;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getPrefijoEspecilidad"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    pref_prof = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            List<Parametros> dur_atencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/obtenerDuracionAtencion"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    dur_atencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }

            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, archivos = archivo, especialidades = especialidades, prefijoProfesion = profesiones, prefijo = pref_prof, duracionAtencion = dur_atencion };
            return View(fichaMedico);
        }
        public async Task<IActionResult> NuevoPaciente()
        {
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = tempID;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            PersonasViewModel persona = new PersonasViewModel();


            //PersonasDatos personaDatos = new PersonasDatos();

            persona.TempID = tempID;
            //List<Empresa> empresa;
            //using (var httpClient = new HttpClient())
            //{
            //    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/Empresa/getEmpresas"))
            //    {
            //        string apiResponse = await response.Content.ReadAsStringAsync();
            //        empresa = JsonConvert.DeserializeObject<List<Empresa>>(apiResponse);
            //    }
            //}

            //Empresa lista = new Empresa();
            //lista.Id = 0;
            //lista.Nombre = "Seleccione";

            //empresa.Add(lista);

            //persona.Empresas = empresa;

            var codigoTelefono = persona.CodigoTelefono ?? ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono") ?? "CL";
            if (string.IsNullOrEmpty(codigoTelefono))
                codigoTelefono = "CL";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                }
            }

            return View("EditPaciente", persona);

        }
        public async Task<IActionResult> EditPaciente(int idPaciente)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = idPaciente;
            ViewBag.idCliente = "0";
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{idPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            var codigoTelefono = paciente.CodigoTelefono ?? ((ClaimsIdentity)User.Identity).GetSpecificClaim("CodigoTelefono") ?? "CL";
            if (string.IsNullOrEmpty(codigoTelefono))
                codigoTelefono = "CL";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPrevisiones/{codigoTelefono}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente.Previsiones = JsonConvert.DeserializeObject<List<Prevision>>(apiResponse);
                }
            }

            //List<Empresa> empresa;
            //using (var httpClient = new HttpClient())
            //{
            //    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/Empresa/getEmpresas"))
            //    {
            //        string apiResponse = await response.Content.ReadAsStringAsync();
            //        empresa = JsonConvert.DeserializeObject<List<Empresa>>(apiResponse);
            //    }
            //}

            //Empresa lista = new Empresa();
            //    lista.Id = 0;
            //    lista.Nombre = "Seleccione";

            //empresa.Add(lista);

            //paciente.Empresas = empresa;
            return View(paciente);
        }
        public async Task<IActionResult> AgendaPaciente(int idPaciente)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var typeAgenda = "A";
            ViewBag.uid = uid;
            ViewBag.idAtencion = 0;
            ViewBag.idCliente = idPaciente;
            ViewBag.idHoramedico = 0;
            ViewBag.typeAgenda = typeAgenda; //edit
            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }
            AgendaViewModel agendaModel = new AgendaViewModel() { especialidades = especialidades };
            return View(agendaModel);
        }
        public async Task<IActionResult> EditaAgenda(int idPaciente, int idAtencion)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var typeAgenda = "E";
            ViewBag.idAtencion = idAtencion;
            ViewBag.idCliente = idPaciente;
            ViewBag.typeAgenda = typeAgenda; //edit
            ViewBag.idHoramedico = 0;
            List<Especialidades> especialidades;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidades"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<List<Especialidades>>(apiResponse);
                }
            }
            AgendaViewModel agendaModel = new AgendaViewModel() { especialidades = especialidades };
            return View("AgendaPaciente", agendaModel);
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
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);


            ViewBag.idEdit = tempID;
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;

            Convenios convenio = new Convenios();
            convenio.TempID = tempID;

            List<Parametros> modeloAtencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getModeloAtencion"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    modeloAtencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            List<Parametros> reglaPago;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getReglaPago"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reglaPago = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            List<Parametros> reglaServicio;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getReglaServicio"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reglaServicio = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            AdminConvenios adminConvenios = new AdminConvenios() { modeloAtencion = modeloAtencion, reglaPago = reglaPago, reglaServicio = reglaServicio, convenios = convenio };
            return View(adminConvenios);
        }
        public async Task<IActionResult> EditConvenioAsync(int idConvenio)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idEdit = idConvenio;
            Convenios convenio;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getConvenio/{idConvenio}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);
                }
            }
            List<Parametros> modeloAtencion;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getModeloAtencion"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    modeloAtencion = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
            }
            List<Parametros> reglaPago;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getReglaPago"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reglaPago = JsonConvert.DeserializeObject<List<Parametros>>(apiResponse);
                }
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

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            Convenios convenio;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/convenios/getResumenConvenio"))
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

    }
}