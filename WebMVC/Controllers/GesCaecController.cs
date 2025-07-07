using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Net.Http;

namespace WebMVC.Controllers
{
    public class GesCaecController : Controller
    {
            
        private readonly IConfiguration _config;
        public GesCaecController(IConfiguration config = null)
        {
            _config = config;
        }
        public async Task<ActionResult> Index()
        {
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.uid = uid;
            ViewBag.IdClientePlataforma = idCliente;
            ViewBag.Numero = await GetNumAsistencia();
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.hasTitleLayout = 1;
            ViewBag.NumeroAsesoria = await GetNumAsistencia("NUM_ASE");
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
        public async Task<string> GetNumAsistencia(string grupo = null)
        {
            string num = "";
            try
            {
                var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
                if (Convert.ToInt32(idCliente) == 0)
                    idCliente = "119";
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getNumAsistencia?idCliente={Convert.ToInt32(idCliente)}&param={grupo}"))
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
