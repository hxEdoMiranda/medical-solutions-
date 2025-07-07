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

namespace WebMVC.Controllers
{
    public class InvitadoController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;

        public InvitadoController(IConfiguration config = null)
        {
            _config = config;
        }
        // GET: InvitadoController
        public ActionResult Index()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }

        [Authorize(AuthenticationSchemes = "MedicoSchemes")]
        public async Task<IActionResult> AtencionAsync(int idAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesAsociados?idAtencion={idAtencion}&uid={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            if (atencion == null || atencion.IdMedicoAsociado != int.Parse(uid) || atencion.NSP == true) return RedirectToAction("Index");

            
          

            List<Examenes> examenes;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenes = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            PersonasViewModel persona;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }
            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = persona, Examenes = examenes, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria };


            return View(atencionModel);
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

        [Authorize(AuthenticationSchemes = "MedicoSchemes")]
        [Route("Invitado/Atencion_Box/{idAtencion}")]
        public async Task<IActionResult> Atencion_Box(int idAtencion)
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            Atenciones atencion;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesAsociados?idAtencion={idAtencion}&uid={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencion = JsonConvert.DeserializeObject<Atenciones>(apiResponse);
                }
            }

            if (atencion == null || atencion.IdMedicoAsociado != int.Parse(uid) || atencion.NSP == true) return RedirectToAction("Index");




            List<Examenes> examenes;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Examenes"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    examenes = JsonConvert.DeserializeObject<List<Examenes>>(apiResponse);
                }
            }

            List<Atenciones> historialAtenciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getHistorialAtencionesByPaciente/{atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    historialAtenciones = JsonConvert.DeserializeObject<List<Atenciones>>(apiResponse);
                }
            }

            PersonasViewModel persona;
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persona = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }
            List<ReporteEnfermeria> reporteEnfermeria;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/ReporteEnfermeria/historialReporteEnfermeria?idPaciente={atencion.IdPaciente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    reporteEnfermeria = JsonConvert.DeserializeObject<List<ReporteEnfermeria>>(apiResponse);
                }
            }

            ConvenioEspecialidadAtencion convenioEs;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/especialidades/especialidadAtencionBox/{atencion.IdEspecialidad}/{atencion.IdConvenio}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    convenioEs = JsonConvert.DeserializeObject<ConvenioEspecialidadAtencion>(apiResponse);
                }
            }

            ViewBag.codConvenio = convenioEs.CodConvenio;
            ViewBag.boxEspecial = convenioEs.BoxEspecial;

            string videoCallUrl = "";

            using (var httpClient = new HttpClient())
            {
                string url = _config["microservices_vidcallms01002"] + $"/videocall?atencionId={atencion.Id}&userId={uid}";
                using (var response = await httpClient.GetAsync(url))
                {
                    Console.WriteLine("url: " + url);
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    videoCallUrl = JsonConvert.DeserializeObject<VideoCallResponse>(apiResponse).urlRoom;
                }
            }

            AtencionViewModel atencionModel = new AtencionViewModel() { Atencion = atencion, fichaPaciente = persona, Examenes = examenes, HistorialAtenciones = historialAtenciones, reporteEnfermeriaList = reporteEnfermeria, urlVideoCall = videoCallUrl };


            return View(atencionModel);
        }

    }
}
