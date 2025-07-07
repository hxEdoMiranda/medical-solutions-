using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebMVC.Models;
using System.Security.Principal;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;

namespace WebMVC.Controllers
{
    public class PresencialController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        public PresencialController(IConfiguration config = null)
        {
            _config = config;
        }

        private void campos(string empresa)
        {

            EmpresaConfig empresaC = JsonConvert.DeserializeObject<EmpresaConfig>(empresa);
            ViewBag.imgSuscripcion = empresaC.ImgSuscripcion;
            ViewBag.textoSuscripcion = empresaC.TextoSuscripcion;
            ViewBag.subTextoSuscripcion = empresaC.SubTextoSuscripcion;
            ViewBag.visibleSuscripcion = "";
            if (!empresaC.VisibleSuscripcion)
                ViewBag.visibleSuscripcion = "hidden";

            ViewBag.imgAtencionmg = empresaC.ImgAtencionmg;
            ViewBag.textoAtencionmg = empresaC.TextoAtencionmg;
            ViewBag.subTextoAtencionmg = empresaC.SubTextoAtencionmg;
            ViewBag.visibleAtencionmg = "";
            if (!empresaC.VisibleAtencionmg)
                ViewBag.visibleAtencionmg = "hidden";

            ViewBag.imgAtencionPed = empresaC.ImgAtencionPed;
            ViewBag.textoAtencionPed = empresaC.TextoAtencionPed;
            ViewBag.subTextoAtencionPed = empresaC.SubTextoAtencionPed;
            ViewBag.visibleAtencionPed = "";
            if (!empresaC.VisibleAtencionPed)
                ViewBag.visibleAtencionPed = "hidden";

            ViewBag.imgOndemand = empresaC.ImgOndemand;
            ViewBag.textoOndemand = empresaC.TextoOndemand;
            ViewBag.subTextoOndemand = empresaC.SubTextoOndemand;
            ViewBag.visibleOndemand = "";
            if (!empresaC.VisibleOndemand)
                ViewBag.visibleOndemand = "hidden";

            ViewBag.imgVet = empresaC.ImgVet;
            ViewBag.textoVet = empresaC.TextoVet;
            ViewBag.subTextoVet = empresaC.SubTextoVet;
            ViewBag.visibleVet = "";
            if (!empresaC.VisibleVet)
                ViewBag.visibleVet = "hidden";

            ViewBag.imgAsistenciaSalud = empresaC.ImgAsistenciaSalud;
            ViewBag.textoAsistenciaSalud = empresaC.TextoAsistenciaSalud;
            ViewBag.visibleAsistenciaSalud = "";
            if (!empresaC.VisibleAsistenciaSalud)
                ViewBag.visibleAsistenciaSalud = "hidden";

            ViewBag.imgPortalFarmacias = empresaC.ImgPortalFarmacias;
            ViewBag.textoPortalFarmacias = empresaC.TextoPortalFarmacias;
            ViewBag.visiblePortalFarmacias = "";
            if (!empresaC.VisiblePortalFarmacias)
                ViewBag.visiblePortalFarmacias = "hidden";

            ViewBag.imgExamenesDomicilio = empresaC.ImgExamenesDomicilio;
            ViewBag.textoExamenesDomicilio = empresaC.TextoExamenesDomicilio;
            ViewBag.visibleExamenesDomicilio = "";
            if (!empresaC.VisibleExamenesDomicilio)
                ViewBag.visibleExamenesDomicilio = "hidden";

            ViewBag.imgOrientacionEnfermeria = empresaC.ImgOrientacionEnfermeria;
            ViewBag.textoOrientacionEnfermeria = empresaC.TextoOrientacionEnfermeria;
            ViewBag.visibleOrientacionEnfermeria = "";
            if (!empresaC.VisibleOrientacionEnfermeria)
                ViewBag.visibleOrientacionEnfermeria = "hidden";

            ViewBag.imgPremiosBeneficios = empresaC.ImgPremiosBeneficios;
            ViewBag.textoPremiosBeneficios = empresaC.TextoPremiosBeneficios;
            ViewBag.visiblePremiosBeneficios = "";
            if (!empresaC.VisiblePremiosBeneficios)
                ViewBag.visiblePremiosBeneficios = "hidden";

            ViewBag.visibleBanners = "";
            if (!empresaC.VisibleBanners)
                ViewBag.visibleBanners = "hidden";


            ViewBag.logoEmpresa = empresaC.LogoEmpresa;
            ViewBag.imgUsuario = empresaC.ImgUsuario;
            ViewBag.nombreUsuario = empresaC.NombreUsuario;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
        }

