using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebMVC.Models;

namespace WebMVC.Controllers
{
    public class PasarelaPagoController : Controller
    {
        //private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;
        public PasarelaPagoController(IConfiguration config = null)
        {
            _config = config;
        }
        // GET: CuestionarioController
        public ActionResult Index()
        {
            return View();
        }

        // GET: CuestionarioController/Details/5
        public async Task<ActionResult> HomeWalletAsync()
        {
            var auth = HttpContext.User.FindFirstValue(ClaimTypes.Authentication);
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            ViewBag.uid = uid;
            var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
            ViewBag.idCliente = idCliente;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            ViewBag.servicesUrlPago = _config["ServicesUrlApiPago"];
            ViewBag.servicesUrlWeb = _config["ServicesUrlWeb"];            
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
            ViewBag.codigoTelefono = paciente.CodigoTelefono;

            List<Empresa> empresas;
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
            }


            List<PaymentCardMercadoPago> tarjetas = new List<PaymentCardMercadoPago>();
#if DEBUG
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
            string publicKey = "";
            using (var httpClient = new HttpClient(clientHandler))
#else
            string publicKey = "";
            using (var httpClient = new HttpClient())
#endif
            {
                try
                {

                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/GetPaymentCardbyIdUser/{uid}/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        tarjetas = JsonConvert.DeserializeObject<List<PaymentCardMercadoPago>>(apiResponse);
                    }

                    using (var response = await httpClient.GetAsync(_config["ServicesUrlApiPago"] + $"/PaymentCard/getAccesTokenMercadoPago/{paciente.CodigoTelefono}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        publicKey = (apiResponse);
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }

            ViewBag.publicKey = publicKey;
            DatosCardMercadopPago objTarjetasUsuario = new DatosCardMercadopPago();
            objTarjetasUsuario.tarjetas = tarjetas;
            objTarjetasUsuario.idUser = Convert.ToInt32(uid);
            objTarjetasUsuario.email = paciente.Correo;
            objTarjetasUsuario.identificador = paciente.Identificador.Replace("-", "");
            objTarjetasUsuario.codigotelefono = paciente.CodigoTelefono;
            objTarjetasUsuario.nombreUser = paciente.nombreCompleto;



            return View(objTarjetasUsuario);
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

        [HttpPost]
        [Route("EnviarPago")]
        public async Task EnviarPago([FromBody] object obj)
        {
#if Release
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
            string publicKey = "";
            using (var httpClient = new HttpClient(clientHandler))
#else
            string publicKey = "";
            using (var httpClient = new HttpClient())
#endif
            {
                try
                {
                    var jsonString = JsonConvert.SerializeObject(obj);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                    using (var response = await httpClient.PostAsync(_config["ServicesUrlApiPago"] + $"/MercadoPago/Process_Payment", httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }
        }
    }
}
