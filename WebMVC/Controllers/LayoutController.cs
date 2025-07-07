using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebMVC.Models;


namespace WebMVC.Controllers
{
    [Authorize(AuthenticationSchemes = "PacienteSchemes")]
    public class LayoutController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public LayoutController(IConfiguration config = null, IHttpContextAccessor httpContextAccessor = null)
        {
            _config = config;
            this._httpContextAccessor = httpContextAccessor;
        }
        // GET: LayoutController
        public ActionResult Index()
        {
            return View();
        }

        // GET: LayoutController/Details/5

        public async Task<List<Notificacions>> Notifications(int uid, string host, int idCliente)
        {
            List<Notificacions> notificaciones;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(host+ $"/usuarios/personas/getNotificaciones?IdUsuario={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    notificaciones = JsonConvert.DeserializeObject<List<Notificacions>>(apiResponse);
                }
            }
           
            return notificaciones;
        }

        public async Task<Empresa> GetConfigEmpresa(string host, int idCliente)
        {
            Empresa empresa;
            
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(host + $"/agendamientos/parametro/getConfigCargasEmpresa?idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    empresa = JsonConvert.DeserializeObject<Empresa>(apiResponse);
                }
            }

            return empresa;
        }

        public async Task<List<VwHorasMedicos>> AtencionVigente(int uid, string host, int idCliente)
        {
            List<VwHorasMedicos> horasAgendadasBloquesHoras;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(host + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                }
            }

            return horasAgendadasBloquesHoras;
        }

        public async Task<EmpresaConfig> GetEmpresaConfigById(string host, int idCliente)
        {
            EmpresaConfig empresa;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(host + $"/usuarios/empresa/getEmpresaConfigById?idCliente={idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    empresa = JsonConvert.DeserializeObject<EmpresaConfig>(apiResponse);
                }
            }

            return empresa;
        }

        public async Task<AtencionesAsistencias> GetAtencionAsistencia(string host, int uid)
        {
            AtencionesAsistencias atencionasistencia;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(host + $"/agendamientos/AtencionesAsistencias/findAsistenciasbyAtencion?IdUsuario={Convert.ToInt32(uid)}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    atencionasistencia = JsonConvert.DeserializeObject<AtencionesAsistencias>(apiResponse);
                }
            }

            return atencionasistencia;
        }
        // POST: LayoutController/Create
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

        // GET: LayoutController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: LayoutController/Edit/5
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

        // GET: LayoutController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: LayoutController/Delete/5
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

        public async Task<string> GetNumAsistencia(int idCliente, string param)
        {
            string num = "";
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getNumAsistencia?idCliente={idCliente}&param={param}"))
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
        public async Task<List<VwHorasMedicos>> GetTimelineData(int idCliente, int uid)
        {
            List<VwHorasMedicos> horasAgendadasBloquesHoras;
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A2&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        horasAgendadasBloquesHoras = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                    }
                }
            } 
            catch 
            {
                horasAgendadasBloquesHoras = new List<VwHorasMedicos>();
            }

            return horasAgendadasBloquesHoras;
        }

        public async Task<List<Empresa>> GetEmpresasbyIdentificador(int idCliente, int uid) 
        { 

            List<Empresa> empresas;
            ViewBag.PreHomeDidi = false;
            using (var httpClient = new HttpClient())
            {

                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/Empresa/GetEmpresasbyIdentificador/{idCliente}/{uid}"))
                {

                    string apiResponse = await response.Content.ReadAsStringAsync();
                    empresas = JsonConvert.DeserializeObject<List<Empresa>>(apiResponse);

                    if (empresas.Count == 3)
                    {
                        ViewBag.PreHomeDidi = true;
                    }

                }
                return empresas;
            }
        }

        public async Task<List<VwHorasMedicos>> GetProximasHorasPaciente(int idCliente, int uid)
        {

            List<VwHorasMedicos> proximasHorasPaciente;

            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/Atenciones/getAtencionesHomePaciente?accion=A3&idPaciente={Convert.ToInt32(uid)}&idCliente={idCliente}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        proximasHorasPaciente = JsonConvert.DeserializeObject<List<VwHorasMedicos>>(apiResponse);
                    }
                }
            }
            catch 
            {
                proximasHorasPaciente = new List<VwHorasMedicos>(); 
            }


            return proximasHorasPaciente;
        }

    }
}