        public IActionResult Index(string r)
        {
            return View(r);
        }
        public IActionResult HomeConsultas()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public IActionResult HomeExamenes()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public IActionResult ServicioExamen(string servicio = "")
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public IActionResult ServicioConsultas(string servicio = "")
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;

            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<IActionResult> AgendarAsync(string tipo)
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.tipo = tipo;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var empresa = HttpContext.User.FindFirstValue("empresa");
            if (empresa == null || empresa == "null" || empresa == "")
                return Redirect("/Account/loginPaciente");
            campos(empresa);
            //var fecha = DateTime.Now.Date;

            var log = new LogPacienteViaje();
            using (var httpClient = new HttpClient())
            {
                log.Evento = "Paciente ingresa a Agendar";
                log.IdPaciente = Convert.ToInt32(uid);
                var jsonString = JsonConvert.SerializeObject(log);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/personas/grabarLogPacienteViaje", httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            //List<VwHorasMedicos> vwHorasMedicos;
            //using (var httpClient = new HttpClient())
            //{
            //    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Agendar/getMedicosHoraProxima?paraEspecialidad=&idEspecialidad=0&idBloque=0&userId={uid}&idCliente={idCliente}"))
            //    {
            //        string apiResponse = await response.Content.ReadAsStringAsync();
            //        vwHorasMedicos = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
            //    }
            //}

            PersonasViewModel paciente;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getFichaPaciente?idPaciente={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    paciente = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }


            AgendaViewModel agendaModel = new AgendaViewModel() { fichaPaciente = paciente, idCliente = idCliente };
            return View(agendaModel);
        }


        public async Task<IActionResult> agenda_2(string idMedico, string fechaPrimeraHora, string m, string r, string titulo, string tipoServicio, int totalSlots, string lugar, string genero)
        {

            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.idMedico = idMedico;
            ViewBag.fechaPrimeraHora = fechaPrimeraHora;
            ViewBag.m = m;
            ViewBag.r = r;
            ViewBag.titulo = titulo;
            ViewBag.idCliente = idCliente;
            ViewBag.tipoServicio = tipoServicio;
            ViewBag.totalSlots = totalSlots;
            ViewBag.lugar = lugar;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.generoMed = genero;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var log = new LogPacienteViaje();
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

            PersonasDatos personaDatos;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personasDatos/personasDatosByUser/{idMedico}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    personaDatos = JsonConvert.DeserializeObject<PersonasDatos>(apiResponse);
                }
            }

            SpGetValorizacionExcepciones valorizacion = new SpGetValorizacionExcepciones();



            //ViewBag.valorAtencion = personaDatos.ValorAtencion;


            FichaMedicoViewModel fichaMedico = new FichaMedicoViewModel() { personas = persona, personasDatos = personaDatos, ValorizacionExcepciones = valorizacion };

            return View(fichaMedico);
        }


        public async Task<IActionResult> ConfirmarAtencion(string idMedicoHora, string idMedico, string lugar)
        {
            //ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.idCliente = idCliente;
            ViewBag.uid = uid;
            ViewBag.idMedico = idMedico;
            ViewBag.lugar = lugar;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ConfirmaViewModel fichaMedico = new ConfirmaViewModel() { idMedico = idMedico, lugar = lugar };
            return View(fichaMedico);
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
