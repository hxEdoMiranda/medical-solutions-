using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Security;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using WebMVC.Models;

namespace WebMVC.Controllers
{
    public class ProgramaSaludController : Controller
    {
        // GET: ProgramaSalud
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        public ProgramaSaludController(IHttpClientFactory httpClientFactory, IConfiguration config = null)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }
        public ActionResult Index()
        {
            return View();
        }

        private void GenerateBaseViewDataBag()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
        }
        public async Task<ActionResult> CompraCustom(String idAtencion)
        {
            var log = new LogPacienteViaje();
            GenerateBaseViewDataBag();

            Console.WriteLine("esta es el controlador" + idAtencion);
            Atenciones atencion = new Atenciones();
            List<AtencionesInterconsultas> Interconsultas = new List<AtencionesInterconsultas>();
            List<Atenciones> atencionesInterconsultas = new List<Atenciones>();
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }


            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getAllInterconsultasByIdAtencion/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(apiResponse.ToString());
                        Interconsultas = JsonConvert.DeserializeObject<List<AtencionesInterconsultas>>(apiResponse);
                    }
                    foreach (var inter in Interconsultas)
                    {
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{inter.IdInterconsulta}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse.Length > 0)
                            {
                                atencionesInterconsultas.Add(JsonConvert.DeserializeObject<Atenciones>(apiResponse));
                            }
                        }
                    }

                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            AtencionViewModel atencionViewModel = new AtencionViewModel()
            {
                Atencion = atencion,
                interconsultas = atencionesInterconsultas
            };


            return View(atencionViewModel);
        }
        public async Task<IActionResult> ConfirmacionInterconsulta(int idAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);


            Atenciones atencion = new Atenciones();

            AtencionesInterconsultas atencionesInterconsultas = new AtencionesInterconsultas();


            log.Evento = "Paciente ingresa a informe de atención wow interconsulta";
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;
            log.IdCliente = Convert.ToInt32(idCliente);

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }




            // Http Clients
            using HttpClient pacienteHttpClient = new HttpClient();

            // Llamadas en paralelo
            Task<HttpResponseMessage> pacienteTask = pacienteHttpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}");

            // Asignación respuestas

            string pacienteResponse = await pacienteTask.Result.Content.ReadAsStringAsync();
            PersonasViewModel paciente = JsonConvert.DeserializeObject<PersonasViewModel>(pacienteResponse);
            if (paciente != null)
            {
                if (paciente.rutaAvatar != null)
                {
                    paciente.rutaAvatar = paciente.rutaAvatar.Replace("\\", "/") ?? null;
                }
            }




            List<PaymentCardMercadoPago> tarjetas = new List<PaymentCardMercadoPago>();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/GetPaymentCardbyIdUser/{uid}/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        tarjetas = JsonConvert.DeserializeObject<List<PaymentCardMercadoPago>>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            DatosCardMercadopPago objTarjetasUsuario = new DatosCardMercadopPago();
            objTarjetasUsuario.tarjetas = tarjetas;
            objTarjetasUsuario.idUser = Convert.ToInt32(uid);
            objTarjetasUsuario.identificador = paciente.Identificador;
            objTarjetasUsuario.nombreUser = paciente.nombreCompleto;
            objTarjetasUsuario.email = paciente.Correo;
            objTarjetasUsuario.codigotelefono = paciente.CodigoTelefono;


            ViewBag.codigoTelefono = atencion.CodigoPais;


            List<VwHorasMedicos> HorasInterconsultasEspecialidades = new List<VwHorasMedicos>(); ;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getHorasProximasInterconsultas/" + Convert.ToInt32(idAtencion)))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    HorasInterconsultasEspecialidades = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse).FindAll((hm)=> hm.EstadoAtencion == null || hm.EstadoAtencion.Equals("E"));
                }
            }
            List<AtencionesInterconsultas> Interconsultas = new List<AtencionesInterconsultas>();
            List<Atenciones> atencionesInter = new List<Atenciones>();
            List<int> especialidades = new List<int>();
            List<string> especialidadesName = new List<string>();
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getAllSpecialityDerivacion/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(apiResponse.ToString());
                        especialidades = JsonConvert.DeserializeObject<List<int>>(apiResponse);
                    }
                    using(var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getAllSpecialityDerivacionName/{idAtencion}"))
                    {
                        string apiResponse = await response.Content?.ReadAsStringAsync();
                        Console.WriteLine(apiResponse.ToString());
                        especialidadesName = JsonConvert.DeserializeObject<List<string>>(apiResponse);
                    }
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getAllInterconsultasByProgramaSalud/{atencion.IdProgramaSalud}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(apiResponse.ToString());
                        Interconsultas = JsonConvert.DeserializeObject<List<AtencionesInterconsultas>>(apiResponse);
                    }
                    var interconsultasActually = new List<dynamic>();
                    foreach (var inter in Interconsultas)
                    {
                        if(inter.Estado == 1) 
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{inter.IdInterconsulta}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                            if (apiResponse.Length > 0)
                            {
                                var atencionActual = new
                                {
                                    Interconsulta = inter,
                                    Atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse)
                                };
                                interconsultasActually.Add(atencionActual);
                            }
                        }
                        
                    }
                    var theAttention = interconsultasActually.FindAll((inter) => inter.Interconsulta.IdAtencion == atencion.Id);
                    atencionesInter = interconsultasActually.FindAll((inter) => !theAttention.Exists((a) => (a.Atencion.HoraMedico.IdEspecialidad == inter.Atencion.HoraMedico.IdEspecialidad))).ConvertAll<Atenciones>((i)=>i.Atencion).ToList()
                            .Concat(theAttention.ConvertAll<Atenciones>(e => e.Atencion).ToList()).ToList();


                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            List<String> EspecialidadesDerivacionPrograma = especialidades.ConvertAll(x => x.ToString());
            List<String> EspecialidadesDerivacionProgramaName = especialidadesName.ConvertAll(x => x.ToString());
            List<String> EspecialidadesFiltradasName = EspecialidadesDerivacionProgramaName.Distinct().ToList();
            List<String> EspecialidadesProgramadas = especialidades.ConvertAll(x => x.ToString());
            if (atencionesInter != null && atencionesInter.Count > 0)
                ViewBag.EspecialidadesProgramadas = atencionesInter.Select(x => x.IdEspecialidad.ToString()).Distinct().ToList();
            foreach (var inter in atencionesInter)
            {
                var horaMedico = HorasInterconsultasEspecialidades.Find((e) => e.IdHora.Equals(inter.HoraMedico.IdHora));
                if (horaMedico == null && EspecialidadesDerivacionPrograma.Exists((s) => inter.HoraMedico.IdEspecialidad.ToString().Equals(s)))
                {
                    inter.HoraMedico.codigoEspecialidad = inter.HoraMedico.IdEspecialidad.ToString();
                    inter.HoraMedico.FechaText = inter.HoraMedico.Fecha.Value.ToString("dd MMM yyyy", new CultureInfo("es-ES")).ToUpper();
                    inter.HoraMedico.HoraDesdeText = inter.HoraMedico.Fecha.Value.ToString("HH:mm");
                    HorasInterconsultasEspecialidades.Add(inter.HoraMedico);
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente, DatosTarjetasMercadoPago = objTarjetasUsuario, HorasInterconsultasEspecialidades = HorasInterconsultasEspecialidades, EspecialidadesDerivacionPrograma = EspecialidadesDerivacionPrograma, EspecialidadesDerivacionProgramaName = EspecialidadesFiltradasName, interconsultas = atencionesInter };
            await GrabarLog(log);

            return View(atencionModel);
        }
        public async Task<IActionResult> ConfirmarAtencion(int idMedicoHora, int idMedico, int idBloqueHora, DateTime fechaSeleccion, string hora, bool horario, int idAtencion, string m, string r, string tipoatencion = "", int especialidad = 0, int anura = 0)
        {
            //ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            var uid = 0;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.idEspecialidad = especialidad;
            ViewBag.checkAnura = anura;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var atencion = new Atenciones();
            if (idAtencion != 0)
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + "/agendamientos/Agendar/getAtencionConfirma?idAtencion=" + idAtencion))
                    {
                        var respService = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(respService);
                        uid = Convert.ToInt32(atencion.IdUsuarioModifica);
                        ViewBag.uid = uid;

                        // Si la atención viene de smartcheck, actualizar estado
                        if (anura == 1 && atencion.Estado == "P")
                        {
                            string url = $"{_config["ServicesUrl"]}/agendamientos/Atenciones/{idAtencion}/estado/I";
                            await httpClient.PutAsync(url, new StringContent(string.Empty));
                            atencion.Estado = "I";

                        }
                        ProgramaSaludPaciente programaSaludPaciente = null;
                        using (var httpProgramaSalud = new HttpClient())
                        {
                            using (var responseProgramaSalud = await httpProgramaSalud.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ProgramaSalud/getOneProgramaSaludPaciente?id={atencion.IdProgramaSalud}&idCliente={atencion.IdCliente}&idPaciente={atencion.IdPaciente}"))
                            {
                                string apiResponsePrograma = await responseProgramaSalud.Content.ReadAsStringAsync();
                                programaSaludPaciente = JsonConvert.DeserializeObject<ProgramaSaludPaciente>(apiResponsePrograma);
                                ViewBag.tipoProgramaSalud = programaSaludPaciente.IdProgramaSalud;
                            }
                        }
                        


                        PersonasViewModel persona;
                        using (var httpClientPersona = new HttpClient())
                        {
                            httpClientPersona.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                            using (var responsePersona = await httpClientPersona.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.HoraMedico.IdMedico}"))
                            {
                                string apiResponse = await responsePersona.Content.ReadAsStringAsync();
                                persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                                atencion.datosMedico = persona;
                            }
                        }
                    }
                }
                PersonasViewModel personaUsu;
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.IdPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                    if (personaUsu != null)
                    {
                        atencion.CodigoTelefono = personaUsu.CodigoTelefono;
                        ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                    }
                }


                var log = new LogPacienteViaje();
                using (var httpClient = new HttpClient())
                {
                    log.Evento = "Confirma hora";
                    log.IdPaciente = Convert.ToInt32(uid);
                    var jsonString = JsonConvert.SerializeObject(log);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            return View(atencion);
        }
        //public ActionResult ResumenInforme()
        //{
        //    return View();
        //}
        public async Task<ActionResult> HomeAsync(string tipo)
        {

            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            int idPrograma = 0;
            ViewBag.tipoPrograma = "Paciente Crónico";

            switch (tipo)
            {
                case "cronico":
                    idPrograma = 1;
                    break;
                case "clinicasueno":
                    idPrograma = 2;
                    ViewBag.tipoPrograma = "Clinica del Sueño";
                    break;
                default: return Redirect("/");
            }

            int idProgramaSaludPaciente = 0;

            ViewBag.idProgramaSalud = idPrograma;
            ProgramaSaludPaciente programaSaludPaciente;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ProgramaSalud/getProgramaSaludPaciente?idProgramaSalud={idPrograma}&idCliente={idCliente}&idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    programaSaludPaciente = JsonConvert.DeserializeObject<ProgramaSaludPaciente>(apiResponse);
                    if (programaSaludPaciente != null)
                    {
                        idProgramaSaludPaciente = programaSaludPaciente.Id;
                    }

                }
            }

            if (programaSaludPaciente != null)
            {
                ProgramaSaludCiclo programaSaludCiclo = new ProgramaSaludCiclo();
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/programasalud/getProgramaSaludCiclobyUserId/{uid}/{idCliente}/{idProgramaSaludPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        programaSaludCiclo = JsonConvert.DeserializeObject<ProgramaSaludCiclo>(apiResponse);
                    }
                }

                if (programaSaludCiclo != null)
                {
                    int numeroCiclo = programaSaludCiclo.NumeroCiclo;
                    return RedirectToAction("PanelPrograma", new { idPsCiclo = numeroCiclo, idPrograma = idPrograma });
                }
                else
                {
                    return RedirectToAction("agenda_2", "ProgramaSalud", new { idPrograma = idPrograma });
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
            //return Redirect("/programaSalud/PanelPrograma");



            return View(paciente);
        }
        public ActionResult Cuestionario(int tipo)
        {

            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.tipo = tipo;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);

            if (tipo == 1)
            {
                return View();
            }
            else if (tipo == 2)
            {
                return View("CuestionarioSueno");
            }
            else { return Redirect("/"); }

        }

        public async Task<IActionResult> agenda_2(int idPrograma, int idMedico, string fechaPrimeraHora, string m, string r, string c, int especialidad, string tipoatencion = "", string tipoEspecialidad = "")
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.idMedico = idMedico;
            ViewBag.fechaPrimeraHora = fechaPrimeraHora;
            ViewBag.m = m;
            ViewBag.r = r;
            ViewBag.c = c;
            ViewBag.idCliente = idCliente;
            ViewBag.tipoatencion = tipoatencion;
            ViewBag.especialidad = especialidad;
            ViewBag.tipoEspecialidad = tipoEspecialidad;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var log = new LogPacienteViaje();
            string pdfTerminos = "";
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getConfigPdfTerminos"))
                {
                    pdfTerminos = await response.Content.ReadAsStringAsync();
                }
            }
            ViewBag.pdfTerminos = pdfTerminos;
            Especialidades especialidades = new Especialidades();

            if (especialidad == 0)
                especialidad = Convert.ToInt32(_config["idEnfermeraFormulario"]);

            using (var httClient = new HttpClient())
            {
                using(var response = await httClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getEspecialidad?id={especialidad}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    especialidades = JsonConvert.DeserializeObject<Especialidades>(apiResponse);
                }
            }
            
            ViewBag.nombreEspecialidad = especialidades.Nombre;

            using (var httpClient = new HttpClient())
            {
                log.Evento = "Agenda 2";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            PersonasViewModel persona;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }


            ViewBag.idProgramaSaludPaciente = 0;

            ProgramaSaludPaciente programaSaludPaciente;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ProgramaSalud/getProgramaSaludPaciente?idProgramaSalud={idPrograma}&idCliente={idCliente}&idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    programaSaludPaciente = JsonConvert.DeserializeObject<ProgramaSaludPaciente>(apiResponse);
                }
                if (programaSaludPaciente != null)
                    ViewBag.idProgramaSaludPaciente = programaSaludPaciente.Id;
            }


            PersonasViewModel personaUsu;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaUsu = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
                if (personaUsu != null)
                {
                    ViewBag.codigoPais = personaUsu.CodigoTelefono;
                }
            }

            PersonasDatos personaDatos;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                }
            }
            int precioConvenioEspecialidad = 0;
            using (var httpClient = new HttpClient())
            {
                int idConvenio = Convert.ToInt32(c);
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Parametro/getPrecioEspecialidad/{idCliente}/{especialidad}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    precioConvenioEspecialidad = JsonConvert.DeserializeObject<int>(apiResponse);
                }
            }
            if (precioConvenioEspecialidad > 0)
                personaDatos.ValorAtencion = precioConvenioEspecialidad;
            SpGetValorizacionExcepciones valorizacion = new SpGetValorizacionExcepciones();
            if (!String.IsNullOrEmpty(c))
            {
                Convenios convenio;
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Convenios/getConvenio/{c}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        convenio = JsonConvert.DeserializeObject<Convenios>(apiResponse);

                        if (convenio != null)
                        {
                            ViewBag.urlConvenio = convenio.UrlConvenio;
                            ViewBag.textoMarca = convenio.TextoMarca;
                            ViewBag.logoConvenio = convenio.FotoConvenio;
                            if (convenio.IdModeloAtencion == 2) //cobra
                            {
                                if (convenio.IdReglaPago == 1) //porcentaje
                                {
                                    personaDatos.ValorAtencion =
                                        Convert.ToInt32(personaDatos.ValorAtencion * (Convert.ToDouble(convenio.ValorReglaPago) / 100));

                                }
                                else if (convenio.IdReglaPago == 2) //valor
                                {
                                    personaDatos.ValorAtencion = convenio.ValorReglaPago;
                                }
                            }


                            if ((idCliente != null && Convert.ToInt32(idCliente) == 2) || Convert.ToInt32(idCliente) == 148)
                            {
                                //[Route("getValorizacionExcepcion/{idCliente}/{idPaciente}/{idMedico}")]
                                //public int GetValorizacionExcepcion(int idCliente, int idPaciente, int idMedico)

                                using (var httpClientValorizacion = new HttpClient())
                                {
                                    using (var responseValorizacion = await httpClientValorizacion.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/getValorizacionExcepcion/{idCliente}/{uid}/{especialidad}"))
                                    {
                                        string apiResponseValorizacion = await responseValorizacion.Content.ReadAsStringAsync();
                                        valorizacion = JsonConvert.DeserializeObject<SpGetValorizacionExcepciones>(apiResponseValorizacion);

                                        if (valorizacion.ValorAtencion == 0 && (idCliente != null && Convert.ToInt32(idCliente) == 2))
                                        {
                                            ViewBag.m = 1;
                                        }
                                        else
                                        {
                                            personaDatos.ValorAtencion = valorizacion.ValorAtencion;
                                        }



                                    }
                                }

                            }
                        }
                    }
                }
            }


            //ViewBag.valorAtencion = personaDatos.ValorAtencion;


            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, ValorizacionExcepciones = valorizacion };


            if (idCliente == "108")
            {
                ViewData["FondoBlanco"] = "true";
            }
            return View(fichaMedico);
        }
        // GET: ProgramaSalud/Details/5
        public async Task<ActionResult> ResumenInformeAsync(int idAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewData["view"] = Roles.Paciente;
            ViewBag.urlBase = _config["ServicesUrlWeb"];
            ViewBag.servicesUrl = _config["ServicesUrl"];
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            var log = new LogPacienteViaje();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);


            List<Pharmacy> farmacias = new List<Pharmacy>();
            Atenciones atencion = new Atenciones();
            List<Examenes> examenesAtencion = new List<Examenes>();
            AtencionesInterconsultas atencionesInterconsultas = new AtencionesInterconsultas();


            log.Evento = "Paciente ingresa a informe de atención wow";
            log.IdPaciente = Convert.ToInt32(uid);
            log.IdAtencion = idAtencion;
            log.IdCliente = Convert.ToInt32(idCliente);

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            if (atencion == null || atencion.IdPaciente != int.Parse(uid))
            {
                switch (Convert.ToInt32(idCliente))
                {
                    case 1:
                        return Redirect("https://clientes.consalud.cl/clickdoctor/");
                    default:
                        return RedirectToAction("Index");
                }

            }


            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/yapp/Farmazon/FindMedicineInPharmacies?attentionId={Convert.ToInt32(idAtencion)}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        farmacias = JsonConvert.DeserializeObject<List<Pharmacy>>(apiResponse);
                        farmacias ??= new List<Pharmacy>();
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesByAtencion?IdAtencion={Convert.ToInt32(idAtencion)}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        examenesAtencion = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                        examenesAtencion ??= new List<Examenes>();
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            ViewBag.interconsultaGenerada = 0;

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionesInterconsultas/getInterconsultasByIdAtencion/{idAtencion}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencionesInterconsultas = JsonConvert.DeserializeObject<AtencionesInterconsultas>(apiResponse);
                        if (atencionesInterconsultas != null)
                        {
                            ViewBag.interconsultaGenerada = atencionesInterconsultas.Id;
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }




            // Http Clients
            using HttpClient pacienteHttpClient = new HttpClient();
            using HttpClient proximaHoraHttpClient = new HttpClient();
            List<VwHorasMedicos> proximaHora = new List<VwHorasMedicos>();
            proximaHoraHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"Bearer {auth}");

            // Llamadas en paralelo
            Task<HttpResponseMessage> pacienteTask = pacienteHttpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}");
            if (atencion.IdEspecialidadDerivacion > 0)
            {
                Task<HttpResponseMessage> proximaHoraTask = proximaHoraHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/GetMedicosHorasInterConsulta?idEspecialidad={atencion.IdEspecialidadDerivacion}&idBloque={0}&userId={atencion.IdPaciente}&fecha={DateTime.Now:yyyy-MM-dd}&idCliente={idCliente}&tipoEspecialidad=");
                // Espera llamadas

                string proximaHoraResponse = await proximaHoraTask.Result.Content.ReadAsStringAsync();
                proximaHora = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(proximaHoraResponse) ?? new List<VwHorasMedicos>();
            }
            // Asignación respuestas

            string pacienteResponse = await pacienteTask.Result.Content.ReadAsStringAsync();
            PersonasViewModel paciente = JsonConvert.DeserializeObject<PersonasViewModel>(pacienteResponse);
            if (paciente != null)
            {
                if (paciente.rutaAvatar != null)
                {
                    paciente.rutaAvatar = paciente.rutaAvatar.Replace("\\", "/") ?? null;
                }
            }




            string publicKey = "";
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/getAccesTokenMercadoPago/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        publicKey = (apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            ViewBag.publicKey = publicKey;

            List<PaymentCardMercadoPago> tarjetas = new List<PaymentCardMercadoPago>();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/GetPaymentCardbyIdUser/{uid}/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        tarjetas = JsonConvert.DeserializeObject<List<PaymentCardMercadoPago>>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }
            DatosCardMercadopPago objTarjetasUsuario = new DatosCardMercadopPago();
            objTarjetasUsuario.tarjetas = tarjetas;
            objTarjetasUsuario.idUser = Convert.ToInt32(uid);
            objTarjetasUsuario.identificador = paciente.Identificador;
            objTarjetasUsuario.nombreUser = paciente.nombreCompleto;
            objTarjetasUsuario.email = paciente.Correo;
            objTarjetasUsuario.codigotelefono = paciente.CodigoTelefono;



            OrderHeader objOrder = new OrderHeader();

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/Order/GetOrderbyIdAttention/{atencion.Id}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        objOrder = JsonConvert.DeserializeObject<OrderHeader>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            if (objOrder != null)
                if (objOrder.customer_exam_address_id > 0)
                {
                    IList<Address> direcciones = new List<Address>();

                    using var httpClient = new HttpClient();
                    using var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/E");
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    direcciones = JsonConvert.DeserializeObject<List<Address>>(apiResponse) ?? new List<Address>();

                    foreach (Address direccion in direcciones)
                    {
                        if (direccion.Id == objOrder.customer_exam_address_id)
                        {
                            string direccionEx = direccion.Direccion;
                            string direccionExamenWOW = HttpUtility.UrlEncode(direccionEx, System.Text.Encoding.UTF8);
                            ViewBag.direccionExamenWOW = direccionEx;
                        }
                    }
                }

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync($"{_config["ServicesUrl"]}/usuarios/personas/getAddresses/{uid}/E"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        JArray jsonArray = JArray.Parse(apiResponse);
                        ViewBag.totalDirecciones = jsonArray.Count;
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }


            ViewBag.codigoTelefono = atencion.CodigoPais;


            /*Consulta smartcheck por idAtencion*/

            var client = new RestClient("http://smartcheck-backend.azurewebsites.net/api/Measurement/measurementByAttentionID?attention_id=" + Convert.ToInt32(idAtencion));
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            IRestResponse r = client.Execute(request);
            var resultado = r.Content;
            ViewBag.historialSmartcheck = null;
            if (resultado.Length > 0)
            {
                ViewBag.historialSmartcheck = JArray.Parse(resultado);
            }

            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = paciente, HorasDerivacion = proximaHora, Examenes = examenesAtencion, Farmacias = farmacias, DatosTarjetasMercadoPago = objTarjetasUsuario, OrderAttention = objOrder, TimelineData = horasAgendadasBloquesHoras, ProximasHorasPaciente = proximasHorasPaciente };
            return View(atencionModel);



        }

        public async Task<ActionResult> PanelPrograma(int idPsCiclo, int idPrograma)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.idPrograma = idPrograma;
            List<ProgramaSaludAtencionesEspecialidad> programaSaludAtencionesEspecialidad = new List<ProgramaSaludAtencionesEspecialidad>();
            ProgramaSalud programaSalud = new ProgramaSalud();
            Atenciones atencion = new Atenciones();
            List<Examenes> examenesAtencion = new List<Examenes>();
            List<AtencionMedicamentos> atencionMedicamentos = new List<AtencionMedicamentos>();
            ViewBag.numeroCiclo = idPsCiclo;


            // Http Clients
            using HttpClient pacienteHttpClient = new HttpClient();
            using HttpClient proximaHoraHttpClient = new HttpClient();
            List<VwHorasMedicos> proximaHora = new List<VwHorasMedicos>();
            proximaHoraHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"Bearer {auth}");

            // Llamadas en paralelo
            Task<HttpResponseMessage> pacienteTask = pacienteHttpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={atencion.IdPaciente}");
            if (atencion.IdEspecialidadDerivacion > 0)
            {
                Task<HttpResponseMessage> proximaHoraTask = proximaHoraHttpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/GetMedicosHorasInterConsulta?idEspecialidad={atencion.IdEspecialidadDerivacion}&idBloque={0}&userId={atencion.IdPaciente}&fecha={DateTime.Now:yyyy-MM-dd}&idCliente={idCliente}&tipoEspecialidad=");
                // Espera llamadas

                string proximaHoraResponse = await proximaHoraTask.Result.Content.ReadAsStringAsync();
                proximaHora = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(proximaHoraResponse) ?? new List<VwHorasMedicos>();
            }
            // Asignación respuestas


            using (var httpClient = new HttpClient())
            {
                //httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/programasalud/getProgramaSalud/{idPrograma}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    programaSalud = JsonConvert.DeserializeObject<ProgramaSalud>(apiResponse);
                }
            }

            string pacienteResponse = await pacienteTask.Result.Content.ReadAsStringAsync();
            PersonasViewModel paciente = JsonConvert.DeserializeObject<PersonasViewModel>(pacienteResponse);
            if (paciente != null)
            {
                if (paciente.rutaAvatar != null)
                {
                    paciente.rutaAvatar = paciente.rutaAvatar.Replace("\\", "/") ?? null;
                }
            }


            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            List<VwHorasMedicos> proximasHorasPaciente;

            int idProgramaSaludPaciente = 0;

            ViewBag.idProgramaSaludPaciente = 0;

            ProgramaSaludPaciente programaSaludPaciente;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ProgramaSalud/getProgramaSaludPaciente?idProgramaSalud={idPrograma}&idCliente={idCliente}&idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    programaSaludPaciente = JsonConvert.DeserializeObject<ProgramaSaludPaciente>(apiResponse);
                }
                if (programaSaludPaciente != null)
                    ViewBag.idProgramaSaludPaciente = programaSaludPaciente.Id;
                idProgramaSaludPaciente = programaSaludPaciente.Id;
            }

            List<Atenciones> historialAtencionesProgramaSalud = new List<Atenciones>();
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesProgramaSaludByPaciente/{uid}/{idProgramaSaludPaciente}/{idPsCiclo}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        historialAtencionesProgramaSalud = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);

                        historialAtencionesProgramaSalud = historialAtencionesProgramaSalud.GroupBy(atencion => atencion.Id)
                            .Select(group => group.First()).ToList();
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }

            }

            DateTime fechaActual = DateTime.Now;
            paciente.Edad = paciente.FNacimiento == null ? 0 : fechaActual.Year - paciente.FNacimiento.Value.Year;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
                proximasHorasPaciente = proximasHorasPaciente.Where(x => x.IdProgramaSalud == idProgramaSaludPaciente && x.EstadoAtencion == "I")
                    .Where(x => DateTime.Now.TimeOfDay < x.HoraDesde || DateTime.Now < x.Fecha)
                    .OrderBy(x => x.Fecha).ToList();
            }

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes/getExamenesByCicloPs?NumeroCiclo={Convert.ToInt32(idPsCiclo)}&uid={uid}&idProgramaSaludPaciente={idProgramaSaludPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        examenesAtencion = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                        examenesAtencion ??= new List<Examenes>();
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/AtencionMedicamentos/getAtencionMedicamentosByCicloPs?NumeroCiclo={Convert.ToInt32(idPsCiclo)}&uid={uid}&idProgramaSaludPaciente={idProgramaSaludPaciente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        atencionMedicamentos = JsonConvert.DeserializeObject<List<AtencionMedicamentos>>(apiResponse);
                        atencionMedicamentos ??= new List<AtencionMedicamentos>();
                    }
                }
                catch (Exception e)
                {
                    Console.Write(e);
                }
            }

            List<VwHorasMedicos> listadoMedicos = new List<VwHorasMedicos>();

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/programasalud/getProgramaSaludbyUserId/{uid}/{idCliente}/{idPsCiclo}/{idProgramaSaludPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    programaSaludAtencionesEspecialidad = JsonConvert.DeserializeObject<List<ProgramaSaludAtencionesEspecialidad>>(apiResponse);

                    if (programaSaludAtencionesEspecialidad.Any())
                    {
                        foreach (var programaSaludEspecialidad in programaSaludAtencionesEspecialidad)
                        {
                            int idMedico = programaSaludEspecialidad.IdMedico;
                            using (var responseMedico = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/agendar/getMedicosbyId/{idMedico}"))
                            {
                                string apiResponseMedico = await responseMedico.Content.ReadAsStringAsync();
                                var medicos = JsonConvert.DeserializeObject<VwHorasMedicos>(apiResponseMedico);
                                listadoMedicos.Add(medicos);
                            }
                        }
                    }
                }
            }


            //filtro de vencimiento de recurrencia
            programaSaludAtencionesEspecialidad.RemoveAll(EstaVencido);
            static bool EstaVencido(ProgramaSaludAtencionesEspecialidad programaSaludEspecialidad)
            {
                if (programaSaludEspecialidad.InitDate == null)
                {
                    return false;
                }
                DateTime fechaActual = DateTime.Now;
                DateTime fechaVencimiento = CalcularFechaVencimiento(programaSaludEspecialidad);

                return fechaActual > fechaVencimiento;
            }
            static DateTime CalcularFechaVencimiento(ProgramaSaludAtencionesEspecialidad programaSaludEspecialidad)
            {
                DateTime fechaInicio = DateTime.Parse(programaSaludEspecialidad.InitDate);
                switch (programaSaludEspecialidad.Periodicidad)
                {
                    case "Q": // Quincenal
                        return fechaInicio.AddDays(15 * programaSaludEspecialidad.Cantidad);
                    case "M": // Mensual
                        return fechaInicio.AddMonths(programaSaludEspecialidad.Cantidad);
                    case "S": // Semanal
                        return fechaInicio.AddDays(7 * programaSaludEspecialidad.Cantidad);
                    default:
                        throw new ArgumentException("Periodicidad no válida");
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { fichaPaciente = paciente, programaSaludAtencionesEspecialidad = programaSaludAtencionesEspecialidad, ProximasHorasPaciente = proximasHorasPaciente, HistorialAtenciones = historialAtencionesProgramaSalud, Examenes = examenesAtencion, AtencionMedicamentos = atencionMedicamentos, programaSalud = programaSalud, TimelineData = listadoMedicos };

            return View(atencionModel);
        }


        public async Task GrabarLog(LogPacienteViaje log)
        {
            var jsonString = JsonConvert.SerializeObject(log);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
        }

        // GET: ProgramaSalud/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ProgramaSalud/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ProgramaSalud/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ProgramaSalud/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ProgramaSalud/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ProgramaSalud/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
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
