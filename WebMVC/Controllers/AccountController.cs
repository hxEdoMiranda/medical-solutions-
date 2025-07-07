using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Spreadsheet;
using IdentityModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using PagedList;
using RestSharp;
using Sentry;
using WebMVC.Models;
using Sustainsys.Saml2.Metadata;
using System.Xml;
using Sustainsys.Saml2.Configuration;
using Sustainsys.Saml2;
using System.IO;
using Sustainsys.Saml2.Saml2P;
using Sustainsys.Saml2.WebSso;
using System.IdentityModel.Tokens;
using Sustainsys.Saml2.AspNetCore2;
using System.Xml.Linq;
using System.IO.Pipelines;


namespace WebMVC.Controllers
{
    public class Global
    {
        public static string token { get; set; }
        public static string IdentificadorConvenio { get; set; }
    }
    public class AccountController : Controller
    {
        private readonly IConfiguration _config;
        public readonly HttpClient client = new HttpClient();
        private bool atencionDirecta;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountController(IConfiguration config = null, IHttpContextAccessor httpContextAccessor = null)
        {
            _config = config;
            this._httpContextAccessor = httpContextAccessor;

        }
        [HttpGet]
        public IActionResult Login(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Medico;
            ViewBag.HostURL = GetHostValue(HttpContext.Request.Host.Value);
            if (userName != null)
            {
                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);
            }
            var host = GetHostValue(HttpContext.Request.Host.Value);

