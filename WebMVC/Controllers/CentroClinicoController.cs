using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebMVC.Models;

namespace WebMVC.Controllers
{
    public class CentroClinicoController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private bool atencionDirecta;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CentroClinicoController(IHttpClientFactory httpClientFactory, IConfiguration config = null, IHttpContextAccessor httpContextAccessor=null)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
            this._httpContextAccessor = httpContextAccessor;
           
        }

        [HttpGet]
        public IActionResult Login(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.AdministradorCentroClinico;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/CentroClinico/Login.cshtml", model);
        }

        private async Task<SimpleUserModel> ValidateLoginAsync(string userName, string password, string rol)
        {

            SimpleUserModel uid = null;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/users/validateLogin?userName={userName}&password={password}&rol={rol}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    uid = JsonConvert.DeserializeObject<SimpleUserModel>(apiResponse);
                }
            }

            return uid;
        }


        private async Task<UsersViewModel> getUserByCorreo(string username)
        {

            UsersViewModel userdata = null;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/users/getUserByCorreo?username={username}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<UsersViewModel>(apiResponse);
                }
            }

            return userdata;
        }


        public string GetHostValue(string value)
        {
            var hostTest = _config["HostTest"];
            if (!string.IsNullOrEmpty(hostTest))
                return hostTest;
            else
                return value;
        }
        [HttpPost]
        public async Task<IActionResult> Login(string userName, string password, string rol, string JsonData = null, string returnUrl = null)
        {

            ViewData["ReturnUrl"] = returnUrl;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            var valido = true;
            var codigoTelefono = "CL";
            var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
            var uid = await ValidateLoginAsync(userName.Contains("@") ? userName : userName.Replace(".", ""), password, rol);
            if (userName.Contains("@"))
            {
                var s = await getUserByCorreo(userName);
                if (s.Username != null)
                    userName = s.Username;
            }
            if (uid == null)
            {
                return Json(new { returnUrl, msg = "error" });
            }

           
            var accion = "Plataforma";
            var idCliente = "0";
            // Normally Identity handles sign in, but you can do it directlyPrimarysid
            if (uid != null && uid.UserId != 0)
            {
                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userName),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, uid.UserId.ToString()),
                        new Claim(ClaimTypes.Authentication, uid.token.ToString()),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString())
                    };

                var host = GetHostValue(HttpContext.Request.Host.Value);
                Global.token = uid.token.ToString();

                //TODO: Obtener id cliente a traves de la relacion de usuario centro clinico
               
                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                claims.Add(new Claim(ClaimTypes.Spn, accion));


                ////SE AGREGA PARA OBTENER IdEmpresa/IdPersonaEmpresa/IdCentroClinico
                //if (Convert.ToInt32(uid.UserId) > 0 && rol == "AdministradorCentro")
                //{
                    var model = await UsuarioConvenioEmpresa(Convert.ToInt32(uid.UserId));                

                //}
                string json = JsonConvert.SerializeObject(model);
                claims.Add(new Claim(ClaimTypes.System, json));


                await HttpContext.SignInAsync($"{rol}Schemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });
                //try del Log de uso de servicio
                LogUso(5, 9, Convert.ToInt32(uid.UserId), Convert.ToInt32(idCliente), "Login/userName=" + userName + "&rol=" + rol);

                if (Url.IsLocalUrl(returnUrl))
                {
                    return Json(new { returnUrl });
                    //return Redirect(returnUrl);
                }
                else
                {

                    if (rol == Roles.AdministradorCentroClinico)
                    {                
                        returnUrl = ("/AdminCentroClinico/Index");

                    }
                                    
                 
                    return Json(new { returnUrl });
                    //return Redirect("/");
                }
            }

            else if (uid.UserId == 0)
            {
                LogUso(5, 10, Convert.ToInt32(uid.UserId), -1, "(Inactivo)Login/userName=" + userName + "&rol=" + rol);
                return Json(new { returnUrl, msg = "Inactivo" });
            }

            LogUso(5, 11, Convert.ToInt32(uid.UserId), -1, "(error)Login/userName=" + userName + "&rol=" + rol);
            return Json(new { returnUrl, msg = "error" });

        }

        private async Task<EmpresaCentroClinico> UsuarioConvenioEmpresa(int UserId)
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            EmpresaCentroClinico userdata = null;

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/EmpresaCentroClinico/getEmpresaCentroClinico?UserId={UserId}";
                using (var response = await httpClient.GetAsync(url))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<EmpresaCentroClinico>(apiResponse);
                }
            }

            return userdata;
        }




        public async Task GrabarLog(LogPacienteViaje log)
        {
            var jsonString = JsonConvert.SerializeObject(log);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
            {
                string url = $"/usuarios/personas/grabarLogPacienteViaje";
                using (var response = await httpClient.PostAsync(url, httpContent))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
        }

        private void LogUso(int idTipoServicio, int idAccionServicio, int idUsuario, int idCliente, string urL_Proceso)
        {

            //try del Log de uso de servicio
            try
            {

                //int idTipoServicio = 5;
                //int idAccionServicio = 9;
                //int idUsuario = Convert.ToInt32(uid);
                //int idCliente = idCliente;// model.IdCliente.Value;
                //string urL_Proceso = "Login/userName=" + userName + "&rol=" + rol;// + "&JsonData=" + JsonData + "&returnUrl=" + returnUrl;


                string URL_LogUso = _config["LogUso"] + "/loguso/LogUsoServicio";
                //var client = new RestClient("http://localhost:7000/loguso/LogUsoServicio");
                var client = new RestClient(URL_LogUso);
                client.Timeout = -1;
                var request = new RestRequest(Method.POST);
                request.AddHeader("Content-Type", "application/json");
                var body = "{\"idTipoServicio\": " + idTipoServicio + ", \"idAccionServicio\": " + idAccionServicio + ", \"idUsuario\": " + idUsuario + ", \"urL_Proceso\": \"" + urL_Proceso + "\", \"idCliente\": " + idCliente + "}";
                request.AddParameter("application/json", body, ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
            }
            catch
            {

            }
        }


        private async Task<JsonResult> UsuarioConvenio(string username, int uid)
        {
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            IntegracionEnroll enroll = null;
            EmpresaConfig empresaConfig = null;
            try
            {
                var jsonString = JsonConvert.SerializeObject(username);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Enroll))
                {
                    string url = $"/api/getEnroladoRut?rut={username}";
                    using (var response = await httpClient.PostAsync(url, httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        enroll = JsonConvert.DeserializeObject<IntegracionEnroll>(apiResponse);
                    }
                }
                var jsonStringEnroll = "";
                string apiResponseEmpresa = "";
                string empresa = "";
                enroll.IdUsuario = uid;
                if (enroll.Status != "200")
                {
                    enroll.Convenio = "COD_SUS";

                }
                var host = GetHostValue(HttpContext.Request.Host.Value);
                if (host.Contains("inmv."))//login viene de nueva mas vida
                {
                    enroll.Convenio = "INMV";
                }
                else if (host.Contains("doctoronline."))//login viene de colmena
                {
                    enroll.Convenio = "COLMENA";
                }
                else if (host.Contains("uoh."))//login viene de colmena
                {
                    enroll.Convenio = "UOH";
                }
                else if (host.Contains("saludproteccion."))//login viene de colmena
                {
                    enroll.Convenio = "COPEUCH";
                }
                else if (host.Contains("vidacamara."))//login viene de colmena
                {
                    enroll.Convenio = "VIDACAMARA";//VIDACAMARA
                }
                else if (host.Contains("claro."))//login viene de claro
                {
                    enroll.Convenio = "CLARO";//claro
                }
                jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                using (var httpClient = _httpClientFactory.CreateClient(HttpClientNames.Services))
                {
                    string url = $"/usuarios/integracionEnroll/personaConvenio";
                    using (var responseEmpresa = await httpClient.PostAsync(url, httpContentEnroll))
                    {
                        apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                        empresaConfig = JsonConvert.DeserializeObject<EmpresaConfig>(apiResponseEmpresa);
                        empresa = JsonConvert.SerializeObject(empresaConfig);
                    }
                }

                return Json(apiResponseEmpresa);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Json(new { msg = "Inactivo" });
            }
        }
        public async Task<IActionResult> Logout(string rol = null)
        {

            await HttpContext.SignOutAsync($"{rol}Schemes");
            return Redirect(await GetUrlAsync(rol));
        }

        private async Task<string> GetUrlAsync(string rol)
        {
            var url = "";
            if (rol == Roles.AdministradorCentroClinico)
            {
                url = "login";
            }      

            return url;
        }


    }
}
