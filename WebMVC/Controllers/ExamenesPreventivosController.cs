using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Net;
using System.Net.Http;
using WebMVC.Models;
using Newtonsoft.Json;

namespace WebMVC.Controllers
{
    public class ExamenesPreventivosController : Controller
    {
        private readonly IConfiguration _config;
        public ExamenesPreventivosController(IConfiguration config = null)
        {
            _config = config;
        }
        public IActionResult Index()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public IActionResult SmartCheck()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public IActionResult Restricciones()
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            return View();
        }
        public async Task<IActionResult> SolicitudExamenes()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            string codigoTelefono = "";
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
                    codigoTelefono = personaUsu.CodigoTelefono;
                }
            }
            ViewBag.codigoTelefono = codigoTelefono;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
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
    }
}