            if (host.Contains("uoh."))
                return LoginUohMed(userName, activationCode, returnUrl);
            else if (host.Contains("unabactiva.") || host.Contains("activa.unab."))
                return LoginUnabMed(userName, activationCode, returnUrl);
            else
                return View("~/Views/Medico/Login.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginColmenaMed(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Medico;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Medico/LoginColmena.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBo(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginBo.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginClaro(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginClaro.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginHapplabs(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LogiHapplabs.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginINMV(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginINMV.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginColmena(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginColmena.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginCoopeuch(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginCoopeuch.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginVidaCamara(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginVidaCamara.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginRappi(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginRappi.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginCo(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginCo.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginAchs(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginAchs.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginGrupoDefensa(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginGrupoDefensa.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBancoUnion(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginBancoUnion.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginAqua(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginAqua.cshtml", model);
        }
        public IActionResult LoginMx(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginMx.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginWedoctors(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);
            }
            return View("~/Views/Paciente/LoginWedoctors.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginHealthAtomMX(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);
            }
            return View("~/Views/Paciente/LoginHealthAtomMX.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginDimex(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);
            }
            return View("~/Views/Paciente/LoginDimex.cshtml", model);
        }

        public IActionResult LoginDidi(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginDidi.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginSunglass(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginSunglass.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginGlory(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginGlory.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginBeInsure(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginBeInsure.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginPalig(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginPalig.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginTiendaRed(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginTiendaRed.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginCardifMX(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginCardifMX.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginCrehanaMX(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginCrehanaMX.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginConplan(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginConplan.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginYouZen(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginYouZen.cshtml", model);
        }


        [HttpGet]
        public IActionResult LoginUoh(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginUOH.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginUohMed(string userName = null, string activationCode = null, string returnUrl = null)
        {


            ViewData["ReturnUrl"] = returnUrl;
            TempData["ValorUrl"] = "LoginUohMed";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Medico;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Medico/LoginUohMed.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginImplementos(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginImplementos.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginClini(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginClini.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginMedlog(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginMedlog.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginPrueba(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginPrueba.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginPromocional(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginPromocional.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginSekure(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSekure.cshtml", model);
        }


        [HttpGet]
        public IActionResult LoginCermaq(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginCermaq.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginMiEnergy(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginMiEnergy.cshtml", model);
        }


        [HttpGet]
        public IActionResult LoginFalp(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginFalp.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginSouthbridge(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSouthbridge.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginSaludDocwell(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSaludDocwell.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginGesta(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginGesta.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginCalma(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginCalma.cshtml", model);
        }

        public IActionResult LoginBancoW(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBancoW.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginMaserco(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginMaserco.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBice(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBice.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginCCU(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginCCU.cshtml", model);
        }
        public IActionResult LoginMSC(string userName = null, string activationCode = null, string returnUrl = null)
        {
            
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginMSC.cshtml", model);
            
        }
        public IActionResult LoginOxiquimComunidades(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginMSC.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginHealthAtom(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginHealthAtom.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginLoreal(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginLoreal.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBukMX(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBukMX.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBuk(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBuk.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginAndesSalud(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginAndesSalud.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginLaPolar(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginLaPolar.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginPepsico(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginPepsico.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginTurbus(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginTurbus.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBiceEntel(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBiceEntel.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBetterflyChile(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBetterflyChile.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginVinilit(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginVinilit.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginLider(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginLider.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginABC(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginABC.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginDODO(string userName = null, string activationCode = null, string returnUrl = null) 
        {
               ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginDODO.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginCorona(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginCorona.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginBetterflyMx(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBetterflyMx.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginOnAssist(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginOnAssist.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginSimpleeregalariza(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSimpleeregalariza.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginHelp(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginHelp.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginLaaraucana(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginLaaraucana.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginSegurossura(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSegurossura.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginTelemed(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginTelemed.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginMultix(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginMultix.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginCns(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginCns.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginTratame(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginTratame.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginBondup(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBondup.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginOxiquim(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginOxiquim.cshtml", model);

        }

        [HttpGet]
        public IActionResult LoginGnbLiberty(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginGnbLiberty.cshtml", model);

        }

        [HttpGet]
        public IActionResult LoginSalmonesAustral(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSalmonesAustral.cshtml", model);
        }

        [HttpGet]
        public IActionResult LoginFoncencosud(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginFoncencosud.cshtml", model);

        }
        [HttpGet]

        public IActionResult LoginFinanciar(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginFinanciar.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginTuya(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginTuya.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginLudsa(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginLudsa.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginSoi(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSoi.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginWTW(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginWTW.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginComercialCO(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginComercialCO.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginPepsicoCo(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginPepsicoCo.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginVivaHome(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginVivaHome.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginAzteca(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginAzteca.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginMetlife(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginMetlife.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginPositivaAuto(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginPositivaAuto.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginFalabella(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginFalabella.cshtml", model);

        }

        [HttpGet]
        public IActionResult LoginSegurosMundial(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSegurosMundial.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginCrehana(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginCrehana.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginPrestaSalud(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginPrestaSalud.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginNaucare(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginNaucare.cshtml", model);

        }
        public IActionResult LoginRuah(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginRuah.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginMasterDescuentos(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginMasterDescuentos.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginAdvance(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginAdvance.cshtml", model);

        }

        [HttpGet]
        public IActionResult LoginGloryCo(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginGloryCo.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginCredipress(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginCredipress.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginPresente(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginPresente.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginAlliados(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginAlliados.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginSiigo(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSiigo.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginSolidaria(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSolidaria.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginCenco(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginCenco.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginLuxottica(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginLuxottica.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginBancodebogota(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginBancodecolombia.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginClientesBci(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginClientesBci.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginLuft(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginLuft.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginSuraColaboradores(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSuraColaboradores.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginSeguroyFacil(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginSeguroyFacil.cshtml", model);

        }

        [HttpGet]
        public IActionResult LoginMiaHealth(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginMiaHealth.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginUnabMed(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            TempData["ValorUrl"] = "LoginUnabMed";
            LoginViewModel model = new LoginViewModel
            {
                rol = Roles.Medico
            };
            if (userName != null)
            {
                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);
            }

            return View("~/Views/Medico/LoginUnab.cshtml", model);
        }

        public IActionResult LoginAdmin(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Administrador;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Admin/Login.cshtml", model);
        }

        public IActionResult LoginAdminTeleperitaje(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.AdministradorTeleperitaje;
            if (userName != null)
            {
                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);
            }

            return View("~/Views/Admin/Login.cshtml", model);
        }

        public IActionResult LoginContralor(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Contralor;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Contralor/Login.cshtml", model);
        }
        public IActionResult LoginCompara(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginCompara.cshtml", model);

        }
        public IActionResult LoginMerco(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginMerco.cshtml", model);

        }
        [HttpGet]
        public IActionResult LoginEssilorLuxottica(string userName = null, string activationCode = null, string returnUrl = null, string codigoTelefono = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["CodigoMx"] = "MX";
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginEssilorLuxottica.cshtml", model);

        }

        [HttpGet]
        public IActionResult LoginServipag(string userName = null, string activationCode = null, string returnUrl = null)

        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            return View("~/Views/Paciente/LoginServipag.cshtml", model);

        }

        [HttpGet]
        public IActionResult LoginPipol(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginPipol.cshtml", model);
        }
        [HttpGet]
        public IActionResult LoginLosheroesafiliados(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            return View("~/Views/Paciente/LoginLosheroesafiliados.cshtml", model);
        }
        public async Task<IActionResult> ExternalAuth([FromHeader] string auth)
        {
            var integracionNOk = "Json invalido o vacio";
            var log = new LogPlataformaExterna();
            try
            {
                log.DataEncriptada = auth;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(auth))
                {

                    var cadenaJson = DecryptKeyAuth(auth);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);

                    if (string.IsNullOrEmpty(usuario.CodEspecialidad))
                    {
                        usuario.CodEspecialidad = "1";
                    }

                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = "1";
                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;
                    try
                    {
                        if (usuario.Titular.Sexo == null) usuario.Titular.Sexo = "";
                        //if (usuario.Sexo == null) usuario.Carga.Sexo = "";
                        //if (usuario.Sexo == null) usuario.Carga.Sexo = "";
                        log.IdSesionPlataformaExterna = usuario.CD_SESSION_ID;
                        log.JSON = cadenaJson;

                        log.IdCliente = idCliente;

                        var jsonString = JsonConvert.SerializeObject(log);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        //using (var httpClient = new HttpClient())
                        //{
                        //    using (var response = await httpClient.PostAsync(
                        //        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContent))
                        //    {
                        //        var respService = await response.Content.ReadAsStringAsync();
                        //        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                        //    }
                        //}

                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e);
                    }
                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Unauthorized("TOKEN EXPIRADO");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }



                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, ""),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))


                                };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }





                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });
                            }
                            else
                            {
                                return BadRequest(integracionNOk);
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            if (!string.IsNullOrEmpty(usuario.CodEspecialidad))
                            {
                                claims.Add(new Claim("Especialidad", usuario.CodEspecialidad));
                            }







                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();
                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            {
                                carga.AtencionDirecta = false;
                            }
                            else
                            {
                                carga.AtencionDirecta = true;
                            }
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, ""),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });


                            }
                            else
                            {
                                return BadRequest(integracionNOk);
                            }
                        }
                        else
                        {
                            return BadRequest(integracionNOk);
                        }
                    }



                    return Redirect("../Paciente/Home?view=true");




                }
                return BadRequest(integracionNOk);
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                return BadRequest(integracionNOk);
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = auth;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> AuthExternal(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            try
            {
                var host = GetHostValue(HttpContext.Request.Host.Value);
                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptKeyAuth(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);

                    if (string.IsNullOrEmpty(usuario.CodEspecialidad))
                    {
                        usuario.CodEspecialidad = "1";
                    }

                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = "1";


                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;
                    try
                    {
                        if (usuario.Titular.Sexo == null) usuario.Titular.Sexo = "";
                        //if (usuario.Sexo == null) usuario.Carga.Sexo = "";
                        //if (usuario.Sexo == null) usuario.Carga.Sexo = "";
                        log.IdSesionPlataformaExterna = usuario.CD_SESSION_ID;
                        log.JSON = cadenaJson;

                        log.IdCliente = idCliente;

                        var jsonString = JsonConvert.SerializeObject(log);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        using (var httpClient = new HttpClient())
                        {
                            using (var response = await httpClient.PostAsync(
                                _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContent))
                            {
                                var respService = await response.Content.ReadAsStringAsync();
                                var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                            }
                        }


                        Parametros parametro;
                        using (var httpClient = new HttpClient())
                        {
                            using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getCanalAtencion?convenio={usuario.Modalidad}&canal={canal}"))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                parametro = JsonConvert.DeserializeObject<Parametros>(apiResponse);
                            }
                        }
                        if (parametro == null)
                        {
                            accion = "";
                        }
                        else
                        {
                            accion = parametro.Accion;
                        }
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e);
                    }
                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }



                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))


                                };

                                if (!string.IsNullOrEmpty(usuario.CodEspecialidad))
                                {
                                    claims.Add(new Claim("Especialidad", usuario.CodEspecialidad));
                                }

                                //Esto, para permitir ingreso al home, en caso de no ser necesario, se saca.

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));

                                    // Verificar si la persona ya existe en la tabla PersonasEmpresas
                                    int idUser = response.result.user.userId;
                                    int idEmpresa = titular.IdCliente;
                                    var personaEmpresa = await validarPersonasEmpresas(idUser, idEmpresa);

                                    if (personaEmpresa == "")
                                    {
                                        var addPersonaEmpresa = await addPersonaEmpresaZurich(idUser, idEmpresa);
                                    }
                                }



                                await HttpContext.SignInAsync($"PacienteSchemes",
                                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                        new AuthenticationProperties
                                        {
                                            IsPersistent = true,
                                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                        });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            if (!string.IsNullOrEmpty(usuario.CodEspecialidad))
                            {
                                claims.Add(new Claim("Especialidad", usuario.CodEspecialidad));
                            }







                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();
                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            {
                                carga.AtencionDirecta = false;
                            }
                            else
                            {
                                carga.AtencionDirecta = true;
                            }
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));

                                    // Verificar si la persona ya existe en la tabla PersonasEmpresas
                                    int idUser = response.result.user.userId;
                                    int idEmpresa = titular.IdCliente;
                                    var personaEmpresa = await validarPersonasEmpresas(idUser, idEmpresa);

                                    if (personaEmpresa == "")
                                    {
                                        var addPersonaEmpresa = await addPersonaEmpresaZurich(idUser, idEmpresa);
                                    }
                                }

                                if (!string.IsNullOrEmpty(usuario.CodEspecialidad))
                                {
                                    claims.Add(new Claim("Especialidad", usuario.CodEspecialidad));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });


                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (host.Contains("vivetuseguro")) {
                        return Redirect("../Paciente/Home?view=true");
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {

                        RangoHorario model = new RangoHorario();
                        using (var httpClient = new HttpClient())
                        {
                            using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/getListHorasPediatriaConsalud?idEspecialidad={Convert.ToInt32(usuario.CodEspecialidad)}"))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                model = JsonConvert.DeserializeObject<RangoHorario>(apiResponse);
                            }

                        }
                        if (usuario.CodEspecialidad == "4") //4 idEspecialidad pediatria
                        {
                            DateTime HoraActual = DateTime.Now;
                            if (!(DateTime.Now >= model.HoraInicio && DateTime.Now <= model.HoraFin))
                            {
                                return Redirect("../Sin_Horas_FU/");

                            }

                        }

                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        RespModel respuesta = new RespModel();
                        //atencion agenda consalud especialidades.
                        if (Convert.ToInt32(usuario.IdAtencion) != 0)
                        {
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using (var httpClient1 = new HttpClient())
                            {
                                using (var response1 = await httpClient1.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent))
                                {
                                    string apiResponse1 = await response1.Content.ReadAsStringAsync();
                                    respuesta = JsonConvert.DeserializeObject<RespModel>(apiResponse1);
                                }

                            }

                            if (respuesta.status == "NOK")
                            {
                                Logout(Roles.Paciente);
                            }
                            else
                                return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                            //using var httpClient = new HttpClient();


                            //using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            //var apiResponse = response.Content.ReadAsStringAsync().Result;


                        }

                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Index");

                        }


                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }
        public async Task<IActionResult> LoginExterno(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            try
            {


                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);

                    if (string.IsNullOrEmpty(usuario.CodEspecialidad))
                    {
                        usuario.CodEspecialidad = "1";
                    }

                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = "1";

                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;
                    try
                    {

                        log.IdSesionPlataformaExterna = usuario.CD_SESSION_ID;
                        log.JSON = cadenaJson;

                        log.IdCliente = idCliente;

                        var jsonString = JsonConvert.SerializeObject(log);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        using (var httpClient = new HttpClient())
                        {
                            using (var response = await httpClient.PostAsync(
                                _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContent))
                            {
                                var respService = await response.Content.ReadAsStringAsync();
                                var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                            }
                        }


                        Parametros parametro;
                        using (var httpClient = new HttpClient())
                        {
                            using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getCanalAtencion?convenio={usuario.Modalidad}&canal={canal}"))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                parametro = JsonConvert.DeserializeObject<Parametros>(apiResponse);
                            }
                        }
                        if (parametro == null)
                        {
                            accion = "https://clientes.consalud.cl";
                        }
                        else
                        {
                            accion = parametro.Accion;
                        }
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e);
                    }
                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }



                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))


                                };

                                if (!string.IsNullOrEmpty(usuario.CodEspecialidad))
                                {
                                    claims.Add(new Claim("Especialidad", usuario.CodEspecialidad));
                                }





                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            if (!string.IsNullOrEmpty(usuario.CodEspecialidad))
                            {
                                claims.Add(new Claim("Especialidad", usuario.CodEspecialidad));
                            }







                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            {
                                carga.AtencionDirecta = false;
                            }
                            else
                            {
                                carga.AtencionDirecta = true;
                            }
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (!string.IsNullOrEmpty(usuario.CodEspecialidad))
                                {
                                    claims.Add(new Claim("Especialidad", usuario.CodEspecialidad));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });


                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }

                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {

                        RangoHorario model = new RangoHorario();
                        using (var httpClient = new HttpClient())
                        {
                            using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/getListHorasPediatriaConsalud?idEspecialidad={Convert.ToInt32(usuario.CodEspecialidad)}"))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                model = JsonConvert.DeserializeObject<RangoHorario>(apiResponse);
                            }

                        }
                        if (usuario.CodEspecialidad == "4") //4 idEspecialidad pediatria
                        {
                            DateTime HoraActual = DateTime.Now;
                            if (!(DateTime.Now >= model.HoraInicio && DateTime.Now <= model.HoraFin))
                            {
                                return Redirect("../Sin_Horas_FU/");

                            }

                        }

                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        if (Convert.ToInt32(usuario.IdAtencion) != 0)
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                        }

                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Index?externo=true");

                        }


                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> LoginExternoClini(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptKeyClini(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var accion = "";
                    var idCliente = "1";

                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }

                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user-client", httpContent);

                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, Roles.Paciente),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, ""),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });

                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, Roles.Paciente),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;
                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        var jsonString = JsonConvert.SerializeObject(titular);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user-client", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;


                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            var jsonStringCarga = JsonConvert.SerializeObject(carga);
                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user-client", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, Roles.Paciente),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid,""),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }

                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        /*  if (usuario.IdAtencion != "")
                           {
                               using var httpClient = new HttpClient();
                               var jsonString = JsonConvert.SerializeObject("");
                               var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                               using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                               var apiResponse = response.Content.ReadAsStringAsync().Result;

                               return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);

                           }
                           //otros clientes distinto a consalud.
                           else
                           {
                               return Redirect("../Paciente/Home?view=true");

                           }
                        */

                        return Redirect("../Paciente/Home?view=true");
                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> LoginExternoMok(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptMokKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = _config["CLINICAONLINE"];
                    usuario.IdCliente = idCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }



                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "CARDIFSCOTIA";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);


                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });

                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "CARDIFSCOTIA";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}

                        var jsonString = JsonConvert.SerializeObject(titular);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            //{
                            //    carga.AtencionDirecta = false;
                            //}
                            //else
                            //{
                            //    carga.AtencionDirecta = true;
                            //}
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        if (usuario.IdAtencion != "")
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);

                        }
                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Home?view=true");

                        }


                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> LoginExternoPrevencion(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptPrevencionkKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = _config["CAJALOSANDES"];
                    usuario.IdCliente = idCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }



                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "CAJALOSANDES";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);


                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });

                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "CAJALOSANDES";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}

                        var jsonString = JsonConvert.SerializeObject(titular);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            //{
                            //    carga.AtencionDirecta = false;
                            //}
                            //else
                            //{
                            //    carga.AtencionDirecta = true;
                            //}
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        if (usuario.IdAtencion != "")
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);

                        }
                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Home?view=true");

                        }


                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> LoginPeritajeInmv(string Id, string d)
        {

            var log = new LogPlataformaExterna();
            try
            {
                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {
                    var cadenaJson = DecryptKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = "2";

                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }
                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }
                    }
                    else //se loguea la carga
                    {
                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }
                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {
                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            {
                                carga.AtencionDirecta = false;
                            }
                            else
                            {
                                carga.AtencionDirecta = true;
                            }
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)
                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        if (Convert.ToInt32(usuario.IdAtencion) != 0)
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                        }

                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Index?externo=true");
                        }
                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> LoginPeritajeBm(string Id, string d)
        {

            var log = new LogPlataformaExterna();
            try
            {
                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {
                    var cadenaJson = DecryptKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = "410";

                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }
                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }
                    }
                    else //se loguea la carga
                    {
                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }
                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {
                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            {
                                carga.AtencionDirecta = false;
                            }
                            else
                            {
                                carga.AtencionDirecta = true;
                            }
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)
                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        if (Convert.ToInt32(usuario.IdAtencion) != 0)
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                        }

                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Index?externo=true");
                        }
                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }
        public async Task<IActionResult> LoginExternoMasProteccion(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptMasProteccionKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var isPreHome = false;
                    string idCliente = await GetEmpresaFusion(usuario.Titular.Rut);
                    string empresa = "";
                    var uid = 0;
                    //var idCliente = _config["MASPROTECCION"];
                    usuario.IdCliente = idCliente;
                    if (idCliente == "-1")
                        return Redirect("../Error");

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }

                    var username = usuario.Titular.Rut;
                    var host = GetHostValue(HttpContext.Request.Host.Value);
                    /*consultar usuario solo en sitio común, debe ser igual al host de configuración, ya que existe: bo.medical., uoh.medical, 
                     * este host será configurable para que solo entre al if de medical.*/
                    List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                    listaConfig = await UsersClientLogin(username, host);
                    List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

                    EmpresaConfig empresaConfig = new EmpresaConfig();
                    //if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0)) // VALIDA QUE EXISTE EN ALGUNA EMPRESA
                    //    return Json(new { returnUrl, msg = "Inactivo" });
                    //if (rol == Roles.Paciente && !listaConfig[0].Existe) //VALIDA QUE EXISTA EN LA EMPRESA QUE SE ESTÁ LOGGEANDO
                    //    return Json(new { returnUrl, msg = "Inactivo" });


                    var idEmpresaClaims = "0";
                    if (listaConfig.Count == 1)
                    {
                        try
                        {
                            empresaConfig = listaConfig[0];
                            idCliente = empresaConfig.IdCliente.ToString();
                            idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                            isPreHome = empresaConfig.PreHome;

                            if (host.Contains("segurossura.")) { isPreHome = true; }

                            var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                            string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                            RedirectLogin loginEmpresa = new RedirectLogin();

                            loginEmpresa.UserName = username;
                            loginEmpresa.Url = UrlRedirect;
                            loginEmpresa.UserId = uid;
                            loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                            loginEmpresa.PreHome = empresaConfig.PreHome;
                            if (HttpContext.Request.Host.Value.Contains("localhost"))
                                UrlRedirect = "localhost:44363";
                            var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                            string encry = Encrypt(empresaJson);

                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e.Message);
                        }

                    }

                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "CAJALOSANDES";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);


                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim("CodigoTelefono", "CL"),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                                    claims.Add(new Claim("Empresa", empresa));
                                }

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });

                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier,uid.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim("CodigoTelefono", "CL"),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "CAJALOSANDES";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}

                        var jsonString = JsonConvert.SerializeObject(titular);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            //{
                            //    carga.AtencionDirecta = false;
                            //}
                            //else
                            //{
                            //    carga.AtencionDirecta = true;
                            //}
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                uid = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim("CodigoTelefono", "CL"),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                                    claims.Add(new Claim("Empresa", empresa));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    

                    if (isPreHome)
                        return Redirect("/Paciente/PlanSalud");
                   
                    return Redirect("../Paciente/Home?view=true");

                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }
        public async Task<IActionResult> LoginPeritaje(string Id, string d)
        {

            var log = new LogPlataformaExterna();
            try
            {
                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {
                    var cadenaJson = DecryptKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = "148";

                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }

                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            {
                                carga.AtencionDirecta = false;
                            }
                            else
                            {
                                carga.AtencionDirecta = true;
                            }
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        if (Convert.ToInt32(usuario.IdAtencion) != 0)
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                        }

                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Index?externo=true");

                        }


                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> LoginExternoAchs(string Id, string d)
        {

            var log = new LogPlataformaExterna();
            try
            {
                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {
                    var cadenaJson = DecryptKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = _config["CLIENTE-ACHS"];

                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "ACHS")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }

                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }


                        if (usuario.Canal != "ACHS")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            {
                                carga.AtencionDirecta = false;
                            }
                            else
                            {
                                carga.AtencionDirecta = true;
                            }
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        //atencion agenda consalud especialidades.
                        if (Convert.ToInt32(usuario.IdAtencion) != 0)
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                        }

                        //otros clientes distinto a consalud.
                        else
                        {
                            return Redirect("../Paciente/Index?externo=true");

                        }


                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }

        public async Task<IActionResult> LoginExternoTuMundoSeguro(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptMundoSeguroKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = _config["MUNDOSEGURO"];
                    usuario.IdCliente = idCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }



                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "MUNDOSEGURO";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}


                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);


                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });

                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "CAJALOSANDES";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        //{
                        //    titular.AtencionDirecta = false;
                        //}
                        //else
                        //{
                        //    titular.AtencionDirecta = true;
                        //}

                        var jsonString = JsonConvert.SerializeObject(titular);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            //{
                            //    carga.AtencionDirecta = false;
                            //}
                            //else
                            //{
                            //    carga.AtencionDirecta = true;
                            //}
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }

                    return Redirect("../Paciente/Home?view=true");




                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }
        public async Task<IActionResult> LoginExternoSYF(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            var integracionNOk = "Error Json data vacio";
            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptSYF(d);
                    var usuario = JsonConvert.DeserializeObject<MokCO>(cadenaJson);
                    var accion = "";
                    var idCliente = _config["SEGUROYFACIL"];
                    //idCliente = usuario.Titular.Servicio == "1" ? idCliente : "1";//segun el servicio se va a asignar el id cliente: 1:vete - 2. Medicina 24/7 - 3: ambos;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);


                    // validamos que el timestamp no sea mayor a 5 min
                    //TODO: Habilitar para entorno productivo
                    try
                    {
                        DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                        TimeSpan ts = DateTime.Now - time;
                        Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                        if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                        {
                            return Redirect("../Error");
                        }
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e);
                    }



                    // creamos o actualizamos los datos del titular
                    var titular = new IntegracionCreaPersona();

                    titular.Nombre = usuario.Titular.PrimerNombre;

                    titular.Identificador = usuario.Titular.CedulaIdentidad;
                    titular.ApellidoPaterno = usuario.Titular.Apellidos;
                    titular.ApellidoMaterno = string.Empty; // usuario.Titular.Apellidos;
                    titular.Genero = null;
                    titular.FechaNacimiento = "";
                    titular.Telefono = "";
                    titular.Correo = usuario.Titular.Email;
                    titular.CodConvenioB2C = "SEGUROYFACIL";
                    titular.IdCliente = Convert.ToInt32(idCliente);

                    //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                    //{
                    //    titular.AtencionDirecta = false;
                    //}
                    //else
                    //{
                    //    titular.AtencionDirecta = true;
                    //}

                    var jsonString = JsonConvert.SerializeObject(titular);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                    HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                    responseUpload.EnsureSuccessStatusCode();
                    var resp = await responseUpload.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);
                    var integracionOk = "Ingracion Seguro y Facil para titular " + titular.Nombre;
                    integracionNOk = "Error en Json" + titular.Nombre;
                    if (response == null || response.status != 1)
                        //throw new InvalidOperationException("Error al crear titular");
                        return Json(new { integracionNOk });

                    return Json(new { integracionOk });
                    ViewData["ReturnUrl"] = null;
                    var uid = response.result.user
                        .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                    var claims = new List<Claim>
                                    {
                                        new Claim(ClaimTypes.Name, titular.Identificador),
                                        new Claim(ClaimTypes.Role, "Paciente"),
                                        new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                        new Claim(ClaimTypes.Sid, ""),
                                        new Claim(ClaimTypes.PrimarySid, idCliente),
                                        new Claim(ClaimTypes.Spn, accion),
                                        new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                    };

                    if (Convert.ToInt32(response.result.user.userId) > 0)
                    {
                        var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                        string empresa = model.Value.ToString();

                        claims.Add(new Claim("Empresa", empresa.ToString()));
                    }

                    await HttpContext.SignInAsync($"PacienteSchemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });
                    return Redirect("../Paciente/Home?view=true");



                }
                integracionNOk = "Error Json data vacio";
                return Json(new { integracionNOk });
            }
            catch (Exception e)
            {
                integracionNOk = "Error en la estructura Json data";
                return Json(new { integracionNOk });
            }
        }
        public async Task<IActionResult> LoginExternoAdvance(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            var integracionNOk = "Error Json data vacio";
            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptAdvance(d);
                    var usuario = JsonConvert.DeserializeObject<MokCO>(cadenaJson);
                    var accion = "";
                    var idCliente = usuario.TipoPlan;
                    //idCliente = usuario.Titular.Servicio == "1" ? idCliente : "1";//segun el servicio se va a asignar el id cliente: 1:vete - 2. Medicina 24/7 - 3: ambos;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);


                    // validamos que el timestamp no sea mayor a 5 min
                    //TODO: Habilitar para entorno productivo
                    try
                    {
                        DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                        TimeSpan ts = DateTime.Now - time;
                        Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                        if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                        {
                            return Redirect("../Error");
                        }
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e);
                    }



                    // creamos o actualizamos los datos del titular
                    var titular = new IntegracionCreaPersona();

                    titular.Nombre = usuario.Titular.PrimerNombre;

                    titular.Identificador = usuario.Titular.CedulaIdentidad;
                    titular.ApellidoPaterno = usuario.Titular.Apellidos;
                    titular.ApellidoMaterno = string.Empty; // usuario.Titular.Apellidos;
                    titular.Genero = null;
                    titular.FechaNacimiento = "";
                    titular.Telefono = "";
                    titular.Correo = usuario.Titular.Email;
                    titular.CodConvenioB2C = "ADVANCE";
                    titular.IdCliente = Convert.ToInt32(idCliente);

                    //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                    //{
                    //    titular.AtencionDirecta = false;
                    //}
                    //else
                    //{
                    //    titular.AtencionDirecta = true;
                    //}

                    var jsonString = JsonConvert.SerializeObject(titular);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                    HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                    responseUpload.EnsureSuccessStatusCode();
                    var resp = await responseUpload.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);
                    var integracionOk = "Integracion ADVANCE para titular " + titular.Nombre;
                    integracionNOk = "Error en Json" + titular.Nombre;
                    if (response == null || response.status != 1)
                        //throw new InvalidOperationException("Error al crear titular");
                        return Json(new { integracionNOk });

                    //return Json(new { integracionOk });
                    ViewData["ReturnUrl"] = null;
                    var uid = response.result.user
                        .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                    var claims = new List<Claim>
                                    {
                                        new Claim(ClaimTypes.Name, titular.Identificador),
                                        new Claim(ClaimTypes.Role, "Paciente"),
                                        new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                        new Claim(ClaimTypes.Sid, ""),
                                        new Claim(ClaimTypes.PrimarySid, idCliente),
                                        new Claim(ClaimTypes.Spn, accion),
                                        new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                    };

                    if (Convert.ToInt32(response.result.user.userId) > 0)
                    {
                        var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                        string empresa = model.Value.ToString();

                        claims.Add(new Claim("Empresa", empresa.ToString()));
                    }

                    await HttpContext.SignInAsync($"PacienteSchemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });
                    return Redirect("../Paciente/Home?view=true");



                }
                integracionNOk = "Error Json data vacio o clave incorrecta";
                return Json(new { integracionNOk });
            }
            catch (Exception e)
            {
                integracionNOk = "Error en la estructura Json data";
                return Json(new { integracionNOk });
            }
        }

        public async Task<IActionResult> LoginPositivaExterno(string userName, string returnUrl, string rol)
        {
            var log = new LogPlataformaExterna();
            var integracionNOk = "Error Json data vacio";
            ViewData["ReturnUrl"] = returnUrl;
            var valido = true;
            var codigoTelefono = "CL";
            var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
            var isPreHome = false;
            bool procesoFinalizado = false;
            try
            {

                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(userName))
                {

                    var accion = "";
                    var idCliente = _config["POSITIVA"];
                    //idCliente = usuario.Titular.Servicio == "1" ? idCliente : "1";//segun el servicio se va a asignar el id cliente: 1:vete - 2. Medicina 24/7 - 3: ambos;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    // creamos o actualizamos los datos del titular
                    var titular = new IntegracionCreaPersona();

                    titular.Nombre = "";

                    titular.Identificador = userName;
                    titular.ApellidoPaterno = "";
                    titular.ApellidoMaterno = string.Empty; // usuario.Titular.Apellidos;
                    titular.Genero = null;
                    titular.FechaNacimiento = "";
                    titular.Telefono = "";
                    titular.Correo = "";
                    titular.IdCliente = Convert.ToInt32(idCliente);


                    var jsonString = JsonConvert.SerializeObject(titular);
                    var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                    HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                    responseUpload.EnsureSuccessStatusCode();
                    var resp = await responseUpload.Content.ReadAsStringAsync();
                    var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);
                    var integracionOk = "Integracion ADVANCE para titular " + titular.Nombre;
                    integracionNOk = "Error en Json" + titular.Nombre;
                    if (response == null || response.status != 1)
                        //throw new InvalidOperationException("Error al crear titular");
                        return Json(new { integracionNOk });

                    //return Json(new { integracionOk });
                    var host = GetHostValue(HttpContext.Request.Host.Value);
                    /*consultar usuario solo en sitio común, debe ser igual al host de configuración, ya que existe: bo.medical., uoh.medical, 
                     * este host será configurable para que solo entre al if de medical.*/
                    List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                    listaConfig = await UsersClientLogin(userName, host);
                    List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

                    EmpresaConfig empresaConfig = new EmpresaConfig();
                    if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0)) // VALIDA QUE EXISTE EN ALGUNA EMPRESA
                        return Json(new { returnUrl, msg = "Inactivo" });
                    if (rol == Roles.Paciente && !listaConfig[0].Existe) //VALIDA QUE EXISTA EN LA EMPRESA QUE SE ESTÁ LOGGEANDO
                        return Json(new { returnUrl, msg = "Inactivo" });


                    var idEmpresaClaims = "0";
                    if (listaConfig.Count == 1 && rol == Roles.Paciente)
                    {
                        try
                        {
                            empresaConfig = listaConfig[0];
                            idCliente = empresaConfig.IdCliente.ToString();
                            idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                            isPreHome = empresaConfig.PreHome;

                            if (host.Contains("segurossura.")) { isPreHome = true; }

                            var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                            string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                            RedirectLogin loginEmpresa = new RedirectLogin();

                            loginEmpresa.UserName = userName;
                            loginEmpresa.Url = UrlRedirect;
                            loginEmpresa.UserId = response.result.user.userId;
                            loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                            loginEmpresa.PreHome = empresaConfig.PreHome;
                            if (HttpContext.Request.Host.Value.Contains("localhost"))
                                UrlRedirect = "localhost:44363";
                            var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                            string encry = Encrypt(empresaJson);
                            if (!UrlRedirect.Contains("http"))
                                UrlRedirect = "https://" + UrlRedirect;
                            returnUrl = UrlRedirect + "/account/RedirectLogin?u=" + encry;
                            return Json(new { returnUrl });




                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e.Message);
                        }
                        if (codigoTelefono != empresaConfig.CodTelefono)
                            codigoTelefono = empresaConfig.CodTelefono;
                    }


                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userName),
                        new Claim(ClaimTypes.Role, "Paciente"),
                        new Claim(ClaimTypes.NameIdentifier, response.result.user.userId.ToString()),
                        new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador)),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla",idEmpresaClaims.ToString())
                    };
                    Global.token = NewToken(titular.Identificador);


                    claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                    claims.Add(new Claim(ClaimTypes.Spn, accion));

                    var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(response.result.user.userId));
                    string json = JsonConvert.SerializeObject(centroClinico);
                    claims.Add(new Claim(ClaimTypes.System, json));

                    if (Convert.ToInt32(response.result.user.userId) > 0 && rol == "Paciente")
                    {
                        string empresa = ""; // model.Value.ToString();
                        empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                        claims.Add(new Claim("Empresa", empresa));



                    }


                    await HttpContext.SignInAsync($"{rol}Schemes",
                            new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                            new AuthenticationProperties
                            {
                                IsPersistent = true,
                                ExpiresUtc = DateTime.UtcNow.AddDays(1)

                            });
                    //try del Log de uso de servicio
                    LogUso(5, 9, Convert.ToInt32(response.result.user.userId), Convert.ToInt32(idCliente), "Login/userName=" + userName + "&rol=" + rol);

                    if (Url.IsLocalUrl(returnUrl) && !isPreHome)
                    {
                        return Json(new { returnUrl });
                        //return Redirect(returnUrl);
                    }
                    else
                    {
                        if (rol == Roles.Paciente)
                        {
                            new LogPacienteViaje().Evento = "Paciente ingresó a plataforma";
                            new LogPacienteViaje().IdPaciente = Convert.ToInt32(response.result.user.userId);
                            await GrabarLog(new LogPacienteViaje());
                            //returnUrl = "/Paciente/Index?v=true";
                            if (host.Contains("segurossura.")) { listaConfig[0].PreHome = true; }
                            if (listaConfig.Count > 0 && listaConfig[0].PreHome == true)
                                returnUrl = "/Paciente/PlanSalud";
                            else
                                returnUrl = host.Contains("consalud.") ? "/Paciente/ExamenesConsalud" : "/";
                        }
                        else if (rol == Roles.Administrador)
                        {
                            returnUrl = "/Admin/Index";
                        }
                        else if (rol == Roles.Contralor)
                        {
                            returnUrl = "/Contralor";
                        }
                        else if (rol == Roles.Medico)
                        {
                            returnUrl = "/Medico/Index";
                        }
                        return Json(new { returnUrl });
                        //return Redirect(returnUrl);
                    }
                }
                else
                {
                    return Json(new { integracionNOk });
                }

            }
            catch (Exception e)
            {
                return Json(new { integracionNOk });
            }
        }


        public async Task<IActionResult> LoginHlf(string Id, string d)
        {

            var log = new LogPlataformaExterna();
            try
            {
                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {
                    var cadenaJson = DecryptKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = "471";

                    if (usuario.IdCliente != null)
                        idCliente = usuario.IdCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;

                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }
                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                var uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }
                    }
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {
                        if (Convert.ToInt32(usuario.IdAtencion) != 0)
                        {
                            using var httpClient = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject("");
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                            var apiResponse = response.Content.ReadAsStringAsync().Result;

                            return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                        }
                        else
                        {
                            return Redirect("../Paciente/Index?externo=true");
                        }
                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }


        private async Task<string> putAgendarMedicosHoras(Atenciones atencion, int idMedico, int uid)
        {
            try
            {
                var servicesUrl = _config["ServicesUrl"];
                var jsonString = JsonConvert.SerializeObject(atencion);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/agendamientos/agendar/putAgendarMedicosHoras/{idMedico}&{uid}", httpContent);

                responseUpload.EnsureSuccessStatusCode();
                var resp = await responseUpload.Content.ReadAsStringAsync();
                return resp;
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                return "error";
            }

        }

        private async Task<string> confirmarAtencionFU(int idAtencion, int estado)
        {
            try
            {
                var servicesUrl = _config["ServicesUrl"];
                var httpContent = new StringContent(string.Empty);
                HttpResponseMessage responseUpload = await client.PutAsync(servicesUrl + $"/agendamientos/agendar/cambiarEstado/{idAtencion}/{estado}", httpContent);

                responseUpload.EnsureSuccessStatusCode();
                var resp = await responseUpload.Content.ReadAsStringAsync();
                return resp;
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                return "error";
            }

        }

        private async Task<string> agendaryConfirmarAtencion(Atenciones agendar, int uid)
        {


            var validarRestriccion = await ValidacionRestriccionesEspecialidades(uid, (int)agendar.IdCliente, agendar.IdEspecialidadFilaUnica);
            if (validarRestriccion.Item1)
            {
                return $"../SinHorasFUZurich/{agendar.IdEspecialidadFilaUnica}/{uid}";
            }

            var atencion = await validarAtencionFU(agendar);
            if (atencion != null)
            {
                // Si existe, retornar la URL con el id de la atención
                return $"../Ingresar_Sala_FU/{atencion}";
            }

            var strResponse = await putAgendarMedicosHoras(agendar, 0, uid);
            AtencionZurich valida = JsonConvert.DeserializeObject<AtencionZurich>(strResponse);

            var confirmarResponse = await confirmarAtencionFU(valida.infoAtencion.idAtencion, 0);

            if (valida != null)
            {
                var url = $"/Paciente/Agenda_3?idMedicoHora={valida.infoAtencion.idHora}&idMedico={valida.infoAtencion.idMedico}&idBloqueHora={valida.atencionModel.idBloqueHora}&fechaSeleccion={valida.infoAtencion.fecha}&hora={valida.infoAtencion.horaDesdeText}&horario=True&idAtencion={valida.infoAtencion.idAtencion}&m=1&r=1&c=${agendar.IdConvenio}&tipoatencion=I&especialidad={agendar.IdEspecialidad}";
            }
            return $"../Ingresar_Sala_FU/{valida.infoAtencion.idAtencion}";
        }

        private async Task<string> validarAtencionFU(Atenciones agendar)
        {
            var servicesUrl = _config["ServicesUrl"];
            var strEndPointAtenciones = $"{servicesUrl}/agendamientos/agendar/getAtencionByuIDZurich/{agendar.IdPaciente}/{agendar.IdCliente}/{agendar.IdEspecialidadFilaUnica}";
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(strEndPointAtenciones);
                // Comprobar si la solicitud fue exitosa (código de estado 200)
                if (response.IsSuccessStatusCode)
                {
                    // Leer el contenido de la respuesta HTTP como una cadena
                    var content = await response.Content.ReadAsStringAsync();

                    // Devolver el ID de la atención como resultado
                    return content;
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    // La atención no fue encontrada, devolver null
                    return null;
                }
                else
                {
                    // Hubo un error al procesar la solicitud HTTP, lanzar una excepción
                    throw new Exception($"Error al llamar al endpoint {strEndPointAtenciones}. Código de estado HTTP: {response.StatusCode}");
                }
            }
        }

        private async Task<string> validarPersonasEmpresas(int idPaciente, int idEmpresa)
        {
            var servicesUrl = _config["ServicesUrl"];
            var strEndPointAtenciones = $"{servicesUrl}/usuarios/empresa/getPersonaEmpresas/{idPaciente}/{idEmpresa}";
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(strEndPointAtenciones);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();

                    // Devolver el ID de la persona
                    return content;
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    // La empresa para esta persona no fue encontrada, devolver null
                    return null;
                }
                else
                {
                    // Hubo un error al procesar la solicitud HTTP, lanzar una excepción
                    throw new Exception($"Error al llamar al endpoint {strEndPointAtenciones}. Código de estado HTTP: {response.StatusCode}");
                }
            }
        }

        private async Task<bool> addPersonaEmpresaZurich(int userId, int idEmpresa)
        {
            using (var httpClient = new HttpClient())
            {
                try
                {
                    using (var response2 = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/addPersonaEmpresaZurich/{userId}/{idEmpresa}"))
                    {
                        // Revisa si la respuesta es exitosa
                        response2.EnsureSuccessStatusCode();

                        // Obtiene el resultado de la API
                        string apiResponse = await response2.Content.ReadAsStringAsync();

                        // Devuelve true si el resultado es "true", de lo contrario false
                        return apiResponse.ToLower() == "true";
                    }
                }
                catch (Exception ex)
                {
                    // Maneja cualquier excepción lanzada durante la solicitud HTTP
                    SentrySdk.CaptureException(ex);
                    Console.WriteLine($"Ocurrió un error al insertar: {ex.Message}");
                    return false;
                }
            }
        }


        //Validaciones Horas ZURICH

        private async Task<List<Especialidades>> GetEspecialidadInmediataRestriccion(int uid, int idCliente)
        {

            var servicesUrl = _config["ServicesUrl"];
            var strEndPointAtenciones = $"{servicesUrl}/agendamientos/Especialidades/getEspecialidadInmediata/?uid={uid}&idCliente={idCliente}";
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(strEndPointAtenciones);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<Especialidades>>(content);
                }
                else
                {
                    throw new Exception("Error al obtener las especialidades inmediatas.");
                }
            }
        }

        private async Task<Tuple<bool, string>> ValidacionRestriccionesEspecialidades(int uid, int idCliente, int? idEspecialidad)
        {
            Tuple<bool, string> resp = new Tuple<bool, string>(false, "");
            List<Especialidades> listaRestriccion = await GetEspecialidadInmediataRestriccion(uid, idCliente);
            listaRestriccion = listaRestriccion.Where(x => x.Id == idEspecialidad && x.TieneRestriccion == true).Select(x => x).ToList();
            if (listaRestriccion.Count == 1)
            {
                Especialidades especialidad = listaRestriccion.First();
                DateTime horaInicio = especialidad.HoraInicio;
                DateTime horaFin = especialidad.HoraFin;
                DateTime horaActual = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Pacific SA Standard Time"));
                if (horaActual <= horaInicio || horaActual > horaFin)
                {
                    string validacionMensaje = $"Lo sentimos el horario de  {especialidad.Nombre} es de ${horaInicio.ToString("HH:mm")} a {horaFin.ToString("HH:mm")} hrs";
                    resp = new Tuple<bool, string>(true, validacionMensaje);
                }
            }
            else if (listaRestriccion.Count > 1)
            {
                foreach (Especialidades especialidad in listaRestriccion)
                {
                    DateTime horaInicio = especialidad.HoraInicio;
                    DateTime horaFin = especialidad.HoraFin;
                    DateTime horaActual = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Pacific SA Standard Time"));
                    if (horaActual >= horaInicio && horaActual < horaFin)
                    {
                        resp = new Tuple<bool, string>(false, "");
                        break;
                    }
                    else if (horaActual <= horaInicio || horaActual > horaFin)
                    {
                        string mensajeValidacion = $"Lo sentimos el horario de  {especialidad.Nombre} es de ${horaInicio.ToString("HH:mm")} a {horaFin.ToString("HH:mm")} hrs";
                        resp = new Tuple<bool, string>(true, mensajeValidacion);
                    }
                }
            }
            return resp;

        }



        //LOGIN EXTERNO MUNDO ZURICH CUSTOM
        public async Task<IActionResult> LoginZurich(string Id, string d)
        {
            var log = new LogPlataformaExterna();
            int uid = 0;

            try
            {

                log.DataEncriptada = d;
                var atencionDirecta = true;
                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptMundoZurich(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = usuario.IdCliente;
                    usuario.IdCliente = idCliente;

                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    if (usuario.Canal != "PERITAJE")
                    {
                        // validamos que el timestamp no sea mayor a 5 min
                        //TODO: Habilitar para entorno productivo
                        try
                        {
                            DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                            TimeSpan ts = DateTime.Now - time;
                            Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                            if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                            {
                                return Redirect("../Error");
                            }
                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                    }



                    // se loguea el titular
                    if (usuario.Carga == null)
                    {
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "MUNDOZURICH";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.Canal != "PERITAJE")
                        {
                            var jsonString = JsonConvert.SerializeObject(titular);

                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUpload =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                            responseUpload.EnsureSuccessStatusCode();
                            var resp = await responseUpload.Content.ReadAsStringAsync();
                            var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);


                            if (response != null && response.status == 1)
                            {
                                atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                                Console.Write(response);
                                ViewData["ReturnUrl"] = null;
                                uid = response.result.user
                                    .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                                };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));

                                    // Verificar si la persona ya existe en la tabla PersonasEmpresas
                                    int idUser = response.result.user.userId;
                                    int idEmpresa = titular.IdCliente;
                                    var personaEmpresa = await validarPersonasEmpresas(idUser, idEmpresa);

                                    if (personaEmpresa == "")
                                    {
                                        var addPersonaEmpresa = await addPersonaEmpresaZurich(idUser, idEmpresa);
                                    }
                                }

                                await HttpContext.SignInAsync($"PacienteSchemes",
                                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                    new AuthenticationProperties
                                    {
                                        IsPersistent = true,
                                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                    });

                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {

                            var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, titular.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn, accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                            await HttpContext.SignInAsync($"PacienteSchemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                        }

                    }
                    else //se loguea la carga
                    {


                        // creamos o actualizamos los datos del titular
                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = usuario.Titular.Nombres;

                        titular.Identificador = usuario.Titular.Rut;
                        titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                        titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                        titular.Genero = usuario.Titular.Sexo.ToString();
                        titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                        titular.Telefono = usuario.Titular.Telefono;
                        titular.Correo = usuario.Titular.Email;
                        titular.CodConvenio = usuario.Modalidad;
                        titular.CodConvenioB2C = "MUNDOZURICH";
                        if (usuario.IdCliente == null)
                        {
                            titular.IdCliente = 0;
                        }
                        else
                        {
                            titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                        }

                        if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                        {
                            titular.AtencionDirecta = false;
                        }
                        else
                        {
                            titular.AtencionDirecta = true;
                        }

                        var jsonString = JsonConvert.SerializeObject(titular);
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1) // el titular fue creado correctamente
                        {

                            // si el titular se creo correctamente creamos y logueamos a la carga.
                            var carga = new IntegracionCreaPersona();

                            carga.Nombre = usuario.Carga.Nombres;
                            carga.RutTitular = usuario.Titular.Rut;  // le asignamos el rut del titular
                            carga.Identificador = usuario.Carga.Rut;
                            carga.ApellidoPaterno = usuario.Carga.ApellidoPaterno;
                            carga.ApellidoMaterno = usuario.Carga.ApellidoMaterno;
                            carga.Genero = usuario.Carga.Sexo.ToString();
                            carga.FechaNacimiento = usuario.Carga.Fecha_Nacimiento;
                            carga.Telefono = usuario.Carga.Telefono;
                            carga.Correo = usuario.Carga.Email;
                            carga.CodConvenio = usuario.Modalidad;

                            if (usuario.IdCliente == null)
                            {
                                carga.IdCliente = 0;
                            }
                            else
                            {
                                carga.IdCliente = Convert.ToInt32(usuario.IdCliente);
                            }

                            //if (usuario.IdAtencion != null && Convert.ToInt32(usuario.IdAtencion) > 0)
                            //{
                            //    carga.AtencionDirecta = false;
                            //}
                            //else
                            //{
                            //    carga.AtencionDirecta = true;
                            //}
                            var jsonStringCarga = JsonConvert.SerializeObject(carga);

                            var httpContentCarga = new StringContent(jsonStringCarga, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseUploadCarga = await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user", httpContentCarga);
                            responseUploadCarga.EnsureSuccessStatusCode();
                            var respCarga = await responseUploadCarga.Content.ReadAsStringAsync();
                            var responseCarga = JsonConvert.DeserializeObject<ResultServiceNewUser>(respCarga);

                            if (responseCarga != null && responseCarga.status == 1)
                            {
                                atencionDirecta = responseCarga.result.user.AtencionDirecta;
                                Console.Write(responseCarga);
                                ViewData["ReturnUrl"] = null;
                                var uidCarga = responseCarga.result.user.userId;// NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, carga.Identificador),
                                new Claim(ClaimTypes.Role, "Paciente"),
                                new Claim(ClaimTypes.NameIdentifier, uidCarga.ToString()),
                                new Claim(ClaimTypes.Sid, usuario.CD_SESSION_ID.ToString()),
                                new Claim(ClaimTypes.PrimarySid, idCliente),
                                new Claim(ClaimTypes.Spn,accion),
                                new Claim(ClaimTypes.Authentication, NewToken(titular.Identificador))
                            };

                                if (Convert.ToInt32(response.result.user.userId) > 0)
                                {
                                    var model = await GetUsuarioEmpresa(Convert.ToInt32(idCliente));
                                    string empresa = model.Value.ToString();

                                    claims.Add(new Claim("Empresa", empresa.ToString()));
                                }


                                await HttpContext.SignInAsync($"PacienteSchemes", new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")), new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });
                            }
                            else
                            {
                                return Redirect("../Error");
                            }
                        }
                        else
                        {
                            return Redirect("../Error");
                        }
                    }

                    //Inicio validaciones agendamiento fila unica

                    int idBloque = 596;
                    int idMedicoHora = 189086;
                    string sessionPlataforma = "MEDISMART";

                    Atenciones agendar = new Atenciones
                    {
                        Id = 0,
                        IdBloqueHora = idBloque,
                        IdPaciente = uid,
                        IdMedicoHora = idMedicoHora,
                        Estado = "I",
                        IdCliente = int.Parse(idCliente),
                        IdEspecialidadFilaUnica = 1, //Medicina General
                        IdSesionPlataformaExterna = sessionPlataforma
                    };

                    string redirect = "";
                    switch (usuario.Modalidad)
                    {
                        case "TI":
                            redirect = await agendaryConfirmarAtencion(agendar, uid);
                            return Redirect(redirect);

                        case "ONI":
                            agendar.IdEspecialidadFilaUnica = 54; //Nutrición
                            redirect = await agendaryConfirmarAtencion(agendar, uid);
                            return Redirect(redirect);

                        case "OSI":
                            agendar.IdEspecialidadFilaUnica = 47; //Psicología
                            redirect = await agendaryConfirmarAtencion(agendar, uid);
                            return Redirect(redirect);

                        case "TEA":
                            return Redirect("../Paciente/Agendar");

                        case "EP":
                            return Redirect("../ExamenesPreventivos/Index");

                        case "PTA":
                            return Redirect("../Paciente/Agendar?tipoEspecialidad=PersonalTrainer");

                        case "PA":
                            return Redirect("../Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=Pilates");

                        case "YA":
                            return Redirect("../Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=Yoga");

                        case "MA":
                            return Redirect("../Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=Mindfulness");

                        case "VA":
                            return Redirect("../Paciente/Agendar?tipo=suscripcion&tipoEspecialidad=Veterinaria");

                        case "PE":
                            return Redirect("../Paciente/Configuracion");
                        case "HO":
                            return Redirect("/");
                        default:
                            //atencion agenda consalud especialidades.
                            if (Convert.ToInt32(usuario.IdAtencion) != 0)
                            {
                                using var httpClient = new HttpClient();
                                var jsonString = JsonConvert.SerializeObject("");
                                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/agendamientos/atenciones/updateClienteExterno?idAtencion={usuario.IdAtencion}&idCliente={usuario.IdCliente}&idSesion={usuario.CD_SESSION_ID}", httpContent);
                                var apiResponse = response.Content.ReadAsStringAsync().Result;

                                return Redirect("../Atencion_SalaEspera/" + usuario.IdAtencion);
                            }
                            else
                            {
                                return Redirect("/");
                            }

                    }
                     
                    if (atencionDirecta && Convert.ToInt32(usuario.IdAtencion) == 0)
                    {
                        return Redirect("../Ingresar_Sala_FU/0");
                    }
                    else
                    {

                        //otros clientes distinto a consalud.

                        return Redirect("../Paciente/HistorialCustom");




                    }
                }
                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }
        //Login redireccionamiento a sitios propios desde medical.medismart.live
        public async Task<IActionResult> RedirectLogin(string u)
        {
            try
            {
                if (!String.IsNullOrEmpty(u))
                {
                    var cadenaJson = DecryptKey(u);
                    var usuario = JsonConvert.DeserializeObject<RedirectLogin>(cadenaJson);
                    var accion = "";
                    var idCliente = usuario.IdCliente;
                    List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                    var host = GetHostValue(HttpContext.Request.Host.Value);
                    listaConfig = await UsersClientLogin(usuario.UserName, host);
                    var codigoTelefono = "CL";

                    EmpresaConfig empresaConfigRes = await GetEmpresaConfig(Convert.ToInt32(idCliente));
                    if (listaConfig != null && !listaConfig[0].PreHome)
                        empresaConfigRes.PreHome = false;
                    string empresa = JsonConvert.SerializeObject(empresaConfigRes).ToString();
                    codigoTelefono = empresaConfigRes.CodTelefono ?? "CL";
                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    // validamos que el timestamp no sea mayor a 5 min
                    //TODO: Habilitar para entorno productivo
                    try
                    {
                        DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                        TimeSpan ts = DateTime.Now - time;
                        Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                        if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                        {
                            return Redirect("../Error");
                        }
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e);
                    }
                    ViewData["ReturnUrl"] = null;
                    var uid = usuario.UserId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                    var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, usuario.UserName),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uid.ToString()),
                                    new Claim(ClaimTypes.PrimarySid, idCliente.ToString()),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim("CodigoTelefono", codigoTelefono),
                                    new Claim(ClaimTypes.Authentication, NewToken(usuario.UserName)),
                                    new Claim("Empresa", empresa)

                                };

                    await HttpContext.SignInAsync($"PacienteSchemes",
                                   new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                   new AuthenticationProperties
                                   {
                                       IsPersistent = true,
                                       ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                   });


                    if (usuario.PreHome == true)
                        return Redirect("/Paciente/PlanSalud");

                    return Redirect("../");




                }
                else
                {
                    return Redirect("../Error");
                }
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                Console.WriteLine("redirect" + e.Message);
                return Redirect("../Error");
            }
        }
        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }
        public string DecryptKey(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("88dkE#$Rfg32eNN?l7"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                    Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
        }
        public string DecryptKeyAuth(string cadenaEncriptada)
        {
            try
            {
                var host = GetHostValue(HttpContext.Request.Host.Value);
                var claveDesencriptacionTask = GetDecryptionKeyFromEmpresaGlobal(host);
                var claveDesencriptacion = claveDesencriptacionTask.Result;
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(claveDesencriptacion.ToString()));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                    Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
        }
        public string DecryptKeyClini(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("99dkE#$Rfg32eNN?l7"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                    Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
        }
        public string DecryptMokKey(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("99dkE#$Rfg32eNN?l7"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                   Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
            // string json =
            //  @"{'Titular':{'Rut':'15439403-6','Nombres':'HECTOR GREGORIO ALBERTO','ApellidoPaterno':'ROMERO','ApellidoMaterno':'SILVA','Sexo':'M','Fecha_Nacimiento':'09-02-1949','Telefono':'992318506','Email':'hga.romero @gmail.com'},'Carga':null,'Timestamp':1637764981,'Modalidad':'agendable','CD_SESSION_ID':'D18D552C265724DAE054B49691350955','Canal':'ecosistema','IdAtencion':0,'IdCliente':'234'}";

        }

        public string DecryptMasProteccionKey(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("55dkE#$Xfg23eMN?l8"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                   Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
            // string json =
            //  @"{'Titular':{'Rut':'15439403-6','Nombres':'HECTOR GREGORIO ALBERTO','ApellidoPaterno':'ROMERO','ApellidoMaterno':'SILVA','Sexo':'M','Fecha_Nacimiento':'09-02-1949','Telefono':'992318506','Email':'hga.romero @gmail.com'},'Carga':null,'Timestamp':1637764981,'Modalidad':'agendable','CD_SESSION_ID':'D18D552C265724DAE054B49691350955','Canal':'ecosistema','IdAtencion':0,'IdCliente':'234'}";

        }
        public string DecryptMundoSeguroKey(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("66dvE&$kfX23eBN?n3"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                   Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
            // string json =
            //  @"{'Titular':{'Rut':'15439403-6','Nombres':'HECTOR GREGORIO ALBERTO','ApellidoPaterno':'ROMERO','ApellidoMaterno':'SILVA','Sexo':'M','Fecha_Nacimiento':'09-02-1949','Telefono':'992318506','Email':'hga.romero @gmail.com'},'Carga':null,'Timestamp':1637764981,'Modalidad':'agendable','CD_SESSION_ID':'D18D552C265724DAE054B49691350955','Canal':'ecosistema','IdAtencion':0,'IdCliente':'234'}";

        }

        public string DecryptSYF(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("84dkl#$Rax32eKE?l6"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                   Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }


        }

        public string DecryptAdvance(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("e5adkl*#aax3eKE?d2"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                   Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }


        }
        public string DecryptPrevencionkKey(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("34hjE#$fRg12ejjg44"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                   Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
            // string json =
            //  @"{'Titular':{'Rut':'15439403-6','Nombres':'HECTOR GREGORIO ALBERTO','ApellidoPaterno':'ROMERO','ApellidoMaterno':'SILVA','Sexo':'M','Fecha_Nacimiento':'09-02-1949','Telefono':'992318506','Email':'hga.romero @gmail.com'},'Carga':null,'Timestamp':1637764981,'Modalidad':'agendable','CD_SESSION_ID':'D18D552C265724DAE054B49691350955','Canal':'ecosistema','IdAtencion':0,'IdCliente':'234'}";

        }
        public string DecryptMundoZurich(string cadenaEncriptada)
        {
            try
            {
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(cadenaEncriptada);
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("EG4LiEItd3XeJW3fmVKhGCGUbTwoC2nj"));
                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tdes.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0,
                   Array_a_Descifrar.Length);
                tdes.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return ex.Message;
            }
            // string json =
            //  @"{'Titular':{'Rut':'15439403-6','Nombres':'HECTOR GREGORIO ALBERTO','ApellidoPaterno':'ROMERO','ApellidoMaterno':'SILVA','Sexo':'M','Fecha_Nacimiento':'09-02-1949','Telefono':'992318506','Email':'hga.romero @gmail.com'},'Carga':null,'Timestamp':1637764981,'Modalidad':'agendable','CD_SESSION_ID':'D18D552C265724DAE054B49691350955','Canal':'ecosistema','IdAtencion':0,'IdCliente':'234'}";

        }
        public IActionResult Ingresar(string userName = null, string activationCode = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {

                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }
            var host = GetHostValue(HttpContext.Request.Host.Value);
            //if (host.Contains("bo."))
            //    return View("~/Views/Paciente/LoginBo.cshtml", model);
            //else if (host.Contains("inmv."))
            //    return View("~/Views/Paciente/LoginINMV.cshtml", model);
            //else
            return View("Ingresar", model);
        }

        public async Task<IActionResult> LoginPaciente(string userName = null, string activationCode = null, string credencial = null, string tipo = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            returnUrl ??= "/";
            var host = GetHostValue(HttpContext.Request.Host.Value);
            if (returnUrl.Contains("AgendarInvitado") && (host.Contains("medical.") || host.Contains("clini.")))
            {
                return await Guest(Roles.PacienteInvitado, null, returnUrl);
            }
            else if (returnUrl != null && returnUrl.Contains("/PacienteInvitado/Agenda_Invitado_2?") && host.Contains("medical."))
            {
                await Guest(Roles.PacienteInvitado, null, null);
                return Redirect(returnUrl);

            }

            LoginAutoViewModel modelAuto = new LoginAutoViewModel();
            if (credencial != null)
            {
                modelAuto.Credencial = credencial;
                modelAuto.Tipo = tipo;

            }

            LoginViewModel model = new LoginViewModel();
            model.rol = Roles.Paciente;
            if (userName != null)
            {
                model.Username = userName;
                model.ActivationCode = new Guid(activationCode);

            }

            ViewBag.HostURL = host;


            if (host.Contains("bo."))
                return View("~/Views/Account/Ingresar.cshtml", model);
            else if (host.Contains("mx.medical"))
                return View("~/Views/Paciente/LoginMx.cshtml", model);
            else if (host.Contains("didi.wedoctorsmx."))
                return View("~/Views/Paciente/LoginDidi.cshtml", model);
            else if (host.Contains("sunglass.wedoctorsmx."))
                return Redirect("https://essilorluxottica.wedoctorsmx.mx");
            else if (host.Contains("glory.wedoctorsmx."))
                return View("~/Views/Paciente/LoginGlory.cshtml", model);
            else if (host.Contains("tiendared.wedoctorsmx."))
                return View("~/Views/Paciente/LoginTiendaRed.cshtml", model);
            else if (host.Contains("cardif.wedoctorsmx."))
                return View("~/Views/Paciente/LoginCardifMX.cshtml", model);
            else if (host.Contains("crehana.wedoctorsmx."))
                return View("~/Views/Paciente/LoginCrehanaMX.cshtml", model);
            else if (host.Contains("conplan.wedoctorsmx."))
                return View("~/Views/Paciente/LoginConplan.cshtml", model);
            else if (host.Contains("youzen.wedoctorsmx."))
                return View("~/Views/Paciente/LoginYouZen.cshtml", model);
            else if (host.Contains("salud.wedoctorsmx."))
                return View("~/Views/Paciente/LoginWedoctors.cshtml", model);
            else if (host.Contains("dimex.wedoctorsmx.") || host.Contains("expedicionmasters.wedoctorsmx."))
                return View("~/Views/Paciente/LoginDimex.cshtml", model);
            else if (host.Contains("inmv."))
                return View("~/Views/Paciente/LoginINMV.cshtml", model);
            else if (host.Contains("doctoronline."))
                return View("~/Views/Paciente/LoginColmena.cshtml", model);
            else if (host.Contains("uoh."))
                return View("~/Views/Paciente/LoginUoh.cshtml", model);
            else if (host.Contains("vinilit."))
                return View("~/Views/Paciente/LoginVinilit.cshtml", model);
            else if (host.Contains("coopeuch.") || host.Contains("saludproteccion."))
                return View("~/Views/Paciente/LoginCoopeuch.cshtml", model);
            else if (host.Contains("vidacamara."))
                return View("~/Views/Paciente/LoginVidaCamara.cshtml", model);
            else if (host.Contains("claro."))
                return View("~/Views/Paciente/LoginClaro.cshtml", model);
            else if (host.Contains("happlabs."))
                return View("~/Views/Paciente/LoginHapplabs.cshtml", model);
            else if (host.Contains("clinicamundoscotia."))
                return View("~/Views/Paciente/LoginScotia.cshtml", model);
            else if (host.Contains("vidasecurity.bhp."))
                return View("~/Views/Paciente/LoginSecurityBhp.cshtml", model);
            else if (host.Contains("vidasecurity."))
                return View("~/Views/Paciente/LoginVidaSecurity.cshtml", model);
            else if (host.Contains("micuidado."))
                return View("~/Views/Paciente/LoginScotiabank.cshtml", model);
            else if (host.Contains("unabactiva.") || host.Contains("activa.unab."))
                return View("~/Views/Paciente/LoginUnab.cshtml", model);
            else if (host.Contains("oaxacasalud."))
                return View("~/Views/Paciente/LoginOaxaca.cshtml", model);
            else if (host.Contains("prevenciononcologica."))
                return View("~/Views/Paciente/LoginCaja.cshtml", model);
            else if (host.Contains("rappi."))
                return View("~/Views/Paciente/LoginRappi.cshtml", model);
            else if (host.Contains("aecsa."))
                return View("~/Views/Paciente/LoginAecsa.cshtml", model);
            else if (host.Contains("nestle."))
                return View("~/Views/Paciente/LoginNestle.cshtml", model);
            else if (host.Contains("afc."))
                return View("~/Views/Paciente/LoginAFC.cshtml", model);
            else if (host.Contains("gallagher."))
                return View("~/Views/Paciente/LoginGallagher.cshtml", model);
            else if (host.Contains("ajg.medismart"))
                return View("~/Views/Paciente/LoginAJG.cshtml", model);
            else if (host.Contains("daviplata."))
                return View("~/Views/Paciente/LoginDaviplata.cshtml", model);
            else if (host.Contains("camanchaca."))
                return View("~/Views/Paciente/LoginCamanchaca.cshtml", model);
            else if (host.Contains("demo."))
                return View("~/Views/Account/Ingresar.cshtml", model);
            else if (host.Contains("bonnahealth."))
                return View("~/Views/Paciente/LoginBonnahealth.cshtml", model);
            else if (host.Contains("americadigital."))
                return View("~/Views/Paciente/LoginAmerica.cshtml", model);
            else if (host.Contains("bicevida.") || host.Contains("bicevidapersonas."))
                return View("~/Views/Paciente/LoginBicevida.cshtml", model);
            else if (host.Contains("fletcher."))
                return View("~/Views/Paciente/LoginFletcher.cshtml", model);
            else if (host.Contains("achs."))
                return View("~/Views/Paciente/LoginAchs.cshtml", model);
            else if (host.Contains("bancounion."))
                return View("~/Views/Paciente/LoginBancoUnion.cshtml", model);
            else if (host.Contains("grupodefensa."))
                return View("~/Views/Paciente/LoginGrupoDefensa.cshtml", model);
            else if (host.Contains("aquachile."))
                return View("~/Views/Paciente/LoginAqua.cshtml", model);
            else if (host.Contains("simpleeregalariza."))
                return View("~/Views/Paciente/LoginSimpleeregalariza.cshtml", model);
            else if (host.Contains("simpleecl."))
                return View("~/Views/Paciente/LoginSimplee.cshtml", model);
            else if (host.Contains("simpleemx."))
                return View("~/Views/Paciente/LoginSimpleeMX.cshtml", model);
            else if (host.Contains("consalud."))
                return View("~/Views/Paciente/LoginConsalud.cshtml", model);
            else if (host.Contains("zurich."))
                return View("~/Views/Paciente/LoginZurich.cshtml", model);
            else if (host.Contains("masproteccionsalud"))
                return View("~/Views/Paciente/LoginClinicaCaja.cshtml", model);
            else if (host.Contains("implementos."))
                return View("~/Views/Paciente/LoginImplementos.cshtml", model);
            else if (host.Contains("mienergy."))
                return View("~/Views/Paciente/LoginMiEnergy.cshtml", model);
            else if (host.Contains("clini."))
                return View("~/Views/Paciente/LoginClini.cshtml", model);
            else if (host.Contains("prueba."))
                return View("~/Views/Paciente/LoginPrueba.cshtml", model);
            else if (host.Contains("emergencias."))
                return View("~/Views/Paciente/LoginPromocional.cshtml", model);
            else if (host.Contains("sekure."))
                return View("~/Views/Paciente/LoginSekure.cshtml", model);
            else if (host.Contains("cermaq."))
                return View("~/Views/Paciente/LoginCermaq.cshtml", model);
            else if (host.Contains("falp."))
                return View("~/Views/Paciente/LoginFalp.cshtml", model);
            else if (host.Contains("bice."))
                return View("~/Views/Paciente/LoginBice.cshtml", model);
            else if (host.Contains("ccu."))
                return View("~/Views/Paciente/LoginCCU.cshtml", model);
            else if (host.Contains("msc."))
                return View("~/Views/Paciente/LoginMSC.cshtml", model);
            else if (host.Contains("andessalud."))
                return View("~/Views/Paciente/LoginAndesSalud.cshtml", model);
            else if (host.Contains("healthatom.medismart"))
                return View("~/Views/Paciente/LoginHealthAtom.cshtml", model);
            else if (host.Contains("healthatom.wedoctorsmx"))
                return View("~/Views/Paciente/LoginHealthAtomMX.cshtml", model);
            else if (host.Contains("loreal."))
                return View("~/Views/Paciente/LoginLoreal.cshtml", model);
            else if (host.Contains("buk.wedoctorsmx"))
                return View("~/Views/Paciente/LoginBukMX.cshtml", model);
            else if (host.Contains("buk."))
                return View("~/Views/Paciente/LoginBuk.cshtml", model);
            else if (host.Contains("bcf-lapolar."))
                return View("~/Views/Paciente/LoginLaPolar.cshtml", model);
            else if (host.Contains("bcf-turbus."))
                return View("~/Views/Paciente/LoginTurbus.cshtml", model);
            else if (host.Contains("entel."))
                return View("~/Views/Paciente/LoginBiceEntel.cshtml", model);
            else if (host.Contains("betterfly.wedoctorsmx."))
                return View("~/Views/Paciente/LoginBetterflyMx.cshtml", model);
            else if (host.Contains("betterfly."))
                return View("~/Views/Paciente/LoginBetterflyChile.cshtml", model);
            else if (host.Contains("lider."))
                return View("~/Views/Paciente/LoginLider.cshtml", model);
            else if (host.Contains("abcdin."))
                return View("~/Views/Paciente/LoginABC.cshtml", model);
            else if (host.Contains("dodo."))
                return View("~/Views/Paciente/LoginDODO.cshtml", model);
            else if (host.Contains("onassist."))
                return View("~/Views/Paciente/LoginOnAssist.cshtml", model);
            else if (host.Contains("help."))
                return View("~/Views/Paciente/LoginHelp.cshtml", model);
            else if (host.Contains("laaraucana."))
                return View("~/Views/Paciente/LoginLaaraucana.cshtml", model);
            else if (host.Contains("segurossura."))
                return View("~/Views/Paciente/LoginSegurossura.cshtml", model);
            else if (host.Contains("telemed."))
                return View("~/Views/Paciente/LoginTelemed.cshtml", model);
            else if (host.Contains("multix."))
                return View("~/Views/Paciente/LoginMultix.cshtml", model);
            else if (host.Contains("tratame."))
                return View("~/Views/Paciente/LoginTratame.cshtml", model);
            else if (host.Contains("gnb-liberty."))
                return View("~/Views/Paciente/LoginGnbLiberty.cshtml", model);
            else if (host.Contains("bondup."))
                return View("~/Views/Paciente/LoginBondup.cshtml", model);
            else if (host.Contains("oxiquim."))
                return View("~/Views/Paciente/LoginOxiquim.cshtml", model);
            else if (host.Contains("quipusalud."))
                return View("~/Views/Paciente/LoginOxiquimComunidades.cshtml", model);
            else if (host.Contains("foncencosud."))
                return View("~/Views/Paciente/LoginFoncencosud.cshtml", model);
            else if (host.Contains("financiar."))
                return View("~/Views/Paciente/LoginFinanciar.cshtml", model);
            else if (host.Contains("tuya."))
                return View("~/Views/Paciente/LoginTuya.cshtml", model);
            else if (host.Contains("ludsa."))
                return View("~/Views/Paciente/LoginLudsa.cshtml", model);
            else if (host.Contains("soi."))
                return View("~/Views/Paciente/LoginSoi.cshtml", model);
            else if (host.Contains("wtw."))
                return View("~/Views/Paciente/LoginWTW.cshtml", model);
            else if (host.Contains("comercialco."))
                return View("~/Views/Paciente/LoginComercialCO.cshtml", model);
            else if (host.Contains("pepsico.medismart."))
                return View("~/Views/Paciente/LoginPepsicoCo.cshtml", model);
            else if (host.Contains("vivatucredito."))
                return View("~/Views/Paciente/LoginVivaHome.cshtml", model);
            else if (host.Contains("azteca."))
                return View("~/Views/Paciente/LoginAzteca.cshtml", model);
            else if (host.Contains("metlife."))
                return View("~/Views/Paciente/LoginMetlife.cshtml", model);
            else if (host.Contains("positiva."))
                return View("~/Views/Paciente/LoginPositivaAuto.cshtml", modelAuto);
             else if (host.Contains("falabella."))
                return View("~/Views/Paciente/LoginFalabella.cshtml", model);
            else if (host.Contains("crehana.medismart."))
                return View("~/Views/Paciente/LoginCrehana.cshtml", model);
            else if (host.Contains("prestasalud."))
                return View("~/Views/Paciente/LoginPrestaSalud.cshtml", model);
            else if (host.Contains("naucare."))
                return View("~/Views/Paciente/LoginNaucare.cshtml", model);
            else if (host.Contains("ruah."))
                return View("~/Views/Paciente/LoginRuah.cshtml", model);
            else if (host.Contains("masterdescuentos."))
                return View("~/Views/Paciente/LoginMasterDescuentos.cshtml", model);
            else if (host.Contains("advance."))
                return View("~/Views/Paciente/LoginAdvance.cshtml", model);
            else if (host.Contains("glory.medismart."))
                return View("~/Views/Paciente/LoginGloryCo.cshtml", model);
            else if (host.Contains("credipress."))
                return View("~/Views/Paciente/LoginCredipress.cshtml", model);
            else if (host.Contains("presente."))
                return View("~/Views/Paciente/LoginPresente.cshtml", model);
            else if (host.Contains("alliados."))
                return View("~/Views/Paciente/LoginAlliados.cshtml", model);
            else if (host.Contains("siigo."))
                return View("~/Views/Paciente/LoginSiigo.cshtml", model);
            else if (host.Contains("solidaria."))
                return View("~/Views/Paciente/LoginSolidaria.cshtml", model);
            else if (host.Contains("salmonesaustral."))
                return View("~/Views/Paciente/LoginSalmonesAustral.cshtml", model);
            else if (host.Contains("cenco."))
                return View("~/Views/Paciente/LoginCenco.cshtml", model);
            else if (host.Contains("essilorluxottica."))
                return View("~/Views/Paciente/LoginEssilorLuxottica.cshtml", model);
            else if (host.Contains("luxottica."))
                return View("~/Views/Paciente/LoginLuxottica.cshtml", model);
            else if (host.Contains("clientesbci."))
                return View("~/Views/Paciente/LoginClientesBci.cshtml", model);
            else if (host.Contains("cns."))
                return View("~/Views/Paciente/LoginCns.cshtml", model);
            else if (host.Contains("bancodebogota."))
                return View("~/Views/Paciente/LoginBancodebogota.cshtml", model);
            else if (host.Contains("saludtumundoseguro."))
                return View("~/Views/Paciente/LoginMundoSeguro.cshtml", model);
            else if (host.Contains("seguroyfacil."))
                return View("~/Views/Paciente/LoginSeguroyFacil.cshtml", model);
            else if (host.Contains("comparaonline."))
                return View("~/Views/Paciente/LoginCompara.cshtml", model);
            else if (host.Contains("grupomerco."))
                return View("~/Views/Paciente/LoginMerco.cshtml", model);
            else if (host.Contains("mexicanadebecas."))
                return View("~/Views/Paciente/LoginPalig.cshtml", model);
            else if (host.Contains("bcf-corona."))
                return View("~/Views/Paciente/LoginCorona.cshtml", model);
            else if (host.Contains("pepsico.docwell."))
                return View("~/Views/Paciente/LoginPepsico.cshtml", model);
            else if (host.Contains("medlog.medismart."))
                return View("~/Views/Paciente/LoginMedlog.cshtml", model);
            else if (host.Contains("luft.medismart"))
                return View("~/Views/Paciente/LoginLuft.cshtml", model);
            else if (host.Contains("suraasset.medismart"))
                return View("~/Views/Paciente/LoginSuraColaboradores.cshtml", model);
            else if (host.Contains("maserco.medismart"))
                return View("~/Views/Paciente/LoginMaserco.cshtml", model);
            else if (host.Contains("gestamineria.medismart"))
                return View("~/Views/Paciente/LoginGesta.cshtml", model);
            else if (host.Contains("calma.medismart"))
                return View("~/Views/Paciente/LoginCalma.cshtml", model);
            else if (host.Contains("bienestar.medismart"))
                return View("~/Views/Paciente/LoginBancoW.cshtml", model);
            else if (host.Contains("miahealth.medismart"))
                return View("~/Views/Paciente/LoginMiaHealth.cshtml", model);
            else if (host.Contains("segurosmundial.medismart"))
                return View("~/Views/Paciente/LoginSegurosMundial.cshtml", model);
            else if (host.Contains("sbins.medismart"))
                return View("~/Views/Paciente/LoginSouthbridge.cshtml", model);
            else if (host.Contains("salud.docwell"))
                return View("~/Views/Paciente/LoginSaludDocwell.cshtml", model);
            else if (host.Contains("beinsure.wedoctorsmx"))
                return View("~/Views/Paciente/LoginBeInsure.cshtml", model);
            else if (host.Contains("servipag.medismart"))
                return View("~/Views/Paciente/LoginServipag.cshtml", model);
            else if (host.Contains("pipol."))
                return View("~/Views/Paciente/LoginPipol.cshtml", model);
            else if (host.Contains("losheroesafiliados."))
                return View("~/Views/Paciente/LoginLosheroesafiliados.cshtml", model);
            else
                return View("~/Views/Account/Ingresar.cshtml", model);
        }
        private async Task<SimpleUserModel> ValidateLoginAsync(string userName, string password, string rol)
        {

            SimpleUserModel uid = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/validateLogin?userName={userName}&password={password}&rol={rol}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    uid = JsonConvert.DeserializeObject<SimpleUserModel>(apiResponse);
                }
            }

            return uid;
        }
        

        public IActionResult SamlXMLMetlife()
        {
            var doc = new XmlDocument();

            // EntityDescriptor
            var entityDescriptor = doc.CreateElement("md", "EntityDescriptor", "urn:oasis:names:tc:SAML:2.0:metadata");
            entityDescriptor.SetAttribute("entityID", _config["Saml2_Metlife:EntityId"]);

            var spDescriptor = doc.CreateElement("md", "SPSSODescriptor", "urn:oasis:names:tc:SAML:2.0:metadata");
            spDescriptor.SetAttribute("protocolSupportEnumeration", "urn:oasis:names:tc:SAML:2.0:protocol");

            // Agregar la URL de retorno (AssertionConsumerService)
            var assertionConsumerService = doc.CreateElement("md", "AssertionConsumerService", "urn:oasis:names:tc:SAML:2.0:metadata");
            assertionConsumerService.SetAttribute("Binding", "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST");
            assertionConsumerService.SetAttribute("Location", _config["Saml2_Metlife:ReturnUrl"]);
            assertionConsumerService.SetAttribute("index", "1");

            spDescriptor.AppendChild(assertionConsumerService);

            // Agregar SPSSODescriptor a EntityDescriptor
            entityDescriptor.AppendChild(spDescriptor);
            doc.AppendChild(entityDescriptor);

            // Convertir el documento XML a una cadena
            var xmlString = string.Empty;
            using (var stringWriter = new StringWriter())
            {
                using (var xmlTextWriter = XmlWriter.Create(stringWriter))
                {
                    doc.WriteTo(xmlTextWriter);
                    xmlTextWriter.Flush();
                    xmlString = stringWriter.GetStringBuilder().ToString();
                }
            }

            // Devolver los metadatos como XML
            Response.ContentType = "application/xml";
            return Content(xmlString, "text/xml");
        }

        public async Task<IActionResult> Saml_Acs(string samlResponse)
        {
            var samlXml = Encoding.UTF8.GetString(Convert.FromBase64String(samlResponse));

            var samlDocument = XDocument.Parse(samlXml);
            XNamespace ns = "urn:oasis:names:tc:SAML:2.0:assertion";
            var assertions = samlDocument.Descendants(ns + "Assertion");
            var claims = new List<Claim>();

            foreach (var assertion in assertions)
            {
                var subject = assertion.Element(ns + "Subject");
                var nameId = subject?.Element(ns + "NameID")?.Value;

                if (!string.IsNullOrEmpty(nameId))
                {
                    claims.Add(new Claim(ClaimTypes.NameIdentifier, nameId));
                }

                var attributes = assertion.Element(ns + "AttributeStatement")?.Elements(ns + "Attribute");
                if (attributes != null)
                {
                    foreach (var attribute in attributes)
                    {
                        var claimType = attribute.Attribute("Name")?.Value;
                        var claimValue = attribute.Element(ns + "AttributeValue")?.Value;
                        if (!string.IsNullOrEmpty(claimType) && !string.IsNullOrEmpty(claimValue))
                        {
                            claims.Add(new Claim(claimType, claimValue));
                        }
                    }
                }
            }

            var userEmailClaim = claims.FirstOrDefault(c => c.Type == "email");
            if (userEmailClaim != null)
            {
                string userEmail = userEmailClaim.Value;
                bool validarUsuario = await ValidarUsuarioSAML(userEmail);
                if (validarUsuario)
                {
                    //Usuario existe en BD. Procedo a buscar que no exista correo duplicado
                    bool validarUnicoUsuario = await ValidarUsuarioUnico(userEmail);
                    if (validarUnicoUsuario)
                    {
                        //Usuario duplicado, salimos.
                        return Redirect("../Error");
                    }
                    int userid = await GetUserIdByEmail(userEmail); // Obtengo Id del usuario                   
                    var userdata = new PersonasViewModel();
                    userdata = await getPersonaByIdUser(userid);
                    var uid = await getUserDatosByUserName(userdata.Identificador);
                    var personaEmpresa = await getPersonaEmpresaByUserId(uid.UserId);

                    try
                    {
                        var idConvenio = "";
                        var rol = "Paciente";
                        var returnUrl = "/";
                        var codigoTelefono = "CO";
                        var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
                        var isPreHome = false;
                        List<EmpresaConfig> listaMultiEmpresa = new List<EmpresaConfig>();
                        listaMultiEmpresa = await MultiEmpresa(userdata.Identificador);
                        var h = GetHostValue(HttpContext.Request.Host.Value);
                        var accion = "Plataforma";
                        var idCliente = "0";
                        var host = GetHostValue(HttpContext.Request.Host.Value);
                        List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                        listaConfig = await UsersClientLogin(userdata.Identificador, host);
                        List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();
                        EmpresaConfig empresaConfig = new EmpresaConfig();
                        if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0))
                            return Json(new { returnUrl, msg = "Inactivo" });
                        if (rol == Roles.Paciente && !listaConfig[0].Existe)
                            return Json(new { returnUrl, msg = "Inactivo" });

                        var idEmpresaClaims = "0";
                        if (listaConfig.Count == 1 && rol == Roles.Paciente)
                        {
                            try
                            {
                                empresaConfig = listaConfig[0];
                                idCliente = empresaConfig.IdCliente.ToString();
                                idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                                isPreHome = empresaConfig.PreHome;
                                var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                                string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                                RedirectLogin loginEmpresa = new RedirectLogin();
                                loginEmpresa.UserName = userdata.Identificador;
                                loginEmpresa.Url = UrlRedirect;
                                loginEmpresa.UserId = uid.UserId;
                                loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                                loginEmpresa.PreHome = empresaConfig.PreHome;
                                if (HttpContext.Request.Host.Value.Contains("localhost"))
                                    UrlRedirect = "localhost:44363";
                                var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                                string encry = Encrypt(empresaJson);
                                if (!UrlRedirect.Contains("http"))
                                    UrlRedirect = "https://" + UrlRedirect;
                                returnUrl = UrlRedirect + "/account/RedirectLogin?u=" + encry;
                                return Redirect(returnUrl);
                            }
                            catch (Exception e)
                            {
                                SentrySdk.CaptureException(e);
                                Console.WriteLine(e.Message);
                            }
                            if (codigoTelefono != empresaConfig.CodTelefono)
                                codigoTelefono = empresaConfig.CodTelefono;
                        }
                        string tokenAuth = NewToken(uid.UserId.ToString());

                        var claimsLocal = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userdata.Identificador),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, uid.UserId.ToString()),
                        new Claim(ClaimTypes.Authentication, tokenAuth),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla", idEmpresaClaims)
                    };

                        Global.token = tokenAuth;


                        claimsLocal.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                        claimsLocal.Add(new Claim(ClaimTypes.Spn, accion));

                        var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(uid.UserId));
                        string json = JsonConvert.SerializeObject(centroClinico);
                        claimsLocal.Add(new Claim(ClaimTypes.System, json));

                        if (Convert.ToInt32(uid.UserId) > 0 && rol == "Paciente")
                        {
                            string empresa = "";
                            empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                            claimsLocal.Add(new Claim("Empresa", empresa));
                        }


                        await HttpContext.SignInAsync($"{rol}Schemes",
                                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                new AuthenticationProperties
                                {
                                    IsPersistent = true,
                                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                });

                        if (Url.IsLocalUrl(returnUrl) && !isPreHome)
                        {
                            return Redirect(returnUrl);
                        }
                        else
                        {
                            if (rol == Roles.Paciente)
                            {
                                var log = new LogPacienteViaje();
                                log.Evento = "Paciente ingresó a plataforma";
                                log.IdPaciente = Convert.ToInt32(uid.UserId);
                                await GrabarLog(log);
                            }

                            return Redirect(returnUrl);
                        }

                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine("redirect" + e.Message);
                        return Redirect("../Error");
                    }

                }
                else
                {
                    //return BadRequest("Correo no válido.");
                    return Redirect("../Error");
                }
            }
            else
            {
                //return BadRequest("No se pudo extraer el correo electrónico de la respuesta SAML.");
                return Redirect("../Error");
            }

        }

        public string NewToken(string name)
        {

            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = Encoding.ASCII.GetBytes("HYUANJYCCRWJAQNGBUVWEGYWNTCFGGLG");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, name) }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(secretKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtString = tokenHandler.WriteToken(token);
            return jwtString;
        }
        private async Task<bool> ValidarUsuarioCliente(string userName, int idCliente)
        {

            bool result = true;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getUsuarioCliente?username={userName}&idCliente={idCliente}"))
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    int valid = JsonConvert.DeserializeObject<int>(apiResponse);

                    if (valid == 0)
                    {
                        result = false;
                    }
                }
            }

            return result;
        }

        private async Task<bool> ValidarUsuarioSAML(string email)
        {

            bool result = true;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getUsuarioSAML?email={email}"))
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    int valid = JsonConvert.DeserializeObject<int>(apiResponse);

                    if (valid == 0)
                    {
                        result = false;
                    }
                }
            }

            return result;
        }

        private async Task<bool> ValidarUsuarioUnico(string email)
        {

            bool result = true;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getUsuarioUnico?email={email}"))
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    int duplicado = JsonConvert.DeserializeObject<int>(apiResponse);

                    if (duplicado == 0)
                    {
                        result = false;
                    }
                }
            }

            return result;
        }

        private async Task<int> GetUserIdByEmail(string email)
        {

            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getIdUsuariobyEmail?email={email}");
                    if (response.IsSuccessStatusCode)
                    {
                        var apiResponse = await response.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<int>(apiResponse);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }
            }
            return 0;
        }

        private async Task<PersonasViewModel> getPersonaByIdUser(int userId)
        {

            PersonasViewModel userdata = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getPersonabyUserId?idUser={userId}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            return userdata;
        }

        private async Task<bool> ValidarInvitadoCliente(int idCliente)
        {

            bool result = true;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getClienteInvitado?idCliente={idCliente}"))
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    int valid = JsonConvert.DeserializeObject<int>(apiResponse);

                    if (valid == 0)
                    {
                        result = false;
                    }
                }
            }

            return result;
        }
        private async Task<UsersViewModel> getUserByUserName(string username)
        {

            UsersViewModel userdata = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/getUserByUserName?username={username}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<UsersViewModel>(apiResponse);
                }
            }

            return userdata;
        }

        private async Task<UsersViewModel> getUserByCorreo(string username)
        {

            UsersViewModel userdata = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/getUserByCorreo?username={username}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<UsersViewModel>(apiResponse);
                }
            }

            return userdata;
        }

        private async Task<UsersViewModel> getUserByUserid(int uid)
        {

            UsersViewModel userdata = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/getUserByUserid?userId={uid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<UsersViewModel>(apiResponse);
                }
            }

            return userdata;
        }

        private async Task<string> GetDecryptionKeyFromEmpresaGlobal(string hostname)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getDecryptionKey?hostname={hostname}"))
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    if (!string.IsNullOrEmpty(apiResponse) && apiResponse.Length > 0)
                    {
                        return apiResponse;
                    }
                    else
                    {
                        throw new Exception("No se encontró clave de desencriptación para esta empresa");
                    }
                }
            }
        }

        private async Task<int> ValidarUsuariosClientes(string userName)
        {
            int valid = 0;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getUsuariosCliente?username={userName}"))
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    valid = JsonConvert.DeserializeObject<int>(apiResponse);
                }
            }

            return valid;
        }

        private async Task<List<EmpresaGlobal>> ValidUsersCliente(string host)
        {
            List<EmpresaGlobal> valid = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getUserCliente?hostname={host}"))
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    valid = JsonConvert.DeserializeObject<List<EmpresaGlobal>>(apiResponse);
                }
            }

            return valid;
        }
        public static string Encrypt(string cadena)
        {
            try
            {
                byte[] keyArray;

                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes("88dkE#$Rfg32eNN?l7"));

                hashmd5.Clear();
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;
                ICryptoTransform cEncriptor = tdes.CreateEncryptor();

                byte[] inBlock = Encoding.UTF8.GetBytes(cadena);
                byte[] cadenaEcnriptada = cEncriptor.TransformFinalBlock(inBlock, 0, inBlock.Length);
                string base64String = Convert.ToBase64String(cadenaEcnriptada, 0, cadenaEcnriptada.Length);

                return HttpUtility.UrlEncode(base64String);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return "Ha ocurrido un error";
            }
        }

        private async Task<PositivaCertificacion> getCertificados(string credencial, string tipo)
        {
            PositivaCertificacion certificacion = null;
            using (var httpClient = new HttpClient())
            {
                

                try
                {
                    using StringContent jsonContent = new StringContent(
                     JsonConvert.SerializeObject(new
                     {
                         tipoDocumento = tipo,
                         numIdentificacion = credencial,
                     }),
                    Encoding.UTF8,
                    "application/json");
                    using (var respons = await httpClient.PostAsync("https://br8x1l94-8080.brs.devtunnels.ms" + $"/wsCertificaciones/consultaCertificado", jsonContent))
                    {
                        string apiResponse = await respons.Content.ReadAsStringAsync();
                        var listado = JsonConvert.DeserializeObject<List<List<PositivaCertificacion>>>(apiResponse);
                        foreach (var i in listado)
                        {
                            foreach (var e in i)
                            {
                                if ("ACTIVO".Equals(e.estado))
                                {
                                    certificacion = e;
                                    break;
                                }
                            }
                            if (certificacion != null)
                                break;
                        }
                    }
                }
                catch (Exception e) { }
            }
            return certificacion;
        }

        private async Task<PositivaCarnet> getDataPositiva(string credencial, string tipo)
        {
            PositivaCertificacion certificacion = await getCertificados(credencial, tipo);
            using (var httpClient = new HttpClient())
            {
                try
                {

                    if (certificacion != null)
                    {
                        var empleador = certificacion.numDocEmpleador.Split("-");
                        using StringContent jsonContent = new StringContent(
                         JsonConvert.SerializeObject(new
                         {
                             tipoDocumento = tipo,
                             numIdentificacion = credencial,
                             tipoDocumentoEmp = ("NIT".Equals(empleador[0])) ? ("") : "NI",
                             numIdentificacionEmp = (empleador[1]),
                             subEmpresa = 0
                         }),
                        Encoding.UTF8,
                        "application/json");
                        using (var respons = await httpClient.PostAsync("https://br8x1l94-8080.brs.devtunnels.ms" + $"/wsCertificaciones/consultaCarnet", jsonContent))
                        {
                            string apiResponse = await respons.Content.ReadAsStringAsync();
                            var listado = JsonConvert.DeserializeObject<List<List<PositivaCarnet>>>(apiResponse);
                            foreach (var i in listado)
                            {
                                foreach (var e in i)
                                {
                                    if ("ACTIVO".Equals(e.estadoPersona) && "ACTIVO".Equals(e.estadoEmpleador))
                                    {
                                        return e;
                                    }
                                }
                            }
                        }
                    }
                }
                catch (Exception ex) { }
                
            }
            return null;
        }


        private async Task<PositivaCertificacionMSService> getNewFullData(string credencial, string tipo)
        {
            using (var httpClient = new HttpClient())
            {


                try
                {
                    var sendData = new
                    {
                        tipo = tipo,
                        credencial = credencial,
                    };
                    string url = _config["wsIntegracionPositiva"];
                    string urlSend = url + $"/api/getDataSeguroPositiva?credencial=" + credencial + "&tipo=" + tipo;
                    string tmSend = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
                    using (var respons = await httpClient.GetAsync(urlSend))
                    {
                        string tmResponse = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
                        try
                        {
                            saveRegisterDataPositiva("ws2", urlSend, sendData, JsonConvert.DeserializeObject(await respons.Content.ReadAsStringAsync()), tmSend, tmResponse, "Positiva");
                        }catch (Exception e) { }
                        if (respons.StatusCode != System.Net.HttpStatusCode.OK)
                            return null;
                        string apiResponse = await respons.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<PositivaCertificacionMSService>(apiResponse);
                        return response;
                    }
                }
                catch (Exception e) { }
            }
            return null;
        }

        private async Task saveRegisterDataPositiva(string type, string url, Object send, Object data, string sendDate, string responseDate, string origin)
        {
            using (var httpClient = new HttpClient())
            {
                using StringContent jso = new StringContent(
                         JsonConvert.SerializeObject(new
                         {
                             type = type,
                             url = url,
                             send = send,
                             data = data,
                             sendDate = sendDate,
                             responseDate = responseDate,
                             origin = origin
                         }),
                        Encoding.UTF8,
                        "application/json");
                using (var res = await httpClient.PostAsync($"https://osx67k21tf.execute-api.us-east-1.amazonaws.com/default/savewspositiva01001api", jso))
                {
                    string dataResponse = await res.Content.ReadAsStringAsync();
                }
            }
        }

        private async Task<List<DtoAfiliadoPositiva>> getPositivaAfiliadoData(string credencial, string tipo)
        {
            using (var httpClient = new HttpClient())
            {
                try
                {
                    var sendData = new
                    {
                        tipo = tipo,
                        credencial = credencial,
                    };
                    string url = _config["wsIntegracionPositivaAfiliado"];
                    string urlSend = url + $"/hello?credencial=" + credencial + "&tipo=" + tipo;
                    string tmSend = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
                    using (var respons = await httpClient.GetAsync(urlSend))
                    {
                        string tmResponse = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
                        try
                        {
                            saveRegisterDataPositiva("ws1", urlSend, sendData, JsonConvert.DeserializeObject(await respons.Content.ReadAsStringAsync()), tmSend, tmResponse, "Positiva");
                        }catch (Exception e) { }
                        if (respons.StatusCode != System.Net.HttpStatusCode.OK)
                            return null;
                        string apiResponse = await respons.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResponseAfiliadoPositiva>(apiResponse);
                        if(!(response.status.ToUpper().Equals("OK")))
                            return null;
                        return response.message;
                    }
                }
                catch (Exception e) { }
            }
            return null;
        }

        [HttpPost]
        public async Task<IActionResult> LogingPositiva(string credencial, string tipo, string returnUrl = null, string Nombre = "", string Apellido = "", string Correo = "", bool loginVerify = false)
        {
            ViewData["ReturnUrl"] = returnUrl;
            var host = GetHostValue(HttpContext.Request.Host.Value);
            var rol = "Paciente";
            var isPreHome = false;
            if (!host.Contains("positiva"))
                return Json(new { returnUrl, msg = "error" });
            //obtenemos carnet
            PositivaCertificacionMSService allData = await getNewFullData(credencial, tipo);
            PositivaCertificacion certificacion = null;
            PositivaCarnet carnet = null;
            DtoAfiliadoPositiva afiliado = null;
            string userName = null;
            if (Convert.ToBoolean(this._config["loginPositivaAlternative"]))
                return await LoginPositivaExterno(credencial, returnUrl, "Paciente");
            if (allData == null)
            {
                return await LoginPositivaExterno(credencial, returnUrl, "Paciente");
            }
            else
            {
                certificacion = allData.certificado;
                carnet = allData.carnet;
                
            }
            if (certificacion == null)
                return Json(new { returnUrl, msg = "error", loginVerify = true });
            userName = credencial;
            if (carnet != null)
                userName = carnet.numDocPersona;
            //obtenemos data Afiliado
            {

                if (credencial != null)
                {
                    var afiliadD = await getPositivaAfiliadoData(credencial, tipo);
                    if (afiliadD != null && afiliadD.Count > 0)
                        afiliado = afiliadD.Find(x => x.id_empresa.Equals(certificacion.numDocEmpleador.Split("-")[1]));
                }
            }
            EmpresaGlobal valid = null;
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var respone = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getUserCliente?hostname={host}"))
                    {
                        var apiResponse = await respone.Content.ReadAsStringAsync();
                        valid = JsonConvert.DeserializeObject<List<EmpresaGlobal>>(apiResponse).FirstOr(null);
                    }
                }
            }
            catch (Exception e) { }
            if (valid == null)
                return Json(new { returnUrl, msg = "error" });

            PersonasViewModel usuario = null;
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var respons = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getDatosPersonaUsername?username={userName}"))
                    {
                        var apiResponse = await respons.Content.ReadAsStringAsync();
                        usuario = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                    }
                }
            }
            catch (Exception e) { }

            
            if (carnet == null && usuario == null)
            {
                if (loginVerify.Equals(false))
                {
                    carnet = new PositivaCarnet();
                    carnet.nombresPersona = "";
                    carnet.apellidosPersona = "";
                    carnet.correoPersona = "";
                    carnet.numDocPersona = credencial;
                    //return Json(new { returnUrl, msg = "loginVerify", loginVerify = true }); //Activar en caso de que requiera ingresar los datos el usuario
                }else
                {
                    if ((!credencial.Equals("")) && (!Nombre.Equals("")) && (!Apellido.Equals("")))
                    {
                        carnet = new PositivaCarnet();
                        carnet.nombresPersona = Nombre;
                        carnet.apellidosPersona = Apellido;
                        carnet.correoPersona = (Correo.Equals(""))?"correo@email.example":Correo;
                        carnet.numDocPersona = credencial;
                    }
                    else
                    {
                        return Json(new { returnUrl, msg = "error", loginVerify = true });
                    }
                }
            }
            
            //obtenemos la empresa del host
            

            if (usuario == null)
            {
                using StringContent jsonContent = new StringContent(
                         JsonConvert.SerializeObject(new
                         {
                             Nombre = carnet.nombresPersona,
                             Identificador = carnet.numDocPersona,
                             ApellidoPaterno = carnet.apellidosPersona.Split(" ").FirstOr(""),
                             ApellidoMaterno = (carnet.apellidosPersona.Split(" ").Length > 1) ? carnet.apellidosPersona.Split(" ")[1] : "",
                             Correo = carnet.correoPersona,
                             Direccion = afiliado?.direccion_persona ?? "",
                             Genero = ((afiliado?.sexo ?? "").Replace("MASCULINO","M").Replace("FEMENINO","F").Trim()),
                             IdEmpresa = valid.IdEmpresa
                         }),
                        Encoding.UTF8,
                        "application/json");

                HttpResponseMessage responseUpload = await client.PostAsync(_config["ServicesUrl"] + $"/usuarios/Users/createPersonaEmpresaBasic", jsonContent);
                responseUpload.EnsureSuccessStatusCode();
                try
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var respons = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getDatosPersonaUsername?username={carnet.numDocPersona}"))
                        {
                            var apiResponse = await respons.Content.ReadAsStringAsync();
                            usuario = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                        }
                    }
                }
                catch (Exception e) { }
            }

            if(usuario == null)
                return Json(new { returnUrl, msg = "error" });
            try
            {
                using (var httpClient = new HttpClient())
                {
                    string json = JsonConvert.SerializeObject(new {Empresa=allData.certificado.nombreEmpleador});

                    StringContent httpContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                    var respons = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/empresa/UpdatePersonaNomEmpresa/{usuario.UserId.ToString()}/{valid.IdEmpresa.ToString()}", httpContent);
                    respons.EnsureSuccessStatusCode();
                }
            }
            catch (Exception e) { }
           
            try
            {
                    var fecha = (afiliado != null && afiliado.fecha_nacimiento != null) ?afiliado.fecha_nacimiento.Split("-"): null;
                    string json = JsonConvert.SerializeObject(new { 
                        Direccion = (afiliado!= null)?afiliado.direccion_persona: null, 
                        Comuna= (afiliado != null)? afiliado.nombre_departamento: null,
                        Ciudad= (afiliado != null)? afiliado.nombre_municipio: null,
                        FNacimiento= (afiliado != null && fecha != null) ? (fecha[2] + "-" + fecha[1] +"-" +fecha[0]):null, 
                        Genero= (afiliado != null) ? ((afiliado?.sexo ?? "").Replace("MASCULINO", "M").Replace("FEMENINO", "F").Trim()): null,
                        TipoDocumento= tipo,
                        ClaseDeRiesgo = (carnet != null)? carnet.claseRiesgo:null,
                        IdEmpresa = valid.IdEmpresa
                    });
                    StringContent httpContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                    HttpResponseMessage responseUpload = await client.PutAsync(_config["ServicesUrl"] + $"/usuarios/personas/updatePerfilBody?uid=" + usuario.UserId, httpContent);
                    responseUpload.EnsureSuccessStatusCode();
                
            }catch (Exception e) {
                Console.WriteLine("LogingPositiva: Error al actualizar datos de usuario");
            }
            userName = usuario.Identificador.ToString();
            List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
            listaConfig = await UsersClientLogin(userName, host);
            EmpresaConfig empresaConfig = new EmpresaConfig();
            if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0)) // VALIDA QUE EXISTE EN ALGUNA EMPRESA
                return Json(new { returnUrl, msg = "Inactivo" });
            if (rol == Roles.Paciente && !listaConfig[0].Existe) //VALIDA QUE EXISTA EN LA EMPRESA QUE SE ESTÁ LOGGEANDO
                return Json(new { returnUrl, msg = "Inactivo" });
            empresaConfig = listaConfig[0];
            var claims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, usuario.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, usuario.UserId.ToString()),
                                    new Claim(ClaimTypes.Sid, ""),
                                    new Claim(ClaimTypes.PrimarySid, valid.IdEmpresa.ToString()),
                                    new Claim(ClaimTypes.Authentication, NewToken(usuario.Identificador))
                                };

            if (Convert.ToInt32(usuario.Id) > 0)
            {
                var model = await GetUsuarioEmpresa(Convert.ToInt32(valid.IdEmpresa));
                string empresa = model.Value.ToString();

                claims.Add(new Claim("Empresa", empresa.ToString()));
            }
            await HttpContext.SignInAsync($"PacienteSchemes",
                new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1)

                });
            LogUso(5, 9, Convert.ToInt32(usuario.UserId), Convert.ToInt32(valid.IdEmpresa), "Login/userName=" + usuario.Nombre + "&rol=" + rol);

            if (Url.IsLocalUrl(returnUrl) && !isPreHome)
            {

                return Json(new { returnUrl });
                //return Redirect(returnUrl);
            }
            else
            {
                if (rol == Roles.Paciente)
                {
                    var log = new LogPacienteViaje();
                    log.Evento = "Paciente ingresó a plataforma";
                    log.IdPaciente = Convert.ToInt32(usuario.UserId);
                    await GrabarLog(log);
                    returnUrl = "/";
                }
                else if (rol == Roles.Administrador)
                {
                    returnUrl = "/Admin/Index";
                }
                else if (rol == Roles.AdministradorTeleperitaje)
                {
                    returnUrl = "/Admin/InformeAtenciones";
                }
                else if (rol == Roles.Contralor)
                {
                    returnUrl = "/Contralor";
                }
                else if (rol == Roles.Medico)
                {
                    returnUrl = "/Medico/Index";
                }
                return Json(new { returnUrl });
            }
        }

        
        [HttpPost]
        public async Task<IActionResult> Login(string userName, string password, string rol, string codigo = null, string JsonData = null, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            var valido = true;
            var codigoTelefono = "CL";
            var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
            var isPreHome = false;

            SimpleUserModel uid = null;
            try
            {
                uid = await ValidateLoginAsync(userName.Contains("@") ? userName : userName.Replace(".", ""), password, rol);
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                return Json(new { returnUrl, msg = "error" });
            }

            if (uid == null)
            {
                return Json(new { returnUrl, msg = "error" });
            }

            if (userName.Contains("@"))
            {
                var s = await getUserByUserid(uid.UserId);
                if (s.Username != null)
                    userName = s.Username;
            }

            List<EmpresaConfig> listaMultiEmpresa = new List<EmpresaConfig>();
            //validación usuario consorcio en medical opción de redirección selección mas de un convenio, dejar afuera aseguradoras
            listaMultiEmpresa = await MultiEmpresa(userName);

            var h = GetHostValue(HttpContext.Request.Host.Value);
            var isEmpresa = h.Contains("uoh.medical.") || h.Contains("bo.medical") || h.Contains("uoh.qa.medical.");
            if (!isEmpresa && listaMultiEmpresa.Count > 1 && rol == Roles.Paciente && (h.Contains("medical.medismart") || h.Contains("localhost")))
            {
                return Json(new { listaMultiEmpresa, msg = "multiconvenio" });
            }
            var lastLog = await GetLastLog(uid.UserId, "Ubicacion Usuario");

            var inactivity = false;
            var otraUbicacion = false;
            if (lastLog != null)
            {
                if (lastLog.FechaRegistro != null)
                {
                    var diffLog = Convert.ToDateTime(DateTime.Now) - Convert.ToDateTime(lastLog.FechaRegistro);
                    inactivity = (diffLog.Days > 30);
                }
                string country = null;
                string lastcountry = null;
                GeoData lastgeoData = JsonConvert.DeserializeObject<GeoData>(lastLog.Info);
                GeoData geoData = null;
                if (JsonData != null)
                    geoData = JsonConvert.DeserializeObject<GeoData>(JsonData);
                if (lastgeoData != null && lastgeoData.country.isoAlpha3 != null)
                    lastcountry = lastgeoData.country.isoAlpha3;
                if (geoData != null && geoData.country.isoAlpha3 != null)
                    country = geoData.country.isoAlpha3;
                if (lastcountry != null && country != null)
                    otraUbicacion = (lastcountry != country);

            }
            try
            {
                if (!String.IsNullOrEmpty(JsonData))
                {
                    var localizacionResponse = JsonConvert.DeserializeObject<BigDataCloudResponse>(JsonData);
                    using (var httpClient = new HttpClient())
                    {

                        var hora = localizacionResponse.location.timeZone.utcOffset.Replace("+", "");
                        codigoTelefono = localizacionResponse.country.isoAlpha2;
                        if (hora.Contains("-0"))
                            hora = hora.Replace("-0", "-");

                        horaInt = Convert.ToInt32(hora);
                        using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/updateZonaHorariaPersona?uid={uid.UserId}&zonaHoraria={horaInt}&codigoTelefono={codigoTelefono}"))
                        {
                            string apiResponse = await response.Content.ReadAsStringAsync();
                        }
                    }
                    if (localizacionResponse != null)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Ubicacion Usuario";
                        log.IdPaciente = Convert.ToInt32(uid.UserId);
                        log.Info = JsonData;
                        await GrabarLog(log);
                    }
                    else
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "localizacion null con JsonData not null";
                        log.IdPaciente = Convert.ToInt32(uid.UserId);
                        log.Info = JsonData;
                        await GrabarLog(log);
                    }
                }
                else
                {
                    var log = new LogPacienteViaje();
                    log.Evento = "Localización null";
                    log.IdPaciente = Convert.ToInt32(uid.UserId);
                    log.Info = JsonData;
                    await GrabarLog(log);
                }


            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                var log = new LogPacienteViaje();
                log.Evento = "localizacion catch " + ex.Message;
                log.IdPaciente = Convert.ToInt32(uid.UserId);
                log.Info = JsonData;
                await GrabarLog(log);

            }
            /*
             if (codigoTelefono == "CO" && codigo == null && (inactivity || otraUbicacion))
            {
                string baseUrl = GetHostValue(HttpContext.Request.Host.Value);
                LoginViewModel model = new LoginViewModel
                {
                    Username = userName,
                    Password = "",
                    RepeatPassword = "",
                    RememberLogin = false,
                    ReturnUrl = "",
                    rol = rol,
                    JsonData = JsonData,
                    Codigo = "",
                    CodigoProm = "",
                    ActivationCode = Guid.NewGuid(),
                    NumberActivationCode = 0
                };
                await AuthMFA(model, baseUrl);
                return Json(new { returnUrl, msg = "CorreoEnviado" });
            }
            else if (codigoTelefono == "CO" && codigo != null)
            {
                bool isValidCode = await ValidateLoginCode(userName, codigo);
                if (!isValidCode)
                {
                    if (inactivity || otraUbicacion)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Ubicacion Usuario Inactividad";
                        log.IdPaciente = Convert.ToInt32(uid.UserId);
                        log.Info = JsonData;
                        await GrabarLog(log);
                    }
                    return Json(new { returnUrl, msg = "errorValidationCode" });
                }
                else
                {
                    if (inactivity || otraUbicacion)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Ubicacion Usuario";
                        log.IdPaciente = Convert.ToInt32(uid.UserId);
                        log.Info = JsonData;
                        await GrabarLog(log);
                    }
                }
            }
            */
            var accion = "Plataforma";
            var idCliente = "0";
            var idConvenio = "";
            // Normally Identity handles sign in, but you can do it directlyPrimarysid
            if (uid != null && uid.UserId != 0)
            {
                var host = GetHostValue(HttpContext.Request.Host.Value);
                /*consultar usuario solo en sitio común, debe ser igual al host de configuración, ya que existe: bo.medical., uoh.medical, 
                 * este host será configurable para que solo entre al if de medical.*/
                List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                listaConfig = await UsersClientLogin(userName, host);
                List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

                EmpresaConfig empresaConfig = new EmpresaConfig();
                if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0)) // VALIDA QUE EXISTE EN ALGUNA EMPRESA
                    return Json(new { returnUrl, msg = "Inactivo" });
                if (rol == Roles.Paciente && !listaConfig[0].Existe) //VALIDA QUE EXISTA EN LA EMPRESA QUE SE ESTÁ LOGGEANDO
                    return Json(new { returnUrl, msg = "Inactivo" });

                if (host.Contains("doctoronline.")) //login viene de colmena
                {
                    //Validar edad 
                    accion = "COLMENA";
                    var jsonString = JsonConvert.SerializeObject(userName);

                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getEdadBeneficiario?rutBeneficiario={userName}"))
                        {
                            var apiResponse = await response.Content.ReadAsStringAsync();
                            int result = JsonConvert.DeserializeObject<int>(apiResponse);

                            if (result == -1)
                            {
                                return Json(new { returnUrl, msg = "Inactivo" });
                            }
                            else if (result < 18)
                            {
                                return Json(new { returnUrl, msg = "Menor" });
                            }
                        }
                    }
                    idCliente = "148";
                }
                var idEmpresaClaims = "0";
                if (listaConfig.Count == 1 && rol == Roles.Paciente)
                {
                    try
                    {
                        empresaConfig = listaConfig[0];
                        idCliente = empresaConfig.IdCliente.ToString();
                        idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                        isPreHome = empresaConfig.PreHome;
                        if (host.Contains("segurossura.")) { isPreHome = true; }
                        if (empresaConfig.Redirecciona == true)
                        {
                            var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                            string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                            RedirectLogin loginEmpresa = new RedirectLogin();
                            loginEmpresa.UserName = userName;
                            loginEmpresa.Url = UrlRedirect;
                            loginEmpresa.UserId = uid.UserId;
                            loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                            loginEmpresa.PreHome = empresaConfig.PreHome;
                            if (HttpContext.Request.Host.Value.Contains("localhost"))
                                UrlRedirect = "localhost:44363";
                            var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                            string encry = Encrypt(empresaJson);
                            if (!UrlRedirect.Contains("http"))
                                UrlRedirect = "https://" + UrlRedirect;
                            returnUrl = UrlRedirect + "/account/RedirectLogin?u=" + encry;
                            return Json(new { returnUrl });

                        }

                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e.Message);
                    }
                    if (codigoTelefono != empresaConfig.CodTelefono)
                        codigoTelefono = empresaConfig.CodTelefono;
                }

                if (rol == Roles.Administrador || rol == Roles.AdministradorTeleperitaje)
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getAdministradorEmpresa/{uid.UserId}"))
                        {
                            var apiResponse = await response.Content.ReadAsStringAsync();
                            idEmpresaClaims = JsonConvert.DeserializeObject<int>(apiResponse).ToString();
                        }
                    }
                }

                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userName),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, uid.UserId.ToString()),
                        new Claim(ClaimTypes.Authentication, uid.token),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla", idEmpresaClaims)
                    };

                Global.token = uid.token.ToString();


                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                claims.Add(new Claim(ClaimTypes.Spn, accion));

                var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(uid.UserId));
                string json = JsonConvert.SerializeObject(centroClinico);
                claims.Add(new Claim(ClaimTypes.System, json));

                if (Convert.ToInt32(uid.UserId) > 0 && rol == "Paciente")
                {
                    //var model = await UsuarioConvenio(userName, Convert.ToInt32(uid.UserId));
                    //string empresa = ""; // model.Value.ToString();
                    //if (host.Contains("vidacamara."))
                    //{
                    //    var retornoempresa = JsonConvert.DeserializeObject<List<EmpresaConfig>>(model.Value.ToString());
                    //    empresa = JsonConvert.SerializeObject(retornoempresa.FirstOrDefault()).ToString();
                    //    //string retornoempresa2 = JsonConvert.SerializeObject(retornoempresa).ToString();
                    //    //   claims.Add(new Claim("Listaempresa", retornoempresa2));
                    //    claims.Add(new Claim("Empresa", empresa));
                    //}
                    //else
                    //{
                    //    empresa = model.Value.ToString();

                    //}
                    string empresa = ""; // model.Value.ToString();
                    empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                    claims.Add(new Claim("Empresa", empresa));



                }


                await HttpContext.SignInAsync($"{rol}Schemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });
                //try del Log de uso de servicio
                LogUso(5, 9, Convert.ToInt32(uid.UserId), Convert.ToInt32(idCliente), "Login/userName=" + userName + "&rol=" + rol);

                if (Url.IsLocalUrl(returnUrl) && !isPreHome)
                {
                    return Json(new { returnUrl });
                }
                else
                {
                    if (rol == Roles.Paciente)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Paciente ingresó a plataforma";
                        log.IdPaciente = Convert.ToInt32(uid.UserId);
                        await GrabarLog(log);
                        if (host.Contains("didi.wedoctorsmx"))
                        {
                            returnUrl = "/Paciente/Home";
                        }
                        else
                        {
                            if (host.Contains("segurossura.")) { listaConfig[0].PreHome = true; }
                            if (listaConfig.Count > 0 && listaConfig[0].PreHome == true)
                                returnUrl = "/Paciente/PlanSalud";
                            else
                                returnUrl = host.Contains("consalud.") ? "/Paciente/ExamenesConsalud" : "/";
                        }
                    }
                    else if (rol == Roles.Administrador)
                    {
                        returnUrl = "/Admin/Index";
                    }
                    else if (rol == Roles.AdministradorTeleperitaje)
                    {
                        returnUrl = "/Admin/InformeAtenciones";
                    }
                    else if (rol == Roles.Contralor)
                    {
                        returnUrl = "/Contralor";
                    }
                    else if (rol == Roles.Medico)
                    {
                        returnUrl = "/Medico/Index";
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


        [HttpGet]
        public async Task<IActionResult> BetterflyLoginExterno(string rut)
        {
            try
            {
                var rol = "Paciente";
                var returnUrl = "/";
                var codigoTelefono = "CL";
                var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
                var isPreHome = false;
                var userID = await getUserDatosByUserName(rut);
                List<EmpresaConfig> listaMultiEmpresa = new List<EmpresaConfig>();
                listaMultiEmpresa = await MultiEmpresa(rut);
                var h = GetHostValue(HttpContext.Request.Host.Value);
                var accion = "Plataforma";
                var idCliente = "0";
                var host = GetHostValue(HttpContext.Request.Host.Value);
                List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                listaConfig = await UsersClientLogin(rut, host);
                List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();
                EmpresaConfig empresaConfig = new EmpresaConfig();
                if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0))
                    return Json(new { returnUrl, msg = "Inactivo" });
                if (rol == Roles.Paciente && !listaConfig[0].Existe)
                    return Json(new { returnUrl, msg = "Inactivo" });

                var idEmpresaClaims = "0";
                if (listaConfig.Count == 1 && rol == Roles.Paciente)
                {
                    try
                    {
                        empresaConfig = listaConfig[0];
                        idCliente = empresaConfig.IdCliente.ToString();
                        idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                        isPreHome = empresaConfig.PreHome;
                        if (empresaConfig.Redirecciona == true)
                        {
                            var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                            string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                            RedirectLogin loginEmpresa = new RedirectLogin();
                            loginEmpresa.UserName = rut;
                            loginEmpresa.Url = UrlRedirect;
                            loginEmpresa.UserId = userID.UserId;
                            loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                            loginEmpresa.PreHome = empresaConfig.PreHome;
                            if (HttpContext.Request.Host.Value.Contains("localhost"))
                                UrlRedirect = "localhost:44363";
                            var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                            string encry = Encrypt(empresaJson);
                            if (!UrlRedirect.Contains("http"))
                                UrlRedirect = "https://" + UrlRedirect;
                            returnUrl = UrlRedirect + "/account/RedirectLogin?u=" + encry;
                            return Redirect(returnUrl);

                        }

                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e.Message);
                    }
                    if (codigoTelefono != empresaConfig.CodTelefono)
                        codigoTelefono = empresaConfig.CodTelefono;
                }
                string tokenAuth = NewToken(userID.UserId.ToString());

                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, rut),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, userID.UserId.ToString()),
                        new Claim(ClaimTypes.Authentication, tokenAuth),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla", idEmpresaClaims)
                    };

                Global.token = tokenAuth;


                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                claims.Add(new Claim(ClaimTypes.Spn, accion));

                var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(userID.UserId));
                string json = JsonConvert.SerializeObject(centroClinico);
                claims.Add(new Claim(ClaimTypes.System, json));

                if (Convert.ToInt32(userID.UserId) > 0 && rol == "Paciente")
                {
                    string empresa = "";
                    empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                    claims.Add(new Claim("Empresa", empresa));
                }


                await HttpContext.SignInAsync($"{rol}Schemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });

                if (Url.IsLocalUrl(returnUrl) && !isPreHome)
                {
                    return Redirect(returnUrl);
                }
                else
                {
                    if (rol == Roles.Paciente)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Paciente ingresó a plataforma";
                        log.IdPaciente = Convert.ToInt32(userID.UserId);
                        await GrabarLog(log);
                    }

                    return Redirect(returnUrl);
                }

            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                Console.WriteLine("redirect" + e.Message);
                return Redirect("../Error");
            }
        }


        [HttpGet]
        public async Task<IActionResult> LoginExternal(string code)
        {
            try
            {
                var rut = Desencriptar(code);
                var rol = "Paciente";
                var returnUrl = "/";
                var codigoTelefono = "CL";
                var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
                var isPreHome = false;
                var userID = await getUserDatosByUserName(rut);
                List<EmpresaConfig> listaMultiEmpresa = new List<EmpresaConfig>();
                listaMultiEmpresa = await MultiEmpresa(rut);
                var h = GetHostValue(HttpContext.Request.Host.Value);
                var accion = "Plataforma";
                var idCliente = "0";
                var host = GetHostValue(HttpContext.Request.Host.Value);
                List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                listaConfig = await UsersClientLogin(userID.Username, host);
                List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();
                EmpresaConfig empresaConfig = new EmpresaConfig();

                //no pertenece a la empresa o esta inactivo
                if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0))
                    return Json(new { returnUrl, msg = "El usuario esta Inactivo, por favor contacte al administrador" });
                if (rol == Roles.Paciente && !listaConfig[0].Existe)
                    return Json(new { returnUrl, msg = "El usuario esta Inactivo, por favor contacte al administrador" });

                var idEmpresaClaims = "0";
                if (listaConfig.Count == 1 && rol == Roles.Paciente)
                {
                    try
                    {
                        empresaConfig = listaConfig[0];
                        idCliente = empresaConfig.IdCliente.ToString();
                        idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                        isPreHome = empresaConfig.PreHome;
                        if (empresaConfig.Redirecciona == true)
                        {
                            var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                            string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                            RedirectLogin loginEmpresa = new RedirectLogin();
                            loginEmpresa.UserName = rut;
                            loginEmpresa.Url = UrlRedirect;
                            loginEmpresa.UserId = userID.UserId;
                            loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                            loginEmpresa.PreHome = empresaConfig.PreHome;
                            if (HttpContext.Request.Host.Value.Contains("localhost"))
                                UrlRedirect = "localhost:44363";
                            var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                            string encry = Encrypt(empresaJson);
                            if (!UrlRedirect.Contains("http"))
                                UrlRedirect = "https://" + UrlRedirect;
                            returnUrl = UrlRedirect + "/account/RedirectLogin?u=" + encry;
                            return Redirect(returnUrl);

                        }

                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e.Message);
                    }
                    if (codigoTelefono != empresaConfig.CodTelefono)
                        codigoTelefono = empresaConfig.CodTelefono;
                }
                string tokenAuth = NewToken(userID.UserId.ToString());

                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, rut),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, userID.UserId.ToString()),
                        new Claim(ClaimTypes.Authentication, tokenAuth),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla", idEmpresaClaims)
                    };

                Global.token = tokenAuth;


                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                claims.Add(new Claim(ClaimTypes.Spn, accion));

                var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(userID.UserId));
                string json = JsonConvert.SerializeObject(centroClinico);
                claims.Add(new Claim(ClaimTypes.System, json));

                if (Convert.ToInt32(userID.UserId) > 0 && rol == "Paciente")
                {
                    string empresa = "";
                    empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                    claims.Add(new Claim("Empresa", empresa));
                }


                await HttpContext.SignInAsync($"{rol}Schemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });

                if (Url.IsLocalUrl(returnUrl) && !isPreHome)
                {
                    return Redirect(returnUrl);
                }
                else
                {
                    if (rol == Roles.Paciente)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Paciente ingresó a plataforma";
                        log.IdPaciente = Convert.ToInt32(userID.UserId);
                        await GrabarLog(log);
                    }

                    return Redirect(returnUrl);
                }

            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                Console.WriteLine("redirect" + e.Message);
                return Redirect("../Error");
            }

        }


        [HttpPost]
        public async Task<IActionResult> LoginRedirectEmpresa(string userName, string password, string hostname, string returnUrl, string rol)
        {
            ViewData["ReturnUrl"] = returnUrl;
            var valido = true;
            var codigoTelefono = "CL";
            var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
            var isPreHome = false;
            bool procesoFinalizado = false;

            SimpleUserModel uid = null;
            try
            {
                uid = await ValidateLoginAsync(userName.Contains("@") ? userName : userName.Replace(".", ""), password, rol);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return Json(new { returnUrl, msg = "error" });
            }

            if (uid == null)
            {
                return Json(new { returnUrl, msg = "error" });
            }

            if (userName.Contains("@"))
            {
                var s = await getUserByUserid(uid.UserId);
                if (s.Username != null)
                    userName = s.Username;
            }
            var accion = "Plataforma";
            var idCliente = "0";
            var idConvenio = "";
            // Normally Identity handles sign in, but you can do it directlyPrimarysid

            var host = hostname;
            /*consultar usuario solo en sitio común, debe ser igual al host de configuración, ya que existe: bo.medical., uoh.medical, 
             * este host será configurable para que solo entre al if de medical.*/
            List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
            listaConfig = await UsersClientLogin(userName, host);
            List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

            EmpresaConfig empresaConfig = new EmpresaConfig();
            if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0)) // VALIDA QUE EXISTE EN ALGUNA EMPRESA
                return Json(new { returnUrl, msg = "Inactivo" });
            if (rol == Roles.Paciente && !listaConfig[0].Existe) //VALIDA QUE EXISTA EN LA EMPRESA QUE SE ESTÁ LOGGEANDO
                return Json(new { returnUrl, msg = "Inactivo" });

            if (host.Contains("doctoronline.")) //login viene de colmena
            {
                //Validar edad 
                accion = "COLMENA";
                var jsonString = JsonConvert.SerializeObject(userName);

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getEdadBeneficiario?rutBeneficiario={userName}"))
                    {
                        var apiResponse = await response.Content.ReadAsStringAsync();
                        int result = JsonConvert.DeserializeObject<int>(apiResponse);

                        if (result == -1)
                        {
                            return Json(new { returnUrl, msg = "Inactivo" });
                        }
                        else if (result < 18)
                        {
                            return Json(new { returnUrl, msg = "Menor" });
                        }
                    }
                }
                idCliente = "148";
            }
            var idEmpresaClaims = "0";
            if (listaConfig.Count == 1 && rol == Roles.Paciente)
            {
                try
                {
                    empresaConfig = listaConfig[0];
                    idCliente = empresaConfig.IdCliente.ToString();
                    idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                    isPreHome = empresaConfig.PreHome;

                    if (host.Contains("segurossura.")) { isPreHome = true; }

                    var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                    string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                    RedirectLogin loginEmpresa = new RedirectLogin();

                    loginEmpresa.UserName = userName;
                    loginEmpresa.Url = UrlRedirect;
                    loginEmpresa.UserId = uid.UserId;
                    loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                    loginEmpresa.PreHome = empresaConfig.PreHome;
                    if (HttpContext.Request.Host.Value.Contains("localhost"))
                        UrlRedirect = "localhost:44363";
                    var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                    string encry = Encrypt(empresaJson);
                    if (!UrlRedirect.Contains("http"))
                        UrlRedirect = "https://" + UrlRedirect;
                    returnUrl = UrlRedirect + "/account/RedirectLogin?u=" + encry;
                    return Json(new { returnUrl });




                }
                catch (Exception e)
                {
                    SentrySdk.CaptureException(e);
                    Console.WriteLine(e.Message);
                }
                if (codigoTelefono != empresaConfig.CodTelefono)
                    codigoTelefono = empresaConfig.CodTelefono;
            }


            var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userName),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, uid.UserId.ToString()),
                        new Claim(ClaimTypes.Authentication, uid.token.ToString()),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla",idEmpresaClaims.ToString())
                    };
            Global.token = uid.token.ToString();


            claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
            claims.Add(new Claim(ClaimTypes.Spn, accion));

            var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(uid.UserId));
            string json = JsonConvert.SerializeObject(centroClinico);
            claims.Add(new Claim(ClaimTypes.System, json));

            if (Convert.ToInt32(uid.UserId) > 0 && rol == "Paciente")
            {
                string empresa = ""; // model.Value.ToString();
                empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                claims.Add(new Claim("Empresa", empresa));



            }


            await HttpContext.SignInAsync($"{rol}Schemes",
                    new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                    new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.UtcNow.AddDays(1)

                    });
            //try del Log de uso de servicio
            LogUso(5, 9, Convert.ToInt32(uid.UserId), Convert.ToInt32(idCliente), "Login/userName=" + userName + "&rol=" + rol);

            if (Url.IsLocalUrl(returnUrl) && !isPreHome)
            {
                return Json(new { returnUrl });
                //return Redirect(returnUrl);
            }
            else
            {
                if (rol == Roles.Paciente)
                {
                    var log = new LogPacienteViaje();
                    log.Evento = "Paciente ingresó a plataforma";
                    log.IdPaciente = Convert.ToInt32(uid.UserId);
                    await GrabarLog(log);
                    //returnUrl = "/Paciente/Index?v=true";
                    if (host.Contains("segurossura.")) { listaConfig[0].PreHome = true; }
                    if (listaConfig.Count > 0 && listaConfig[0].PreHome == true)
                        returnUrl = "/Paciente/PlanSalud";
                    else
                        returnUrl = host.Contains("consalud.") ? "/Paciente/ExamenesConsalud" : "/";
                }
                else if (rol == Roles.Administrador)
                {
                    returnUrl = "/Admin/Index";
                }
                else if (rol == Roles.Contralor)
                {
                    returnUrl = "/Contralor";
                }
                else if (rol == Roles.Medico)
                {
                    returnUrl = "/Medico/Index";
                }
                return Json(new { returnUrl });
                //return Redirect(returnUrl);
            }


        }

        [HttpPost]
        public async Task<IActionResult> LoginUnico(string userName, string password, string rol, string JsonData, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;



            var valido = true;


            var uid = await ValidateLoginAsync(userName, password, rol);
            if (uid == null)
            {
                var user = await getUserByUserName(userName);

                if (user != null) //
                {

                    var url = "https://enroll.medismart.live/api/check-user-rayen";
                    var uriRequest = new Uri(url);

                    var content = new FormUrlEncodedContent(new[]
                    {
                            new KeyValuePair<string, string>("rut", userName),
                            new KeyValuePair<string, string>("password", password)
                        });

                    using (var httpClient = new HttpClient())
                    {

                        var httpResponse = await httpClient.PostAsync(uriRequest, content);

                        Console.Write(httpResponse.Content);

                        if (httpResponse.Content.ReadAsStringAsync().Result == "1"
                        ) //la password coincide con la de rayen
                        {

                            var login = new LoginViewModel();


                            login.Username = userName;
                            login.Password = password;
                            login.RepeatPassword = password;
                            using var httpClientreset = new HttpClient();
                            var jsonString = JsonConvert.SerializeObject(login);
                            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                            using var response = await httpClientreset.PutAsync(
                                _config["ServicesUrl"] + $"/usuarios/users/resetPasswordRayen", httpContent);
                            string apiResponse = await response.Content.ReadAsStringAsync();


                            uid = await ValidateLoginAsync(userName, password, rol);
                        }

                    }
                }
            }

            // Normally Identity handles sign in, but you can do it directlyPrimarysid
            if (uid != null && uid.UserId != 0)
            {
                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userName),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, uid.UserId.ToString()),
                    };

                var host = GetHostValue(HttpContext.Request.Host.Value);
                if (host.Contains("inmv."))//login viene de nueva mas vida
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getUsuarioInmv?username={userName}"))
                        {
                            var apiResponse = await response.Content.ReadAsStringAsync();
                            int result = JsonConvert.DeserializeObject<int>(apiResponse);

                            if (result == 0)
                            {
                                return Json(new { returnUrl, msg = "Inactivo" });
                            }
                            else
                            {
                                claims.Add(new Claim(ClaimTypes.PrimarySid, "2"));
                            }
                        }
                    }
                }
                else if (host.Contains("doctoronline."))
                {
                    claims.Add(new Claim(ClaimTypes.PrimarySid, "148"));
                }
                else
                {
                    claims.Add(new Claim(ClaimTypes.PrimarySid, "0"));
                }

                if (Convert.ToInt32(uid) > 0 && rol == "Paciente")
                {
                    var model = await UsuarioConvenio(userName, Convert.ToInt32(uid));
                    string empresa = model.Value.ToString();
                    claims.Add(new Claim("Empresa", empresa));
                }
                await HttpContext.SignInAsync($"{rol}Schemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });



                if (Url.IsLocalUrl(returnUrl))
                {

                    return Json(new { returnUrl });
                    //return Redirect(returnUrl);
                }
                else
                {
                    if (rol == Roles.Paciente)
                    {
                        var log = new LogPacienteViaje();
                        using (var httpClient = new HttpClient())
                        {
                            log.Evento = "Paciente ingresó a plataforma";
                            log.IdPaciente = Convert.ToInt32(uid);
                            await GrabarLog(log);
                        }
                        //returnUrl = "/Paciente/Index?v=true";
                        returnUrl = "/";
                    }
                    else if (rol == Roles.Administrador)
                    {
                        returnUrl = "/Admin/Index";
                    }
                    else if (rol == Roles.Contralor)
                    {
                        returnUrl = "/Contralor";
                    }
                    else if (rol == Roles.Medico)
                    {
                        returnUrl = "/Medico/Index";
                    }

                    return Json(new { returnUrl });
                    //return Redirect("/");
                }
            }

            else if (uid.UserId == 0)
            {
                return Json(new { returnUrl, msg = "Inactivo" });
            }


            return Json(new { returnUrl, msg = "error" });

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

        public async Task<LogPacienteViaje> GetLastLog(int uid)
        {

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/GetLastLogPacienteViaje?idPaciente=" + uid.ToString()))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<LogPacienteViaje>(apiResponse);
                }
            }
        }
        public async Task<LogPacienteViaje> GetLastLog(int uid, string evento)
        {

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/GetLastLogPacienteViaje?idPaciente=" + uid.ToString() + "&evento=" + evento))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<LogPacienteViaje>(apiResponse);
                }
            }
        }

        public string GetHostValue(string value)
        {
            var hostTest = _config["HostTest"];
            if (!string.IsNullOrEmpty(hostTest))
                return hostTest;
            else
                return value;
        }

        private async Task<JsonResult> UsuarioConvenio(string username, int uid)
        {
            IntegracionEnroll enroll = new IntegracionEnroll();
            EmpresaConfig empresaConfig = null;
            try
            {
                var jsonString = JsonConvert.SerializeObject(username);
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.PostAsync(_config["ServicesEnroll"] + $"/api/getEnroladoRut?rut=" + username, httpContent))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        enroll = JsonConvert.DeserializeObject<IntegracionEnroll>(apiResponse);
                    }
                }
                var host = GetHostValue(HttpContext.Request.Host.Value);
                if (host.Contains("desa.") || host.Contains("qa.") || HttpContext.Request.Host.Value.Contains("localhost"))
                {
                    var json = await NombreConvenio(username);
                    string conveniouser = "";
                    if (json != null && json.Value.ToString() != "[]")
                    {
                        dynamic blogObject = JsonConvert.DeserializeObject<object>(json.Value.ToString());


                        if (blogObject != null)
                            conveniouser = blogObject[0].convenio;
                    }

                    enroll = new IntegracionEnroll();
                    enroll.IdUsuario = uid;
                    if (conveniouser == "CONVENIO ON DEMAND")
                    {
                        enroll.Status = "406";
                    }
                    else
                    {
                        enroll.Convenio = "MEDISMART_QA";
                        enroll.Activo = "1";
                        enroll.Status = "200";
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
                if (host.Contains("inmv."))//login viene de nueva mas vida
                {
                    enroll.Convenio = "INMV";
                }
                else if (host.Contains("doctoronline."))//login viene de colmena
                {
                    enroll.Convenio = "COLMENA";
                }
                else if (host.Contains("unabactiva.") || host.Contains("activa.unab."))//login viene de colmena
                {
                    enroll.Convenio = "UNABACTIVA";
                }
                else if (host.Contains("uoh."))//login viene de colmena
                {
                    enroll.Convenio = "COD_UOH";
                }
                else if (host.Contains("saludproteccion."))//login viene de colmena
                {
                    enroll.Convenio = "COPEUCH";
                }
                else if (host.Contains("claro."))//login viene de claro
                {
                    enroll.Convenio = "CLARO";//claro
                }
                else if (host.Contains("clinicamundoscotia."))//login viene de scotiabank
                {
                    enroll.Convenio = "CARDIF-SCOTIABANK";//scotiabank
                }
                else if (host.Contains("prevenciononcologica."))//login viene de scotiabank
                {
                    enroll.Convenio = "CAJALOSANDES";//scotiabank
                }
                else if (host.Contains("rappi."))//login viene de SALUD_MEXICOy
                {
                    enroll.Convenio = "RAPPI";//SALUD_MEXICO
                }
                else if (host.Contains("aecsa."))//AECSA COLOMBIA
                {
                    enroll.Convenio = "AECSA";
                }
                else if (host.Contains("afc."))//AECSA COLOMBIA
                {
                    enroll.Convenio = "AFC";
                }
                else if (host.Contains("micuidado."))//AECSA COLOMBIA
                {
                    enroll.Convenio = "SCOTIABANK";

                }
                else if (host.Contains("nestle."))//AECSA COLOMBIA
                {
                    enroll.Convenio = "NESTLE";
                }
                else if (host.Contains("gallagher."))// Gallagher
                {
                    enroll.Convenio = "GALLAGHER";
                }
                else if (host.Contains("oaxacasalud."))// OAXACASALUD
                {
                    enroll.Convenio = "OAXACASALUD";
                }
                else if (host.Contains("daviplata."))// Daviplata
                {
                    enroll.Convenio = "DAVIPLATA";
                }
                else if (host.Contains("bonnahealth."))// Daviplata
                {
                    enroll.Convenio = "BONNAHEALTH";
                }
                else if (host.Contains("americadigital."))// Daviplata
                {
                    enroll.Convenio = "AMERICADIGITAL";
                }
                else if (host.Contains("ajg.medismart."))// Daviplata
                {
                    enroll.Convenio = "AJG";
                }
                else if (host.Contains("bicevida."))// Bicevida
                {
                    enroll.Convenio = "BICEVIDA";
                }
                else if (host.Contains("bicevidapersonas."))// BiceVidaPersonas
                {
                    enroll.Convenio = "BICEVIDAPERSONAS";
                }
                else if (host.Contains("fletcher."))//AECSA COLOMBIA
                {
                    enroll.Convenio = "FLETCHER";
                }
                else if (host.Contains("camanchaca."))// Daviplata
                {
                    enroll.Convenio = "CAMANCHACA";
                }
                else if (host.Contains("vidasecurity."))// Daviplata
                {
                    enroll.Convenio = "VIDASECURITY";
                }
                else if (host.Contains("cns."))// Daviplata
                {
                    enroll.Convenio = "CONSORCIO";
                }
                else if (host.Contains("zurich."))// Daviplata
                {
                    enroll.Convenio = "ZURICH";
                }
                else if (host.Contains("achs."))
                {
                    enroll.Convenio = "ACHS";
                }
                else if (host.Contains("aquachile."))
                {
                    enroll.Convenio = "AQUACHILE";
                }
                else if (host.Contains("grupodefensa."))
                {
                    enroll.Convenio = "GRUPODEFENSA";
                }
                else if (host.Contains("bancounion."))
                {
                    enroll.Convenio = "BANCOUNION";
                }
                else if (host.Contains("simpleemx."))
                {
                    enroll.Convenio = "SIMPLEE-MX";
                }
                else if (host.Contains("simpleecl."))
                {
                    enroll.Convenio = "SIMPLEE-CL";
                }
                else if (host.Contains("mx.medical"))//login viene de SALUD_MEXICOy
                {
                    enroll.Convenio = "SALUD_MEXICO";//SALUD_MEXICO
                }
                else if (!host.Contains("medical.") && (host != null || host != "")) // VALIDA SI POR EL HOSTTEST EXISTE IDCLIENTE
                {
                    enroll.Convenio = Global.IdentificadorConvenio;
                }

                if (enroll.Convenio == "VIDACAMARA")
                {
                    jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                    var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                    using (var httpClient = new HttpClient())
                    {
                        using (var responseEmpresa = await httpClient.PostAsync(_config["Servicesurl"] + $"/usuarios/integracionEnroll/personaConvenio", httpContentEnroll))
                        {
                            apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                        }
                    }
                }
                else
                {
                    jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                    var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                    using (var httpClient = new HttpClient())
                    {
                        using (var responseEmpresa = await httpClient.PostAsync(_config["Servicesurl"] + $"/usuarios/integracionEnroll/personaConvenio", httpContentEnroll))
                        {

                            apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                            empresaConfig = JsonConvert.DeserializeObject<EmpresaConfig>(apiResponseEmpresa);
                            empresa = JsonConvert.SerializeObject(empresaConfig);
                        }
                    }
                }

                return Json(apiResponseEmpresa);
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                Console.WriteLine(ex);
                return Json(new { msg = "Inactivo" });
            }
        }

        //Usuario empresa, nueva rutina reemplaza a enroll v1
        private async Task<List<EmpresaConfig>> UsersClientLogin(string username, string domain)
        {
            IntegracionEnroll enroll = new IntegracionEnroll();
            List<EmpresaConfig> empresaConfig = null;
            try
            {

                var host = GetHostValue(HttpContext.Request.Host.Value);

                var jsonStringEnroll = "";
                string apiResponseEmpresa = "";
                string empresa = "";

                enroll.Host = domain;
                enroll.Username = username;
                jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                using (var httpClient = new HttpClient())
                {
                    using (var responseEmpresa = await httpClient.PostAsync(_config["Servicesurl"] + $"/usuarios/configurationUsersClient/UserClient", httpContentEnroll))
                    {

                        apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                        empresaConfig = JsonConvert.DeserializeObject<List<EmpresaConfig>>(apiResponseEmpresa);
                        empresa = JsonConvert.SerializeObject(empresaConfig);
                    }
                }


                return empresaConfig;
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                Console.WriteLine(ex);
                return empresaConfig;
            }
        }

        private async Task<List<EmpresaConfig>> MultiEmpresa(string username)
        {
            IntegracionEnroll enroll = new IntegracionEnroll();
            List<EmpresaConfig> empresaConfig = null;
            try
            {

                var host = GetHostValue(HttpContext.Request.Host.Value);

                var jsonStringEnroll = "";
                string apiResponseEmpresa = "";
                string empresa = "";
                enroll.Username = username;
                jsonStringEnroll = JsonConvert.SerializeObject(enroll);
                var httpContentEnroll = new StringContent(jsonStringEnroll, Encoding.UTF8, "application/json");
                using (var httpClient = new HttpClient())
                {
                    using (var responseEmpresa = await httpClient.PostAsync(_config["Servicesurl"] + $"/usuarios/configurationUsersClient/getMultiEmpresa", httpContentEnroll))
                    {

                        apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                        empresaConfig = JsonConvert.DeserializeObject<List<EmpresaConfig>>(apiResponseEmpresa);
                        empresa = JsonConvert.SerializeObject(empresaConfig);
                    }
                }


                return empresaConfig;
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                Console.WriteLine(ex);
                return empresaConfig;
            }
        }
        [HttpPost]
        public async Task<IActionResult> ResetPassword(LoginViewModel model)
        {

            using var httpClient = new HttpClient();
            var host = GetHostValue(HttpContext.Request.Host.Value);
            var jsonString = JsonConvert.SerializeObject(model);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            using var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/usuarios/users/resetPassword?baseUrl={host}", httpContent);
            string apiResponse = await response.Content.ReadAsStringAsync();
            return new JsonResult(apiResponse);
        }
        private async Task<JsonResult> NombreConvenio(string username)
        {

            using var httpClient = new HttpClient();
            using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/findUsernameConvenioNewUsers?username={username}");
            string apiResponse = await response.Content.ReadAsStringAsync();
            return new JsonResult(apiResponse);

        }

        public IActionResult PageReset()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> PageResetAsync(LoginViewModel model, string baseUrl)
        {
            using var httpClient = new HttpClient();
            var host = GetHostValue(HttpContext.Request.Host.Value);
            model.ReturnUrl = await GetUrlAsync(model.rol);
            var jsonString = JsonConvert.SerializeObject(model);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            using var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/usuarios/users/restablecerClave?baseUrl={host}", httpContent);
            string apiResponse = await response.Content.ReadAsStringAsync();
            return new JsonResult(apiResponse);
        }

        [HttpPost]
        public async Task<IActionResult> AuthMFA(LoginViewModel model, string baseUrl)
        {
            using var httpClient = new HttpClient();
            var host = GetHostValue(HttpContext.Request.Host.Value);
            model.ReturnUrl = await GetUrlAsync(model.rol);
            var jsonString = JsonConvert.SerializeObject(model);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            using var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/usuarios/users/sendCodeLoginCO?baseUrl={host}", httpContent);
            string apiResponse = await response.Content.ReadAsStringAsync();
            return new JsonResult(apiResponse);
        }

        private async Task<bool> ValidateLoginCode(string username, string codigo)
        {
            using var httpClient = new HttpClient();
            var jsonString = JsonConvert.SerializeObject("");
            using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/validarCodigoLogin?username={username}&codigo={codigo}");
            var apiResponse = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = JsonConvert.DeserializeObject<dynamic>(apiResponse);
                var status = jsonResponse.status;

                return status == "OK";
            }

            return false;
        }

        [HttpPost]
        public async Task<IActionResult> PageResetInvitadoAsync(LoginViewModel model, string baseUrl)
        {
            using var httpClient = new HttpClient();
            var host = GetHostValue(HttpContext.Request.Host.Value);
            model.ReturnUrl = await GetUrlAsync(model.rol);
            var jsonString = JsonConvert.SerializeObject(model);
            var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
            using var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/usuarios/users/restablecerClaveInvitado?baseUrl={host}", httpContent);
            string apiResponse = await response.Content.ReadAsStringAsync();
            return new JsonResult(apiResponse);
        }

        [HttpPost]
        public async Task<IActionResult> codigoPromocional(string codigo, string idCliente = "0")
        {
            var host = GetHostValue(HttpContext.Request.Host.Value);

            //OBTENER LA ID DE EMPRESA EN LA TABLA EMPRESAGLOBAL SEGUN EL HOST
            using var httpClient = new HttpClient();
            using var responseEmpresa = await httpClient.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getIdEmpresaByHost?host={host}");
            string idEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
            idCliente = idEmpresa;

            //var codigo = codigo;
            using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/validarCodigo?codigoPromocion={codigo}&idEmpresa={idEmpresa}");
            string apiResponse = await response.Content.ReadAsStringAsync();

            return new JsonResult(apiResponse);


        }

        private async Task<UsersViewIdModel> getUserDatosByUserName(string username)
        {

            UsersViewIdModel userdata = null;
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/getUserByUserName?username={username}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<UsersViewIdModel>(apiResponse);
                }
            }

            return userdata;
        }

        private async Task<PersonasViewModel> getPersonaEmpresaByUserId(int userid)
        {

            PersonasViewModel persondata = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getDatosPacienteEmpresa/{userid}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    persondata = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                }
            }

            return persondata;
        }

        private async Task<string> GetClaroPersonaEmpresa(string rut)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getClaroPersonaEmpresa/{rut}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }

        private async Task<string> GetUnabPersonaEmpresa(string rut, int idEmpresa)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getUnabPersonaEmpresa/{rut}/{idEmpresa}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }
            return apiResponse;
        }

        private async Task<string> GetCliniPersonaEmpresa(string rut)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getCliniPersonaEmpresa/{rut}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }

        private async Task<string> GetConvenio(string rut)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getConvenio/{rut}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }
        private async Task<string> GetConvenioUnab(string rut)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getConvenioUnab/{rut}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }
        private async Task<string> GetConvenioClini(string rut)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getConvenioClini/{rut}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }

        private async Task<string> ActivarEstadoPersonaQuemarCode(int userid, string codigo)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/getActivarEstadoPersona/{userid}/{codigo}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }

        public async Task<string> codigoPromocionalChequear(string codigo, string idEmpresa)
        {
            using var httpClient = new HttpClient();
            using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/validarCodigo?codigoPromocion={codigo}&idEmpresa={idEmpresa}");
            string apiResponse = await response.Content.ReadAsStringAsync();

            return apiResponse;


        }

        public async Task<string> ResetPasswordClaro(int userId)
        {
            using var httpClient = new HttpClient();
            using var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/users/resetPasswordSistema/{userId}");
            string apiResponse = await response.Content.ReadAsStringAsync();

            return apiResponse;
        }

        public async Task<IActionResult> NuevoBeneficiarioCodigo(string nombre, string apellido, string rut, string correo, string codigo)
        {
            //OBTENER LA ID DE EMPRESA EN LA TABLA EMPRESAGLOBAL SEGUN EL HOST
            var host = GetHostValue(HttpContext.Request.Host.Value);
            using var httpClientRequest = new HttpClient();
            using var responseEmpresa = await httpClientRequest.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getIdEmpresaByHost?host={host}");
            string idEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
            var codigoValid = await codigoPromocionalChequear(codigo, idEmpresa);
            if (codigoValid.ToString().Contains("code"))
            {
                var user = await getUserDatosByUserName(rut);
                if (user == null)
                {
                    Random rnd = new Random();
                    int tempID = rnd.Next(-2000000000, -1000000000);

                    var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                    ViewBag.uid = uid;

                    ViewBag.idEdit = tempID;

                    var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
                    ViewBag.idCliente = idCliente;

                    PersonasViewModel persona = new PersonasViewModel();

                    persona.Nombre = nombre;
                    persona.ApellidoPaterno = apellido;
                    persona.Identificador = rut;
                    persona.Correo = correo;
                    persona.TempID = tempID;
                    persona.Genero = "Masculino";
                    persona.CodigoTelefono = "CL";
                    persona.TelefonoMovil = "999999999";
                    persona.IdEmpresa = Convert.ToInt32(idEmpresa);// empresa claro en desarrollo
                    persona.ZonaHoraria = "-3"; // clientes claro por defecto
                    persona.FNacimiento = new DateTime(2000, 11, 11);

                    string json = JsonConvert.SerializeObject(persona);
                    using var httpClient = new HttpClient();
                    var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                    using var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/usuarios/personas/insertPersonaCodigo/{codigo}", httpContent);
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    return new JsonResult(apiResponse);
                }
                else
                {
                    var userId = user.UserId;
                    var esClaro = await GetClaroPersonaEmpresa(rut);
                    var esConvenio = await GetConvenio(rut);

                    if (esConvenio == "0" && !host.Contains("americadigital"))
                    {
                        using (var httpClient = new HttpClient())
                        {
                            using (var response2 = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/addPersonaConvenioClaro/{userId}"))
                            {
                                //true or false en string
                                string apiResponse = await response2.Content.ReadAsStringAsync();
                            }
                        }
                    }
                    // insertar personasempresa
                    if (esClaro == "0")
                    {
                        using (var httpClient = new HttpClient())
                        {
                            using (var response2 = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/addPersonaEmpresaUnab/{userId}/{idEmpresa}"))
                            {
                                //true or false en string
                                string apiResponse = await response2.Content.ReadAsStringAsync();
                            }
                        }
                    }
                    //RESETPASSWORD 6 digitos
                    var actualizado = await ResetPasswordClaro(userId);

                    // activar estado persona, esActivo es 1 o 0 dependiendo, 1 activo 0 inactivo y quemar codigo
                    var esActivo = await ActivarEstadoPersonaQuemarCode(userId, codigo);
                    if (esActivo == "0")
                    {
                        // ERROR AL ACTIVAR USUARIO
                        var json2 = new { status = "NOK", err = 2 };
                        string response2 = JsonConvert.SerializeObject(json2);
                        return new JsonResult(response2); ;
                    }

                    var json = new { status = "NOK", err = 1 };
                    string response = JsonConvert.SerializeObject(json);
                    return new JsonResult(response); ;
                }
            }
            else
            {
                var json2 = new { status = "NOK", err = 2 };
                string response2 = JsonConvert.SerializeObject(json2);
                return new JsonResult(response2); ;
            }
        }


        public async Task<IActionResult> NuevoBeneficiarioUnab(string nombre, string apellido, string rut, string correo)
        {
            //OBTENER LA ID DE EMPRESA EN LA TABLA EMPRESAGLOBAL SEGUN EL HOST
            var host = GetHostValue(HttpContext.Request.Host.Value);
            using var httpClientRequest = new HttpClient();
            using var responseEmpresa = await httpClientRequest.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getIdEmpresaByHost?host={host}");
            string idEmpresa = await responseEmpresa.Content.ReadAsStringAsync();

            var user = await getUserDatosByUserName(rut);
            if (user == null)
            {
                Random rnd = new Random();
                int tempID = rnd.Next(-2000000000, -1000000000);

                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                ViewBag.uid = uid;

                ViewBag.idEdit = tempID;

                var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
                ViewBag.idCliente = idCliente;

                PersonasViewModel persona = new PersonasViewModel();

                persona.Nombre = nombre;
                persona.ApellidoPaterno = apellido;
                persona.Identificador = rut;
                persona.Correo = correo;
                persona.TempID = tempID;
                persona.Genero = "Masculino";
                persona.CodigoTelefono = "CL";
                persona.ZonaHoraria = "-4";
                persona.TelefonoMovil = "999999999";
                persona.IdEmpresa = Convert.ToInt32(idEmpresa);// empresa unab
                persona.FNacimiento = new DateTime(2000, 11, 11);

                var service = _config["ServicesUrl"];
                string json = JsonConvert.SerializeObject(persona);
                using var httpClient = new HttpClient();
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                using var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/usuarios/personas/insertPersonaLogin", httpContent);
                string apiResponse = await response.Content.ReadAsStringAsync();
                return new JsonResult(apiResponse);
            }
            else
            {
                var userId = user.UserId;
                var esUnab = await GetUnabPersonaEmpresa(rut, Convert.ToInt32(idEmpresa));
                var esConvenio = await GetConvenioUnab(rut);

                if (esConvenio == "0")
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response2 = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/addPersonaConvenioUnab/{userId}"))
                        {
                            //true or false en string
                            string apiResponse = await response2.Content.ReadAsStringAsync();
                        }
                    }
                }

                // insertar personasempresa
                if (esUnab == "0")
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response2 = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/addPersonaEmpresaUnab/{userId}/{idEmpresa}"))
                        {
                            //true or false en string
                            string apiResponse = await response2.Content.ReadAsStringAsync();
                        }
                    }
                }
                //RESETPASSWORD 6 digitos
                var actualizado = await ResetPasswordClaro(userId);

                return new JsonResult(new { status = "OK" });
            }
        }

        public async Task<IActionResult> NuevoBeneficiarioClini(string nombre, string apellido, string apellidoM, string genero, string rut, string correo, string codigo)
        {
            //OBTENER LA ID DE EMPRESA EN LA TABLA EMPRESAGLOBAL SEGUN EL HOST
            var host = GetHostValue(HttpContext.Request.Host.Value);
            using var httpClientRequest = new HttpClient();
            using var responseEmpresa = await httpClientRequest.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getIdEmpresaByHost?host={host}");
            string idEmpresa = await responseEmpresa.Content.ReadAsStringAsync();

            var user = await getUserDatosByUserName(rut);

            if (user == null)
            {
                Random rnd = new Random();
                int tempID = rnd.Next(-2000000000, -1000000000);

                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                ViewBag.uid = uid;

                ViewBag.idEdit = tempID;

                var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid); // idCliente
                ViewBag.idCliente = idCliente;

                PersonasViewModel persona = new PersonasViewModel();

                persona.Nombre = nombre;
                persona.ApellidoPaterno = apellido;
                persona.ApellidoMaterno = apellidoM;
                persona.Identificador = rut;
                persona.Correo = correo;
                persona.TempID = tempID;
                persona.Genero = genero;
                persona.CodigoTelefono = "CL";
                persona.TelefonoMovil = "999999999";
                persona.IdEmpresa = Convert.ToInt32(idEmpresa);
                persona.ZonaHoraria = "-3";
                persona.FNacimiento = new DateTime(2000, 11, 11);

                string json = JsonConvert.SerializeObject(persona);
                using var httpClient = new HttpClient();
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                using var response = await httpClient.PutAsync(_config["ServicesUrl"] + $"/usuarios/personas/insertPersona", httpContent);
                string apiResponse = await response.Content.ReadAsStringAsync();
                return new JsonResult(apiResponse);
            }
            else
            {
                var userId = user.UserId;
                var esClini = await GetCliniPersonaEmpresa(rut);
                var esConvenio = await GetConvenioClini(rut);

                if (esConvenio == "[]" && !host.Contains("americadigital"))
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response2 = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/addPersonaConvenioClini/{userId}/{idEmpresa}"))
                        {
                            //true or false en string
                            string apiResponse = await response2.Content.ReadAsStringAsync();
                        }
                    }
                }
                // insertar personasempresa
                if (esClini == "0")
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response2 = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/addPersonaEmpresaClini/{userId}/{idEmpresa}"))
                        {
                            //true or false en string
                            string apiResponse = await response2.Content.ReadAsStringAsync();
                        }
                    }
                }
                //RESETPASSWORD 6 digitos
                var actualizado = await ResetPasswordClaro(userId);

                var json = new { status = "NOK", err = 1 };
                string response = JsonConvert.SerializeObject(json);
                return new JsonResult(response); ;
            }

        }


        public async Task<IActionResult> CreateUserPrueba(string nombre, string apellido, string apellidoM, string genero, string rut, string correo, string direccion, string codigo )
        {
            //OBTENER LA ID DE EMPRESA EN LA TABLA EMPRESAGLOBAL SEGUN EL HOST
            var host = GetHostValue(HttpContext.Request.Host.Value);
            using var httpClientRequest = new HttpClient();
            using var responseEmpresa = await httpClientRequest.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getIdEmpresaByHost?host={host}");
            string idEmpresa = await responseEmpresa.Content.ReadAsStringAsync();


            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

            CreatePersonaEmpresa persona = new CreatePersonaEmpresa();

            persona.Nombre = nombre;
            persona.ApellidoPaterno = apellido;
            persona.ApellidoMaterno = apellidoM;
            persona.Identificador = rut;
            persona.Correo = correo;
            persona.Genero = genero;
            persona.TelefonoMovil = "999999999";
            persona.IdEmpresa = Convert.ToInt32(idEmpresa);
            persona.ZonaHoraria = "-3";
            persona.Direccion = direccion;
            string json = JsonConvert.SerializeObject(persona);
            using var httpClient = new HttpClient();
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/users/createPersonaEmpresa", httpContent);
            string apiResponse = await response.Content.ReadAsStringAsync();
            return new JsonResult(apiResponse);


        }

        public async Task<IActionResult> CreateUserDidi(string nombre, string apellido, string apellidoM, string genero, string rut, string correo, string codigo)
        {
            // OBTENER LAS IDS DE EMPRESA EN LA TABLA EMPRESAGLOBAL SEGÚN EL HOST
            var host = GetHostValue(HttpContext.Request.Host.Value);
            using var httpClientRequest = new HttpClient();
            using var responseEmpresas = await httpClientRequest.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getIdEmpresasByHost?host={host}");
            var responseContent = await responseEmpresas.Content.ReadAsStringAsync();
            var idEmpresas = JsonConvert.DeserializeObject<List<int>>(responseContent);

            // Utilizar las IDs de empresa
            foreach (int idEmpresa in idEmpresas)
            {
                await CreatePersonaEnEmpresa(nombre, apellido, apellidoM, genero, rut, correo, idEmpresa);
            }

            var result = new
            {
                success = true,
                message = "Usuario creado exitosamente."
            };

            return Ok(result);
        }

        private async Task CreatePersonaEnEmpresa(string nombre, string apellido, string apellidoM, string genero, string rut, string correo, int idEmpresa)
        {
            Random rnd = new Random();
            int tempID = rnd.Next(-2000000000, -1000000000);

            CreatePersonaEmpresa persona = new CreatePersonaEmpresa();

            persona.Nombre = nombre;
            persona.ApellidoPaterno = apellido;
            persona.ApellidoMaterno = apellidoM;
            persona.Identificador = rut;
            persona.Correo = correo;
            persona.Genero = genero;
            persona.TelefonoMovil = "999999999";
            persona.IdEmpresa = idEmpresa;
            persona.ZonaHoraria = "-3";

            string json = JsonConvert.SerializeObject(persona);
            using var httpClient = new HttpClient();
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
            using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/usuarios/users/createPersonaEmpresa", httpContent);
            string apiResponse = await response.Content.ReadAsStringAsync();
        }

        public IActionResult AccessDenied(string returnUrl = null)
        {
            LogUso(5, 12, -1, -1, "AccessDenied/returnUrl=" + returnUrl);
            return View();
        }


        public async Task<IActionResult> Logout(string rol = null)
        {
            var host = GetHostValue(HttpContext.Request.Host.Value);
            await HttpContext.SignOutAsync($"{rol}Schemes");
            if (host.Contains("zurich."))
            {
                return Redirect("https://mundozurich.cl/");
            }
            if (host.Contains("happ."))
            {
                return Redirect("https://app.happlabs.cl/");
            }
            if (host.Contains("metlife.medismart.live"))
            { 
                return Redirect("https://portalclientes.metlife.co");
            }
            if (host.Contains("miahealth."))
            {
                return Redirect("http://healthempresas.mawdy.cl/");
            }
            return Redirect(await GetUrlAsync(rol));
        }

        public async Task<IActionResult> LogoutExterno(string rol = null)
        {
            //se deja así porque consalud no envia el idCliente, y layoutExterno se deja en DURO salir a consalud.
            await HttpContext.SignOutAsync($"{rol}Schemes");
            var log = new LogPacienteViaje();
            var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            log.Evento = "Paciente abandona sesión";
            log.IdPaciente = Convert.ToInt32(uid);
            await GrabarLog(log);
            var url = "https://clientes.consalud.cl/clickdoctor";
            return Redirect(url);
        }

        private async Task<string> GetUrlAsync(string rol)
        {
            string name = "";
            if (TempData["ValorUrl"] != null)
                name = TempData["ValorUrl"].ToString();

            var url = "";
            if (rol == Roles.Medico && name == "LoginUohMed")
            {
                url = "loginuohmed";
            }
            else if (rol == Roles.Medico && name == "LoginUnabMed")
            {
                url = "loginunabmed";
            }
            else if (rol == Roles.Medico)
            {
                url = "login";
            }
            else if (rol == Roles.Administrador)
            {
                url = "loginAdmin";
            }
            else if (rol == Roles.AdministradorTeleperitaje)
            {
                url = "loginAdminTeleperitaje";
            }
            else if (rol == Roles.Contralor)
            {
                url = "loginContralor";
            }
            else if (rol == Roles.Paciente)
            {
                var log = new LogPacienteViaje();
                var uid = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                log.Evento = "Paciente abandona sesión";
                log.IdPaciente = Convert.ToInt32(uid);
                await GrabarLog(log);

                url = "loginPaciente";
                var idCliente = HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid);
                var clienteAchs = _config["CLIENTE-ACHS"];

                if (idCliente == clienteAchs)
                {
                    return "https://www.achs.cl/";
                }

                switch (idCliente)
                {
                    case "1":
                        url = "https://clientes.consalud.cl/clickdoctor";
                        break;
                    case "148":
                        url = "loginColmena";
                        break;
                    case "108":
                        url = "loginCoopeuch";
                        break;
                    case "163":
                        url = "loginVidaCamara";
                        break;
                    case "204":
                        url = "loginClaro";
                        break;
                    default: break;
                }

            }

            return url;
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
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
            }
        }
        private async Task<EmpresaCentroClinico> UsuarioConvenioEmpresa(int UserId)
        {

            EmpresaCentroClinico userdata = null;

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/EmpresaCentroClinico/getEmpresaCentroClinico?UserId={UserId}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    userdata = JsonConvert.DeserializeObject<EmpresaCentroClinico>(apiResponse);
                }
            }

            return userdata;
        }

        private async Task<JsonResult> GetUsuarioEmpresa(int idCliente)
        {

            EmpresaConfig empresaConfig = null;
            string returnValue = "";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/Empresa/getUsuarioEmpresa/{idCliente}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    empresaConfig = JsonConvert.DeserializeObject<EmpresaConfig>(apiResponse);
                    returnValue = JsonConvert.SerializeObject(empresaConfig);
                }
            }

            return Json(returnValue);
        }

        public async Task<IActionResult> LoginExternoFirebase([FromBody] FirebaseAuthModel input)
        {

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(input.Token) as JwtSecurityToken;
                var host = GetHostValue(HttpContext.Request.Host.Value);

                if (jsonToken != null)
                {
                    var userMail = jsonToken.Claims.First(x => x.Type == "email")?.Value;
                    var uidFirebase = input.Uid;
                    var name = input.Nombre;
                    string phoneNumber = null;
                    var photoURL = input.Foto;
                    var emailVerified = input.Verificado;
                    var signInMethod = input.MetodoSignIn;
                    string returnUrl = "/";

                    var log = new LogPlataformaExterna();
                    try
                    {

                        log.DataEncriptada = null;
                        var atencionDirecta = true;

                        var canal = "";
                        var accion = "";
                        var idCliente = "0";

                        using var h = new HttpClient();
                        using var responseEmpresa = await h.GetAsync(_config["ServicesUrl"] + $"/agendamientos/parametro/getIdEmpresaByHost?host={host}");

                        idCliente = responseEmpresa.Content.ReadAsStringAsync().Result;

                        try
                        {

                            log.IdSesionPlataformaExterna = "";
                            log.JSON = "";

                            log.IdCliente = idCliente;

                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                        var servicesUrl = _config["ServicesUrl"];
                        var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = name;
                        titular.Identificador = uidFirebase;
                        titular.ApellidoPaterno = "x";
                        titular.ApellidoMaterno = "";
                        titular.Genero = "";
                        titular.FechaNacimiento = "";
                        titular.Telefono = phoneNumber;
                        titular.Correo = userMail;
                        titular.CodConvenio = "";
                        titular.IdCliente = Convert.ToInt32(idCliente);
                        titular.AtencionDirecta = false;
                        titular.CodigoTelefono = "CL";


                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload =
                            await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user-firebase", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1)
                        {
                            var auth = NewToken((response.result.user.username != titular.Identificador) ? response.result.user.username : titular.Identificador);
                            var userdata = new PersonasViewModel();
                            var UserId = response.result.user.userId;
                            using (var httpClientxy = new HttpClient())
                            {
                                httpClientxy.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                                using (var responseUploadPersona = await httpClientxy.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{UserId}"))
                                {
                                    string apiResponse = await responseUploadPersona.Content.ReadAsStringAsync();
                                    userdata = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                                }
                            }

                            atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                            Console.Write(response);
                            ViewData["ReturnUrl"] = null;
                            var uidTemp = response.result.user
                                .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                            var claims = new List<Claim>
                                {
                                    (userdata.Telefono != null) ? new Claim(ClaimTypes.Name, userdata.Identificador):
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uidTemp.ToString()),
                                    new Claim(ClaimTypes.Sid, ""),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, auth)


                                };

                            var userFirebase = new FirebaseAuthModel();
                            userFirebase.Uid = uidFirebase;
                            userFirebase.Nombre = name;
                            userFirebase.Correo = userMail;
                            userFirebase.Celular = phoneNumber;
                            userFirebase.Foto = photoURL;
                            userFirebase.Verificado = emailVerified;
                            userFirebase.MetodoSignIn = signInMethod;
                            userFirebase.FechaCreacion = DateTime.Now;
                            userFirebase.IdCliente = Convert.ToInt32(idCliente);

                            var jsonStringx = JsonConvert.SerializeObject(userFirebase);

                            var httpContentx = new StringContent(jsonStringx, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseFirebase =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user-firebase-signIn", httpContentx);
                            responseUpload.EnsureSuccessStatusCode();
                            var respFirebase = await responseUpload.Content.ReadAsStringAsync();
                            var respuesta = JsonConvert.DeserializeObject<ResultServiceNewUser>(respFirebase);


                            if (Convert.ToInt32(respuesta.result.user.userId) > 0)
                            {

                                List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                                listaConfig = await UsersClientLogin(respuesta.result.user.username, host);

                                claims.Add(new Claim("Empresa", JsonConvert.SerializeObject(listaConfig[0])));

                            }


                            await HttpContext.SignInAsync($"PacienteSchemes",
                                            new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                            new AuthenticationProperties
                                            {
                                                IsPersistent = true,
                                                ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                            });

                            if (log != null)
                            {
                                var isNewUser = userdata.Telefono == null;
                                if (isNewUser == false)
                                {

                                }
                                var isUserFirebase = response.result.user.usernameFirebase != null;
                                TempData["isNewUserFirebase"] = isUserFirebase;
                                TempData["isNewUser"] = isNewUser;
                                TempData["uidFirebase"] = uidFirebase;
                                TempData["userMail"] = userMail;
                                TempData["name"] = name;
                                Response.Cookies.Append("cookieNewUserFirebase", isUserFirebase.ToString());
                                Response.Cookies.Append("cookieNewUser", isNewUser.ToString());
                                Response.Cookies.Append("cookieUidFirebase", uidFirebase);
                                Response.Cookies.Append("cookieUserMail", userMail);
                                Response.Cookies.Append("cookieName", name);
                                return Json(new { returnUrl, response.result.user.userId, isUserFirebase, isNewUser });
                            }

                        }

                        return Json(new { msg = "error" });
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        log.Error = "Error data recibida";

                        var jsonStringLog = JsonConvert.SerializeObject(log);
                        var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                        using (var httpClientLog = new HttpClient())
                        {
                            using (var responseLog = await httpClientLog.PostAsync(
                                _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                            {
                                var respService = await responseLog.Content.ReadAsStringAsync();
                                var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                            }
                        }

                        var msg = e.ToString();
                        var cadena = "";
                        using var httpClient = new HttpClient();
                        var jsonString = JsonConvert.SerializeObject("");
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                        using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                        return Redirect("../Error");
                    }
                }
                return Redirect("/");
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return Redirect("../Error");
            }

        }

        public async Task<IActionResult> LoginExternoFacebook([FromBody] FirebaseAuthModel input)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(input.Token) as JwtSecurityToken;

                if (jsonToken != null)
                {
                    var userMail = jsonToken.Claims.First(x => x.Type == "email")?.Value;
                    var uidFirebase = input.Uid;
                    var name = input.Nombre;
                    string phoneNumber = null;
                    var photoURL = input.Foto;
                    var emailVerified = input.Verificado;
                    var signInMethod = input.MetodoSignIn;
                    string returnUrl = "/";

                    var log = new LogPlataformaExterna();
                    try
                    {

                        log.DataEncriptada = null;
                        var atencionDirecta = true;

                        var canal = "";
                        var accion = "";
                        var idCliente = "0";

                        try
                        {

                            log.IdSesionPlataformaExterna = "";
                            log.JSON = "";

                            log.IdCliente = idCliente;

                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e);
                        }
                        var servicesUrl = _config["ServicesUrl"];
                        var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                        var titular = new IntegracionCreaPersona();

                        titular.Nombre = name;
                        titular.Identificador = uidFirebase;
                        titular.ApellidoPaterno = "x";
                        titular.ApellidoMaterno = "";
                        titular.Genero = "";
                        titular.FechaNacimiento = "";
                        titular.Telefono = phoneNumber;
                        titular.Correo = userMail;
                        titular.CodConvenio = "";
                        titular.IdCliente = Convert.ToInt32(idCliente);
                        titular.AtencionDirecta = false;
                        titular.CodigoTelefono = "CL";


                        var jsonString = JsonConvert.SerializeObject(titular);

                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                        HttpResponseMessage responseUpload =
                            await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user-firebase", httpContent);
                        responseUpload.EnsureSuccessStatusCode();
                        var resp = await responseUpload.Content.ReadAsStringAsync();
                        var response = JsonConvert.DeserializeObject<ResultServiceNewUser>(resp);

                        if (response != null && response.status == 1)
                        {
                            var auth = NewToken((response.result.user.username != titular.Identificador) ? response.result.user.username : titular.Identificador);
                            var userdata = new PersonasViewModel();
                            var UserId = response.result.user.userId;
                            using (var httpClientxy = new HttpClient())
                            {
                                httpClientxy.DefaultRequestHeaders.Add("Authorization", $"Bearer {auth}");
                                using (var responseUploadPersona = await httpClientxy.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/personByUser/{UserId}"))
                                {
                                    string apiResponse = await responseUploadPersona.Content.ReadAsStringAsync();
                                    userdata = JsonConvert.DeserializeObject<PersonasViewModel>(apiResponse);
                                }
                            }

                            atencionDirecta = Convert.ToBoolean(response.result.user.AtencionDirecta);
                            Console.Write(response);
                            ViewData["ReturnUrl"] = null;
                            var uidTemp = response.result.user
                                .userId; // NO APLICA SE MANEJA EN DURO await ValidateLoginAsync(userName, password, rol); // Normally Identity handles sign in, but you can do it directly
                            var claims = new List<Claim>
                                {
                                    (userdata.Telefono != null) ? new Claim(ClaimTypes.Name, userdata.Identificador):
                                    new Claim(ClaimTypes.Name, titular.Identificador),
                                    new Claim(ClaimTypes.Role, "Paciente"),
                                    new Claim(ClaimTypes.NameIdentifier, uidTemp.ToString()),
                                    new Claim(ClaimTypes.Sid, ""),
                                    new Claim(ClaimTypes.PrimarySid, idCliente),
                                    new Claim(ClaimTypes.Spn, accion),
                                    new Claim(ClaimTypes.Authentication, auth)


                                };

                            var userFirebase = new FirebaseAuthModel();
                            userFirebase.Uid = uidFirebase;
                            userFirebase.Nombre = name;
                            userFirebase.Correo = userMail;
                            userFirebase.Celular = phoneNumber;
                            userFirebase.Foto = photoURL;
                            userFirebase.Verificado = emailVerified;
                            userFirebase.MetodoSignIn = signInMethod;
                            userFirebase.FechaCreacion = DateTime.Now;

                            var jsonStringx = JsonConvert.SerializeObject(userFirebase);

                            var httpContentx = new StringContent(jsonStringx, Encoding.UTF8, "application/json");

                            HttpResponseMessage responseFirebase =
                                await client.PostAsync(servicesUrl + $"/usuarios/Users/new-user-firebase-signIn", httpContentx);
                            responseUpload.EnsureSuccessStatusCode();
                            var respFirebase = await responseUpload.Content.ReadAsStringAsync();
                            var respuesta = JsonConvert.DeserializeObject<ResultServiceNewUser>(respFirebase);

                            var host = GetHostValue(HttpContext.Request.Host.Value);
                            if (Convert.ToInt32(respuesta.result.user.userId) > 0)
                            {
                                var model = await UsuarioConvenio(respuesta.result.user.username, Convert.ToInt32(respuesta.result.user.userId));
                                string empresa = ""; // model.Value.ToString();
                                if (host.Contains("vidacamara."))
                                {
                                    var retornoempresa = JsonConvert.DeserializeObject<List<EmpresaConfig>>(model.Value.ToString());
                                    empresa = JsonConvert.SerializeObject(retornoempresa.FirstOrDefault()).ToString();

                                }
                                else
                                {
                                    empresa = model.Value.ToString();

                                }
                                claims.Add(new Claim("Empresa", empresa));

                            }


                            await HttpContext.SignInAsync($"PacienteSchemes",
                                            new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                                            new AuthenticationProperties
                                            {
                                                IsPersistent = true,
                                                ExpiresUtc = DateTime.UtcNow.AddDays(1)

                                            });

                            if (log != null)
                            {
                                var isNewUser = userdata.Telefono == null;
                                if (isNewUser == false)
                                {

                                }
                                var isUserFirebase = response.result.user.usernameFirebase != null;
                                TempData["isNewUserFirebase"] = isUserFirebase;
                                TempData["isNewUser"] = isNewUser;
                                TempData["uidFirebase"] = uidFirebase;
                                TempData["userMail"] = userMail;
                                TempData["name"] = name;
                                Response.Cookies.Append("cookieNewUserFirebase", isUserFirebase.ToString());
                                Response.Cookies.Append("cookieNewUser", isNewUser.ToString());
                                Response.Cookies.Append("cookieUidFirebase", uidFirebase);
                                Response.Cookies.Append("cookieUserMail", userMail);
                                Response.Cookies.Append("cookieName", name);
                                return Json(new { returnUrl, response.result.user.userId, isUserFirebase, isNewUser });
                            }

                        }

                        return Json(new { msg = "error" });
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        log.Error = "Error data recibida";

                        var jsonStringLog = JsonConvert.SerializeObject(log);
                        var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                        using (var httpClientLog = new HttpClient())
                        {
                            using (var responseLog = await httpClientLog.PostAsync(
                                _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                            {
                                var respService = await responseLog.Content.ReadAsStringAsync();
                                var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                            }
                        }

                        var msg = e.ToString();
                        var cadena = "";
                        using var httpClient = new HttpClient();
                        var jsonString = JsonConvert.SerializeObject("");
                        var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                        using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                        return Redirect("../Error");
                    }
                }
                return Redirect("/");
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
                return Redirect("../Error");
            }

        }

        /*public List<XMLStringResource> GetXmlData(string xmlpath)
        {
            List<XMLStringResource> obList = new List<XMLStringResource>();
            XmlDocument doc = new XmlDocument();
            doc.Load(xmlpath);

            XmlNodeList elemList = doc.GetElementsByTagName("Login");
            XMLStringResource _obj = null;

            foreach (XmlNode chldNode in elemList)
            {
                _obj = new XMLStringResource();
                _obj.title = chldNode.SelectSingleNode("title").InnerText;
                _obj.shortinfo = chldNode.Attributes["String"].Value;

                obList.Add(_obj);
            }

            return obList;
        }*/

        [HttpPost]
        public async Task<IActionResult> Guest(string rol, string JsonData = null, string returnUrl = null)
        {
            //string userName = Encriptar(_config["USUARIO-INVITADO"]);
            //string password = Encriptar("HinBra1984");
            string userName = Desencriptar(_config["USUARIO-INVITADO"]);
            string password = Desencriptar(_config["USUARIO-PASSWORD"]);
            //string password = Desencriptar("/ykEaPkmDwI=");
            ViewData["ReturnUrl"] = returnUrl;
            var codigoTelefono = "CL";
            var horaInt = -3;
            var accion = "Plataforma";
            var idCliente = "0";

            SimpleUserModel uid = null;
            try
            {
                uid = await ValidateLoginAsync(userName.Contains("@") ? userName : userName.Replace(".", ""), password, rol);
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                return Json(new { returnUrl, msg = "error" });
            }
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
                List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

                if (!host.Contains("medical.") && (host != null || host != "") && Roles.Medico != rol)// VALIDA SI POR EL HOSTTEST EXISTE IDCLIENTE
                {
                    try
                    {
                        empresaGlobal = await ValidUsersCliente(host);
                        if (empresaGlobal != null)
                        {
                            bool resp = false;
                            foreach (var global in empresaGlobal)
                            {
                                resp = await ValidarInvitadoCliente(global.IdEmpresa);
                                if (resp)
                                {
                                    idCliente = global.IdEmpresa.ToString();
                                    accion = global.Accion;
                                    Global.IdentificadorConvenio = global.Accion;
                                    break;
                                }
                            }
                            if (!resp)
                            {

                                return Json(new { returnUrl, msg = "Inactivo" });
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        SentrySdk.CaptureException(ex);
                        return Json(new { returnUrl, msg = "Inactivo" });
                    }

                }
                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                claims.Add(new Claim(ClaimTypes.Spn, accion));



                if (Convert.ToInt32(uid.UserId) > 0 && rol == "PacienteInvitado")
                {
                    string empresa = "";
                    var model = await UsuarioConvenio(userName, Convert.ToInt32(uid.UserId));
                    if (host.Contains("vidacamara."))
                    {
                        var retornoempresa = JsonConvert.DeserializeObject<List<EmpresaConfig>>(model.Value.ToString());
                        empresa = JsonConvert.SerializeObject(retornoempresa.FirstOrDefault()).ToString();

                    }
                    else
                    {
                        empresa = model.Value.ToString();

                    }
                    claims.Add(new Claim("Empresa", empresa));

                }


                await HttpContext.SignInAsync($"{rol}Schemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });

                if (rol == Roles.PacienteInvitado)
                {
                    var log = new LogPacienteViaje();
                    log.Evento = "Paciente ingresó a plataforma";
                    await GrabarLog(log);


                    if (returnUrl != null && returnUrl != "/")
                        return Redirect(returnUrl);
                    else
                        return Redirect("../AgendarInvitado?tipo=medicina");
                }
                else if (rol == Roles.Administrador)
                {
                    returnUrl = "/Admin/Index";
                }
                else if (rol == Roles.Contralor)
                {
                    returnUrl = "/Contralor";
                }
                else if (rol == Roles.Medico)
                {
                    returnUrl = "/Medico/Index";
                }
                return Json(new { returnUrl });

            }
            else if (rol != Roles.PacienteInvitado)
            {
                return Json(new { returnUrl, msg = "Inactivo" });
            }

            return Json(new { returnUrl, msg = "error" });

        }

        [HttpPost]
        public async Task<JsonResult> GuestLogin(string userName, string password, string rol, string JsonData = null, string returnUrl = null, string url = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            var codigoTelefono = "CL";
            var horaInt = -4;
            var isPreHome = false;
            SimpleUserModel uid = null;
            try
            {
                uid = await ValidateLoginAsync(userName.Contains("@") ? userName : userName.Replace(".", ""), password, rol);
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                return Json(new { returnUrl, msg = "error" });
            }

            if (uid == null)
            {
                return Json(new { returnUrl, msg = "error" });
            }


            if (userName.Contains("@"))
            {
                var s = await getUserByUserid(uid.UserId);
                if (s.Username != null)
                    userName = s.Username;
            }



            var accion = "Plataforma";
            var idCliente = "0";

            // Normally Identity handles sign in, but you can do it directlyPrimarysid
            /*if (uid != null && uid.UserId != 0)
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
                List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();
                if (!host.Contains("medical.") && (host != null || host != "") && Roles.Medico != rol)// VALIDA SI POR EL HOSTTEST EXISTE IDCLIENTE
                {
                    try
                    {
                        empresaGlobal = await ValidUsersCliente(host);
                        if (empresaGlobal != null)
                        {
                            bool resp = false;
                            foreach (var global in empresaGlobal)
                            {
                                resp = await ValidarUsuarioCliente(userName, global.IdEmpresa);
                                if (resp)
                                {
                                    idCliente = global.IdEmpresa.ToString();
                                    accion = global.Accion;
                                    Global.IdentificadorConvenio = global.Accion;
                                    break;
                                }
                            }
                            if (!resp)
                            {

                                return Json(new { returnUrl, msg = "Inactivo" });
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        return Json(new { returnUrl, msg = "Inactivo" });
                    }
                }
                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                claims.Add(new Claim(ClaimTypes.Spn, accion));

                var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(uid.UserId));
                string json = JsonConvert.SerializeObject(centroClinico);
                claims.Add(new Claim(ClaimTypes.System, json));

                if (Convert.ToInt32(uid.UserId) > 0 && rol == "Paciente")
                {
                    var model = await UsuarioConvenio(userName, Convert.ToInt32(uid.UserId));
                    string empresa = ""; // model.Value.ToString();
                    if (host.Contains("vidacamara."))
                    {
                        var retornoempresa = JsonConvert.DeserializeObject<List<EmpresaConfig>>(model.Value.ToString());
                        empresa = JsonConvert.SerializeObject(retornoempresa.FirstOrDefault()).ToString();
                    }
                    else
                    {
                        empresa = model.Value.ToString();

                    }
                    claims.Add(new Claim("Empresa", empresa));
                }
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
                    if (rol == Roles.Paciente)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Paciente ingresó a plataforma";
                        log.IdPaciente = Convert.ToInt32(uid.UserId);
                        await GrabarLog(log);

                        //returnUrl = "/Paciente/Index?v=true";
                        //returnUrl = "/"; // CAMBIAR URL DE RETORNO AL AGENDAR 3
                    }
                    else if (rol == Roles.Administrador)
                    {
                        returnUrl = "/Admin/Index";
                    }
                    else if (rol == Roles.Contralor)
                    {
                        returnUrl = "/Contralor";
                    }
                    else if (rol == Roles.Medico)
                    {
                        returnUrl = "/Medico/Index";
                    }

                    //return Json(new { returnUrl });
                    return new JsonResult(new { Status = "Encontrado", User = uid.UserId });

                    //return Redirect("/");
                }
            }*/
            if (uid != null && uid.UserId != 0)
            {
                var host = GetHostValue(HttpContext.Request.Host.Value);
                /*consultar usuario solo en sitio común, debe ser igual al host de configuración, ya que existe: bo.medical., uoh.medical, 
                 * este host será configurable para que solo entre al if de medical.*/
                List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                listaConfig = await UsersClientLogin(userName, host);
                List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

                EmpresaConfig empresaConfig = new EmpresaConfig();
                if (rol == Roles.Paciente && (listaConfig == null || listaConfig.Count == 0)) // VALIDA QUE EXISTE EN ALGUNA EMPRESA
                    return Json(new { returnUrl, msg = "Inactivo" });
                if (rol == Roles.Paciente && !listaConfig[0].Existe) //VALIDA QUE EXISTA EN LA EMPRESA QUE SE ESTÁ LOGGEANDO
                    return Json(new { returnUrl, msg = "Inactivo" });

                if (host.Contains("doctoronline.")) //login viene de colmena
                {
                    //Validar edad 
                    accion = "COLMENA";
                    var jsonString = JsonConvert.SerializeObject(userName);

                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/personas/getEdadBeneficiario?rutBeneficiario={userName}"))
                        {
                            var apiResponse = await response.Content.ReadAsStringAsync();
                            int result = JsonConvert.DeserializeObject<int>(apiResponse);

                            if (result == -1)
                            {
                                return Json(new { returnUrl, msg = "Inactivo" });
                            }
                            else if (result < 18)
                            {
                                return Json(new { returnUrl, msg = "Menor" });
                            }
                        }
                    }
                    idCliente = "148";
                }
                var idEmpresaClaims = "0";
                if (listaConfig.Count == 1 && rol == Roles.Paciente)
                {
                    try
                    {
                        empresaConfig = listaConfig[0];
                        idCliente = empresaConfig.IdCliente.ToString();
                        idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                        isPreHome = empresaConfig.PreHome;
                        if (empresaConfig.Redirecciona == true)
                        {
                            var empresaconfig = JsonConvert.SerializeObject(empresaConfig).ToString();
                            string UrlRedirect = empresaConfig.UrlPrincipal.ToString();
                            RedirectLogin loginEmpresa = new RedirectLogin();
                            loginEmpresa.UserName = userName;
                            loginEmpresa.Url = UrlRedirect;
                            loginEmpresa.UserId = uid.UserId;
                            loginEmpresa.IdCliente = empresaConfig.IdEmpresa;
                            loginEmpresa.PreHome = empresaConfig.PreHome;
                            if (HttpContext.Request.Host.Value.Contains("localhost"))
                                UrlRedirect = "localhost:44363";
                            var empresaJson = JsonConvert.SerializeObject(loginEmpresa);
                            string encry = Encrypt(empresaJson);
                            if (!UrlRedirect.Contains("http"))
                                UrlRedirect = "https://" + UrlRedirect;
                            returnUrl = UrlRedirect + "/account/RedirectLogin?u=" + encry;
                            return Json(new { returnUrl });

                        }

                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e.Message);
                    }
                    if (codigoTelefono != empresaConfig.CodTelefono)
                        codigoTelefono = empresaConfig.CodTelefono;
                }


                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userName),
                        new Claim(ClaimTypes.Role, rol),
                        new Claim(ClaimTypes.NameIdentifier, uid.UserId.ToString()),
                        new Claim(ClaimTypes.Authentication, uid.token.ToString()),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla",idEmpresaClaims.ToString())
                    };
                Global.token = uid.token.ToString();


                claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                claims.Add(new Claim(ClaimTypes.Spn, accion));

                var centroClinico = await UsuarioConvenioEmpresa(Convert.ToInt32(uid.UserId));
                string json = JsonConvert.SerializeObject(centroClinico);
                claims.Add(new Claim(ClaimTypes.System, json));

                if (Convert.ToInt32(uid.UserId) > 0 && rol == "Paciente")
                {
                    //var model = await UsuarioConvenio(userName, Convert.ToInt32(uid.UserId));
                    //string empresa = ""; // model.Value.ToString();
                    //if (host.Contains("vidacamara."))
                    //{
                    //    var retornoempresa = JsonConvert.DeserializeObject<List<EmpresaConfig>>(model.Value.ToString());
                    //    empresa = JsonConvert.SerializeObject(retornoempresa.FirstOrDefault()).ToString();
                    //    //string retornoempresa2 = JsonConvert.SerializeObject(retornoempresa).ToString();
                    //    //   claims.Add(new Claim("Listaempresa", retornoempresa2));
                    //    claims.Add(new Claim("Empresa", empresa));
                    //}
                    //else
                    //{
                    //    empresa = model.Value.ToString();

                    //}
                    string empresa = ""; // model.Value.ToString();
                    empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                    claims.Add(new Claim("Empresa", empresa));



                }


                await HttpContext.SignInAsync($"{rol}Schemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });
                //try del Log de uso de servicio
                LogUso(5, 9, Convert.ToInt32(uid.UserId), Convert.ToInt32(idCliente), "Login/userName=" + userName + "&rol=" + rol);

                if (Url.IsLocalUrl(returnUrl) && !isPreHome)
                {
                    return Json(new { returnUrl });
                    //return Redirect(returnUrl);
                }
                else
                {
                    if (rol == Roles.Paciente)
                    {
                        var log = new LogPacienteViaje();
                        log.Evento = "Paciente ingresó a plataforma";
                        log.IdPaciente = Convert.ToInt32(uid.UserId);
                        await GrabarLog(log);
                        //returnUrl = "/Paciente/Index?v=true";
                        if (listaConfig.Count > 0 && listaConfig[0].PreHome == true)
                            returnUrl = "/Paciente/PlanSalud";
                        else
                            returnUrl = host.Contains("consalud.") ? "/Paciente/ExamenesConsalud" : "/";
                    }
                    else if (rol == Roles.Administrador)
                    {
                        returnUrl = "/Admin/Index";
                    }
                    else if (rol == Roles.Contralor)
                    {
                        returnUrl = "/Contralor";
                    }
                    else if (rol == Roles.Medico)
                    {
                        returnUrl = "/Medico/Index";
                    }

                    return new JsonResult(new { Status = "Encontrado", User = uid.UserId });
                    //return Json(new { returnUrl });
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


        public static string Encriptar(string texto)
        {
            try
            {

                string key = "qualityinfosolutions"; //llave para encriptar datos

                byte[] keyArray;

                byte[] Arreglo_a_Cifrar = UTF8Encoding.UTF8.GetBytes(texto);

                //Se utilizan las clases de encriptación MD5

                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();

                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));

                hashmd5.Clear();

                //Algoritmo TripleDES
                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();

                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;

                ICryptoTransform cTransform = tdes.CreateEncryptor();

                byte[] ArrayResultado = cTransform.TransformFinalBlock(Arreglo_a_Cifrar, 0, Arreglo_a_Cifrar.Length);

                tdes.Clear();

                //se regresa el resultado en forma de una cadena
                texto = Convert.ToBase64String(ArrayResultado, 0, ArrayResultado.Length);

            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
            }
            return texto;
        }

        public async Task<EmpresaConfig> GetEmpresaConfig(int idCliente)
        {
            EmpresaConfig empresaConfig = new EmpresaConfig();
            using (var httpClient = new HttpClient())
            {
                using (var responseEmpresa = await httpClient.GetAsync(_config["Servicesurl"] + $"/usuarios/empresa/getUsuarioEmpresa/{idCliente}"))
                {

                    var apiResponseEmpresa = await responseEmpresa.Content.ReadAsStringAsync();
                    empresaConfig = JsonConvert.DeserializeObject<EmpresaConfig>(apiResponseEmpresa);
                }
            }

            return empresaConfig;
        }

        private string DesencriptarBtf(string textoCifrado)
        {
            try
            {
                string key = "k3yG7nR4t10n";

                byte[] keyArray;
                byte[] Arreglo_a_Descifrar = Convert.FromBase64String(textoCifrado);

                using (var sha256 = SHA256.Create())
                {
                    keyArray = sha256.ComputeHash(Encoding.UTF8.GetBytes(key));
                }

                using (var aes = Aes.Create())
                {
                    aes.Key = keyArray;
                    aes.Mode = CipherMode.ECB;
                    aes.Padding = PaddingMode.PKCS7;

                    using (ICryptoTransform cTransform = aes.CreateDecryptor())
                    {
                        byte[] resultadoArray = cTransform.TransformFinalBlock(Arreglo_a_Descifrar, 0, Arreglo_a_Descifrar.Length);
                        textoCifrado = Encoding.UTF8.GetString(resultadoArray);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Ha ocurrido un error al desencriptar el texto: {e.Message}");
            }
            return textoCifrado;
        }


        public static string Desencriptar(string textoEncriptado)
        {
            try
            {
                string key = "qualityinfosolutions";
                byte[] keyArray;
                byte[] Array_a_Descifrar = Convert.FromBase64String(textoEncriptado);

                //algoritmo MD5
                MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();

                keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));

                hashmd5.Clear();

                TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();

                tdes.Key = keyArray;
                tdes.Mode = CipherMode.ECB;
                tdes.Padding = PaddingMode.PKCS7;

                ICryptoTransform cTransform = tdes.CreateDecryptor();

                byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0, Array_a_Descifrar.Length);

                tdes.Clear();
                textoEncriptado = UTF8Encoding.UTF8.GetString(resultArray);

            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
            }
            return textoEncriptado;
        }

        private async Task<string> GetExistPersonaEmpresa(string rut, int idCliente)
        {
            string apiResponse = "0";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/personas/GetExistPersonaEmpresa/{rut}/{idCliente}"))
                {
                    apiResponse = await response.Content.ReadAsStringAsync();
                }
            }

            return apiResponse;
        }

        private async Task<string> GetEmpresaFusion(string rut)
        {
            string idEmpresa = "-1";

            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(_config["ServicesUrl"] + $"/usuarios/Empresa/GetEmpresaFusion/{rut}"))
                {
                    idEmpresa = await response.Content.ReadAsStringAsync();

                }
            }

            return idEmpresa;
        }

        //LOGIN EXTERNO NOT PLATFORM
        public async Task<IActionResult> signinnotplatform(string d)
        {
            var log = new LogPlataformaExterna();
            try
            {
                var valido = true;
                var codigoTelefono = "CL";
                var horaInt = string.IsNullOrEmpty(_config["ZONA-HORARIA-DEFAULT"]) ? -4 : Convert.ToInt32(_config["ZONA-HORARIA-DEFAULT"]);
                var isPreHome = false;
                log.DataEncriptada = d;
                var atencionDirecta = true;

                if (!String.IsNullOrEmpty(d))
                {

                    var cadenaJson = DecryptKey(d);
                    var usuario = JsonConvert.DeserializeObject<TelemedicinaUrlData>(cadenaJson);
                    var canal = usuario.Canal;
                    var accion = "";
                    var idCliente = usuario.IdCliente;
                    var userName = usuario.Titular.Rut;

                    //if (idCliente == "0")
                    //    idCliente = "119";
                    var servicesUrl = _config["ServicesUrl"];
                    var tiempoLoginExterno = Convert.ToInt32(_config["TiempoLinkLoginExterno"]);

                    // validamos que el timestamp no sea mayor a 5 min
                    //TODO: Habilitar para entorno productivo
                    try
                    {
                        DateTime time = UnixTimeStampToDateTime(usuario.Timestamp);

                        TimeSpan ts = DateTime.Now - time;
                        Console.WriteLine("No. of Minutes (Difference) = {0}", ts.TotalMinutes);
                        if (ts.TotalMinutes >= tiempoLoginExterno && tiempoLoginExterno != 0)
                        {
                            return Redirect("../Error");
                        }
                    }
                    catch (Exception e)
                    {
                        SentrySdk.CaptureException(e);
                        Console.WriteLine(e);
                    }

                    var titular = new IntegracionCreaPersona();

                    titular.Nombre = usuario.Titular.Nombres;

                    titular.Identificador = usuario.Titular.Rut;
                    titular.ApellidoPaterno = usuario.Titular.ApellidoPaterno;
                    titular.ApellidoMaterno = usuario.Titular.ApellidoMaterno;
                    titular.Genero = usuario.Titular.Sexo.ToString();
                    titular.FechaNacimiento = usuario.Titular.Fecha_Nacimiento;
                    titular.Telefono = usuario.Titular.Telefono;
                    titular.Correo = usuario.Titular.Email;
                    if (usuario.IdCliente == null)
                    {
                        titular.IdCliente = 0;
                    }
                    else
                    {
                        titular.IdCliente = Convert.ToInt32(usuario.IdCliente);
                    }


                    var host = GetHostValue(HttpContext.Request.Host.Value);
                    /*consultar usuario solo en sitio común, debe ser igual al host de configuración, ya que existe: bo.medical., uoh.medical, 
                     * este host será configurable para que solo entre al if de medical.*/
                    List<EmpresaConfig> listaConfig = new List<EmpresaConfig>();
                    listaConfig = await UsersClientLogin(titular.Identificador, host);
                    List<EmpresaGlobal> empresaGlobal = new List<EmpresaGlobal>();

                    EmpresaConfig empresaConfig = new EmpresaConfig();

                    var idEmpresaClaims = "0";
                    if (listaConfig.Count == 1)
                    {
                        try
                        {
                            empresaConfig = listaConfig[0];
                            idCliente = empresaConfig.IdCliente.ToString();
                            idEmpresaClaims = empresaConfig.IdEmpresa.ToString();
                            isPreHome = empresaConfig.PreHome;
                            if (host.Contains("segurossura.")) { isPreHome = true; }


                        }
                        catch (Exception e)
                        {
                            SentrySdk.CaptureException(e);
                            Console.WriteLine(e.Message);
                        }
                        if (codigoTelefono != empresaConfig.CodTelefono)
                            codigoTelefono = empresaConfig.CodTelefono;
                    }



                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, titular.Identificador),
                        new Claim(ClaimTypes.Role, "Paciente"),
                        new Claim(ClaimTypes.NameIdentifier, usuario.CD_SESSION_ID),
                        new Claim(ClaimTypes.Authentication, NewToken(userName)),
                        new Claim("CodigoTelefono", codigoTelefono),
                        new Claim("HoraInt", horaInt.ToString()),
                        new Claim("Cla", idEmpresaClaims)
                    };



                    claims.Add(new Claim(ClaimTypes.PrimarySid, idCliente));
                    claims.Add(new Claim(ClaimTypes.Spn, accion));


                    string empresa = ""; // model.Value.ToString();
                    empresa = JsonConvert.SerializeObject(empresaConfig).ToString();
                    claims.Add(new Claim("Empresa", empresa));




                    await HttpContext.SignInAsync($"PacienteSchemes",
                        new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role")),
                        new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTime.UtcNow.AddDays(1)

                        });




                    switch (usuario.Modalidad)
                    {
                        case "INP":
                            return Redirect("../Ingresar_Sala_FU/" + usuario.IdAtencion);

                        case "PE":
                            return Redirect("../Paciente/Configuracion");
                        default:
                            return Redirect("../Paciente/Agendar");
                    }

                }

                return Redirect("../Error");
            }
            catch (Exception e)
            {
                SentrySdk.CaptureException(e);
                log.Error = "Error data recibida";

                var jsonStringLog = JsonConvert.SerializeObject(log);
                var httpContentLog = new StringContent(jsonStringLog, Encoding.UTF8, "application/json");

                using (var httpClientLog = new HttpClient())
                {
                    using (var responseLog = await httpClientLog.PostAsync(
                        _config["ServicesUrl"] + "/agendamientos/Agendar/grabarLogConsalud", httpContentLog))
                    {
                        var respService = await responseLog.Content.ReadAsStringAsync();
                        var s = JsonConvert.DeserializeObject<Atenciones>(respService);
                    }
                }

                var msg = e.ToString();
                var cadena = d;
                using var httpClient = new HttpClient();
                var jsonString = JsonConvert.SerializeObject("");
                var httpContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                using var response = await httpClient.PostAsync(_config["ServicesUrl"] + $"/correos/sendEmail/sendError?error={msg}&cadena={cadena}", httpContent);

                return Redirect("../Error");
            }
        }


    }
}
