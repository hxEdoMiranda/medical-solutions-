using System;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using RestSharp;
using Newtonsoft.Json;
using WebMVC.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "PacienteSchemes")]
    public class AsistenciaTomaExamenesController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        public AsistenciaTomaExamenesController(IHttpClientFactory httpClientFactory, IConfiguration config = null)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }
        public async Task<ActionResult> Index()
        {

            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.Numero = await GetNumAsistencia();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> ReservaExitosa()
        {

            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.Numero = await GetNumAsistencia();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> CancelacionExamenes()
        {
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.Numero = await GetNumAsistencia();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<ActionResult> AsistenciaClinicaOnline()
        {

            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.Numero = await GetNumAsistencia();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
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
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }
            return View();
        }
        public async Task<ActionResult> AsistenciaExamenes(int? tipo)
        {
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.Numero = await GetNumAsistencia();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.Tipo = tipo;
            var host = GetHostValue(HttpContext.Request.Host.Value);

            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);

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
                    ViewBag.codigoTelefono = personaUsu.CodigoTelefono;
                }
            }

            return View();
        }
        public string GetHostValue(string value)
        {
            var hostTest = _config["HostTest"];
            if (!string.IsNullOrEmpty(hostTest))
                return hostTest;
            else
                return value;
        }
        public async Task<string> GetNumAsistencia()
        {
            string num = "";
            try
            {
                var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getNumAsistencia?idCliente={Convert.ToInt32(idCliente)}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        num = apiResponse;
                    }
                }

                return num;
            }
            catch (Exception ex)
            {
                return num;
            }
        }

    }
}
